// 2026 청소년활동 안전문화 확산(국민참여형) 사업 참여자 만족도·인지도 조사
// 설문 응답과 경품 응모 정보(이름·휴대전화)는 서로 다른 파일에 따로 저장한다.

export type SurveyGroup = "crew" | "contest" | "campaign";

export type SurveyOption = { label: string; group?: SurveyGroup };

export type SurveyQuestion = {
  id: string;
  kind: "single" | "multi" | "select" | "scale" | "text";
  text: string;
  options?: SurveyOption[];
  optional?: boolean;
};

export type SurveySection = {
  id: string;
  title: string;
  note?: string;
  // 값이 있으면 '참여한 사업'(a4)에서 해당 묶음을 고른 사람에게만 보인다.
  group?: SurveyGroup;
  questions: SurveyQuestion[];
};

export const SCALE_LABELS = ["전혀 그렇지 않다", "그렇지 않다", "보통이다", "그렇다", "매우 그렇다"];

const opts = (...labels: string[]): SurveyOption[] => labels.map(label => ({ label }));
const scale = (id: string, text: string): SurveyQuestion => ({ id, kind: "scale", text });

// 참여 사업을 묻는 문항. 여기서 고른 묶음에 따라 D영역이 갈린다.
export const PROGRAM_QUESTION_ID = "a4";

