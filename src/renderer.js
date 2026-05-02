import { drawArena } from "./render/drawArena.js";
import { drawBrainrot } from "./render/drawBrainrot.js";
import { drawFragments } from "./render/drawFragments.js";
import { drawHud } from "./render/drawHud.js";
import { drawKeyboard } from "./render/drawKeyboard.js";
import { drawParticles } from "./render/drawParticles.js";
import { drawShockwaves } from "./render/drawShockwaves.js";
import { drawShots } from "./render/drawShots.js";
import { drawStatusOverlay } from "./render/drawStatusOverlay.js";

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
