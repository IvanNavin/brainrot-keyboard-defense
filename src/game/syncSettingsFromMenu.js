export function syncSettingsFromMenu(elements, state) {
  state.siteLanguage = elements.siteLanguageSelect.value;
  state.language = elements.languageSelect.value;
  state.mode = elements.modeSelect.value;
  state.focus = elements.focusSelect.value;
  state.startSpeed = elements.startSpeedSelect.value;
  state.highlightTarget = elements.targetHighlightInput.checked;
  state.sound = elements.soundInput.checked;
  state.persisted.settings = {
    siteLanguage: state.siteLanguage,
    language: state.language,
    mode: state.mode,
    focus: state.focus,
    startSpeed: state.startSpeed,
    highlightTarget: state.highlightTarget,
    sound: state.sound,
  };
}
