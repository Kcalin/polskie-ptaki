export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Player sprites
    this.load.image('bocian_idle',   'assets/sprites/bocian_idle.png')
    this.load.image('bocian_jump',   'assets/sprites/bocian_jump.png')
    for (let i = 0; i < 4; i++) this.load.image(`bocian_idle_${i}`, `assets/sprites/bocian_idle_${i}.png`)
    for (let i = 0; i < 6; i++) this.load.image(`bocian_walk_${i}`, `assets/sprites/bocian_walk_${i}.png`)

    // Enemy sprites
    this.load.image('fox_idle', 'assets/sprites/fox_idle.png')
    for (let i = 0; i < 4; i++) this.load.image(`fox_walk_${i}`, `assets/sprites/fox_walk_${i}.png`)

    // Tiles
    this.load.image('ground',   'assets/sprites/tile_ground.png')
    this.load.image('platform', 'assets/sprites/tile_platform.png')

    // Backgrounds
    this.load.image('bg_sky',   'assets/sprites/bg_biebrza_sky.png')
    this.load.image('bg_marsh', 'assets/sprites/bg_biebrza_marsh.png')

    // Decorations
    this.load.image('deco_reed', 'assets/sprites/deco_reed.png')

    // UI / pickups
    this.load.image('sign',        'assets/sprites/sign_wooden.png')
    this.load.image('sign_hidden', 'assets/sprites/sign_golden.png')
    this.load.image('feather',     'assets/sprites/feather_spring.png')

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
    this._registerAnimations()
    this.scene.start('TitleScene')
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
      frames: Array.from({ length: 6 }, (_, i) => ({ key: `bocian_walk_${i}` })),
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
  }
}
