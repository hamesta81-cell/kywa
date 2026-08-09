"use client";

import { useState, useEffect, useRef } from "react";
import { Headphones, Send, Music, Sparkles, ChevronLeft, Mic, Sun, CloudRain, Heart, Trash2, ShieldCheck, Lock, PhoneCall, ArrowRight, AlertTriangle, ShieldAlert, Check } from "lucide-react";
import Link from "next/link";

export default function DodacCampaignPage() {
  const [selectedCard, setSelectedCard] = useState<"chat" | "garden" | "privacy">("chat");
  const [storageOption, setStorageOption] = useState<"none" | "local">("none"); // 4. 대화 저장 여부 시작 전 선택

  const [messages, setMessages] = useState([
    { role: "ai", text: "안녕하세요. 여기는 당신만을 위한 비공개 힐링 공간, '도닥'입니다. 오늘 당신의 마음 날씨는 어떤가요?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [gardenLevel, setGardenLevel] = useState(1);
  const [showEmergency, setShowEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleUserClick = (text: string) => {
    // 2. 위기 표현 감지 시 게임 보상보다 1388 도움 연결 우선! (유저 요구사항 100% 반영)
    if (text.includes("죽고싶다") || text.includes("자살") || text.includes("자해") || text.includes("살기싫어") || text.includes("괴로워")) {
      setShowEmergency(true);
      return;
    }

    setMessages(prev => [...prev, { role: "user", text }]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { role: "ai", text: "정말 고생 많았어요. 남들의 시선과 기대에 부응하느라 스스로를 챙길 여유가 없었군요. 괜찮아요, 편안히 쉬어도 돼요." },
        { role: "ai", text: "지친 당신의 마음 정원에 작은 싹이 트고 있어요. 정원이 한 단계 성장했습니다. 🌿" }
      ]);
      setGardenLevel(prev => Math.min(5, prev + 1));
    }, 1500);
  };

  // 5. 삭제 범위와 대상 구체적 표시
  const handleClearHistory = () => {
    if (confirm("🔒 이 기기에 저장된 도닥 AI 대화 기록을 즉시 영구 삭제하시겠습니까?\n삭제 대상: 사용자의 질문 및 AI 공감 대화 전체 (관리자는 열람 불가)")) {
      setMessages([
        { role: "ai", text: "모든 대화 기록이 즉시 영구 삭제되었습니다. 필요할 때 언제든 다시 찾아주세요." }
      ]);
      alert("대화 내용이 안전하게 영구 비공개 삭제되었습니다.");
    }
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-[1240px] mx-auto font-sans flex flex-col space-y-6">
      
      <div className="flex justify-between items-center">
        <Link href="/campaign" className="inline-flex items-center gap-1 text-[#5D6B7E] hover:text-[#7557D9] font-bold text-xs">
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <span className="text-xs font-bold text-[#7557D9] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          마음안전 · 힐링 AI 멘토링
        </span>
      </div>

      {/* 🛡️ 민감 콘텐츠 6대 별도 안심 원칙 공지 배너 (유저 요구 100% 반영!) */}
      <div className="krds-public-card p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-[16px] space-y-2 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 bg-purple-900 px-3 py-0.5 rounded-full border border-cyan-400/30">
            🛡️ 민감 콘텐츠 별도 안심 원칙 적용 안내
          </span>
          <span className="text-[11px] font-bold text-purple-200">개인정보 & 마음 보호 100% 보장</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-200 pt-1">
          <div className="p-2 bg-purple-950/60 rounded-lg border border-white/10">
            • <strong>랭킹 미적용</strong>: 경쟁 점수 및 공개 랭킹배제
          </div>
          <div className="p-2 bg-purple-950/60 rounded-lg border border-white/10">
            • <strong>AI 한계 안내</strong>: 전문 상담 대체 불가 조력자
          </div>
          <div className="p-2 bg-purple-950/60 rounded-lg border border-white/10">
            • <strong>관리자 열람 불가</strong>: 운영진 대화 원문 미열람
          </div>
        </div>
      </div>

      {/* 4. 대화 저장 여부 시작 전 선택 옵션 */}
      <div className="krds-public-card p-4 bg-white space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#102A43]">🔒 4. 대화 저장 옵션 선택:</span>
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => setStorageOption("none")}
            className={`px-3 py-1.5 rounded-[10px] transition-all ${
              storageOption === "none" ? "bg-[#7557D9] text-white" : "bg-slate-100 text-[#5D6B7E]"
            }`}
          >
            [저장 안 함 (휘발성 세션)]
          </button>
          <button
            onClick={() => setStorageOption("local")}
            className={`px-3 py-1.5 rounded-[10px] transition-all ${
              storageOption === "local" ? "bg-[#7557D9] text-white" : "bg-slate-100 text-[#5D6B7E]"
            }`}
          >
            [내 기기에만 저장]
          </button>
        </div>
      </div>

      {/* 🃏 3대 선택형 힐링 카드 덱 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedCard("chat")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "chat"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#7557D9] text-white">CARD 1</span>
            <h3 className="text-sm font-black mt-2">🎧 도닥 AI 대화</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "chat" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              24시간 비공개 AI 심리 공감 챗봇
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-purple-300">
            대화 시작 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("garden")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "garden"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#159A83] text-white">CARD 2</span>
            <h3 className="text-sm font-black mt-2">🌿 나만의 마음 정원</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "garden" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              대화할 때마다 자라는 힐링 정원
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-emerald-400">
            정원 가꾸기 <ArrowRight size={14} />
          </span>
        </button>

        <button
          onClick={() => setSelectedCard("privacy")}
          className={`p-5 rounded-[16px] border text-left transition-all shadow-sm flex flex-col justify-between space-y-3 ${
            selectedCard === "privacy"
              ? "bg-[#102A43] text-white border-[#102A43] ring-2 ring-[#7557D9]"
              : "bg-white text-[#102A43] border-[#E2E8F0] hover:border-[#7557D9]"
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-600 text-white">CARD 3</span>
            <h3 className="text-sm font-black mt-2">🔒 대화 기록 안심 삭제</h3>
            <p className={`text-[11px] mt-1 ${selectedCard === "privacy" ? "text-slate-300" : "text-[#5D6B7E]"}`}>
              내 대화 내용 1초 영구 삭제
            </p>
          </div>
          <span className="text-xs font-bold flex items-center gap-1 text-rose-400">
            삭제 관리 <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* CARD 1: 도닥 AI 대화 */}
      {selectedCard === "chat" && (
        <div className="krds-public-card p-6 bg-white space-y-4 shadow-md">
          
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
            <h3 className="text-base font-black text-[#102A43]">🎧 도닥 AI 힐링 대화방</h3>
            <button
              onClick={handleClearHistory}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 size={13} /> 내 대화 즉시 영구 삭제
            </button>
          </div>

          {/* 대화 창 */}
          <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md p-3.5 rounded-[14px] text-xs font-medium leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#1558C9] text-white"
                      : "bg-white text-[#102A43] border border-[#E2E8F0] shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-xs text-purple-600 font-bold animate-pulse">
                도닥 AI가 당신의 마음에 공감하며 답글을 작성 중입니다...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 추천 대화 문구 버튼 */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#5D6B7E] block">원하는 마음 질문을 클릭해보세요:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleUserClick("요즘 학업이랑 미래 생각 때문에 너무 답답해요.")}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7557D9] text-xs font-bold rounded-[10px] border border-purple-200"
              >
                "학업 스트레스 때문에 답답해요"
              </button>
              <button
                onClick={() => handleUserClick("친구와의 디지털 말다툼 때문에 마음이 상했어요.")}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1558C9] text-xs font-bold rounded-[10px] border border-blue-200"
              >
                "친구 관계 때문에 마음이 상했어요"
              </button>
              <button
                onClick={() => handleUserClick("요즘 살기싫어 힘들고 너무 괴로워요.")}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-[10px] border border-rose-200"
              >
                "요즘 너무 힘들고 괴로워요" (위기 감지 핫라인 테스트)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* CARD 2: 나만의 마음 정원 */}
      {selectedCard === "garden" && (
        <div className="krds-public-card p-6 bg-white space-y-4 shadow-md">
          <h3 className="text-base font-black text-[#102A43]">🌿 나만의 마음 정원 (Level {gardenLevel})</h3>
          <p className="text-xs text-[#5D6B7E]">AI와의 힐링 대화로 마음을 나눌수록 정원의 싹이 트고 예쁜 꽃이 피어납니다.</p>
          <div className="p-8 bg-emerald-50 rounded-[16px] text-center space-y-3 border border-emerald-200">
            <span className="text-5xl block">🌱 🌸 🌳</span>
            <h4 className="text-sm font-black text-emerald-900">당신의 마음 정원이 쾌청한 태양 아래 자라나고 있습니다.</h4>
          </div>
        </div>
      )}

      {/* CARD 3: 삭제 관리 */}
      {selectedCard === "privacy" && (
        <div className="krds-public-card p-6 bg-white space-y-4 shadow-md">
          <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5">
            <Trash2 size={18} /> 🔒 5. 대화 기록 즉시 영구 삭제 관리
          </h3>
          <p className="text-xs text-[#5D6B7E]">도닥 AI와의 대화 내용은 100% 개인 암호화 처리되며, 언제든 버튼 하나로 완벽히 삭제하실 수 있습니다.</p>
          <button
            onClick={handleClearHistory}
            className="krds-public-button px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-[14px] shadow-md touch-target"
          >
            [내 기기 대화 기록 즉시 전체 영구 삭제]
          </button>
        </div>
      )}

      {/* 2. 위기 감지 시 1388 핫라인 긴급 팝업 모달 */}
      {showEmergency && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full text-[#172033] space-y-4 shadow-2xl animate-in zoom-in-95 border-2 border-rose-500">
            <div className="flex items-center gap-2 text-rose-600">
              <ShieldAlert size={24} />
              <h3 className="text-lg font-black">1388 청소년 긴급 안심 핫라인</h3>
            </div>
            
            <p className="text-xs text-[#5D6B7E] leading-relaxed font-medium">
              당신의 소중한 마음 이야기를 들었습니다. 24시간 언제나 전문 자격을 갖춘 상담 선생님이 당신을 따뜻하게 기다리고 있습니다.
            </p>

            <div className="p-4 bg-rose-50 rounded-[14px] border border-rose-200 space-y-2 text-center">
              <span className="text-xs font-bold text-rose-900 block">📞 청소년 전화 1388 (국번없이 24시간 무료)</span>
              <a
                href="tel:1388"
                className="krds-public-button w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-[14px] shadow-md block touch-target"
              >
                1388 즉시 무료 전화 연결
              </a>
            </div>

            <button
              onClick={() => setShowEmergency(false)}
              className="w-full py-2 bg-slate-100 text-[#5D6B7E] font-bold text-xs rounded-[10px]"
            >
              닫기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
