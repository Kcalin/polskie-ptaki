/**
 * EndScene — pixel-art level complete screen.
 * Drawn entirely with Phaser Graphics (no external assets beyond feather).
 */

const FONT = '"Courier New", monospace'

// Pixel palette
const P = {
  bg_dark:    0x050d1a,
  bg_mid:     0x0a1628,
  sky_top:    0x1a2a4a,
  sky_bot:    0x0d1f3a,
  star:       0xffffff,
  moon:       0xfff8c0,
  moon_shade: 0xd4c880,
  water:      0x1a3a5a,
  water_hi:   0x2a5a7a,
  reed_dark:  0x1a3a1a,
  reed_mid:   0x2a5a2a,
  reed_light: 0x3a7a3a,
  ground:     0x1a2a1a,
  panel_bg:   0x0a180a,
  panel_bdr:  0x3a6a3a,
  gold:       0xffe066,
  gold_dim:   0xaa9033,
  white:      0xf0f0f0,
  cream:      0xe8f5e9,
}

// Pixel font: 5×7 capital letters drawn with tiny rects (S=2 = 2px per pixel)
const S = 2   // pixel scale for drawn elements

export default class EndScene extends Phaser.Scene {
  constructor() { super('EndScene') }

  init(data) {
    this.featherData = data?.featherData ?? {
      name: 'Pióro Wiosennego Świtu',
      legend: 'Dawno temu feniks sfrunął nad Biebrzę i jedno złote pióro opadło na wodę, budząc bagna do życia.',
      glowColor: '#FFD54F',
    }
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height

    this._buildBackground(W, H)
    this._buildMoon(W)
    this._buildWater(W, H)
    this._buildReeds(W, H)
    this._buildStars(W, H)
    this._buildPanel(W, H)
    this._buildFeather(W, H)
    this._buildText(W, H)
    this._buildButtons(W, H)
    this._buildParticles(W, H)

    // Victory sound
    if (this.cache.audio.exists('sfx_win')) {
      this.sound.play('sfx_win', { volume: 0.55 })
    }
  }

  // ── Background gradient (sky) ────────────────────────────────────────────────

  _buildBackground(W, H) {
    const g = this.add.graphics()
    // Hand-banded gradient sky (8 bands)
    const bands = 12
    for (let i = 0; i < bands; i++) {
      const t   = i / bands
      const r   = Phaser.Math.Linear(0x05, 0x1a, t)
      const gr  = Phaser.Math.Linear(0x0d, 0x2a, t)
      const b   = Phaser.Math.Linear(0x1a, 0x4a, t)
      const col = (Math.round(r) << 16) | (Math.round(gr) << 8) | Math.round(b)
      g.fillStyle(col)
      g.fillRect(0, (H / bands) * i, W, Math.ceil(H / bands) + 1)
    }
  }

  // ── Moon ─────────────────────────────────────────────────────────────────────

  _buildMoon(W) {
    const g = this.add.graphics()
    const mx = W - 160, my = 80, mr = 38

    // Glow
    for (let r = mr + 16; r > mr; r--) {
      const a = 0.03 + 0.04 * (mr + 16 - r) / 16
      g.fillStyle(0xfff8c0, a)
      g.fillCircle(mx, my, r)
    }
    // Moon disc
    g.fillStyle(P.moon); g.fillCircle(mx, my, mr)
    // Crater shading
    g.fillStyle(P.moon_shade, 0.4)
    g.fillCircle(mx + 10, my - 8, 10)
    g.fillCircle(mx - 8, my + 12, 6)
    g.fillCircle(mx + 4, my + 6, 4)
  }

  // ── Water reflection ─────────────────────────────────────────────────────────

  _buildWater(W, H) {
    const g = this.add.graphics()
    const wy = H - 110

    g.fillStyle(P.water);    g.fillRect(0, wy, W, 110)
    g.fillStyle(P.water_hi, 0.3)

    // Pixel-art ripple lines
    for (let row = 0; row < 6; row++) {
      const ry = wy + 14 + row * 14
      for (let x = (row * 40) % 80; x < W; x += 80) {
        g.fillRect(x, ry, 32, 2)
        g.fillRect(x + 44, ry + 4, 20, 2)
      }
    }

    // Moon reflection
    g.fillStyle(P.moon, 0.18)
    g.fillRect(W - 200, wy + 4, 80, 6)
    g.fillRect(W - 188, wy + 12, 56, 4)
    g.fillRect(W - 180, wy + 18, 40, 3)
  }

  // ── Reed silhouettes ─────────────────────────────────────────────────────────

