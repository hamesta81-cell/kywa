"use client";

import { useState, useEffect } from "react";
import { Play, BookOpen, Compass, Gamepad2, Award, Users, ArrowRight, ShieldCheck, MapPin, Sparkles, Trophy, CheckCircle2, ChevronRight, Zap, Target, Lock, Clock, Heart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#172033] font-sans selection:bg-[#1558C9] selection:text-white">
      
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-12">
        
        {/* 상단 로그인/비로그인 시연 토글 바 */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#102A43] text-white shadow-sm hover:bg-slate-900 transition-all flex items-center gap-1.5 touch-target"
          >
            <span>{isLoggedIn ? "👤 로그인 대시보드 상태 (클릭 시 비로그인 메인)" : "🔓 비로그인 메인 상태 (클릭 시 로그인 대시보드)"}</span>
          </button>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* 5-1. 비로그인 메인 화면                                                    */}
        {/* -------------------------------------------------------------------------- */}
        {!isLoggedIn ? (
          <div className="space-y-16 animate-in fade-in duration-300">
            
            {/* 1. 히어로 영역 */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-[20px] border border-[#E2E8F0] shadow-sm">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <span className="inline-block text-xs font-black text-[#1558C9] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 uppercase tracking-wide">
                    KYWA PLAY SAFE
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl font-black text-[#102A43] tracking-tight leading-tight">
                    오늘의 안전을<br />
                    <span className="text-[#1558C9]">3분 미션으로.</span>
                  </h1>

                  <p className="text-base text-[#102A43] font-bold leading-relaxed max-w-lg">
                    일상 속 위험을 발견하고, 판단하고, 안전하게 행동해요.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/campaign/cyber-bullying"
                    className="krds-public-button px-7 py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg transition-all flex items-center gap-2 touch-target"
                  >
                    <Play size={18} className="fill-white" />
                    <span>무료 체험 미션 시작</span>
                  </Link>

                  <Link
                    href="/campaign"
                    className="krds-public-button px-6 py-4 bg-slate-100 hover:bg-slate-200 text-[#172033] font-bold text-sm rounded-[14px] transition-all flex items-center gap-1.5 touch-target"
                  >
                    <span>안전 미션 둘러보기</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="krds-public-card p-6 border-l-4 border-l-[#7557D9] space-y-4 bg-slate-50/50 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <span className="text-xs font-black text-[#7557D9] bg-purple-50 px-2.5 py-1 rounded-md tracking-wider">
                      TODAY'S QUEST
                    </span>
                    <span className="text-xs font-bold text-[#159A83] bg-emerald-50 px-2.5 py-1 rounded-md tabular-nums">
                      보상 +80 XP
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-[#102A43]">피싱 문자를 찾아라</h3>
                    <div className="text-xs text-[#5D6B7E] font-bold space-y-1">
                      <div>• 분야: <strong className="text-[#7557D9]">디지털안전</strong> | 소요시간: <strong className="text-[#102A43]">약 3분</strong></div>
                      <div>• 난이도: <strong className="text-[#102A43]">보통</strong></div>
                    </div>
                  </div>

                  <Link
                    href="/campaign/cyber-bullying"
                    className="krds-public-button w-full py-3 bg-[#102A43] hover:bg-black text-white font-black text-xs rounded-[14px] text-center block shadow-md transition-all touch-target"
                  >
                    [지금 시작]
                  </Link>
                </div>
              </div>
            </section>

            {/* 2. 5개 안전구역 시각적 지도 */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-black text-[#102A43] flex items-center gap-2">
                  <MapPin size={22} className="text-[#1558C9]" /> 🏙️ 5대 안전구역 시각적 지도
                </h2>
                <span className="text-xs text-[#5D6B7E] font-bold">클릭하여 해당 구역으로 이동 🗺️</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <Link href="/campaign" className="krds-public-card p-5 border-l-4 border-l-[#1558C9] hover:bg-blue-50/50 transition-all group">
                  <span className="text-2xl block mb-2">🏢</span>
                  <h3 className="text-sm font-black text-[#102A43] group-hover:text-[#1558C9]">생활안전</h3>
                  <p className="text-[11px] text-[#5D6B7E] font-medium mt-1">통학로·PM·약물</p>
                </Link>

                <Link href="/campaign" className="krds-public-card p-5 border-l-4 border-l-[#7557D9] hover:bg-purple-50/50 transition-all group">
                  <span className="text-2xl block mb-2">💻</span>
                  <h3 className="text-sm font-black text-[#102A43] group-hover:text-[#7557D9]">디지털안전</h3>
                  <p className="text-[11px] text-[#5D6B7E] font-medium mt-1">피싱·딥페이크</p>
                </Link>

                <Link href="/campaign" className="krds-public-card p-5 border-l-4 border-l-[#EA580C] hover:bg-orange-50/50 transition-all group">
                  <span className="text-2xl block mb-2">🌋</span>
                  <h3 className="text-sm font-black text-[#102A43] group-hover:text-[#EA580C]">재난안전</h3>
                  <p className="text-[11px] text-[#5D6B7E] font-medium mt-1">지진·폭우대처</p>
                </Link>

                <Link href="/campaign" className="krds-public-card p-5 border-l-4 border-l-[#159A83] hover:bg-emerald-50/50 transition-all group">
                  <span className="text-2xl block mb-2">🏕️</span>
                  <h3 className="text-sm font-black text-[#102A43] group-hover:text-[#159A83]">활동안전</h3>
                  <p className="text-[11px] text-[#5D6B7E] font-medium mt-1">캠핑·R.I.C.E</p>
                </Link>

                <Link href="/campaign/dodac" className="krds-public-card p-5 border-l-4 border-l-[#EC4899] hover:bg-pink-50/50 transition-all group col-span-1 sm:col-span-1">
                  <span className="text-2xl block mb-2">🎧</span>
                  <h3 className="text-sm font-black text-[#102A43] group-hover:text-[#EC4899]">마음안전</h3>
                  <p className="text-[11px] text-[#5D6B7E] font-medium mt-1">도닥 AI 힐링</p>
                </Link>
              </div>
            </section>

            {/* 3. 3분 퀵플레이 */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">⚡ 3분 퀵플레이</h2>
                <Link href="/campaign" className="text-xs font-bold text-[#1558C9] hover:underline">전체보기 →</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="krds-public-card p-5 border-l-4 border-l-[#1558C9] space-y-3">
                  <span className="text-[10px] font-black bg-blue-50 text-[#1558C9] px-2.5 py-0.5 rounded-md uppercase">생활안전</span>
                  <h3 className="text-sm font-black text-[#102A43]">나의 안전 MBTI 성향 진단</h3>
                  <div className="text-[11px] text-[#5D6B7E] font-bold space-y-1 tabular-nums">
                    <div>• 소요시간: 약 3분 | 난이도: 보통</div>
                    <div>• 보상: +50 XP</div>
                  </div>
                  <Link href="/campaign/mbti" className="krds-public-button w-full py-2.5 bg-[#102A43] text-white font-bold rounded-[14px] text-xs text-center block touch-target">
                    플레이 →
                  </Link>
                </div>

                <div className="krds-public-card p-5 border-l-4 border-l-[#7557D9] space-y-3">
                  <span className="text-[10px] font-black bg-purple-50 text-[#7557D9] px-2.5 py-0.5 rounded-md uppercase">디지털안전</span>
                  <h3 className="text-sm font-black text-[#102A43]">사이버 폭력 & 피싱 판별</h3>
                  <div className="text-[11px] text-[#5D6B7E] font-bold space-y-1 tabular-nums">
                    <div>• 소요시간: 약 3분 | 난이도: 보통</div>
                    <div>• 보상: +70 XP</div>
                  </div>
                  <Link href="/campaign/cyber-bullying" className="krds-public-button w-full py-2.5 bg-[#102A43] text-white font-bold rounded-[14px] text-xs text-center block touch-target">
                    플레이 →
                  </Link>
                </div>

                <div className="krds-public-card p-5 border-l-4 border-l-[#EC4899] space-y-3">
                  <span className="text-[10px] font-black bg-pink-50 text-[#EC4899] px-2.5 py-0.5 rounded-md uppercase">마음안전</span>
                  <h3 className="text-sm font-black text-[#102A43]">도닥 AI 또래 힐링 상담</h3>
                  <div className="text-[11px] text-[#5D6B7E] font-bold space-y-1 tabular-nums">
                    <div>• 소요시간: 약 4분 | 난이도: 보통</div>
                    <div>• 보상: +60 XP</div>
                  </div>
                  <Link href="/campaign/dodac" className="krds-public-button w-full py-2.5 bg-[#102A43] text-white font-bold rounded-[14px] text-xs text-center block touch-target">
                    플레이 →
                  </Link>
                </div>
              </div>
            </section>

            {/* 4. 2026 장마 시즌 공동미션 */}
            <section className="bg-gradient-to-r from-[#102A43] to-[#1e3a8a] text-white p-8 rounded-[20px] shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-300 bg-yellow-950/80 px-3 py-1 rounded-md border border-yellow-500/30">
                  🌧️ 2026 장마 시즌 대국민 공동미션
                </span>
                <span className="text-xs font-bold text-cyan-300">레인 가디언 수여</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">집중호우·물놀이 안전 퀴즈 대국민 공동 도전!</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  전국 이용자가 함께 장마철 보도 위 위험 지점 수칙 퀴즈를 풀고 디재스터 구역 조명을 켭니다.
                </p>
              </div>

              <Link href="/archive" className="krds-public-button px-5 py-2.5 bg-[#1558C9] hover:bg-blue-600 text-white font-bold text-xs rounded-[14px] inline-block touch-target">
                시즌 미션 참여하기 →
              </Link>
            </section>

            {/* 5. 이번 달 꼭 알아야 할 안전정보 */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">📚 이번 달 꼭 알아야 할 안전정보</h2>
                <Link href="/archive" className="text-xs font-bold text-[#1558C9] hover:underline">28종 전체보기 →</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Link href="/archive" className="krds-public-card p-4 hover:border-[#1558C9] transition-all space-y-2 group">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900/5">
                    <Image src="/images/cards/card_01_heatwave.jpg" alt="폭염 온열질환 예방" fill className="object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-bold text-[#1558C9] block">#01 6월 · 재난</span>
                  <h4 className="text-xs font-bold text-[#102A43] truncate">체육대회 폭염 온열질환 예방 수칙</h4>
                </Link>

                <Link href="/archive" className="krds-public-card p-4 hover:border-[#1558C9] transition-all space-y-2 group">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900/5">
                    <Image src="/images/cards/card_02_rice.jpg" alt="발목 R.I.C.E 대처법" fill className="object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-bold text-[#159A83] block">#02 6월 · 활동</span>
                  <h4 className="text-xs font-bold text-[#102A43] truncate">발목 접질렸을 때 R.I.C.E 대처법</h4>
                </Link>

                <Link href="/archive" className="krds-public-card p-4 hover:border-[#1558C9] transition-all space-y-2 group">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900/5">
                    <Image src="/images/cards/card_03_pm_safety.jpg" alt="전동킥보드 법적 의무" fill className="object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-bold text-[#1558C9] block">#03 6월 · 일상</span>
                  <h4 className="text-xs font-bold text-[#102A43] truncate">전동킥보드 탑승 전 꼭 확인할 3가지</h4>
                </Link>

                <Link href="/archive" className="krds-public-card p-4 hover:border-[#1558C9] transition-all space-y-2 group">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-900/5">
                    <Image src="/images/cards/card_04_digital_security.jpg" alt="스마트폰 3대 보안" fill className="object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-bold text-[#7557D9] block">#04 6월 · 디지털</span>
                  <h4 className="text-xs font-bold text-[#102A43] truncate">스마트폰과 계정을 지키는 3대 보안</h4>
                </Link>
              </div>
            </section>

            {/* 6. 함께 만든 안전 변화 */}
            <section className="krds-public-card p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">🌱 함께 만든 안전 변화</h2>
              <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">
                전국 16개 지역 청소년 안전홍보단과 대국민의 정기 보고 및 검수를 거친 실질적 성과 기록입니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 tabular-nums">
                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="text-xs text-[#5D6B7E] font-bold block">공모 선정 안전홍보단</span>
                  <strong className="text-xl font-black text-[#1558C9] block">16개 공식 팀</strong>
                  <span className="text-[10px] text-slate-400">전국 16개 시·도 진흥원 연계</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="text-xs text-[#5D6B7E] font-bold block">정식 발간 안전 정보</span>
                  <strong className="text-xl font-black text-[#159A83] block">28종 공식 카드뉴스</strong>
                  <span className="text-[10px] text-slate-400">6월부터 12월까지 매월 4종 발행</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="text-xs text-[#5D6B7E] font-bold block">정기 보고 마감 체계</span>
                  <strong className="text-xl font-black text-[#7557D9] block">매주 월요일 23:00</strong>
                  <span className="text-[10px] text-slate-400">주차별 활동 보고 검수 진행</span>
                </div>
              </div>
            </section>

            {/* 7. 안전공모전 & 전국 안전홍보단 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="krds-public-card p-6 border-l-4 border-l-[#F4B740] space-y-3">
                <h3 className="text-lg font-black text-[#102A43]">🏆 2026 청소년활동 안전 공모전</h3>
                <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">
                  청소년 숏폼, 4컷 만화, 아이디어 작품을 출품하고 우수 작품 갤러리를 관람하세요.
                </p>
                <Link href="/contest" className="krds-public-button px-4 py-2.5 bg-[#102A43] text-white text-xs font-bold rounded-[14px] inline-block touch-target">
                  공모전 안내 & 접수 →
                </Link>
              </div>

              <div className="krds-public-card p-6 border-l-4 border-l-[#1558C9] space-y-3">
                <h3 className="text-lg font-black text-[#102A43]">🛡️ 전국 16개 안전홍보단</h3>
                <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">
                  16개 지역 팀의 활동 피드, 주간 보고서 및 공식 양식을 자유롭게 둘러보세요.
                </p>
                <Link href="/crew" className="krds-public-button px-4 py-2.5 bg-[#1558C9] text-white text-xs font-bold rounded-[14px] inline-block touch-target">
                  홍보단 피드 보기 →
                </Link>
              </div>
            </section>

          </div>
        ) : (
          /* ==================================================================== */
          /* 5-2. 로그인 메인 대시보드 (유저 와이어프레임 & 개인화 5단계 100% 반영!)   */
          /* ==================================================================== */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* 프로필 헤더: 안녕하세요, 디지털 쉴더 민지님 / Lv.18 / 2,340 / 3,000 XP / 이번 주 4개 미션 완료 / 오늘 안전 등급: 보통 */}
            <section className="krds-public-card p-8 bg-[#102A43] text-white space-y-6 shadow-xl border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#159A83] bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                      GUARDIAN DASHBOARD
                    </span>
                    <span className="text-xs font-bold text-yellow-300 bg-yellow-950/80 px-3 py-1 rounded-full border border-yellow-500/30">
                      오늘 안전 등급: 보통 🟢
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white">
                    안녕하세요, <span className="text-cyan-300">디지털 쉴더 민지</span>님 🛡️
                  </h1>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-[16px] border border-white/10 shrink-0 tabular-nums">
                  <div className="w-14 h-14 rounded-[12px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
                    Lv.18
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-cyan-300">2,340 / 3,000 XP</div>
                    <div className="text-[11px] text-slate-300">이번 주 <strong className="text-yellow-300 font-bold">4개 미션</strong> 완료 완료</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 🎯 개인화 1순위: 진행 중인 미션 [마지막 플레이 이어하기] */}
            <section className="krds-public-card p-6 border-l-4 border-l-[#7557D9] space-y-4 bg-purple-50/20">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#7557D9] bg-purple-100 px-2.5 py-1 rounded-md">
                    1순위 · 진행 중인 미션
                  </span>
                  <span className="text-xs font-bold text-[#102A43]">▶️ 마지막 플레이 이어하기</span>
                </div>
                <span className="text-xs font-bold text-[#1558C9] tabular-nums">진행률 60% · 남은 시간 약 2분</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#102A43]">피싱 스와이프 미션</h3>
                  <p className="text-xs text-[#5D6B7E] mt-0.5 font-medium">스미싱 판별 및 문자 다이어트 리라이트 미션 진행 중입니다.</p>
                </div>

                <Link
                  href="/campaign/cyber-bullying"
                  className="krds-public-button px-6 py-3 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-[14px] shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 touch-target"
                >
                  <Play size={14} className="fill-white" />
                  <span>1초 만에 계속 플레이</span>
                </Link>
              </div>
            </section>

            {/* 🎯 개인화 2순위: 오늘의 추천 미션 & 3순위: 취약 안전 분야 추천 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 2순위: 오늘의 추천 미션 */}
              <div className="krds-public-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-base font-black text-[#102A43] flex items-center gap-2">
                    <Target size={18} className="text-[#1558C9]" /> 2순위 · [오늘의 추천 미션]
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#1558C9] px-2 py-0.5 rounded-md">매일 밤 12시 갱신</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#102A43]">• PM 전동킥보드 법적 수칙 퀴즈</h4>
                      <span className="text-[10px] text-[#5D6B7E]">보상: +50 XP | 소요시간 2분</span>
                    </div>
                    <span className="text-xs font-bold text-[#159A83]">🟢 완료</span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#102A43]">• 식중독 예방 수칙 카드뉴스 정독</h4>
                      <span className="text-[10px] text-[#5D6B7E]">보상: +70 XP | 소요시간 3분</span>
                    </div>
                    <Link href="/archive" className="krds-public-button px-3.5 py-1.5 bg-[#1558C9] text-white font-bold rounded-[10px] text-[11px]">도전</Link>
                  </div>
                </div>
              </div>

              {/* 3순위: 내 안전 스킬 (취약 분야 추천) */}
              <div className="krds-public-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <h3 className="text-base font-black text-[#102A43] flex items-center gap-2">
                    <Zap size={18} className="text-[#F4B740]" /> 3순위 · [내 안전 스킬 & 취약 분야]
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">취약 보완 필요</span>
                </div>

                <div className="space-y-3 text-xs tabular-nums">
                  <div>
                    <div className="flex justify-between font-bold text-[#102A43] mb-1">
                      <span>• 디지털 보안 스킬</span>
                      <span className="text-[#7557D9]">Lv.8 (80%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#7557D9] h-2 rounded-full w-[80%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[#102A43] mb-1">
                      <span>• 재난 대피 보완 스킬 (취약)</span>
                      <span className="text-[#EA580C]">Lv.5 (50%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#EA580C] h-2 rounded-full w-[50%]"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 🎯 개인화 4순위: 시즌 공동미션 */}
            <section className="bg-gradient-to-r from-[#102A43] to-[#1e3a8a] text-white p-6 rounded-[20px] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-yellow-300 bg-yellow-950/80 px-2.5 py-0.5 rounded-md border border-yellow-500/30">
                  4순위 · [시즌 공동미션]
                </span>
                <h3 className="text-base font-black text-white">🌧️ 2026 장마 시즌 집중호우 퀴즈 대국민 공동 도전</h3>
              </div>
              <Link href="/archive" className="krds-public-button px-5 py-2.5 bg-[#1558C9] hover:bg-blue-600 text-white font-bold text-xs rounded-[14px] shrink-0 touch-target">
                시즌 미션 도전 →
              </Link>
            </section>

            {/* 🎯 개인화 5순위: 획득 가능한 배지 & 소속 길드 활동 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 5순위-A: 획득 가능한 배지 */}
              <div className="krds-public-card p-6 space-y-3">
                <h3 className="text-base font-black text-[#102A43] flex items-center gap-2">
                  <Award size={18} className="text-[#F4B740]" /> 5순위 · [획득 가능한 배지]
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-3 bg-amber-50 rounded-[12px] border border-amber-200 space-y-1">
                    <span className="text-lg">🛡️</span>
                    <span className="font-bold text-amber-900 block text-[11px]">안전 가디언</span>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-[12px] border border-cyan-200 space-y-1">
                    <span className="text-lg">🌧️</span>
                    <span className="font-bold text-cyan-900 block text-[11px]">레인 가디언</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-[12px] border border-purple-200 space-y-1">
                    <span className="text-lg">🎧</span>
                    <span className="font-bold text-purple-900 block text-[11px]">도닥이 마음</span>
                  </div>
                </div>
              </div>

              {/* 5순위-B: 소속 길드 활동 */}
              <div className="krds-public-card p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-black text-[#102A43] flex items-center gap-2">
                    <Users size={18} className="text-[#1558C9]" /> 5순위 · [소속 길드 활동]
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-[#159A83] px-2 py-0.5 rounded-md">SAFE CREW</span>
                </div>
                <p className="text-xs text-[#5D6B7E] font-medium bg-slate-50 p-3 rounded-[12px] border border-[#E2E8F0]">
                  교내 통학로 위험 펜스 지도 제작 및 150명 현장 모니터링 수행 완료 소식.
                </p>
                <Link href="/crew" className="krds-public-button w-full py-2.5 bg-[#102A43] text-white font-bold rounded-[14px] text-xs text-center block touch-target">
                  홍보단 워크스페이스 이동 →
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
