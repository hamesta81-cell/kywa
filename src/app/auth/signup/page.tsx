"use client";

import { useState } from "react";
import { Mail, Lock, User, School, UserPlus, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, ShieldAlert, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// KST 기준 만 14세 이상 여부 계산 유틸
function checkIsAtLeast14(year: number, month: number, day: number): boolean {
  if (!year || !month || !day) return false;
  const now = new Date();
  const kstFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = kstFormatter.format(now).split("-");
  const todayYear = parseInt(parts[0], 10);
  const todayMonth = parseInt(parts[1], 10);
  const todayDay = parseInt(parts[2], 10);

  let age = todayYear - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) {
    age -= 1;
  }
  return age >= 14;
}

export default function SignUpPage() {
  const router = useRouter();

  // ==========================================
  // 1단계: 가입 전 연령 확인 게이트 상태
  // ==========================================
  const [step, setStep] = useState<"AGE_GATE" | "FORM" | "BLOCKED">("AGE_GATE");
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [ageCheckError, setAgeCheckError] = useState<string>("");

  // ==========================================
  // 2단계: 회원가입 정보 입력 상태
  // ==========================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [organization, setOrganization] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🌟 별도 필수 확인란 (개인정보 동의와 별도 분리, 사전 체크 절대 금지)
  const [agreeAgeConfirmed, setAgreeAgeConfirmed] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // 1단계: 연령 확인 검증 핸들러
  const handleVerifyAgeGate = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeCheckError("");

    const y = parseInt(birthYear, 10);
    const m = parseInt(birthMonth, 10);
    const d = parseInt(birthDay, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d) || y < 1920 || y > 2026 || m < 1 || m > 12 || d < 1 || d > 31) {
      setAgeCheckError("생년월일을 올바른 8자리 숫자로 정확히 입력해 주세요.");
      return;
    }

    const is14OrOlder = checkIsAtLeast14(y, m, d);

    if (!is14OrOlder) {
      // 🛑 만 14세 미만: 폼 접근 원천 차단 화면으로 전환
      setStep("BLOCKED");
    } else {
      // ✅ 만 14세 이상: 2단계 정보 입력 폼으로 이동
      setStep("FORM");
    }
  };

  // 2단계: 최종 회원가입 및 서버 검증 핸들러
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeAgeConfirmed) {
      alert("⚠️ [필수] 가입일 현재 만 14세 이상임을 확인하는 별도 항목에 체크해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      alert("⚠️ 비밀번호는 안전을 위해 8자 이상 입력해 주세요.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("⚠️ 서비스 이용약관 및 개인정보 처리방침에 모두 동의해 주세요.");
      return;
    }

    const birthDateStr = `${birthYear.padStart(4, "0")}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

    setIsLoading(true);
    try {
      // 🛡️ 서버 사이드에서도 연령 조건을 필수 재검사 (API 레벨 차단)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          nickname: nickname.trim(),
          organization: organization.trim(),
          birthDate: birthDateStr,
          agreeAge: agreeAgeConfirmed,
          agreeTerms,
          agreePrivacy
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "AGE_RESTRICTED_UNDER_14") {
          setStep("BLOCKED");
          return;
        }
        alert(`⚠️ 회원가입 실패: ${data.error || "입력 정보를 확인해 주세요."}`);
        setIsLoading(false);
        return;
      }

      // 로컬 스토리지 및 세션 동기화 (생년월일은 일절 저장하지 않음)
      const user = data.user;
      try {
        const existing = JSON.parse(localStorage.getItem("registeredUsersList") || "[]");
        localStorage.setItem("registeredUsersList", JSON.stringify([user, ...existing]));
        sessionStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
        if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));
      } catch (storageErr) {}

      alert(`🎉 [회원가입 완료] ${user.nickname}님 환영합니다!\n만 14세 이상 연령 확인이 정상 완료되었습니다.`);
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] pt-28 pb-20 px-4 text-[#0F172A] font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[24px] border border-[#CBD5E1] p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* 상단 뒤로가기 & 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-black transition-colors"
          >
            <ArrowLeft size={16} /> 메인으로 돌아가기
          </Link>
          <span className="text-[11px] font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
            <ShieldCheck size={14} /> 안전한 청소년 플랫폼
          </span>
        </div>

        {/* ==================================================================== */}
        {/* 🛑 가입 차단 화면 (만 14세 미만 확인 시 표시)                          */}
        {/* ==================================================================== */}
        {step === "BLOCKED" && (
          <div className="space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center mx-auto text-rose-600 shadow-inner">
              <ShieldAlert size={36} />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-rose-600">
                회원가입 불가 안내
              </h2>
              <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-xs sm:text-sm font-bold text-rose-900 leading-relaxed max-w-md mx-auto space-y-2">
                <p className="font-black text-rose-700 text-base">
                  본 서비스는 만 14세 이상만 이용할 수 있어 회원가입을 진행할 수 없습니다.
                </p>
                <p className="text-slate-600 text-xs font-medium">
                  개인정보 보호법 제22조의2 및 플랫폼 운영 정책에 따라 가입일 현재 만 14세 미만 아동의 회원가입은 전면 제한됩니다.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={16} />
                <span>메인 홈으로 이동</span>
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 🌟 1단계: 가입 전 첫 화면에서 연령부터 확인 (Age Verification Gate)   */}
        {/* ==================================================================== */}
        {step === "AGE_GATE" && (
          <form onSubmit={handleVerifyAgeGate} className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-[#1558C9] rounded-full text-xs font-black">
                <Calendar size={14} /> STEP 1 · 연령 확인
              </div>
              <h1 className="text-2xl font-black text-[#0F172A]">
                가입 전 연령 확인
              </h1>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                본 서비스는 가입일 현재 <strong>만 14세 이상만 가입</strong>할 수 있습니다. 생년월일을 입력해 주세요.
              </p>
            </div>

            {/* 생년월일 입력 박스 */}
            <div className="p-5 bg-slate-50 border-2 border-blue-200 rounded-2xl space-y-4">
              <label className="block text-xs font-black text-slate-800">
                • 출생 연월일 (한국 시간 기준 만 나이 판정) *
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="출생연도 (예: 2010)"
                    value={birthYear}
                    onChange={e => setBirthYear(e.target.value)}
                    min={1920}
                    max={2026}
                    className="w-full px-3 py-3 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 text-center focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">년(4자리)</span>
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="월 (1~12)"
                    value={birthMonth}
                    onChange={e => setBirthMonth(e.target.value)}
                    min={1}
                    max={12}
                    className="w-full px-3 py-3 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 text-center focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">월(1~12)</span>
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="일 (1~31)"
                    value={birthDay}
                    onChange={e => setBirthDay(e.target.value)}
                    min={1}
                    max={31}
                    className="w-full px-3 py-3 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 text-center focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block text-center mt-1">일(1~31)</span>
                </div>
              </div>

              {ageCheckError && (
                <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle size={14} /> {ageCheckError}
                </p>
              )}

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-[#1558C9] flex items-center gap-1">
                  <ShieldCheck size={14} /> 개인정보 비저장 원칙
                </p>
                <p className="leading-relaxed">
                  입력하신 생년월일은 <strong>만 14세 이상 여부 판정 즉시 파기</strong>되며, 회원정보나 서버 로그에 저장되지 않습니다. 확인 후 만 14세 이상 인증 여부 및 일시만 보관됩니다.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>연령 확인 후 회원가입 진행하기 →</span>
            </button>

            <div className="pt-2 text-center text-xs font-bold text-slate-500 border-t border-slate-200">
              이미 가입된 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-[#1558C9] underline font-black">
                로그인 하러 가기
              </Link>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* 🌟 2단계: 연령 검증 통과 후 계정 정보 입력 폼 (Account Info Form)    */}
        {/* ==================================================================== */}
        {step === "FORM" && (
          <form onSubmit={handleSignUp} autoComplete="off" className="space-y-5 animate-in fade-in duration-200 text-xs font-black text-[#0F172A]">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-black">
                  <Check size={12} /> 만 14세 이상 연령 확인 통과
                </div>
                <button
                  type="button"
                  onClick={() => setStep("AGE_GATE")}
                  className="text-slate-400 hover:text-slate-600 text-[11px] underline"
                >
                  생년월일 재입력
                </button>
              </div>
              <h1 className="text-2xl font-black text-[#0F172A] mt-1">
                회원 정보 입력
              </h1>
              <p className="text-xs font-bold text-slate-600">
                아이디와 비밀번호, 활동하실 닉네임을 입력해 주세요.
              </p>
            </div>

            {/* 아이디 (이메일) */}
            <div className="space-y-1">
              <label className="block text-[#0F172A]">• 이메일 주소 (로그인 아이디) *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="example@naver.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  name="signup_user_email_unique"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 & 비밀번호 확인 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[#0F172A]">• 비밀번호 *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="8자 이상 입력"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    name="signup_user_password_new"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[#0F172A]">• 비밀번호 확인 *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="비밀번호 재입력"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    autoComplete="new-password"
                    name="signup_user_password_confirm"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 닉네임 (활동명) */}
            <div className="space-y-1">
              <label className="block text-[#0F172A] flex items-center justify-between">
                <span>• 닉네임 (활동명) *</span>
                <span className="text-blue-600 font-black text-[11px]">[필수]</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="예: 안전지킴이 (실명 불필요)"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium pl-1">
                ※ 개인정보 최소 수집 원칙에 따라 실명 대신 닉네임으로 활동합니다.
              </p>
            </div>

            {/* 경품 발송용 전화번호 사전 미수집 안내 배너 */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900 font-black text-[11px]">
                <ShieldCheck size={14} className="text-[#1558C9]" />
                <span>🎁 경품·기프티콘 발송용 연락처 사전 미수집 안내</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                개인정보 과다 수집 방지를 위해 <strong>회원가입 시 휴대전화번호를 수집하지 않습니다.</strong> 이벤트·캠페인 참여 보상(모바일 쿠폰 등)은 <strong>향후 당첨자 선정 시 별도 동의</strong>를 거쳐 수집되며, 발송 및 회계 정산 목적 달성 후 지체 없이 안전하게 파기됩니다.
              </p>
            </div>

            {/* 소속 학교 / 기관명 (선택) */}
            <div className="space-y-1">
              <label className="block text-[#0F172A] flex items-center justify-between">
                <span>• 소속 (학교·청소년기관 등):</span>
                <span className="text-slate-400 font-black text-[11px]">[선택사항]</span>
              </label>
              <div className="relative">
                <School size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="예: 서울중학교, 청소년센터 등 (미입력 가능)"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                />
              </div>
            </div>

            {/* 약관 및 별도 필수 확인란 영역 */}
            <div className="p-4 bg-slate-50 rounded-[16px] border border-[#CBD5E1] space-y-3 pt-3">
              
              {/* 🌟 [핵심 요구사항] 개인정보 동의와 별도로 분리된 단독 필수 확인란 */}
              {/* (절대 사전 체크된 상태로 제공하지 않음) */}
              <label className="flex items-start gap-2.5 p-3.5 bg-blue-50/90 rounded-xl border-2 border-blue-400 cursor-pointer shadow-sm">
                <input
                  type="checkbox"
                  checked={agreeAgeConfirmed}
                  onChange={e => setAgreeAgeConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#1558C9] focus:ring-[#1558C9]"
                  required
                />
                <div className="text-xs">
                  <span className="font-black text-[#1558C9] block">
                    [필수] 본인은 가입일 현재 만 14세 이상임을 확인합니다.
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium leading-tight block mt-0.5">
                    개인정보 보호법 제22조의2에 따라 본 서비스는 가입일 현재 만 14세 이상만 이용할 수 있습니다.
                  </span>
                </div>
              </label>

              {/* 서비스 이용약관 동의 */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1558C9] focus:ring-[#1558C9]"
                  required
                />
                <span className="text-xs font-black text-[#0F172A]">
                  [필수] 청소년 안전문화 확산 사업 서비스 이용약관 동의
                </span>
              </label>

              {/* 개인정보 수집·이용 동의 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={e => setAgreePrivacy(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1558C9] focus:ring-[#1558C9]"
                    required
                  />
                  <span className="text-xs font-black text-[#0F172A]">
                    [필수] 개인정보 수집·이용 및 처리방침 동의
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#1558C9] hover:underline font-black text-[11px] underline"
                >
                  [전문 보기]
                </button>
              </div>

            </div>

            {/* 회원가입 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 disabled:bg-slate-400 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target transition-all cursor-pointer"
            >
              <UserPlus size={18} />
              <span>{isLoading ? "연령 재검증 및 처리 중..." : "[ 🚀 만 14세 이상 회원가입 완료하기 ]"}</span>
            </button>
          </form>
        )}

      </div>

      {/* 🌟 개인정보 처리방침 전문 모달 팝업 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-2xl w-full bg-white space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto border border-[#CBD5E1] text-[#0F172A] animate-in zoom-in-95 rounded-[20px]">
            
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white bg-[#1558C9] px-3 py-1 rounded-md">
                  PLAY SAFE 2026
                </span>
                <h3 className="text-base font-black text-[#0F172A]">🔐 개인정보 처리방침 및 연령 확인 정책 (전문)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-500 font-black text-sm hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700 leading-relaxed max-h-[50vh] overflow-y-auto p-4 bg-slate-50 rounded-[14px] border border-slate-200">
              
              <section className="space-y-1.5 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-black text-[#1558C9] text-sm">• 1. 만 14세 이상 이용 정책 및 사전 연령 확인</h4>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  본 서비스는 가입일 현재 만 14세 이상만 가입할 수 있습니다. 가입 전 생년월일 검증 및 서버 사이드 연령 확인을 통해 만 14세 미만 아동의 계정 생성을 원천 차단합니다.
                </p>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  <strong>생년월일 비저장 원칙:</strong> 연령 확인 목적으로 입력받은 생년월일은 만 14세 이상 여부 계산 직후 즉시 파기되며, 서버 데이터베이스나 접속 로그에 일절 보관되지 않습니다. 확인 결과(만 14세 이상 확인 여부, 확인 일시, 정책 버전)만 보관됩니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 2. 수집하는 개인정보 항목 및 보유기간</h4>
                <ul className="list-disc pl-4 text-slate-600 space-y-1 text-[11px]">
                  <li><strong>회원가입 수집 항목:</strong> [필수] 이메일(아이디), 비밀번호, 닉네임 / [선택] 소속(학교·기관명)</li>
                  <li><strong>서비스 이용 중 자동 수집:</strong> 접속 일시, 미션 활동 이력</li>
                  <li><strong>경품 발송 정보 분리 원칙:</strong> 기프티콘·모바일 상품권 등 경품 발송용 휴대전화번호는 회원가입 시 수집하지 않으며, 이벤트·챌린지 당첨자 선정 시 별도 동의를 거쳐 수집 후 발송 및 정산 완료 시 즉시 파기합니다.</li>
                  <li><strong>보유 기간:</strong> 회원 탈퇴 시 또는 수집·이용 목적 달성 시까지 (목적 달성 시 지체 없이 복구 불가능하게 파기)</li>
                </ul>
              </section>

              {/* 🌟 [사용자 요구사항 필수 조항] 허위 가입 시 처리 조항 */}
              <section className="space-y-1.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-black text-amber-900 text-sm">• 3. 허위 연령 가입 발견 시 처리 조항</h4>
                <p className="text-amber-950 leading-relaxed text-[11px] font-bold">
                  가입자가 연령을 사실과 다르게 확인한 사실이 확인되는 경우 서비스 이용을 중지할 수 있습니다. 만 14세 미만 가입자로 확인된 경우 개인정보 처리를 즉시 중단하고 관계 법령과 개인정보 처리방침에 따라 해당 정보를 파기합니다.
                </p>
              </section>

              <section className="space-y-1.5 p-3 bg-rose-50 rounded-xl border border-rose-200">
                <h4 className="font-black text-rose-700 text-sm">• 4. 미승인 아동 가입 시 4단계 표준 대응 절차 (SOP)</h4>
                <ol className="list-decimal pl-4 text-slate-700 space-y-1 text-[11px] font-bold">
                  <li><strong>[1단계] 계정 즉시 이용정지:</strong> 해당 계정의 로그인 및 미션 활동 즉시 차단</li>
                  <li><strong>[2단계] 추가 처리 중단:</strong> 개인정보 추가 수집·조회·가공 행위 전면 중단</li>
                  <li><strong>[3단계] 개인정보 파기:</strong> 등록된 계정 데이터 일체 지체 없이 영구 파기</li>
                  <li><strong>[4단계] 수탁업체 보유정보 삭제 요청:</strong> 기프티콘 발송업체 등 수탁업체 보유정보 삭제 요청 및 완전 파기 확인</li>
                </ol>
              </section>

            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAgreePrivacy(true);
                  setShowPrivacyModal(false);
                }}
                className="krds-public-button px-6 py-3 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[12px] shadow-md cursor-pointer"
              >
                [ 개인정보 처리방침 동의하기 ]
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-black text-xs rounded-[12px] cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
