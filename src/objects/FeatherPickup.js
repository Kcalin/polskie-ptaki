import SaveSystem from '../systems/SaveSystem.js'

export default class FeatherPickup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene, levelId, featherData) {
    super(scene.physics.world, scene)

    this.scene = scene
    this.levelId = levelId

    for (const data of featherData) {
      if (SaveSystem.isFeatherCollected(levelId, data.key)) continue

      const pickup = scene.physics.add.staticSprite(data.x, data.y, 'feather')
      pickup.featherData = data
      pickup.body.setSize(16, 16)

      // Glow tween
      scene.tweens.add({
        targets: pickup,
        y: data.y - 8,
        duration: 900,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }

  collect(pickup, onCollect) {
    SaveSystem.setFeatherCollected(this.levelId, pickup.featherData.key)
    pickup.destroy()
    onCollect?.(pickup.featherData)
  }
}
