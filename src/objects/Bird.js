import { GAME_CONFIG } from '../config.js'

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, idleKey = 'bocian_idle') {
    super(scene, x, y, idleKey)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.body.setSize(36, 52)
    this.body.setOffset(14, 6)

    this.cursors = scene.input.keyboard.createCursorKeys()
    this.isOnGround = false

    this._animState = 'idle'
    this._frameIndex = 0
    this._frameTick = 0
  }

  update(delta = 16) {
    const onGround = this.body.blocked.down
    this.isOnGround = onGround

    if (this.cursors.left.isDown) {
      this.setVelocityX(-GAME_CONFIG.playerSpeed)
      this.setFlipX(true)
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(GAME_CONFIG.playerSpeed)
      this.setFlipX(false)
    } else {
      this.setVelocityX(0)
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && onGround) {
      this.setVelocityY(GAME_CONFIG.jumpVelocity)
    }

    this._updateAnim(delta)
  }

  _updateAnim(_delta) {
    const moving = Math.abs(this.body.velocity.x) > 10
    const inAir  = !this.body.blocked.down

    if (inAir) {
      if (this._animState !== 'jump') {
        this._animState = 'jump'
        this.play('bocian_jump', true)
      }
    } else if (moving) {
      if (this._animState !== 'walk') {
        this._animState = 'walk'
        this.play('bocian_walk', true)
      }
    } else {
      if (this._animState !== 'idle') {
        this._animState = 'idle'
        this.play('bocian_idle_anim', true)
      }
    }
  }
}
