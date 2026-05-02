import { LAYOUTS } from "../config.js";

export function currentLayout(state) {
  return LAYOUTS[state.language] || LAYOUTS.en;
}
