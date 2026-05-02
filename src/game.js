import { createInitialState } from "./game/createInitialState.js";
import { endGame } from "./game/endGame.js";
import { ensureStat as ensurePersistedStat } from "./game/ensureStat.js";
import { handleKeyDown } from "./game/handleKeyDown.js";
import { handleLanguageChange } from "./game/handleLanguageChange.js";
import { handleSettingsChange } from "./game/handleSettingsChange.js";
import { initGame } from "./game/initGame.js";
import { loopGame } from "./game/loopGame.js";
import { persistState as persistGameState } from "./game/persistState.js";
import { processInput } from "./game/processInput.js";
import { resizeGame } from "./game/resizeGame.js";
import { returnToMenu } from "./game/returnToMenu.js";
import { spawnBrainrot } from "./game/spawnBrainrot.js";
import { startGame } from "./game/startGame.js";
import { togglePause } from "./game/togglePause.js";
import { updateBestScore as updatePersistedBestScore } from "./game/updateBestScore.js";
import { updateGame } from "./game/updateGame.js";
import { updateMenuForScreen } from "./game/updateMenuForScreen.js";
import { loadPersistedState } from "./storage.js";
import { loadWordLibrary } from "./wordLibrary.js";

export function createGame({ canvas, ctx, elements }) {
  const persisted = loadPersistedState();
  const state = createInitialState(persisted, (key) => ensurePersistedStat(state, key));
  const context = {
    canvas,
    ctx,
    elements,
    state,
    loadWordLibrary,
    init: (assets) => initGame(context, assets),
    resize: () => resizeGame(canvas, ctx, state),
    startGame: () => startGame(context),
    returnToMenu: () => returnToMenu(context),
    endGame: () => endGame(context),
    togglePause: () => togglePause(context),
    spawnBrainrot: () => spawnBrainrot(state),
    processInput: () => processInput(context),
    update: (delta) => updateGame(context, delta),
    updateBestScore: () => updatePersistedBestScore(state),
    updateMenuForScreen: () => updateMenuForScreen(elements, state),
    persistState: () => persistGameState(state),
    handleKeyDown: (event) => handleKeyDown(context, event),
    handleLanguageChange: () => handleLanguageChange(context),
    handleSettingsChange: () => handleSettingsChange(context),
    loop: (now) => loopGame(context, now),
  };

  return context;
}
