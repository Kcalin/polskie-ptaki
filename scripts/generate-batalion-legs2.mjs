import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

const refBase64 = readFileSync(join(OUT_DIR, 'batalion_idle_0.png')).toString('base64')

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// pixflux img2img — nogi dopasowane do ciała bataliona, skierowane w PRAWO
async function pixflux(description) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width: 32, height: 32 },
      text_guidance_scale: 7,
      no_background: true,
      reference_image: { type: 'base64', base64: refBase64 },
      image_guidance_scale: 0.5,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

const BASE =
  'ruff bird pixel art, chibi, dark brown body, orange ruff collar, ' +
  'orange-yellow legs, facing RIGHT, side view, transparent background, ' +
  'same art style as reference, no background'

console.log('Leg frame 0 — standing')
save(await pixflux(BASE + ', standing still, both feet on ground, weight centered'), 'batalion_legs_0.png')

console.log('Leg frame 1 — right leg forward')
save(await pixflux(BASE + ', walking, right leg stepped far forward, left leg back, mid stride'), 'batalion_legs_1.png')

console.log('Leg frame 2 — legs crossing')
save(await pixflux(BASE + ', walking, legs crossing under body, one leg raised, mid step'), 'batalion_legs_2.png')

console.log('Leg frame 3 — left leg forward')
save(await pixflux(BASE + ', walking, left leg stepped far forward, right leg back, mid stride'), 'batalion_legs_3.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
