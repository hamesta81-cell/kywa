import fs from "fs";
import path from "path";
import os from "os";

/**
 * 🔒 Render Persistent Disk(/var/data) 및 로컬 환경 영구 파일 경로 안전 확인 헬퍼
 */
export function getPersistentDataDir(): string {
  // 1. 환경변수 DATA_DIR 확인
  if (process.env.DATA_DIR) {
    try {
      if (!fs.existsSync(process.env.DATA_DIR)) {
        fs.mkdirSync(process.env.DATA_DIR, { recursive: true });
      }
      return process.env.DATA_DIR;
    } catch (e) {}
  }

  // 2. Render 표준 Persistent Disk 경로 (/var/data) 확인 및 쓰기 권한 검증
  const renderDiskPath = "/var/data";
  try {
    if (!fs.existsSync(renderDiskPath)) {
      try {
        fs.mkdirSync(renderDiskPath, { recursive: true });
      } catch (mkdirErr) {}
    }
    if (fs.existsSync(renderDiskPath)) {
      // 쓰기 가능 테스트
      const testFile = path.join(renderDiskPath, ".write_test");
      fs.writeFileSync(testFile, "ok", "utf-8");
      fs.unlinkSync(testFile);
      return renderDiskPath;
    }
  } catch (e) {}

  // 3. 로컬 프로젝트 data 디렉토리 또는 루트
  try {
    const localDataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    return localDataDir;
  } catch (e) {}

  // 4. 폴백: OS 임시 폴더
  try {
    return os.tmpdir();
  } catch (e) {
    return ".";
  }
}

export function getPersistentFilePath(filename: string): string {
  try {
    const dir = getPersistentDataDir();
    return path.join(dir, filename);
  } catch (e) {
    return path.join(os.tmpdir(), filename);
  }
}

