export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene')
  }

  create() {
    const { width, height } = this.scale
    const isTouch = this.sys.game.device.input.touch

    // Input — keyboard
    this.input.keyboard.once('keydown-SPACE', () => this._startGame())

    // ── PixelLab menu image fills the whole screen ──────────────────────────
    // menu_full_c.png: 400×224 → scaled to 1280×720
    // Frame center in source: ~(200, 80) → scaled: (640, 257)
    // "graj" button in source: ~(200, 163) → scaled: (640, 522)
    const bgKey = this.textures.exists('menu_full') ? 'menu_full' : 'bg_title'
    this.add.image(0, 0, bgKey)
      .setOrigin(0, 0)
      .setDisplaySize(width, height)

    // ── "POLSKIE PTAKI" inside the wooden frame ──────────────────────────────
    // Frame spans roughly y=58–464 scaled → center ~y=257
    this.add.text(width / 2, height * 0.305, 'POLSKIE', {
      fontSize: '54px',
      fontFamily: '"Courier New", monospace',
      color: '#ffffff',
      stroke: '#3a1500',
      strokeThickness: 7,
    }).setOrigin(0.5)

    this.add.text(width / 2, height * 0.415, 'PTAKI', {
      fontSize: '64px',
      fontFamily: '"Courier New", monospace',
      color: '#ffdd00',
      stroke: '#3a1500',
      strokeThickness: 7,
    }).setOrigin(0.5)

    // ── Invisible hit area over the painted play button ──────────────────────
    this.add.rectangle(width / 2, height * 0.725, 300, 60)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._startGame())

    // ── Controls legend — keyboard only ──────────────────────────────────────
    const legendY = height - 38
    this.add.rectangle(width / 2, legendY, width, 52, 0x000000, 0.55)
    if (!isTouch) {
      this.add.text(width / 2, legendY - 8, '← → / A D  bieg     ↑ / W  skok     SHIFT podmuch skrzydłami     E tablica edukacyjna', {
        fontSize: '13px',
        fontFamily: '"Courier New", monospace',
        color: '#ffdd00',
        stroke: '#000',
        strokeThickness: 2,
      }).setOrigin(0.5)
    }
    this.add.text(width / 2, legendY + 12, 'polskieptaki.pl  •  v0.1', {
      fontSize: '10px',
      fontFamily: '"Courier New", monospace',
      color: '#888866',
    }).setOrigin(0.5)
  }

  _startGame() {
    this.scene.start('Level1Scene')
  }
}
