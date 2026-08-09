"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Megaphone, Trophy, FolderOpen, Users, LogOut, Search, User, ChevronDown, Sparkles, Award, Lock, LogIn, Target, UserPlus } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkUser = () => {
        try {
          const rawSession = sessionStorage.getItem("user") || sessionStorage.getItem("kywa_user");
          const rawLocal = localStorage.getItem("user") || localStorage.getItem("kywa_user");
          const savedUser = rawSession || rawLocal;

          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setLocalUser(parsed);
          } else {
            setLocalUser(null);
          }
        } catch (e) {
          setLocalUser(null);
        }
      };

      checkUser();
      
      // 🌟 타 탭 변경 및 동일 탭 커스텀 이벤트 감지
      window.addEventListener("storage", checkUser);
      window.addEventListener("kywa-user-login", checkUser);

      // 🌟 라우팅 직후 빠른 반응을 위한 0.5초 보조 폴링
      const interval = setInterval(checkUser, 500);

      return () => {
        window.removeEventListener("storage", checkUser);
        window.removeEventListener("kywa-user-login", checkUser);
        clearInterval(interval);
      };
    }
  }, []);

  const currentUser = session?.user || localUser;

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("kywa_user");
      localStorage.removeItem("user");
      localStorage.removeItem("kywa_user");
      window.dispatchEvent(new Event("kywa-user-login"));
    }
    setLocalUser(null);
    setShowProfileMenu(false);
    alert("🚪 성공적으로 로그아웃되었습니다.");
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto bg-white/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-slate-200/80 rounded-full px-6 py-2.5 w-full max-w-6xl flex items-center justify-between transition-all duration-300">
          
          {/* 1. 로고 (KYWA PLAY SAFE) */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1px] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-tight text-slate-900 leading-none">
                KYWA <span className="text-blue-600">PLAY SAFE</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">YOUTH SAFETY OS</span>
            </div>
          </Link>
          
          {/* 2. 일반 이용자 메인 네비게이션 (유저 요구사항 100% 충실 반영!) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/70 rounded-full px-2 py-1 border border-slate-200/60">
            <Link 
              href="/campaign" 
              className="px-3.5 py-1.5 text-xs font-black text-slate-700 hover:text-blue-600 hover:bg-white rounded-full transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Megaphone size={14} className="text-blue-500" />
              <span>안전 미션</span>
            </Link>

            <Link 
              href="/archive" 
              className="px-3.5 py-1.5 text-xs font-black text-slate-700 hover:text-emerald-600 hover:bg-white rounded-full transition-all flex items-center gap-1.5"
            >
              <FolderOpen size={14} className="text-emerald-500" />
              <span>안전정보</span>
            </Link>

            <Link 
              href="/contest" 
              className="px-3.5 py-1.5 text-xs font-black text-slate-700 hover:text-amber-600 hover:bg-white rounded-full transition-all flex items-center gap-1.5"
            >
              <Trophy size={14} className="text-amber-500" />
              <span>안전공모전</span>
            </Link>

            <Link 
              href="/crew" 
              className="px-3.5 py-1.5 text-xs font-black text-slate-700 hover:text-purple-600 hover:bg-white rounded-full transition-all flex items-center gap-1.5"
            >
              <Users size={14} className="text-purple-500" />
              <span>안전홍보단</span>
            </Link>
          </nav>
          
          {/* 3. 우측 컨트롤 (통합검색 + 로그인/[오늘의 미션] + 관계자 프로필 메뉴) */}
          <div className="flex items-center space-x-2">
            
            {/* 통합검색 버튼 */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="플랫폼 통합 검색"
            >
              <Search size={16} />
            </button>

            {/* 🌟 로그인 상태 표시 및 로그인/로그아웃 버튼 (모바일 스크린 완벽 지원!) */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* 1. 로그인 상태 안내 배지 (모바일에서는 축약형 팀명 배지 노출!) */}
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate max-w-[100px] sm:max-w-[160px] md:max-w-none">
                    {currentUser.role === "CREW" 
                      ? `🛡️ ${currentUser.name || "안전홍보단"}`
                      : currentUser.role === "ADMIN"
                      ? `👑 총괄관리자`
                      : `🌱 ${currentUser.name || "서포터즈"}`}
                  </span>
                  <span className="hidden md:inline font-bold"> 접속 중</span>
                </div>

                {/* 2. 로그아웃 버튼 */}
                <button
                  onClick={handleLogout}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 hover:bg-black text-white text-[11px] sm:text-xs font-black rounded-full shadow-md transition-all flex items-center gap-1 shrink-0 touch-target"
                  title="플랫폼 로그아웃"
                >
                  <LogOut size={12} className="text-rose-400 shrink-0" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-full shadow-md transition-all flex items-center gap-1.5 shrink-0 touch-target"
                >
                  <LogIn size={14} />
                  <span>로그인</span>
                </Link>

                <Link
                  href="/auth/signup"
                  className="hidden sm:flex items-center gap-1 bg-blue-50 text-[#1558C9] border border-blue-200 hover:bg-blue-100 text-xs font-black px-3.5 py-2 rounded-full transition-all shrink-0"
                >
                  <UserPlus size={13} />
                  <span>회원가입</span>
                </Link>
              </div>
            )}

            {/* [오늘의 미션] CTA 버튼 */}
            <Link
              href="/campaign"
              className="hidden sm:flex items-center gap-1 bg-[#102A43] hover:bg-black text-white text-xs font-black px-3.5 py-2 rounded-full shadow-md transition-all shrink-0"
            >
              <Target size={13} className="text-yellow-300" />
              <span>[오늘의 미션]</span>
            </Link>

            {/* 관계자용 접근 & 프로필 드롭다운 메뉴 */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all border ${
                  currentUser
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
                }`}
              >
                <User size={14} className={currentUser ? "text-emerald-600" : "text-slate-700"} />
                <span className="hidden md:inline">
                  {currentUser ? (currentUser.name || "가디언") : "관계자 메뉴"}
                </span>
                <ChevronDown size={13} className="text-slate-500" />
              </button>

              {/* 프로필 드롭다운 메뉴 팝업 (나의 안전레벨 / 참여 기록 / CREW 오피스 / 관리자 콘솔) */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2 space-y-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* 상단 프로필 헤더 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">USER PROFILE & ROLE</span>
                    <h4 className="text-xs font-black text-slate-900 flex items-center justify-between gap-1">
                      <span className="truncate">{currentUser ? (currentUser.name || currentUser.email) : "방문자 (비로그인)"}</span>
                      {currentUser ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-100 text-[#1558C9] border border-blue-300 shrink-0">
                          {currentUser.role === "CREW" ? "안전홍보단" : currentUser.role === "ADMIN" ? "관리자" : "서포터즈"}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 shrink-0">
                          미인증
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* ├─ 나의 안전레벨 */}
                  <div className="p-2.5 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between text-blue-900 font-bold cursor-pointer">
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>나의 안전레벨</span>
                    </span>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      {currentUser?.level ? `Lv.${currentUser.level}` : (currentUser ? "Lv.1" : "일반")}
                    </span>
                  </div>

                  {/* ├─ 참여 기록 */}
                  <Link 
                    href="/campaign/mbti" 
                    onClick={() => setShowProfileMenu(false)}
                    className="p-2.5 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-between text-emerald-900 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Award size={14} className="text-emerald-500" />
                      <span>참여 기록</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {currentUser ? "활동 중" : "미참여"}
                    </span>
                  </Link>

                  <div className="my-1 border-t border-slate-100"></div>

                  {/* ├─ CREW 오피스 (홍보단/관리자) */}
                  <Link
                    href="/crew"
                    onClick={() => setShowProfileMenu(false)}
                    className="p-2.5 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-between text-purple-900 font-black"
                  >
                    <span className="flex items-center gap-2">
                      <Users size={14} className="text-purple-600" />
                      <span>🏢 CREW 오피스</span>
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">홍보단 전용</span>
                  </Link>

                  {/* └─ 관리자 콘솔 (KYWA 운영진) */}
                  <Link
                    href="/admin"
                    onClick={() => setShowProfileMenu(false)}
                    className="p-2.5 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-between text-rose-900 font-black"
                  >
                    <span className="flex items-center gap-2">
                      <Shield size={14} className="text-rose-600" />
                      <span>🛡️ 관리자 콘솔</span>
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">KYWA 전용</span>
                  </Link>

                  {/* 로그아웃 버튼 */}
                  {currentUser && (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold flex items-center gap-2 mt-1 border-t border-slate-100"
                    >
                      <LogOut size={13} />
                      <span>로그아웃</span>
                    </button>
                  )}

                </div>
              )}
            </div>

          </div>
        </header>
      </div>

      {/* 🔍 통합검색 팝업 모달 */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <Search size={18} className="text-blue-600" /> KYWA 안전 플랫폼 통합검색
              </h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="카드뉴스, 미션, 공모전, 홍보단 보고서 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5 text-xs pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">인기 추천 검색어</span>
              <div className="flex flex-wrap gap-1.5">
                <Link href="/archive" onClick={() => setShowSearchModal(false)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold">#폭염 온열질환</Link>
                <Link href="/archive" onClick={() => setShowSearchModal(false)} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold">#발목 R.I.C.E</Link>
                <Link href="/archive" onClick={() => setShowSearchModal(false)} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold">#전동킥보드 헬멧</Link>
                <Link href="/contest" onClick={() => setShowSearchModal(false)} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-bold">#2026 안전공모전</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
