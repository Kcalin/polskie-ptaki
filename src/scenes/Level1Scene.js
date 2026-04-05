import Bocian from '../objects/birds/Bocian.js'
import Fox from '../objects/enemies/Fox.js'
import EducationSign from '../objects/EducationSign.js'
import FeatherPickup from '../objects/FeatherPickup.js'
import SignModal from '../ui/SignModal.js'
import SaveSystem from '../systems/SaveSystem.js'
import signsData from '../data/signs/level1.json'
import feathersData from '../data/feathers.json'

const LEVEL_ID = 1
const LEVEL_WIDTH = 6400

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
    this.player = new Bocian(this, 100, height - 100)
    this.physics.add.collider(this.player, this.platforms)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Enemies
    this._buildEnemies(height)

    // Education signs
    this.signGroup = new EducationSign(this, signsData)
    this.modal = new SignModal(this)
    this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this._nearSign = null

    // Feather pickup (level 1 feather position)
    const featherDef = feathersData.filter(f => f.level === LEVEL_ID).map(f => ({
      ...f, x: 5200, y: height - 200,
    }))
    this.featherGroup = new FeatherPickup(this, LEVEL_ID, featherDef)
    this._setupFeatherOverlap()

    // HUD
    this.scene.launch('UIScene', { level: LEVEL_ID })

    SaveSystem.setLastLevel(LEVEL_ID)
  }

  _buildBackground(width, height) {
    // Sky gradient (two rects)
    this.add.rectangle(LEVEL_WIDTH / 2, height * 0.3, LEVEL_WIDTH, height * 0.6, 0x87ceeb).setScrollFactor(0.2)
    this.add.rectangle(LEVEL_WIDTH / 2, height * 0.85, LEVEL_WIDTH, height * 0.3, 0x558b2f).setScrollFactor(0.4)
  }

  _buildTerrain(height) {
    this.platforms = this.physics.add.staticGroup()

    // Ground
    for (let x = 0; x < LEVEL_WIDTH; x += 16) {
      this.platforms.create(x + 8, height - 8, 'ground').refreshBody()
    }

    // Platforms layout
    const defs = [
      { x: 280,  y: height - 120, w: 6 },
      { x: 500,  y: height - 200, w: 5 },
      { x: 760,  y: height - 160, w: 7 },
      { x: 1000, y: height - 260, w: 5 },
      { x: 1250, y: height - 130, w: 9 },
      { x: 1550, y: height - 210, w: 6 },
      { x: 1850, y: height - 290, w: 5 },
      { x: 2150, y: height - 170, w: 8 },
      { x: 2500, y: height - 240, w: 6 },
      { x: 2800, y: height - 320, w: 5 },
      { x: 3100, y: height - 190, w: 7 },
      { x: 3450, y: height - 270, w: 5 },
      { x: 3750, y: height - 150, w: 8 },
      { x: 4100, y: height - 230, w: 6 },
      { x: 4400, y: height - 300, w: 5 },
      { x: 4750, y: height - 170, w: 9 },
      { x: 5100, y: height - 250, w: 6 },
      { x: 5400, y: height - 180, w: 7 },
      // High platform for hidden sign
      { x: 5450, y: height - 340, w: 5 },
      { x: 5800, y: height - 200, w: 6 },
      { x: 6100, y: height - 280, w: 5 },
    ]

    for (const def of defs) {
      for (let i = 0; i < def.w; i++) {
        this.platforms.create(def.x + i * 16, def.y, 'platform').refreshBody()
      }
    }
  }

  _buildEnemies(height) {
    this.enemies = this.physics.add.group()

    const foxDefs = [
      { x: 400,  patrol: [300, 550] },
      { x: 1400, patrol: [1250, 1650] },
      { x: 2600, patrol: [2450, 2850] },
      { x: 3900, patrol: [3750, 4150] },
      { x: 5600, patrol: [5400, 5900] },
    ]

    for (const def of foxDefs) {
      const fox = new Fox(this, def.x, height - 44, {
        patrolLeft: def.patrol[0],
        patrolRight: def.patrol[1],
      })
      this.enemies.add(fox)
    }

    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.overlap(this.player, this.enemies, this._onHitEnemy, null, this)
  }

  _setupFeatherOverlap() {
    // FeatherPickup extends StaticGroup, so we overlap with its children
    this.physics.add.overlap(
      this.player,
      this.featherGroup.getChildren?.() ?? [],
      (player, pickup) => {
        this.featherGroup.collect(pickup, (data) => {
          this._showFeatherNotice(data)
        })
      },
      null,
      this
    )
  }

  _onHitEnemy(player, _enemy) {
    // Simple knockback
    const dir = player.x < _enemy.x ? -1 : 1
    player.setVelocity(dir * 300, -350)
    this.scene.get('UIScene').loseLife?.()
  }

  _showFeatherNotice(data) {
    const { width, height } = this.scale
    const notice = this.add.text(width / 2, height / 2 - 80, `✨ ${data.name}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: data.glowColor ?? '#ffdd44',
      stroke: '#000',
      strokeThickness: 3,
    }).setScrollFactor(0).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: notice,
      y: height / 2 - 140,
      alpha: 0,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => notice.destroy(),
    })
  }

  update() {
    this.player.update()

    // Update all enemies
    for (const enemy of this.enemies.getChildren()) {
      enemy.update()
    }

    // Check proximity to signs
    this._nearSign = null
    for (const sign of this.signGroup.getSigns()) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, sign.x, sign.y)
      if (dist < 60) {
        this._nearSign = sign
        // Reveal hidden signs when player is near
        if (sign.signData.isHidden) {
          this.signGroup.revealHidden(sign)
        }
        break
      }
    }

    // Open modal on E
    if (this._nearSign && Phaser.Input.Keyboard.JustDown(this._eKey) && !this.modal.isOpen) {
      this.modal.open(this._nearSign.signData)
    }
  }
}
