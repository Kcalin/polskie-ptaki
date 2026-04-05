# GAME_DESIGN.md — Game Design Document

## Ptaki — statystyki i zdolności

Parametry w skali 1–5. Prędkość w px/s, skok jako siła Y (ujemna = w górę).

```json
// src/data/birds.json
[
  {
    "id": "bielik",
    "name": "Orzeł bielik",
    "nameScientific": "Haliaeetus albicilla",
    "description": "Największy orzeł Polski. Szybki i silny, ale skacze przeciętnie.",
    "stats": { "speed": 5, "jump": 3, "canDoubleJump": false },
    "physicsSpeed": 280,
    "physicsJump": -430,
    "ability": {
      "key": "talon_grab",
      "name": "Szpon powietrzny",
      "description": "Porywa małe obiekty i wrogów w zasięgu.",
      "energyCost": 30,
      "cooldownMs": 2000
    },
    "spriteKey": "bielik",
    "bestLevel": 1,
    "funFact": "Bielik ma rozpiętość skrzydeł do 2,5 metra — największą spośród polskich ptaków."
  },
  {
    "id": "zuraw",
    "name": "Żuraw",
    "nameScientific": "Grus grus",
    "description": "Elegancki tancerz. Skacze najwyżej ze wszystkich ptaków.",
    "stats": { "speed": 3, "jump": 5, "canDoubleJump": true },
    "physicsSpeed": 200,
    "physicsJump": -540,
    "ability": {
      "key": "crane_dance",
      "name": "Taniec żurawia",
      "description": "Dezorientuje wrogów w promieniu 120px — stoją przez 3 sekundy.",
      "energyCost": 40,
      "cooldownMs": 4000
    },
    "spriteKey": "zuraw",
    "bestLevel": 1,
    "funFact": "Żurawie tworzą pary na całe życie i co roku wracają w to samo miejsce lęgowe."
  },
  {
    "id": "dzieciol",
    "name": "Dzięcioł czarny",
    "nameScientific": "Dryocopus martius",
    "description": "Powolny, ale niszczy przeszkody jak nikt inny.",
    "stats": { "speed": 2, "jump": 2, "canDoubleJump": false },
    "physicsSpeed": 160,
    "physicsJump": -380,
    "ability": {
      "key": "woodpeck",
      "name": "Kucie",
      "description": "Niszczy specjalne bloki/ściany oznaczone teksturą 'drewno'. Otwiera skróty.",
      "energyCost": 20,
      "cooldownMs": 800
    },
    "spriteKey": "dzieciol",
    "bestLevel": 3,
    "funFact": "Dzięcioł uderza w drzewo 20 razy na sekundę — czaszka ma specjalną amortyzację."
  },
  {
    "id": "zimorodek",
    "name": "Zimorodek",
    "nameScientific": "Alcedo atthis",
    "description": "Błyskawiczny nurek. Najszybszy ze wszystkich, ale słabo skacze.",
    "stats": { "speed": 5, "jump": 1, "canDoubleJump": false },
    "physicsSpeed": 340,
    "physicsJump": -350,
    "ability": {
      "key": "dive",
      "name": "Nurkowanie hipersoniczne",
      "description": "Pionowe uderzenie z góry — omija platformy w dół, zabija wrogów pod sobą.",
      "energyCost": 35,
      "cooldownMs": 2500
    },
    "spriteKey": "zimorodek",
    "bestLevel": 2,
    "funFact": "Zimorodek widzi pod wodą dzięki polaryzowanej błonie na oczach."
  },
  {
    "id": "puchacz",
    "name": "Puchacz",
    "nameScientific": "Bubo bubo",
    "description": "Nocny łowca z Tatr. Ogłusza wrogów swoim głosem.",
    "stats": { "speed": 3, "jump": 3, "canDoubleJump": true },
    "physicsSpeed": 220,
    "physicsJump": -460,
    "ability": {
      "key": "wing_boom",
      "name": "Huk skrzydeł",
      "description": "Fala dźwiękowa w poziomie — ogłusza wszystkich wrogów na linii przez 2 sekundy.",
      "energyCost": 45,
      "cooldownMs": 5000
    },
    "spriteKey": "puchacz",
    "bestLevel": 4,
    "funFact": "Puchacz to największa sowa Europy — może ważyć ponad 3 kg."
  },
  {
    "id": "bocian",
    "name": "Bocian biały",
    "nameScientific": "Ciconia ciconia",
    "description": "Zrównoważony i dostępny. Najlepszy wybór dla początkujących.",
    "stats": { "speed": 3, "jump": 4, "canDoubleJump": false },
    "physicsSpeed": 210,
    "physicsJump": -490,
    "ability": {
      "key": "wing_gust",
      "name": "Podmuch skrzydeł",
      "description": "Podmuch strąca wrogów z platform i odpycha pociski.",
      "energyCost": 25,
      "cooldownMs": 1500
    },
    "spriteKey": "bocian",
    "bestLevel": 1,
    "funFact": "Polska jest domem dla 25% światowej populacji bociana białego.",
    "isDefault": true
  }
]
```

