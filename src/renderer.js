import { FINGER_LEGEND } from "./config.js";
import { mixColor, withAlpha } from "./utils.js";

export function draw(ctx, state) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  drawArena(ctx, state, width, height);
  drawHud(ctx, state);
  drawKeyboard(ctx, state);
  drawShots(ctx, state);
  drawBrainrot(ctx, state);
  drawFragments(ctx, state);
  drawShockwaves(ctx, state);
  drawParticles(ctx, state);
  drawStatusOverlay(ctx, state, width, height);
}

function drawArena(ctx, state, width, height) {
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

function drawHud(ctx, state) {
  ctx.save();
  ctx.fillStyle = "#f7f3df";
  ctx.font = "800 18px Trebuchet MS";
  ctx.fillText(`SCORE ${state.score}`, 24, 34);
  ctx.fillStyle = state.isNewBest ? "#b7ff37" : "#aeb0a7";
  ctx.fillText(`BEST ${state.persisted.bestScore}`, 24, 58);
  ctx.fillStyle = state.hp <= 1 ? "#ff4d4d" : "#ffb13d";
  ctx.fillText(`HP ${"I".repeat(Math.max(0, state.hp))}`, 24, 82);
  ctx.fillStyle = "#aeb0a7";
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText(`${state.language.toUpperCase()} / ${state.mode.toUpperCase()} / ${state.difficulty.toUpperCase()} / LV ${state.level + 1}`, 24, 106);
  ctx.fillText("ESC PAUSE", 24, 130);
  ctx.restore();
}

function drawBrainrot(ctx, state) {
  const brainrot = state.active;
  if (!brainrot || !state.assets.ready) return;

  const { frame } = brainrot;
  const bob = Math.sin(brainrot.wobble) * 4;
  const drawX = brainrot.x - brainrot.size / 2;
  const drawY = brainrot.y - brainrot.size / 2 + bob;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 14;
  ctx.drawImage(state.assets.image, frame.x, frame.y, frame.w, frame.h, drawX, drawY, brainrot.size, brainrot.size);
  drawBrainrotLabel(ctx, brainrot, drawY + brainrot.size + 12);
  ctx.restore();
}

function drawBrainrotLabel(ctx, brainrot, y) {
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
    const fill = isDone ? "#b7ff37" : isCurrent ? "#f7f3df" : "#777d74";

    ctx.strokeStyle = "#101412";
    ctx.fillStyle = fill;
    ctx.strokeText(letter, x, y);
    ctx.fillText(letter, x, y);

    if (isDone) {
      ctx.strokeStyle = "rgba(183, 255, 55, 0.82)";
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

function drawKeyboard(ctx, state) {
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
      ? "#b7ff37"
      : isTarget
        ? "#29371f"
        : mixColor("#1c221f", guide.color, 0.24 + heat * 0.16);
    ctx.strokeStyle = isTarget ? "#b7ff37" : withAlpha(guide.color, 0.72);
    ctx.lineWidth = isTarget ? 2 : 1;
    roundedRect(ctx, key.x, key.y, key.width, key.height, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPressed ? "#11150f" : "#f7f3df";
    ctx.font = `900 ${Math.max(15, key.height * 0.38)}px Trebuchet MS`;
    ctx.fillText(key.label, key.x + key.width / 2, key.y + key.height / 2 + 1);

    ctx.fillStyle = isPressed ? "#11150f" : withAlpha(guide.color, 0.95);
    ctx.font = `800 ${Math.max(8, key.height * 0.18)}px Trebuchet MS`;
    ctx.fillText(guide.finger, key.x + key.width / 2, key.y + key.height - 9);
  }

  ctx.restore();
}

function drawShots(ctx, state) {
  ctx.save();
  ctx.lineCap = "round";

  for (const shot of state.shots) {
    const progress = 1 - shot.life / shot.maxLife;
    const alpha = Math.max(0, shot.life / shot.maxLife);
    const headX = shot.x1 + (shot.x2 - shot.x1) * Math.min(1, progress * 1.25);
    const headY = shot.y1 + (shot.y2 - shot.y1) * Math.min(1, progress * 1.25);
    const tailX = shot.x1 + (shot.x2 - shot.x1) * Math.max(0, progress * 1.25 - 0.22);
    const tailY = shot.y1 + (shot.y2 - shot.y1) * Math.max(0, progress * 1.25 - 0.22);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shot.hit ? "#b7ff37" : "#ff4d4d";
    ctx.lineWidth = shot.hit ? 4 : 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    ctx.fillStyle = "#f7f3df";
    ctx.beginPath();
    ctx.arc(headX, headY, shot.hit ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFragments(ctx, state) {
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

function drawShockwaves(ctx, state) {
  ctx.save();
  for (const shockwave of state.shockwaves) {
    const progress = 1 - shockwave.life / shockwave.maxLife;
    const alpha = Math.max(0, shockwave.life / shockwave.maxLife);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shockwave.color;
    ctx.lineWidth = 5 * alpha;
    ctx.shadowColor = shockwave.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius + progress * shockwave.grow, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = withAlpha("#f7f3df", alpha * 0.32);
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, Math.max(1, shockwave.radius * (1 - progress)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFingerLegend(ctx, state) {
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
    ctx.fillStyle = "#aeb0a7";
    ctx.fillText(isCompact ? code : `${code} ${label}`, x + 14, y);
    x += isCompact ? 54 : Math.min(112, Math.max(78, window.innerWidth / 9.8));
  }

  ctx.restore();
}

function drawStatusOverlay(ctx, state, width, height) {
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

function drawParticles(ctx, state) {
  ctx.save();
  for (const particle of state.particles) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
