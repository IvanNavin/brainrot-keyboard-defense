export function updatePressedKeys(state, delta) {
  for (const [key, ttl] of state.pressed) {
    const next = ttl - delta * 1000;
    if (next <= 0) state.pressed.delete(key);
    else state.pressed.set(key, next);
  }
}
