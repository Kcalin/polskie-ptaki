import touchInput from './touchInput.js'

// Pixel-art colour palette for buttons
const BTN_BG      = 0x1a1a2e
const BTN_BORDER  = 0xffe066
const BTN_ALPHA   = 0.72
const FONT        = '"Courier New", monospace'

const BTN_SIZE = 80   // square buttons
const PAD      = 16   // distance from screen edge
// Vertical centre for the button row — clear of hearts (y≈20-40) and level label
const BTN_Y_OFFSET = 58  // from top edge to button centre

export default class TouchScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TouchScene', active: false })
    this._interactBtn = null
    this._allBtns     = []
  }

  create() {
    // Only active on touch devices
    if (!this.sys.game.device.input.touch) return

    // Support up to 4 simultaneous touch points
    this.input.addPointer(3)

    const { width, height } = this.scale

    const btnY = BTN_Y_OFFSET + BTN_SIZE / 2

    // ── Left / Right ──────────────────────────────────────────────────────────
    this._allBtns.push(this._makeHeldBtn(
      PAD + BTN_SIZE / 2, btnY, '◄',
      () => { touchInput.left  = true  },
      () => { touchInput.left  = false },
    ))
    this._allBtns.push(this._makeHeldBtn(
      PAD + BTN_SIZE * 1.5 + 12, btnY, '►',
      () => { touchInput.right = true  },
      () => { touchInput.right = false },
    ))

    // ── Jump (tap) ────────────────────────────────────────────────────────────
    this._allBtns.push(this._makeTapBtn(
      width - PAD - BTN_SIZE / 2, btnY, '▲\nSkok',
      () => { touchInput._jumpDown = true },
    ))

    // ── Display / Shift (tap) ─────────────────────────────────────────────────
    this._allBtns.push(this._makeTapBtn(
      width - PAD - BTN_SIZE * 1.5 - 12, btnY, '💨\nPodmuch',
      () => { touchInput._shiftDown = true },
    ))

    // ── Interact / E (contextual tap) — below Jump button ────────────────────
    this._interactBtn = this._makeTapBtn(
      width - PAD - BTN_SIZE / 2,
      btnY + BTN_SIZE + 8,
      'E\nTablica',
      () => { touchInput._interactDown = true },
      0x3a8a3a,
    )
    this._allBtns.push(this._interactBtn)
    this._interactBtn.setVisible(false)
  }

  update() {
    if (!this.sys.game.device.input.touch) return
    if (!this._allBtns.length) return

    if (touchInput.modalOpen) {
      // Hide all buttons and clear held directions so player doesn't get stuck
      this._allBtns.forEach(b => b.setVisible(false))
      touchInput.left  = false
      touchInput.right = false
      return
    }

    // Show all buttons except contextual E (controlled separately)
    this._allBtns.forEach(b => b.setVisible(true))
    this._interactBtn.setVisible(touchInput.showInteract)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /** A button that fires while held (left / right). */
  _makeHeldBtn(cx, cy, label, onDown, onUp, bgColor = BTN_BG) {
    const container = this._drawBtn(cx, cy, label, bgColor)
    const hit = this.add.rectangle(cx, cy, BTN_SIZE, BTN_SIZE)
      .setInteractive({ useHandCursor: false })
      .setDepth(51)

    hit.on('pointerdown',  onDown)
    hit.on('pointerup',    onUp)
    hit.on('pointerout',   onUp)

    // Add hit to container so setVisible(false) also disables touch input
    container.add(hit)
    return container
  }

  /** A button that fires once on tap (jump / shift / interact). */
  _makeTapBtn(cx, cy, label, onDown, bgColor = BTN_BG) {
    const container = this._drawBtn(cx, cy, label, bgColor)
    const hit = this.add.rectangle(cx, cy, BTN_SIZE, BTN_SIZE)
      .setInteractive({ useHandCursor: false })
      .setDepth(51)

    hit.on('pointerdown', onDown)

    // Add hit to container so setVisible(false) also disables touch input
    container.add(hit)
    return container
  }

  /** Draw a pixel-art button graphic + label. Returns a container. */
  _drawBtn(cx, cy, label, bgColor = BTN_BG) {
    const g = this.add.graphics().setDepth(50)
    const x = cx - BTN_SIZE / 2
    const y = cy - BTN_SIZE / 2

    // Shadow
    g.fillStyle(0x000000, 0.45)
    g.fillRect(x + 4, y + 4, BTN_SIZE, BTN_SIZE)

    // Background
    g.fillStyle(bgColor, BTN_ALPHA)
    g.fillRect(x, y, BTN_SIZE, BTN_SIZE)

    // Border (2-px pixel outline)
    g.lineStyle(2, BTN_BORDER, 0.85)
    g.strokeRect(x, y, BTN_SIZE, BTN_SIZE)

    // Corner pixels (nail effect)
    g.fillStyle(BTN_BORDER, 0.9)
    g.fillRect(x + 2, y + 2, 4, 4)
    g.fillRect(x + BTN_SIZE - 6, y + 2, 4, 4)
    g.fillRect(x + 2, y + BTN_SIZE - 6, 4, 4)
    g.fillRect(x + BTN_SIZE - 6, y + BTN_SIZE - 6, 4, 4)

    const txt = this.add.text(cx, cy, label, {
      fontSize: '16px',
      fontFamily: FONT,
      color: '#ffe066',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(50)

    // Group graphics + text so setVisible works on both
    const container = this.add.container(0, 0, [g, txt]).setDepth(50)
    return container
  }
}
