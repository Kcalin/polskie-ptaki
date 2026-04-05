export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Player sprites
    this.load.image('bocian_idle',   'assets/sprites/bocian_idle.png')
    this.load.image('bocian_jump',   'assets/sprites/bocian_jump.png')
    this.load.image('bocian_gust',   'assets/sprites/bocian_gust.png')
    for (let i = 0; i < 4; i++) this.load.image(`bocian_idle_${i}`,  `assets/sprites/bocian_idle_${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`bocian_walk_${i}`,  `assets/sprites/bocian_walk_${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`bocian_walk_b${i}`, `assets/sprites/bocian_walk_b${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`bocian_walk_d${i}`, `assets/sprites/bocian_walk_d${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`bocian_walk_e${i}`, `assets/sprites/bocian_walk_e${i}.png`)

    // Batalion sprites
    this.load.image('batalion_idle', 'assets/sprites/batalion_idle_0.png')
    this.load.image('batalion_jump', 'assets/sprites/batalion_jump.png')
    this.load.image('batalion_fall', 'assets/sprites/batalion_fall.png')
    this.load.image('batalion_skid', 'assets/sprites/batalion_skid.png')
    this.load.image('batalion_run',  'assets/sprites/batalion_run.png')
    for (let i = 0; i < 4; i++) this.load.image(`batalion_idle_${i}`, `assets/sprites/batalion_idle_${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`batalion_walk_${i}`, `assets/sprites/batalion_walk_${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`batalion_legs_${i}`, `assets/sprites/batalion_legs_${i}.png`)
    for (let i = 0; i < 4; i++) this.load.image(`batalion_grok_walk_${i}`, `assets/sprites/batalion_grok_walk_${i}.png`)

    // Enemy sprites — fox
    this.load.image('fox_idle', 'assets/sprites/fox_idle.png')
    for (let i = 0; i < 4; i++) this.load.image(`fox_walk_${i}`, `assets/sprites/fox_walk_${i}.png`)

    // Enemy sprites — crow (kept for backward compat)
    this.load.image('crow_idle', 'assets/sprites/crow_idle.png')
    for (let i = 0; i < 4; i++) this.load.image(`crow_walk_${i}`, `assets/sprites/crow_walk_${i}.png`)

    // Enemy sprites — wolf (platform enemy)
    this.load.image('wolf_idle', 'assets/sprites/wolf_idle.png')
    for (let i = 0; i < 4; i++) this.load.image(`wolf_walk_${i}`, `assets/sprites/wolf_walk_${i}.png`)

    // Gust effect frames (PixelLab wind sprites)
    this.load.image('gust_f1', 'assets/sprites/gust_f1.png')
    this.load.image('gust_f2', 'assets/sprites/gust_f2.png')
    this.load.image('gust_f3', 'assets/sprites/gust_f3.png')

    // Tiles
    this.load.image('ground',   'assets/sprites/tile_ground.png')
    this.load.image('platform', 'assets/sprites/tile_platform.png')

    // Backgrounds
    this.load.image('bg_sky',    'assets/sprites/bg_biebrza_sky.png')
    this.load.image('bg_marsh',  'assets/sprites/bg_biebrza_marsh.png')
    this.load.image('bg_level1',    'assets/sprites/bg_level1.png')
    this.load.image('bg_level1_v2', 'assets/sprites/bg_level1_v2.png')
    this.load.image('bg_title',   'assets/sprites/bg_title.png')
    this.load.image('menu_full',  'assets/sprites/menu_full_c.png')

    // Decorations
    this.load.image('deco_reed', 'assets/sprites/deco_reed.png')

    // UI / pickups
    this.load.image('sign',        'assets/sprites/sign_wooden.png')
    this.load.image('sign_hidden', 'assets/sprites/sign_golden.png')
    this.load.image('feather',     'assets/sprites/feather_spring.png')

    // Menu UI sprites (PixelLab generated)
    this.load.image('ui_logo_banner',  'assets/sprites/ui_logo_banner2.png')
    this.load.image('ui_btn_start',    'assets/sprites/ui_btn_start.png')
    this.load.image('ui_mascot',       'assets/sprites/ui_mascot.png')
    this.load.image('ui_line_polskie', 'assets/sprites/ui_line_polskie_a.png')
    this.load.image('ui_line_ptaki',   'assets/sprites/ui_line_ptaki.png')

    // Audio
    this.load.audio('bg_level1', 'assets/audio/bg_level1.mp3')
    this.load.audio('sfx_win',   'assets/audio/sfx_win.mp3')

    // Wikipedia bird photos for educational signs
    this.load.image('bird_wodniczka', 'assets/birds/wodniczka.jpg')
    this.load.image('bird_batalion',  'assets/birds/batalion.jpg')
    this.load.image('bird_orlik',     'assets/birds/orlik.jpg')
    this.load.image('bird_kulik',     'assets/birds/kulik.jpg')

    // Pixel-art heart sprites drawn via Graphics (no PNG needed)
    this._makeHearts()

    // Fallback: generate any missing texture as colored rectangle
    this.load.on('loaderror', (file) => {
      console.warn(`Asset missing, using placeholder: ${file.key}`)
      const g = this.make.graphics({ add: false })
      g.fillStyle(0xff00ff); g.fillRect(0, 0, 64, 64)
      g.generateTexture(file.key, 64, 64)
      g.destroy()
    })
  }

  create() {
    // Force NEAREST (no blur) on all loaded textures — needed for TileSprite scaling
    this.textures.each(tex => {
      if (tex.key !== '__DEFAULT' && tex.key !== '__MISSING') {
        tex.source.forEach(src => src.setFilter(Phaser.Textures.FilterMode.NEAREST))
      }
    })

    this._registerAnimations()
    this.scene.start('TitleScene')
  }

  _makeHearts() {
    // Classic 7×6 pixel-art heart, each pixel = 3×3 screen pixels
    const S = 3
    const W = 7, H = 6

    const full = [
      [0,1,1,0,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0],
    ]
    const empty = [
      [0,1,1,0,1,1,0],
      [1,0,0,1,0,0,1],
      [1,0,0,0,0,0,1],
      [0,1,0,0,0,1,0],
      [0,0,1,0,1,0,0],
      [0,0,0,1,0,0,0],
    ]

    const drawHeart = (pattern, color, key) => {
      const g = this.make.graphics({ add: false })
      g.fillStyle(color)
      pattern.forEach((row, y) =>
        row.forEach((px, x) => { if (px) g.fillRect(x * S, y * S, S, S) })
      )
      g.generateTexture(key, W * S, H * S)
      g.destroy()
    }

    drawHeart(full,  0xff3355, 'heart_full')
    drawHeart(empty, 0x884455, 'heart_empty')
  }

  _registerAnimations() {
    this.anims.create({
      key: 'bocian_idle_anim',
      frames: Array.from({ length: 4 }, (_, i) => ({ key: `bocian_idle_${i}` })),
      frameRate: 6,
      repeat: -1,
    })

    this.anims.create({
      key: 'bocian_walk',
      frames: Array.from({ length: 4 }, (_, i) => ({ key: `bocian_idle_${i}` })),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'bocian_jump',
      frames: [{ key: 'bocian_jump' }],
      frameRate: 1,
      repeat: 0,
    })

    this.anims.create({
      key: 'bocian_gust',
      frames: [{ key: 'bocian_gust' }],
      frameRate: 1,
      repeat: 0,
    })

    this.anims.create({
      key: 'fox_walk',
      frames: Array.from({ length: 4 }, (_, i) => ({ key: `fox_walk_${i}` })),
      frameRate: 8,
      repeat: -1,
    })

    this.anims.create({
      key: 'fox_idle',
      frames: [{ key: 'fox_idle' }],
      frameRate: 1,
      repeat: -1,
    })

    // Crow animations (registered only if texture loaded without error)
    if (this.textures.exists('crow_idle')) {
      this.anims.create({
        key: 'crow_walk',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `crow_walk_${i}` })),
        frameRate: 8, repeat: -1,
      })
      this.anims.create({
        key: 'crow_idle',
        frames: [{ key: 'crow_idle' }],
        frameRate: 1, repeat: -1,
      })
    }

    if (this.textures.exists('batalion_idle_0')) {
      this.anims.create({
        key: 'batalion_idle_anim',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `batalion_idle_${i}` })),
        frameRate: 6, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_walk',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `batalion_grok_walk_${i}` })),
        frameRate: 10, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_jump',
        frames: [{ key: 'batalion_jump' }],
        frameRate: 1, repeat: 0,
      })
      this.anims.create({
        key: 'batalion_fall',
        frames: [{ key: 'batalion_fall' }],
        frameRate: 1, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_skid',
        frames: [{ key: 'batalion_skid' }],
        frameRate: 1, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_run',
        frames: [{ key: 'batalion_run' }],
        frameRate: 1, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_legs_walk',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `batalion_legs_${i}` })),
        frameRate: 10, repeat: -1,
      })
      this.anims.create({
        key: 'batalion_legs_idle',
        frames: [{ key: 'batalion_legs_0' }],
        frameRate: 1, repeat: -1,
      })
    }

    if (this.textures.exists('wolf_idle')) {
      this.anims.create({
        key: 'wolf_walk',
        frames: Array.from({ length: 4 }, (_, i) => ({ key: `wolf_walk_${i}` })),
        frameRate: 8, repeat: -1,
      })
      this.anims.create({
        key: 'wolf_idle',
        frames: [{ key: 'wolf_idle' }],
        frameRate: 1, repeat: -1,
      })
    }
  }
}
