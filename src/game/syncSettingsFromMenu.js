export function syncSettingsFromMenu(elements, state) {
  state.persisted.settings = {
    language: elements.languageSelect.value,
    mode: elements.modeSelect.value,
    difficulty: elements.difficultySelect.value,
    highlightTarget: elements.targetHighlightInput.checked,
  };
}
