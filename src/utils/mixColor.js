import { hexToRgb } from "./hexToRgb.js";

export function mixColor(baseHex, tintHex, amount) {
  const base = hexToRgb(baseHex);
  const tint = hexToRgb(tintHex);
  const mixed = base.map((value, index) => Math.round(value + (tint[index] - value) * amount));
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}
