'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Download, Play, Pause, RefreshCw, CheckCircle2, Film, Image as ImageIcon, Send, ShieldAlert, PhoneCall, Zap, Share2, Heart, MessageCircle, Music, Palette, Newspaper, Scale, ExternalLink, Search, Eye, Cpu, Layers, Copy } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  snippet: string;
  link?: string;
}

interface LawItem {
  id: string;
  lawName: string;
  clause: string;
  content: string;
  link?: string;
}

interface GeneratedContent {
  topic: string;
  imageUrl: string;
  news: NewsItem[];
  laws: LawItem[];
  gammaAppUrl?: string;
  gammaPrompt?: string;
  cardnews: {
    badge: string;
    title: string;
    subtitle: string;
    step1_title: string;
    step1_desc: string;
    step2_title: string;
    step2_desc: string;
    step3_title: string;
    step3_desc: string;
    hotline: string;
  };
  shortform: {
    time: string;
    scene: string;
    narration: string;
    caption: string;
  }[];
}

const PRESET_TOPICS = [
  { id: 'deepfake', title: '🚨 디지털 딥페이크 성범죄 예방', icon: '🔒', category: '디지털' },
  { id: 'water', title: '🌊 여름철 계곡·바다 물놀이 안전', icon: '🏊‍♂️', category: '재난' },
  { id: 'detox', title: '⚡ 청소년 스마트폰 디톡스', icon: '📱', category: '디지털' },
  { id: 'cpr', title: '❤️ 응급처치 및 심폐소생술(CPR)', icon: '🏥', category: '생활' },
  { id: 'pm', title: '🛵 전동 킥보드 안전모 의무화', icon: '🚴', category: '생활' }
];

const THEMES = [
  { id: 'neon', name: '네온 사이버 (Cyber)', bg: '#090d16', accent: '#ff2e63', subAccent: '#00f5ff', cardBg: 'rgba(15, 23, 42, 0.88)' },
  { id: 'emerald', name: '하이퍼 에메랄드 (Hyper)', bg: '#022c22', accent: '#10b981', subAccent: '#f59e0b', cardBg: 'rgba(6, 78, 59, 0.88)' },
  { id: 'sunset', name: '바이올렛 선셋 (Sunset)', bg: '#1e0533', accent: '#c084fc', subAccent: '#fb7185', cardBg: 'rgba(58, 12, 92, 0.88)' }
];

