import { NextResponse } from "next/server";
import {
  findCrewAccount,
  isAdminUsername,
  signToken,
  verifyAdminPassword,
  verifyCrewPassword,
} from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

// 관리자·홍보단 팀 로그인: 서버에서 비밀번호를 확인하고 서명된 토큰을 준다.
// 같은 접속지에서 10분 안에 10번 틀리면 잠시 막는다.
const failures = new Map<string, { count: number; since: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 10;

// Render 앞단 Cloudflare가 넣는 접속지 주소를 먼저 쓴다 (x-forwarded-for 첫 칸은 접속자가 꾸밀 수 있음)
function clientIp(req: Request) {
  return req.headers.get("cf-connecting-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
}

function fail(ip: string, message: string) {
  const now = Date.now();
  const f = failures.get(ip);
  failures.set(ip, f && now - f.since < WINDOW_MS ? { count: f.count + 1, since: f.since } : { count: 1, since: now });
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const f = failures.get(ip);
  if (f && f.count >= MAX_FAILS && Date.now() - f.since < WINDOW_MS) {
    return NextResponse.json({ success: false, message: "⚠️ 로그인 시도가 너무 많습니다. 10분 뒤 다시 시도해 주세요." }, { status: 429 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "잘못된 요청입니다." }, { status: 400 });
  }
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) return fail(ip, "⚠️ 아이디와 비밀번호를 입력해 주세요.");

  if (isAdminUsername(username)) {
    if (!(await verifyAdminPassword(password))) return fail(ip, "⚠️ 관리자 비밀번호가 올바르지 않습니다.");
    failures.delete(ip);
    const user = { name: "총괄 관리자", role: "ADMIN", teamId: 999 };
    return NextResponse.json({ success: true, user, token: signToken({ role: "ADMIN", team: user.name, teamId: 999 }) });
  }

  const account = findCrewAccount(username);
  if (!account) return fail(ip, "⚠️ 선택한 홍보단 팀 정보를 찾을 수 없습니다.");
  if (!(await verifyCrewPassword(account.id, password))) {
    return fail(ip, `⚠️ [${account.teamName}] 비밀번호가 올바르지 않습니다. 확인 후 다시 시도해 주세요.`);
  }
  failures.delete(ip);
  const user = { name: account.teamName, role: "CREW", teamId: account.id, level: 25 };
  return NextResponse.json({
    success: true,
    user,
    token: signToken({ role: "CREW", team: account.teamName, teamId: account.id }),
  });
}
