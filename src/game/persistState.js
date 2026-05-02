import { savePersistedState } from "../storage.js";
import { createRunSnapshot } from "./createRunSnapshot.js";

export function persistState(state) {
  state.persisted.settings = {
    language: state.language,
    mode: state.mode,
    difficulty: state.difficulty,
    highlightTarget: state.highlightTarget,
  };
  state.persisted.lastRun = createRunSnapshot(state);
  savePersistedState(state.persisted);
}