## Levele — szczegółowa specyfikacja

### Level 1 — Wiosna: Rozlewiska Biebrzy

```
Długość mapy:    6400px × 720px (5 ekranów szerokości)
Tło (parallax):  3 warstwy — niebo, drzewa w oddali, trzciny bliskie
Muzyka:          level1_spring.mp3 — ptasie chóry + delikatny ambient
Wróg główny:     Fox (lis)
Przeszkody env:  TrzcinyPatch (spowalnia), MoczarTrap (grzęźnięcie)
Pióro:           "Pióro Wiosennego Świtu"
Odznaka:         "Strażnik Biebrzy"
```

**Rozkład mapy (odcinek co 1280px):**
- 0–1280: Tutorial — pierwsze platformy, 1 lis, tabliczka #1 (bocian na gnieździe)
- 1280–2560: Rozlewisko — platformy na kępach, 2 lisy, tabliczka #2 (park narodowy)
- 2560–3840: Gęste trzciny — widoczność ograniczona, tabliczka #3 (zagrożenia)
- 3840–5120: Wzgórze z wierzbami — trudniejszy układ, 3 lisy, tabliczka #4 (quiz)
- 5120–6400: Meta + pióro feniksa (animacja zbierania)

**Tabliczki Level 1:** → patrz `docs/EDUCATION.md`

---

### Level 2 — Lato: Słowiński Park Narodowy

```
Długość mapy:    7040px × 720px
Motyw specjalny: Ruchome platformy (wydmy osuwają się po 3 sek. po wejściu na nie)
Muzyka:          level2_summer.mp3 — szum morza, mewa
Wróg główny:     Seagull (mewa śmieszka) — latający, atakuje z powietrza
Przeszkody env:  WindGust (poziomy podmuch co 8 sek.), QuicksandZone (bagno)
Pióro:           "Pióro Letniego Wiatru"
Odznaka:         "Odkrywca Słowińca"
```

**Mechanika specjalna:** co 60 sekund pojawia się podmuch wiatru (windGust) — wszystkie ruchome platformy przesuwają się 40px w prawo. Gracz musi planować skoki z wyprzedzeniem.

---

### Level 3 — Jesień: Puszcza Białowieska

```
Długość mapy:    7680px × 720px
Motyw specjalny: Fog zones — obszary mgły (fog-of-war lite: widoczność 300px)
Muzyka:          level3_autumn.mp3 — las, szelest liści, dzięcioł
Wróg główny:     Marten (kuna leśna) — wspina się po pionowych platformach
Przeszkody env:  FallenLog (blokada, niszczy Dzięcioł), MushroomSlip (ślizganie)
Pióro:           "Pióro Jesiennej Mgły"
Odznaka:         "Opiekun Puszczy"
```

