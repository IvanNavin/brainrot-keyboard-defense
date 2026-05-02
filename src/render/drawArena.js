export function drawArena(ctx, state, width, height) {
  const floorY = state.keys[0]?.y - 28 || height - 220;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#111613");
  gradient.addColorStop(0.55, "#172018");
  gradient.addColorStop(1, "#0d100e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(247, 243, 223, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 38) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(183, 255, 55, 0.08)";
  ctx.fillRect(0, floorY, width, 2);
}
