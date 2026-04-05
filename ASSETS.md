# ASSETS.md — Specyfikacja assetów

## Zasady ogólne pixel art

| Parametr | Wartość |
|---|---|
| Rozdzielczość sprite'ów ptaków | 48×48 px |
| Rozdzielczość wrogów | 32×32 px |
| Tile size (platformy) | 16×16 px |
| Tileset sheet size | 256×256 px (16×16 kafelków) |
| Eksport | PNG, bez antialiasingu, bez kompresji stratnej |
| Spritesheet layout | Poziomy, jeden rząd na animację |

## Palety kolorów per level

### Level 1 — Wiosna (Biebrza)
```
Niebo:          #A8D8EA, #87CEEB, #E0F7FA
Zieleń:         #4CAF50, #388E3C, #81C784, #C8E6C9
Woda:           #29B6F6, #4DD0E1, #B2EBF2
Ziemia/muł:     #795548, #5D4037, #BCAAA4
Trzciny:        #8D6E63, #6D4C41, #D7CCC8
Bocian biel:    #FAFAFA, #B0BEC5, #F44336 (dziób)
```

### Level 2 — Lato (Słowiński)
```
Niebo:          #FFF9C4, #FFE082, #87CEEB
Piasek:         #FFD54F, #FFCA28, #FFF8E1, #F9A825
Morze:          #1565C0, #1976D2, #42A5F5, #E3F2FD
Roślinność:     #2E7D32, #388E3C, #66BB6A
Chmury:         #ECEFF1, #B0BEC5
```

### Level 3 — Jesień (Białowieża)
```
Niebo:          #78909C, #546E7A, #B0BEC5
Liście:         #F57F17, #E65100, #BF360C, #FFB300
Pnie:           #4E342E, #3E2723, #6D4C41
Mech/trawa:     #33691E, #558B2F, #7CB342
Mgła:           rgba(176,190,197,0.6)
Grzyby:         #BF360C, #FFCCBC
```

### Level 4 — Zima (Tatry)
```
Niebo:          #1A237E, #283593, #3949AB (zorza: #CE93D8, #80DEEA)
Śnieg:          #ECEFF1, #CFD8DC, #FFFFFF
Skały:          #37474F, #455A64, #78909C
Lód:            #B3E5FC, #81D4FA, #4FC3F7
Świerki:        #1B5E20, #2E7D32, #004D40
```

## Lista sprite'ów — ptaki

Każdy ptak ma spritesheet 48×48 px z animacjami w jednym pliku PNG:

```
public/assets/sprites/birds/bielik.png
  Rząd 0 (4 kl.):  idle        — stoi, lekkie kołysanie skrzydłami
  Rząd 1 (6 kl.):  run         — bieg/chód z machaniem skrzydłami
  Rząd 2 (4 kl.):  jump        — skok w górę, skrzydła rozłożone
  Rząd 3 (4 kl.):  fall        — opadanie, skrzydła złożone
  Rząd 4 (8 kl.):  ability     — szpon powietrzny, animacja uderzenia
  Rząd 5 (6 kl.):  hurt        — trafienie, miga czerwienią
  Rząd 6 (6 kl.):  death       — upadek, obrót, znikanie

  Łączny rozmiar: 48 × (48 × 7) = 48×336 px
```

Analogiczna struktura dla: zuraw, dzieciol, zimorodek, puchacz, bocian.

### Konfiguracja animacji w Phaser (BootScene.js)

```javascript
// Przykład dla bielika — powiel dla każdego ptaka
createBirdAnims(key) {
  const frameConfig = { frameWidth: 48, frameHeight: 48 };
  this.anims.create({
    key: `${key}_idle`,
    frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
    frameRate: 6, repeat: -1
  });
  this.anims.create({
    key: `${key}_run`,
    frames: this.anims.generateFrameNumbers(key, { start: 4, end: 9 }),
    frameRate: 10, repeat: -1
  });
  this.anims.create({
    key: `${key}_jump`,
    frames: this.anims.generateFrameNumbers(key, { start: 10, end: 13 }),
    frameRate: 8, repeat: 0
  });
  this.anims.create({
    key: `${key}_fall`,
    frames: this.anims.generateFrameNumbers(key, { start: 14, end: 17 }),
    frameRate: 6, repeat: -1
  });
  this.anims.create({
    key: `${key}_ability`,
    frames: this.anims.generateFrameNumbers(key, { start: 18, end: 25 }),
    frameRate: 16, repeat: 0
  });
  this.anims.create({
    key: `${key}_hurt`,
    frames: this.anims.generateFrameNumbers(key, { start: 26, end: 31 }),
    frameRate: 12, repeat: 0
  });
  this.anims.create({
    key: `${key}_death`,
    frames: this.anims.generateFrameNumbers(key, { start: 32, end: 37 }),
    frameRate: 8, repeat: 0
  });
}
```

## Lista sprite'ów — wrogowie (32×32 px)

```
public/assets/sprites/enemies/fox.png
  Rząd 0 (6 kl.):  walk        — chód w lewo/prawo
  Rząd 1 (4 kl.):  attack      — skok/atak
  Rząd 2 (4 kl.):  stunned     — ogłuszony (od zdolności)
  Rząd 3 (4 kl.):  death

public/assets/sprites/enemies/seagull.png
  Rząd 0 (6 kl.):  fly         — lot poziomy
  Rząd 1 (6 kl.):  dive        — atak nurkowy
  Rząd 2 (4 kl.):  stunned
  Rząd 3 (4 kl.):  death

public/assets/sprites/enemies/marten.png   — analogicznie
public/assets/sprites/enemies/golden_eagle.png  — 48×48 px (boss)
  Rząd 0 (8 kl.):  fly
  Rząd 1 (6 kl.):  attack
  Rząd 2 (4 kl.):  hurt        — 3 klatki hurt (3 HP)
  Rząd 3 (6 kl.):  retreat     — ucieczka po pierwszym trafieniu
  Rząd 4 (6 kl.):  death
```

