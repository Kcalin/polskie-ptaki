import Bocian from '../objects/birds/Bocian.js'
import Fox from '../objects/enemies/Fox.js'
import EducationSign from '../objects/EducationSign.js'
import FeatherPickup from '../objects/FeatherPickup.js'
import SignModal from '../ui/SignModal.js'
import SaveSystem from '../systems/SaveSystem.js'
import signsData from '../data/signs/level1.json'
import feathersData from '../data/feathers.json'

const LEVEL_ID  = 1
const LEVEL_WIDTH = 6400
const TILE = 32   // tile size in pixels

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('Level1Scene')
  }

  create() {
    const { width, height } = this.scale

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, height)
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, height)

    this._buildBackground(width, height)
    this._buildTerrain(height)

    // Player
    this.player = new Bocian(this, 100, height - 120)
    this.physics.add.collider(this.player, this.platforms)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Enemies
    this._buildEnemies(height)

    // Education signs — snap y to ground surface; hidden sign keeps its JSON y
    const groundSignY = height - TILE - 24   // sign centre so its post base sits on ground
    const adjustedSigns = signsData.map(s => ({
      ...s,
      position: { x: s.position.x, y: s.isHidden ? s.position.y : groundSignY },
    }))
    this.signGroup = new EducationSign(this, adjustedSigns)
    this.modal = new SignModal(this)
    this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // Feather pickup
    const featherDef = feathersData
      .filter(f => f.level === LEVEL_ID)
      .map(f => ({ ...f, x: 5200, y: height - 250 }))
    this.featherGroup = new FeatherPickup(this, LEVEL_ID, featherDef)
    this._setupFeatherOverlap()

    // Reed decorations
    this._addDecorations(height)

    // HUD
    this.scene.launch('UIScene', { level: LEVEL_ID })

    SaveSystem.setLastLevel(LEVEL_ID)
  }

  _buildBackground(width, height) {
    // Scale each tile so the 400×225 source image fills the canvas height exactly.
    // This eliminates vertical repetition/seams. Horizontal tiling is seamless parallax.
    const skyScale = height / 225   // 720/225 ≈ 3.2  → tile is 1280×720 (one screen)

    this._bgSky = this.add.tileSprite(0, 0, width, height, 'bg_sky')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-2)
    this._bgSky.tileScaleX = skyScale
    this._bgSky.tileScaleY = skyScale

    // Marsh layer covers bottom ~55% of screen
    const marshH    = Math.round(height * 0.55)
    const marshScale = marshH / 225
    this._bgMarsh = this.add.tileSprite(0, height - marshH, width, marshH, 'bg_marsh')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-1)
    this._bgMarsh.tileScaleX = marshScale
    this._bgMarsh.tileScaleY = marshScale
  }

  _buildTerrain(height) {
    this.platforms = this.physics.add.staticGroup()

    // Ground row
    for (let x = 0; x < LEVEL_WIDTH; x += TILE) {
      this.platforms.create(x + TILE / 2, height - TILE / 2, 'ground').refreshBody()
    }

    // Elevated platforms
    const defs = [
      { x: 256,  y: height - 128, w: 5 },
      { x: 480,  y: height - 224, w: 4 },
      { x: 736,  y: height - 160, w: 6 },
      { x: 992,  y: height - 288, w: 5 },
      { x: 1280, y: height - 128, w: 8 },
      { x: 1600, y: height - 224, w: 5 },
      { x: 1888, y: height - 320, w: 4 },
      { x: 2144, y: height - 192, w: 7 },
      { x: 2464, y: height - 256, w: 5 },
      { x: 2784, y: height - 352, w: 4 },
      { x: 3072, y: height - 192, w: 6 },
      { x: 3392, y: height - 288, w: 5 },
      { x: 3712, y: height - 160, w: 7 },
      { x: 4064, y: height - 256, w: 5 },
      { x: 4384, y: height - 320, w: 4 },
      { x: 4704, y: height - 192, w: 8 },
      { x: 5056, y: height - 272, w: 5 },
      { x: 5376, y: height - 192, w: 6 },
      { x: 5440, y: height - 384, w: 4 }, // high platform for hidden sign
      { x: 5792, y: height - 224, w: 5 },
      { x: 6080, y: height - 304, w: 4 },
    ]

    for (const def of defs) {
      for (let i = 0; i < def.w; i++) {
        this.platforms.create(def.x + i * TILE + TILE / 2, def.y, 'platform').refreshBody()
      }
    }
  }

  _buildEnemies(height) {
    this.enemies = this.physics.add.group()

    const foxDefs = [
      { x: 400,  patrol: [300,  560]  },
      { x: 1400, patrol: [1280, 1700] },
      { x: 2600, patrol: [2464, 2880] },
      { x: 3900, patrol: [3712, 4160] },
      { x: 5600, patrol: [5376, 5920] },
    ]

    for (const def of foxDefs) {
      const fox = new Fox(this, def.x, height - TILE - 32, {
        patrolLeft:  def.patrol[0],
        patrolRight: def.patrol[1],
      })
      this.enemies.add(fox)
    }

    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.overlap(this.player, this.enemies, this._onHitEnemy, null, this)
  }

  _addDecorations(height) {
    const reedPositions = [180, 450, 820, 1100, 1450, 1750, 2200, 2550, 2900, 3200,
                           3550, 3850, 4200, 4500, 4850, 5100, 5450, 5750, 6100]
    for (const x of reedPositions) {
      this.add.image(x, height - TILE - 24, 'deco_reed')
        .setDepth(-0.5)
        .setScale(Phaser.Math.Between(80, 120) / 100)
    }
  }

  _setupFeatherOverlap() {
    this.physics.add.overlap(
      this.player,
      this.featherGroup.getChildren?.() ?? [],
      (_player, pickup) => {
        this.featherGroup.collect(pickup, (data) => this._showFeatherNotice(data))
      },
      null, this
    )
  }

  _onHitEnemy(player, _enemy) {
    const dir = player.x < _enemy.x ? -1 : 1
    player.setVelocity(dir * 300, -350)
    this.scene.get('UIScene').loseLife?.()
  }

  _showFeatherNotice(data) {
    const { width, height } = this.scale
    const notice = this.add.text(width / 2, height / 2 - 80,
      `✨ ${data.name}`, {
        fontSize: '24px', fontFamily: 'Arial',
        color: data.glowColor ?? '#ffdd44',
        stroke: '#000', strokeThickness: 3,
      }).setScrollFactor(0).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: notice, y: height / 2 - 140, alpha: 0,
      duration: 2000, ease: 'Power2',
      onComplete: () => notice.destroy(),
    })
  }

  update(_time, delta) {
    // Parallax background — offset tile texture proportionally to camera scroll
    const camX = this.cameras.main.scrollX
    this._bgSky.tilePositionX   = camX * 0.05
    this._bgMarsh.tilePositionX = camX * 0.25

    this.player.update(delta)

    for (const enemy of this.enemies.getChildren()) enemy.update()

    // Sign proximity check
    let nearSign = null
    for (const sign of this.signGroup.getSigns()) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, sign.x, sign.y) < 64) {
        nearSign = sign
        if (sign.signData.isHidden) this.signGroup.revealHidden(sign)
        break
      }
    }

    if (nearSign && Phaser.Input.Keyboard.JustDown(this._eKey) && !this.modal.isOpen) {
      this.modal.open(nearSign.signData)
    }
  }
}
