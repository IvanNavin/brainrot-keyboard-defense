export function handleLanguageChange(context) {
  const { elements, state } = context;
  if (state.screen === "playing" || state.screen === "paused") return;

  state.language = elements.languageSelect.value;
  state.persisted.settings.language = state.language;
  context.resize();
  context.updateMenuForScreen();
  context.persistState();
}
