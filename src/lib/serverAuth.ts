import crypto from "crypto";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { NextResponse } from "next/server";
import { getPersistentDataDir } from "@/lib/diskStorage";
import { OFFICIAL_16_CREW_TEAMS, type OfficialCrewTeam } from "@/data/officialCrewData";
import { ADMIN_PASSWORD_HASH, CREW_PASSWORD_HASHES } from "@/data/crewCredentials";

// 🔒 서버 측 로그인 확인: 비밀번호는 scrypt 해시로만 비교하고, 로그인하면 서명된 토큰을 준다.
// 화면 쪽은 토큰을 x-kywa-auth 머리글로 보내고(src/lib/clientAuth.ts), 쓰기 API는 여기서 확인한다.

const scrypt = promisify(crypto.scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;
export const AUTH_HEADER = "x-kywa-auth";
export const ADMIN_USERNAMES = ["admin@kywa.or.kr", "admin", "총괄관리자", "총괄 관리자"];

export type AuthUser = { role: "ADMIN" | "CREW"; team: string; teamId: number; exp: number };

function privateDir(): string {
  const dir = path.join(getPersistentDataDir(), "private");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ── 비밀번호 ──────────────────────────────────────────────

export async function hashPassword(pw: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const h = await scrypt(pw, salt, 32);
  return `scrypt$${salt.toString("base64")}$${h.toString("base64")}`;
}

async function verifyPassword(pw: string, stored: string | undefined): Promise<boolean> {
  if (!pw || !stored) return false;
  const [kind, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const got = await scrypt(pw, Buffer.from(salt, "base64"), expected.length);
  return crypto.timingSafeEqual(got, expected);
}

// 팀·관리자가 직접 바꾼 비밀번호(해시). 키: 팀 id 문자열, 관리자는 "admin".
function overridesPath() {
  return path.join(privateDir(), "crew_password_hashes.json");
}

function readOverrides(): Record<string, string> {
  try {
    const parsed = JSON.parse(fs.readFileSync(overridesPath(), "utf-8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverrides(data: Record<string, string>) {
  const file = overridesPath();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

export async function verifyAdminPassword(pw: string): Promise<boolean> {
  const stored = readOverrides().admin || process.env.ADMIN_PASSWORD_HASH || ADMIN_PASSWORD_HASH;
  return verifyPassword(pw, stored);
}

export async function verifyCrewPassword(teamId: number, pw: string): Promise<boolean> {
  return verifyPassword(pw, readOverrides()[String(teamId)] || CREW_PASSWORD_HASHES[teamId]);
}

export async function setPasswordOverride(key: number | "admin", pw: string) {
  const hash = await hashPassword(pw);
  const data = readOverrides();
  data[String(key)] = hash;
  writeOverrides(data);
}

export function clearPasswordOverride(key: number | "admin") {
  const data = readOverrides();
  delete data[String(key)];
  writeOverrides(data);
}

export function changedPasswordTeamIds(): number[] {
  return Object.keys(readOverrides()).filter(k => k !== "admin").map(Number).filter(n => !Number.isNaN(n));
}

// ── 팀 찾기 ───────────────────────────────────────────────

export function normTeam(s: unknown): string {
  return String(s || "").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

export function sameTeam(a: unknown, b: unknown): boolean {
  const x = normTeam(a), y = normTeam(b);
  if (!x || !y) return false;
  return x === y || (x.length > 2 && y.length > 2 && (x.includes(y) || y.includes(x)));
}

export function isAdminUsername(username: string): boolean {
  return ADMIN_USERNAMES.includes(username.trim());
}

export function findCrewAccount(username: string): OfficialCrewTeam | undefined {
  const u = username.trim().toLowerCase();
  if (u.length < 2) return undefined;
  return (
    OFFICIAL_16_CREW_TEAMS.find(acc => acc.username.toLowerCase() === u) ||
    OFFICIAL_16_CREW_TEAMS.find(acc => normTeam(acc.teamName) === normTeam(u)) ||
    OFFICIAL_16_CREW_TEAMS.find(acc => sameTeam(acc.teamName, u))
  );
}

export function findCrewByTeamName(teamName: string): OfficialCrewTeam | undefined {
  return OFFICIAL_16_CREW_TEAMS.find(acc => sameTeam(acc.teamName, teamName));
}

// ── 토큰 ──────────────────────────────────────────────────

let cachedSecret: Buffer | null = null;

function tokenSecret(): Buffer {
  if (cachedSecret) return cachedSecret;
  if (process.env.AUTH_TOKEN_SECRET) return (cachedSecret = Buffer.from(process.env.AUTH_TOKEN_SECRET));
  const file = path.join(privateDir(), "auth_token_secret.key");
  try {
    fs.writeFileSync(file, crypto.randomBytes(32).toString("hex"), { flag: "wx", mode: 0o600 });
  } catch {}
  cachedSecret = Buffer.from(fs.readFileSync(file, "utf-8").trim(), "hex");
  return cachedSecret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", tokenSecret()).update(payload).digest("base64url");
}

export function signToken(user: Omit<AuthUser, "exp">): string {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readAuth(req: Request): AuthUser | null {
  const raw = req.headers.get(AUTH_HEADER) || "";
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (!user || typeof user.exp !== "number" || user.exp < Date.now()) return null;
    if (user.role !== "ADMIN" && user.role !== "CREW") return null;
    return user as AuthUser;
  } catch {
    return null;
  }
}

export function authError(status: 401 | 403, message?: string) {
  const msg = message || (status === 401 ? "로그인이 필요합니다. 다시 로그인해 주세요." : "이 작업을 할 권한이 없습니다.");
  return NextResponse.json({ success: false, error: msg, message: msg }, { status });
}
