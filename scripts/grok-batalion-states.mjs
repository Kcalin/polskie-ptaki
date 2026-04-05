import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'

const API_KEY  = process.env.XAI_API_KEY
const BASE_URL = 'https://api.x.ai/v1'
const OUT_DIR  = './public/assets/sprites'

if (!API_KEY) { console.error('Set XAI_API_KEY'); process.exit(1) }

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })

const SUBJECT = 'chibi pixel art ruff bird, breeding male, large orange-brown ruff collar, dark brown body, orange-yellow legs, small beak, side view facing right, solid dark green background, pixel art style'

async function grokImage(prompt) {
  console.log(`  → ${prompt.slice(0, 70)}...`)
  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      model: 'grok-imagine-image',
      prompt: `${SUBJECT}, ${prompt}`,
      n: 1,
      response_format: 'b64_json',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return Buffer.from(data.data[0].b64_json, 'base64')
}

function cleanup(paths) {
  const list = paths.map(p => `'${p}'`).join(', ')
  spawnSync('python3', ['-c', `
from rembg import remove
from PIL import Image
for f in [${list}]:
    img = Image.open(f).convert('RGBA')
    out = remove(img).resize((64, 64), Image.NEAREST)
    out.save(f)
    print(f'  cleaned {f}')
`], { encoding: 'utf8', stdio: 'inherit' })
}

console.log('=== JUMP ===')
const jumpBuf = await grokImage('jumping upward, wings spread wide, legs tucked, looking up, airborne')
const jumpOut = join(OUT_DIR, 'batalion_jump.png')
writeFileSync(jumpOut, jumpBuf)
cleanup([jumpOut])

console.log('\n=== FALL ===')
const fallBuf = await grokImage('falling downward, wings raised high, legs dangling below, looking down')
const fallOut = join(OUT_DIR, 'batalion_fall.png')
writeFileSync(fallOut, fallBuf)
cleanup([fallOut])

console.log('\n=== SKID ===')
const skidBuf = await grokImage('skidding to a stop, body leaning far backward, feet sliding forward, surprised expression')
const skidOut = join(OUT_DIR, 'batalion_skid.png')
writeFileSync(skidOut, skidBuf)
cleanup([skidOut])

console.log('\n=== RUN ===')
const runBuf = await grokImage('running fast, body leaning far forward, one leg raised high, determined expression')
const runOut = join(OUT_DIR, 'batalion_run.png')
writeFileSync(runOut, runBuf)
cleanup([runOut])

console.log('\n✅ Done!')
