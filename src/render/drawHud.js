import { COLORS } from "../config.js";

export function drawHud(ctx, state) {
  ctx.save();
  ctx.fillStyle = COLORS.ink;
  ctx.font = "800 18px Trebuchet MS";
  ctx.fillText(`SCORE ${state.score}`, 24, 34);
  ctx.fillStyle = state.isNewBest ? COLORS.acid : COLORS.muted;
  ctx.fillText(`BEST ${state.persisted.bestScore}`, 24, 58);
  ctx.fillStyle = state.hp <= 1 ? COLORS.danger : COLORS.amber;
  ctx.fillText(`HP ${"I".repeat(Math.max(0, state.hp))}`, 24, 82);
  ctx.fillStyle = COLORS.muted;
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText(`${state.language.toUpperCase()} / ${state.mode.toUpperCase()} / ${state.difficulty.toUpperCase()} / LV ${state.level + 1}`, 24, 106);
  ctx.fillText("ESC PAUSE", 24, 130);
  ctx.restore();
}
