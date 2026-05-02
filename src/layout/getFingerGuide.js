import { COLORS } from "../config.js";

export function getFingerGuide(index) {
  if (index === 0) return { finger: "LP", color: COLORS.fingers.leftPinky };
  if (index === 1) return { finger: "LR", color: COLORS.fingers.leftRing };
  if (index === 2) return { finger: "LM", color: COLORS.fingers.leftMiddle };
  if (index <= 5) return { finger: "LI", color: COLORS.fingers.leftIndex };
  if (index <= 8) return { finger: "RI", color: COLORS.fingers.rightIndex };
  if (index === 9) return { finger: "RM", color: COLORS.fingers.rightMiddle };
  if (index === 10) return { finger: "RR", color: COLORS.fingers.rightRing };
  return { finger: "RP", color: COLORS.fingers.rightPinky };
}
