export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Placeholder graphics: colored rectangles instead of sprites
    const graphics = this.make.graphics({ x: 0, y: 0, add: false })

    // Player (bocian) placeholder — white 48x48
    graphics.fillStyle(0xffffff)
    graphics.fillRect(0, 0, 48, 48)
    graphics.generateTexture('bocian', 48, 48)
    graphics.clear()

    // Ground tile placeholder — green 16x16
    graphics.fillStyle(0x4a7c3f)
    graphics.fillRect(0, 0, 16, 16)
    graphics.generateTexture('ground', 16, 16)
    graphics.clear()

    // Platform tile placeholder — brown 16x16
    graphics.fillStyle(0x8b5e3c)
    graphics.fillRect(0, 0, 16, 16)
    graphics.generateTexture('platform', 16, 16)
    graphics.clear()

    // Education sign placeholder — yellow 24x24
    graphics.fillStyle(0xffd700)
    graphics.fillRect(0, 0, 24, 24)
    graphics.generateTexture('sign', 24, 24)
    graphics.clear()

    // Feather pickup placeholder — cyan 16x16
    graphics.fillStyle(0x00ffff)
    graphics.fillRect(0, 0, 16, 16)
    graphics.generateTexture('feather', 16, 16)
    graphics.clear()

    graphics.destroy()
  }

  create() {
    this.scene.start('TitleScene')
  }
}
