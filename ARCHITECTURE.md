# ARCHITECTURE.md — Architektura techniczna

## Stack technologiczny

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| Framework gry | Phaser.js 3.x | Dedykowany do 2D WebGL/Canvas, platformówki out-of-box |
| Bundler | Vite 5.x | HMR, szybki build, zero config dla Phaser |
| Język | JavaScript ES6+ | Brak TS na MVP — prostszy onboarding |
| Mapy poziomów | Tiled Map Editor → JSON | Wizualny edytor, eksport kompatybilny z Phaser |
| Zapis | localStorage | Brak backendu, zero auth |
| Hosting | GitHub Pages / Netlify | Statyczne pliki, HTTPS, CDN, free tier |
| Grafika | PixelLab.ai + Aseprite | AI-assisted pixel art + ręczna animacja |
| Audio | MP3 + OGG (oba formaty) | Kompatybilność cross-browser |

## Inicjalizacja projektu

```bash
npm create vite@latest skrzydla-nad-polska -- --template vanilla
cd skrzydla-nad-polska
npm install phaser
npm install -D vite
```

## Konfiguracja Phaser (src/config.js)

```javascript
import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import BirdSelectScene from './scenes/BirdSelectScene.js';
import Level1Scene from './scenes/Level1Scene.js';
import UIScene from './scenes/UIScene.js';
import SignScene from './scenes/SignScene.js';
import EndScene from './scenes/EndScene.js';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const config = {
  type: Phaser.AUTO,           // WebGL z fallbackiem na Canvas
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: import.meta.env.DEV  // debug tylko w dev
    }
  },
  scene: [
    BootScene,
    TitleScene,
    BirdSelectScene,
    Level1Scene,
    // Level2Scene, Level3Scene, Level4Scene — dodać gdy będą gotowe
    UIScene,      // równoległa scena HUD
    SignScene,    // równoległa scena modalu tabliczki
    EndScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,      // skaluj do okna zachowując proporcje
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
```

## Wzorzec sceny poziomów

Każda scena levelu dziedziczy ten sam wzorzec:

```javascript
// src/scenes/Level1Scene.js
import Phaser from 'phaser';
import { Bird } from '../objects/Bird.js';
import { EducationSign } from '../objects/EducationSign.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import level1Signs from '../data/signs/level1.json';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1Scene' });
    this.levelId = 1;
    this.featherKey = 'spring_dawn';  // klucz z feathers.json
  }

  create() {
    this.map = this.make.tilemap({ key: 'level1' });
    // ... tileset, warstwy, kolizje

    // Ptak — typ przekazany z BirdSelectScene przez this.scene.start('Level1Scene', { birdId: 'bielik' })
    const { birdId } = this.scene.settings.data;
    this.player = BirdFactory.create(this, birdId, 100, 500);

    // Tabliczki
    this.signs = level1Signs.map(signData =>
      new EducationSign(this, signData)
    );

    // UI jako równoległa scena
    this.scene.launch('UIScene', { levelScene: this });
  }

  update(time, delta) {
    this.player.update(time, delta);
    // kolizje, wrogowie, itp.
  }

  // Wywoływane przez EducationSign przy dotknięciu
  openSign(signData) {
    this.scene.pause();
    this.scene.launch('SignScene', { signData, callerScene: 'Level1Scene' });
  }

  // Wywoływane gdy gracz dotrze do mety
  completeLevel() {
    const collected = this.signs.filter(s => s.collected).length;
    SaveSystem.saveLevel(this.levelId, { completed: true, signsCollected: collected });
    this.scene.start('EndScene', {
      levelId: this.levelId,
      featherKey: this.featherKey,
      signsCollected: collected,
      totalSigns: this.signs.length
    });
  }
}
```

## Klasa bazowa Bird (src/objects/Bird.js)

