// 한눈정보 안전 퀴즈 이벤트 정답 및 당첨자 발표(11. 10. 추첨, 11. 12. 발표). 메인 팝업과 /notice/quiz-winners 쪽이 읽는다.
// 명단 이미지는 이름 가운데 글자를 가리고 휴대전화 번호는 끝 4자리만 적은 게시용 판이다.
export const QUIZ_WINNERS_NOTICE = {
  id: "hannun-quiz-winners-2026",
  path: "/notice/quiz-winners",
  title: "한눈정보 안전 퀴즈 이벤트 정답 및 당첨자 발표",
  popupImage: "/images/quiz/hannun_quiz_winners_popup.png",
  popupSize: { width: 1000, height: 1150 },
  fullImage: "/images/quiz/hannun_quiz_winners_20261110.png",
  fullSize: { width: 1000, height: 4948 },
  // 팝업을 띄우는 기간
  showFrom: "2026-11-12T00:00:00+09:00",
  showUntil: "2026-11-30T23:59:59+09:00",
  periodLabel: "2026. 10. 30.(금) ~ 11. 9.(월)",
  content: "한눈정보를 읽고 안전 퀴즈 5문제 풀기",
  prize: "CU 편의점 모바일상품권(5,000원 상당) 100명",
  result: "응모 5,868건 / 5문항 모두 정답 5,065건 / 당첨자 100명",
  delivery: "응모 때 입력한 휴대전화 번호로 모바일상품권을 보내 드립니다.",
  drawNote: "추첨은 1인 1회 응모 원칙에 따라 중복 응모를 제외하고, 정해진 시각에 공개되는 난수(미국 국립표준기술연구소 NIST 난수 비컨)로 진행했습니다. 추첨 확인 코드 6871-229F",
  contact: "청소년 안전문화 확산 운영사무국 02-2088-8456",
};

export function winnersPopupActive(now: Date = new Date()) {
  return now >= new Date(QUIZ_WINNERS_NOTICE.showFrom) && now <= new Date(QUIZ_WINNERS_NOTICE.showUntil);
}
