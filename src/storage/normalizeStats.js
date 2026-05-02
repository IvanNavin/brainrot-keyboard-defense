import { ALL_KEY_IDS } from "../config.js";
import { normalizeStat } from "./normalizeStat.js";

export function normalizeStats(stats) {
  return Object.fromEntries(ALL_KEY_IDS.map((key) => [key, normalizeStat(stats?.[key])]));
}
