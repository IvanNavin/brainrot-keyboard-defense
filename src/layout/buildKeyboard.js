import { currentLayout } from "./currentLayout.js";
import { getFingerGuide } from "./getFingerGuide.js";

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
      rowIndex,
      x: startX + index * step,
      y,
      width: keyWidth,
      height: keyHeight,
      guide: getFingerGuide(index, id, state.language),
    }));
  });
}
