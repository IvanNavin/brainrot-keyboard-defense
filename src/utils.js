export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function mixColor(baseHex, tintHex, amount) {
  const base = hexToRgb(baseHex);
  const tint = hexToRgb(tintHex);
  const mixed = base.map((value, index) => Math.round(value + (tint[index] - value) * amount));
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

export function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}
