"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Activity, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, Trophy, ChevronLeft, Zap, AlertTriangle, Play, Pause, Info, UserCheck, Flame, Radio } from "lucide-react";
import Link from "next/link";

export default function CprBasicsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Checked, setStep1Checked] = useState(false);
  const [step2Designated, setStep2Designated] = useState(false);
  
  // STEP 3: 가슴 압박 30회 인터랙티브 카운터
  const [pressCount, setPressCount] = useState(0);
  const [bpm, setBpm] = useState(110);
  const [isBeating, setIsBeating] = useState(false);
  const [pressFeedback, setPressFeedback] = useState<string | null>(null);
  const lastPressTime = useRef<number>(0);

  // STEP 4: AED 패드 부착
  const [pad1Placed, setPad1Placed] = useState(false); // 오른쪽 빗장뼈 아래
  const [pad2Placed, setPad2Placed] = useState(false); // 왼쪽 젖꼭지 아래 겨드랑이선

  const [isFinished, setIsFinished] = useState(false);

  // 심장 박동 메트로놈 효과 (분당 110회 템포)
  useEffect(() => {
    if (currentStep !== 3) return;
    const interval = setInterval(() => {
      setIsBeating(prev => !prev);
    }, (60 / 110) * 500);
    return () => clearInterval(interval);
  }, [currentStep]);

  const handleChestPress = () => {
    const now = Date.now();
    if (lastPressTime.current > 0) {
      const diff = now - lastPressTime.current;
      const currentBpm = Math.round(60000 / diff);
      if (currentBpm >= 95 && currentBpm <= 130) {
        setPressFeedback("PERFECT! 완벽한 템포 (분당 100~120회 유지)");
      } else if (currentBpm < 95) {
        setPressFeedback("조금 더 빠르게 압박하세요! (분당 100회 이상)");
      } else {
        setPressFeedback("너무 빠릅니다! 침착하게 5~6cm 깊이로!");
      }
    } else {
      setPressFeedback("좋습니다! 가슴 중앙을 강하고 빠르게!");
    }
    lastPressTime.current = now;

    setPressCount(prev => {
      const next = prev + 1;
      if (next >= 30) {
        setTimeout(() => {
          setCurrentStep(4);
        }, 500);
      }
      return next;
    });
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setStep1Checked(false);
    setStep2Designated(false);
    setPressCount(0);
    lastPressTime.current = 0;
    setPad1Placed(false);
    setPad2Placed(false);
    setIsFinished(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF7F7] pt-28 pb-20 px-4 max-w-[1000px] mx-auto font-sans space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-rose-600 font-black text-xs transition-colors"
        >
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            MISSION 03 • NORMAL
          </span>
          <span className="text-xs font-black text-[#059669] flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="fill-[#059669]" /> +80 XP
          </span>
        </div>
      </div>

      {/* 미션 헤더 */}
      <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-rose-600 uppercase tracking-wider">
          <Heart size={16} className="fill-rose-500 text-rose-500 animate-pulse" />
          <span>골든타임 4분 생명 소생 시뮬레이터</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ❤️ 심폐소생술 4분의 기적 (CPR & AED)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              의식 확인 ➔ 119 지목 신고 ➔ 가슴 압박 30회 ➔ 자동심장충격기(AED) 패드 부착을 실전 체험하세요.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-rose-50/60 px-5 py-3 rounded-2xl border border-rose-200 self-start sm:self-auto">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">구조 단계</div>
              <div className="text-base font-black text-slate-800">
                {currentStep} / 4 단계
              </div>
            </div>
            <div className="w-[1px] h-8 bg-rose-200" />
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">골든타임</div>
              <div className="text-base font-black text-rose-600">4분 이내</div>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* 단계 인디케이터 */}
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-5">
            {[
              { num: 1, label: "1.의식확인" },
              { num: 2, label: "2.119지목" },
              { num: 3, label: "3.가슴압박" },
              { num: 4, label: "4.AED적용" }
            ].map((s) => (
              <div
                key={s.num}
                className={`text-center py-2 rounded-xl text-xs font-black transition-all ${
                  currentStep === s.num
                    ? "bg-rose-600 text-white shadow-sm"
                    : currentStep > s.num
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>

          {/* STEP 1: 의식 및 호흡 확인 */}
          {currentStep === 1 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2 text-center max-w-lg mx-auto">
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  STEP 1 • 환자 상태 파악
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  길에 쓰러진 사람을 발견했습니다! 가장 먼저 할 일은?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  환자의 양쪽 어깨를 가볍게 두드리며 큰 소리로 의식을 확인하고, 숨을 쉬는지 10초 이내로 관찰합니다.
                </p>
              </div>

              <div className="flex justify-center py-4">
                <button
                  onClick={() => setStep1Checked(true)}
                  className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center gap-3 transition-all shadow-md active:scale-95 ${
                    step1Checked
                      ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                      : "bg-rose-50 hover:bg-rose-100 border-rose-300 hover:border-rose-500 text-rose-900 animate-pulse"
                  }`}
                >
                  <UserCheck size={40} className={step1Checked ? "text-emerald-600" : "text-rose-600"} />
                  <span className="font-black text-sm text-center px-4">
                    {step1Checked ? "✓ 의식·호흡 없음 확인!" : "환자 어깨를 두드리며\n\"괜찮으세요?\" 확인"}
                  </span>
                </button>
              </div>

              {step1Checked && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium">
                    💡 <strong>정상:</strong> 환자가 무반응이고 비정상적인 호흡(헐떡임 등)을 보입니다. 즉시 다음 단계(119 및 AED 지목)로 넘어가야 합니다!
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-4 bg-slate-900 hover:bg-rose-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>다음 단계 (도움 요청하기)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: 119 신고 및 AED 특정 지목 */}
          {currentStep === 2 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2 text-center max-w-lg mx-auto">
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  STEP 2 • 특정인 지목 도움 요청
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  주변 사람들에게 어떻게 신고를 요청해야 할까요?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  "누가 119 좀 불러주세요!"는 방관자 효과를 부릅니다. <strong>옷차림이나 인상착의를 명확히 짚어</strong> 119 신고와 AED를 지정해야 합니다!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
                <button
                  onClick={() => setStep2Designated(true)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 shadow-sm ${
                    step2Designated
                      ? "bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300"
                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-rose-400 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-700">
                    <CheckCircle2 size={16} />
                    <span>올바른 지목 방법 (클릭)</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    "빨간색 티셔츠 입으신 분은 <strong>119에 즉시 신고</strong>해 주시고, 안경 쓴 파란 모자 분은 <strong>자동심장충격기(AED)</strong>를 가져다주세요!"
                  </p>
                </button>

                <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 opacity-60 text-slate-500 space-y-2">
                  <div className="font-black text-xs text-rose-500">❌ 잘못된 요청 예시</div>
                  <p className="text-xs leading-relaxed">
                    "여기 사람 쓰러졌어요! 아무나 119에 전화 좀 해주시고 기계 좀 찾아와 주세요!" ➔ <em>(서로 미루다 골든타임 소진)</em>
                  </p>
                </div>
              </div>

              {step2Designated && (
                <div className="space-y-4 max-w-md mx-auto pt-2">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-4 bg-slate-900 hover:bg-rose-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>즉시 가슴 압박 실전 시작하기</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: 가슴 압박 30회 실전 (템포 인터랙션) */}
          {currentStep === 3 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2 text-center max-w-lg mx-auto">
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  STEP 3 • 가슴 압박 30회 (분당 100~120회)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  가슴 중앙(흉골 아래 1/2)을 5cm 깊이로 강하고 빠르게!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  아래 심장 버튼을 메트로놈 템포에 맞춰 <strong>30회 연속 터치</strong>하세요!
                </p>
              </div>

              {/* 압박 게이지 */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-700">
                  <span>압박 횟수</span>
                  <span className="text-rose-600 text-base">{pressCount} / 30회</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-rose-600 transition-all duration-150"
                    style={{ width: `${(pressCount / 30) * 100}%` }}
                  />
                </div>
                {pressFeedback && (
                  <div className="text-center text-xs font-black text-[#0284C7] animate-pulse">
                    {pressFeedback}
                  </div>
                )}
              </div>

              {/* 인터랙티브 심장 압박 버튼 */}
              <div className="flex justify-center py-4">
                <button
                  onClick={handleChestPress}
                  className={`w-44 h-44 rounded-full flex flex-col items-center justify-center gap-2 border-4 transition-transform active:scale-90 shadow-2xl select-none touch-manipulation ${
                    isBeating
                      ? "bg-rose-600 border-rose-300 text-white scale-105"
                      : "bg-rose-500 border-rose-400 text-white scale-100"
                  }`}
                >
                  <Heart size={48} className="fill-white" />
                  <span className="text-base font-black tracking-wider">누르기!</span>
                  <span className="text-[10px] opacity-80">깍지 낀 손으로 수직 압박</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AED 패드 부착 */}
          {currentStep === 4 && (
            <div className="space-y-6 py-4">
              <div className="space-y-2 text-center max-w-lg mx-auto">
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  STEP 4 • 자동심장충격기 (AED) 패드 부착
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  도착한 AED 패드 2개를 올바른 위치에 부착하세요!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  전원을 켠 뒤 2개의 패드를 아래 알맞은 위치 버튼을 눌러 부착하세요.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
                <button
                  onClick={() => setPad1Placed(true)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 shadow-sm ${
                    pad1Placed
                      ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-700">패드 1 (클릭하여 부착)</span>
                    {pad1Placed && <CheckCircle2 size={18} className="text-emerald-600" />}
                  </div>
                  <h4 className="text-sm font-black">우측 쇄골(빗장뼈) 바로 아래</h4>
                  <p className="text-[11px] text-slate-500">환자의 오른쪽 쇄골뼈 바로 아래 가슴에 부착합니다.</p>
                </button>

                <button
                  onClick={() => setPad2Placed(true)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all space-y-2 shadow-sm ${
                    pad2Placed
                      ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-700">패드 2 (클릭하여 부착)</span>
                    {pad2Placed && <CheckCircle2 size={18} className="text-emerald-600" />}
                  </div>
                  <h4 className="text-sm font-black">좌측 젖꼭지 아래 겨드랑이선</h4>
                  <p className="text-[11px] text-slate-500">환자의 왼쪽 젖꼭지 아래 중간 겨드랑이선에 부착합니다.</p>
                </button>
              </div>

              {pad1Placed && pad2Placed && (
                <div className="space-y-4 max-w-md mx-auto pt-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-bold flex items-start gap-2">
                    <Radio size={16} className="text-amber-600 shrink-0 mt-0.5 animate-spin" />
                    <span>"심장 리듬 분석 중... 모두 물러나세요!" ➔ 제세동 쇼크 버튼 누른 후 즉시 가슴 압박 재개!</span>
                  </div>

                  <button
                    onClick={() => setIsFinished(true)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>생명 소생 미션 완료하기!</span>
                    <Trophy size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 최종 완료 화면 */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            ❤️
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
              MISSION COMPLETED!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              심폐소생술 실전 훈련 완수!
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              골든타임 4분 내 올바른 의식 확인과 30회 흉부 압박, AED 적용을 완벽하게 마쳤습니다.
            </p>
          </div>

          <div className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold">인증 등급</div>
              <div className="text-xl font-black text-slate-900">공식 라이프가디언</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">보상 획득</div>
              <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                <Zap size={20} className="fill-emerald-600" /> +80 XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> 다시 연습하기
            </button>
            <Link
              href="/campaign"
              className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Trophy size={14} /> 다른 퀵 미션 도전하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
