import { getCopy } from "../i18n.js";

export function applyCopyToMenu(elements, state) {
  const copy = getCopy(state.siteLanguage);

  document.documentElement.lang = state.siteLanguage;
  elements.menu.querySelector(".kicker").textContent = copy.brandKicker;
  elements.siteLanguageLabel.textContent = copy.siteLanguage;
  elements.languageLabel.textContent = copy.keyboardLanguage;
  elements.modeLabel.textContent = copy.mode;
  elements.focusLabel.textContent = copy.focus;
  elements.startSpeedLabel.textContent = copy.startSpeed;
  elements.targetHighlightLabel.textContent = copy.highlightTarget;
  elements.soundLabel.textContent = copy.sound;
  elements.backToMenuButton.textContent = copy.backToMenu;

  for (const option of elements.languageSelect.options) option.textContent = copy.options.language[option.value];
  for (const option of elements.modeSelect.options) option.textContent = copy.options.mode[option.value];
  for (const option of elements.focusSelect.options) option.textContent = copy.options.focus[option.value];
  for (const option of elements.startSpeedSelect.options) option.textContent = copy.options.startSpeed[option.value];
}
