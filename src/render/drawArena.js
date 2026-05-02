import { COLORS } from "../config.js";

export function drawArena(ctx, state, width, height) {
  const floorY = state.keys[0]?.y - 28 || height - 220;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, COLORS.arenaStart);
  gradient.addColorStop(0.55, COLORS.arenaMiddle);
  gradient.addColorStop(1, COLORS.arenaEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 38) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.floorLine;
  ctx.fillRect(0, floorY, width, 2);
}
