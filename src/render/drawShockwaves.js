import { withAlpha } from "../utils.js";

export function drawShockwaves(ctx, state) {
  ctx.save();
  for (const shockwave of state.shockwaves) {
    const progress = 1 - shockwave.life / shockwave.maxLife;
    const alpha = Math.max(0, shockwave.life / shockwave.maxLife);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shockwave.color;
    ctx.lineWidth = 5 * alpha;
    ctx.shadowColor = shockwave.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius + progress * shockwave.grow, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = withAlpha("#f7f3df", alpha * 0.32);
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, Math.max(1, shockwave.radius * (1 - progress)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
