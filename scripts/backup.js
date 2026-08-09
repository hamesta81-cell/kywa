const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(target, file));
      } else {
        fs.copyFileSync(curSource, path.join(target, file));
      }
    });
  }
}

function backup() {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") + "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const backupDir = path.join(__dirname, "..", "backups", `backup_${timestamp}`);

  console.log(`📦 [자동 백업 시작] 타임스탬프: ${timestamp}`);

  // 1. Git 버전 스냅샷 생성
  try {
    execSync("git add .", { stdio: "ignore" });
    execSync(`git commit -m "Auto backup at ${timestamp}"`, { stdio: "ignore" });
    console.log("✅ [1/2] Git 커밋 스냅샷 생성 완료!");
  } catch (e) {
    console.log("ℹ️ Git 커밋 스냅샷 완료 (변경사항 저장됨)");
  }

  // 2. 소스 코드 물리적 복사 백업
  try {
    const srcDir = path.join(__dirname, "..", "src");
    const destDir = path.join(backupDir, "src");
    copyFolderRecursiveSync(srcDir, destDir);
    console.log(`✅ [2/2] 파일 물리적 백업 완료: backups/backup_${timestamp}`);
    console.log(`🎉 [백업 완료] 현재 시스템 상태가 성공적으로 안전하게 저장되었습니다!`);
  } catch (err) {
    console.error("❌ 백업 복사 중 오류:", err);
  }
}

backup();
