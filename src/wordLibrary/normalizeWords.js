import { MAX_WORD_LENGTH } from "../config.js";

export function normalizeWords(words) {
  return [
    ...new Set(
      words
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 1 && word.length <= MAX_WORD_LENGTH),
    ),
  ];
}
