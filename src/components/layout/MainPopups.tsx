"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SurveyCard, { SURVEY_HIDE_KEY, surveyPopupWanted } from "@/components/survey/SurveyPopup";
import WinnersCard from "@/components/notice/WinnersCard";
import { activeWinnersNotices, WINNERS_NOTICES } from "@/data/winnersNotice";

const todayKst = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
const SURVEY = "survey";

// 메인 화면 안내 팝업 모음: 겹치지 않게 나란히(좁은 화면은 위아래로) 띄운다. 칸마다 '오늘 하루 보지 않기' 존중
export default function MainPopups() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string[]>([]);

  useEffect(() => {
    if (pathname !== "/") return;
    const want: string[] = [];
    try {
      const today = todayKst();
      for (const n of activeWinnersNotices()) {
        if (localStorage.getItem(n.hideKey) !== today) want.push(n.id);
      }
      if (surveyPopupWanted() && localStorage.getItem(SURVEY_HIDE_KEY) !== today) want.push(SURVEY);
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage는 브라우저에서만 읽을 수 있다
    setOpen(want);
  }, [pathname]);

  const close = (id: string, hideToday: boolean) => {
    if (hideToday) {
      try {
        const key = id === SURVEY ? SURVEY_HIDE_KEY : WINNERS_NOTICES.find(n => n.id === id)?.hideKey;
        if (key) localStorage.setItem(key, todayKst());
      } catch {}
    }
    setOpen(o => o.filter(x => x !== id));
  };

  if (pathname !== "/" || open.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 overflow-y-auto" onClick={() => setOpen([])}>
      <div className="min-h-full flex flex-col md:flex-row items-center md:items-start justify-center gap-4 p-4 md:pt-16">
        {WINNERS_NOTICES.filter(n => open.includes(n.id)).map(n => (
          <WinnersCard key={n.id} notice={n} onClose={h => close(n.id, h)} />
        ))}
        {open.includes(SURVEY) && <SurveyCard onClose={h => close(SURVEY, h)} />}
      </div>
    </div>
  );
}
