export function drawFragments(ctx, state) {
  if (!state.assets.ready) return;

  ctx.save();
  for (const fragment of state.fragments) {
    const alpha = Math.max(0, fragment.life / fragment.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.rotation);
    ctx.drawImage(
      state.assets.image,
      fragment.sx,
      fragment.sy,
      fragment.sw,
      fragment.sh,
      -fragment.size / 2,
      -fragment.size / 2,
      fragment.size,
      fragment.size,
    );
    ctx.restore();
  }
  ctx.restore();
}
