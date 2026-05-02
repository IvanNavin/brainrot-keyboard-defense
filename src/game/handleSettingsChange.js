import { savePersistedState } from "../storage.js";
import { syncSettingsFromMenu } from "./syncSettingsFromMenu.js";

export function handleSettingsChange(context) {
  syncSettingsFromMenu(context.elements, context.state);
  savePersistedState(context.state.persisted);
}
