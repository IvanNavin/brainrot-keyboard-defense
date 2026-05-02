import { COLORS } from "../config.js";
import { getAccuracy } from "../game/getAccuracy.js";
import { getKeysPerMinute } from "../game/getKeysPerMinute.js";
import { getMultiplier } from "../game/getMultiplier.js";
import { getCopy } from "../i18n.js";

export function drawHud(ctx, state) {
  const copy = getCopy(state.siteLanguage);

  ctx.save();
  ctx.fillStyle = COLORS.ink;
  ctx.font = "800 18px Trebuchet MS";
  ctx.fillText(`${copy.score.toUpperCase()} ${state.score}`, 24, 34);
  ctx.fillStyle = state.isNewBest ? COLORS.acid : COLORS.muted;
  ctx.fillText(`${copy.best.toUpperCase()} ${state.persisted.bestScore}`, 24, 58);
  ctx.fillStyle = state.hp <= 1 ? COLORS.danger : COLORS.amber;
  ctx.fillText(`${copy.hp} ${"I".repeat(Math.max(0, state.hp))}`, 24, 82);
  ctx.fillStyle = COLORS.muted;
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText(`${state.language.toUpperCase()} / ${state.mode.toUpperCase()} / ${state.startSpeed.toUpperCase()} / ${copy.level} ${state.level + 1}`, 24, 106);
  ctx.fillText("ESC PAUSE", 24, 130);
  ctx.fillStyle = COLORS.acid;
  ctx.fillText(`${copy.combo.toUpperCase()} x${getMultiplier(state.streak)} / ${copy.streak.toUpperCase()} ${state.streak}`, 24, 154);
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(`${copy.accuracy.toUpperCase()} ${getAccuracy(state)}% / ${copy.kpm} ${getKeysPerMinute(state)}`, 24, 178);
  ctx.restore();
}
