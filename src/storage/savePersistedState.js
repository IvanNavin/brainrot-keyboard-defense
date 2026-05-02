import { STORAGE_KEY } from "../config.js";

export function savePersistedState(persistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
}
