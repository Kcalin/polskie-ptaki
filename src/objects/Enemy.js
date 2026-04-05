export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, idleAnim, walkAnim, { patrolLeft, patrolRight, speed = 80 } = {}) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.patrolLeft  = patrolLeft  ?? x - 120
    this.patrolRight = patrolRight ?? x + 120
    this.speed = speed
    this._dir = 1
    this._idleAnim = idleAnim
    this._walkAnim = walkAnim

    this.setVelocityX(this.speed)
    if (walkAnim) this.play(walkAnim, true)
  }

  update() {
    if (this.x >= this.patrolRight) {
      this._dir = -1
      this.setFlipX(true)
    } else if (this.x <= this.patrolLeft) {
      this._dir = 1
      this.setFlipX(false)
    }
    this.setVelocityX(this._dir * this.speed)
  }
}
