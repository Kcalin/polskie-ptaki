# Polskie Ptaki — Sprite Specification
**Version 1.0 | April 2026**

> Pixel-art platformer about Polish birds and national parks.
> Target audience: children ages 6–12.
> Play it live: https://polskieptaki.pl

---

## 1. Technical Requirements

| Property | Value |
|---|---|
| Style | Pixel art — clean, no anti-aliasing |
| Rendering | Nearest-neighbour scaling (no blur) |
| Format | PNG-24 with transparency (alpha channel) |
| Canvas size | 960 × 540 px (16:9) |
| Base tile unit | 32 × 32 px |
| Colour depth | Max 32 colours per sprite/sheet (16 preferred) |
| Outlines | Dark pixel outline on all characters and props |
| Shading | Flat + 1–2 highlight pixels (SNES/GBA era style) |

**Palette mood:** Warm naturalistic greens, browns, blues. Polish marshland colours. No neon. No grey metal. Think "illustrated children's book" rendered as pixels.

**Reference style:** Shovel Knight, Stardew Valley, old Game Boy Color games.

---

## 2. Naming Convention

All files use `snake_case`. Animated sprites are numbered from `_0` (first frame).

Example: `batalion_idle_0.png`, `batalion_idle_1.png`, `batalion_idle_2.png`, `batalion_idle_3.png`

---

## 3. Characters

### 3.1 Batalion — Player Character
*Batalion (Calidris pugnax) — a wading bird famous for its spectacular ruff (feathered collar) during breeding season. Males have colourful ruff: orange, black, or white.*

**Canvas size per frame:** 64 × 64 px
**Facing:** right by default (engine mirrors for left movement)
**Hitbox region:** roughly centre 36 × 52 px (the body, not feet)

| Sprite key | Frames | Description |
|---|---|---|
| `batalion_idle_0..3` | 4 | Idle breathing animation. Bird stands still, chest slightly rises and falls. Ruff visible. |
| `batalion_grok_walk_0..3` | 4 | Walk cycle. Brisk wading-bird strut. Legs alternate, body bobs slightly. |
| `batalion_jump` | 1 | Jump pose — legs tucked, wings slightly open, excited expression. |
| `batalion_fall` | 1 | Falling pose — wings spread to slow fall, calm expression. |
| `batalion_skid` | 1 | Skid/brake pose — leaning back, feet forward, one wing out for balance. |

**Visual notes:**
- Medium-sized wading bird, brown speckled back, pale belly
- **Distinctive ruff** around neck — use orange/black feathers (breeding plumage)
- Orange/red bill, orange legs
- Expressive eyes (slightly large for cartoon appeal)
- The ruff should be clearly visible and "fluffy" in all frames

---

### 3.2 Fox — Ground Enemy
*Lis (Vulpes vulpes) — a red fox patrolling the marshland.*

**Canvas size per frame:** 64 × 64 px
**Facing:** right by default

| Sprite key | Frames | Description |
|---|---|---|
| `fox_idle` | 1 | Sniffing the air, ears perked, tail low. Alert pose. |
| `fox_walk_0..3` | 4 | Slow stealthy patrol walk. Head low, tail straight. |

**Visual notes:**
- Classic red fox: orange-red fur, white chest/muzzle, black legs and ear tips
- Bushy white-tipped tail
- Slightly "sneaky" expression — not scary, but mischievous
- Small enough to fit comfortably in 64×64 with space for ground shadow

---

### 3.3 Wolf — Platform Enemy
*Wilk (Canis lupus) — a grey wolf prowling elevated platforms.*

**Canvas size per frame:** 64 × 64 px
**Facing:** right by default

| Sprite key | Frames | Description |
|---|---|---|
| `wolf_idle` | 1 | Standing alert, ears up, tail relaxed downward. |
| `wolf_walk_0..3` | 4 | Slow confident patrol walk. Steady, not threatening. |

