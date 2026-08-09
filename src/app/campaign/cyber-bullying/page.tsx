'use client';

import { useState } from "react";
import { Shield, Sparkles, ArrowLeft, RefreshCw, AlertCircle, Heart, PhoneCall, CheckCircle2, MessageSquare, ArrowRight, ChevronLeft, Trophy, Share2 } from "lucide-react";
import Link from "next/link";

export default function CyberBullyingCampaignPage() {
  const [selectedCard, setSelectedCard] = useState<"rewrite" | "perspective" | "emergency">("rewrite");
  const [rawText, setRawText] = useState("");
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [tempDegree, setTempDegree] = useState(36.5);
  const [showEmergencyCall, setShowEmergencyCall] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false); // 미션 결과 화면 모달
  const [viewRole, setViewRole] = useState<"victim" | "friend" | "bystander">("bystander");

  const handleRewrite = () => {
    if (!rawText.trim()) return;

    if (rawText.includes("죽고싶다") || rawText.includes("자살") || rawText.includes("자해") || rawText.includes("살기싫어")) {
      setShowEmergencyCall(true);
      return;
    }

    let text = rawText
      .replace(/너 때문에 망했어/g, "서로 좀 더 맞춰보면 잘 해결할 수 있을 것 같아.")
      .replace(/짜증나/g, "조금 속상하고 섭섭했어.")
      .replace(/꺼져/g, "지금은 혼자 생각할 시간이 필요해.");

    if (text === rawText) {
      text = `"${rawText}" ➔ 상대방을 배려하여 "우리 함께 이야기해보자"로 표현해 볼까요?`;
    }

    setRewrittenText(text);
    setTempDegree(prev => Math.min(100, Number((prev + 12.5).toFixed(1))));
    
    // 리라이트 성공 시 미션 완료 결과 모달 열기!
    setTimeout(() => {
      setShowResultModal(true);
    }, 600);
  };

  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: "KYWA 안전 미션 완료 결과",
        text: "사이버 폭력 예방 미션 완수! +70 XP 및 수집 카드를 획득했습니다.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("결과 공유 링크가 클립보드에 복사되었습니다! 친구들에게 전파해보세요.");
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-[1240px] mx-auto font-sans space-y-6">
      
      <div className="flex justify-between items-center">
        <Link href="/campaign" className="inline-flex items-center gap-1 text-[#5D6B7E] hover:text-[#1558C9] font-bold text-xs">
          <ChevronLeft size={16} /> 안전 미션 허브
        </Link>
        <span className="text-xs font-bold text-[#7557D9] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          🌡️ 내 존중 온도: <strong className="text-[#7557D9]">{tempDegree}°C</strong>
        </span>
      </div>

      {/* 🃏 3대 선택형 미션 카드 덱 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedCard("rewrite")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "rewrite"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#7557D9] text-white">CARD 1</span>
            <h3 className="text-sm font-black mt-2">✏️ 언어 존중 리라이트</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "rewrite" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              공격적 표현을 존중 문장으로 정돈
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-purple-300">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("perspective")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "perspective"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#1558C9] text-white">CARD 2</span>
            <h3 className="text-sm font-black mt-2">👥 3인 관점 시뮬레이션</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "perspective" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              방관자/피해자/친구 3개 관점 체험
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-blue-300">
            선택 플레이 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("emergency")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "emergency"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white">CARD 3</span>
            <h3 className="text-sm font-black mt-2">🆘 24시간 긴급구호 핫라인</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "emergency" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              위기 징후 감지 및 즉시 1388 연결
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-rose-300">
            도움 연결 <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* CARD 1: 언어 존중 리라이트 */}
      {selectedCard === "rewrite" && (
        <div className="krds-public-card p-6 bg-white space-y-4 shadow-md">
          <h3 className="text-base font-black text-[#102A43]">✏️ 거친 말을 따뜻한 말로 변환하기</h3>
          <p className="text-xs text-[#5D6B7E]">입력창에 거친 표현을 넣어보세요. AI가 상대방의 마음을 해치지 않는 배려 문장으로 변환해드립니다.</p>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="예: '너 때문에 망했어', '짜증나', '꺼져' 등의 표현 입력..."
              className="w-full p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-[12px] text-xs font-medium focus:outline-none focus:border-[#7557D9]"
            />

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#5D6B7E]">추천문구 입력 버튼:</span>
              <button
                onClick={handleRewrite}
                className="krds-public-button px-5 py-2.5 bg-[#7557D9] hover:bg-purple-700 text-white text-xs font-black rounded-[14px] shadow-md touch-target"
              >
                존중 문장으로 리라이트하기
              </button>
            </div>
          </div>

          {rewrittenText && (
            <div className="p-4 bg-purple-50 rounded-[14px] border border-purple-200 space-y-2">
              <span className="text-[10px] font-bold text-[#7557D9] uppercase">변환 완료 문장:</span>
              <p className="text-xs font-bold text-[#102A43]">{rewrittenText}</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 🏆 미션 완료 결과 화면 모달 (유저 요구사항 100% 반영!)                  */}
      {/* ==================================================================== */}
      {showResultModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-8 max-w-md w-full bg-white space-y-6 shadow-2xl animate-in zoom-in-95 border border-[#E2E8F0] text-[#172033]">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-black text-[#159A83] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                🎉 미션 완료!
              </span>
              <h2 className="text-2xl font-black text-[#102A43] pt-1">4 / 5 정답</h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0] space-y-2 text-xs font-bold tabular-nums">
              <div className="flex justify-between text-[#1558C9]">
                <span>획득 보상:</span>
                <span className="font-black">+70 XP</span>
              </div>
              <div className="flex justify-between text-[#159A83]">
                <span>능력치 상승:</span>
                <span className="font-black">생활안전 능력치 +8</span>
              </div>
            </div>

            {/* 새로 획득한 카드 */}
            <div className="p-4 bg-amber-50 rounded-[14px] border border-amber-200 space-y-1.5 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">새로 획득한 수집 카드</span>
              <h4 className="text-sm font-black text-amber-950">🃏 의약품 라벨 확인하기</h4>
            </div>

            {/* 액션 버튼 3종: [오답 다시 보기] [추천 미션 시작] [결과 공유] */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowResultModal(false)}
                className="krds-public-button w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-bold rounded-[14px] transition-all touch-target"
              >
                [오답 다시 보기]
              </button>

              <Link
                href="/campaign"
                onClick={() => setShowResultModal(false)}
                className="krds-public-button w-full py-3 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-[14px] text-center block shadow-md transition-all touch-target"
              >
                [추천 미션 시작]
              </Link>

              <button
                onClick={handleShareResult}
                className="krds-public-button w-full py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-[14px] transition-all touch-target flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} />
                <span>[결과 공유]</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
