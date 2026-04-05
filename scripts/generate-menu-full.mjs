/**
 * Generuje całe menu jako jeden obraz PixelLab
 * Usage: node scripts/generate-menu-full.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const API_KEY = 'PIXELLAB_KEY_REMOVED'
const BASE_URL = 'https://api.pixellab.ai/v1'
const OUT_DIR = './public/assets/sprites'

const h = () => ({ 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' })
const toBase64 = d => typeof d === 'string' ? d.replace(/^data:image\/\w+;base64,/, '') : d.base64
const save = (b64, fn) => { writeFileSync(join(OUT_DIR, fn), Buffer.from(b64, 'base64')); console.log(`  ✓ ${fn}`) }

async function pixflux(description, width, height, extra = {}) {
  console.log(`  pixflux (${width}×${height})…`)
  const res = await fetch(`${BASE_URL}/generate-image-pixflux`, {
    method: 'POST', headers: h(),
    body: JSON.stringify({ description, image_size: { width, height }, text_guidance_scale: 8, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  console.log(`  [cost $${(data.usage?.usd ?? 0).toFixed(4)}]`)
  return toBase64(data.image)
}

const bal = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`Balance: $${(bal.usd ?? 0).toFixed(4)}\n`)

// ── Wariant A: ciepły dzienny krajobraz z tytułem ──────────────────────────
console.log('=== Menu full (A) — warm daytime ===')
const menuA = await pixflux(
  'pixel art game title screen, warm sunny daytime, Polish countryside landscape, ' +
  'rolling green meadows, wildflowers, birch trees, blue sky with white clouds, ' +
  'stork flying in the background, a decorative wooden sign board in the center ' +
  'with the words "POLSKIE PTAKI" written in bold pixel letters, ' +
  'below the sign a golden "GRAJ" button, vibrant warm spring colors, ' +
  'Polish national park atmosphere, beautiful pixel art illustration',
  400, 225
)
save(menuA, 'menu_full_a.png')

// ── Wariant B: bez tekstu — sam krajobraz, tekst dołożymy Phaserem ─────────
console.log('\n=== Menu full (B) — landscape only, no text ===')
const menuB = await pixflux(
  'pixel art game title screen background, warm sunny spring day, ' +
  'Polish Biebrza National Park landscape, green wetland meadows with wildflowers, ' +
  'white storks flying in the blue sky, birch trees on the left and right, ' +
  'calm river with reflections in the middle distance, ' +
  'fluffy white clouds, vibrant warm colours, wide horizontal panorama, ' +
  'space at the top center for a title, no text, no UI elements',
  400, 225
)
save(menuB, 'menu_full_b.png')

// ── Wariant C: z dekoracyjną ramką na tytuł ────────────────────────────────
console.log('\n=== Menu full (C) — with title frame ===')
const menuC = await pixflux(
  'pixel art game start screen, Poland spring nature, bright colorful day, ' +
  'tall green grass and red poppies, storks in sky, sunlit birch forest edge, ' +
  'center top: large ornate wooden sign frame with gold border, empty inside for title text, ' +
  'center bottom: golden rectangular button "GRAJ!", ' +
  'warm yellow-green palette, cheerful kids game aesthetic, 16-bit style',
  400, 225
)
save(menuC, 'menu_full_c.png')

const bal2 = await (await fetch(`${BASE_URL}/balance`, { headers: h() })).json()
console.log(`\nDone. Remaining: $${(bal2.usd ?? 0).toFixed(4)}`)
