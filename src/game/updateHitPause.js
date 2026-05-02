export function updateHitPause(context) {
  const { state } = context;
  if (state.screen !== "hitpause") return;

  context.updateMenuForScreen();
  if (performance.now() < state.resumeAt) return;

  state.resumeAt = 0;
  if (state.hp <= 0) context.endGame();
  else {
    state.screen = "playing";
    context.spawnBrainrot();
    context.persistState();
  }
}
