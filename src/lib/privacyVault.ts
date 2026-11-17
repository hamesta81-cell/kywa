import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "zlib";
import { getPersistentDataDir, getPersistentFilePath } from "@/lib/diskStorage";
import { HANNUN_QUIZ } from "@/data/hannunQuiz";
import { SATISFACTION_SURVEY } from "@/data/satisfactionSurvey";

const OX_QUIZ_ID = "hannun-ox-quiz-2026";

export type PrivacyDatasetKey = "shortform" | "hannun_quiz" | "ox_quiz" | "survey_event";
export type PrivacyTarget = PrivacyDatasetKey | "all";
export type PurgeMode = "delete" | "anonymize";

export interface PrivacyDatasetSummary {
  key: PrivacyDatasetKey;
  title: string;
  fileLabel: string;
  piiFields: string[];
  retentionPolicy: string;
  totalRecords: number;
  piiRecords: number;
  anonymizedRecords: number;
  under14Count: number;
  fileSizeBytes: number;
  lastModifiedKst: string | null;
  status: "ACTIVE_PII" | "ANONYMIZED" | "EMPTY_OR_PURGED";
}

export interface PreservedAssetSummary {
  key: string;
  title: string;
  fileLabel: string;
  recordCountLabel: string;
  containsPii: false;
  note: string;
}

export interface PrivacyBackupLog {
  id: string;
  createdAtIso: string;
  createdAtKst: string;
  target: PrivacyTarget;
  sha256: string;
  zipFileName: string;
  zipSizeBytes: number;
  recordCounts: Record<PrivacyDatasetKey, number>;
  executedBy: string;
}

export interface PrivacyPurgeLog {
  id: string;
  purgedAtIso: string;
  purgedAtKst: string;
  datasetKey: PrivacyDatasetKey;
  datasetTitle: string;
  fileLabel: string;
  mode: PurgeMode;
  recordsBefore: number;
  piiRecordsCleared: number;
  recordsAfter: number;
  clearedFields: string[];
  backupSha256: string;
  executedBy: string;
  reason: string;
}

type DatasetDescriptor = {
  key: PrivacyDatasetKey;
  title: string;
  fileLabel: string;
  csvFileName: string;
  jsonFileName: string;
  piiFields: string[];
  retentionPolicy: string;
  resolvePath: () => string;
  hasPii: (row: Record<string, any>) => boolean;
  toCsv: (rows: Record<string, any>[]) => string;
  anonymizeRow: (row: Record<string, any>, idx: number, kstNow: string) => Record<string, any>;
};

function kstParts(date: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  const hour = map.hour === "24" ? "00" : map.hour;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(hour),
    minute: Number(map.minute),
    second: Number(map.second),
    display: `${map.year}-${map.month}-${map.day} ${hour}:${map.minute}:${map.second} KST`,
    compact: `${map.year}${map.month}${map.day}_${hour}${map.minute}${map.second}`,
    dateDash: `${map.year}-${map.month}-${map.day}`,
  };
}

export function formatKst(date: Date = new Date()): string {
  return kstParts(date).display;
}

function privateDir(): string {
  const dir = path.join(getPersistentDataDir(), "private");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function atomicWriteJson(filePath: string, data: unknown) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, filePath);
}

function safeReadArray(filePath: string): Record<string, any>[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function csvCell(value: unknown): string {
  const str = String(value ?? "").replace(/\r\n|\r|\n/g, " ");
  return `"${str.replace(/"/g, '""')}"`;
}

function makeCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push(row.map(csvCell).join(","));
  }
  return `\uFEFF${lines.join("\n")}\n`;
}

function formatQuizCsv(rows: Record<string, any>[]): string {
  const maxQ = rows.reduce((max, r) => Math.max(max, Array.isArray(r.answers) ? r.answers.length : 0), 5);
  const qHeaders = Array.from({ length: maxQ }, (_, i) => `${i + 1}번`);
  const headers = ["응모번호", "이름", "휴대전화", "만14세미만", "법정대리인 이름", "법정대리인 연락처", ...qHeaders, "응모시각"];
  const body = rows.map(r => {
    const ans = Array.isArray(r.answers) ? r.answers : [];
    const qCols = Array.from({ length: maxQ }, (_, i) => ans[i] ?? "");
    return [
      r.id || "",
      r.name || "",
      r.phone || "",
      r.isUnder14 ? "Y" : "N",
      r.guardianName || "",
      r.guardianPhone || "",
      ...qCols,
      r.submittedAt || "",
    ];
  });
  return makeCsv(headers, body);
}

