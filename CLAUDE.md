# CLAUDE.md — Polskie Ptaki

> Główny plik kontekstowy dla Claude Code. Czytaj ten plik jako **pierwszy** przy każdej sesji.
> Pełna dokumentacja w katalogu `docs/`.

## Czym jest ten projekt

Przeglądarkowa gra platformowa 2D pixel art dla dzieci klas 1–3 (6–10 lat) o polskich ptakach.
Mechanika inspirowana Mario. Cel edukacyjny: polskie parki narodowe i ornitologia.

**Stack:** Phaser.js 3 · Vite · Vanilla JS (ES6+) · Tiled (mapy) · localStorage (zapis)
**Hosting:** GitHub Pages lub Netlify — statyczne pliki, zero backendu
**Grafika:** spritesheety PNG z PixelLab.ai + Aseprite

## Struktura katalogów (docelowa)

```
polskie-ptaki/
├── CLAUDE.md                  ← ten plik
├── docs/
│   ├── CLAUDE.md              ← ten plik (symlink lub kopia)
│   ├── ARCHITECTURE.md        ← architektura techniczna
│   ├── GAME_DESIGN.md         ← pełny game design document
│   ├── ASSETS.md              ← specyfikacja grafik i audio
│   ├── EDUCATION.md           ← treści edukacyjne (tabliczki)
│   └── ROADMAP.md             ← fazy i status
├── src/
│   ├── main.js                ← entry point Phaser
│   ├── config.js              ← konfiguracja gry (rozmiar, fizyka)
│   ├── scenes/
│   │   ├── BootScene.js       ← ładowanie assetów
│   │   ├── TitleScene.js      ← ekran tytułowy
│   │   ├── BirdSelectScene.js ← wybór ptaka
│   │   ├── Level1Scene.js     ← Wiosna / Biebrza
│   │   ├── Level2Scene.js     ← Lato / Słowiński PN
│   │   ├── Level3Scene.js     ← Jesień / Białowieża
│   │   ├── Level4Scene.js     ← Zima / Tatry
│   │   ├── UIScene.js         ← HUD overlay (życia, pasek energii)
│   │   ├── SignScene.js       ← tabliczka edukacyjna (modal)
│   │   └── EndScene.js        ← ekran końca levelu + nagroda
│   ├── objects/
│   │   ├── Bird.js            ← klasa bazowa ptaka
│   │   ├── birds/
│   │   │   ├── Bielik.js
│   │   │   ├── Zuraw.js
│   │   │   ├── Dzieciol.js
│   │   │   ├── Zimorodek.js
│   │   │   ├── Puchacz.js
│   │   │   └── Bocian.js
│   │   ├── Enemy.js           ← klasa bazowa wroga
│   │   ├── enemies/
│   │   │   ├── Fox.js
│   │   │   ├── Seagull.js
│   │   │   ├── Marten.js
│   │   │   └── GoldenEagle.js
│   │   ├── EducationSign.js   ← tabliczka edukacyjna (interaktywna)
│   │   └── FeatherPickup.js   ← pióro feniksa do zebrania
│   ├── data/
│   │   ├── birds.json         ← statystyki i opisy ptaków
│   │   ├── signs/
│   │   │   ├── level1.json    ← treści tabliczek Biebrza
│   │   │   ├── level2.json
│   │   │   ├── level3.json
│   │   │   └── level4.json
│   │   └── feathers.json      ← legendy piór feniksa
│   ├── systems/
│   │   ├── SaveSystem.js      ← localStorage wrapper
│   │   ├── AudioManager.js    ← muzyka + SFX
│   │   └── InputManager.js    ← klawiatura + (przyszłość: touch)
│   └── ui/
│       ├── SignModal.js       ← komponent modalu tabliczki
│       ├── QuizWidget.js      ← quiz wielokrotnego wyboru
│       └── RewardScreen.js    ← ekran nagrody po levelu
├── public/
│   └── assets/
│       ├── sprites/           ← PNG spritesheety (z PixelLab.ai)
│       ├── tilemaps/          ← JSON z Tiled + tileset PNG
│       └── audio/             ← MP3 + OGG
├── index.html
├── vite.config.js
└── package.json
```

## Aktualny status projektu

**Faza:** 0 — Pre-produkcja (dokumentacja + setup)
**Co jest gotowe:** PRD v1.0, dokumentacja techniczna
**Co jest następne:** Setup projektu Phaser.js, prototyp Level1 z 1 ptakiem

Szczegółowy status: `docs/ROADMAP.md`

## Kluczowe zasady dla Claude Code

1. **Nigdy nie hardkoduj treści edukacyjnych w scenie** — dane zawsze z `src/data/signs/levelN.json`
2. **Każdy ptak to osobna klasa** dziedzicząca po `Bird.js` — nie dodawaj logiki ptaka do scen
3. **SaveSystem.js** jest jedynym miejscem, które dotyka localStorage
4. **UIScene** działa jako overlay (Phaser parallel scene) — nie mieszaj HUD z logiką levelu
5. **Testy na rozmiarze 1280×720** — canvas ma fixed size, skalowany CSS do viewport

## Szybki start (gdy projekt zostanie zainicjowany)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ gotowy do deployu
```

## Linki do pozostałej dokumentacji

- Architektura i kod: `docs/ARCHITECTURE.md`
- Game design (ptaki, levele, mechanika): `docs/GAME_DESIGN.md`
- Specyfikacja assetów: `docs/ASSETS.md`
- Treści edukacyjne: `docs/EDUCATION.md`
- Roadmapa i zadania: `docs/ROADMAP.md`
