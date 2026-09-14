"use client";

import { useState } from "react";
import { Mail, Lock, User, School, UserPlus, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, HeartHandshake, FileText, Send, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  // 기본 회원 정보
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [organization, setOrganization] = useState("");

  // 🌟 연령 구분 (만 14세 이상 vs 만 14세 미만 어린이·초등학생)
  const [ageGroup, setAgeGroup] = useState<"OVER_14" | "UNDER_14">("OVER_14");

  // 🌟 만 14세 미만 아동 가입 시 필수 법정대리인(보호자) 정보
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("부모");
  const [guardianContact, setGuardianContact] = useState(""); // 휴대전화 또는 이메일
  const [consentMethod, setConsentMethod] = useState<"WEB_SMS_NOTICE" | "EMAIL_REPLY" | "WRITTEN_CALL">("WEB_SMS_NOTICE");
  const [agreeGuardian, setAgreeGuardian] = useState(false);

  // 약관 동의 & 세부 지침 모달 state
  const [agreeAgeOver14, setAgreeAgeOver14] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (password.length < 8) {
      alert("⚠️ 비밀번호는 안전을 위해 8자 이상 입력해 주세요.");
      return;
    }

    // 만 14세 미만 아동일 경우 법정대리인 동의 필수 검증
    if (ageGroup === "UNDER_14") {
      if (!guardianName.trim()) {
        alert("⚠️ 만 14세 미만 아동은 법정대리인(부모/보호자) 성명을 반드시 입력해야 합니다.");
        return;
      }
      if (!guardianContact.trim()) {
        alert("⚠️ 법정대리인 동의 확인을 위한 연락처(휴대전화 또는 이메일)를 입력해 주세요.");
        return;
      }
      if (!agreeGuardian) {
        alert("⚠️ 법정대리인(보호자) 동의 및 확인 절차에 동의해 주세요.");
        return;
      }
    } else {
      // 만 14세 이상일 경우 확인 체크
      if (!agreeAgeOver14) {
        alert("⚠️ [만 14세 이상 이용자 확인] 항목에 체크해 주세요.");
        return;
      }
    }

    if (!agreeTerms || !agreePrivacy) {
      alert("⚠️ 서비스 이용약관 및 개인정보 수집·이용 동의에 모두 체크해 주세요.");
      return;
    }

    const displayNickname = nickname.trim() || "청소년 서포터즈";
    const newUser = {
      id: Date.now(),
      nickname: displayNickname,
      name: displayNickname,
      email: email.trim(),
      organization: organization.trim() || "소속 없음",
      role: "YOUTH",
      roleLabel: ageGroup === "UNDER_14" ? "어린이 서포터즈 (법정대리인 동의)" : "청소년 서포터즈",
      ageGroup: ageGroup,
      guardian: ageGroup === "UNDER_14" ? {
        name: guardianName.trim(),
        relation: guardianRelation,
        contact: guardianContact.trim(),
        consentMethod: consentMethod,
        consentedAt: new Date().toISOString()
      } : null,
      status: "정상 승인",
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 로컬 스토리지 회원가입자 목록에 추가
    try {
      const existing = JSON.parse(localStorage.getItem("registeredUsersList") || "[]");
      localStorage.setItem("registeredUsersList", JSON.stringify([newUser, ...existing]));
      sessionStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("user", JSON.stringify(newUser));
      if (typeof window !== "undefined") window.dispatchEvent(new Event("kywa-user-login"));
    } catch (err) {
      console.error(err);
    }

    if (ageGroup === "UNDER_14") {
      alert(`🎉 [법정대리인 동의 접수 완료] 회원가입이 성공적으로 완료되었습니다!\n\n• 이용자: ${displayNickname}\n• 법정대리인: ${guardianName} (${guardianRelation})\n• 동의 확인 방식: ${
        consentMethod === "WEB_SMS_NOTICE" ? "웹 동의 후 보호자 알림 통지" : consentMethod === "EMAIL_REPLY" ? "보호자 이메일 확인" : "서면/유선 확인"
      }\n\n등록하신 보호자 연락처로 동의 사실 통지 및 확인 절차가 진행됩니다.`);
    } else {
      alert(`🎉 [회원가입 완료] ${displayNickname}님 환영합니다!\n로그인이 자동으로 유지됩니다.`);
    }

    router.push("/");
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

        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-[#0F172A] flex items-center gap-2 justify-center sm:justify-start">
            <UserPlus size={24} className="text-[#1558C9]" />
            일반 회원가입
          </h1>
          <p className="text-xs font-bold text-slate-600">
            청소년 안전문화 확산 활동, 미션 수행 및 캠페인 참여를 위한 회원가입 페이지입니다.
          </p>
        </div>

        {/* 16개 안전홍보단 오피스 별도 안내 */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
            <span>🛡️ 전국 16개 안전홍보단 팀원 안내</span>
          </div>
          <p className="text-[11px] font-bold text-amber-900 leading-relaxed pl-5">
            16개 정식 안전홍보단 팀 계정은 별도 가입 절차 없이 사전 발급된 지정 계정으로 로그인만 가능합니다.
            (<Link href="/auth/login" className="underline font-black text-[#1558C9]">홍보단 전용 로그인으로 이동</Link>)
          </p>
        </div>

        {/* 회원가입 입력 폼 */}
        <form onSubmit={handleSignUp} autoComplete="off" className="space-y-5 text-xs font-black text-[#0F172A]">
          
          {/* 🌟 1단계: 이용자 연령 선택 (만 14세 이상 vs 만 14세 미만) */}
          <div className="p-4 bg-slate-50 border-2 border-blue-200 rounded-2xl space-y-3">
            <label className="block text-slate-900 font-black text-sm flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-[#1558C9]" />
              연령 구분 선택 (필수)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                ageGroup === "OVER_14" ? "bg-white border-[#1558C9] shadow-sm ring-1 ring-[#1558C9]" : "bg-white/60 border-slate-300 hover:border-slate-400"
              }`}>
                <input
                  type="radio"
                  name="ageGroupSelect"
                  checked={ageGroup === "OVER_14"}
                  onChange={() => setAgeGroup("OVER_14")}
                  className="w-4 h-4 mt-0.5 text-[#1558C9] focus:ring-[#1558C9]"
                />
                <div>
                  <span className="font-black text-xs text-slate-900 block">만 14세 이상</span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    중·고등학생 및 일반 청소년·국민 (직접 가입)
                  </span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                ageGroup === "UNDER_14" ? "bg-white border-amber-600 shadow-sm ring-1 ring-amber-600" : "bg-white/60 border-slate-300 hover:border-slate-400"
              }`}>
                <input
                  type="radio"
                  name="ageGroupSelect"
                  checked={ageGroup === "UNDER_14"}
                  onChange={() => setAgeGroup("UNDER_14")}
                  className="w-4 h-4 mt-0.5 text-amber-600 focus:ring-amber-600"
                />
                <div>
                  <span className="font-black text-xs text-amber-900 block flex items-center gap-1">
                    만 14세 미만 (어린이)
                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px]">보호자 동의</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    초등학생 등 아동 (법정대리인 동의 필수)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 🌟 만 14세 미만일 경우 나타나는 법정대리인 동의 확인 입력창 */}
          {ageGroup === "UNDER_14" && (
            <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
                <HeartHandshake size={18} className="text-amber-700" />
                <h3 className="font-black text-xs text-amber-950">
                  👨‍👩‍👧 만 14세 미만 아동의 법정대리인(보호자) 동의 및 확인
                </h3>
              </div>
              <p className="text-[11px] font-medium text-amber-900 leading-relaxed">
                개인정보 보호법 제22조의2에 따라 <strong>만 14세 미만 아동</strong>의 개인정보 수집 시에는 법정대리인의 동의가 필수입니다.
                아래 보호자 정보를 입력해 주시면 확인 절차가 진행됩니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-amber-950 font-bold block">• 법정대리인(보호자) 성명 *</label>
                  <input
                    type="text"
                    placeholder="예: 홍길동 (보호자 실명)"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                    required={ageGroup === "UNDER_14"}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-amber-950 font-bold block">• 아동과의 관계 *</label>
                  <select
                    value={guardianRelation}
                    onChange={e => setGuardianRelation(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  >
                    <option value="부모">부모 (부 또는 모)</option>
                    <option value="조부모">조부모</option>
                    <option value="후견인/기타">기타 법정대리인 (후견인 등)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-amber-950 font-bold block">
                  • 법정대리인 연락처 (휴대전화번호 또는 이메일) *
                </label>
                <input
                  type="text"
                  placeholder="예: 010-1234-5678 또는 parent@naver.com"
                  value={guardianContact}
                  onChange={e => setGuardianContact(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  required={ageGroup === "UNDER_14"}
                />
              </div>

              {/* 법정대리인 동의 확인 방식 */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] text-amber-950 font-bold block">
                  • 법정대리인 동의 확인 방식 선택:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`flex items-center gap-1.5 p-2 rounded-lg border text-[11px] cursor-pointer ${
                    consentMethod === "WEB_SMS_NOTICE" ? "bg-amber-100 border-amber-500 font-black" : "bg-white border-amber-200"
                  }`}>
                    <input
                      type="radio"
                      name="consentMethodRadio"
                      checked={consentMethod === "WEB_SMS_NOTICE"}
                      onChange={() => setConsentMethod("WEB_SMS_NOTICE")}
                    />
                    <span>웹동의 후 통지</span>
                  </label>

                  <label className={`flex items-center gap-1.5 p-2 rounded-lg border text-[11px] cursor-pointer ${
                    consentMethod === "EMAIL_REPLY" ? "bg-amber-100 border-amber-500 font-black" : "bg-white border-amber-200"
                  }`}>
                    <input
                      type="radio"
                      name="consentMethodRadio"
                      checked={consentMethod === "EMAIL_REPLY"}
                      onChange={() => setConsentMethod("EMAIL_REPLY")}
                    />
                    <span>보호자 이메일 확인</span>
                  </label>

                  <label className={`flex items-center gap-1.5 p-2 rounded-lg border text-[11px] cursor-pointer ${
                    consentMethod === "WRITTEN_CALL" ? "bg-amber-100 border-amber-500 font-black" : "bg-white border-amber-200"
                  }`}>
                    <input
                      type="radio"
                      name="consentMethodRadio"
                      checked={consentMethod === "WRITTEN_CALL"}
                      onChange={() => setConsentMethod("WRITTEN_CALL")}
                    />
                    <span>서면·유선 확인</span>
                  </label>
                </div>
              </div>

              {/* 법정대리인 동의 서약 체크 */}
              <label className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeGuardian}
                  onChange={e => setAgreeGuardian(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  required={ageGroup === "UNDER_14"}
                />
                <span className="text-[11px] font-black text-amber-950 leading-snug">
                  [필수] 본인은 만 14세 미만 아동의 법정대리인(보호자)으로서, 아동의 본 서비스 가입 및 개인정보 수집·이용에 정당하게 동의함을 확인합니다.
                </span>
              </label>
            </div>
          )}
          
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
              <span>• 닉네임 (플랫폼 활동명) *</span>
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
              ※ 개인정보 최소 수집 원칙에 따라 실명 대신 닉네임으로 가입 및 활동합니다.
            </p>
          </div>

          {/* 🎁 [개선 원칙] 경품 발송용 전화번호 사전 미수집 안내 배너 */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-blue-900 font-black text-[11px]">
              <AlertCircle size={14} className="text-[#1558C9]" />
              <span>🎁 경품·기프티콘 발송용 연락처 사전 미수집 안내</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              개인정보 과다 수집 방지를 위해 <strong>회원가입 시 휴대전화번호를 수집하지 않습니다.</strong> 이벤트·캠페인 미션 참여 보상(모바일 쿠폰 등)은 <strong>향후 당첨자 선정 시 별도 동의</strong>를 거쳐 수집되며, 발송 및 회계 정산 목적 달성 후 지체 없이 안전하게 파기됩니다.
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
                placeholder="예: 서울초등학교, 한국청소년센터 등 (미입력 가능)"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-[12px] text-xs font-black text-[#0F172A] focus:outline-none focus:border-[#1558C9]"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium pl-1">
              ※ 소속 정보는 선택사항이며, 입력하지 않아도 서비스 이용에 아무런 제한이 없습니다.
            </p>
          </div>

          {/* 이용약관 및 개인정보 동의 박스 */}
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
              <ul className="space-y-1 list-disc pl-3.5 text-slate-600 leading-relaxed text-[11px]">
                <li><strong className="text-slate-800">1. 수집·이용 목적:</strong> 회원 식별·관리, 청소년 안전문화 확산 미션 및 캠페인 참여 이력 관리, 만 14세 미만 아동의 법정대리인 동의 확인</li>
                <li><strong className="text-slate-800">2. 수집 항목:</strong>
                  <br />• [필수] 이메일(아이디), 비밀번호, 닉네임
                  <br />• [만 14세 미만 가입 시 필수] 법정대리인 성명, 관계, 보호자 연락처(휴대전화 또는 이메일), 동의 확인 정보
                  <br />• [선택] 소속(학교·기관명)
                  <br />• [서비스 이용 중 자동 생성] 접속 일시, 서비스 이용 및 미션 참여 기록
                </li>
                <li><strong className="text-slate-800">3. 보유 및 이용 기간:</strong> <strong>회원 탈퇴 시 또는 수집·이용 목적 달성 시까지 (목적 달성 후 지체 없이 영구 파기)</strong></li>
                <li><strong className="text-slate-800">4. 경품 수집 분리 원칙:</strong> 모바일 쿠폰 등 참여 보상 발송용 휴대전화번호는 당첨자 선정 시 별도 동의를 받아 수집하며, 발송 및 정산 완료 후 정해진 기간에 따라 파기합니다.</li>
                <li><strong className="text-slate-800">5. 동의 거부 권리:</strong> 필수항목 동의 거부 시 회원가입이 제한됩니다. (선택항목 미입력 시에도 서비스 이용에 아무런 제한이 없습니다.)</li>
              </ul>
            </div>

            {/* 만 14세 이상 확인 체크박스 (만 14세 이상 선택 시 표시) */}
            {ageGroup === "OVER_14" && (
              <label className="flex items-start gap-2.5 cursor-pointer pt-1 p-3 bg-blue-50/70 rounded-xl border border-blue-200">
                <input
                  type="checkbox"
                  checked={agreeAgeOver14}
                  onChange={e => setAgreeAgeOver14(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#1558C9] focus:ring-[#1558C9]"
                  required={ageGroup === "OVER_14"}
                />
                <div className="text-xs">
                  <span className="font-black text-[#1558C9] block">
                    [필수] 본인은 만 14세 이상 이용자입니다.
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium leading-tight block mt-0.5">
                    만 14세 미만 아동의 경우 상단 연령 구분에서 [만 14세 미만(어린이)]을 선택하여 법정대리인 동의 절차를 진행해 주세요.
                  </span>
                </div>
              </label>
            )}

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
            className="krds-public-button w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-sm rounded-[14px] shadow-lg flex items-center justify-center gap-2 touch-target transition-all"
          >
            <UserPlus size={18} />
            <span>
              {ageGroup === "UNDER_14" ? "[ 🚀 법정대리인 동의 및 회원가입 완료하기 ]" : "[ 🚀 일반 회원가입 완료하기 ]"}
            </span>
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
                  PLAY SAFE 2026
                </span>
                <h3 className="text-base font-black text-[#0F172A]">🔐 개인정보 처리방침 및 수집·이용 동의서 (전문)</h3>
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
                <h4 className="font-black text-[#1558C9] text-sm">• 1. 개인정보의 수집 및 이용 목적</h4>
                <p className="text-slate-600">
                  본 플랫폼은 「청소년 안전문화 확산 사업」의 건전한 운영을 위하여 다음의 목적 범위 내에서만 개인정보를 처리합니다.
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li>회원 가입 의사 확인, 회원 식별 및 계정 관리</li>
                  <li>청소년 및 어린이 대상 안전수칙 교육·미션 수행 기록 관리</li>
                  <li>캠페인 및 안전 챌린지 참여 확인 및 서비스 부정이용 방지</li>
                  <li><strong>만 14세 미만 아동의 법정대리인(보호자) 동의 의사 확인 및 동의 사실 통지</strong></li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 2. 수집하는 개인정보 항목 및 수집 방법</h4>
                <div className="overflow-x-auto my-2">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-800">
                        <th className="border border-slate-300 p-2 w-28 text-center">구분</th>
                        <th className="border border-slate-300 p-2 text-left">수집 항목</th>
                        <th className="border border-slate-300 p-2 text-left">수집 시점 / 목적</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center font-black text-blue-700 bg-blue-50/50">기본 필수</td>
                        <td className="border border-slate-300 p-2 font-black">이메일(아이디), 비밀번호, 닉네임</td>
                        <td className="border border-slate-300 p-2">회원가입 시 (식별 및 인증)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center font-black text-amber-700 bg-amber-50/50">14세 미만 필수</td>
                        <td className="border border-slate-300 p-2 font-black">법정대리인 성명, 관계, 보호자 연락처(휴대전화 또는 이메일), 동의확인 방식</td>
                        <td className="border border-slate-300 p-2">만 14세 미만 아동 가입 시 (법정대리인 동의 확인)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center text-slate-600">선택 항목</td>
                        <td className="border border-slate-300 p-2">소속(학교·청소년기관 등)</td>
                        <td className="border border-slate-300 p-2">통계 및 안전활동 증빙 (미입력 가능)</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center text-slate-600">자동 생성 항목</td>
                        <td className="border border-slate-300 p-2">접속 로그, 미션 수행 이력, 서비스 이용 기록</td>
                        <td className="border border-slate-300 p-2">서비스 이용 과정에서 시스템 자동 생성</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center font-black text-emerald-700 bg-emerald-50/50">경품 발송 정보</td>
                        <td className="border border-slate-300 p-2 font-black">휴대전화번호 (별도 수집)</td>
                        <td className="border border-slate-300 p-2"><strong>미션·이벤트 당첨자 선정 시 별도 동의 후 수집 (가입 시 사전 수집 금지)</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 3. 만 14세 미만 아동의 개인정보 처리 및 법정대리인 동의 확인 절차</h4>
                <p className="text-slate-600 leading-relaxed">
                  본 플랫폼은 개인정보 보호법 제22조의2에 따라 만 14세 미만 아동의 개인정보를 수집할 때에는 법정대리인의 동의를 받으며, 다음과 같은 법정 확인 절차를 준수합니다:
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li><strong>동의 방식:</strong> 웹사이트 상의 동의서 작성과 함께 보호자의 휴대전화 문자 통지, 이메일 회신, 서면 확인 또는 유선 통화 중 이용자가 선택한 방식을 통해 동의 의사를 명확히 확인합니다.</li>
                  <li><strong>최소 정보 수집:</strong> 법정대리인의 동의를 확보하기 위하여 필요한 최소한의 정보(성명, 관계, 연락처)만을 수집합니다.</li>
                </ul>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 4. 개인정보의 보유 및 이용 기간과 파기 원칙</h4>
                <p className="text-slate-600">
                  수집된 개인정보는 <strong>수집·이용 목적이 달성될 때까지</strong> 보유·이용하며, 목적 달성 시 지체 없이 복구 불가능한 방법으로 영구 파기합니다.
                </p>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  <li><strong>회원 계정 정보:</strong> 회원 탈퇴 요청 시 또는 사업 종료 시 즉시 파기</li>
                  <li><strong>경품 지급 정보(휴대전화번호):</strong> 모바일 쿠폰 발송 완료 및 회계 정산 목적 달성 후 정해진 법정 보존기간 경과 즉시 파기</li>
                  <li><strong>법정대리인 동의 기록:</strong> 아동의 회원 탈퇴 시까지 보관 후 즉시 파기</li>
                </ul>
              </section>

              <section className="space-y-1.5 p-3 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-black text-red-700 text-sm">• 5. 만 14세 미만 미승인 가입 확인 시 정식 대응 프로토콜 (4단계 SOP)</h4>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  만 14세 미만 아동이 법정대리인의 동의 없이 가입한 사실이 확인되거나 법정대리인의 철회 요청이 있는 경우, 본 플랫폼은 다음과 같은 엄격한 4단계 조치를 즉시 시행합니다:
                </p>
                <ol className="list-decimal pl-4 text-slate-700 space-y-1 text-[11px] font-bold">
                  <li><strong>[1단계] 서비스 이용 즉시 정지:</strong> 해당 계정의 로그인 및 모든 활동 권한을 즉시 차단합니다.</li>
                  <li><strong>[2단계] 추가 개인정보 처리 중단:</strong> 해당 계정과 관련된 추가적인 데이터 수집, 가공, 열람 행위를 일체 중단합니다.</li>
                  <li><strong>[3단계] 법정대리인 동의 확보 또는 영구 파기:</strong> 지정된 기간 내 법정대리인의 정식 동의가 확인되지 않을 경우, 등록된 개인정보 일체를 지체 없이 영구 파기합니다.</li>
                  <li><strong>[4단계] 수탁업체 보유자료 확인 및 삭제 조치:</strong> 이메일·메시지 발송 대행업체, 클라우드 스토리지 등 제3자 수탁업체에 보관된 백업 데이터까지 완전 파기되었음을 철저히 검증합니다.</li>
                </ol>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-black text-[#1558C9] text-sm">• 6. 이용자 및 법정대리인의 권리와 행사 방법</h4>
                <p className="text-slate-600">
                  이용자 및 만 14세 미만 아동의 법정대리인은 언제든지 등록되어 있는 본인 또는 당해 아동의 개인정보를 열람, 정정, 삭제, 처리정지 요구할 수 있으며, 운영사무국 고객센터를 통해 요청 시 지체 없이 조치합니다.
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
                [ 개인정보 처리방침 및 수집·이용 동의하기 ]
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
