/**
 * Grok Walk Animation Pipeline
 *
 * Inspired by Godogen (https://github.com/htdt/godogen)
 * Pipeline: reference image → Grok video generation → ffmpeg frames → loop detection → sprites
 *
 * Usage:
 *   XAI_API_KEY=your_key node scripts/grok-walk-pipeline.mjs batalion
 *   XAI_API_KEY=your_key node scripts/grok-walk-pipeline.mjs bocian
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { execSync, spawnSync } from 'child_process'

const BIRD     = process.argv[2] ?? 'batalion'
const API_KEY  = process.env.XAI_API_KEY
const BASE_URL = 'https://api.x.ai/v1'
const OUT_DIR  = './public/assets/sprites'
const TMP_DIR  = `./tmp/grok_${BIRD}`

if (!API_KEY) {
  console.error('ERROR: Set XAI_API_KEY environment variable')
  console.error('  export XAI_API_KEY=xai-...')
  process.exit(1)
}

mkdirSync(TMP_DIR, { recursive: true })

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const save = (data, fn) => { writeFileSync(fn, data); console.log(`  ✓ ${fn}`) }

// ─── 1. Load reference image ────────────────────────────────────────────────

const refPath = join(OUT_DIR, `${BIRD}_idle_0.png`)
if (!existsSync(refPath)) {
  console.error(`Reference image not found: ${refPath}`)
  process.exit(1)
}

const refBase64 = readFileSync(refPath).toString('base64')
const refDataUrl = `data:image/png;base64,${refBase64}`
console.log(`Reference: ${refPath}`)

// ─── 2. Submit Grok video generation ────────────────────────────────────────

const BIRD_PROMPTS = {
  batalion: {
    subject: 'a chibi pixel art ruff bird with orange-brown ruff collar, dark brown body, orange legs',
    action:  'walking forward in a smooth loop, legs stepping alternately left and right, body slightly bobbing',
  },
  bocian: {
    subject: 'a chibi pixel art white stork with red beak and red legs, white body black wing tips',
    action:  'walking forward in a smooth loop, long legs stepping high, body swaying slightly',
  },
}

const prompt_data = BIRD_PROMPTS[BIRD] ?? BIRD_PROMPTS.batalion
const prompt = `${prompt_data.subject}, ${prompt_data.action}, side view facing right, solid dark green background, pixel art style, game sprite`

console.log(`\nSubmitting Grok video generation...`)
console.log(`Prompt: ${prompt}`)

const submitRes = await fetch(`${BASE_URL}/videos/generations`, {
  method: 'POST',
  headers: h(),
  body: JSON.stringify({
    model:        'grok-2-image-1212',   // try image model first for reference
    prompt,
    image:        refDataUrl,
    duration:     5,
    resolution:   '480p',
    aspect_ratio: '1:1',
  }),
})

if (!submitRes.ok) {
  // Try without image param (text-to-video)
  console.warn(`Image-to-video failed, trying text-to-video...`)
  const submitRes2 = await fetch(`${BASE_URL}/videos/generations`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify({
      prompt,
      duration:     5,
      resolution:   '480p',
      aspect_ratio: '1:1',
    }),
  })
  if (!submitRes2.ok) {
    const err = await submitRes2.json()
    console.error('Grok API error:', JSON.stringify(err, null, 2))
    process.exit(1)
  }
  var submitData = await submitRes2.json()
} else {
  var submitData = await submitRes.json()
}

const requestId = submitData.id ?? submitData.request_id
if (!requestId) {
  console.error('No request ID in response:', JSON.stringify(submitData, null, 2))
  process.exit(1)
}

console.log(`Request ID: ${requestId}`)

// ─── 3. Poll for completion ─────────────────────────────────────────────────

console.log('Polling for completion (this takes 1-8 minutes)...')
let videoUrl = null
let attempts = 0

while (!videoUrl) {
  await new Promise(r => setTimeout(r, 8000))
  attempts++

  const pollRes = await fetch(`${BASE_URL}/videos/${requestId}`, { headers: h() })
  const pollData = await pollRes.json()
  const status = pollData.status ?? pollData.state

  console.log(`  [${attempts * 8}s] status: ${status}`)

  if (status === 'done' || status === 'completed' || status === 'succeeded') {
    videoUrl = pollData.video?.url ?? pollData.output?.[0] ?? pollData.url
    break
  }
  if (status === 'failed' || status === 'expired' || status === 'error') {
    console.error('Generation failed:', JSON.stringify(pollData, null, 2))
    process.exit(1)
  }
  if (attempts > 80) {   // 10 minute timeout
    console.error('Timeout waiting for video')
    process.exit(1)
  }
}

console.log(`Video URL: ${videoUrl}`)

// ─── 4. Download video ──────────────────────────────────────────────────────

const videoPath = join(TMP_DIR, 'animation.mp4')
const videoRes  = await fetch(videoUrl)
const videoData = Buffer.from(await videoRes.arrayBuffer())
writeFileSync(videoPath, videoData)
console.log(`\nDownloaded: ${videoPath} (${(videoData.length / 1024).toFixed(0)} KB)`)

// ─── 5. Extract frames with ffmpeg ─────────────────────────────────────────

const framesDir = join(TMP_DIR, 'frames')
mkdirSync(framesDir, { recursive: true })

console.log('\nExtracting frames...')
const ffResult = spawnSync('ffmpeg', [
  '-i', videoPath,
  '-vsync', '0',
  '-q:v', '1',
  join(framesDir, '%04d.png')
], { encoding: 'utf8' })

if (ffResult.error) {
  console.error('ffmpeg not found. Install with: brew install ffmpeg')
  process.exit(1)
}

const frames = readdirSync(framesDir).filter(f => f.endsWith('.png')).sort()
console.log(`Extracted ${frames.length} frames`)

// ─── 6. Simple loop point detection ─────────────────────────────────────────
// Godogen uses 7-frame window similarity — we use a simpler 4-frame pick
// Evenly-spaced 4 frames across the first detected cycle

function pickWalkFrames(frameFiles, n = 4) {
  // Take n evenly-spaced frames from second quarter through end
  // (skip first 20% as motion is settling in)
  const start = Math.floor(frameFiles.length * 0.15)
  const end   = frameFiles.length - 1
  const step  = (end - start) / (n - 1)
  return Array.from({ length: n }, (_, i) => frameFiles[Math.round(start + i * step)])
}

const picked = pickWalkFrames(frames)
console.log(`\nPicked frames: ${picked.join(', ')}`)

// ─── 7. Save as walk sprites ─────────────────────────────────────────────────

console.log('\nSaving walk sprites...')
picked.forEach((f, i) => {
  const src = join(framesDir, f)
  const dst = join(OUT_DIR, `${BIRD}_grok_walk_${i}.png`)
  writeFileSync(dst, readFileSync(src))
  console.log(`  ✓ ${basename(dst)}`)
})

console.log(`\nDone! 4 walk frames saved as ${BIRD}_grok_walk_0-3.png`)
console.log(`\nNext step — update BootScene.js to use these frames:`)
console.log(`  frames: Array.from({ length: 4 }, (_, i) => ({ key: \`${BIRD}_grok_walk_\${i}\` }))`)
// ─── 8. Remove background + resize to 64×64 ──────────────────────────────────

console.log('\nRemoving background and resizing to 64×64...')
const pyScript = `
from rembg import remove
from PIL import Image

for i in range(4):
    f = '${OUT_DIR}/${BIRD}_grok_walk_{}.png'.format(i)
    img = Image.open(f).convert('RGBA')
    out = remove(img)
    out = out.resize((64, 64), Image.NEAREST)
    out.save(f)
    print(f'  cleaned {f}')
`

const pyResult = spawnSync('python3', ['-c', pyScript], { encoding: 'utf8' })
if (pyResult.error || pyResult.status !== 0) {
  console.warn('rembg not available — frames have green background, resize manually:')
  console.warn('  pip install "rembg[cpu]" --break-system-packages')
} else {
  console.log(pyResult.stdout)
}

console.log('All done!')
