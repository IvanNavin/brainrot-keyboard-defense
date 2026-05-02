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
