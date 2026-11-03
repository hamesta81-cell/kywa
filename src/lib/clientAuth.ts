// 🔑 브라우저 쪽 로그인 토큰: 로그인 때 받은 토큰을 보관하고, 같은 사이트 /api/ 요청에 x-kywa-auth 머리글로 붙인다.
// 서버 확인은 src/lib/serverAuth.ts.

const TOKEN_KEY = "kywa_auth_token";

export function getAuthToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

let installed = false;

export function installAuthFetch() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const token = getAuthToken();
      const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const url = new URL(raw, window.location.href);
      if (token && url.origin === window.location.origin && url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/auth/")) {
        const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
        if (!headers.has("x-kywa-auth")) headers.set("x-kywa-auth", token);
        return original(input, { ...init, headers });
      }
    } catch {}
    return original(input, init);
  };
}
