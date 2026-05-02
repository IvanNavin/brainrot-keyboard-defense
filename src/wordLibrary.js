import { LAYOUTS, MAX_WORD_LENGTH } from "./config.js";

export async function loadWordLibrary() {
  const entries = await Promise.all(
    Object.entries(LAYOUTS).map(async ([language, layout]) => {
      const words = await fetch(layout.dictionaryPath).then((res) => res.json());
      return [language, normalizeWords(words)];
    }),
  );

  return Object.fromEntries(entries);
}

function normalizeWords(words) {
  return [
    ...new Set(
      words
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 1 && word.length <= MAX_WORD_LENGTH),
    ),
  ];
}
