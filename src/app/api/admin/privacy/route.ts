import fs from "fs";
import { NextResponse } from "next/server";
import { authError, readAuth } from "@/lib/serverAuth";
import {
  buildPurgeLedgerCsv,
  createPrivacyBackupBundle,
  getBackupLogs,
  getOptionalDatabaseStatus,
  getPreservedAssetsSummary,
  getPrivacyInventory,
  getPurgeLogs,
  purgePrivacyDatasets,
  type PrivacyTarget,
  type PurgeMode,
} from "@/lib/privacyVault";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

const VALID_TARGETS = new Set<PrivacyTarget>(["all", "shortform", "hannun_quiz", "ox_quiz", "survey_event"]);
const VALID_MODES = new Set<PurgeMode>(["delete", "anonymize"]);

function requireAdmin(req: Request) {
  const auth = readAuth(req);
  if (!auth) {
    return { ok: false as const, response: authError(401, "총괄 관리자 로그인이 필요합니다.") };
  }
  if (auth.role !== "ADMIN") {
    return { ok: false as const, response: authError(403, "총괄 관리자(ADMIN)만 개인정보 백업 및 파기를 실행할 수 있습니다.") };
  }
  return { ok: true as const, auth };
}

export async function GET(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "status";

  if (action === "backup") {
    const rawTarget = (searchParams.get("target") || "all") as PrivacyTarget;
    if (!VALID_TARGETS.has(rawTarget)) {
      return NextResponse.json({ success: false, message: "올바르지 않은 백업 대상입니다." }, { status: 400 });
    }
    try {
      const { zipBuffer, zipFileName, sha256, logEntry } = createPrivacyBackupBundle(
        rawTarget,
        gate.auth.team || "총괄 관리자"
      );
      return new Response(new Uint8Array(zipBuffer), {
        status: 200,
        headers: {
          ...NO_CACHE_HEADERS,
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${zipFileName}"`,
          "X-Backup-Sha256": sha256,
          "X-Backup-File": zipFileName,
          "X-Backup-Id": logEntry.id,
        },
      });
    } catch (err) {
      console.error("[Privacy Backup Error]", err);
      return NextResponse.json({ success: false, message: "백업 ZIP 생성 중 오류가 발생했습니다." }, { status: 500 });
    }
  }

  if (action === "ledger_csv") {
    try {
      const csv = buildPurgeLedgerCsv();
      const dateStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
      return new Response(csv, {
        status: 200,
        headers: {
          ...NO_CACHE_HEADERS,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="kywa_privacy_purge_ledger_${dateStr}.csv"`,
        },
      });
    } catch (err) {
      console.error("[Privacy Ledger CSV Error]", err);
      return NextResponse.json({ success: false, message: "파기 대장 CSV 생성 중 오류가 발생했습니다." }, { status: 500 });
    }
  }

  try {
    const databaseStatus = await getOptionalDatabaseStatus();
    return NextResponse.json(
      {
        success: true,
        inventory: getPrivacyInventory(),
        preservedAssets: getPreservedAssetsSummary(),
        backupLogs: getBackupLogs(),
        purgeLogs: getPurgeLogs(),
        databaseStatus,
        storageMode: process.env.DATA_DIR || fs.existsSync("/var/data") ? "persistent_disk" : "local_disk",
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error("[Privacy Status Error]", err);
    return NextResponse.json({ success: false, message: "개인정보 현황을 조회하지 못했습니다." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const body = await req.json();
    const target = body?.target as PrivacyTarget;
    const mode = (body?.mode || "delete") as PurgeMode;
    const backupSha256 = String(body?.backupSha256 || "").trim();
    const confirmPhrase = String(body?.confirmPhrase || "").trim();
    const reason = String(body?.reason || "").trim();

    if (!VALID_TARGETS.has(target)) {
      return NextResponse.json({ success: false, message: "올바르지 않은 파기 대상입니다." }, { status: 400 });
    }
    if (!VALID_MODES.has(mode)) {
      return NextResponse.json({ success: false, message: "파기 방식은 delete 또는 anonymize만 허용됩니다." }, { status: 400 });
    }
    if (confirmPhrase !== "파기확인") {
      return NextResponse.json(
        { success: false, message: "영구 파기 확인 문구('파기확인')를 정확히 입력해 주세요." },
        { status: 400 }
      );
    }

    const { results, backupVerified } = purgePrivacyDatasets({
      target,
      mode,
      backupSha256,
      executedBy: `${gate.auth.team || "총괄 관리자"} (ADMIN)`,
      reason,
    });

    const clearedTotal = results.reduce((sum, r) => sum + r.piiRecordsCleared, 0);
    return NextResponse.json(
      {
        success: true,
        message: `별도 백업 검증(${backupVerified.zipFileName}) 후 ${results.length}개 데이터셋의 개인정보 ${clearedTotal.toLocaleString()}건을 파기했습니다.`,
        results,
        inventory: getPrivacyInventory(),
        preservedAssets: getPreservedAssetsSummary(),
        backupLogs: getBackupLogs(),
        purgeLogs: getPurgeLogs(),
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    const message = typeof err?.message === "string" ? err.message : "개인정보 파기 처리 중 오류가 발생했습니다.";
    const isValidationError =
      message.includes("백업") || message.includes("파기") || message.includes("대상") || message.includes("기록");
    return NextResponse.json({ success: false, message }, { status: isValidationError ? 400 : 500 });
  }
}
