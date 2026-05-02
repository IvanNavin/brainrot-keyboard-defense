import { COLORS } from "../config.js";
import { mixColor, withAlpha } from "../utils.js";
import { drawFingerLegend } from "./drawFingerLegend.js";
import { roundedRect } from "./roundedRect.js";

export function drawKeyboard(ctx, state) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawFingerLegend(ctx, state);

  for (const key of state.keys) {
    const stat = state.ensureStat(key.id);
    const guide = key.guide;
    const heat = Math.min(1, stat.misses / Math.max(4, stat.hits + stat.misses));
    const isTarget = state.highlightTarget && state.active?.key === key.id;
    const isPressed = state.pressed.has(key.id);

    ctx.fillStyle = isPressed
      ? COLORS.acid
      : isTarget
        ? COLORS.keyTarget
        : mixColor(COLORS.keyBase, guide.color, 0.24 + heat * 0.16);
    ctx.strokeStyle = isTarget ? COLORS.acid : withAlpha(guide.color, 0.72);
    ctx.lineWidth = isTarget ? 2 : 1;
    roundedRect(ctx, key.x, key.y, key.width, key.height, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPressed ? COLORS.keyPressedText : COLORS.ink;
    ctx.font = `900 ${Math.max(15, key.height * 0.38)}px Trebuchet MS`;
    ctx.fillText(key.label, key.x + key.width / 2, key.y + key.height / 2 + 1);

    ctx.fillStyle = isPressed ? COLORS.keyPressedText : withAlpha(guide.color, 0.95);
    ctx.font = `800 ${Math.max(8, key.height * 0.18)}px Trebuchet MS`;
    ctx.fillText(guide.finger, key.x + key.width / 2, key.y + key.height - 9);
  }

  ctx.restore();
}
