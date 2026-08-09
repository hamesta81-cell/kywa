"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Upload, FileText, ShieldCheck, Save, Send, AlertTriangle, RefreshCw, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ContestSubmitPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1~5 단계 스테퍼
  const [lastSavedTime, setLastSavedTime] = useState<string | null>("방금 전 자동 임시저장됨");

  // 1단계: 참가자 정보
  const [participantType, setParticipantType] = useState<"individual" | "team">("team");
  const [representativeName, setRepresentativeName] = useState("이민지");
  const [teamName, setTeamName] = useState("스마트안전팀");
  const [email, setEmail] = useState("minji@kywa.or.kr");
  const [phone, setPhone] = useState("010-1234-5678");
  const [organization, setOrganization] = useState("서울청소년고등학교");
  const [qualificationCheck, setQualificationCheck] = useState(true);

  // 2단계: 작품 정보
  const [workTitle, setWorkTitle] = useState("우리가 만드는 안전한 통학로");
  const [safetyField, setSafetyField] = useState("디지털안전");
  const [workFormat, setWorkFormat] = useState("숏폼");
  const [shortIntro, setShortIntro] = useState("스마트폰을 보며 걸어갈 때 스몸비 위험을 시각화한 60초 숏폼 영상");
  const [creationIntention, setCreationIntention] = useState("등하굣길 청소년들이 휴대폰 대신 앞을 바라보는 습관을 들이도록 제작했습니다.");
  const [usageMethod, setUsageMethod] = useState("학교 실과 및 안전 교육 시간 영상 교재로 활용");

  // 3단계: 파일 업로드 및 진행률
  const [thumbProgress, setThumbProgress] = useState(100);
  const [sourceProgress, setSourceProgress] = useState(100);
  const [subProgress, setSubProgress] = useState(100);
  const [isUploading, setIsUploading] = useState(false);

  // 4단계: 근거·권리 확인
  const [officialReference, setOfficialReference] = useState("행정안전부 '어린이·청소년 통학로 안전 통계 (2025)'");
  const [aiUsageScope, setAiUsageScope] = useState("배경 음악 합성 및 자막 폰트 생성 시 AI 보조 도구 약 15% 활용");
  const [promptOpenScope, setPromptOpenScope] = useState("전체 공개");
  const [copyrightCheck, setCopyrightCheck] = useState(true);
  const [portraitCheck, setPortraitCheck] = useState(true);
  const [privacyCheck, setPrivacyCheck] = useState(true);
  const [aiFactCheck, setAiFactCheck] = useState(true);

  // 자동 임시저장 타이머 시뮬레이션
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLastSavedTime(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} 자동 임시저장 완료`);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleTempSave = () => {
    const now = new Date();
    setLastSavedTime(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} 수동 임시저장 완수`);
    alert("💾 모든 폼 입력 데이터가 안전하게 임시저장되었습니다.");
  };

  const handleFinalSubmit = () => {
    alert("🎉 2026 청소년 안전 콘텐츠 공모전 최종 접수가 정상적으로 완료되었습니다!\n접수 번호: KYWA-2026-CONTEST-0841");
    window.location.href = "/contest";
  };

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#172033] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-8">
      
      {/* 상단 헤더 & 임시저장 상태 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="space-y-1">
          <Link href="/contest" className="inline-flex items-center gap-1 text-[#5D6B7E] hover:text-[#1558C9] font-bold text-xs">
            <ChevronLeft size={16} /> 공모전 메인으로 돌아가기
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">🏆 작품 접수 (5단계 스마트 폼)</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={13} /> {lastSavedTime}
          </span>
          <button
            onClick={handleTempSave}
            className="krds-public-button px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#102A43] font-bold text-xs rounded-[10px] flex items-center gap-1 transition-all touch-target"
          >
            <Save size={14} /> [임시저장]
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5단계 접수 프로그레스 바 (Steppers)                                   */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold tabular-nums">
        {[
          { step: 1, label: "1. 참가자 정보" },
          { step: 2, label: "2. 작품 정보" },
          { step: 3, label: "3. 파일 업로드" },
          { step: 4, label: "4. 근거·권리 확인" },
          { step: 5, label: "5. 최종 검토" }
        ].map(s => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`p-3 rounded-[14px] transition-all border ${
              currentStep === s.step
                ? "bg-[#1558C9] text-white border-[#1558C9] shadow-md font-black"
                : currentStep > s.step
                ? "bg-blue-50 text-[#1558C9] border-blue-200 font-bold"
                : "bg-white text-[#5D6B7E] border-[#E2E8F0]"
            }`}
          >
            <span className="block text-[10px] text-slate-300">STEP {s.step}</span>
            <span className="truncate block mt-0.5">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* 폼 메인 영역                                                         */}
      {/* ==================================================================== */}
      <div className="krds-public-card p-6 sm:p-10 bg-white space-y-8 border border-[#E2E8F0] shadow-sm">
        
        {/* STEP 1: 참가자 정보 */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-[#102A43] border-b border-[#E2E8F0] pb-3">
              1단계: 참가자 정보
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold text-[#102A43]">
              
              {/* 개인·팀 구분 */}
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="block">• 개인 · 팀 구분:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="partType"
                      checked={participantType === "individual"}
                      onChange={() => setParticipantType("individual")}
                      className="accent-[#1558C9]"
                    />
                    <span>개인 참가</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="partType"
                      checked={participantType === "team"}
                      onChange={() => setParticipantType("team")}
                      className="accent-[#1558C9]"
                    />
                    <span>팀 참가 (2~5인)</span>
                  </label>
                </div>
              </div>

              {/* 대표자명 */}
              <div className="space-y-2">
                <label className="block">• 대표자명 (성명):</label>
                <input
                  type="text"
                  value={representativeName}
                  onChange={e => setRepresentativeName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 팀명 (팀 선택 시) */}
              {participantType === "team" && (
                <div className="space-y-2">
                  <label className="block">• 팀명:</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                  />
                </div>
              )}

              {/* 이메일 */}
              <div className="space-y-2">
                <label className="block">• 대표 이메일:</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 연락처 */}
              <div className="space-y-2">
                <label className="block">• 연락처 (휴대전화):</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 소속 */}
              <div className="space-y-2">
                <label className="block">• 소속 (학교/청소년 기관명):</label>
                <input
                  type="text"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 참가 자격 확인 동의 */}
              <div className="col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-4 rounded-[12px] border border-[#E2E8F0]">
                  <input
                    type="checkbox"
                    checked={qualificationCheck}
                    onChange={e => setQualificationCheck(e.target.checked)}
                    className="w-4 h-4 accent-[#1558C9]"
                  />
                  <span>☑️ 청소년(만 9세~24세) 또는 청소년 지도자/보호자 참가 자격 규정을 확인하였습니다.</span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: 작품 정보 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-[#102A43] border-b border-[#E2E8F0] pb-3">
              2단계: 작품 정보
            </h2>

            <div className="space-y-5 text-xs font-bold text-[#102A43]">
              
              {/* 작품명 */}
              <div className="space-y-2">
                <label className="block">• 작품명 (타이틀):</label>
                <input
                  type="text"
                  value={workTitle}
                  onChange={e => setWorkTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 안전 분야 & 작품 형식 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block">• 안전 분야:</label>
                  <select
                    value={safetyField}
                    onChange={e => setSafetyField(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                  >
                    <option value="생활안전">생활안전</option>
                    <option value="디지털안전">디지털안전</option>
                    <option value="재난안전">재난안전</option>
                    <option value="활동안전">활동안전</option>
                    <option value="마음안전">마음안전</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block">• 출품 작품 형식:</label>
                  <select
                    value={workFormat}
                    onChange={e => setWorkFormat(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                  >
                    <option value="숏폼">숏폼 (60초 이내 영상)</option>
                    <option value="이미지">이미지 (포스터/인포그래픽)</option>
                    <option value="카드뉴스">카드뉴스 (4컷 이상)</option>
                    <option value="앱·게임">앱·게임 (인터랙티브)</option>
                    <option value="기타">기타 웹/슬라이드</option>
                  </select>
                </div>
              </div>

              {/* 한 줄 소개 */}
              <div className="space-y-2">
                <label className="block">• 한 줄 소개 (핵심 요약):</label>
                <input
                  type="text"
                  value={shortIntro}
                  onChange={e => setShortIntro(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 제작 의도 */}
              <div className="space-y-2">
                <label className="block">• 제작 의도 (기획 배경):</label>
                <textarea
                  rows={3}
                  value={creationIntention}
                  onChange={e => setCreationIntention(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-medium focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* 활용 방법 */}
              <div className="space-y-2">
                <label className="block">• 교육 및 현장 활용 방법:</label>
                <textarea
                  rows={2}
                  value={usageMethod}
                  onChange={e => setUsageMethod(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-medium focus:outline-none focus:border-[#1558C9]"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: 파일 업로드 및 진행률 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-[#102A43] border-b border-[#E2E8F0] pb-3">
              3단계: 파일 업로드
            </h2>

            <div className="space-y-5 text-xs font-bold text-[#102A43] tabular-nums">
              
              {/* 대표 이미지 썸네일 */}
              <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-black text-[#102A43]">
                    <Upload size={14} className="text-[#1558C9]" /> 1) 대표 이미지 썸네일 (JPG/PNG, 최대 10MB)
                  </span>
                  <span className="text-xs text-[#159A83]">100% 완료</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-[#159A83] h-2 rounded-full w-full"></div>
                </div>
                <span className="text-[11px] text-slate-500 block">📁 `safety_school_thumb.jpg` (2.4 MB) - 업로드 정상 완료</span>
              </div>

              {/* 작품 원본 파일 */}
              <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-black text-[#102A43]">
                    <Upload size={14} className="text-[#7557D9]" /> 2) 작품 원본 파일 (MP4/ZIP/PDF, 최대 500MB)
                  </span>
                  <span className="text-xs text-[#159A83]">100% 완료</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-[#7557D9] h-2 rounded-full w-full"></div>
                </div>
                <span className="text-[11px] text-slate-500 block">📁 `school_safety_60s.mp4` (145.2 MB) - 업로드 정상 완료</span>
              </div>

              {/* 영상 자막 파일 (선택) */}
              <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-black text-[#102A43]">
                    <Upload size={14} className="text-slate-500" /> 3) 자막/부속 파일 (SRT/HWP, 선택)
                  </span>
                  <span className="text-xs text-[#1558C9]">100% 완료</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-[#1558C9] h-2 rounded-full w-full"></div>
                </div>
                <span className="text-[11px] text-slate-500 block">📁 `script_subtitles.srt` (45 KB) - 업로드 완료</span>
              </div>

              {/* 재시도 및 실시간 고지 */}
              <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-[12px] border border-blue-200 text-blue-900">
                <span className="text-[11px]">⚡ 네트워크 끊김 시 실패 재시도 버튼을 통해 이어서 업로드됩니다.</span>
                <button
                  onClick={() => alert("🟢 모든 파일 업로드 상태가 양호합니다.")}
                  className="px-3 py-1 bg-white hover:bg-blue-100 text-[#1558C9] rounded-md border border-blue-200 text-[11px]"
                >
                  상태 점검
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: 근거·권리 확인 */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-[#102A43] border-b border-[#E2E8F0] pb-3">
              4단계: 근거 · 권리 확인 (공공 및 AI 수칙)
            </h2>

            <div className="space-y-5 text-xs font-bold text-[#102A43]">
              
              {/* 참고 공식 자료 */}
              <div className="space-y-2">
                <label className="block">• 참고한 공식 공공 정보 자료:</label>
                <input
                  type="text"
                  value={officialReference}
                  onChange={e => setOfficialReference(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
                />
              </div>

              {/* AI 도구와 활용 범위 */}
              <div className="space-y-2">
                <label className="block">• AI 생성형 도구 및 사용 범위 명시:</label>
                <textarea
                  rows={2}
                  value={aiUsageScope}
                  onChange={e => setAiUsageScope(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-medium focus:outline-none focus:border-[#7557D9]"
                />
              </div>

              {/* 프롬프트 공개 범위 */}
              <div className="space-y-2">
                <label className="block">• 주요 생성 프롬프트 공개 범위:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="promptScope"
                      checked={promptOpenScope === "전체 공개"}
                      onChange={() => setPromptOpenScope("전체 공개")}
                      className="accent-[#1558C9]"
                    />
                    <span>전체 공개 (추천)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="promptScope"
                      checked={promptOpenScope === "심사위원 비공개 열람"}
                      onChange={() => setPromptOpenScope("심사위원 비공개 열람")}
                      className="accent-[#1558C9]"
                    />
                    <span>심사위원 전용 비공개</span>
                  </label>
                </div>
              </div>

              {/* 서약 체크박스 4종 */}
              <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3.5 rounded-[12px] border border-[#E2E8F0]">
                  <input type="checkbox" checked={copyrightCheck} onChange={e => setCopyrightCheck(e.target.checked)} className="w-4 h-4 accent-[#1558C9]" />
                  <span>☑️ [저작권] 본 출품작은 타인의 지적재산권을 침해하지 않은 순수 창작물임을 서약합니다.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3.5 rounded-[12px] border border-[#E2E8F0]">
                  <input type="checkbox" checked={portraitCheck} onChange={e => setPortraitCheck(e.target.checked)} className="w-4 h-4 accent-[#1558C9]" />
                  <span>☑️ [초상권] 영상/이미지에 등장하는 인물의 동의 및 초상권 사용 허가를 획득하였습니다.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3.5 rounded-[12px] border border-[#E2E8F0]">
                  <input type="checkbox" checked={privacyCheck} onChange={e => setPrivacyCheck(e.target.checked)} className="w-4 h-4 accent-[#1558C9]" />
                  <span>☑️ [개인정보] 주민등록번호, 연락처 등 불필요한 노출 개인정보가 포함되지 않았음을 확인합니다.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3.5 rounded-[12px] border border-[#E2E8F0]">
                  <input type="checkbox" checked={aiFactCheck} onChange={e => setAiFactCheck(e.target.checked)} className="w-4 h-4 accent-[#1558C9]" />
                  <span>☑️ [AI 팩트체크] AI 생성형 수칙 결과물의 오류를 공공 출처로 교로 검수하였습니다.</span>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* STEP 5: 최종 검토 */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-black text-[#102A43] border-b border-[#E2E8F0] pb-3">
              5단계: 최종 검토 & 약관 동의 요약
            </h2>

            <div className="space-y-4 text-xs font-medium text-[#5D6B7E]">
              
              {/* 제출 요약 정보 카드 */}
              <div className="krds-public-card p-6 bg-slate-900 text-white rounded-[16px] space-y-3 shadow-md border border-white/10 tabular-nums">
                <h3 className="text-base font-black text-cyan-300">📋 공모전 최종 접수 정보 요약</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>• 대표자 / 팀명: <strong className="text-white">{representativeName} ({teamName})</strong></div>
                  <div>• 작품명: <strong className="text-white">{workTitle}</strong></div>
                  <div>• 분야 / 형식: <strong className="text-white">{safetyField} · {workFormat}</strong></div>
                  <div>• 연락처 / 소속: <strong className="text-white">{phone} ({organization})</strong></div>
                </div>
              </div>

              {/* 4대 최종 안내 (수정 가능 기간, 심사 공개 범위, 삭제 방법, 동의 요약) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="font-black text-[#102A43] block">• 제출 후 수정 가능 기간:</span>
                  <p>2026.07.15 접수 마감일 23:59까지 마이페이지에서 수정 가능</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="font-black text-[#102A43] block">• 심사 공개 범위:</span>
                  <p>국민 심사 기간(7/16~) 동안 투표 수 블라인드로 갤러리에 노출</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-1">
                  <span className="font-black text-[#102A43] block">• 철회 및 삭제 요청 방법:</span>
                  <p>KYWA 운영진 1:1 고객센터 요청 시 24시간 이내 즉시 철회 가능</p>
                </div>

                <div className="p-4 bg-[#102A43] text-white rounded-[14px] space-y-1">
                  <span className="font-black text-[#F4B740] block">• 필수 동의 내용 요약:</span>
                  <p className="text-slate-300">참가자 자격, 공공 안전정보 팩트체크 및 저작권 서약 최종 동의완료</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 하단 스텝 이동 & 액션 버튼                                           */}
        {/* ==================================================================== */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0]">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="krds-public-button px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#102A43] font-bold text-xs rounded-[14px] flex items-center gap-1 touch-target"
            >
              <ChevronLeft size={16} /> 이전 단계
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleTempSave}
              className="krds-public-button px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#102A43] font-bold text-xs rounded-[14px] touch-target"
            >
              [임시저장]
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="krds-public-button px-7 py-3 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[14px] flex items-center gap-1 shadow-md touch-target"
              >
                <span>다음 단계</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="krds-public-button px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-[14px] flex items-center gap-1.5 shadow-lg touch-target"
              >
                <Send size={16} />
                <span>[최종 제출하기]</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