## Tilesets

```
public/assets/sprites/tilesets/tileset_spring.png   — 256×256 px, 16×16 kafelki
  Kolumna 0-1:  platformy ziemne (kępy, łąka)
  Kolumna 2-3:  trzciny + woda
  Kolumna 4-5:  drewniane kładki
  Kolumna 6-7:  dekoracje (żaby, kwiaty, liście)
  Kolumna 8-9:  hazard tiles (moczar, ostry trzcinnik)
  Kolumna 10-11: tło (niebo, horyzont)
  Kolumna 12-15: elementy ikoniczne (gniazdo bociana, tablica PN)

tileset_summer.png  — wydmy, morze, drewno pomocy
tileset_autumn.png  — jesień, drzewa, pnie, grzyby
tileset_winter.png  — śnieg, skały, lód, świerki
tileset_ui.png      — elementy UI: serca, pasek energii, dymki, tabliczki
```

## Prompty do PixelLab.ai

### Ptak — przykład dla bielika (idle)
```
Polish white-tailed eagle (Haliaeetus albicilla), pixel art sprite, 
48x48 pixels, side view facing right, standing idle pose, 
white head and tail, dark brown body, yellow beak, 
warm color palette, no antialiasing, transparent background,
chibi/cute proportions but recognizable as real species,
style: Owlboy / Shovel Knight
```

### Tileset — wiosna/Biebrza
```
Wetland marsh tileset, pixel art, 16x16 tiles, 
Polish Biebrza river valley landscape, spring season,
reed beds, muddy banks, wooden footbridges, lily pads,
muted earthy greens and blues, top-down platformer perspective,
transparent background, no antialiasing
```

### Tło parallax — wiosna
```
Biebrza wetlands background, pixel art, 1280x720px,
dawn/morning atmosphere, layers: distant trees, reeds, water reflections,
Polish river valley, spring, birds silhouettes on horizon,
soft pastel colors #A8D8EA #4CAF50 #29B6F6,
no antialiasing, painterly pixel style
```

## Audio

```
public/assets/audio/

Muzyka (MP3 + OGG, ~2-3 min pętla każdy):
  level1_spring.mp3/.ogg   — chiptune, ptasie chóry, łagodny
  level2_summer.mp3/.ogg   — nieco energiczniejszy, szum morza w tle
  level3_autumn.mp3/.ogg   — melancholijny, głębszy bas
  level4_winter.mp3/.ogg   — oszczędny, echoiczny, górski
  title.mp3/.ogg           — menu główne, uroczyste
  reward.mp3/.ogg          — fanfara po levelu, 10 sekund

SFX (MP3 + OGG):
  sfx_jump.mp3/.ogg        — skok, 8-bit bounce
  sfx_land.mp3/.ogg        — lądowanie
  sfx_ability_charge.mp3   — ładowanie zdolności
  sfx_ability_fire.mp3     — użycie zdolności (generic)
  sfx_enemy_hit.mp3        — trafienie wroga
  sfx_player_hurt.mp3      — gracz trafiony
  sfx_collect_sign.mp3     — zebranie tabliczki
  sfx_collect_feather.mp3  — zdobycie pióra feniksa
  sfx_quiz_correct.mp3     — poprawna odpowiedź
  sfx_quiz_wrong.mp3       — błędna odpowiedź
  sfx_ui_click.mp3         — klik przycisku UI

Głosy ptaków (autentyczne, CC BY z xeno-canto.org):
  bird_bielik.mp3          — głos bielika
  bird_zuraw.mp3           — trąbienie żurawia
  bird_dzieciol.mp3        — kucie dzięcioła
  bird_zimorodek.mp3       — świst zimorodka
  bird_puchacz.mp3         — "bubo" puchacza
  bird_bocian.mp3          — klekotanie bociana
```

### Ładowanie audio w BootScene

```javascript
// Muzyka
this.load.audio('music_level1', ['assets/audio/level1_spring.mp3', 'assets/audio/level1_spring.ogg']);

// SFX
this.load.audio('sfx_jump', ['assets/audio/sfx_jump.mp3', 'assets/audio/sfx_jump.ogg']);

// Użycie w scenie:
this.sound.play('sfx_jump', { volume: 0.5 });
const music = this.sound.add('music_level1', { loop: true, volume: 0.3 });
music.play();
```

## UI — elementy (tileset_ui.png)

```
Serce pełne:        16×16 px, pozycja [0,0] w tileset_ui
Serce puste:        16×16 px, pozycja [16,0]
Pasek energii bg:   96×12 px (tło paska)
Pasek energii fill: 94×10 px (wypełnienie)
Dymek "Naciśnij E": 64×24 px, pixel speech bubble
Tabliczka drewniana: 160×120 px (modal tabliczki tło)
Ikonka prędkości:   12×12 px (ptaszek ze strzałką)
Ikonka skoku:       12×12 px (ptaszek z łukiem)
Pieczęć odznaki:    80×80 px (okrągła, woskowa)
```
