# ROADMAP.md — Fazy i zadania

## Status projektu: FAZA 0 — Pre-produkcja

Ostatnia aktualizacja: 5 kwietnia 2026

---

## Faza 0 — Pre-produkcja ✅ W toku

**Cel:** Dokumentacja, setup środowiska, prototyp Alpha (1 ptak, 1 level, ruch + skok)

### Dokumentacja [GOTOWE ✅]
- [x] PRD v1.0 (Skrzydla_nad_Polska_PRD_v1.0.docx)
- [x] CLAUDE.md — główny kontekst
- [x] ARCHITECTURE.md — architektura techniczna
- [x] GAME_DESIGN.md — mechanika i dane ptaków
- [x] ASSETS.md — specyfikacja grafik i audio
- [x] EDUCATION.md — treści tabliczek (Level 1 i 2 gotowe)
- [x] ROADMAP.md — ten plik

### Setup projektu [GOTOWE ✅]
- [x] `npm create vite@latest skrzydla-nad-polska -- --template vanilla`
- [x] `npm install phaser`
- [x] Skonfigurować `vite.config.js` (base path dla GitHub Pages)
- [x] Stworzyć strukturę katalogów wg CLAUDE.md
- [ ] Inicjalizacja repozytorium Git + GitHub (git init lokalnie — push do GitHub do zrobienia)