  _buildReeds(W, H) {
    const g = this.add.graphics()
    const ground = H - 110

    // Ground strip
    g.fillStyle(P.ground); g.fillRect(0, ground - 18, W, 22)
    g.fillStyle(P.reed_dark); g.fillRect(0, ground - 20, W, 4)

    // Reed clusters (pixel art stems + heads)
    const clusters = [
      { x: 60,  count: 5,  h: [80,95,70,88,75] },
      { x: 200, count: 4,  h: [90,72,85,68] },
      { x: 380, count: 6,  h: [100,78,92,65,88,74] },
      { x: 560, count: 4,  h: [85,96,70,82] },
      { x: 720, count: 5,  h: [75,90,68,84,78] },
      { x: 880, count: 4,  h: [92,70,86,76] },
      { x: 1040,count: 5,  h: [80,94,66,88,72] },
      { x: 1180,count: 3,  h: [88,75,95] },
    ]

    for (const cl of clusters) {
      for (let i = 0; i < cl.count; i++) {
        const rx  = cl.x + i * 14 + Phaser.Math.Between(-4, 4)
        const rh  = cl.h[i] + Phaser.Math.Between(-6, 6)
        const col = i % 2 === 0 ? P.reed_mid : P.reed_dark

        // Stem
        g.fillStyle(col)
        g.fillRect(rx, ground - rh, 3, rh)

        // Reed head (oval brown)
        g.fillStyle(0x3a2010)
        g.fillRect(rx - 2, ground - rh - 14, 7, 14)
        g.fillStyle(0x5a3520)
        g.fillRect(rx - 1, ground - rh - 13, 5, 12)

        // Leaves
        g.fillStyle(P.reed_light, 0.7)
        g.fillRect(rx + 3, ground - Math.floor(rh * 0.6), 12, 2)
        g.fillRect(rx - 10, ground - Math.floor(rh * 0.4), 10, 2)
      }
    }
  }

  // ── Stars ────────────────────────────────────────────────────────────────────

  _buildStars(W, H) {
    const g = this.add.graphics()
    const rng = new Phaser.Math.RandomDataGenerator(['biebrza-stars'])
    for (let i = 0; i < 60; i++) {
      const sx   = rng.integerInRange(0, W)
      const sy   = rng.integerInRange(0, H - 200)
      const size = rng.integerInRange(1, 3) === 1 ? 2 : 1
      const a    = rng.realInRange(0.4, 1.0)
      g.fillStyle(P.star, a)
      g.fillRect(sx, sy, size, size)
    }
    // A few cross-shaped bright stars
    const bright = [[120,40],[340,80],[600,30],[900,60],[1050,45]]
    for (const [bx, by] of bright) {
      g.fillStyle(P.star, 0.9)
      g.fillRect(bx - 3, by, 7, 1)
      g.fillRect(bx, by - 3, 1, 7)
    }
  }

  // ── Info panel (pixel-art wooden frame) ─────────────────────────────────────

  _buildPanel(W, H) {
    const g  = this.add.graphics()
    const pw = 820, ph = 200
    const px = (W - pw) / 2
    const py = H - 110 - ph - 20   // sits just above the water

    // Shadow
    g.fillStyle(0x000000, 0.4); g.fillRect(px + 5, py + 5, pw, ph)

    // Frame layers
    g.fillStyle(0x5c3d11); g.fillRect(px, py, pw, ph)
    g.fillStyle(0x8b6914); g.fillRect(px + 4, py + 4, pw - 8, ph - 8)
    g.fillStyle(0xc49a3c); g.fillRect(px + 8, py + 8, pw - 16, ph - 16)
    g.fillStyle(P.panel_bg); g.fillRect(px + 12, py + 12, pw - 24, ph - 24)

    // Corner nails
    const nails = [[px+5,py+5],[px+pw-13,py+5],[px+5,py+ph-13],[px+pw-13,py+ph-13]]
    for (const [nx, ny] of nails) {
      g.fillStyle(0xc0a000); g.fillRect(nx, ny, 8, 8)
      g.fillStyle(0xffe066); g.fillRect(nx+2, ny+2, 3, 3)
    }

    this._panelRect = { px, py, pw, ph }
  }

  // ── Feather sprite (centre-top) ──────────────────────────────────────────────

