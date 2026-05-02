import { COMBO_TIERS } from "../config.js";

export function getMultiplier(streak) {
  return COMBO_TIERS.find((tier) => streak >= tier.streak)?.multiplier || 1;
}
