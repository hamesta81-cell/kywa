"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { QUIZ_WINNERS_NOTICE as W } from "@/data/winnersNotice";

export const WINNERS_HIDE_KEY = "hide_quiz_winners_popup";

// 한눈정보 퀴즈 정답 및 당첨자 발표 안내 카드(메인 팝업)
export default function WinnersCard({ onClose }: { onClose: (hideToday: boolean) => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={W.title}
      className="relative w-full max-w-[380px] shrink-0 bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
      <button onClick={() => onClose(false)} className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50" aria-label="팝업 닫기">
        <X size={18} />
      </button>
      <Link href={W.path} onClick={() => onClose(false)} className="block">
        <Image src={W.popupImage} width={W.popupSize.width} height={W.popupSize.height} sizes="380px" className="w-full h-auto" priority
          alt={`${W.title}. ${W.result}. 이벤트 기간 ${W.periodLabel}, 상품 ${W.prize}`} />
      </Link>
      <Link href={W.path} onClick={() => onClose(false)} className="block py-3 text-center font-black text-white bg-[#142B63] hover:bg-[#1d3a80]">
        정답·당첨자 명단 보기
      </Link>
      <div className="flex justify-between px-4 py-2.5 text-xs font-bold text-slate-500">
        <button onClick={() => onClose(true)} className="hover:text-slate-900">오늘 하루 보지 않기</button>
        <button onClick={() => onClose(false)} className="hover:text-slate-900">닫기</button>
      </div>
    </div>
  );
}
