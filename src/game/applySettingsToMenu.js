export function applySettingsToMenu(elements, state) {
  elements.siteLanguageSelect.value = state.siteLanguage;
  elements.languageSelect.value = state.language;
  elements.modeSelect.value = state.mode;
  elements.focusSelect.value = state.focus;
  elements.startSpeedSelect.value = state.startSpeed;
  elements.targetHighlightInput.checked = state.highlightTarget;
  elements.soundInput.checked = state.sound;
}
