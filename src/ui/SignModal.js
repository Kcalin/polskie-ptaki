const COLORS = {
  bg: 0x1a2a1a,
  border: 0x8b6914,
  title: '#ffe066',
  text: '#e8f5e9',
  threat_high: '#ff5555',
  threat_medium: '#ffaa33',
  btn_correct: 0x2e7d32,
  btn_wrong: 0x7f1010,
  btn_normal: 0x3a5a3a,
  btn_hover: 0x4caf50,
}

export default class SignModal {
  constructor(scene) {
    this.scene = scene
    this.container = null
    this.currentSign = null
    this.pageIndex = 0
    this._active = false
    this._quizAnswered = false
  }

  open(signData) {
    if (this._active) return
    this._active = true
    this.currentSign = signData
    this.pageIndex = 0
    this._quizAnswered = false

    const { width, height } = this.scene.scale

    // Darken background
    this._overlay = this.scene.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(10)

    // Modal box
    const mw = 760, mh = 420
    this._box = this.scene.add
      .rectangle(width / 2, height / 2, mw, mh, COLORS.bg)
      .setScrollFactor(0)
      .setDepth(11)
      .setStrokeStyle(3, COLORS.border)

    this.container = this.scene.add.container(width / 2 - mw / 2, height / 2 - mh / 2).setScrollFactor(0).setDepth(12)

    this._renderPage()

    // Close on ESC
    this._escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    this._escKey.once('down', () => this.close())
  }

  _renderPage() {
    if (this.container) {
      this.container.removeAll(true)
    }

    const page = this.currentSign.pages[this.pageIndex]
    const total = this.currentSign.pages.length
    const mw = 760, mh = 420
    const pad = 32

    // Page counter
    this._addText(mw - pad, 14, `${this.pageIndex + 1} / ${total}`, 14, '#888888', 'right')

    // Title
    const titleColor = page.type === 'threat'
      ? (page.severity === 'high' ? COLORS.threat_high : COLORS.threat_medium)
      : COLORS.title

    this._addText(pad, 24, page.title ?? '', 22, titleColor)

    if (page.type === 'quiz') {
      this._renderQuiz(page, pad, mh)
    } else {
      // Body text
      this._addWrappedText(pad, 72, page.text ?? '', 16, COLORS.text, mw - pad * 2)

      // Threat badge
      if (page.type === 'threat') {
        const badge = page.severity === 'high' ? '⚠ ZAGROŻENIE' : '⚠ Uwaga'
        this._addText(pad, 56, badge, 13, titleColor)
      }
    }

    // Navigation buttons
    if (this.pageIndex > 0) {
      this._addButton(pad, mh - 52, '← Wstecz', () => {
        this.pageIndex--
        this._quizAnswered = false
        this._renderPage()
      })
    }

    const isLast = this.pageIndex === total - 1
    const nextLabel = isLast ? 'Zamknij ✕' : 'Dalej →'
    this._addButton(mw - pad - 120, mh - 52, nextLabel, () => {
      if (isLast) {
        this.close()
      } else {
        this.pageIndex++
        this._quizAnswered = false
        this._renderPage()
      }
    })
  }

  _renderQuiz(page, pad, mh) {
    this._addWrappedText(pad, 64, page.question, 17, '#ffffff', 700)

    const btnY = 150
    page.answers.forEach((answer, i) => {
      const btn = this._addButton(pad, btnY + i * 56, answer, () => {
        if (this._quizAnswered) return
        this._quizAnswered = true
        const correct = i === page.correctIndex
        const fb = correct ? page.feedbackCorrect : page.feedbackWrong
        const color = correct ? COLORS.btn_correct : COLORS.btn_wrong
        btn.list[0].setFillStyle(color)
        this._addWrappedText(pad, mh - 100, fb, 15, correct ? '#88ff88' : '#ff8888', 700)
      }, 700)
    })
  }

  _addText(x, y, str, size, color, align = 'left') {
    const t = this.scene.add.text(x, y, str, {
      fontSize: `${size}px`,
      fontFamily: 'Arial',
      color,
      align,
    })
    if (align === 'right') t.setOrigin(1, 0)
    this.container.add(t)
    return t
  }

  _addWrappedText(x, y, str, size, color, wrapWidth) {
    const t = this.scene.add.text(x, y, str, {
      fontSize: `${size}px`,
      fontFamily: 'Arial',
      color,
      wordWrap: { width: wrapWidth },
    })
    this.container.add(t)
    return t
  }

  _addButton(x, y, label, callback, width = 130) {
    const btn = this.scene.add.container(x, y)
    const bg = this.scene.add.rectangle(0, 0, width, 40, COLORS.btn_normal).setOrigin(0, 0)
    const txt = this.scene.add.text(width / 2, 20, label, {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#ffffff',
    }).setOrigin(0.5)
    btn.add([bg, txt])
    bg.setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(COLORS.btn_hover))
      .on('pointerout', () => bg.setFillStyle(COLORS.btn_normal))
      .on('pointerdown', callback)
    this.container.add(btn)
    return btn
  }

  close() {
    if (!this._active) return
    this._active = false
    this._overlay?.destroy()
    this._box?.destroy()
    this.container?.destroy()
    this.container = null
    this.scene.events.emit('signClosed')
  }

  get isOpen() {
    return this._active
  }
}
