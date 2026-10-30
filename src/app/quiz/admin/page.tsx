"use client";

import { useState } from "react";
import { Download, Lock } from "lucide-react";

// 퀴즈 응모 내역 관리자 화면: 관리자 키를 넣으면 응모 수 확인·CSV 다운로드.
export default function QuizAdminPage() {
  const [key, setKey] = useState("");
  const [stats, setStats] = useState<{ count: number; under14: number; status: string } | null>(null);
  const [error, setError] = useState("");

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/quiz", { headers: { "x-quiz-admin-key": key }, cache: "no-store" });
    const data = await res.json();
    if (typeof data.count === "number") setStats(data);
    else {
      setStats(null);
      setError("관리자 키가 맞지 않습니다.");
    }
  };

  const download = async () => {
    const res = await fetch("/api/quiz?format=csv", { headers: { "x-quiz-admin-key": key }, cache: "no-store" });
    if (!res.ok || !(res.headers.get("content-type") || "").includes("text/csv")) {
      setError("다운로드에 실패했습니다. 관리자 키를 확인해 주세요.");
      return;
    }
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hannun_quiz_entries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4">
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-7 space-y-5">
        <h1 className="flex items-center gap-2 text-xl font-black text-[#142B63]"><Lock size={18} /> 한눈정보 퀴즈 응모 관리</h1>
        <form onSubmit={check} className="space-y-3">
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="관리자 키" autoComplete="off"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg" />
          <button type="submit" className="w-full py-2.5 rounded-lg bg-[#142B63] text-white font-bold">확인</button>
        </form>
        {error && <p className="text-sm font-bold text-[#E8322B]">{error}</p>}
        {stats && (
          <div className="space-y-3">
            <p className="text-slate-700">
              응모 <strong className="text-2xl text-[#142B63]">{stats.count.toLocaleString()}</strong>건
              <span className="text-sm text-slate-500"> (만 14세 미만 {stats.under14}건 · 상태 {stats.status === "open" ? "접수 중" : stats.status === "closed" ? "마감" : "시작 전"})</span>
            </p>
            <button onClick={download} className="w-full py-2.5 rounded-lg border-2 border-[#142B63] text-[#142B63] font-bold flex items-center justify-center gap-2">
              <Download size={16} /> 응모 내역 CSV 내려받기
            </button>
            <p className="text-xs text-slate-500">이름·휴대전화가 들어 있는 파일입니다. 추첨·발송에만 쓰고 발송 뒤 파기해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
