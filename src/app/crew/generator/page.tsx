import React from 'react';
import AiContentGenerator from '@/components/AiContentGenerator';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'AI 스마트 카드뉴스 & 숏폼 생성기 | KYWA 청소년 안전 홍보단',
  description: '구글 안티그래비티 기반 AI 파트너를 활용해 9:16 모바일 카드뉴스 이미지와 15초 숏폼 시나리오를 자동 생성하세요.'
};

export default function AiGeneratorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/crew"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm font-semibold transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> ⬅️ 크루 전용 백오피스로 돌아가기
        </Link>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <Shield className="w-4 h-4" /> PLAY SAFE 2026 AI 도구
        </div>
      </div>

      <AiContentGenerator />
    </main>
  );
}
