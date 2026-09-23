"use client";

import { useState } from "react";
import { CloudRain, ShieldCheck, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, ChevronLeft, Zap, AlertTriangle, LifeBuoy, Waves, Car, Footprints, Info } from "lucide-react";
import Link from "next/link";

interface DisasterStep {
  id: number;
  stageName: string;
  situationTitle: string;
  situationDesc: string;
  visualTag: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  criticalRule: string;
}

export default function DisasterEvacuationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps: DisasterStep[] = [
    {
      id: 1,
      stageName: "STAGE 1 • 지하차도 진입 판단",
      situationTitle: "집중호우로 지하차도 입구에 물이 고이기 시작했습니다.",
      situationDesc: "앞서가던 차량들이 속도를 줄이고 있으며, 지하차도 진입로 노면에 찰랑거리는 빗물이 차오르고 있습니다.",
      visualTag: "🌊 침수 위험 감지",
      question: "이때 운전자의 가장 안전하고 올바른 판단은?",
      options: [
        {
          text: "앞차의 궤적을 따라 신속하게 가속하여 통과한다.",
          isCorrect: false,
          feedback: "지하차도는 순식간에 몇 분 만에 천장까지 물이 찰 수 있습니다. 앞차를 따라 진입하는 것은 치명적인 고립 사고를 부릅니다."
        },
        {
          text: "즉시 비상등을 켜고 진입을 포기하며 우회 도로로 돌아간다.",
          isCorrect: true,
          feedback: "정답입니다! 지하차도 바닥에 조금이라도 물이 고여 있다면 절대 진입하지 말고 즉시 비상등을 켜고 우회해야 합니다."
        },
        {
          text: "차를 지하차도 갓길에 세우고 물이 빠질 때까지 차 안에서 대기한다.",
          isCorrect: false,
          feedback: "지하차도 내 정차는 급격한 침수로 차량 침수 및 익사 위험을 극도로 높입니다."
        }
      ],
      criticalRule: "수위와 무관하게 지하차도 침수 조짐 발생 시 절대 진입 금지 및 즉시 우회!"
    },
    {
      id: 2,
      stageName: "STAGE 2 • 타이어 2/3 침수 시 탈출 타이밍",
      situationTitle: "도로 침수로 차량 바퀴의 2/3 높이까지 물이 차올랐습니다.",
      situationDesc: "배기구로 물이 유입되어 시동이 꺼졌으며, 외부 수위가 빠르게 상승하고 있습니다.",
      visualTag: "🚗 골든타임 판단",
      question: "이 상황에서 차량 문 개방 및 탈출 행동요령은?",
      options: [
        {
          text: "수압 차이로 문이 열리지 않으므로, 창문을 미리 내리고 즉시 차 밖으로 탈출한다.",
          isCorrect: true,
          feedback: "정답입니다! 타이어 2/3 이상 잠기면 수압 때문에 문이 쉽게 열리지 않습니다. 전원이 차단되기 전 즉시 창문을 열고 안전한 곳으로 탈출해야 합니다."
        },
        {
          text: "차량 내부로 물이 들어오지 않도록 창문을 끝까지 올리고 구조대를 기다린다.",
          isCorrect: false,
          feedback: "창문을 닫아두면 전자기판 침수로 창문 개방이 불가능해져 내부에 갇히게 됩니다."
        },
        {
          text: "시동을 계속 걸어 후진을 시도해 본다.",
          isCorrect: false,
          feedback: "물속에서 시동을 계속 걸면 엔진 흡입구로 물이 빨려 들어가 엔진이 영구 파손되고 화재나 감전 위험이 있습니다."
        }
      ],
      criticalRule: "바퀴 2/3 침수 시: 시동 끄고 즉시 창문 열고 탈출! (전자장치 먹통 전 골든타임)"
    },
    {
      id: 3,
      stageName: "STAGE 3 • 수압으로 문이 안 열릴 때의 비상 탈출",
      situationTitle: "수압으로 인해 차량 문이 전혀 열리지 않고 창문도 내려가지 않습니다.",
      situationDesc: "외부 물이 창문 높이까지 찼으며 차 안으로도 서서히 물이 차오르고 있습니다.",
      visualTag: "🔨 비상 탈출 기법",
      question: "문이 열리지 않을 때의 최후 탈출 수칙은?",
      options: [
        {
          text: "앞유리(전면유리)의 중앙을 발로 힘껏 걷어찬다.",
          isCorrect: false,
          feedback: "앞유리는 이중접합 접착유리라 발로 차도 뚫리지 않습니다. 측면 창문의 모서리를 공략해야 합니다."
        },
        {
          text: "좌석 목받침(헤드레스트) 쇠봉으로 측면 창문 모서리를 가격하거나, 내외부 수위 차이가 30cm 이하가 될 때 문을 연다.",
          isCorrect: true,
          feedback: "정답입니다! 헤드레스트 쇠봉으로 측면 창문 모서리를 강하게 쳐 깨뜨리거나, 차 내부 물이 가슴 높이(외부 수위 차 30cm 이내)까지 차 수압이 같아졌을 때 힘껏 밀면 문이 열립니다."
        },
        {
          text: "실내 공기가 다 빠질 때까지 천장에 얼굴을 대고 가만히 있는다.",
          isCorrect: false,
          feedback: "체온 저하와 산소 고갈, 익사 위험이 크므로 능동적인 수압 균형 타이밍에 문을 열어야 합니다."
        }
      ],
      criticalRule: "헤드레스트 쇠봉으로 측면 모서리 타격 또는 내외부 수위 차 30cm 이내일 때 문 열기!"
    },
    {
      id: 4,
      stageName: "STAGE 4 • 침수 도로 도보 대피",
      situationTitle: "차량에서 무사히 탈출하여 지상 인도 쪽으로 걸어 나와야 합니다.",
      situationDesc: "도로가 흙탕물로 뒤덮여 바닥이 전혀 보이지 않으며 유속이 제법 빠릅니다.",
      visualTag: "🚶 보행 안전 행동",
      question: "침수된 도로를 걸어서 고지대로 이동할 때 가장 중요한 주의점은?",
      options: [
        {
          text: "가장자리 인도 벽면이나 가로등 기둥을 붙잡으며 빠르게 뛴다.",
          isCorrect: false,
          feedback: "침수 시 가로등, 신호등, 입간판 주변은 감전 위험이 매우 높으며 뛰어가는 것은 맨홀 추락을 유발합니다."
        },
        {
          text: "맨홀 뚜껑 이탈 및 감전 위험에 주의하며, 우산이나 막대기로 바닥을 짚으며 천천히 이동한다.",
          isCorrect: true,
          feedback: "정답입니다! 폭우 시 수압으로 맨홀 뚜껑이 튕겨 나가 익사 사고가 빈번합니다. 우산이나 지팡이로 바닥을 더듬으며 가로등/변압기를 멀리해야 합니다."
        },
        {
          text: "신발이 젖지 않도록 슬리퍼로 갈아 신고 이동한다.",
          isCorrect: false,
          feedback: "슬리퍼는 물살에 벗겨지거나 뾰족한 파편에 발을 다칠 수 있어 운동화 끈을 꽉 묶고 이동해야 합니다."
        }
      ],
      criticalRule: "맨홀 추락 조심(막대기로 바닥 확인), 전선·가로등 감전 주의, 운동화 착용!"
    }
  ];

  const current = steps[currentStep];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (current.options[index].isCorrect) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNextStep = () => {
    if (currentStep + 1 < steps.length) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="relative min-h-screen bg-[#F0F7FF] pt-28 pb-20 px-4 max-w-[1000px] mx-auto font-sans space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#1558C9] font-black text-xs transition-colors"
        >
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            MISSION 02 • NORMAL
          </span>
          <span className="text-xs font-black text-[#059669] flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="fill-[#059669]" /> +80 XP
          </span>
        </div>
      </div>

      {/* 미션 헤더 */}
      <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-[#1558C9] uppercase tracking-wider">
          <CloudRain size={16} />
          <span>자연재난 생존 행동요령 시뮬레이션</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              🌊 집중호우 시 지하차도 & 침수지역 탈출
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              수위가 타이어 2/3 지점에 도달했을 때의 최적 탈출 타이밍과 수압 극복 생존법을 실전 훈련하세요.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-blue-50/60 px-5 py-3 rounded-2xl border border-blue-200 self-start sm:self-auto">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">단계</div>
              <div className="text-base font-black text-slate-800">
                {currentStep + 1} / {steps.length}
              </div>
            </div>
            <div className="w-[1px] h-8 bg-blue-200" />
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">탈출 점수</div>
              <div className="text-base font-black text-[#1558C9]">{score}점</div>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* 시나리오 카드 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded-md">
                  {current.stageName}
                </span>
                <span className="text-xs font-bold text-slate-500">{current.visualTag}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {current.situationTitle}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {current.situationDesc}
              </p>
            </div>

            {/* 질문 박스 */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                <span>{current.question}</span>
              </h3>
            </div>

            {/* 선택지 목록 */}
            <div className="space-y-3">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const showState = selectedOption !== null;

                let btnStyle = "bg-white border-slate-200 hover:border-blue-400 text-slate-800";
                if (showState) {
                  if (opt.isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-300";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-900 font-bold";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 shadow-sm ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 선택 후 피드백 및 해설 */}
            {selectedOption !== null && (
              <div className="space-y-4 pt-2">
                <div className={`p-5 rounded-2xl border-2 space-y-2 ${
                  current.options[selectedOption].isCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}>
                  <div className="flex items-center gap-2">
                    {current.options[selectedOption].isCorrect ? (
                      <>
                        <CheckCircle2 size={20} className="text-emerald-600 fill-white" />
                        <h4 className="text-sm font-black text-emerald-900">올바른 생존 수칙입니다! (+25점)</h4>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} className="text-rose-600 fill-white" />
                        <h4 className="text-sm font-black text-rose-900">위험한 행동입니다!</h4>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {current.options[selectedOption].feedback}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 font-bold">
                    <strong>핵심 수칙: </strong>{current.criticalRule}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-4 bg-[#1558C9] hover:bg-blue-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>{currentStep + 1 < steps.length ? "다음 재난 상황으로 이동" : "생존 시뮬레이션 결과 확인"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 최종 완료 화면 */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            🌊
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 bg-blue-50 text-[#1558C9] border border-blue-200 rounded-full">
              MISSION COMPLETED!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              침수지역 탈출 훈련 완료!
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              최종 생존 판단 점수: <strong className="text-[#1558C9] font-black">{score}점</strong> / 100점
            </p>
          </div>

          <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold">재난 대응 등급</div>
              <div className="text-xl font-black text-slate-900">
                {score >= 75 ? "최우수 생존가디언" : "재난대비 보완필요"}
              </div>
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
              <RefreshCw size={14} /> 다시 시뮬레이션
            </button>
            <Link
              href="/campaign"
              className="py-3 px-6 bg-[#1558C9] hover:bg-blue-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Trophy size={14} /> 다른 퀵 미션 도전하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
