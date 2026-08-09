"use client";

import { useState } from "react";
import { Mail, Lock, User, Phone, School, UserPlus, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  // 일반 회원 폼 전용
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  
  // 약관 동의 & 세부 지침 모달 state
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("⚠️ 이용약관 및 개인정보 수집 동의에 모두 체크해 주세요.");
      return;
    }

    const displayName = name.trim() || "청소년 서포터즈";
    const newUser = {
      id: Date.now(),
      name: displayName,
      email: email,
      phone: phone || "010-0000-0000",
      organization: organization || "일반 참여자",
      role: "YOUTH",
      roleLabel: "일반 청소년 서포터즈",
      status: "정상 승인",
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 로컬 스토리지 회원가입자 목록에 추가
    try {
      const existing = JSON.parse(localStorage.getItem("registeredUsersList") || "[]");
      localStorage.setItem("registeredUsersList", JSON.stringify([newUser, ...existing]));
    } catch (err) {}

    sessionStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("user", JSON.stringify(newUser));
    if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));

    alert(`🎉 [${displayName}] 님, 청소년 안전 서포터즈 회원가입이 완료되었습니다!\n관리자 가입자 목록에 즉시 등록되었습니다.`);
    router.push("/campaign");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] pt-28 pb-20 px-4 text-[#0F172A] font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-[24px] border border-[#CBD5E1] p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* 상단 랭크 & 뒤로가기 */}
        <div className="flex items-center justify-between">
          <Link href="/auth/login" className="text-xs font-black text-slate-500 hover:text-[#1558C9] flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>로그인 화면으로 돌아가기</span>
          </Link>

          <span className="text-[11px] font-black text-[#1558C9] bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
            GENERAL MEMBER JOIN
          </span>
        </div>

        {/* 헤더 타이틀 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">일반 회원 (국민 서포터즈) 회원가입</h1>
          <p className="text-xs font-black text-slate-600">
            청소년, 학부모, 국민 서포터즈 회원가입 후 다양한 안전 캠페인과 공모전에 참여하세요.
          </p>
        </div>

        {/* 💡 홍보단 계정 안내 카드 */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-[16px] text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-950 font-black">
            <ShieldCheck size={16} className="text-amber-700 shrink-0" />
            <span>안전홍보단(16개 공모 팀) 단원 안내:</span>
          </div>
          <p className="text-[11px] font-bold text-amber-900 leading-relaxed pl-5">
            16개 정식 안전홍보단 팀 계정은 별도 가입 절차 없이 사전 발급된 지정 계정으로 로그인만 가능합니다.
            (<Link href="/auth/login" className="underline font-black text-[#1558C9]">홍보단 전용 로그인으로 이동</Link>)
          </p>
        </div>

        {/* 회원가입 입력 폼 */}
        <form onSubmit={handleSignUp} autoComplete="off" className="space-y-4 text-xs font-black text-[#0F172A]">
          
          {/* 아이디 (이메일) */}
          <div className="space-y-1">
            <label className="block text-[#0F172A]">• 이메일 주소 (로그인 아이디):</label>
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
              <label className="block text-[#0F172A]">• 비밀번호:</label>
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
              <label className="block text-[#0F172A]">• 비밀번호 확인:</label>
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

          {/* 이름 / 닉네임 & 전화번호 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#0F172A]">• 성명 / 닉네임:</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="예: 홍길동 (또는 닉네임)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[#0F172A]">• 휴대전화 번호:</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
                  required
                />
              </div>
            </div>
          </div>

          {/* 소속 학교 / 기관명 (선택) */}
          <div className="space-y-1">
            <label className="block text-[#0F172A]">• 소속 학교 또는 청소년 기관 (선택):</label>
            <div className="relative">
              <School size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="예: 서울청소년센터, 한국고등학교 등"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
              />
            </div>
          </div>

          {/* 이용약관 및 개인정보 동의 */}
          <div className="p-4 bg-slate-50 rounded-[16px] border border-[#CBD5E1] space-y-3 pt-3">
            
            {/* 🌟 개인정보 수집 및 활용 세부 지침 요약 박스 */}
            <div className="p-3.5 bg-white rounded-[12px] border border-slate-300 space-y-2 text-[11px] font-bold text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <span className="font-black text-[#1558C9] text-xs">📜 개인정보 수집 및 활용 세부 지침 요약</span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#1558C9] hover:underline font-black text-[11px] underline flex items-center gap-0.5"
                >
                  [전문 보기]
                </button>
              </div>
              <ul className="space-y-1 list-disc pl-3.5 text-slate-600 leading-relaxed">
                <li><strong className="text-slate-800">1. 수집·이용 목적:</strong> 한국청소년활동진흥원(KYWA) 안전문화 확산 사업참여 확인, 미션 및 공모전 심사·시상, 안전 서포터즈 증빙</li>
                <li><strong className="text-slate-800">2. 수집 항목:</strong> [필수] 이메일, 비밀번호, 성명/닉네임, 휴대전화번호 / [선택] 소속 학교·기관명</li>
                <li><strong className="text-slate-800">3. 보유 및 이용 기간:</strong> 사업 완료 및 최종 보고 종료 시까지 (탈퇴 요청 시 즉시 파기)</li>
                <li><strong className="text-slate-800">4. 동의 거부 권리:</strong> 동의를 거부할 권리가 있으나, 미동의 시 미션 참여 및 공모전 출품이 제한됩니다.</li>
              </ul>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded text-[#1558C9] focus:ring-[#1558C9]"
              />
              <span className="text-xs font-black text-[#0F172A]">
                [필수] 청소년 안전문화 확산 사업 서비스 이용약관 동의
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 rounded text-[#1558C9] focus:ring-[#1558C9]"
              />
              <span className="text-xs font-black text-[#0F172A]">
                [필수] 위 개인정보 수집 및 활용 세부 지침에 동의합니다.
              </span>
            </label>
          </div>

          {/* 회원가입 제출 버튼 */}
          <button
            type="submit"
            className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target"
          >
            <UserPlus size={18} />
            <span>[ 🚀 일반 회원 가입 완료하기 ]</span>
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="pt-2 text-center text-xs font-black text-slate-500 border-t border-slate-200">
          이미 회원가입 하셨나요?{" "}
          <Link href="/auth/login" className="text-[#1558C9] hover:underline font-black">
            로그인 하러 가기
          </Link>
        </div>

      </div>

      {/* 🌟 개인정보 수집 및 활용 세부 지침 전문 모달 팝업 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-2xl w-full bg-white space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto border border-[#CBD5E1] text-[#0F172A] animate-in zoom-in-95 rounded-[20px]">
            
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white bg-[#1558C9] px-3 py-1 rounded-md">
                  KYWA 2026
                </span>
                <h3 className="text-base font-black text-[#0F172A]">📜 개인정보 수집 및 활용 세부 지침 전문</h3>
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
              
              <section className="space-y-1">
                <h4 className="font-black text-[#1558C9] text-sm">• 제1조 (수집 및 이용 목적)</h4>
                <p className="text-slate-600">
                  한국청소년활동진흥원(KYWA)은 『2026년 청소년활동 안전문화 확산 국민 참여형 사업』 운영을 위해 아래의 목적으로 최소한의 개인정보를 수집·이용합니다.
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  <li>청소년 안전 서포터즈 본인 확인 및 서비스 이용자 식별</li>
                  <li>안전 퀴즈, 통학로 위험구역 모니터링 등 미션 수행 실적 기록 및 리워드 지급</li>
                  <li>국민 참여형 안전 공모전 참가 신청 접수, 심사, 결과 발표 및 시상 관리</li>
                  <li>청소년 활동 안전 관련 주요 공지사항 및 안내 발송</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-black text-[#1558C9] text-sm">• 제2조 (수집하는 개인정보 항목)</h4>
                <p className="text-slate-600">진흥원이 수집하는 개인정보 항목은 다음과 같습니다.</p>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  <li><strong>[필수 수집 항목]:</strong> 이메일 주소(아이디), 비밀번호, 성명/닉네임, 휴대전화 번호</li>
                  <li><strong>[선택 수집 항목]:</strong> 소속 학교명, 소속 청소년 수련기관/단체명</li>
                  <li><strong>[자동 생성 수집 정보]:</strong> 서비스 이용 기록, 접속 로그, 쿠키, IP 주소</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-black text-[#1558C9] text-sm">• 제3조 (개인정보 보유 및 이용 기간)</h4>
                <p className="text-slate-600">
                  수집된 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되거나 사업 최종 성과보고가 완료된 시점까지 보유 및 이용되며, 목적 달성 후 지체 없이 안전하게 파기됩니다.
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                  <li>회원 탈퇴 요청 시: 즉시 파기 처리</li>
                  <li>사업 운영 종료 및 정산 완료 시: 3년 보관 후 파기 (관련 법령에 따름)</li>
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-black text-[#1558C9] text-sm">• 제4조 (동의를 거부할 권리 및 미동의 시 불이익)</h4>
                <p className="text-slate-600">
                  정보주체는 개인정보 수집 및 활용에 대한 동의를 거부할 권리가 있습니다. 단, 필수 항목에 대한 동의를 거부하시는 경우 청소년 안전 서포터즈 활동 참여, 미션 수행 및 공모전 출품·시상이 제한될 수 있습니다.
                </p>
              </section>

            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAgreePrivacy(true);
                  setShowPrivacyModal(false);
                }}
                className="krds-public-button px-6 py-3 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[12px] shadow-md"
              >
                [ 세부 지침 확인 및 동의하기 ]
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-3 bg-slate-200 text-slate-700 font-black text-xs rounded-[12px]"
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
