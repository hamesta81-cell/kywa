/**
 * 브라우저 캔버스 기반 스마트 이미지 자동 압축 유틸리티
 * @param file 사용자가 업로드한 원본 File 객체
 * @param maxWidth 최대 너비 (기본 1920px)
 * @param maxHeight 최대 높이 (기본 1920px)
 * @param quality 압축 화질 (0.0 ~ 1.0, 기본 0.85)
 * @returns Promise<string> (압축 완료된 DataURL 이미지 스트링)
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 이미지가 아닌 경우(문서/기타) 그대로 DataURL 읽기
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 원본 비율을 유지하면서 maxWidth, maxHeight 내로 스케일 계산
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // 고품질 이미지 스무딩 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG 85% 고화질 초경량 자동 압축
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        
        const originalMb = (file.size / (1024 * 1024)).toFixed(2);
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
        const compressedMb = (compressedSize / (1024 * 1024)).toFixed(2);
        
        console.log(`⚡ [스마트 자동 압축] 원본: ${originalMb}MB -> 압축 후: ${compressedMb}MB (해상도: ${width}x${height})`);

        resolve(compressedDataUrl);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
