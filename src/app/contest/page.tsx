"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  Award, Trophy, Sparkles, Send, CheckCircle2, Upload, FileText, 
  Vote, Calendar, Heart, ShieldCheck, AlertCircle, Eye, ChevronRight, 
  HelpCircle, ArrowRight, User, Star, Download, Bot, Lightbulb, 
  Flame, Smartphone, CloudRain, Activity, Smile, Video, BookOpen, 
  Layers, Music, Play, Radio, Share2, Film, ExternalLink, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function ContestContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"challenge" | "info" | "submit" | "guidelines">("challenge");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "vote" || tabParam === "challenge" || tabParam === "shortform") {
      setActiveTab("challenge");
    } else if (tabParam === "info" || tabParam === "contest") {
      setActiveTab("info");
    } else if (tabParam === "submit") {
      setActiveTab("submit");
    } else if (tabParam === "guidelines") {
      setActiveTab("guidelines");
    }
  }, [searchParams]);

  // 1. PLAY SAFE 숏폼 챌린지 갤러리 데이터
  const shortformEntries = [
    {
      id: 1,
      title: "KYWA ㅋㅋㅋ 챌린지 안무 완벽 커버! 💃",
      category: "댄스 부문 (공식 안무)",
      platform: "Instagram Reels",
      author: "안전 탭앤톡 크루",
      votes: 1840,
      views: "12.4K",
      thumbnail: "from-rose-500 to-amber-500",
      videoUrl: "https://www.instagram.com/reels/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    },
    {
      id: 2,
      title: "물놀이 3초 골든타임! 침수 상황극 숏폼 🎬",
      category: "크리에이티브 부문 (상황극)",
      platform: "YouTube Shorts",
      author: "안전.zip 팀",
      votes: 1520,
      views: "18.9K",
      thumbnail: "from-blue-500 to-cyan-500",
      videoUrl: "https://www.youtube.com/shorts/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    },
    {
      id: 3,
      title: "ㅋㅋㅋ 음원에 맞춘 청소년 힐링 우드카빙 댄스 🌲",
      category: "댄스 부문 (퍼포먼스 창작)",
      platform: "Instagram Reels",
      author: "심리지원단 파인",
      votes: 1290,
      views: "9.8K",
      thumbnail: "from-purple-500 to-pink-500",
      videoUrl: "https://www.instagram.com/reels/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    },
    {
      id: 4,
      title: "청소년 딥페이크 3초 구별법 애니메이션 숏폼 📱",
      category: "크리에이티브 부문 (정보형)",
      platform: "YouTube Shorts",
      author: "세이프 가디언즈",
      votes: 1150,
      views: "14.2K",
      thumbnail: "from-emerald-500 to-teal-500",
      videoUrl: "https://www.youtube.com/shorts/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    },
    {
      id: 5,
      title: "통학로 안심 보행 ㅋㅋㅋ 댄스 브이로그 🎒",
      category: "크리에이티브 부문 (브이로그)",
      platform: "Instagram Reels",
      author: "이투스 청소년팀",
      votes: 980,
      views: "8.1K",
      thumbnail: "from-amber-500 to-orange-500",
      videoUrl: "https://www.instagram.com/reels/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    },
    {
      id: 6,
      title: "소화기 사용법 ㅋㅋㅋ 음원 리믹스 챌린지 🧯",
      category: "댄스 부문 (공식 안무)",
      platform: "YouTube Shorts",
      author: "청디가드 크루",
      votes: 890,
      views: "7.6K",
      thumbnail: "from-red-500 to-rose-600",
      videoUrl: "https://www.youtube.com/shorts/",
      tags: ["#KYWA", "#한국청소년활동진흥원", "#PLAYSAFE"]
    }
  ];

  // 2. AI 안전공모전 5대 주제
  const contestTopics = [
    { no: "01", title: "재난안전", icon: CloudRain, color: "#2563eb", bgColor: "bg-blue-50", borderColor: "border-blue-200", desc: "자연·사회·복합재난 위기 대응력 증진, 취약지역 사각지대 개선" },
    { no: "02", title: "청소년활동안전", icon: Activity, color: "#059669", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", desc: "청소년활동 사고 예방 안전수칙, 수련시설 안전 점검 우수사례" },
    { no: "03", title: "생활안전", icon: Flame, color: "#d97706", bgColor: "bg-amber-50", borderColor: "border-amber-200", desc: "약물·의약품 오남용 예방, 일상 속 낙상·교통·화재 예방 행동수칙" },
    { no: "04", title: "디지털안전", icon: Smartphone, color: "#0284c7", bgColor: "bg-sky-50", borderColor: "border-sky-200", desc: "인공지능 악용 범죄(딥페이크 등) 예방, 개인정보 및 사이버폭력 예방" },
    { no: "05", title: "심리·정서안전", icon: Smile, color: "#7c3aed", bgColor: "bg-purple-50", borderColor: "border-purple-200", desc: "청소년 정서 지원(상담·멘토링), 정신건강 관리(우울·불안 조절) 및 힐링" }
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-10 selection:bg-[#1558C9] selection:text-white">
      
      {/* 상단 탭 네비게이션 */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("challenge")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "challenge"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Trophy size={14} className="text-white" />
            <span>🎬 PLAY SAFE 숏폼 챌린지</span>
            <span className="px-1.5 py-0.2 text-[9px] font-black bg-white text-amber-600 rounded-full">HOT</span>
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "info"
                ? "bg-[#1558C9] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Sparkles size={14} />
            <span>🏆 AI활용 안전공모전 모집요강</span>
          </button>

          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "submit"
                ? "bg-[#0F172A] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Send size={14} />
            <span>📝 작품 접수 및 참가신청</span>
          </button>

          <button
            onClick={() => setActiveTab("guidelines")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "guidelines"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Bot size={14} />
            <span>🤖 AI 도구 활용 가이드</span>
          </button>
        </div>

        <span className="text-xs font-black text-amber-700 hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
          <Trophy size={14} /> 2026 PLAY SAFE CHALLENGE
        </span>
      </div>

      {/* ==================================================================== */}
      {/* 🌟 1. 2026 PLAY SAFE 숏폼 챌린지 (공문서 260831 완벽 반영!)          */}
      {/* ==================================================================== */}
      {activeTab === "challenge" && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* 히어로 숏폼 챌린지 배너 */}
          <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 sm:p-12 border border-amber-200/90 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
            <div className="space-y-4 max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase">
                <Music size={14} className="text-amber-700" />
                <span>공식 음원: ㅋㅋㅋ (Keep, Know, KYWA) 챌린지</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.2]">
                2026년 청소년활동 안전캠페인<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  「PLAY SAFE 숏폼 챌린지」
                </span>
              </h1>

              <p className="text-sm sm:text-base font-semibold text-[#334155] leading-relaxed">
                한국청소년활동진흥원 공식 <strong>‘ㅋㅋㅋ(Keep, Know, KYWA)’ 음원</strong>에 맞춰 신나게 춤추고, 
                나만의 창의적인 안전 숏폼 영상을 인스타그램 릴스 & 유튜브 쇼츠에 업로드하세요!
              </p>

              {/* 공식 음원 플레이어 & 다운로드 스트립 */}
              <div className="p-4 bg-white border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      alert(isPlayingAudio ? "음원 재생이 정지되었습니다." : "🎵 공식 음원 'ㅋㅋㅋ(Keep, Know, KYWA)' 미리듣기 재생 중...");
                    }}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-md transition-all shrink-0"
                  >
                    <Play size={18} className="fill-current ml-0.5" />
                  </button>
                  <div>
                    <span className="text-xs font-black text-[#0F172A] block">
                      공식 음원: ㅋㅋㅋ (Keep, Know, KYWA).mp3
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      길이: 45초 · 댄스 및 크리에이티브 부문 필수 사용
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPosterModal(true)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye size={14} className="text-amber-600" />
                    <span>공식 포스터 크게보기</span>
                  </button>

                  <a
                    href="#download-sound"
                    onClick={(e) => { e.preventDefault(); alert("📥 'ㅋㅋㅋ(Keep, Know, KYWA)' 공식 음원 다운로드가 시작되었습니다."); }}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs rounded-xl border border-amber-300 transition-all flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>음원 다운로드</span>
                  </a>

                  <button
                    onClick={() => setActiveTab("submit")}
                    className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all shadow-sm"
                  >
                    [참가 접수]
                  </button>
                </div>
              </div>
            </div>

            {/* 우측 포스터 카드 미리보기 */}
            <div className="hidden lg:block absolute right-8 top-8 bottom-8 w-64 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 group cursor-pointer" onClick={() => setShowPosterModal(true)}>
              <Image 
                src="/images/playsafe_poster_2026.png" 
                alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-3 py-1.5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                  <Eye size={13} /> 포스터 확대보기
                </span>
              </div>
            </div>

            {/* 일정 타임라인 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-200/60">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-black text-amber-800 block">📅 접수 기간</span>
                <p className="text-sm font-black text-[#0F172A]">2026.09.01 ~ 10.05</p>
                <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded inline-block">10.05(월) 18:00 마감</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-black text-blue-800 block">📱 사용 매체 및 규격</span>
                <p className="text-sm font-black text-[#0F172A]">15~60초 세로형 숏폼</p>
                <span className="text-[10px] text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded inline-block">인스타그램 릴스 · 유튜브 쇼츠</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-black text-emerald-800 block">🏆 시상 규모</span>
                <p className="text-sm font-black text-[#0F172A]">총 30팀 (상금 200만원)</p>
                <span className="text-[10px] text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block">장관상 1점 · 이사장상 29점</span>
              </div>
            </div>
          </section>

          {/* 2대 공모 부문 (댄스 / 크리에이티브) */}
          <section className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                2 CHALLENGE CATEGORIES
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] mt-0.5">
                공모 부문 (댄스 부문 & 크리에이티브 부문)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. 댄스 부문 */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-sm hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    부문 01 · DANCE
                  </span>
                  <span className="text-2xl">💃</span>
                </div>

                <h3 className="text-xl font-black text-[#0F172A]">댄스 부문</h3>
                <p className="text-xs text-[#334155] font-semibold leading-relaxed">
                  공식 음원 ‘ㅋㅋㅋ(Keep, Know, KYWA)’에 맞춰 신나게 춤추는 숏폼 안무 챌린지
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-[#334155]">
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                    <strong className="text-[#0F172A] block">① 공식 안무 분야:</strong>
                    <span className="text-[11px] text-slate-600">공식 음원에 맞춰 공식 안무를 따라 추는 형태 (복장, 장소 활용 안전수칙 표현)</span>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                    <strong className="text-[#0F172A] block">② 퍼포먼스 분야:</strong>
                    <span className="text-[11px] text-slate-600">공식 음원을 배경으로 가사 내용을 새롭게 표현하는 안무 창작 형태</span>
                  </div>
                </div>
              </div>

              {/* 2. 크리에이티브 부문 */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-sm hover:border-blue-400 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    부문 02 · CREATIVE
                  </span>
                  <span className="text-2xl">🎬</span>
                </div>

                <h3 className="text-xl font-black text-[#0F172A]">크리에이티브 부문</h3>
                <p className="text-xs text-[#334155] font-semibold leading-relaxed">
                  일상 속 안전 실천 메시지를 자유로운 형식으로 표현하는 숏폼 챌린지
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-[#334155]">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                    <strong className="text-[#0F172A] block">• 제작 형식:</strong>
                    <span className="text-[11px] text-slate-600">브이로그, 상황극, 패러디, 안전 정보형 콘텐츠, 애니메이션 등 자유 형식</span>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                    <strong className="text-[#0F172A] block">• 필수 요건:</strong>
                    <span className="text-[11px] text-slate-600">최종 영상에 공식 ‘ㅋㅋㅋ’ 음원이 반드시 포함되어야 함</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* 참여 방법 및 필수 해시태그 안내 */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 uppercase">
                HOW TO PARTICIPATE
              </span>
              <h3 className="text-xl font-black text-[#0F172A] mt-1">참여 방법 및 필수 해시태그</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-[#334155]">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#1558C9] text-white font-black text-xs flex items-center justify-center">1</span>
                <strong className="text-slate-900 block text-sm">공식 음원으로 촬영/제작</strong>
                <p className="text-[11px] text-slate-600">
                  공식 음원 'ㅋㅋㅋ'을 배경음으로 15~60초 세로형 영상을 촬영 및 편집합니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center">2</span>
                <strong className="text-slate-900 block text-sm">SNS 업로드 및 필수 해시태그</strong>
                <p className="text-[11px] text-slate-600">
                  인스타그램 릴스 또는 유튜브 쇼츠에 아래 해시태그 3개를 필수로 기재하여 업로드합니다.
                </p>
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-black text-rose-800">
                  #KYWA #한국청소년활동진흥원 #PLAYSAFE
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">3</span>
                <strong className="text-slate-900 block text-sm">플랫폼 참가 신청서 접수</strong>
                <p className="text-[11px] text-slate-600">
                  본 페이지의 [작품 접수] 메뉴에서 SNS 영상 URL과 참가 정보를 제출하면 접수 완료!
                </p>
              </div>
            </div>
          </section>

          {/* 숏폼 챌린지 실시간 갤러리 및 대국민 투표 */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  LIVE CHALLENGE GALLERY
                </div>
                <h2 className="text-2xl font-black text-[#0F172A] mt-0.5">
                  실시간 숏폼 챌린지 참여작 & 투표
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                2026.12.31까지 포스팅 및 공개 유지 필수
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortformEntries.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* 상단 썸네일 영역 */}
                  <div className={`h-44 bg-gradient-to-tr ${item.thumbnail} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                        {item.platform}
                      </span>
                      <span className="text-xs font-black bg-rose-600/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Heart size={12} className="fill-white" /> {item.votes.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold bg-black/30 px-2 py-0.5 rounded">
                        조회수 {item.views}
                      </span>
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all"
                        title="SNS 원본 영상 보기"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* 본문 설명 */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.category}
                      </span>
                      <h3 className="text-base font-black text-[#0F172A] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold">
                        참여자: {item.author}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] text-slate-500 font-medium">{t}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => alert(`🎉 '${item.title}' 챌린지 작품에 1표를 투표하셨습니다!`)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all touch-target"
                      >
                        <Vote size={14} />
                        <span>[ 🗳️ 이 숏폼 챌린지에 투표하기 ]</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 2. AI활용 청소년활동 안전공모전 (공고 요강)                        */}
      {/* ==================================================================== */}
      {activeTab === "info" && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          <section className="bg-white p-8 sm:p-12 border border-slate-200/90 rounded-3xl space-y-6 shadow-sm">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1558C9] text-xs font-black uppercase">
                <Bot size={14} />
                <span>여성가족부 · 한국청소년활동진흥원 공식 공모전</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                2026년 AI활용<br />
                <span className="text-[#1558C9]">청소년활동 안전공모전</span>
              </h1>

              <p className="text-sm font-semibold text-[#334155] leading-relaxed">
                인공지능(AI) 도구를 창의적으로 활용하여 청소년활동 안전 문화를 확산하고, 
                안전 사각지대를 해소할 우수 콘텐츠와 교육자료, 웹툰, 숏폼을 공모합니다.
              </p>
            </div>

            {/* 공모 5대 주제 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              {contestTopics.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.no} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${t.bgColor} ${t.borderColor}`} style={{ color: t.color }}>
                        TOPIC {t.no}
                      </span>
                      <Icon className="h-4 w-4" style={{ color: t.color }} />
                    </div>
                    <strong className="text-sm font-black text-[#0F172A] block">{t.title}</strong>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 시상 내역 */}
          <section className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-sm">
            <h3 className="text-xl font-black text-[#0F172A]">🏆 공모전 시상 내역 (총 12점 / 상금 290만원)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-amber-900 font-black block">🥇 최우수상 (1점)</span>
                <span className="text-[11px] text-amber-800">여성가족부장관상</span>
                <p className="text-base font-black text-amber-900 mt-1">상금 500,000원</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-blue-900 font-black block">🥈 우수상 (2점)</span>
                <span className="text-[11px] text-blue-800">한국청소년활동진흥원이사장상</span>
                <p className="text-base font-black text-blue-900 mt-1">각 300,000원</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-900 font-black block">🥉 장려상 (9점)</span>
                <span className="text-[11px] text-slate-600">한국청소년활동진흥원이사장상</span>
                <p className="text-base font-black text-slate-900 mt-1">각 200,000원</p>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 3. 작품 접수 및 참가신청 폼                                        */}
      {/* ==================================================================== */}
      {activeTab === "submit" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in duration-300">
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              OFFICIAL APPLICATION FORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              2026 안전캠페인 숏폼 챌린지 & 공모전 참가 신청서
            </h2>
            <p className="text-xs font-medium text-slate-600">
              참가자 정보와 출품작 URL 또는 파일을 등록해 주세요. 이메일(<code>hamesta@naver.com</code>) 접수도 가능합니다.
            </p>
          </div>

          <form 
            onSubmit={e => { 
              e.preventDefault(); 
              alert("🎉 참가가 정상 접수되었습니다! 심사위원단 검토 후 기재하신 연락처로 안내드립니다."); 
              setActiveTab("challenge"); 
            }} 
            className="space-y-6 text-xs font-bold text-[#0F172A]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 참가 구분:</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                  <option value="shortform">🎬 PLAY SAFE 숏폼 챌린지 (SNS URL 제출)</option>
                  <option value="contest">🏆 AI활용 안전공모전 (파일 제출)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">• 참가자 성명 / 팀명:</label>
                <input type="text" placeholder="예: 김안전 (또는 안전크루팀)" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 연락처:</label>
                <input type="tel" placeholder="010-1234-5678" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">• 이메일:</label>
                <input type="email" placeholder="safety@example.com" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">• SNS 숏폼 영상 URL (인스타그램 릴스 또는 유튜브 쇼츠 링크):</label>
              <input type="url" placeholder="https://www.instagram.com/reel/... 또는 https://youtube.com/shorts/..." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">• 작품명 및 핵심 안전 메시지 요약 (300자 이내):</label>
              <textarea rows={3} placeholder="작품의 기획 의도와 표현하고자 한 안전 수칙을 간결하게 작성하세요." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
            </div>

            <button 
              type="submit" 
              className="krds-public-button w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 touch-target"
            >
              <Send size={18} />
              <span>[ 🚀 2026 PLAY SAFE 챌린지 참가 신청서 최종 제출하기 ]</span>
            </button>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 4. AI 도구 활용 가이드                                            */}
      {/* ==================================================================== */}
      {activeTab === "guidelines" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              AI ETHICS & RULES
            </span>
            <h2 className="text-2xl font-black text-[#0F172A]">AI 도구 활용 가이드 및 응모 수칙</h2>
          </div>

          <div className="space-y-4 text-xs text-[#334155] font-medium leading-relaxed">
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-1">
              <strong className="text-slate-900 block text-sm">• AI 활용 범위</strong>
              <p>기획, 자료조사, 문안 작성, 이미지 생성, 영상 편집 등 제작 과정의 1단계 이상 AI 도구를 자유롭게 활용할 수 있습니다.</p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
              <strong className="text-slate-900 block text-sm">• 저작권 및 초상권 보호</strong>
              <p>실존 인물의 목소리나 얼굴을 악용한 딥페이크는 엄격히 금지되며, 사용한 AI 도구의 상업적/공공적 이용 권리를 준수해야 합니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 포스터 확대보기 라이트박스 모달 */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowPosterModal(false)}>
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                2026 PLAY SAFE 숏폼 챌린지 공식 포스터
              </span>
              <button 
                onClick={() => setShowPosterModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-slate-950">
              <Image 
                src="/images/playsafe_poster_2026.png" 
                alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
                fill 
                className="object-contain"
                priority
              />
            </div>

            <div className="flex justify-between items-center pt-2 px-2">
              <span className="text-[11px] font-semibold text-slate-500">문의: 02-2088-8456 | mkteam@testmotionofficial.com</span>
              <a 
                href="/images/playsafe_poster_2026.png" 
                download="2026_PLAY_SAFE_포스터.png"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Download size={14} />
                <span>포스터 원본 다운로드</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ContestPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-xs font-black text-[#0F172A]">로딩 중...</div>}>
      <ContestContent />
    </Suspense>
  );
}
