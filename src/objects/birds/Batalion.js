import Bird from '../Bird.js'

const DISPLAY_RADIUS   = 150
const DISPLAY_DURATION = 350    // animation hold time (ms)
const DISPLAY_STUN     = 2200   // how long enemies stay frozen (ms)
const DISPLAY_COOLDOWN = 2000

export default class Batalion extends Bird {
  constructor(scene, x, y) {
    super(scene, x, y, 'batalion_idle')

    this.displayKey      = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.displayCooldown = 0

    // Set by level scene after enemies group is created
    this.onDisplay = null
  }

  get _idleAnimKey() { return 'batalion_idle_anim' }
  get _walkAnimKey() { return 'batalion_walk' }
  get _jumpAnimKey() { return 'batalion_jump' }
  get _fallAnimKey() { return 'batalion_fall' }
  get _skidAnimKey() { return 'batalion_skid' }

  update(delta) {
    super.update(delta)

    const time = this.scene.time.now
    if (Phaser.Input.Keyboard.JustDown(this.displayKey) && time > this.displayCooldown) {
      this.displayCooldown = time + DISPLAY_COOLDOWN
      this._activateDisplay(time)
    }
  }

  _activateDisplay(time) {
    this.setVelocityX(0)
    this._animState  = 'display'
    this._boostUntil = time + DISPLAY_DURATION

    // Visual: pulsing scale to simulate ruff puff-up
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 120,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut',
      onComplete: () => this.setScale(1),
    })

    // Radiating ring effect
    const ring = this.scene.add.circle(this.x, this.y, 10, 0xff9933, 0.7).setDepth(8)
    this.scene.tweens.add({
      targets: ring,
      radius: DISPLAY_RADIUS,
      alpha: 0,
      duration: 400,
      ease: 'Sine.easeOut',
      onComplete: () => ring.destroy(),
    })

    // Stun enemies in radius
    this.onDisplay?.(this.x, this.y, DISPLAY_RADIUS, DISPLAY_STUN)
  }
}
