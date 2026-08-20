---
name: deep-canopy-design
description: "SUPERSEDED — do not use for new work. Describes the retired \"Deep Canopy\" system (deep forest-green surfaces, light-blue accent, Inter Tight). Replaced by the obsidian-design skill, which is the default for ALL design and UI work. Read this only to understand pages not yet ported off forest green — /r/[slug]/* and /style-guide in this repo. If a request would produce visible pixels, use obsidian-design instead."
---

> **SUPERSEDED.** This system has been replaced by
> **`.claude/skills/obsidian-design/`** — use that for all new work.
>
> Deep Canopy is kept only as a reference for surfaces not yet ported off it
> (`/r/[slug]/*` and `/style-guide`). Forest-green styling found in the tree is
> debt to port, not a valid alternative. Note that `styles/components.css`,
> which this system uses, is imported **unlayered** and therefore carries the
> cascade bug described in `obsidian-design/references/pitfalls.md` §1 — fix
> that when porting.

# Deep Canopy

A dark editorial system: forest-green ground, cold-white type, one light-blue
accent used sparingly enough that it always means something. Confident
whitespace, oversized headlines with hard negative tracking, and sections built
around media rather than around text blocks.

The reference is vev.design. The failure mode is a generic dark SaaS page: too
many hues, type too small, sections too tight, accent everywhere.

---

## The nine rules

1. **`styles/tokens.css` is the only file allowed to contain a colour value.**
   Not in a component, not in a Tailwind class, not in `style={{}}`. A needed
   colour that isn't a token means you need a token or a different design.
2. **One accent, and it carries meaning.** `--accent` (light blue) marks
   exactly three things: the primary action, verification/high-confidence, and
   the active state of navigation. Never decoration. If two blue things are
   visible in one viewport and neither is the primary action, remove one.
3. **Sans everywhere; mono is metadata only.** Inter Tight for display, UI,
   body, and controls. IBM Plex Mono only for timestamps, counts, ids, source
   domains, and `//`-style provenance lines. Never mono for a button.
4. **Weight contrast, not colour contrast, carries the headline.** Display type
   is weight 700–800 against weight 300–400 subcopy. Colour differences within
   a headline are a secondary device, used at most once per page.
5. **Type is bigger than feels comfortable, tracked tighter than feels safe.**
   Display starts at 56px and goes to 112px, at `-0.04em`. Section headings
   start at 40px. Body never below 16px.
6. **Sections breathe at 128–192px vertical.** Anything under 96px between two
   sections reads as a single crowded block. Whitespace is the main luxury
   signal in this system — protect it before you protect content density.
7. **Every section earns a media slot or explicitly declines one.** This is a
   media-forward system. A section that is only text needs a reason. See
   *Media & motion* below — a slot you cannot fill is still authored, as a
   labelled frame carrying its art-direction brief.
8. **Motion is ambient and slow, or structural and fast — never in between.**
   Ambient: 8–30s, infinite, decorative, killed by `prefers-reduced-motion`.
   Structural: 150–300ms, triggered by the user, survives reduced-motion
   because it communicates state. There is no 2-second "fun" animation.
9. **Desktop only. Read at 1440px and 1280px.** No mobile breakpoints.

---

## Colour

Values live in `styles/tokens.css`. Reproduced here so you can reason about
them; never copy them into a component.

### Surfaces — four levels, in order of elevation

| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#071613` | Page ground. The default. |
| `--bg-surface` | `#0C201A` | Recessed wells, inputs, inset panels. |
| `--bg-card` | `#112A22` | Raised cards, drawers, modals, popovers. |
| `--bg-footer` | `#050F0D` | Footer, and any band meant to read as "below". |

Elevation reads through **surface lightness plus an inset top highlight**, never
through a drop shadow alone and never through a border. A card is lighter than
the page; a well is darker.

### Accent — one hue, three jobs

| Token | Value | Use |
|---|---|---|
| `--accent` | `#7FB8E8` | Primary action, active nav, verification. |
| `--accent-bright` | `#A5D2F5` | Hover of the above. |
| `--accent-glow` | `rgba(127,184,232,0.18)` | Ambient light around a focal element. |
| `--accent-subtle` | `rgba(127,184,232,0.10)` | Tinted fills, focus rings, active pills. |

### Text — four levels

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#FFFFFF` | Headlines, card titles, values. |
| `--text-body` | `#A6C0B6` | All running prose. |
| `--text-muted` | `#7B958A` | Secondary and de-emphasised. |
| `--text-tertiary` | `#6B857B` | Metadata, mono lines, timestamps. |

