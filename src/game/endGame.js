export function endGame(context) {
  const { state } = context;
  state.screen = "gameover";
  state.active = null;
  state.resumeAt = 0;
  context.updateMenuForScreen();
  context.persistState();
}
