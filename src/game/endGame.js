export function endGame(context) {
  const { state } = context;
  state.screen = "gameover";
  state.active = null;
  state.restartAvailableAt = performance.now() + 3000;
  context.updateMenuForScreen();
  context.persistState();
}
