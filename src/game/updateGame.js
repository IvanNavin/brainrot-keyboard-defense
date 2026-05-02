import { updateActiveBrainrot } from "./updateActiveBrainrot.js";
import { updatePressedKeys } from "./updatePressedKeys.js";
import { updateTransientEffects } from "./updateTransientEffects.js";

export function updateGame(context, delta) {
  const { state } = context;
  if (state.screen === "playing") context.processInput();

  updatePressedKeys(state, delta);
  updateActiveBrainrot(context, delta);
  updateTransientEffects(state, delta);
}