const DATASET_LIST: DatasetDescriptor[] = [
  {
    key: "shortform",
    title: "PLAY SAFE 숏폼 챌린지 공모전 접수자",
    fileLabel: "challenge_submissions.json",
    csvFileName: "01_shortform_challenge_submissions.csv",
    jsonFileName: "01_challenge_submissions.json",
    piiFields: ["성명/팀명(author)", "생년월일(birthDate)", "연락처(phone)", "이메일(email)", "법정대리인 성명·연락처", "소속(organization)", "팀원명단(teamMembers)"],
    retentionPolicy: "공모전 심사·시상·경품 발송 목적 달성 후 지체 없이 파기",
    resolvePath: () => getPersistentFilePath("challenge_submissions.json"),
    hasPii: row =>
      !row?.piiPurged &&
      Boolean(
        row?.author ||
          row?.birthDate ||
          row?.guardianName ||
          row?.guardianPhone ||
          row?.phone ||
          row?.email ||
          row?.organization ||
          row?.teamMembers
      ),
    toCsv: rows => {
      const headers = [
        "접수번호",
        "공모부문",
        "참가구분",
        "참가자/팀명",
        "생년월일",
        "만14세미만여부",
        "법정대리인성명",
        "법정대리인연락처",
        "연락처",
        "이메일",
        "소속",
        "팀원명단",
        "영상URL",
        "기획의도및메시지",
        "접수일시",
        "심사상태",
      ];
      const body = rows.map(s => [
        s.id || "",
        s.category || "",
        s.participantType || "개인",
        s.author || "",
        s.birthDate || "",
        s.isUnder14 ? "만14세미만(보호자동의)" : "만14세이상",
        s.guardianName || "",
        s.guardianPhone || "",
        s.phone || "",
        s.email || "",
        s.organization || "",
        s.teamMembers || "",
        s.videoUrl || "",
        s.description || "",
        s.submittedAt || "",
        s.status || "접수완료",
      ]);
      return makeCsv(headers, body);
    },
    anonymizeRow: (s, idx, kstNow) => ({
      id: s.id || `CHL-ANON-${String(idx + 1).padStart(4, "0")}`,
      category: s.category || "",
      participantType: s.participantType || "individual",
      author: "개인정보 파기(비식별)",
      birthDate: "",
      isUnder14: Boolean(s.isUnder14),
      guardianName: "",
      guardianPhone: "",
      agreeGuardian: false,
      phone: "",
      email: "",
      organization: "",
      teamMembers: "",
      videoUrl: "",
      description: "[개인정보 보호법에 따라 성명·연락처·영상URL·기획의도가 비식별 파기되었습니다.]",
      submittedAt: s.submittedAt || "",
      status: s.status || "접수완료",
      piiPurged: true,
      piiPurgedAt: kstNow,
    }),
  },
  {
    key: "hannun_quiz",
    title: "한눈정보 안전 퀴즈 이벤트 응모자",
    fileLabel: `private/${HANNUN_QUIZ.id}.json`,
    csvFileName: "02_hannun_quiz_entries.csv",
    jsonFileName: `02_${HANNUN_QUIZ.id}.json`,
    piiFields: ["이름(name)", "휴대전화(phone)", "법정대리인 이름(guardianName)", "법정대리인 연락처(guardianPhone)"],
    retentionPolicy: "2026. 11. 12. 당첨자 발표 및 상품 발송 완료 후 지체 없이 파기",
    resolvePath: () => path.join(privateDir(), `${HANNUN_QUIZ.id}.json`),
    hasPii: row =>
      !row?.piiPurged && Boolean(row?.name || row?.phone || row?.guardianName || row?.guardianPhone),
    toCsv: formatQuizCsv,
    anonymizeRow: (r, idx, kstNow) => ({
      id: `ANON-QZ-${String(idx + 1).padStart(5, "0")}`,
      name: "",
      phone: "",
      isUnder14: Boolean(r.isUnder14),
      guardianName: "",
      guardianPhone: "",
      answers: Array.isArray(r.answers) ? r.answers : [],
      submittedAt: r.submittedAt || "",
      piiPurged: true,
      piiPurgedAt: kstNow,
    }),
  },
  {
    key: "ox_quiz",
    title: "한눈정보 OX 퀴즈 이벤트 응모자",
    fileLabel: `private/${OX_QUIZ_ID}.json`,
    csvFileName: "03_ox_quiz_entries.csv",
    jsonFileName: `03_${OX_QUIZ_ID}.json`,
    piiFields: ["이름(name)", "휴대전화(phone)", "법정대리인 이름(guardianName)", "법정대리인 연락처(guardianPhone)"],
    retentionPolicy: "이벤트 종료 및 경품 발송 완료 후 지체 없이 파기",
    resolvePath: () => path.join(privateDir(), `${OX_QUIZ_ID}.json`),
    hasPii: row =>
      !row?.piiPurged && Boolean(row?.name || row?.phone || row?.guardianName || row?.guardianPhone),
    toCsv: formatQuizCsv,
    anonymizeRow: (r, idx, kstNow) => ({
      id: `ANON-OX-${String(idx + 1).padStart(5, "0")}`,
      name: "",
      phone: "",
      isUnder14: Boolean(r.isUnder14),
      guardianName: "",
      guardianPhone: "",
      answers: Array.isArray(r.answers) ? r.answers : [],
      submittedAt: r.submittedAt || "",
      piiPurged: true,
      piiPurgedAt: kstNow,
    }),
  },
  {
    key: "survey_event",
    title: "참여자 만족도 조사 경품 응모자",
    fileLabel: `private/${SATISFACTION_SURVEY.id}-event.json`,
    csvFileName: "04_satisfaction_survey_event_entries.csv",
    jsonFileName: `04_${SATISFACTION_SURVEY.id}-event.json`,
    piiFields: ["이름(name)", "휴대전화(phone)", "법정대리인 이름(guardianName)", "법정대리인 연락처(guardianPhone)"],
    retentionPolicy: "2026. 11. 16. 경품 발송 완료 후 지체 없이 파기 (익명 설문 응답 통계는 별도 보존)",
    resolvePath: () => path.join(privateDir(), `${SATISFACTION_SURVEY.id}-event.json`),
    hasPii: row =>
      !row?.piiPurged && Boolean(row?.name || row?.phone || row?.guardianName || row?.guardianPhone),
    toCsv: rows => {
      const headers = ["응모번호", "이름", "휴대전화", "만14세미만", "법정대리인 이름", "법정대리인 연락처", "참여일(KST)"];
      const body = rows.map(r => [
        r.id || "",
        r.name || "",
        r.phone || "",
        r.isUnder14 ? "Y" : "N",
        r.guardianName || "",
        r.guardianPhone || "",
        r.submittedOn || "",
      ]);
      return makeCsv(headers, body);
    },
    anonymizeRow: (r, idx, kstNow) => ({
      id: `ANON-SV-${String(idx + 1).padStart(5, "0")}`,
      name: "",
      phone: "",
      isUnder14: Boolean(r.isUnder14),
      guardianName: "",
      guardianPhone: "",
      submittedOn: r.submittedOn || "",
      piiPurged: true,
      piiPurgedAt: kstNow,
    }),
  },
];

