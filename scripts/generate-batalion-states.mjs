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

async function pixflux(description) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description,
      image_size: { width: 64, height: 64 },
      text_guidance_scale: 7,
      no_background: true,
      reference_image: { type: 'base64', base64: refBase64 },
      image_guidance_scale: 0.7,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

const BASE = 'ruff bird pixel art chibi, breeding male, large orange-brown ruff collar, dark brown body, orange-yellow legs, side view facing right, transparent background, same style as reference'

// skid — nagłe hamowanie, ciało odchylone do tyłu, nogi szeroko
console.log('=== skid frame ===')
save(await pixflux(BASE + ', skidding to a stop, body leaning back, legs spread wide braking, surprised expression'), 'batalion_skid.png')

// fall — opada w dół, skrzydła lekko uniesione
console.log('=== fall frame ===')
save(await pixflux(BASE + ', falling downward, wings slightly raised, legs dangling below, looking down'), 'batalion_fall.png')

// run — szybki bieg, ciało pochylone mocno do przodu
console.log('=== run frame ===')
save(await pixflux(BASE + ', running fast, body leaning far forward, one leg raised high, determined expression'), 'batalion_run.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
