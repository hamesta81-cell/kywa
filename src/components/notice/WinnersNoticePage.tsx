import Image from "next/image";
import Link from "next/link";
import type { WinnersNotice } from "@/data/winnersNotice";

// 당첨자 발표 쪽(게시용 이미지 + 본문). /notice/quiz-winners, /notice/survey-winners가 같이 쓴다.
export default function WinnersNoticePage({ notice: W }: { notice: WinnersNotice }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <p className="text-sm font-black text-[#E8322B]">공지</p>
      <h1 className="mt-1 text-2xl md:text-3xl font-black text-[#142B63] break-keep">{W.title}</h1>
      <p className="mt-3 text-slate-700 leading-relaxed break-keep">{W.intro}</p>
      <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200 bg-white">
        {W.rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-4 py-3 text-sm">
            <dt className="w-24 shrink-0 font-bold text-[#142B63]">{k}</dt>
            <dd className="text-slate-800 break-keep">{v}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 space-y-1 text-xs text-slate-500 leading-relaxed break-keep">
        {W.notes.map(t => <li key={t}>※ {t}</li>)}
      </ul>
      <div className="mt-8 rounded-2xl overflow-hidden shadow-lg bg-white">
        <Image src={W.fullImage} width={W.fullSize.width} height={W.fullSize.height} sizes="(max-width: 768px) 100vw, 768px"
          className="w-full h-auto" priority alt={`${W.title}. 당첨자 명단(이름 일부 가림, 휴대전화 끝 4자리)`} />
      </div>
      <div className="mt-8 text-center">
        <Link href="/" className="inline-block px-6 py-3 rounded-xl font-black text-white bg-[#142B63] hover:bg-[#1d3a80]">
          처음으로
        </Link>
      </div>
    </div>
  );
}
