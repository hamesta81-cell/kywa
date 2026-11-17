"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Database,
  Download,
  FileCheck2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { getAuthToken } from "@/lib/clientAuth";

type DatasetKey = "shortform" | "hannun_quiz" | "ox_quiz" | "survey_event";
type TargetType = DatasetKey | "all";
type PurgeMode = "delete" | "anonymize";

interface DatasetSummary {
  key: DatasetKey;
  title: string;
  fileLabel: string;
  piiFields: string[];
  retentionPolicy: string;
  totalRecords: number;
  piiRecords: number;
  anonymizedRecords: number;
  under14Count: number;
  fileSizeBytes: number;
  lastModifiedKst: string | null;
  status: "ACTIVE_PII" | "ANONYMIZED" | "EMPTY_OR_PURGED";
}

interface PreservedAsset {
  key: string;
  title: string;
  fileLabel: string;
  recordCountLabel: string;
  containsPii: false;
  note: string;
}

interface BackupLog {
  id: string;
  createdAtKst: string;
  target: TargetType;
  sha256: string;
  zipFileName: string;
  zipSizeBytes: number;
  recordCounts: Record<DatasetKey, number>;
  executedBy: string;
}

interface PurgeLog {
  id: string;
  purgedAtKst: string;
  datasetKey: DatasetKey;
  datasetTitle: string;
  fileLabel: string;
  mode: PurgeMode;
  recordsBefore: number;
  piiRecordsCleared: number;
  recordsAfter: number;
  clearedFields: string[];
  backupSha256: string;
  executedBy: string;
  reason: string;
}

interface DatabaseStatus {
  configured: boolean;
  connected: boolean;
  userCount: number | null;
  contestCount: number | null;
  note: string;
}

