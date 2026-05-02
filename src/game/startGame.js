export function startGame(context) {
  const { elements, state } = context;
  if (!state.assets.ready) return;
  if (state.screen === "gameover" && performance.now() < state.restartAvailableAt) return;

  state.screen = "playing";
  state.language = elements.languageSelect.value;
  state.mode = elements.modeSelect.value;
  state.difficulty = elements.difficultySelect.value;
  state.highlightTarget = elements.targetHighlightInput.checked;
  state.score = 0;
  state.isNewBest = false;
  state.hp = 3;
  state.streak = 0;
  state.totalHits = 0;
  state.level = 0;
  state.active = null;
  state.inputQueue = [];
  state.particles = [];
  state.shots = [];
  state.fragments = [];
  state.shockwaves = [];
  state.restartAvailableAt = 0;
  state.pressed.clear();
  context.resize();
  context.spawnBrainrot();
  context.updateMenuForScreen();
  context.persistState();
}
