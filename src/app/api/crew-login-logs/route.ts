import { NextResponse } from "next/server";
import fs from "fs";
import { getPersistentFilePath } from "@/lib/diskStorage";
import { authError, readAuth } from "@/lib/serverAuth";

// 홍보단 팀별 접속 기록. 영구 디스크(crew_login_logs.json)에 저장한다.
// 예전 외부 공개 저장소(restful-api.dev)는 누구나 고칠 수 있어 쓰지 않는다.

type LoginLog = { count: number; lastLoginTime: string; history: string[] };

function logsFile() {
  return getPersistentFilePath("crew_login_logs.json");
}

function readLogs(): Record<string, LoginLog> {
  try {
    const parsed = JSON.parse(fs.readFileSync(logsFile(), "utf-8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLogs(logs: Record<string, LoginLog>) {
  const file = logsFile();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(logs, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

// 관리자만 조회
export async function GET(request: Request) {
  const user = readAuth(request);
  if (!user) return authError(401);
  if (user.role !== "ADMIN") return authError(403);
  return NextResponse.json({ success: true, logs: readLogs() });
}

// 로그인한 팀이 자기 접속을 기록 (팀 이름은 토큰에서 가져온다)
export async function POST(request: Request) {
  const user = readAuth(request);
  if (!user) return authError(401);
  if (user.role !== "CREW") return NextResponse.json({ success: true });

  try {
    const logs = readLogs();
    const nowStr = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const current = logs[user.team] || { count: 0, lastLoginTime: "-", history: [] };
    logs[user.team] = {
      count: current.count + 1,
      lastLoginTime: nowStr,
      history: [nowStr, ...(current.history || [])].slice(0, 10),
    };
    writeLogs(logs);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
