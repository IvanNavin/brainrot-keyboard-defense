import { LAYOUTS } from "./config.js";
import { normalizeWords } from "./wordLibrary/normalizeWords.js";

export async function loadWordLibrary() {
  const entries = await Promise.all(
    Object.entries(LAYOUTS).map(async ([language, layout]) => {
      const words = await fetch(layout.dictionaryPath).then((res) => res.json());
      return [language, normalizeWords(words)];
    }),
  );

  return Object.fromEntries(entries);
}