export const SATISFACTION_SURVEY = {
  id: "satisfaction-survey-2026",
  path: "/survey",
  apiPath: "/api/survey",
  entryPrefix: "SV-2026",
  csvName: "satisfaction_survey",
  title: "청소년 안전문화 확산 사업 참여자 만족도 조사",
  startsAt: "2026-11-11T00:00:00+09:00",
  endsAt: "2026-11-13T23:59:59+09:00",
  periodLabel: "2026. 11. 11.(수) ~ 11. 13.(금)",
  announceLabel: "2026. 11. 16.(월)",
  prize: "CU 편의점 모바일상품권(5,000원 상당)",
  // 선착순은 경품 응모자 CSV의 응모번호 순서(E00001~E00100)로 가린다.
  winnersLabel: "선착순 100명 + 추첨 100명",
  contact: "청소년 안전문화 확산 운영사무국 02-2088-8456",
  sections: [
    {
      id: "A",
      title: "응답자 정보",
      questions: [
        {
          id: "a1",
          kind: "single",
          text: "어디에 해당하시나요?",
          options: opts("중학생", "고등학생", "대학생·청년", "청소년지도자·교사", "학부모·보호자", "그 밖의 일반 시민"),
        },
        {
          id: "a2",
          kind: "single",
          text: "연령대를 골라 주세요.",
          options: opts("13세 이하", "14~16세", "17~19세", "20대", "30대", "40대 이상"),
        },
        {
          id: "a3",
          kind: "select",
          text: "사는 곳(시·도)을 골라 주세요.",
          options: opts(
            "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기",
            "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
          ),
        },
        {
          id: PROGRAM_QUESTION_ID,
          kind: "multi",
          text: "올해 참여한 사업을 모두 골라 주세요.",
          options: [
            { label: "청소년 안전홍보단", group: "crew" },
            { label: "AI활용 청소년활동 안전공모전", group: "contest" },
            { label: "PLAY SAFE 숏폼 챌린지", group: "contest" },
            { label: "안전 캠페인(안전 미션, 한눈정보 퀴즈 이벤트 등)", group: "campaign" },
          ],
        },
      ],
    },
    {
      id: "B",
      title: "사업 인지도",
      questions: [
        {
          id: "b1",
          kind: "single",
          text: "참여하기 전에 ‘청소년활동 안전문화 확산 사업’을 알고 있었나요?",
          options: opts("잘 알고 있었다", "들어본 적은 있다", "전혀 몰랐다"),
        },
        {
          id: "b2",
          kind: "single",
          text: "이 사업을 처음 알게 된 경로는 무엇인가요?",
          options: opts(
            "SNS(인스타그램, 유튜브 등)",
            "학교·청소년기관 안내",
            "한국청소년활동진흥원 홈페이지",
            "PLAY SAFE 플랫폼(kywasafe.kr)",
            "친구·가족·지인 추천",
            "언론·광고",
            "기타",
          ),
        },
        {
          id: "b3",
          kind: "single",
          text: "이 사업을 한국청소년활동진흥원(KYWA)이 운영한다는 사실을 알고 있나요?",
          options: opts("참여 전부터 알고 있었다", "참여하면서 알게 되었다", "지금 처음 알았다"),
        },
        {
          id: "b4",
          kind: "multi",
          text: "참여 여부와 관계없이, 들어 본 적이 있는 것을 모두 골라 주세요.",
          options: opts(
            "청소년 안전홍보단",
            "AI활용 청소년활동 안전공모전",
            "PLAY SAFE 숏폼 챌린지",
            "안전 미션(PLAY SAFE 플랫폼)",
            "한눈정보(안전 카드뉴스)",
            "한눈정보 퀴즈 이벤트",
          ),
        },
      ],
    },
    {
      id: "C",
      title: "전반적 만족도",
      questions: [
        scale("c1", "참여한 사업에 전반적으로 만족한다."),
        scale("c2", "참여 방법과 절차 안내가 이해하기 쉬웠다."),
        scale("c3", "사업 내용이 안전의 중요성을 전달하기에 알맞았다."),
        scale("c4", "운영진의 안내와 응대가 원활했다."),
      ],
    },
    {
      id: "D1",
      title: "안전홍보단 활동",
      note: "청소년 안전홍보단에 참여하신 분께 여쭙니다.",
      group: "crew",
      questions: [
        scale("d1_1", "활동 내용과 과제 분량이 알맞았다."),
        scale("d1_2", "활동에 필요한 교육과 지원(활동비, 안내 등)이 충분했다."),
        scale("d1_3", "우리 팀의 활동이 안전문화를 알리는 데 도움이 되었다고 느낀다."),
      ],
    },
    {
      id: "D2",
      title: "안전 공모전",
      note: "AI활용 안전공모전 또는 숏폼 챌린지에 참여하신 분께 여쭙니다.",
      group: "contest",
      questions: [
        scale("d2_1", "공모 주제와 참가 요건이 분명했다."),
        scale("d2_2", "접수와 심사 과정이 공정하고 투명했다."),
        scale("d2_3", "작품을 준비하면서 안전에 대해 더 깊이 생각하게 되었다."),
      ],
    },
    {
      id: "D3",
      title: "안전 캠페인",
      note: "안전 미션, 한눈정보 퀴즈 이벤트 등에 참여하신 분께 여쭙니다.",
      group: "campaign",
      questions: [
        scale("d3_1", "캠페인이 전하려는 내용을 쉽게 이해할 수 있었다."),
        scale("d3_2", "참여 방식이 재미있고 부담이 없었다."),
        scale("d3_3", "캠페인에서 본 안전 수칙이 기억에 남는다."),
      ],
    },
    {
      id: "E",
      title: "안전 인식 변화",
      questions: [
        scale("e1", "참여한 뒤 안전에 대한 관심이 높아졌다."),
        scale("e2", "참여한 뒤 위험한 상황에서 어떻게 해야 하는지 더 잘 알게 되었다."),
        scale("e3", "참여한 뒤 일상에서 안전 수칙을 더 지키려고 한다."),
        scale("e4", "참여하며 알게 된 내용을 가족이나 친구에게 이야기한 적이 있다."),
        {
          id: "e5",
          kind: "multi",
          text: "참여한 뒤 관심이 더 커진 안전 분야를 모두 골라 주세요.",
          options: opts(
            "생활안전(교통, 화재, 낙상 등)",
            "디지털안전(피싱, 딥페이크, 사이버폭력 등)",
            "재난안전(호우, 지진, 폭염 등)",
            "활동안전(수련활동, 야외체험, 물놀이 등)",
            "마음안전(마음건강, 스트레스 등)",
            "특별히 없다",
          ),
        },
      ],
    },
    {
      id: "F",
      title: "앞으로의 참여와 의견",
      questions: [
        scale("f1", "다음에도 이 사업에 참여하고 싶다."),
        scale("f2", "주변 사람에게 이 사업을 추천하고 싶다."),
        {
          id: "f3",
          kind: "text",
          text: "좋았던 점이나 바라는 점을 자유롭게 적어 주세요.",
          optional: true,
        },
      ],
    },
  ] as SurveySection[],
};

export type SatisfactionSurvey = typeof SATISFACTION_SURVEY;

export const TEXT_MAX = 500;

export function surveyStatus(now: Date = new Date()): "before" | "open" | "closed" {
  if (now < new Date(SATISFACTION_SURVEY.startsAt)) return "before";
  if (now > new Date(SATISFACTION_SURVEY.endsAt)) return "closed";
  return "open";
}

// '참여한 사업'에서 고른 보기 번호로 응답자가 속한 묶음을 구한다.
export function pickedGroups(programPicks: number[]): Set<SurveyGroup> {
  const q = SATISFACTION_SURVEY.sections[0].questions.find(x => x.id === PROGRAM_QUESTION_ID);
  const groups = new Set<SurveyGroup>();
  for (const i of programPicks) {
    const g = q?.options?.[i]?.group;
    if (g) groups.add(g);
  }
  return groups;
}

// 응답자에게 보이는 영역만 돌려준다.
export function visibleSections(programPicks: number[]): SurveySection[] {
  const groups = pickedGroups(programPicks);
  return SATISFACTION_SURVEY.sections.filter(s => !s.group || groups.has(s.group));
}
