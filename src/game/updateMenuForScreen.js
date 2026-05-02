export function updateMenuForScreen(elements, state) {
  const isMenuVisible = state.screen === "menu" || state.screen === "gameover";
  elements.menu.classList.toggle("is-hidden", !isMenuVisible);
  elements.menuBackdrop.classList.toggle("is-hidden", !isMenuVisible);

  if (state.screen === "gameover") {
    elements.menuTitle.textContent = "Game Over";
    elements.menuResult.textContent = state.isNewBest
      ? `New best ${state.persisted.bestScore} / Level ${state.level + 1}`
      : `Score ${state.score} / Best ${state.persisted.bestScore} / Level ${state.level + 1}`;
    elements.menuResult.classList.toggle("is-record", state.isNewBest);
    elements.menuResult.classList.remove("is-hidden");
    elements.startButton.textContent = "Restart defense";
    return;
  }

  elements.menuTitle.textContent = "Brainrot Keyboard Defense";
  elements.menuResult.classList.add("is-hidden");
  elements.menuResult.classList.remove("is-record");
  elements.startButton.textContent = state.screen === "paused" ? "Resume defense" : "Start defense";
}