### Borders

`--border-subtle` `rgba(224,255,244,0.07)` · `--border-medium`
`rgba(224,255,244,0.13)` · `--border-accent` `rgba(127,184,232,0.55)`

Borders are a last resort. Prefer a surface change. Use a border when two
same-surface things must be told apart.

### Semantics

There is no second hue. Verification, success, and high confidence all read
through `--accent`. Confidence steps **accent → white → grey**
(`--conf-solid` → `--conf-mixed` → `--conf-thin`). Stance (supports/contests)
is carried by the label, never by colour — this system does not have a red.

---

## Typography

**Inter Tight** (display + text + UI) and **IBM Plex Mono** (metadata only),
both via `next/font/google`. No third face.

### Scale

| Token | Value | Use |
|---|---|---|
| `--text-display` | `clamp(56px, 8vw, 112px)` | Hero headline. One per page. |
| `--text-h1` | `clamp(40px, 5vw, 68px)` | Page title. |
| `--text-h2` | `clamp(32px, 3.4vw, 48px)` | Section headline. |
| `--text-h3` | `clamp(19px, 1.7vw, 23px)` | Card title, sub-head. |
| `--text-body-size` | `17px` | Running prose. |
| `--text-lead` | `20px` | Hero subcopy and section intros only. |
| `--text-sm` | `14px` | Dense UI. |
| `--text-label` | `12px` | Mono metadata, uppercase labels. |

### Tracking and leading

- Display and h1: `--tracking-tight` = `-0.04em`, leading `0.95`.
- h2/h3: `-0.02em`, leading `1.1`.
- Body: `0`, leading `1.65`.
- Mono labels: `+0.08em`, uppercase.

Negative tracking is the signature of this system at large sizes and a bug at
small ones. Never track body copy tight.

### Weights

`300` lead/subcopy · `400` body · `500` UI and buttons · `600` card titles ·
`700` section headlines · `800` display.

The hero pairs 800 display against 300 lead. That gap is the point.

---

## Layout and rhythm

- Marketing container `1200px`; app container `1360px`; prose measure `68ch`.
- Section padding: `192px` for hero-adjacent, `128px` for standard, `96px`
  minimum between two related bands.
- Grids are 12-column in spirit: three-up cards, two-up alternating
  media/text, one-up full-bleed media. Avoid four-up — it shrinks type.
- Radii: `--r-md` 12px (controls) · `--r-lg` 20px (cards) · `--r-xl` 28px
  (large media frames, modals) · `--r-pill`.
- Alternating feature sections flip media side every row. Never three in a row
  on the same side.

---

## Media & motion

This is the part most likely to be skipped. Do not skip it.

### The rule

**Never ship a section with an unaccounted-for empty area.** If a design calls
for an image, a video, a product screenshot, a diagram, or an ambient graphic,
one of three things must be true:

1. It is implemented in **code** (CSS gradient, SVG, canvas-free animation).
2. It is a real asset in `public/`.
3. It is a **`<MediaSlot>`** — a correctly-sized, visibly-labelled frame that
   states, on screen, exactly what belongs there.

There is no fourth option. A blank div is a bug.

### `<MediaSlot>`

`components/ui/media-slot.tsx`. Renders a dashed-bordered frame at the right
aspect ratio, with a mono label, a one-line brief, and a suggested source.

```tsx
<MediaSlot
  ratio="16/9"
  kind="video"
  label="HERO / PRODUCT LOOP"
  brief="Screen recording of the Validate stream: findings landing one by one, VERIFIED badges resolving, citation chips lighting up. Dark UI on the deep-green ground, 12s loop, no audio, no cursor."
  source="Record at 2560x1440, export MP4 + WebM, poster frame at t=0."
/>
```

- `kind`: `image` · `video` · `screenshot` · `diagram` · `animation` · `icon`
- The brief is written for whoever fills the slot — a person or a generator.
  Be specific about subject, palette, crop, motion, and duration. "A nice
  abstract image" is not a brief. Name the colours in words (deep green,
  light blue), never as hex, so the brief survives a token change.
- Slots reserve their exact final height. Filling a slot must cause zero
  layout shift.

### Inline annotations

For ambient effects that belong to a section's background rather than to a
frame, use an `AmbientNote` — a comment in the JSX *and* a dev-only badge:

