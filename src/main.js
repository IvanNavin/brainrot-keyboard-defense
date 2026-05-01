const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const menu = document.querySelector("#menu");
const startButton = document.querySelector("#start");
const modeSelect = document.querySelector("#mode");
const difficultySelect = document.querySelector("#difficulty");

const STORAGE_KEY = "brainrot-keyboard-defense.stats.v1";
const KEY_IDS = "qwertyuiopasdfghjklzxcvbnm".split("");
const WORDS = ["cat", "run", "dev", "type", "code", "data", "game", "stack", "debug", "pixel"];
const DIFFICULTY = {
  easy: { baseSpeed: 135, speedStep: 13 },
  normal: { baseSpeed: 175, speedStep: 18 },
  hard: { baseSpeed: 230, speedStep: 25 },
};

const state = {
  screen: "menu",
  mode: "classic",
  difficulty: "normal",
  score: 0,
  hp: 3,
  streak: 0,
  level: 0,
  active: null,
  keys: [],
  inputQueue: [],
  particles: [],
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
  const fallback = Object.fromEntries(KEY_IDS.map((key) => [key, { hits: 0, misses: 0 }]));

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries(
      KEY_IDS.map((key) => [key, { hits: parsed[key]?.hits || 0, misses: parsed[key]?.misses || 0 }]),
    );
  } catch {
    return fallback;
  }
}

function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
}

async function loadAssets() {
  const [atlas] = await Promise.all([fetch("./assets/brainrots/spritesheet.json").then((res) => res.json())]);
  const image = new Image();
  image.src = "./assets/brainrots/spritesheet.png";
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
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const keyWidth = Math.min(58, Math.max(30, (width - 48) / 11.2));
  const gap = Math.max(5, keyWidth * 0.13);
  const keyHeight = keyWidth * 0.82;
  const startY = height - keyHeight * 3 - gap * 2 - 42;

  return rows.flatMap((row, rowIndex) => {
    const rowWidth = row.length * keyWidth + (row.length - 1) * gap;
    const y = startY + rowIndex * (keyHeight + gap);
    const offset = rowIndex === 1 ? keyWidth * 0.48 : rowIndex === 2 ? keyWidth * 1.25 : 0;
    const startX = (width - rowWidth) / 2 + offset;

    return row.split("").map((id, index) => ({
      id,
      label: id.toUpperCase(),
      x: startX + index * (keyWidth + gap),
      y,
      width: keyWidth,
      height: keyHeight,
    }));
  });
}

function startGame() {
  if (!state.assets.ready) return;

  state.screen = "playing";
  state.mode = modeSelect.value;
  state.difficulty = difficultySelect.value;
  state.score = 0;
  state.hp = 3;
  state.streak = 0;
  state.level = 0;
  state.active = null;
  state.inputQueue = [];
  state.particles = [];
  state.pressed.clear();
  menu.classList.add("is-hidden");
  spawnBrainrot();
}

function endGame() {
  state.screen = "gameover";
  state.active = null;
  menu.classList.remove("is-hidden");
  startButton.textContent = "Restart defense";
}

function chooseKey() {
  if (state.mode === "classic") return randomItem(KEY_IDS);

  const weights = KEY_IDS.map((key) => {
    const stat = state.stats[key];
    const weakBonus = state.mode === "weak" ? stat.misses * 5 : stat.misses * 2;
    return 1 + weakBonus + Math.max(0, stat.misses - stat.hits);
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let pick = Math.random() * total;

  for (let i = 0; i < KEY_IDS.length; i += 1) {
    pick -= weights[i];
    if (pick <= 0) return KEY_IDS[i];
  }

  return randomItem(KEY_IDS);
}

function createSequence() {
  if (state.mode !== "words") return chooseKey();

  const weakKeys = KEY_IDS.filter((key) => state.stats[key].misses > state.stats[key].hits);
  const candidates = weakKeys.length
    ? WORDS.filter((word) => weakKeys.some((key) => word.includes(key)))
    : WORDS;

  return randomItem(candidates.length ? candidates : WORDS);
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
    if (!target) continue;

    state.stats[key].hits += 1;
    state.score += 1;
    state.streak += 1;
    state.level = Math.floor(state.streak / 10);
    saveStats();

    if (target.progress < target.sequence.length - 1) {
      target.progress += 1;
      target.key = target.sequence[target.progress];
      burst(target.x, target.y, "#b7ff37", 8);
      return;
    }

    burst(target.x, target.y, "#b7ff37", 16);
    state.active.status = "hit";
    state.active = null;
    spawnBrainrot();
  }
}

function update(delta) {
  processInput();

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
      state.stats[state.active.key].misses += 1;
      state.hp -= 1;
      state.streak = 0;
      state.level = 0;
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
}

function draw() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);
  drawArena(width, height);
  drawHud();
  drawBrainrot();
  drawParticles();
  drawKeyboard();
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
  ctx.fillStyle = state.hp <= 1 ? "#ff4d4d" : "#ffb13d";
  ctx.fillText(`HP ${"I".repeat(Math.max(0, state.hp))}`, 24, 62);
  ctx.fillStyle = "#aeb0a7";
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText(`${state.mode.toUpperCase()} / ${state.difficulty.toUpperCase()} / LV ${state.level + 1}`, 24, 86);
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

  ctx.shadowBlur = 0;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.max(18, brainrot.size * 0.38)}px Trebuchet MS`;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#101412";
  ctx.fillStyle = "#f7f3df";

  const label = brainrot.sequence.length === 1
    ? brainrot.key.toUpperCase()
    : `${brainrot.sequence.slice(0, brainrot.progress).toUpperCase()}${brainrot.sequence
        .slice(brainrot.progress)
        .toUpperCase()}`;

  ctx.strokeText(label, brainrot.x, drawY - 12);
  ctx.fillText(label, brainrot.x, drawY - 12);
  ctx.restore();
}

function drawKeyboard() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const key of state.keys) {
    const stat = state.stats[key.id];
    const heat = Math.min(1, stat.misses / Math.max(4, stat.hits + stat.misses));
    const isTarget = state.active?.key === key.id;
    const isPressed = state.pressed.has(key.id);

    ctx.fillStyle = isPressed
      ? "#b7ff37"
      : isTarget
        ? "#29371f"
        : `rgb(${28 + heat * 54}, ${34 - heat * 8}, ${31 - heat * 10})`;
    ctx.strokeStyle = isTarget ? "#b7ff37" : "rgba(247, 243, 223, 0.18)";
    ctx.lineWidth = isTarget ? 2 : 1;
    roundedRect(key.x, key.y, key.width, key.height, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isPressed ? "#11150f" : "#f7f3df";
    ctx.font = `900 ${Math.max(15, key.height * 0.38)}px Trebuchet MS`;
    ctx.fillText(key.label, key.x + key.width / 2, key.y + key.height / 2 + 1);
  }

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

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
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
  const key = event.key.toLowerCase();
  if (KEY_IDS.includes(key)) {
    event.preventDefault();
    state.inputQueue.push(key);
  }

  if (event.key === "Enter" && state.screen !== "playing") startGame();
});

startButton.addEventListener("click", startGame);

resize();
loadAssets()
  .catch((error) => {
    console.error(error);
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
