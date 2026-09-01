"use client";

import { useState } from "react";
import { 
  Trophy, Music, Play, Download, Eye, ExternalLink, Heart, 
  Vote, Send, Sparkles, ShieldCheck, Film, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChallengePage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"gallery" | "submit" | "guide">("gallery");

  // 숏폼 챌린지 갤러리 데이터
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

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-10 selection:bg-[#1558C9] selection:text-white">
      
      {/* 🌟 숏폼 챌린지 전용 헤더 배너 (포스터 클릭 시 전체화면) */}
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
                <span>공식 포스터 전체화면</span>
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
                onClick={() => setActiveSubTab("submit")}
                className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs rounded-xl transition-all shadow-sm"
              >
                [참가 접수]
              </button>
            </div>
          </div>
        </div>

        {/* 우측 포스터 카드 미리보기 (클릭 시 전체화면) */}
        <div 
          className="hidden lg:block absolute right-8 top-8 bottom-8 w-64 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 group cursor-pointer" 
          onClick={() => setShowPosterModal(true)}
          title="클릭하여 포스터 전체화면으로 보기"
        >
          <Image 
            src="/images/playsafe_poster_2026.png" 
            alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="px-3 py-1.5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
              <Eye size={13} /> 포스터 전체화면
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

      {/* 숏폼 서브 탭 네비게이션 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab("gallery")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "gallery"
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🗳️ 숏폼 출품작 실시간 투표 갤러리
        </button>

        <button
          onClick={() => setActiveSubTab("submit")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "submit"
              ? "bg-[#0F172A] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📝 숏폼 챌린지 영상 URL 접수하기
        </button>

        <button
          onClick={() => setActiveSubTab("guide")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "guide"
              ? "bg-[#1558C9] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📋 공모 부문 & 참여 방법 상세 안내
        </button>
      </div>

      {/* 1. 실시간 숏폼 갤러리 */}
      {activeSubTab === "gallery" && (
        <section className="space-y-6 animate-in fade-in duration-200">
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
      )}

      {/* 2. 숏폼 접수 폼 */}
      {activeSubTab === "submit" && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm animate-in fade-in duration-200">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              SHORTFORM CHALLENGE SUBMISSION
            </span>
            <h2 className="text-2xl font-black text-[#0F172A]">
              PLAY SAFE 숏폼 챌린지 영상 URL 접수
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              인스타그램 릴스 또는 유튜브 쇼츠에 영상을 업로드한 후, 해당 URL을 등록해 주세요.
            </p>
          </div>

          <form 
            onSubmit={e => {
              e.preventDefault();
              alert("🎉 숏폼 챌린지 참가가 성공적으로 접수되었습니다!");
              setActiveSubTab("gallery");
            }}
            className="space-y-5 text-xs font-bold text-[#0F172A]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 공모 부문:</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required>
                  <option value="dance_official">💃 댄스 부문 - 공식 안무 따라하기</option>
                  <option value="dance_creative">💃 댄스 부문 - 가사 창작 안무 퍼포먼스</option>
                  <option value="creative_vlog">🎬 크리에이티브 부문 - 안전 브이로그</option>
                  <option value="creative_sketch">🎬 크리에이티브 부문 - 상황극 / 패러디</option>
                  <option value="creative_info">🎬 크리에이티브 부문 - 안전 정보형 / 애니메이션</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">• 참가자 성명 / 팀명:</label>
                <input type="text" placeholder="예: 김안전 (또는 안전크루팀)" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 연락처 (휴대전화):</label>
                <input type="tel" placeholder="010-1234-5678" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">• 이메일:</label>
                <input type="email" placeholder="safety@example.com" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-700">• SNS 영상 URL (인스타그램 릴스 또는 유튜브 쇼츠 링크):</label>
              <input type="url" placeholder="https://www.instagram.com/reel/... 또는 https://youtube.com/shorts/..." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
            </div>

            <div>
              <label className="block mb-1 text-slate-700">• 챌린지 작품명 및 안전 실천 메시지 요약 (300자 이내):</label>
              <textarea rows={3} placeholder="작품의 기획 의도와 표현하고자 한 안전 수칙을 간결하게 작성하세요." className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" required />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 touch-target"
            >
              <Send size={18} />
              <span>[ 🚀 숏폼 챌린지 참가 신청서 최종 제출하기 ]</span>
            </button>
          </form>
        </section>
      )}

      {/* 3. 공모 부문 & 가이드 */}
      {activeSubTab === "guide" && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-sm">
              <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                부문 01 · DANCE
              </span>
              <h3 className="text-xl font-black text-[#0F172A]">💃 댄스 부문</h3>
              <p className="text-xs text-[#334155] font-semibold leading-relaxed">
                공식 음원 ‘ㅋㅋㅋ(Keep, Know, KYWA)’에 맞춰 신나게 춤추는 숏폼 안무 챌린지
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <p>• <strong>공식 안무 분야:</strong> 공식 음원에 맞춰 공식 안무를 따라 추는 형태</p>
                <p>• <strong>퍼포먼스 분야:</strong> 공식 음원을 배경으로 가사 내용을 새롭게 표현하는 안무 창작 형태</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-3xl p-7 space-y-4 shadow-sm">
              <span className="text-xs font-black text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                부문 02 · CREATIVE
              </span>
              <h3 className="text-xl font-black text-[#0F172A]">🎬 크리에이티브 부문</h3>
              <p className="text-xs text-[#334155] font-semibold leading-relaxed">
                일상 속 안전 실천 메시지를 자유로운 형식으로 표현하는 숏폼 챌린지
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <p>• <strong>제작 형식:</strong> 브이로그, 상황극, 패러디, 안전 정보형 콘텐츠, 애니메이션 등</p>
                <p>• <strong>필수 요건:</strong> 최종 영상에 공식 ‘ㅋㅋㅋ’ 음원이 반드시 포함되어야 함</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🌟 포스터 전체화면 풀스크린 라이트박스 뷰어 */}
      {showPosterModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowPosterModal(false)}
        >
          <div 
            className="relative max-w-4xl w-full h-[92vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-10 border-b border-slate-800">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Trophy size={14} /> 2026 PLAY SAFE 숏폼 챌린지 공식 포스터 (전체화면)
              </span>
              <button 
                onClick={() => setShowPosterModal(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all"
                title="닫기"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 w-full bg-slate-950">
              <Image 
                src="/images/playsafe_poster_2026.png" 
                alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
                fill 
                className="object-contain p-2"
                priority
              />
            </div>

            <div className="p-4 bg-slate-900/80 backdrop-blur-md flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">문의: 02-2088-8456 | mkteam@testmotionofficial.com</span>
              <a 
                href="/images/playsafe_poster_2026.png" 
                download="2026_PLAY_SAFE_포스터.png"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
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
