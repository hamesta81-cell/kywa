"use client";

import { installAuthFetch } from "@/lib/clientAuth";

// 모듈을 읽는 순간 fetch에 로그인 토큰을 붙이도록 설치한다(페이지의 첫 데이터 요청보다 먼저).
installAuthFetch();

export default function AuthFetchBridge() {
  return null;
}
