"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  ChevronLeft,
  Sun,
  CloudRain,
  Heart,
  Trash2,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Trophy,
  Droplets,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { markMissionJoined, useMissionTracking } from "@/lib/missionTracking";

type ChatMessage = {
  role: "ai" | "user";
  text: string;
  time?: string;
};

const STORAGE_KEY = "dodac_saved_chat_v1";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "ai",
    text: "안녕하세요. 여기는 당신만을 위한 비공개 힐링 공간, '도닥'입니다. 오늘 당신의 마음 날씨는 어떤가요? 어떤 이야기든 편하게 들려주세요. 💜",
  },
];

const MOOD_WEATHERS = [
  { id: "sunny", label: "☀️ 맑음", msg: "오늘 마음 날씨는 맑음이에요. 기분 좋은 에너지를 나누고 싶어요!" },
  { id: "cloudy", label: "⛅ 구름 조금", msg: "마음에 구름이 조금 낀 것처럼 괜히 싱숭생숭하고 생각이 많아요." },
  { id: "rainy", label: "🌧️ 비 내림", msg: "오늘 마음 날씨는 비가 내려요. 조금 우울하고 지치네요." },
  { id: "stormy", label: "⛈️ 천둥번개", msg: "마음속에 천둥번개가 치는 것처럼 스트레스 받고 답답해요." },
];

const GARDEN_STAGES = [
  {
    level: 1,
    icon: "🌱",
    name: "작은 희망 씨앗",
    desc: "내 마음을 들여다보기 시작한 첫걸음이에요. 대화를 나누면 새싹이 자라납니다.",
  },
  {
    level: 2,
    icon: "🌿",
    name: "파릇파릇한 새싹",
    desc: "솔직한 감정을 표현한 덕분에 따뜻한 마음 토양에서 초록빛 새싹이 돋아났어요.",
  },
  {
    level: 3,
    icon: "🌷",
    name: "수줍은 꽃봉오리",
    desc: "스스로를 다독이는 힘이 자라나 곧 예쁜 꽃을 피울 준비를 마쳤어요.",
  },
  {
    level: 4,
    icon: "🌸",
    name: "활짝 핀 힐링 꽃",
    desc: "따뜻한 공감과 위로 속에서 당신만의 아름다운 마음 꽃이 활짝 피어났습니다.",
  },
  {
    level: 5,
    icon: "🌳",
    name: "울창한 마음 안식처 나무",
    desc: "어떤 바람에도 흔들리지 않고 나에게 그늘을 만들어 주는 든든한 힐링 나무로 성장했어요!",
  },
];

function isCrisisText(text: string): boolean {
  const crisisKeywords = ["죽고싶", "죽고 싶", "자살", "자해", "살기싫", "살기 싫", "괴로워", "사라지고 싶", "끝내고 싶"];
  return crisisKeywords.some(k => text.includes(k));
}

