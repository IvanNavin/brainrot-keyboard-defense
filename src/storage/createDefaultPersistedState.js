import { ALL_KEY_IDS } from "../config.js";

export function createDefaultPersistedState() {
  return {
    version: 2,
    settings: {
      siteLanguage: "en",
      language: "en",
      mode: "classic",
      focus: "all",
      startSpeed: "normal",
      highlightTarget: false,
      sound: true,
    },
    bestScore: 0,
    stats: Object.fromEntries(ALL_KEY_IDS.map((key) => [key, { hits: 0, misses: 0 }])),
    lastRun: null,
  };
}
