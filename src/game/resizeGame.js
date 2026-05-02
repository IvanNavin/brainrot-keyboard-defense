import { buildKeyboard } from "../layout.js";

export function resizeGame(canvas, ctx, state) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.keys = buildKeyboard(window.innerWidth, window.innerHeight, state);
}
