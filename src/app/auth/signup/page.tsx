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
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  
  // 약관 동의 & 세부 지침 모달 state
  const [agreeAge, setAgreeAge] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeAge) {
      alert("⚠️ 본 플랫폼은 만 14세 이상만 가입이 가능합니다.\n[만 14세 이상입니다] 항목에 체크해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("⚠️ 이용약관 및 개인정보 수집 동의에 모두 체크해 주세요.");
      return;
    }

    const displayNickname = nickname.trim() || "청소년 서포터즈";
    const newUser = {
      id: Date.now(),
      nickname: displayNickname,
      name: displayNickname, // 하위 호환성 유지
      email: email,
      phone: phone || "010-0000-0000",
      organization: organization.trim() || "소속 없음",
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

    alert(`🎉 [${displayNickname}] 님, 청소년 안전 서포터즈 회원가입이 완료되었습니다!\n관리자 가입자 목록에 즉시 등록되었습니다.`);
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

          {/* 닉네임 & 휴대전화 번호 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[#0F172A] flex items-center justify-between">
                <span>• 닉네임 (활동명):</span>
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
                ※ 개인정보 최소수집 원칙에 따라 실명 대신 닉네임을 수집합니다.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[#0F172A] flex items-center justify-between">
                <span>• 휴대전화 번호:</span>
                <span className="text-blue-600 font-black text-[11px]">[필수]</span>
              </label>
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
              <p className="text-[10px] text-blue-600 font-bold pl-1">
                ※ 디지털 쿠폰 등 보상 수령 및 활동 안내 목적
              </p>
            </div>
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
                placeholder="예: 서울청소년센터, 한국고등학교 등 (미입력 가능)"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium pl-1">
              ※ 소속 정보는 선택사항이며, 입력하지 않아도 서비스 이용에 아무런 제한이 없습니다.
            </p>
          </div>

          {/* 이용약관 및 개인정보 동의 */}
          <div className="p-4 bg-slate-50 rounded-[16px] border border-[#CBD5E1] space-y-3 pt-3">
            
            {/* 🌟 개인정보 수집 및 이용 동의 요약 박스 */}
            <div className="p-3.5 bg-white rounded-[12px] border border-slate-300 space-y-2 text-[11px] font-bold text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                <span className="font-black text-[#1558C9] text-xs">🔐 개인정보 수집·이용 동의 요약</span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#1558C9] hover:underline font-black text-[11px] underline flex items-center gap-0.5"
                >
                  [전문 보기]
                </button>
              </div>
              <ul className="space-y-1 list-disc pl-3.5 text-slate-600 leading-relaxed">
                <li><strong className="text-slate-800">1. 수집·이용 목적:</strong> 회원 식별·관리, 캠페인·미션·공모전 참여 및 심사·시상 운영, 활동 안내, <strong>디지털 쿠폰 및 기념품 등 참여 보상 제공 및 배송·수령 확인</strong></li>
                <li><strong className="text-slate-800">2. 수집 항목:</strong> [필수] 닉네임, 휴대폰번호 / [선택] 소속(학교·청소년기관 등)</li>
                <li><strong className="text-slate-800">3. 보유 및 이용 기간:</strong> <strong>수집·이용 목적 달성 시까지 (목적 달성 후 지체 없이 파기)</strong></li>
                <li><strong className="text-slate-800">4. 동의 거부 권리:</strong> 필수항목 동의 거부 시 회원가입 및 보상 제공이 제한될 수 있습니다. (선택항목 미동의 시에도 기본 이용 제한 없음)</li>
              </ul>
              <div className="text-[10px] text-blue-700 bg-blue-50/70 p-2 rounded border border-blue-200 font-bold space-y-0.5">
                <p>※ 휴대폰번호는 회원 식별 및 활동 안내, 디지털 쿠폰·기념품 등 참여 보상 제공을 위한 목적으로 이용됩니다.</p>
                <p className="text-amber-800">※ 본 플랫폼은 개인정보 보호법 제22조의2에 따라 <strong>만 14세 이상</strong> 이용자를 대상으로 운영됩니다.</p>
              </div>
            </div>

            {/* 🌟 만 14세 이상 필수 확인 체크박스 */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1 p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                checked={agreeAge}
                onChange={e => setAgreeAge(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-[#1558C9] focus:ring-[#1558C9]"
                required
              />
              <div className="text-xs">
                <span className="font-black text-[#1558C9] block">
                  [필수] 만 14세 이상입니다.
                </span>
                <span className="text-[11px] text-slate-600 font-medium leading-tight block mt-0.5">
                  개인정보 보호법 제22조의2(14세 미만 아동의 개인정보 처리)에 따라 만 14세 이상 청소년 및 국민만 회원가입이 가능합니다. (만 14세 미만은 법정대리인 동의가 수반되는 단체·보호자 계정 또는 공모전 대리접수를 이용해 주세요.)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
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

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 rounded text-[#1558C9] focus:ring-[#1558C9]"
                required
              />
              <span className="text-xs font-black text-[#0F172A]">
                [필수] 위 개인정보 수집·이용 동의 사항에 동의합니다.
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

      {/* 🌟 개인정보 수집·이용 동의 전문 모달 팝업 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-2xl w-full bg-white space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto border border-[#CBD5E1] text-[#0F172A] animate-in zoom-in-95 rounded-[20px]">
            
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white bg-[#1558C9] px-3 py-1 rounded-md">
                  KYWA 2026
                </span>
                <h3 className="text-base font-black text-[#0F172A]">🔐 개인정보 수집·이용 동의서 (전문)</h3>
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
              
              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 1. 개인정보 수집·이용 목적</h4>
                <p className="text-slate-600">
                  KYWA PLAY SAFE 2026 청소년 안전문화 확산 사업의 원활한 운영을 위하여 다음의 목적으로 개인정보를 수집·이용합니다.
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>회원 식별 및 서비스 이용 관리</li>
                  <li>캠페인·미션·공모전 등 참여 확인 및 운영</li>
                  <li>활동 결과 확인 및 심사·선정·시상 등 운영</li>
                  <li>활동 관련 안내 및 공지사항 전달</li>
                  <li><strong>디지털 쿠폰 및 기념품 등 참여 보상 제공 및 배송·수령 확인</strong></li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 2. 수집하는 개인정보 항목</h4>
                <div className="overflow-x-auto my-2">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-800">
                        <th className="border border-slate-300 p-2 w-24 text-center">구분</th>
                        <th className="border border-slate-300 p-2 text-left">수집 항목</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center font-black text-blue-700 bg-blue-50/50">필수</td>
                        <td className="border border-slate-300 p-2 font-black">닉네임, 휴대폰번호</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center text-slate-600">선택</td>
                        <td className="border border-slate-300 p-2">소속(학교·청소년기관 등)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-blue-700 font-bold bg-blue-50 p-2.5 rounded border border-blue-200 space-y-1">
                  <span className="block">※ 휴대폰번호는 회원 식별 및 활동 안내, 디지털 쿠폰·기념품 등 참여 보상 제공을 위한 목적으로 이용됩니다.</span>
                  <span className="block text-amber-900 font-black">※ 본 플랫폼은 개인정보 보호법 제22조의2(14세 미만 아동의 개인정보 처리)에 따라 만 14세 이상 이용자를 대상으로 운영되며, 만 14세 미만 아동의 개인정보는 수집하지 않습니다.</span>
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 3. 개인정보 보유 및 이용기간</h4>
                <p className="text-slate-600">
                  수집된 개인정보는 <strong>개인정보 수집·이용 목적이 달성될 때까지</strong> 보유·이용하며, 목적이 달성된 후에는 지체 없이 파기합니다.
                </p>
                <p className="text-slate-600">
                  다만, 사업 운영 및 결과보고 등에 필요한 자료 중 관계 법령에 따라 별도의 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보관할 수 있습니다.
                </p>
                <p className="text-slate-600">
                  회원이 탈퇴를 요청하거나 개인정보 수집·이용에 대한 동의를 철회하는 경우에는 보유가 필요한 법령상 근거가 있는 경우를 제외하고 지체 없이 파기합니다.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 4. 동의 거부 권리 및 동의 거부에 따른 불이익</h4>
                <p className="text-slate-600">
                  이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
                </p>
                <p className="text-slate-600">
                  다만, 필수항목에 대한 동의를 거부하는 경우 회원가입 및 캠페인·미션 등 일부 서비스 이용이 제한될 수 있습니다.
                </p>
                <p className="text-slate-600">
                  선택항목에 대한 동의를 거부하더라도 기본적인 회원가입 및 서비스 이용에는 제한이 없습니다.
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
                [ 개인정보 수집·이용 동의하기 ]
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
