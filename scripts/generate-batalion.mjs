import { writeFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

const BIRD_DESC =
  'ruff bird pixel art chibi style, breeding male, ' +
  'large fluffy orange-brown ruff collar around neck, ' +
  'dark brown body with iridescent feathers, buff-white belly, ' +
  'small round head with short beak, orange-yellow legs, ' +
  'compact body, side view facing right, transparent background'

async function pixflux(description, extra = {}) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width: 64, height: 64 },
      text_guidance_scale: 8,
      no_background: true,
      ...extra,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

async function animateWithText(action, refBase64, guidanceScale = 2.5) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description: BIRD_DESC,
      action,
      reference_image: { base64: refBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: 4,
      text_guidance_scale: 7,
      image_guidance_scale: guidanceScale,
      view: 'side',
      direction: 'east',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return (data.images ?? data.frames ?? []).map(toBase64)
}

// ─── Check balance ────────────────────────────────────────────────────────────
const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ─── Step 1: generate base idle frame (no reference) ─────────────────────────
console.log('=== Batalion idle_0 (base) ===')
const idle0 = await pixflux(BIRD_DESC + ', standing still, ruff puffed out proudly')
save(idle0, 'batalion_idle_0.png')

// ─── Step 2: animate idle cycle from base frame ───────────────────────────────
console.log('\n=== Batalion idle animation (4 frames) ===')
const idleFrames = await animateWithText(
  'standing idle, breathing, ruff feathers slightly moving, subtle sway',
  idle0,
  3.0
)
idleFrames.forEach((f, i) => save(f, `batalion_idle_${i}.png`))

// ─── Step 3: walk animation ────────────────────────────────────────────────────
console.log('\n=== Batalion walk animation (4 frames) ===')
const walkFrames = await animateWithText(
  'walking forward, legs stepping alternately, ruff bouncing slightly, side view',
  idle0,
  2.5
)
walkFrames.forEach((f, i) => save(f, `batalion_walk_${i}.png`))

// ─── Step 4: jump frame ────────────────────────────────────────────────────────
console.log('\n=== Batalion jump frame ===')
const jump = await pixflux(
  BIRD_DESC + ', jumping in air, wings slightly spread, legs tucked',
  { reference_image: { type: 'base64', base64: idle0 }, image_guidance_scale: 2.0 }
)
save(jump, 'batalion_jump.png')

// ─── Final balance ─────────────────────────────────────────────────────────────
const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
