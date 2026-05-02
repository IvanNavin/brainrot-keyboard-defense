import { randomItem } from "../utils.js";
import { getEligibleKeyIds } from "./getEligibleKeyIds.js";

export function chooseKey(state) {
  const keys = getEligibleKeyIds(state);
  if (state.mode === "classic") return randomItem(keys);

  const weights = keys.map((key) => {
    const stat = state.ensureStat(key);
    const weakBonus = state.mode === "weak" ? stat.misses * 5 : stat.misses * 2;
    return 1 + weakBonus + Math.max(0, stat.misses - stat.hits);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let pick = Math.random() * total;

  for (let i = 0; i < keys.length; i += 1) {
    pick -= weights[i];
    if (pick <= 0) return keys[i];
  }

  return randomItem(keys);
}