  _buildFeather(W, H) {
    const fy = H - 110 - 200 - 20 - 70   // above the panel

    if (this.textures.exists('feather')) {
      const f = this.add.image(W / 2, fy, 'feather').setScale(3)
      this.tweens.add({
        targets: f, y: fy - 12, angle: 6,
        duration: 1600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      })

      // Glow
      const glowCol = Phaser.Display.Color.HexStringToColor(
        this.featherData.glowColor ?? '#FFD54F').color
      const g2 = this.add.graphics()
      for (let r = 50; r > 20; r -= 5) {
        g2.fillStyle(glowCol, 0.025 * (50 - r + 5) / 30)
        g2.fillCircle(W / 2, fy, r)
      }
    }
  }

  // ── Text ─────────────────────────────────────────────────────────────────────

  _buildText(W, H) {
    const { px, py, pw, ph } = this._panelRect
    const cx = px + pw / 2
    const glowColor = this.featherData.glowColor ?? '#FFD54F'

    // "BRAWO!" — big pixel font style
    this.add.text(W / 2, py - 90, '★  BRAWO!  ★', {
      fontSize: '36px', fontFamily: FONT,
      color: '#ffe066',
      stroke: '#000000', strokeThickness: 5,
      shadow: { offsetX: 3, offsetY: 3, color: '#000', fill: true },
    }).setOrigin(0.5)

    // Feather name
    this.add.text(W / 2, py - 46, this.featherData.name, {
      fontSize: '20px', fontFamily: FONT,
      color: glowColor,
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5)

    // Legend header
    this.add.text(cx, py + 22, '— Legenda —', {
      fontSize: '13px', fontFamily: FONT, color: '#6aaa6a',
    }).setOrigin(0.5)

    // Legend text
    this.add.text(cx, py + 44, this.featherData.legend, {
      fontSize: '14px', fontFamily: FONT, color: '#cceecc',
      wordWrap: { width: pw - 48 }, align: 'center', lineSpacing: 5,
    }).setOrigin(0.5, 0)
  }

  // ── Buttons ──────────────────────────────────────────────────────────────────

  _buildButtons(W, H) {
    const by = H - 55
    this._pixelButton(W / 2 - 140, by, 'Zagraj jeszcze raz', () => this.scene.start('Level1Scene'))
    this._pixelButton(W / 2 + 140, by, 'Menu główne',        () => this.scene.start('TitleScene'))
  }

  _pixelButton(x, y, label, cb) {
    const bw = 240, bh = 42
    const g  = this.add.graphics()

    const draw = (hover) => {
      g.clear()
      // Shadow
      g.fillStyle(0x000000, 0.5); g.fillRect(x - bw/2 + 3, y - bh/2 + 3, bw, bh)
      // Border layers
      g.fillStyle(hover ? 0x8b6914 : 0x5c3d11)
      g.fillRect(x - bw/2, y - bh/2, bw, bh)
      g.fillStyle(hover ? 0xc49a3c : 0x8b6914)
      g.fillRect(x - bw/2 + 3, y - bh/2 + 3, bw - 6, bh - 6)
      // Fill
      g.fillStyle(hover ? 0x2a5a2a : 0x1a3a1a)
      g.fillRect(x - bw/2 + 5, y - bh/2 + 5, bw - 10, bh - 10)
    }

    draw(false)

    const txt = this.add.text(x, y, label, {
      fontSize: '16px', fontFamily: FONT, color: '#ffe066',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5)

    // Hit area
    const hit = this.add.rectangle(x, y, bw, bh).setInteractive({ useHandCursor: true })
    hit.on('pointerover',  () => { draw(true);  txt.setColor('#ffffff') })
    hit.on('pointerout',   () => { draw(false); txt.setColor('#ffe066') })
    hit.on('pointerdown',  cb)
  }

  // ── Firefly / sparkle particles ──────────────────────────────────────────────

  _buildParticles(W, H) {
    const colors = [0xffe066, 0xffaa33, 0xaaddaa, 0x88ffcc]
    this.time.addEvent({
      delay: 220,
      repeat: -1,
      callback: () => {
        const sx  = Phaser.Math.Between(80, W - 80)
        const sy  = Phaser.Math.Between(H - 340, H - 120)
        const col = Phaser.Utils.Array.GetRandom(colors)
        const r   = Phaser.Math.Between(2, 4)
        const dot = this.add.rectangle(sx, sy, r, r, col).setAlpha(0)
        this.tweens.add({
          targets: dot,
          alpha: { from: 0, to: 0.85 },
          y: dot.y - Phaser.Math.Between(20, 60),
          duration: Phaser.Math.Between(700, 1400),
          yoyo: true,
          onComplete: () => dot.destroy(),
        })
      },
    })
  }
}
