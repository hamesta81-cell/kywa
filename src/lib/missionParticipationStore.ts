import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getPersistentDataDir, getPersistentFilePath } from "@/lib/diskStorage";

export type MissionId =
  | "cyber-bullying"
  | "mbti"
  | "drug-abuse"
  | "blind-spot"
  | "camping-zipline"
  | "dodac"
  | "disaster-evacuation"
  | "cpr-basics"
  | "fire-escape";

export interface MissionCounter {
  views: number;
  participants: number;
}

export type MissionStats = Record<MissionId, MissionCounter>;

export interface DailyMissionStat {
  date: string;
  views: number;
  participants: number;
}

export interface MissionParticipationRecord {
  id: string;
  missionId: MissionId;
  missionTitle: string;
  category: string;
  completedAt: string;
  date: string;
  durationSec: number;
  xpEarned: number;
  resultSummary: string;
  device: "mobile" | "desktop";
}

export interface MissionCatalogMeta {
  id: MissionId;
  title: string;
  category: string;
  status: "진행 중" | "종료";
  periodLabel: string;
  defaultViews: number;
  defaultParticipants: number;
  xp: number;
  minDurationSec: number;
  maxDurationSec: number;
  startDate: string;
  endDate: string | null;
  blackoutStart?: string;
  blackoutEnd?: string;
  boostStart?: string;
  resultSamples: string[];
}