export default function AdminPrivacyVaultPanel({ onPurgeSuccess }: { onPurgeSuccess?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [inventory, setInventory] = useState<DatasetSummary[]>([]);
  const [preservedAssets, setPreservedAssets] = useState<PreservedAsset[]>([]);
  const [backupLogs, setBackupLogs] = useState<BackupLog[]>([]);
  const [purgeLogs, setPurgeLogs] = useState<PurgeLog[]>([]);
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus | null>(null);
  const [storageMode, setStorageMode] = useState<string>("");

  const [downloadingTarget, setDownloadingTarget] = useState<TargetType | null>(null);
  const [verifiedBackup, setVerifiedBackup] = useState<{
    sha256: string;
    fileName: string;
    target: TargetType;
  } | null>(null);

  const [purgeTarget, setPurgeTarget] = useState<TargetType>("all");
  const [purgeMode, setPurgeMode] = useState<PurgeMode>("delete");
  const [purgeReason, setPurgeReason] = useState(
    "수집·이용 목적 달성(심사·추첨·경품 발송 완료)에 따른 별도 백업 후 영구 파기"
  );
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [purging, setPurging] = useState(false);

  const authHeaders = (): Record<string, string> => {
    const token = getAuthToken();
    const h: Record<string, string> = {};
    if (token) h["x-kywa-auth"] = token;
    return h;
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/admin/privacy?t=${Date.now()}`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "개인정보 보관 현황을 불러오지 못했습니다. 총괄 관리자 인증을 확인해 주세요.");
        return;
      }
      setInventory(Array.isArray(data.inventory) ? data.inventory : []);
      setPreservedAssets(Array.isArray(data.preservedAssets) ? data.preservedAssets : []);
      setBackupLogs(Array.isArray(data.backupLogs) ? data.backupLogs : []);
      setPurgeLogs(Array.isArray(data.purgeLogs) ? data.purgeLogs : []);
      setDatabaseStatus(data.databaseStatus || null);
      setStorageMode(data.storageMode || "");
    } catch {
      setErrorMsg("서버와 통신하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleDownloadBackup = async (target: TargetType) => {
    setDownloadingTarget(target);
    try {
      const res = await fetch(`/api/admin/privacy?action=backup&target=${encodeURIComponent(target)}&t=${Date.now()}`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      if (!res.ok || !(res.headers.get("content-type") || "").includes("application/zip")) {
        const errData = await res.json().catch(() => ({}));
        alert(`⚠️ 백업 생성 실패: ${errData.message || "관리자 인증을 다시 확인해 주세요."}`);
        return;
      }
      const sha256 = res.headers.get("X-Backup-Sha256") || "";
      const fileName = res.headers.get("X-Backup-File") || `kywa_privacy_backup_${target}.zip`;
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      if (sha256) {
        setVerifiedBackup({ sha256, fileName, target });
        if (target !== "all") setPurgeTarget(target);
      }
      await fetchStatus();
      alert(
        `✅ 별도 백업 ZIP 다운로드 완료!\n\n파일명: ${fileName}\nSHA-256: ${sha256.slice(0, 16)}...\n\n이제 아래 [2단계: 개인정보 파기 실행]에서 파기를 진행할 수 있습니다.`
      );
    } catch {
      alert("⚠️ 백업 파일 다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloadingTarget(null);
    }
  };

  const handleDownloadLedgerCsv = async () => {
    try {
      const res = await fetch(`/api/admin/privacy?action=ledger_csv&t=${Date.now()}`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      if (!res.ok || !(res.headers.get("content-type") || "").includes("text/csv")) {
        alert("⚠️ 파기 대장을 내려받지 못했습니다.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kywa_privacy_purge_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("⚠️ 파기 대장 CSV 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleExecutePurge = async () => {
    if (!verifiedBackup?.sha256) {
      alert("⚠️ 먼저 [1단계: 별도 백업 ZIP 다운로드]를 완료해 주세요.");
      return;
    }
    if (confirmPhrase.trim() !== "파기확인") {
      alert("⚠️ 확인란에 '파기확인'을 정확히 입력해 주세요.");
      return;
    }

    const targetLabel =
      purgeTarget === "all"
        ? "전체 4개 개인정보 데이터셋"
        : inventory.find(i => i.key === purgeTarget)?.title || purgeTarget;
    const modeLabel =
      purgeMode === "delete"
        ? "레코드 완전 삭제(파일 내 개인정보 일괄 초기화)"
        : "비식별화(성명·생년월일·연락처·이메일·법정대리인 소거, 건수·통계만 보존)";

    if (
      !confirm(
        `🚨 최종 파기 확인\n\n• 파기 대상: ${targetLabel}\n• 파기 방식: ${modeLabel}\n• 검증 백업본: ${verifiedBackup.fileName}\n\n이 작업은 사이트 내부 저장소에서 되돌릴 수 없습니다. 백업 ZIP 파일을 PC에 안전하게 저장하셨습니까?`
      )
    ) {
      return;
    }

    setPurging(true);
    try {
      const res = await fetch("/api/admin/privacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          target: purgeTarget,
          mode: purgeMode,
          backupSha256: verifiedBackup.sha256,
          reason: purgeReason,
          confirmPhrase: confirmPhrase.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        alert(`⚠️ 파기 실행 실패: ${data.message || "서버 오류"}`);
        return;
      }

      setInventory(Array.isArray(data.inventory) ? data.inventory : []);
      setPreservedAssets(Array.isArray(data.preservedAssets) ? data.preservedAssets : []);
      setBackupLogs(Array.isArray(data.backupLogs) ? data.backupLogs : []);
      setPurgeLogs(Array.isArray(data.purgeLogs) ? data.purgeLogs : []);
      setConfirmPhrase("");
      onPurgeSuccess?.();
      alert(`🟢 ${data.message}`);
    } catch {
      alert("⚠️ 개인정보 파기 요청 중 오류가 발생했습니다.");
    } finally {
      setPurging(false);
    }
  };

  const totalPiiRecords = inventory.reduce((s, item) => s + item.piiRecords, 0);
  const totalStoredRecords = inventory.reduce((s, item) => s + item.totalRecords, 0);
  const totalUnder14 = inventory.reduce((s, item) => s + item.under14Count, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 상단 핵심 안내 및 2단계 프로토콜 */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-rose-950/30 p-6 rounded-2xl border border-rose-500/40 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-500/40">
              <Lock size={11} /> PRIVACY VAULT · BACKUP &amp; PURGE CONSOLE
            </span>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              🔐 사이트 내 개인정보 별도 백업 및 영구 파기 콘솔
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              참여자 개인정보를 <strong className="text-amber-300">CSV(엑셀) + 원본 JSON + SHA-256 무결성 검증서</strong> 묶음 ZIP으로 PC에 먼저 별도 백업한 뒤, 사이트 디스크에서 안전하게 파기(완전 삭제 또는 비식별화)하고 <strong className="text-emerald-300">법정 파기 확인 대장</strong>을 자동 기록합니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={fetchStatus}
              disabled={loading}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>현황 새로고침</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadBackup("all")}
              disabled={downloadingTarget !== null}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl border border-amber-400 text-xs font-black flex items-center gap-1.5 shadow-lg"
            >
              <Archive size={14} />
              <span>{downloadingTarget === "all" ? "백업 ZIP 생성 중..." : "1단계: 전체 개인정보 백업 ZIP 다운로드"}</span>
            </button>
          </div>
        </div>

        {/* 요약 KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 tabular-nums">
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">개인정보 포함 건수</span>
            <strong className={`text-2xl font-black block ${totalPiiRecords > 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {totalPiiRecords.toLocaleString()}건
            </strong>
            <span className="text-[10px] text-slate-400 block">전체 저장 레코드 {totalStoredRecords.toLocaleString()}건 중</span>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">만 14세 미만(법정대리인)</span>
            <strong className="text-2xl font-black text-amber-300 block">{totalUnder14.toLocaleString()}건</strong>
            <span className="text-[10px] text-slate-400 block">보호자 성명·연락처 포함</span>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">비식별·운영 통계 데이터</span>
            <strong className="text-2xl font-black text-emerald-400 block">자동 보존</strong>
            <span className="text-[10px] text-slate-400 block">미션 7,662건 · 설문응답 · 방문자 · 홍보단</span>
          </div>
          <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">파기 실행 감사 이력</span>
            <strong className="text-2xl font-black text-cyan-300 block">{purgeLogs.length.toLocaleString()}건</strong>
            <span className="text-[10px] text-slate-400 block">
              저장소: {storageMode === "persistent_disk" ? "Render 영구 디스크(/var/data)" : "로컬 데이터 디스크"}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* 1단계: 저장소별 개인정보 보유 현황 테이블 */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-black text-white">📋 1단계. 사이트 내 개인정보 저장소별 실시간 현황 및 개별 백업</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              각 이벤트·공모전 파일에 실제로 남아 있는 성명·연락처·이메일·생년월일·법정대리인 정보 보유 건수입니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-700 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-black border-b border-slate-700">
                <th className="p-3">대상 사업 · 데이터셋</th>
                <th className="p-3">보관 파일 / 파기 기준</th>
                <th className="p-3">개인정보 보유량</th>
                <th className="p-3">수집 항목</th>
                <th className="p-3">상태</th>
                <th className="p-3 text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {inventory.map(item => (
                <tr key={item.key} className="hover:bg-slate-700/30">
                  <td className="p-3 font-bold text-white align-top">
                    <div>{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">키: {item.key}</div>
                  </td>
                  <td className="p-3 align-top space-y-1">
                    <div className="font-mono text-[11px] text-cyan-300">{item.fileLabel}</div>
                    <div className="text-[10px] text-slate-400">{item.retentionPolicy}</div>
                    {item.lastModifiedKst && (
                      <div className="text-[10px] text-slate-500">최근 수정: {item.lastModifiedKst} ({item.fileSizeBytes.toLocaleString()} bytes)</div>
                    )}
                  </td>
                  <td className="p-3 align-top tabular-nums">
                    <div className={`text-sm font-black ${item.piiRecords > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {item.piiRecords.toLocaleString()}건
                    </div>
                    <div className="text-[10px] text-slate-400">
                      전체 {item.totalRecords.toLocaleString()}건 · 비식별 {item.anonymizedRecords.toLocaleString()}건
                    </div>
                    {item.under14Count > 0 && (
                      <div className="text-[10px] text-amber-300 font-bold">만14세 미만 {item.under14Count}건</div>
                    )}
                  </td>
                  <td className="p-3 align-top max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {item.piiFields.map(f => (
                        <span key={f} className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    {item.status === "ACTIVE_PII" && (
                      <span className="inline-flex px-2 py-1 rounded text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-500/40">
                        파기 대상 보유 중
                      </span>
                    )}
                    {item.status === "ANONYMIZED" && (
                      <span className="inline-flex px-2 py-1 rounded text-[10px] font-black bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                        비식별 파기 완료
                      </span>
                    )}
                    {item.status === "EMPTY_OR_PURGED" && (
                      <span className="inline-flex px-2 py-1 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        완전 파기 (0건)
                      </span>
                    )}
                  </td>
                  <td className="p-3 align-top text-right space-y-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadBackup(item.key)}
                      disabled={downloadingTarget !== null}
                      className="block w-full px-2.5 py-1.5 bg-slate-900 hover:bg-amber-700/60 text-amber-300 rounded-lg border border-amber-500/40 text-[11px] font-bold"
                    >
                      {downloadingTarget === item.key ? "생성 중..." : "개별 백업 ZIP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPurgeTarget(item.key)}
                      className="block w-full px-2.5 py-1.5 bg-slate-900 hover:bg-rose-900/50 text-rose-300 rounded-lg border border-rose-500/40 text-[11px] font-bold"
                    >
                      파기 대상으로 선택
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {databaseStatus && (
          <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
            <Database size={14} className="text-cyan-400 shrink-0" />
            <span>
              <strong>외부 DB(PostgreSQL) 점검:</strong> {databaseStatus.note}
              {databaseStatus.connected &&
                ` (User ${databaseStatus.userCount ?? 0}건 / Contest ${databaseStatus.contestCount ?? 0}건)`}
            </span>
          </div>
        )}
      </div>

      {/* 2단계: 백업 무결성 검증 및 파기 실행 패널 */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-rose-500/40 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Trash2 size={15} className="text-rose-400" />
              2단계. 백업 검증 후 개인정보 영구 파기 실행
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              1단계에서 백업 ZIP을 내려받아야만 검증 해시(SHA-256)가 연결되어 파기 버튼이 활성화됩니다.
            </p>
          </div>
          {verifiedBackup ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[11px] font-black">
              <FileCheck2 size={13} />
              백업 검증 연결됨 ({verifiedBackup.sha256.slice(0, 12)}...)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
              <AlertTriangle size={13} />
              먼저 위 [백업 ZIP 다운로드]를 진행해 주세요
            </span>
          )}
        </div>

        {/* 최근 서버 백업 이력이 있으면 재연결 옵션 제공 */}
        {!verifiedBackup && backupLogs.length > 0 && (
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <div className="text-slate-300">
              최근 내려받은 백업 기록이 서버에 남아 있습니다:{" "}
              <strong className="text-amber-300 font-mono">{backupLogs[0].zipFileName}</strong> ({backupLogs[0].createdAtKst})
            </div>
            <button
              type="button"
              onClick={() =>
                setVerifiedBackup({
                  sha256: backupLogs[0].sha256,
                  fileName: backupLogs[0].zipFileName,
                  target: backupLogs[0].target,
                })
              }
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-amber-500/40 font-black shrink-0"
            >
              PC에 보관 중이라면 이 백업본으로 연결
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-200 block">① 파기할 대상 선택</label>
            <select
              value={purgeTarget}
              onChange={e => setPurgeTarget(e.target.value as TargetType)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold"
            >
              <option value="all">전체 4개 데이터셋 일괄 파기 (보유 중 {totalPiiRecords.toLocaleString()}건)</option>
              {inventory.map(item => (
                <option key={item.key} value={item.key}>
                  {item.title} (보유 {item.piiRecords.toLocaleString()}건 / {item.fileLabel})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-200 block">② 파기 방식 선택</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPurgeMode("delete")}
                className={`p-2.5 rounded-xl border text-left text-[11px] transition-all ${
                  purgeMode === "delete"
                    ? "bg-rose-950/70 border-rose-400 text-white"
                    : "bg-slate-900 border-slate-700 text-slate-300"
                }`}
              >
                <strong className="block font-black">레코드 완전 삭제 (권장)</strong>
                <span className="text-[10px] text-slate-300">파일 내 응모·접수 목록을 `[]`로 완전 초기화</span>
              </button>
              <button
                type="button"
                onClick={() => setPurgeMode("anonymize")}
                className={`p-2.5 rounded-xl border text-left text-[11px] transition-all ${
                  purgeMode === "anonymize"
                    ? "bg-cyan-950/70 border-cyan-400 text-white"
                    : "bg-slate-900 border-slate-700 text-slate-300"
                }`}
              >
                <strong className="block font-black">비식별 파기(통계 보존)</strong>
                <span className="text-[10px] text-slate-300">이름·연락처·이메일·URL만 소거, 건수·구분 유지</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-black text-slate-200 block">③ 파기 사유 (관리 대장 공식 기록)</label>
            <input
              type="text"
              value={purgeReason}
              onChange={e => setPurgeReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              placeholder="예: 경품 발송 및 결과보고 완료에 따른 개인정보 파기"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-rose-300 block">④ 안전 확인 문구 입력 (&apos;파기확인&apos;)</label>
            <input
              type="text"
              value={confirmPhrase}
              onChange={e => setConfirmPhrase(e.target.value)}
              placeholder="파기확인"
              className="w-full px-3 py-2.5 bg-slate-900 border border-rose-500/50 rounded-xl text-xs text-white font-bold"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400">
            연결된 백업본 SHA-256:{" "}
            <span className="font-mono text-slate-200">{verifiedBackup ? verifiedBackup.sha256 : "없음 (1단계 백업 필요)"}</span>
          </div>
          <button
            type="button"
            onClick={handleExecutePurge}
            disabled={!verifiedBackup || confirmPhrase.trim() !== "파기확인" || purging}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Trash2 size={15} />
            <span>{purging ? "영구 파기 처리 중..." : "백업 검증 확인 · 개인정보 영구 파기 실행"}</span>
          </button>
        </div>
      </div>

      {/* 파기 대상에서 자동 제외되는 비식별·통계 자산 */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-emerald-500/30 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
          <h3 className="text-sm font-black text-emerald-300 flex items-center gap-2">
            <ShieldCheck size={16} /> 파기 대상 제외 · 자동 보존되는 비식별 통계 및 공식 활동 데이터
          </h3>
          <span className="text-[10px] font-black text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/40">
            100% PRESERVED
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {preservedAssets.map(asset => (
            <div key={asset.key} className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-xs font-black text-white">{asset.title}</strong>
                <span className="text-[11px] font-black text-emerald-400 tabular-nums">{asset.recordCountLabel}</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-300">{asset.fileLabel}</div>
              <p className="text-[11px] text-slate-400">{asset.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 법적 개인정보 파기 관리 대장 */}
      <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <span className="text-[10px] font-black text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              STATUTORY PURGE LEDGER
            </span>
            <h3 className="text-sm font-black text-white mt-1 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              개인정보 백업·파기 실행 관리 대장 ({purgeLogs.length}건)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleDownloadLedgerCsv}
            className="px-3.5 py-2 bg-[#1558C9] hover:bg-blue-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>파기 관리 대장 CSV 다운로드</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-700 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-black border-b border-slate-700">
                <th className="p-2.5">파기 일시(KST)</th>
                <th className="p-2.5">대상 데이터셋</th>
                <th className="p-2.5">방식</th>
                <th className="p-2.5">건수 변화</th>
                <th className="p-2.5">사전 백업 SHA-256</th>
                <th className="p-2.5">담당자 / 사유</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {purgeLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    아직 실행된 파기 이력이 없습니다. 위에서 백업 후 파기를 실행하면 감사 증빙 대장이 자동 기록됩니다.
                  </td>
                </tr>
              ) : (
                purgeLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-700/30">
                    <td className="p-2.5 font-mono text-[11px] text-rose-300 whitespace-nowrap">{log.purgedAtKst}</td>
                    <td className="p-2.5 text-white font-bold">
                      <div>{log.datasetTitle}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.fileLabel}</div>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-950 text-rose-300 border border-rose-500/40">
                        {log.mode === "delete" ? "완전 삭제" : "비식별화"}
                      </span>
                    </td>
                    <td className="p-2.5 tabular-nums text-slate-200">
                      전 {log.recordsBefore.toLocaleString()}건 → 후 {log.recordsAfter.toLocaleString()}건
                      <div className="text-[10px] text-emerald-400 font-bold">
                        파기된 개인정보 {log.piiRecordsCleared.toLocaleString()}건
                      </div>
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-amber-300 break-all max-w-[160px]">
                      {log.backupSha256}
                    </td>
                    <td className="p-2.5 text-slate-300">
                      <div className="font-bold text-cyan-300">{log.executedBy}</div>
                      <div className="text-[11px] text-slate-400">{log.reason}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
