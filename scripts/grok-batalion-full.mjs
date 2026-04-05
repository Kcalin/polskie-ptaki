/**
 * Generates ALL batalion sprites via Grok for visual consistency.
 * Uses walk frame as style reference for single-image states.
 * Uses video generation for idle animation.
 */

import { writeFileSync, readFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { spawnSync } from 'child_process'

const API_KEY  = process.env.XAI_API_KEY
const BASE_URL = 'https://api.x.ai/v1'
const OUT_DIR  = './public/assets/sprites'
const TMP_DIR  = './tmp/grok_batalion_full'

if (!API_KEY) { console.error('Set XAI_API_KEY'); process.exit(1) }
mkdirSync(TMP_DIR, { recursive: true })

const h     = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const save  = (buf, path) => { writeFileSync(path, buf); console.log(`  ✓ ${path}`) }

// Use best walk frame as style reference
const refPath   = join(OUT_DIR, 'batalion_grok_walk_1.png')
const refBase64 = readFileSync(refPath).toString('base64')

const SUBJECT = 'chibi pixel art ruff bird, breeding male, large orange-brown ruff collar, dark brown body, orange-yellow legs, small beak, side view facing right, solid dark green background, pixel art style'

// ─── Image generation (single frames) ───────────────────────────────────────

async function grokImage(prompt) {
  console.log(`  generating: ${prompt.slice(0, 60)}...`)
  const res = await fetch(`${BASE_URL}/images/generations`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      model:           'grok-imagine-image',
      prompt:          `${SUBJECT}, ${prompt}`,
      n:               1,
      response_format: 'b64_json',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return Buffer.from(data.data[0].b64_json, 'base64')
}

// ─── Video generation + frame extraction ────────────────────────────────────

async function grokVideo(action, tmpName) {
  console.log(`  video: ${action}`)
  const submitRes = await fetch(`${BASE_URL}/videos/generations`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({
      prompt:       `${SUBJECT}, ${action}`,
      duration:     5,
      resolution:   '480p',
      aspect_ratio: '1:1',
    }),
  })
  const submitData = await submitRes.json()
  if (!submitRes.ok) throw new Error(JSON.stringify(submitData))
  const requestId = submitData.id ?? submitData.request_id
  console.log(`  request: ${requestId}`)

  // poll
  let videoUrl = null
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 8000))
    const poll = await (await fetch(`${BASE_URL}/videos/${requestId}`, { headers: h() })).json()
    const status = poll.status ?? poll.state
    console.log(`  [${(i+1)*8}s] ${status}`)
    if (status === 'done' || status === 'completed' || status === 'succeeded') {
      videoUrl = poll.video?.url ?? poll.output?.[0] ?? poll.url; break
    }
    if (['failed','expired','error'].includes(status)) throw new Error(status)
  }

  const videoPath = join(TMP_DIR, `${tmpName}.mp4`)
  const videoData = Buffer.from(await (await fetch(videoUrl)).arrayBuffer())
  writeFileSync(videoPath, videoData)

  const framesDir = join(TMP_DIR, `${tmpName}_frames`)
  mkdirSync(framesDir, { recursive: true })
  spawnSync('ffmpeg', ['-i', videoPath, '-vsync', '0', join(framesDir, '%04d.png')], { encoding: 'utf8' })

  const frames = readdirSync(framesDir).filter(f => f.endsWith('.png')).sort()
  console.log(`  extracted ${frames.length} frames`)
  return frames.map(f => join(framesDir, f))
}

function pickFrames(framePaths, n = 4) {
  const start = Math.floor(framePaths.length * 0.15)
  const end   = framePaths.length - 1
  const step  = (end - start) / (n - 1)
  return Array.from({ length: n }, (_, i) => framePaths[Math.round(start + i * step)])
}

// ─── rembg + resize ──────────────────────────────────────────────────────────

function cleanupFrames(paths) {
  const fileList = paths.map(p => `'${p}'`).join(', ')
  const py = `
from rembg import remove
from PIL import Image
for f in [${fileList}]:
    img = Image.open(f).convert('RGBA')
    out = remove(img).resize((64, 64), Image.NEAREST)
    out.save(f)
    print(f'  cleaned {f}')
`
  const r = spawnSync('python3', ['-c', py], { encoding: 'utf8' })
  if (r.stdout) console.log(r.stdout.trim())
  if (r.stderr && !r.stderr.includes('Downloading')) console.warn(r.stderr.slice(0, 200))
}

// ════════════════════════════════════════════════════════════════════════════
// GENERATE ALL STATES
// ════════════════════════════════════════════════════════════════════════════

// ── 1. Idle animation (video → 4 frames) ────────────────────────────────────
console.log('\n=== IDLE (video) ===')
const idleFramePaths = await grokVideo(
  'standing still, breathing gently, ruff feathers slightly puffing, subtle idle sway, looping animation',
  'idle'
)
const idlePicked = pickFrames(idleFramePaths)
const idleOut = Array.from({ length: 4 }, (_, i) => join(OUT_DIR, `batalion_idle_${i}.png`))
idlePicked.forEach((src, i) => writeFileSync(idleOut[i], readFileSync(src)))
cleanupFrames(idleOut)

// ── 2. Jump ──────────────────────────────────────────────────────────────────
console.log('\n=== JUMP ===')
const jumpBuf = await grokImage('jumping upward, wings spread wide, legs tucked, looking up, airborne')
const jumpOut = join(OUT_DIR, 'batalion_jump.png')
writeFileSync(jumpOut, jumpBuf)
cleanupFrames([jumpOut])

// ── 3. Fall ──────────────────────────────────────────────────────────────────
console.log('\n=== FALL ===')
const fallBuf = await grokImage('falling downward, wings raised up, legs dangling below, looking slightly down')
const fallOut = join(OUT_DIR, 'batalion_fall.png')
writeFileSync(fallOut, fallBuf)
cleanupFrames([fallOut])

// ── 4. Skid ──────────────────────────────────────────────────────────────────
console.log('\n=== SKID ===')
const skidBuf = await grokImage('skidding to a stop, body leaning backward, feet sliding forward, surprised expression, dust effect')
const skidOut = join(OUT_DIR, 'batalion_skid.png')
writeFileSync(skidOut, skidBuf)
cleanupFrames([skidOut])

// ── 5. Run (single walk pose, strong lean) ───────────────────────────────────
console.log('\n=== RUN ===')
const runBuf = await grokImage('running fast, body leaning far forward, one leg raised high, determined look')
const runOut = join(OUT_DIR, 'batalion_run.png')
writeFileSync(runOut, runBuf)
cleanupFrames([runOut])

console.log('\n✅ All batalion sprites regenerated from Grok!')
console.log('Reload the game to see the results.')
