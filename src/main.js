import Phaser from 'phaser'
import { GAME_CONFIG } from './config.js'
import BootScene from './scenes/BootScene.js'
import TitleScene from './scenes/TitleScene.js'
import Level1Scene from './scenes/Level1Scene.js'
import UIScene from './scenes/UIScene.js'
import EndScene from './scenes/EndScene.js'

const config = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  backgroundColor: '#1a1a2e',
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
  scene: [BootScene, TitleScene, Level1Scene, UIScene, EndScene],
}

new Phaser.Game(config)

// Dev helper — run in browser console to reset all saved progress:
//   clearSave()
import SaveSystem from './systems/SaveSystem.js'
window.clearSave = () => { SaveSystem.clearAll(); location.reload() }
