export function restoreLastRun(state) {
  const lastRun = state.persisted.lastRun;
  if (!lastRun || lastRun.screen === "menu" || lastRun.screen === "gameover") return;

  Object.assign(state, {
    ...lastRun,
    screen: "paused",
    inputQueue: [],
    particles: [],
    shots: [],
    fragments: [],
    shockwaves: [],
    pressed: new Map(),
  });
}
