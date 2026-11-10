import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPersistentDataDir } from "@/lib/diskStorage";
import {
  SATISFACTION_SURVEY as S,
  PROGRAM_QUESTION_ID,
  TEXT_MAX,
  surveyStatus,
  visibleSections,
  type SurveyQuestion,
} from "@/data/satisfactionSurvey";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 설문 응답: 개인정보 없음
type SurveyResponse = { id: string; submittedAt: string; answers: Record<string, string> };
// 경품 응모: 이름·휴대전화만. 응답과 이어지지 않도록 응답 번호·시각을 남기지 않는다.
type EventEntry = {
  id: string;
  name: string;
  phone: string;
  isUnder14: boolean;
  guardianName: string;
  guardianPhone: string;
  submittedOn: string;
};

// 퀴즈 응모 관리와 같은 관리자 키를 쓴다. 원문은 저장소에 두지 않고 SHA-256 값만 비교.
const ADMIN_KEY_SHA256 =
  process.env.QUIZ_ADMIN_KEY_SHA256 || "dffac47725653963194cb7d93a9efe7cc68ac57f32cf53958bded68f1591afbc";

function verifyAdmin(req: Request): boolean {
  const key = req.headers.get("x-quiz-admin-key") || "";
  if (!key) return false;
  const digest = crypto.createHash("sha256").update(key).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(ADMIN_KEY_SHA256);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const onlyDigits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const isPhone = (v: string) => /^01\d{8,9}$/.test(v);
const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
const kstDate = (d: Date) => new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const kstDateTime = (iso: string) =>
  new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);

// /uploads 로 내보내지 않는 private 폴더에 둔다.
function filePath(kind: "responses" | "event"): string {
  const dir = path.join(getPersistentDataDir(), "private");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, kind === "responses" ? `${S.id}.json` : `${S.id}-event.json`);
}

function readList<T>(kind: "responses" | "event"): T[] {
  try {
    const p = filePath(kind);
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (error) {
    console.error("Error reading survey data:", error);
  }
  return [];
}

function writeList(kind: "responses" | "event", list: unknown[]) {
  const p = filePath(kind);
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), "utf-8");
  fs.renameSync(tmp, p);
}

const allQuestions: SurveyQuestion[] = S.sections.flatMap(s => s.questions);

