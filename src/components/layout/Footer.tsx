import Link from "next/link";
import { Lock, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="h-4 w-4 text-[#1558C9]" />
            <span className="text-xs font-black text-slate-900 tracking-wider">
              KYWA PLAY SAFE 2026
            </span>
          </div>
          <p className="text-xs font-medium text-slate-600">
            2026 청소년활동 안전문화 확산 사업 공식 통합 플랫폼 · YOUTH SAFETY OS
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            © KYWA 한국청소년활동진흥원. All rights reserved.
          </p>
        </div>

        {/* 🔒 푸터 관계자 로그인 및 뱃지 링크 */}
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href="/crew"
            className="text-[11px] font-bold text-slate-700 hover:text-[#1558C9] transition-colors flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-blue-300 px-3.5 py-2 rounded-full shadow-sm"
          >
            <Lock size={12} className="text-[#1558C9]" />
            <span>🔒 홍보단 & 운영진 오피스</span>
          </Link>
          
          <Link
            href="/admin"
            className="text-[11px] font-bold text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-full"
          >
            <span>관리자 콘솔</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
