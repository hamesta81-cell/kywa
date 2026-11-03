"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, LogIn, ArrowRight, UserCheck, KeyRound, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";

import { clearAuthToken, setAuthToken } from "@/lib/clientAuth";

const ADMIN_USERNAMES = ["admin@kywa.or.kr", "admin", "총괄관리자", "총괄 관리자"];

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [loginMode, setLoginMode] = useState<"general" | "crew">("general");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generalName, setGeneralName] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ADMIN_USERNAMES.includes(username.trim()) || loginMode === "crew") {
      // 🔒 비밀번호는 서버에서 확인하고, 통과하면 서명된 로그인 토큰을 받는다
      let data: { success?: boolean; message?: string; token?: string; user?: { name: string; role: string } } = {};
      try {
        const res = await fetch("/api/auth/crew-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success || !data.token || !data.user) {
          alert(data.message || "⚠️ 아이디 또는 비밀번호가 올바르지 않습니다.");
          return;
        }
      } catch {
        alert("⚠️ 서버에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
        return;
      }
      if (!data.token || !data.user) return;

      setAuthToken(data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user", JSON.stringify(data.user));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));

      if (data.user.role === "ADMIN") {
        alert("🟢 총괄 관리자 권한으로 로그인되었습니다.");
        if (typeof window !== "undefined") window.location.href = "/admin";
        return;
      }

      const teamName = data.user.name;
      // 🌟 로그인 이력 누적 저장 (로컬 + 서버, 서버는 토큰의 팀으로 기록)
      try {
        const nowStr = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
        const raw = localStorage.getItem("kywa_crew_login_logs");
        let logs: Record<string, { count: number; lastLoginTime: string; history: string[] }> = raw ? JSON.parse(raw) : {};
        const current = logs[teamName] || { count: 0, lastLoginTime: "-", history: [] };
        logs[teamName] = {
          count: current.count + 1,
          lastLoginTime: nowStr,
          history: [nowStr, ...current.history].slice(0, 10)
        };
        localStorage.setItem("kywa_crew_login_logs", JSON.stringify(logs));

        fetch("/api/crew-login-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamName })
        }).catch(err => console.error("Server login log POST failed:", err));
      } catch (e) {
        console.error(e);
      }

      alert(`🟢 [${teamName}] 홍보단 전용 권한으로 로그인되었습니다. 팀 전용 오피스로 이동합니다.`);
      if (typeof window !== "undefined") window.location.href = "/crew?mode=office";
    } else {
      // 일반 회원 로그인
      const displayName = generalName.trim() || username.split("@")[0] || "청소년 서포터즈";
      const youthObj = { 
        name: displayName, 
        role: "YOUTH",
        level: 1
      };
      clearAuthToken();
      sessionStorage.setItem("user", JSON.stringify(youthObj));
      localStorage.setItem("user", JSON.stringify(youthObj));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));

      alert(`🟢 [${displayName}] 님, 청소년 안전 서포터즈 일반 회원으로 로그인되었습니다.`);
      if (typeof window !== "undefined") window.location.href = "/campaign";
    }
  };

  const handleQuickGeneralLogin = (name: string) => {
    const youthObj = { name, role: "YOUTH", level: 12 };
    clearAuthToken();
    sessionStorage.setItem("user", JSON.stringify(youthObj));
    localStorage.setItem("user", JSON.stringify(youthObj));
    if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));

    alert(`🟢 [${name}] 일반 서포터즈 회원으로 간편 로그인되었습니다.`);
    if (typeof window !== "undefined") window.location.href = "/campaign";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] pt-28 pb-20 px-4 text-[#0F172A] font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[24px] border border-[#CBD5E1] p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* 헤더 안내 */}
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#1558C9] bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-300">
            PLAY SAFE AUTHENTICATION 2026
          </span>
          <h1 className="text-2xl font-black text-[#0F172A]">청소년 안전 플랫폼 통합 로그인</h1>
          <p className="text-xs font-black text-slate-600">
            일반 회원(국민 참여자)과 16개 안전홍보단 팀별 로그인을 모두 지원합니다.
          </p>
        </div>

        {/* 🌟 로그인 모드 전환 탭 */}
        <div className="flex bg-slate-100 p-1.5 rounded-[16px] border border-[#CBD5E1]">
          <button
            type="button"
            onClick={() => setLoginMode("general")}
            className={`flex-1 py-3 text-xs font-black rounded-[12px] transition-all flex items-center justify-center gap-2 ${
              loginMode === "general"
                ? "bg-[#1558C9] text-white shadow-md"
                : "text-slate-700 hover:text-black"
            }`}
          >
            <UserCheck size={16} />
            <span>👤 일반 회원 / 국민 참여자 로그인</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMode("crew")}
            className={`flex-1 py-3 text-xs font-black rounded-[12px] transition-all flex items-center justify-center gap-2 ${
              loginMode === "crew"
                ? "bg-[#0F172A] text-white shadow-md"
                : "text-slate-700 hover:text-black"
            }`}
          >
            <ShieldCheck size={16} />
            <span>🛡️ 16개 안전홍보단 팀 로그인</span>
          </button>
        </div>

        {/* 모드 1: 일반 회원 로그인 (회원가입 불필요 / 닉네임 즉시 참여) */}
        {loginMode === "general" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-[16px] space-y-2">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" /> 회원가입 없는 대국민 간편 참여
              </span>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                본 플랫폼은 <strong>개인정보 보호 및 아동 안전</strong>을 위해 <strong>별도의 회원가입 절차를 두지 않습니다.</strong><br />
                사용하실 <strong>닉네임(이름)</strong>만 입력하시면 별도 가입·비밀번호 없이 즉시 미션 수행, 안전 지도 참여 및 공모전에 참여하실 수 있습니다.
              </p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs font-black text-[#0F172A]">
              <div className="space-y-1">
                <label className="block text-[#0F172A]">• 활동 닉네임 또는 이름:</label>
                <div className="relative flex items-center">
                  <UserCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="활동에 사용할 닉네임을 입력하세요 (예: 안전지킴이)"
                    value={generalName}
                    onChange={e => setGeneralName(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target"
              >
                <LogIn size={18} />
                <span>[ 🚀 회원가입 없이 즉시 참여하기 ]</span>
              </button>
            </form>
          </div>
        )}

        {/* 모드 2: 16개 안전홍보단 팀 전용 로그인 */}
        {loginMode === "crew" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 로그인 입력 폼 */}
            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs font-black text-[#0F172A]">
              <div className="space-y-1">
                <label className="block text-[#0F172A]">• 팀 아이디 (이메일 주소):</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="홍보단 팀 아이디(이메일)를 입력하세요"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="off"
                    name="crew_team_username_login"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[#0F172A]">• 비밀번호:</label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
                  <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    name="crew_team_password_login"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="krds-public-button w-full py-4 bg-[#0F172A] hover:bg-black text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target"
              >
                <LogIn size={18} />
                <span>[ 🔑 팀 오피스 접속하기 ]</span>
              </button>
            </form>
          </div>
        )}

        <div className="pt-3 text-center text-xs font-black text-slate-500 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.clear();
                localStorage.removeItem("user");
                clearAuthToken();
                alert("🧹 브라우저 연결 세션이 초기화되었습니다. 새로고침합니다.");
                window.location.reload();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline font-bold"
          >
            🔄 접속 로딩 오류 시 세션 초기화
          </button>
          <div className="px-3.5 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-black text-xs flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>회원가입 없이 자유롭게 이용 가능</span>
          </div>
        </div>

      </div>
    </div>
  );
}
