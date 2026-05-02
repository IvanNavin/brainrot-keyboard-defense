import { updateActiveBrainrot } from "./updateActiveBrainrot.js";
import { updatePressedKeys } from "./updatePressedKeys.js";
import { updateRestartGate } from "./updateRestartGate.js";
import { updateTransientEffects } from "./updateTransientEffects.js";

export function updateGame(context, delta) {
  const { state } = context;
  if (state.screen === "playing") context.processInput();

  updatePressedKeys(state, delta);
  updateActiveBrainrot(context, delta);
  updateRestartGate(context);
  updateTransientEffects(state, delta);
}
