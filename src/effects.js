export function burst(state, x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const force = 80 + Math.random() * 190;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      size: 2 + Math.random() * 4,
      color,
      life: 0.28 + Math.random() * 0.36,
      maxLife: 0.64,
    });
  }
}

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

export function shatterBrainrot(state, brainrot) {
  const cols = 3;
  const rows = 3;
  const pieceSize = brainrot.size / cols;

  state.shockwaves.push({
    x: brainrot.x,
    y: brainrot.y,
    radius: brainrot.size * 0.24,
    grow: brainrot.size * 1.35,
    color: "#b7ff37",
    life: 0.34,
    maxLife: 0.34,
  });

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const angle = Math.atan2(row - 1, col - 1) + (Math.random() - 0.5) * 0.9;
      const force = 95 + Math.random() * 210;
      state.fragments.push({
        sx: brainrot.frame.x + (brainrot.frame.w / cols) * col,
        sy: brainrot.frame.y + (brainrot.frame.h / rows) * row,
        sw: brainrot.frame.w / cols,
        sh: brainrot.frame.h / rows,
        x: brainrot.x + (col - 1) * pieceSize * 0.45,
        y: brainrot.y + (row - 1) * pieceSize * 0.45,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 80,
        rotation: Math.random() * Math.PI,
        spin: -8 + Math.random() * 16,
        size: pieceSize,
        life: 0.62,
        maxLife: 0.62,
      });
    }
  }
}

function getKey(state, id) {
  return state.keys.find((key) => key.id === id);
}
