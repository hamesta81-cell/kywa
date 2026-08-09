export interface CardnewsSlide {
  title: string;
  subTitle: string;
  description: string;
  visualType: "danger" | "analysis" | "process" | "guide" | "intro" | "info" | "grid6" | "column3" | "vs2" | "checklist" | "warning";
  highlights?: string[];
  points?: { label: string; value: string; danger?: boolean }[];
  steps?: { step: number; label: string; desc: string }[];
  grid6Items?: { title: string; desc: string }[]; // 6분할 전용
  column3Items?: { title: string; desc: string }[]; // 3기둥 전용
  vs2Items?: { title: string; desc: string; isDanger?: boolean }[]; // 2선대조 전용
  checklistItems?: { title: string; isChecked?: boolean }[]; // 자가진단 체크리스트 전용
  warningItems?: { title: string; desc: string }[]; // 경고장 전용
}

export interface CardnewsItem {
  id: number;
  month: string;
  category: "일상" | "활동" | "시설" | "사이버" | "재난";
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  searchPath: string; // 탐색 경로 안내
  team: string;
  slides: CardnewsSlide[];
}

export const cardnewsData: Record<number, CardnewsItem> = {
  1: {
    id: 1,
    month: "6월",
    category: "재난",
    title: "여름 체육대회 전후 폭염 온열질환 예방 대책",
    summary: "급격한 야외 활동 후 온열질환 대처 방법 및 0.9% 생리식염수 복용 등 의학적 응급처치 수칙",
    sourceName: "질병관리청 및 소방청",
    sourceUrl: "https://www.kdca.go.kr",
    searchPath: "정책정보 ➔ 건강위해 ➔ 기후변화 ➔ 폭염 ➔ 감시체계 신고현황",
    team: "재난대응홍보팀",
    slides: [
      {
        title: "여름 체육대회 도중 친구가 쓰러진 비상 상황!",
        subTitle: "긴급 온열질환 대처 3대 수칙",
        description: "체육대회 직후 얼굴이 붉어지고 현기증을 호소하며 쓰러졌을 때 즉시 기동해야 할 응급 프로토콜",
        visualType: "column3",
        column3Items: [
          { title: "1. 그늘 이동", desc: "환자를 통풍이 잘되는 시원한 그늘이나 에어컨이 켜진 실내로 즉각 격리하기" },
          { title: "2. 체온 내리기", desc: "옷 단추와 벨트를 풀고, 젖은 차가운 타월로 목 뒤와 겨드랑이를 감싸 냉각하기" },
          { title: "3. 의식불명 음수 금지", desc: "의식이 없으면 물을 먹이지 말고(질식 위험) 119 신고 후 0.9% 생리식염수 처치" }
        ]
      }
    ]
  },
  2: {
    id: 2,
    month: "6월",
    category: "활동",
    title: "안전한 스포츠 활동과 발목 염좌 R.I.C.E 처치법",
    summary: "청소년 스포츠 활동 중 관절 손상을 예방하기 위한 4단계 표준 외상 조치 매뉴얼",
    sourceName: "스포츠안전재단",
    sourceUrl: "https://www.sportsafety.or.kr",
    searchPath: "공식 홈페이지 ➔ 알림마당 ➔ 스포츠 안전 정보방",
    team: "청소년체육단",
    slides: [
      {
        title: "체육 시간 발목을 삐끗했을 때의 R.I.C.E 수칙",
        subTitle: "손상 부위 악화를 방지하는 4단계 프로세스",
        description: "염좌 발생 시 혈관 확장에 의한 부종을 예방하고 염증의 번짐을 막아주는 표준 구호법",
        visualType: "process",
        steps: [
          { step: 1, label: "Rest (안정)", desc: "손상 즉시 모든 체육 활동을 중단하고 체중 지탱 피하기" },
          { step: 2, label: "Ice (냉찜질)", desc: "혈관 수축을 위해 1회 15분간 젖은 수건 위에 얼음팩 대기" },
          { step: 3, label: "Compression (압박)", desc: "탄력 붕대로 부드럽고 견고하게 환부를 감싸 지탱하기" },
          { step: 4, label: "Elevation (올림)", desc: "다친 발목을 심장 높이보다 높게 올려 정맥 혈류 쏠림 방지" }
        ]
      }
    ]
  },
  3: {
    id: 3,
    month: "6월",
    category: "일상",
    title: "개인형 이동장치(PM) 전동킥보드 탑승 전 안심 셋업",
    summary: "2025년 12월 개정 법안(최고속도 20km 하향 및 연령 제한)에 맞춘 PM 탑승 3대 의무 규정",
    sourceName: "법제처 국가법령정보센터",
    sourceUrl: "https://www.law.go.kr/법령/도로교통법/제50조",
    searchPath: "도로교통법 제50조 (특정 운전자의 준수사항) 조항 확인",
    team: "도로보행안전반",
    slides: [
      {
        title: "전동킥보드 안심 주행을 위한 3대 의무 체크",
        subTitle: "강화된 도로교통법 위반 과태료 기준",
        description: "무면허, 헬멧 미착용, 그리고 동승 탑승은 불법일 뿐만 아니라 심각한 상해 부상을 유발합니다.",
        visualType: "warning",
        warningItems: [
          { title: "🚫 원동기 면허 필수", desc: "만 16세 미만 이용 전면 금지 및 무면허 탑승 시 범칙금 10만 원" },
          { title: "🚫 최고속도 20km 하향", desc: "안전성 확보를 위해 최고 주행 속도를 시속 20km로 강제 제어 락인" },
          { title: "🚫 동승 금지 (1인 탑승)", desc: "2인 이상 탑승 시 무게중심 이탈 전도 위험, 적발 시 범칙금 4만 원" }
        ]
      }
    ]
  },
  5: {
    id: 5,
    month: "7월",
    category: "재난",
    title: "집중호우 시 보도 위에서 피해야 할 2대 위험 지대",
    summary: "폭우 상황 속 들썩이는 맨홀 뚜껑 및 가로 전력 설비 침수 감전 대처 행동 요령",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 자연재난 ➔ 호우/태풍 행동수칙",
    team: "도시안전가드",
    slides: [
      {
        title: "호우 통행 시 절대 밟지 말아야 할 데드존",
        subTitle: "감전 및 수압 폭발 위험 구역 대조",
        description: "노면에 빗물이 차올라 바닥이 보이지 않을 때는 다음 2대 위험 지대를 완벽히 우회해야 합니다.",
        visualType: "vs2",
        vs2Items: [
          { title: "들썩이는 맨홀 뚜껑", desc: "관로 내부 수압 폭발로 40kg 쇳덩이가 솟구칠 수 있으므로 반경 10m 외 우회", isDanger: true },
          { title: "가로등 및 전력 설비", desc: "신호등 배전반, 실외기 배선 침수로 인한 전류 누출 감전 예방을 위해 3m 이격", isDanger: true }
        ]
      }
    ]
  },
  6: {
    id: 6,
    month: "7월",
    category: "일상",
    title: "계곡/바다 안전 물놀이 구명조끼 체결 요령",
    summary: "가랑이 생명 끈을 채우지 않았을 때 발생하는 질식 위험 및 생존 잎새 수영 뜨기 자세 안내",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 생활안전 ➔ 물놀이 행동요령",
    team: "인명구조단",
    slides: [
      {
        title: "구명조끼 다리 생명 끈 미체결의 치명적 경고",
        subTitle: "생과 사를 가르는 3cm 가랑이 벨트",
        description: "다리 사이 생명 끈을 채우지 않으면 물속에서 조끼가 위로 떠올라 목과 기도를 강하게 누릅니다.",
        visualType: "checklist",
        checklistItems: [
          { title: "가슴 지퍼를 올리고 전면 안전 버클 3개 완전히 잠그기", isChecked: true },
          { title: "하단 다리 생명 끈 두 개를 가랑이 사이로 통과시켜 체결하기", isChecked: true },
          { title: "조끼가 몸에 헐겁지 않게 양옆 피트 조절 벨트 꽉 당겨주기", isChecked: true },
          { title: "소용돌이 와류에 휘쓸렸을 땐 하늘을 보며 눕는 잎새 뜨기 유지", isChecked: true }
        ]
      }
    ]
  },
  9: {
    id: 9,
    month: "8월",
    category: "재난",
    title: "여름철 식중독 예방 조심해야 할 6가지 음식",
    summary: "질병관리청 식중독 가이드라인에 맞춘 날음식, 어패류, 배달 음식의 안전 보관 및 85도 가열 섭취법",
    sourceName: "식품의약품안전처 식품안전나라",
    sourceUrl: "https://www.foodsafetykorea.go.kr",
    searchPath: "식품안전 지식 ➔ 식중독 예방 ➔ 식중독 예보 및 수칙",
    team: "보건위생지원단",
    slides: [
      {
        title: "여름철 특히 조심해야 할 6가지 대표 음식",
        subTitle: "식재료 성격별 교차오염 방지 및 보관 꿀팁",
        description: "고온다습한 8월에는 식중독균 번식 우려가 커 다음 6가지 음식 조리 시 수칙을 반드시 지켜야 합니다.",
        visualType: "grid6",
        grid6Items: [
          { title: "1. 달걀·닭고기", desc: "김밥/냉면 고명 주의, 완숙 조리 및 닿은 조리도구 세척 필수" },
          { title: "2. 채소류", desc: "흐르는 물에 씻기, 나물은 볶아서 익혀 먹고 상온 방치 금지" },
          { title: "3. 육류", desc: "핏물이 다른 재료에 안 닿게 밀봉 분리, 냉장 0~5도 보관" },
          { title: "4. 견과류", desc: "습기 곰팡이 유발 방지 위해 개봉 후 밀봉하여 냉동 보관" },
          { title: "5. 어패류", desc: "비브리오 패혈증 예방을 위해 85도 이상 중심 가열해 조리" },
          { title: "6. 포장·배달", desc: "실온에 2시간 이상 방치 금지, 남은 음식 소분 후 냉장 보관" }
        ]
      }
    ]
  },
  10: {
    id: 10,
    month: "8월",
    category: "사이버",
    title: "디지털 성범죄 딥페이크 처벌법과 긴급 구제 가이드",
    summary: "2024년 10월 개정 성폭력처벌법에 의한 단순 소지·시청 처벌 신설 및 디성센터 삭제 접수 핫라인",
    sourceName: "여성가족부 및 방송통신심의위원회",
    sourceUrl: "https://www.mogef.go.kr",
    searchPath: "정책안내 ➔ 여성·권익 정책 ➔ 디지털 성범죄 예방대책",
    team: "사이버안전가드",
    slides: [
      {
        title: "알면서 소지·시청만 해도 즉각 실형 기소!",
        subTitle: "강화된 성폭력처벌법 제14조의2",
        description: "딥페이크 영상물을 단순히 저장, 시청, 소지, 구입한 경우 유포 의도가 없어도 형사 입건 처벌 대상이 됩니다.",
        visualType: "warning",
        warningItems: [
          { title: "🚫 소지·저장·시청 처벌", desc: "알면서 다운로드하거나 톡방에서 시청 시 3년 이하 징역 또는 3천만 원 이하 벌금" },
          { title: "🚫 채증 자료 확보", desc: "가해자가 도주하기 전 상대 계정 고유 ID와 화면 전체 URL이 보이게 캡처" },
          { title: "🚫 삭제 지원 센터 연계", desc: "여가부 디지털 성범죄 피해자 지원센터(02-735-8994)로 긴급 삭제 요청" }
        ]
      }
    ]
  }
};

