"use client";

import { useState } from "react";
import { MapPin, ShieldCheck, CheckCircle2, ChevronLeft, AlertTriangle, Camera, Upload, Lock, Clock, Send, Eye, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BlindSpotPage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedReportModal, setSelectedReportModal] = useState<any>(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportStep, setNewReportStep] = useState(1); // 6단계 신규 제보 폼

  // 6대 지도 핀 상태 데이터 덱 (13번 명세 100% 완벽 반영!)
  const reports = [
    {
      id: "R-2026-001",
      type: "통학로 파손",
      status: "접수",
      pinColor: "bg-gray-500 text-white", // 접수: 회색
      statusBadge: "bg-gray-100 text-gray-700",
      approxLocation: "서울특별시 종로구 대학로 인근 통학로",
      date: "2026.07.21",
      desc: "보도블록이 함몰되어 비 오는 날 청소년 발목 염좌 부상 위험이 큽니다.",
      timeline: ["7/21 제보 접수", "7/22 담당관 확인 중"],
      org: "종로구청 도로과 전달 예정",
      imgBefore: "/images/archive_camping_safety_1777557771794.png",
      imgAfter: null,
      maskedPrivacy: true
    },
    {
      id: "R-2026-002",
      type: "PM 위험 구역",
      status: "검토 중",
      pinColor: "bg-[#1558C9] text-white", // 검토 중: 파란색
      statusBadge: "bg-blue-50 text-[#1558C9]",
      approxLocation: "경상남도 창원시 성산구 사거리 교차로",
      date: "2026.07.20",
      desc: "전동킥보드가 보도에 무단 방치되어 시야를 가리고 안전사고 위험이 있습니다.",
      timeline: ["7/20 접수", "7/21 담당관 검토 완료"],
      org: "창원시 교통행정과",
      imgBefore: "/images/cards/card_03_pm_safety.jpg",
      imgAfter: null,
      maskedPrivacy: true
    },
    {
      id: "R-2026-003",
      type: "야간 조명 부재",
      status: "기관 전달",
      pinColor: "bg-[#7557D9] text-white", // 기관 전달: 보라색
      statusBadge: "bg-purple-50 text-[#7557D9]",
      approxLocation: "인천광역시 미추홀구 학익동 골목길",
      date: "2026.07.19",
      desc: "가로등이 고장 나 야간 통학길 보행 안전이 매우 취약합니다.",
      timeline: ["7/19 접수", "7/20 검토 완료", "7/21 미추홀구청 이관"],
      org: "미추홀구 도시재생과",
      imgBefore: "/images/contest_earthquake_app_1777557756490.png",
      imgAfter: null,
      maskedPrivacy: true
    },
    {
      id: "R-2026-004",
      type: "펜스 파손",
      status: "처리 중",
      pinColor: "bg-[#EA580C] text-white", // 처리 중: 주황색
      statusBadge: "bg-orange-50 text-[#EA580C]",
      approxLocation: "부산광역시 해운대구 우동 초등학교 앞",
      date: "2026.07.18",
      desc: "안전 펜스 일부가 손상되어 낙상 및 차량 접근 위험이 노출되어 있습니다.",
      timeline: ["7/18 접수", "7/19 이관", "7/21 보수 공사 착공"],
      org: "해운대구 건설과",
      imgBefore: "/images/cards/card_02_rice.jpg",
      imgAfter: null,
      maskedPrivacy: true
    },
    {
      id: "R-2026-005",
      type: "배수구 침수 위험",
      status: "개선 완료",
      pinColor: "bg-[#159A83] text-white", // 개선 완료: 초록색
      statusBadge: "bg-emerald-50 text-[#159A83]",
      approxLocation: "경기도 수원시 팔달구 매산로 통학로",
      date: "2026.07.10",
      desc: "장마철 덮개가 막힌 배수구를 청소하고 안전 철망을 교체했습니다.",
      timeline: ["7/10 접수", "7/12 현장 출동", "7/15 정비 완료"],
      org: "수원시 안전총괄과",
      imgBefore: "/images/cards/card_05_heavy_rain.jpg",
      imgAfter: "/images/cards/card_01_heatwave.jpg",
      maskedPrivacy: true
    },
    {
      id: "R-2026-006",
      type: "사생활 정보 건",
      status: "비공개 전환",
      pinColor: "bg-[#102A43] text-white", // 비공개: 잠금
      statusBadge: "bg-[#102A43] text-white",
      approxLocation: "대략적 위치 비공개 처리 구역",
      date: "2026.07.05",
      desc: "제보자의 사생활 및 식별 정보 보호를 위해 비공개로 안전 처리되었습니다.",
      timeline: ["7/05 접수", "7/06 비공개 전환 및 수사 이관"],
      org: "경찰청 및 안전재단",
      imgBefore: null,
      imgAfter: null,
      maskedPrivacy: true
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#F5F7FB] text-[#172033] font-sans pt-28 pb-24 px-4 max-w-[1240px] mx-auto space-y-8">
      
      {/* 헤더 & 신규 제보 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="space-y-1">
          <Link href="/campaign" className="inline-flex items-center gap-1 text-[#5D6B7E] hover:text-[#1558C9] font-bold text-xs">
            <ChevronLeft size={16} /> 미션 허브로 돌아가기
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">🗺️ 우리 지역 안전지도 & 사각지대 제보</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-[10px] border border-[#E2E8F0] text-xs font-bold">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-[8px] transition-all ${viewMode === "map" ? "bg-[#102A43] text-white" : "text-[#5D6B7E]"}`}
            >
              [지도 뷰]
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-[8px] transition-all ${viewMode === "list" ? "bg-[#102A43] text-white" : "text-[#5D6B7E]"}`}
            >
              [목록 뷰]
            </button>
          </div>

          <button
            onClick={() => {
              setNewReportStep(1);
              setShowNewReportModal(true);
            }}
            className="krds-public-button px-5 py-2.5 bg-[#1558C9] hover:bg-blue-700 text-white font-black text-xs rounded-[14px] shadow-md flex items-center gap-1.5 touch-target"
          >
            <Camera size={15} />
            <span>+ 신규 안전 제보하기</span>
          </button>
        </div>
      </div>

      {/* 6대 지도 핀 상태 범례 (State Legend) */}
      <div className="krds-public-card p-4 bg-white space-y-2 border border-[#E2E8F0] shadow-sm text-xs font-bold">
        <span className="text-[#102A43] font-black block">• 6대 지도 핀 상태 범례 (개인정보 보호 자동 마스킹 적용):</span>
        <div className="flex flex-wrap gap-3 pt-1">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-500"></span> 접수 (회색)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#1558C9]"></span> 검토 중 (파란색)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#7557D9]"></span> 기관 전달 (보라색)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#EA580C]"></span> 처리 중 (주황색)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#159A83]"></span> 개선 완료 (초록색)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#102A43]"></span> 비공개 (🔒 잠금)</span>
        </div>
      </div>

      {/* 대화형 지도 뷰 인터페이스 */}
      {viewMode === "map" ? (
        <div className="krds-public-card p-0 overflow-hidden h-[480px] bg-[#0F172A] relative rounded-[20px] shadow-2xl border border-slate-700">
          {/* 가상 레이더망 원형 지점 시각화 */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
          
          <div className="absolute top-4 left-4 bg-slate-950/90 text-white p-4 rounded-[14px] border border-white/10 text-xs font-bold z-10 backdrop-blur-md shadow-lg">
            <span className="flex items-center gap-2 text-cyan-300 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> 🗺️ 대한민국 실시간 청소년 안전지도
            </span>
            <span className="block text-[10px] text-slate-400 mt-1">개인 얼굴/차량번호판은 자동 마스킹 보호되며, 대략적 위치로 표시됩니다.</span>
          </div>

          {/* 6대 지도 핀 시각 렌더링 & 레이더 파동 */}
          <div className="relative w-full h-full flex items-center justify-around p-12">
            {reports.map((r, idx) => (
              <div key={r.id} className="relative group">
                <button
                  onClick={() => setSelectedReportModal(r)}
                  className={`p-3.5 rounded-full font-black text-xs shadow-xl transition-all hover:scale-125 flex items-center gap-1.5 animate-radar ${r.pinColor}`}
                >
                  {r.status === "비공개 전환" ? <Lock size={14} /> : <MapPin size={14} />}
                  <span>{r.type}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 목록 뷰 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map(r => (
            <div key={r.id} className="krds-public-card p-5 bg-white space-y-3 border border-[#E2E8F0] shadow-sm">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${r.statusBadge}`}>
                  {r.status}
                </span>
                <span className="text-xs text-slate-400 font-bold">{r.date}</span>
              </div>
              <h3 className="text-sm font-black text-[#102A43]">{r.type}</h3>
              <p className="text-xs text-[#5D6B7E] font-medium leading-relaxed">{r.desc}</p>
              <button
                onClick={() => setSelectedReportModal(r)}
                className="krds-public-button w-full py-2 bg-[#102A43] text-white text-xs font-bold rounded-[10px]"
              >
                제보 상세 보기 →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 제보 상세 모달 (타임라인 & 개인정보 마스킹 고지) */}
      {selectedReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 max-w-lg w-full bg-white space-y-5 shadow-2xl border border-[#E2E8F0] text-[#172033] animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <span className={`text-xs font-black px-3 py-1 rounded-md ${selectedReportModal.statusBadge}`}>
                [{selectedReportModal.status}] {selectedReportModal.type}
              </span>
              <button onClick={() => setSelectedReportModal(null)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div>• <strong>대략적 위치:</strong> {selectedReportModal.approxLocation} (상세 주소 비공개)</div>
              <div>• <strong>전달 기관:</strong> <strong className="text-[#1558C9]">{selectedReportModal.org}</strong></div>
              <div>• <strong>상황 설명:</strong> {selectedReportModal.desc}</div>
            </div>

            {/* 타임라인 */}
            <div className="p-3.5 bg-slate-50 rounded-[12px] border border-[#E2E8F0] space-y-1 text-xs font-bold text-[#5D6B7E]">
              <span className="text-[#102A43] font-black block">• 처리 타임라인:</span>
              {selectedReportModal.timeline.map((t: string, i: number) => (
                <div key={i} className="text-[11px]">• {t}</div>
              ))}
            </div>

            {/* 개선 전/후 비교 */}
            {selectedReportModal.imgAfter && (
              <div className="space-y-1.5">
                <span className="text-xs font-black text-[#159A83] block">✨ 개선 전 · 후 현장 사진:</span>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                  <div className="p-2 bg-slate-100 rounded-lg">개선 전 (파손)</div>
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg">개선 후 (보수 완료)</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedReportModal(null)}
              className="krds-public-button w-full py-2.5 bg-[#102A43] text-white text-xs font-bold rounded-[12px]"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 6단계 신규 제보 스마트 폼 모달 */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="krds-public-card p-6 max-w-lg w-full bg-white space-y-5 shadow-2xl border border-[#E2E8F0] text-[#172033] animate-in zoom-in-95">
            
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2">
              <h3 className="text-base font-black text-[#102A43]">📸 6단계 신규 안전 제보 (Step {newReportStep}/6)</h3>
              <button onClick={() => setShowNewReportModal(false)} className="text-slate-400 font-bold text-xs">✕</button>
            </div>

            {/* 6단계 진행 상태 바 */}
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-[#1558C9] h-1.5 rounded-full" style={{ width: `${(newReportStep / 6) * 100}%` }}></div>
            </div>

            {/* 단계별 내용 */}
            <div className="space-y-4 text-xs font-bold">
              {newReportStep === 1 && (
                <div className="space-y-2">
                  <label className="block">• 1. 위험 유형 선택:</label>
                  <select className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px]">
                    <option>통학로 보도블록/펜스 파손</option>
                    <option>PM 전동킥보드 무단 방치</option>
                    <option>야간 골목길 조명 부재</option>
                    <option>장마철 배수구 침수 위험</option>
                  </select>
                </div>
              )}

              {newReportStep === 2 && (
                <div className="space-y-2">
                  <label className="block">• 2. 대략적 위치 선택:</label>
                  <input type="text" placeholder="예: 서울 종로구 대학로 인근 보도" className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px]" />
                  <span className="text-[10px] text-slate-400 font-normal">※ 개인정보 보호를 위해 상세 번지수는 공개 맵에서 마스킹됩니다.</span>
                </div>
              )}

              {newReportStep === 3 && (
                <div className="space-y-2">
                  <label className="block">• 3. 현장 사진 등록:</label>
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-[#E2E8F0] rounded-[12px] text-center space-y-2">
                    <Camera size={24} className="mx-auto text-slate-400" />
                    <span className="text-[11px] text-[#5D6B7E] block">📸 안전한 곳에서 촬영한 현장 사진 등록 (얼굴/번호판 자동 블러)</span>
                  </div>
                </div>
              )}

              {newReportStep === 4 && (
                <div className="space-y-2">
                  <label className="block">• 4. 위험 상황 상세 설명:</label>
                  <textarea rows={3} placeholder="위험 요소 및 개선이 필요한 내용을 적어주세요..." className="w-full p-3 bg-slate-50 border border-[#E2E8F0] rounded-[10px]" />
                </div>
              )}

              {newReportStep === 5 && (
                <div className="space-y-2 bg-blue-50 p-4 rounded-[12px] border border-blue-200">
                  <label className="block text-[#1558C9]">• 5. 개인정보 · 초상권 · 안전 수칙 동의:</label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input type="checkbox" defaultChecked className="accent-[#1558C9]" />
                    <span>☑️ 차도/위험 구역 진입 없이 안전한 상태에서 촬영했음을 서약합니다.</span>
                  </label>
                </div>
              )}

              {newReportStep === 6 && (
                <div className="space-y-2 text-center p-4 bg-emerald-50 rounded-[12px] border border-emerald-200">
                  <span className="text-2xl block">🎉</span>
                  <h4 className="text-sm font-black text-emerald-900">제보 준비가 완료되었습니다!</h4>
                  <p className="text-[11px] text-emerald-700 font-medium">담당 지자체 안전총괄과로 안전하게 이관 처리됩니다.</p>
                </div>
              )}
            </div>

            {/* 이동 버튼 */}
            <div className="flex justify-between items-center pt-2">
              {newReportStep > 1 ? (
                <button onClick={() => setNewReportStep(prev => prev - 1)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-[10px]">이전</button>
              ) : <div></div>}

              {newReportStep < 6 ? (
                <button onClick={() => setNewReportStep(prev => prev + 1)} className="px-5 py-2 bg-[#1558C9] text-white text-xs font-bold rounded-[10px]">다음 단계</button>
              ) : (
                <button
                  onClick={() => {
                    alert("🟢 6단계 신규 안전 제보가 정상 접수되었습니다.");
                    setShowNewReportModal(false);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-[10px]"
                >
                  제보 최종 제출
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
