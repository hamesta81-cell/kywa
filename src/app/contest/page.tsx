"use client";

import { useState, useEffect, Suspense } from "react";
import { Award, Trophy, Sparkles, Send, CheckCircle2, Upload, FileText, Vote, Calendar, Heart, ShieldCheck, AlertCircle, Eye, ChevronRight, HelpCircle, ArrowRight, User, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ContestContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"info" | "submit" | "vote">("info");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "submit") setActiveTab("submit");
    else if (tabParam === "vote") setActiveTab("vote");
  }, [searchParams]);

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1280px] mx-auto space-y-8">
      
      {/* 상단 탭 버튼 */}
      <div className="flex items-center justify-between bg-white p-3 rounded-[16px] border border-[#CBD5E1] shadow-md">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-5 py-2.5 rounded-[12px] text-xs font-black transition-all ${
              activeTab === "info"
                ? "bg-[#1558C9] text-white shadow-md"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            🏆 2026 대국민 안전 공모전 안내
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-5 py-2.5 rounded-[12px] text-xs font-black transition-all ${
              activeTab === "submit"
                ? "bg-[#0F172A] text-white shadow-md"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            📝 작품 온라인 접수하기
          </button>
          <button
            onClick={() => setActiveTab("vote")}
            className={`px-5 py-2.5 rounded-[12px] text-xs font-black transition-all ${
              activeTab === "vote"
                ? "bg-[#7557D9] text-white shadow-md"
                : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"
            }`}
          >
            🗳️ 대국민 실시간 투표 참여
          </button>
        </div>

        <span className="text-xs font-black text-[#1558C9] hidden sm:inline">
          KYWA SAFETY CONTEST 2026 🏆
        </span>
      </div>

      {/* ==================================================================== */}
      {/* 🌟 1. 대국민 안전 공모전 안내 (히어로 글씨 100% 진하고 선명하게 보완!) */}
      {/* ==================================================================== */}
      {activeTab === "info" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* 히어로 헤더 카드 (글씨 색상 100% 고대비 검정 text-[#0F172A] 적용!) */}
          <section className="krds-public-card p-8 sm:p-12 bg-white border border-[#CBD5E1] space-y-6 shadow-md relative overflow-hidden">
            <div className="space-y-4 max-w-3xl relative z-10">
              <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-300 uppercase">
                KYWA SAFETY CONTEST 2026
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-tight">
                청소년과 대국민이 함께 만드는<br />
                <span className="text-[#1558C9]">2026 KYWA 대국민 안전문화 확산 공모전</span>
              </h1>

              {/* 🌟 100% 뚜렷한 진한 검정 font-black 서브 설명문! */}
              <p className="text-sm sm:text-base font-black text-[#0F172A] leading-relaxed">
                청소년의 창의적인 시선으로 일상 속 안전을 재해석하고, 전국 청소년 및 국민이 직접 심사에 참여하는 대국민 안전문화 확산 장입니다.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("submit")}
                  className="krds-public-button px-6 py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[14px] shadow-md flex items-center gap-2"
                >
                  <Send size={16} />
                  <span>[ 📝 작품 접수 바로가기 ]</span>
                </button>
                <button
                  onClick={() => setActiveTab("vote")}
                  className="krds-public-button px-6 py-3.5 bg-[#0F172A] hover:bg-black text-white font-black text-xs rounded-[14px] shadow-md flex items-center gap-2"
                >
                  <Vote size={16} />
                  <span>[ 🗳️ 대국민 심사 투표 참여 ]</span>
                </button>
              </div>
            </div>

            {/* 일정 안내 바 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-[#CBD5E1]">
              <div className="p-4 bg-slate-50 rounded-[14px] border border-[#CBD5E1] space-y-1">
                <span className="text-[11px] font-black text-[#1558C9] block">📅 1. 작품 접수 기간</span>
                <p className="text-xs font-black text-[#0F172A]">2026.06.01 ~ 07.15</p>
                <span className="text-[10px] text-emerald-950 font-black bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block">온라인 접수 진행 중</span>
              </div>

              <div className="p-4 bg-purple-50 rounded-[14px] border border-purple-200 space-y-1">
                <span className="text-[11px] font-black text-purple-950 block">🗳️ 2. 대국민 심사 기간</span>
                <p className="text-xs font-black text-[#0F172A]">2026.07.16 ~ 07.31</p>
                <span className="text-[10px] text-purple-950 font-black bg-purple-100 px-2 py-0.5 rounded border border-purple-300 inline-block">대국민 무기명 투표</span>
              </div>

              <div className="p-4 bg-blue-50 rounded-[14px] border border-blue-200 space-y-1">
                <span className="text-[11px] font-black text-[#1558C9] block">🏅 3. 전문가 심사 기간</span>
                <p className="text-xs font-black text-[#0F172A]">2026.08.01 ~ 08.10</p>
                <span className="text-[10px] text-blue-950 font-black bg-blue-100 px-2 py-0.5 rounded border border-blue-300 inline-block">KYWA 전문 위원단</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-[14px] border border-amber-200 space-y-1">
                <span className="text-[11px] font-black text-amber-950 block">🏆 4. 최종 결과 발표</span>
                <p className="text-xs font-black text-[#0F172A]">2026.08.15</p>
                <span className="text-[10px] text-amber-950 font-black bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block">플랫폼 공지 및 시상</span>
              </div>
            </div>
          </section>

          {/* 공모 분야 3종 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2">
              📌 공모 분야 (3대 공모 섹션)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-4 shadow-sm hover:border-[#1558C9] transition-all">
                <span className="text-2xl p-3 bg-blue-100 rounded-[14px] inline-block">💬</span>
                <h3 className="text-lg font-black text-[#0F172A]">1. 청소년 안전 슬로건</h3>
                <p className="text-xs font-black text-[#0F172A] leading-relaxed">
                  일상 속 청소년 안전실천을 유도하는 20자 이내의 창의적이고 감각적인 한 줄 슬로건.
                </p>
                <div className="p-3 bg-slate-50 rounded-[12px] text-[11px] font-black text-slate-700">
                  🎁 시상: 대상 100만원 (1명) / 최우수상 50만원 (2명)
                </div>
              </div>

              <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-4 shadow-sm hover:border-[#1558C9] transition-all">
                <span className="text-2xl p-3 bg-purple-100 rounded-[14px] inline-block">🎬</span>
                <h3 className="text-lg font-black text-[#0F172A]">2. 안전 숏폼 영상 (60초)</h3>
                <p className="text-xs font-black text-[#0F172A] leading-relaxed">
                  사이버폭력 예방, 학교 통학로 안전, 약물 오남용 예방을 주제로 한 60초 이내 세로형 숏폼.
                </p>
                <div className="p-3 bg-slate-50 rounded-[12px] text-[11px] font-black text-slate-700">
                  🎁 시상: 대상 200만원 (1팀) / 최우수상 100만원 (2팀)
                </div>
              </div>

              <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-4 shadow-sm hover:border-[#1558C9] transition-all">
                <span className="text-2xl p-3 bg-emerald-100 rounded-[14px] inline-block">💡</span>
                <h3 className="text-lg font-black text-[#0F172A]">3. 청소년 안전 정책 아이디어</h3>
                <p className="text-xs font-black text-[#0F172A] leading-relaxed">
                  학교 밖 사각지대 위험요소 해소를 위한 청소년 주도형 실질적 안전 정책 제언.
                </p>
                <div className="p-3 bg-slate-50 rounded-[12px] text-[11px] font-black text-slate-700">
                  🎁 시상: 대상 150만원 (1팀) / 최우수상 70만원 (2팀)
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* 2. 작품 온라인 접수하기 */}
      {activeTab === "submit" && (
        <div className="krds-public-card p-6 sm:p-10 bg-white border border-[#CBD5E1] rounded-[24px] space-y-6 shadow-md animate-in fade-in duration-300">
          <div className="space-y-2 border-b border-[#CBD5E1] pb-4">
            <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
              ONLINE SUBMISSION FORM
            </span>
            <h2 className="text-2xl font-black text-[#0F172A]">📝 2026 대국민 안전 공모전 작품 접수</h2>
            <p className="text-xs font-black text-slate-600">양식을 작성하고 출품작 파일 또는 영상 링크를 등록해 주세요.</p>
          </div>

          <form onSubmit={e => { e.preventDefault(); alert("🎉 작품이 정상적으로 출품 접수되었습니다!"); setActiveTab("vote"); }} className="space-y-4 text-xs font-black text-[#0F172A]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">• 출품자 이름 / 팀명:</label>
                <input type="text" placeholder="예: 김안전 (또는 안전가디언팀)" className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A]" required />
              </div>
              <div>
                <label className="block mb-1">• 연락처 (휴대전화):</label>
                <input type="tel" placeholder="010-1234-5678" className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A]" required />
              </div>
            </div>

            <div>
              <label className="block mb-1">• 공모 분야 선택:</label>
              <select className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A]">
                <option>💬 [부문 1] 청소년 안전 슬로건</option>
                <option>🎬 [부문 2] 안전 숏폼 영상 (60초)</option>
                <option>💡 [부문 3] 청소년 안전 정책 아이디어</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">• 작품 제목:</label>
              <input type="text" placeholder="작품의 대표 제목을 입력하세요." className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A]" required />
            </div>

            <div>
              <label className="block mb-1">• 작품 설명 및 요약 (500자 이내):</label>
              <textarea rows={4} placeholder="작품의 기획 의도와 전달하고자 하는 안전 메시지를 서술하세요." className="w-full p-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A]" required />
            </div>

            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-[14px] text-center space-y-2">
              <Upload size={24} className="mx-auto text-[#1558C9]" />
              <span className="text-xs font-black text-[#1558C9] block">[클릭하여 출품 파일 첨부 (MP4, HWP, PDF, PNG)]</span>
              <span className="text-[10px] text-slate-500 font-bold">최대 100MB 이하 파일 첨부 가능</span>
            </div>

            <button type="submit" className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2">
              <Send size={18} />
              <span>[ 🚀 작품 최종 출품 제출하기 ]</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. 대국민 실시간 투표 참여 */}
      {activeTab === "vote" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] flex justify-between items-center shadow-md">
            <div>
              <span className="text-xs font-black text-purple-950 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                NATIONAL PUBLIC VOTING 2026
              </span>
              <h2 className="text-xl font-black text-[#0F172A] mt-1">🗳️ 대국민 1인 1표 실시간 심사 투표</h2>
            </div>
            <span className="text-xs font-black text-[#0F172A] bg-slate-100 px-3 py-1 rounded-full">
              투표 진행 중 (2026.07.16 ~ 07.31)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { id: 1, title: "우리가 만드는 멈칫! 안심 통학로 숏폼", author: "안전가디언팀", votes: 1240, tags: ["숏폼", "교통안전"] },
              { id: 2, title: "사이버폭력 멈춰! 디지털 인격권 보장 슬로건", author: "이민지", votes: 980, tags: ["슬로건", "사이버안전"] }
            ].map(item => (
              <div key={item.id} className="krds-public-card p-6 bg-white border border-[#CBD5E1] rounded-[20px] space-y-4 shadow-sm hover:border-[#7557D9] transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-[#7557D9] bg-purple-100 px-2.5 py-1 rounded-md">
                    CANDIDATE #{item.id}
                  </span>
                  <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                    ❤️ {item.votes.toLocaleString()}표
                  </span>
                </div>

                <h3 className="text-base font-black text-[#0F172A]">{item.title}</h3>
                <p className="text-xs font-black text-slate-500">출품자: {item.author}</p>

                <button
                  onClick={() => alert(`🎉 '${item.title}' 작품에 1표를 투표하셨습니다!`)}
                  className="krds-public-button w-full py-3 bg-[#7557D9] hover:bg-purple-800 text-white text-xs font-black rounded-[12px] shadow-md flex items-center justify-center gap-1.5"
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
