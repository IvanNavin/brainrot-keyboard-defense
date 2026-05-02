import { LAYOUTS, PHYSICAL_ROWS } from "./config.js";

export function currentLayout(state) {
  return LAYOUTS[state.language] || LAYOUTS.en;
}

export function currentKeyIds(state) {
  return currentLayout(state).rows.flatMap((row) => row.split(""));
}

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

export function buildKeyboard(width, height, state) {
  const rows = currentLayout(state).rows;
  const longestRow = Math.max(...rows.map((row) => row.length));
  const keyWidth = Math.min(58, Math.max(28, (width - 48) / (longestRow + 1.2)));
  const gap = Math.max(5, keyWidth * 0.13);
  const keyHeight = keyWidth * 0.82;
  const step = keyWidth + gap;
  const topRowWidth = rows[0].length * keyWidth + (rows[0].length - 1) * gap;
  const baseX = (width - topRowWidth) / 2;
  const rowOffsets = [0, 20, 40];
  const startY = height - keyHeight * 3 - gap * 2 - 42;

  return rows.flatMap((row, rowIndex) => {
    const y = startY + rowIndex * (keyHeight + gap);
    const startX = baseX + rowOffsets[rowIndex];

    return row.split("").map((id, index) => ({
      id,
      label: id.toUpperCase(),
      x: startX + index * step,
      y,
      width: keyWidth,
      height: keyHeight,
      guide: getFingerGuide(index),
    }));
  });
}

function getFingerGuide(index) {
  if (index === 0) return { finger: "LP", color: "#ff6b6b" };
  if (index === 1) return { finger: "LR", color: "#ffb13d" };
  if (index === 2) return { finger: "LM", color: "#f8e55b" };
  if (index <= 5) return { finger: "LI", color: "#75df72" };
  if (index <= 8) return { finger: "RI", color: "#4ecdc4" };
  if (index === 9) return { finger: "RM", color: "#5aa9ff" };
  if (index === 10) return { finger: "RR", color: "#b786ff" };
  return { finger: "RP", color: "#ff7ad9" };
}
