export function startGame(context) {
  const { elements, state } = context;
  if (!state.assets.ready) return;

  if (state.screen === "paused") {
    state.screen = "playing";
    if (state.sound) state.audio?.resume();
    context.updateMenuForScreen();
    context.persistState();
    return;
  }

  state.screen = "playing";
  state.siteLanguage = elements.siteLanguageSelect.value;
  state.language = elements.languageSelect.value;
  state.mode = elements.modeSelect.value;
  state.focus = elements.focusSelect.value;
  state.startSpeed = elements.startSpeedSelect.value;
  state.highlightTarget = elements.targetHighlightInput.checked;
  state.sound = elements.soundInput.checked;
  state.audio?.setEnabled(state.sound);
  if (state.sound) state.audio?.resume();
  state.score = 0;
  state.isNewBest = false;
  state.hp = 3;
  state.streak = 0;
  state.bestStreak = 0;
  state.totalHits = 0;
  state.totalAttempts = 0;
  state.totalMistakes = 0;
  state.startedAt = performance.now();
  state.finishedAt = 0;
  state.level = 0;
  state.lastSummary = null;
  state.runStats = {};
  state.active = null;
  state.inputQueue = [];
  state.particles = [];
  state.shots = [];
  state.fragments = [];
  state.shockwaves = [];
  state.resumeAt = 0;
  state.pressed.clear();
  context.resize();
  context.spawnBrainrot();
  context.updateMenuForScreen();
  context.persistState();
}
