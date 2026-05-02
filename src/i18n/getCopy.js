import { TRANSLATIONS } from "./translations.js";

export function getCopy(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}
