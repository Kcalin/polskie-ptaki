export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false })
    this.lives = 3
    this.level = 1
  }

  init(data) {
    this.level = data.level ?? 1
  }

  create() {
    const { width } = this.scale

    // Hearts
    this.heartsText = this.add.text(20, 16, this._heartsString(), {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ff4444',
    })

    // Level info
    this.add.text(width / 2, 16, 'Biebrza — Wiosna', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0)
  }

  _heartsString() {
    return '♥'.repeat(this.lives) + '♡'.repeat(Math.max(0, 3 - this.lives))
  }

  loseLife() {
    this.lives = Math.max(0, this.lives - 1)
    this.heartsText.setText(this._heartsString())
  }
}
