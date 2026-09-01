"use client";

import { useState, useEffect } from "react";
import { 
  Play, BookOpen, Compass, Gamepad2, Award, Users, ArrowRight, 
  ShieldCheck, MapPin, Sparkles, Trophy, CheckCircle2, ChevronRight, 
  Zap, Target, Lock, Clock, Heart, AlertTriangle, Radio, Flame, 
  Smartphone, CloudRain, Activity, Smile, Share2, Eye, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChallengePopup, setShowChallengePopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (savedUser) setIsLoggedIn(true);

      // 오늘 하루 보지 않기 체크
      const hidePopupDate = localStorage.getItem("hide_playsafe_popup_date");
      const today = new Date().toISOString().slice(0, 10);
      if (hidePopupDate !== today) {
        setShowChallengePopup(true);
      }
    }
  }, []);

  const handleClosePopup = (dontShowToday: boolean) => {
    if (dontShowToday) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem("hide_playsafe_popup_date", today);
    }
    setShowChallengePopup(false);
  };

  const safetyZones = [
    {
      id: "living",
      title: "생활안전",
      subtitle: "Living Safety",
      desc: "가정, 학교, 교통, 일상 속 낙상 및 화재 예방",
      color: "#d97706",
      bgLight: "bg-amber-50",
      borderLight: "border-amber-200",
      badge: "ZONE 01",
      icon: Flame,
      questCount: 14,
      link: "/campaign/cpr-basics"
    },
    {
      id: "digital",
      title: "디지털안전",
      subtitle: "Digital Safety",
      desc: "피싱, 딥페이크 범죄, 사이버불링, 개인정보 보호",
      color: "#0284c7",
      bgLight: "bg-sky-50",
      borderLight: "border-sky-200",
      badge: "ZONE 02",
      icon: Smartphone,
      questCount: 18,
      link: "/campaign/cyber-bullying"
    },
    {
      id: "disaster",
      title: "재난안전",
      subtitle: "Disaster Safety",
      desc: "집중호우, 지진, 태풍, 대피로 확보 및 행동요령",
      color: "#2563eb",
      bgLight: "bg-blue-50",
      borderLight: "border-blue-200",
      badge: "ZONE 03",
      icon: CloudRain,
      questCount: 12,
      link: "/campaign/disaster-evacuation"
    },
    {
      id: "activity",
      title: "활동안전",
      subtitle: "Activity Safety",
      desc: "수련활동, 야외체험, 물놀이 시설 안전 점검",
      color: "#059669",
      bgLight: "bg-emerald-50",
      borderLight: "border-emerald-200",
      badge: "ZONE 04",
      icon: Activity,
      questCount: 15,
      link: "/campaign/fire-escape"
    },
    {
      id: "mind",
      title: "마음안전",
      subtitle: "Mind Safety",
      desc: "청소년 마음건강, 힐링 우드카빙, 스트레스 해소",
      color: "#7c3aed",
      bgLight: "bg-purple-50",
      borderLight: "border-purple-200",
      badge: "ZONE 05",
      icon: Smile,
      questCount: 10,
      link: "/campaign/crowd-safety"
    }
  ];

  const quickMissions = [
    {
      id: "mission-01",
      code: "MISSION 01",
      category: "디지털안전",
      title: "피싱 & 스미싱 의심 링크 감별 훈련",
      desc: "택배 배송 조회, 모바일 부고장 등 교묘한 스미싱 문자 3초 만에 구분하기",
      level: "EASY",
      levelColor: "text-emerald-700 border-emerald-300 bg-emerald-50",
      time: "3분",
      xp: "+50 XP",
      link: "/campaign/cyber-bullying"
    },
    {
      id: "mission-02",
      code: "MISSION 02",
      category: "재난안전",
      title: "집중호우 시 지하차도 & 침수지역 탈출",
      desc: "수위가 타이어 2/3 지점에 도달했을 때의 최적 탈출 타이밍 판단",
      level: "NORMAL",
      levelColor: "text-blue-700 border-blue-300 bg-blue-50",
      time: "3분",
      xp: "+80 XP",
      link: "/campaign/disaster-evacuation"
    },
    {
      id: "mission-03",
      code: "MISSION 03",
      category: "생활안전",
      title: "심폐소생술 4분의 기적 (CPR & AED)",
      desc: "의식 확인부터 119 신고, 가슴 압박 30회와 자동심장충격기 적용 실전",
      level: "NORMAL",
      levelColor: "text-blue-700 border-blue-300 bg-blue-50",
      time: "3분",
      xp: "+80 XP",
      link: "/campaign/cpr-basics"
    },
    {
      id: "mission-04",
      code: "MISSION 04",
      category: "활동안전",
      title: "체험활동 중 화재 대피 및 완강기 사용법",
      desc: "비상벨이 울렸을 때 젖은 수건으로 코와 입을 막고 낮은 자세로 탈출하기",
      level: "HARD",
      levelColor: "text-rose-700 border-rose-300 bg-rose-50",
      time: "4분",
      xp: "+100 XP",
      link: "/campaign/fire-escape"
    }
  ];

  const fieldNotes = [
    {
      title: "딥페이크 성범죄 예방 및 AI 가짜 사진 구별 가이드",
      category: "디지털안전",
      team: "세이프 리더스",
      date: "2026.08",
      views: "1,420",
      accent: "from-sky-600 to-blue-700",
      link: "/archive"
    },
    {
      title: "물놀이 & 야외 청소년 수련시설 3단계 안전점검",
      category: "활동안전",
      team: "안전.zip",
      date: "2026.08",
      views: "2,150",
      accent: "from-emerald-600 to-teal-700",
      link: "/archive"
    },
    {
      title: "[그림자채팅] 청소년 마음건강 회복 힐링 프로그램",
      category: "마음안전",
      team: "심리지원단 파인",
      date: "2026.08",
      views: "980",
      accent: "from-purple-600 to-indigo-700",
      link: "/archive"
    },
    {
      title: "지하철 및 번화가 인파 밀집 사고 예방 4대 원칙",
      category: "생활안전",
      team: "안전 탭앤톡",
      date: "2026.08",
      views: "1,890",
      accent: "from-amber-600 to-orange-700",
      link: "/archive"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#1558C9] selection:text-white">
      
      {/* 부드러운 화이트/블루 배경 블러 포인트 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/60 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-100/60 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 space-y-16">
        
        {/* 상단 모드 인디케이터 바 */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1558C9] animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              YOUTH SAFETY OS <span className="text-[#1558C9]">v2.6 ONLINE</span>
            </span>
          </div>

          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 hover:text-[#1558C9] hover:bg-slate-50 border border-slate-300 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>{isLoggedIn ? "👤 로그인 대시보드 뷰" : "🔓 게스트 모드 뷰"}</span>
          </button>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* 1. 히어로 섹션 (HERO SECTION)                                              */}
        {/* -------------------------------------------------------------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-[24px] border border-slate-200/90 shadow-sm">
          
          {/* 좌측 메인 카피 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1558C9] text-xs font-black tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>청소년 안전 퀘스트 플랫폼</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
              위험은 갑자기 온다.<br />
              준비는 <span className="text-[#1558C9]">3분이면 된다.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#334155] font-semibold leading-relaxed max-w-xl">
              대한민국 청소년을 위한 실전 안전 판단 훈련. 매일 3분, 퀘스트를 클리어하고 나만의 안전 레벨을 높여보세요.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/campaign/cyber-bullying"
                className="krds-public-button px-8 py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-md transition-all flex items-center gap-2.5 touch-target"
              >
                <Play size={18} className="fill-white" />
                <span>오늘의 미션 시작</span>
              </Link>

              <Link
                href="/campaign"
                className="krds-public-button px-6 py-4 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-sm rounded-[14px] border border-slate-200 transition-all flex items-center gap-2 touch-target"
              >
                <Compass size={18} className="text-[#1558C9]" />
                <span>전체 퀘스트 덱</span>
              </Link>
            </div>

            {/* 통계 스트립 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 max-w-lg">
              <div>
                <div className="text-2xl font-black text-[#0F172A] tabular-nums">41+</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">누적 현장 보고서</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#1558C9] tabular-nums">14개 팀</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">전국 안전홍보단</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#059669] tabular-nums">99.8%</div>
                <div className="text-xs text-slate-500 font-bold mt-0.5">훈련 완주율</div>
              </div>
            </div>
          </div>

          {/* 우측 오늘의 퀘스트 대시보드 카드 */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-7 rounded-2xl space-y-5 shadow-sm">
              
              {/* 상단 펄스 헤더 */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1558C9] animate-radar" />
                  <span className="text-xs font-black text-[#1558C9] tracking-wider uppercase">
                    TODAY'S SPECIAL QUEST
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-300 tabular-nums">
                  보상 +80 XP
                </span>
              </div>

              {/* 퀘스트 콘텐츠 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#0284C7] bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                    디지털안전 02
                  </span>
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <Clock size={12} /> 소요시간 약 3분
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#0F172A]">
                  피싱 문자를 찾아라! 📱
                </h3>

                <p className="text-xs text-[#334155] font-medium leading-relaxed">
                  "택배 주소 불일치 확인", "모바일 부고장 링크" 등 실제 스미싱 사례를 보고 안전 여부를 3초 안에 판별하세요.
                </p>
              </div>

              {/* 진행률 게이지 */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>오늘 전국 청소년 참여</span>
                  <span className="text-[#0F172A] font-black">1,842명 클리어</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1558C9] to-[#0284C7] h-full w-[78%]" />
                </div>
              </div>

              {/* 액션 버튼 */}
              <Link
                href="/campaign/cyber-bullying"
                className="w-full py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs rounded-xl text-center block shadow-sm transition-all touch-target"
              >
                [지금 퀘스트 플레이]
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* 2. 5대 안전 영역 탐색 (EXPLORE 5 ZONES)                                    */}
        {/* -------------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-black text-[#1558C9] uppercase tracking-wider">
                EXPLORE 5 ZONES
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
                5대 안전 영역 맵
              </h2>
            </div>
            <p className="text-xs text-[#475569] font-medium max-w-sm">
              청소년 생활 전반에 걸친 5대 핵심 안전 분야의 실전 퀘스트를 선택하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {safetyZones.map((zone) => {
              const Icon = zone.icon;
              return (
                <Link
                  key={zone.id}
                  href={zone.link}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 group hover:border-[#1558C9] hover:shadow-md transition-all block relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${zone.bgLight} ${zone.borderLight}`}
                      style={{ color: zone.color }}
                    >
                      {zone.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {zone.questCount} 퀘스트
                    </span>
                  </div>

                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${zone.bgLight} border ${zone.borderLight}`}
                  >
                    <Icon className="h-6 w-6" style={{ color: zone.color }} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#1558C9] transition-colors">
                      {zone.title}
                    </h3>
                    <p className="text-[11px] text-[#475569] font-medium line-clamp-2 leading-relaxed">
                      {zone.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-black text-slate-600 group-hover:text-[#1558C9]">
                    <span>훈련 입장</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* 3. 3분 퀵 플레이 미션 덱 (3 MINUTE QUICK PLAY)                             */}
        {/* -------------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
                3-MINUTE QUICK PLAY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
                인기 퀵 미션 덱
              </h2>
            </div>
            <Link
              href="/campaign"
              className="text-xs font-black text-[#1558C9] hover:underline flex items-center gap-1"
            >
              <span>전체 덱 보기</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickMissions.map((m) => (
              <div 
                key={m.id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between space-y-4 group hover:border-[#1558C9] hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider">
                      {m.code}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${m.levelColor}`}>
                      {m.level}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#0F172A] leading-snug group-hover:text-[#1558C9] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-[#334155] font-medium leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={12} /> {m.time}</span>
                    <span className="text-[#059669] font-black flex items-center gap-0.5"><Zap size={12} className="fill-[#059669]" /> {m.xp}</span>
                  </div>

                  <Link
                    href={m.link}
                    className="w-full py-2.5 bg-slate-100 hover:bg-[#1558C9] hover:text-white text-[#0F172A] font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all touch-target"
                  >
                    <Play size={14} className="fill-current" />
                    <span>지금 플레이</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* 4. 2026 시즌 퀘스트 & 전국 안전 레이더망                                      */}
        {/* -------------------------------------------------------------------------- */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 좌측 카피 */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1558C9] text-xs font-black tracking-wider uppercase">
                <Radio className="h-3.5 w-3.5 animate-pulse text-[#1558C9]" />
                <span>2026 SEASON QUEST</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                전국 안전 레이더망 점등 프로젝트
              </h2>

              <p className="text-sm text-[#334155] font-medium leading-relaxed max-w-lg">
                서울부터 제주까지, 14개 청소년 안전홍보단과 전국의 대원들이 함께 안전 위험 요소를 발굴하고 안전지도를 완성합니다.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>전국 레이더망 활성화율</span>
                  <span className="text-[#059669] font-black text-sm">84.7% (ON)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div className="bg-gradient-to-r from-[#1558C9] via-blue-500 to-[#059669] h-full rounded-full w-[84.7%]" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/crew"
                  className="px-6 py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 touch-target"
                >
                  <Users size={16} />
                  <span>홍보단 활동 현장 피드</span>
                </Link>

                <Link
                  href="/archive"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs rounded-xl border border-slate-200 transition-all"
                >
                  <span>위험요소 발굴 지도</span>
                </Link>
              </div>
            </div>

            {/* 우측 레이더 핑 그래픽 카드 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-blue-200 bg-slate-50 flex items-center justify-center shadow-inner">
                
                {/* 레이더 링 */}
                <div className="absolute inset-4 rounded-full border border-dashed border-blue-200" />
                <div className="absolute inset-16 rounded-full border border-blue-200" />
                <div className="absolute inset-28 rounded-full border border-blue-300 bg-blue-100/50 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-[#1558C9]" />
                </div>

                {/* 전국 활동 핑 */}
                <div className="absolute top-10 left-20 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1558C9] animate-radar" />
                  <span className="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">서울 양천</span>
                </div>

                <div className="absolute top-24 right-10 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-radar" />
                  <span className="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">춘천 한라우</span>
                </div>

                <div className="absolute bottom-16 left-16 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-radar" />
                  <span className="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">대전 아고라</span>
                </div>

                <div className="absolute bottom-8 right-16 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-radar" />
                  <span className="text-[10px] font-black text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">제주 청디가드</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* 5. 안전 필드 노트 (SAFETY FIELD NOTES)                                     */}
        {/* -------------------------------------------------------------------------- */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-black text-purple-700 uppercase tracking-wider">
                SAFETY FIELD NOTES
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
                청소년 안전 카드뉴스 & 가이드
              </h2>
            </div>
            <Link
              href="/archive"
              className="text-xs font-black text-[#1558C9] hover:underline flex items-center gap-1"
            >
              <span>아카이브 전체보기</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {fieldNotes.map((note, idx) => (
              <Link
                key={idx}
                href={note.link}
                className="bg-white border border-slate-200/90 rounded-2xl group overflow-hidden flex flex-col justify-between hover:border-[#1558C9] hover:shadow-md transition-all block"
              >
                {/* 상단 그래픽 헤더 */}
                <div className={`h-28 bg-gradient-to-tr ${note.accent} p-4 flex flex-col justify-between relative`}>
                  <span className="self-start text-[10px] font-black px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-sm">
                    {note.category}
                  </span>
                  <div className="flex items-center justify-between text-white/90 text-xs">
                    <span className="font-bold">{note.team}</span>
                    <span className="text-[10px] opacity-80">{note.date}</span>
                  </div>
                </div>

                {/* 본문 요약 */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1558C9] transition-colors leading-snug line-clamp-2">
                    {note.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Eye size={12} /> {note.views}</span>
                    <span className="font-bold text-[#1558C9] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      상세보기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* 6. 공모전 & 홍보단 참여 배너                                                */}
        {/* -------------------------------------------------------------------------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 숏폼 챌린지 배너 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/90 rounded-2xl p-7 sm:p-8 space-y-4 relative overflow-hidden group shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                2026 SHORT-FORM CHALLENGE
              </span>
              <Trophy className="h-6 w-6 text-amber-600" />
            </div>

            <h3 className="text-xl font-black text-[#0F172A]">
              청소년 안전 숏폼 챌린지 🎬
            </h3>

            <p className="text-xs text-[#334155] font-semibold leading-relaxed">
              나만의 기발한 안전 꿀팁과 숏폼 영상으로 총 상금 500만원의 주인공에 도전하세요! (대국민 실시간 투표 진행 중)
            </p>

            <Link
              href="/contest"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-sm touch-target"
            >
              <span>숏폼 챌린지 참가 & 투표하기</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* 안전크루 배너 */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50/40 border border-sky-200/90 rounded-2xl p-7 sm:p-8 space-y-4 relative overflow-hidden group shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-800 bg-sky-100 px-2.5 py-1 rounded border border-sky-300">
                SAFETY CREWS
              </span>
              <Users className="h-6 w-6 text-[#0284C7]" />
            </div>

            <h3 className="text-xl font-black text-[#0F172A]">
              전국 14개 안전홍보단 오피스
            </h3>

            <p className="text-xs text-[#334155] font-semibold leading-relaxed">
              매주 등록되는 팀별 활동 현황, 주간보고서 작성 및 승인, 상호 응원 피드를 확인하세요.
            </p>

            <Link
              href="/crew"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl transition-all shadow-sm touch-target"
            >
              <span>크루 오피스 바로가기</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

      </div>

      {/* 🌟 2026 PLAY SAFE 숏폼 챌린지 홈페이지 공식 팝업 모달 */}
      {showChallengePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-200 animate-in zoom-in-95 duration-200">
            
            {/* 상단 헤더 */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-white fill-white" />
                <span className="text-xs font-black tracking-wide">
                  2026 청소년활동 안전캠페인 공식 공모
                </span>
              </div>
              <button 
                onClick={() => handleClosePopup(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-all text-white"
                title="팝업 닫기"
              >
                <X size={18} />
              </button>
            </div>

            {/* 포스터 이미지 영역 */}
            <div className="relative w-full h-[340px] bg-slate-950">
              <Image 
                src="/images/playsafe_poster_2026.png" 
                alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
                fill 
                className="object-contain"
                priority
              />
            </div>

            {/* 본문 안내 & 바로가기 버튼 */}
            <div className="p-5 space-y-4 bg-white">
              <div className="space-y-1 text-center">
                <h4 className="text-base font-black text-[#0F172A]">
                  「PLAY SAFE 숏폼 챌린지」 공모전 개최! 🎬
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  공식 음원 <strong>'ㅋㅋㅋ(Keep, Know, KYWA)'</strong>에 맞춘 나만의 안전 숏폼에 도전하세요! (총 상금 200만원)
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/contest?tab=vote"
                  onClick={() => handleClosePopup(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Trophy size={14} />
                  <span>숏폼 챌린지 바로가기 & 음원 다운로드</span>
                </Link>
              </div>

              {/* 하단 옵션: 오늘 하루 보지 않기 / 닫기 */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-bold">
                <button
                  onClick={() => handleClosePopup(true)}
                  className="hover:text-slate-900 transition-colors"
                >
                  [ 오늘 하루 보지 않기 ]
                </button>
                <button
                  onClick={() => handleClosePopup(false)}
                  className="hover:text-slate-900 transition-colors"
                >
                  [ 닫기 ]
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
