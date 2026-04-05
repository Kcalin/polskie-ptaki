import Enemy from '../Enemy.js'

export default class Crow extends Enemy {
  constructor(scene, x, y, options) {
    // crow/jay sprite generated facing LEFT → facingRight: false
    super(scene, x, y, 'crow_idle', 'crow_idle', 'crow_walk', {
      facingRight: false,
      speed: 60,
      ...options,
    })
    this.body.setSize(40, 40)
    this.body.setOffset(12, 24)
    // Crows sit on platforms — cancel extra gravity so they don't slide off
    this.body.setGravityY(-this.scene.physics.world.gravity.y)
  }
}
