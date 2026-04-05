const C = {
  bg:            0x1a2a1a,
  frame_outer:   0x5c3d11,
  frame_mid:     0x8b6914,
  frame_inner:   0xc49a3c,
  nail:          0xc0a000,
  nail_hi:       0xffe066,
  title:         '#ffe066',
  subtitle:      '#aaddaa',
  text:          '#e8f5e9',
  threat_high:   '#ff5555',
  threat_medium: '#ffaa33',
  btn_normal:    0x3a5a3a,
  btn_hover:     0x4caf50,
  btn_correct:   0x2e7d32,
  btn_wrong:     0x7f1010,
  btn_selected:  0x1a5f8a,
  nav_btn:       0x5c3d11,
  nav_btn_hi:    0x8b6914,
  nav_btn_dis:   0x2a2a2a,
  hint:          '#ffdd00',
  credit:        '#ffe066',
  dot_on:        0xffe066,
  dot_off:       0x444444,
}

const FONT   = '"Courier New", monospace'
const MW     = 780, MH = 440
const BORDER = 12
const PAD    = 18
const PHOTO_W = 190
const LABELS  = ['A', 'B', 'C', 'D']

export default class SignModal {
  constructor(scene) {
    this.scene          = scene
    this.container      = null
    this.currentSign    = null
    this.pageIndex      = 0
    this._active        = false
    this._quizAnswered  = false
    this._quizSelected  = 0
    this._gfx           = null
    this._overlay       = null
    // Interactive hit zones added directly to scene (not container) so
    // setScrollFactor(0) works correctly on a scrolling camera.
    this._sceneHits     = []
    this._leftKey = this._rightKey = this._upKey = this._downKey =
    this._enterKey = this._spaceKey = this._escKey =
    this._aKey = this._dKey = this._wKey = this._sKey = null
  }

  // ─── Public ──────────────────────────────────────────────────────────────────

  open(signData) {
    if (this._active) return
    this._active       = true
    this.currentSign   = signData
    this.pageIndex     = 0
    this._quizAnswered = false
    this._quizSelected = 0
    this._shuffleQuiz(signData.pages[0])

    const { width, height } = this.scene.scale
    this._sx = Math.round((width  - MW) / 2)
    this._sy = Math.round((height - MH) / 2)

    this._overlay = this.scene.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(10)

    this._gfx = this.scene.add.graphics().setScrollFactor(0).setDepth(11)
    this._drawFrame()

    this.container = this.scene.add.container(0, 0).setScrollFactor(0).setDepth(12)
    this._renderPage()
    this._buildCloseButton()

    // ── Keyboard ──────────────────────────────────────────────────────────────
    const K = Phaser.Input.Keyboard.KeyCodes
    this._leftKey  = this.scene.input.keyboard.addKey(K.LEFT)
    this._rightKey = this.scene.input.keyboard.addKey(K.RIGHT)
    this._upKey    = this.scene.input.keyboard.addKey(K.UP)
    this._downKey  = this.scene.input.keyboard.addKey(K.DOWN)
    this._enterKey = this.scene.input.keyboard.addKey(K.ENTER)
    this._spaceKey = this.scene.input.keyboard.addKey(K.SPACE)
    this._escKey   = this.scene.input.keyboard.addKey(K.ESC)
    this._aKey     = this.scene.input.keyboard.addKey(K.A)
    this._dKey     = this.scene.input.keyboard.addKey(K.D)
    this._wKey     = this.scene.input.keyboard.addKey(K.W)
    this._sKey     = this.scene.input.keyboard.addKey(K.S)

    this._leftKey.on('down',  () => this._navigate(-1))
    this._rightKey.on('down', () => this._navigate(1))
    this._aKey.on('down',     () => this._navigate(-1))
    this._dKey.on('down',     () => this._navigate(1))
    this._upKey.on('down',    () => this._quizMove(-1))
    this._downKey.on('down',  () => this._quizMove(1))
    this._wKey.on('down',     () => this._quizMove(-1))
    this._sKey.on('down',     () => this._quizMove(1))
    this._enterKey.on('down', () => this._quizConfirm())
    this._spaceKey.on('down', () => this._quizConfirm())
    this._escKey.once('down', () => this.close())
  }

  close() {
    if (!this._active) return
    this._active = false
    ;[this._leftKey, this._rightKey, this._upKey, this._downKey,
      this._enterKey, this._spaceKey, this._escKey,
      this._aKey, this._dKey, this._wKey, this._sKey]
      .forEach(k => k?.removeAllListeners())
    this._overlay?.destroy()
    this._gfx?.destroy()
    this._closeBtn?.destroy()
    this.container?.destroy()
    this.container = null
    this._clearSceneHits()
    this.scene.events.emit('signClosed')
  }

  get isOpen() { return this._active }