**Visual notes:**
- Grey-brown fur with darker back saddle, lighter belly and muzzle
- Yellow eyes (but not menacing — this is a children's game)
- Larger and bulkier than the fox
- Visually distinct from fox at a glance (grey vs orange, size difference)

---

## 4. Tiles

All tiles tile seamlessly (left ↔ right edges match, top ↔ bottom edges match where applicable).

### 4.1 Ground Tile
**Key:** `tile_ground`
**Size:** 32 × 32 px
**Tiling:** horizontal only (row of tiles forms the ground floor)

Marshy ground surface. Dark moist soil on top, darker brown below. Top 6–8 pixels = surface layer (dark damp soil with tiny grass tufts or moss). Bottom portion = underground cross-section (darker dirt, no detail needed).

### 4.2 Platform Tile
**Key:** `tile_platform`
**Size:** 32 × 32 px
**Tiling:** horizontal (multiple tiles form floating platforms)

Elevated wooden platform — weathered planks. Warm brown tones. Visible wood grain. Slightly raised edge on top (lip). Underside is rough wood end-grain. Tileably consistent: left/right edges continue the plank pattern.

---

## 5. Backgrounds

All backgrounds are **400 × 224 px** and are displayed as a horizontally tiling sprite scaled up to fill the 960×540 canvas.

> **Important:** The background must tile seamlessly — left edge matches right edge exactly.

### 5.1 Level 1 Background — Biebrza Marshes in Spring
**Key:** `bg_level1`
**File:** `bg_level1_v2.png` (replace existing)

Biebrza National Park (Biebrzański Park Narodowy) marshland, daytime, spring.

**Layers (back to front):**
1. **Sky** — bright spring sky, light blue, a few white fluffy clouds
2. **Distant treeline** — dark blue-green silhouette of mixed forest, low on horizon
3. **Water surface** — flat dark water of the Biebrza river/marshes reflecting sky
4. **Reed beds** — horizontal strip of brown/green reeds at water's edge
5. **Near bank** — grassy bank, light spring green

**Colour palette feel:** Light, airy, hopeful. Spring greens and sky blues. Morning light.
**No UI elements, no characters.** Pure environment.

---

### 5.2 Title Screen Background
**Key:** `bg_title`
**Size:** 400 × 224 px

Simple marsh panorama for the title screen. Similar mood to Level 1 but golden hour / late afternoon light. Warmer oranges and yellows. Softer, more atmospheric.

---

### 5.3 Main Menu Full Image
**Key:** `menu_full` (file: `menu_full_c.png`)
**Size:** 400 × 224 px

This is the **full title screen image** — it fills the entire 960×540 canvas when scaled.

Must include:
- A decorative **wooden frame/sign** in the centre of the image (~upper 2/3)
  - Inside the frame: space left blank (the game title text "POLSKIE PTAKI" is added in-game via code)
- A large **PLAY button** at bottom centre (~y = 73% down from top, roughly 300×60 px area)
  - Style: wooden button with Polish text "GRAJ" implied by design (the hit area in code is 300×60 at y=72.5% of height)
- Background: Biebrza marsh scene, same style as bg_level1
- Bottom strip: dark semi-transparent area for credits text

---

## 6. Props & Decorations

### 6.1 Education Sign — Wooden
**Key:** `sign_wooden`
**Size:** 32 × 48 px

A small wooden stake sign stuck in the ground. Brown weathered wood, simple plank shape, slightly tilted. No text — this is a prop marker. Top 32px = sign board, bottom 16px = stake going into ground (can be transparent below ground level).

### 6.2 Education Sign — Golden / Hidden
**Key:** `sign_golden`
**Size:** 32 × 48 px

Same shape as the wooden sign but glowing golden. Used for secret/hidden signs. Golden frame, warm light emanating from it. Magical feel.

### 6.3 Reed Decoration
**Key:** `deco_reed`
**Size:** 32 × 48 px

A single reed plant (Phragmites australis — the common marsh reed). Thin stem, characteristic brown oval seed head at top. Used scattered across the level foreground. Should look good at 80%–120% scale (game randomly scales them slightly).

### 6.4 Biebrza Banner
**Key:** `banner_biebrza`
**Size:** 320 × 64 px

A decorative pixel-art banner/sign. Contains the text **"Biebrzański Park Narodowy"** styled as a rustic wooden signboard. Brown wood frame, golden text, decorative reeds on sides.

---

## 7. Feathers (Level Completion Items)

Feathers are magical collectibles — one per level. They float and glow in the game. Size: **32 × 32 px**.

The 32×32 feather should be a single feather (bird quill) viewed at a slight angle. Each has a different colour/mood corresponding to the season. The engine adds a glow effect in-game.

| Key | Season/Level | Colour | Description |
|---|---|---|---|
| `feather_spring` | Spring / Level 1 — Biebrza | Warm gold `#FFD54F` | Bright golden feather, spring freshness. Wispy, light. |
| `feather_summer` | Summer / Level 2 — Bałtyk | Cyan blue `#4DD0E1` | Blue-teal feather, sea wind feel. |
| `feather_autumn` | Autumn / Level 3 — Białowieża | Deep orange `#FF7043` | Amber-orange feather, forest colours. |
| `feather_winter` | Winter / Level 4 — Tatry | Purple-violet `#CE93D8` | Iridescent purple feather, aurora feel. Rarest. |

> `feather_spring` already exists — the remaining 3 are needed for future levels.

---

## 8. Future Levels — Backgrounds Needed

These are planned for future development. Listed here for awareness; not blocking for Level 1 launch.

| Key | Location | Season | Mood |
|---|---|---|---|
| `bg_level2` | Baltic Sea coast (Bałtyk) | Summer | Sandy dunes, sea, blue sky, seagulls in distance |
| `bg_level3` | Białowieża Forest (Puszcza Białowieska) | Autumn | Dense ancient forest, golden leaves, bison silhouette |
| `bg_level4` | Tatra Mountains (Tatry) | Winter | Snow-covered peaks, pine trees, aurora hints at dusk |

**Same spec as bg_level1:** 400 × 224 px, seamlessly tiling horizontally.

---

## 9. UI — Educational Sign Modal

The modal opens when the player reaches an education sign. It shows bird facts, threat info, and a quiz. Currently drawn entirely in code. **All elements below need pixel-art sprite versions.**

**Modal canvas:** 780 × 440 px (displayed at game resolution, no scaling)

### 9.1 Modal Frame / Background
**Key:** `ui_modal_frame`
**Size:** 780 × 440 px

The outer container for all modal content.

- Layered wooden frame: dark outer border → mid brown → golden inner border → dark green interior
- Corner nails (golden, 8×8 px each at all 4 corners)
- Interior is a flat dark panel where text/photos are rendered — leave it empty/dark (the code fills it with text)
- Style matches the in-game signs and buttons — consistent wooden aesthetic

### 9.2 Close Button
**Key:** `ui_btn_close_normal`, `ui_btn_close_hover`
**Size:** 44 × 44 px each

A square button with "✕" symbol. Two states:
- `normal`: dark red-brown fill, wooden border, salmon "✕"
- `hover`: brighter red fill, golden border, white "✕"

### 9.3 Navigation Arrows
**Key:** `ui_nav_left_normal`, `ui_nav_left_disabled`, `ui_nav_right_normal`, `ui_nav_right_disabled`
**Size:** 44 × 56 px each

Arrow buttons that appear to the left and right of the modal frame (outside the frame itself).

- `normal`: wooden brown background, bright golden "◄" or "►"
- `disabled`: dark grey background, dark grey arrow (greyed out, can't go further)

### 9.4 Page Indicator Dots
**Key:** `ui_dot_active`, `ui_dot_inactive`
**Size:** 10 × 10 px each

Small square dots shown at the bottom of the modal to indicate current page (e.g. ● ○ ○ ○).
- `active`: bright golden square
- `inactive`: dark grey square

### 9.5 Quiz Answer Button
**Key:** `ui_quiz_btn_normal`, `ui_quiz_btn_selected`, `ui_quiz_btn_correct`, `ui_quiz_btn_wrong`
**Size:** 740 × 42 px each

Full-width answer buttons inside the quiz page. Four visual states:
- `normal`: dark green fill, no border
- `selected` (highlighted before answering): blue-teal fill, golden border outline
- `correct` (after answer revealed): deep green fill
- `wrong` (selected wrong answer): deep red fill

The letter label (A. B. C. D.) and answer text are drawn in code on top — the button is just the background.

---

## 10. Budget & Priorities

**Total scope at market rate: ~$200–350** (Fiverr mid-tier pixel artist).
Below is a phased breakdown so you can work within a limited budget.

---

### Phase 1 — Core visual identity (~$50)
*Highest impact. Player character + Level 1 environment. Covers 100% of what players see in the current game.*

| Asset group | Items | Estimated cost |
|---|---|---|
| Batalion (player) | 10 frames (idle×4, walk×4, jump, fall, skid) | ~$25 |
| Level 1 background | `bg_level1` (tiling, 400×224) | ~$15 |
| Tiles | `tile_ground` + `tile_platform` (32×32 each) | ~$10 |

---

### Phase 2 — Full Level 1 polish (~$40–60)
*Completes the first level visually. Title screen + enemies + props.*

| Asset group | Items | Estimated cost |
|---|---|---|
| Menu / title screen | `menu_full_c` + `bg_title` (400×224 each) | ~$20 |
| Fox enemy | 5 frames | ~$15 |
| Wolf enemy | 5 frames | ~$15 |
| Props | signs, reed, banner, feather_spring | ~$10 |

---

### Phase 3 — Modal UI (~$30–40)
*Polishes the educational modal — only needed after gameplay graphics are done.*

| Asset group | Items | Estimated cost |
|---|---|---|
| Modal frame | `ui_modal_frame` (780×440) | ~$15 |
| Buttons | close btn, nav arrows, quiz btns, dots | ~$15–25 |

---

### Phase 4 — Future levels (~$80–120)
*3 backgrounds + 3 feathers for levels 2–4.*

| Asset group | Items | Estimated cost |
|---|---|---|
| Backgrounds | bg_level2, bg_level3, bg_level4 | ~$45–75 |
| Feathers | feather_summer, feather_autumn, feather_winter | ~$15–20 |

---

### 💡 Tips to stretch the budget

1. **Polish freelancers** — post in Polish game dev communities (Discord: Polskie Game Dev, itch.io, ArtStation PL) — often 30–50% cheaper than Fiverr international
2. **Students** — game art students at Polish academies often do commissions cheaply for portfolio
3. **One artist for all** — ask for a bulk discount when commissioning everything at once
4. **Provide reference images** — give the artist real photos of each bird species (Wikipedia links are in the game data) to reduce back-and-forth

---

## 11. Summary Checklist

### 🔴 Phase 1 — Do first (core, ~$50)
- [ ] `batalion_idle_0..3` — 4 frames, 64×64
- [ ] `batalion_grok_walk_0..3` — 4 frames, 64×64
- [ ] `batalion_jump` — 1 frame, 64×64
- [ ] `batalion_fall` — 1 frame, 64×64
- [ ] `batalion_skid` — 1 frame, 64×64
- [ ] `tile_ground` — 32×32
- [ ] `tile_platform` — 32×32
- [ ] `bg_level1` — 400×224, tiling

### 🟡 Phase 2 — Full Level 1 (~$40–60)
- [ ] `menu_full_c` — 400×224
- [ ] `bg_title` — 400×224
- [ ] `fox_idle` — 64×64
- [ ] `fox_walk_0..3` — 4 frames, 64×64
- [ ] `wolf_idle` — 64×64
- [ ] `wolf_walk_0..3` — 4 frames, 64×64
- [ ] `sign_wooden` — 32×48
- [ ] `sign_golden` — 32×48
- [ ] `deco_reed` — 32×48
- [ ] `banner_biebrza` — 320×64
- [ ] `feather_spring` — 32×32

### 🟠 Phase 3 — Modal UI (~$30–40)
- [ ] `ui_modal_frame` — 780×440
- [ ] `ui_btn_close_normal` + `ui_btn_close_hover` — 44×44
- [ ] `ui_nav_left_normal` + `ui_nav_left_disabled` — 44×56
- [ ] `ui_nav_right_normal` + `ui_nav_right_disabled` — 44×56
- [ ] `ui_dot_active` + `ui_dot_inactive` — 10×10
- [ ] `ui_quiz_btn_normal/selected/correct/wrong` — 740×42

### 🟢 Phase 4 — Future levels (~$80–120)
- [ ] `feather_summer` — 32×32
- [ ] `feather_autumn` — 32×32
- [ ] `feather_winter` — 32×32
- [ ] `bg_level2` — 400×224 (Baltic Sea, summer)
- [ ] `bg_level3` — 400×224 (Białowieża forest, autumn)
- [ ] `bg_level4` — 400×224 (Tatra mountains, winter)

---

## 12. Delivery Format

- All files as **individual PNGs** (not a spritesheet)
- Transparent background on all characters, props, decorations
- File names exactly matching the keys in the table above
- No embedded colour profiles (sRGB is fine, no CMYK)
- Recommended tool: Aseprite, Pyxel Edit, GraphicsGale, or any pixel editor

---

*Questions or clarifications: the game is open source at https://github.com/Kcalin/polskie-ptaki*
