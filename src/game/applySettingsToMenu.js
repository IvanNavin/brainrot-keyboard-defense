export function applySettingsToMenu(elements, state) {
  elements.languageSelect.value = state.language;
  elements.modeSelect.value = state.mode;
  elements.difficultySelect.value = state.difficulty;
  elements.targetHighlightInput.checked = state.highlightTarget;
}
