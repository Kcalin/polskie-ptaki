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
    this.patrolLeft   = patrolLeft  ?? x - 120
    this.patrolRight  = patrolRight ?? x + 120
    this.speed        = speed
    this._dir         = 1
    this._facingRight = facingRight
    this._idleAnim    = idleAnim
    this._walkAnim    = walkAnim

    this.setVelocityX(this.speed)
    if (walkAnim) this.play(walkAnim, true)
    this._applyFlip()
  }

  _applyFlip() {
    // If sprite faces right: flipX=false → right, flipX=true → left
    // If sprite faces left:  flipX=false → left, flipX=true → right
    const movingRight = this._dir > 0
    this.setFlipX(this._facingRight ? !movingRight : movingRight)
  }

  update() {
    if (this.x >= this.patrolRight) {
      this._dir = -1
      this._applyFlip()
    } else if (this.x <= this.patrolLeft) {
      this._dir = 1
      this._applyFlip()
    }
    this.setVelocityX(this._dir * this.speed)
  }
}
