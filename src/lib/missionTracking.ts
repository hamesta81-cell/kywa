"use client";

import { useEffect } from "react";

// 안전 미션 조회수·참여자수 집계. 조회는 브라우저 세션마다 1번, 참여는 미션을 끝낸 브라우저마다 1번만 보낸다.
function sendOnce(getStorage: () => Storage, key: string, id: string, type: "view" | "join") {
  try {
    const storage = getStorage();
    if (storage.getItem(key)) return;
    storage.setItem(key, "1");
  } catch {}
  fetch("/api/missions/stats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, type }),
    keepalive: true,
  }).catch(() => {});
}

export function trackMissionView(id: string) {
  sendOnce(() => sessionStorage, `mission_viewed_${id}`, id, "view");
}

export function markMissionJoined(id: string) {
  try {
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" })
      .format(new Date())
      .replace(/-/g, ".");
    localStorage.setItem(`mission_joined_date_${id}`, today);
  } catch {}
  sendOnce(() => localStorage, `mission_joined_${id}`, id, "join");
}

// 미션 화면에서 호출: 화면을 열면 조회, joined가 참이 되면 참여로 센다.
export function useMissionTracking(id: string, joined = false) {
  useEffect(() => {
    trackMissionView(id);
  }, [id]);

  useEffect(() => {
    if (joined) markMissionJoined(id);
  }, [id, joined]);
}
