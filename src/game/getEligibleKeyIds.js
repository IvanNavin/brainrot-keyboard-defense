import { getFocusedKeys } from "./getFocusedKeys.js";
import { getProgressionKeys } from "./getProgressionKeys.js";
import { currentLayout } from "../layout.js";

export function getEligibleKeyIds(state) {
  const rowFocus = state.focus === "top" || state.focus === "home" || state.focus === "bottom";
  const keys = state.focus === "all" || rowFocus ? getProgressionKeys(state) : currentLayout(state).rows.flatMap((row) => row.split(""));
  return getFocusedKeys(state, keys);
}
