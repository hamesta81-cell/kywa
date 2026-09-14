import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "PLAY SAFE 2026 플랫폼은 별도의 회원가입 절차 없이 누구나 자유롭게 이용하실 수 있습니다.",
    signupRequired: false,
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "본 플랫폼은 이용자 개인정보 보호를 위해 별도의 회원가입을 운영하지 않습니다. 닉네임 간편 입장으로 즉시 참여하실 수 있습니다.",
      code: "NO_SIGNUP_REQUIRED",
    },
    { status: 200 }
  );
}
