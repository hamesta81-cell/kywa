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
    const { title, imageUrl, prompt } = body;
    const userEmail = session.user.email;

    // 2. 입력값 검증
    if (!title || !imageUrl || !prompt || !userEmail) {
      return NextResponse.json({ error: "필수 항목(제목, 이미지, 프롬프트)이 누락되었습니다." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "유효하지 않은 사용자입니다." }, { status: 404 });
    }

    // 3. 공모전 출품작 DB 저장
    const contestEntry = await prisma.contest.create({
      data: {
        userId: user.id,
        title: title,
        imageUrl: imageUrl, // S3에서 발급받은 URL을 저장한다고 가정
        prompt: prompt,
        status: "PENDING"
      }
    });

    return NextResponse.json({ 
      message: "공모전 작품이 성공적으로 접수되었습니다.", 
      entry: contestEntry 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Contest Submit Error:", error);
    return NextResponse.json({ error: "접수 처리 중 서버 오류가 발생했습니다." }, { status: 500 });
  }
}
