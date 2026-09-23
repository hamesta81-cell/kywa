"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ArrowRight, RefreshCw, Trophy, Sparkles, CheckCircle2, ChevronLeft, AlertTriangle, Play, HelpCircle, Smartphone, ExternalLink, Zap, Clock, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";

interface Scenario {
  id: number;
  sender: string;
  category: string;
  message: string;
  url: string;
  isPhishing: boolean;
  explanation: string;
  dangerPoints: string[];
}

export default function PhishingCheckPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answersHistory, setAnswersHistory] = useState<{ isCorrect: boolean; scenario: Scenario }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  const scenarios: Scenario[] = [
    {
      id: 1,
      sender: "[CJ대한통운]",
      category: "택배 배송",
      message: "[CJ대한통운] 고객님의 상품이 도로명 주소 불일치로 배송이 보류되었습니다. 주소지를 재확인해 주시기 바랍니다.",
      url: "http://cj-parcel-kr.xyz/delivery?no=849204",
      isPhishing: true,
      explanation: "공식 택배사는 '.xyz' 같은 비정상 도메인을 사용하지 않으며, 앱 설치나 개인정보 입력을 요구하는 링크를 문자로 발송하지 않습니다.",
      dangerPoints: ["비공식 TLD(.xyz) 도메인 사용", "보안되지 않은 HTTP 프로토콜", "주소 수정 명목의 악성 apk 다운로드 유도"]
    },
    {
      id: 2,
      sender: "국민건강보험공단",
      category: "공공 알림",
      message: "[국민건강보험공단] 2026년도 일반건강검진 대상자 안내입니다. 대상 여부 확인 및 문진표 작성은 The건강보험 앱 또는 공식 홈페이지에서 가능합니다.",
      url: "https://www.nhis.or.kr",
      isPhishing: false,
      explanation: "대한민국 공공기관 공식 도메인 '.or.kr'을 사용하고 있으며, 불필요한 단축 링크 없이 공식 홈페이지 주소가 명확하게 표시되어 있습니다.",
      dangerPoints: ["안전한 공식 국가기관/공공기관 도메인(.or.kr)", "HTTPS 보안 인증 적용", "앱 강제 설치 유도 없음"]
    },
    {
      id: 3,
      sender: "[모바일 부고장]",
      category: "경조사",
      message: "삼가 고인의 명복을 빕니다. 부고 알림 및 장례식장 위치 안내드립니다.",
      url: "https://bit.ly/3xFuneralNotice2026",
      isPhishing: true,
      explanation: "단축 URL(bit.ly 등)을 사용하는 모바일 부고장은 99% 스미싱입니다. 링크 클릭 시 전화번호부와 금융정보를 탈취하는 악성코드가 즉시 설치됩니다.",
      dangerPoints: ["출처를 숨긴 단축 URL(bit.ly) 사용", "고인 및 상주 실명 부재", "클릭 즉시 악성 앱(.apk) 자동 다운로드 유도"]
    },
    {
      id: 4,
      sender: "[인스타그램 보안팀]",
      category: "SNS 계정",
      message: "[Instagram] 회원님의 계정이 저작권 침해로 신고되었습니다. 24시간 이내 이의제기하지 않을 경우 계정이 영구 정지됩니다.",
      url: "http://instagram-help-verify.center/appeal",
      isPhishing: true,
      explanation: "인스타그램은 절대 일반 SMS나 이상한 도메인으로 계정 정지 경고를 보내지 않으며, 공식 앱 내 [설정 > 보안 > Instagram에서 보낸 이메일] 메뉴에서만 공지합니다.",
      dangerPoints: ["공식 도메인(instagram.com)이 아닌 사칭 주소", "24시간 시간 제한 압박으로 충동 클릭 유도", "계정 비밀번호 탈취용 가짜 로그인 페이지"]
    },
    {
      id: 5,
      sender: "한국청소년활동진흥원",
      category: "청소년활동",
      message: "[KYWA] 2026 청소년 안전문화 숏폼 챌린지 공식 공모 접수 안내입니다. 자세한 공모 요강은 kywasafe.kr 공식 허브에서 확인하세요.",
      url: "https://kywasafe.kr/challenge",
      isPhishing: false,
      explanation: "진흥원 공식 안전 허브 도메인(kywasafe.kr)으로 연결되며, 안전한 암호화 프로토콜(HTTPS)을 준수하고 있습니다.",
      dangerPoints: ["공식 안전 허브 도메인", "정상적인 공모 요강 열람 링크", "불법 개인정보 수집 없음"]
    }
  ];

  const currentScenario = scenarios[currentIndex];

  useEffect(() => {
    if (!timerActive || selectedAnswer !== null || isFinished) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleAnswer(null); // 시간 초과
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, selectedAnswer, timerActive, isFinished]);

  const handleAnswer = (choice: boolean | null) => {
    setSelectedAnswer(choice);
    setTimerActive(false);

    const isCorrect = choice === currentScenario.isPhishing;
    if (isCorrect) {
      setScore((prev) => prev + 20);
    }

    setAnswersHistory((prev) => [
      ...prev,
      { isCorrect, scenario: currentScenario }
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimer(15);
      setTimerActive(true);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswersHistory([]);
    setIsFinished(false);
    setTimer(15);
    setTimerActive(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 max-w-[1000px] mx-auto font-sans space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center">
        <Link
          href="/campaign"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0284C7] font-black text-xs transition-colors"
        >
          <ChevronLeft size={16} /> 안전 미션 허브로 돌아가기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            MISSION 01 • EASY
          </span>
          <span className="text-xs font-black text-[#059669] flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="fill-[#059669]" /> +50 XP
          </span>
        </div>
      </div>

      {/* 미션 헤더 */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-black text-[#0284C7] uppercase tracking-wider">
          <Smartphone size={16} />
          <span>디지털 안전 실전 감별 훈련</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              🔍 피싱 & 스미싱 의심 링크 감별 훈련
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              문자 메시지와 URL의 숨겨진 함정을 파악하고 <strong>[스미싱 의심]</strong> 또는 <strong>[안전 링크]</strong>를 3초 안에 판별하세요!
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">진행도</div>
              <div className="text-base font-black text-slate-800">
                {currentIndex + 1} / {scenarios.length}
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400">현재 점수</div>
              <div className="text-base font-black text-[#0284C7]">{score}점</div>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 가상 스마트폰 문자 시뮬레이터 */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-600">
                    💬
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{currentScenario.sender}</div>
                    <div className="text-[10px] font-medium text-slate-400">{currentScenario.category}</div>
                  </div>
                </div>
                {/* 타이머 바 */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                  timer <= 5 ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" : "bg-slate-50 text-slate-600 border-slate-200"
                }`}>
                  <Clock size={13} />
                  <span>남은 시간: {timer}초</span>
                </div>
              </div>

              {/* 스마트폰 문자 말풍선 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                  {currentScenario.message}
                </p>

                {/* 의심 링크 카드 */}
                <div className="bg-white border-2 border-dashed border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="text-[10px] font-black text-amber-700 uppercase">연결 링크 확인</div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-blue-700 truncate">
                      {currentScenario.url}
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-400 shrink-0" />
                </div>
              </div>
            </div>

            {/* 선택 인터랙션 버튼 */}
            {selectedAnswer === null ? (
              <div className="space-y-2">
                <div className="text-xs font-black text-slate-500 text-center">
                  💡 이 메시지와 링크는 안전한가요, 스미싱인가요?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 hover:border-emerald-500 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <span>정상 안전 링크</span>
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="py-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-300 hover:border-rose-500 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <ShieldAlert size={20} className="text-rose-600" />
                    <span>스미싱 의심 링크!</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 판별 결과 피드백 박스 */}
                <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                  selectedAnswer === currentScenario.isPhishing
                    ? "bg-emerald-50/80 border-emerald-400 text-emerald-950"
                    : "bg-rose-50/80 border-rose-400 text-rose-950"
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedAnswer === currentScenario.isPhishing ? (
                      <>
                        <CheckCircle2 size={22} className="text-emerald-600 fill-white" />
                        <h4 className="text-base font-black text-emerald-900">정답입니다! (+20점)</h4>
                      </>
                    ) : (
                      <>
                        <XCircle size={22} className="text-rose-600 fill-white" />
                        <h4 className="text-base font-black text-rose-900">
                          {selectedAnswer === null ? "시간 초과!" : "오답입니다!"}
                        </h4>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {currentScenario.explanation}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-slate-900 hover:bg-[#0284C7] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>{currentIndex + 1 < scenarios.length ? "다음 문제 풀기" : "최종 결과 확인하기"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* 우측 핵심 판별 수칙 가이드 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <span>스미싱 3초 감별 체크포인트</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-rose-500 font-black">1.</span>
                  <span><strong>도메인 주소 확인</strong>: .xyz, .top, .cc 등 생소한 확장자나 철자 오타(g00gle 등)는 100% 가짜</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-rose-500 font-black">2.</span>
                  <span><strong>단축 URL 주의</strong>: bit.ly, url.kr 등 원본 주소를 숨긴 단축 링크는 절대 클릭 금지</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-rose-500 font-black">3.</span>
                  <span><strong>시간 압박 심리 유도</strong>: "24시간 내 미확인 시 계정 삭제/과태료 부과"는 대표적 사기 수법</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-rose-500 font-black">4.</span>
                  <span><strong>신고 및 상담</strong>: 의심 문자 발견 시 <strong>국번없이 118</strong>(한국인터넷진흥원) 무료 신고</span>
                </li>
              </ul>
            </div>

            {selectedAnswer !== null && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-2.5">
                <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>이번 문항의 핵심 단서</span>
                </h4>
                <ul className="text-xs text-amber-900 font-medium space-y-1">
                  {currentScenario.dangerPoints.map((dp, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      • {dp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 최종 완료 화면 */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
            🏆
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              MISSION COMPLETED!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              스미싱 감별 훈련 완료!
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              총 {scenarios.length}개 시나리오 중{" "}
              <strong className="text-[#0284C7] font-black">{score / 20}개</strong> 정답 판별!
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 font-bold">최종 훈련 점수</div>
              <div className="text-2xl font-black text-slate-900">{score}점</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">보상 획득</div>
              <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                <Zap size={20} className="fill-emerald-600" /> +50 XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleRestart}
              className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={14} /> 다시 풀기
            </button>
            <Link
              href="/campaign"
              className="py-3 px-6 bg-[#0284C7] hover:bg-sky-600 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Trophy size={14} /> 다른 퀵 미션 도전하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
