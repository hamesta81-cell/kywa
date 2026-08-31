"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Megaphone, Trophy, FolderOpen, Users, LogOut, Search, User, ChevronDown, Sparkles, Award, Lock, LogIn, Target, UserPlus, Zap } from 'lucide-react';
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

      // 🌟 라우팅 직후 빠른 반응을 위한 보조 폴링
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
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto bg-white/95 backdrop-blur-2xl shadow-[0_4px_25px_rgba(15,23,42,0.08)] border border-slate-200 rounded-full px-6 py-2.5 w-full max-w-6xl flex items-center justify-between transition-all duration-300">
          
          {/* 1. 로고 (KYWA PLAY SAFE 2026 - YOUTH SAFETY OS) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#1558C9] to-[#0284C7] p-[1.5px] group-hover:shadow-[0_0_15px_rgba(21,88,201,0.3)] transition-all">
              <div className="w-full h-full bg-[#1558C9] rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-slate-900 leading-none">
                  KYWA PLAY SAFE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-50 text-[#1558C9] border border-blue-200">
                  2026
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-tight leading-none mt-1">
                청소년 안전 OS 플랫폼
              </span>
            </div>
          </Link>

          {/* 2. 메인 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="/campaign" 
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#1558C9] hover:bg-slate-100 rounded-full transition-all"
            >
              <Target className="h-3.5 w-3.5 text-[#1558C9]" />
              <span>안전 미션 덱</span>
            </Link>

            <Link 
              href="/crew" 
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#0284C7] hover:bg-slate-100 rounded-full transition-all"
            >
              <Users className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>안전크루 현장</span>
            </Link>

            <Link 
              href="/contest" 
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-600" />
              <span>숏폼 공모전</span>
            </Link>

            <Link 
              href="/archive" 
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-purple-600 hover:bg-slate-100 rounded-full transition-all"
            >
              <FolderOpen className="h-3.5 w-3.5 text-purple-600" />
              <span>필드 아카이브</span>
            </Link>
          </nav>

          {/* 3. 우측 컨트롤 & 프로필 */}
          <div className="flex items-center space-x-2.5">
            {/* 검색 트리거 버튼 */}
            <button 
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all touch-target"
              title="안전 미션 검색"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* 사용자 로그인/프로필 영역 */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full transition-all touch-target"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1558C9] flex items-center justify-center text-white font-black text-xs">
                    {(currentUser.name || currentUser.team || "U").charAt(0)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 max-w-[90px] truncate leading-none">
                      {currentUser.name || currentUser.team || "청소년 대원"}
                    </span>
                    <span className="text-[9px] font-black text-[#1558C9] leading-none mt-0.5 flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5 fill-[#1558C9]" />
                      LV.3 · 420 XP
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {/* 프로필 드롭다운 */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900">{currentUser.name || currentUser.team}</p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">{currentUser.email || "safety_crew@kywa.or.kr"}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-black text-[#1558C9]">
                        <Zap className="h-3 w-3 fill-[#1558C9]" /> 420 XP (마스터 안전관)
                      </div>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' ? (
                        <Link 
                          href="/admin" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-amber-600 font-black hover:bg-amber-50 transition-colors"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>통합 관리자 콘솔</span>
                        </Link>
                      ) : (
                        <Link 
                          href="/crew" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:text-[#1558C9] hover:bg-slate-50 transition-colors"
                        >
                          <Users className="h-3.5 w-3.5 text-[#0284C7]" />
                          <span>내 활동 & 주간보고</span>
                        </Link>
                      )}
                      
                      <Link 
                        href="/contest" 
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:text-[#1558C9] hover:bg-slate-50 transition-colors"
                      >
                        <Trophy className="h-3.5 w-3.5 text-amber-600" />
                        <span>공모전 출품작 확인</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-1.5 text-xs font-black bg-[#1558C9] hover:bg-blue-700 text-white rounded-full shadow-sm transition-all flex items-center gap-1.5 touch-target"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>로그인</span>
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* 통합 검색 모달 */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-[#1558C9] tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Safety Quest Finder
              </span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                닫기 [ESC]
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="찾고 싶은 안전 주제나 퀘스트를 검색하세요 (예: 피싱, 심폐소생술, 딥페이크)"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1558C9] focus:bg-white transition-all"
                autoFocus
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-slate-400" />
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-500 mb-2">추천 검색어 태그</p>
              <div className="flex flex-wrap gap-1.5">
                {["피싱 스미싱", "집중호우 대피", "심폐소생술 CPR", "사이버 불링", "청소년 웰빙", "야외 활동 안전"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-blue-50 hover:text-[#1558C9] text-slate-700 border border-slate-200 transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
