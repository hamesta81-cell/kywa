import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic, cardnews, news, laws } = await request.json();
    const cleanTopic = (topic || '').trim() || '청소년 안전 수칙';

    // Gamma AI 덱 생성을 위한 깔끔하고 정돈된 한글/영문 통합 프롬프트
    const gammaPrompt = `[Gamma AI Presentation Deck & Card News]
주제: ${cleanTopic} (2026 청소년 안전 가이드)
포맷: 9:16 세로형 스마트 카드뉴스 / 덱 프레젠테이션

[카드 구성]
1. 타이틀: ${cardnews?.badge || '🚨 SAFETY ALERT'} - ${cleanTopic}
2. 서브타이틀: ${cardnews?.subtitle || '청소년 안전 행동 수칙'}
3. 수칙 1: ${cardnews?.step1_title || '위험 요소 인지'} (${cardnews?.step1_desc || ''})
4. 수칙 2: ${cardnews?.step2_title || '긴급 신고'} (${cardnews?.step2_desc || ''})
5. 수칙 3: ${cardnews?.step3_title || '법적 방어'} (${cardnews?.step3_desc || ''})

[팩트 체크 근거]
- 실시간 뉴스: ${news?.[0]?.title || '실시간 보도 수칙'}
- 관련 법령: ${laws?.[0]?.lawName || '청소년 기본법'}
- 24시간 핫라인: ${cardnews?.hotline || '02-735-8994'}

디자인 스타일: 모던 글래스모피즘, 차콜 네이비 배경, 네온 크림슨 & 시안 포인트.`;

    // URL 길이에 의한 차단을 방지하기 위한 정제된 공식 Gamma 생성 페이지 주소
    const gammaAppUrl = `https://gamma.app/new`;

    return NextResponse.json({
      success: true,
      topic: cleanTopic,
      gammaPrompt,
      gammaAppUrl,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
