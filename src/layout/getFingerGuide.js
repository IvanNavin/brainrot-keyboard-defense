export function getFingerGuide(index) {
  if (index === 0) return { finger: "LP", color: "#ff6b6b" };
  if (index === 1) return { finger: "LR", color: "#ffb13d" };
  if (index === 2) return { finger: "LM", color: "#f8e55b" };
  if (index <= 5) return { finger: "LI", color: "#75df72" };
  if (index <= 8) return { finger: "RI", color: "#4ecdc4" };
  if (index === 9) return { finger: "RM", color: "#5aa9ff" };
  if (index === 10) return { finger: "RR", color: "#b786ff" };
  return { finger: "RP", color: "#ff7ad9" };
}
