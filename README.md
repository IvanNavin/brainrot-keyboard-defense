# Brainrot Keyboard Defense

Native JavaScript canvas keyboard trainer.

## Run

```bash
npm run dev
```

Open `http://localhost:5173`.

## MVP

- English and Ukrainian keyboard layouts from layout config
- Canvas-rendered keyboard and falling brainrots
- 3 HP, score, misses
- One active brainrot at a time
- Speed increases every 10 successful key presses
- Classic, Weak keys, and Words modes
- Persisted app state in `localStorage`: settings, best score, per-key stats, and last run snapshot
- Word dictionaries in `src/dictionaries/`

## Structure

- `src/main.js` bootstraps DOM, assets, and the game
- `src/game.js` owns gameplay state and persistence orchestration
- `src/renderer.js` draws the canvas
- `src/layout.js` owns keyboard layouts and physical key mapping
- `src/effects.js` owns shots, bursts, and shatter effects
- `src/storage.js` owns localStorage read/write and migration
