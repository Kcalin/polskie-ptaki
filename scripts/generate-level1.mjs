import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

async function pixflux(description, width, height, extra = {}) {
  console.log(`  pixflux ${width}x${height}: ${description.slice(0,60)}...`)
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({ description, image_size: { width, height }, text_guidance_scale: 8, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

async function animateWithText(description, action, referenceBase64, nFrames = 4) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description, action,
      reference_image: { base64: referenceBase64 },
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

// 1. Crow/Jay enemy (platform enemy)
console.log('=== Crow enemy ===')
const crowIdle = await pixflux(
  'Eurasian jay bird pixel art, side view facing left, chibi cartoon style, ' +
  'colorful plumage blue wing patches, brown-pink body, black and white markings, ' +
  'alert sneaky pose, transparent background, enemy sprite for kids platformer game',
  64, 64, { no_background: true }
)
save(crowIdle, 'crow_idle.png')

console.log('Crow walk animation...')
const crowWalk = await animateWithText(
  'Eurasian jay bird, chibi cartoon, colorful with blue wing patches, brown body',
  'hopping walk cycle, side view facing left',
  crowIdle, 4
)
crowWalk.forEach((f, i) => save(f, `crow_walk_${i}.png`))

// 2. Better Level 1 background - Biebrza spring
console.log('\n=== Level 1 background (Biebrza spring) ===')
const bgLevel1 = await pixflux(
  'pixel art 2D platformer scrolling background, Biebrza National Park Poland, ' +
  'bright spring morning, pale blue sky, white fluffy clouds, ' +
  'distant green wetland meadows with patches of yellow flowers, ' +
  'calm river with light blue water reflections, ' +
  'green reed beds in midground, birch trees silhouettes, warm cheerful palette',
  400, 225
)
save(bgLevel1, 'bg_level1_v2.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
