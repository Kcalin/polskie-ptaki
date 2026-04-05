import { GAME_CONFIG } from '../config.js'

export default class Bird extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, idleKey = 'batalion_idle') {
    super(scene, x, y, idleKey)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.body.setSize(36, 52)
    this.body.setOffset(14, 6)

    this.cursors = scene.input.keyboard.createCursorKeys()
    const K = Phaser.Input.Keyboard.KeyCodes
    this._wasd = {
      up:    scene.input.keyboard.addKey(K.W),
      left:  scene.input.keyboard.addKey(K.A),
      right: scene.input.keyboard.addKey(K.D),
    }
    this.isOnGround = false

    this._animState = null
    this._invincibleUntil = 0   // timestamp — hits ignored while now < this
  }

  update(delta = 16) {
    const onGround = this.body.blocked.down
    this.isOnGround = onGround

    // Block all player input while a modal/sign is open
    if (this.inputBlocked) {
      this.setVelocityX(0)
      this._updateAnim(delta)
      return
    }

    // Don't override horizontal velocity while a special boost is active
    const now = this.scene.time.now
    if (!this._boostUntil || now > this._boostUntil) {
      if (this.cursors.left.isDown || this._wasd.left.isDown) {
        this.setVelocityX(-GAME_CONFIG.playerSpeed)
        this.setFlipX(true)
      } else if (this.cursors.right.isDown || this._wasd.right.isDown) {
        this.setVelocityX(GAME_CONFIG.playerSpeed)
        this.setFlipX(false)
      } else {
        this.setVelocityX(0)
      }
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
                     || Phaser.Input.Keyboard.JustDown(this._wasd.up)
    if (jumpPressed && onGround) {
      this.setVelocityY(GAME_CONFIG.jumpVelocity)
    }

    this._updateAnim(delta)
  }

  // Subclasses override any of these; null = fallback to next in chain
  get _idleAnimKey() { return null }
  get _walkAnimKey() { return null }
  get _runAnimKey()  { return null }
  get _jumpAnimKey() { return null }
  get _fallAnimKey() { return null }
  get _skidAnimKey() { return null }

  _animKeyFor(state) {
    switch (state) {
      case 'idle': return this._idleAnimKey
      case 'walk': return this._walkAnimKey ?? this._idleAnimKey
      case 'run':  return this._runAnimKey  ?? this._walkAnimKey ?? this._idleAnimKey
      case 'jump': return this._jumpAnimKey ?? this._idleAnimKey
      case 'fall': return this._fallAnimKey ?? this._jumpAnimKey ?? this._idleAnimKey
      case 'skid': return this._skidAnimKey ?? this._walkAnimKey ?? this._idleAnimKey
      default:     return this._idleAnimKey
    }
  }

  _updateAnim(_delta) {
    if (this._boostUntil && this.scene.time.now < this._boostUntil) return

    const vx     = this.body.velocity.x
    const vy     = this.body.velocity.y
    const moving = Math.abs(vx) > 10
    const inAir  = !this.body.blocked.down
    const skid   = moving && ((this.flipX && vx > 50) || (!this.flipX && vx < -50))

    let state
    if (inAir)        state = vy > 50 ? 'fall' : 'jump'
    else if (skid)    state = 'skid'
    else if (moving)  state = 'walk'
    else              state = 'idle'

    if (state !== this._animState) {
      this._animState = state
      this.play(this._animKeyFor(state), true)
    }
  }
}
