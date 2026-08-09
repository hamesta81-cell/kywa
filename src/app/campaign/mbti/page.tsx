'use client';

import { useState } from "react";
import { ShieldAlert, ArrowRight, RefreshCw, Trophy, Sparkles, CheckCircle2, ChevronLeft, Users, AlertTriangle, Play, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function MbtiCampaignPage() {
  const [selectedCard, setSelectedCard] = useState<"mbti_test" | "synergy" | "recommend">("mbti_test");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [friendName, setFriendName] = useState("");
  const [synergyResult, setSynergyResult] = useState<string | null>(null);

  const questions = [
    { q: "Q1. 지하철 전동차 내부에서 연기가 치솟기 시작했을 때 비상탈출 핸들은?", correctIdx: 0, feedback: "💡 팁: 비상핸들은 커버를 열고 시계 방향으로 돌려 문을 열어야 합니다.", options: ["커버를 열고 밸브를 돌린 후 문을 수동 개방한다.", "즉시 문을 발로 차서 깨뜨린다."] },
    { q: "Q2. 대형 건물 화재 시 연기가 복도를 가득 채웠을 때 이동 자세는?", correctIdx: 1, feedback: "💡 팁: 화재 시 젖은 수건으로 입을 가리고 코로 숨쉬며 자세를 최대로 낮춰야 유독가스를 피합니다.", options: ["숨을 참고 서서 최대한 빨리 뛴다.", "젖은 옷으로 입을 가리고 자세를 낮춰 벽을 짚고 이동한다."] },
    { q: "Q3. 지진 진동으로 건물이 크게 흔들릴 때 가장 먼저 할 일은?", correctIdx: 0, feedback: "💡 팁: 지진 발생 즉시 낙하물로부터 머리를 보호하기 위해 탁자 밑으로 들어갑니다.", options: ["즉시 튼튼한 탁자 밑으로 들어가 몸을 보호한다.", "엘리베이터를 타고 1층으로 대피한다."] },
    { q: "Q4. 계곡 물놀이 중 수위가 갑자기 불어나고 유속이 세질 때 행동은?", correctIdx: 0, feedback: "💡 팁: 물놀이 시 수위 상승을 인지하면 미련 없이 즉시 안전한 고지대로 대피해야 합니다.", options: ["즉시 짐을 포기하고 안전한 고지대로 대피한다.", "물살이 약해질 때까지 튜브를 잡고 기다린다."] },
    { q: "Q5. 횡단보도를 건널 때 스마트폰을 보며 건너는 스몸비 행동은?", correctIdx: 1, feedback: "💡 팁: 횡단보도를 건널 때는 주위 보행 차량을 눈으로 확인해야 사고를 방지합니다.", options: ["이어폰 소리를 줄이고 스마트폰 화면을 본다.", "스마트폰을 주머니에 넣고 양옆 차량을 확인하며 건낸다."] }
  ];

  const handleSelect = (idx: number) => {
    const isCorrect = idx === questions[step].correctIdx;
    if (!isCorrect) {
      setShowFeedback(questions[step].feedback);
    }
    const newAns = [...answers, idx];
    setAnswers(newAns);

    setTimeout(() => {
      setShowFeedback(null);
      if (step + 1 < questions.length) {
        setStep(step + 1);
      } else {
        calculateResult(newAns);
      }
    }, isCorrect ? 250 : 1300);
  };

  const calculateResult = (finalAns: number[]) => {
    let score = 0;
    finalAns.forEach((ans, idx) => {
      if (ans === questions[idx].correctIdx) score += 20;
    });

    setResult({
      typeName: score >= 80 ? "침착한 상황분석가형 (ESTJ)" : score >= 60 ? "신속한 대피행동가형 (ISTP)" : "가디언 수련생형 (ISFP)",
      score,
      weakness: score < 80 ? "초기 대피 속도 및 골든타임 수칙 숙지 부족" : "완벽한 판별력 보유"
    });
  };

  const handleCreateSynergy = () => {
    if (!friendName.trim()) return;
    setSynergyResult(`🤝 [침착한 상황분석가] + [${friendName} 가디언] 시너지 조합!\n최종 재난 생존 확률: 99.4% (완벽한 파트너)`);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-4xl mx-auto font-sans space-y-6">
      
      <div className="flex justify-between items-center">
        <Link href="/campaign" className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 font-bold text-xs">
          <ChevronLeft size={16} /> 캠페인 허브
        </Link>
        <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          원하는 미션 카드를 선택하세요
        </span>
      </div>

      {/* 🃏 직관적인 3대 선택형 카드 덱 (Interactive Card Deck Selector) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedCard("mbti_test")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "mbti_test"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-blue-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">CARD 1</span>
            <h3 className="text-sm font-black mt-2">🧪 생존 MBTI 진단</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "mbti_test" ? "text-slate-300" : "text-slate-500"}`}>
              위기 상황 선택으로 내 생존 유형 진단
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-blue-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("synergy")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "synergy"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-blue-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-600 text-white">CARD 2</span>
            <h3 className="text-sm font-black mt-2">👥 2인 파트너 시너지</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "synergy" ? "text-slate-300" : "text-slate-500"}`}>
              친구 닉네임 입력 시 우리 팀 생존 확률 도출
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-cyan-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("recommend")}
          className={`p-5 rounded-2xl border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "recommend"
              ? "bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500 scale-105"
              : "bg-white text-slate-900 border-slate-200 hover:border-blue-400"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white">CARD 3</span>
            <h3 className="text-sm font-black mt-2">💡 보완 미션 퀘스트</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "recommend" ? "text-slate-300" : "text-slate-500"}`}>
              내 취약 분야 보완을 위한 3대 보상 미션
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-emerald-400">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* 선택한 카드의 액션 단일 렌더링 (시각적 복잡도 0%) */}
      {selectedCard === "mbti_test" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {!result ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-blue-600">SITUATION {step + 1} / {questions.length}</span>
                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md">
                <h2 className="text-base sm:text-lg font-bold leading-relaxed">{questions[step].q}</h2>
              </div>

              {showFeedback && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="text-amber-600 shrink-0" size={16} />
                  <span>{showFeedback}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {questions[step].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-bold text-slate-800 text-xs sm:text-sm shadow-sm flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 text-center">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                생존 진단 결과
              </span>
              <h2 className="text-2xl font-black text-white">{result.typeName}</h2>
              <p className="text-xs text-slate-300">생존 지수: <strong className="text-yellow-400 font-bold text-sm">{result.score}점</strong></p>
              <button onClick={() => { setStep(0); setAnswers([]); setResult(null); }} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs">
                🔄 다시 시험보기
              </button>
            </div>
          )}
        </div>
      )}

      {selectedCard === "synergy" && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <Users size={18} /> 👥 2인 파트너 생존 시너지 조합 생성기
          </h3>
          <p className="text-xs text-slate-300">
            친구 가디언의 닉네임을 입력하면 두 사람의 생존 능력을 결합하여 팀 생존 시너지 확률을 도출합니다.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="친구 가디언 닉네임 입력..."
              value={friendName}
              onChange={e => setFriendName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none"
            />
            <button onClick={handleCreateSynergy} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all">
              조합 생성
            </button>
          </div>
          {synergyResult && (
            <p className="text-xs font-bold text-cyan-300 bg-slate-950 p-4 rounded-xl border border-cyan-500/40 whitespace-pre-wrap">
              {synergyResult}
            </p>
          )}
        </div>
      )}

      {selectedCard === "recommend" && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <Sparkles size={18} /> 💡 나의 취약 분야 보완 추천 미션 3선
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-white">🚨 화재 연기 미로 대피 미션</h4>
              <span className="text-[10px] font-black text-emerald-400 block">+15 대피 능력치</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-white">📚 28종 재난 퀴즈 팩트체크</h4>
              <span className="text-[10px] font-black text-emerald-400 block">+20XP 경험치</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h4 className="text-xs font-bold text-white">📍 우리 학교 비상구 지도 맵핑</h4>
              <span className="text-[10px] font-black text-emerald-400 block">+25XP 경험치</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
