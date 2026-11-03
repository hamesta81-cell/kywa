import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { authError, readAuth } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  // 로그인한 홍보단·관리자만 (누구나 파일을 올리거나 유료 AI를 쓰지 못하게)
  if (!readAuth(req)) return authError(401);
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "전송된 이미지/첨부파일이 없습니다." },
        { status: 400 }
      );
    }

    // 사진·영상·음원·PDF만 받는다 (SVG·HTML 등 스크립트가 들어갈 수 있는 파일은 막음)
    const ext = (file.name.match(/\.[a-zA-Z0-9]+$/)?.[0] || "").toLowerCase();
    const ALLOWED = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".mp4", ".webm", ".mp3", ".pdf"];
    if (!ALLOWED.includes(ext)) {
      return NextResponse.json({ success: false, error: "사진(jpg·png·gif·webp)·영상(mp4·webm)·mp3·PDF 파일만 올릴 수 있습니다." }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "파일은 50MB 이하만 올릴 수 있습니다." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🌟 원본 Base64 및 디스크 경로 준비
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    let finalUrl = dataUrl;

    // 📂 디스크 파일 저장 시도 (Render 영구 디스크 및 로컬 캐시 동시 저장)
    let isSavedToDisk = false;
    try {
      const sanitizedFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      
      // 1. Render 영구 디스크 (/var/data/uploads)
      try {
        const { getPersistentDataDir } = await import("@/lib/diskStorage");
        const persistentUploads = path.join(getPersistentDataDir(), "uploads");
        if (!fs.existsSync(persistentUploads)) {
          fs.mkdirSync(persistentUploads, { recursive: true });
        }
        fs.writeFileSync(path.join(persistentUploads, sanitizedFileName), buffer);
      } catch (pErr) {}

      // 2. 프로젝트 public/uploads 디렉터리
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, sanitizedFileName);
      fs.writeFileSync(filePath, buffer);

      finalUrl = `/uploads/${sanitizedFileName}`;
      isSavedToDisk = true;
    } catch (writeErr) {
      console.warn("디스크 파일 쓰기 실패, base64 폴백:", writeErr);
      finalUrl = dataUrl;
    }

    return NextResponse.json({
      success: true,
      server: "KYWA Media Storage",
      fileName: file.name,
      downloadURL: finalUrl,
      imageUrl: finalUrl,
      dataUrl: isSavedToDisk ? undefined : dataUrl,
      uploadedAt: new Date().toISOString(),
      message: `🖼️ [${file.name}] 사진 업로드가 최적화 완료되었습니다.`
    });

  } catch (error: any) {
    console.error("이미지 업로드 처리 오류:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "이미지 업로드 중 오류 발생"
    }, { status: 500 });
  }
}
