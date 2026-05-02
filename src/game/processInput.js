import { burst, fireShot, shatterBrainrot } from "../effects.js";
import { COLORS } from "../config.js";

export function processInput(context) {
  const { state } = context;

  while (state.inputQueue.length) {
    const key = state.inputQueue.shift();
    const target = state.active?.status === "falling" && state.active.key === key ? state.active : null;

    state.pressed.set(key, 120);
    fireShot(state, key, target);
    if (!target) continue;

    state.ensureStat(key).hits += 1;
    state.score += 1;
    context.updateBestScore();
    state.streak += 1;
    state.totalHits += 1;
    state.level = Math.floor(state.totalHits / 10);

    if (target.progress < target.sequence.length - 1) {
      target.progress += 1;
      target.key = target.sequence[target.progress];
      burst(state, target.x, target.y, COLORS.acid, 8);
      context.persistState();
      return;
    }

    shatterBrainrot(state, target);
    burst(state, target.x, target.y, COLORS.acid, 22);
    state.active = null;
    context.spawnBrainrot();
    context.persistState();
  }
}
