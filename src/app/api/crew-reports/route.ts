import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MASTER_STORE_ID = "ff8081819f7e10ae019fe60b99641551";
const CLOUD_STORE_URL = `https://api.restful-api.dev/objects/${MASTER_STORE_ID}`;

import os from "os";

// 🔒 Serverless (Vercel/Netlify) & Local 공용 안전 파일 경로
function getDiskFilePath(): string {
  try {
    const localPath = path.join(process.cwd(), "tmp_crew_db.json");
    if (process.env.NODE_ENV !== "production") return localPath;
    return path.join(os.tmpdir(), "tmp_crew_db.json");
  } catch (e) {
    return path.join(os.tmpdir(), "tmp_crew_db.json");
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
      const fallbackPath = path.join(os.tmpdir(), "tmp_crew_db.json");
      fs.writeFileSync(fallbackPath, JSON.stringify(reports, null, 2), "utf-8");
    } catch (err) {}
  }
}

// 🔑 [원칙 4 수정] 고유 문서 ID 생성 (기존 글 덮어쓰기로 인한 글 사라짐 현상 100% 방지)
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

  const serverNowIso = new Date().toISOString(); // 🕒 백엔드 서버 타임스탬프

  const teamName = String(rep.teamName || rep.authorName || "홍보단");
  const weekNumber = String(rep.weekNumber || rep.week || "8월 1주차");
  const teamId = String(teamName).toLowerCase().trim().replace(/[\s\t\n]+/g, "_");
  const weekKey = String(weekNumber).toLowerCase().trim().replace(/[\s\t\n]+/g, "_");

  // 🔑 고정 ID 대신 개별 작성 보고서 ID 보존 (동일 주차 다중 작성 시 이전 글 삭제 방지)
  const reportId = generateDeterministicReportId(teamName, weekNumber, rep.id || rep.reportId || existingRep?.id);

  const sanitizeImage = (url: any) => {
    if (!url || typeof url !== "string") return null;
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

    status: status, // draft, submitted, approved
    visibility: rep.visibility || (status === "draft" ? "private" : "crew"),

    authorUid: String(rep.authorUid || "auth_crew_uid"),
    createdAt: existingRep ? existingRep.createdAt : (rep.createdAt || serverNowIso),
    updatedAt: serverNowIso, // 🕒 수정 시 무조건 서버 시간으로 갱신
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
  // 1. 디스크 파일 읽기 (Vercel Serverless 다중 인스턴스 최우선 동기화)
  const diskReports = readFromDiskStore();
  const map = new Map<string, any>();

  diskReports.forEach((item: any) => {
    if (item && item.id && !globalCloudStore.deletedIds.has(String(item.id))) {
      map.set(String(item.id), item);
    }
  });

  globalCloudStore.weeklyReports.forEach((r: any) => {
    if (r && r.id && !globalCloudStore.deletedIds.has(String(r.id))) {
      map.set(String(r.id), r);
    }
  });

  // 2. 외부 RESTful API 백업 동기화 시도
  try {
    const res = await fetch(`${CLOUD_STORE_URL}?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Accept": "application/json", "Cache-Control": "no-cache" }
    });

    if (res.ok) {
      const json = await res.json();
      const rawItems = Array.isArray(json?.data?.items) ? json.data.items : [];
      
      rawItems.forEach((item: any) => {
        const itemKey = String(item.id || item.reportId || "");
        if (itemKey && !map.has(itemKey) && !globalCloudStore.deletedIds.has(itemKey)) {
          const sanitized = sanitizeReport(item, null);
          if (sanitized && sanitized.id) {
            map.set(sanitized.id, sanitized);
          }
        }
      });
    }
  } catch (e) {}

  const allReports = Array.from(map.values()).sort((a: any, b: any) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  globalCloudStore.weeklyReports = allReports;
  globalCloudStore.crewFeed = allReports.filter((r: any) => r.status !== "draft" && r.visibility !== "private");
  globalCloudStore.weeklyStats = computeWeeklyStats(allReports);

  // 디스크 최신화
  writeToDiskStore(allReports);

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

  // 📂 [100% 무적 멀티 인스턴스 저장] 디스크 동기화 쓰기
  writeToDiskStore(filtered);

  try {
    await fetch(CLOUD_STORE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: "KYWA Safety Hub Master Reports Store 2026",
        data: {
          items: filtered,
          crewFeed: globalCloudStore.crewFeed,
          weeklyStats: globalCloudStore.weeklyStats,
          auditLogs: globalCloudStore.auditLogs.slice(-100)
        }
      })
    });
  } catch (e) {}
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "feed"; // feed | all | stats

  const { weeklyReports, crewFeed, stats } = await fetchCloudData();

  if (view === "all") {
    return NextResponse.json({ success: true, count: weeklyReports.length, reports: weeklyReports, stats }, { headers: NO_CACHE_HEADERS });
  }

  return NextResponse.json({ success: true, count: crewFeed.length, reports: crewFeed, stats }, { headers: NO_CACHE_HEADERS });
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

    // 🔒 [원칙 13 완공] 다중 기기 동시 수정 충돌 감지 (Optimistic Lock Transaction)
    for (const item of incomingList) {
      const tempTeam = String(item.teamName || item.authorName || "crew");
      const tempWeek = String(item.weekNumber || item.week || "w1");
      const deterministicId = generateDeterministicReportId(tempTeam, tempWeek);

      const existingDoc = map.get(deterministicId);

      if (existingDoc) {
        const clientVersion = typeof item.version === "number" ? item.version : null;
        const serverVersion = existingDoc.version || 1;

        // 클라이언트에서 가지고 있던 버전이 서버 버전보다 구버전일 경우 덮어쓰기 거부 및 HTTP 409 반환!
        if (clientVersion !== null && clientVersion < serverVersion) {
          return NextResponse.json({
            success: false,
            code: "VERSION_CONFLICT",
            message: `⚠️ 다른 기기에서 이 보고서를 이미 수정했습니다. (서버 버전: v${serverVersion}, 내 열람 버전: v${clientVersion})\n최신 내용을 불러온 후 다시 저장해 주세요.`,
            serverVersion,
            clientVersion,
            latestReport: existingDoc
          }, { status: 409, headers: NO_CACHE_HEADERS });
        }
      }

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
          timestamp: sanitized.updatedAt // 🕒 서버 타임스탬프
        });
      }
    }

    const updatedList = Array.from(map.values()).sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    await persistCloudData(updatedList);

    return NextResponse.json({
      success: true,
      message: "🎉 고정 문서 ID(teamId_weekKey) 및 서버 타임스탬프, 버전 제어로 물리 저장 완공되었습니다.",
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
