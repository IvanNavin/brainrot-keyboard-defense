import { STORAGE_KEY } from "../config.js";
import { createDefaultPersistedState } from "./createDefaultPersistedState.js";
import { normalizeStats } from "./normalizeStats.js";

export function loadPersistedState() {
  const fallback = createDefaultPersistedState();

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const legacyStats = JSON.parse(localStorage.getItem("brainrot-keyboard-defense.stats.v1") || "{}");
    const legacyBest = Number.parseInt(localStorage.getItem("brainrot-keyboard-defense.best-score.v1") || "0", 10) || 0;

    return {
      ...fallback,
      ...parsed,
      settings: {
        ...fallback.settings,
        ...parsed.settings,
        startSpeed: parsed.settings?.startSpeed || parsed.settings?.difficulty || fallback.settings.startSpeed,
      },
      bestScore: parsed.bestScore ?? legacyBest,
      stats: normalizeStats({ ...legacyStats, ...parsed.stats }),
      lastRun: parsed.lastRun || null,
    };
  } catch {
    return fallback;
  }
}
