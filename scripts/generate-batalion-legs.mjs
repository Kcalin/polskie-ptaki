import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

async function pixflux(description) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width: 32, height: 32 },
      text_guidance_scale: 9,
      no_background: true,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

// 4 klatki chodu — same nogi, 32x24px, pixel art
// Klatka 0: prawa noga mocno z przodu, lewa z tyłu
console.log('Leg frame 0 — right forward')
const l0 = await pixflux(
  'two bird legs walking pixel art, side view, right leg stepping far forward ' +
  'left leg far back, orange yellow legs, chibi pixel art, transparent background, ' +
  'no body no head, just legs from hip to feet'
)
save(l0, 'batalion_legs_0.png')

// Klatka 1: nogi mijają się pod ciałem
console.log('Leg frame 1 — crossing')
const l1 = await pixflux(
  'two bird legs walking pixel art, side view, both legs close together under body ' +
  'mid-stride crossing, right leg slightly raised, orange yellow legs, chibi pixel art, ' +
  'transparent background, no body no head, just legs from hip to feet'
)
save(l1, 'batalion_legs_1.png')

// Klatka 2: lewa noga mocno z przodu, prawa z tyłu
console.log('Leg frame 2 — left forward')
const l2 = await pixflux(
  'two bird legs walking pixel art, side view, left leg stepping far forward ' +
  'right leg far back, orange yellow legs, chibi pixel art, transparent background, ' +
  'no body no head, just legs from hip to feet'
)
save(l2, 'batalion_legs_2.png')

// Klatka 3: nogi mijają się znowu (lewa uniesiona)
console.log('Leg frame 3 — crossing 2')
const l3 = await pixflux(
  'two bird legs walking pixel art, side view, both legs close together under body ' +
  'mid-stride, left leg slightly raised, orange yellow legs, chibi pixel art, ' +
  'transparent background, no body no head, just legs from hip to feet'
)
save(l3, 'batalion_legs_3.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
