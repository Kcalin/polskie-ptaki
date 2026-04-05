/**
 * PixelLab UI asset generation — menu logo & button
 * Usage: node scripts/generate-ui.mjs
 *
 * Generates:
 *   ui_logo_banner.png   — decorative pixel art frame/banner for title (no text)
 *   ui_btn_start.png     — pixel art start button sprite
 *   ui_bocian_mascot.png — larger bocian mascot pose for title screen
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR = './public/assets/sprites'

const h = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
})

function toBase64(data) {
  if (typeof data === 'string') return data.replace(/^data:image\/\w+;base64,/, '')
  if (data?.base64) return data.base64
  throw new Error('Unknown image format: ' + JSON.stringify(Object.keys(data ?? {})))
}

function save(base64, filename) {
  writeFileSync(join(OUT_DIR, filename), Buffer.from(base64, 'base64'))
  console.log(`  ✓ saved ${filename}`)
}

async function pixflux(description, width, height, extra = {}) {
  console.log(`  Calling PixelLab (${width}×${height})…`)
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width, height },
      text_guidance_scale: 8,
      ...extra,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`pixflux error: ${JSON.stringify(data)}`)
  const cost = data.usage?.usd ?? 0
  console.log(`  [cost $${cost.toFixed(4)}]`)
  return toBase64(data.image)
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const balRes = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal = await balRes.json()
console.log(`\nPixelLab balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── 1. Logo banner (decorative frame, no text inside) ────────────────────────
console.log('=== Logo banner ===')
const logoBanner = await pixflux(
  'pixel art decorative banner frame for a game title, ' +
  'ornate wooden sign board with nature theme, ' +
  'bird feathers and leaves as decoration on the corners, ' +
  'empty centre area for text, dark brown wood with gold trim, ' +
  'Polish national park nature style, transparent background, ' +
  'horizontal wide banner shape',
  320, 96,
  { no_background: true }
)
save(logoBanner, 'ui_logo_banner.png')

// ── 2. Start button sprite ───────────────────────────────────────────────────
console.log('\n=== Start button ===')
const btnStart = await pixflux(
  'pixel art game button, wide rectangular button sprite, ' +
  'bright golden yellow color, pixel art style, ' +
  'beveled edges with darker border, shiny highlight on top edge, ' +
  'empty centre for text label, retro game UI button, transparent background',
  256, 48,
  { no_background: true }
)
save(btnStart, 'ui_btn_start.png')

// ── 3. Bocian mascot for title screen (larger, more detailed) ────────────────
console.log('\n=== Title mascot ===')
const mascot = await pixflux(
  'white stork bird pixel art, chibi cute cartoon style, ' +
  'full body standing proud pose, wings slightly open, ' +
  'white feathers with black wing tips, long orange-red beak, ' +
  'long red legs, friendly face, transparent background, ' +
  'game mascot character, facing slightly left toward viewer',
  96, 96,
  { no_background: true }
)
save(mascot, 'ui_mascot.png')

// ─── Done ─────────────────────────────────────────────────────────────────────
const balRes2 = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal2 = await balRes2.json()
console.log(`\n=== Done! ===`)
console.log(`Remaining balance: $${(bal2.usd ?? 0).toFixed(4)}`)
