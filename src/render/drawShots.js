import { COLORS } from "../config.js";

export function drawShots(ctx, state) {
  ctx.save();
  ctx.lineCap = "round";

  for (const shot of state.shots) {
    const progress = 1 - shot.life / shot.maxLife;
    const alpha = Math.max(0, shot.life / shot.maxLife);
    const headX = shot.x1 + (shot.x2 - shot.x1) * Math.min(1, progress * 1.25);
    const headY = shot.y1 + (shot.y2 - shot.y1) * Math.min(1, progress * 1.25);
    const tailX = shot.x1 + (shot.x2 - shot.x1) * Math.max(0, progress * 1.25 - 0.22);
    const tailY = shot.y1 + (shot.y2 - shot.y1) * Math.max(0, progress * 1.25 - 0.22);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shot.hit ? COLORS.acid : COLORS.danger;
    ctx.lineWidth = shot.hit ? 4 : 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    ctx.fillStyle = COLORS.ink;
    ctx.beginPath();
    ctx.arc(headX, headY, shot.hit ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
