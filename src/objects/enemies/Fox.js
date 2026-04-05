import Enemy from '../Enemy.js'

export default class Fox extends Enemy {
  constructor(scene, x, y, options) {
    super(scene, x, y, 'fox_idle', 'fox_idle', 'fox_walk', options)
    this.body.setSize(48, 52)
    this.body.setOffset(8, 8)
  }
}
