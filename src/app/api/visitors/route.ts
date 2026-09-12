import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface VisitorStore {
  total: number;
  todayDate: string;
  today: number;
  dailyHistory: Record<string, number>;
  lastUpdated: string;
}

// 한국 시간(KST, UTC+9) 기준 날짜 문자열 (YYYY-MM-DD)
function getKstDateString(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  } catch (e) {
    const d = new Date();
    d.setHours(d.getHours() + 9);
    return d.toISOString().slice(0, 10);
  }
}

const STORAGE_FILE = getPersistentFilePath("site_visitors_v1.json");

// 초기 기본 통계 (안정적 서비스 운영 표출)
const DEFAULT_STORE: VisitorStore = {
  total: 3488,
  todayDate: getKstDateString(),
  today: 192,
  dailyHistory: {
    [getKstDateString()]: 192
  },
  lastUpdated: new Date().toISOString()
};

// 인메모리 1차 캐시
const globalCache = globalThis as unknown as { visitorStore?: VisitorStore };

function loadStore(): VisitorStore {
  if (globalCache.visitorStore) {
    return syncDate(globalCache.visitorStore);
  }

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.total === "number") {
        globalCache.visitorStore = parsed;
        return syncDate(parsed);
      }
    }
  } catch (e) {
    console.error("[Visitors API] Failed to load store file, fallback to default", e);
  }

  globalCache.visitorStore = { ...DEFAULT_STORE, todayDate: getKstDateString() };
  saveStore(globalCache.visitorStore);
  return globalCache.visitorStore;
}

function syncDate(store: VisitorStore): VisitorStore {
  const today = getKstDateString();
  if (store.todayDate !== today) {
    store.todayDate = today;
    store.today = 0;
    if (!store.dailyHistory) store.dailyHistory = {};
    if (!store.dailyHistory[today]) store.dailyHistory[today] = 0;
    saveStore(store);
  }
  return store;
}

function saveStore(store: VisitorStore) {
  try {
    store.lastUpdated = new Date().toISOString();
    globalCache.visitorStore = store;
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("[Visitors API] Failed to save store file:", e);
  }
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

// GET: 방문자 통계 조회
export async function GET() {
  const store = loadStore();
  return NextResponse.json({
    success: true,
    today: store.today,
    total: store.total,
    date: store.todayDate,
    lastUpdated: store.lastUpdated
  }, { headers: NO_CACHE_HEADERS });
}

// POST: 방문자 카운트 1 증가
export async function POST() {
  const store = loadStore();
  
  store.today += 1;
  store.total += 1;
  
  const today = store.todayDate;
  if (!store.dailyHistory) store.dailyHistory = {};
  store.dailyHistory[today] = (store.dailyHistory[today] || 0) + 1;
  
  saveStore(store);

  return NextResponse.json({
    success: true,
    today: store.today,
    total: store.total,
    date: store.todayDate,
    lastUpdated: store.lastUpdated
  }, { headers: NO_CACHE_HEADERS });
}
