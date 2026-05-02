import { COLORS } from "../config.js";

export function shatterBrainrot(state, brainrot, color = COLORS.acid) {
  const cols = 3;
  const rows = 3;
  const pieceSize = brainrot.size / cols;

  state.shockwaves.push({
    x: brainrot.x,
    y: brainrot.y,
    radius: brainrot.size * 0.24,
    grow: brainrot.size * 1.35,
    color,
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
