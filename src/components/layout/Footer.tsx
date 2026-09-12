"use client";

import { useEffect, useState } from "react";
import { Shield, Users, BarChart3 } from "lucide-react";

export default function Footer() {
  const [visitorStats, setVisitorStats] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 🚀 사이트 접속 시마다 실시간으로 일일 및 전체 방문자 카운트 즉시 증가
    async function recordVisit() {
      try {
        const res = await fetch(`/api/visitors?t=${Date.now()}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache" 
          },
          cache: "no-store"
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setVisitorStats({ today: data.today, total: data.total });
          }
        }
      } catch (err) {
        console.error("Failed to record visitor count:", err);
      }
    }

    // 🔄 실시간 최신 통계 동기화 (조회 전용)
    async function syncStats() {
      try {
        const res = await fetch(`/api/visitors?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setVisitorStats({ today: data.today, total: data.total });
          }
        }
      } catch (e) {}
    }

    // 마운트 즉시 1회 방문 카운팅 기록
    recordVisit();

    // 15초 주기로 최신 방문자 수 동기화
    const interval = setInterval(syncStats, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-600 font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* 좌측: 플랫폼 로고 및 저작권 정보 */}
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="h-4 w-4 text-[#1558C9]" />
            <span className="text-xs font-black text-slate-900 tracking-wider">
              PLAY SAFE 2026
            </span>
          </div>
          <p className="text-xs font-medium text-slate-600">
            2026 안전문화 확산 사업 공식 통합 플랫폼 · YOUTH SAFETY OS
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            © TESTMOTION. All rights reserved.
          </p>
        </div>

        {/* 우측: 📊 일일 방문자 및 전체 누적 방문자 카운터 */}
        <div className="flex items-center gap-3 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-sm transition-all text-xs font-bold">
          
          {/* 오늘 방문자 */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-500 text-[11px] font-extrabold flex items-center gap-1">
              <Users size={13} className="text-emerald-600 inline" /> 오늘 방문자
            </span>
            <strong className="text-slate-900 font-black text-xs min-w-[32px] text-right">
              {visitorStats ? visitorStats.today.toLocaleString() : "-"}
            </strong>
          </div>

          <div className="w-[1px] h-3.5 bg-slate-300"></div>

          {/* 전체 누적 방문자 */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-extrabold flex items-center gap-1">
              <BarChart3 size={13} className="text-[#1558C9] inline" /> 전체 누적
            </span>
            <strong className="text-[#1558C9] font-black text-xs min-w-[45px] text-right">
              {visitorStats ? visitorStats.total.toLocaleString() : "-"}
            </strong>
          </div>

        </div>

      </div>
    </footer>
  );
}
