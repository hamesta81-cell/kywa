import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

function getDiskFilePath(): string {
  try {
    return path.join(process.cwd(), "permanent_passwords_db.json");
  } catch (e) {
    return path.join(os.tmpdir(), "permanent_passwords_db.json");
  }
}

const globalPassStore = globalThis as unknown as {
  passwords: Record<string, string>;
};

if (!globalPassStore.passwords) globalPassStore.passwords = {};

function readFromDiskStore(): Record<string, string> {
  try {
    const filePath = getDiskFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {}

  try {
    const fallbackPath = path.join(os.tmpdir(), "permanent_passwords_db.json");
    if (fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {}

  return {};
}

function writeToDiskStore(items: Record<string, string>) {
  try {
    const filePath = getDiskFilePath();
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
  } catch (e) {}

  try {
    const fallbackPath = path.join(os.tmpdir(), "permanent_passwords_db.json");
    fs.writeFileSync(fallbackPath, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {}
}

const CLOUD_PASSWORDS_STORE_ID = "ff8081819f7e10ae019fc58b5bd46527";

async function fetchCloudPasswords(): Promise<Record<string, string>> {
  const disk = readFromDiskStore();
  let cloud: Record<string, string> = {};

  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_PASSWORDS_STORE_ID}`, {
      cache: "no-store"
    });
    if (res.ok) {
      const json = await res.json();
      cloud = (json?.data?.passwords && typeof json.data.passwords === "object") ? json.data.passwords : {};
    }
  } catch (e) {}

  const merged = { ...disk, ...globalPassStore.passwords, ...cloud };
  globalPassStore.passwords = merged;
  writeToDiskStore(merged);
  return merged;
}

async function saveCloudPasswords(passwords: Record<string, string>) {
  globalPassStore.passwords = { ...globalPassStore.passwords, ...passwords };
  writeToDiskStore(globalPassStore.passwords);

  try {
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_PASSWORDS_STORE_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "KYWA_HUB_PASSWORDS_V1",
        data: { passwords: globalPassStore.passwords }
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
