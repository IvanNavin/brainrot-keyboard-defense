import { loadAssets } from "./assets.js";
import { createGame } from "./game.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const elements = {
  menu: document.querySelector("#menu"),
  menuBackdrop: document.querySelector("#menuBackdrop"),
  menuTitle: document.querySelector("#menuTitle"),
  menuResult: document.querySelector("#menuResult"),
  startButton: document.querySelector("#start"),
  backToMenuButton: document.querySelector("#backToMenu"),
  languageSelect: document.querySelector("#language"),
  modeSelect: document.querySelector("#mode"),
  difficultySelect: document.querySelector("#difficulty"),
  targetHighlightInput: document.querySelector("#targetHighlight"),
};

const game = createGame({ canvas, ctx, elements });

window.addEventListener("resize", game.resize);
window.addEventListener("keydown", game.handleKeyDown);
elements.languageSelect.addEventListener("change", game.handleLanguageChange);
elements.modeSelect.addEventListener("change", game.handleSettingsChange);
elements.difficultySelect.addEventListener("change", game.handleSettingsChange);
elements.targetHighlightInput.addEventListener("change", game.handleSettingsChange);
elements.startButton.addEventListener("click", game.startGame);
elements.backToMenuButton.addEventListener("click", game.returnToMenu);

game.resize();
loadAssets()
  .then((assets) => game.init(assets))
  .catch((error) => {
    console.error("Brainrot atlas failed to load", error);
    elements.startButton.textContent = "Brainrots failed to load";
  })
  .finally(() => {
    requestAnimationFrame(game.loop);
  });
