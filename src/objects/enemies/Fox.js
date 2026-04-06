import Enemy from '../Enemy.js'

export default class Fox extends Enemy {
  constructor(scene, x, y, options) {
    // fox sprite generated facing LEFT → facingRight: false
    super(scene, x, y, 'fox_idle', 'fox_idle', 'fox_walk', { facingRight: false, ...options })
    this._idling = false
    this._scheduleNextPause()
  }

  _scheduleNextPause() {
    const delay = Phaser.Math.Between(4000, 8000)
    this.scene.time.delayedCall(delay, this._startIdle, [], this)
  }

  _startIdle() {
    if (this._dead) return
    this._idling = true
    this.setVelocityX(0)
    this.play('fox_idle', true)
    const duration = Phaser.Math.Between(1500, 3000)
    this.scene.time.delayedCall(duration, this._endIdle, [], this)
  }

  _endIdle() {
    if (this._dead) return
    this._idling = false
    this.play('fox_walk', true)
    this._scheduleNextPause()
  }

  update() {
    if (this._idling) return
    super.update()
  }
}