  // ─── Frame ───────────────────────────────────────────────────────────────────

  _drawFrame() {
    const { _sx: x, _sy: y } = this
    this._gfx.fillStyle(0x000000, 0.45); this._gfx.fillRect(x + 6, y + 6, MW, MH)
    this._gfx.fillStyle(C.frame_outer);  this._gfx.fillRect(x,     y,     MW,     MH)
    this._gfx.fillStyle(C.frame_mid);    this._gfx.fillRect(x + 4, y + 4, MW - 8, MH - 8)
    this._gfx.fillStyle(C.frame_inner);  this._gfx.fillRect(x + 8, y + 8, MW - 16, MH - 16)
    this._gfx.fillStyle(C.bg);           this._gfx.fillRect(x + BORDER, y + BORDER, MW - BORDER * 2, MH - BORDER * 2)
    const nails = [
      [x + 5, y + 5], [x + MW - 13, y + 5],
      [x + 5, y + MH - 13], [x + MW - 13, y + MH - 13],
    ]
    for (const [nx, ny] of nails) {
      this._gfx.fillStyle(C.nail);    this._gfx.fillRect(nx, ny, 8, 8)
      this._gfx.fillStyle(C.nail_hi); this._gfx.fillRect(nx + 2, ny + 2, 3, 3)
    }
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  _navigate(dir) {
    const newIdx = this.pageIndex + dir
    if (newIdx < 0 || newIdx >= this.currentSign.pages.length) return
    this.pageIndex     = newIdx
    this._quizAnswered = false
    this._quizSelected = 0
    this._shuffleQuiz(this.currentSign.pages[newIdx])
    this._renderPage()
  }

  // Shuffle answers once per quiz page; store shuffled order + new correct index
  _shuffleQuiz(page) {
    if (page?.type !== 'quiz') { this._shuffled = null; return }
    const indices = page.answers.map((_, i) => i)
    // Fisher-Yates
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    this._shuffled = {
      answers:      indices.map(i => page.answers[i]),
      correctIndex: indices.indexOf(page.correctIndex),
    }
  }

  _quizMove(dir) {
    const page = this.currentSign.pages[this.pageIndex]
    if (page.type !== 'quiz' || this._quizAnswered) return
    const count = page.answers.length
    this._quizSelected = ((this._quizSelected + dir) + count) % count
    this._renderPage()
  }

  _quizConfirm() {
    const page = this.currentSign.pages[this.pageIndex]
    if (page.type !== 'quiz' || this._quizAnswered) return
    const correctIndex = this._shuffled?.correctIndex ?? page.correctIndex
    this._resolveAnswer(page, this._quizSelected, correctIndex)
  }

  // ─── Page rendering ──────────────────────────────────────────────────────────

  _renderPage() {
    this.container.removeAll(true)
    this._clearSceneHits()

    const page  = this.currentSign.pages[this.pageIndex]
    const total = this.currentSign.pages.length
    const ix = this._sx + BORDER + PAD
    const iy = this._sy + BORDER + PAD
    const iw = MW - (BORDER + PAD) * 2
    const ih = MH - (BORDER + PAD) * 2

    // Photo column on page 0
    const showPhoto = this.pageIndex === 0 &&
      !!this.currentSign.wikiPhoto &&
      this.scene.textures.exists(this.currentSign.wikiPhoto)

    if (showPhoto) this._renderPhoto(ix, iy)

    const textX = showPhoto ? ix + PHOTO_W + 14 : ix
    const textW = showPhoto ? iw - PHOTO_W - 14 : iw

    if (page.type === 'quiz') {
      this._renderQuiz(page, ix, iy, iw, ih)
    } else {
      this._renderInfo(page, textX, iy, textW)
    }

    this._renderDots(total)
    this._renderNavButtons(total)

    // Hint (bottom center) — keyboard only, hide on touch devices
    if (!this.scene.sys.game.device.input.touch) {
      this._add(this.scene.add.text(
        this._sx + MW / 2, this._sy + MH - BORDER - 4,
        '← → / A D  zmień stronę   •   ESC zamknij',
        { fontSize: '11px', fontFamily: FONT, color: C.hint }
      ).setOrigin(0.5, 1))
    }
  }

  // ── Photo ───────────────────────────────────────────────────────────────────

  _renderPhoto(ix, iy) {
    const key  = this.currentSign.wikiPhoto
    this._add(this.scene.add.rectangle(
      ix + PHOTO_W / 2, iy + PHOTO_W / 2, PHOTO_W + 4, PHOTO_W + 4, 0x000000))
    const photo = this.scene.add.image(ix + PHOTO_W / 2, iy + PHOTO_W / 2, key)
    const src   = this.scene.textures.get(key).source[0]
    photo.setScale(Math.min(PHOTO_W / src.width, PHOTO_W / src.height))
    this._add(photo)
    if (this.currentSign.wikiCredit) {
      this._add(this.scene.add.text(ix, iy + PHOTO_W + 6, this.currentSign.wikiCredit,
        { fontSize: '9px', fontFamily: FONT, color: C.credit, wordWrap: { width: PHOTO_W } }))
    }
  }

  // ── Info page ───────────────────────────────────────────────────────────────

  _renderInfo(page, tx, ty, tw) {
    const titleColor = page.type === 'threat'
      ? (page.severity === 'high' ? C.threat_high : C.threat_medium) : C.title

    this._add(this.scene.add.text(tx, ty, page.title ?? '',
      { fontSize: '20px', fontFamily: FONT, color: titleColor }))
    let yOff = ty + 30

    if (page.subtitle) {
      this._add(this.scene.add.text(tx, yOff, page.subtitle,
        { fontSize: '13px', fontFamily: FONT, color: C.subtitle, fontStyle: 'italic' }))
      yOff += 22
    }
    if (page.type === 'threat') {
      const badge = page.severity === 'high' ? '!! ZAGROŻENIE !!' : '! Uwaga !'
      this._add(this.scene.add.text(tx, yOff, badge,
        { fontSize: '12px', fontFamily: FONT, color: titleColor }))
      yOff += 20
    }
    this._add(this.scene.add.text(tx, yOff + 6, page.text ?? '',
      { fontSize: '15px', fontFamily: FONT, color: C.text,
        wordWrap: { width: tw }, lineSpacing: 4 }))
  }

  // ── Quiz page ───────────────────────────────────────────────────────────────

  _renderQuiz(page, ix, iy, iw, ih) {
    // Use shuffled answers if available
    const answers      = this._shuffled?.answers      ?? page.answers
    const correctIndex = this._shuffled?.correctIndex ?? page.correctIndex

    // Header
    this._add(this.scene.add.text(ix, iy, '? Quiz', {
      fontSize: '16px', fontFamily: FONT, color: C.title }))
    this._add(this.scene.add.text(ix, iy + 26, page.question, {
      fontSize: '16px', fontFamily: FONT, color: '#ffffff',
      wordWrap: { width: iw }, lineSpacing: 3 }))

    // Navigation hint for quiz
    if (!this._quizAnswered) {
      this._add(this.scene.add.text(ix + iw, iy + 26,
        '↑↓ / W S  zaznacz\nENTER wybierz',
        { fontSize: '11px', fontFamily: FONT, color: C.hint, align: 'right' }
      ).setOrigin(1, 0))
    }

    // Answer buttons
    const btnH   = 42
    const btnGap = 48
    const startY = iy + 94

    answers.forEach((answer, i) => {
      const by       = startY + i * btnGap
      const selected = !this._quizAnswered && i === this._quizSelected
      let   bgColor  = selected ? C.btn_selected : C.btn_normal

      if (this._quizAnswered) {
        if (i === correctIndex)        bgColor = C.btn_correct
        else if (i === this._quizSelected) bgColor = C.btn_wrong
      }

      const bg = this.scene.add.rectangle(ix, by, iw, btnH, bgColor).setOrigin(0, 0)
      if (selected) {
        const border = this.scene.add.rectangle(ix - 2, by - 2, iw + 4, btnH + 4, C.frame_inner)
          .setOrigin(0, 0).setFillStyle(0, 0).setStrokeStyle(2, C.frame_inner)
        this._add(border)
      }

      const label = this.scene.add.text(ix + 10, by + btnH / 2, `${LABELS[i]}.`,
        { fontSize: '14px', fontFamily: FONT, color: C.title }).setOrigin(0, 0.5)
      const txt = this.scene.add.text(ix + 36, by + btnH / 2, answer,
        { fontSize: '14px', fontFamily: FONT, color: '#ffffff',
          wordWrap: { width: iw - 46 } }).setOrigin(0, 0.5)

      if (!this._quizAnswered) {
        // pointerover (hover) stays on container child — visual only
        bg.setInteractive({ useHandCursor: true })
          .on('pointerover', () => { this._quizSelected = i; this._renderPage() })
        // pointerdown as scene-level hit so scrollFactor(0) input works correctly
        this._addSceneHit(ix, by, iw, btnH,
          () => { if (!this._quizAnswered) this._resolveAnswer(page, i, correctIndex) },
          0)  // origin 0
      }

      this._add(bg)
      this._add(label)
      this._add(txt)
    })

    // Feedback
    if (this._quizAnswered) {
      const correct = this._quizSelected === correctIndex
      const fb = correct ? page.feedbackCorrect : page.feedbackWrong
      this._add(this.scene.add.text(ix, iy + ih - 40, fb, {
        fontSize: '14px', fontFamily: FONT,
        color: correct ? '#88ff88' : '#ff8888',
        wordWrap: { width: iw },
      }))
    }
  }

  _resolveAnswer(page, idx, correctIndex) {
    this._quizAnswered = true
    this._quizSelected = idx
    if (idx === (correctIndex ?? page.correctIndex)) {
      this.scene.events.emit('quizCorrect')
    }
    this._renderPage()
  }

  // ── Dots ────────────────────────────────────────────────────────────────────

  _renderDots(total) {
    const cy     = this._sy + MH - BORDER - 22
    const gap    = 14
    const startX = this._sx + MW / 2 - ((total - 1) * gap) / 2
    for (let i = 0; i < total; i++) {
      this._add(this.scene.add.rectangle(
        startX + i * gap, cy, 7, 7,
        i === this.pageIndex ? C.dot_on : C.dot_off
      ))
    }
  }

  // ── On-screen nav arrow buttons ─────────────────────────────────────────────

  _renderNavButtons(total) {
    const midY  = this._sy + MH / 2 - 10
    const btnW  = 44, btnH = 56

    // ◄ Previous — visual in container, hit zone directly in scene
    const lDisabled = this.pageIndex === 0
    const lx = this._sx - btnW / 2 - 2
    this._add(this.scene.add.rectangle(lx, midY, btnW, btnH,
      lDisabled ? C.nav_btn_dis : C.nav_btn).setOrigin(0.5))
    this._add(this.scene.add.text(lx, midY, '◄',
      { fontSize: '20px', fontFamily: FONT,
        color: lDisabled ? '#444444' : '#ffe066' }).setOrigin(0.5))
    if (!lDisabled) {
      this._addSceneHit(lx, midY, btnW, btnH, () => this._navigate(-1))
    }

    // ► Next
    const rDisabled = this.pageIndex === total - 1
    const rx = this._sx + MW + btnW / 2 + 2
    this._add(this.scene.add.rectangle(rx, midY, btnW, btnH,
      rDisabled ? C.nav_btn_dis : C.nav_btn).setOrigin(0.5))
    this._add(this.scene.add.text(rx, midY, '►',
      { fontSize: '20px', fontFamily: FONT,
        color: rDisabled ? '#444444' : '#ffe066' }).setOrigin(0.5))
    if (!rDisabled) {
      this._addSceneHit(rx, midY, btnW, btnH, () => this._navigate(1))
    }
  }

  // ─── Close button (top-right corner, inside frame) ───────────────────────────

  _buildCloseButton() {
    const SIZE = 44   // square button size
    // Position: inside frame, top-right corner
    const cx = this._sx + MW - BORDER - SIZE / 2 - 4
    const cy = this._sy + BORDER + SIZE / 2 + 4

    const g = this.scene.add.graphics().setScrollFactor(0).setDepth(13)

    const draw = (hover) => {
      g.clear()
      // Outer border
      g.fillStyle(hover ? C.frame_mid : C.frame_outer)
      g.fillRect(cx - SIZE / 2, cy - SIZE / 2, SIZE, SIZE)
      // Inner fill
      g.fillStyle(hover ? 0x7f1010 : 0x3a1010)
      g.fillRect(cx - SIZE / 2 + 3, cy - SIZE / 2 + 3, SIZE - 6, SIZE - 6)
    }
    draw(false)

    const label = this.scene.add.text(cx, cy, '✕', {
      fontSize: '26px', fontFamily: FONT, color: '#ff8888',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(14)

    const hit = this.scene.add.rectangle(cx, cy, SIZE, SIZE)
      .setScrollFactor(0).setDepth(15)
      .setInteractive({ useHandCursor: true })
    hit.on('pointerover',  () => { draw(true);  label.setColor('#ffffff') })
    hit.on('pointerout',   () => { draw(false); label.setColor('#ff8888') })
    hit.on('pointerdown',  () => this.close())

    this._closeBtn = { destroy: () => { g.destroy(); label.destroy(); hit.destroy() } }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _add(obj) { this.container.add(obj); return obj }

  // Invisible hit zone added directly to scene with scrollFactor(0) so input
  // works correctly even when the game camera is scrolled.
  // origin=0.5 (default) for centered rects, origin=0 for top-left rects.
  _addSceneHit(x, y, w, h, onDown, origin = 0.5) {
    // Zone: invisible by design, still receives pointer events (alpha=0 rects don't)
    const hit = this.scene.add.zone(x, y, w, h)
      .setOrigin(origin)
      .setScrollFactor(0)
      .setDepth(20)
      .setInteractive({ useHandCursor: true })
    hit.on('pointerdown', onDown)
    this._sceneHits.push(hit)
    return hit
  }

  _clearSceneHits() {
    this._sceneHits.forEach(h => h.destroy())
    this._sceneHits = []
  }
}