function generateDodacReply(input: string, turnCount: number): string[] {
  const t = input.trim();

  if (t.includes("맑음") || t.includes("기분 좋") || t.includes("행복")) {
    return [
      "마음 날씨가 맑다니 저도 덩달아 기분이 밝아져요! ☀️ 오늘처럼 기분 좋은 순간의 감정을 마음속에 꼭 저장해 두세요.",
      "오늘 가장 기분 좋았던 작은 순간 하나를 더 떠올려 볼까요? 마음 정원에도 따뜻한 햇살이 가득 비추고 있어요. 🌱",
    ];
  }

  if (t.includes("학업") || t.includes("성적") || t.includes("시험") || t.includes("공부") || t.includes("진로") || t.includes("미래") || t.includes("대학")) {
    return [
      "정말 고생 많았어요. 성적과 앞으로의 진로 때문에 마음이 무겁고 숨이 턱 막히는 기분이 들었겠어요. 남들의 속도에 맞추려다 보면 내 마음이 지치기 쉬워요.",
      "지금 당장 모든 걸 완벽하게 해내지 않아도 괜찮아요. 오늘은 '가장 작은 할 일 1가지'만 가볍게 끝내고, 스스로에게 10분간 좋아하는 음악을 선물해 주는 건 어떨까요? 🌿",
    ];
  }

  if (t.includes("친구") || t.includes("관계") || t.includes("말다툼") || t.includes("서운") || t.includes("싸웠") || t.includes("단톡") || t.includes("소외") || t.includes("외로")) {
    return [
      "소중하게 생각했던 친구 관계에서 마음이 상하면 하루 종일 신경 쓰이고 외로운 마음이 들죠. 네가 그만큼 관계를 소중히 여기는 따뜻한 사람이라 더 아팠을 거예요.",
      "모든 사람에게 항상 좋은 사람일 필요는 없어요. 먼저 내 감정을 '나는 그때 조금 서운했어'라고 솔직하게 인정해 주고, 내 마음이 편안해질 수 있는 거리를 잠시 두어도 괜찮답니다. 💜",
    ];
  }

  if (t.includes("부모") || t.includes("가족") || t.includes("엄마") || t.includes("아빠") || t.includes("집") || t.includes("잔소리")) {
    return [
      "가장 가까운 가족에게 내 마음을 이해받지 못할 때가 제일 답답하고 서럽죠. 내 편이 되어주길 바랐는데 기대와 다른 말을 들으면 마음의 문이 닫히기 마련이에요.",
      "감정이 격해질 때는 바로 부딪히기보다 잠시 심호흡을 한 뒤, '저도 지금 많이 노력하고 있으니 조금만 믿고 기다려 주세요'라고 내 마음을 차분히 전해 보는 건 어떨까요? 🌱",
    ];
  }

  if (t.includes("자존감") || t.includes("비교") || t.includes("SNS") || t.includes("인스타") || t.includes("외모") || t.includes("부족") || t.includes("열등감")) {
    return [
      "SNS 속 다른 사람들의 화려한 장면과 나의 평범한 일상을 비교하다 보면 나만 뒤처지는 것 같아 속상할 때가 있죠. 하지만 꽃마다 피어나는 계절이 모두 다르답니다.",
      "오늘 남들과 비교하는 창을 잠시 닫고, 오늘 하루 내가 해낸 사소한 일(제시간에 일어나기, 도닥에게 마음 털어놓기) 하나를 크게 칭찬해 주세요! 🌸",
    ];
  }

  if (t.includes("무기력") || t.includes("번아웃") || t.includes("피곤") || t.includes("지쳐") || t.includes("지친") || t.includes("귀찮") || t.includes("아무것도") || t.includes("비 내림") || t.includes("우울")) {
    return [
      "아무것도 하기 싫고 무기력한 건 네가 게을러서가 아니라, 그동안 마음 에너지를 정말 많이 썼다는 내 몸과 마음의 신호예요. 지금까지 버텨온 것만으로도 충분히 애썼어요.",
      "배터리가 방전되면 충전 시간이 필요하듯, 오늘만큼은 죄책감 없이 좋아하는 음료 한 잔을 마시며 편안히 쉬어가도 괜찮아요. 당신의 마음 정원에 단비가 내려 새싹을 틔우고 있어요. 🌿",
    ];
  }

  if (t.includes("불안") || t.includes("걱정") || t.includes("긴장") || t.includes("두려") || t.includes("잠이") || t.includes("싱숭생숭") || t.includes("구름")) {
    return [
      "아직 일어나지 않은 일들이 자꾸 떠올라 마음이 불안하고 초조했군요. 불안은 나를 지키기 위한 자연스러운 감정이지만, 너무 커지면 마음을 힘들게 하죠.",
      "지금 저와 함께 '4-7-8 호흡'을 해볼까요? 코로 4초간 숨을 들이마시고, 7초간 멈춘 뒤, 입으로 8초 동안 후— 하고 길게 내쉬어 보세요. 한결 마음이 가벼워질 거예요. 🍃",
    ];
  }

  if (t.includes("화나") || t.includes("짜증") || t.includes("억울") || t.includes("답답") || t.includes("천둥") || t.includes("스트레스")) {
    return [
      "마음속에 천둥번개가 치듯 답답하고 화가 나는 일이 있었군요! 억울하거나 스트레스 받는 상황에서 화가 나는 건 지극히 당연한 감정이에요. 여기서는 마음껏 털어놓아도 돼요.",
      "속에 담아두었던 감정을 이렇게 말로 꺼내는 것만으로도 마음의 온도가 한결 내려간답니다. 지친 당신의 마음 정원이 한 단계 더 단단하게 성장했어요! 🌳",
    ];
  }

  const generalReplies = [
    [
      `"${t.slice(0, 28)}${t.length > 28 ? "..." : ""}" — 마음에 담아두었던 이야기를 용기 내어 들려줘서 고마워요. 혼자 고민하느라 마음이 참 무거웠을 것 같아요.`,
      "당신의 감정은 언제나 소중하고 존중받아야 해요. 조금 더 자세히 이야기해 줄 수 있나요? 도닥이가 끝까지 귀 기울여 들을게요. 🌿",
    ],
    [
      "그랬군요. 누구에게도 쉽게 말하지 못했던 속마음을 이렇게 꺼내어 놓은 것만으로도 이미 마음 치유가 시작된 거예요.",
      "오늘 당신이 나눈 진심 어린 이야기 덕분에 마음 정원에 따뜻한 꽃봉오리가 맺혔어요. 언제든 힘들 때 이곳을 다시 찾아주세요. 🌸",
    ],
  ];

  return generalReplies[turnCount % generalReplies.length];
}