const DATASET_BY_KEY = new Map<PrivacyDatasetKey, DatasetDescriptor>(DATASET_LIST.map(d => [d.key, d]));

function backupLogsPath(): string {
  return path.join(privateDir(), "privacy_backup_logs.json");
}

function purgeLogsPath(): string {
  return path.join(privateDir(), "privacy_purge_logs.json");
}

export function getBackupLogs(): PrivacyBackupLog[] {
  return safeReadArray(backupLogsPath()) as PrivacyBackupLog[];
}

export function getPurgeLogs(): PrivacyPurgeLog[] {
  return safeReadArray(purgeLogsPath()) as PrivacyPurgeLog[];
}

export function getPrivacyInventory(): PrivacyDatasetSummary[] {
  return DATASET_LIST.map(desc => {
    const filePath = desc.resolvePath();
    const rows = safeReadArray(filePath);
    const piiRecords = rows.filter(r => desc.hasPii(r)).length;
    const anonymizedRecords = rows.filter(r => Boolean(r?.piiPurged)).length;
    const under14Count = rows.filter(r => desc.hasPii(r) && Boolean(r?.isUnder14)).length;

    let fileSizeBytes = 0;
    let lastModifiedKst: string | null = null;
    try {
      if (fs.existsSync(filePath)) {
        const st = fs.statSync(filePath);
        fileSizeBytes = st.size;
        lastModifiedKst = formatKst(st.mtime);
      }
    } catch {}

    const status: PrivacyDatasetSummary["status"] =
      piiRecords > 0 ? "ACTIVE_PII" : anonymizedRecords > 0 ? "ANONYMIZED" : "EMPTY_OR_PURGED";

    return {
      key: desc.key,
      title: desc.title,
      fileLabel: desc.fileLabel,
      piiFields: desc.piiFields,
      retentionPolicy: desc.retentionPolicy,
      totalRecords: rows.length,
      piiRecords,
      anonymizedRecords,
      under14Count,
      fileSizeBytes,
      lastModifiedKst,
      status,
    };
  });
}

