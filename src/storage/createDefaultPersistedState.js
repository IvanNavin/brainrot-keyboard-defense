import { ALL_KEY_IDS } from "../config.js";

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
