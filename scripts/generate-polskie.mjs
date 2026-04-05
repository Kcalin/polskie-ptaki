import { writeFileSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

async function pixflux(description, width, height, extra = {}) {
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({ description, image_size: { width, height }, text_guidance_scale: 8, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

// Try matching the PTAKI style — gold chunky pixel font, transparent bg
console.log('Attempt A — gold like PTAKI:')
const a = await pixflux(
  'pixel art game title text "POLSKIE", uppercase block pixel font, ' +
  'bold golden yellow letters same style as classic retro game title, ' +
  'thick dark outline on every letter, transparent background, no background fill, ' +
  'centered single line, no punctuation marks',
  256, 48,
  { no_background: true }
)
save(a, 'ui_line_polskie_a.png')

// Try white version
console.log('Attempt B — white:')
const b = await pixflux(
  'retro pixel art title text showing the word POLSKIE in all caps, ' +
  'white chunky square pixel letters, thick black border around each letter, ' +
  'video game title screen style, transparent background, just the letters',
  256, 48,
  { no_background: true }
)
save(b, 'ui_line_polskie_b.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Done. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
