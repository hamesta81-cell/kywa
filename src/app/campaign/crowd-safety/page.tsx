"use client";

import { useState } from "react";
import { Users, ShieldCheck, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, ChevronLeft, Zap, AlertTriangle, HeartHandshake, Info } from "lucide-react";
import Link from "next/link";

export default function CrowdSafetyPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      q: "축제나 대형 행사장에서 인파가 급격히 몰려 몸이 밀리기 시작할 때의 최적 방어 자세는?",
      options: [
        { text: "양팔을 가슴 앞으로 교차하여 깍지를 끼고 갈비뼈 공간(버퍼존)을 확보한다.", isCorrect: true, feedback: "정답입니다! 양팔을 모아 가슴 앞 공간을 확보해야 흉강 압박으로 인한 질식사를 방지할 수 있습니다." },
        { text: "두 팔을 아래로 곧게 펴고 주머니에 손을 넣는다.", isCorrect: false, feedback: "가슴이 그대로 앞뒤 사람에게 압박되어 흉부 압박 질식 위험이 극대화됩니다." },
        { text: "바닥에 떨어진 소지품을 줍기 위해 몸을 숙인다.", isCorrect: false, feedback: "인파 속에서 몸을 숙이면 즉시 넘어지며 대규모 도미노 압사 사고로 이어집니다. 절대 줍지 마세요!" }
      ]
    },
    {
      q: "인파에 휩쓸려 중심을 잃고 바닥에 넘어졌을 때 즉시 취해야 할 생존 보호 자세는?",
      options: [
        { text: "팔다리를 대(大)자로 뻗고 바닥에 엎드린다.", isCorrect: false, feedback: "흉부와 복부 내장이 밟혀 심각한 내장 파열을 입게 됩니다." },
        { text: "머리를 감싸고 다리를 가슴 쪽으로 바짝 웅크리는 '옆으로 누운 태아 자세'를 취한다.", isCorrect: true, feedback: "정답입니다! 왼쪽 측면으로 누워 태아처럼 웅크리고 양손으로 목과 머리를 감싸 장기와 뇌를 보호해야 합니다." },
        { text: "일어나기 위해 지나가는 사람의 다리를 붙잡는다.", isCorrect: false, feedback: "상대방까지 함께 넘어뜨려 본인 위로 사람이 덮치게 됩니다." }
      ]
    },
    {
      q: "군중 속에서 이동할 때 가장 안전한 보행 원칙은?",
      options: [
        { text: "사람들을 헤치고 인파 흐름의 반대 방향으로 거슬러 탈출한다.", isCorrect: false, feedback: "흐름을 거스르면 엄청난 물리적 충돌 압력을 받아 넘어지게 됩니다." },
        { text: "군중의 이동 흐름을 그대로 타면서, 대각선 가장자리 방향으로 서서히 빠져나온다.", isCorrect: true, feedback: "정답입니다! 인파의 흐름을 거스르지 않고 대각선 바깥쪽으로 조금씩 이동하여 벽면이나 안전지대로 빠져나가야 합니다." },
        { text: "벽이나 유리창에 등을 바짝 붙이고 버틴다.", isCorrect: false, feedback: "군중 압력에 의해 벽과 사람 사이에 끼여 압사하거나 쇼윈도 유리 파손으로 큰 부상을 입습니다." }
      ]
    }
  ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (questions[step].options[idx].isCorrect) {
      setScore(prev => prev + 33);
    }
  };

  const handleNext = () => {
    if (step + 1 < questions.length) {
      setStep(prev => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF5FF] pt-28 pb-20 px-4 max-w-[1000px] mx-auto font-sans space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-purple-600 font-black text-xs"
        >
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            ZONE 05 • 마음 & 인파안전
          </span>
          <span className="text-xs font-black text-[#059669] flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="fill-[#059669]" /> +60 XP
          </span>
        </div>
      </div>

      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-purple-600 uppercase tracking-wider">
          <Users size={16} />
          <span>밀집 군중 압사사고 예방 & 신체 보호 훈련</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          👥 인파 밀집 사고 예방 및 군중 탈출법
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          축제·공연장·지하철 밀집 상황에서 흉부 압박을 방지하는 팔짱 자세와 전도 시 태아 자세를 익히세요.
        </p>
      </div>

      {!finished ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              문제 {step + 1} / {questions.length}
            </span>
            <span className="text-xs font-bold text-slate-400">현재 점수: {score}점</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            {questions[step].q}
          </h2>

          <div className="space-y-3">
            {questions[step].options.map((opt, idx) => {
              const isSelected = selected === idx;
              let style = "bg-white border-slate-200 text-slate-800 hover:border-purple-300";
              if (selected !== null) {
                if (opt.isCorrect) style = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold";
                else if (isSelected) style = "bg-rose-50 border-rose-400 text-rose-950 font-bold";
                else style = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
              }

              return (
                <button
                  key={idx}
                  disabled={selected !== null}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 shadow-sm ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="space-y-4 pt-2">
              <div className={`p-5 rounded-2xl border-2 space-y-2 ${
                questions[step].options[selected].isCorrect
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                  : "bg-rose-50 border-rose-300 text-rose-950"
              }`}>
                <div className="flex items-center gap-2 font-black text-sm">
                  {questions[step].options[selected].isCorrect ? (
                    <><CheckCircle2 size={18} className="text-emerald-600" /> 정답입니다!</>
                  ) : (
                    <><XCircle size={18} className="text-rose-600" /> 오답입니다!</>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium">{questions[step].options[selected].feedback}</p>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>{step + 1 < questions.length ? "다음 문제" : "결과 확인"}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            👥
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            군중 안전 훈련 완료!
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            최종 점수: <strong className="text-purple-600 font-black">{Math.min(100, score + 1)}점</strong>
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/campaign"
              className="py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-sm"
            >
              미션 허브로 돌아가기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
