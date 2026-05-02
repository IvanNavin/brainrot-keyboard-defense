import { getCopy } from "../i18n.js";

export function formatGameSummary(state) {
  const copy = getCopy(state.siteLanguage);
  const summary = state.lastSummary;
  if (!summary) return "";

  const weakKeys = summary.weakKeys.length ? summary.weakKeys.join(" ") : copy.noWeakKeys;
  const prefix = summary.isNewBest ? `${copy.newBest} ${summary.bestScore}` : `${copy.score} ${summary.score}`;

  return `${prefix} / ${copy.best} ${summary.bestScore} / ${copy.level} ${summary.level}
${copy.accuracy} ${summary.accuracy}% / ${copy.kpm} ${summary.keysPerMinute} / ${copy.bestStreak} ${summary.bestStreak}
${copy.weakKeys}: ${weakKeys}`;
}
