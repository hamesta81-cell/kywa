"use client";

import React, { useState, useEffect } from "react";
import { Server, Activity, ShieldCheck, Wifi, Cpu, Globe, User, Clock, Hash, Tag } from "lucide-react";

interface DiagnosticProps {
  currentUser?: any;
  lastSyncTime?: string;
}

export default function AdminSystemDiagnosticBadge({ currentUser, lastSyncTime }: DiagnosticProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [currentDomain, setCurrentDomain] = useState<string>("loading...");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname);
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString("ko-KR"));
      }, 1000);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        clearInterval(timer);
      };
    }
  }, []);

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ff8081819f7e10ae019fe60b99641551";
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "kywa-safety-hub-v2026-prod";
  const buildNum = "BUILD-20260809-PROD-SSOT";
  const deployVersion = "v2.6.08 (Master Production)";

  const uid = currentUser?.username || currentUser?.id || "guest_uid_2026";
  const teamId = currentUser?.teamName || currentUser?.teamId || "SAFE_CREW_OFFICE";
  const role = currentUser?.role || "ADMIN";

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 shadow-2xl text-slate-200 my-6">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-base font-bold text-white tracking-wide">
            🕵️ 관리자 전용 실시간 시스템 진단 패널 (10대 핵심 지표)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isOnline ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
          }`}>
            <Wifi className="w-3.5 h-3.5" />
            {isOnline ? "🟢 온라인 (Live Connected)" : "🔴 오프라인 (Disconnected)"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {/* 1. 현재 도메인 */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. 접속 도메인</span>
          </div>
          <p className="font-mono font-bold text-cyan-300 truncate">{currentDomain}</p>
        </div>

        {/* 2. Firebase projectId */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>2. Cloud projectId</span>
          </div>
          <p className="font-mono font-bold text-blue-300 truncate">{projectId}</p>
        </div>

        {/* 3. Firebase appId */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Cloud appId</span>
          </div>
          <p className="font-mono font-bold text-purple-300 truncate">{appId}</p>
        </div>

        {/* 4. 로그인 UID */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>4. 로그인 UID</span>
          </div>
          <p className="font-mono font-bold text-amber-300 truncate">{uid}</p>
        </div>

        {/* 5. teamId */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>5. 소속 teamId</span>
          </div>
          <p className="font-mono font-bold text-emerald-300 truncate">{teamId}</p>
        </div>

        {/* 6. role */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>6. 사용자 권한 (role)</span>
          </div>
          <p className="font-mono font-bold text-indigo-300 truncate">{role}</p>
        </div>

        {/* 7. 배포 버전 */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>7. 프로덕션 배포 버전</span>
          </div>
          <p className="font-mono font-bold text-rose-300 truncate">{deployVersion}</p>
        </div>

        {/* 8. 빌드 번호 */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Hash className="w-3.5 h-3.5 text-teal-400" />
            <span>8. 빌드 고유 번호</span>
          </div>
          <p className="font-mono font-bold text-teal-300 truncate">{buildNum}</p>
        </div>

        {/* 9. 서버 마지막 동기화 시각 */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>9. DB 실시간 동기화</span>
          </div>
          <p className="font-mono font-bold text-sky-300 truncate">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString("ko-KR") : currentTime || "실시간 연결 중"}
          </p>
        </div>

        {/* 10. 온라인 상태 */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>10. 네트워크 연결</span>
          </div>
          <p className="font-mono font-bold text-emerald-300 truncate">
            {isOnline ? "🟢 Online (정상)" : "🔴 Offline (끊김)"}
          </p>
        </div>
      </div>
    </div>
  );
}
