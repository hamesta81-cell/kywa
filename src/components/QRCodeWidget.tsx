"use client";

import React, { useState, useEffect } from "react";
import { QrCode, X, Smartphone, ArrowRight, Laptop } from "lucide-react";

export default function QRCodeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("https://kywa-safety-hub.vercel.app");
  const [qrType, setQrType] = useState<"production" | "local">("production");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        setCurrentUrl(origin);
        setQrType("local");
      } else {
        setCurrentUrl(origin);
        setQrType("production");
      }
    }
  }, []);

  const activeUrl = qrType === "production" ? "https://kywa-safety-hub.vercel.app" : currentUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(activeUrl)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full shadow-[0_10px_25px_rgba(59,130,246,0.4)] hover:shadow-[0_15px_30px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300"
        title="모바일 기기 바로가기 QR코드"
      >
        {isOpen ? <X size={24} /> : <QrCode size={26} />}
      </button>

      {/* QR Code Modal / Popover */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="text-blue-500" size={20} />
              <span className="font-bold text-slate-800 text-sm">모바일로 바로 플레이</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            스마트폰 카메라로 아래 QR 코드를 스캔하여 <strong>PLAY SAFE</strong> 플랫폼의 모바일 최적화 화면을 바로 즐겨보세요! (생존 MBTI, AI 폭력진단 등)
          </p>

          <div className="flex justify-center items-center bg-slate-50 rounded-2xl p-4 border border-slate-100/80 shadow-inner mb-4 relative group">
            {/* Using Next.js normal img tag or standard img is fine for external QR API */}
            <img
              src={qrCodeUrl}
              alt="QR Code"
              width={160}
              height={160}
              className="rounded-lg shadow-sm bg-white p-1 transition-transform group-hover:scale-105 duration-300"
            />
          </div>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setQrType("production")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                qrType === "production"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Laptop size={12} /> 실서버 (Vercel)
            </button>
            <button
              onClick={() => setQrType("local")}
              className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                qrType === "local"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Smartphone size={12} /> 현재 접속 주소
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400 font-mono break-all text-center">
            <span>{activeUrl}</span>
            <ArrowRight size={10} />
          </div>
        </div>
      )}
    </div>
  );
}
