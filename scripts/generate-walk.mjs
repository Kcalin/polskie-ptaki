import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

const refBase64 = readFileSync(join(OUT_DIR, 'bocian_idle.png')).toString('base64')

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

async function animateWithText(action, nFrames = 4) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description:
        'white stork bird, chibi cartoon style, white body with black wing tips, ' +
        'long red-orange beak, long red legs, side view facing right',
      action,
      reference_image: { base64: refBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: nFrames,
      text_guidance_scale: 8,
      image_guidance_scale: 2.0,
      view: 'side',
      direction: 'east',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return (data.images ?? data.frames ?? []).map(toBase64)
}

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── Attempt A: animate-with-text with higher image_guidance ────────────────
console.log('=== Walk (animate-with-text, high guidance) ===')
const walkA = await animateWithText('walking forward, high step march, side view', 4)
walkA.forEach((f, i) => save(f, `bocian_walk_a${i}.png`))

// ── Attempt B: pixflux individual frames ──────────────────────────────────
console.log('\n=== Walk frame 0 — right leg forward ===')
const w0 = await pixflux(
  'white stork bird walking, pixel art, side view facing right, chibi cartoon, ' +
  'white body black wing tips, red-orange beak, right leg stepped forward, ' +
  'left leg back, body slightly tilted forward, mid-stride pose, transparent background'
)
save(w0, 'bocian_walk_b0.png')

console.log('=== Walk frame 1 — legs passing ===')
const w1 = await pixflux(
  'white stork bird walking, pixel art, side view facing right, chibi cartoon, ' +
  'white body black wing tips, red-orange beak, both legs close together under body, ' +
  'body upright, one leg lifted slightly, transparent background'
)
save(w1, 'bocian_walk_b1.png')

console.log('=== Walk frame 2 — left leg forward ===')
const w2 = await pixflux(
  'white stork bird walking, pixel art, side view facing right, chibi cartoon, ' +
  'white body black wing tips, red-orange beak, left leg stepped forward, ' +
  'right leg back, body slightly tilted forward, mid-stride pose, transparent background'
)
save(w2, 'bocian_walk_b2.png')

console.log('=== Walk frame 3 — legs passing back ===')
const w3 = await pixflux(
  'white stork bird walking, pixel art, side view facing right, chibi cartoon, ' +
  'white body black wing tips, red-orange beak, both legs close together, ' +
  'body upright, weight shifting, smooth walk cycle, transparent background'
)
save(w3, 'bocian_walk_b3.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