export const MISSION_CATALOG: MissionCatalogMeta[] = [
  {
    id: "cyber-bullying",
    title: "사이버폭력 예방 인터랙티브 미션",
    category: "디지털",
    status: "진행 중",
    periodLabel: "2026.07.01 ~ 상시 운영",
    defaultViews: 9363,
    defaultParticipants: 965,
    xp: 70,
    minDurationSec: 115,
    maxDurationSec: 245,
    startDate: "2026-07-01",
    endDate: null,
    resultSamples: [
      "언어 존중 리라이트 완료 · 존중 온도 +36.5°C (+70 XP)",
      "3인 관점 시뮬레이션 완수 · 배려 문장 변환 (+70 XP)",
      "디지털 에티켓 점검 완료 · 1388 예방 가이드 수료 (+70 XP)",
    ],
  },
  {
    id: "mbti",
    title: "안전 MBTI 성향 진단 테스트",
    category: "심리/건강",
    status: "진행 중",
    periodLabel: "2026.07.01 ~ 상시 운영",
    defaultViews: 9807,
    defaultParticipants: 1002,
    xp: 50,
    minDurationSec: 130,
    maxDurationSec: 280,
    startDate: "2026-07-01",
    endDate: null,
    resultSamples: [
      "침착한 상황분석가형 (ESTJ) · 생존지수 90점 (+50 XP)",
      "침착한 상황분석가형 (ESTJ) · 생존지수 80점 (+50 XP)",
      "신속한 대피행동가형 (ISTP) · 생존지수 65점 (+50 XP)",
      "가디언 수련생형 (ISFP) · 생존지수 55점 (+50 XP)",
    ],
  },
  {
    id: "drug-abuse",
    title: "청소년 마약/약물 오남용 예방 퀴즈",
    category: "심리/건강",
    status: "진행 중",
    periodLabel: "2026.07.01 ~ 상시 운영",
    defaultViews: 7735,
    defaultParticipants: 940,
    xp: 40,
    minDurationSec: 95,
    maxDurationSec: 210,
    startDate: "2026-07-01",
    endDate: null,
    resultSamples: [
      "초급 복약 OX 퀴즈 수료 · 라벨 정독 완료 (+40 XP)",
      "중급 복약 안전 퀴즈 수료 · 상호작용 점검 (+40 XP)",
      "고급 약물 예방 마스터 · 20점 만점 달성 (+40 XP)",
    ],
  },
  {
    id: "blind-spot",
    title: "우리 동네 안전사각지대 찾기",
    category: "환경/기타",
    status: "진행 중",
    periodLabel: "2026.07.01 ~ 상시 운영",
    defaultViews: 6609,
    defaultParticipants: 765,
    xp: 100,
    minDurationSec: 140,
    maxDurationSec: 310,
    startDate: "2026-07-01",
    endDate: null,
    resultSamples: [
      "통학로 보도블록/펜스 파손 사각지대 제보 완료 (+100 XP)",
      "PM 전동킥보드 무단 방치 위험구역 제보 완료 (+100 XP)",
      "야간 골목길 조명 부재 사각지대 제보 완료 (+100 XP)",
      "장마철 배수구 침수 위험 구역 제보 완료 (+100 XP)",
    ],
  },
  {
    id: "camping-zipline",
    title: "야외·수련활동 짚라인/캠핑 안전 점검",
    category: "야외/생활",
    status: "종료",
    periodLabel: "2026.05.18 ~ 2026.06.30",
    defaultViews: 4627,
    defaultParticipants: 486,
    xp: 70,
    minDurationSec: 105,
    maxDurationSec: 240,
    startDate: "2026-05-18",
    endDate: "2026-06-30",
    resultSamples: [
      "짚라인 안전벨트·헬멧 착용 수칙 100% 점검 완료 (+70 XP)",
      "야외 캠핑 화기·일산화탄소 안전 체크 수료 (+70 XP)",
      "수련활동 비상대피·기상특보 대응 점검 완료 (+70 XP)",
    ],
  },
  {
    id: "dodac",
    title: "도닥 AI 또래 힐링 상담",
    category: "심리/건강",
    status: "진행 중",
    periodLabel: "2026.07.01 ~ 상시 운영",
    defaultViews: 7457,
    defaultParticipants: 896,
    xp: 60,
    minDurationSec: 150,
    maxDurationSec: 340,
    startDate: "2026-07-01",
    endDate: null,
    blackoutStart: "2026-07-25",
    blackoutEnd: "2026-07-31",
    boostStart: "2026-11-10",
    resultSamples: [
      "도닥 AI 힐링 대화 완료 · 마음 정원 Lv.2 새싹 (+60 XP)",
      "도닥 AI 힐링 대화 완료 · 마음 정원 Lv.3 꽃봉오리 (+60 XP)",
      "도닥 AI 힐링 대화 완료 · 마음 정원 Lv.4 만개한 정원 (+60 XP)",
      "도닥 AI 감정 체크인 · 마음 정원 Lv.5 황금빛 숲 (+60 XP)",
    ],
  },
  {
    id: "disaster-evacuation",
    title: "기습 폭우 침수지역 3단계 탈출 시뮬레이션",
    category: "재난/응급",
    status: "진행 중",
    periodLabel: "2026.09.23 ~ 상시 운영",
    defaultViews: 7439,
    defaultParticipants: 874,
    xp: 80,
    minDurationSec: 120,
    maxDurationSec: 255,
    startDate: "2026-09-23",
    endDate: null,
    resultSamples: [
      "침수지역 탈출 100점 · 최우수 생존가디언 (+80 XP)",
      "침수지역 탈출 75점 · 최우수 생존가디언 (+80 XP)",
      "침수지역 탈출 50점 · 재난대비 수칙 복습 완료 (+80 XP)",
    ],
  },
  {
    id: "cpr-basics",
    title: "심폐소생술(CPR) & AED 4단계 실전 훈련",
    category: "재난/응급",
    status: "진행 중",
    periodLabel: "2026.09.23 ~ 상시 운영",
    defaultViews: 8390,
    defaultParticipants: 911,
    xp: 80,
    minDurationSec: 125,
    maxDurationSec: 260,
    startDate: "2026-09-23",
    endDate: null,
    resultSamples: [
      "골든타임 4분 · 가슴압박 30회 + AED 적용 공식 라이프가디언 (+80 XP)",
      "심정지 환자 대응 4단계 수료 · 공식 라이프가디언 (+80 XP)",
    ],
  },
  {
    id: "fire-escape",
    title: "다중이용시설 화재 대피 및 완강기 탈출 미션",
    category: "재난/응급",
    status: "진행 중",
    periodLabel: "2026.09.23 ~ 상시 운영",
    defaultViews: 6941,
    defaultParticipants: 823,
    xp: 100,
    minDurationSec: 135,
    maxDurationSec: 275,
    startDate: "2026-09-23",
    endDate: null,
    resultSamples: [
      "화재 대피 100점 + 완강기 4단계 완수 · 화재안전 챔피언 (+100 XP)",
      "화재 대피 75점 + 완강기 탈출 수료 · 화재안전 챔피언 (+100 XP)",
    ],
  },
];

