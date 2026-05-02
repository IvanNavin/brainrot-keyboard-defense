export function updateMenuForScreen(elements, state) {
  const isMenuVisible = state.screen === "menu" || state.screen === "paused" || state.screen === "gameover";
  elements.menu.classList.toggle("is-hidden", !isMenuVisible);
  elements.menu.classList.toggle("is-compact", state.screen === "paused");
  elements.menuBackdrop.classList.toggle("is-hidden", !isMenuVisible);
  elements.backToMenuButton.classList.toggle("is-hidden", state.screen !== "paused");

  if (state.screen === "gameover") {
    elements.menuTitle.textContent = "Game Over";
    elements.menuResult.textContent = state.isNewBest
      ? `New best ${state.persisted.bestScore} / Level ${state.level + 1}`
      : `Score ${state.score} / Best ${state.persisted.bestScore} / Level ${state.level + 1}`;
    elements.menuResult.classList.toggle("is-record", state.isNewBest);
    elements.menuResult.classList.remove("is-hidden");
    elements.startButton.disabled = false;
    elements.startButton.textContent = "Restart defense";
    return;
  }

  if (state.screen === "paused") {
    elements.menuTitle.textContent = "Paused";
    elements.menuResult.textContent = `Score ${state.score} / HP ${state.hp} / Level ${state.level + 1}`;
    elements.menuResult.classList.remove("is-hidden", "is-record");
    elements.startButton.disabled = false;
    elements.startButton.textContent = "Resume defense";
    return;
  }

  elements.menuTitle.textContent = "Brainrot Keyboard Defense";
  elements.menuResult.classList.add("is-hidden");
  elements.menuResult.classList.remove("is-record");
  elements.startButton.disabled = false;
  elements.startButton.textContent = state.screen === "paused" ? "Resume defense" : "Start defense";
}