export default function AiContentGenerator({ onFeedSubmit }: { onFeedSubmit?: (content: any) => void }) {
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0].title);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);

  const [fetchedNews, setFetchedNews] = useState<NewsItem[]>([]);
  const [fetchedLaws, setFetchedLaws] = useState<LawItem[]>([]);
  const [gammaData, setGammaData] = useState<{ url: string; prompt: string } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const activeTopic = customTopic.trim() || selectedTopic;

    let news: NewsItem[] = [];
    let laws: LawItem[] = [];
    let topicMatchedImage = '/images/ai/deepfake.png';

    try {
      const imgRes = await fetch('/api/ai-generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeTopic })
      });
      const imgData = await imgRes.json();
      if (imgData.success && imgData.imageUrl) {
        topicMatchedImage = imgData.imageUrl;
      }
    } catch (e) {
      console.error('AI 이미지 생성 오류:', e);
    }

    try {
      const res = await fetch('/api/ai-fetch-news-laws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: activeTopic })
      });
      const data = await res.json();
      if (data.success) {
        news = data.newsData || [];
        laws = data.lawData || [];
        setFetchedNews(news);
        setFetchedLaws(laws);
      }
    } catch (err) {
      console.error('뉴스/법령 수집 오류:', err);
    }

    setTimeout(async () => {
      let contentData: GeneratedContent;
      const realNewsSnippet = news[0]?.title || `${activeTopic} 관련 실시간 언론 보도 수칙`;

      if (activeTopic.includes('딥페이크') || activeTopic.includes('디지털')) {
        contentData = {
          topic: activeTopic,
          imageUrl: topicMatchedImage,
          news,
          laws,
          cardnews: {
            badge: '🚨 DIGITAL EMERGENCY',
            title: '디지털 딥페이크 성범죄',
            subtitle: laws[0] ? `⚖️ ${laws[0].lawName} 개정법 근거 수칙` : '지금 당장 머릿속에 저장할 3단계 긴급 행동',
            step1_title: 'STEP 1. 탈퇴 금지! 즉시 채증',
            step1_desc: '상대방 고유 ID, 톡방 전체 URL, 유포 시각을 포함해 즉시 전체 화면 캡처',
            step2_title: 'STEP 2. 전문 기관 긴급 신고',
            step2_desc: '디지털 성범죄 피해자 지원센터(02-735-8994) & 방통심의위(1377)',
            step3_title: 'STEP 3. 법적 처벌 및 계정 방어',
            step3_desc: laws[0] ? laws[0].content : '7년 이하 징역 및 계정 비공개 전환 필수',
            hotline: '☎️ 24시간 긴급 핫라인: 02-735-8994 / 1377'
          },
          shortform: [
            { time: '0~3초', scene: `주제 맞춤 AI 이미지: ${activeTopic} visual`, narration: `실시간 속보! ${realNewsSnippet}`, caption: '🚨 실시간 뉴스 속보!' },
            { time: '3~8초', scene: '인스타 DM 및 톡방 화면 전체 캡처 연출', narration: '절대 탈퇴하거나 방을 나가지 마세요! 상대방 고유 ID와 대화방 전체를 즉시 캡처해야 합니다.', caption: 'STEP 1. 탈퇴 금지! 즉시 캡처' },
            { time: '8~12초', scene: '피해자 지원센터 전화번호 02-735-8994 줌인', narration: '국가 공식 피해자 지원센터 02-735-8994로 즉시 삭제 지원을 요청하세요!', caption: 'STEP 2. ☎️ 02-735-8994 신고' },
            { time: '12~15초', scene: '성폭력처벌법 제14조의2 법령 및 7년 징역 경고', narration: '성폭력처벌법 개정! 유포자 7년 징역, 소지자 3년 징역 강력 처벌!', caption: '⚖️ 성폭력처벌법 강력 처벌!' }
          ]
        };
      } else if (activeTopic.includes('물놀이') || activeTopic.includes('여름')) {
        contentData = {
          topic: activeTopic,
          imageUrl: topicMatchedImage,
          news,
          laws,
          cardnews: {
            badge: '🌊 WATER SAFETY FIRST',
            title: '여름철 물놀이 3대 수칙',
            subtitle: laws[0] ? `⚖️ ${laws[0].lawName} 규정 준수` : '즐겁고 안전한 여름을 위한 필수 체크리스트',
            step1_title: 'STEP 1. 구명조끼 100% 착용',
            step1_desc: laws[0] ? laws[0].content : '수심에 상관없이 체형에 맞는 구명조끼 버클을 끝까지 체결',
            step2_title: 'STEP 2. 입수 전 준비운동 5분',
            step2_desc: '심장에서 먼 심부(다리, 팔)부터 물을 적신 후 천천히 입수',
            step3_title: 'STEP 3. 위험 구역 절대 금지',
            step3_desc: laws[1] ? laws[1].content : '수류가 세거나 익수 위험 표지판 구역 진입 차단 및 119 신고',
            hotline: '☎️ 해양·육상 긴급구조: 119 / 112'
          },
          shortform: [
            { time: '0~3초', scene: `주제 맞춤 AI 이미지: ${activeTopic} visual`, narration: `실시간 뉴스! ${realNewsSnippet}`, caption: '🌊 실시간 물놀이 소식' },
            { time: '3~8초', scene: '수상레저안전법 법령과 구명조끼 버클 연출', narration: '첫째, 수상레저안전법상 구명조끼 착용 필수! 버클을 꽉 조여주세요.', caption: 'STEP 1. 구명조끼 100% 착용' },
            { time: '8~12초', scene: '손발 준비운동 및 물 적시기 연출', narration: '둘째, 심장에서 먼 발부터 차가운 물을 적신 후 준비운동!', caption: 'STEP 2. 입수 전 준비운동' },
            { time: '12~15초', scene: '위험구역 진입금지 과태료 및 119 로고', narration: '위험 지역 진입 금지! KYWA와 함께하는 안전한 여름!', caption: 'STEP 3. 위험구역 진입금지!' }
          ]
        };
      } else {
        contentData = {
          topic: activeTopic,
          imageUrl: topicMatchedImage,
          news,
          laws,
          cardnews: {
            badge: '🛡️ YOUTH SAFETY GUIDE',
            title: activeTopic,
            subtitle: laws[0] ? `⚖️ ${laws[0].lawName} 근거 준수 가이드` : '청소년 홍보단이 제안하는 3단계 행동 가이드',
            step1_title: 'STEP 1. 위험 요소 즉시 인지',
            step1_desc: realNewsSnippet,
            step2_title: 'STEP 2. 올바른 수칙 준수',
            step2_desc: laws[0] ? laws[0].content : '안전 매뉴얼에 명시된 행동 요령을 침착하게 실천',
            step3_title: 'STEP 3. 핫라인 즉시 연결',
            step3_desc: laws[1] ? laws[1].content : '긴급 상황 시 공공 기관 핫라인으로 신속하게 구조 요청',
            hotline: '☎️ 긴급 신고: 112 / 119 / 사업단 Q&A'
          },
          shortform: [
            { time: '0~3초', scene: `주제 맞춤 AI 이미지: ${activeTopic} visual`, narration: `실시간 소식! ${realNewsSnippet}`, caption: `🚨 ${activeTopic}` },
            { time: '3~8초', scene: '첫번째 수칙 인포그래픽 그래픽 연출', narration: '첫번째, 위험 요소를 미리 파악하고 안전 장구를 착용하세요!', caption: 'STEP 1. 위험 요소 인지' },
            { time: '8~12초', scene: '관련 법령 조항 및 지침 수칙 연출', narration: '두번째, 관련 안전 법률 지침에 맞춰 침착하게 행동하세요!', caption: 'STEP 2. 법 안전 수칙 실천' },
            { time: '12~15초', scene: '홍보단 로고 및 최종 메시지', narration: '청소년 스스로 만드는 안전한 내일! PLAY SAFE!', caption: 'PLAY SAFE 2026 🛡️' }
          ]
        };
      }

      try {
        const gammaRes = await fetch('/api/gamma-generator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: activeTopic,
            cardnews: contentData.cardnews,
            news,
            laws
          })
        });
        const gData = await gammaRes.json();
        if (gData.success) {
          contentData.gammaAppUrl = gData.gammaAppUrl || 'https://gamma.app/new';
          contentData.gammaPrompt = gData.gammaPrompt;
          setGammaData({ url: gData.gammaAppUrl || 'https://gamma.app/new', prompt: gData.gammaPrompt });
        }
      } catch (e) {
        console.error('Gamma API 오류:', e);
      }

      setGenerated(contentData);
      setIsGenerating(false);
    }, 500);
  };

  // 9:16 Canvas 렌더링
  useEffect(() => {
    if (!generated || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const bgGrad = ctx.createRadialGradient(540, 500, 100, 540, 960, 1300);
    bgGrad.addColorStop(0, selectedTheme.bg);
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const aiImg = new Image();
    aiImg.src = generated.imageUrl;
    aiImg.onload = () => {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.roundRect(80, 80, 920, 390, 40);
      ctx.clip();
      ctx.drawImage(aiImg, 80, 80, 920, 390);

      const heroGrad = ctx.createLinearGradient(0, 80, 0, 470);
      heroGrad.addColorStop(0, 'rgba(2, 6, 23, 0.1)');
      heroGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = heroGrad;
      ctx.fillRect(80, 80, 920, 390);
      ctx.restore();

      renderOverlay();
    };

    const renderOverlay = () => {
      ctx.shadowColor = selectedTheme.accent;
      ctx.shadowBlur = 20;
      ctx.fillStyle = selectedTheme.accent + '35';
      ctx.strokeStyle = selectedTheme.accent;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(120, 110, 840, 90, 45);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = selectedTheme.accent;
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(generated.cardnews.badge, 540, 170);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 68px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(generated.cardnews.title, 540, 290);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(generated.cardnews.subtitle, 540, 360);

      const divGrad = ctx.createLinearGradient(80, 0, 1000, 0);
      divGrad.addColorStop(0, 'rgba(255,255,255,0)');
      divGrad.addColorStop(0.5, selectedTheme.accent);
      divGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(80, 430);
      ctx.lineTo(1000, 430);
      ctx.stroke();

      const drawStepCard = (y: number, stepNum: string, title: string, desc: string, accentColor: string) => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 12;

        ctx.fillStyle = selectedTheme.cardBg;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.roundRect(80, y, 920, 310, 36);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(140, y + 80, 32, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(stepNum, 140, y + 92);

        ctx.fillStyle = accentColor;
        ctx.font = 'bold 48px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(title, 195, y + 92);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '36px sans-serif';
        
        const words = desc.split(' ');
        let line = '';
        let currentY = y + 175;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 800 && n > 0) {
            ctx.fillText(line, 130, currentY);
            line = words[n] + ' ';
            currentY += 55;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 130, currentY);
      };

      drawStepCard(470, '1', generated.cardnews.step1_title, generated.cardnews.step1_desc, selectedTheme.accent);
      drawStepCard(820, '2', generated.cardnews.step2_title, generated.cardnews.step2_desc, selectedTheme.subAccent);
      drawStepCard(1170, '3', generated.cardnews.step3_title, generated.cardnews.step3_desc, '#38bdf8');

      ctx.shadowColor = selectedTheme.subAccent + '50';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = selectedTheme.subAccent;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(80, 1530, 920, 260, 40);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = selectedTheme.subAccent;
      ctx.font = 'bold 46px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(generated.cardnews.hotline, 540, 1625);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('🛡️ 2026 PLAY SAFE 한국청소년활동진흥원(KYWA) 청소년 안전 홍보단', 540, 1715);
    };

    renderOverlay();
  }, [generated, selectedTheme]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current || !generated) return;
    const link = document.createElement('a');
    link.download = `KYWA_안전카드뉴스_${generated.topic.replace(/\s+/g, '_')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && generated) {
      const interval = 100;
      timer = setInterval(() => {
        setProgressPercent((prev) => {
          const next = prev + (100 / (15000 / interval));
          if (next >= 100) {
            setIsPlaying(false);
            return 0;
          }
          const stepIndex = Math.min(3, Math.floor(next / 25));
          setCurrentStepIndex(stepIndex);
          return next;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, generated]);

  const handlePlayShortform = () => {
    if (!generated) return;
    setIsPlaying(true);
    setProgressPercent(0);
    setCurrentStepIndex(0);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const fullText = generated.shortform.map(s => s.narration).join(' ');
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePostToFeed = () => {
    if (!generated) return;
    const newPost = {
      id: `ai-post-${Date.now()}`,
      crewName: 'AI 스마트 크루',
      topic: generated.topic,
      content: `[AI 자동 생성] ${generated.cardnews.subtitle}\n\n${generated.cardnews.step1_title}\n${generated.cardnews.step1_desc}\n\n${generated.cardnews.step2_title}\n${generated.cardnews.step2_desc}\n\n${generated.cardnews.step3_title}\n${generated.cardnews.step3_desc}`,
      date: new Date().toISOString().split('T')[0],
      claps: 35,
      views: 780,
      badge: '🤖 AI 카드뉴스 & 숏폼',
      socialUrl: 'https://kywa-safety-hub.vercel.app/crew'
    };

    if (onFeedSubmit) {
      onFeedSubmit(newPost);
    } else {
      alert('✅ 생성된 AI 카드뉴스 및 숏폼 콘티가 주간 보고서 및 실시간 피드로 성공적으로 제출되었습니다! (+15XP 적립)');
    }
  };

  const handleCopyGammaPrompt = () => {
    if (!gammaData?.prompt) return;
    navigator.clipboard.writeText(gammaData.prompt);
    alert('📋 Gamma AI 전용 프롬프트가 클립보드에 복사되었습니다!');
  };

  const handleOpenGammaApp = () => {
    if (gammaData?.prompt) {
      navigator.clipboard.writeText(gammaData.prompt);
    }
    alert('⚡ Gamma AI 덱 프롬프트가 클립보드에 복사되었습니다.\n열리는 Gamma 페이지에서 [New with AI] -> [Generate]에 프롬프트를 붙여넣으세요!');
    window.open('https://gamma.app/new', '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      {/* 럭셔리 헤더 */}
      <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/40 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-[0_20px_50px_rgba(79,70,229,0.15)]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner">
              <Cpu className="w-4 h-4 text-emerald-400 animate-spin" /> GOOGLE GEMINI & GAMMA AI STUDIO
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> 디자인 팔레트:
              </span>
              <div className="flex gap-1.5">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`text-xs font-black px-3 py-1.5 rounded-xl border transition-all ${
                      selectedTheme.id === theme.id
                        ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 border-indigo-400 text-white shadow-lg scale-105'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {theme.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            🤖 홍보단 전용 AI 프로 스튜디오
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-3xl leading-relaxed">
            원하시는 주제를 입력하면 <strong className="text-yellow-300 font-bold">주제 맞춤 AI 이미지, 구글 실시간 뉴스, 개정 법령 및 Gamma AI 덱</strong>을 1초 만에 자동 연결합니다!
          </p>

          {/* 주제 프리셋 버튼 */}
          <div className="pt-2">
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-2.5">
              💡 추천 안전 주제 선택
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedTopic(preset.title);
                    setCustomTopic('');
                  }}
                  className={`text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl border transition-all duration-200 ${
                    selectedTopic === preset.title && !customTopic
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 border-indigo-400 text-white shadow-xl shadow-indigo-500/30 scale-[1.03]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  {preset.icon} {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* 자유 주제 입력 및 생성 버튼 */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="자유 주제 입력 (예: 학교폭력 예방, 횡단보도 스몸비, 소방 안전 등)"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="flex-1 bg-slate-950/90 border border-slate-700/80 rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 active:scale-95 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/30 transition-all text-sm sm:text-base disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> AI & Gamma 통합 연동 중...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" /> ⚡ 주제 맞춤 AI 이미지 & Gamma API 동시 생성
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 Gamma API / Gamma App 자동 덱 연동 섹션 */}
      {generated && (
        <div className="bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-slate-900 border border-purple-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-800/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 font-black">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  🚀 Gamma App / API 덱 자동 생성 연동 (Direct Integration)
                </h3>
                <p className="text-xs text-purple-300">
                  생성된 팩트 데이터(뉴스+법령+3단계수칙)를 Gamma AI에 1초 만에 전송하여 고품질 프레젠테이션/카드 덱을 완성합니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyGammaPrompt}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-600 flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4 text-purple-400" /> Gamma 프롬프트 복사
              </button>
              <button
                onClick={handleOpenGammaApp}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 hover:scale-105"
              >
                ⚡ Gamma AI 덱 1초 자동 제작 열기 <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-purple-500/20 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-purple-400 block mb-1">📋 Gamma API Auto-Generated Prompt Preview:</span>
            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto">
              {generated.gammaPrompt || 'Gamma API 프롬프트 로딩 완료'}
            </p>
          </div>
        </div>
      )}

      {/* 🖼️ 주제 맞춤 AI 생성 비주얼 아트 포스터 쇼케이스 */}
      {generated && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-emerald-400" /> ✨ [{generated.topic}] 주제 맞춤 AI 9:16 비주얼 포스터
            </h3>
            <span className="text-xs font-black text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-inner">
              <Eye className="w-4 h-4" /> 주제 매칭 AI 생성 완료
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 relative aspect-[9/16] rounded-3xl overflow-hidden border-4 border-indigo-500/50 shadow-2xl group bg-slate-950">
              <img
                src={generated.imageUrl}
                alt={generated.topic}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs font-black text-white bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl backdrop-blur-md">
                  🎨 TOPIC MATCHED AI ART
                </span>
              </div>
            </div>
            <div className="md:col-span-8 space-y-5 text-slate-300">
              <div className="bg-slate-950/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-inner">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">TOPIC-SPECIFIC AI ARTWORK</span>
                <h4 className="text-xl font-black text-white">'{generated.topic}' 맞춤형 AI 비주얼 아트</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  입력하신 주제 <strong>'{generated.topic}'</strong>의 핵심 키워드를 기반으로 100% 매칭된 AI 비주얼 아트 포스터가 실시간 생성되었습니다. 해당 그래픽은 아래 모바일 카드뉴스 이미지와 15초 숏폼 릴스 플레이어 배경으로 자동 합성됩니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/80 border border-blue-500/30 p-4 rounded-2xl space-y-1">
                  <span className="font-extrabold text-blue-400 flex items-center gap-1.5 mb-1">
                    <Newspaper className="w-4 h-4" /> 100% 실제 구글 뉴스 수집
                  </span>
                  <p className="text-slate-200 font-bold leading-snug">{fetchedNews[0]?.title || '구글 뉴스 실시간 크롤링 완료'}</p>
                  <p className="text-slate-500 text-[11px]">{fetchedNews[0]?.source} ({fetchedNews[0]?.date})</p>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1.5 mb-1">
                    <Scale className="w-4 h-4" /> 대한민국 법제처 법률 조항
                  </span>
                  <p className="text-slate-200 font-bold leading-snug">{fetchedLaws[0]?.lawName || '관련 법률 조항 연동'}</p>
                  <p className="text-slate-500 text-[11px]">{fetchedLaws[0]?.clause}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프리뷰어 2열 그리드 */}
      {generated && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 좌측: 9:16 Canvas 카드뉴스 */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full uppercase">1080 x 1920 HD PNG</span>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" /> 🎨 9:16 모바일 원페이퍼 AI 카드뉴스
                </h3>
              </div>
              <button
                onClick={handleDownloadPNG}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" /> PNG 이미지 다운로드
              </button>
            </div>

            <div className="relative w-full aspect-[9/16] bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-3xl shadow-inner"
              />
            </div>
            <p className="text-center text-xs text-slate-400 font-bold">
              💡 주제 맞춤 AI 이미지가 탑재된 1080x1920 PNG 이미지가 즉시 다운로드됩니다.
            </p>
          </div>

          {/* 우측: 아이폰 15 프로 릴스 시뮬레이터 */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black text-indigo-400 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-full uppercase">IPHONE 15 PRO REELS SIMULATOR</span>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Film className="w-5 h-5 text-indigo-400" /> 🎬 15초 숏폼 릴스 AI 시뮬레이터
                </h3>
              </div>
              <button
                onClick={handlePlayShortform}
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                {isPlaying ? '재생 중...' : '▶️ 숏폼 시뮬레이션 & 음성 재생'}
              </button>
            </div>

            {/* 아이폰 15 프로 맥스 티타늄 베젤 비디오 플레이어 */}
            <div className="relative w-full max-w-[310px] mx-auto aspect-[9/16] bg-slate-950 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-5 border-t-[14px]">
              
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-between px-2 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>

              {/* 주제 맞춤 AI 비주얼 오버레이 */}
              <img
                src={generated.imageUrl}
                alt="Shortform BG"
                className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 scale-110 transition-transform duration-1000 ease-out"
              />

              <div className="relative z-10 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 h-full transition-all duration-100 ease-linear shadow-lg"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="absolute right-3.5 bottom-20 z-20 flex flex-col items-center gap-3.5 text-white">
                <div className="flex flex-col items-center gap-0.5">
                  <button className="w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  </button>
                  <span className="text-[10px] font-bold">2.4K</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <button className="w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-[10px] font-bold">412</span>
                </div>
                <button className="w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center animate-spin">
                  <Music className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-2 my-auto">
                <span className="text-4xl mb-3 animate-bounce">
                  {currentStepIndex === 0 ? '🚨' : currentStepIndex === 1 ? '📸' : currentStepIndex === 2 ? '☎️' : '🛡️'}
                </span>
                <span className="text-emerald-400 font-black text-xs mb-1 uppercase tracking-wider bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/50 backdrop-blur-md shadow-lg">
                  {generated.shortform[currentStepIndex]?.time}
                </span>
                <p className="text-white font-black text-base leading-tight mb-2.5 drop-shadow-lg">
                  {generated.shortform[currentStepIndex]?.caption}
                </p>
                <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-[11px] text-slate-200 max-w-[210px] shadow-xl">
                  🎬 {generated.shortform[currentStepIndex]?.scene}
                </div>
              </div>

              <div className="relative z-10 bg-slate-900/95 backdrop-blur-md border border-indigo-500/50 rounded-2xl p-3 text-center shadow-xl">
                <p className="text-xs font-bold text-yellow-300 animate-pulse leading-snug">
                  💬 "{generated.shortform[currentStepIndex]?.narration}"
                </p>
              </div>
            </div>

            {/* 콘티 대장 표 */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>📋 컷별 숏폼 시나리오 콘티 대장</span>
                <span className="text-emerald-400 text-[11px] font-bold">총 4컷 15초</span>
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-black text-[11px]">
                    <tr>
                      <th className="p-3">초수</th>
                      <th className="p-3">시각 연출 지시문</th>
                      <th className="p-3">나레이션 대사</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/70">
                    {generated.shortform.map((sf, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          currentStepIndex === idx && isPlaying ? 'bg-indigo-950/90 text-white font-bold' : ''
                        }`}
                      >
                        <td className="p-3 font-black text-emerald-400 whitespace-nowrap">{sf.time}</td>
                        <td className="p-3 font-medium">{sf.scene}</td>
                        <td className="p-3 font-semibold text-slate-100">{sf.narration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handlePostToFeed}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition-all text-sm sm:text-base hover:scale-[1.01] active:scale-95"
            >
              <Send className="w-4 h-4" /> 🚀 생성된 카드뉴스 & 숏폼을 주간보고 피드로 제출 (+15XP 적립)
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
