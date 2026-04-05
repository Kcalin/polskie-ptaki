import Enemy from '../Enemy.js'

export default class Wolf extends Enemy {
  constructor(scene, x, y, options) {
    // wolf sprite generated facing LEFT → facingRight: false
    super(scene, x, y, 'wolf_idle', 'wolf_idle', 'wolf_walk', {
      facingRight: false,
      speed: 70,
      ...options,
    })
  }
}
