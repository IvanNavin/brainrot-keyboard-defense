const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const menu = document.querySelector("#menu");
const menuBackdrop = document.querySelector("#menuBackdrop");
const menuTitle = document.querySelector("#menuTitle");
const menuResult = document.querySelector("#menuResult");
const startButton = document.querySelector("#start");
const languageSelect = document.querySelector("#language");
const modeSelect = document.querySelector("#mode");
const difficultySelect = document.querySelector("#difficulty");
const targetHighlightInput = document.querySelector("#targetHighlight");

const STORAGE_KEY = "brainrot-keyboard-defense.stats.v1";
const BEST_SCORE_KEY = "brainrot-keyboard-defense.best-score.v1";
const LAYOUTS = {
  en: {
    rows: ["qwertyuiop", "asdfghjkl", "zxcvbnm"],
    words: ["cat", "run", "dev", "type", "code", "data", "game", "stack", "debug", "pixel"],
  },
  uk: {
    rows: ["йцукенгшщзхї", "фівапролджє", "ячсмитьбю"],
    words: ["кіт", "дім", "код", "гра", "мова", "тип", "дані", "ліс", "сон", "друк"],
  },
};
const ALL_KEY_IDS = [...new Set(Object.values(LAYOUTS).flatMap((layout) => layout.rows.flatMap((row) => row.split(""))))];
const PHYSICAL_ROWS = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
];
const DIFFICULTY = {
  easy: { baseSpeed: 135, speedStep: 13 },
  normal: { baseSpeed: 175, speedStep: 18 },
  hard: { baseSpeed: 230, speedStep: 25 },
};
const FINGER_LEGEND = [
  ["LP", "left pinky", "#ff6b6b"],
  ["LR", "left ring", "#ffb13d"],
  ["LM", "left middle", "#f8e55b"],
  ["LI", "left index", "#75df72"],
  ["RI", "right index", "#4ecdc4"],
  ["RM", "right middle", "#5aa9ff"],
  ["RR", "right ring", "#b786ff"],
  ["RP", "right pinky", "#ff7ad9"],
];

const state = {
  screen: "menu",
  language: "en",
  mode: "classic",
  difficulty: "normal",
  highlightTarget: false,
  score: 0,
  bestScore: loadBestScore(),
  isNewBest: false,
  hp: 3,
  streak: 0,
  totalHits: 0,
  level: 0,
  active: null,
  keys: [],
  inputQueue: [],
  particles: [],
  shots: [],
  fragments: [],
  shockwaves: [],
  pressed: new Map(),
  stats: loadStats(),
  assets: {
    image: null,
    frames: [],
    ready: false,
  },
  lastTime: performance.now(),
};

function loadStats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries(ALL_KEY_IDS.map((key) => [key, normalizeStat(parsed[key])]));
  } catch {
    return Object.fromEntries(ALL_KEY_IDS.map((key) => [key, { hits: 0, misses: 0 }]));
  }
}

function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
}

function loadBestScore() {
  return Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0", 10) || 0;
}

function saveBestScore() {
  localStorage.setItem(BEST_SCORE_KEY, String(state.bestScore));
}

function updateBestScore() {
  if (state.score <= state.bestScore) return;

  state.bestScore = state.score;
  state.isNewBest = true;
  saveBestScore();
}

function normalizeStat(stat) {
  return { hits: stat?.hits || 0, misses: stat?.misses || 0 };
}

function ensureStat(key) {
  if (!state.stats[key]) state.stats[key] = { hits: 0, misses: 0 };
  return state.stats[key];
}

function currentLayout() {
  return LAYOUTS[state.language] || LAYOUTS.en;
}

function currentKeyIds() {
  return currentLayout().rows.flatMap((row) => row.split(""));
}

function keyFromEvent(event) {
  const directKey = event.key.toLowerCase();
  const keys = currentKeyIds();
  if (keys.includes(directKey)) return directKey;

  const rows = currentLayout().rows;
  for (let rowIndex = 0; rowIndex < PHYSICAL_ROWS.length; rowIndex += 1) {
    const columnIndex = PHYSICAL_ROWS[rowIndex].indexOf(event.code);
    if (columnIndex === -1) continue;

    return rows[rowIndex]?.[columnIndex] || "";
  }

  return "";
}

