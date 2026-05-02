export function updateRestartGate(context) {
  const { state } = context;
  if (state.screen !== "gameover") return;
  if (performance.now() > state.restartAvailableAt + 1000) return;

  context.updateMenuForScreen();
}
