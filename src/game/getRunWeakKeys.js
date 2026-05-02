import { currentKeyIds } from "../layout.js";

export function getRunWeakKeys(state, limit = 4) {
  const currentKeys = new Set(currentKeyIds(state));

  return Object.entries(state.runStats || {})
    .filter(([key]) => currentKeys.has(key))
    .map(([key, stat]) => ({
      key,
      misses: stat.misses || 0,
      hits: stat.hits || 0,
      rate: (stat.misses || 0) / Math.max(1, (stat.hits || 0) + (stat.misses || 0)),
    }))
    .filter((entry) => entry.misses > 0)
    .sort((a, b) => b.misses - a.misses || b.rate - a.rate)
    .slice(0, limit);
}
