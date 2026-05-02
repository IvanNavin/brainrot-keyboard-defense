import { draw } from "../renderer.js";

export function loopGame(context, now) {
  const { ctx, state } = context;
  const delta = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;
  context.update(delta);
  draw(ctx, state);
  requestAnimationFrame((nextNow) => loopGame(context, nextNow));
}
