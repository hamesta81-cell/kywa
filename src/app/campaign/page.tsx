"use client";

import { useState } from "react";
import { Search, Play, CheckCircle2, Lock, RotateCcw, Wrench, ChevronRight, Star, Clock, Zap, Filter, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CampaignPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState("전체"); // 전체, 내 추천, 진행 중, 완료
  const [fieldFilter, setFieldFilter] = useState("전체"); // 전체, 생활, 디지털, 재난, 활동, 마음
  const [difficultyFilter, setDifficultyFilter] = useState("전체"); // 전체, 쉬움, 보통, 어려움
  const [playTimeFilter, setPlayTimeFilter] = useState("전체"); // 전체, 3분 이하, 5분 이하, 10분 이상
  const [sortOption, setSortOption] = useState("추천순"); // 추천순, 최신순, 인기순, 짧은순

  // 6대 상태 표현 매트릭스가 반영된 미션 데이터 덱 (유저 요구 100% 반영!)
  const missions = [
    {
      id: "cyber-bullying",
      title: "피싱 스와이프",
      desc: "수상한 문자와 DM을 판별해요.",
      category: "디지털안전",
      time: "약 3분",
      timeCategory: "3분 이하",
      difficulty: "보통",
      starRating: "★★☆",
      exp: "+70 XP",
      status: "진행 중",
      progress: "60%",
      completedDate: null,
      lockReason: null,
      maintenanceInfo: null,
      img: "/images/contest_earthquake_app_1777557756490.png",
      href: "/campaign/cyber-bullying",
      borderLeft: "border-l-4 border-l-[#7557D9]",
      tagColor: "bg-purple-50 text-[#7557D9]"
    },
    {
      id: "mbti",
      title: "나의 안전 MBTI 진단",
      desc: "12문항으로 인지 성향을 진단해요.",
      category: "생활안전",
      time: "약 3분",
      timeCategory: "3분 이하",
      difficulty: "보통",
      starRating: "★★☆",
      exp: "+50 XP",
      status: "완료",
      progress: "100%",
      completedDate: "2026.07.20",
      lockReason: null,
      maintenanceInfo: null,
      img: "/images/mbti_safety_quiz_hero.png",
      href: "/campaign/mbti",
      borderLeft: "border-l-4 border-l-[#1558C9]",
      tagColor: "bg-blue-50 text-[#1558C9]"
    },
    {
      id: "drug-abuse",
      title: "약물 오남용 팩트체크",
      desc: "마약류 상식 OX 퀴즈를 풀어요.",
      category: "생활안전",
      time: "약 2분",
      timeCategory: "3분 이하",
      difficulty: "쉬움",
      starRating: "★☆☆",
      exp: "+40 XP",
      status: "시작 전",
      progress: "0%",
      completedDate: null,
      lockReason: null,
      maintenanceInfo: null,
      img: "/images/drug_abuse_prevention_hero.png",
      href: "/campaign/drug-abuse",
      borderLeft: "border-l-4 border-l-[#1558C9]",
      tagColor: "bg-blue-50 text-[#1558C9]"
    },
    {
      id: "blind-spot",
      title: "안전사각지대 현장 제보",
      desc: "위험 사각지대 파손 펜스를 제보해요.",
      category: "재난안전",
      time: "약 5분",
      timeCategory: "5분 이하",
      difficulty: "어려움",
      starRating: "★★★",
      exp: "+100 XP",
      status: "잠금",
      progress: "0%",
      completedDate: null,
      lockReason: "Lv.10 달성 시 해금",
      maintenanceInfo: null,
      img: "/images/archive_camping_safety_1777557771794.png",
      href: "/campaign/blind-spot",
      borderLeft: "border-l-4 border-l-[#EA580C]",
      tagColor: "bg-orange-50 text-[#EA580C]"
    },
    {
      id: "camping-zipline",
      title: "캠핑 & 시설 안전 점검",
      desc: "캠핑장 안전 수칙 및 짚라인 체험.",
      category: "활동안전",
      time: "약 10분",
      timeCategory: "10분 이상",
      difficulty: "어려움",
      starRating: "★★★",
      exp: "+90 XP",
      status: "종료",
      progress: "100%",
      completedDate: "2026.06.30",
      lockReason: null,
      maintenanceInfo: null,
      img: "/images/archive_camping_safety_1777557771794.png",
      href: "/archive",
      borderLeft: "border-l-4 border-l-[#159A83]",
      tagColor: "bg-emerald-50 text-[#159A83]"
    },
    {
      id: "dodac",
      title: "도닥 AI 또래 힐링 상담",
      desc: "비공개 AI 멘토링으로 고민을 나눠요.",
      category: "마음안전",
      time: "약 4분",
      timeCategory: "5분 이하",
      difficulty: "보통",
      starRating: "★★☆",
      exp: "+60 XP",
      status: "점검 중",
      progress: "0%",
      completedDate: null,
      lockReason: null,
      maintenanceInfo: "7/25 14:00 점검 완료 예정",
      img: "/images/mind_zone_healing_hero.png",
      href: "/campaign/dodac",
      borderLeft: "border-l-4 border-l-[#EC4899]",
      tagColor: "bg-pink-50 text-[#EC4899]"
    }
  ];

  // 필터링 적용
  const filteredMissions = missions.filter(m => {
    const matchesSearch = m.title.includes(searchTerm) || m.desc.includes(searchTerm);
    const matchesStatus = statusTab === "전체" || 
      (statusTab === "진행 중" && m.status === "진행 중") ||
      (statusTab === "완료" && m.status === "완료") ||
      (statusTab === "내 추천" && (m.status === "시작 전" || m.status === "진행 중"));
    const matchesField = fieldFilter === "전체" || m.category.includes(fieldFilter);
    const matchesDiff = difficultyFilter === "전체" || m.difficulty === difficultyFilter;
    const matchesTime = playTimeFilter === "전체" || m.timeCategory === playTimeFilter;

    return matchesSearch && matchesStatus && matchesField && matchesDiff && matchesTime;
  });

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#172033] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-8">
      
      {/* ==================================================================== */}
      {/* 6. 개편 화면 필터 시스템 (와이어프레임 100% 완벽 반영!)               */}
      {/* ==================================================================== */}
      <section className="krds-public-card p-6 sm:p-8 space-y-6 bg-white shadow-sm border border-[#E2E8F0]">
        
        {/* 상단 타이틀 & 검색/탭 필터 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <h1 className="text-2xl font-black text-[#102A43]">🎯 안전 미션 허브</h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* 통합검색 입력창 */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="통합검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9] w-44"
              />
            </div>

            {/* 탭 필터: [내 추천] [진행 중] [완료] */}
            {["전체", "내 추천", "진행 중", "완료"].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3.5 py-2 rounded-[10px] text-xs font-bold transition-all touch-target ${
                  statusTab === tab
                    ? "bg-[#1558C9] text-white shadow-sm"
                    : "bg-slate-100 text-[#5D6B7E] hover:bg-slate-200"
                }`}
              >
                [{tab}]
              </button>
            ))}
          </div>
        </div>

        {/* 상세 조건 필터 덱 (분야, 난이도, 플레이 시간, 정렬) */}
        <div className="space-y-4 text-xs font-bold text-[#5D6B7E]">
          
          {/* 분야: 전체 생활 디지털 재난 활동 마음 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">분야:</span>
            {["전체", "생활", "디지털", "재난", "활동", "마음"].map(f => (
              <button
                key={f}
                onClick={() => setFieldFilter(f)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  fieldFilter === f ? "bg-[#102A43] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 난이도: 쉬움 보통 어려움 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">난이도:</span>
            {["전체", "쉬움", "보통", "어려움"].map(d => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  difficultyFilter === d ? "bg-[#102A43] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* 플레이 시간: 3분 이하 5분 이하 10분 이상 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">플레이 시간:</span>
            {["전체", "3분 이하", "5분 이하", "10분 이상"].map(t => (
              <button
                key={t}
                onClick={() => setPlayTimeFilter(t)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  playTimeFilter === t ? "bg-[#102A43] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 정렬: 추천순 최신순 인기순 짧은순 */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E2E8F0]">
            <span className="w-16 font-black text-[#102A43]">정렬:</span>
            {["추천순", "최신순", "인기순", "짧은순"].map(s => (
              <button
                key={s}
                onClick={() => setSortOption(s)}
                className={`px-3 py-1 rounded-md text-[11px] transition-all ${
                  sortOption === s ? "bg-blue-50 text-[#1558C9] font-black border border-blue-200" : "hover:text-[#102A43]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 미션 카드 덱 (미션 카드 표준 규격 & 6대 카드 상태 표현 매트릭스!)       */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredMissions.map(m => (
          <div
            key={m.id}
            className={`krds-public-card p-0 overflow-hidden flex flex-col justify-between hover:border-[#1558C9] transition-all shadow-md group ${m.borderLeft}`}
          >
            {/* 상단 헤더: [분야 태그] | 소요시간 */}
            <div className="p-4 flex items-center justify-between border-b border-[#E2E8F0] bg-slate-50/50">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${m.tagColor}`}>
                [{m.category}]
              </span>
              <span className="text-xs font-bold text-[#5D6B7E] tabular-nums">
                {m.time}
              </span>
            </div>

            {/* 16:9 표준 썸네일 */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              <Image src={m.img} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            {/* 제목 & 설명 */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-[#102A43] group-hover:text-[#1558C9] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-[#102A43] font-medium leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* 난이도 별표 & XP */}
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-[#E2E8F0] tabular-nums">
                <span className="text-amber-500">난이도 {m.starRating}</span>
                <span className="text-[#159A83] font-black">{m.exp}</span>
              </div>

              {/* ============================================================== */}
              {/* 🚦 6대 카드 상태 표현 매트릭스 (State Matrix)                */}
              {/* ============================================================== */}
              <div className="pt-2">
                
                {/* 1. 시작 전 */}
                {m.status === "시작 전" && (
                  <Link
                    href={m.href}
                    className="krds-public-button w-full py-2.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[14px] text-center block shadow-md touch-target"
                  >
                    [미션 시작]
                  </Link>
                )}

                {/* 2. 진행 중 */}
                {m.status === "진행 중" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#7557D9] tabular-nums">
                      <span>진행률 {m.progress}</span>
                      <span>남은 시간 약 2분</span>
                    </div>
                    <Link
                      href={m.href}
                      className="krds-public-button w-full py-2.5 bg-[#7557D9] hover:bg-purple-700 text-white font-black text-xs rounded-[14px] text-center block shadow-md touch-target"
                    >
                      [이어하기]
                    </Link>
                  </div>
                )}

                {/* 3. 완료 */}
                {m.status === "완료" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-[#159A83] tabular-nums">
                      <span>☑️ 완료됨</span>
                      <span>완료일: {m.completedDate}</span>
                    </div>
                    <Link
                      href={m.href}
                      className="krds-public-button w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#159A83] font-black text-xs rounded-[14px] text-center border border-emerald-300 block touch-target"
                    >
                      [다시 하기]
                    </Link>
                  </div>
                )}

                {/* 4. 잠금 */}
                {m.status === "잠금" && (
                  <div className="space-y-1.5 text-center">
                    <div className="text-[11px] font-bold text-amber-700 flex items-center justify-center gap-1">
                      <Lock size={12} /> {m.lockReason}
                    </div>
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-200 text-slate-400 font-bold text-xs rounded-[14px] cursor-not-allowed block"
                    >
                      [잠금 상태]
                    </button>
                  </div>
                )}

                {/* 5. 종료 */}
                {m.status === "종료" && (
                  <Link
                    href={m.href}
                    className="krds-public-button w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#5D6B7E] font-bold text-xs rounded-[14px] text-center block border border-slate-300 touch-target"
                  >
                    [결과 보기]
                  </Link>
                )}

                {/* 6. 점검 중 */}
                {m.status === "점검 중" && (
                  <div className="space-y-1.5 text-center">
                    <div className="text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1">
                      <Wrench size={12} /> {m.maintenanceInfo}
                    </div>
                    <button
                      disabled
                      className="w-full py-2.5 bg-rose-50 text-rose-400 font-bold text-xs rounded-[14px] border border-rose-200 cursor-not-allowed block"
                    >
                      [점검 중]
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
