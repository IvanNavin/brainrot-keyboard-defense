import { COLORS } from "../config.js";
import { FINGER_LEGEND } from "../config.js";
import { roundedRect } from "./roundedRect.js";

export function drawFingerLegend(ctx, state) {
  if (!state.keys.length) return;

  const firstKey = state.keys[0];
  const y = firstKey.y - 26;
  let x = firstKey.x;
  const isCompact = window.innerWidth < 760;

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "800 10px Trebuchet MS";

  for (const [code, label, color] of FINGER_LEGEND) {
    ctx.fillStyle = color;
    roundedRect(ctx, x, y - 6, 10, 10, 3);
    ctx.fill();
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(isCompact ? code : `${code} ${label}`, x + 14, y);
    x += isCompact ? 54 : Math.min(112, Math.max(78, window.innerWidth / 9.8));
  }

  ctx.restore();
}
