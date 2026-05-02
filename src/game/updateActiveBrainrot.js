import { COLORS } from "../config.js";
import { burst } from "../effects.js";
import { getKey } from "./getKey.js";

export function updateActiveBrainrot(context, delta) {
  const { state } = context;
  if (state.screen !== "playing" || !state.active) return;

  const target = getKey(state, state.active.key);
  const targetX = target.x + target.width / 2;
  state.active.x += (targetX - state.active.x) * Math.min(1, delta * 9);
  state.active.y += state.active.speed * delta;
  state.active.wobble += delta * 5;

  if (state.active.y + state.active.size / 2 < target.y) return;

  state.ensureStat(state.active.key).misses += 1;
  state.hp -= 1;
  state.streak = 0;
  burst(state, targetX, target.y, COLORS.danger, 18);
  state.active = null;

  if (state.hp <= 0) context.endGame();
  else context.spawnBrainrot();
  context.persistState();
}
