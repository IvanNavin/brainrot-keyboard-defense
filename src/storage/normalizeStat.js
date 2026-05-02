export function normalizeStat(stat) {
  return { hits: stat?.hits || 0, misses: stat?.misses || 0 };
}
