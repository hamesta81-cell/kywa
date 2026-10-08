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
        else if (ext === ".mp3") contentType = "audio/mpeg";

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
