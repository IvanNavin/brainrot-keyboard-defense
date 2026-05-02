import { getAccuracy } from "./getAccuracy.js";
import { getKeysPerMinute } from "./getKeysPerMinute.js";
import { getRunWeakKeys } from "./getRunWeakKeys.js";

export function createGameSummary(state) {
  return {
    score: state.score,
    bestScore: state.persisted.bestScore,
    isNewBest: state.isNewBest,
    level: state.level + 1,
    accuracy: getAccuracy(state),
    keysPerMinute: getKeysPerMinute(state),
    bestStreak: state.bestStreak,
    weakKeys: getRunWeakKeys(state, 4).map((entry) => entry.key.toUpperCase()),
  };
}
