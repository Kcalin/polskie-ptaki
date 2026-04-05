export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const g = this.make.graphics({ x: 0, y: 0, add: false })

    const make = (key, w, h, fillFn) => {
      g.clear()
      fillFn(g)
      g.generateTexture(key, w, h)
    }

    // Player (bocian) — white body, black wingtips
    make('bocian', 48, 48, (g) => {
      g.fillStyle(0xffffff); g.fillRect(8, 8, 32, 32)
      g.fillStyle(0x222222); g.fillRect(0, 16, 8, 8); g.fillRect(40, 16, 8, 8)
      g.fillStyle(0xff4444); g.fillRect(20, 4, 8, 8)  // red head top
      g.fillStyle(0xff8800); g.fillRect(24, 8, 10, 4) // orange beak
    })

    // Ground — dark green with grass top
    make('ground', 16, 16, (g) => {
      g.fillStyle(0x5d4037); g.fillRect(0, 0, 16, 16)
      g.fillStyle(0x558b2f); g.fillRect(0, 0, 16, 4)
    })

    // Platform — wooden brown
    make('platform', 16, 16, (g) => {
      g.fillStyle(0x795548); g.fillRect(0, 0, 16, 16)
      g.fillStyle(0x6d4c41); g.fillRect(0, 0, 16, 2)
    })

    // Education sign — wooden post + sign board
    make('sign', 24, 32, (g) => {
      g.fillStyle(0x795548); g.fillRect(10, 16, 4, 16)  // post
      g.fillStyle(0xffe082); g.fillRect(2, 2, 20, 16)   // board
      g.fillStyle(0x5d4037); g.fillRect(2, 2, 20, 2)    // top edge
      g.fillStyle(0x000000)
      g.fillRect(5, 6, 14, 2)
      g.fillRect(5, 10, 10, 2)
    })

    // Hidden sign — glowing golden
    make('sign_hidden', 24, 32, (g) => {
      g.fillStyle(0x795548); g.fillRect(10, 16, 4, 16)
      g.fillStyle(0xffd700); g.fillRect(2, 2, 20, 16)
      g.fillStyle(0xff8c00); g.fillRect(2, 2, 20, 2)
    })

    // Feather pickup — cyan teardrop
    make('feather', 16, 20, (g) => {
      g.fillStyle(0x00e5ff); g.fillEllipse(8, 10, 12, 16)
      g.fillStyle(0xffffff); g.fillEllipse(8, 7, 5, 7)
    })

    // Fox — orange rectangle with darker ears
    make('fox', 40, 28, (g) => {
      g.fillStyle(0xe65100); g.fillRect(4, 8, 32, 18)  // body
      g.fillStyle(0xbf360c); g.fillRect(0, 0, 10, 12)  // head
      g.fillStyle(0xffffff); g.fillRect(2, 0, 4, 6)    // ear
      g.fillStyle(0xe65100); g.fillRect(30, 8, 10, 8)  // tail base
    })

    g.destroy()
  }

  create() {
    this.scene.start('TitleScene')
  }
}