export function getPreservedAssetsSummary(): PreservedAssetSummary[] {
  const assets: PreservedAssetSummary[] = [];

  // 1. 만족도 조사 익명 응답
  const surveyResponsesPath = path.join(privateDir(), `${SATISFACTION_SURVEY.id}.json`);
  const surveyResponses = safeReadArray(surveyResponsesPath);
  assets.push({
    key: "survey_responses",
    title: "만족도 조사 비식별 설문 응답",
    fileLabel: `private/${SATISFACTION_SURVEY.id}.json`,
    recordCountLabel: `${surveyResponses.length.toLocaleString()}건`,
    containsPii: false,
    note: "문항별 응답 통계 전용(성명·연락처 미포함) — 파기 대상에서 자동 제외되어 그대로 보존됩니다.",
  });

  // 2. 안전 미션 허브 참여 로그 및 통계
  const missionLogsPath = path.join(privateDir(), "mission_participation_logs.json");
  const missionLogs = safeReadArray(missionLogsPath);
  assets.push({
    key: "mission_logs",
    title: "안전 미션 허브 참여 로그·집계",
    fileLabel: "private/mission_participation_logs.json & mission_stats.json",
    recordCountLabel: missionLogs.length > 0 ? `${missionLogs.length.toLocaleString()}건` : "기본 통계 7,662건",
    containsPii: false,
    note: "익명 ID·미션코드·시각·소스만 포함(성명·연락처·IP 미저장) — 파기 시에도 운영 통계는 유지됩니다.",
  });

  // 3. 사이트 방문자 통계
  let visitorLabel = "집계 파일 확인";
  try {
    const visitorPath = getPersistentFilePath("site_visitors_v1.json");
    if (fs.existsSync(visitorPath)) {
      const parsed = JSON.parse(fs.readFileSync(visitorPath, "utf-8"));
      if (typeof parsed?.total === "number") {
        visitorLabel = `누적 ${Number(parsed.total).toLocaleString()}명`;
      }
    }
  } catch {}
  assets.push({
    key: "site_visitors",
    title: "플랫폼 누적·일일 방문자 통계",
    fileLabel: "site_visitors_v1.json",
    recordCountLabel: visitorLabel,
    containsPii: false,
    note: "단순 일별 카운트만 저장(IP·개인정보 미저장) — 파기 대상 아님.",
  });

  // 4. 16개 안전홍보단 주간보고서
  let crewReportsLabel = "공식 활동보고서";
  try {
    const crewPath = getPersistentFilePath("permanent_crew_db.json");
    const crewList = safeReadArray(crewPath);
    if (crewList.length > 0) {
      crewReportsLabel = `${crewList.length.toLocaleString()}건`;
    }
  } catch {}
  assets.push({
    key: "crew_reports",
    title: "안전홍보단 16개 팀 활동보고서",
    fileLabel: "permanent_crew_db.json",
    recordCountLabel: crewReportsLabel,
    containsPii: false,
    note: "홍보단 팀 단위 공식 활동 결과물 — 파기 대상에서 제외되어 보존됩니다.",
  });

  return assets;
}

// ---------- 순수 Node.js PKZIP 빌더 (UTF-8 파일명 플래그 + DEFLATE 압축) ----------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date = new Date()): { dosTime: number; dosDate: number } {
  const k = kstParts(date);
  const year = Math.max(1980, k.year);
  const dosTime = ((k.hour & 0x1f) << 11) | ((k.minute & 0x3f) << 5) | ((k.second >> 1) & 0x1f);
  const dosDate = (((year - 1980) & 0x7f) << 9) | ((k.month & 0x0f) << 5) | (k.day & 0x1f);
  return { dosTime, dosDate };
}