// 28종 전체 리스트 선언
export const baseCardnewsItems: { id: number; month: string; category: "일상" | "활동" | "시설" | "사이버" | "재난"; title: string; summary: string; sourceName: string; sourceUrl: string; searchPath: string }[] = [
  { 
    id: 1, 
    month: "6월", 
    category: "재난", 
    title: "여름 체육대회 전후 폭염 온열질환 예방 대책", 
    summary: "급격한 야외 활동 후 온열질환 대처 방법 및 0.9% 생리식염수 복용 등 의학적 응급처치 수칙",
    sourceName: "질병관리청",
    sourceUrl: "https://www.kdca.go.kr",
    searchPath: "기상특보 폭염대응 건강수칙 안내"
  },
  { 
    id: 2, 
    month: "6월", 
    category: "활동", 
    title: "안전한 스포츠 활동과 발목 염좌 R.I.C.E 처치법", 
    summary: "청소년 스포츠 활동 중 관절 손상을 예방하기 위한 4단계 표준 외상 조치 매뉴얼",
    sourceName: "스포츠안전재단",
    sourceUrl: "https://www.sportsafety.or.kr",
    searchPath: "스포츠 부상 방지 4대 수칙 정보실"
  },
  { 
    id: 3, 
    month: "6월", 
    category: "일상", 
    title: "개인형 이동장치(PM) 전동킥보드 탑승 전 안심 셋업", 
    summary: "2025년 12월 개정 법안(최고속도 20km 하향 및 연령 제한)에 맞춘 PM 탑승 3대 의무 규정",
    sourceName: "법제처 국가법령정보센터",
    sourceUrl: "https://www.law.go.kr/법령/도로교통법/제50조",
    searchPath: "도로교통법 제50조 및 시행규칙"
  },
  { 
    id: 4, 
    month: "6월", 
    category: "사이버", 
    title: "내 폰을 지키는 3대 디지털 안전 경계선 설정 수칙", 
    summary: "공용 PC 시크릿 브라우징 및 스마트폰 2단계 추가 인증 설정을 통한 해킹 백도어 차단",
    sourceName: "한국지능정보사회진흥원 스마트쉼센터",
    sourceUrl: "https://www.iapc.or.kr",
    searchPath: "디지털 역량 강화 및 스마트폰 과의존 해킹 예방실"
  },
  { 
    id: 5, 
    month: "7월", 
    category: "재난", 
    title: "집중호우 시 보도 위에서 피해야 할 2대 위험 지대", 
    summary: "폭우 상황 속 들썩이는 맨홀 뚜껑 및 가로 전력 설비 침수 감전 대처 행동 요령",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 자연재난 ➔ 호우/태풍"
  },
  { 
    id: 6, 
    month: "7월", 
    category: "일상", 
    title: "계곡/바다 안전 물놀이 구명조끼 체결 요령", 
    summary: "가랑이 생명 끈을 채우지 않았을 때 발생하는 질식 위험 및 생존 잎새 수영 뜨기 자세 안내",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 생활안전 ➔ 물놀이 수칙"
  },
  { 
    id: 7, 
    month: "7월", 
    category: "사이버", 
    title: "사이버블링 단톡방 폭언 대항 3대 무결점 채증 원칙", 
    summary: "메신저 피해 스크롤 캡처 시 가해 계정 고유 ID와 화면 주소 링크 동시 확보 가이드",
    sourceName: "학교폭력예방 도란도란",
    sourceUrl: "https://www.dorandoran.go.kr",
    searchPath: "학교폭력 예방 누리집 사이버 폭력 대책방"
  },
  { 
    id: 8, 
    month: "7월", 
    category: "활동", 
    title: "여름 캠핑 텐트 내 일산화탄소 차단 환기 가이드", 
    summary: "텐트 그늘 가열 방지 및 산소 결핍 질식 차단을 위한 4면 환기창 50% 이상 개방 수칙",
    sourceName: "한국청소년활동진흥원(KYWA)",
    sourceUrl: "https://www.kywa.or.kr",
    searchPath: "청소년활동 안전가이드북 재난행동 지침"
  },
  { 
    id: 9, 
    month: "8월", 
    category: "재난", 
    title: "여름철 식중독 예방 조심해야 할 6가지 음식", 
    summary: "질병관리청 식중독 가이드라인에 맞춘 날음식, 어패류, 배달 음식의 안전 보관 및 85도 가열 섭취법",
    sourceName: "식품의약품안전처 식품안전나라",
    sourceUrl: "https://www.foodsafetykorea.go.kr",
    searchPath: "식중독 통계 및 식생활 안전예보"
  },
  { 
    id: 10, 
    month: "8월", 
    category: "사이버", 
    title: "디지털 성범죄 딥페이크 처벌법과 긴급 구제 가이드", 
    summary: "2024년 10월 개정 성폭력처벌법에 의한 단순 소지·시청 처벌 신설 및 디성센터 삭제 접수 핫라인",
    sourceName: "여성가족부 및 방송통신심의위원회",
    sourceUrl: "https://www.mogef.go.kr",
    searchPath: "여성안전정책 ➔ 디지털 성범죄 삭제지원실"
  },
  { 
    id: 11, 
    month: "8월", 
    category: "일상", 
    title: "생성형 AI 이미지 결과물 저작권 3대 체크리스트", 
    summary: "AI 굿즈 제작 및 배포 과제물 상업적 도용 소송 예방을 위한 플랫폼 약관 검토 수칙",
    sourceName: "문화체육관광부 및 한국저작권위원회",
    sourceUrl: "https://www.mcst.go.kr",
    searchPath: "저작권 정책 ➔ 생성 AI 저작권 가이드라인 고시"
  },
  { 
    id: 12, 
    month: "8월", 
    category: "활동", 
    title: "환절기 우울증 예방 멜라토닌 충전 3대 비결", 
    summary: "기온 급감 일조량 부족 대비 세로토닌 합성을 유도하는 10시~14시 광합성 산책 가이드",
    sourceName: "국립정신건강센터",
    sourceUrl: "https://www.mentalhealth.go.kr",
    searchPath: "정신건강 서비스 ➔ 계절성 우울 극복 프로그램"
  },
  { 
    id: 13, 
    month: "9월", 
    category: "활동", 
    title: "관절 접질림 온찜질/냉찜질 응급조치 선택 노트", 
    summary: "외상 초기 부종 억제를 위한 핫파스 사용 금지 및 모세혈관 수축 유도 냉찜질 가이드",
    sourceName: "소방청",
    sourceUrl: "https://www.nfa.go.kr",
    searchPath: "119 구조대 응급처치 외상 매뉴얼"
  },
  { 
    id: 14, 
    month: "9월", 
    category: "일상", 
    title: "보행 노이즈캔슬링 차단 보행 마비 3대 위험 요소", 
    summary: "보행 스마트폰 주시로 인한 전방 시야 10도 급감 예방 및 청각 개방 신호 대기 수칙",
    sourceName: "국토교통부",
    sourceUrl: "https://www.molit.go.kr",
    searchPath: "보행안전 교통시설 안전 가이드라인"
  },
  { 
    id: 15, 
    month: "9월", 
    category: "재난", 
    title: "청소년축제 안전 기획용 대피동선 3대 체크표", 
    summary: "병목 정체 방지를 위한 피난 복도 너비 3m 확보 및 안전 유도 바리케이드 설치 의무",
    sourceName: "행정안전부",
    sourceUrl: "https://www.mois.go.kr",
    searchPath: "지역축제 및 대형행사 안전관리 심의기준"
  },
  { 
    id: 16, 
    month: "9월", 
    category: "일상", 
    title: "행복 호르몬 세로토닌 활성 3대 슈퍼푸드 레시피", 
    summary: "계절성 우울감에 대항하여 아미노산 트립토판이 가득 든 우유, 바나나, 견과류 식단 추천",
    sourceName: "보건복지부",
    sourceUrl: "https://www.mohw.go.kr",
    searchPath: "정신건강증진 지원책 및 가이드라인"
  },
  { 
    id: 17, 
    month: "10월", 
    category: "사이버", 
    title: "수행평가 배포 전 파일 속 개인정보 3단계 소독법", 
    summary: "Word/PPT 파일 정보 메타데이터 속 사용자 PC 한글 본명 및 라이선스 확인 가이드",
    sourceName: "개인정보보호위원회",
    sourceUrl: "https://www.privacy.go.kr",
    searchPath: "어린이·청소년 개인정보 보호 수칙 자료실"
  },
  { 
    id: 18, 
    month: "10월", 
    category: "재난", 
    title: "다중 밀집 압사 위기 시 흉곽 15cm 생존방어 자세", 
    summary: "콘서트 축제장 인파 집중 상황 지면 대각선 지탱 및 크로스 팔짱 흉부 완충 공간 보존",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 사회재난 ➔ 다중밀집 인파사고"
  },
  { 
    id: 19, 
    month: "10월", 
    category: "시설", 
    title: "수련원 정전 피난 시 하단 비상유도등 추적 팁", 
    summary: "유독가스 기류 특성에 따른 시야 하단 고정 대대 및 간이 완강기 세트 상태 확인법",
    sourceName: "한국산업안전보건공단",
    sourceUrl: "https://kosha.or.kr",
    searchPath: "안전보건 가이드라인 다중이용시설 점검"
  },
  { 
    id: 20, 
    month: "10월", 
    category: "일상", 
    title: "비타민 영양제 복용 시 결합 금지 3대 탄산 음료", 
    summary: "커피 및 에너지음료의 카페인과 탄닌 성분에 의한 철분 비타민 미네랄 침전 배출 기전",
    sourceName: "식품의약품안전처",
    sourceUrl: "https://www.mfds.go.kr",
    searchPath: "건강기능식품 안전 이용 및 흡수 가이드"
  },
  { 
    id: 21, 
    month: "11월", 
    category: "시설", 
    title: "수련시설 화재 시 포복 피난 생존의 외길 벽짚기", 
    summary: "노래방 PC방 정전 화재 상황 유독가스 30cm 하강 호흡 및 한쪽 단일 벽면 추적 대피",
    sourceName: "소방청",
    sourceUrl: "https://www.nfa.go.kr",
    searchPath: "소방법 규격 대피훈련 행동지침"
  },
  { 
    id: 22, 
    month: "11월", 
    category: "사이버", 
    title: "마음 은둔 위기 예방 자가진단 4대 체크표", 
    summary: "일시적 대인 단절 및 밤낮 수면 사이클 역전 상태 자가 진단 및 1388 모바일 연계",
    sourceName: "보건복지부",
    sourceUrl: "https://www.mohw.go.kr",
    searchPath: "은둔/고립 위기가구 조기 발굴 정책고시"
  },
  { 
    id: 23, 
    month: "11월", 
    category: "일상", 
    title: "겨울 한랭 예방 척추 부상 낙상 방지 장갑 착용", 
    summary: "주머니 속 손 꽂기 보행 미끄러짐 시 척추 직격 충격에 의한 위험 분석 및 보행 요령",
    sourceName: "질병관리청",
    sourceUrl: "https://www.kdca.go.kr",
    searchPath: "한랭질환 건강수칙 배포 자료실"
  },
  { 
    id: 24, 
    month: "11월", 
    category: "재난", 
    title: "보도 위 눈길 살얼음 블랙아이스 판별 3대 수칙", 
    summary: "기온 하강 시 노면 번들거림 우회 보행 및 횡단 대기 시 차도 1.5m 이격 대피 요령",
    sourceName: "행정안전부 국민재난안전포털",
    sourceUrl: "https://www.safekorea.go.kr",
    searchPath: "국민행동요령 ➔ 자연재난 ➔ 대설/한파"
  },
  { 
    id: 25, 
    month: "12월", 
    category: "재난", 
    title: "전열매트 과열 화재 예방 라텍스 폼 적재 금지", 
    summary: "취침용 전기장판 위 고밀도 메모리폼 베개 토퍼 사용 시 단열 열과부하 화재 기전 경고",
    sourceName: "소방청",
    sourceUrl: "https://www.nfa.go.kr",
    searchPath: "소방 보도자료실 겨울 난방용품 화재 수칙"
  },
  { 
    id: 26, 
    month: "12월", 
    category: "사이버", 
    title: "사이버 명예훼손 저격글 작성 시 형사처벌 경고", 
    summary: "타인 비방 루머 공유 리그램 차단 및 정보통신망법 위반 법적 형사 기소 판례 리포트",
    sourceName: "방송통신위원회",
    sourceUrl: "https://www.kcc.go.kr",
    searchPath: "청소년 디지털시민성 및 윤리 가이드라인"
  },
  { 
    id: 27, 
    month: "12월", 
    category: "사이버", 
    title: "금융 스미싱 미끼 문자 클릭 시 3단계 행동 강령", 
    summary: "택배 반송 알림 주소 클릭 데이터 전송 가로채기 차단용 무선 통신 오프 및 어카운트인포",
    sourceName: "금융감독원 보이스피싱 지킴이",
    sourceUrl: "https://fss.or.kr",
    searchPath: "메신저피싱 보이스피싱 예방 10대 계명"
  },
  { 
    id: 28, 
    month: "12월", 
    category: "시설", 
    title: "짚라인 금속 마찰 동파 카라비너 잠금 나사 점검", 
    summary: "겨울 레포츠 하강 시설 이용 전 안전 하네스 몸통 조임과 연결 락 스크류 이중 확인",
    sourceName: "문화체육관광부",
    sourceUrl: "https://www.mcst.go.kr",
    searchPath: "레저시설 동절기 정기 안전점검 의무고시"
  }
];

