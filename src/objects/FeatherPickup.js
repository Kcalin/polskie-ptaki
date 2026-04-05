import SaveSystem from '../systems/SaveSystem.js'

export default class FeatherPickup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene, levelId, featherData) {
    super(scene.physics.world, scene)

    this.scene   = scene
    this.levelId = levelId

    for (const data of featherData) {
      // Skip if already collected in this session
      // (SaveSystem check disabled so feather always reappears on level restart)
      // if (SaveSystem.isFeatherCollected(levelId, data.key)) continue

      const pickup = this.create(data.x, data.y, 'feather')
      pickup.featherData = data
      pickup.setScale(2)              // 2× size — easier to see
      pickup.body.setSize(32, 32)
      pickup.refreshBody()

      // Floating tween (visual only — static body stays at data.y)
      scene.tweens.add({
        targets:  pickup,
        y:        data.y - 10,
        duration: 900,
        ease:     'Sine.easeInOut',
        yoyo:     true,
        repeat:   -1,
      })

      // Light-beam beacon so player can spot feather from far away
      this._addBeacon(scene, data.x, data.y)
    }
  }

  _addBeacon(scene, x, y) {
    const g = scene.add.graphics().setDepth(2)

    // Vertical golden light column
    const drawBeacon = () => {
      g.clear()
      const alpha = 0.10 + 0.06 * Math.sin(scene.time.now / 400)
      g.fillStyle(0xffe066, alpha)
      g.fillRect(x - 10, 0, 20, y - 20)   // column from top of screen to just above feather
    }

    scene.events.on('update', drawBeacon)

    // Glow rings at feather position
    const glow = scene.add.graphics().setDepth(2)
    scene.tweens.add({
      targets: {},
      duration: 1200,
      repeat: -1,
      onUpdate: (tween) => {
        glow.clear()
        const t = tween.progress
        glow.fillStyle(0xffe066, 0.25 * (1 - t))
        glow.fillCircle(x, y, 8 + 28 * t)
      },
    })
  }

  collect(pickup, onCollect) {
    SaveSystem.setFeatherCollected(this.levelId, pickup.featherData.key)
    pickup.destroy()
    onCollect?.(pickup.featherData)
  }
}
