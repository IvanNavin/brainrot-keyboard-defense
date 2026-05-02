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
  siteLanguageSelect: document.querySelector("#siteLanguage"),
  siteLanguageLabel: document.querySelector("#siteLanguageLabel"),
  languageSelect: document.querySelector("#language"),
  languageLabel: document.querySelector("#languageLabel"),
  modeSelect: document.querySelector("#mode"),
  modeLabel: document.querySelector("#modeLabel"),
  focusSelect: document.querySelector("#focus"),
  focusLabel: document.querySelector("#focusLabel"),
  startSpeedSelect: document.querySelector("#startSpeed"),
  startSpeedLabel: document.querySelector("#startSpeedLabel"),
  targetHighlightInput: document.querySelector("#targetHighlight"),
  targetHighlightLabel: document.querySelector("#targetHighlightLabel"),
  soundInput: document.querySelector("#sound"),
  soundLabel: document.querySelector("#soundLabel"),
};

const game = createGame({ canvas, ctx, elements });

window.addEventListener("resize", game.resize);
window.addEventListener("keydown", game.handleKeyDown);
elements.siteLanguageSelect.addEventListener("change", game.handleSettingsChange);
elements.languageSelect.addEventListener("change", game.handleLanguageChange);
elements.modeSelect.addEventListener("change", game.handleSettingsChange);
elements.focusSelect.addEventListener("change", game.handleSettingsChange);
elements.startSpeedSelect.addEventListener("change", game.handleSettingsChange);
elements.targetHighlightInput.addEventListener("change", game.handleSettingsChange);
elements.soundInput.addEventListener("change", game.handleSettingsChange);
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
