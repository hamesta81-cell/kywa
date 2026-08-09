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

    // 🌟 사용자가 직접 업로드한 원본 사진의 Base64 Data URL 생성 (더미 stock 이미지 교체 완전 제거)
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    let downloadURL = dataUrl;

    // 로컬/서버 디스크 저장 시도 (public/uploads)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadsDir, sanitizedFileName);
      fs.writeFileSync(filePath, buffer);
      downloadURL = `/uploads/${sanitizedFileName}`;
    } catch (writeErr) {
      // 디스크 쓰기 실패 시 사용자가 올린 실제 원본 Data URL 반환
      downloadURL = dataUrl;
    }

    return NextResponse.json({
      success: true,
      server: "KYWA Media Storage",
      fileName: file.name,
      downloadURL: downloadURL,
      imageUrl: downloadURL,
      uploadedAt: new Date().toISOString(),
      message: `🖼️ [${file.name}] 업로드가 완료되었습니다.`
    });

  } catch (error: any) {
    console.error("이미지 업로드 처리 오류:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "이미지 업로드 중 오류 발생"
    }, { status: 500 });
  }
}
