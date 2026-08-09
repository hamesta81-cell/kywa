import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const cleanTopic = (topic || '').trim() || '청소년 안전';

    // 주제에 가장 적합한 주제별 맞춤 그래픽 SVG / Data URL 생성
    let primaryColor = '#ff2e63';
    let secondaryColor = '#00f5ff';
    let iconSymbol = '🛡️';
    let categoryTitle = '디지털 성범죄 대응';

    if (cleanTopic.includes('딥페이크') || cleanTopic.includes('디지털')) {
      primaryColor = '#ef4444';
      secondaryColor = '#06b6d4';
      iconSymbol = '🔒';
      categoryTitle = 'DIGITAL EMERGENCY';
    } else if (cleanTopic.includes('물놀이') || cleanTopic.includes('여름') || cleanTopic.includes('계곡')) {
      primaryColor = '#0284c7';
      secondaryColor = '#38bdf8';
      iconSymbol = '🏊‍♂️';
      categoryTitle = 'WATER SAFETY';
    } else if (cleanTopic.includes('디톡스') || cleanTopic.includes('스마트폰')) {
      primaryColor = '#8b5cf6';
      secondaryColor = '#ec4899';
      iconSymbol = '📱';
      categoryTitle = 'DIGITAL DETOX';
    } else if (cleanTopic.includes('CPR') || cleanTopic.includes('심폐소생술') || cleanTopic.includes('응급')) {
      primaryColor = '#dc2626';
      secondaryColor = '#fbbf24';
      iconSymbol = '🏥';
      categoryTitle = 'FIRST AID CPR';
    } else if (cleanTopic.includes('킥보드') || cleanTopic.includes('PM') || cleanTopic.includes('안전모')) {
      primaryColor = '#f59e0b';
      secondaryColor = '#10b981';
      iconSymbol = '🚴';
      categoryTitle = 'PM SAFETY GUIDE';
    } else {
      primaryColor = '#4f46e5';
      secondaryColor = '#10b981';
      iconSymbol = '🛡️';
      categoryTitle = 'YOUTH SAFETY';
    }

    // 주제 맞춤 9:16 고화질 그래픽 SVG 이미지 생성
    const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
      <defs>
        <radialGradient id="bg" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.1"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="25" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1080" height="1920" fill="url(#bg)"/>

      <!-- Glowing Decorative Spheres -->
      <circle cx="540" cy="450" r="380" fill="${primaryColor}" opacity="0.15" filter="url(#glow)"/>
      <circle cx="200" cy="1200" r="300" fill="${secondaryColor}" opacity="0.1" filter="url(#glow)"/>

      <!-- Top Header Badge -->
      <rect x="140" y="180" width="800" height="100" rx="50" fill="${primaryColor}" opacity="0.25" stroke="${primaryColor}" stroke-width="4"/>
      <text x="540" y="245" font-family="sans-serif" font-size="42" font-weight="900" fill="${primaryColor}" text-anchor="middle">
        ${categoryTitle}
      </text>

      <!-- Main Visual Symbol Circle -->
      <circle cx="540" cy="580" r="180" fill="url(#cardGrad)" stroke="${secondaryColor}" stroke-width="6" filter="url(#glow)"/>
      <text x="540" y="625" font-size="130" text-anchor="middle">${iconSymbol}</text>

      <!-- Main Title -->
      <text x="540" y="880" font-family="sans-serif" font-size="64" font-weight="900" fill="#ffffff" text-anchor="middle" filter="url(#glow)">
        ${cleanTopic}
      </text>

      <!-- Subtitle Badge -->
      <rect x="140" y="940" width="800" height="80" rx="20" fill="#1e293b" stroke="${secondaryColor}" stroke-width="2"/>
      <text x="540" y="992" font-family="sans-serif" font-size="34" font-weight="700" fill="${secondaryColor}" text-anchor="middle">
        🛡️ 2026 PLAY SAFE 주제 맞춤 AI 시각화 포스터
      </text>

      <!-- Decorative Grid Lines -->
      <path d="M 140 1080 L 940 1080 M 140 1480 L 940 1480" stroke="${primaryColor}" stroke-width="3" opacity="0.4" stroke-dasharray="10 10"/>

      <!-- Footer Info Box -->
      <rect x="140" y="1560" width="800" height="180" rx="30" fill="#0f172a" stroke="${primaryColor}" stroke-width="4"/>
      <text x="540" y="1640" font-family="sans-serif" font-size="40" font-weight="900" fill="${primaryColor}" text-anchor="middle">
        한국청소년활동진흥원 (KYWA) 안전 홍보단
      </text>
      <text x="540" y="1700" font-family="sans-serif" font-size="30" font-weight="700" fill="#cbd5e1" text-anchor="middle">
        실시간 주제 분석 기반 AI 9:16 맞춤 그래픽
      </text>
    </svg>
    `;

    const base64Svg = `data:image/svg+xml;base64,${Buffer.from(svgCode).toString('base64')}`;

    return NextResponse.json({
      success: true,
      topic: cleanTopic,
      imageUrl: base64Svg,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
