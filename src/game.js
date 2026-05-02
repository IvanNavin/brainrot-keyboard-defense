import { DIFFICULTY } from "./config.js";
import { burst, fireShot, shatterBrainrot } from "./effects.js";
import { buildKeyboard, currentKeyIds, currentLayout, keyFromEvent } from "./layout.js";
import { draw } from "./renderer.js";
import { loadPersistedState, savePersistedState } from "./storage.js";
import { randomItem } from "./utils.js";

export function createGame({ canvas, ctx, elements }) {
  const persisted = loadPersistedState();
  const state = {
    screen: "menu",
    language: persisted.settings.language,
    mode: persisted.settings.mode,
    difficulty: persisted.settings.difficulty,
    highlightTarget: persisted.settings.highlightTarget,
    score: 0,
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
    dictionaries: {},
    assets: { image: null, frames: [], ready: false },
    lastTime: performance.now(),
    persisted,
    ensureStat,
  };

  async function init(assets) {
    state.assets = assets;
    await loadDictionaries();
    applySettingsToMenu();
    restoreLastRun();
    resize();
    updateMenuForScreen();
    elements.startButton.disabled = false;
    elements.startButton.textContent = state.screen === "menu" ? "Start defense" : "Resume defense";
  }

  async function loadDictionaries() {
    const entries = await Promise.all(
      Object.entries({ en: "./src/dictionaries/en.json", uk: "./src/dictionaries/uk.json" }).map(
        async ([language, path]) => [language, await fetch(path).then((res) => res.json())],
      ),
    );
    state.dictionaries = Object.fromEntries(entries);
  }

  function applySettingsToMenu() {
    elements.languageSelect.value = state.language;
    elements.modeSelect.value = state.mode;
    elements.difficultySelect.value = state.difficulty;
    elements.targetHighlightInput.checked = state.highlightTarget;
  }

  function restoreLastRun() {
    const lastRun = state.persisted.lastRun;
    if (!lastRun || lastRun.screen === "menu" || lastRun.screen === "gameover") return;

    Object.assign(state, {
      ...lastRun,
      screen: "paused",
      inputQueue: [],
      particles: [],
      shots: [],
      fragments: [],
      shockwaves: [],
      pressed: new Map(),
    });
  }

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.keys = buildKeyboard(window.innerWidth, window.innerHeight, state);
  }

  function startGame() {
    if (!state.assets.ready) return;

    state.screen = "playing";
    state.language = elements.languageSelect.value;
    state.mode = elements.modeSelect.value;
    state.difficulty = elements.difficultySelect.value;
    state.highlightTarget = elements.targetHighlightInput.checked;
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
    resize();
    spawnBrainrot();
    updateMenuForScreen();
    persistState();
  }

  function endGame() {
    state.screen = "gameover";
    state.active = null;
    updateMenuForScreen();
    persistState();
  }

  function togglePause() {
    if (state.screen === "playing") {
      state.screen = "paused";
      persistState();
      return;
    }

    if (state.screen === "paused") {
      state.screen = "playing";
      persistState();
    }
  }

  function chooseKey() {
    const keys = currentKeyIds(state);
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

    const keys = currentKeyIds(state);
    const words = state.dictionaries[state.language] || currentLayout(state).words || [];
    const weakKeys = keys.filter((key) => {
      const stat = ensureStat(key);
      return stat.misses > stat.hits;
    });
    const candidates = weakKeys.length ? words.filter((word) => weakKeys.some((key) => word.includes(key))) : words;

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
      const target = state.active?.status === "falling" && state.active.key === key ? state.active : null;

      state.pressed.set(key, 120);
      fireShot(state, key, target);
      if (!target) continue;

      ensureStat(key).hits += 1;
      state.score += 1;
      updateBestScore();
      state.streak += 1;
      state.totalHits += 1;
      state.level = Math.floor(state.totalHits / 10);

      if (target.progress < target.sequence.length - 1) {
        target.progress += 1;
        target.key = target.sequence[target.progress];
        burst(state, target.x, target.y, "#b7ff37", 8);
        persistState();
        return;
      }

      shatterBrainrot(state, target);
      burst(state, target.x, target.y, "#b7ff37", 22);
      state.active = null;
      spawnBrainrot();
      persistState();
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
        burst(state, targetX, target.y, "#ff4d4d", 18);
        state.active = null;

        if (state.hp <= 0) endGame();
        else spawnBrainrot();
        persistState();
      }
    }

    updateTransientEffects(delta);
  }

  function updateTransientEffects(delta) {
    state.particles = state.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * delta,
        y: particle.y + particle.vy * delta,
        vy: particle.vy + 240 * delta,
        life: particle.life - delta,
      }))
      .filter((particle) => particle.life > 0);

    state.shots = state.shots.map((shot) => ({ ...shot, life: shot.life - delta })).filter((shot) => shot.life > 0);

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

  function updateBestScore() {
    if (state.score <= state.persisted.bestScore) return;

    state.persisted.bestScore = state.score;
    state.isNewBest = true;
  }

  function ensureStat(key) {
    if (!state.persisted.stats[key]) state.persisted.stats[key] = { hits: 0, misses: 0 };
    return state.persisted.stats[key];
  }

  function updateMenuForScreen() {
    const isMenuVisible = state.screen === "menu" || state.screen === "gameover";
    elements.menu.classList.toggle("is-hidden", !isMenuVisible);
    elements.menuBackdrop.classList.toggle("is-hidden", !isMenuVisible);

    if (state.screen === "gameover") {
      elements.menuTitle.textContent = "Game Over";
      elements.menuResult.textContent = state.isNewBest
        ? `New best ${state.persisted.bestScore} / Level ${state.level + 1}`
        : `Score ${state.score} / Best ${state.persisted.bestScore} / Level ${state.level + 1}`;
      elements.menuResult.classList.toggle("is-record", state.isNewBest);
      elements.menuResult.classList.remove("is-hidden");
      elements.startButton.textContent = "Restart defense";
      return;
    }

    elements.menuTitle.textContent = "Brainrot Keyboard Defense";
    elements.menuResult.classList.add("is-hidden");
    elements.menuResult.classList.remove("is-record");
    elements.startButton.textContent = state.screen === "paused" ? "Resume defense" : "Start defense";
  }

  function persistState() {
    state.persisted.settings = {
      language: state.language,
      mode: state.mode,
      difficulty: state.difficulty,
      highlightTarget: state.highlightTarget,
    };
    state.persisted.lastRun = createRunSnapshot();
    savePersistedState(state.persisted);
  }

  function createRunSnapshot() {
    return {
      screen: state.screen,
      language: state.language,
      mode: state.mode,
      difficulty: state.difficulty,
      highlightTarget: state.highlightTarget,
      score: state.score,
      isNewBest: state.isNewBest,
      hp: state.hp,
      streak: state.streak,
      totalHits: state.totalHits,
      level: state.level,
      active: state.active,
    };
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      togglePause();
      return;
    }

    const key = keyFromEvent(event, state);
    if (state.screen === "playing" && key) {
      event.preventDefault();
      state.inputQueue.push(key);
    }

    if (event.key === "Enter" && state.screen !== "playing" && state.screen !== "paused") startGame();
  }

  function handleLanguageChange() {
    if (state.screen === "playing" || state.screen === "paused") return;

    state.language = elements.languageSelect.value;
    state.persisted.settings.language = state.language;
    resize();
    persistState();
  }

  function handleSettingsChange() {
    state.persisted.settings = {
      language: elements.languageSelect.value,
      mode: elements.modeSelect.value,
      difficulty: elements.difficultySelect.value,
      highlightTarget: elements.targetHighlightInput.checked,
    };
    savePersistedState(state.persisted);
  }

  function loop(now) {
    const delta = Math.min(0.033, (now - state.lastTime) / 1000);
    state.lastTime = now;
    update(delta);
    draw(ctx, state);
    requestAnimationFrame(loop);
  }

  return {
    init,
    resize,
    startGame,
    handleKeyDown,
    handleLanguageChange,
    handleSettingsChange,
    loop,
  };
}
