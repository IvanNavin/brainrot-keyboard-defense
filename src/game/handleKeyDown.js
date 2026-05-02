import { keyFromEvent } from "../layout.js";

export function handleKeyDown(context, event) {
  const { state } = context;

  if (event.key === "Escape") {
    event.preventDefault();
    context.togglePause();
    return;
  }

  const key = keyFromEvent(event, state);
  if (state.screen === "playing" && key) {
    event.preventDefault();
    state.inputQueue.push(key);
  }

  if (event.key === "Enter" && state.screen !== "playing" && state.screen !== "paused") context.startGame();
}
