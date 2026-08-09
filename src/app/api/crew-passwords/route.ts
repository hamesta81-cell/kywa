import { NextResponse } from "next/server";

// 🌟 Vercel & 클라우드 영구 저장소 ID (홍보단 팀별 커스텀 비밀번호)
const CLOUD_PASSWORDS_STORE_ID = "ff8081819f7e10ae019fc58b5bd46527";

async function fetchCloudPasswords(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_PASSWORDS_STORE_ID}`, {
      cache: "no-store"
    });
    if (!res.ok) return {};
    const json = await res.json();
    return (json?.data?.passwords && typeof json.data.passwords === "object") ? json.data.passwords : {};
  } catch (e) {
    return {};
  }
}

async function saveCloudPasswords(passwords: Record<string, string>) {
  try {
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_PASSWORDS_STORE_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "KYWA_HUB_PASSWORDS_V1",
        data: { passwords }
      })
    });
  } catch (e) {}
}

export async function GET() {
  const passwords = await fetchCloudPasswords();
  return NextResponse.json({
    success: true,
    passwords
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, newPassword, passwords: fullList } = body;

    let currentPasswords = await fetchCloudPasswords();

    if (fullList && typeof fullList === "object") {
      currentPasswords = { ...currentPasswords, ...fullList };
    } else if (teamName && newPassword) {
      currentPasswords[teamName] = newPassword;
    }

    await saveCloudPasswords(currentPasswords);

    return NextResponse.json({
      success: true,
      passwords: currentPasswords
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save password to cloud" }, { status: 500 });
  }
}
