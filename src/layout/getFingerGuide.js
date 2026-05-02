import { COLORS } from "../config.js";

const FINGER_COLORS = {
  LP: COLORS.fingers.leftPinky,
  LR: COLORS.fingers.leftRing,
  LM: COLORS.fingers.leftMiddle,
  LI: COLORS.fingers.leftIndex,
  RI: COLORS.fingers.rightIndex,
  RM: COLORS.fingers.rightMiddle,
  RR: COLORS.fingers.rightRing,
  RP: COLORS.fingers.rightPinky,
};

const UK_FINGER_BY_KEY = {
  й: "LP",
  ф: "LP",
  я: "LP",
  ц: "LR",
  і: "LR",
  ч: "LR",
  у: "LM",
  в: "LM",
  с: "LM",
  к: "LI",
  е: "LI",
  а: "LI",
  п: "LI",
  м: "LI",
  и: "LI",
  н: "RI",
  р: "RI",
  т: "RI",
  г: "RI",
  о: "RI",
  ь: "RI",
  ш: "RM",
  л: "RM",
  б: "RM",
  щ: "RR",
  д: "RR",
  ю: "RR",
  з: "RP",
  ж: "RP",
  х: "RP",
  є: "RP",
  ї: "RP",
};

export function getFingerGuide(index, keyId, language) {
  const ukFinger = language === "uk" ? UK_FINGER_BY_KEY[keyId] : null;
  if (ukFinger) return { finger: ukFinger, color: FINGER_COLORS[ukFinger] };

  if (index === 0) return { finger: "LP", color: COLORS.fingers.leftPinky };
  if (index === 1) return { finger: "LR", color: COLORS.fingers.leftRing };
  if (index === 2) return { finger: "LM", color: COLORS.fingers.leftMiddle };
  if (index <= 5) return { finger: "LI", color: COLORS.fingers.leftIndex };
  if (index <= 8) return { finger: "RI", color: COLORS.fingers.rightIndex };
  if (index === 9) return { finger: "RM", color: COLORS.fingers.rightMiddle };
  if (index === 10) return { finger: "RR", color: COLORS.fingers.rightRing };
  return { finger: "RP", color: COLORS.fingers.rightPinky };
}
