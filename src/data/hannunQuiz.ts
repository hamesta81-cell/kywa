// 2026 한눈정보 안전 퀴즈 이벤트 (KYWA 공지사항 '안전' 카테고리 한눈정보 기반)
// 정답은 공개 저장소에 두지 않는다. 채점은 마감 뒤 관리자 CSV로 따로 한다.

export type QuizQuestion = {
  no: number;
  kind: "choice" | "ox";
  text: string;
  options: string[];
  source: { title: string; date: string; url: string };
};

const KYWA_POST = "https://www.kywa.or.kr/pressinfo/notice_view.jsp?cate=BEC8C0FC&no=";

export const HANNUN_QUIZ = {
  id: "hannun-quiz-2026",
  title: "한눈정보 안전 퀴즈 이벤트",
  startsAt: "2026-10-30T00:00:00+09:00",
  endsAt: "2026-11-09T23:59:59+09:00",
  periodLabel: "2026. 10. 30.(금) ~ 11. 9.(월)",
  announceLabel: "2026. 11. 12.(목)",
  prize: "CU 편의점 모바일상품권(5,000원 상당)",
  winners: 100,
  contact: "청소년 안전문화 확산 운영사무국 02-2088-8456",
  hint: "한국청소년활동진흥원 홈페이지 › 알림마당 › 공지사항 › ‘안전’ 카테고리의 한눈정보",
  popupImage: "/images/quiz/hannun_quiz_popup_800_cu.png",
  questions: [
    {
      no: 1,
      kind: "choice",
      text: "QR코드와 피싱(Phishing)을 합친 말로, 악성 QR코드를 이용한 해킹을 뜻하는 것은?",
      options: ["스미싱", "큐싱", "파밍", "메모리해킹"],
      source: { title: "큐싱·스미싱 안전수칙", date: "2026. 5. 19.", url: KYWA_POST + "36351" },
    },
    {
      no: 2,
      kind: "choice",
      text: "살모넬라균 감염을 예방하려면 냉동식품은 몇 ℃ 이하에서 보관해야 할까요?",
      options: ["0℃", "-5℃", "-10℃", "-18℃"],
      source: { title: "여름철 식중독 예방을 위한 살모넬라균 감염증", date: "2026. 6. 9.", url: KYWA_POST + "36411" },
    },
    {
      no: 3,
      kind: "ox",
      text: "생성형 AI로 만든 결과물은 누구나 마음대로 이용할 수 있다.",
      options: ["O", "X"],
      source: { title: "생성형 AI 활용 결과물 책임 있게 사용하기", date: "2026. 8. 25.", url: KYWA_POST + "36699" },
    },
    {
      no: 4,
      kind: "choice",
      text: "벌초·성묘 때 벌 쏘임을 예방하는 옷차림으로 알맞은 것은?",
      options: [
        "몸에 딱 맞는 긴소매의 밝은색 옷",
        "헐렁한 반소매의 어두운색 옷",
        "몸에 딱 맞는 반소매의 어두운색 옷",
        "헐렁한 긴소매의 어두운색 옷",
      ],
      source: { title: "벌초, 성묘 대비 벌 쏘임 예방 및 응급처치", date: "2026. 9. 15.", url: KYWA_POST + "36777" },
    },
    {
      no: 5,
      kind: "choice",
      text: "응급상황 행동요령 ‘3C’의 순서로 옳은 것은?",
      options: ["CHECK → CARE → CALL", "CALL → CHECK → CARE", "CHECK → CALL → CARE", "CARE → CALL → CHECK"],
      source: { title: "청소년활동 중 응급상황 발생 시 행동요령", date: "2026. 9. 28.", url: KYWA_POST + "36801" },
    },
  ] as QuizQuestion[],
};

export function quizStatus(now: Date = new Date()): "before" | "open" | "closed" {
  if (now < new Date(HANNUN_QUIZ.startsAt)) return "before";
  if (now > new Date(HANNUN_QUIZ.endsAt)) return "closed";
  return "open";
}
