import { getCopy } from "../i18n.js";
import { formatGameSummary } from "./formatGameSummary.js";

export function updateMenuForScreen(elements, state) {
  const copy = getCopy(state.siteLanguage);
  const isMenuVisible = state.screen === "menu" || state.screen === "paused" || state.screen === "gameover";
  elements.menu.classList.toggle("is-hidden", !isMenuVisible);
  elements.menu.classList.toggle("is-compact", state.screen === "paused");
  elements.menuBackdrop.classList.toggle("is-hidden", !isMenuVisible);
  elements.backToMenuButton.classList.toggle("is-hidden", state.screen !== "paused");

  if (state.screen === "gameover") {
    elements.menuTitle.textContent = copy.gameOver;
    elements.menuResult.textContent = formatGameSummary(state);
    elements.menuResult.classList.toggle("is-record", state.isNewBest);
    elements.menuResult.classList.remove("is-hidden");
    elements.startButton.disabled = false;
    elements.startButton.textContent = copy.restart;
    return;
  }

  if (state.screen === "paused") {
    elements.menuTitle.textContent = copy.paused;
    elements.menuResult.textContent = `${copy.score} ${state.score} / ${copy.hp} ${state.hp} / ${copy.level} ${state.level + 1}`;
    elements.menuResult.classList.remove("is-hidden", "is-record");
    elements.startButton.disabled = false;
    elements.startButton.textContent = copy.resume;
    return;
  }

  elements.menuTitle.textContent = copy.title;
  elements.menuResult.classList.add("is-hidden");
  elements.menuResult.classList.remove("is-record");
  elements.startButton.disabled = false;
  elements.startButton.textContent = state.screen === "paused" ? copy.resume : copy.start;
}
