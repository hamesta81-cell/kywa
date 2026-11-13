import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QUIZ_WINNERS_NOTICE as W } from "@/data/winnersNotice";

export const metadata: Metadata = {
  title: `${W.title} | PLAY SAFE 2026`,
  description: `${W.result}. ${W.prize}`,
};

// 한눈정보 안전 퀴즈 이벤트 정답 및 당첨자 발표(게시용 이미지 + 본문)
export default function QuizWinnersPage() {
  const rows = [
    ["이벤트 기간", W.periodLabel],
    ["이벤트 내용", W.content],
    ["이벤트 상품", W.prize],
    ["이벤트 결과", W.result],
    ["상품 발송", W.delivery],
    ["문의", W.contact],
  ];
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <p className="text-sm font-black text-[#E8322B]">공지</p>
      <h1 className="mt-1 text-2xl md:text-3xl font-black text-[#142B63] break-keep">{W.title}</h1>
      <p className="mt-3 text-slate-700 leading-relaxed break-keep">
        「한눈정보 안전 퀴즈 이벤트」 정답과 당첨자를 발표합니다. 참여해 주신 모든 분께 감사드립니다.
      </p>
      <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200 bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3 text-sm">
            <dt className="w-24 shrink-0 font-bold text-[#142B63]">{k}</dt>
            <dd className="text-slate-800 break-keep">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-slate-500 leading-relaxed break-keep">
        ※ {W.drawNote}. 개인정보 보호를 위해 이름 가운데 글자를 가리고, 휴대전화 번호는 끝 4자리만 적었습니다.
      </p>
      <div className="mt-8 rounded-2xl overflow-hidden shadow-lg bg-white">
        <Image src={W.fullImage} width={W.fullSize.width} height={W.fullSize.height} sizes="(max-width: 768px) 100vw, 768px"
          className="w-full h-auto" priority
          alt={`${W.title}. ${W.result}. 퀴즈 정답과 당첨자 100명 명단(이름 일부 가림, 휴대전화 끝 4자리)`} />
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="inline-block px-6 py-3 rounded-xl font-black text-white bg-[#142B63] hover:bg-[#1d3a80]">
          처음으로
        </Link>
      </div>
    </div>
  );
}
