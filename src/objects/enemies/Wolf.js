import Enemy from '../Enemy.js'

export default class Wolf extends Enemy {
  constructor(scene, x, y, options) {
    // wolf sprite generated facing LEFT → facingRight: false
    super(scene, x, y, 'wolf_idle', 'wolf_idle', 'wolf_walk', {
      facingRight: false,
      speed: 70,
      ...options,
    })
    this._idling = false
    this._scheduleNextPause()
  }

  _scheduleNextPause() {
    const delay = Phaser.Math.Between(4000, 9000)
    this.scene.time.delayedCall(delay, this._startIdle, [], this)
  }

  _startIdle() {
    if (this._dead) return
    this._idling = true
    this.setVelocityX(0)
    this.play('wolf_idle', true)
    const duration = Phaser.Math.Between(1500, 3000)
    this.scene.time.delayedCall(duration, this._endIdle, [], this)
  }

  _endIdle() {
    if (this._dead) return
    this._idling = false
    this.play('wolf_walk', true)
    this._scheduleNextPause()
  }

  update() {
    if (this._idling) return
    super.update()
  }
}