function csvResponse(csv: string, name: string) {
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${name}_${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (!verifyAdmin(req)) {
    // 일반 요청: 건수·개인정보 없이 진행 상태만
    return NextResponse.json({ success: true, status: surveyStatus() });
  }

  if (searchParams.get("format") === "csv") {
    if (searchParams.get("type") === "event") {
      const entries = readList<EventEntry>("event");
      let csv = ["응모번호", "응모일", "이름", "휴대전화", "만14세미만", "법정대리인성명", "법정대리인연락처"].join(",") + "\n";
      for (const e of entries) {
        csv += [e.id, e.submittedOn, e.name, e.phone, e.isUnder14 ? "Y" : "N", e.guardianName, e.guardianPhone]
          .map(csvCell).join(",") + "\n";
      }
      return csvResponse(csv, `${S.csvName}_event_entries`);
    }

    const responses = readList<SurveyResponse>("responses");
    // 첫 줄은 문항 번호, 둘째 줄은 문항 내용
    let csv = ["응답번호", "응답일시(KST)", ...allQuestions.map(q => q.id.toUpperCase())].join(",") + "\n";
    csv += ["", "", ...allQuestions.map(q => q.text)].map(csvCell).join(",") + "\n";
    for (const r of responses) {
      csv += [r.id, kstDateTime(r.submittedAt), ...allQuestions.map(q => r.answers?.[q.id] ?? "")]
        .map(csvCell).join(",") + "\n";
    }
    return csvResponse(csv, `${S.csvName}_responses`);
  }

  return NextResponse.json({
    success: true,
    status: surveyStatus(),
    count: readList<SurveyResponse>("responses").length,
    eventCount: readList<EventEntry>("event").length,
  });
}

// 문항 하나의 답을 검사해 저장할 글자로 바꾼다. 잘못된 답이면 null.
function normalize(q: SurveyQuestion, raw: unknown): string | null {
  const n = q.options?.length ?? 0;
  if (q.kind === "single" || q.kind === "select") {
    const i = Number(raw);
    if (raw === null || raw === undefined || raw === "" || !Number.isInteger(i) || i < 0 || i >= n) return null;
    return q.options![i].label;
  }
  if (q.kind === "scale") {
    const v = Number(raw);
    return Number.isInteger(v) && v >= 1 && v <= 5 ? String(v) : null;
  }
  if (q.kind === "multi") {
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const picks = [...new Set(raw.map(Number))].sort((a, b) => a - b);
    if (picks.some(i => !Number.isInteger(i) || i < 0 || i >= n)) return null;
    return picks.map(i => q.options![i].label).join(" | ");
  }
  const text = String(raw ?? "").trim();
  if (!text) return q.optional ? "" : null;
  return text.slice(0, TEXT_MAX);
}

export async function POST(req: Request) {
  try {
    if (surveyStatus() !== "open") {
      return NextResponse.json({ success: false, message: "조사 기간이 아닙니다." }, { status: 403 });
    }

    const body = await req.json();

    // 자동 입력 방지용 숨은 칸: 채워져 있으면 저장하지 않고 성공처럼 응답
    if (body.website) {
      return NextResponse.json({ success: true, message: "설문이 제출되었습니다." });
    }

    const raw: Record<string, unknown> = body.answers && typeof body.answers === "object" ? body.answers : {};
    const programRaw = raw[PROGRAM_QUESTION_ID];
    const programPicks = Array.isArray(programRaw) ? programRaw.map(Number).filter(Number.isInteger) : [];

    const answers: Record<string, string> = {};
    for (const section of visibleSections(programPicks)) {
      for (const q of section.questions) {
        const value = normalize(q, raw[q.id]);
        if (value === null) {
          return NextResponse.json({ success: false, message: `답하지 않은 문항이 있습니다: ${q.text}` }, { status: 400 });
        }
        answers[q.id] = value;
      }
    }

    // 경품 응모(선택)
    const wantEvent = !!body.wantEvent;
    const name = String(body.name ?? "").trim();
    const phone = onlyDigits(body.phone);
    const isUnder14 = !!body.isUnder14;
    const guardianName = String(body.guardianName ?? "").trim();
    const guardianPhone = onlyDigits(body.guardianPhone);

    if (wantEvent) {
      if (!body.agreePrivacy) {
        return NextResponse.json({ success: false, message: "개인정보 수집·이용에 동의해야 경품에 응모할 수 있습니다." }, { status: 400 });
      }
      if (!name || name.length > 30) {
        return NextResponse.json({ success: false, message: "이름을 확인해 주세요." }, { status: 400 });
      }
      if (!isPhone(phone)) {
        return NextResponse.json({ success: false, message: "휴대전화번호를 확인해 주세요. (예: 010-1234-5678)" }, { status: 400 });
      }
      if (isUnder14 && (!guardianName || !isPhone(guardianPhone) || !body.agreeGuardian)) {
        return NextResponse.json(
          { success: false, message: "만 14세 미만은 법정대리인(보호자)의 이름·연락처와 동의가 필요합니다." },
          { status: 400 }
        );
      }
    }

    // 읽기부터 쓰기까지 await 없이 처리해 동시 접수에도 번호·중복 검사가 꼬이지 않게 한다.
    const entries = readList<EventEntry>("event");
    if (wantEvent && entries.some(e => e.phone === phone)) {
      return NextResponse.json(
        { success: false, message: "이미 참여하신 번호입니다. 설문은 1인 1회 참여할 수 있습니다." },
        { status: 409 }
      );
    }

    const now = new Date();
    const responses = readList<SurveyResponse>("responses");
    const id = `${S.entryPrefix}-${String(responses.length + 1).padStart(5, "0")}`;
    responses.push({ id, submittedAt: now.toISOString(), answers });
    writeList("responses", responses);

    if (wantEvent) {
      entries.push({
        id: `${S.entryPrefix}-E${String(entries.length + 1).padStart(5, "0")}`,
        name,
        phone,
        isUnder14,
        guardianName: isUnder14 ? guardianName : "",
        guardianPhone: isUnder14 ? guardianPhone : "",
        submittedOn: kstDate(now),
      });
      writeList("event", entries);
    }

    return NextResponse.json({ success: true, message: "설문이 제출되었습니다.", entered: wantEvent });
  } catch (error) {
    console.error("Survey submit API error:", error);
    return NextResponse.json({ success: false, message: "서버 처리 중 오류가 발생했습니다. 잠시 뒤 다시 시도해 주세요." }, { status: 500 });
  }
}
