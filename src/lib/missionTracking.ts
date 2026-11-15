"use client";

import { useEffect } from "react";

export interface MissionJoinMeta {
  resultSummary?: string;
  durationSec?: number;
}

function detectClientDevice(): "mobile" | "desktop" {
  try {
    if (window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      return "mobile";
    }
  } catch {}
  return "desktop";
}

function getElapsedDurationSec(id: string): number | undefined {
  try {
    const raw = sessionStorage.getItem(`mission_started_${id}`);
    if (!raw) return undefined;
    const started = Number(raw);
    if (!Number.isFinite(started) || started <= 0) return undefined;
    const sec = Math.round((Date.now() - started) / 1000);
    return Math.min(1800, Math.max(8, sec));
  } catch {
    return undefined;
  }
}

function sendOnce(
  getStorage: () => Storage,
  key: string,
  payload: Record<string, unknown>
) {
  try {
    const store = getStorage();
    if (store.getItem(key)) return;
    store.setItem(key, "1");
    fetch("/api/missions/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // 스토리지가 차단된 환경에서도 페이지 동작에 영향 주지 않음
  }
}

export function trackMissionView(id: string) {
  try {
    const startKey = `mission_started_${id}`;
    if (!sessionStorage.getItem(startKey)) {
      sessionStorage.setItem(startKey, String(Date.now()));
    }
  } catch {}
  sendOnce(() => sessionStorage, `mission_viewed_${id}`, {
    id,
    type: "view",
    device: detectClientDevice(),
  });
}

export function markMissionJoined(id: string, meta?: MissionJoinMeta) {
  try {
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" })
      .format(new Date())
      .replace(/-/g, ".");
    localStorage.setItem(`mission_joined_date_${id}`, today);
    if (meta?.resultSummary) {
      localStorage.setItem(`mission_joined_summary_${id}`, meta.resultSummary);
    }
  } catch {}

  const durationSec = meta?.durationSec ?? getElapsedDurationSec(id);
  sendOnce(() => localStorage, `mission_joined_${id}`, {
    id,
    type: "join",
    durationSec,
    resultSummary: meta?.resultSummary,
    device: detectClientDevice(),
  });
}

export function useMissionTracking(
  id: string,
  joined = false,
  resultSummary?: string
) {
  useEffect(() => {
    trackMissionView(id);
  }, [id]);

  useEffect(() => {
    if (joined) {
      markMissionJoined(id, { resultSummary });
    }
  }, [id, joined, resultSummary]);
}
