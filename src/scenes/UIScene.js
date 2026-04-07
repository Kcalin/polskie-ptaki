export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false })
    this.lives = 3
    this.level = 1
    this._heartImages = []
    this._signImages = []
    this._totalSigns = 0
    this._openedSigns = 0
  }

  init(data) {
    this.lives = 3
    this.level = data.level ?? 1
    this._openedSigns = 0
    this._totalSigns = 0
  }

  create() {
    const { width } = this.scale

    // Pixel-art hearts (sprites, not text)
    this._heartImages = []
    for (let i = 0; i < 3; i++) {
      const img = this.add.image(20 + i * 26, 20, 'heart_full').setOrigin(0, 0)
      this._heartImages.push(img)
    }

    // Sign counter — populated once Level1Scene calls initSignCounter()
    this._signImages = []
    this._signStartX = 20 + 3 * 26 + 14  // right of hearts + gap

    // Level label
    this.add.text(width / 2, 10, 'Biebrza — Wiosna', {
      fontSize: '32px',
      fontFamily: '"Courier New", monospace',
      color: '#ffe066',
      stroke: '#3a1500',
      strokeThickness: 8,
      shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true },
    }).setOrigin(0.5, 0)
  }

  /** Called by Level1Scene once signs are known */
  initSignCounter(total) {
    this._totalSigns = total
    this._openedSigns = 0
    this._signImages.forEach(img => img.destroy())
    this._signImages = []
    for (let i = 0; i < total; i++) {
      const img = this.add.image(this._signStartX + i * 21, 20, 'sign_icon_empty').setOrigin(0, 0)
      this._signImages.push(img)
    }
  }

  /** Called by Level1Scene each time a sign is opened */
  updateSignCount(opened) {
    this._openedSigns = opened
    this._signImages.forEach((img, i) => {
      img.setTexture(i < opened ? 'sign_icon_full' : 'sign_icon_empty')
    })
  }

  /** Returns true when the last life is lost */
  loseLife() {
    this.lives = Math.max(0, this.lives - 1)
    this._refreshHearts()
    return this.lives === 0
  }

  /** Adds one life (max 3). Returns true if life was actually added. */
  gainLife() {
    if (this.lives >= 3) return false
    this.lives++
    this._refreshHearts()
    this._playGainEffect()
    return true
  }

  _refreshHearts() {
    this._heartImages.forEach((img, i) => {
      img.setTexture(i < this.lives ? 'heart_full' : 'heart_empty')
    })
  }

  _playGainEffect() {
    // Flash the newly filled heart
    const heart = this._heartImages[this.lives - 1]
    if (!heart) return
    this.tweens.add({
      targets: heart,
      scaleX: 1.6, scaleY: 1.6,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeOut',
    })
    // "+1 ♥" popup
    const { width } = this.scale
    const pop = this.add.text(20 + (this.lives - 1) * 26 + 10, 44, '+1 ♥', {
      fontSize: '14px', fontFamily: '"Courier New", monospace',
      color: '#ff6688', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5)
    this.tweens.add({
      targets: pop, y: pop.y - 28, alpha: 0,
      duration: 900, ease: 'Power2',
      onComplete: () => pop.destroy(),
    })
  }
}
