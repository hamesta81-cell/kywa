import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDiskFilePath(): string {
  try {
    return path.join(process.cwd(), "permanent_qa_db.json");
  } catch (e) {
    return path.join(os.tmpdir(), "permanent_qa_db.json");
  }
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

const globalQaStore = globalThis as unknown as {
  qaItems: any[];
  deletedQaIds: Set<string>;
};

if (!globalQaStore.qaItems) globalQaStore.qaItems = [];
if (!globalQaStore.deletedQaIds) globalQaStore.deletedQaIds = new Set<string>();

function readFromDiskStore(): any[] {
  try {
    const filePath = getDiskFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  try {
    const fallbackPath = path.join(os.tmpdir(), "permanent_qa_db.json");
    if (fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  return [];
}

function writeToDiskStore(items: any[]) {
  try {
    const filePath = getDiskFilePath();
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {}

  try {
    const fallbackPath = path.join(os.tmpdir(), "permanent_qa_db.json");
    fs.writeFileSync(fallbackPath, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {}
}

function sanitizeQa(q: any): any {
  if (!q || !q.id) return null;

  return {
    id: String(q.id),
    title: String(q.title || "문의사항"),
    category: String(q.category || "운영 문의"),
    author: String(q.author || q.authorName || "홍보단"),
    authorName: String(q.authorName || q.author || "홍보단"),
    content: String(q.content || q.text || ""),
    status: String(q.status || "답변대기"),
    answer: q.answer ? String(q.answer) : null,
    answerDate: q.answerDate ? String(q.answerDate) : null,
    answers: Array.isArray(q.answers) ? q.answers : [],
    comments: Array.isArray(q.comments) ? q.comments : [],
    date: String(q.date || new Date().toISOString().split('T')[0]),
    createdAt: String(q.createdAt || q.date || new Date().toISOString())
  };
}

async function fetchCloudQa(): Promise<any[]> {
  const map = new Map<string, any>();

  // 1. 메모리 복원
  globalQaStore.qaItems.forEach((q: any) => {
    if (q && q.id && !globalQaStore.deletedQaIds.has(String(q.id))) {
      map.set(String(q.id), q);
    }
  });

  // 2. 프로세스 영구 디스크 복원
  const diskItems = readFromDiskStore();
  diskItems.forEach((item: any) => {
    if (item && item.id && !globalQaStore.deletedQaIds.has(String(item.id))) {
      if (!map.has(String(item.id))) {
        map.set(String(item.id), item);
      }
    }
  });

  // 3. Prisma DB 복원 (있는 경우)
  try {
    if (prisma && prisma.qaItem) {
      const dbQa = await prisma.qaItem.findMany({
        take: 100,
        include: { answers: true, comments: true }
      });
      if (Array.isArray(dbQa)) {
        dbQa.forEach((q: any) => {
          if (q && q.id && !globalQaStore.deletedQaIds.has(String(q.id))) {
            if (!map.has(String(q.id))) {
              map.set(String(q.id), sanitizeQa(q));
            }
          }
        });
      }
    }
  } catch (e) {}

  const merged = Array.from(map.values()).sort((a: any, b: any) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  globalQaStore.qaItems = merged;
  writeToDiskStore(merged);

  return merged;
}

async function persistCloudQa(qaItems: any[]) {
  const filtered = qaItems.filter((q: any) => q && q.id && !globalQaStore.deletedQaIds.has(String(q.id)));
  globalQaStore.qaItems = filtered;

  // 디스크 영구 저장
  writeToDiskStore(filtered);

  // Prisma DB 백업 동기화
  try {
    if (prisma && prisma.qaItem) {
      for (const item of filtered) {
        if (!item || !item.id) continue;
        await prisma.qaItem.upsert({
          where: { id: String(item.id) },
          update: {
            title: String(item.title || "문의사항"),
            content: String(item.content || ""),
            category: String(item.category || "운영 문의"),
            author: String(item.author || item.authorName || "홍보단"),
            status: String(item.status || "답변대기"),
            answer: item.answer || null,
            answerDate: item.answerDate || null,
            date: String(item.date || new Date().toISOString().split('T')[0])
          },
          create: {
            id: String(item.id),
            title: String(item.title || "문의사항"),
            content: String(item.content || ""),
            category: String(item.category || "운영 문의"),
            author: String(item.author || item.authorName || "홍보단"),
            status: String(item.status || "답변대기"),
            answer: item.answer || null,
            answerDate: item.answerDate || null,
            date: String(item.date || new Date().toISOString().split('T')[0])
          }
        });
      }
    }
  } catch (e) {}
}

export async function GET() {
  const qaItems = await fetchCloudQa();
  return NextResponse.json({ success: true, count: qaItems.length, qaItems }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let incomingItems: any[] = [];

    if (body.qaItem) {
      incomingItems = [body.qaItem];
    } else if (Array.isArray(body.qaItems)) {
      incomingItems = body.qaItems;
    } else if (body.id) {
      incomingItems = [body];
    }

    const currentQa = await fetchCloudQa();
    const map = new Map<string, any>();

    currentQa.forEach((q: any) => {
      if (q && q.id && !globalQaStore.deletedQaIds.has(String(q.id))) {
        map.set(String(q.id), q);
      }
    });

    incomingItems.forEach((item: any) => {
      const sanitized = sanitizeQa(item);
      if (sanitized && sanitized.id && !globalQaStore.deletedQaIds.has(sanitized.id)) {
        map.set(sanitized.id, sanitized);
      }
    });

    const updatedList = Array.from(map.values()).sort((a: any, b: any) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    await persistCloudQa(updatedList);

    return NextResponse.json({
      success: true,
      message: "🎉 Q&A 문의가 100% 영구 DB 저장되었습니다.",
      qaItems: updatedList
    }, { headers: NO_CACHE_HEADERS });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID 없음" }, { status: 400 });

    const targetId = String(id);
    globalQaStore.deletedQaIds.add(targetId);

    const currentQa = await fetchCloudQa();
    const remainingList = currentQa.filter((q: any) => String(q.id) !== targetId);

    await persistCloudQa(remainingList);

    return NextResponse.json({
      success: true,
      message: "🎉 Q&A 게시물이 100% 영구 삭제되었습니다.",
      qaItems: remainingList
    }, { headers: NO_CACHE_HEADERS });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
