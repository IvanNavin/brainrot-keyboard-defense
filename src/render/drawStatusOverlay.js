import { COLORS } from "../config.js";
import { getCopy } from "../i18n.js";

export function drawStatusOverlay(ctx, state, width, height) {
  if (state.screen !== "paused" && state.screen !== "gameover" && state.screen !== "hitpause") return;

  const copy = getCopy(state.siteLanguage);
  const seconds = Math.ceil(Math.max(0, state.resumeAt - performance.now()) / 1000);
  const title = state.screen === "paused" ? copy.paused : state.screen === "hitpause" ? copy.hitTaken : copy.gameOver;
  const subtitle = state.screen === "paused"
    ? copy.keepDefending
    : state.screen === "hitpause"
      ? `${copy.nextWave} ${seconds}`
      : `${copy.score} ${state.score}`;

  ctx.save();
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLORS.ink;
  ctx.font = "900 52px Georgia";
  ctx.fillText(title, width / 2, height * 0.32);
  ctx.fillStyle = COLORS.amber;
  ctx.font = "900 18px Trebuchet MS";
  ctx.fillText(subtitle.toUpperCase(), width / 2, height * 0.32 + 48);
  ctx.restore();
}
