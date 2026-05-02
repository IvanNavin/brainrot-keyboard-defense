export function ensureStat(state, key) {
  if (!state.persisted.stats[key]) state.persisted.stats[key] = { hits: 0, misses: 0 };
  return state.persisted.stats[key];
}
