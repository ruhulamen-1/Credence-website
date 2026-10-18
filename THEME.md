# Credence Housing — Design Theme ("Above the Clouds")

Derived from the reference video (cloud intro → tower rises → "Live Above The Ordinary" → property finder). Every new page should follow this so the site feels like one piece.

## Mood
Airy, calm, premium. Open sky, soft white mist, one iconic tower with warm gold balconies. Lots of whitespace; nothing busy.

## Colour tokens (`:root` in `style.css`)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#14202e` | Text, dark buttons |
| `--mute` | `#5b6b7c` | Secondary text, labels |
| `--gold` | `#b98b5a` | Eyebrows, numbers, accents (balcony colour) |
| `--sky` | `#6fb3e8` | Sky accent |
| Sky gradient | `#4a9ee4 → #9fd0f3 → #e9f4fc → #fff` | Hero backgrounds, fades into white "mist" |
| Section tint | `#f3f7fb` | Alternate sections |

Rule: ~60% white/mist, ~30% sky blue, ~10% gold + ink. No other accent colours (project cards may hue-shift the tower only).

## Typography
- Headings: **Cormorant Garamond** 500, tight line-height (1.05). Hero H2 `clamp(44px,7vw,76px)`; section H2 `clamp(34px,5vw,56px)`.
- Body/UI: **Poppins** 300–500, 14–15px, line-height 1.7.
- Eyebrow: 12px, uppercase, letter-spacing .22em, gold.
- Intro title only: wide-tracked uppercase serif (`letter-spacing:.3em`).

## Shapes & surfaces
- Frosted glass panels (`rgba(255,255,255,.72)` + `backdrop-filter:blur(14px)`), radius 18–20px, soft blue shadow `0 20px 60px rgba(30,70,120,.12)`.
- Buttons: pill (`border-radius:99px`), dark `#111b27`, white text, 13px medium. One primary button per view.
- Inputs: white, 1px `--line` border, radius 10px, min-height 44px, visible labels (no placeholder-only).
- Chips: small outlined pills; active = filled ink.

## Signature elements
1. **Cloud intro** – full-screen sky + blurred cloud layers; title "Above the Clouds"; clouds part on click/scroll/key, intro fades.
2. **Tower** – SVG (`tower.js`): blue glass body, gold curved balcony slabs, dark side face. Rises from below with a long ease (2.4s). Fades into mist at the base.
3. **Mist** – white gradient at the bottom of every hero so the next section emerges from the clouds.
4. **Finder bar** – glass panel overlapping the hero bottom: Type / Status / Location / Project + quick chips.
5. **Facts strip** – glass tiles with big serif numbers (used on project pages).

## Motion
- Easing `cubic-bezier(.2,.7,.2,1)`; entrances 0.9–2.4s; sections `.reveal` (fade + 28px rise) via IntersectionObserver; numbers count up.
- Everything honours `prefers-reduced-motion` (animations off, intro skipped).

## Layout
- Side padding `clamp(20px,6vw,90px)`; section padding `clamp(64px,10vw,120px)`.
- Fixed transparent nav (Menu · centred wordmark · CTA) that turns white-glass after 60px scroll; slide-in left menu.
- Breakpoints: 900px (2-col → 1-col), 560px (phone). No horizontal scroll from 375px up.

## Page templates
- **Home** (`index.html`): intro → hero + finder → lead text → projects grid → footprints/stats → why Credence → contact.
- **Project** (`project-<slug>.html`, example `project-arkology.html`): sky hero (name, address badge, tower) → facts strip → story → specification table → map → "I am interested" form. Copy the Arkology file and change content; project name is H2 uppercase.

## Adding a new project
1. Copy `project-arkology.html`, edit title/meta, hero copy, facts, story, spec rows, map `q=` address.
2. In `script.js` add `href:"project-<slug>.html"` to that project in `PROJECTS`.

## Don'ts
No rainbow gradients, no extra accent colours, no stock-photo clutter, no placeholder-only fields, no more than one dark pill button per section.
