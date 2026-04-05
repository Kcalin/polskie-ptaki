import Bird from '../Bird.js'

const GUST_RADIUS   = 130
const GUST_DURATION = 380
const GUST_COOLDOWN = 1600

export default class Bocian extends Bird {
  constructor(scene, x, y) {
    super(scene, x, y, 'bocian_idle')

    this.gustKey      = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.gustCooldown = 0

    // Set by Level1Scene after enemies group is created
    this.onGust = null
  }

  update(delta) {
    super.update(delta)

    const time = this.scene.time.now

    if (Phaser.Input.Keyboard.JustDown(this.gustKey) && time > this.gustCooldown) {
      this.gustCooldown = time + GUST_COOLDOWN

      // Freeze bird in place during gust — fix: explicit zero so bird doesn't drift
      this.setVelocityX(0)

      // Mark animState as 'gust' so _updateAnim re-evaluates cleanly after boost
      this._animState   = 'gust'
      this._boostUntil  = time + GUST_DURATION
      this.play('bocian_gust', true)
      this._fireGust()
    }
  }

  _fireGust() {
    const scene  = this.scene
    const cx     = this.x
    const cy     = this.y
    const facing = this.flipX ? -1 : 1

    const gustSprites = ['gust_f1', 'gust_f2', 'gust_f3']
    const delays      = [0, 100, 200]
    const sizes       = [1.0, 1.4, 2.0]

    gustSprites.forEach((key, i) => {
      if (!scene.textures.exists(key)) return
      scene.time.delayedCall(delays[i], () => {
        const sprite = scene.add.image(
          cx + facing * (20 + i * 24),
          cy,
          key
        )
          .setScale(sizes[i])
          .setFlipX(facing < 0)
          .setDepth(8)
          .setAlpha(0.85)

        scene.tweens.add({
          targets: sprite,
          x: sprite.x + facing * 40,
          alpha: 0,
          scaleX: sizes[i] * 1.3,
          duration: 280 - i * 30,
          ease: 'Sine.easeOut',
          onComplete: () => sprite.destroy(),
        })
      })
    })

    // Defeat enemies in radius
    this.onGust?.(cx, cy, GUST_RADIUS)
  }
}
