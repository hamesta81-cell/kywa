import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "전송된 이미지/첨부파일이 없습니다." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🌟 원본 Base64 및 디스크 경로 준비
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    let finalUrl = dataUrl;

    // 📂 디스크 파일 저장 시도 (서버 내 로컬 캐시용)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const sanitizedFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadsDir, sanitizedFileName);
      fs.writeFileSync(filePath, buffer);
    } catch (writeErr) {
      console.warn("디스크 파일 쓰기 실패:", writeErr);
    }

    return NextResponse.json({
      success: true,
      server: "KYWA Media Storage",
      fileName: file.name,
      downloadURL: finalUrl,
      imageUrl: finalUrl,
      dataUrl: dataUrl,
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
