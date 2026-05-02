import { getKey } from "../game/getKey.js";

export function fireShot(state, keyId, target) {
  const key = getKey(state, keyId);
  if (!key) return;

  const originX = key.x + key.width / 2;
  const originY = key.y + 6;
  const missDrift = keyId.charCodeAt(0) % 2 === 0 ? -72 : 72;
  const destinationX = target ? target.x : (state.active?.x || originX) + missDrift;
  const destinationY = target ? target.y : Math.max(54, (state.active?.y || originY - 240) - 60);

  state.shots.push({
    x1: originX,
    y1: originY,
    x2: destinationX,
    y2: destinationY,
    hit: Boolean(target),
    life: 0.22,
    maxLife: 0.22,
  });
}