```tsx
{/* <Add background animation: slow-drifting radial mesh gradient, deep green
    into near-black, one light-blue bloom orbiting the headline at ~30s.> */}
<AmbientNote>Background animation: drifting mesh gradient + one blue bloom, 30s orbit</AmbientNote>
```

`AmbientNote` renders only when `NODE_ENV !== 'production'`, so the intent is
visible while building and invisible when shipped.

### What to implement in code rather than slot out

Do these for real; they need no assets:

- Radial and conic mesh gradients, slowly drifting (`@keyframes` on
  `background-position` or a transformed pseudo-element, 20–40s).
- Grain overlay (already global in `globals.css`).
- Scroll-reveal: 16px rise + fade, `--dur-enter`, staggered 90ms per item.
- Logo/word marquees, `transform: translateX`, 40s linear infinite.
- Bloom/glow behind a focal element, `radial-gradient` + `filter: blur()`.
- Animated dashed connector lines, `stroke-dashoffset`.
- Number count-ups and typewriter text.
- Border-gradient sweeps on hover.
- Sticky scroll-driven section pinning via `animation-timeline: scroll()`.

### Motion budget

- Ambient: 8–40s, infinite, `ease-in-out`, subtle enough that a screenshot
  can't tell it's moving. Always inside `@media (prefers-reduced-motion: no-preference)`
  or disabled in the reduce block.
- Structural: `--dur-fast` 150ms (press), `--dur-base` 220ms (hover, colour),
  `--dur-enter` 600ms (reveal). Easing `--ease-out`.
- Reduced motion kills ambient and reveal transforms; it keeps drawers,
  accordions, and hover colour, which communicate state.

---

## Components

Recipes live in `styles/components.css`. Tailwind is for **layout only** —
flex, grid, spacing, sizing. `tailwind.config.ts` has no `colors` key.

- **Button.** Sans, weight 500, 13px, `--r-md`. Primary: solid `--accent` with
  `--bg-base` text and a soft glow; hover lifts 1px and brightens. Secondary:
  transparent with `--border-medium`. Ghost: text only. Exactly one primary
  visible per viewport.
- **Card.** `--bg-card`, no border, `--r-lg`, inset top highlight plus a deep
  soft shadow. Interactive cards lift 2px on hover.
- **Well.** `--bg-surface` inside a card, `--r-md`, `--border-subtle`.
- **Input.** `--bg-surface`, `--border-medium`, focus swaps to `--accent` with
  a 3px `--accent-subtle` ring. Never remove focus rings.
- **Pill/chip.** Mono 12px, uppercase, `--r-pill`, `--border-medium`; active
  state fills `--accent-subtle` with `--border-accent`.
- **Meta line.** Mono 12px `--text-tertiary`, `+0.08em`, ellipsised.
- **Section label.** Mono 12px uppercase `--accent`, `+0.08em`, above every
  section headline.

Every interactive element ships hover, `:focus-visible`, active, and disabled
states **at build time**, not in a polish pass.

---

## Section patterns

Compose pages from these. Each names its media obligation.

| Pattern | Media obligation |
|---|---|
| **Hero** | Full-bleed ambient background (code) + one product loop slot. |
| **Three-up value cards** | One 4:3 media area per card, code-drawn UI fragments preferred over slots. |
| **Conversation / input band** | No slot; the input *is* the focal object. Give it a bloom. |
| **Alternating feature row** | One 16:10 slot per row, side alternating. |
| **Stat row** | No slot; oversized numerals are the visual. Count-up on reveal. |
| **Logo marquee** | Real SVGs or a slot per logo. Never invent customer names. |
| **FAQ / accordion** | No slot. |
| **Footer** | Optional oversized wordmark as the graphic. |

---

## Checklist before calling a screen done

- [ ] No colour value outside `tokens.css`.
- [ ] Exactly one `.btn-primary` per viewport.
- [ ] Accent appears only as action, active nav, or verification.
- [ ] Display headline ≥ 56px with `-0.04em`.
- [ ] Section gaps ≥ 96px, standard 128px.
- [ ] Every empty area is a `MediaSlot` or an `AmbientNote`, never a blank div.
- [ ] Every slot reserves final height — no layout shift on fill.
- [ ] Hover, focus-visible, active, disabled on every control.
- [ ] Ambient motion disabled under `prefers-reduced-motion`.
- [ ] Read at 1440px **and** 1280px.
- [ ] No mono on a button; no sans on a timestamp.
