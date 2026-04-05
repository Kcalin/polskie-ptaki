import Bird from '../Bird.js'

export default class Bocian extends Bird {
  constructor(scene, x, y) {
    super(scene, x, y, 'bocian')

    // Bocian special: wing_gust — horizontal dash (SHIFT)
    this.gustKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.gustCooldown = 0
    this.gustDuration = 200  // ms
    this.gustTimer = 0
  }

  update() {
    super.update()

    const time = this.scene.time.now

    if (Phaser.Input.Keyboard.JustDown(this.gustKey) && time > this.gustCooldown) {
      const dir = this.flipX ? -1 : 1
      this.setVelocityX(dir * 600)
      this.gustCooldown = time + 1500
      this.gustTimer = time + this.gustDuration
    }
  }
}
