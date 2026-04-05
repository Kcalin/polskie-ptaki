import Enemy from '../Enemy.js'

export default class Fox extends Enemy {
  constructor(scene, x, y, options) {
    super(scene, x, y, 'fox', options)
    this.body.setSize(32, 28)
  }
}
