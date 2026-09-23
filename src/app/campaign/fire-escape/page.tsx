"use client";

import { useState } from "react";
import { Flame, ShieldCheck, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, ChevronLeft, Zap, AlertTriangle, Wind, DoorClosed, HelpCircle, Layers } from "lucide-react";
import Link from "next/link";

interface FireEscapeQuestion {
  id: number;
  stageName: string;
  title: string;
  desc: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  lifeSavingTip: string;
}

export default function FireEscapePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 완강기 순서 맞추기 퀘스트 상태 (STEP 4)
  const [wanSequence, setWanSequence] = useState<number[]>([]);
  const wanSteps = [
    { id: 1, text: "완강기 후크를 지지대 고리에 걸고 잠금 나사를 꽉 조인다." },
    { id: 2, text: "릴(로프 감긴 뭉치)을 창밖 바닥으로 던진다." },
    { id: 3, text: "가슴 벨트를 양팔에 낀 후 조임 고리를 가슴에 밀착하여 조인다." },
    { id: 4, text: "다리부터 창밖으로 나간 뒤, 벽면을 양손으로 가볍게 밀며 천천히 하강한다." }
  ];

  const questions: FireEscapeQuestion[] = [
    {
      id: 1,
      stageName: "STAGE 1 • 화재 경보 및 대피 자세",
      title: "수련활동 숙소에서 화재 비상벨이 울리고 복도에 연기가 차오릅니다.",
      desc: "유독가스는 천장 쪽으로 빠르게 이동하며 1~2모금만 들이마셔도 질식 실신할 수 있습니다.",
      question: "복도로 대피할 때 가장 안전하고 올바른 탈출 자세는?",
      options: [
        {
          text: "물에 적신 수건이나 옷으로 코와 입을 감싸고, 자세를 최대한 낮춰 벽을 짚으며 이동한다.",
          isCorrect: true,
          feedback: "정답입니다! 젖은 천은 유독가스를 흡착 필터링하며, 바닥으로부터 30cm 이내 청정 공기층을 호흡하기 위해 낮은 포복 자세가 필수입니다."
        },
        {
          text: "숨을 참은 상태로 엘리베이터를 타고 1층으로 신속하게 내려간다.",
          isCorrect: false,
          feedback: "화재 시 엘리베이터는 연통 역할을 하여 유독가스가 가득 차고 전력 차단으로 갇혀 질식 사망합니다. 절대 탑승 금지!"
        },
        {
          text: "귀중품과 짐을 챙긴 뒤 서서 빠르게 뛰어 비상구로 나간다.",
          isCorrect: false,
          feedback: "서서 뛰면 고온의 유독가스를 바로 흡입하게 됩니다. 짐을 모두 버리고 낮은 자세로 탈출해야 합니다."
        }
      ],
      lifeSavingTip: "젖은 옷으로 코·입 밀착, 낮은 자세, 벽면 터치 대피, 엘리베이터 절대 탑승 금지!"
    },
    {
      id: 2,
      stageName: "STAGE 2 • 비상구 문 손잡이 확인 (백드래프트 예방)",
      title: "비상 계단으로 나가는 철문 앞에 도착했습니다.",
      desc: "문 반대편에 큰 불길이 있을 때 문을 갑자기 열면 폭발적인 역화(Backdraft)가 발생할 수 있습니다.",
      question: "철문을 열기 전 가장 먼저 확인해야 할 사항은?",
      options: [
        {
          text: "손바닥 전체로 손잡이를 꽉 쥐어 돌려본다.",
          isCorrect: false,
          feedback: "손바닥으로 잡았다가 손잡이가 고온으로 달궈져 있다면 손바닥 전체 화상으로 손을 쓸 수 없게 됩니다."
        },
        {
          text: "손등을 문손잡이나 철문 표면에 살짝 대어 열기를 확인한다.",
          isCorrect: true,
          feedback: "정답입니다! 손등으로 살짝 대어 보아 뜨겁다면 반대편에 이미 맹렬한 화재가 있는 것이므로 문을 열지 말고 반대 방향 대피로를 찾아야 합니다."
        },
        {
          text: "문을 발로 세게 걷어차서 한 번에 활짝 연다.",
          isCorrect: false,
          feedback: "산소가 급격히 공급되어 화염이 얼굴로 폭발 분출할 수 있습니다."
        }
      ],
      lifeSavingTip: "손등으로 손잡이 열기 확인! 뜨거우면 절대 열지 말고 다른 피난로 탐색!"
    },
    {
      id: 3,
      stageName: "STAGE 3 • 실내 고립 시 구조 요청",
      title: "계단이 불길에 휩싸여 방 안에 고립되었습니다.",
      desc: "출구가 차단되어 방 밖으로 나갈 수 없는 절체절명의 상황입니다.",
      question: "구조대가 올 때까지 방 안에서 생존하기 위한 올바른 행동은?",
      options: [
        {
          text: "창문을 깨뜨려 산소를 많이 유입시키고 방 문을 열어둔다.",
          isCorrect: false,
          feedback: "방 문을 열어두면 복도의 연기와 불길이 방 안으로 빨려 들어옵니다."
        },
        {
          text: "방 문을 닫고 젖은 옷이나 수건으로 문틈을 막은 뒤, 창가에서 손을 흔들며 구조를 요청한다.",
          isCorrect: true,
          feedback: "정답입니다! 문을 닫고 문틈을 젖은 천으로 막아 유독가스 유입을 차단하고, 119에 현재 방 호수를 알리며 창가에서 구조를 요청해야 합니다."
        },
        {
          text: "침대 매트리스 밑이나 옷장 속에 들어가 숨어 있는다.",
          isCorrect: false,
          feedback: "옷장이나 침대 밑은 유독가스에 질식되며 구조대원이 환자를 찾기 어렵습니다."
        }
      ],
      lifeSavingTip: "문 닫고 젖은 천으로 문틈 밀폐 ➔ 119 방 번호 신고 ➔ 창가 구조 요청!"
    }
  ];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (questions[currentStep].options[index].isCorrect) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNextQuestion = () => {
    if (currentStep + 1 < questions.length) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setCurrentStep(3); // STAGE 4 완강기 순서 맞추기
      setSelectedOption(null);
    }
  };

  // 완강기 순서 클릭
  const handleWanClick = (id: number) => {
    if (wanSequence.includes(id)) return;
    const next = [...wanSequence, id];
    setWanSequence(next);

    if (next.length === 4) {
      // 1, 2, 3, 4 순서가 맞는지 검증
      const isCorrectSequence = next[0] === 1 && next[1] === 2 && next[2] === 3 && next[3] === 4;
      if (isCorrectSequence) {
        setScore((prev) => prev + 25);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setWanSequence([]);
    setIsFinished(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF9F5] pt-28 pb-20 px-4 max-w-[1000px] mx-auto font-sans space-y-6">
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
            MISSION 04 • HARD
          </span>
          <span className="text-xs font-black text-[#059669] flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="fill-[#059669]" /> +100 XP
          </span>
        </div>
      </div>

      {/* 미션 헤더 */}
      <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider">
          <Flame size={16} className="text-orange-600" />
          <span>체험활동 화재 대피 & 완강기 실전 훈련</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              🔥 체험활동 중 화재 대피 및 완강기 사용법
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              연기 질식 방지 자세, 백드래프트 감지, 그리고 완강기 4단계 탈출 순서를 마스터하세요.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-orange-50/60 px-5 py-3 rounded-2xl border border-orange-200 self-start sm:self-auto">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">단계</div>
              <div className="text-base font-black text-slate-800">
                {currentStep + 1} / 4
              </div>
            </div>
            <div className="w-[1px] h-8 bg-orange-200" />
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">화재안전 점수</div>
              <div className="text-base font-black text-orange-600">{score}점</div>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        currentStep < 3 ? (
          /* 일반 객관식 문제 (STAGE 1 ~ 3) */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md">
                {questions[currentStep].stageName}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {questions[currentStep].title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {questions[currentStep].desc}
              </p>
            </div>

            {/* 질문 박스 */}
            <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm sm:text-base font-black text-orange-950 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500 shrink-0" />
                <span>{questions[currentStep].question}</span>
              </h3>
            </div>

            {/* 선택지 목록 */}
            <div className="space-y-3">
              {questions[currentStep].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const showState = selectedOption !== null;

                let btnStyle = "bg-white border-slate-200 hover:border-orange-400 text-slate-800";
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

            {/* 피드백 */}
            {selectedOption !== null && (
              <div className="space-y-4 pt-2">
                <div className={`p-5 rounded-2xl border-2 space-y-2 ${
                  questions[currentStep].options[selectedOption].isCorrect
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}>
                  <div className="flex items-center gap-2">
                    {questions[currentStep].options[selectedOption].isCorrect ? (
                      <>
                        <CheckCircle2 size={20} className="text-emerald-600 fill-white" />
                        <h4 className="text-sm font-black text-emerald-900">정답입니다! (+25점)</h4>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} className="text-rose-600 fill-white" />
                        <h4 className="text-sm font-black text-rose-900">오답입니다!</h4>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {questions[currentStep].options[selectedOption].feedback}
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs text-orange-950 font-bold">
                  💡 <strong>생존 팁: </strong>{questions[currentStep].lifeSavingTip}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-4 bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>{currentStep + 1 < questions.length ? "다음 화재 상황으로" : "STAGE 4: 완강기 탈출 실전 미션"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STAGE 4: 완강기 4단계 탈출 순서 조합 퀘스트 */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2 text-center max-w-lg mx-auto">
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                STAGE 4 • 완강기 올바른 사용 순서 맞추기
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                완강기로 창밖 탈출 시 올바른 순서대로 1~4번을 터치하세요!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                완강기는 체중을 이용해 일정한 속도로 자동 하강하는 피난 기구입니다.
              </p>
            </div>

            {/* 현재 선택된 순서 상태 표시 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">내가 선택한 순서:</div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((pos) => {
                  const stepId = wanSequence[pos];
                  const item = wanSteps.find(s => s.id === stepId);
                  return (
                    <div
                      key={pos}
                      className="p-3 bg-white border rounded-xl text-center min-h-[60px] flex flex-col justify-center"
                    >
                      <div className="text-[10px] font-black text-slate-400">{pos + 1}단계</div>
                      <div className="text-xs font-black text-orange-600 truncate">
                        {item ? `${item.text.slice(0, 15)}...` : "(선택 대기)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4개 보기 버튼 */}
            <div className="space-y-3">
              {wanSteps.map((step) => {
                const isSelected = wanSequence.includes(step.id);
                const orderIndex = wanSequence.indexOf(step.id);

                return (
                  <button
                    key={step.id}
                    disabled={isSelected}
                    onClick={() => handleWanClick(step.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-3 shadow-sm ${
                      isSelected
                        ? "bg-orange-50 border-orange-400 text-orange-950 font-bold"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs shrink-0">
                        {isSelected ? `${orderIndex + 1}번` : "선택"}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{step.text}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={18} className="text-orange-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* 4개 모두 선택 완료 시 피드백 */}
            {wanSequence.length === 4 && (
              <div className="space-y-4 pt-2">
                <div className={`p-5 rounded-2xl border-2 space-y-2 ${
                  wanSequence[0] === 1 && wanSequence[1] === 2 && wanSequence[2] === 3 && wanSequence[3] === 4
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}>
                  <div className="flex items-center gap-2">
                    {wanSequence[0] === 1 && wanSequence[1] === 2 && wanSequence[2] === 3 && wanSequence[3] === 4 ? (
                      <>
                        <CheckCircle2 size={20} className="text-emerald-600 fill-white" />
                        <h4 className="text-sm font-black text-emerald-900">완벽한 완강기 탈출 순서입니다! (+25점)</h4>
                      </>
                    ) : (
                      <>
                        <XCircle size={20} className="text-rose-600 fill-white" />
                        <h4 className="text-sm font-black text-rose-900">순서가 틀렸습니다! 정답: 고리 체결 ➔ 릴 투하 ➔ 벨트 조임 ➔ 벽 짚고 하강</h4>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    완강기 사용 시 양팔을 위로 들면 가슴 벨트가 빠져 추락하므로, 반드시 양팔을 가슴에 모으고 벽면을 손으로 밀며 하강해야 합니다.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setWanSequence([])}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} /> 순서 다시 고르기
                  </button>
                  <button
                    onClick={() => setIsFinished(true)}
                    className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>화재 대피 미션 완료하기!</span>
                    <Trophy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* 최종 완료 화면 */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            🔥
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
              MISSION COMPLETED!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              화재 대피 & 완강기 훈련 완료!
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              최종 화재안전 점수: <strong className="text-orange-600 font-black">{score}점</strong> / 100점
            </p>
          </div>

          <div className="bg-orange-50/60 rounded-2xl p-5 border border-orange-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold">인증 타이틀</div>
              <div className="text-xl font-black text-slate-900">화재안전 챔피언</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">보상 획득</div>
              <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                <Zap size={20} className="fill-emerald-600" /> +100 XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> 다시 훈련하기
            </button>
            <Link
              href="/campaign"
              className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Trophy size={14} /> 다른 퀵 미션 도전하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