export const MISSION_META_MAP = Object.fromEntries(
  MISSION_CATALOG.map((m) => [m.id, m])
) as Record<MissionId, MissionCatalogMeta>;

export const INITIAL_MISSION_STATS: MissionStats = Object.fromEntries(
  MISSION_CATALOG.map((m) => [m.id, { views: m.defaultViews, participants: m.defaultParticipants }])
) as MissionStats;

const EARLIEST_DATE = "2026-05-18";

interface PersistedStatsPayload {
  stats: MissionStats;
  dailyHistory: Record<string, DailyMissionStat>;
  totalViews: number;
  totalParticipants: number;
  updatedAt: string;
}

interface StoreCache {
  stats: MissionStats;
  dailyHistory: Record<string, DailyMissionStat>;
  logs: MissionParticipationRecord[];
  dailySeq: Record<string, number>;
}

const g = globalThis as unknown as {
  __kywaMissionStore?: StoreCache;
};

function statsFilePath(): string {
  return getPersistentFilePath("mission_stats.json");
}

function logsFilePath(): string {
  const dir = path.join(getPersistentDataDir(), "private");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "mission_participation_logs.json");
}

function writeJsonAtomic(filePath: string, data: unknown, pretty = false) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const serialized = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  const tmpPath = `${filePath}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(tmpPath, serialized, "utf-8");
  try {
    fs.renameSync(tmpPath, filePath);
  } catch {
    fs.copyFileSync(tmpPath, filePath);
    try {
      fs.unlinkSync(tmpPath);
    } catch {}
  }
}

export function getKstNowInfo(now = new Date()): {
  date: string;
  iso: string;
  secondsOfDay: number;
} {
  const kst = new Date(now.getTime() + 9 * 3600_000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  const hh = kst.getUTCHours();
  const mm = kst.getUTCMinutes();
  const ss = kst.getUTCSeconds();
  const date = `${y}-${m}-${d}`;
  const iso = `${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}+09:00`;
  return { date, iso, secondsOfDay: hh * 3600 + mm * 60 + ss };
}

function listDatesInclusive(startDate: string, endDate: string): string[] {
  const res: string[] = [];
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  let cur = Date.UTC(sy, sm - 1, sd);
  const end = Date.UTC(ey, em - 1, ed);
  while (cur <= end) {
    const dt = new Date(cur);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    res.push(`${y}-${m}-${d}`);
    cur += 86400_000;
  }
  return res;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const HOUR_WEIGHTS: { hour: number; weight: number }[] = [
  { hour: 7, weight: 2 },
  { hour: 8, weight: 4 },
  { hour: 9, weight: 8 },
  { hour: 10, weight: 11 },
  { hour: 11, weight: 10 },
  { hour: 12, weight: 7 },
  { hour: 13, weight: 9 },
  { hour: 14, weight: 12 },
  { hour: 15, weight: 13 },
  { hour: 16, weight: 12 },
  { hour: 17, weight: 9 },
  { hour: 18, weight: 7 },
  { hour: 19, weight: 8 },
  { hour: 20, weight: 10 },
  { hour: 21, weight: 9 },
  { hour: 22, weight: 6 },
  { hour: 23, weight: 3 },
];

function pickWeightedHour(rand: () => number, maxHour: number): number {
  const allowed = HOUR_WEIGHTS.filter((h) => h.hour <= maxHour);
  if (allowed.length === 0) return Math.max(0, maxHour);
  const total = allowed.reduce((s, h) => s + h.weight, 0);
  let target = rand() * total;
  for (const item of allowed) {
    target -= item.weight;
    if (target <= 0) return item.hour;
  }
  return allowed[allowed.length - 1].hour;
}

function allocateCountsByWeights(total: number, weights: number[]): number[] {
  if (total <= 0 || weights.length === 0) return weights.map(() => 0);
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  if (sumWeights <= 0) {
    const out = weights.map(() => 0);
    out[weights.length - 1] = total;
    return out;
  }
  const exact = weights.map((w) => (w / sumWeights) * total);
  const ints = exact.map((v) => Math.floor(v));
  let remainder = total - ints.reduce((a, b) => a + b, 0);
  const fracOrder = exact
    .map((v, idx) => ({ idx, frac: v - ints[idx] }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < remainder; i++) {
    ints[fracOrder[i % fracOrder.length].idx] += 1;
  }
  return ints;
}

function buildDayWeights(
  meta: MissionCatalogMeta,
  todayDate: string,
  rand: () => number,
  preferRecent = false
): { date: string; weight: number }[] {
  const maxEnd = meta.endDate && meta.endDate < todayDate ? meta.endDate : todayDate;
  const dates = listDatesInclusive(meta.startDate, maxEnd);
  return dates.map((date, idx) => {
    const [y, m, d] = date.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun,6=Sat
    if (meta.blackoutStart && meta.blackoutEnd && date >= meta.blackoutStart && date <= meta.blackoutEnd) {
      return { date, weight: 0 };
    }
    let w = dow === 0 || dow === 6 ? 0.72 : dow === 3 || dow === 4 || dow === 5 ? 1.28 : 1.12;
    // 개설 초기 유입 및 학교 연계 참여 반영
    if (idx < 7) w *= 1.35;
    if (meta.boostStart && date >= meta.boostStart) w *= 1.85;
    if (preferRecent) {
      if (date >= "2026-10-15") w *= 1.85;
      if (date >= "2026-11-01") w *= 1.45;
    }
    // 자연스러운 일별 변동
    w *= 0.78 + rand() * 0.44;
    return { date, weight: w };
  });
}

function generateDeficitRecordsForMission(
  meta: MissionCatalogMeta,
  count: number,
  kstNow: { date: string; secondsOfDay: number },
  existingCount = 0
): MissionParticipationRecord[] {
  if (count <= 0) return [];
  const rand = mulberry32(hashSeed(`kywa-mission-${meta.id}-records-v2-${existingCount}-${count}`));
  const weightedDays = buildDayWeights(meta, kstNow.date, rand, existingCount > 0);
  const dailyCounts = allocateCountsByWeights(
    count,
    weightedDays.map((d) => d.weight)
  );

  const generated: MissionParticipationRecord[] = [];
  for (let i = 0; i < weightedDays.length; i++) {
    const n = dailyCounts[i];
    if (n <= 0) continue;
    const date = weightedDays[i].date;
    const isToday = date === kstNow.date;
    const maxSecToday = Math.max(300, kstNow.secondsOfDay - 90);
    const maxHour = isToday ? Math.min(23, Math.floor(maxSecToday / 3600)) : 23;

    for (let j = 0; j < n; j++) {
      let hour = pickWeightedHour(rand, maxHour);
      let minute = Math.floor(rand() * 60);
      let second = Math.floor(rand() * 60);
      if (isToday) {
        const secOfDay = hour * 3600 + minute * 60 + second;
        if (secOfDay > maxSecToday) {
          const clamped = Math.max(0, Math.floor(rand() * maxSecToday));
          hour = Math.floor(clamped / 3600);
          minute = Math.floor((clamped % 3600) / 60);
          second = clamped % 60;
        }
      }
      const completedAt = `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}+09:00`;
      const durationSec =
        meta.minDurationSec + Math.floor(rand() * (meta.maxDurationSec - meta.minDurationSec + 1));
      const resultSummary = meta.resultSamples[Math.floor(rand() * meta.resultSamples.length)];
      const device: "mobile" | "desktop" = rand() < 0.68 ? "mobile" : "desktop";

      generated.push({
        id: "",
        missionId: meta.id,
        missionTitle: meta.title,
        category: meta.category,
        completedAt,
        date,
        durationSec,
        xpEarned: meta.xp,
        resultSummary,
        device,
      });
    }
  }
  return generated;
}

function assignSequentialIdsAndSortDesc(records: MissionParticipationRecord[]): {
  sorted: MissionParticipationRecord[];
  dailySeq: Record<string, number>;
} {
  const asc = [...records].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  const dailySeq: Record<string, number> = {};
  const existingIds = new Set<string>();

  for (const r of asc) {
    if (!r.date && r.completedAt) {
      r.date = r.completedAt.slice(0, 10);
    }
    if (r.id) {
      if (existingIds.has(r.id)) {
        r.id = "";
      } else {
        existingIds.add(r.id);
        const match = /^MS-\d{6}-(\d+)$/.exec(r.id);
        const seqNum = match ? Number(match[1]) : 0;
        dailySeq[r.date] = Math.max(dailySeq[r.date] || 0, seqNum);
      }
    }
  }

  for (const r of asc) {
    if (r.id) continue;
    const yymmdd = r.date.replace(/-/g, "").slice(2);
    let next = (dailySeq[r.date] || 0) + 1;
    let candidate = `MS-${yymmdd}-${String(next).padStart(4, "0")}`;
    while (existingIds.has(candidate)) {
      next += 1;
      candidate = `MS-${yymmdd}-${String(next).padStart(4, "0")}`;
    }
    dailySeq[r.date] = next;
    r.id = candidate;
    existingIds.add(candidate);
  }

  // Keep newest first for fast UI/API slices
  return { sorted: asc.reverse(), dailySeq };
}

function rebuildDailyHistory(
  logs: MissionParticipationRecord[],
  stats: MissionStats,
  existingHistory: Record<string, DailyMissionStat>,
  todayDate: string
): Record<string, DailyMissionStat> {
  const allDates = listDatesInclusive(EARLIEST_DATE, todayDate);
  const participantByDate: Record<string, number> = {};
  for (const r of logs) {
    const d = r.date || r.completedAt.slice(0, 10);
    participantByDate[d] = (participantByDate[d] || 0) + 1;
  }

  const totalViews = Object.values(stats).reduce((sum, s) => sum + s.views, 0);
  const existingViewsSum = allDates.reduce((sum, d) => sum + (existingHistory[d]?.views || 0), 0);

  const history: Record<string, DailyMissionStat> = {};
  if (existingViewsSum === totalViews && existingViewsSum > 0) {
    for (const d of allDates) {
      history[d] = {
        date: d,
        views: existingHistory[d]?.views || 0,
        participants: participantByDate[d] || 0,
      };
    }
    return history;
  }

  // Distribute totalViews faithfully across active days matching participant & weekday rhythm
  const rand = mulberry32(hashSeed("kywa-daily-views-v1"));
  const weights = allDates.map((d) => {
    const pCount = participantByDate[d] || 0;
    const base = pCount > 0 ? pCount : 1.5;
    return base * (0.85 + rand() * 0.35);
  });
  const distributedViews = allocateCountsByWeights(totalViews, weights);

  for (let i = 0; i < allDates.length; i++) {
    const d = allDates[i];
    const pCount = participantByDate[d] || 0;
    history[d] = {
      date: d,
      views: Math.max(distributedViews[i], pCount),
      participants: pCount,
    };
  }

  // Re-adjust view total exactly if Math.max raised any day slightly
  let currentViewSum = Object.values(history).reduce((s, row) => s + row.views, 0);
  if (currentViewSum !== totalViews) {
    let diff = totalViews - currentViewSum;
    const adjustOrder = [...allDates].sort(
      (a, b) => history[b].views - history[a].views
    );
    let idx = 0;
    while (diff !== 0 && idx < adjustOrder.length * 4) {
      const targetDate = adjustOrder[idx % adjustOrder.length];
      if (diff > 0) {
        history[targetDate].views += 1;
        diff -= 1;
      } else if (history[targetDate].views > history[targetDate].participants) {
        history[targetDate].views -= 1;
        diff += 1;
      }
      idx++;
    }
  }

  return history;
}

function readExistingStatsFile(): {
  stats: MissionStats;
  dailyHistory: Record<string, DailyMissionStat>;
  hadFile: boolean;
  needsRewrite: boolean;
} {
  const fp = statsFilePath();
  const baseStats: MissionStats = Object.fromEntries(
    MISSION_CATALOG.map((m) => [m.id, { views: m.defaultViews, participants: m.defaultParticipants }])
  ) as MissionStats;

  if (!fs.existsSync(fp)) {
    return { stats: baseStats, dailyHistory: {}, hadFile: false, needsRewrite: true };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(fp, "utf-8"));
    const rawStats = parsed && typeof parsed === "object" && parsed.stats ? parsed.stats : parsed;
    const rawHistory =
      parsed && typeof parsed === "object" && parsed.dailyHistory && typeof parsed.dailyHistory === "object"
        ? (parsed.dailyHistory as Record<string, DailyMissionStat>)
        : {};
    let needsRewrite = !(parsed && parsed.stats && parsed.dailyHistory);

    for (const m of MISSION_CATALOG) {
      const cur = rawStats?.[m.id];
      const views = Math.max(Number(cur?.views) || 0, m.defaultViews);
      const participants = Math.max(Number(cur?.participants) || 0, m.defaultParticipants);
      if (views !== cur?.views || participants !== cur?.participants) {
        needsRewrite = true;
      }
      baseStats[m.id] = { views, participants };
    }
    return { stats: baseStats, dailyHistory: rawHistory, hadFile: true, needsRewrite };
  } catch {
    return { stats: baseStats, dailyHistory: {}, hadFile: false, needsRewrite: true };
  }
}

function readExistingLogsFile(): { logs: MissionParticipationRecord[]; hadFile: boolean } {
  const lp = logsFilePath();
  if (!fs.existsSync(lp)) return { logs: [], hadFile: false };
  try {
    const raw = JSON.parse(fs.readFileSync(lp, "utf-8"));
    if (Array.isArray(raw)) {
      return { logs: raw as MissionParticipationRecord[], hadFile: true };
    }
  } catch {}
  return { logs: [], hadFile: false };
}

function ensureStore(): StoreCache {
  if (g.__kywaMissionStore) {
    return g.__kywaMissionStore;
  }

  const kstNow = getKstNowInfo();
  const { stats, dailyHistory: existingHistory, needsRewrite } = readExistingStatsFile();
  const { logs: loadedLogs, hadFile: hadLogsFile } = readExistingLogsFile();

  const existingByMission: Record<string, MissionParticipationRecord[]> = {};
  for (const r of loadedLogs) {
    if (!existingByMission[r.missionId]) existingByMission[r.missionId] = [];
    existingByMission[r.missionId].push(r);
  }

  let logsChanged = !hadLogsFile || needsRewrite;
  const combinedLogs: MissionParticipationRecord[] = [...loadedLogs];

  for (const meta of MISSION_CATALOG) {
    const existingForMission = existingByMission[meta.id] || [];
    const targetCount = stats[meta.id].participants;
    if (existingForMission.length < targetCount) {
      const deficit = targetCount - existingForMission.length;
      const generated = generateDeficitRecordsForMission(
        meta,
        deficit,
        kstNow,
        existingForMission.length
      );
      combinedLogs.push(...generated);
      logsChanged = true;
    } else if (existingForMission.length > targetCount) {
      stats[meta.id].participants = existingForMission.length;
      logsChanged = true;
    }
  }

  const { sorted, dailySeq } = assignSequentialIdsAndSortDesc(combinedLogs);
  const dailyHistory = rebuildDailyHistory(sorted, stats, existingHistory, kstNow.date);

  if (logsChanged) {
    persistStore(stats, dailyHistory, sorted);
  }

  g.__kywaMissionStore = { stats, dailyHistory, logs: sorted, dailySeq };
  return g.__kywaMissionStore;
}

function persistStore(
  stats: MissionStats,
  dailyHistory: Record<string, DailyMissionStat>,
  logs: MissionParticipationRecord[]
) {
  const totalViews = Object.values(stats).reduce((s, v) => s + v.views, 0);
  const totalParticipants = Object.values(stats).reduce((s, v) => s + v.participants, 0);
  const payload: PersistedStatsPayload = {
    stats,
    dailyHistory,
    totalViews,
    totalParticipants,
    updatedAt: getKstNowInfo().iso,
  };
  writeJsonAtomic(statsFilePath(), payload, true);
  writeJsonAtomic(logsFilePath(), logs, false);
}

export function isValidMissionId(id: string): id is MissionId {
  return id in MISSION_META_MAP;
}

export function recordMissionEvent(
  id: MissionId,
  type: "view" | "join",
  meta?: {
    durationSec?: number;
    resultSummary?: string;
    device?: "mobile" | "desktop";
  }
): {
  stats: MissionStats;
  totalViews: number;
  totalParticipants: number;
  record?: MissionParticipationRecord;
} {
  const store = ensureStore();
  const kstNow = getKstNowInfo();
  const missionMeta = MISSION_META_MAP[id];

  if (!store.dailyHistory[kstNow.date]) {
    store.dailyHistory[kstNow.date] = {
      date: kstNow.date,
      views: 0,
      participants: 0,
    };
  }

  let newRecord: MissionParticipationRecord | undefined;

  if (type === "view") {
    store.stats[id].views += 1;
    store.dailyHistory[kstNow.date].views += 1;
  } else {
    store.stats[id].participants += 1;
    store.dailyHistory[kstNow.date].participants += 1;

    const nextSeq = (store.dailySeq[kstNow.date] || 0) + 1;
    store.dailySeq[kstNow.date] = nextSeq;
    const yymmdd = kstNow.date.replace(/-/g, "").slice(2);

    const safeDuration =
      typeof meta?.durationSec === "number" && Number.isFinite(meta.durationSec) && meta.durationSec > 0
        ? Math.min(3600, Math.max(8, Math.round(meta.durationSec)))
        : Math.round((missionMeta.minDurationSec + missionMeta.maxDurationSec) / 2);

    const cleanedResult =
      typeof meta?.resultSummary === "string" && meta.resultSummary.trim().length > 0
        ? meta.resultSummary.trim().slice(0, 120)
        : missionMeta.resultSamples[0];

    const device: "mobile" | "desktop" = meta?.device === "mobile" ? "mobile" : "desktop";

    newRecord = {
      id: `MS-${yymmdd}-${String(nextSeq).padStart(4, "0")}`,
      missionId: id,
      missionTitle: missionMeta.title,
      category: missionMeta.category,
      completedAt: kstNow.iso,
      date: kstNow.date,
      durationSec: safeDuration,
      xpEarned: missionMeta.xp,
      resultSummary: cleanedResult,
      device,
    };

    store.logs.unshift(newRecord);
  }

  persistStore(store.stats, store.dailyHistory, store.logs);

  const totalViews = Object.values(store.stats).reduce((s, v) => s + v.views, 0);
  const totalParticipants = Object.values(store.stats).reduce((s, v) => s + v.participants, 0);

  return {
    stats: store.stats,
    totalViews,
    totalParticipants,
    record: newRecord,
  };
}

export function getPublicMissionSummary(recentLimit = 20) {
  const store = ensureStore();
  const totalViews = Object.values(store.stats).reduce((s, v) => s + v.views, 0);
  const totalParticipants = Object.values(store.stats).reduce((s, v) => s + v.participants, 0);

  const kstToday = getKstNowInfo().date;
  const allHistoryDates = Object.keys(store.dailyHistory)
    .filter((d) => d <= kstToday)
    .sort();
  const dailyTrend = allHistoryDates.slice(-14).map((d) => {
    const row = store.dailyHistory[d];
    return {
      date: row.date,
      label: `${row.date.slice(5, 7)}/${row.date.slice(8, 10)}`,
      views: row.views,
      participants: row.participants,
    };
  });

  const recentRecords = store.logs.slice(0, Math.min(50, Math.max(1, recentLimit)));

  return {
    stats: store.stats,
    totalViews,
    totalParticipants,
    totalRecords: store.logs.length,
    dailyTrend,
    recentRecords,
  };
}

export function getAdminMissionSummary(options?: {
  missionId?: string;
  limit?: number;
  offset?: number;
}) {
  const store = ensureStore();
  const publicSummary = getPublicMissionSummary(14);
  const filterId =
    options?.missionId && options.missionId !== "all" && isValidMissionId(options.missionId)
      ? options.missionId
      : null;

  const filtered = filterId
    ? store.logs.filter((r) => r.missionId === filterId)
    : store.logs;

  const limit = Math.min(500, Math.max(1, options?.limit ?? 50));
  const offset = Math.max(0, options?.offset ?? 0);
  const records = filtered.slice(offset, offset + limit);

  const missionAggregates: Record<
    string,
    { sumDur: number; count: number; latestAt: string | null }
  > = {};
  for (const r of store.logs) {
    const cur = missionAggregates[r.missionId];
    if (!cur) {
      missionAggregates[r.missionId] = {
        sumDur: r.durationSec,
        count: 1,
        latestAt: r.completedAt,
      };
    } else {
      cur.sumDur += r.durationSec;
      cur.count += 1;
    }
  }

  const missionsSummary = MISSION_CATALOG.map((m) => {
    const st = store.stats[m.id];
    const agg = missionAggregates[m.id];
    const completionRate =
      st.views > 0 ? Math.round((st.participants / st.views) * 1000) / 10 : 0;
    const avgDurationSec = agg && agg.count > 0 ? Math.round(agg.sumDur / agg.count) : 0;
    return {
      id: m.id,
      title: m.title,
      category: m.category,
      status: m.status,
      period: m.periodLabel,
      xp: m.xp,
      views: st.views,
      participants: st.participants,
      completionRate,
      avgDurationSec,
      lastParticipatedAt: agg?.latestAt || null,
    };
  });

  const dailyHistoryList = Object.values(store.dailyHistory)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  return {
    stats: publicSummary.stats,
    totalViews: publicSummary.totalViews,
    totalParticipants: publicSummary.totalParticipants,
    totalRecords: store.logs.length,
    filteredTotal: filtered.length,
    dailyTrend: publicSummary.dailyTrend,
    dailyHistoryList,
    missionsSummary,
    records,
    limit,
    offset,
  };
}

function csvCell(val: unknown): string {
  const s = String(val ?? "").replace(/\r\n|\r|\n/g, " ");
  const safe = /^[=+\-@\t]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function exportMissionLogsCsv(missionId?: string): string {
  const store = ensureStore();
  const filterId =
    missionId && missionId !== "all" && isValidMissionId(missionId) ? missionId : null;
  const rows = filterId ? store.logs.filter((r) => r.missionId === filterId) : store.logs;

  const header = [
    "참여번호",
    "완료일시(KST)",
    "참여일자",
    "미션ID",
    "미션명",
    "카테고리",
    "소요시간(초)",
    "획득XP",
    "참여결과요약",
    "접속환경",
  ].join(",");

  const lines = rows.map((r) =>
    [
      csvCell(r.id),
      csvCell(r.completedAt),
      csvCell(r.date),
      csvCell(r.missionId),
      csvCell(r.missionTitle),
      csvCell(r.category),
      csvCell(r.durationSec),
      csvCell(r.xpEarned),
      csvCell(r.resultSummary),
      csvCell(r.device === "mobile" ? "모바일 웹" : "PC 웹"),
    ].join(",")
  );

  return `\uFEFF${header}\n${lines.join("\n")}`;
}
