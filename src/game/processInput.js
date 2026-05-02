import { burst, fireShot, shatterBrainrot } from "../effects.js";
import { COLORS } from "../config.js";
import { ensureRunStat } from "./ensureRunStat.js";
import { getMultiplier } from "./getMultiplier.js";

export function processInput(context) {
  const { state } = context;

  while (state.inputQueue.length) {
    const key = state.inputQueue.shift();
    const active = state.active?.status === "falling" ? state.active : null;
    const target = active?.key === key ? active : null;
    const targetKey = active?.key || key;

    state.totalAttempts += 1;
    state.pressed.set(key, 120);
    fireShot(state, key, target);
    if (!target) {
      ensureRunStat(state, targetKey).misses += 1;
      state.ensureStat(targetKey).misses += 1;
      state.totalMistakes += 1;
      state.streak = 0;
      state.audio?.miss();
      context.persistState();
      continue;
    }

    ensureRunStat(state, key).hits += 1;
    state.ensureStat(key).hits += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.score += getMultiplier(state.streak);
    context.updateBestScore();
    state.totalHits += 1;
    const previousLevel = state.level;
    state.level = Math.floor(state.totalHits / 10);
    if (state.level > previousLevel) state.audio?.levelUp();
    else state.audio?.hit();

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
