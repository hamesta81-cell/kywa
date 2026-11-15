// 당첨자 발표 안내. 메인 팝업(MainPopups)과 /notice/… 발표 쪽이 읽는다.
// 명단 이미지는 이름 가운데 글자를 가리고 휴대전화 번호는 끝 4자리만 적은 게시용 판이다.
export type WinnersNotice = {
  id: string;
  path: string;
  title: string;
  popupImage: string;
  popupSize: { width: number; height: number };
  fullImage: string;
  fullSize: { width: number; height: number };
  showFrom: string; // 팝업을 띄우는 기간
  showUntil: string;
  hideKey: string; // '오늘 하루 보지 않기' 저장 이름
  intro: string;
  rows: [string, string][];
  notes: string[];
};

const CONTACT = "청소년 안전문화 확산 운영사무국 02-2088-8456";
const MASK_NOTE = "개인정보 보호를 위해 이름 가운데 글자를 가리고, 휴대전화 번호는 끝 4자리만 적었습니다.";

// 한눈정보 안전 퀴즈 이벤트(11. 10. 추첨, 11. 12. 발표)
export const QUIZ_WINNERS_NOTICE: WinnersNotice = {
  id: "hannun-quiz-winners-2026",
  path: "/notice/quiz-winners",
  title: "한눈정보 안전 퀴즈 이벤트 정답 및 당첨자 발표",
  popupImage: "/images/quiz/hannun_quiz_winners_popup.png",
  popupSize: { width: 1000, height: 1150 },
  fullImage: "/images/quiz/hannun_quiz_winners_20261110.png",
  fullSize: { width: 1000, height: 4948 },
  showFrom: "2026-11-12T00:00:00+09:00",
  showUntil: "2026-11-30T23:59:59+09:00",
  hideKey: "hide_quiz_winners_popup",
  intro: "「한눈정보 안전 퀴즈 이벤트」 정답과 당첨자를 발표합니다. 참여해 주신 모든 분께 감사드립니다.",
  rows: [
    ["이벤트 기간", "2026. 10. 30.(금) ~ 11. 9.(월)"],
    ["이벤트 내용", "한눈정보를 읽고 안전 퀴즈 5문제 풀기"],
    ["이벤트 상품", "CU 편의점 모바일상품권(5,000원 상당) 100명"],
    ["이벤트 결과", "응모 5,868건 / 5문항 모두 정답 5,065건 / 당첨자 100명"],
    ["상품 발송", "응모 때 입력한 휴대전화 번호로 모바일상품권을 보내 드립니다."],
    ["문의", CONTACT],
  ],
  notes: [
    "추첨은 1인 1회 응모 원칙에 따라 중복 응모를 제외하고, 정해진 시각에 공개되는 난수(미국 국립표준기술연구소 NIST 난수 비컨)로 진행했습니다. 추첨 확인 코드 6871-229F",
    MASK_NOTE,
  ],
};

// 참여자 만족도 조사 경품(11. 15. 추첨, 11. 16. 발표)
export const SURVEY_WINNERS_NOTICE: WinnersNotice = {
  id: "satisfaction-survey-winners-2026",
  path: "/notice/survey-winners",
  title: "참여자 만족도 조사 경품 당첨자 발표",
  popupImage: "/images/quiz/survey_winners_popup.png",
  popupSize: { width: 1000, height: 1150 },
  fullImage: "/images/quiz/survey_winners_20261115.png",
  fullSize: { width: 1000, height: 4968 },
  showFrom: "2026-11-15T00:00:00+09:00",
  showUntil: "2026-11-30T23:59:59+09:00",
  hideKey: "hide_survey_winners_popup",
  intro: "「참여자 만족도 조사」 경품 당첨자를 발표합니다. 설문에 참여해 주신 모든 분께 감사드리며, 보내 주신 의견은 내년 사업에 반영하겠습니다.",
  rows: [
    ["조사 기간", "2026. 11. 11.(수) ~ 11. 14.(토)"],
    ["참여 인원", "736명"],
    ["경품", "CU 편의점 모바일상품권(5,000원 상당) 200명(선착순 100명, 추첨 100명)"],
    ["상품 발송", "응모 때 입력한 휴대전화 번호로 모바일상품권을 보내 드립니다."],
    ["문의", CONTACT],
  ],
  notes: [
    "선착순은 경품 응모 접수 순서(응모번호 1~100번)로 정했습니다. 응모는 휴대전화 번호당 1회만 받았습니다.",
    "추첨은 선착순 당첨자를 뺀 636명을 대상으로, 정해진 회차에 공개되는 난수(drand 공개 난수, League of Entropy)로 진행했습니다. 추첨 확인 코드 C1BC-7095",
    "명단의 표기가 같더라도 상품 문자를 받으신 분이 당첨자입니다. " + MASK_NOTE,
  ],
};

// 팝업은 최근 발표가 앞에 온다
export const WINNERS_NOTICES: WinnersNotice[] = [SURVEY_WINNERS_NOTICE, QUIZ_WINNERS_NOTICE];

export function activeWinnersNotices(now: Date = new Date()) {
  return WINNERS_NOTICES.filter(n => now >= new Date(n.showFrom) && now <= new Date(n.showUntil));
}
