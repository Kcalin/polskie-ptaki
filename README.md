# Polskie Ptaki — Polish Birds

A 2D pixel-art platformer for children (ages 6–10) about Polish birds and national parks. Mario-style gameplay with an educational twist: collect feathers, read nature signs, and answer quizzes about real Polish wildlife.

**Play it live:** [polskieptaki.pl](https://polskieptaki.pl)

---

## Gameplay

- **Move** — `← →` arrows
- **Jump** — `↑` arrow
- **Wing gust** (stun enemies in radius) — `Shift`
- **Read education sign** — `E` when near a sign
- **Navigate sign** — `← →` arrows, `ESC` to close
- **Quiz** — `↑ ↓` to select answer, `Enter` to confirm

Collect the phoenix feather at the end of each level to unlock the next one. Correct quiz answers restore a heart (max 3).

---

## Levels

| # | Location | Season | Bird |
|---|----------|--------|------|
| 1 | Biebrza National Park | Spring | Batalion *(Ruff)* |
| 2–4 | coming soon | — | — |

---

## Tech stack

| Tool | Role |
|------|------|
| [Phaser.js 3](https://phaser.io) | Game engine |
| [Vite](https://vitejs.dev) | Build / dev server |
| Vanilla JS (ES6+) | Game logic |
| localStorage | Save system |
| [PixelLab.ai](https://pixellab.ai) | Sprite generation |

---

## Project structure

```
src/
  scenes/        — Phaser scenes (Boot, Title, Level1, UI, End)
  objects/       — Game objects (birds, enemies, signs, pickups)
    birds/       — One class per playable bird
    enemies/     — Fox, Wolf, …
  systems/       — SaveSystem, AudioManager
  ui/            — SignModal (education sign overlay)
  data/
    signs/       — Educational content per level (Polish)
    feathers.json — Phoenix feather legends
public/assets/
  sprites/       — PNG spritesheets
  audio/         — Background music + SFX
  birds/         — Wikipedia bird photos (CC-licensed)
```

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

Reset saved progress (browser console):
```js
clearSave()
```

---

## Educational content

Sign texts, quiz questions, and bird descriptions are in **Polish** — the game's target language for Polish schoolchildren. Content lives in `src/data/signs/levelN.json` and is never hardcoded in scenes.

Bird photos are sourced from Wikimedia Commons under Creative Commons licenses. Credits are shown in-game below each photo.

---

## Deployment

The project auto-deploys to [polskieptaki.pl](https://polskieptaki.pl) via [Netlify](https://netlify.com), which watches the `main` branch and builds on every push.

---

## License

Game code: MIT
Bird photos: see individual credits in `src/data/signs/` (CC BY / CC BY-SA, Wikimedia Commons)
