/**
 * Background music manager using ElevenLabs-generated audio files.
 * Wraps Phaser's sound system with fade-in/out support.
 *
 * Usage (inside a Phaser scene):
 *   AudioManager.startMusic(scene)
 *   AudioManager.stopMusic()
 */
class _AudioManager {
  constructor() {
    this._music  = null
    this._scene  = null
  }

  startMusic(scene) {
    if (this._music?.isPlaying) return
    this._scene = scene

    if (!scene.cache.audio.exists('bg_level1')) return

    const doPlay = () => {
      if (this._music?.isPlaying) return
      this._music = scene.sound.add('bg_level1', { loop: true, volume: 0 })
      this._music.play()
      scene.tweens.add({
        targets:  this._music,
        volume:   0.35,
        duration: 1500,
        ease:     'Linear',
      })
    }

    // On mobile the AudioContext is locked until the first user gesture completes.
    // Phaser emits 'unlocked' when it's safe to play — wait for it if needed.
    if (scene.sound.locked) {
      scene.sound.once('unlocked', doPlay)
    } else {
      doPlay()
    }
  }

  stopMusic() {
    if (!this._music) return
    const music = this._music
    this._music  = null

    if (!music.isPlaying) { music.destroy(); return }

    // Fade out over 800 ms then destroy
    this._scene?.tweens.add({
      targets:  music,
      volume:   0,
      duration: 800,
      ease:     'Linear',
      onComplete: () => music.destroy(),
    })
  }

  setVolume(v) {
    if (this._music) this._music.setVolume(Math.max(0, Math.min(1, v)))
  }
}

export default new _AudioManager()
