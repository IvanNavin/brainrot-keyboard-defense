export function createRunSnapshot(state) {
  return {
    screen: state.screen,
    language: state.language,
    mode: state.mode,
    difficulty: state.difficulty,
    highlightTarget: state.highlightTarget,
    score: state.score,
    isNewBest: state.isNewBest,
    hp: state.hp,
    streak: state.streak,
    totalHits: state.totalHits,
    level: state.level,
    active: state.active,
  };
}
