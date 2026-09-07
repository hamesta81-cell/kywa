import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";
import { sendChallengeNotificationEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSubmissionFilePath(): string {
  return getPersistentFilePath("challenge_submissions.json");
}

function readSubmissions(): any[] {
  try {
    const filePath = getSubmissionFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading challenge submissions:", error);
  }
  return [];
}

function writeSubmissions(submissions: any[]) {
  try {
    const filePath = getSubmissionFilePath();
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing challenge submissions:", error);
  }
}

// 숏폼 챌린지 접수 내역 조회 API
export async function GET() {
  const submissions = readSubmissions();
  return NextResponse.json({
    success: true,
    count: submissions.length,
    data: submissions
  });
}

// 숏폼 챌린지 접수 등록 API
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, author, phone, email, videoUrl, description } = body;

    // 유효성 검증
    if (!category || !author || !phone || !email || !videoUrl || !description) {
      return NextResponse.json(
        { success: false, message: "모든 필수 항목을 입력해 주세요." },
        { status: 400 }
      );
    }

    const submissions = readSubmissions();

    // 접수 번호 생성 (예: CHL-2026-0001)
    const countNumber = String(submissions.length + 1).padStart(4, "0");
    const submissionId = `CHL-2026-${countNumber}`;

    const newEntry = {
      id: submissionId,
      category,
      author,
      phone,
      email,
      videoUrl,
      description,
      submittedAt: new Date().toISOString(),
      status: "접수완료"
    };

    submissions.unshift(newEntry);
    writeSubmissions(submissions);

    // 📧 이메일 발송 (신청자 본인 접수증 + 관리자 접수알림)
    try {
      await sendChallengeNotificationEmail(newEntry);
    } catch (mailErr) {
      console.error("Mail notification failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "숏폼 챌린지 접수가 안전하게 완료되었습니다.",
      data: newEntry
    });
  } catch (error) {
    console.error("Challenge submit API error:", error);
    return NextResponse.json(
      { success: false, message: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
