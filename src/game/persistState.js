import { savePersistedState } from "../storage.js";
import { createRunSnapshot } from "./createRunSnapshot.js";

export function persistState(state) {
  state.persisted.settings = {
    siteLanguage: state.siteLanguage,
    language: state.language,
    mode: state.mode,
    focus: state.focus,
    startSpeed: state.startSpeed,
    highlightTarget: state.highlightTarget,
    sound: state.sound,
  };
  state.persisted.lastRun = createRunSnapshot(state);
  savePersistedState(state.persisted);
}
