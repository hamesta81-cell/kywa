import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getPersistentDataDir } from "@/lib/diskStorage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const relPath = pathSegments.join("/");
    
    // 보안 검증 (상위 디렉터리 탐색 차단)
    if (relPath.includes("..")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 영구 디스크에는 접수·계정 JSON도 함께 있으므로 사진·음원·영상·PDF만 내보낸다.
    const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".mp3", ".mp4", ".webm", ".pdf"];
    const firstSeg = relPath.split("/")[0];
    if (!ALLOWED_EXT.includes(path.extname(relPath).toLowerCase()) || firstSeg === "private" || firstSeg.startsWith(".")) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const candidatePaths = [
      path.join(process.cwd(), "public", "uploads", relPath),
      path.join(getPersistentDataDir(), "uploads", relPath),
      path.join(getPersistentDataDir(), relPath),
      path.join(process.cwd(), "public", "uploads", "seeds", relPath),
      path.join(process.cwd(), "public", relPath)
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        const buffer = fs.readFileSync(p);
        const ext = path.extname(p).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".svg") contentType = "image/svg+xml";
        else if (ext === ".avif") contentType = "image/avif";
        else if (ext === ".mp3") contentType = "audio/mpeg";
        else if (ext === ".mp4") contentType = "video/mp4";
        else if (ext === ".webm") contentType = "video/webm";
        else if (ext === ".pdf") contentType = "application/pdf";

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        });
      }
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (err: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
