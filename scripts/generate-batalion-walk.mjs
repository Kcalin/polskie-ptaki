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

// animate-with-text z bardzo wysokim image_guidance żeby ciało i kolor zostały identyczne
async function animate(action, guidanceScale) {
  const res = await fetch(`${BASE_URL}/animate-with-text`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      description:
        'ruff bird pixel art chibi, breeding male, large orange-brown ruff collar, ' +
        'dark brown body, orange-yellow legs, small beak, side view facing right, ' +
        'transparent background, same style as reference',
      action,
      reference_image: { base64: refBase64 },
      image_size: { width: 64, height: 64 },
      n_frames: 4,
      text_guidance_scale: 5,
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

// Próba A — bardzo wysokie guidance (ciało jak oryginał, nogi animowane)
console.log('=== Walk A (guidance 4.0) ===')
const walkA = await animate('walk cycle, legs stepping forward and back alternately, body stable', 4.0)
walkA.forEach((f, i) => save(f, `batalion_walk_a${i}.png`))

// Próba B — nieco mniejsze guidance (więcej wolności dla nóg)
console.log('\n=== Walk B (guidance 2.5) ===')
const walkB = await animate('walking, clear leg movement, one leg forward one leg back, marching', 2.5)
walkB.forEach((f, i) => save(f, `batalion_walk_b${i}.png`))

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
