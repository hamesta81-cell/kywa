import type { Metadata } from "next";
import WinnersNoticePage from "@/components/notice/WinnersNoticePage";
import { SURVEY_WINNERS_NOTICE as W } from "@/data/winnersNotice";

export const metadata: Metadata = {
  title: `${W.title} | PLAY SAFE 2026`,
  description: W.rows.map(r => r.join(" ")).join(", "),
};

// 참여자 만족도 조사 경품 당첨자 발표
export default function SurveyWinnersPage() {
  return <WinnersNoticePage notice={W} />;
}
