"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, CalendarDays, Clock } from "lucide-react";
import { SATISFACTION_SURVEY as S, surveyStatus } from "@/data/satisfactionSurvey";

const HIDE_KEY = "hide_satisfaction_survey_popup";
const todayKst = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

// 만족도 조사 안내 팝업: 메인 화면에서, 조사 기간에만, '오늘 하루 보지 않기' 존중
export default function SurveyPopup() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (surveyStatus() === "open" && localStorage.getItem(HIDE_KEY) !== todayKst()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 브라우저에서만 읽을 수 있다
        setShow(true);
      }
    } catch {}
  }, [pathname]);

  const close = (hideToday: boolean) => {
    if (hideToday) {
      try {
        localStorage.setItem(HIDE_KEY, todayKst());
      } catch {}
    }
    setShow(false);
  };

  if (!show || pathname !== "/") return null;

  const rows = [
    { icon: CalendarDays, label: "조사 기간", value: S.periodLabel },
    { icon: Clock, label: "소요 시간", value: "약 3~5분" },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => close(false)}>
      <div role="dialog" aria-modal="true" aria-label={`${S.title} 안내`}
        className="relative w-full max-w-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={() => close(false)} className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50" aria-label="팝업 닫기">
          <X size={18} />
        </button>

        <Link href={S.path} onClick={() => close(false)} className="block">
          <div className="bg-[#FFD83D] px-6 pt-8 pb-6">
            <p className="text-xs font-black tracking-wide text-[#E8322B]">2026 청소년활동 안전문화 확산 사업</p>
            <h2 className="mt-2 text-[26px] leading-tight font-black text-[#142B63] break-keep">
              참여자 만족도 조사
            </h2>
            <p className="mt-2 text-sm font-bold text-[#142B63]/80 leading-relaxed break-keep">
              안전홍보단, 공모전, 캠페인에 참여하셨나요? 3분만 의견을 들려주세요.
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="rounded-xl bg-[#142B63] text-white text-center px-4 py-4">
              <p className="text-xs font-bold text-white/70">참여하신 분께</p>
              <p className="mt-1 text-lg font-black break-keep">{S.prize}</p>
              <p className="mt-1 text-sm font-black text-[#FFD83D]">{S.winnersLabel}</p>
            </div>
            <dl className="divide-y divide-slate-200 border-y border-slate-200">
              {rows.map(r => (
                <div key={r.label} className="flex gap-3 py-2 text-sm">
                  <dt className="flex items-center gap-1.5 w-24 shrink-0 font-bold text-[#E8322B]">
                    <r.icon size={14} /> {r.label}
                  </dt>
                  <dd className="text-slate-800 font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Link>

        <Link href={S.path} onClick={() => close(false)} className="block py-3 text-center font-black text-white bg-[#142B63] hover:bg-[#1d3a80]">
          설문 참여하기
        </Link>
        <div className="flex justify-between px-4 py-2.5 text-xs font-bold text-slate-500">
          <button onClick={() => close(true)} className="hover:text-slate-900">오늘 하루 보지 않기</button>
          <button onClick={() => close(false)} className="hover:text-slate-900">닫기</button>
        </div>
      </div>
    </div>
  );
}
