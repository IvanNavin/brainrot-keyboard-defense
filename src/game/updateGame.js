import { updateActiveBrainrot } from "./updateActiveBrainrot.js";
import { updateHitPause } from "./updateHitPause.js";
import { updatePressedKeys } from "./updatePressedKeys.js";
import { updateTransientEffects } from "./updateTransientEffects.js";

export function updateGame(context, delta) {
  const { state } = context;
  if (state.screen === "playing") context.processInput();

  updatePressedKeys(state, delta);
  updateActiveBrainrot(context, delta);
  updateHitPause(context);
  updateTransientEffects(state, delta);
}
