import Bocian from '../objects/birds/Bocian.js'
import SaveSystem from '../systems/SaveSystem.js'

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene')
  }

  create() {
    const { width, height } = this.scale

    // Background sky gradient
    this.add.rectangle(width / 2, height / 2, width, height, 0x87ceeb)

    // Camera world bounds (level is wider than screen)
    const levelWidth = 6400
    this.physics.world.setBounds(0, 0, levelWidth, height)
    this.cameras.main.setBounds(0, 0, levelWidth, height)

    // --- Ground and platforms (placeholder geometry) ---
    this.platforms = this.physics.add.staticGroup()

    // Ground tiles
    for (let x = 0; x < levelWidth; x += 16) {
      const tile = this.platforms.create(x + 8, height - 8, 'ground')
      tile.setScale(1).refreshBody()
    }

    // Some platforms
    const platformDefs = [
      { x: 300, y: height - 120, w: 5 },
      { x: 500, y: height - 200, w: 4 },
      { x: 750, y: height - 160, w: 6 },
      { x: 1000, y: height - 240, w: 5 },
      { x: 1200, y: height - 120, w: 8 },
      { x: 1500, y: height - 200, w: 4 },
      { x: 1800, y: height - 280, w: 5 },
      { x: 2100, y: height - 160, w: 6 },
    ]

    for (const def of platformDefs) {
      for (let i = 0; i < def.w; i++) {
        const tile = this.platforms.create(def.x + i * 16, def.y, 'platform')
        tile.refreshBody()
      }
    }

    // --- Player ---
    this.player = new Bocian(this, 100, height - 100)
    this.physics.add.collider(this.player, this.platforms)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // --- HUD overlay scene ---
    this.scene.launch('UIScene', { level: 1, player: this.player })

    // --- Save checkpoint on enter ---
    SaveSystem.setLastLevel(1)
  }

  update() {
    this.player.update()
  }
}