```javascript
import Phaser from 'phaser';

export class Bird extends Phaser.Physics.Arcade.Sprite {
  // Nadpisz w klasie potomnej:
  static STATS = {
    speed: 200,      // px/s poziomy
    jumpForce: -450, // ujemna wartość (w górę)
    canDoubleJump: false,
    ability: 'none'  // klucz zdolności specjalnej
  };
  static SPRITE_KEY = 'bird_base';  // klucz assetu załadowanego w BootScene

  constructor(scene, x, y) {
    const stats = new.target.STATS;  // statystyki klasy potomnej
    super(scene, x, y, new.target.SPRITE_KEY);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stats = stats;
    this.jumpsLeft = stats.canDoubleJump ? 2 : 1;
    this.abilityEnergy = 100;
    this.abilityCooldown = false;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      ability: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });
  }

  update(time, delta) {
    this._handleMovement();
    this._handleAbility(time);
    this._rechargeEnergy(delta);
  }

  _handleMovement() {
    const { left, right, up } = this.cursors;
    const speed = this.stats.speed;

    if (left.isDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
      this.anims.play(`${new.target.SPRITE_KEY}_run`, true);
    } else if (right.isDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
      this.anims.play(`${new.target.SPRITE_KEY}_run`, true);
    } else {
      this.setVelocityX(0);
      this.anims.play(`${new.target.SPRITE_KEY}_idle`, true);
    }

    const onGround = this.body.blocked.down;
    if (onGround) this.jumpsLeft = this.stats.canDoubleJump ? 2 : 1;

    if (Phaser.Input.Keyboard.JustDown(up) && this.jumpsLeft > 0) {
      this.setVelocityY(this.stats.jumpForce);
      this.jumpsLeft--;
      this.anims.play(`${new.target.SPRITE_KEY}_jump`, true);
    }
  }

  // Nadpisz w klasach potomnych
  _handleAbility(time) {}

  _rechargeEnergy(delta) {
    if (this.abilityEnergy < 100) {
      this.abilityEnergy = Math.min(100, this.abilityEnergy + delta * 0.02);
    }
  }

  // Emituje event do UIScene
  emitEnergyUpdate() {
    this.scene.events.emit('energyUpdate', this.abilityEnergy);
  }
}
```

## Przykład klasy potomnej (src/objects/birds/Bielik.js)

```javascript
import { Bird } from '../Bird.js';

export class Bielik extends Bird {
  static STATS = {
    speed: 280,
    jumpForce: -430,
    canDoubleJump: false,
    ability: 'talon_grab'
  };
  static SPRITE_KEY = 'bielik';

  _handleAbility(time) {
    const { ability } = this.keys;
    if (Phaser.Input.Keyboard.JustDown(ability) && this.abilityEnergy >= 30 && !this.abilityCooldown) {
      this.abilityEnergy -= 30;
      this.abilityCooldown = true;
      this._talonGrab();
      this.scene.time.delayedCall(2000, () => { this.abilityCooldown = false; });
      this.emitEnergyUpdate();
    }
  }

  _talonGrab() {
    // Tworzy obszar hitbox przed ptakiem, porywa małe obiekty/wrogów
    const direction = this.flipX ? -1 : 1;
    const grabZone = this.scene.add.zone(
      this.x + direction * 80, this.y, 60, 40
    );
    this.scene.physics.add.existing(grabZone);
    // Sprawdź overlap z wrogami — wróg zostaje "pochwycony" i uniesiony
    this.scene.time.delayedCall(200, () => grabZone.destroy());
  }
}
```

## SaveSystem (src/systems/SaveSystem.js)

