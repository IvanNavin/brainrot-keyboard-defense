export function getFocusedKeys(state, keys) {
  if (state.focus === "all") return keys;
  if (state.focus === "top" || state.focus === "home" || state.focus === "bottom") {
    const rowIndex = { top: 0, home: 1, bottom: 2 }[state.focus];
    const filtered = keys.filter((key) => state.keys.some((item) => item.id === key && item.rowIndex === rowIndex));
    return filtered.length ? filtered : keys;
  }

  const focused = state.keys.filter((key) => key.guide.finger === state.focus).map((key) => key.id);
  const focusedSet = new Set(focused);
  const filtered = keys.filter((key) => focusedSet.has(key));

  return filtered.length ? filtered : keys;
}
