export function getKeysPerMinute(state) {
  if (!state.startedAt || !state.totalHits) return 0;
  const end = state.finishedAt || performance.now();
  const minutes = Math.max(1 / 60, (end - state.startedAt) / 60000);
  return Math.round(state.totalHits / minutes);
}
