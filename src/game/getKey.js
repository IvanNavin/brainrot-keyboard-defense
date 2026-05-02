export function getKey(state, id) {
  return state.keys.find((key) => key.id === id);
}
