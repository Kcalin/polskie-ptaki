import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR  = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => {
  writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64'))
  console.log(`  ✓ ${fn}`)
}

// Use the clearest idle frame as style reference
const refBase64 = readFileSync(join(OUT_DIR, 'bocian_idle_0.png')).toString('base64')

async function pixfluxImg2Img(description, imageGuidance = 0.6) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width: 64, height: 64 },
      text_guidance_scale: 8,
      no_background: true,
      // reference_image keeps the style/size consistent
      reference_image: { type: 'base64', base64: refBase64 },
      image_guidance_scale: imageGuidance,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

async function animateHighGuidance(action) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description:
        'white stork bird pixel art, chibi style, white body black wing tips, ' +
        'red beak, red legs, side view facing right, same size and style as reference',
      action,
      reference_image: { base64: refBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: 4,
      text_guidance_scale: 6,
      image_guidance_scale: 3.5,   // very high — stay close to reference style
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

// ── Attempt 1: animate-with-text, very high image guidance ────────────────
console.log('=== animate-with-text (image_guidance 3.5) ===')
const walkHigh = await animateHighGuidance('walk cycle, legs moving forward and back, body bouncing slightly')
walkHigh.forEach((f, i) => save(f, `bocian_walk_c${i}.png`))

// ── Attempt 2: pixflux img2img, each frame ────────────────────────────────
console.log('\n=== pixflux img2img ===')
const poses = [
  'right leg stepping far forward, left leg behind, leaning slightly forward',
  'legs crossing under body, mid step, body upright',
  'left leg stepping far forward, right leg behind, leaning slightly forward',
  'legs crossing under body, weight on right foot, body upright',
]

for (let i = 0; i < poses.length; i++) {
  console.log(`Frame ${i}…`)
  const frame = await pixfluxImg2Img(
    `white stork bird walking, pixel art chibi, side view facing right, ` +
    `white body black wing tips, red beak, red long legs, ` +
    poses[i] + `, transparent background, same art style as reference`
  )
  save(frame, `bocian_walk_d${i}.png`)
}

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
