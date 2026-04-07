import Phaser from 'phaser'
import { GAME_CONFIG } from './config.js'
import BootScene from './scenes/BootScene.js'
import TitleScene from './scenes/TitleScene.js'
import Level1Scene from './scenes/Level1Scene.js'
import UIScene from './scenes/UIScene.js'
import EndScene from './scenes/EndScene.js'
import TouchScene from './systems/TouchScene.js'

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GAME_CONFIG.gravity },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, Level1Scene, UIScene, TouchScene, EndScene],
}

const game = new Phaser.Game(config)

// Force scale refresh after orientation change — browser updates dimensions
// asynchronously so Phaser's own resize handler fires too early.
const _refreshScale = () => setTimeout(() => game.scale.refresh(), 150)
window.addEventListener('orientationchange', _refreshScale)
screen.orientation?.addEventListener('change', _refreshScale)

// Dev helper — run in browser console to reset all saved progress:
//   clearSave()
import SaveSystem from './systems/SaveSystem.js'
window.clearSave = () => { SaveSystem.clearAll(); location.reload() }
