export interface ErrorDiagnosticResult {
  code: string;
  title: string;
  cause: string;
  solution: string;
  rawMessage: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
}

export function classifyError(error: any): ErrorDiagnosticResult {
  const errMsg = String(error?.message || error?.error || error?.code || error || "").toLowerCase();
  const rawStr = String(error?.message || error?.error || error || "");

  // 1. permission-denied
  if (errMsg.includes("permission-denied") || errMsg.includes("insufficient permissions") || errMsg.includes("403")) {
    return {
      code: "permission-denied",
      title: "🔒 권한 거부 (Permission Denied)",
      cause: "DB 보안 규칙 또는 로그인 계정의 접근 권한이 올바르지 않습니다.",
      solution: "다시 로그인하시거나 관리자에게 읽기/쓰기 권한 승인을 요청해 주세요.",
      rawMessage: rawStr,
      severity: "CRITICAL"
    };
  }

  // 2. unauthenticated
  if (errMsg.includes("unauthenticated") || errMsg.includes("401") || errMsg.includes("token expired")) {
    return {
      code: "unauthenticated",
      title: "🔑 인증 세션 만료 (Unauthenticated)",
      cause: "로그인 토큰이 만료되었거나 세션 정보가 누락되었습니다.",
      solution: "우측 상단 프로필에서 로그아웃 후 다시 로그인해 주세요.",
      rawMessage: rawStr,
      severity: "CRITICAL"
    };
  }

  // 3. failed-precondition / index
  if (errMsg.includes("failed-precondition") || errMsg.includes("requires an index") || errMsg.includes("index")) {
    return {
      code: "failed-precondition",
      title: "📑 DB 인덱스 및 전제조건 미생성",
      cause: "Cloud DB 복합 인덱스가 생성되지 않았거나 쿼리 전제조건이 충족되지 않았습니다.",
      solution: "시스템 관리자에게 Firestore Composite Index 생성을 문의해 주세요.",
      rawMessage: rawStr,
      severity: "WARNING"
    };
  }

  // 4. unavailable
  if (errMsg.includes("unavailable") || errMsg.includes("network") || errMsg.includes("failed to fetch") || errMsg.includes("503")) {
    return {
      code: "unavailable",
      title: "📡 네트워크 및 서버 통신 장애",
      cause: "인터넷 연결이 불안정하거나 Cloud DB 서버 응답이 유실되었습니다.",
      solution: "네트워크 연결 상태를 확인한 후 잠시 후 다시 시도해 주세요.",
      rawMessage: rawStr,
      severity: "WARNING"
    };
  }

  // 5. VERSION_CONFLICT
  if (errMsg.includes("version_conflict") || errMsg.includes("409") || errMsg.includes("동시 수정")) {
    return {
      code: "VERSION_CONFLICT",
      title: "⚠️ 다중 기기 동시 수정 버전 충돌",
      cause: "다른 기기(B PC/모바일)에서 이 보고서를 이미 수정 제출했습니다.",
      solution: "최신 보고서 내용을 불러온 후 다시 수정해 저장해 주세요.",
      rawMessage: rawStr,
      severity: "WARNING"
    };
  }

  // 기본 기타 일반 오류
  return {
    code: "UNKNOWN_SERVER_ERROR",
    title: "🚨 시스템 데이터 수신 오류",
    cause: "서버와의 통신 중 수신 예외가 발생했습니다.",
    solution: "화면을 새로고침하거나 관리자에게 에러 내용을 전달해 주세요.",
    rawMessage: rawStr,
    severity: "CRITICAL"
  };
}
