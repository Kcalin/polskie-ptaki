export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {boolean} [opts.facingRight=true] - true if the sprite art faces right.
   *   Set false when the source image faces left (e.g. fox generated facing left).
   */
  constructor(scene, x, y, texture, idleAnim, walkAnim,
              { patrolLeft, patrolRight, speed = 80, facingRight = true } = {}) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.body.setOffset(0, -11)   // shift body up → sprite appears lower
    this.patrolLeft   = patrolLeft  ?? x - 120
    this.patrolRight  = patrolRight ?? x + 120
    this.speed        = speed
    this._dir         = 1
    this._facingRight = facingRight
    this._idleAnim    = idleAnim
    this._walkAnim    = walkAnim
    this._dead        = false

    this.setVelocityX(this.speed)
    if (walkAnim) this.play(walkAnim, true)
    this._applyFlip()
  }

  _applyFlip() {
    const movingRight = this._dir > 0
    this.setFlipX(this._facingRight ? !movingRight : movingRight)
  }

  update() {
    if (this._dead) return
    if (this._stunUntil && this.scene.time.now < this._stunUntil) return
    if (this.x >= this.patrolRight) {
      this._dir = -1
      this._applyFlip()
    } else if (this.x <= this.patrolLeft) {
      this._dir = 1
      this._applyFlip()
    }
    this.setVelocityX(this._dir * this.speed)
  }

  /** Temporarily freeze enemy (batalion display ability) */
  stun(duration) {
    if (this._dead || this._stunUntil > this.scene.time.now) return
    this._stunUntil = this.scene.time.now + duration
    this.setVelocityX(0)
    this.setTint(0xaaaaff)
    this.scene.time.delayedCall(duration, () => {
      if (!this._dead) { this.clearTint() }
    })
  }

  /** Called when stomped from above or hit by wing gust */
  defeat() {
    if (this._dead) return
    this._dead = true
    this.setVelocityX(0)
    this.disableBody(true, false)   // stop physics, keep visible briefly

    this.scene.tweens.add({
      targets: this,
      y: this.y - 40,
      alpha: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => this.destroy(),
    })

    // Small score pop — "★" above enemy
    const pop = this.scene.add.text(this.x, this.y - 20, '★', {
      fontSize: '20px', color: '#ffdd44', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10)
    this.scene.tweens.add({
      targets: pop, y: pop.y - 40, alpha: 0, duration: 600,
      onComplete: () => pop.destroy(),
    })
  }
}
