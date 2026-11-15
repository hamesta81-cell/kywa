import { NextResponse } from "next/server";
import { authError, readAuth } from "@/lib/serverAuth";
import {
  exportMissionLogsCsv,
  getAdminMissionSummary,
  getPublicMissionSummary,
  isValidMissionId,
  recordMissionEvent,
} from "@/lib/missionParticipationStore";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 300;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    if (rateBuckets.size > 2000) rateBuckets.clear();
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const scope = url.searchParams.get("scope");
    const format = url.searchParams.get("format");
    const missionId = url.searchParams.get("missionId") || undefined;
    const limitParam = Number(url.searchParams.get("limit"));
    const offsetParam = Number(url.searchParams.get("offset"));
    const recentParam = Number(url.searchParams.get("recent"));

    const user = readAuth(req);
    const isAdmin = user?.role === "ADMIN";

    if (format === "csv") {
      if (!isAdmin) {
        return authError(user ? 403 : 401);
      }
      const csv = exportMissionLogsCsv(missionId);
      const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
      return new NextResponse(csv, {
        status: 200,
        headers: {
          ...NO_CACHE_HEADERS,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="kywa_mission_participation_logs_${today}.csv"`,
        },
      });
    }

    if (scope === "admin") {
      if (!isAdmin) {
        return authError(user ? 403 : 401);
      }
      const data = getAdminMissionSummary({
        missionId,
        limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 50,
        offset: Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0,
      });
      return NextResponse.json({ success: true, ...data }, { headers: NO_CACHE_HEADERS });
    }

    if (isAdmin && scope !== "public") {
      const data = getAdminMissionSummary({
        missionId,
        limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 50,
        offset: Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : 0,
      });
      return NextResponse.json({ success: true, ...data }, { headers: NO_CACHE_HEADERS });
    }

    const recentLimit = Number.isFinite(recentParam) && recentParam > 0 ? recentParam : 20;
    const publicData = getPublicMissionSummary(recentLimit);
    return NextResponse.json({ success: true, ...publicData }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Mission stats GET error:", err);
    return NextResponse.json(
      { success: false, error: "미션 통계를 불러오지 못했습니다." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!allowRequest(ip)) {
      return NextResponse.json(
        { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";
    const type = body?.type === "view" || body?.type === "join" ? body.type : null;

    if (!isValidMissionId(id) || !type) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 미션 요청입니다." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const durationSec =
      typeof body?.durationSec === "number" ? body.durationSec : undefined;
    const resultSummary =
      typeof body?.resultSummary === "string" ? body.resultSummary : undefined;
    const device =
      body?.device === "mobile" || body?.device === "desktop" ? body.device : undefined;

    const updated = recordMissionEvent(id, type, {
      durationSec,
      resultSummary,
      device,
    });

    return NextResponse.json({ success: true, ...updated }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("Mission stats POST error:", err);
    return NextResponse.json(
      { success: false, error: "미션 참여 기록 저장 중 오류가 발생했습니다." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
