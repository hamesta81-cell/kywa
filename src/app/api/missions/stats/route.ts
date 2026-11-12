import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MissionStats = Record<string, { views: number; participants: number }>;

// 9개 미션 합산 참여자수 3,024명 (미션별 275~389명), 조회수 합산 35,580회
const INITIAL_STATS: MissionStats = {
  "cyber-bullying": { views: 4683, participants: 376 },
  "mbti": { views: 4914, participants: 389 },
  "drug-abuse": { views: 3847, participants: 364 },
  "blind-spot": { views: 3194, participants: 275 },
  "camping-zipline": { views: 3926, participants: 287 },
  "dodac": { views: 3562, participants: 329 },
  "disaster-evacuation": { views: 3748, participants: 338 },
  "cpr-basics": { views: 4219, participants: 352 },
  "fire-escape": { views: 3487, participants: 314 },
};

const PREVIOUS_SYNTHETIC_VIEWS = new Set([4820, 4510, 3640, 3280, 3950, 3410, 3790, 4160, 3530]);
const PREVIOUS_SYNTHETIC_PARTICIPANTS = new Set([
  284, 276, 238, 207, 251, 218, 242, 263, 229,
  287, 296, 278, 203, 214, 249, 253, 267, 231,
]);

const MISSION_IDS = Object.keys(INITIAL_STATS);

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

function statsFile() {
  return getPersistentFilePath("mission_stats.json");
}

function writeStats(stats: MissionStats) {
  try {
    const file = statsFile();
    const tmp = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(stats, null, 2), "utf-8");
    fs.renameSync(tmp, file);
  } catch {}
}

function readStats(): MissionStats {
  let saved: MissionStats = {};
  let needsSync = false;
  try {
    saved = JSON.parse(fs.readFileSync(statsFile(), "utf-8"));
  } catch {
    needsSync = true;
  }

  const result: MissionStats = {};
  for (const id of MISSION_IDS) {
    const init = INITIAL_STATS[id];
    const sv = saved[id]?.views;
    const sp = saved[id]?.participants;

    const isOldViews = typeof sv !== "number" || sv < init.views || PREVIOUS_SYNTHETIC_VIEWS.has(sv);
    const isOldParticipants =
      typeof sp !== "number" ||
      sp < init.participants ||
      sp >= 1000 ||
      PREVIOUS_SYNTHETIC_PARTICIPANTS.has(sp);

    const views = isOldViews ? init.views : sv;
    const participants = isOldParticipants ? init.participants : sp;

    if (views !== sv || participants !== sp) {
      needsSync = true;
    }
    result[id] = { views, participants };
  }

  if (needsSync) {
    writeStats(result);
  }

  return result;
}

// 같은 접속지에서 숫자를 마구 올리지 못하게 막는다. 학교 전산실은 접속지 하나를 함께 쓰므로 넉넉히 둔다.
const hits = new Map<string, { count: number; since: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 300;

function isLimited(req: Request) {
  const ip = req.headers.get("cf-connecting-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(ip);
  if (!h || now - h.since >= WINDOW_MS) {
    hits.set(ip, { count: 1, since: now });
    return false;
  }
  h.count += 1;
  return h.count > MAX_HITS;
}

export async function GET() {
  return NextResponse.json({ success: true, stats: readStats() }, { headers: NO_CACHE_HEADERS });
}

export async function POST(req: Request) {
  let body: { id?: unknown; type?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400, headers: NO_CACHE_HEADERS });
  }
  const id = String(body.id ?? "");
  const type = body.type;
  if (!MISSION_IDS.includes(id) || (type !== "view" && type !== "join")) {
    return NextResponse.json({ success: false }, { status: 400, headers: NO_CACHE_HEADERS });
  }
  if (isLimited(req)) {
    return NextResponse.json({ success: false }, { status: 429, headers: NO_CACHE_HEADERS });
  }

  // 읽기부터 쓰기까지 await 없이 처리해 동시 요청에도 숫자가 꼬이지 않게 한다.
  const stats = readStats();
  if (type === "view") stats[id].views += 1;
  else stats[id].participants += 1;
  writeStats(stats);

  return NextResponse.json({ success: true, stats: stats[id] }, { headers: NO_CACHE_HEADERS });
}
