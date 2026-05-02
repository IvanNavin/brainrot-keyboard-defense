import { PHYSICAL_ROWS } from "../config.js";
import { currentKeyIds } from "./currentKeyIds.js";
import { currentLayout } from "./currentLayout.js";

export function keyFromEvent(event, state) {
  const directKey = event.key.toLowerCase();
  const keys = currentKeyIds(state);
  if (keys.includes(directKey)) return directKey;

  const rows = currentLayout(state).rows;
  for (let rowIndex = 0; rowIndex < PHYSICAL_ROWS.length; rowIndex += 1) {
    const columnIndex = PHYSICAL_ROWS[rowIndex].indexOf(event.code);
    if (columnIndex === -1) continue;

    return rows[rowIndex]?.[columnIndex] || "";
  }

  return "";
}
