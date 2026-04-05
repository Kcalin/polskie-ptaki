export default class EducationSign extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene, signsData) {
    super(scene.physics.world, scene)

    this.scene = scene
    this._signs = []

    for (const data of signsData) {
      const sign = scene.physics.add.staticSprite(
        data.position.x,
        data.position.y,
        data.isHidden ? 'sign_hidden' : 'sign'
      )
      sign.signData = data
      sign.body.setSize(24, 24)
      this._signs.push(sign)

      // Prompt label above sign
      const label = scene.add.text(data.position.x, data.position.y - 28, '▲ E', {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: '#ffff88',
        stroke: '#333',
        strokeThickness: 2,
      }).setOrigin(0.5, 1)

      // Pulse the label
      scene.tweens.add({
        targets: label,
        y: data.position.y - 34,
        duration: 700,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      })

      if (data.isHidden) {
        sign.setAlpha(0)
        label.setAlpha(0)
        sign._label = label
        sign._revealed = false
      } else {
        sign._label = label
      }
    }
  }

  getSigns() {
    return this._signs
  }

  revealHidden(sign) {
    if (sign.signData.isHidden && !sign._revealed) {
      sign._revealed = true
      sign.setAlpha(1)
      sign._label.setAlpha(1)
      this.scene.tweens.add({
        targets: sign,
        alpha: 1,
        duration: 400,
        ease: 'Linear',
      })
    }
  }
}
