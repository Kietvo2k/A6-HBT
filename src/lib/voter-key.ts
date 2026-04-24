"use client";

const VOTER_KEY_STORAGE_KEY = "yearbook-voter-key";

export function getOrCreateVoterKey() {
  if (typeof window === "undefined") {
    return "";
  }

  const existingKey = window.localStorage.getItem(VOTER_KEY_STORAGE_KEY);

  if (existingKey) {
    return existingKey;
  }

  const nextKey =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `browser-${Date.now()}`;

  window.localStorage.setItem(VOTER_KEY_STORAGE_KEY, nextKey);
  return nextKey;
}
