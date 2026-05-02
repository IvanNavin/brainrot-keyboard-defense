import { ALL_KEY_IDS, STORAGE_KEY } from "./config.js";

export function createDefaultPersistedState() {
  return {
    version: 2,
    settings: {
      language: "en",
      mode: "classic",
      difficulty: "normal",
      highlightTarget: false,
    },
    bestScore: 0,
    stats: Object.fromEntries(ALL_KEY_IDS.map((key) => [key, { hits: 0, misses: 0 }])),
    lastRun: null,
  };
}

export function loadPersistedState() {
  const fallback = createDefaultPersistedState();

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const legacyStats = JSON.parse(localStorage.getItem("brainrot-keyboard-defense.stats.v1") || "{}");
    const legacyBest = Number.parseInt(localStorage.getItem("brainrot-keyboard-defense.best-score.v1") || "0", 10) || 0;

    return {
      ...fallback,
      ...parsed,
      settings: { ...fallback.settings, ...parsed.settings },
      bestScore: parsed.bestScore ?? legacyBest,
      stats: normalizeStats({ ...legacyStats, ...parsed.stats }),
      lastRun: parsed.lastRun || null,
    };
  } catch {
    return fallback;
  }
}

export function savePersistedState(persistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
}

export function normalizeStats(stats) {
  return Object.fromEntries(ALL_KEY_IDS.map((key) => [key, normalizeStat(stats?.[key])]));
}

export function normalizeStat(stat) {
  return { hits: stat?.hits || 0, misses: stat?.misses || 0 };
}
