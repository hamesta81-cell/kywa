import type { Metadata } from "next";
import WinnersNoticePage from "@/components/notice/WinnersNoticePage";
import { QUIZ_WINNERS_NOTICE as W } from "@/data/winnersNotice";

export const metadata: Metadata = {
  title: `${W.title} | PLAY SAFE 2026`,
  description: W.rows.map(r => r.join(" ")).join(", "),
};

// 한눈정보 안전 퀴즈 이벤트 정답 및 당첨자 발표
export default function QuizWinnersPage() {
  return <WinnersNoticePage notice={W} />;
}