function getFingerGuide(index) {
  if (index === 0) return { finger: "LP", color: "#ff6b6b" };
  if (index === 1) return { finger: "LR", color: "#ffb13d" };
  if (index === 2) return { finger: "LM", color: "#f8e55b" };
  if (index <= 5) return { finger: "LI", color: "#75df72" };
  if (index <= 8) return { finger: "RI", color: "#4ecdc4" };
  if (index === 9) return { finger: "RM", color: "#5aa9ff" };
  if (index === 10) return { finger: "RR", color: "#b786ff" };
  return { finger: "RP", color: "#ff7ad9" };
}

async function loadAssets() {
  const [atlas] = await Promise.all([fetch("./assets/brainrots/spritesheet-runtime.json").then((res) => res.json())]);
  const image = new Image();
  image.src = "./assets/brainrots/spritesheet-runtime.png";
  await image.decode();

  state.assets.image = image;
  state.assets.frames = Object.values(atlas.frames).map((entry) => entry.frame);
  state.assets.ready = true;
}

function resize() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.keys = buildKeyboard(window.innerWidth, window.innerHeight);
}

function buildKeyboard(width, height) {
  const rows = currentLayout().rows;
  const longestRow = Math.max(...rows.map((row) => row.length));
  const keyWidth = Math.min(58, Math.max(28, (width - 48) / (longestRow + 1.2)));
  const gap = Math.max(5, keyWidth * 0.13);
  const keyHeight = keyWidth * 0.82;
  const step = keyWidth + gap;
  const topRowWidth = rows[0].length * keyWidth + (rows[0].length - 1) * gap;
  const baseX = (width - topRowWidth) / 2;
  const rowOffsets = [0, 20, 40];
  const startY = height - keyHeight * 3 - gap * 2 - 42;

  return rows.flatMap((row, rowIndex) => {
    const y = startY + rowIndex * (keyHeight + gap);
    const startX = baseX + rowOffsets[rowIndex];

    return row.split("").map((id, index) => ({
      id,
      label: id.toUpperCase(),
      x: startX + index * (keyWidth + gap),
      y,
      width: keyWidth,
      height: keyHeight,
      guide: getFingerGuide(index),
    }));
  });
}

function startGame() {
  if (!state.assets.ready) return;

  state.screen = "playing";
  state.language = languageSelect.value;
  state.mode = modeSelect.value;
  state.difficulty = difficultySelect.value;
  state.highlightTarget = targetHighlightInput.checked;
  state.score = 0;
  state.isNewBest = false;
  state.hp = 3;
  state.streak = 0;
  state.totalHits = 0;
  state.level = 0;
  state.active = null;
  state.inputQueue = [];
  state.particles = [];
  state.shots = [];
  state.fragments = [];
  state.shockwaves = [];
  state.pressed.clear();
  menuTitle.textContent = "Brainrot Keyboard Defense";
  menuResult.classList.add("is-hidden");
  menuResult.classList.remove("is-record");
  menuResult.textContent = "";
  menu.classList.add("is-hidden");
  menuBackdrop.classList.add("is-hidden");
  resize();
  spawnBrainrot();
}

function endGame() {
  state.screen = "gameover";
  state.active = null;
  menuTitle.textContent = "Game Over";
  menuResult.textContent = state.isNewBest
    ? `New best ${state.bestScore} / Level ${state.level + 1}`
    : `Score ${state.score} / Best ${state.bestScore} / Level ${state.level + 1}`;
  menuResult.classList.toggle("is-record", state.isNewBest);
  menuResult.classList.remove("is-hidden");
  menu.classList.remove("is-hidden");
  menuBackdrop.classList.remove("is-hidden");
  startButton.textContent = "Restart defense";
}

function togglePause() {
  if (state.screen === "playing") {
    state.screen = "paused";
    return;
  }

  if (state.screen === "paused") {
    state.screen = "playing";
  }
}

