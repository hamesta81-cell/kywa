"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Trophy, Music, Play, Pause, Download, Eye, 
  Send, Sparkles, ShieldCheck, Film, X, CheckCircle2,
  AlertCircle, Calendar, Award, FileText, Check, Users,
  Smartphone, Flame, CloudRain, Smile, Activity, HelpCircle,
  Clock, Timer, TrendingUp, Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChallengePage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"submit" | "guide">("submit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 실시간 접수 건수 및 마감 카운트다운 상태
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const targetGoal = 100; // 1차 공모전 목표 접수 건수
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  // 신청서 상태
  const [participantType, setParticipantType] = useState<"individual" | "team">("individual");
  const [isUnder14, setIsUnder14] = useState(false);
  const [formData, setFormData] = useState({
    participantType: "individual",
    author: "",
    teamMembers: "",
    birthDate: "",
    guardianName: "",
    guardianPhone: "",
    phone: "",
    email: "",
    category: "dance_official",
    creativeTopic: "pm_bicycle",
    videoUrl: "",
    hashtagConfirmed: true,
    keepPublicConfirmed: true,
    description: "",
    agreePrivacy: true,
    agreeCopyright: true
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 실시간 접수 건수 가져오기
  const fetchSubmissionCount = async () => {
    try {
      const res = await fetch(`/api/challenge/submit?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && typeof data.count === "number") {
        setSubmissionCount(data.count);
      }
    } catch (e) {
      console.error("Failed to fetch challenge submission count:", e);
    }
  };

  useEffect(() => {
    fetchSubmissionCount();
    const countInterval = setInterval(fetchSubmissionCount, 15000); // 15초마다 실시간 갱신

    // 마감일시: 2026.10.05 18:00:00 (KST)
    const targetDeadline = new Date("2026-10-05T18:00:00+09:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDeadline - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000); // 1초마다 실시간 카운트다운

    return () => {
      clearInterval(countInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreePrivacy || !formData.agreeCopyright) {
      alert("개인정보 수집·이용 동의 및 저작권 활용 동의는 필수입니다.");
      return;
    }

    if (isUnder14 && (!formData.guardianName || !formData.guardianPhone)) {
      alert("만 14세 미만 참가자는 법정대리인(보호자) 정보 입력을 완료해 주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          participantType
        })
      });
      const result = await res.json();
      if (result.success) {
        alert(`🎉 숏폼 챌린지 참가가 성공적으로 접수되었습니다!\n\n📋 접수 번호: ${result.data.id}\n👤 참가자(대표): ${result.data.author}\n\n입력하신 이메일(${formData.email})로 접수 확인증이 자동 발송되었습니다.`);
        fetchSubmissionCount(); // 접수 건수 실시간 즉시 갱신
        setFormData({
          participantType: "individual",
          author: "",
          teamMembers: "",
          birthDate: "",
          guardianName: "",
          guardianPhone: "",
          phone: "",
          email: "",
          category: "dance_official",
          creativeTopic: "pm_bicycle",
          videoUrl: "",
          hashtagConfirmed: true,
          keepPublicConfirmed: true,
          description: "",
          agreePrivacy: true,
          agreeCopyright: true
        });
        setActiveSubTab("guide");
      } else {
        alert(`❌ 접수 실패: ${result.message || "오류가 발생했습니다."}`);
      }
    } catch (err) {
      alert("❌ 접수 중 서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-10 selection:bg-[#1558C9] selection:text-white">
      
      {/* 백그라운드 오디오 엘리먼트 */}
      <audio 
        ref={audioRef} 
        src="/audio/playsafe_official_sound.mp3" 
        onEnded={() => setIsPlayingAudio(false)}
        preload="metadata"
      />

      {/* 🌟 숏폼 챌린지 전용 헤더 배너 (공고 제2026-13-35호 반영) */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 sm:p-12 border border-amber-200/90 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
        {/* 상단 텍스트 및 포스터 미리보기 영역 */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black tracking-wide">
                공고 제2026-13-35호
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase">
                <Music size={13} className="text-amber-700" />
                <span>공식 음원: ㅋㅋㅋ (Keep, Know, KYWA) 챌린지</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.2]">
              2026년 청소년활동 안전캠페인<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                「PLAY SAFE 숏폼 챌린지 공모전」
              </span>
            </h1>

            <p className="text-sm sm:text-base font-semibold text-[#334155] leading-relaxed">
              한국청소년활동진흥원은 청소년과 국민이 일상 속 안전문화 확산에 참여할 수 있도록 
              공식 음원 <strong>‘ㅋㅋㅋ(Keep, Know, KYWA)’</strong>을 활용한 숏폼 챌린지 공모전을 운영합니다.
              신나게 춤추고, 나만의 안전 수칙을 담은 숏폼 영상을 업로드하여 총 상금 200만원의 주인공에 도전하세요!
            </p>

            {/* 공식 음원 플레이어 & 다운로드 스트립 */}
            <div className="p-4 bg-white border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleAudio}
                  aria-label={isPlayingAudio ? "음원 일시정지" : "음원 미리듣기 재생"}
                  className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer"
                  title={isPlayingAudio ? "음원 일시정지" : "음원 미리듣기 재생"}
                >
                  {isPlayingAudio ? (
                    <Pause size={18} className="fill-current" />
                  ) : (
                    <Play size={18} className="fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <span className="text-xs font-black text-[#0F172A] block">
                    (붙임3) PLAY SAFE 숏폼 챌린지 공식 음원.mp3 {isPlayingAudio && <span className="text-amber-600 font-bold ml-1 animate-pulse">🎵 재생 중</span>}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    길이: 45초 · 댄스 및 크리에이티브 전 부문 필수 사용
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
                  href="/audio/playsafe_official_sound.mp3"
                  download="(붙임3) PLAY SAFE 숏폼 챌린지 공식 음원.mp3"
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs rounded-xl border border-amber-300 transition-all flex items-center gap-1.5"
                  title="(붙임3) PLAY SAFE 숏폼 챌린지 공식 음원.mp3 파일 다운로드"
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

          {/* 우측 포스터 카드 미리보기 (아담한 썸네일로 축소 배치 & 클릭 시 전체화면) */}
          <div 
            className="shrink-0 flex flex-col items-center group cursor-pointer self-center lg:self-start pt-1"
            onClick={() => setShowPosterModal(true)}
            title="클릭하여 포스터 전체화면으로 보기"
          >
            <div className="relative w-28 sm:w-32 md:w-36 aspect-[1/1.414] rounded-xl overflow-hidden shadow-sm border border-amber-300 bg-white">
              <Image 
                src="/images/playsafe_poster_2026.png" 
                alt="2026 PLAY SAFE 숏폼 챌린지 포스터" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 text-[10px] font-black flex items-center gap-1 shadow">
                  <Eye size={11} /> 확대
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-900/80 mt-1 flex items-center gap-1">
              🔍 포스터 확대보기
            </span>
          </div>
        </div>

        {/* ⏱️ 실시간 접수 마감 카운트다운 & 실시간 접수 건수 라이브 위젯 */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white rounded-2xl border border-amber-500/40 shadow-xl relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-black tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  LIVE 실시간 카운트다운
                </span>
                <span className="text-xs text-slate-400 font-bold">2026. 10. 05(월) 18:00 최종 마감</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Clock className="text-amber-400" size={18} />
                <span>공모전 최종 마감까지 남은 시간</span>
              </h3>
            </div>

            {/* 디지털 플립 시계 스타일 카운트다운 */}
            <div className="flex items-center gap-2 font-mono tabular-nums">
              <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-400 font-sans block font-bold">일(DAYS)</span>
              </div>
              <span className="text-xl font-black text-slate-600">:</span>
              <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-black text-white block">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[10px] text-slate-400 font-sans block font-bold">시간</span>
              </div>
              <span className="text-xl font-black text-slate-600">:</span>
              <div className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-center min-w-[58px]">
                <span className="text-xl sm:text-2xl font-black text-white block">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[10px] text-slate-400 font-sans block font-bold">분</span>
              </div>
              <span className="text-xl font-black text-slate-600">:</span>
              <div className="px-3 py-2 bg-slate-900 border border-rose-500/50 rounded-xl text-center min-w-[58px] animate-pulse">
                <span className="text-xl sm:text-2xl font-black text-rose-400 block">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[10px] text-rose-400 font-sans block font-bold">초</span>
              </div>
            </div>
          </div>

          {/* 실시간 접수 건수 & 목표 대비 잔여 건수 카운트다운 게이지 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">현재 실시간 접수 건수</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">{submissionCount}건</span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold block">1차 공모 목표(100건) 잔여 카운트</span>
                <span className="text-2xl font-black text-amber-400 tabular-nums">
                  {Math.max(0, targetGoal - submissionCount)}건 남음!
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Timer size={18} />
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold">실시간 접수 달성률</span>
                <span className="text-xs font-black text-cyan-400">{Math.min(100, Math.round((submissionCount / targetGoal) * 100))}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, Math.round((submissionCount / targetGoal) * 100)))}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-medium text-right">
                ※ 15초 주기 자동 실시간 집계
              </span>
            </div>
          </div>
        </div>

        {/* 일정 및 시상 규모 타임라인 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-200/60 relative z-10">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-black text-amber-800 block">📅 접수 기간</span>
            <p className="text-sm font-black text-[#0F172A]">2026.09.01(화) ~ 10.05(월)</p>
            <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded inline-block">10.05(월) 18:00 마감</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-black text-blue-800 block">📱 사용 매체 및 규격</span>
            <p className="text-sm font-black text-[#0F172A]">15~60초 세로형 영상</p>
            <span className="text-[10px] text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded inline-block">인스타그램 릴스 · 유튜브 쇼츠</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-black text-emerald-800 block">🏆 시상 규모 (총 31팀 내외)</span>
            <p className="text-sm font-black text-[#0F172A]">총 상금 200만원</p>
            <span className="text-[10px] text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded inline-block">여성가족부장관상 1점 · 이사장상 2점</span>
          </div>
        </div>
      </section>

      {/* 숏폼 서브 탭 네비게이션 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab("submit")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "submit"
              ? "bg-[#0F172A] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📝 숏폼 챌린지 온라인 참가 접수
        </button>

        <button
          onClick={() => setActiveSubTab("guide")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeSubTab === "guide"
              ? "bg-[#1558C9] text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📋 공모요강 & 운영 안내 상세 (붙임1 전문)
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. 숏폼 접수 폼 (붙임1 서식 요구사항 완벽 반영)                      */}
      {/* ==================================================================== */}
      {activeSubTab === "submit" && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in duration-200">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              SHORTFORM CHALLENGE SUBMISSION FORM
            </span>
            <h2 className="text-2xl font-black text-[#0F172A]">
              PLAY SAFE 숏폼 챌린지 온라인 참가 신청서
            </h2>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              본인 인스타그램 릴스 또는 유튜브 쇼츠에 공식 음원 ‘ㅋㅋㅋ(Keep, Know, KYWA)’을 활용해 영상을 업로드한 후, 
              아래 신청서를 작성하여 최종 접수해 주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-[#0F172A]">
            
            {/* 참가 형태 선택 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <label className="block text-slate-800 font-black">• 참가 대상 구분 *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="participantType" 
                    checked={participantType === "individual"}
                    onChange={() => {
                      setParticipantType("individual");
                      setFormData({ ...formData, participantType: "individual" });
                    }}
                    className="text-[#1558C9] focus:ring-blue-500"
                  />
                  <span>개인 (청소년 또는 일반 국민)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="participantType" 
                    checked={participantType === "team"}
                    onChange={() => {
                      setParticipantType("team");
                      setFormData({ ...formData, participantType: "team" });
                    }}
                    className="text-[#1558C9] focus:ring-blue-500"
                  />
                  <span>단체 (팀 단위)</span>
                </label>
              </div>
              {participantType === "team" && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold space-y-2">
                  <p>※ 단체(팀)로 참여할 경우 <strong>1명 이상의 청소년을 반드시 포함</strong>하여야 하며, 대표자 1명이 신청합니다.</p>
                  <div>
                    <label className="block mb-1 text-slate-700">• 팀원 성명 명단 (대표자 제외):</label>
                    <input 
                      type="text" 
                      placeholder="예: 이안전(청소년), 박청소년(청소년), 최보호(보호자)" 
                      value={formData.teamMembers}
                      onChange={e => setFormData({ ...formData, teamMembers: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• {participantType === "team" ? "팀명 및 대표자 성명" : "참가자 성명"} *</label>
                <input 
                  type="text" 
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder={participantType === "team" ? "예: 세이프키즈 (대표자: 홍길동)" : "예: 홍길동"} 
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                  required 
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">• 참가자(대표자) 생년월일 (8자리) *</label>
                <input 
                  type="text" 
                  value={formData.birthDate}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData({ ...formData, birthDate: val });
                    // 2012년 이후 출생자(만 14세 미만 체크)
                    if (val.length === 8) {
                      const year = parseInt(val.substring(0, 4), 10);
                      if (year > 2012) setIsUnder14(true);
                      else setIsUnder14(false);
                    }
                  }}
                  placeholder="예: 20080515" 
                  maxLength={8}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                  required 
                />
              </div>
            </div>

            {/* 만 14세 미만 법정대리인 정보 필드 */}
            {isUnder14 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                <span className="text-[11px] font-black text-blue-900 block">
                  🛡️ 만 14세 미만 참가자 법정대리인(보호자) 동의 정보 (필수)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-700">• 법정대리인(보호자) 성명:</label>
                    <input 
                      type="text" 
                      placeholder="예: 홍보호 (부/모)" 
                      value={formData.guardianName}
                      onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-700">• 법정대리인 연락처:</label>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000" 
                      value={formData.guardianPhone}
                      onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 연락처(휴대전화) *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678" 
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                  required 
                />
              </div>
              <div>
                <label className="block mb-1 text-slate-700">• 이메일 주소 (접수증 발송용) *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="safety@example.com" 
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                  required 
                />
              </div>
            </div>

            {/* 공모 부문 선택 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-700">• 공모 부문 선택 *</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                  required
                >
                  <option value="dance_official">💃 댄스 부문 - ① 공식안무 분야 (공식 안무 커버)</option>
                  <option value="dance_creative">💃 댄스 부문 - ② 퍼포먼스 분야 (가사 창작 안무)</option>
                  <option value="creative_vlog">🎬 크리에이티브 부문 - 브이로그</option>
                  <option value="creative_sketch">🎬 크리에이티브 부문 - 상황극 / 패러디</option>
                  <option value="creative_info">🎬 크리에이티브 부문 - 안전 정보형 콘텐츠</option>
                  <option value="creative_animation">🎬 크리에이티브 부문 - 애니메이션</option>
                </select>
              </div>

              {formData.category.startsWith("creative") && (
                <div>
                  <label className="block mb-1 text-slate-700">• 크리에이티브 6대 촬영 주제 선택 *</label>
                  <select 
                    value={formData.creativeTopic}
                    onChange={e => setFormData({ ...formData, creativeTopic: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                    required
                  >
                    <option value="pm_bicycle">1. 개인형 이동장치(PM) · 자전거 안전수칙</option>
                    <option value="outdoor">2. 야외활동 안전수칙 (행사, 축제, 캠핑, 물놀이 등)</option>
                    <option value="fire">3. 화재대피 요령 (대피로 확인, 소화기·완강기 사용법)</option>
                    <option value="ai_digital">4. 인공지능(AI) 활용 안전수칙 (디지털 윤리, 개인정보)</option>
                    <option value="emotion">5. 심리·정서 안전콘텐츠 (따돌림·혐오표현 개선 등)</option>
                    <option value="facility">6. 청소년수련시설 안전 (시설 안전확인, 안전점검)</option>
                  </select>
                </div>
              )}
            </div>

            {/* SNS 영상 URL */}
            <div>
              <label className="block mb-1 text-slate-700">• 업로드 SNS 영상 URL (인스타그램 릴스 또는 유튜브 쇼츠 링크) *</label>
              <input 
                type="url" 
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.instagram.com/reel/... 또는 https://youtube.com/shorts/..." 
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                required 
              />
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                ※ 영상 길이는 15~60초 세로형 규격이어야 하며, 2026. 12. 31.까지 전체 공개 상태를 유지해야 합니다.
              </span>
            </div>

            {/* 필수 해시태그 & 공개 동의 체크 */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                <input 
                  type="checkbox" 
                  checked={formData.hashtagConfirmed}
                  onChange={e => setFormData({ ...formData, hashtagConfirmed: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                  required
                />
                <span>[필수] 영상 설명란에 필수 해시태그 3개(<strong>#KYWA #한국청소년활동진흥원 #PLAYSAFE</strong>)를 모두 기재했습니다.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                <input 
                  type="checkbox" 
                  checked={formData.keepPublicConfirmed}
                  onChange={e => setFormData({ ...formData, keepPublicConfirmed: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                  required
                />
                <span>[필수] 심사 및 결과 발표를 위해 <strong>2026년 12월 31일까지</strong> SNS 계정 및 게시글을 전체 공개 상태로 유지함에 동의합니다.</span>
              </label>
            </div>

            {/* 기획 의도 및 안전 실천 메시지 */}
            <div>
              <label className="block mb-1 text-slate-700">• 챌린지 작품명 및 안전 실천 메시지 요약 (기획 의도) *</label>
              <textarea 
                rows={3} 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="작품의 기획 의도와 영상 속에 표현하고자 한 안전 수칙 및 실천 메시지를 300자 이내로 작성하세요." 
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A]" 
                required 
              />
            </div>

            {/* 동의 사항 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-[11px] text-slate-700">
              <label className="flex items-start gap-2 cursor-pointer font-bold">
                <input 
                  type="checkbox" 
                  checked={formData.agreePrivacy}
                  onChange={e => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                  className="mt-0.5 rounded text-[#1558C9]"
                  required
                />
                <span>[필수] 개인정보 수집·이용 동의: 공모전 심사, 결과 발표, 부상 지급 및 확인증 발송을 위한 개인정보 수집에 동의합니다.</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer font-bold">
                <input 
                  type="checkbox" 
                  checked={formData.agreeCopyright}
                  onChange={e => setFormData({ ...formData, agreeCopyright: e.target.checked })}
                  className="mt-0.5 rounded text-[#1558C9]"
                  required
                />
                <span>[필수] 저작권 및 유의사항 확인: 수상작의 저작권은 응모자에게 귀속되나 주최기관(한국청소년활동진흥원)의 비영리 목적(교육·홍보) 무상 활용권 부여 및 공모전 10대 유의사항에 모두 동의합니다.</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 touch-target cursor-pointer transition-all"
            >
              <Send size={18} />
              <span>{isSubmitting ? "접수 데이터를 저장하고 있습니다..." : "[ 🚀 숏폼 챌린지 참가 신청서 최종 제출하기 ]"}</span>
            </button>
          </form>
        </section>
      )}

      {/* ==================================================================== */}
      {/* 2. 공모요강 & 운영 안내 상세 ((붙임1) 문서 100% 반영)               */}
      {/* ==================================================================== */}
      {activeSubTab === "guide" && (
        <section className="space-y-8 animate-in fade-in duration-200">
          
          {/* 1. 공모 개요 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="text-amber-600" size={20} />
              <h3 className="text-lg font-black text-[#0F172A]">01. 공모 개요 (공고 제2026-13-35호)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-200">
                <span className="text-slate-500 font-bold block">공모전 명칭</span>
                <p className="font-black text-sm text-[#0F172A]">2026년 청소년활동 안전캠페인 「PLAY SAFE 숏폼 챌린지 공모전」</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-200">
                <span className="text-slate-500 font-bold block">운영 기간</span>
                <p className="font-black text-sm text-[#0F172A]">2026년 9월 ~ 2026년 11월 (접수: 2026.09.01 ~ 10.05)</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-200 md:col-span-2">
                <span className="text-slate-500 font-bold block">참가 대상</span>
                <p className="font-black text-sm text-[#0F172A]">청소년·가족(청소년 포함) 등 모든 국민 (개인 또는 단체팀)</p>
                <div className="space-y-1 text-slate-600 pt-1 text-[11px] font-medium leading-relaxed">
                  <p>• <strong>단체(팀) 참가 시:</strong> 1명 이상의 청소년을 반드시 포함하여야 하며, 대표자 1명이 신청합니다.</p>
                  <p>• <strong>복수 출품 가능:</strong> 2가지 부문(댄스, 크리에이티브) 동시 참여 및 복수 출품이 가능합니다.</p>
                  <p>• <strong>만 14세 미만:</strong> 만 14세 미만 참가자의 경우 법정대리인(보호자) 동의가 필수입니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 공모 부문 및 크리에이티브 6대 촬영 주제 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="text-amber-600" size={20} />
              <h3 className="text-lg font-black text-[#0F172A]">02. 공모 부문 및 6대 촬영 주제</h3>
            </div>

            {/* 댄스 부문 카드 */}
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-3 py-1 bg-amber-500 text-slate-950 rounded-full">부문 01 · 💃 댄스 부문</span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">공식 음원 'ㅋㅋㅋ' 필수</span>
              </div>
              <p className="text-xs text-[#334155] font-bold leading-relaxed">
                공식 음원 ‘ㅋㅋㅋ(Keep, Know, KYWA)’에 맞춰 신나게 춤추는 숏폼 안무 챌린지
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <strong className="text-amber-900 block">① 공식안무 분야</strong>
                  <p className="text-slate-600 text-[11px]">공식 음원에 맞춰 공식 안무를 따라 추는 형태 (복장, 촬영 장소 등을 활용하여 안전 수칙 표현 가능)</p>
                </div>
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <strong className="text-amber-900 block">② 퍼포먼스 분야</strong>
                  <p className="text-slate-600 text-[11px]">공식 음원을 배경음악으로 가사 내용을 새롭게 표현하는 창작 안무 퍼포먼스 형태</p>
                </div>
              </div>
            </div>

            {/* 크리에이티브 부문 카드 & 6대 주제 그리드 */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-sky-50/50 border border-blue-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-3 py-1 bg-[#1558C9] text-white rounded-full">부문 02 · 🎬 크리에이티브 부문</span>
                <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">자유 형식 (브이로그, 상황극, 패러디 등)</span>
              </div>
              <p className="text-xs text-[#334155] font-bold leading-relaxed">
                일상 속 안전 실천 메시지를 자유롭게 표현하는 숏폼 챌린지 (단, 최종 영상에 공식 ‘ㅋㅋㅋ’ 음원 필수 삽입)
              </p>

              <div>
                <span className="text-xs font-black text-blue-950 block mb-2.5">📌 크리에이티브 부문 6대 권장 촬영 주제:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">주제 01</span>
                    <strong className="block text-slate-900">개인형 이동장치·자전거</strong>
                    <p className="text-slate-500 text-[11px]">올바른 PM 이용수칙, 헬멧 미착용 상황극 등 안전사고 예방</p>
                  </div>

                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">주제 02</span>
                    <strong className="block text-slate-900">야외 활동 안전수칙</strong>
                    <p className="text-slate-500 text-[11px]">행사, 축제, 등산, 캠핑, 물놀이 등 야외 안전사고 예방 수칙</p>
                  </div>

                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded">주제 03</span>
                    <strong className="block text-slate-900">화재대피 요령</strong>
                    <p className="text-slate-500 text-[11px]">대피 경로 확인, 소화기·완강기 사용법, 화재 대처 상황극</p>
                  </div>

                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded">주제 04</span>
                    <strong className="block text-slate-900">인공지능(AI) 활용 안전</strong>
                    <p className="text-slate-500 text-[11px]">AI 활용 시 디지털 윤리, 딥페이크 및 개인정보 보호 안전수칙</p>
                  </div>

                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded">주제 05</span>
                    <strong className="block text-slate-900">심리·정서 안전콘텐츠</strong>
                    <p className="text-slate-500 text-[11px]">청소년 심리정서 대처요령, 따돌림·혐오표현 개선 애니메이션</p>
                  </div>

                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">주제 06</span>
                    <strong className="block text-slate-900">청소년수련시설 안전</strong>
                    <p className="text-slate-500 text-[11px]">수련시설 안전 확인 한눈정보, 활동 전 안전점검 및 관리법</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 2단계 참여 방법 가이드 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="text-amber-600" size={20} />
              <h3 className="text-lg font-black text-[#0F172A]">03. 참여 방법 (2단계 프로세스)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-[11px] inline-block">
                  1단계: 영상 촬영 및 SNS 업로드
                </span>
                <p className="font-bold text-slate-800 text-sm">공식 음원 활용 및 필수 해시태그 기재</p>
                <ul className="text-slate-600 space-y-1 text-[11px] leading-relaxed">
                  <li>• 촬영 시 음원을 틀어놓거나 편집 과정에서 공식 음원을 입혀 제작 (15~60초 세로형)</li>
                  <li>• 본인 <strong>인스타그램 릴스</strong> 또는 <strong>유튜브 쇼츠</strong>에 영상 업로드</li>
                  <li>• 영상 설명란에 필수 해시태그 3개 필수 기재:<br/>
                    <span className="text-blue-700 font-bold">#KYWA #한국청소년활동진흥원 #PLAYSAFE</span>
                  </li>
                  <li>• <strong>2026. 12. 31.까지</strong> 계정 및 게시글 전체 공개 상태 유지 필수</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="px-2.5 py-1 bg-[#0F172A] text-white font-black rounded-lg text-[11px] inline-block">
                  2단계: 온라인 참가 신청서 최종 제출
                </span>
                <p className="font-bold text-slate-800 text-sm">신청서 페이지에서 URL 및 정보 등록</p>
                <ul className="text-slate-600 space-y-1 text-[11px] leading-relaxed">
                  <li>• 상단 <strong>[온라인 참가 접수]</strong> 탭에서 온라인 참가 신청서 작성</li>
                  <li>• 참가자 기본정보, 업로드된 SNS 영상 URL, 기획 의도 작성</li>
                  <li>• 개인정보 수집·이용 동의 및 저작권 활용 동의 완료 후 제출</li>
                  <li>• 제출 즉시 접수번호 발급 및 안내 이메일 자동 발송</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. 시상 내역 상세 표 (붙임1 시상내역 100% 수록) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-600" size={20} />
                <h3 className="text-lg font-black text-[#0F172A]">04. 시상 내역 (총 상금 200만원, 총 31팀 내외)</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">장관상 1점 · 이사장상 2점</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-black border-y border-slate-200">
                    <th className="py-3 px-2">상격</th>
                    <th className="py-3 px-2">부문</th>
                    <th className="py-3 px-2">규모</th>
                    <th className="py-3 px-2">시상 내용</th>
                    <th className="py-3 px-2">부상</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  <tr className="bg-amber-50/50 font-black">
                    <td className="py-3 px-2 text-amber-900">대상</td>
                    <td className="py-3 px-2">통합 (1점)</td>
                    <td className="py-3 px-2">1명(팀)</td>
                    <td className="py-3 px-2 text-[#1558C9]">여성가족부장관상</td>
                    <td className="py-3 px-2 text-amber-700">상품권 50만원</td>
                  </tr>
                  <tr>
                    <td rowSpan={3} className="py-3 px-2 font-bold bg-slate-50 border-r border-slate-100">최우수상</td>
                    <td className="py-2.5 px-2">댄스 부문</td>
                    <td className="py-2.5 px-2">1명(팀)</td>
                    <td className="py-2.5 px-2">한국청소년활동진흥원 이사장상</td>
                    <td className="py-2.5 px-2 text-amber-700">상품권 25만원</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2">크리에이티브 부문</td>
                    <td className="py-2.5 px-2">1명(팀)</td>
                    <td className="py-2.5 px-2">한국청소년활동진흥원 이사장상</td>
                    <td className="py-2.5 px-2 text-amber-700">상품권 25만원</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2.5 px-2 bg-slate-50 font-bold">우수상</td>
                    <td className="py-2.5 px-2">부문별 2팀 (총 4팀)</td>
                    <td className="py-2.5 px-2">-</td>
                    <td className="py-2.5 px-2 text-amber-700">상품권 10만원</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-bold bg-slate-50">장려상</td>
                    <td className="py-2.5 px-2">부문별 4팀 (총 8팀)</td>
                    <td className="py-2.5 px-2">8명(팀)</td>
                    <td className="py-2.5 px-2">-</td>
                    <td className="py-2.5 px-2 text-amber-700">상품권 3만원</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2.5 px-2 font-bold text-slate-600">참가상</td>
                    <td className="py-2.5 px-2">전 부문</td>
                    <td className="py-2.5 px-2">16명(팀) 내외</td>
                    <td className="py-2.5 px-2">-</td>
                    <td className="py-2.5 px-2 text-slate-700">상품권 1만원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              ※ 팀 단위 참가 시 팀별 상품권, 상장 각 1개 지급 (인원수 개별 지급 불가)
            </p>
          </div>

          {/* 5. 심사 기준 및 일정 */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="text-amber-600" size={20} />
                <h3 className="text-lg font-black text-[#0F172A]">05. 심사 기준 (총 100점)</h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                정성평가 60점 + 정량평가 40점
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="font-black text-sm text-[#0F172A] block">🎯 정성 평가 (60점)</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">• 메시지 적합성 (25점)</span>
                    <span className="text-slate-500">목적에 부합되게 표현되었는가?</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">• 창의성 (20점)</span>
                    <span className="text-slate-500">독창성을 가지고 흥미를 유발하는가?</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">• 완성도 (15점)</span>
                    <span className="text-slate-500">메시지 흐름이 안정적인가?</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="font-black text-sm text-[#0F172A] block">📊 정량 평가 (40점)</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-bold text-slate-700">• 조회 지표 (25점)</span>
                    <span className="text-slate-500">콘텐츠 재생 수</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">• 반응 지표 (15점)</span>
                    <span className="text-slate-500">좋아요, 댓글, 공유 등 참여 반응도</span>
                  </div>
                  <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                    ※ 정량 지표는 접수 마감일(2026. 10. 5. 24:00) 기준으로 집계 예정입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-black text-blue-950">📢 결과 발표 예정일:</span>
              <span className="font-black text-[#1558C9]">2026년 11월 1주 예정 (진흥원 홈페이지 공지 및 개별 안내)</span>
            </div>
          </div>

          {/* 6. 10대 유의사항 (붙임1 전문 수록) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertCircle className="text-rose-600" size={20} />
              <h3 className="text-lg font-black text-[#0F172A]">06. 참가자 10대 유의사항</h3>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <p>➊ 응모자는 저작권 침해 주의 및 제3자의 초상권, 지적재산권 등 기타 제반 권리를 침해하지 않도록 주의의무를 다해야 하며, 이에 대한 이의 신청 또는 분쟁 발생 시 모든 책임은 응모자에게 있습니다.</p>
              <p>➋ 안전문화 확산 캠페인의 취지에 반하는 위험한 행동 연출이나 모방할 우려가 있는 콘텐츠는 실격 처리될 수 있습니다.</p>
              <p>➌ 심사 종료 전 게시물이 비공개 또는 삭제될 경우 심사가 불가능합니다.</p>
              <p>➍ 동일한 내용이 응모되었을 경우 접수순에 따라 당선작을 선정하며, 후순위는 당선에서 제외합니다.</p>
              <p>➎ 적격자가 없는 경우 당선작을 선정하지 않을 수 있으며, 제출된 서류 일체는 반환하지 않습니다.</p>
              <p>➏ 수상작 저작권은 참가자에게 귀속되나, 주최기관은 비영리목적(교육·홍보 등)에 한해 무상 활용권을 가집니다. (당선작은 동영상 원본 제출 필수)</p>
              <p>➐ 타인의 영상, 음악, 이미지 등 저작물을 무단으로 사용한 작품은 심사에서 제외 또는 당선이 취소될 수 있습니다.</p>
              <p>➑ 타 기관에서 시행한 공모에서 이미 수상한 과제나 아이디어를 도용한 것, 공모전의 주제와 무관한 작품은 심사 대상에서 제외됩니다.</p>
              <p>➒ 응모작 중 타인의 명예를 훼손하거나 음란·폭력물, 불법 정보 유포, 저작권 및 초상권 침해 소지가 있는 경우 심사에서 제외되며, 민·형사상 문제 발생 시 모든 법적 책임은 응모자 본인에게 있습니다.</p>
              <p>➓ 당선이 취소될 경우 수령한 상품 및 상장을 한국청소년활동진흥원에 즉시 반환하여야 합니다.</p>
            </div>

            {/* 운영사무국 문의처 */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="font-black text-slate-800">📞 한국청소년활동진흥원 PLAY SAFE 숏폼 챌린지 공모전 운영사무국</span>
              <div className="flex items-center gap-4 text-slate-600 font-bold">
                <span>전화: 02-2088-8456</span>
                <span>이메일: mkteam@testmotionofficial.com</span>
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
