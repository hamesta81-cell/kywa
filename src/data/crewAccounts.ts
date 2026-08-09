// 공식 문서 표 기준 16개 정식 안전홍보단 데이터 (지역 100% 검증 반영)
export interface CrewAccount {
  id: number;
  team: string;
  region: string;
  title: string;
  membersCount: number;
  email: string;
  password: string;
  role: "CREW" | "ADMIN" | "USER";
}

export const crewAccounts: CrewAccount[] = [
  {
    id: 1,
    team: "SAFE CREW",
    region: "경북",
    title: "SAFE ON! 우리가 만드는 청소년 안전지도",
    membersCount: 3,
    email: "safecrew@kywa.or.kr",
    password: "safecrew2026!",
    role: "CREW"
  },
  {
    id: 2,
    team: "safe frame",
    region: "경기",
    title: "안전한 울타리(safe frame)",
    membersCount: 15,
    email: "safeframe@kywa.or.kr",
    password: "safeframe2026!",
    role: "CREW"
  },
  {
    id: 3,
    team: "청유",
    region: "인천",
    title: "청유랑 안전해you",
    membersCount: 21,
    email: "cheongyu@kywa.or.kr",
    password: "cheongyu2026!",
    role: "CREW"
  },
  {
    id: 4,
    team: "디지털 쉼표",
    region: "경기",
    title: "스마트폰 과의존 RED RED.",
    membersCount: 3,
    email: "digitalcomma@kywa.or.kr",
    password: "digitalcomma2026!",
    role: "CREW"
  },
  {
    id: 5,
    team: "라이트(light)",
    region: "충북",
    title: "멈칫! 밀어서 개인정보 해제",
    membersCount: 9,
    email: "light@kywa.or.kr",
    password: "light2026!",
    role: "CREW"
  },
  {
    id: 6,
    team: "세이프 리더스",
    region: "대구",
    title: "SAFE LINK - AI로 연결하는 안전, 청소년이 만드는 안전문화",
    membersCount: 3,
    email: "safeleaders@kywa.or.kr",
    password: "safeleaders2026!",
    role: "CREW"
  },
  {
    id: 7,
    team: "심리지원단 파인 (PINE)",
    region: "경기",
    title: "I am Pine, We are Fine",
    membersCount: 14,
    email: "pine@kywa.or.kr",
    password: "pine2026!",
    role: "CREW"
  },
  {
    id: 8,
    team: "안심ON ('안전'과 '마음(心)'을 켜다.)",
    region: "서울",
    title: "디지털 안전 ON, 마음 안전 ON 청소년 디지털 성범죄 예방 및 정서 안전망 구축",
    membersCount: 4,
    email: "ansimon@kywa.or.kr",
    password: "ansimon2026!",
    role: "CREW"
  },
  {
    id: 9,
    team: "안전 탭앤톡 (Tap and Talk)",
    region: "서울",
    title: "안전 밸브를 잠그다 - 여름철 재난·생활안전 홍보 캠페인",
    membersCount: 4,
    email: "tapandtalk@kywa.or.kr",
    password: "tapandtalk2026!",
    role: "CREW"
  },
  {
    id: 10,
    team: "안전.zip",
    region: "경남",
    title: "슬기로운 안전 커넥터",
    membersCount: 6,
    email: "safezip@kywa.or.kr",
    password: "safezip2026!",
    role: "CREW"
  },
  {
    id: 11,
    team: "안전지킴이 「청소년서포터즈 Y.E.S 6기」",
    region: "서울",
    title: "서울특별시립청소년활동진흥센터 「청소년서포터즈 Y.E.S 6기」",
    membersCount: 25,
    email: "yes6th@kywa.or.kr",
    password: "yes6th2026!",
    role: "CREW"
  },
  {
    id: 12,
    team: "우송대학교 아고라",
    region: "대전",
    title: "대학생과 함께하는 디지털·생활안전 실천 프로젝트 '일상 속 안전, 내가 지킨다'",
    membersCount: 3,
    email: "wosongagora@kywa.or.kr",
    password: "wosongagora2026!",
    role: "CREW"
  },
  {
    id: 13,
    team: "웰빙 크루",
    region: "서울",
    title: "웰빙 크루: 오늘의 나를 지키는 일상 속 웰빙",
    membersCount: 6,
    email: "wellbeing@kywa.or.kr",
    password: "wellbeing2026!",
    role: "CREW"
  },
  {
    id: 14,
    team: "이투스",
    region: "서울",
    title: "안전 LEVEL UP!",
    membersCount: 2,
    email: "etoos@kywa.or.kr",
    password: "etoos2026!",
    role: "CREW"
  },
  {
    id: 15,
    team: "청디가드",
    region: "서울",
    title: "청디가드 세이프런 : 위험을 넘어 안전으로",
    membersCount: 7,
    email: "cheongdiguard@kywa.or.kr",
    password: "cheongdiguard2026!",
    role: "CREW"
  },
  {
    id: 16,
    team: "한라우 안전활동가",
    region: "강원",
    title: "스마트폰 멈춰! ‘심쿵!’ 살리는 순간(CPR)",
    membersCount: 16,
    email: "hanrauo@kywa.or.kr",
    password: "hanrauo2026!",
    role: "CREW"
  },
  {
    id: 999,
    team: "KYWA 안전문화사업단 (관리자)",
    region: "본부",
    title: "KYWA 2026 총괄 관제",
    membersCount: 10,
    email: "admin@kywa.or.kr",
    password: "admin2026!",
    role: "ADMIN"
  }
];
