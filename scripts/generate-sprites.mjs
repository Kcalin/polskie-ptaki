/**
 * PixelLab sprite generation script
 * Usage: node scripts/generate-sprites.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
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
  console.log(`  ✓ ${filename}`)
}

async function pixflux(description, width, height, extra = {}) {
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
  if (!res.ok) throw new Error(`pixflux: ${JSON.stringify(data)}`)
  const cost = data.usage?.usd ?? 0
  process.stdout.write(`  [cost $${cost.toFixed(4)}] `)
  return toBase64(data.image)
}

async function animateWithText(description, action, referenceBase64, nFrames = 4) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      action,
      reference_image: { base64: referenceBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: nFrames,
      text_guidance_scale: 8,
      image_guidance_scale: 1.4,
      view: 'side',
      direction: 'east',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`animate: ${JSON.stringify(data)}`)
  const cost = data.usage?.usd ?? 0
  console.log(`  [cost $${cost.toFixed(4)}]`)
  return (data.images ?? data.frames ?? []).map(toBase64)
}

// ─── Main ────────────────────────────────────────────────────────────────────

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const balRes = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal = await balRes.json()
console.log(`\nBalance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── 1. Bocian (White Stork) ──────────────────────────────────────────────────
console.log('=== Bocian (White Stork) ===')

console.log('Generating bocian idle…')
const bocianIdle = await pixflux(
  'white stork bird, pixel art, side view facing right, chibi cartoon style, ' +
  'white body with black wing tips, long red-orange beak, long red legs, ' +
  'standing idle pose, cute style for kids, clean black outline, transparent background',
  64, 64,
  { no_background: true }
)
save(bocianIdle, 'bocian_idle.png')

console.log('Generating bocian walk animation (6 frames)…')
const walkFrames = await animateWithText(
  'white stork bird, chibi cartoon style, white body black wing tips, red-orange beak, red legs',
  'walk cycle stepping forward, side view facing right, smooth loop',
  bocianIdle,
  6
)
walkFrames.forEach((f, i) => save(f, `bocian_walk_${i}.png`))

console.log('Generating bocian jump…')
const bocianJump = await pixflux(
  'white stork bird, pixel art, side view facing right, chibi cartoon style, ' +
  'white body black wing tips, red beak, wings spread upward mid-jump, ' +
  'jumping pose, clean black outline, transparent background',
  64, 64,
  { no_background: true }
)
save(bocianJump, 'bocian_jump.png')

// ── 2. Tileset Wiosna ────────────────────────────────────────────────────────
console.log('\n=== Tileset Wiosna (16×16) ===')

// We generate 32×32 and note they tile at 16×16 equivalent density
console.log('Generating ground tile…')
const groundTile = await pixflux(
  'pixel art seamless ground tile, dark brown rich soil bottom, ' +
  'bright green spring grass on top, small pebbles, tileable, platformer game tile',
  32, 32,
  { no_background: false }
)
save(groundTile, 'tile_ground.png')

console.log('Generating platform tile…')
const platformTile = await pixflux(
  'pixel art seamless wooden platform tile, light brown wood planks, ' +
  'visible wood grain texture, horizontal boards, tileable, ' +
  'top-edge visible, platformer game tile',
  32, 32,
  { no_background: false }
)
save(platformTile, 'tile_platform.png')

console.log('Generating decoration: reed/bulrush…')
const reedDeco = await pixflux(
  'pixel art tall cattail reed plant, brown fluffy top, green stem, ' +
  'wetland marsh plant, transparent background, side view, decoration sprite',
  32, 48,
  { no_background: true }
)
save(reedDeco, 'deco_reed.png')

// ── 3. Background ────────────────────────────────────────────────────────────
console.log('\n=== Tło Level 1 — Biebrza ===')

console.log('Generating background layer (sky + horizon)…')
const bgSky = await pixflux(
  'pixel art background panorama, Biebrza wetlands Poland spring, ' +
  'pale blue sky with white fluffy clouds, distant green tree line on horizon, ' +
  'flat 2D platformer background, no foreground elements, wide landscape',
  400, 225,
  { no_background: false }
)
save(bgSky, 'bg_biebrza_sky.png')

console.log('Generating background layer (midground marsh)…')
const bgMarsh = await pixflux(
  'pixel art 2D platformer midground layer, Biebrza wetlands, ' +
  'green reed beds and cattails, small water pools reflecting sky, ' +
  'spring colours, semi-transparent areas at top and bottom for parallax blending',
  400, 225,
  { no_background: false }
)
save(bgMarsh, 'bg_biebrza_marsh.png')

// ── 4. Fox enemy ─────────────────────────────────────────────────────────────
console.log('\n=== Fox (enemy) ===')

console.log('Generating fox idle…')
const foxIdle = await pixflux(
  'red fox animal pixel art, side view facing left, chibi cartoon style, ' +
  'orange-red fur, white belly, bushy tail, alert sneaky pose, ' +
  'clean black outline, transparent background, kids game enemy',
  48, 40,
  { no_background: true }
)
save(foxIdle, 'fox_idle.png')

console.log('Generating fox walk animation (4 frames)…')
const foxWalk = await animateWithText(
  'red fox chibi cartoon pixel art, orange-red fur, white belly, bushy tail',
  'walk cycle patrolling, side view facing left',
  foxIdle,
  4
)
foxWalk.forEach((f, i) => save(f, `fox_walk_${i}.png`))

// ── 5. Education sign ────────────────────────────────────────────────────────
console.log('\n=== Education sign ===')

console.log('Generating wooden sign…')
const sign = await pixflux(
  'pixel art wooden information sign on a post, ' +
  'light brown rustic wood board, dark wood post, ' +
  'small handwritten lines on board, nature park sign, ' +
  'transparent background, side view',
  32, 48,
  { no_background: true }
)
save(sign, 'sign_wooden.png')

console.log('Generating golden hidden sign…')
const signGold = await pixflux(
  'pixel art glowing golden information sign on a post, ' +
  'shimmering gold board with yellow glow effect, dark wood post, ' +
  'magical sparkle, secret hidden sign, transparent background',
  32, 48,
  { no_background: true }
)
save(signGold, 'sign_golden.png')

// ── 6. Feather pickup ────────────────────────────────────────────────────────
console.log('\n=== Feather pickup ===')

console.log('Generating spring feather…')
const feather = await pixflux(
  'pixel art glowing golden feather, magical phoenix feather, ' +
  'warm yellow-gold glow around it, elegant curved feather shape, ' +
  'transparent background, floating pickup item for platformer game',
  24, 32,
  { no_background: true }
)
save(feather, 'feather_spring.png')

console.log('\n=== Done! ===')
console.log(`Sprites saved to ${OUT_DIR}`)

// Print final balance
const balRes2 = await fetch(`${BASE_URL}/balance`, { headers: h() })
const bal2 = await balRes2.json()
console.log(`Remaining balance: $${(bal2.usd ?? 0).toFixed(4)}`)
