import { currentLayout } from "./currentLayout.js";

export function currentKeyIds(state) {
  return currentLayout(state).rows.flatMap((row) => row.split(""));
}
