import { applySettingsToMenu } from "./applySettingsToMenu.js";
import { restoreLastRun } from "./restoreLastRun.js";

export async function initGame(context, assets) {
  const { elements, state } = context;

  state.assets = assets;
  state.dictionaries = await context.loadWordLibrary();
  applySettingsToMenu(elements, state);
  restoreLastRun(state);
  context.resize();
  context.updateMenuForScreen();
  elements.startButton.disabled = false;
  elements.startButton.textContent = state.screen === "menu" ? "Start defense" : "Resume defense";
}