export const getAllCardnewsItems = (): CardnewsItem[] => {
  return baseCardnewsItems.map((item) => {
    // 하드코딩된 상세 데이터가 존재하면 반환
    if (cardnewsData[item.id]) {
      return cardnewsData[item.id];
    }
    
    // 없는 데이터들은 기획안 수칙 및 다변화 포맷을 프로그램적으로 세련되게 주입하여 동적 반환
    let slides: CardnewsSlide[] = [];
    
    // 기본 표지 슬라이드
    slides.push({
      title: item.title,
      subTitle: `${item.month} ${item.category} 안전 테마 배포본`,
      description: item.summary,
      visualType: "intro"
    });

    // 테마별 성격에 맞는 1대1 다변화 매칭
    if (item.category === "사이버" && item.id === 26) {
      // 명예훼손 ➔ 경고장형 포맷
      slides.push({
        title: "장난성 악플 작성의 무서운 사법 경고",
        subTitle: "정보통신망법 위반 법적 형사 처벌 기준",
        description: "비방을 목적으로 타인의 사생활 혹은 악의적 허위 사실을 게시 시 법적인 전과 기록이 신설됩니다.",
        visualType: "warning",
        warningItems: [
          { title: "🚫 가짜 저격글 리그램 처벌", desc: "단순 복사 및 공유 리그램도 유포 혐의로 2차 처벌 기소 대상" },
          { title: "🚫 오프라인 면전 필터링", desc: "댓글 작성 전 '이 말을 상대 면전에서 직접 뱉을 수 있는가?' 3초간 자성" },
          { title: "🚫 ECRM 즉시 수사 접수", desc: "모욕 피해 발생 시 증거를 보존하여 사이버범죄 신고 포털 정식 고소" }
        ]
      });
    } else if (item.category === "재난" && item.id === 24) {
      // 블랙아이스 ➔ VS2 2선 대조 포맷
      slides.push({
        title: "살얼음 노면 통과 시 2대 행동 강령",
        subTitle: "일반 보행과 블랙아이스 보행법의 대조",
        description: "기온 급강하 시 아스팔트 위의 눈 녹은 살얼음판은 보폭과 무게중심을 완전히 바꿔 보행해야 낙상을 방지합니다.",
        visualType: "vs2",
        vs2Items: [
          { title: "❌ 일반식 큰 보폭 걸음", desc: "뒤꿈치에 수직 하중이 몰려 마찰 저항이 미끄러짐으로 즉각 변환", isDanger: true },
          { title: "⭕ 펭귄식 상체 전경 보폭", desc: "상체를 10도 앞으로 숙이고 보폭을 평소 절반 이하로 줄인 조밀 보행", isDanger: false }
        ]
      });
    } else if (item.category === "사이버" && item.id === 22) {
      // 고립 자가진단 ➔ Checklist형 포맷
      slides.push({
        title: "내 정서 잠금 위기 자가진단 4가지 지표",
        subTitle: "사회적 고립/은둔 위험 징후 체크리스트",
        description: "최근 내 생활 반경과 소통 사이클이 무너졌는지 다음 지표를 통해 마음 상태를 점검해 보세요.",
        visualType: "checklist",
        checklistItems: [
          { title: "최근 2주간 등교 외 일상적인 야외 외출이 전혀 없었는가?", isChecked: true },
          { title: "단톡방 소통이나 동급생들의 개인 전화를 회피하고 방치하는가?", isChecked: true },
          { title: "수면 사이클이 야간형으로 역전되어 낮 시간에 극도의 무기력을 느끼는가?", isChecked: true },
          { title: "정서 안심 핫라인 ☎️ 1388 지원 상담을 연계할 준비가 되었는가?", isChecked: true }
        ]
      });
    } else if (item.category === "일상" && item.id === 20) {
      // 영양제 복용 ➔ VS2 대조형 포맷
      slides.push({
        title: "종합 비타민과 환상/악마의 음료 매칭",
        subTitle: "카페인 탄산수 흡수 방해 기전 대조",
        description: "영양제 흡수를 돕는 물과 영양소 분자 구조를 씻어내어 파괴하는 탄산/커피 음료를 대조합니다.",
        visualType: "vs2",
        vs2Items: [
          { title: "❌ 모닝커피 & 고카페인 음료", desc: "카페인과 탄닌 성분이 철분, 칼슘 원소와 결합해 침전물로 즉시 방전 배출", isDanger: true },
          { title: "⭕ 200ml 미지근한 순수 생수", desc: "영양 성분의 부드러운 위벽 흡수와 용해를 돕는 최고의 활성 매개", isDanger: false }
        ]
      });
    } else {
      // 나머지 기본 항목들은 기획서 내용을 반영한 표준 R.I.C.E 처치와 같은 가이드 정보 탑재
      slides.push({
        title: `${item.title} 필수 핵심 수칙`,
        subTitle: "공식 매뉴얼 보도자료 기반 실전 가이드",
        description: item.summary,
        visualType: "column3",
        column3Items: [
          { title: "1. 사전 점검", desc: "기동 전 부식, 마모, 단선 등 외형 상태를 육안 및 접지로 30초 대면 점검하기" },
          { title: "2. 안전기어 결착", desc: "하네스 조임, 안전모 턱 끈 고정, 2단계 보안 인증 등 방어 장치 작동하기" },
          { title: "3. 대피 통로 확보", desc: "밀집 병목 통행 시 3m 폭 유지 및 화재 정전 시 벽 짚기 피난 경로 이탈 예방" }
        ]
      });
    }

    return {
      ...item,
      team: "홍보단 자체제작",
      slides: slides
    };
  });
};
