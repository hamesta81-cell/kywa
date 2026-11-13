"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SurveyCard, { SURVEY_HIDE_KEY, surveyPopupWanted } from "@/components/survey/SurveyPopup";
import WinnersCard, { WINNERS_HIDE_KEY } from "@/components/notice/WinnersCard";
import { winnersPopupActive } from "@/data/winnersNotice";

const todayKst = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

type Key = "winners" | "survey";
const HIDE: Record<Key, string> = { winners: WINNERS_HIDE_KEY, survey: SURVEY_HIDE_KEY };

// 메인 화면 안내 팝업 모음: 겹치지 않게 나란히(좁은 화면은 위아래로) 띄운다. 칸마다 '오늘 하루 보지 않기' 존중
export default function MainPopups() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Key[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;
    const want: Key[] = [];
    try {
      const today = todayKst();
      if (winnersPopupActive() && localStorage.getItem(HIDE.winners) !== today) want.push("winners");
      if (surveyPopupWanted() && localStorage.getItem(HIDE.survey) !== today) want.push("survey");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 브라우저에서만 읽을 수 있다
    setOpen(want);
  }, [pathname]);

  const close = (k: Key, hideToday: boolean) => {
    if (hideToday) {
      try {
        localStorage.setItem(HIDE[k], todayKst());
      } catch {}
    }
    setOpen(o => o.filter(x => x !== k));
  };

  if (pathname !== "/" || open.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 overflow-y-auto" onClick={() => setOpen([])}>
      <div className="min-h-full flex flex-col md:flex-row items-center md:items-start justify-center gap-4 p-4 md:pt-16">
        {open.includes("winners") && <WinnersCard onClose={h => close("winners", h)} />}
        {open.includes("survey") && <SurveyCard onClose={h => close("survey", h)} />}
      </div>
    </div>
  );
}
