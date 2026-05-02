export function drawStatusOverlay(ctx, state, width, height) {
  if (state.screen !== "paused" && state.screen !== "gameover") return;

  const title = state.screen === "paused" ? "Paused" : "Game Over";
  const subtitle = state.screen === "paused" ? "Press Esc to keep defending" : `Score ${state.score}`;

  ctx.save();
  ctx.fillStyle = "rgba(8, 11, 9, 0.46)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f7f3df";
  ctx.font = "900 52px Georgia";
  ctx.fillText(title, width / 2, height * 0.32);
  ctx.fillStyle = "#ffb13d";
  ctx.font = "900 18px Trebuchet MS";
  ctx.fillText(subtitle.toUpperCase(), width / 2, height * 0.32 + 48);
  ctx.restore();
}
