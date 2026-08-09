import Link from "next/link";
import { Lock, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-slate-400 font-sans">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-300">2026 청소년활동 안전문화 확산 사업 공식 통합 플랫폼</p>
          <p className="text-[11px] text-slate-500">© KYWA 한국청소년활동진흥원. All rights reserved.</p>
        </div>

        {/* 🔒 푸터 하단 관계자 로그인 링크 (유저 요구사항 100% 반영!) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/crew"
            className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full"
          >
            <Lock size={12} className="text-slate-400" />
            <span>🔒 관계자 로그인 (홍보단/운영진)</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
