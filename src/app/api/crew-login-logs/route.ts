import { NextResponse } from "next/server";

const CLOUD_LOGS_STORE_ID = "ff8081819f7e10ae019fc58b5bd46526";

async function fetchCloudLogs(): Promise<Record<string, any>> {
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_LOGS_STORE_ID}`, {
      cache: "no-store"
    });
    if (!res.ok) return {};
    const json = await res.json();
    return (json?.data?.logs && typeof json.data.logs === "object") ? json.data.logs : {};
  } catch (e) {
    return {};
  }
}

async function saveCloudLogs(logs: Record<string, any>) {
  try {
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_LOGS_STORE_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "KYWA_HUB_LOGS_V1",
        data: { logs }
      })
    });
  } catch (e) {}
}

export async function GET() {
  const logs = await fetchCloudLogs();
  return NextResponse.json({
    success: true,
    logs
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName } = body;

    const currentLogs = await fetchCloudLogs();

    if (teamName) {
      const nowStr = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
      const current = currentLogs[teamName] || { count: 0, lastLoginTime: "-", history: [] };
      currentLogs[teamName] = {
        count: current.count + 1,
        lastLoginTime: nowStr,
        history: [nowStr, ...(current.history || [])].slice(0, 10)
      };

      await saveCloudLogs(currentLogs);
    }

    return NextResponse.json({
      success: true,
      logs: currentLogs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
