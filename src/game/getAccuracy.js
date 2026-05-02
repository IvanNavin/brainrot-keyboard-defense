export function getAccuracy(state) {
  if (!state.totalAttempts) return 100;
  return Math.round((state.totalHits / state.totalAttempts) * 100);
}
