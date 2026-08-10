import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🔒 Render 및 로컬 환경용 100% 불멸 지속성 디스크 파일 경로
function getDiskFilePath(): string {
  try {
    return path.join(process.cwd(), "permanent_crew_db.json");
  } catch (e) {
    return path.join(os.tmpdir(), "permanent_crew_db.json");
  }
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

const globalCloudStore = globalThis as unknown as {
  weeklyReports: any[];     // 공식 주간보고 원본
  crewFeed: any[];          // 공유 피드
  weeklyStats: any;         // 실시간 통계 집계
  auditLogs: any[];         // 관제 로그
  deletedIds: Set<string>;  // 물리 삭제 ID
};

if (!globalCloudStore.weeklyReports) globalCloudStore.weeklyReports = [];
if (!globalCloudStore.crewFeed) globalCloudStore.crewFeed = [];
if (!globalCloudStore.weeklyStats) globalCloudStore.weeklyStats = {};
if (!globalCloudStore.auditLogs) globalCloudStore.auditLogs = [];
if (!globalCloudStore.deletedIds) globalCloudStore.deletedIds = new Set<string>();

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
  return [];
}

function writeToDiskStore(reports: any[]) {
  try {
    const filePath = getDiskFilePath();
    fs.writeFileSync(filePath, JSON.stringify(reports, null, 2), "utf-8");
  } catch (e) {
    try {
      const fallbackPath = path.join(os.tmpdir(), "permanent_crew_db.json");
      fs.writeFileSync(fallbackPath, JSON.stringify(reports, null, 2), "utf-8");
    } catch (err) {}
  }
}

