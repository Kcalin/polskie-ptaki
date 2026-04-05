export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene')
  }

  create() {
    const { width, height } = this.scale

    this.add.rectangle(width / 2, height / 2, width, height, 0x1a3a5c)

    this.add.text(width / 2, height / 2 - 100, 'Skrzydła nad Polską', {
      fontSize: '56px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 2, 'Odkryj polskie parki narodowe!', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#aaddff',
    }).setOrigin(0.5)

    const startText = this.add.text(width / 2, height / 2 + 120, 'Naciśnij SPACJĘ aby zacząć', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffdd44',
    }).setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 600,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Level1Scene')
    })
  }
}
