import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-600 font-sans relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
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

      </div>
    </footer>
  );
}
