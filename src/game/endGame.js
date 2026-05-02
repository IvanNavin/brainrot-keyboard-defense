export function endGame(context) {
  const { state } = context;
  state.screen = "gameover";
  state.active = null;
  state.resumeAt = 0;
  state.finishedAt = performance.now();
  state.lastSummary = context.createGameSummary();
  state.audio?.gameOver();
  context.updateMenuForScreen();
  context.persistState();
}
