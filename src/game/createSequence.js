import { currentKeyIds, currentLayout } from "../layout.js";
import { randomItem } from "../utils.js";
import { chooseKey } from "./chooseKey.js";

export function createSequence(state) {
  if (state.mode !== "words") return chooseKey(state);

  const keys = currentKeyIds(state);
  const words = state.dictionaries[state.language] || currentLayout(state).words || [];
  const weakKeys = keys.filter((key) => {
    const stat = state.ensureStat(key);
    return stat.misses > stat.hits;
  });
  const candidates = weakKeys.length ? words.filter((word) => weakKeys.some((key) => word.includes(key))) : words;

  return randomItem(candidates.length ? candidates : words);
}