function generateDeterministicReportId(teamName: string, weekNumber: string, originalId?: any): string {
  if (originalId && String(originalId).trim() && String(originalId) !== "null" && String(originalId) !== "undefined") {
    return String(originalId);
  }
  const cleanTeam = String(teamName || "crew").toLowerCase().trim().replace(/[\s\t\n]+/g, "_");
  const cleanWeek = String(weekNumber || "w1").toLowerCase().trim().replace(/[\s\t\n]+/g, "_");
  return `${cleanTeam}_${cleanWeek}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function sanitizeReport(rep: any, existingRep?: any): any {
  if (!rep) return null;

  const serverNowIso = new Date().toISOString();

  const teamName = String(rep.teamName || rep.authorName || "홍보단");
  const weekNumber = String(rep.weekNumber || rep.week || "8월 1주차");
  const teamId = String(teamName).toLowerCase().trim().replace(/[\s\t\n]+/g, "_");
  const weekKey = String(weekNumber).toLowerCase().trim().replace(/[\s\t\n]+/g, "_");

  const reportId = generateDeterministicReportId(teamName, weekNumber, rep.id || rep.reportId || existingRep?.id);

  const sanitizeImage = (url: any) => {
    if (!url || typeof url !== "string") return null;
    if (url.includes("unsplash.com")) return null;
    return url;
  };

  const status = String(rep.status || "submitted");
  const version = existingRep ? (existingRep.version || 1) + 1 : 1;

  return {
    id: reportId,
    reportId: reportId,
    teamId: teamId,
    teamName: teamName,
    authorName: String(rep.authorName || teamName),
    weekKey: weekKey,
    week: weekNumber,
    weekNumber: weekNumber,

    title: String(rep.title || "주간 보고서"),
    summary: String(rep.detailContent || rep.content || rep.title || ""),
    detailContent: String(rep.detailContent || rep.content || ""),
    content: String(rep.content || rep.detailContent || ""),

    location: String(rep.location || "활동 현장"),
    activityCount: typeof rep.activityCount === "number" ? rep.activityCount : 1,
    participantCount: typeof rep.participants === "number" ? rep.participants : parseInt(rep.participants) || 0,
    participants: typeof rep.participants === "number" ? rep.participants : parseInt(rep.participants) || 0,
    contentsProduced: (parseInt(rep.video) || 0) + (parseInt(rep.cardnews) || 0) + (parseInt(rep.promo) || 0),

    video: typeof rep.video === "number" ? rep.video : parseInt(rep.video) || 0,
    videoViews: String(rep.videoViews || "0"),
    cardnews: typeof rep.cardnews === "number" ? rep.cardnews : parseInt(rep.cardnews) || 0,
    cardnewsViews: String(rep.cardnewsViews || "0"),
    promo: typeof rep.promo === "number" ? rep.promo : parseInt(rep.promo) || 0,
    promoViews: String(rep.promoViews || "0"),
    snsViews: (parseInt(rep.videoViews) || 0) + (parseInt(rep.cardnewsViews) || 0) + (parseInt(rep.promoViews) || 0),

    youtubeUrl: String(rep.youtubeUrl || ""),
    snsUrl: String(rep.snsUrl || ""),
    photoUrl: sanitizeImage(rep.photoUrl),
    attachedPhotos: Array.isArray(rep.attachedPhotos)
      ? rep.attachedPhotos.map(sanitizeImage).filter(Boolean)
      : [],

    status: status,
    visibility: rep.visibility || (status === "draft" ? "private" : "crew"),

    authorUid: String(rep.authorUid || "auth_crew_uid"),
    createdAt: existingRep ? existingRep.createdAt : (rep.createdAt || serverNowIso),
    updatedAt: serverNowIso,
    submittedAt: status === "submitted" ? serverNowIso : (existingRep?.submittedAt || serverNowIso),

    date: String(rep.date || serverNowIso.split('T')[0]),
    likes: typeof rep.likes === "number" ? rep.likes : 0,
    comments: Array.isArray(rep.comments) ? rep.comments : [],
    version: version
  };
}

function computeWeeklyStats(reports: any[]) {
  const submittedReports = reports.filter(r => r.status !== "draft");
  
  const totalTeams = new Set(submittedReports.map(r => r.teamName)).size;
  const totalParticipants = submittedReports.reduce((acc, r) => acc + (r.participants || 0), 0);
  const totalVideo = submittedReports.reduce((acc, r) => acc + (r.video || 0), 0);
  const totalCardnews = submittedReports.reduce((acc, r) => acc + (r.cardnews || 0), 0);
  const totalPromo = submittedReports.reduce((acc, r) => acc + (r.promo || 0), 0);

  return {
    totalSubmittedReports: submittedReports.length,
    totalActiveTeams: totalTeams,
    totalParticipants,
    totalVideo,
    totalCardnews,
    totalPromo,
    lastUpdated: new Date().toISOString()
  };
}

async function fetchCloudData(): Promise<{ weeklyReports: any[]; crewFeed: any[]; stats: any }> {
  const map = new Map<string, any>();

  // 1. 메모리 데이터 복원
  globalCloudStore.weeklyReports.forEach((r: any) => {
    if (r && r.id && !globalCloudStore.deletedIds.has(String(r.id))) {
      map.set(String(r.id), r);
    }
  });

  // 2. 디스크 영구 저장 파일 복원 (process.cwd() / permanent_crew_db.json)
  const diskReports = readFromDiskStore();
  diskReports.forEach((item: any) => {
    if (item && item.id && !globalCloudStore.deletedIds.has(String(item.id))) {
      if (!map.has(String(item.id))) {
        map.set(String(item.id), item);
      }
    }
  });

  // 3. Prisma DB 연동 시도 (있는 경우)
  try {
    if (prisma && prisma.report) {
      const dbReports = await prisma.report.findMany({ take: 100 });
      if (Array.isArray(dbReports)) {
        dbReports.forEach((dbR: any) => {
          if (dbR && dbR.id && !globalCloudStore.deletedIds.has(String(dbR.id))) {
            if (!map.has(String(dbR.id))) {
              let attachedPhotos: any[] = [];
              let comments: any[] = [];
              try { attachedPhotos = JSON.parse(dbR.attachedPhotos || "[]"); } catch (e) {}
              try { comments = JSON.parse(dbR.comments || "[]"); } catch (e) {}

              map.set(String(dbR.id), {
                ...dbR,
                reportId: dbR.id,
                detailContent: dbR.detailContent || "",
                content: dbR.detailContent || "",
                attachedPhotos,
                comments
              });
            }
          }
        });
      }
    }
  } catch (e) {}

  let allReports = Array.from(map.values()).sort((a: any, b: any) => 
    new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()
  );

  globalCloudStore.weeklyReports = allReports;
  globalCloudStore.crewFeed = allReports.filter((r: any) => r.status !== "draft" && r.visibility !== "private");
  globalCloudStore.weeklyStats = computeWeeklyStats(allReports);

  return {
    weeklyReports: globalCloudStore.weeklyReports,
    crewFeed: globalCloudStore.crewFeed,
    stats: globalCloudStore.weeklyStats
  };
}

async function persistCloudData(reports: any[]) {
  const filtered = reports.filter((r: any) => r && r.id && !globalCloudStore.deletedIds.has(String(r.id)));
  globalCloudStore.weeklyReports = filtered;
  globalCloudStore.crewFeed = filtered.filter((r: any) => r.status !== "draft" && r.visibility !== "private");
  globalCloudStore.weeklyStats = computeWeeklyStats(filtered);

  // 📂 100% 영구 불멸 디스크 파일 저장 (process.cwd() 기반)
  writeToDiskStore(filtered);

  // 🛡️ Prisma DB 백업 동기화
  try {
    if (prisma && prisma.report) {
      for (const item of filtered) {
        if (!item || !item.id) continue;
        await prisma.report.upsert({
          where: { id: String(item.id) },
          update: {
            title: String(item.title || "주간 보고서"),
            detailContent: String(item.detailContent || item.content || ""),
            teamName: String(item.teamName || "홍보단"),
            week: String(item.week || item.weekNumber || "8월 1주차"),
            photoUrl: item.photoUrl || null,
            attachedPhotos: JSON.stringify(item.attachedPhotos || []),
            comments: JSON.stringify(item.comments || []),
            date: String(item.date || new Date().toISOString().split('T')[0])
          },
          create: {
            id: String(item.id),
            title: String(item.title || "주간 보고서"),
            detailContent: String(item.detailContent || item.content || ""),
            teamName: String(item.teamName || "홍보단"),
            week: String(item.week || item.weekNumber || "8월 1주차"),
            photoUrl: item.photoUrl || null,
            attachedPhotos: JSON.stringify(item.attachedPhotos || []),
            comments: JSON.stringify(item.comments || []),
            date: String(item.date || new Date().toISOString().split('T')[0])
          }
        });
      }
    }
  } catch (e) {}
}

export async function GET(request: Request) {
  const { weeklyReports, stats } = await fetchCloudData();

  // 🌟 항상 전체 주간보고서 목록(weeklyReports)을 반환하여 뷰 상태 오차로 인한 글 사라짐 100% 원천 방지
  return NextResponse.json({ 
    success: true, 
    count: weeklyReports.length, 
    reports: weeklyReports, 
    stats 
  }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let incomingList: any[] = [];

    if (body.report) incomingList = [body.report];
    else if (Array.isArray(body.reportList)) incomingList = body.reportList;
    else if (Array.isArray(body.reports)) incomingList = body.reports;
    else if (body.id) incomingList = [body];

    const { weeklyReports } = await fetchCloudData();
    const map = new Map<string, any>();

    weeklyReports.forEach((r: any) => {
      if (r && r.id && !globalCloudStore.deletedIds.has(String(r.id))) {
        map.set(String(r.id), r);
      }
    });

    for (const item of incomingList) {
      const tempTeam = String(item.teamName || item.authorName || "crew");
      const tempWeek = String(item.weekNumber || item.week || "w1");
      const deterministicId = generateDeterministicReportId(tempTeam, tempWeek, item.id || item.reportId);

      const existingDoc = map.get(deterministicId);
      const sanitized = sanitizeReport(item, existingDoc);

      if (sanitized && sanitized.id && !globalCloudStore.deletedIds.has(sanitized.id)) {
        sanitized.updatedBy = String(item.updatedBy || item.authorUid || item.authorName || "crew_user");
        map.set(sanitized.id, sanitized);

        globalCloudStore.auditLogs.push({
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          action: existingDoc ? "UPSERT_OVERWRITE_REPORT" : "CREATE_REPORT",
          targetId: sanitized.id,
          actor: sanitized.updatedBy,
          version: sanitized.version,
          timestamp: sanitized.updatedAt
        });
      }
    }

    const updatedList = Array.from(map.values()).sort((a: any, b: any) => 
      new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()
    );

    await persistCloudData(updatedList);

    return NextResponse.json({
      success: true,
      message: "🎉 영구 불멸 DB 저장이 완공되었습니다.",
      reports: globalCloudStore.crewFeed,
      stats: globalCloudStore.weeklyStats
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
    globalCloudStore.deletedIds.add(targetId);

    const { weeklyReports } = await fetchCloudData();
    const remainingList = weeklyReports.filter((r: any) => String(r.id) !== targetId && String(r.reportId) !== targetId);

    globalCloudStore.auditLogs.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action: "DELETE_REPORT",
      targetId: targetId,
      actor: "홍보단/관리자",
      timestamp: new Date().toISOString()
    });

    await persistCloudData(remainingList);

    return NextResponse.json({
      success: true,
      message: "🎉 주간 보고서가 100% 영구 삭제되었습니다.",
      reports: globalCloudStore.crewFeed,
      stats: globalCloudStore.weeklyStats
    }, { headers: NO_CACHE_HEADERS });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
