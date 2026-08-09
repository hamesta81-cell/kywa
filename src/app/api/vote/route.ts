import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    // 1. 인증 확인
    if (!session || !session.user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    
    const body = await req.json();
    const { contentId } = body;
    const userEmail = session.user.email;

    if (!userEmail || !contentId) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    // 유저 ID 조회
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "존재하지 않는 유저입니다." }, { status: 404 });
    }

    // 2. 1인 1회 투표 검증 (Unique 제약조건으로도 막지만 명시적 에러 반환)
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_contentId: {
          userId: user.id,
          contentId: contentId,
        }
      }
    });

    if (existingVote) {
      return NextResponse.json({ error: "이미 투표한 작품입니다." }, { status: 409 });
    }

    // 3. 투표 기록 생성
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        contentId: contentId,
      }
    });

    return NextResponse.json({ message: "투표가 완료되었습니다.", vote }, { status: 201 });
    
  } catch (error) {
    console.error("Vote Error:", error);
    return NextResponse.json({ error: "투표 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
