import { currentLayout } from "../layout.js";

export function getProgressionKeys(state) {
  const rows = currentLayout(state).rows.map((row) => row.split(""));
  if (state.mode === "words") return rows.flat();
  if (state.level <= 0) return rows[1] || rows.flat();
  if (state.level === 1) return [...(rows[1] || []), ...(rows[0] || [])];
  return rows.flat();
}
