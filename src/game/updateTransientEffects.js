export function updateTransientEffects(state, delta) {
  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * delta,
      y: particle.y + particle.vy * delta,
      vy: particle.vy + 240 * delta,
      life: particle.life - delta,
    }))
    .filter((particle) => particle.life > 0);

  state.shots = state.shots.map((shot) => ({ ...shot, life: shot.life - delta })).filter((shot) => shot.life > 0);

  state.fragments = state.fragments
    .map((fragment) => ({
      ...fragment,
      x: fragment.x + fragment.vx * delta,
      y: fragment.y + fragment.vy * delta,
      vy: fragment.vy + 360 * delta,
      rotation: fragment.rotation + fragment.spin * delta,
      life: fragment.life - delta,
    }))
    .filter((fragment) => fragment.life > 0);

  state.shockwaves = state.shockwaves
    .map((shockwave) => ({ ...shockwave, life: shockwave.life - delta }))
    .filter((shockwave) => shockwave.life > 0);
}
