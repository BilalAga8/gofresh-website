"use client";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minuta

export function getRateLimitKey(identifier: string) {
  return `ratelimit_${identifier}`;
}

type RateLimitData = {
  attempts: number;
  blockedUntil: number | null;
};

export function checkRateLimit(key: string): { blocked: boolean; remainingMs: number; attempts: number } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { blocked: false, remainingMs: 0, attempts: 0 };

    const data: RateLimitData = JSON.parse(raw);

    if (data.blockedUntil && Date.now() < data.blockedUntil) {
      return { blocked: true, remainingMs: data.blockedUntil - Date.now(), attempts: data.attempts };
    }

    // Blokim ka skaduar — reseto
    if (data.blockedUntil && Date.now() >= data.blockedUntil) {
      localStorage.removeItem(key);
      return { blocked: false, remainingMs: 0, attempts: 0 };
    }

    return { blocked: false, remainingMs: 0, attempts: data.attempts };
  } catch {
    return { blocked: false, remainingMs: 0, attempts: 0 };
  }
}

export function recordFailedAttempt(key: string): { blocked: boolean; attemptsLeft: number } {
  try {
    const raw = localStorage.getItem(key);
    const data: RateLimitData = raw ? JSON.parse(raw) : { attempts: 0, blockedUntil: null };

    data.attempts += 1;

    if (data.attempts >= MAX_ATTEMPTS) {
      data.blockedUntil = Date.now() + BLOCK_DURATION_MS;
      localStorage.setItem(key, JSON.stringify(data));
      return { blocked: true, attemptsLeft: 0 };
    }

    localStorage.setItem(key, JSON.stringify(data));
    return { blocked: false, attemptsLeft: MAX_ATTEMPTS - data.attempts };
  } catch {
    return { blocked: false, attemptsLeft: MAX_ATTEMPTS };
  }
}

export function clearRateLimit(key: string) {
  localStorage.removeItem(key);
}

export function formatBlockTime(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} minut${minutes === 1 ? "ë" : "a"}`;
}