export function buildZipArchive(entries: { name: string; data: Buffer }[], now: Date = new Date()): Buffer {
  const { dosTime, dosDate } = dosDateTime(now);
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name.replace(/\\/g, "/"), "utf-8");
    const raw = entry.data;
    const compressed = zlib.deflateRawSync(raw);
    const crc = crc32(raw);

    // Local File Header (30 bytes + filename)
    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4); // version needed to extract (2.0)
    lfh.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    lfh.writeUInt16LE(8, 8); // compression method: DEFLATE
    lfh.writeUInt16LE(dosTime, 10);
    lfh.writeUInt16LE(dosDate, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(compressed.length, 18);
    lfh.writeUInt32LE(raw.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28); // extra len

    localParts.push(lfh, nameBuf, compressed);

    // Central Directory Header (46 bytes + filename)
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4); // version made by
    cdh.writeUInt16LE(20, 6); // version needed
    cdh.writeUInt16LE(0x0800, 8); // UTF-8 flag
    cdh.writeUInt16LE(8, 10); // DEFLATE
    cdh.writeUInt16LE(dosTime, 12);
    cdh.writeUInt16LE(dosDate, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(compressed.length, 20);
    cdh.writeUInt32LE(raw.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30); // extra len
    cdh.writeUInt16LE(0, 32); // comment len
    cdh.writeUInt16LE(0, 34); // disk start
    cdh.writeUInt16LE(0, 36); // internal attrs
    cdh.writeUInt32LE(0, 38); // external attrs
    cdh.writeUInt32LE(offset, 42); // relative offset of local header

    centralParts.push(cdh, nameBuf);
    offset += lfh.length + nameBuf.length + compressed.length;
  }

  const centralDir = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDir, eocd]);
}

function sha256Hex(buf: Buffer | string): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function resolveTargetDescriptors(target: PrivacyTarget): DatasetDescriptor[] {
  if (target === "all") return DATASET_LIST;
  const found = DATASET_BY_KEY.get(target);
  if (!found) {
    throw new Error(`알 수 없는 개인정보 데이터셋 대상입니다: ${String(target)}`);
  }
  return [found];
}

