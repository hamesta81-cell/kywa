"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ExternalLink, Gift, CalendarDays, Megaphone, Phone, Lightbulb } from "lucide-react";
import { HANNUN_QUIZ, quizStatus } from "@/data/hannunQuiz";

const NAVY = "#142B63";
const RED = "#E8322B";

export default function HannunQuizPage() {
  const Q = HANNUN_QUIZ;
  const [status] = useState<"before" | "open" | "closed">(() => quizStatus());
  const [answers, setAnswers] = useState<(number | null)[]>(Q.questions.map(() => null));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isUnder14, setIsUnder14] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [agreeGuardian, setAgreeGuardian] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");

  const pick = (qi: number, oi: number) => setAnswers(prev => prev.map((v, i) => (i === qi ? oi : v)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const missing = answers.findIndex(a => a === null);
    if (missing !== -1) return setError(`Q${missing + 1} 답을 골라 주세요.`);
    if (!name.trim()) return setError("이름을 입력해 주세요.");
    if (!/^01\d{8,9}$/.test(phone.replace(/\D/g, ""))) return setError("휴대전화번호를 확인해 주세요. (예: 010-1234-5678)");
    if (isUnder14 && (!guardianName.trim() || !/^01\d{8,9}$/.test(guardianPhone.replace(/\D/g, "")) || !agreeGuardian))
      return setError("만 14세 미만은 보호자 이름·연락처와 보호자 동의가 필요합니다.");
    if (!agreePrivacy) return setError("개인정보 수집·이용에 동의해 주세요.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, name, phone, isUnder14, guardianName, guardianPhone, agreeGuardian, agreePrivacy, website }),
      });
      const data = await res.json();
      if (data.success) {
        setDoneId(data.id || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "응모에 실패했습니다. 잠시 뒤 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoRows = [
    { icon: CalendarDays, label: "이벤트 기간", value: Q.periodLabel },
    { icon: Megaphone, label: "당첨자 발표", value: `${Q.announceLabel} 한국청소년활동진흥원 홈페이지 공지` },
    { icon: Gift, label: "이벤트 상품", value: `${Q.prize} · 정답자 중 ${Q.winners}명 추첨` },
    { icon: Lightbulb, label: "퀴즈 힌트", value: Q.hint },
    { icon: Phone, label: "문의", value: Q.contact },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-28 pb-24 px-4">
      <div className="max-w-[960px] mx-auto space-y-8">
        {/* 머리 */}
        <section className="grid md:grid-cols-[minmax(0,400px)_1fr] gap-6 md:gap-10 items-start">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-[#FFD83D]">
            <Image src={Q.popupImage} alt="한눈정보 안전 퀴즈 이벤트 안내 이미지" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" priority />
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold" style={{ color: RED }}>한국청소년활동진흥원 · 청소년활동 안전정보</p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight" style={{ color: NAVY }}>{Q.title}</h1>
              <p className="mt-3 text-base text-slate-700 leading-relaxed">
                한눈정보를 읽고 퀴즈 5문제를 풀어 보세요. 정답을 맞히면 추첨을 통해 <strong>{Q.winners}분께 {Q.prize}</strong>을 드립니다.
              </p>
            </div>
            <dl className="border-t-2 divide-y divide-slate-200" style={{ borderColor: NAVY }}>
              {infoRows.map(r => (
                <div key={r.label} className="flex gap-3 py-2.5 text-sm">
                  <dt className="flex items-center gap-1.5 w-28 shrink-0 font-bold" style={{ color: RED }}>
                    <r.icon size={15} /> {r.label}
                  </dt>
                  <dd className="text-slate-800 font-medium leading-relaxed">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {doneId ? (
          <section className="bg-white border border-emerald-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
            <h2 className="text-2xl font-black" style={{ color: NAVY }}>응모가 완료되었습니다</h2>
            <p className="text-slate-700">접수번호 <strong>{doneId}</strong></p>
            <p className="text-slate-600 text-sm leading-relaxed">
              당첨자는 {Q.announceLabel} 한국청소년활동진흥원 홈페이지에 발표합니다.<br />
              당첨되시면 입력하신 휴대전화번호로 쿠폰을 보내 드립니다.
            </p>
          </section>
        ) : status !== "open" ? (
          <section className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2 shadow-sm">
            <h2 className="text-2xl font-black" style={{ color: NAVY }}>
              {status === "before" ? "응모 기간 전입니다" : "응모가 마감되었습니다"}
            </h2>
            <p className="text-slate-600">
              {status === "before" ? `응모 기간: ${Q.periodLabel}` : `참여해 주셔서 감사합니다. 당첨자 발표: ${Q.announceLabel}`}
            </p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* 퀴즈 */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-baseline justify-between px-6 sm:px-8 pt-7 pb-4 border-b-2" style={{ borderColor: NAVY }}>
                <h2 className="text-2xl font-black" style={{ color: NAVY }}>퀴즈 <span style={{ color: RED }}>5</span>문제</h2>
                <span className="text-sm text-slate-500">모든 문항에 답해 주세요</span>
              </div>
              <ol className="divide-y divide-slate-200">
                {Q.questions.map((q, qi) => (
                  <li key={q.no} className="px-6 sm:px-8 py-6">
                    <fieldset>
                      <legend className="flex gap-3 text-lg font-bold leading-snug" style={{ color: NAVY }}>
                        <span className="font-black shrink-0" style={{ color: RED }}>Q{q.no}</span>
                        <span>
                          {q.kind === "ox" && (
                            <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-xs font-black text-white align-middle" style={{ background: NAVY }}>O·X</span>
                          )}
                          {q.text}
                        </span>
                      </legend>
                      <div className={`mt-4 grid gap-2 ${q.kind === "ox" ? "grid-cols-2 max-w-xs" : q.options.some(o => o.length > 12) ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                        {q.options.map((opt, oi) => {
                          const checked = answers[qi] === oi;
                          return (
                            <label
                              key={oi}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${checked ? "bg-[#FFF6CC]" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                              style={checked ? { borderColor: NAVY } : undefined}
                            >
                              <input type="radio" name={`q${q.no}`} className="sr-only" checked={checked} onChange={() => pick(qi, oi)}
                                aria-label={q.kind === "ox" ? opt : `${oi + 1}번 ${opt}`} />
                              <span
                                className={`flex items-center justify-center shrink-0 rounded-full font-black ${q.kind === "ox" ? "w-9 h-9 text-lg" : "w-7 h-7 text-sm"} ${checked ? "text-white" : "text-slate-500 border border-slate-300"}`}
                                style={checked ? { background: NAVY } : undefined}
                              >
                                {q.kind === "ox" ? opt : oi + 1}
                              </span>
                              {q.kind !== "ox" && <span className="text-base text-slate-800">{opt}</span>}
                            </label>
                          );
                        })}
                      </div>
                      <a href={q.source.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#1558C9]">
                        <strong className="text-slate-700">참고 한눈정보</strong> {q.source.title} ({q.source.date}) <ExternalLink size={13} />
                      </a>
                    </fieldset>
                  </li>
                ))}
              </ol>
            </section>

            {/* 응모자 정보 */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 sm:px-8 py-7 space-y-5">
              <h2 className="text-xl font-black" style={{ color: NAVY }}>응모자 정보</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">이름</span>
                  <input value={name} onChange={e => setName(e.target.value)} maxLength={30} autoComplete="name"
                    className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base focus:outline-none focus:border-[#1558C9]" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700">휴대전화번호 <span className="font-normal text-slate-500">(쿠폰 발송용)</span></span>
                  <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="010-1234-5678"
                    className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base focus:outline-none focus:border-[#1558C9]" />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" checked={isUnder14} onChange={e => setIsUnder14(e.target.checked)} className="w-4 h-4" />
                만 14세 미만입니다
              </label>
              {isUnder14 && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    만 14세 미만 어린이·청소년의 개인정보는 법정대리인(보호자)의 동의가 있어야 받을 수 있습니다(개인정보 보호법 제22조의2).
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">보호자 이름</span>
                      <input value={guardianName} onChange={e => setGuardianName(e.target.value)} maxLength={30}
                        className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">보호자 휴대전화번호</span>
                      <input value={guardianPhone} onChange={e => setGuardianPhone(e.target.value)} inputMode="tel" placeholder="010-1234-5678"
                        className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base" />
                    </label>
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-800 cursor-pointer">
                    <input type="checkbox" checked={agreeGuardian} onChange={e => setAgreeGuardian(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    보호자로서 아래 개인정보 수집·이용에 동의합니다.
                  </label>
                </div>
              )}

              {/* 자동 입력 방지(사람에게는 보이지 않음) */}
              <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <p className="text-sm font-bold text-slate-800">개인정보 수집·이용 동의 (필수)</p>
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <thead>
                    <tr className="text-slate-600">
                      <th className="border border-slate-200 bg-white px-2 py-1.5 font-bold">수집·이용 목적</th>
                      <th className="border border-slate-200 bg-white px-2 py-1.5 font-bold">수집 항목</th>
                      <th className="border border-slate-200 bg-white px-2 py-1.5 font-bold">보유·이용 기간</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr>
                      <td className="border border-slate-200 bg-white px-2 py-1.5">퀴즈 이벤트 응모 확인, 당첨자 추첨·발표, 경품(모바일 쿠폰) 발송</td>
                      <td className="border border-slate-200 bg-white px-2 py-1.5">이름, 휴대전화번호 (만 14세 미만: 보호자 이름·휴대전화번호)</td>
                      <td className="border border-slate-200 bg-white px-2 py-1.5">경품 발송 완료 후 지체 없이 파기</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-slate-500 leading-relaxed">
                  개인정보 수집·이용에 동의하지 않을 권리가 있으며, 동의하지 않으면 이벤트에 응모할 수 없습니다.
                  당첨자 발표 때는 이름 일부와 휴대전화번호 뒷자리만 공개합니다.
                </p>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 cursor-pointer">
                  <input type="checkbox" checked={agreePrivacy} onChange={e => setAgreePrivacy(e.target.checked)} className="w-4 h-4" />
                  위 내용에 동의합니다.
                </label>
              </div>

              <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                <li>1인 1회 응모할 수 있습니다(같은 휴대전화번호로는 한 번만 응모됩니다).</li>
                <li>개인정보 미기재·오기재로 상품을 받지 못한 경우 재발송되지 않습니다.</li>
              </ul>

              {error && <p role="alert" className="text-sm font-bold" style={{ color: RED }}>{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl text-white text-lg font-black shadow-md disabled:opacity-60 transition-opacity"
                style={{ background: NAVY }}>
                {submitting ? "응모하는 중…" : "응모하기"}
              </button>
            </section>
          </form>
        )}
      </div>
    </div>
  );
}
