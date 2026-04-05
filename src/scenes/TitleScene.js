export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene')
  }

  create() {
    const { width, height } = this.scale
    this._drawBackground(width, height)
    this._drawLogo(width, height)
    this._drawUI(width, height)
    this._spawnBirds(width, height)
  }

  _drawBackground(width, height) {
    // Sky gradient — bands from deep night-blue top to cyan horizon
    const bands = [
      [0.00, 0.18, 0x0a1628],
      [0.18, 0.10, 0x0d2040],
      [0.28, 0.12, 0x1a3a6c],
      [0.40, 0.14, 0x2a6aaa],
      [0.54, 0.16, 0x4a9ad4],
      [0.70, 0.30, 0x6ab8e8],
    ]
    bands.forEach(([yRel, hRel, color]) => {
      this.add.rectangle(width / 2, (yRel + hRel / 2) * height, width, hRel * height + 1, color)
    })

    // Stars (2×2 pixels)
    const starG = this.add.graphics().fillStyle(0xffffff)
    ;[[80,40],[200,70],[380,30],[520,55],[700,25],[860,65],
      [1050,40],[1150,75],[1240,35],[140,100],[440,90],[950,85],
      [320,115],[630,50],[1180,120],[750,95]].forEach(([x, y]) => starG.fillRect(x, y, 2, 2))

    // Moon
    const moonG = this.add.graphics()
    moonG.fillStyle(0xffffcc)
    moonG.fillCircle(1150, 60, 26)
    moonG.fillStyle(0x0d2040)
    moonG.fillCircle(1163, 52, 18)  // bite

    // Distant hill silhouette
    const hillG = this.add.graphics().fillStyle(0x112a08)
    const pts = []
    for (let x = 0; x <= width; x += 16) {
      pts.push({ x, y: height * 0.68 - Math.abs(Math.sin(x * 0.004) * 55 + Math.sin(x * 0.011) * 30) })
    }
    pts.push({ x: width, y: height }, { x: 0, y: height })
    hillG.fillPoints(pts, true)

    // Ground
    this.add.rectangle(width / 2, height - height * 0.10, width, height * 0.20, 0x1a3d0a)

    // Pixel grass edge
    const grassG = this.add.graphics().fillStyle(0x3a8c1a)
    for (let x = 0; x < width; x += 6) {
      grassG.fillRect(x, height * 0.83 - (Math.sin(x * 0.09) > 0.3 ? 8 : 4), 6, 10)
    }

    // Cattail reeds along ground
    const reedG = this.add.graphics()
    ;[70, 190, 340, 510, 660, 800, 950, 1090, 1210].forEach(rx => {
      const rh = 48 + Math.round(Math.sin(rx * 0.05) * 12)
      reedG.fillStyle(0x2d6614).fillRect(rx, height * 0.83 - rh, 4, rh)
      reedG.fillStyle(0x5a3010).fillRect(rx - 4, height * 0.83 - rh - 14, 12, 14)
    })
  }

  _drawLogo(width, height) {
    const cy = height * 0.40

    // Drop shadow
    this.add.text(width / 2 + 5, cy - 48, 'POLSKIE', {
      fontSize: '72px', fontFamily: '"Courier New", monospace', color: '#000000',
    }).setOrigin(0.5).setAlpha(0.45)
    this.add.text(width / 2 + 5, cy + 32, 'PTAKI', {
      fontSize: '72px', fontFamily: '"Courier New", monospace', color: '#000000',
    }).setOrigin(0.5).setAlpha(0.45)

    // Main text
    this.add.text(width / 2, cy - 52, 'POLSKIE', {
      fontSize: '72px', fontFamily: '"Courier New", monospace',
      color: '#ffffff', stroke: '#1a3a6c', strokeThickness: 7,
    }).setOrigin(0.5)

    this.add.text(width / 2, cy + 28, 'PTAKI', {
      fontSize: '72px', fontFamily: '"Courier New", monospace',
      color: '#ffdd44', stroke: '#6b3a00', strokeThickness: 7,
    }).setOrigin(0.5)

    // Subtitle
    this.add.text(width / 2, cy + 112, 'Odkryj polskie parki narodowe!', {
      fontSize: '18px', fontFamily: '"Courier New", monospace',
      color: '#aaddff', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5)

    // Bocian mascot (right of title, floating)
    if (this.textures.exists('bocian_idle')) {
      const bird = this.add.sprite(width / 2 + 390, cy + 22, 'bocian_idle').setScale(2.2)
      if (this.anims.exists('bocian_idle_anim')) bird.play('bocian_idle_anim')
      this.tweens.add({ targets: bird, y: cy + 10, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }
  }

  _drawUI(width, height) {
    const startY = height * 0.76

    // Pixel-art button
    const bw = 340, bh = 50, bx = width / 2 - bw / 2, by = startY - bh / 2
    const btnG = this.add.graphics()
    btnG.fillStyle(0xffdd44).fillRect(bx, by, bw, bh)
    btnG.fillStyle(0xaa8800).fillRect(bx + 4, by + bh - 4, bw - 4, 4).fillRect(bx + bw - 4, by + 4, 4, bh - 4)
    btnG.fillStyle(0xfff5aa).fillRect(bx, by, bw, 4).fillRect(bx, by, 4, bh)

    const startTxt = this.add.text(width / 2, startY, '[ SPACJA — GRAJ! ]', {
      fontSize: '22px', fontFamily: '"Courier New", monospace',
      color: '#1a1a00', stroke: '#aa8800', strokeThickness: 2,
    }).setOrigin(0.5)

    this.tweens.add({ targets: [btnG, startTxt], alpha: 0.2, duration: 480, yoyo: true, repeat: -1 })

    // Controls hint
    this.add.text(width / 2, startY + 58, '← → bieg   ↑ skok   SHIFT podmuch skrzydłami   E tabliczka', {
      fontSize: '12px', fontFamily: '"Courier New", monospace',
      color: '#88aacc', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5)

    // Domain / version
    this.add.text(width - 10, height - 10, 'polskieptaki.pl  v0.1', {
      fontSize: '11px', fontFamily: '"Courier New", monospace', color: '#556677',
    }).setOrigin(1, 1)

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Level1Scene'))
  }

  _spawnBirds(width, height) {
    // Pixel-art bird silhouettes flying across the sky
    const configs = [
      { startX: -30, y: height * 0.14, dur: 6000 },
      { startX: -80, y: height * 0.21, dur: 8500 },
      { startX: -50, y: height * 0.09, dur: 10000 },
    ]
    configs.forEach(({ startX, y, dur }) => {
      const g = this.add.graphics().fillStyle(0xaaccee, 0.75)
      // Simple W-shape bird
      g.fillTriangle(-10, 2, -2, -4, 2, 2)
      g.fillTriangle(2, 2, 8, -4, 14, 2)
      g.x = startX; g.y = y
      this.tweens.add({
        targets: g, x: width + 40, duration: dur, ease: 'Linear', repeat: -1,
        onRepeat: () => { g.y = Phaser.Math.Between(height * 0.05, height * 0.38) },
      })
    })
  }
}