export function createPrivacyBackupBundle(target: PrivacyTarget, executedBy: string) {
  const now = new Date();
  const kst = kstParts(now);
  const descriptors = resolveTargetDescriptors(target);

  const entries: { name: string; data: Buffer }[] = [];
  const checksumLines: string[] = [];
  const recordCounts: Record<PrivacyDatasetKey, number> = {
    shortform: 0,
    hannun_quiz: 0,
    ox_quiz: 0,
    survey_event: 0,
  };

  const summaryRows: string[] = [];

  for (const desc of descriptors) {
    const filePath = desc.resolvePath();
    const rows = safeReadArray(filePath);
    const piiCount = rows.filter(r => desc.hasPii(r)).length;
    recordCounts[desc.key] = rows.length;

    const csvBuf = Buffer.from(desc.toCsv(rows), "utf-8");
    const jsonBuf = Buffer.from(JSON.stringify(rows, null, 2), "utf-8");
    const csvEntryPath = `01_csv/${desc.csvFileName}`;
    const jsonEntryPath = `02_json/${desc.jsonFileName}`;

    entries.push({ name: csvEntryPath, data: csvBuf });
    entries.push({ name: jsonEntryPath, data: jsonBuf });

    checksumLines.push(`${sha256Hex(csvBuf)}  ${csvEntryPath}`);
    checksumLines.push(`${sha256Hex(jsonBuf)}  ${jsonEntryPath}`);
    summaryRows.push(
      `- [${desc.key}] ${desc.title}\n  파일: ${desc.fileLabel}\n  전체 레코드: ${rows.length}건 (개인정보 포함: ${piiCount}건)\n  파기 기준: ${desc.retentionPolicy}`
    );
  }

  const preserved = getPreservedAssetsSummary();
  const preservedJsonBuf = Buffer.from(JSON.stringify(preserved, null, 2), "utf-8");
  entries.push({ name: "03_preserved_stats/preserved_assets_status.json", data: preservedJsonBuf });
  checksumLines.push(`${sha256Hex(preservedJsonBuf)}  03_preserved_stats/preserved_assets_status.json`);

  const readmeText = [
    "====================================================================",
    "KYWA 청소년활동 안전문화 확산 플랫폼(kywasafe.kr) 개인정보 별도 백업본",
    "====================================================================",
    `생성 일시: ${kst.display}`,
    `백업 대상: ${target}`,
    `생성 관리자: ${executedBy}`,
    "",
    "[포함된 개인정보 백업 내역]",
    ...summaryRows,
    "",
    "[보존되는 비식별 통계 내역 (파기 대상 제외)]",
    ...preserved.map(p => `- ${p.title} (${p.fileLabel}): ${p.recordCountLabel}`),
    "",
    "[보안 및 보관 주의사항]",
    "1. 본 압축 파일 내 CSV·JSON에는 이름, 생년월일, 연락처 등 개인정보가 포함되어 있습니다.",
    "2. 내부 감사·정산·경품 발송 증빙 용도로만 암호화된 사내 저장소/잠금 폴더에 안전하게 보관하고,",
    "   법정·지침상 보유 기간 만료 시 사내 백업본도 함께 지체 없이 파기하시기 바랍니다.",
    "3. 사이트 내 파기 실행 시 SHA256SUMS.txt 또는 ZIP SHA-256 해시가 파기 대장에 기록됩니다.",
    "",
  ].join("\n");

  const readmeBuf = Buffer.from(`\uFEFF${readmeText}`, "utf-8");
  const sumsBuf = Buffer.from(`${checksumLines.join("\n")}\n`, "utf-8");

  entries.unshift({ name: "00_BACKUP_README.txt", data: readmeBuf });
  entries.push({ name: "SHA256SUMS.txt", data: sumsBuf });

  const zipBuffer = buildZipArchive(entries, now);
  const sha256 = sha256Hex(zipBuffer);
  const zipFileName = `kywa_privacy_backup_${target}_${kst.compact}.zip`;

  const logEntry: PrivacyBackupLog = {
    id: `BKP-${kst.compact}-${sha256.slice(0, 8)}`,
    createdAtIso: now.toISOString(),
    createdAtKst: kst.display,
    target,
    sha256,
    zipFileName,
    zipSizeBytes: zipBuffer.length,
    recordCounts,
    executedBy,
  };

  const existingLogs = getBackupLogs();
  atomicWriteJson(backupLogsPath(), [logEntry, ...existingLogs].slice(0, 100));

  return {
    zipBuffer,
    zipFileName,
    sha256,
    logEntry,
  };
}

function cleanupBackupTempFiles(filePath: string) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  try {
    const bak = `${filePath}.bak`;
    if (fs.existsSync(bak)) fs.unlinkSync(bak);
    if (fs.existsSync(dir)) {
      for (const name of fs.readdirSync(dir)) {
        if (name.startsWith(`${base}.`) && name.endsWith(".tmp")) {
          fs.unlinkSync(path.join(dir, name));
        }
      }
    }
  } catch {}
}

