import { COLORS } from "../config.js";

export function drawBrainrotLabel(ctx, brainrot, y) {
  const letters = brainrot.sequence.toUpperCase().split("");
  const fontSize = Math.max(18, brainrot.size * 0.38);

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${fontSize}px Trebuchet MS`;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 0;

  const widths = letters.map((letter) => ctx.measureText(letter).width);
  const gap = brainrot.sequence.length > 1 ? Math.max(2, fontSize * 0.08) : 0;
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (letters.length - 1);
  let x = brainrot.x - totalWidth / 2;

  letters.forEach((letter, index) => {
    const isDone = brainrot.sequence.length > 1 && index < brainrot.progress;
    const isCurrent = index === brainrot.progress;
    const fill = isDone ? COLORS.acid : isCurrent ? COLORS.ink : COLORS.labelFuture;

    ctx.strokeStyle = COLORS.black;
    ctx.fillStyle = fill;
    ctx.strokeText(letter, x, y);
    ctx.fillText(letter, x, y);

    if (isDone) {
      ctx.strokeStyle = COLORS.doneUnderline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + fontSize * 0.34);
      ctx.lineTo(x + widths[index], y + fontSize * 0.34);
      ctx.stroke();
      ctx.lineWidth = 5;
    }

    x += widths[index] + gap;
  });

  ctx.restore();
}
