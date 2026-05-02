export function returnToMenu(context) {
  const { state } = context;

  state.screen = "menu";
  state.isNewBest = false;
  state.active = null;
  state.inputQueue = [];
  state.particles = [];
  state.shots = [];
  state.fragments = [];
  state.shockwaves = [];
  state.resumeAt = 0;
  state.pressed.clear();
  context.updateMenuForScreen();
  context.persistState();
}