function chooseKey() {
  const keys = currentKeyIds();
  if (state.mode === "classic") return randomItem(keys);

  const weights = keys.map((key) => {
    const stat = ensureStat(key);
    const weakBonus = state.mode === "weak" ? stat.misses * 5 : stat.misses * 2;
    return 1 + weakBonus + Math.max(0, stat.misses - stat.hits);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let pick = Math.random() * total;

  for (let i = 0; i < keys.length; i += 1) {
    pick -= weights[i];
    if (pick <= 0) return keys[i];
  }

  return randomItem(keys);
}

function createSequence() {
  if (state.mode !== "words") return chooseKey();

  const keys = currentKeyIds();
  const words = currentLayout().words;
  const weakKeys = keys.filter((key) => {
    const stat = ensureStat(key);
    return stat.misses > stat.hits;
  });
  const candidates = weakKeys.length
    ? words.filter((word) => weakKeys.some((key) => word.includes(key)))
    : words;

  return randomItem(candidates.length ? candidates : words);
}

function spawnBrainrot() {
  const sequence = createSequence();
  const key = sequence[0];
  const keyboardKey = getKey(key);
  const size = keyboardKey.height * 1.08;
  const speedConfig = DIFFICULTY[state.difficulty];

  state.active = {
    id: crypto.randomUUID(),
    key,
    sequence,
    progress: 0,
    x: keyboardKey.x + keyboardKey.width / 2,
    y: -size - 20,
    speed: speedConfig.baseSpeed + state.level * speedConfig.speedStep,
    status: "falling",
    frame: randomItem(state.assets.frames),
    size,
    wobble: Math.random() * Math.PI * 2,
  };
}

function getKey(id) {
  return state.keys.find((key) => key.id === id);
}

function processInput() {
  while (state.inputQueue.length) {
    const key = state.inputQueue.shift();
    const falling = state.active?.status === "falling" ? [state.active] : [];
    const target = falling
      .filter((brainrot) => brainrot.key === key)
      .sort((a, b) => b.y - a.y)[0];

    state.pressed.set(key, 120);
    fireShot(key, target);
    if (!target) continue;

    ensureStat(key).hits += 1;
    state.score += 1;
    updateBestScore();
    state.streak += 1;
    state.totalHits += 1;
    state.level = Math.floor(state.totalHits / 10);
    saveStats();

    if (target.progress < target.sequence.length - 1) {
      target.progress += 1;
      target.key = target.sequence[target.progress];
      burst(target.x, target.y, "#b7ff37", 8);
      return;
    }

    shatterBrainrot(target);
    burst(target.x, target.y, "#b7ff37", 22);
    state.active.status = "hit";
    state.active = null;
    spawnBrainrot();
  }
}

function update(delta) {
  if (state.screen === "playing") processInput();

  for (const [key, ttl] of state.pressed) {
    const next = ttl - delta * 1000;
    if (next <= 0) state.pressed.delete(key);
    else state.pressed.set(key, next);
  }

  if (state.screen === "playing" && state.active) {
    const target = getKey(state.active.key);
    const targetX = target.x + target.width / 2;
    state.active.x += (targetX - state.active.x) * Math.min(1, delta * 9);
    state.active.y += state.active.speed * delta;
    state.active.wobble += delta * 5;

    if (state.active.y + state.active.size / 2 >= target.y) {
      ensureStat(state.active.key).misses += 1;
      state.hp -= 1;
      state.streak = 0;
      saveStats();
      burst(targetX, target.y, "#ff4d4d", 18);
      state.active.status = "missed";
      state.active = null;

      if (state.hp <= 0) endGame();
      else spawnBrainrot();
    }
  }

  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * delta,
      y: particle.y + particle.vy * delta,
      vy: particle.vy + 240 * delta,
      life: particle.life - delta,
    }))
    .filter((particle) => particle.life > 0);

  state.shots = state.shots
    .map((shot) => ({ ...shot, life: shot.life - delta }))
    .filter((shot) => shot.life > 0);

  state.fragments = state.fragments
    .map((fragment) => ({
      ...fragment,
      x: fragment.x + fragment.vx * delta,
      y: fragment.y + fragment.vy * delta,
      vy: fragment.vy + 360 * delta,
      rotation: fragment.rotation + fragment.spin * delta,
      life: fragment.life - delta,
    }))
    .filter((fragment) => fragment.life > 0);

  state.shockwaves = state.shockwaves
    .map((shockwave) => ({ ...shockwave, life: shockwave.life - delta }))
    .filter((shockwave) => shockwave.life > 0);
}

