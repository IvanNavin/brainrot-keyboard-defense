import { COLORS } from "../config.js";

export function drawStatusOverlay(ctx, state, width, height) {
  if (state.screen !== "paused" && state.screen !== "gameover" && state.screen !== "hitpause") return;

  const seconds = Math.ceil(Math.max(0, state.resumeAt - performance.now()) / 1000);
  const title = state.screen === "paused" ? "Paused" : state.screen === "hitpause" ? "Hit Taken" : "Game Over";
  const subtitle = state.screen === "paused"
    ? "Press Esc to keep defending"
    : state.screen === "hitpause"
      ? `Next wave in ${seconds}`
      : `Score ${state.score}`;

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
