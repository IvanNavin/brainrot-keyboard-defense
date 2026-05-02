import { COLORS } from "../config.js";
import { drawBrainrotLabel } from "./drawBrainrotLabel.js";

export function drawBrainrot(ctx, state) {
  const brainrot = state.active;
  if (!brainrot || !state.assets.ready) return;

  const { frame } = brainrot;
  const bob = Math.sin(brainrot.wobble) * 4;
  const drawX = brainrot.x - brainrot.size / 2;
  const drawY = brainrot.y - brainrot.size / 2 + bob;

  ctx.save();
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 14;
  ctx.drawImage(state.assets.image, frame.x, frame.y, frame.w, frame.h, drawX, drawY, brainrot.size, brainrot.size);
  drawBrainrotLabel(ctx, brainrot, drawY + brainrot.size + 12);
  ctx.restore();
}