export function purgePrivacyDatasets(params: {
  target: PrivacyTarget;
  mode: PurgeMode;
  backupSha256: string;
  executedBy: string;
  reason?: string;
}): { results: PrivacyPurgeLog[]; backupVerified: PrivacyBackupLog } {
  const { target, mode, backupSha256, executedBy, reason } = params;
  const normalizedHash = String(backupSha256 || "").trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalizedHash)) {
    throw new Error("유효한 백업 SHA-256 검증 값이 없습니다. 먼저 [1단계: 개인정보 백업 ZIP 다운로드]를 진행해 주세요.");
  }

  const backupLogs = getBackupLogs();
  const matchedBackup = backupLogs.find(b => b.sha256.toLowerCase() === normalizedHash);
  if (!matchedBackup) {
    throw new Error("서버에 기록된 백업 이력과 일치하지 않습니다. 최신 백업 ZIP을 다시 다운로드한 뒤 파기를 진행해 주세요.");
  }

  if (matchedBackup.target !== "all" && matchedBackup.target !== target) {
    throw new Error(
      `다운로드한 백업본(${matchedBackup.target})은 선택한 파기 대상(${target})을 포함하지 않습니다. [전체 통합 백업] 또는 해당 대상의 백업을 먼저 받아 주세요.`
    );
  }

  const descriptors = resolveTargetDescriptors(target);

  // 백업 이후 새 개인정보가 들어왔는지 교차 확인 (백업 누락 방지)
  for (const desc of descriptors) {
    const currentRows = safeReadArray(desc.resolvePath());
    const backedCount = Number(matchedBackup.recordCounts?.[desc.key] ?? 0);
    if (currentRows.length > backedCount) {
      throw new Error(
        `[${desc.title}] 백업 시점(${backedCount}건)보다 현재 데이터(${currentRows.length}건)가 더 많습니다. 유실 방지를 위해 최신 백업을 다시 받아 주세요.`
      );
    }
  }

  const now = new Date();
  const kst = kstParts(now);
  const existingPurgeLogs = getPurgeLogs();
  const createdLogs: PrivacyPurgeLog[] = [];

  for (const desc of descriptors) {
    const filePath = desc.resolvePath();
    const beforeRows = safeReadArray(filePath);
    const piiBefore = beforeRows.filter(r => desc.hasPii(r)).length;

    const nextRows = mode === "delete" ? [] : beforeRows.map((r, idx) => desc.anonymizeRow(r, idx, kst.display));

    atomicWriteJson(filePath, nextRows);
    cleanupBackupTempFiles(filePath);

    const log: PrivacyPurgeLog = {
      id: `PURGE-${kst.compact}-${desc.key.toUpperCase()}`,
      purgedAtIso: now.toISOString(),
      purgedAtKst: kst.display,
      datasetKey: desc.key,
      datasetTitle: desc.title,
      fileLabel: desc.fileLabel,
      mode,
      recordsBefore: beforeRows.length,
      piiRecordsCleared: piiBefore,
      recordsAfter: nextRows.length,
      clearedFields: desc.piiFields,
      backupSha256: normalizedHash,
      executedBy,
      reason: String(reason || "수집·이용 목적 달성(심사·추첨·경품 발송 완료)에 따른 별도 백업 후 영구 파기").trim(),
    };
    createdLogs.push(log);
  }

  atomicWriteJson(purgeLogsPath(), [...createdLogs, ...existingPurgeLogs].slice(0, 500));

  return {
    results: createdLogs,
    backupVerified: matchedBackup,
  };
}

export function buildPurgeLedgerCsv(): string {
  const logs = getPurgeLogs();
  const headers = [
    "파기관리번호",
    "파기일시(KST)",
    "데이터셋키",
    "대상업무명",
    "저장파일경로",
    "파기방식",
    "파기전전체건수",
    "파기된개인정보건수",
    "파기후잔존건수",
    "파기항목",
    "사전백업SHA256",
    "처리담당자",
    "파기사유",
  ];
  const rows = logs.map(l => [
    l.id,
    l.purgedAtKst,
    l.datasetKey,
    l.datasetTitle,
    l.fileLabel,
    l.mode === "delete" ? "완전삭제(레코드 초기화)" : "비식별화(개인정보 소거)",
    l.recordsBefore,
    l.piiRecordsCleared,
    l.recordsAfter,
    l.clearedFields.join(" / "),
    l.backupSha256,
    l.executedBy,
    l.reason,
  ]);
  return makeCsv(headers, rows);
}

export async function getOptionalDatabaseStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  userCount: number | null;
  contestCount: number | null;
  note: string;
}> {
  if (!process.env.DATABASE_URL) {
    return {
      configured: false,
      connected: false,
      userCount: null,
      contestCount: null,
      note: "Render 서비스는 DATABASE_URL 미설정 상태이며 모든 참여자 정보는 영구 디스크(/var/data) 파일로만 관리됩니다.",
    };
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const [u, c] = await Promise.all([
      prisma?.user?.count ? prisma.user.count() : null,
      prisma?.contest?.count ? prisma.contest.count() : null,
    ]);
    return {
      configured: true,
      connected: typeof u === "number" || typeof c === "number",
      userCount: typeof u === "number" ? u : null,
      contestCount: typeof c === "number" ? c : null,
      note: "외부 PostgreSQL DATABASE_URL이 감지되었습니다.",
    };
  } catch {
    return {
      configured: true,
      connected: false,
      userCount: null,
      contestCount: null,
      note: "DATABASE_URL이 설정되어 있으나 DB 응답이 없어 영구 디스크 기준으로 관리됩니다.",
    };
  }
}