function draw() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  drawArena(width, height);
  drawHud();
  drawKeyboard();
  drawShots();
  drawBrainrot();
  drawFragments();
  drawShockwaves();
  drawParticles();
  drawStatusOverlay();
}

function drawArena(width, height) {
  const floorY = state.keys[0]?.y - 28 || height - 220;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#111613");
  gradient.addColorStop(0.55, "#172018");
  gradient.addColorStop(1, "#0d100e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(247, 243, 223, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 38) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(183, 255, 55, 0.08)";
  ctx.fillRect(0, floorY, width, 2);
}

function drawHud() {
  ctx.save();
  ctx.fillStyle = "#f7f3df";
  ctx.font = "800 18px Trebuchet MS";
  ctx.fillText(`SCORE ${state.score}`, 24, 34);
  ctx.fillStyle = state.isNewBest ? "#b7ff37" : "#aeb0a7";
  ctx.fillText(`BEST ${state.bestScore}`, 24, 58);
  ctx.fillStyle = state.hp <= 1 ? "#ff4d4d" : "#ffb13d";
  ctx.fillText(`HP ${"I".repeat(Math.max(0, state.hp))}`, 24, 82);
  ctx.fillStyle = "#aeb0a7";
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText(`${state.language.toUpperCase()} / ${state.mode.toUpperCase()} / ${state.difficulty.toUpperCase()} / LV ${state.level + 1}`, 24, 106);
  ctx.fillText("ESC PAUSE", 24, 130);
  ctx.restore();
}

function drawBrainrot() {
  const brainrot = state.active;
  if (!brainrot || !state.assets.ready) return;

  const { frame } = brainrot;
  const bob = Math.sin(brainrot.wobble) * 4;
  const drawX = brainrot.x - brainrot.size / 2;
  const drawY = brainrot.y - brainrot.size / 2 + bob;

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 14;
  ctx.drawImage(
    state.assets.image,
    frame.x,
    frame.y,
    frame.w,
    frame.h,
    drawX,
    drawY,
    brainrot.size,
    brainrot.size,
  );

  drawBrainrotLabel(brainrot, drawY + brainrot.size + 12);
  ctx.restore();
}

function drawBrainrotLabel(brainrot, y) {
  const letters = brainrot.sequence.toUpperCase().split("");
  const fontSize = Math.max(18, brainrot.size * 0.38);

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${fontSize}px Trebuchet MS`;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 0;

  const widths = letters.map((letter) => ctx.measureText(letter).width);
  const gap = brainrot.sequence.length > 1 ? Math.max(2, fontSize * 0.08) : 0;
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (letters.length - 1);
  let x = brainrot.x - totalWidth / 2;

  letters.forEach((letter, index) => {
    const isDone = brainrot.sequence.length > 1 && index < brainrot.progress;
    const isCurrent = index === brainrot.progress;
    const fill = isDone ? "#b7ff37" : isCurrent ? "#f7f3df" : "#777d74";

    ctx.strokeStyle = "#101412";
    ctx.fillStyle = fill;
    ctx.strokeText(letter, x, y);
    ctx.fillText(letter, x, y);

    if (isDone) {
      ctx.strokeStyle = "rgba(183, 255, 55, 0.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + fontSize * 0.34);
      ctx.lineTo(x + widths[index], y + fontSize * 0.34);
      ctx.stroke();
      ctx.lineWidth = 5;
    }

    x += widths[index] + gap;
  });

  ctx.restore();
}

function drawKeyboard() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawFingerLegend();

  for (const key of state.keys) {
    const stat = ensureStat(key.id);
    const guide = key.guide;
    const heat = Math.min(1, stat.misses / Math.max(4, stat.hits + stat.misses));
    const isTarget = state.highlightTarget && state.active?.key === key.id;
    const isPressed = state.pressed.has(key.id);

    ctx.fillStyle = isPressed
      ? "#b7ff37"
      : isTarget
        ? "#29371f"
        : mixColor("#1c221f", guide.color, 0.24 + heat * 0.16);
    ctx.strokeStyle = isTarget ? "#b7ff37" : withAlpha(guide.color, 0.72);
    ctx.lineWidth = isTarget ? 2 : 1;
    roundedRect(key.x, key.y, key.width, key.height, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPressed ? "#11150f" : "#f7f3df";
    ctx.font = `900 ${Math.max(15, key.height * 0.38)}px Trebuchet MS`;
    ctx.fillText(key.label, key.x + key.width / 2, key.y + key.height / 2 + 1);

    ctx.fillStyle = isPressed ? "#11150f" : withAlpha(guide.color, 0.95);
    ctx.font = `800 ${Math.max(8, key.height * 0.18)}px Trebuchet MS`;
    ctx.fillText(guide.finger, key.x + key.width / 2, key.y + key.height - 9);
  }

  ctx.restore();
}

function drawShots() {
  ctx.save();
  ctx.lineCap = "round";

  for (const shot of state.shots) {
    const progress = 1 - shot.life / shot.maxLife;
    const alpha = Math.max(0, shot.life / shot.maxLife);
    const headX = shot.x1 + (shot.x2 - shot.x1) * Math.min(1, progress * 1.25);
    const headY = shot.y1 + (shot.y2 - shot.y1) * Math.min(1, progress * 1.25);
    const tailX = shot.x1 + (shot.x2 - shot.x1) * Math.max(0, progress * 1.25 - 0.22);
    const tailY = shot.y1 + (shot.y2 - shot.y1) * Math.max(0, progress * 1.25 - 0.22);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shot.hit ? "#b7ff37" : "#ff4d4d";
    ctx.lineWidth = shot.hit ? 4 : 3;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(headX, headY);
    ctx.stroke();

    ctx.fillStyle = "#f7f3df";
    ctx.beginPath();
    ctx.arc(headX, headY, shot.hit ? 4 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFragments() {
  if (!state.assets.ready) return;

  ctx.save();
  for (const fragment of state.fragments) {
    const alpha = Math.max(0, fragment.life / fragment.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(fragment.x, fragment.y);
    ctx.rotate(fragment.rotation);
    ctx.drawImage(
      state.assets.image,
      fragment.sx,
      fragment.sy,
      fragment.sw,
      fragment.sh,
      -fragment.size / 2,
      -fragment.size / 2,
      fragment.size,
      fragment.size,
    );
    ctx.restore();
  }
  ctx.restore();
}

function drawShockwaves() {
  ctx.save();
  for (const shockwave of state.shockwaves) {
    const progress = 1 - shockwave.life / shockwave.maxLife;
    const alpha = Math.max(0, shockwave.life / shockwave.maxLife);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = shockwave.color;
    ctx.lineWidth = 5 * alpha;
    ctx.shadowColor = shockwave.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, shockwave.radius + progress * shockwave.grow, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = withAlpha("#f7f3df", alpha * 0.32);
    ctx.beginPath();
    ctx.arc(shockwave.x, shockwave.y, Math.max(1, shockwave.radius * (1 - progress)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFingerLegend() {
  if (!state.keys.length) return;

  const firstKey = state.keys[0];
  const y = firstKey.y - 26;
  let x = firstKey.x;
  const isCompact = window.innerWidth < 760;

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "800 10px Trebuchet MS";

  for (const [code, label, color] of FINGER_LEGEND) {
    ctx.fillStyle = color;
    roundedRect(x, y - 6, 10, 10, 3);
    ctx.fill();
    ctx.fillStyle = "#aeb0a7";
    ctx.fillText(isCompact ? code : `${code} ${label}`, x + 14, y);
    x += isCompact ? 54 : Math.min(112, Math.max(78, window.innerWidth / 9.8));
  }

  ctx.restore();
}

function drawStatusOverlay() {
  if (state.screen !== "paused" && state.screen !== "gameover") return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const title = state.screen === "paused" ? "Paused" : "Game Over";
  const subtitle = state.screen === "paused" ? "Press Esc to keep defending" : `Score ${state.score}`;

  ctx.save();
  ctx.fillStyle = "rgba(8, 11, 9, 0.46)";
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f7f3df";
  ctx.font = "900 52px Georgia";
  ctx.fillText(title, width / 2, height * 0.32);
  ctx.fillStyle = "#ffb13d";
  ctx.font = "900 18px Trebuchet MS";
  ctx.fillText(subtitle.toUpperCase(), width / 2, height * 0.32 + 48);
  ctx.restore();
}

function drawParticles() {
  ctx.save();
  for (const particle of state.particles) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function roundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const force = 80 + Math.random() * 190;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * force,
      vy: Math.sin(angle) * force,
      size: 2 + Math.random() * 4,
      color,
      life: 0.28 + Math.random() * 0.36,
      maxLife: 0.64,
    });
  }
}

function fireShot(keyId, target) {
  const key = getKey(keyId);
  if (!key) return;

  const originX = key.x + key.width / 2;
  const originY = key.y + 6;
  const missDrift = keyId.charCodeAt(0) % 2 === 0 ? -72 : 72;
  const destinationX = target ? target.x : (state.active?.x || originX) + missDrift;
  const destinationY = target ? target.y : Math.max(54, (state.active?.y || originY - 240) - 60);

  state.shots.push({
    x1: originX,
    y1: originY,
    x2: destinationX,
    y2: destinationY,
    hit: Boolean(target),
    life: 0.22,
    maxLife: 0.22,
  });
}

function shatterBrainrot(brainrot) {
  const cols = 3;
  const rows = 3;
  const pieceSize = brainrot.size / cols;

  state.shockwaves.push({
    x: brainrot.x,
    y: brainrot.y,
    radius: brainrot.size * 0.24,
    grow: brainrot.size * 1.35,
    color: "#b7ff37",
    life: 0.34,
    maxLife: 0.34,
  });

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const angle = Math.atan2(row - 1, col - 1) + (Math.random() - 0.5) * 0.9;
      const force = 95 + Math.random() * 210;
      state.fragments.push({
        sx: brainrot.frame.x + (brainrot.frame.w / cols) * col,
        sy: brainrot.frame.y + (brainrot.frame.h / rows) * row,
        sw: brainrot.frame.w / cols,
        sh: brainrot.frame.h / rows,
        x: brainrot.x + (col - 1) * pieceSize * 0.45,
        y: brainrot.y + (row - 1) * pieceSize * 0.45,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 80,
        rotation: Math.random() * Math.PI,
        spin: -8 + Math.random() * 16,
        size: pieceSize,
        life: 0.62,
        maxLife: 0.62,
      });
    }
  }
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function mixColor(baseHex, tintHex, amount) {
  const base = hexToRgb(baseHex);
  const tint = hexToRgb(tintHex);
  const mixed = base.map((value, index) => Math.round(value + (tint[index] - value) * amount));
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function loop(now) {
  const delta = Math.min(0.033, (now - state.lastTime) / 1000);
  state.lastTime = now;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    togglePause();
    return;
  }

  const key = keyFromEvent(event);
  if (state.screen === "playing" && key) {
    event.preventDefault();
    state.inputQueue.push(key);
  }

  if (event.key === "Enter" && state.screen !== "playing" && state.screen !== "paused") startGame();
});

languageSelect.addEventListener("change", () => {
  if (state.screen === "playing" || state.screen === "paused") return;

  state.language = languageSelect.value;
  resize();
});

startButton.addEventListener("click", startGame);

resize();
loadAssets()
  .catch((error) => {
    console.error("Brainrot atlas failed to load", error);
  })
  .finally(() => {
    if (state.assets.ready) {
      startButton.disabled = false;
      startButton.textContent = "Start defense";
    } else {
      startButton.textContent = "Brainrots failed to load";
    }

    requestAnimationFrame(loop);
  });
