"use client";

import { ShieldCheck, Sparkles, ArrowRight, Home, UserCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F7FB] pt-28 pb-20 px-4 text-[#0F172A] font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[24px] border border-[#CBD5E1] p-6 sm:p-10 space-y-8 shadow-xl text-center">
        
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-black mx-auto">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>개인정보 안심 플랫폼 · 회원가입 불필요</span>
        </div>

        {/* 메인 타이틀 */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            별도의 회원가입 없이<br />
            <span className="text-[#1558C9]">누구나 자유롭게 참여</span>하실 수 있습니다
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed max-w-md mx-auto">
            PLAY SAFE 2026 플랫폼은 <strong>아동·청소년의 개인정보 보호</strong> 및 
            <strong> 열린 참여 환경</strong>을 제공하기 위해 복잡한 회원가입 절차와 비밀번호 관리를 전면 폐지하였습니다.
          </p>
        </div>

        {/* 3대 안심 참여 안내 카드 */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-[#1558C9] rounded-xl shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">닉네임 하나로 즉시 활동</h4>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                복잡한 본인인증이나 이메일 인증 없이, 원하는 닉네임만 입력하면 1초 만에 참여하실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">개인정보 유출 걱정 제로</h4>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                가입 시 전화번호나 주민등록번호 등 민감 정보를 일절 수집·보관하지 않아 안심하고 이용할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-slate-200 pt-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <HeartHandshake size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">모든 콘텐츠 100% 무료 개방</h4>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                28종 한눈 안전정보 카드뉴스, 숏폼 챌린지 감상, 공모전 접수 등 모든 기능을 제한 없이 이용하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 이동 버튼 그룹 */}
        <div className="space-y-3 pt-2">
          <Link
            href="/auth/login"
            className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target transition-all"
          >
            <UserCheck size={18} />
            <span>[ 🚀 닉네임으로 간편 참여하기 ]</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/"
            className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-black text-xs rounded-[14px] flex items-center justify-center gap-1.5 transition-all"
          >
            <Home size={15} />
            <span>메인 홈으로 이동</span>
          </Link>
        </div>

        <p className="text-[11px] font-bold text-slate-400">
          ※ 16개 안전홍보단 팀 및 총괄 관리자는 제공된 팀 계정으로 로그인하실 수 있습니다.
        </p>

      </div>
    </div>
  );
}
