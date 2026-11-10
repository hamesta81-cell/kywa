"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Gift, CalendarDays, Megaphone, Phone, Clock } from "lucide-react";
import {
  SATISFACTION_SURVEY as S,
  PROGRAM_QUESTION_ID,
  SCALE_LABELS,
  TEXT_MAX,
  surveyStatus,
  visibleSections,
  type SurveyQuestion,
} from "@/data/satisfactionSurvey";

const NAVY = "#142B63";
const RED = "#E8322B";

type Answer = number | number[] | string;
const isPhone = (v: string) => /^01\d{8,9}$/.test(v.replace(/\D/g, ""));

// 참여자 만족도·인지도 조사 화면 (/survey)
export default function SurveyForm() {
  const [status] = useState<"before" | "open" | "closed">(() => surveyStatus(new Date()));
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [wantEvent, setWantEvent] = useState(false);
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
  const [done, setDone] = useState<null | { entered: boolean }>(null);

  const programAnswer = answers[PROGRAM_QUESTION_ID] as number[] | undefined;
  // 보이는 영역과, 화면에 붙일 문항 번호(1부터 이어서)
  const { sections, numbers } = useMemo(() => {
    const sections = visibleSections(programAnswer ?? []);
    const numbers: Record<string, number> = {};
    sections.flatMap(s => s.questions).forEach((q, i) => { numbers[q.id] = i + 1; });
    return { sections, numbers };
  }, [programAnswer]);

  const set = (id: string, value: Answer) => setAnswers(prev => ({ ...prev, [id]: value }));
  const toggle = (id: string, oi: number) =>
    setAnswers(prev => {
      const cur = (prev[id] as number[] | undefined) ?? [];
      return { ...prev, [id]: cur.includes(oi) ? cur.filter(v => v !== oi) : [...cur, oi] };
    });

  const isAnswered = (q: SurveyQuestion) => {
    const v = answers[q.id];
    if (q.kind === "text") return q.optional || !!String(v ?? "").trim();
    if (q.kind === "multi") return Array.isArray(v) && v.length > 0;
    return typeof v === "number";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    for (const s of sections) {
      const missing = s.questions.find(q => !isAnswered(q));
      if (missing) {
        document.getElementById(`q-${missing.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return setError(`답하지 않은 문항이 있습니다: ${missing.text}`);
      }
    }
    if (wantEvent) {
      if (!name.trim()) return setError("이름을 입력해 주세요.");
      if (!isPhone(phone)) return setError("휴대전화번호를 확인해 주세요. (예: 010-1234-5678)");
      if (isUnder14 && (!guardianName.trim() || !isPhone(guardianPhone) || !agreeGuardian))
        return setError("만 14세 미만은 보호자 이름·연락처와 보호자 동의가 필요합니다.");
      if (!agreePrivacy) return setError("개인정보 수집·이용에 동의해 주세요.");
    }

    // 보이는 문항의 답만 보낸다.
    const visible: Record<string, Answer> = {};
    for (const s of sections) for (const q of s.questions) if (answers[q.id] !== undefined) visible[q.id] = answers[q.id];

    setSubmitting(true);
    try {
      const res = await fetch(S.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: visible, wantEvent, name, phone, isUnder14, guardianName, guardianPhone, agreeGuardian, agreePrivacy, website,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDone({ entered: !!data.entered });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.message || "제출에 실패했습니다. 잠시 뒤 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const infoRows = [
    { icon: CalendarDays, label: "조사 기간", value: S.periodLabel },
    { icon: Clock, label: "소요 시간", value: "약 3~5분" },
    { icon: Gift, label: "참여 경품", value: `${S.prize} · 응모자 중 ${S.winnersLabel}` },
    { icon: Megaphone, label: "당첨자 발표", value: S.announceLabel },
    { icon: Phone, label: "문의", value: S.contact },
  ];

  const renderOptions = (q: SurveyQuestion) => {
    if (q.kind === "scale") {
      const v = answers[q.id];
      return (
        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
          {SCALE_LABELS.map((label, i) => {
            const checked = v === i + 1;
            return (
              <label key={i}
                className={`flex flex-col items-center gap-1.5 px-1 py-3 rounded-xl border-2 cursor-pointer text-center transition-colors ${checked ? "bg-[#FFF6CC]" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                style={checked ? { borderColor: NAVY } : undefined}>
                <input type="radio" name={q.id} className="sr-only" checked={checked} onChange={() => set(q.id, i + 1)} aria-label={`${i + 1}점 ${label}`} />
                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${checked ? "text-white" : "text-slate-500 border border-slate-300"}`}
                  style={checked ? { background: NAVY } : undefined}>{i + 1}</span>
                <span className="text-[11px] sm:text-xs leading-tight text-slate-600 break-keep">{label}</span>
              </label>
            );
          })}
        </div>
      );
    }
    if (q.kind === "select") {
      const v = answers[q.id];
      return (
        <select value={typeof v === "number" ? v : ""} onChange={e => set(q.id, Number(e.target.value))} aria-label={q.text}
          className="mt-4 w-full sm:w-64 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base focus:outline-none focus:border-[#1558C9]">
          <option value="" disabled>선택해 주세요</option>
          {q.options!.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
        </select>
      );
    }
    if (q.kind === "text") {
      const v = String(answers[q.id] ?? "");
      return (
        <div className="mt-4">
          <textarea value={v} onChange={e => set(q.id, e.target.value)} maxLength={TEXT_MAX} rows={4} aria-label={q.text}
            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base focus:outline-none focus:border-[#1558C9]" />
          <p className="mt-1 text-xs text-slate-500 text-right">{v.length} / {TEXT_MAX}</p>
        </div>
      );
    }
    const multi = q.kind === "multi";
    const v = answers[q.id];
    const long = q.options!.some(o => o.label.length > 12);
    return (
      <div className={`mt-4 grid gap-2 ${long ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
        {q.options!.map((o, i) => {
          const checked = multi ? Array.isArray(v) && v.includes(i) : v === i;
          return (
            <label key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${checked ? "bg-[#FFF6CC]" : "bg-white hover:bg-slate-50 border-slate-200"}`}
              style={checked ? { borderColor: NAVY } : undefined}>
              <input type={multi ? "checkbox" : "radio"} name={q.id} className="sr-only" checked={checked}
                onChange={() => (multi ? toggle(q.id, i) : set(q.id, i))} />
              <span className={`flex items-center justify-center shrink-0 w-5 h-5 border-2 ${multi ? "rounded" : "rounded-full"} ${checked ? "text-white" : "border-slate-300"}`}
                style={checked ? { background: NAVY, borderColor: NAVY } : undefined}>
                {checked && <span className="text-xs font-black leading-none">✓</span>}
              </span>
              <span className="text-base text-slate-800 break-keep">{o.label}</span>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-28 pb-24 px-4">
      <div className="max-w-[820px] mx-auto space-y-8">
        {/* 머리 */}
        <section className="space-y-5">
          <div>
            <p className="text-sm font-bold" style={{ color: RED }}>한국청소년활동진흥원 · 2026 청소년활동 안전문화 확산 사업</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight break-keep" style={{ color: NAVY }}>{S.title}</h1>
            <p className="mt-3 text-base text-slate-700 leading-relaxed break-keep">
              올해 안전홍보단, 안전 공모전, 안전 캠페인에 참여해 주셔서 감사합니다. 여러분의 의견은 내년 사업을 더 좋게 만드는 데 쓰입니다.
              설문 응답은 이름 없이 통계로만 처리합니다.
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
        </section>

        {done ? (
          <section className="bg-white border border-emerald-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
            <h2 className="text-2xl font-black" style={{ color: NAVY }}>설문이 제출되었습니다</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              소중한 의견 감사합니다.
              {done.entered && (
                <>
                  <br />경품 응모도 함께 접수되었습니다. 당첨되시면 입력하신 휴대전화번호로 {S.prize}을 보내 드립니다.
                </>
              )}
            </p>
          </section>
        ) : status !== "open" ? (
          <section className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2 shadow-sm">
            <h2 className="text-2xl font-black" style={{ color: NAVY }}>
              {status === "before" ? "조사 기간 전입니다" : "조사가 마감되었습니다"}
            </h2>
            <p className="text-slate-600">
              {status === "before" ? `조사 기간: ${S.periodLabel}` : "참여해 주셔서 감사합니다."}
            </p>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {sections.map(section => (
              <section key={section.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="px-6 sm:px-8 pt-7 pb-4 border-b-2" style={{ borderColor: NAVY }}>
                  <h2 className="text-2xl font-black" style={{ color: NAVY }}>{section.title}</h2>
                  {section.note && <p className="mt-1 text-sm text-slate-500">{section.note}</p>}
                </div>
                <ol className="divide-y divide-slate-200">
                  {section.questions.map(q => {
                    return (
                      <li key={q.id} id={`q-${q.id}`} className="px-6 sm:px-8 py-6">
                        <fieldset>
                          <legend className="flex gap-3 text-lg font-bold leading-snug" style={{ color: NAVY }}>
                            <span className="font-black shrink-0" style={{ color: RED }}>{numbers[q.id]}</span>
                            <span className="break-keep">
                              {q.text}
                              {q.kind === "multi" && <span className="ml-2 text-sm font-medium text-slate-500">(여러 개 선택)</span>}
                              {q.optional && <span className="ml-2 text-sm font-medium text-slate-500">(선택)</span>}
                            </span>
                          </legend>
                          {renderOptions(q)}
                        </fieldset>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}

            {/* 경품 응모(선택) */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 sm:px-8 py-7 space-y-5">
              <div>
                <h2 className="text-xl font-black" style={{ color: NAVY }}>경품 응모 <span className="text-sm font-medium text-slate-500">(선택)</span></h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed break-keep">
                  응모하지 않아도 설문은 제출됩니다. 응모 정보는 설문 응답과 따로 보관하며, 응답 내용과 연결하지 않습니다.
                </p>
              </div>
              <label className="flex items-center gap-2 text-base font-bold text-slate-800 cursor-pointer">
                <input type="checkbox" checked={wantEvent} onChange={e => setWantEvent(e.target.checked)} className="w-4 h-4" />
                경품 추첨에 응모합니다
              </label>

              {/* 자동 입력 방지(사람에게는 보이지 않음) */}
              <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              {wantEvent && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">이름</span>
                      <input value={name} onChange={e => setName(e.target.value)} maxLength={30} autoComplete="name"
                        className="mt-1 w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base focus:outline-none focus:border-[#1558C9]" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-slate-700">휴대전화번호 <span className="font-normal text-slate-500">(상품권 발송용)</span></span>
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

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <p className="text-sm font-bold text-slate-800">개인정보 수집·이용 동의 (경품 응모 시 필수)</p>
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
                          <td className="border border-slate-200 bg-white px-2 py-1.5">경품 응모 확인, 당첨자 추첨·발표, 경품(모바일상품권) 발송</td>
                          <td className="border border-slate-200 bg-white px-2 py-1.5">이름, 휴대전화번호 (만 14세 미만: 보호자 이름·휴대전화번호)</td>
                          <td className="border border-slate-200 bg-white px-2 py-1.5">경품 발송 완료 후 지체 없이 파기</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      개인정보 수집·이용에 동의하지 않을 권리가 있으며, 동의하지 않으면 경품에 응모할 수 없습니다(설문 참여는 가능합니다).
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
                </>
              )}

              {error && <p role="alert" className="text-sm font-bold" style={{ color: RED }}>{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl text-white text-lg font-black shadow-md disabled:opacity-60 transition-opacity"
                style={{ background: NAVY }}>
                {submitting ? "제출하는 중…" : "설문 제출하기"}
              </button>
            </section>
          </form>
        )}
      </div>
    </div>
  );
}
