import { GAME_CONFIG } from '../config.js'

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.body.setSize(36, 40)
    this.body.setOffset(6, 8)

    this.cursors = scene.input.keyboard.createCursorKeys()
    this.isOnGround = false
  }

  update() {
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
  }
}
