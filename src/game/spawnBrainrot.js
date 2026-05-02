import { DIFFICULTY } from "../config.js";
import { randomItem } from "../utils.js";
import { createSequence } from "./createSequence.js";
import { getKey } from "./getKey.js";

export function spawnBrainrot(state) {
  const sequence = createSequence(state);
  const key = sequence[0];
  const keyboardKey = getKey(state, key);
  const size = keyboardKey.height * 1.08;
  const speedConfig = DIFFICULTY[state.difficulty];

  state.active = {
    id: crypto.randomUUID(),
    key,
    sequence,
    progress: 0,
    x: keyboardKey.x + keyboardKey.width / 2,
    y: -size - 20,
    speed: speedConfig.baseSpeed + state.level * speedConfig.speedStep,
    status: "falling",
    frame: randomItem(state.assets.frames),
    size,
    wobble: Math.random() * Math.PI * 2,
  };
}
