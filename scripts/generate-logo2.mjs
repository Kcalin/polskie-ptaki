import { writeFileSync, mkdirSync, existsSync } from 'fs'
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

// Attempt 1: two separate lines, very explicit uppercase
console.log('\n--- attempt: POLSKIE (top line) ---')
const linePolskie = await pixflux(
  'pixel art text label, uppercase block letters spelling "POLSKIE", ' +
  'bold chunky pixel font, bright white letters with thick black outline, ' +
  'single line of text centered, transparent background, no other elements, no punctuation',
  256, 48,
  { no_background: true }
)
save(linePolskie, 'ui_line_polskie.png')

console.log('\n--- attempt: PTAKI (bottom line) ---')
const linePtaki = await pixflux(
  'pixel art text label, uppercase block letters spelling "PTAKI", ' +
  'bold chunky pixel font, golden yellow letters with thick dark brown outline, ' +
  'single line of text centered, transparent background, no other elements, no punctuation',
  256, 48,
  { no_background: true }
)
save(linePtaki, 'ui_line_ptaki.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
