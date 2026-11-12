import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MissionStats = Record<string, { views: number; participants: number }>;

const INITIAL_STATS: MissionStats = {
  "cyber-bullying": { views: 4942, participants: 479 },
  "mbti": { views: 5187, participants: 493 },
  "drug-abuse": { views: 4116, participants: 468 },
  "blind-spot": { views: 3418, participants: 373 },
  "camping-zipline": { views: 4153, participants: 389 },
  "dodac": { views: 3819, participants: 432 },
  "disaster-evacuation": { views: 3984, participants: 436 },
  "cpr-basics": { views: 4485, participants: 451 },
  "fire-escape": { views: 3726, participants: 412 },
};

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

    const views = typeof sv === "number" && sv >= init.views ? sv : init.views;
    const participants =
      typeof sp === "number" && sp >= init.participants && sp < 1000
        ? sp
        : init.participants;

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
