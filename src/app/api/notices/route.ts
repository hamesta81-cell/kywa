import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";
import { authError, readAuth, sameTeam } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_INITIAL_NOTICES = [
  {
    id: "notice_guide_official_2026",
    author: "한국청소년활동진흥원 (운영본부)",
    date: "2026. 08. 01",
    title: "📘 [공식 매뉴얼] 2026 청소년 안전홍보단 접속 · 주간보고 · Q&A 사용법 가이드",
    content: `[2026 청소년 안전홍보단 통합 플랫폼 사용법 안내 매뉴얼]

반갑습니다! 청소년 안전홍보단원 및 기관 담당자 여러분.
한국청소년활동진흥원 안전홍보단 오피스 플랫폼의 핵심 사용 방법을 안내해 드립니다.

=======================================================
1. 🔑 홍보단 로그인 및 전용 오피스 접속 방법
=======================================================
① 메인 상단 메뉴 [🔑 홍보단 전용 로그인] 클릭 (/auth/login 접속)
② 부여받은 홍보단 팀 전용 ID/PW로 로그인 진행
③ 로그인 완료 시 [💼 CREW OFFICE] 홍보단 전용 오피스로 즉시 진입합니다.

=======================================================
2. 📝 주간 활동보고서 작성 및 콘텐츠 실적 제출 방법
=======================================================
① 홍보단 오피스 우측 상단 [➕ 세부 주간보고서 작성] 버튼 클릭
② 해당 주차 선택 (8월 1주차 ~ 10월 4주차 마감)
③ 활동 대표 제목, 세부 추진내용, 영상 조회수 및 카드뉴스 배포 건수 입력
④ 홍보물 첨부파일 및 카드뉴스 이미지 업로드 후 [저장 및 제출] 클릭

=======================================================
3. ❓ 실시간 Q&A 질의응답 게시판 이용 안내
=======================================================
① 오피스 좌측 메뉴 [❓ 실시간 Q&A 질의응답] 탭 클릭
② [➕ Q&A 질문 등록] 버튼을 눌러 문의사항 및 요청글 작성
③ 운영본부 및 타 홍보단원들이 실시간 답변 작성 가능
`,
    category: "사용법 가이드",
    isImportant: true,
    attachments: []
  }
];

// 전역 인메모리 0순위 캐시 스토어 (서버리스 수명 주기 내 최신 수정내역 강력 보존)
const globalCache = globalThis as unknown as { notices: any[] };
if (!globalCache.notices) globalCache.notices = [];

// 공지는 영구 디스크(notices.json)에 저장한다. 예전 외부 공개 저장소(restful-api.dev)는 누구나 고칠 수 있어 쓰지 않는다.
function noticesFile() {
  return getPersistentFilePath("notices.json");
}

async function fetchCloudNotices(): Promise<any[]> {
  try {
    const saved = JSON.parse(fs.readFileSync(noticesFile(), "utf-8"));
    if (Array.isArray(saved)) globalCache.notices = saved;
  } catch (e) {}

  if (!globalCache.notices || globalCache.notices.length === 0) {
    globalCache.notices = DEFAULT_INITIAL_NOTICES;
  }

  return globalCache.notices;
}

async function saveCloudNotices(notices: any[]) {
  globalCache.notices = notices;
  const file = noticesFile();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(notices, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0"
};

export async function GET() {
  const notices = await fetchCloudNotices();
  return NextResponse.json({
    success: true,
    notices
  }, { headers: NO_CACHE_HEADERS });
}

// 홍보단은 기존 공지에 자기 팀 이름으로 댓글만 덧붙일 수 있다 (본문·다른 댓글은 그대로 둔다)
async function appendCrewComments(notice: any, team: string) {
  const current = await fetchCloudNotices();
  const idx = current.findIndex((n: any) => String(n.id) === String(notice?.id));
  if (idx < 0) return authError(403, "공지는 총괄 관리자만 올리거나 고칠 수 있습니다.");
  const existing = current[idx];
  const known = new Set((existing.comments || []).map((c: any) => String(c.id)));
  const added = (Array.isArray(notice.comments) ? notice.comments : [])
    .filter((c: any) => c && !known.has(String(c.id)) && sameTeam(c.author, team))
    .map((c: any) => ({ id: c.id, author: team, text: String(c.text || "").slice(0, 1000), time: String(c.time || "") }));
  const next = [...current];
  next[idx] = { ...existing, comments: [...(existing.comments || []), ...added] };
  await saveCloudNotices(next);
  return NextResponse.json({ success: true, notices: next }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: Request) {
  // 공지 등록·수정·삭제는 총괄 관리자만, 홍보단은 댓글만
  const user = readAuth(request);
  if (!user) return authError(401);

  try {
    const body = await request.json();
    const { notice, action, id, noticeList } = body;

    if (user.role !== "ADMIN") {
      if (notice && notice.id && !action && !noticeList) return await appendCrewComments(notice, user.team);
      return authError(403, "공지는 총괄 관리자만 올리거나 고칠 수 있습니다.");
    }

    let current = await fetchCloudNotices();

    if (Array.isArray(noticeList)) {
      current = noticeList;
    } else if (action === "DELETE" && id) {
      current = current.filter((n: any) => String(n.id) !== String(id));
    } else if (action === "RESET_ALL") {
      current = [];
    } else if (notice && notice.id) {
      const idx = current.findIndex((n: any) => String(n.id) === String(notice.id));
      if (idx >= 0) {
        current[idx] = notice;
      } else {
        current = [notice, ...current];
      }
    }

    await saveCloudNotices(current);

    return NextResponse.json({
      success: true,
      notices: current
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
