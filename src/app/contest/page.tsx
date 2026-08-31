"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  Award, Trophy, Sparkles, Send, CheckCircle2, Upload, FileText, 
  Vote, Calendar, Heart, ShieldCheck, AlertCircle, Eye, ChevronRight, 
  HelpCircle, ArrowRight, User, Star, Download, Bot, Lightbulb, 
  Flame, Smartphone, CloudRain, Activity, Smile, Video, BookOpen, Layers
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ContestContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"info" | "submit" | "guidelines" | "vote">("info");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "submit") setActiveTab("submit");
    else if (tabParam === "vote") setActiveTab("vote");
    else if (tabParam === "guidelines") setActiveTab("guidelines");
  }, [searchParams]);

  const topics = [
    {
      no: "01",
      title: "재난안전",
      icon: CloudRain,
      color: "#2563eb",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      items: [
        "자연재난, 사회재난, 복합재난 위기 대응력 증진",
        "지역사회 재난 취약지역(시설) 발굴 및 모니터링",
        "재난 사각지대 발굴 및 개선 방안"
      ]
    },
    {
      no: "02",
      title: "청소년활동안전",
      icon: Activity,
      color: "#059669",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      items: [
        "청소년활동 중 사고 예방을 위한 안전수칙",
        "수련시설 안전 점검 및 안전 사각지대 발굴",
        "활동 현장 위험요소 선제적 예방 대안"
      ]
    },
    {
      no: "03",
      title: "생활안전",
      icon: Flame,
      color: "#d97706",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      items: [
        "일상 속 안전사고 예방 행동수칙",
        "약물·의약품 오남용 예방 및 사고 대응",
        "교통·낙상·화재 대응 실천 콘텐츠"
      ]
    },
    {
      no: "04",
      title: "디지털안전",
      icon: Smartphone,
      color: "#0284c7",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      items: [
        "인공지능(AI) 악용 범죄(딥페이크 등) 예방",
        "개인정보 보호 및 사이버폭력 예방",
        "게임 및 스마트폰 과의존 예방 가이드"
      ]
    },
    {
      no: "05",
      title: "심리·정서안전",
      icon: Smile,
      color: "#7c3aed",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      items: [
        "청소년 정서 지원 활동 (상담, 멘토링)",
        "정신건강 관리 (우울증·불안 조절)",
        "마음 회복 및 힐링 안전 콘텐츠"
      ]
    }
  ];

  const categories = [
    {
      id: "edu",
      title: "안전 교육자료",
      icon: BookOpen,
      badge: "분야 01",
      color: "text-blue-700 bg-blue-50 border-blue-200",
      format: "HWPX · PPTX 등 편집 원본 및 PDF",
      length: "20페이지 이내 (자유 양식)"
    },
    {
      id: "shortform",
      title: "동영상 (숏폼)",
      icon: Video,
      badge: "분야 02",
      color: "text-rose-700 bg-rose-50 border-rose-200",
      format: "MP4 완성본 및 편집 소스 (500MB 이내)",
      length: "30초 이상 ~ 1분 이내 (가로/세로 1920×1080px 이상)"
    },
    {
      id: "webtoon",
      title: "웹툰",
      icon: Layers,
      badge: "분야 03",
      color: "text-purple-700 bg-purple-50 border-purple-200",
      format: "JPG · PNG 완성본 및 AI·PSD·PPTX 편집 원본",
      length: "5페이지 이상 (1컷당 1,000×1,000px, 300dpi 이상)"
    },
    {
      id: "cardnews",
      title: "한눈정보 (카드뉴스)",
      icon: FileText,
      badge: "분야 04",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      format: "JPG · PNG 완성본 및 AI·PSD·PPTX 편집 원본",
      length: "5페이지 이상 (1컷당 1,000×1,000px, 300dpi 이상)"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-10 selection:bg-[#1558C9] selection:text-white">
      
      {/* 상단 탭 네비게이션 */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "info"
                ? "bg-[#1558C9] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            🏆 2026 공모전 모집 요강
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "submit"
                ? "bg-[#0F172A] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            📝 작품 접수 및 신청서 제출
          </button>
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "guidelines"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            🤖 AI 도구 활용 가이드 & 유의사항
          </button>
          <button
            onClick={() => setActiveTab("vote")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === "vote"
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            🗳️ 대국민 실시간 투표 갤러리
          </button>
        </div>

        <span className="text-xs font-black text-[#1558C9] hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
          <Sparkles size={14} /> KYWA AI SAFETY CONTEST 2026
        </span>
      </div>

      {/* ==================================================================== */}
      {/* 🌟 1. 공모전 안내 (모집 요강)                                         */}
      {/* ==================================================================== */}
      {activeTab === "info" && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* 히어로 헤더 카드 */}
          <section className="bg-white p-8 sm:p-12 border border-slate-200/90 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
            <div className="space-y-4 max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1558C9] text-xs font-black uppercase">
                <Bot size={14} />
                <span>여성가족부 · 한국청소년활동진흥원 공식 공모전</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.2]">
                2026년 AI활용<br />
                <span className="text-[#1558C9]">청소년활동 안전공모전</span>
              </h1>

              <p className="text-sm sm:text-base font-semibold text-[#334155] leading-relaxed">
                인공지능(AI) 도구를 창의적으로 활용하여 청소년활동 안전 문화를 확산하고, 
                안전 사각지대를 해소할 우수 콘텐츠와 아이디어를 공모합니다.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setActiveTab("submit")}
                  className="krds-public-button px-7 py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-2 touch-target"
                >
                  <Send size={16} />
                  <span>[ 📝 공모전 접수 바로가기 ]</span>
                </button>

                <a
                  href="mailto:hamesta@naver.com"
                  className="krds-public-button px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-2 touch-target"
                >
                  <Download size={16} className="text-[#1558C9]" />
                  <span>이메일 제출처 (hamesta@naver.com)</span>
                </a>
              </div>
            </div>

            {/* 주요 일정 4단계 타임라인 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-slate-100">
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1.5">
                <span className="text-[11px] font-black text-[#1558C9] block flex items-center gap-1">
                  <Calendar size={13} /> 1. 공고 및 접수
                </span>
                <p className="text-sm font-black text-[#0F172A]">2026.09.03 ~ 10.09</p>
                <span className="text-[10px] text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-200 inline-block">10.09(금) 18:00 마감</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-black text-slate-700 block flex items-center gap-1">
                  <ShieldCheck size={13} /> 2. 서류 & 전문가 심사
                </span>
                <p className="text-sm font-black text-[#0F172A]">2026.10.13 ~ 10.27</p>
                <span className="text-[10px] text-slate-700 font-bold bg-slate-200/70 px-2 py-0.5 rounded inline-block">1차 요건 · 2차 정성평가</span>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-1.5">
                <span className="text-[11px] font-black text-[#7C3AED] block flex items-center gap-1">
                  <Sparkles size={13} /> 3. 최종 결과 발표
                </span>
                <p className="text-sm font-black text-[#0F172A]">2026.11.02 (월)</p>
                <span className="text-[10px] text-purple-900 font-bold bg-purple-100 px-2 py-0.5 rounded border border-purple-200 inline-block">홈페이지 및 개별 통보</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1.5">
                <span className="text-[11px] font-black text-amber-800 block flex items-center gap-1">
                  <Trophy size={13} /> 4. 시상식 & 성과공유회
                </span>
                <p className="text-sm font-black text-[#0F172A]">2026.11.12 (목)</p>
                <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-200 inline-block">서울 시상식장 상장 수여</span>
              </div>
            </div>
          </section>

          {/* 5대 공모 주제 그리드 */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black text-[#1558C9] uppercase tracking-wider">
                  5 SAFETY THEMES
                </span>
                <h2 className="text-2xl font-black text-[#0F172A] mt-0.5">
                  공모 주제 (5대 안전 영역)
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">복수 주제 및 다작 응모 가능</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {topics.map((t) => {
                const Icon = t.icon;
                return (
                  <div 
                    key={t.no}
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#1558C9] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${t.bgColor} ${t.borderColor}`} style={{ color: t.color }}>
                        TOPIC {t.no}
                      </span>
                      <Icon className="h-5 w-5" style={{ color: t.color }} />
                    </div>

                    <h3 className="text-lg font-black text-[#0F172A]">{t.title}</h3>

                    <ul className="space-y-1.5 text-xs text-[#334155] font-medium leading-relaxed">
                      {t.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#1558C9] font-black">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {/* 우수사례 및 AI 활용 특별 카드 */}
              <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-200">
                    SPECIAL CRITERIA
                  </span>
                  <h3 className="text-base font-black text-[#0F172A]">AI 도구 활용 필수 요건</h3>
                  <p className="text-xs text-[#334155] font-medium leading-relaxed">
                    기획, 자료조사, 문안 작성, 이미지 생성, 영상 제작 등 <strong>제작 과정의 1단계 이상</strong>에서 AI 도구를 활용하고 내역서를 작성해 주세요.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("guidelines")}
                  className="text-xs font-black text-[#1558C9] hover:underline flex items-center gap-1"
                >
                  <span>AI 도구 활용 가이드 확인하기</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* 4대 공모 분야 및 규격 */}
          <section className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-black text-[#0284C7] uppercase tracking-wider">
                4 SUBMISSION CATEGORIES
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] mt-0.5">
                공모 분야 및 제출 규격
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div 
                    key={cat.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#1558C9] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${cat.color}`}>
                          {cat.badge}
                        </span>
                        <Icon className="h-5 w-5 text-slate-600" />
                      </div>

                      <h3 className="text-base font-black text-[#0F172A]">{cat.title}</h3>

                      <div className="space-y-2 text-xs text-[#334155] font-medium pt-2 border-t border-slate-100">
                        <div>
                          <strong className="text-slate-900 block">• 제출 파일:</strong>
                          <span className="text-[11px] text-slate-600">{cat.format}</span>
                        </div>
                        <div>
                          <strong className="text-slate-900 block">• 규격/분량:</strong>
                          <span className="text-[11px] text-slate-600">{cat.length}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("submit")}
                      className="w-full py-2.5 bg-slate-100 hover:bg-[#1558C9] hover:text-white text-[#0F172A] text-xs font-black rounded-xl transition-all"
                    >
                      해당 분야 접수하기
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 시상 내역 및 심사 기준 */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 시상 내역 (총 12팀) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase">
                  AWARDS & PRIZES
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-1">시상 내역 (총 12점 / 상금 290만원)</h3>
              </div>

              <div className="space-y-3 text-xs font-bold text-[#0F172A]">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-amber-900 block">🥇 최우수상 (1점)</span>
                    <span className="text-[11px] text-amber-800">여성가족부장관상</span>
                  </div>
                  <span className="text-base font-black text-amber-900">상금 500,000원</span>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-blue-900 block">🥈 우수상 (2점)</span>
                    <span className="text-[11px] text-blue-800">한국청소년활동진흥원이사장상</span>
                  </div>
                  <span className="text-base font-black text-blue-900">각 300,000원</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-slate-900 block">🥉 장려상 (9점)</span>
                    <span className="text-[11px] text-slate-600">한국청소년활동진흥원이사장상</span>
                  </div>
                  <span className="text-base font-black text-slate-900">각 200,000원</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                * 출품작의 수 및 심사 결과에 따라 시상 내역이 일부 조정될 수 있습니다.
              </p>
            </div>

            {/* 심사 기준 (100점 만점) */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-7 space-y-5 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 uppercase">
                  EVALUATION CRITERIA
                </span>
                <h3 className="text-xl font-black text-[#0F172A] mt-1">심사 항목 및 배점 기준 (100점)</h3>
              </div>

              <div className="space-y-2.5 text-xs text-[#334155]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 block">1. 창의성 (30점)</strong>
                    <span className="text-[11px] text-slate-600">새로운 관점의 접근, 차별화된 AI 활용 방식</span>
                  </div>
                  <span className="text-sm font-black text-[#1558C9]">30점</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 block">2. 주제적합성 (30점)</strong>
                    <span className="text-[11px] text-slate-600">안전 목적 부합성, 청소년·국민 공감대 형성</span>
                  </div>
                  <span className="text-sm font-black text-[#1558C9]">30점</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 block">3. 완성도 (20점)</strong>
                    <span className="text-[11px] text-slate-600">논리적 흐름, 안전정보의 신뢰성 및 결과물 검토 수준</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">20점</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="text-slate-900 block">4. 활용성 (20점)</strong>
                    <span className="text-[11px] text-slate-600">간결하고 명확한 메시지 전달, 디지털 매체 확산 매력도</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">20점</span>
                </div>
              </div>
            </div>

          </section>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 2. 작품 접수 및 신청서 제출 (SUBMISSION FORM)                      */}
      {/* ==================================================================== */}
      {activeTab === "submit" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in duration-300">
          
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              OFFICIAL APPLICATION FORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              2026년 AI활용 청소년활동 안전공모전 참가 신청서
            </h2>
            <p className="text-xs font-medium text-slate-600">
              온라인 양식을 작성하여 접수하시거나, 신청서 서식을 작성하여 이메일(<code>hamesta@naver.com</code>)로 제출해 주세요.
            </p>
          </div>

          <form 
            onSubmit={e => { 
              e.preventDefault(); 
              alert("🎉 공모전 참가 신청이 성공적으로 접수되었습니다! \n담당자가 검토 후 등록 이메일로 접수 확인 번호를 발송해 드립니다."); 
              setActiveTab("vote"); 
            }} 
            className="space-y-6 text-xs font-bold text-[#0F172A]"
          >
            {/* 1. 참가자 기본 정보 */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                <User size={16} className="text-[#1558C9]" /> 1. 참가자 / 팀 정보
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">참가 구분:</label>
                  <select className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                    <option value="personal">개인 참가</option>
                    <option value="team">팀 참가 (2인 이상)</option>
                    <option value="org">기관 / 청소년수련시설 단체</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">성명 (대표자 / 기관명):</label>
                  <input type="text" placeholder="예: 홍길동 (또는 OO청소년문화의집)" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">팀명 (팀 참가 시):</label>
                  <input type="text" placeholder="팀 참가 시 팀명 입력" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">연락처 (휴대전화):</label>
                  <input type="tel" placeholder="010-1234-5678" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">이메일 주소 (접수증 수신용):</label>
                  <input type="email" placeholder="safety@example.com" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
                </div>
              </div>
            </div>

            {/* 2. 공모 분야 및 주제 선택 */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                <Layers size={16} className="text-[#1558C9]" /> 2. 공모 분야 및 주제 선택
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-700">• 공모 분야:</label>
                  <select className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                    <option value="edu">➊ 안전 교육자료 (HWPX/PPTX 20p 이내)</option>
                    <option value="shortform">➋ 동영상(숏폼) (30초~1분 이내)</option>
                    <option value="webtoon">➌ 웹툰 (5페이지 이상)</option>
                    <option value="cardnews">➍ 한눈정보(카드뉴스) (5페이지 이상)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">• 공모 주제:</label>
                  <select className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                    <option value="disaster">① 재난안전 (자연/사회재난 대응, 취약지역 개선)</option>
                    <option value="activity">② 청소년활동안전 (활동수칙, 수련시설 점검)</option>
                    <option value="living">③ 생활안전 (약물오남용 예방, 일상사고 대응)</option>
                    <option value="digital">④ 디지털안전 (딥페이크·AI범죄 예방, 사이버폭력)</option>
                    <option value="mind">⑤ 심리·정서안전 (정신건강, 상담·멘토링, 힐링)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. 작품 내용 및 AI 도구 활용 내역 */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                <Bot size={16} className="text-[#1558C9]" /> 3. 작품 내용 및 AI 도구 활용 내역서
              </h3>

              <div>
                <label className="block mb-1 text-slate-700">• 제안명 (작품 제목):</label>
                <input type="text" placeholder="예: 3초 만에 판별하는 청소년 딥페이크 예방 가이드" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">• 작품 요약 (핵심 내용과 기대효과 300자 이내):</label>
                <textarea rows={3} placeholder="작품의 기획 의도와 전하고자 하는 핵심 안전 메시지를 간결하게 작성하세요." className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">• 활용한 주요 AI 도구 및 활용 범위 (필수 기재):</label>
                <input type="text" placeholder="예: ChatGPT(기획 및 문안 검토), Midjourney/ImageFX(캐릭터 및 배경 생성), CapCut AI(영상 자막/편집)" className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                  * AI 도구 활용 사실을 사실대로 기재해야 하며, 필요 시 프롬프트 및 원본 소스 제출이 요구될 수 있습니다.
                </span>
              </div>
            </div>

            {/* 파일 첨부 및 파일명 규격 */}
            <div className="p-6 bg-blue-50/50 border border-dashed border-blue-300 rounded-2xl text-center space-y-2">
              <Upload size={28} className="mx-auto text-[#1558C9]" />
              <span className="text-xs font-black text-[#1558C9] block">
                [클릭하여 제출 파일(압축 zip 또는 완성본 파일) 업로드]
              </span>
              <p className="text-[11px] text-slate-600 font-medium">
                파일명 규칙: <strong>공모분야_공모주제_성명(팀명)_작품명.zip</strong> (최대 500MB)
              </p>
              <p className="text-[10px] text-slate-500">
                (신청서 서약 스캔본, 작품 완성본 및 편집 원본을 1개의 zip 파일로 압축하여 제출 권장)
              </p>
            </div>

            {/* 최종 제출 버튼 */}
            <button 
              type="submit" 
              className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 touch-target"
            >
              <Send size={18} />
              <span>[ 🚀 2026 AI활용 안전공모전 참가 신청서 최종 제출하기 ]</span>
            </button>
          </form>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 3. AI 도구 활용 가이드 & 유의사항 (GUIDELINES)                     */}
      {/* ==================================================================== */}
      {activeTab === "guidelines" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in duration-300">
          
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              AI ETHICS & RULES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              인공지능(AI) 도구 활용 가이드 및 응모 유의사항
            </h2>
            <p className="text-xs font-medium text-slate-600">
              공정한 공모전 운영과 저작권 보호를 위해 아래의 AI 활용 가이드라인을 반드시 숙지해 주시기 바랍니다.
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#334155] font-medium leading-relaxed">
            
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
              <h3 className="text-sm font-black text-[#1558C9] flex items-center gap-1.5">
                <Bot size={16} /> 1. AI 도구 활용 범위 및 필수 요건
              </h3>
              <p>
                모든 출품작은 기획, 자료조사, 문안 작성, 이미지 생성, 영상 제작 등 제작 과정의 <strong>한 단계 이상에서 AI 도구를 활용</strong>해야 합니다.
                사용 가능한 AI 도구(예: ChatGPT, Claude, ImageFX, Midjourney, Vrew, CapCut AI 등)에는 제한이 없으나, 활용 내역서에 사용 도구와 활용 범위를 투명하게 기술해야 합니다.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#059669]" /> 2. 저작권, 초상권 및 권리관계 확인
              </h3>
              <p>
                출품작에 사용한 글, 이미지, 영상, 음원, 서체 등은 제3자의 저작권·초상권·상표권을 침해하지 않아야 합니다.
                참가자는 활용한 AI 서비스의 이용약관(상업적/공공적 이용 가능 여부)을 직접 확인해야 하며, 실존 인물의 얼굴·목소리를 무단 합성하거나 오인하게 하는 딥페이크 콘텐츠는 심사에서 배제됩니다.
              </p>
            </div>

            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5">
                <AlertCircle size={16} /> 3. 결격사유 및 수상 취소 규정
              </h3>
              <p>
                타 공모전 수상작, 표절작, 허위 안전정보가 포함된 작품, AI 활용 사실을 허위 기재한 작품은 심사 대상에서 제외되며, 수상 후 확인 시 상장과 상금이 환수 조치됩니다.
              </p>
            </div>

            <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2">
              <h3 className="text-sm font-black text-[#7C3AED] flex items-center gap-1.5">
                <Lightbulb size={16} /> 4. 수상작의 공익적 활용
              </h3>
              <p>
                출품작의 저작권은 창작자에게 귀속됩니다. 단, 한국청소년활동진흥원은 청소년 안전문화 확산을 위한 공익적 교육·홍보 목적에 한하여 수상작을 무상으로 복제, 배포, 게시할 수 있습니다.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* 🌟 4. 대국민 실시간 투표 갤러리 (VOTING GALLERY)                     */}
      {/* ==================================================================== */}
      {activeTab === "vote" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-sm">
            <div>
              <span className="text-xs font-black text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                PUBLIC VOTING 2026
              </span>
              <h2 className="text-xl font-black text-[#0F172A] mt-1">🗳️ 2026 안전공모전 출품작 대국민 투표 갤러리</h2>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
              온라인 실시간 투표 진행 중 (1인 1표)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: "AI가 알려주는 딥페이크 3초 구별법", category: "디지털안전", format: "동영상(숏폼)", author: "세이프 가디언즈", votes: 1420, ai: "ChatGPT + CapCut AI" },
              { id: 2, title: "물놀이 수련시설 3단계 생명안전 수칙", category: "청소년활동안전", format: "한눈정보(카드뉴스)", author: "안전.zip", votes: 1180, ai: "ImageFX + Canva" },
              { id: 3, title: "청소년 힐링 우드카빙과 마음안전 일기", category: "심리·정서안전", format: "웹툰", author: "심리지원단 파인", votes: 950, ai: "Midjourney + Vrew" },
              { id: 4, title: "지하차도 침수 시 1분 탈출 골든타임", category: "재난안전", format: "안전 교육자료", author: "이투스 크루", votes: 890, ai: "Gamma + Claude" },
              { id: 5, title: "약물·에너지음료 오남용 방지 청소년 웹툰", category: "생활안전", format: "웹툰", author: "청디가드", votes: 760, ai: "ChatGPT + Photoshop AI" },
              { id: 6, title: "체험활동 중 화재 완강기 사용 실전 숏폼", category: "청소년활동안전", format: "동영상(숏폼)", author: "안전 탭앤톡", votes: 710, ai: "Runway + Premiere AI" }
            ].map(item => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm hover:border-[#7C3AED] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                      ENTRY #{item.id} · {item.format}
                    </span>
                    <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                      ❤️ {item.votes.toLocaleString()}표
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#0F172A] leading-snug">{item.title}</h3>
                  
                  <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                    <p>• 분야: <strong>{item.category}</strong> | 출품자: <strong>{item.author}</strong></p>
                    <p className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block">
                      🤖 AI 활용: {item.ai}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`🎉 '${item.title}' 출품작에 소중한 1표를 투표하셨습니다!`)}
                  className="w-full py-3 bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all touch-target"
                >
                  <Vote size={15} />
                  <span>[ 🗳️ 이 작품에 1표 투표하기 ]</span>
                </button>
              </div>
            ))}
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
