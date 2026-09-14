import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SignupRequestBody {
  email: string;
  nickname: string;
  password?: string;
  organization?: string;
  birthDate: string; // YYYY-MM-DD
  agreeAge: boolean; // 만 14세 이상 단독 필수 확인
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

// 한국 시간(KST) 기준 만 14세 이상 여부 정밀 계산
function isAtLeast14YearsOld(birthDateStr: string): boolean {
  if (!birthDateStr) return false;
  const match = birthDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const birthYear = parseInt(match[1], 10);
  const birthMonth = parseInt(match[2], 10);
  const birthDay = parseInt(match[3], 10);

  const now = new Date();
  const kstFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = kstFormatter.format(now).split("-");
  const todayYear = parseInt(parts[0], 10);
  const todayMonth = parseInt(parts[1], 10);
  const todayDay = parseInt(parts[2], 10);

  let age = todayYear - birthYear;
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
    age -= 1;
  }

  return age >= 14;
}

const USERS_FILE = getPersistentFilePath("registered_users_v2026.json");

export async function POST(req: Request) {
  try {
    const body: SignupRequestBody = await req.json();
    const { email, nickname, organization, birthDate, agreeAge, agreeTerms, agreePrivacy } = body;

    // 1. 필수 체크박스 검증 (사전 체크된 상태 불가, 단독 별도 확인 필수)
    if (!agreeAge) {
      return NextResponse.json(
        {
          success: false,
          error: "가입일 현재 만 14세 이상임을 확인하는 필수 항목에 동의해 주세요.",
          code: "AGREE_AGE_REQUIRED"
        },
        { status: 400 }
      );
    }

    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json(
        {
          success: false,
          error: "서비스 이용약관 및 개인정보 처리방침에 모두 동의해 주세요.",
          code: "TERMS_REQUIRED"
        },
        { status: 400 }
      );
    }

    // 2. 🛡️ 서버 사이드 KST 기준 연령 조건 강제 재검증
    const isValidAge = isAtLeast14YearsOld(birthDate);

    // 🛑 연령 조건 미달 시 즉시 차단 및 계정 생성 거부 (생년월일 로그 남기지 않음)
    if (!isValidAge) {
      return NextResponse.json(
        {
          success: false,
          error: "본 서비스는 만 14세 이상만 이용할 수 있어 회원가입을 진행할 수 없습니다.",
          code: "AGE_RESTRICTED_UNDER_14"
        },
        { status: 403 }
      );
    }

    if (!email || !nickname) {
      return NextResponse.json(
        {
          success: false,
          error: "아이디(이메일)와 닉네임을 올바르게 입력해 주세요.",
          code: "FIELDS_REQUIRED"
        },
        { status: 400 }
      );
    }

    // 3. 🔒 [개인정보 최소 수집 및 비저장 원칙]
    // 생년월일(birthDate)은 확인 즉시 폐기하며, 서버/DB/로그에 저장하지 않습니다.
    // 오직 만 14세 이상 확인 여부, 확인 일시, 정책 버전만 안전하게 보관합니다.
    const displayNickname = nickname.trim();
    const newUser = {
      id: Date.now(),
      email: email.trim(),
      nickname: displayNickname,
      name: displayNickname,
      organization: (organization || "소속 없음").trim(),
      role: "YOUTH",
      roleLabel: "청소년 서포터즈 (만 14세 이상 인증)",
      isAgeVerified: true,
      ageVerifiedAt: new Date().toISOString(),
      policyVersion: "2026-v1-under14-blocked",
      status: "정상 승인",
      createdAt: new Date().toISOString().split("T")[0]
    };

    // 서버 영구 스토리지에 저장
    try {
      let currentUsers: any[] = [];
      if (fs.existsSync(USERS_FILE)) {
        currentUsers = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      }
      // 이메일 중복 체크
      if (currentUsers.some((u: any) => u.email === newUser.email)) {
        return NextResponse.json(
          { success: false, error: "이미 가입된 이메일 주소입니다.", code: "DUPLICATE_EMAIL" },
          { status: 409 }
        );
      }
      currentUsers.unshift(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(currentUsers, null, 2), "utf-8");
    } catch (saveErr) {
      console.error("[Signup API] Storage save error:", saveErr);
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "만 14세 이상 연령 확인 및 회원가입이 정상 완료되었습니다."
    });
  } catch (err) {
    // 🔒 에러 로그에 생년월일이나 민감정보 노출 방지
    console.error("[Signup API] Unexpected processing error");
    return NextResponse.json(
      { success: false, error: "회원가입 처리 중 오류가 발생했습니다.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
