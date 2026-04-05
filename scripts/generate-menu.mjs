/**
 * PixelLab menu asset generation
 * Usage: node scripts/generate-menu.mjs
 *
 * Generates:
 *   bg_title.png        — title screen background (400×225, night wetland)
 *   bocian_gust.png     — bocian with wings spread for SHIFT ability
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
  console.log(`  Calling PixelLab pixflux (${width}×${height})…`)
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

// ─── Setup ───────────────────────────────────────────────────────────────────
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const balRes = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal = await balRes.json()
console.log(`\nPixelLab balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── 1. Title screen background ───────────────────────────────────────────────
console.log('=== Title screen background ===')
console.log('Generating bg_title.png…')

const bgTitle = await pixflux(
  'pixel art 2D background scene, night wetlands, Poland Biebrza marsh, ' +
  'dark starry sky with crescent moon, distant tree silhouettes, ' +
  'calm water with moon reflection, reeds and cattails in foreground silhouette, ' +
  'atmospheric blue-green palette, magical night mood, no text, no HUD, ' +
  'wide landscape panorama, game title screen background',
  400, 225,
  { no_background: false }
)
save(bgTitle, 'bg_title.png')

// ── 2. Level 1 background (higher quality daytime Biebrza) ──────────────────
console.log('\n=== Level 1 background (daytime) ===')
console.log('Generating bg_level1.png…')

const bgLevel1 = await pixflux(
  'pixel art 2D platformer background, Biebrza National Park Poland, ' +
  'spring day, pale blue sky, white fluffy clouds, ' +
  'distant green marshland with water reflections, ' +
  'reeds and bulrushes mid-ground, warm spring sunlight, ' +
  'flat parallax layer, no foreground objects, no characters',
  400, 225,
  { no_background: false }
)
save(bgLevel1, 'bg_level1.png')

// ── 3. Bocian gust frame (SHIFT ability) ─────────────────────────────────────
console.log('\n=== Bocian wing-gust frame ===')
console.log('Generating bocian_gust.png…')

const bocianGust = await pixflux(
  'white stork bird, pixel art, side view facing right, chibi cartoon style, ' +
  'white body with black wing tips, long red-orange beak, long red legs, ' +
  'wings fully spread wide, powerful wing flap pose, wind blast effect, ' +
  'action ability sprite, clean black outline, transparent background',
  64, 64,
  { no_background: true }
)
save(bocianGust, 'bocian_gust.png')

// ─── Final balance ────────────────────────────────────────────────────────────
const balRes2 = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal2 = await balRes2.json()
console.log(`\n=== Done! ===`)
console.log(`Remaining balance: $${(bal2.usd ?? 0).toFixed(4)}`)
console.log(`Sprites saved to: ${OUT_DIR}`)
