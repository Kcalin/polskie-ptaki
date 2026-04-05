export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false })
    this.lives = 3
    this.level = 1
    this._heartImages = []
  }

  init(data) {
    this.lives = 3
    this.level = data.level ?? 1
  }

  create() {
    const { width } = this.scale

    // Pixel-art hearts (sprites, not text)
    this._heartImages = []
    for (let i = 0; i < 3; i++) {
      const img = this.add.image(20 + i * 26, 20, 'heart_full').setOrigin(0, 0)
      this._heartImages.push(img)
    }

    // Level label — pixel-art feel with stroke
    this.add.text(width / 2, 14, 'Biebrza — Wiosna', {
      fontSize: '16px',
      fontFamily: '"Courier New", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5, 0)
  }

  loseLife() {
    this.lives = Math.max(0, this.lives - 1)
    this._heartImages.forEach((img, i) => {
      img.setTexture(i < this.lives ? 'heart_full' : 'heart_empty')
    })
  }
}
