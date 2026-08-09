import { NextResponse } from 'next/server';

// XML 파싱을 위한 간단한 정규식 파서 (구글 뉴스 RSS 추출용)
function parseGoogleNewsRss(xmlText: string) {
  const items: any[] = [];
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

  for (let i = 0; i < Math.min(itemMatches.length, 3); i++) {
    const itemXml = itemMatches[i];
    
    // Title & Source 파싱
    const rawTitleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const rawTitle = rawTitleMatch ? rawTitleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '';
    
    let title = rawTitle;
    let source = '언론사';
    if (rawTitle.includes(' - ')) {
      const parts = rawTitle.split(' - ');
      source = parts.pop() || '언론사';
      title = parts.join(' - ');
    }

    // Link 파싱
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '#';

    // PubDate 파싱
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const rawDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const date = rawDate ? new Date(rawDate).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR');

    // Snippet 파싱
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    let snippet = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() : title;
    if (snippet.length > 120) {
      snippet = snippet.substring(0, 120) + '...';
    }

    if (title) {
      items.push({
        id: `real-news-${i + 1}`,
        title,
        source,
        date,
        snippet,
        link
      });
    }
  }
  return items;
}

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const cleanTopic = (topic || '').trim() || '청소년 안전';

    // 1. 구글 뉴스 RSS에서 100% 실제 실시간 한국어 뉴스 크롤링/수집
    let realNewsData = [];
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cleanTopic + ' 청소년')}&hl=ko&gl=KR&ceid=KR:ko`;
      const rssRes = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        next: { revalidate: 60 } // 60초 캐싱
      });

      if (rssRes.ok) {
        const xmlText = await rssRes.text();
        realNewsData = parseGoogleNewsRss(xmlText);
      }
    } catch (e) {
      console.error('구글 뉴스 RSS 크롤링 에러:', e);
    }

    // 구글 뉴스 수집이 비어있는 경우 청소년 안전 실시간 검색어로 재시도
    if (realNewsData.length === 0) {
      try {
        const fallbackUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(cleanTopic)}&hl=ko&gl=KR&ceid=KR:ko`;
        const res = await fetch(fallbackUrl);
        if (res.ok) {
          const xml = await res.text();
          realNewsData = parseGoogleNewsRss(xml);
        }
      } catch (e) {}
    }

    // 2. 대한민국 법제처 국가법령정보센터 실제 조항 매핑
    let realLawData = [];
    if (cleanTopic.includes('딥페이크') || cleanTopic.includes('디지털') || cleanTopic.includes('성범죄')) {
      realLawData = [
        {
          id: 'real-law-1',
          lawName: '성폭력범죄의 처벌 등에 관한 특례법 제14조의2',
          clause: '허위영상물 등의 반포 등 (2024.10 개정)',
          content: '딥페이크 불법 합성 영상물을 제작·반포한 자는 7년 이하의 징역 또는 5천만원 이하의 벌금. 소지·구독·시청한 자는 3년 이하의 징역 또는 3천만원 이하의 벌금에 처함.',
          link: 'https://www.law.go.kr'
        },
        {
          id: 'real-law-2',
          lawName: '아동·청소년의 성보호에 관한 법률 제11조',
          clause: '아동·청소년성착취물의 제작·배포 등',
          content: '아동·청소년성착취물을 제작·수입·수출한 자는 무기징역 또는 5년 이상의 유기징역. 구입·소지·시청한 자는 1년 이상의 유기징역에 처함.',
          link: 'https://www.law.go.kr'
        }
      ];
    } else if (cleanTopic.includes('물놀이') || cleanTopic.includes('여름') || cleanTopic.includes('계곡')) {
      realLawData = [
        {
          id: 'real-law-1',
          lawName: '수상레저안전법 제22조',
          clause: '인명구조장비의 착용 등',
          content: '수상레저활동을 하는 자는 대통령령으로 정하는 바에 따라 구명조끼 등 인명구조장비를 필수 착용하여야 함.',
          link: 'https://www.law.go.kr'
        },
        {
          id: 'real-law-2',
          lawName: '재난 및 안전관리 기본법 제41조',
          clause: '위험구역의 설정 및 통제',
          content: '재난이 발생하거나 발생할 우려가 있는 구역에 대한 출입 통제 명령 위반 시 과태료 부과 및 즉시 퇴장 명령.',
          link: 'https://www.law.go.kr'
        }
      ];
    } else if (cleanTopic.includes('킥보드') || cleanTopic.includes('PM') || cleanTopic.includes('안전모')) {
      realLawData = [
        {
          id: 'real-law-1',
          lawName: '도로교통법 제50조 제10항',
          clause: '개인형 이동장치 인명보호장구 착용 의무',
          content: '개인형 이동장치(PM 전동킥보드 등) 운전자는 인명보호 장구(안전모)를 착용하여야 하며 위반 시 범칙금 부과.',
          link: 'https://www.law.go.kr'
        },
        {
          id: 'real-law-2',
          lawName: '도로교통법 제43조',
          clause: '무면허 운전 등의 금지',
          content: '원동기장치자전거면허 이상의 면허를 취득하지 아니하고 개인형 이동장치를 운전하여서는 아니 됨 (무면허 운전 처벌).',
          link: 'https://www.law.go.kr'
        }
      ];
    } else {
      realLawData = [
        {
          id: 'real-law-1',
          lawName: '청소년 기본법 제8조의2',
          clause: '청소년의 안전 보장',
          content: '국가 및 지방자치단체는 청소년이 유해한 환경으로부터 보호받고 안전한 활동을 영위할 수 있도록 법적·행정적 지원 조치를 취해야 함.',
          link: 'https://www.law.go.kr'
        },
        {
          id: 'real-law-2',
          lawName: '청소년활동 진흥법 제18조',
          clause: '청소년활동 안전점검 및 교육',
          content: '청소년활동 운영자는 사전 안전교육을 실시하고 위급 상황 발생 시 112·119 및 담당 주관 기관에 즉시 신고 조치.',
          link: 'https://www.law.go.kr'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      topic: cleanTopic,
      newsData: realNewsData,
      lawData: realLawData,
      fetchedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
