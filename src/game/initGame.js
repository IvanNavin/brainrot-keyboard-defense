import { applySettingsToMenu } from "./applySettingsToMenu.js";
import { applyCopyToMenu } from "./applyCopyToMenu.js";
import { restoreLastRun } from "./restoreLastRun.js";

export async function initGame(context, assets) {
  const { elements, state } = context;

  state.assets = assets;
  state.dictionaries = await context.loadWordLibrary();
  state.audio?.setEnabled(state.sound);
  applySettingsToMenu(elements, state);
  applyCopyToMenu(elements, state);
  restoreLastRun(state);
  context.resize();
  context.updateMenuForScreen();
  elements.startButton.disabled = false;
  context.updateMenuForScreen();
}
