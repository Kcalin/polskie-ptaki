import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

async function pixflux(description, width, height, extra = {}) {
  console.log(`  pixflux (${width}x${height})…`)
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({ description, image_size: { width, height }, text_guidance_scale: 8, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

async function animateWithText(description, action, refBase64, nFrames = 4) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description, action,
      reference_image: { base64: refBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: nFrames,
      text_guidance_scale: 8,
      image_guidance_scale: 1.4,
      view: 'side', direction: 'east',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return (data.images ?? data.frames ?? []).map(toBase64)
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── 1. Wolf (platform enemy) ──────────────────────────────────────────────────
console.log('=== Wolf ===')
const wolfIdle = await pixflux(
  'grey wolf animal pixel art, side view facing left, chibi cartoon style, ' +
  'grey fur, pointy ears, bushy tail, low crouching sneaky walk pose, ' +
  'yellow eyes, clean black outline, transparent background, kids game enemy',
  64, 64, { no_background: true }
)
save(wolfIdle, 'wolf_idle.png')

console.log('Wolf walk animation (4 frames)…')
const wolfWalk = await animateWithText(
  'grey wolf, chibi cartoon, grey fur, pointy ears, bushy tail, yellow eyes',
  'sneaky patrol walk cycle, side view facing left, low crouching',
  wolfIdle, 4
)
wolfWalk.forEach((f, i) => save(f, `wolf_walk_${i}.png`))

// ── 2. Wind gust effect sprite ────────────────────────────────────────────────
// Ask PixelLab for wind/air burst sprites that can be stacked in animation
console.log('\n=== Wind gust effect ===')

// Frame 1 — small initial puff
const gustF1 = await pixflux(
  'pixel art wind gust effect, small air puff burst, white and light blue wispy lines, ' +
  'horizontal air whoosh, speed lines, transparent background, subtle and clean',
  48, 32, { no_background: true }
)
save(gustF1, 'gust_f1.png')

// Frame 2 — medium expanding ring
const gustF2 = await pixflux(
  'pixel art wind gust effect, medium expanding air ring, white and cyan curved lines, ' +
  'radial wind burst, speed streaks, transparent background, game effect sprite',
  64, 40, { no_background: true }
)
save(gustF2, 'gust_f2.png')

// Frame 3 — large fading whoosh
const gustF3 = await pixflux(
  'pixel art wind dissipating effect, large fading air wave, pale blue white streaks, ' +
  'air burst dispersing, transparent background, game wind effect',
  80, 48, { no_background: true }
)
save(gustF3, 'gust_f3.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
