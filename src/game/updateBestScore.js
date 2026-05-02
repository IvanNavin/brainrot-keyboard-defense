export function updateBestScore(state) {
  if (state.score <= state.persisted.bestScore) return;

  state.persisted.bestScore = state.score;
  state.isNewBest = true;
}
