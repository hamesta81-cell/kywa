import { NextResponse } from "next/server";
import {
  authError,
  changedPasswordTeamIds,
  clearPasswordOverride,
  findCrewByTeamName,
  isAdminUsername,
  readAuth,
  sameTeam,
  setPasswordOverride,
} from "@/lib/serverAuth";
import { OFFICIAL_16_CREW_TEAMS } from "@/data/officialCrewData";

export const dynamic = "force-dynamic";

// 🔒 홍보단·관리자 비밀번호 변경. 비밀번호는 해시로만 저장하고(serverAuth), 값은 누구에게도 돌려주지 않는다.
// 예전에는 GET으로 모든 팀 비밀번호를 내주고 외부 공개 저장소에 원문을 보관했다.

// 관리자: 팀이 직접 비밀번호를 바꿨는지만 확인
export async function GET(request: Request) {
  const user = readAuth(request);
  if (!user) return authError(401);
  if (user.role !== "ADMIN") return authError(403);
  const changed = new Set(changedPasswordTeamIds());
  return NextResponse.json({
    success: true,
    changedTeams: OFFICIAL_16_CREW_TEAMS.filter(t => changed.has(t.id)).map(t => t.teamName),
  });
}

// { teamName, newPassword }: 자기 팀(관리자는 모든 팀·자기 계정) 비밀번호 변경
// { resetTeam }: 관리자가 팀 비밀번호를 처음 발급한 값으로 되돌림
export async function POST(request: Request) {
  const user = readAuth(request);
  if (!user) return authError(401);

  try {
    const body = await request.json();

    if (body.resetTeam) {
      if (user.role !== "ADMIN") return authError(403);
      const team = findCrewByTeamName(String(body.resetTeam));
      if (!team) return NextResponse.json({ success: false, message: "팀을 찾을 수 없습니다." }, { status: 404 });
      clearPasswordOverride(team.id);
      return NextResponse.json({ success: true, message: `[${team.teamName}] 팀 비밀번호를 처음 발급한 값으로 되돌렸습니다.` });
    }

    const teamName = String(body.teamName || "");
    const newPassword = String(body.newPassword || "").trim();
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "⚠️ 새 비밀번호는 8자리 이상으로 정해 주세요." }, { status: 400 });
    }

    if (user.role === "ADMIN" && (!teamName || isAdminUsername(teamName) || sameTeam(teamName, user.team))) {
      await setPasswordOverride("admin", newPassword);
      return NextResponse.json({ success: true, message: "총괄 관리자 비밀번호를 바꿨습니다." });
    }

    const team = findCrewByTeamName(teamName || user.team);
    if (!team) return NextResponse.json({ success: false, message: "팀을 찾을 수 없습니다." }, { status: 404 });
    if (user.role !== "ADMIN" && team.id !== user.teamId) return authError(403, "자기 팀 비밀번호만 바꿀 수 있습니다.");
    await setPasswordOverride(team.id, newPassword);
    return NextResponse.json({ success: true, message: `[${team.teamName}] 팀 비밀번호를 바꿨습니다.` });
  } catch {
    return NextResponse.json({ success: false, message: "비밀번호를 저장하지 못했습니다." }, { status: 500 });
  }
}
