import { chooseKey } from "./chooseKey.js";
import { chooseWord } from "./chooseWord.js";
import { getEligibleKeyIds } from "./getEligibleKeyIds.js";

export function createSequence(state) {
  const keys = getEligibleKeyIds(state);
  if (state.mode !== "words") return chooseKey(state);

  return chooseWord(state, keys, state.mode === "weak");
}
