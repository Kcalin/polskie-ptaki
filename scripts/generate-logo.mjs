/**
 * PixelLab — logo text "POLSKIE PTAKI" jako pixel art
 * Usage: node scripts/generate-logo.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })

function toBase64(data) {
  if (typeof data === 'string') return data.replace(/^data:image\/\w+;base64,/, '')
  if (data?.base64) return data.base64
  throw new Error('Unknown: ' + JSON.stringify(Object.keys(data ?? {})))
}

function save(base64, filename) {
  writeFileSync(join(OUT_DIR, filename), Buffer.from(base64, 'base64'))
  console.log(`  ✓ ${filename}`)
}

async function pixflux(description, width, height, extra = {}) {
  console.log(`  pixflux (${width}×${height})…`)
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({ description, image_size: { width, height }, text_guidance_scale: 8, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nBalance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── Logo: "POLSKIE PTAKI" jako pixel art napis ──────────────────────────────
console.log('=== Logo text ===')
const logo = await pixflux(
  'pixel art game logo text reading "POLSKIE PTAKI", ' +
  'large bold retro pixel font letters, white and yellow colors, ' +
  'each letter clearly readable, strong dark outline on every letter, ' +
  'transparent background, no decorations, just the text',
  320, 80,
  { no_background: true }
)
save(logo, 'ui_logo_text.png')

// ── Większy banner ────────────────────────────────────────────────────────────
console.log('\n=== Wider banner ===')
const banner = await pixflux(
  'pixel art decorative wide banner frame, ornate wooden sign board, ' +
  'nature theme with bird feathers and autumn leaves in corners, ' +
  'empty centre for text, dark brown aged wood with gold metal corners, ' +
  'Polish national park style, transparent background, horizontal wide rectangle',
  400, 112,
  { no_background: true }
)
save(banner, 'ui_logo_banner2.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
