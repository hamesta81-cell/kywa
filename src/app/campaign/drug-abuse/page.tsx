'use client';

import { useState } from "react";
import { Pill, ShieldCheck, ArrowRight, RefreshCw, ChevronLeft, Award, HelpCircle, Coffee, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DrugAbuseCampaignPage() {
  const [selectedCard, setSelectedCard] = useState<"quiz" | "label" | "caffeine">("quiz");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [caffeineDrinks, setCaffeineDrinks] = useState({ coffee: 0, energy: 0, tea: 0 });
  const totalCaffeine = (caffeineDrinks.coffee * 100) + (caffeineDrinks.energy * 160) + (caffeineDrinks.tea * 40);

  const quizzes = {
    beginner: [
      { q: "친구의 처방약을 대신 먹어도 안전하다?", a: false, exp: "⚠️ 의약품은 개인 체질과 질환에 따라 처방되므로 타인 약을 복용하면 부작용이 생깁니다. (식약처 검수일: 2026.06.10)" },
      { q: "타이레놀과 아스피린을 함께 다량 복용해도 괜찮다?", a: false, exp: "⚠️ 동일 아세트아미노펜 성분 중복 복용 시 간 손상 위험이 있습니다." }
    ],
    intermediate: [
      { q: "감기약 복용 후 잠이 솔솔 올 때 운전이나 자전거를 타도 된다?", a: false, exp: "⚠️ 항히스타민 성분으로 인해 졸음이 발생하여 사고 위험이 높습니다." },
      { q: "항생제는 증상이 좋아지면 중간에 끊어도 된다?", a: false, exp: "⚠️ 항생제 중단 시 내성균이 남아 재발할 수 있어 처방 일수를 준수해야 합니다." }
    ],
    advanced: [
      { q: "카페인 음료와 여드름 약(이소티논)을 다량 함께 먹어도 무관하다?", a: false, exp: "⚠️ 중추신경 자극 및 위장 장애, 간 부담을 초래하므로 주의가 필요합니다." }
    ]
  };

  const handleAnswer = (userAns: boolean) => {
    const currentQ = quizzes[level][quizIdx];
    if (userAns === currentQ.a) {
      setScore(score + 10);
    }
    if (quizIdx + 1 < quizzes[level].length) {
      setQuizIdx(quizIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-4xl mx-auto font-sans space-y-6">
      
      <div className="flex justify-between items-center">
        <Link href="/campaign" className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 font-bold text-xs">
          <ChevronLeft size={16} /> 캠페인 허브
        </Link>
        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          원하는 약물 미션 카드를 선택하세요
        </span>
      </div>

      {/* 🃏 직관적인 3대 선택형 카드 덱 (Card Deck Selector) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedCard("quiz")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "quiz"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white">CARD 1</span>
            <h3 className="text-sm font-black mt-2">💊 OX 팩트체크 서바이벌</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "quiz" ? "text-slate-300" : "text-slate-500"}`}>
              초급/중급/고급 3단계 난이도 선택 퀴즈
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-emerald-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("label")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "label"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">CARD 2</span>
            <h3 className="text-sm font-black mt-2">📋 의약품 라벨 읽기</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "label" ? "text-slate-300" : "text-slate-500"}`}>
              용법·용량 및 복용 수칙 미니게임
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-blue-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("caffeine")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "caffeine"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-emerald-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-600 text-white">CARD 3</span>
            <h3 className="text-sm font-black mt-2">☕ 카페인 총량 조합기</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "caffeine" ? "text-slate-300" : "text-slate-500"}`}>
              음료별 하루 카페인 섭취량 계산
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-amber-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* 선택한 카드의 1개 액션 집중 렌더링 */}
      {selectedCard === "quiz" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-black text-slate-700">난이도 선택:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(["beginner", "intermediate", "advanced"] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { setLevel(lvl); setQuizIdx(0); setScore(0); setIsFinished(false); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                    level === lvl ? "bg-emerald-600 text-white" : "text-slate-600"
                  }`}
                >
                  {lvl === "beginner" ? "초급" : lvl === "intermediate" ? "중급" : "고급"}
                </button>
              ))}
            </div>
          </div>

          {!isFinished ? (
            <div className="space-y-5 text-center">
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{quizzes[level][quizIdx]?.q}</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleAnswer(true)} className="py-6 bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 rounded-2xl text-2xl font-black text-emerald-600">
                  ⭕ O (맞다)
                </button>
                <button onClick={() => handleAnswer(false)} className="py-6 bg-rose-50 hover:bg-rose-100 border border-rose-400 rounded-2xl text-2xl font-black text-rose-600">
                  ❌ X (틀리다)
                </button>
              </div>
              <p className="text-xs text-slate-400 font-bold">{quizzes[level][quizIdx]?.exp}</p>
            </div>
          ) : (
            <div className="text-center space-y-3 py-4">
              <Award size={40} className="mx-auto text-emerald-500 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">퀴즈 완료!</h3>
              <p className="text-xs text-slate-600">획득 스코어: <strong className="text-emerald-600 text-sm">{score}점</strong></p>
              <button onClick={() => { setQuizIdx(0); setScore(0); setIsFinished(false); }} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs">
                🔄 다시 도전
              </button>
            </div>
          )}
        </div>
      )}

      {selectedCard === "label" && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <FileText size={18} /> 📋 의약품 라벨 올바르게 읽기
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl space-y-2 text-xs">
            <span className="text-yellow-400 font-bold block">제품명: 맘편한 종합감기약 (10정)</span>
            <p className="text-slate-300">용법·용량: 만 15세 이상 1회 1정, 1일 3회 식후 30분 복용</p>
            <p className="text-rose-400 font-bold">⚠️ 경고: 아세트아미노펜 하루 4,000mg 초과 금지 / 음주 후 복용 엄금</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-xs font-bold text-emerald-300">
            ✅ 라벨 정독 완료: 식후 30분 미지근한 물과 복용하는 것이 정답입니다! (+15XP)
          </div>
        </div>
      )}

      {selectedCard === "caffeine" && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Coffee size={18} /> ☕ 하루 카페인 총량 조합 시뮬레이터
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl space-y-2">
              <span className="font-bold block">☕ 캔커피 (100mg)</span>
              <button onClick={() => setCaffeineDrinks(p => ({ ...p, coffee: p.coffee + 1 }))} className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg">+1잔</button>
              <span className="block text-slate-400">{caffeineDrinks.coffee}잔</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl space-y-2">
              <span className="font-bold block">⚡ 에너음료 (160mg)</span>
              <button onClick={() => setCaffeineDrinks(p => ({ ...p, energy: p.energy + 1 }))} className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg">+1캔</button>
              <span className="block text-slate-400">{caffeineDrinks.energy}캔</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl space-y-2">
              <span className="font-bold block">🍵 녹차/홍차 (40mg)</span>
              <button onClick={() => setCaffeineDrinks(p => ({ ...p, tea: p.tea + 1 }))} className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg">+1잔</button>
              <span className="block text-slate-400">{caffeineDrinks.tea}잔</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between text-xs">
            <span>청소년 일일 권장 최대 섭취량: <strong className="text-yellow-400">150mg 이하</strong></span>
            <span className={`font-black text-xs ${totalCaffeine > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
              총 섭취량: {totalCaffeine} mg {totalCaffeine > 150 ? '(⚠️ 초과 위험!)' : '(안전)'}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
