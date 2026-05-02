export function ensureRunStat(state, key) {
  if (!state.runStats[key]) state.runStats[key] = { hits: 0, misses: 0 };
  return state.runStats[key];
}
