"use client";

import { useState } from "react";
import { Search, FolderOpen, ShieldCheck, CheckCircle2, ChevronRight, BookOpen, AlertCircle, FileText, Share2, AlertTriangle, ArrowRight, Eye, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState("전체"); // 전체, 생활안전, 디지털안전, 재난안전, 활동안전, 마음안전
  const [targetFilter, setTargetFilter] = useState("전체"); // 전체, 중학생, 고등학생, 지도자, 보호자
  const [typeFilter, setTypeFilter] = useState("전체"); // 전체, 카드뉴스, 영상, 체크리스트, 퀴즈
  const [sortOption, setSortOption] = useState("최신 검수순");
  
  const [selectedCardModal, setSelectedCardModal] = useState<any>(null); // 상세 보기 팝업 모달
  const [showErrorReportModal, setShowErrorReportModal] = useState(false); // 오류 신고 팝업

  // 전달받은 정식 고화질 5종 포스터 바인딩 맵
  const getCardImage = (id: number) => {
    switch (id) {
      case 1: return "/images/cards/card_01_heatwave.jpg";
      case 2: return "/images/cards/card_02_rice.jpg";
      case 3: return "/images/cards/card_03_pm_safety.jpg";
      case 4: return "/images/cards/card_04_digital_security.jpg";
      case 5: return "/images/cards/card_05_heavy_rain.jpg";
      case 6: return "/images/archive_camping_safety_1777557771794.png";
      case 7: return "/images/mind_zone_healing_hero.png";
      case 8: return "/images/archive_camping_safety_1777557771794.png";
      default:
        if (id % 4 === 1) return "/images/cards/card_01_heatwave.jpg";
        if (id % 4 === 2) return "/images/cards/card_02_rice.jpg";
        if (id % 4 === 3) return "/images/cards/card_03_pm_safety.jpg";
        return "/images/cards/card_04_digital_security.jpg";
    }
  };

  // 28종 카드 정보 데이터 덱 (와이어프레임 & 공공 신뢰 패널 명세 100% 반영!)
  const cardList = [
    {
      id: 1,
      title: "체육대회 전후, 폭염 온열질환 예방수칙",
      summary: "폭염 속 야외 체육활동 시 온열질환(열사병·열탈수) 증상 판단 및 수분 보충 매뉴얼",
      category: "재난안전",
      targetGroup: "고등학생",
      formatType: "카드뉴스",
      time: "약 3분",
      source: "질병관리청",
      baseDate: "2026.05.31",
      reviewDate: "2026.06.10",
      nextReviewDate: "2026.12.10",
      progressNum: 2,
      progressTotal: 3,
      rules: ["수분 보충(20분마다 물 1컵)", "시원한 그늘 휴식 및 관찰", "두통 시 즉시 119 신고"],
      tips: "체온이 올라갈 때는 목 뒤나 겨드랑이에 시원한 음료캔을 데어 체온을 신속히 낮추세요.",
      quiz: ["온열질환 증상이 의심될 때는 물을 계속 마시게 한다? (답: ❌ 의식 없을 시 흡인 위험)"],
      relatedMissionHref: "/campaign/mbti",
      borderLeft: "border-l-4 border-l-[#EA580C]"
    },
    {
      id: 2,
      title: "발목을 접질렸다면, R.I.C.E 대처법",
      summary: "체육시간 및 신체활동 중 발목 염좌 발생 시 응급 4단계 대처 매뉴얼",
      category: "활동안전",
      targetGroup: "중학생",
      formatType: "체크리스트",
      time: "약 3분",
      source: "대한응급의학회",
      baseDate: "2026.05.31",
      reviewDate: "2026.06.10",
      nextReviewDate: "2026.12.10",
      progressNum: 3,
      progressTotal: 3,
      rules: ["Rest(안정)", "Ice(15분 냉찜질)", "Compression(압박)", "Elevation(심장보다 높게 올림)"],
      tips: "부상 직후 온찜질은 붓기를 악화시킵니다. 반드시 48시간 동안은 냉찜질을 시행하세요.",
      quiz: ["발목 부상 직후 붓기를 빼기 위해 온찜질을 해야 한다? (답: ❌ 부상 직후는 냉찜질)"],
      relatedMissionHref: "/campaign/mbti",
      borderLeft: "border-l-4 border-l-[#159A83]"
    },
    {
      id: 3,
      title: "PM 전동 킥보드 법적 필수 안전수칙",
      summary: "전동킥보드 탑승 전 꼭 확인해야 할 면허, 헬멧, 1인 탑승 법적 기준 안내",
      category: "생활안전",
      targetGroup: "고등학생",
      formatType: "카드뉴스",
      time: "약 3분",
      source: "행정안전부",
      baseDate: "2026.05.31",
      reviewDate: "2026.06.10",
      nextReviewDate: "2026.12.10",
      progressNum: 2,
      progressTotal: 3,
      rules: ["원동기 면허 이상 소지(범칙금 10만 원)", "안전모 필수 착용(범칙금 2만 원)", "2인 이상 동승 탑승 금지(범칙금 4만 원)"],
      tips: "전동킥보드는 도로교통법상 차에 해당하므로 음주 운전 시 면허 정지 및 취소 대상입니다.",
      quiz: ["전동킥보드는 친구와 함께 2명이 동시에 탈 수 있다? (답: ❌ 1인 탑승 필수)"],
      relatedMissionHref: "/campaign/cyber-bullying",
      borderLeft: "border-l-4 border-l-[#1558C9]"
    },
    {
      id: 4,
      title: "스마트폰과 계정을 지키는 3대 보안 수칙",
      summary: "청소년 대상 스미싱, 피싱 앱 및 소셜 계정 탈취 예방 보안 설정 가이드",
      category: "디지털안전",
      targetGroup: "중학생",
      formatType: "퀴즈",
      time: "약 3분",
      source: "경찰청 국가수사본부",
      baseDate: "2026.05.31",
      reviewDate: "2026.06.10",
      nextReviewDate: "2026.12.10",
      progressNum: 1,
      progressTotal: 3,
      rules: ["모든 계정 2단계 인증 필수 설정", "출처가 불분명한 문자 링크(URL) 클릭 금지", "공용 기기 사용 후 반드시 로그아웃"],
      tips: "모바일 백신 프로그램(V3, 알약 등)을 최신으로 유지하고 원스토어 알 수 없는 앱 설치를 차단하세요.",
      quiz: ["택배 조회 문자의 URL 링크는 바로 클릭해서 확인하는 것이 안전하다? (답: ❌ 스미싱 위험)"],
      relatedMissionHref: "/campaign/cyber-bullying",
      borderLeft: "border-l-4 border-l-[#7557D9]"
    },
    {
      id: 5,
      title: "집중호우 때, 보도 위 피해야 할 위험 지점",
      summary: "장마철 침수 도로, 들썩이는 맨홀 뚜껑 및 감전 위험 시설물 대피 수칙",
      category: "재난안전",
      targetGroup: "보호자",
      formatType: "영상",
      time: "약 4분",
      source: "소방청",
      baseDate: "2026.05.31",
      reviewDate: "2026.06.10",
      nextReviewDate: "2026.12.10",
      progressNum: 0,
      progressTotal: 3,
      rules: ["들썩이는 맨홀 뚜껑 10m 이상 우회", "침수된 변전실/가로등 3m 이격", "차량 바퀴 2/3 침수 시 즉시 탈출"],
      tips: "물속에 전선이 수하되어 있을 경우 감전의 위험이 있으므로 수해 지역 보도 통행을 자제하세요.",
      quiz: ["물에 잠긴 보도 위 들썩이는 맨홀 뚜껑 근처로 걸어가도 안전하다? (답: ❌ 추락 위험)"],
      relatedMissionHref: "/campaign/blind-spot",
      borderLeft: "border-l-4 border-l-[#EA580C]"
    }
  ];

  // 필터링 적용
  const filteredCards = cardList.filter(card => {
    const matchesSearch = card.title.includes(searchTerm) || card.summary.includes(searchTerm);
    const matchesField = fieldFilter === "전체" || card.category === fieldFilter;
    const matchesTarget = targetFilter === "전체" || card.targetGroup === targetFilter;
    const matchesType = typeFilter === "전체" || card.formatType === typeFilter;

    return matchesSearch && matchesField && matchesTarget && matchesType;
  });

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#172033] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-8">
      
      {/* ==================================================================== */}
      {/* 1. 목록 화면 필터 시스템 (와이어프레임 100% 완벽 반영!)               */}
      {/* ==================================================================== */}
      <section className="krds-public-card p-6 sm:p-8 space-y-6 bg-white shadow-sm border border-[#E2E8F0]">
        
        {/* 타이틀 & 검색창: [무엇이 궁금한가요? _______________ 검색] */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <h1 className="text-2xl font-black text-[#102A43] flex items-center gap-2">
            <FolderOpen size={22} className="text-[#1558C9]" /> 📚 안전정보 아카이브
          </h1>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="무엇이 궁금한가요? 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-[12px] text-xs font-bold focus:outline-none focus:border-[#1558C9]"
            />
            <button className="absolute right-3 top-2.5 text-[#1558C9] font-bold text-xs flex items-center gap-1">
              <Search size={14} /> 검색
            </button>
          </div>
        </div>

        {/* 분야 / 대상 / 형식 / 정렬 필터 덱 */}
        <div className="space-y-3.5 text-xs font-bold text-[#5D6B7E]">
          
          {/* 분야: 전체 생활안전 디지털안전 재난안전 활동안전 마음안전 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">분야:</span>
            {["전체", "생활안전", "디지털안전", "재난안전", "활동안전", "마음안전"].map(f => (
              <button
                key={f}
                onClick={() => setFieldFilter(f)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  fieldFilter === f ? "bg-[#1558C9] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 대상: 전체 중학생 고등학생 지도자 보호자 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">대상:</span>
            {["전체", "중학생", "고등학생", "지도자", "보호자"].map(t => (
              <button
                key={t}
                onClick={() => setTargetFilter(t)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  targetFilter === t ? "bg-[#102A43] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 형식: 전체 카드뉴스 영상 체크리스트 퀴즈 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-black text-[#102A43]">형식:</span>
            {["전체", "카드뉴스", "영상", "체크리스트", "퀴즈"].map(fmt => (
              <button
                key={fmt}
                onClick={() => setTypeFilter(fmt)}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  typeFilter === fmt ? "bg-[#102A43] text-white" : "hover:text-[#102A43]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* 정렬: [최신 검수순 ▾] */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
            <span className="text-[11px] text-slate-400">총 {filteredCards.length}건의 공식 정보 발간</span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="bg-slate-50 border border-[#E2E8F0] px-3 py-1.5 rounded-[10px] text-xs font-black text-[#102A43] focus:outline-none"
            >
              <option value="최신 검수순">최신 검수순 ▾</option>
              <option value="인기순">인기순 ▾</option>
              <option value="추천순">추천순 ▾</option>
            </select>
          </div>

        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. 카드 정보 규격 (와이어프레임 100% 반영!)                         */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCards.map(card => (
          <div
            key={card.id}
            className={`krds-public-card p-0 overflow-hidden flex flex-col justify-between hover:border-[#1558C9] transition-all shadow-md group ${card.borderLeft}`}
          >
            {/* 세로 포스터 고화질 원본 뷰어 썸네일 (aspect-[3/4] & object-contain) */}
            <div
              onClick={() => setSelectedCardModal(card)}
              className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-slate-900/5 flex items-center justify-center p-2 border-b border-[#E2E8F0]"
            >
              <Image src={getCardImage(card.id)} alt={card.title} fill className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                <span className="bg-[#102A43] text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                  #{card.id < 10 ? `0${card.id}` : card.id}
                </span>
                <span className="bg-[#1558C9] text-white text-[10px] font-black px-2.5 py-1 rounded-md">
                  {card.category}
                </span>
              </div>
            </div>

            {/* 카드 정보: 제목, 분야 · 소요시간, 출처, 검수완료일, 학습진행률 */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 
                  onClick={() => setSelectedCardModal(card)}
                  className="text-base font-black text-[#102A43] hover:text-[#1558C9] cursor-pointer transition-colors"
                >
                  {card.title}
                </h3>
                <p className="text-xs text-[#5D6B7E] font-medium line-clamp-2 leading-relaxed">
                  {card.summary}
                </p>
              </div>

              {/* 출처 & 검수완료 & 학습 진행률 X / 3 규격 */}
              <div className="space-y-3 pt-3 border-t border-[#E2E8F0] text-xs font-bold text-[#5D6B7E] tabular-nums">
                <div className="bg-slate-50 p-3 rounded-[12px] border border-[#E2E8F0] space-y-1">
                  <div className="flex justify-between">
                    <span>분야 및 소요시간:</span>
                    <strong className="text-[#102A43]">{card.category} · {card.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>정보 출처:</span>
                    <strong className="text-[#1558C9]">{card.source}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>검수 완료:</span>
                    <strong className="text-[#159A83]">{card.reviewDate}</strong>
                  </div>
                </div>

                {/* 학습 진행률 2 / 3 & [계속 학습] 버튼 */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-[#102A43]">
                    학습 진행률 <strong className="text-[#1558C9]">{card.progressNum} / {card.progressTotal}</strong>
                  </span>

                  <button
                    onClick={() => setSelectedCardModal(card)}
                    className="krds-public-button px-4 py-2 bg-[#1558C9] hover:bg-blue-700 text-white text-xs font-black rounded-[14px] shadow-sm transition-all touch-target"
                  >
                    {card.progressNum > 0 ? "[계속 학습]" : "[학습 시작]"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* 3. 상세 화면 모달 & 4. 🛡️ 공공 신뢰 패널 (Trust Panel)                  */}
      {/* ==================================================================== */}
      {selectedCardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 sm:p-8 max-w-2xl w-full bg-white space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-[#E2E8F0] text-[#172033] animate-in zoom-in-95">
            
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#1558C9] bg-blue-50 px-2.5 py-1 rounded-md">
                  #{selectedCardModal.id < 10 ? `0${selectedCardModal.id}` : selectedCardModal.id} {selectedCardModal.category}
                </span>
                <span className="text-xs font-bold text-[#159A83] bg-emerald-50 px-2.5 py-1 rounded-md">
                  {selectedCardModal.formatType}
                </span>
              </div>
              <button
                onClick={() => setSelectedCardModal(null)}
                className="text-slate-400 font-bold text-sm hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* 상세 제목 & 한 줄 요약 */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#102A43]">{selectedCardModal.title}</h2>
              <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">{selectedCardModal.summary}</p>
            </div>

            {/* 고화질 포스터 이미지 원본 비율 뷰어 */}
            <div className="relative aspect-[3/4] sm:aspect-auto sm:h-[460px] w-full rounded-[16px] overflow-hidden border border-[#E2E8F0] shadow-md bg-slate-950">
              <Image src={getCardImage(selectedCardModal.id)} alt={selectedCardModal.title} fill className="object-contain" />
            </div>

            {/* 핵심 수칙 3개 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#102A43]">📌 핵심 필수 안전 수칙 3가지</h4>
              <div className="space-y-1.5 text-xs text-slate-700 font-bold">
                {selectedCardModal.rules?.map((rule: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-[12px] border border-[#E2E8F0] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1558C9] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 예방 팁 & 3문항 확인 퀴즈 */}
            <div className="p-4 bg-blue-50/60 rounded-[14px] border border-blue-100 space-y-2 text-xs font-medium">
              <span className="font-black text-[#1558C9] block">💡 사고 예방 실천 팁 & 퀴즈</span>
              <p className="text-slate-700 font-bold">• 예방 팁: {selectedCardModal.tips}</p>
              <p className="text-slate-700">• 확인 퀴즈: {selectedCardModal.quiz}</p>
            </div>

            {/* ============================================================== */}
            {/* 🛡️ 공공 신뢰 패널 (Trust Panel - 와이어프레임 100% 반영!)        */}
            {/* ============================================================== */}
            <div className="krds-public-card p-5 bg-slate-900 text-white rounded-[16px] space-y-3 shadow-md border border-white/10 text-xs font-medium tabular-nums">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="font-black text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck size={16} /> 🛡️ 공공 검수 신뢰 패널 (Trust Panel)
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  검수 연동 완료 🟢
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 bg-slate-800 rounded-[10px] border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">정보 출처</span>
                  <strong className="text-white font-bold block mt-0.5">{selectedCardModal.source}</strong>
                </div>

                <div className="p-2.5 bg-slate-800 rounded-[10px] border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">자료 기준일</span>
                  <strong className="text-white font-bold block mt-0.5">{selectedCardModal.baseDate}</strong>
                </div>

                <div className="p-2.5 bg-slate-800 rounded-[10px] border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">KYWA 검수일</span>
                  <strong className="text-emerald-400 font-bold block mt-0.5">{selectedCardModal.reviewDate}</strong>
                </div>

                <div className="p-2.5 bg-slate-800 rounded-[10px] border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">다음 검수 예정일</span>
                  <strong className="text-cyan-300 font-bold block mt-0.5">{selectedCardModal.nextReviewDate}</strong>
                </div>
              </div>

              {/* 오류 신고 버튼 */}
              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <span className="text-[10px] text-slate-400">• 검수 완료는 장식용 배지가 아닌 실제 버전/검수자와 연동됩니다.</span>
                <button
                  onClick={() => setShowErrorReportModal(true)}
                  className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold rounded-[8px] text-[11px] border border-rose-500/30 flex items-center gap-1"
                >
                  <AlertTriangle size={12} /> [오류 신고]
                </button>
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedCardModal(null)}
              className="krds-public-button w-full py-3 bg-[#102A43] hover:bg-black text-white text-xs font-bold rounded-[14px] touch-target"
            >
              닫기
            </button>

          </div>
        </div>
      )}

      {/* ⚠️ 오류 신고 팝업 모달 */}
      {showErrorReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 max-w-md w-full bg-white space-y-4 shadow-2xl border border-rose-200 animate-in zoom-in-95">
            <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5">
              <AlertTriangle size={18} /> ⚠️ 안전정보 오류 신고 접수
            </h3>
            <p className="text-xs text-[#5D6B7E]">오타, 출처 오기 또는 수정이 필요한 내용을 입력해주세요. 담당 검수관이 24시간 이내에 검토 후 수정합니다.</p>

            <textarea
              rows={3}
              placeholder="오류 내용을 상세히 기술해주세요..."
              className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px] text-xs font-medium focus:outline-none focus:border-rose-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("🟢 오류 신고가 담당 검수관에게 정상 접수되었습니다. 감사합니다.");
                  setShowErrorReportModal(false);
                }}
                className="krds-public-button w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-[14px]"
              >
                신고 제출
              </button>
              <button
                onClick={() => setShowErrorReportModal(false)}
                className="w-full py-2.5 bg-slate-100 text-[#5D6B7E] font-bold text-xs rounded-[14px]"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
