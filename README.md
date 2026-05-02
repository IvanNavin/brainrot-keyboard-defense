# Brainrot Keyboard Defense

Vite + native JavaScript canvas keyboard trainer.

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
- Vite dev server
- Local word dictionaries in `src/dictionaries/`, loaded through `wordLibrary` and filtered to 2-4 characters
- English dictionary currently has 6445 short words; Ukrainian dictionary currently has 275 short words

## Structure

- `src/main.js` bootstraps DOM, assets, and the game
- `src/game.js` creates the game context
- `src/game/` contains one-function game helpers
- `src/renderer.js` composes canvas rendering
- `src/render/` contains one-function draw helpers
- `src/layout/` contains one-function layout and key mapping helpers
- `src/effects/` contains one-function shot, burst, and shatter helpers
- `src/storage/` contains one-function localStorage helpers
- `src/utils/` contains one-function utility helpers
- `src/wordLibrary.js` loads dictionary JSON and filters words to 2-4 characters
- `src/wordLibrary/` contains one-function word-library helpers
