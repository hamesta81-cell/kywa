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

// 숏폼 챌린지 접수 내역 조회 및 CSV 다운로드 API
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const submissions = readSubmissions();

  if (format === "csv") {
    // 엑셀에서 한글 깨짐 방지를 위한 UTF-8 BOM (\uFEFF)
    let csv = "\uFEFF접수번호,공모부문,참가자/팀명,연락처,이메일,영상URL,기획의도및메시지,접수일시,심사상태\n";
    submissions.forEach(s => {
      const row = [
        `"${s.id || ""}"`,
        `"${s.category || ""}"`,
        `"${(s.author || "").replace(/"/g, '""')}"`,
        `"${s.phone || ""}"`,
        `"${s.email || ""}"`,
        `"${(s.videoUrl || "").replace(/"/g, '""')}"`,
        `"${(s.description || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${s.submittedAt || ""}"`,
        `"${s.status || "접수완료"}"`
      ];
      csv += row.join(",") + "\n";
    });

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="kywa_shortform_submissions_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });
  }

  return NextResponse.json({
    success: true,
    count: submissions.length,
    data: submissions
  });
}

// 숏폼 챌린지 상태 변경 API (관리자용)
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: "ID와 상태값이 필요합니다." }, { status: 400 });
    }

    const submissions = readSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "해당 접수건을 찾을 수 없습니다." }, { status: 404 });
    }

    submissions[index].status = status;
    writeSubmissions(submissions);

    return NextResponse.json({ success: true, message: "상태가 변경되었습니다.", data: submissions[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
}

// 숏폼 챌린지 접수 삭제 API (관리자용)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "삭제할 ID가 필요합니다." }, { status: 400 });
    }

    const submissions = readSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    writeSubmissions(filtered);

    return NextResponse.json({ success: true, message: "접수건이 삭제되었습니다.", remainingCount: filtered.length });
  } catch (error) {
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 });
  }
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
