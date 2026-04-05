import Batalion from '../objects/birds/Batalion.js'
import Fox from '../objects/enemies/Fox.js'
import Wolf from '../objects/enemies/Wolf.js'
import EducationSign from '../objects/EducationSign.js'
import FeatherPickup from '../objects/FeatherPickup.js'
import SignModal from '../ui/SignModal.js'
import SaveSystem from '../systems/SaveSystem.js'
import AudioManager from '../systems/AudioManager.js'
import signsData from '../data/signs/level1.json'
import feathersData from '../data/feathers.json'

const LEVEL_ID    = 1
const LEVEL_WIDTH = 6400
const TILE        = 32

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
    this.player = new Batalion(this, 100, height - 120)
    this.physics.add.collider(this.player, this.platforms)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Enemies
    this._buildEnemies(height)

    // Wire display callback so Batalion can stun enemies in radius
    this.player.onDisplay = (cx, cy, radius, stunDuration) => {
      for (const enemy of this.enemies.getChildren()) {
        if (Phaser.Math.Distance.Between(cx, cy, enemy.x, enemy.y) < radius) {
          enemy.stun?.(stunDuration)
        }
      }
    }

    // Unblock player when sign modal closes
    this.events.on('signClosed', () => { this.player.inputBlocked = false })

    // Correct quiz answer → gain a life (max 3)
    this.events.on('quizCorrect', () => {
      this.scene.get('UIScene')?.gainLife?.()
    })

    // Education signs
    const groundSignY = height - TILE - 24
    const adjustedSigns = signsData.map(s => ({
      ...s,
      position: { x: s.position.x, y: (s.keepY || s.isHidden) ? s.position.y : groundSignY },
    }))
    this.signGroup = new EducationSign(this, adjustedSigns)
    this.modal = new SignModal(this)
    this._eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // Feather pickup — on the last platform (x=6080 w=4, y=height-304)
    // Platform top = height-304-16=height-320; feather 36px above that
    const featherDef = feathersData
      .filter(f => f.level === LEVEL_ID)
      .map(f => ({ ...f, x: 6144, y: height - 356 }))
    this.featherGroup = new FeatherPickup(this, LEVEL_ID, featherDef)
    this._setupFeatherOverlap()

    // Reed decorations
    this._addDecorations(height)

    // HUD
    this.scene.launch('UIScene', { level: LEVEL_ID })

    SaveSystem.setLastLevel(LEVEL_ID)

    // Start background music (Web Audio — needs user interaction first,
    // which the E-key / any earlier interaction provides)
    AudioManager.startMusic(this)
  }

  // ─── Background ─────────────────────────────────────────────────────────────

  _buildBackground(width, height) {
    const bgKey = this.textures.exists('bg_level1_v2') ? 'bg_level1_v2'
                : this.textures.exists('bg_level1')    ? 'bg_level1'
                : 'bg_marsh'
    this._bgMain = this.add.tileSprite(0, 0, width, height, bgKey)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-2)
      .setTileScale(width / 400, height / 225)
  }

  // ─── Terrain ────────────────────────────────────────────────────────────────

  _buildTerrain(height) {
    this.platforms = this.physics.add.staticGroup()

    for (let x = 0; x < LEVEL_WIDTH; x += TILE) {
      this.platforms.create(x + TILE / 2, height - TILE / 2, 'ground').refreshBody()
    }

    this._platformDefs = [
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
      { x: 5440, y: height - 384, w: 4 },
      { x: 5792, y: height - 224, w: 5 },
      { x: 6080, y: height - 304, w: 4 },
    ]

    for (const def of this._platformDefs) {
      for (let i = 0; i < def.w; i++) {
        this.platforms.create(def.x + i * TILE + TILE / 2, def.y, 'platform').refreshBody()
      }
    }
  }

  // ─── Enemies ────────────────────────────────────────────────────────────────

  _buildEnemies(height) {
    this.enemies = this.physics.add.group()

    // Ground foxes
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

    // Wolves on platforms — placed above surface so they land via gravity+collider.
    // patrol range padded inward by 28px on each side to keep wolf on the platform.
    if (this.textures.exists('wolf_idle')) {
      const wolfDefs = [
        { x: 480,  py: height - 224, w: 4 },
        { x: 992,  py: height - 288, w: 5 },
        { x: 1888, py: height - 320, w: 4 },
        { x: 2784, py: height - 352, w: 4 },
        { x: 3392, py: height - 288, w: 5 },
        { x: 4384, py: height - 320, w: 4 },
        { x: 5056, py: height - 272, w: 5 },
      ]
      for (const def of wolfDefs) {
        // spawn above platform top (py = tile centre, tile top = py - 16)
        const spawnY    = def.py - 16 - 48
        const spawnX    = def.x + Math.floor(def.w / 2) * TILE
        const padLeft   = def.x + 28
        const padRight  = def.x + def.w * TILE - 28
        const wolf = new Wolf(this, spawnX, spawnY, {
          patrolLeft:  padLeft,
          patrolRight: padRight,
        })
        this.enemies.add(wolf)
      }
    }

    this.physics.add.collider(this.enemies, this.platforms)

    // Overlap: stomp from above = defeat; side contact = lose life
    this.physics.add.overlap(
      this.player, this.enemies,
      this._onEnemyContact, null, this
    )
  }

  // ─── Enemy contact ──────────────────────────────────────────────────────────

  _onEnemyContact(player, enemy) {
    if (enemy._dead) return

    const stomping = player.body.velocity.y > 80 && player.y < enemy.y - 8
    if (stomping) {
      enemy.defeat()
      player.setVelocityY(-380)   // Mario-style bounce
    } else {
      this._onHitEnemy(player, enemy)
    }
  }

  _onHitEnemy(player, _enemy) {
    const now = this.time.now
    if (now < player._invincibleUntil) return   // still invincible

    const dir = player.x < _enemy.x ? -1 : 1
    player.setVelocity(dir * 280, -320)
    player._invincibleUntil = now + 1800        // 1.8s grace period

    // Flash to signal damage
    this.tweens.add({
      targets: player, alpha: 0.25, duration: 90,
      yoyo: true, repeat: 8,
      onComplete: () => player.setAlpha(1),
    })

    const uiScene = this.scene.get('UIScene')
    const isDead  = uiScene?.loseLife?.()
    if (isDead) this._gameOver()
  }

  // ─── Game over ──────────────────────────────────────────────────────────────

  _gameOver() {
    const { width, height } = this.scale

    // Freeze player
    this.player.setVelocity(0, 0)
    this.player.body.enable = false

    // "GAME OVER" overlay
    const messages = [
      'Try again!',
      "Don't give up!",
      'You can do it, keep trying!',
      'One more time!',
    ]
    const msg = messages[Math.floor(Math.random() * messages.length)]

    this.add.rectangle(width / 2, height / 2, 560, 110, 0x1a1a2e, 0.82)
      .setScrollFactor(0).setDepth(20)
    this.add.text(width / 2, height / 2 - 16, 'Oops! You lost all your lives.', {
      fontSize: '22px', fontFamily: '"Courier New", monospace',
      color: '#dddddd', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21)
    this.add.text(width / 2, height / 2 + 20, msg, {
      fontSize: '26px', fontFamily: '"Courier New", monospace',
      color: '#ffdd44', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21)

    // Restart after 2 s
    this.time.delayedCall(2000, () => {
      AudioManager.stopMusic()
      this.scene.stop('UIScene')
      this.scene.restart()
    })
  }

  // ─── Decorations ────────────────────────────────────────────────────────────

  _addDecorations(height) {
    const reedPositions = [180, 450, 820, 1100, 1450, 1750, 2200, 2550, 2900,
                           3200, 3550, 3850, 4200, 4500, 4850, 5100, 5450, 5750, 6100]
    for (const x of reedPositions) {
      this.add.image(x, height - TILE - 24, 'deco_reed')
        .setDepth(-0.5)
        .setScale(Phaser.Math.Between(80, 120) / 100)
    }
  }

  // ─── Feather ────────────────────────────────────────────────────────────────

  _setupFeatherOverlap() {
    this.physics.add.overlap(
      this.player,
      this.featherGroup,
      (_player, pickup) => {
        this.featherGroup.collect(pickup, (data) => this._endLevel(data))
      },
      null, this
    )
  }

  _endLevel(featherData) {
    // Freeze player
    this.player.inputBlocked = true
    this.player.setVelocity(0, 0)

    AudioManager.stopMusic()

    const { width, height } = this.scale

    // Flash + collect notice
    const notice = this.add.text(width / 2, height / 2 - 60,
      `✨ ${featherData.name}!`, {
        fontSize: '26px', fontFamily: '"Courier New", monospace',
        color: featherData.glowColor ?? '#ffdd44',
        stroke: '#000', strokeThickness: 4,
      }).setScrollFactor(0).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: notice, y: height / 2 - 120, alpha: 0,
      duration: 1800, ease: 'Power2',
    })

    // Transition to EndScene after brief pause
    this.time.delayedCall(2000, () => {
      this.scene.stop('UIScene')
      this.scene.start('EndScene', { featherData })
    })
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  update(_time, delta) {
    this._bgMain.tilePositionX = this.cameras.main.scrollX * 0.3

    this.player.update(delta)

    for (const enemy of this.enemies.getChildren()) enemy.update()

    // Sign proximity
    let nearSign = null
    for (const sign of this.signGroup.getSigns()) {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, sign.x, sign.y) < 64) {
        nearSign = sign
        if (sign.signData.isHidden) this.signGroup.revealHidden(sign)
        break
      }
    }

    if (nearSign && Phaser.Input.Keyboard.JustDown(this._eKey) && !this.modal.isOpen) {
      this.player.inputBlocked = true
      this.modal.open(nearSign.signData)
    }
  }
}