export default function DodacCampaignPage() {
  const [selectedCard, setSelectedCard] = useState<"chat" | "garden" | "privacy">("chat");
  const [storageOption, setStorageOption] = useState<"none" | "local">("none");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [gardenLevel, setGardenLevel] = useState(1);
  const [gardenCheerText, setGardenCheerText] = useState("");
  const [savedCheers, setSavedCheers] = useState<string[]>([
    "오늘 하루도 포기하지 않고 걸어온 나에게 고마워!",
  ]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const hasParticipated = messages.some(m => m.role === "user") || gardenLevel > 1;
  useMissionTracking("dodac", hasParticipated);

  // 기기 저장 옵션 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setStorageOption("local");
          setMessages(parsed.messages);
          if (typeof parsed.gardenLevel === "number") {
            setGardenLevel(Math.min(5, Math.max(1, parsed.gardenLevel)));
          }
        }
      }
    } catch {}
  }, []);

  // 기기 저장 옵션 동기화
  useEffect(() => {
    try {
      if (storageOption === "local") {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ messages, gardenLevel, updatedAt: new Date().toISOString() })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, [storageOption, messages, gardenLevel]);

  // 채팅창 내부 자동 스크롤
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const sendUserMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    // 위기 표현 감지 시 1388 도움 연결 우선
    if (isCrisisText(text)) {
      setShowEmergency(true);
      return;
    }

    const userTurnCount = messages.filter(m => m.role === "user").length;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInputText("");
    setIsTyping(true);
    markMissionJoined("dodac");

    const replies = generateDodacReply(text, userTurnCount);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        ...replies.map(r => ({ role: "ai" as const, text: r })),
      ]);
      setGardenLevel(prev => Math.min(5, prev + 1));
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(inputText);
  };

  const handleNurtureGarden = (actionLabel: string) => {
    markMissionJoined("dodac");
    setGardenLevel(prev => Math.min(5, prev + 1));
    setMessages(prev => [
      ...prev,
      {
        role: "ai",
        text: `${actionLabel} 덕분에 마음 정원이 한 단계 더 싱그럽게 자라났어요! 🌿`,
      },
    ]);
  };

  const handleAddCheer = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = gardenCheerText.trim();
    if (!clean) return;
    markMissionJoined("dodac");
    setSavedCheers(prev => [clean, ...prev]);
    setGardenCheerText("");
    setGardenLevel(prev => Math.min(5, prev + 1));
  };

  // 삭제 범위와 대상 구체적 표시
  const handleClearHistory = () => {
    if (
      confirm(
        "🔒 이 기기에 저장된 도닥 AI 대화 기록을 즉시 영구 삭제하시겠습니까?\n삭제 대상: 사용자의 질문 및 AI 공감 대화 전체 (관리자는 열람 불가)"
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setMessages([
        {
          role: "ai",
          text: "모든 대화 기록이 즉시 영구 삭제되었습니다. 필요할 때 언제든 다시 찾아주세요. 💜",
        },
      ]);
      setGardenLevel(1);
    }
  };

  const currentStage = GARDEN_STAGES[Math.min(GARDEN_STAGES.length - 1, gardenLevel - 1)];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-[1240px] mx-auto font-sans flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-1 text-[#5D6B7E] hover:text-[#7557D9] font-bold text-xs"
        >
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7557D9] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            마음안전 · 힐링 AI 멘토링
          </span>
          {hasParticipated && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="text-xs font-black text-white bg-[#159A83] hover:bg-emerald-700 px-3 py-1 rounded-full shadow-sm transition-all flex items-center gap-1"
            >
              <CheckCircle2 size={13} /> 미션 완료 (+60 XP)
            </button>
          )}
        </div>
      </div>

      {/* 🛡️ 민감 콘텐츠 6대 별도 안심 원칙 공지 배너 */}
      <div className="krds-public-card p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-[16px] space-y-2 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-300 bg-purple-900 px-3 py-0.5 rounded-full border border-cyan-400/30">
            🛡️ 민감 콘텐츠 별도 안심 원칙 적용 안내
          </span>
          <span className="text-[11px] font-bold text-purple-200">개인정보 & 마음 보호 100% 보장</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-200 pt-1">
          <div className="p-2 bg-purple-950/60 rounded-lg border border-white/10">
            • <strong>랭킹 미적용</strong>: 경쟁 점수 및 공개 랭킹 배제
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
        <span className="text-xs font-bold text-[#102A43]">
          🔒 대화 저장 옵션 선택 ({storageOption === "none" ? "현재: 기기에 저장하지 않음" : "현재: 내 브라우저에만 안전 저장 중"}):
        </span>
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
            <h3 className="text-sm font-black mt-2">🌿 나만의 마음 정원 (Lv.{gardenLevel})</h3>
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
          <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#102A43]">🎧 도닥 AI 힐링 대화방</h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentStage.icon} 마음 정원 Lv.{gardenLevel}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearHistory}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 size={13} /> 내 대화 즉시 영구 삭제
              </button>
            </div>
          </div>

          {/* 오늘 나의 마음 날씨 선택 */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-[12px] border border-[#E2E8F0]">
            <span className="text-[11px] font-black text-[#102A43]">오늘의 마음 날씨:</span>
            {MOOD_WEATHERS.map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => sendUserMessage(w.msg)}
                className="px-2.5 py-1 bg-white hover:bg-purple-50 text-[#102A43] hover:text-[#7557D9] text-xs font-bold rounded-full border border-[#E2E8F0] hover:border-purple-200 transition-all shadow-2xs"
              >
                {w.label}
              </button>
            ))}
          </div>

          {/* 대화 창 */}
          <div
            ref={chatContainerRef}
            className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-[14px] border border-[#E2E8F0]"
          >
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
          </div>

          {/* 직접 고민 입력 폼 */}
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="누구에게도 말 못 한 고민이나 오늘 기분을 자유롭게 적어보세요..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-[12px] text-xs font-bold text-[#102A43] focus:outline-none focus:border-[#7557D9] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-5 py-3 bg-[#7557D9] hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs rounded-[12px] shadow-sm transition-all flex items-center gap-1.5 touch-target"
            >
              <Send size={14} />
              <span>전송</span>
            </button>
          </form>

          {/* 추천 대화 문구 버튼 */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#5D6B7E] block">
              원하는 마음 질문을 클릭하거나 위 입력창에 직접 적어보세요:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => sendUserMessage("요즘 학업이랑 성적, 미래 진로 생각 때문에 너무 답답해요.")}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7557D9] text-xs font-bold rounded-[10px] border border-purple-200"
              >
                &ldquo;학업·진로 스트레스 때문에 답답해요&rdquo;
              </button>
              <button
                type="button"
                onClick={() => sendUserMessage("친구와의 관계랑 말다툼 때문에 마음이 많이 상했어요.")}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1558C9] text-xs font-bold rounded-[10px] border border-blue-200"
              >
                &ldquo;친구 관계 때문에 마음이 상했어요&rdquo;
              </button>
              <button
                type="button"
                onClick={() => sendUserMessage("요즘 아무것도 하기 싫고 무기력하고 번아웃이 온 것 같아요.")}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#159A83] text-xs font-bold rounded-[10px] border border-emerald-200"
              >
                &ldquo;무기력하고 번아웃이 온 것 같아요&rdquo;
              </button>
              <button
                type="button"
                onClick={() => sendUserMessage("SNS를 보면 남들과 비교하게 되고 자존감이 낮아져요.")}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-[10px] border border-amber-200"
              >
                &ldquo;남들과 비교되어 자존감이 낮아져요&rdquo;
              </button>
              <button
                type="button"
                onClick={() => sendUserMessage("요즘 살기싫어 힘들고 너무 괴로워요.")}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-[10px] border border-rose-200"
              >
                &ldquo;요즘 너무 힘들고 괴로워요&rdquo; (1388 위기 감지 테스트)
              </button>
            </div>
          </div>

          {hasParticipated && (
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-[12px]">
              <div className="text-xs font-bold text-emerald-900">
                🌿 도닥 AI와 마음을 나누어 힐링 정원이 <strong>Lv.{gardenLevel} ({currentStage.name})</strong>로 자라났어요!
              </div>
              <button
                type="button"
                onClick={() => setShowCompleteModal(true)}
                className="px-4 py-2 bg-[#159A83] hover:bg-emerald-700 text-white text-xs font-black rounded-[10px] shadow-sm transition-all shrink-0"
              >
                힐링 미션 완료 (+60 XP 받기)
              </button>
            </div>
          )}
        </div>
      )}

      {/* CARD 2: 나만의 마음 정원 */}
      {selectedCard === "garden" && (
        <div className="krds-public-card p-6 bg-white space-y-5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-base font-black text-[#102A43]">
                🌿 나만의 마음 정원 (Level {gardenLevel} / 5 · {currentStage.name})
              </h3>
              <p className="text-xs text-[#5D6B7E] mt-0.5">
                AI와의 힐링 대화로 마음을 나누거나 햇살·물을 줄수록 정원의 싹이 트고 예쁜 꽃과 나무가 자라납니다.
              </p>
            </div>
            <span className="text-xs font-black text-[#159A83] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              성장도 {gardenLevel * 20}%
            </span>
          </div>

          {/* 성장 게이지 */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-400 to-[#159A83] h-full rounded-full transition-all duration-500"
              style={{ width: `${gardenLevel * 20}%` }}
            />
          </div>

          {/* 현재 정원 비주얼 */}
          <div className="p-8 bg-emerald-50 rounded-[16px] text-center space-y-3 border border-emerald-200">
            <span className="text-6xl block">{currentStage.icon}</span>
            <h4 className="text-base font-black text-emerald-950">{currentStage.name}</h4>
            <p className="text-xs font-medium text-emerald-800 max-w-md mx-auto leading-relaxed">
              {currentStage.desc}
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleNurtureGarden("☀️ 따뜻한 햇살 비추기")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-[10px] shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sun size={14} /> 따뜻한 햇살 주기
              </button>
              <button
                type="button"
                onClick={() => handleNurtureGarden("💧 맑은 생명수 주기")}
                className="px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-[10px] shadow-sm transition-all flex items-center gap-1.5"
              >
                <Droplets size={14} /> 맑은 물 주기
              </button>
              <button
                type="button"
                onClick={() => setSelectedCard("chat")}
                className="px-4 py-2 bg-[#7557D9] hover:bg-purple-700 text-white text-xs font-black rounded-[10px] shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles size={14} /> 도닥 AI와 대화하러 가기
              </button>
            </div>
          </div>

          {/* 나에게 남기는 응원 한 줄 */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-[#102A43]">💌 나에게 남기는 오늘의 다독임 한마디</h4>
            <form onSubmit={handleAddCheer} className="flex gap-2">
              <input
                type="text"
                value={gardenCheerText}
                onChange={e => setGardenCheerText(e.target.value)}
                placeholder="예: 오늘도 잘 버텨준 나 자신, 정말 대단해!"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-bold focus:outline-none focus:border-[#159A83]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#159A83] hover:bg-emerald-700 text-white text-xs font-black rounded-[10px] shrink-0"
              >
                정원에 심기
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {savedCheers.map((cheer, i) => (
                <span
                  key={i}
                  className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full"
                >
                  🌱 &ldquo;{cheer}&rdquo;
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: 삭제 관리 */}
      {selectedCard === "privacy" && (
        <div className="krds-public-card p-6 bg-white space-y-4 shadow-md">
          <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5">
            <Trash2 size={18} /> 🔒 대화 기록 즉시 영구 삭제 관리
          </h3>
          <p className="text-xs text-[#5D6B7E] leading-relaxed">
            도닥 AI와의 대화 내용은 서버에 전송·보관되지 않으며 관리자가 열람할 수 없습니다. 언제든 아래 버튼을 눌러 현재 화면과 기기의 대화 기록을 1초 만에 완벽히 삭제하실 수 있습니다.
          </p>
          <div className="p-4 bg-slate-50 rounded-[12px] border border-[#E2E8F0] text-xs space-y-1 text-[#102A43]">
            <div>• <strong>현재 대화 메시지 수</strong>: {messages.length}건</div>
            <div>• <strong>기기 로컬 저장 상태</strong>: {storageOption === "local" ? "내 브라우저에 저장 중" : "저장 안 함 (휘발성 세션)"}</div>
          </div>
          <button
            onClick={handleClearHistory}
            className="krds-public-button px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-[14px] shadow-md touch-target"
          >
            [내 기기 대화 기록 즉시 전체 영구 삭제]
          </button>
        </div>
      )}

      {/* 미션 완료 보상 모달 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full text-[#172033] space-y-4 shadow-2xl border border-purple-200 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-100 text-[#7557D9] flex items-center justify-center mx-auto">
              <Trophy size={28} />
            </div>
            <span className="text-[11px] font-black text-[#7557D9] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block">
              마음안전 미션 클리어
            </span>
            <h3 className="text-xl font-black text-[#102A43]">
              도닥 AI 또래 힐링 상담 완료!
            </h3>
            <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">
              내 마음의 소리에 귀 기울이고 따뜻한 위로의 시간을 가졌습니다. 마음 정원({currentStage.name})과 함께 <strong>+60 XP</strong>를 획득했습니다!
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[#102A43] font-bold text-xs rounded-[12px]"
              >
                대화 계속하기
              </button>
              <Link
                href="/campaign"
                className="flex-1 py-3 bg-[#7557D9] hover:bg-purple-700 text-white font-black text-xs rounded-[12px] block"
              >
                미션 허브로 이동
              </Link>
            </div>
          </div>
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
              당신의 소중한 마음 이야기를 들었습니다. 혼자 감당하기 버거운 순간에는 24시간 언제나 전문 자격을 갖춘 상담 선생님이 당신을 따뜻하게 기다리고 있습니다.
            </p>

            <div className="p-4 bg-rose-50 rounded-[14px] border border-rose-200 space-y-2 text-center">
              <span className="text-xs font-bold text-rose-900 block">
                📞 청소년 전화 1388 (국번없이 24시간 무료 · 문자/카톡 상담 가능)
              </span>
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
