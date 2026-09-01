"use client";

import { useState, useEffect, Suspense } from "react";
import { 
  Award, Trophy, Sparkles, Send, CheckCircle2, Upload, FileText, 
  Calendar, Heart, ShieldCheck, AlertCircle, Eye, ChevronRight, 
  HelpCircle, ArrowRight, User, Star, Download, Bot, Lightbulb, 
  Flame, Smartphone, CloudRain, Activity, Smile, Video, BookOpen, 
  Layers, Film, ExternalLink, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function ContestContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"info" | "submit" | "guidelines">("info");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "submit") {
      setActiveTab("submit");
    } else if (tabParam === "guidelines") {
      setActiveTab("guidelines");
    } else {
      setActiveTab("info");
    }
  }, [searchParams]);

  // AI 안전공모전 5대 주제
  const contestTopics = [
    { no: "01", title: "재난안전", icon: CloudRain, color: "#2563eb", bgColor: "bg-blue-50", borderColor: "border-blue-200", desc: "자연·사회·복합재난 위기 대응력 증진, 취약지역 사각지대 개선" },
    { no: "02", title: "청소년활동안전", icon: Activity, color: "#059669", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", desc: "청소년활동 사고 예방 안전수칙, 수련시설 안전 점검 우수사례" },
    { no: "03", title: "생활안전", icon: Flame, color: "#d97706", bgColor: "bg-amber-50", borderColor: "border-amber-200", desc: "약물·의약품 오남용 예방, 일상 속 낙상·교통·화재 예방 행동수칙" },
    { no: "04", title: "디지털안전", icon: Smartphone, color: "#0284c7", bgColor: "bg-sky-50", borderColor: "border-sky-200", desc: "인공지능 악용 범죄(딥페이크 등) 예방, 개인정보 및 사이버폭력 예방" },
    { no: "05", title: "심리·정서안전", icon: Smile, color: "#7c3aed", bgColor: "bg-purple-50", borderColor: "border-purple-200", desc: "청소년 정서 지원(상담·멘토링), 정신건강 관리(우울·불안 조절) 및 힐링" }
  ];

  // 4대 공모 분야
  const categories = [
    { id: "edu", title: "안전 교육자료", badge: "분야 01", format: "HWPX · PPTX 편집 원본 및 PDF", length: "20페이지 이내 (자유 양식)", color: "text-blue-700 bg-blue-50 border-blue-200" },
    { id: "shortform", title: "동영상 (숏폼)", badge: "분야 02", format: "MP4 완성본 및 편집 소스", length: "30초~1분 이내 (가로/세로 1920×1080px)", color: "text-rose-700 bg-rose-50 border-rose-200" },
    { id: "webtoon", title: "웹툰", badge: "분야 03", format: "JPG · PNG 완성본 및 편집 원본", length: "5페이지 이상 (1컷당 1,000×1,000px)", color: "text-purple-700 bg-purple-50 border-purple-200" },
    { id: "cardnews", title: "한눈정보 (카드뉴스)", badge: "분야 04", format: "JPG · PNG 완성본 및 편집 원본", length: "5페이지 이상 (1컷당 1,000×1,000px)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-10 selection:bg-[#1558C9] selection:text-white">
      
      {/* 상단 탭 네비게이션 */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
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
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
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
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === "guidelines"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Bot size={14} />
            <span>🤖 AI 도구 활용 가이드</span>
          </button>
        </div>

        <span className="text-xs font-black text-[#1558C9] hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
          <Sparkles size={14} /> KYWA AI SAFETY CONTEST 2026
        </span>
      </div>

      {/* ==================================================================== */}
      {/* 🌟 1. AI활용 청소년활동 안전공모전 (공고 요강)                        */}
      {/* ==================================================================== */}
      {activeTab === "info" && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          <section className="bg-white p-8 sm:p-12 border border-slate-200/90 rounded-3xl space-y-6 shadow-sm">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1558C9] text-xs font-black uppercase">
                <Bot size={14} />
                <span>여성가족부 · 한국청소년활동진흥원 공식 공모전</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
                2026년 AI활용<br />
                <span className="text-[#1558C9]">청소년활동 안전공모전</span>
              </h1>

              <p className="text-sm sm:text-base font-semibold text-[#334155] leading-relaxed">
                인공지능(AI) 도구를 창의적으로 활용하여 청소년활동 안전 문화를 확산하고, 
                안전 사각지대를 해소할 우수 콘텐츠와 교육자료, 웹툰, 숏폼을 공모합니다.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setActiveTab("submit")}
                  className="px-7 py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-2 touch-target"
                >
                  <Send size={16} />
                  <span>[ 📝 공모전 접수 바로가기 ]</span>
                </button>

                <a
                  href="mailto:hamesta@naver.com"
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-2 touch-target"
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

          {/* 공모 5대 주제 */}
          <section className="space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-black text-[#1558C9] uppercase tracking-wider">
                5 SAFETY THEMES
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] mt-0.5">
                공모 주제 (5대 안전 영역)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {contestTopics.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.no} className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:border-[#1558C9] transition-all">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${t.bgColor} ${t.borderColor}`} style={{ color: t.color }}>
                        TOPIC {t.no}
                      </span>
                      <Icon className="h-5 w-5" style={{ color: t.color }} />
                    </div>
                    <h3 className="text-lg font-black text-[#0F172A]">{t.title}</h3>
                    <p className="text-xs text-[#334155] font-medium leading-relaxed">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4대 공모 분야 */}
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
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm hover:border-[#1558C9] transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${cat.color}`}>
                      {cat.badge}
                    </span>
                    <h3 className="text-base font-black text-[#0F172A]">{cat.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">• {cat.format}</p>
                    <p className="text-[11px] text-slate-500">• {cat.length}</p>
                  </div>

                  <button
                    onClick={() => setActiveTab("submit")}
                    className="w-full py-2.5 bg-slate-100 hover:bg-[#1558C9] hover:text-white text-[#0F172A] text-xs font-black rounded-xl transition-all"
                  >
                    해당 분야 접수하기
                  </button>
                </div>
              ))}
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
      {/* 🌟 2. 작품 접수 및 참가신청 폼                                        */}
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
              참가자 정보와 출품작 파일 또는 링크를 등록해 주세요. 이메일(<code>hamesta@naver.com</code>) 접수도 가능합니다.
            </p>
          </div>

          <form 
            onSubmit={e => { 
              e.preventDefault(); 
              alert("🎉 공모전 참가가 정상 접수되었습니다! 심사위원단 검토 후 기재하신 연락처로 안내드립니다."); 
              setActiveTab("info"); 
            }} 
            className="space-y-6 text-xs font-bold text-[#0F172A]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 공모 분야:</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                  <option value="edu">➊ 안전 교육자료 (HWPX/PPTX 20p 이내)</option>
                  <option value="shortform">➋ 동영상(숏폼) (30초~1분 이내)</option>
                  <option value="webtoon">➌ 웹툰 (5페이지 이상)</option>
                  <option value="cardnews">➍ 한눈정보(카드뉴스) (5페이지 이상)</option>
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
              <label className="block mb-1 text-slate-700">• 활용한 주요 AI 도구 및 활용 범위 (필수 기재):</label>
              <input type="text" placeholder="예: ChatGPT(기획 및 문안 검토), Midjourney/ImageFX(캐릭터 생성)" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">• 작품명 및 핵심 안전 메시지 요약 (300자 이내):</label>
              <textarea rows={3} placeholder="작품의 기획 의도와 표현하고자 한 안전 수칙을 간결하게 작성하세요." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
            </div>

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
      {/* 🌟 3. AI 도구 활용 가이드                                            */}
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
