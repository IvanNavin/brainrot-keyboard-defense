import { savePersistedState } from "../storage.js";
import { applyCopyToMenu } from "./applyCopyToMenu.js";
import { syncSettingsFromMenu } from "./syncSettingsFromMenu.js";

export function handleSettingsChange(context) {
  syncSettingsFromMenu(context.elements, context.state);
  context.state.audio?.setEnabled(context.state.sound);
  applyCopyToMenu(context.elements, context.state);
  context.resize();
  context.updateMenuForScreen();
  savePersistedState(context.state.persisted);
}
