import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getPersistentDataDir } from "@/lib/diskStorage";
import { HANNUN_QUIZ, quizStatus } from "@/data/hannunQuiz";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type QuizEntry = {
  id: string;
  name: string;
  phone: string;
  isUnder14: boolean;
  guardianName: string;
  guardianPhone: string;
  answers: string[];
  submittedAt: string;
};

// 응모 내용은 /uploads 로 내보내지 않는 private 폴더에 둔다.
function getQuizFilePath(): string {
  const dir = path.join(getPersistentDataDir(), "private");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${HANNUN_QUIZ.id}.json`);
}

function readEntries(): QuizEntry[] {
  try {
    const filePath = getQuizFilePath();
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("Error reading quiz entries:", error);
  }
  return [];
}

function writeEntries(entries: QuizEntry[]) {
  const filePath = getQuizFilePath();
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(entries, null, 2), "utf-8");
  fs.renameSync(tmp, filePath);
}

// 관리자 키 원문은 저장소에 두지 않는다(공개 저장소). SHA-256 값만 비교.
const QUIZ_ADMIN_KEY_SHA256 =
  process.env.QUIZ_ADMIN_KEY_SHA256 || "dffac47725653963194cb7d93a9efe7cc68ac57f32cf53958bded68f1591afbc";

function verifyAdmin(req: Request): boolean {
  const key = req.headers.get("x-quiz-admin-key") || "";
  if (!key) return false;
  const digest = crypto.createHash("sha256").update(key).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(QUIZ_ADMIN_KEY_SHA256);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const onlyDigits = (v: unknown) => String(v ?? "").replace(/\D/g, "");
const isPhone = (v: string) => /^01\d{8,9}$/.test(v);
const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (!verifyAdmin(req)) {
    // 일반 요청: 개인정보·건수 없이 진행 상태만
    return NextResponse.json({ success: true, status: quizStatus() });
  }

  const entries = readEntries();

  if (searchParams.get("format") === "csv") {
    const qHeads = HANNUN_QUIZ.questions.map(q => `Q${q.no}`);
    let csv = "﻿" + ["접수번호", "응모일시(KST)", "이름", "휴대전화", "만14세미만", "법정대리인성명", "법정대리인연락처", ...qHeads].join(",") + "\n";
    for (const e of entries) {
      const kst = new Date(new Date(e.submittedAt).getTime() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);
      csv += [
        e.id, kst, e.name, e.phone, e.isUnder14 ? "Y" : "N", e.guardianName, e.guardianPhone,
        ...HANNUN_QUIZ.questions.map((_, i) => (e.answers || [])[i]),
      ].map(csvCell).join(",") + "\n";
    }
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="hannun_quiz_entries_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const under14 = entries.filter(e => e.isUnder14).length;
  return NextResponse.json({ success: true, status: quizStatus(), count: entries.length, under14 });
}

export async function POST(req: Request) {
  try {
    if (quizStatus() !== "open") {
      return NextResponse.json({ success: false, message: "응모 기간이 아닙니다." }, { status: 403 });
    }

    const body = await req.json();

    // 자동 입력 방지용 숨은 칸: 채워져 있으면 저장하지 않고 성공처럼 응답
    if (body.website) {
      return NextResponse.json({ success: true, message: "응모가 완료되었습니다." });
    }

    const name = String(body.name ?? "").trim();
    const phone = onlyDigits(body.phone);
    const isUnder14 = !!body.isUnder14;
    const guardianName = String(body.guardianName ?? "").trim();
    const guardianPhone = onlyDigits(body.guardianPhone);
    const answers: unknown[] = Array.isArray(body.answers) ? body.answers : [];

    if (!body.agreePrivacy) {
      return NextResponse.json({ success: false, message: "개인정보 수집·이용에 동의해야 응모할 수 있습니다." }, { status: 400 });
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

    const picked: string[] = [];
    for (let i = 0; i < HANNUN_QUIZ.questions.length; i++) {
      const q = HANNUN_QUIZ.questions[i];
      const idx = Number(answers[i]);
      if (!Number.isInteger(idx) || idx < 0 || idx >= q.options.length) {
        return NextResponse.json({ success: false, message: `Q${q.no} 답을 골라 주세요.` }, { status: 400 });
      }
      picked.push(q.options[idx]);
    }

    // 읽기부터 쓰기까지 await 없이 처리해 동시 접수에도 번호·중복 검사가 꼬이지 않게 한다.
    const entries = readEntries();
    if (entries.some(e => e.phone === phone)) {
      return NextResponse.json(
        { success: false, message: "이미 응모하신 번호입니다. 이벤트는 1인 1회 응모할 수 있습니다." },
        { status: 409 }
      );
    }

    const id = `QZ-2026-${String(entries.length + 1).padStart(5, "0")}`;
    entries.push({
      id,
      name,
      phone,
      isUnder14,
      guardianName: isUnder14 ? guardianName : "",
      guardianPhone: isUnder14 ? guardianPhone : "",
      answers: picked,
      submittedAt: new Date().toISOString(),
    });
    writeEntries(entries);

    return NextResponse.json({ success: true, message: "응모가 완료되었습니다.", id });
  } catch (error) {
    console.error("Quiz submit API error:", error);
    return NextResponse.json({ success: false, message: "서버 처리 중 오류가 발생했습니다. 잠시 뒤 다시 시도해 주세요." }, { status: 500 });
  }
}
