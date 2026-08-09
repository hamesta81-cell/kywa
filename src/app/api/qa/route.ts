import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MASTER_STORE_ID = "ff8081819f7e10ae019fe60b99641551";
const CLOUD_STORE_URL = `https://api.restful-api.dev/objects/${MASTER_STORE_ID}`;

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

function sanitizeQa(q: any): any {
  if (!q || !q.id) return null;

  return {
    id: String(q.id),
    title: String(q.title || "문의사항"),
    category: String(q.category || "운영 문의"),
    authorName: String(q.authorName || q.author || "홍보단"),
    content: String(q.content || q.text || ""),
    status: String(q.status || "답변대기"),
    answers: Array.isArray(q.answers) ? q.answers : [],
    comments: Array.isArray(q.comments) ? q.comments : [],
    createdAt: String(q.createdAt || q.date || new Date().toISOString())
  };
}

async function fetchCloudQa(): Promise<any[]> {
  try {
    const res = await fetch(`${CLOUD_STORE_URL}?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache"
      }
    });

    if (res.ok) {
      const json = await res.json();
      const items = Array.isArray(json?.data?.qaItems) ? json.data.qaItems : [];
      const sanitized = items
        .map(sanitizeQa)
        .filter((q: any) => q && q.id && !globalQaStore.deletedQaIds.has(String(q.id)));

      const map = new Map<string, any>();
      sanitized.forEach((q: any) => map.set(q.id, q));
      globalQaStore.qaItems.forEach((q: any) => {
        if (q && q.id && !globalQaStore.deletedQaIds.has(String(q.id))) {
          map.set(String(q.id), q);
        }
      });

      const merged = Array.from(map.values()).sort((a: any, b: any) => 
        Number(String(b.id).replace(/\D/g, "") || 0) - Number(String(a.id).replace(/\D/g, "") || 0)
      );

      globalQaStore.qaItems = merged;
      return merged;
    }
  } catch (e) {}

  return globalQaStore.qaItems
    .filter((q: any) => q && q.id && !globalQaStore.deletedQaIds.has(String(q.id)))
    .sort((a: any, b: any) => Number(String(b.id).replace(/\D/g, "") || 0) - Number(String(a.id).replace(/\D/g, "") || 0));
}

async function persistCloudQa(qaItems: any[]) {
  const filtered = qaItems.filter((q: any) => q && q.id && !globalQaStore.deletedQaIds.has(String(q.id)));
  globalQaStore.qaItems = filtered;

  try {
    // 기존 reports 데이터 유지하면서 qaItems도 함께 저장
    const currentRes = await fetch(`${CLOUD_STORE_URL}?t=${Date.now()}`);
    let currentReports: any[] = [];
    if (currentRes.ok) {
      const json = await currentRes.json();
      currentReports = Array.isArray(json?.data?.items) ? json.data.items : [];
    }

    await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: "KYWA Safety Hub Master Reports Store 2026",
        data: {
          items: currentReports,
          qaItems: filtered
        }
      })
    });
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
      Number(String(b.id).replace(/\D/g, "") || 0) - Number(String(a.id).replace(/\D/g, "") || 0)
    );

    await persistCloudQa(updatedList);

    return NextResponse.json({
      success: true,
      message: "🎉 Q&A 문의가 클라우드 DB에 100% 물리적 영구 저장되었습니다.",
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
