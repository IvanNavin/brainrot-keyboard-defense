export function togglePause(context) {
  const { state } = context;

  if (state.screen === "playing") {
    state.screen = "paused";
    context.updateMenuForScreen();
    context.persistState();
    return;
  }

  if (state.screen === "paused") {
    state.screen = "playing";
    context.updateMenuForScreen();
    context.persistState();
  }
}
