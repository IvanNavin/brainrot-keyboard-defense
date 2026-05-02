export const STORAGE_KEY = "brainrot-keyboard-defense.state.v2";
export const MAX_WORD_LENGTH = 4;

export const LAYOUTS = {
  en: {
    rows: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    dictionaryPath: "dictionaries/en.json",
  },
  uk: {
    rows: ["йцукенгшщзхї", "фівапролджє", "ячсмитьбю"],
    dictionaryPath: "dictionaries/uk.json",
  },
};

export const ALL_KEY_IDS = [
  ...new Set(Object.values(LAYOUTS).flatMap((layout) => layout.rows.flatMap((row) => row.split("")))),
];

export const PHYSICAL_ROWS = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
];

export const DIFFICULTY = {
  easy: { baseSpeed: 135, speedStep: 13 },
  normal: { baseSpeed: 175, speedStep: 18 },
  hard: { baseSpeed: 230, speedStep: 25 },
};

export const COLORS = {
  ink: "#f7f3df",
  muted: "#aeb0a7",
  acid: "#b7ff37",
  danger: "#ff4d4d",
  amber: "#ffb13d",
  black: "#101412",
  keyBase: "#1c221f",
  keyTarget: "#29371f",
  keyPressedText: "#11150f",
  labelFuture: "#777d74",
  arenaStart: "#111613",
  arenaMiddle: "#172018",
  arenaEnd: "#0d100e",
  shadow: "rgba(0, 0, 0, 0.45)",
  gridLine: "rgba(247, 243, 223, 0.05)",
  floorLine: "rgba(183, 255, 55, 0.08)",
  overlay: "rgba(8, 11, 9, 0.46)",
  flash: "rgba(247, 243, 223, 0.32)",
  doneUnderline: "rgba(183, 255, 55, 0.82)",
  fingers: {
    leftPinky: "#ff6b6b",
    leftRing: "#ffb13d",
    leftMiddle: "#f8e55b",
    leftIndex: "#75df72",
    rightIndex: "#4ecdc4",
    rightMiddle: "#5aa9ff",
    rightRing: "#b786ff",
    rightPinky: "#ff7ad9",
  },
};

export const FINGER_LEGEND = [
  ["LP", "left pinky", COLORS.fingers.leftPinky],
  ["LR", "left ring", COLORS.fingers.leftRing],
  ["LM", "left middle", COLORS.fingers.leftMiddle],
  ["LI", "left index", COLORS.fingers.leftIndex],
  ["RI", "right index", COLORS.fingers.rightIndex],
  ["RM", "right middle", COLORS.fingers.rightMiddle],
  ["RR", "right ring", COLORS.fingers.rightRing],
  ["RP", "right pinky", COLORS.fingers.rightPinky],
];