**Mechanika specjalna:** Dzięcioł czarny może niszczyć `FallenLog` swoją zdolnością — odkrywa skryte przejścia z bonus tabliczką (#5 ukryta). Inne ptaki muszą objechać.

---

### Level 4 — Zima: Tatry

```
Długość mapy:    8320px × 720px (najtrudniejszy)
Motyw specjalny: IcePlatform — platformy lodowe (ślizg, momentum)
Muzyka:          level4_winter.mp3 — cisza gór, wiatr
Wróg główny:     GoldenEagle (orzeł przedni) — boss-like, pojawia się 2x
Przeszkody env:  SnowSlide (lawina śniegu z góry co 15 sek.), IcePatch (ślizg)
Pióro:           "Pióro Zimowej Zorzy"
Odznaka:         "Zdobywca Tatr"
```

**Mechanika specjalna:** GoldenEagle (orzeł przedni jako wróg) ma 3 HP — wymaga 3 trafień zdolnością specjalną. Po pierwszym trafieniu ucieka i wraca silniejszy.

## System walki

### Gracz vs. Wróg
```
Tryb A — Skok na głowę (jak Mario):
  - Gracz spada z góry na wroga → wróg ginie, gracz odbija się lekko w górę
  - Wymaga: gracz.velocityY > 0 && gracz.bottom <= wróg.top + 8px

Tryb B — Zdolność specjalna:
  - Każda zdolność ma własny hitbox i zasięg (zdefiniowany w birds.json)
  - Wróg dostaje 1 obrażenie (zwykły) lub 1 z 3 (GoldenEagle)

Tryb C — Wróg vs. Gracz:
  - Kontakt boczny z wrogiem → gracz traci 1 życie, chwilowa nietykalność 1.5 sek.
  - Gracz miga przez 1.5 sek. (setAlpha alternating w update)
```

### Życia i Game Over
```
- Start levelu: 3 życia (serca w HUD)
- Utrata życia: kontakt z wrogiem lub wpadnięcie w Hazard tile
- 0 żyć → ekran "Spróbuj jeszcze raz" z przyciskami [Spróbuj ponownie] [Menu]
- Zapis postępów: tylko po ukończeniu levelu, nie przy śmierci
```

## System tabliczek edukacyjnych

### Trigger i interakcja
```
1. Gracz wchodzi w overlap zone (48px wokół tabliczki)
2. Pojawia się dymek "Naciśnij E"
3. Gracz naciska E → scene.pause() + launch SignScene
4. SignScene wyświetla 4 strony: Ciekawostka → Miejsce → Zagrożenie → Quiz
5. Gracz przechodzi przez strony przyciskiem [Dalej]
6. Po quizie: feedback natychmiastowy + zamknięcie
7. scene.resume() → tabliczka oznaczona jako zebrana (✓ na minimap)
```

### Format danych tabliczki
```json
{
  "id": "L1_S1",
  "position": { "x": 640, "y": 400 },
  "spriteVariant": "wooden",
  "pages": [
    {
      "type": "bird_fact",
      "title": "Bocian biały",
      "text": "Bocian biały wraca do Polski każdej wiosny z Afryki. Potrafi przelecieć nawet 10 000 kilometrów!",
      "illustration": "bocian_nest"
    },
    {
      "type": "location",
      "title": "Biebrzański Park Narodowy",
      "text": "Największy park narodowy w Polsce! Rozlewiska Biebrzy to raj dla ponad 270 gatunków ptaków.",
      "illustration": "biebrza_panorama"
    },
    {
      "type": "threat",
      "title": "Zagrożenie: osuszanie mokradeł",
      "text": "Mokradła są osuszane pod uprawy. Bez nich bocian traci miejsca żerowania.",
      "illustration": "threat_drainage",
      "severity": "high"
    },
    {
      "type": "quiz",
      "question": "Skąd wracają bociany każdej wiosny?",
      "answers": ["Z Afryki", "Z Azji", "Zostają w Polsce"],
      "correctIndex": 0,
      "feedbackCorrect": "Brawo! Bociany spędzają zimę w Afryce Subsaharyjskiej.",
      "feedbackWrong": "Nie tym razem! Bociany lecą aż do Afryki na zimę."
    }
  ]
}
```

## Ekran wyboru ptaka (BirdSelectScene)

```
Layout: 6 kart ptaków w rzędzie (3+3 lub 2+2+2)
Każda karta:
  - Animowany sprite (idle loop)
  - Imię ptaka (pixel font)
  - 4 ikony statystyk: prędkość, skok, siła zdolności, trudność
  - Przycisk "Wybierz"

Po wyborze:
  - SaveSystem.setSelectedBird(birdId)
  - Krótka animacja "gotowy do lotu"
  - Przejście do ekranu mapy / Level1Scene

Domyślnie zaznaczony: bocian (isDefault: true w birds.json)
```

## Ekran nagrody (EndScene)

```
Sekwencja (łączny czas ~15 sek.):
1. [0-3s]   Animacja pióra feniksa lecącego przez ekran (particle system)
2. [3-7s]   Wyświetlenie legendy pióra (tekst + ilustracja) — lektura przez dziecko
3. [7-10s]  Karta lokalizacji z ciekawostką o parku narodowym
4. [10-13s] Odznaka z tytułem gracza (animacja pieczęci)
5. [13-15s] Statystyki: X/5 tabliczek · czas · punkty
6. [15s+]   Przyciski: [Następny level] [Menu główne] [Zagraj jeszcze raz]
```

## Punktacja

```
Baza za ukończenie levelu:  1000 pkt
Każda tabliczka:            +200 pkt
Poprawna odpowiedź quiz:    +100 pkt
Pozostałe życia:            +150 pkt × ilość
Bonus czasowy:              +1 pkt za każdą sekundę poniżej par time
Par times: Level1=180s, Level2=210s, Level3=240s, Level4=270s
```
