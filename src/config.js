export const STORAGE_KEY = "brainrot-keyboard-defense.state.v2";

export const LAYOUTS = {
  en: {
    rows: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    dictionaryPath: "./src/dictionaries/en.json",
  },
  uk: {
    rows: ["йцукенгшщзхї", "фівапролджє", "ячсмитьбю"],
    dictionaryPath: "./src/dictionaries/uk.json",
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

export const FINGER_LEGEND = [
  ["LP", "left pinky", "#ff6b6b"],
  ["LR", "left ring", "#ffb13d"],
  ["LM", "left middle", "#f8e55b"],
  ["LI", "left index", "#75df72"],
  ["RI", "right index", "#4ecdc4"],
  ["RM", "right middle", "#5aa9ff"],
  ["RR", "right ring", "#b786ff"],
  ["RP", "right pinky", "#ff7ad9"],
];