### Prototyp Alpha [GOTOWE ✅]
- [x] `src/config.js` — konfiguracja Phaser
- [x] `src/main.js` — entry point
- [x] `BootScene.js` — placeholder assets (kolorowe prostokąty zamiast sprite'ów)
- [x] `Level1Scene.js` — podstawowy level (platformy placeholder, kamera, kolizje)
- [x] `Bird.js` + `Bocian.js` — ruch, skok, grawitacja, wing_gust (SHIFT)
- [x] Fizyka Arcade na platformach działa (build OK)
- [x] `SaveSystem.js` — localStorage wrapper
- [ ] Deploy na GitHub Pages

### Pierwsza grafika PixelLab [DO ZROBIENIA ⬜]
- [ ] Sprite bociana (idle + run + jump) — 48×48 px  ← wymaga PixelLab.ai
- [ ] Tileset wiosna — podstawowy zestaw (16 kafelków)  ← wymaga PixelLab.ai
- [ ] Tło Level 1 — prosta panorama Biebrzy  ← wymaga PixelLab.ai

---

## Faza 1 — MVP Desktop [PLANOWANE]

**Cel:** Pełna gra: 4 levele, 6 ptaków, tabliczki edu, system nagrody, przycisk donate

### Sceny i UI
- [ ] `TitleScene.js` — ekran tytułowy z animowanym tłem
- [ ] `BirdSelectScene.js` — wybór ptaka z kartami statystyk
- [ ] `UIScene.js` — HUD (serca, pasek energii, minimap)
- [x] `SignModal.js` — modal tabliczki (4 strony + quiz) ✅
- [ ] `EndScene.js` — ekran nagrody z animacją pióra feniksa

### Ptaki (6 klas)
- [ ] `Bocian.js` — wing_gust ability (priorytet, default ptak)
- [ ] `Bielik.js` — talon_grab ability
- [ ] `Zuraw.js` — crane_dance ability (double jump)
- [ ] `Dzieciol.js` — woodpeck ability (niszczy bloki)
- [ ] `Zimorodek.js` — dive ability
- [ ] `Puchacz.js` — wing_boom ability (double jump)

### Levele (4)
- [ ] Level 1 — Biebrza (wiosna) — PRIORYTET MVP
  - [ ] Mapa Tiled (6400×720) — placeholder platformy działają, czeka na Tiled
  - [x] Wróg: Fox.js — patrol + knockback ✅
  - [x] 5 tabliczek (dane z EDUCATION.md gotowe) ✅
  - [x] Pióro feniksa pickup ✅
- [ ] Level 2 — Słowiński PN (lato)
  - [ ] Mapa Tiled (7040×720) z ruchomymi platformami
  - [ ] Wróg: Seagull.js (latający)
  - [ ] Mechanika: WindGust co 60 sek.
- [ ] Level 3 — Białowieża (jesień)
  - [ ] Mapa Tiled (7680×720) z mgłą
  - [ ] Wróg: Marten.js (wspina się po ścianach)
  - [ ] Mechanika: FogZone
- [ ] Level 4 — Tatry (zima)
  - [ ] Mapa Tiled (8320×720) z lodem
  - [ ] Wróg: GoldenEagle.js (3 HP, boss)
  - [ ] Mechanika: SnowSlide co 15 sek.

### Grafika (PixelLab.ai)
- [ ] Wszystkie 6 sprite'ów ptaków (7 animacji × 6 ptaków)
- [ ] 4 wrogów sprite'y
- [ ] 4 tileset'y per sezon
- [ ] 4 tła parallax per level
- [ ] UI spritesheet (tileset_ui.png)
- [ ] Ekran tytułowy illustration

### Audio
- [ ] 4 ścieżki muzyczne (OpenGameArt.org CC0 lub własne)
- [ ] SFX: ~12 efektów dźwiękowych
- [ ] 6 nagrań głosów ptaków (xeno-canto.org, CC BY)

### Systemy
- [ ] `AudioManager.js` — kontrola muzyki i SFX
- [ ] `InputManager.js` — centralizacja inputu
- [ ] `QuizWidget.js` — komponent quizu
- [ ] `RewardScreen.js` — animacja pióra feniksa (particle system)
- [ ] System punktacji (per level)

---

## Faza 2 — Polish & Edu [PLANOWANE]

- [ ] Treści edukacyjne Level 3 i 4 (EDUCATION.md do uzupełnienia)
- [ ] Dźwięki ptaków przy tabliczkach
- [ ] Accessibility: napisy dla głuchych (SFX), kontrast WCAG 2.1 AA
- [ ] Testy z dziećmi (min. 3 sesje, wiek 6-10 lat)
- [ ] Opinia ornitologa / pracownika parku narodowego
- [ ] Przycisk donate (Ko-fi embed)
- [ ] Strona landing page (GitHub Pages lub Netlify)

---

## Faza 3 — Mobile [PLANOWANE]

- [ ] Responsive canvas skalowany do viewport
- [ ] Wirtualny D-pad HTML overlay
- [ ] Touch events dla interakcji z tabliczkami
- [ ] PWA manifest (instalacja na telefon)
- [ ] Testowanie: Chrome Android, Safari iOS
- [ ] Optymalizacja assets (WebP, compressed audio)

---

## Faza 4 — Dystrybucja [PLANOWANE]

- [ ] Kontakt: Biebrzański Park Narodowy
- [ ] Kontakt: Słowiński Park Narodowy
- [ ] Kontakt: Białowieski Park Narodowy
- [ ] Kontakt: Tatrzański Park Narodowy
- [ ] Kontakt: OTOP (Ogólnopolskie Towarzystwo Ochrony Ptaków)
- [ ] Kontakt: Centrum Edukacji Obywatelskiej (materiały dla nauczycieli)
- [ ] Social media: Facebook dla rodziców, TikTok z gameplay
- [ ] Press kit (screenshot, opis, logo)

---

## Decyzje do podjęcia (backlog)

| Decyzja | Opcje | Termin |
|---|---|---|
| 6. ptak | Remiz vs Sójka | Przed Fazą 1 |
| Lektor/TTS | ElevenLabs TTS vs brak głosu | Faza 2 |
| Język | Tylko PL vs PL+EN | Faza 2 |
| Muzyka | CC0 z OpenGameArt vs własna kompozycja | Faza 1 |
| Trudność | 1 poziom vs easy/normal | Faza 2 |

---

## Jak zacząć nową sesję z Claude Code

1. Przeczytaj `CLAUDE.md` (ten katalog)
2. Sprawdź ten plik (`ROADMAP.md`) — co jest ✅, co jest ⬜
3. Zacznij od **pierwszego niezakończonego zadania** w aktualnej fazie
4. Po ukończeniu zadania zaznacz je `[x]` i zaktualizuj "Ostatnia aktualizacja"

**Zasada pracy:** jeden task na raz, commit po każdym ukończonym zadaniu.