```javascript
const SAVE_KEY = 'skrzydla_save_v1';

export const SaveSystem = {
  _load() {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
    } catch {
      return {};
    }
  },

  _save(data) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  },

  getSelectedBird() {
    return this._load().selectedBird || null;
  },

  setSelectedBird(birdId) {
    const data = this._load();
    data.selectedBird = birdId;
    this._save(data);
  },

  saveLevel(levelId, { completed, signsCollected, score }) {
    const data = this._load();
    if (!data.levels) data.levels = {};
    const prev = data.levels[levelId] || {};
    data.levels[levelId] = {
      completed: completed || prev.completed,
      signsCollected: Math.max(signsCollected || 0, prev.signsCollected || 0),
      bestScore: Math.max(score || 0, prev.bestScore || 0)
    };
    this._save(data);
  },

  getLevelData(levelId) {
    return (this._load().levels || {})[levelId] || null;
  },

  getCollectedFeathers() {
    return this._load().feathers || [];
  },

  addFeather(featherKey) {
    const data = this._load();
    if (!data.feathers) data.feathers = [];
    if (!data.feathers.includes(featherKey)) data.feathers.push(featherKey);
    this._save(data);
  },

  getBadges() {
    return this._load().badges || [];
  },

  addBadge(badgeKey) {
    const data = this._load();
    if (!data.badges) data.badges = [];
    if (!data.badges.includes(badgeKey)) data.badges.push(badgeKey);
    this._save(data);
  },

  reset() {
    localStorage.removeItem(SAVE_KEY);
  }
};
```

## Format mapy Tiled

Każdy level ma plik `public/assets/tilemaps/level1.json` z warstwami:

| Warstwa | Typ | Rola |
|---|---|---|
| `background` | Tile | Dekoracje, niebo, tła — brak kolizji |
| `platforms` | Tile | Główne platformy — kolizja włączona |
| `hazards` | Tile | Przeszkody środowiskowe — damage zone |
| `objects` | Object | Spawn enemies, tabliczki, pióro feniksa (punkty) |
| `foreground` | Tile | Elementy przed graczem — bez kolizji |

Ładowanie w scenie:
```javascript
// W BootScene preload():
this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
this.load.image('tileset_spring', 'assets/sprites/tileset_spring.png');

// W Level1Scene create():
const map = this.make.tilemap({ key: 'level1' });
const tileset = map.addTilesetImage('tileset_spring', 'tileset_spring');
const platforms = map.createLayer('platforms', tileset);
platforms.setCollisionByProperty({ collides: true });
this.physics.add.collider(this.player, platforms);
```

## Komunikacja między scenami

Phaser umożliwia równoległe sceny. Wzorzec komunikacji:

```javascript
// Level1Scene → UIScene (eventy przez emitter sceny)
this.events.emit('livesUpdate', this.lives);
this.events.emit('energyUpdate', this.player.abilityEnergy);

// UIScene nasłuchuje:
const levelScene = this.scene.get('Level1Scene');
levelScene.events.on('livesUpdate', (lives) => this._renderHearts(lives));

// SignScene ← Level1Scene (dane przez scene.launch)
this.scene.launch('SignScene', { signData, callerScene: 'Level1Scene' });

// SignScene → Level1Scene (resume po zamknięciu)
// w SignScene:
this.scene.resume(this.callerScene);
this.scene.stop();
```

## Konwencje kodu

- Nazwy scen: `PascalCase` + sufiks `Scene` (np. `Level1Scene`)
- Nazwy klas obiektów: `PascalCase` bez sufiksu (np. `Bielik`, `Fox`)
- Eventy: `camelCase` (np. `livesUpdate`, `signCollected`)
- Klucze assetów: `snake_case` (np. `bielik_idle`, `tileset_spring`)
- Klucze JSON w data/: `camelCase` (np. `birdId`, `signText`)
- Komentarze po polsku (projekt polskojęzyczny)

## Zmienne środowiskowe (Vite)

```javascript
// vite.config.js
export default {
  base: '/skrzydla-nad-polska/',  // dla GitHub Pages — zmień na '/' dla Netlify
}

// W kodzie:
if (import.meta.env.DEV) { /* tylko w dev */ }
```
