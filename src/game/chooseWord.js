import { randomItem } from "../utils.js";

export function chooseWord(state, keys, preferWeak = false) {
  const words = state.dictionaries[state.language] || [];
  const keySet = new Set(keys);
  const fitting = words.filter((word) => word.split("").every((letter) => keySet.has(letter)));
  const weakKeys = preferWeak
    ? keys.filter((key) => {
        const stat = state.ensureStat(key);
        return stat.misses > stat.hits;
      })
    : [];
  const weakWords = weakKeys.length ? fitting.filter((word) => weakKeys.some((key) => word.includes(key))) : [];

  return randomItem(weakWords.length ? weakWords : fitting.length ? fitting : keys);
}
