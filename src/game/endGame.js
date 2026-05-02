export function endGame(context) {
  const { state } = context;
  state.screen = "gameover";
  state.active = null;
  context.updateMenuForScreen();
  context.persistState();
}
