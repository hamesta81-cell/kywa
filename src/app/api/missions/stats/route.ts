import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MissionStats = Record<string, { views: number; participants: number }>;

// 안전 미션 허브 카드 ID. 목록에 없는 ID는 저장하지 않는다.
const MISSION_IDS = [
  "cyber-bullying",
  "mbti",
  "drug-abuse",
  "blind-spot",
  "camping-zipline",
  "dodac",
  "disaster-evacuation",
  "cpr-basics",
  "fire-escape",
];

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

function statsFile() {
  return getPersistentFilePath("mission_stats.json");
}

function readStats(): MissionStats {
  let saved: MissionStats = {};
  try {
    saved = JSON.parse(fs.readFileSync(statsFile(), "utf-8"));
  } catch {}
  return Object.fromEntries(MISSION_IDS.map(id => [id, { views: saved[id]?.views ?? 0, participants: saved[id]?.participants ?? 0 }]));
}

function writeStats(stats: MissionStats) {
  const file = statsFile();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(stats, null, 2), "utf-8");
  fs.renameSync(tmp, file);
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

  return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
}
