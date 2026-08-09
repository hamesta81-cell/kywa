"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Download, Share2, Info, CheckCircle, ShieldAlert, Award, Calendar, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cardnewsData, getAllCardnewsItems, CardnewsSlide } from "@/data/cardnewsData";

// searchParams를 안전하게 다루기 위해 Suspense로 감싼 본문 컴포넌트 구현
function CardnewsViewer() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId ? parseInt(rawId) : 14; // 기본값은 14번 (딥페이크 가이드)

  const cardnewsItems = getAllCardnewsItems();
  const selectedItem = cardnewsItems.find((item) => item.id === id) || cardnewsItems.find((item) => item.id === 14)!;

  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : selectedItem.slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < selectedItem.slides.length - 1 ? prev + 1 : 0));
  };

  const getVisualTemplate = (slide: CardnewsSlide, index: number, total: number) => {
    switch (slide.visualType) {
      case "intro":
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-indigo-500/20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)]"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-5 animate-pulse">
              <ShieldAlert className="text-indigo-400" size={28} />
            </div>
            <span className="text-[10px] font-black tracking-widest text-indigo-400 mb-2 uppercase">
              PLAY SAFE 2026 • SAFETY HUB
            </span>
            <h2 className="text-lg md:text-xl font-black text-slate-100 tracking-tight leading-snug mb-3">
              {slide.title}
            </h2>
            <p className="text-[10px] text-slate-400 max-w-xs px-2 leading-relaxed">
              {slide.description}
            </p>
          </div>
        );

      case "grid6":
        return (
          <div className="relative w-full h-full flex flex-col justify-center bg-slate-950 p-4 rounded-2xl border border-indigo-500/20 overflow-hidden">
            <h3 className="text-xs font-black text-indigo-400 mb-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
              {slide.title}
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {slide.grid6Items?.map((item, idx) => (
                <div key={idx} className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-3.5 h-3.5 rounded-md bg-indigo-600 text-slate-900 text-[8px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[9px] font-bold text-slate-200">{item.title}</span>
                  </div>
                  <p className="text-[8px] text-slate-400 leading-snug line-clamp-3">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "column3":
        return (
          <div className="relative w-full h-full flex flex-col justify-center bg-slate-950 p-4 rounded-2xl border border-indigo-500/10 overflow-hidden">
            <h3 className="text-xs font-bold text-indigo-400 mb-3">{slide.title}</h3>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {slide.column3Items?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900/75 rounded-xl border border-slate-800/80 flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[9px] font-black text-indigo-400 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-extrabold text-slate-200">{item.title}</h4>
                    <p className="text-[8px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "vs2":
        return (
          <div className="relative w-full h-full flex flex-col justify-center bg-slate-950 p-4 rounded-2xl border border-indigo-500/20 overflow-hidden">
            <h3 className="text-xs font-black text-slate-300 mb-3">{slide.title}</h3>
            <div className="grid grid-cols-2 gap-3">
              {slide.vs2Items?.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between h-[240px] ${
                  item.isDanger 
                    ? "bg-red-950/20 border-red-500/30" 
                    : "bg-emerald-950/20 border-emerald-500/30"
                }`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      item.isDanger ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {item.isDanger ? "❌ 위험" : "⭕ 안전"}
                    </span>
                  </div>
                  <h4 className="text-[10px] font-extrabold text-slate-200 mb-2 leading-snug">{item.title}</h4>
                  <p className="text-[8px] text-slate-400 leading-relaxed flex-1 overflow-y-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "checklist":
        return (
          <div className="relative w-full h-full flex flex-col justify-center bg-slate-950 p-5 rounded-2xl border border-emerald-500/10 overflow-hidden">
            <h3 className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-1">
              <CheckCircle size={12} />
              {slide.title}
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {slide.checklistItems?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle className={`mt-0.5 flex-shrink-0 ${item.isChecked ? 'text-emerald-400' : 'text-slate-600'}`} size={14} />
                  <p className="text-[9px] text-slate-300 font-semibold leading-relaxed">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "warning":
        return (
          <div className="relative w-full h-full flex flex-col justify-center bg-slate-950 p-4 rounded-2xl border border-red-500/30 overflow-hidden">
            <div className="absolute top-4 right-4 animate-ping w-2 h-2 rounded-full bg-red-500"></div>
            <h3 className="text-xs font-black text-red-400 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldAlert size={14} />
              {slide.title}
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {slide.warningItems?.map((item, idx) => (
                <div key={idx} className="p-3 bg-red-950/10 rounded-xl border border-red-500/20 flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[9px] font-bold text-red-400 flex-shrink-0">
                    !
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black text-red-400">{item.title}</h4>
                    <p className="text-[8px] text-slate-400 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 rounded-2xl text-center">
            <h3 className="text-slate-200 font-bold mb-2">{slide.title}</h3>
            <p className="text-xs text-slate-400">{slide.description}</p>
          </div>
        );
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "일상": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "활동": return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "시설": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "사이버": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "재난": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[15%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-600/10 blur-[130px] animate-blob"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[130px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Breadcrumb & Navigation back */}
      <div className="mb-8 relative z-10">
        <Link href="/archive" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> 안전정보 도서관 목록으로 돌아가기
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Side: Interactive Mobile Mockup Viewer */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[340px] aspect-[9/16] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-800 relative flex flex-col justify-between overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-b-2xl z-30"></div>
            
            {/* Slide Viewer Box */}
            <div className="w-full h-full rounded-[35px] overflow-hidden bg-slate-950 relative p-1 pt-6 pb-4 flex flex-col justify-between">
              
              {/* Progress Indicator Bar */}
              <div className="flex gap-1 px-4 pt-1 z-30">
                {selectedItem.slides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-indigo-500' : 'bg-slate-700/50'}`}
                  ></div>
                ))}
              </div>

              {/* Current Slide Display */}
              <div className="flex-1 w-full p-2 py-3 flex flex-col justify-center">
                {getVisualTemplate(selectedItem.slides[currentSlide], currentSlide, selectedItem.slides.length)}
              </div>

              {/* Navigation overlay inside phone */}
              <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={handlePrev}></div>
              <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={handleNext}></div>
              
              {/* Pagination label inside */}
              <div className="text-center text-[9px] text-slate-500 font-bold z-30">
                {currentSlide + 1} / {selectedItem.slides.length} • 좌우 화면 탭하여 스크롤
              </div>
            </div>
          </div>
          
          {/* External Navigation Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handlePrev} className="p-3 bg-slate-100 hover:bg-indigo-600 hover:text-slate-900 rounded-full transition-all shadow-md">
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs font-black text-slate-600">{currentSlide + 1} / {selectedItem.slides.length}</span>
            <button onClick={handleNext} className="p-3 bg-slate-100 hover:bg-indigo-600 hover:text-slate-900 rounded-full transition-all shadow-md">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Description and Specifications */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-black border ${getCategoryTheme(selectedItem.category)}`}>
              {selectedItem.category} 안전 분야
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-extrabold border border-indigo-500/20">
              <Calendar size={12} /> 2026년 {selectedItem.month} 기획안
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            {selectedItem.slides[currentSlide].title}
          </h1>
          <h2 className="text-base font-bold text-indigo-600 mb-6">
            {selectedItem.slides[currentSlide].subTitle}
          </h2>
          
          <p className="text-slate-500 leading-relaxed mb-8 text-sm">
            {selectedItem.slides[currentSlide].description}
          </p>

          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200/80 mb-8 space-y-3">
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Info size={14} className="text-indigo-500" /> 세부 기획 및 확산 전략
            </h4>
            <ul className="text-[11px] text-slate-500 space-y-2 list-disc pl-4 leading-relaxed">
              <li><strong>Z세대 관여도 향상:</strong> 모바일 스크롤과 SNS 업로드에 부합하는 원페이퍼 세로형 고압축 인포그래픽 설계.</li>
              <li><strong>활용 가이드:</strong> 전국 학교 및 수련시설의 대형 전광판 상시 노출 및 청소년 자치 안전 활동 배포.</li>
              <li>본 슬라이드는 제안서에 정식으로 포함된 연간 28건의 표준 행동 요령 카드뉴스 중 실제 시뮬레이션입니다.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10">
              <Download size={16} /> 기획안 원본 파일 다운로드 (.PDF)
            </button>
            <button className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-200">
              <Share2 size={16} /> 소셜 공유
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Suspense 로딩 폴백 컴포넌트
function ViewerLoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500">
      <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
      <p className="text-sm font-bold">인터랙티브 안전 카드뉴스 로딩 중...</p>
    </div>
  );
}

export default function CardnewsSamplePage() {
  return (
    <Suspense fallback={<ViewerLoadingFallback />}>
      <CardnewsViewer />
    </Suspense>
  );
}
