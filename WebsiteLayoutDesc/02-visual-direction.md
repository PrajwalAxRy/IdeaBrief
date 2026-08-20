# 02 — Visual Direction

> Primary source: `.claude/skills/dark-luxury-design/SKILL.md`, amber/gold variant.
> Secondary source: `.claude/skills/clean-design/SKILL.md`, used only where noted in §2.14.
> Where the two conflict, **dark-luxury wins.**

---

## 2.1 The aesthetic in one sentence

A near-black, grain-textured editorial surface where warm amber light marks
only the things that matter — the next action, the verified source, the
section you're in — and everything else recedes into a calm, typographic dark.

Reference feel: a well-set print report read by lamplight. Not a terminal, not
a trading desk, not a generic SaaS dashboard.

**What that rules out immediately:**
neon, cyberpunk, purple-blue gradients, glassmorphism, glowing rings on every
card, holographic accents, 24px radii on everything, colourful icon tiles,
emoji.

---

## 2.2 Colour system — tokens

Copied from the skill's amber/gold variant, with the four text tokens
brightened on 2026-08-20 to clear WCAG AA (4.5:1) against all three dark
surfaces — see the resolved contrast gap in
[13](13-responsive-and-accessibility.md#accessibility--the-floor-we-keep-anyway).
**These values are canonical. Do not re-derive, tweak, or "improve" them
without re-running the contrast check.**

```css
:root {
  /* Surfaces — four levels, used strictly per §2.3 */
  --bg-base:       #0a0907;   /* page background */
  --bg-surface:    #100f0d;   /* recessed wells, inputs, media panels */
  --bg-card:       #161412;   /* cards, buttons, raised panels */
  --bg-footer:     #141210;   /* footer panel only */

  /* Borders */
  --border-subtle: rgba(255,248,230,0.07);
  --border-medium: rgba(255,248,230,0.13);
  --border-accent: rgba(212,160,60,0.55);

  /* Text — four levels, used strictly per §2.5. All four clear 4.5:1
     against --bg-base, --bg-surface, and --bg-card. */
  --text-primary:  #f0ebe0;   /* headlines, key values — 15–17:1 */
  --text-body:     #a89c88;   /* body copy — 6.8–7.4:1 */
  --text-muted:    #8a8272;   /* de-emphasised headline words, inactive — 4.8–5.2:1 */
  --text-tertiary: #867e6c;   /* meta lines, timestamps — 4.6–4.9:1 */

  /* Accent */
  --accent:        #d4a03c;
  --accent-bright: #e8b84e;
  --accent-glow:   rgba(212,160,60,0.18);
  --accent-subtle: rgba(212,160,60,0.08);

  /* Semantic */
  --success:       #3d9e5c;   /* verified badge, system status only */

  /* Fonts */
  --font-sans:     'Inter', system-ui, sans-serif;
  --font-mono:     'JetBrains Mono', monospace;

  /* Texture */
  --grain-opacity: 0.04;

  /* Radius */
  --r-md: 10px; --r-lg: 16px; --r-xl: 20px; --r-pill: 999px;

  /* Motion */
  --ease-out: cubic-bezier(0.16,1,0.3,1);
  --dur-fast: 150ms; --dur-base: 220ms; --dur-enter: 600ms;

  /* Spacing: --sp-N = N*4px  →  --sp-4:16px  --sp-6:24px  --sp-8:32px  --sp-12:48px */
}
```

### Product-specific semantic tokens

The base palette has no vocabulary for this product's three ideas. Add exactly
these three, derived from tokens above — **no new hues.**

```css
:root {
  /* Confidence — expressed by TEXT WEIGHT AND OPACITY, not by hue.
     Deliberately not green/amber/red: colour-coded confidence reads as a
     verdict, and this product does not give verdicts. (§2.4) */
  --conf-solid:    var(--text-primary);   /* full-strength text + filled bars */
  --conf-mixed:    var(--text-body);      /* mid text + half-filled bars */
  --conf-thin:     var(--text-muted);     /* muted text + outline bars */

  /* Stance — how a finding relates to the idea. Also not colour-coded. */
  --stance-supports:  var(--text-body);
  --stance-contests:  var(--text-body);
  /* differentiated by a small SVG glyph + label, never by red/green */
}
```

### Colour discipline rules

1. **Amber is a spotlight, not a paint.** On any given viewport, amber should
   appear on: section labels, exactly one primary button, citation chips,
   active stage rail segment, and focus rings. That's it. If a screen looks
   gold, it's wrong.
2. **Green (`--success`) has exactly two jobs**: the `VERIFIED` badge dot and
   the footer system-status badge. It is never used for "good result."
3. **There is no red.** Not for errors, not for risks, not for "contests"
   findings. Errors use `--text-primary` copy on `--bg-card` with an amber
   border — see [12](12-states.md#error-states). A red UI would imply the
   product judges ideas.
4. **Never fill a button with amber.** Skill rule ③: dark background, amber
   border, glow. Filled amber buttons are the top anti-pattern.

---

## 2.3 Surface hierarchy

Four levels, and **no nesting past two.** Skill anti-pattern: excessive card
nesting.

```text
┌─ --bg-base  #0a0907 ──────────────────────────────────────────┐
│  page canvas. grain overlay lives here. orb lives here.       │
│                                                                │
│  ┌─ --bg-card  #161412 ─────────────────────────────────┐     │
│  │  L1: cards, buttons, drawers, modals                  │     │
│  │  no border · inset top highlight · outer shadow       │     │
│  │                                                        │     │
│  │  ┌─ --bg-surface  #100f0d ──────────────────────┐     │     │
│  │  │  L2: recessed wells INSIDE a card —           │     │     │
│  │  │  code/script blocks, inputs, media panels,     │     │     │
│  │  │  excerpt quotes. This is the deepest level.    │     │     │
│  │  └────────────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────┘

--bg-footer  #141210 — footer panel only, nowhere else
```

**Rule:** a card never contains another card. If content feels like it needs a
nested card, it needs a recessed `--bg-surface` well, a horizontal rule, or
more whitespace.

### Elevation recipe (skill rule ④ — no borders on cards)

```css
.card {
  background: var(--bg-card);
  border: none;                        /* ← non-negotiable */
  border-radius: var(--r-lg);
  box-shadow:
    inset 0 1px 0 rgba(255,248,230,0.08),   /* the top light-catch */
    0 4px 24px rgba(0,0,0,0.45);
}
.card:hover {                           /* only on interactive cards */
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255,248,230,0.10),
    0 12px 40px rgba(0,0,0,0.55);
}
/* Featured / selected: amber ring, no background change */
.card--featured {
  box-shadow:
    inset 0 1px 0 rgba(255,248,230,0.10),
    0 4px 24px rgba(0,0,0,0.45),
    0 0 0 1px var(--border-accent),
    0 0 30px rgba(212,160,60,0.12);
}
```

Used for: the Surprise Panel, the approved-brief confirmation, the currently
expanded Open Question Card. Nothing else.

---

## 2.4 Grain texture — required

Skill mandates it. Global, fixed, non-interactive.

```css
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  opacity: var(--grain-opacity); mix-blend-mode: overlay; background-size: 128px;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

One implementation note: `z-index: 9999` sits above modals. Modals and drawers
therefore need `z-index` below 9999 (use 100–400) so grain overlays them too —
which is correct, it keeps the texture unified.

---

## 2.5 Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --text-display: clamp(52px,7vw,96px);
  --text-h1:      clamp(36px,4.5vw,60px);
  --text-h2:      clamp(28px,3vw,44px);
  --text-h3:      clamp(17px,1.6vw,20px);
  --text-body:    16px;
  --text-sm:      14px;
  --text-label:   11px;
  --tracking-tight:  -0.03em;
  --tracking-widest:  0.10em;
  --leading-tight:   1.1;
  --leading-relaxed: 1.65;
}
```

> **Font conflict, resolved.** `clean-design` lists Inter as forbidden.
> `dark-luxury-design` specifies Inter. Per the brief, dark-luxury wins.
> **Use Inter.** JetBrains Mono is the companion for all technical/data type.

### The four text roles

| Role | Token | Used for |
|---|---|---|
| Primary | `--text-primary` | Headlines, the bright half of a headline, key values, competitor names, question text |
| Body | `--text-body` | All running prose, descriptions, answers |
| Muted | `--text-muted` | The dark half of a headline, inactive stage rail, thin-confidence text |
| Tertiary | `--text-tertiary` | Meta lines, timestamps, source domains, counts |

### Reading measure

Report and roadmap prose: **max-width 68ch**. Conversation messages: **max-width
64ch**. This matters more than any other single typographic decision — a
long-form document at full 1440px width is unreadable regardless of how good
the type is.

### Headlines — colour contrast, not weight contrast (skill rule ②)

All words in a headline share weight 700–800. Contrast comes from splitting
the line between `--text-muted` and `--text-primary`.

```html
<h1 class="display-headline">
  <span class="hl-muted">An idea in.</span><br>
  <span class="hl-muted">Clarity </span><span class="hl-bright">out.</span>
</h1>
```

Applied through the product:

| Surface | Muted half | Bright half |
|---|---|---|
| `/` hero | "An idea in." | "Clarity **out**." |
| Define header | "Let's work out" | "**what you're building.**" |
| Run console | "Reading the web" | "**about your idea.**" |
| Report header | "What the web" | "**already says.**" |
| Roadmap header | "What to do" | "**next.**" |

Never thin-weight (300) headlines. Never all-bright headlines.

### Section labels — bracket notation only (skill rule ①)

```css
.section-label {
  font-family: var(--font-mono); font-size: 13px; color: var(--accent);
  letter-spacing: 0.06em; display: block; margin-bottom: 16px;
}
```

`[What you get]` · `[The problem]` · `[Who else is doing this]` ·
`[What surprised us]` · `[Open questions]` · `[Build roadmap]`

**Never** `— Label —`. Never uppercase-with-wide-tracking as a substitute.
Brackets, monospace, amber.

### Meta Line — monospace `//` metadata (skill rule ⑥)

```css
.meta-line {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary);
  letter-spacing: 0.04em; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
```

Unlike the skill's landing-page use — where the values are invented for
flavour — **here every value is real.** That's what makes it earn its place.

```text
RUN 7f3a91c4 // 19 QUERIES // 31 PAGES FETCHED // 47 VERIFIED // 18 DISCARDED
DIMENSION: MONEY // 9 FINDINGS // 6 SOURCES // OLDEST 2024-11 // NEWEST 2026-06
EV_12 // VERIFIED 2026-08-19 14:22 // EXAMPLE.COM // PUBLISHED 2026-02-14
```

This line appears: under the Run Shell header, at the head of each dimension
section, and in the Evidence Drawer. Nowhere else — it loses its meaning if
it becomes decoration.

---

## 2.6 Spacing

Base unit 4px (`--sp-N = N × 4px`). Practical scale: **4, 8, 12, 16, 24, 32,
48, 64, 96, 128**.

| Context | Value |
|---|---|
| Page container max-width | 1200px (marketing sections) / 1360px (run shell) |
| Container horizontal padding | 32px |
| Landing section vertical padding | 96–128px |
| App section vertical padding | 48–64px |
| Card internal padding | 24px (compact) / 32px (feature) |
| Gap between stacked cards | 16px |
| Gap between report sections | 64px |
| Space above a `.section-label` | 64px |
| Space below a `.section-label` | 16px |

**Document surfaces breathe more than app surfaces.** The report gets 64px
between sections; the run console gets 24px between findings. The rhythm
itself signals "reading" vs "watching."

---

## 2.7 Borders & radius

```text
--r-md   10px   buttons, inputs, small containers, badges (non-pill)
--r-lg   16px   cards, drawers, panels
--r-xl   20px   footer panel, modals
--r-pill 999px  hero badge, status pills, stage rail segments, tags
```

Borders are used on: inputs, secondary buttons, the icon containers, dividers.
**Not on cards** (§2.3). Dividers are `1px solid var(--border-subtle)`.

---

## 2.8 Buttons (skill rule ③)

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; font-size: 14px; font-weight: 600;
  color: var(--text-primary); background: var(--bg-card);
  border-radius: var(--r-md); border: 1px solid transparent; cursor: pointer;
  transition: box-shadow var(--dur-base) ease,
              border-color var(--dur-base) ease,
              transform var(--dur-fast) var(--ease-out);
}

/* PRIMARY — glow is ALWAYS visible, pulses moderate ↔ strong, never dark */
.btn-primary {
  border-color: var(--accent);
  box-shadow: 0 0 8px rgba(212,160,60,0.55),
              0 0 20px rgba(212,160,60,0.25),
              0 0 40px rgba(212,160,60,0.10);
  animation: btn-pulse 2.8s ease-in-out infinite;
}
.btn-primary:hover {
  animation: none; border-color: var(--accent-bright); transform: translateY(-1px);
  box-shadow: 0 0 10px rgba(212,160,60,0.75),
              0 0 28px rgba(212,160,60,0.40),
              0 0 55px rgba(212,160,60,0.18);
}
@keyframes btn-pulse {
  0%,100% { box-shadow: 0 0 8px rgba(212,160,60,0.55), 0 0 20px rgba(212,160,60,0.25), 0 0 40px rgba(212,160,60,0.10); }
  50%     { box-shadow: 0 0 10px rgba(212,160,60,0.70), 0 0 28px rgba(212,160,60,0.35), 0 0 52px rgba(212,160,60,0.16); }
}

/* SECONDARY — dark bg, barely-visible grey border, no glow */
.btn-secondary { border-color: var(--border-medium); }
.btn-secondary:hover { border-color: rgba(255,248,230,0.28); background: rgba(255,255,255,0.03); }

.btn-sm { padding: 8px 18px; font-size: 13px; }
```

### Button inventory for this product

| Variant | Where it appears | Count rule |
|---|---|---|
| `.btn-primary` | Start · Approve and research · Go to roadmap · Copy script (when it's the point of the card) | **Exactly one per viewport** (principle P6) |
| `.btn-secondary` | Edit · Cancel · Copy link · View sources · Expand all | Unlimited |
| **Text action** | Inline `edit` on brief fields, `show excerpt`, `collapse` | Unlimited; `--text-body` → `--accent` on hover |
| **Icon button** | Close drawer, copy icon, external link | 32×32, `--bg-surface`, `--r-md`, icon at `--text-body` |

Disabled state: `opacity: 0.4`, `cursor: not-allowed`, animation removed. Used
almost nowhere — the product doesn't gate.

---

## 2.9 Inputs

```css
.input, .textarea {
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--r-md);
  color: var(--text-primary);
  font-family: var(--font-sans); font-size: 16px;
  padding: 14px 16px;
  transition: border-color var(--dur-base) ease, box-shadow var(--dur-base) ease;
}
.input::placeholder { color: var(--text-muted); }
.input:hover  { border-color: rgba(255,248,230,0.22); }
.input:focus  {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle), 0 0 24px rgba(212,160,60,0.10);
}
```

**The Box** on `/` is a scaled-up variant: 18px type, 20–24px padding,
min-height 132px, auto-growing, `--r-lg`, and a stronger focus glow. It is the
single most important input in the product and should look like it.

Inline brief-field editing uses a **borderless** variant that adopts the input
border only on focus — so the Brief Panel reads as a document until touched.

---

## 2.10 Icons

- **`lucide-react` only.** 1.5px stroke, rounded caps, `currentColor`.
- Sizes: 16px inline with text · 18–20px in buttons and UI · 28–32px as a
  section marker. Never larger — no giant hero icons.
- **No emoji anywhere.** Both skills prohibit it.
- **No coloured icon tiles.** No amber square behind a white glyph.
- Icon containers, where genuinely needed (skill rule ⑧): 42×42px,
  `background: var(--bg-surface)`, `border: 1px solid var(--border-medium)`,
  `border-radius: var(--r-md)`, icon in `--text-body`.

Working icon set: `ArrowRight` `ArrowUpRight` `Check` `Copy` `ExternalLink`
`X` `ChevronDown` `Search` `FileText` `Users` `Wallet` `Scale` `Sparkles`
`Link2` `Pencil` `HelpCircle` `Quote`.

---

## 2.11 Data visualisation

**The product has no scores, so it has no charts.** This is a deliberate,
defended absence — see [01](01-product-and-principles.md#17-what-the-interface-must-de-emphasise-or-refuse).
Do not add a chart library.

Three visual data devices, all built from `div`s:

### 1. Confidence Note (per dimension)

Three segments. Filled segments = `--text-primary`; empty = `--border-medium`.
Accompanied *always* by the word, never standing alone.

```text
solid                    ▰▰▰   solid
mixed                    ▰▰▱   mixed
we couldn't find much    ▰▱▱   thin
```

Rendered as three 20×3px rounded bars + the label in `--text-sm`. No colour
differentiation (§2.2 rule).

### 2. Coverage bar (run console, per dimension)

A single 4px-high track (`--border-subtle`) filling with `--accent` as verified
findings land. It is **not a percentage of completion** — it's a count relative
to the highest-count dimension in this run. Labelled with the raw count so the
number, not the bar, is the truth:

```text
The problem        ▰▰▰▰▰▰▰▰▱▱   12
What exists        ▰▰▰▰▰▰▱▱▱▱    9
Demand signals     ▰▰▰▰▱▱▱▱▱▱    6
Money              ▰▰▰▰▰▰▰▱▱▱   11
Practical          ▰▱▱▱▱▱▱▱▱▱    2   ← thin
```

### 3. Timeline spine (build roadmap)

A 1px vertical `--border-subtle` line with 9px `--bg-card` nodes ringed in
`--border-medium`; the current/first step's node is ringed `--accent` with a
soft glow. Pure CSS.

That is the complete data-visualisation surface area of the product.

---

## 2.12 Motion

All timings from tokens. Everything is `--ease-out` unless stated.

| Motion | Where | Spec |
|---|---|---|
| **Scroll reveal** | Landing sections, report sections | `opacity 0→1`, `translateY(20px)→0`, `--dur-enter` (600ms), 90ms stagger between siblings. IntersectionObserver, `threshold: 0.08`, unobserve after fire. |
| **Finding entrance** | Run console | New Finding Card fades + slides up 12px over 320ms. The `VERIFIED` badge fades in 180ms *after* the card, so verification reads as a discrete event. |
| **Orb breathe** | `/` hero, run console (dimmed) | 8s alternate, opacity 0.8→1, scale 1→1.08. |
| **Button pulse** | `.btn-primary` only | 2.8s infinite, per §2.8. |
| **Card hover lift** | Interactive cards | `translateY(-2px)`, `--dur-base`. |
| **Drawer slide** | Evidence Drawer | `translateX(100%)→0` + backdrop fade, 260ms. |
| **Accordion** | Open Question Card, dimension detail | `grid-template-rows: 0fr→1fr`, 300ms. (Not `max-height` — it's jumpy with variable content.) |
| **Message entrance** | Define conversation | Fade + 8px rise, 240ms. AI messages stream token-by-token; no per-token animation. |
| **Stage rail transition** | On stage change | Active segment's amber underline slides between segments, 320ms. |
| **Nav blur** | Landing scroll past 40px | `background` + `backdrop-filter` fade in over `--dur-base`. |

**`prefers-reduced-motion: reduce`** — kill: orb breathe, button pulse, marquee,
scroll reveal transform (keep opacity), finding slide. Keep: drawer/accordion
(they communicate structure), colour transitions. Costs ten lines of CSS.

**No marquee in the app.** The skill's logo marquee has no honest use here —
there are no customer logos to show. Omitted rather than faked.

---

## 2.13 Hover, focus, and active states

```css
/* Focus — visible, amber, consistent everywhere */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--r-md);
}
```

| Element | Hover | Active/pressed |
|---|---|---|
| Primary button | animation off, brighter border, `-1px` lift | `scale(0.98)` |
| Secondary button | border → `rgba(255,248,230,0.28)`, bg `rgba(255,255,255,0.03)` | `scale(0.98)` |
| Card (interactive) | `-2px` lift, deeper shadow | none |
| Text action | `--text-body` → `--accent` | none |
| Citation chip | bg `--accent-subtle`, border `--border-accent`, popover after 300ms | drawer opens |
| Stage rail segment | label → `--text-primary` | amber underline |
| Brief field | `--bg-surface` tint + `edit` glyph appears right | becomes input |
| Table/list row | `background: rgba(255,255,255,0.02)` | none |

Every interactive element gets a hover state. Non-interactive elements get
none — hover feedback on static content is a common and confusing mistake.

---

## 2.14 Navigation styling (skill rule ⑩)

**Landing (`/`)** — transparent → blur on scroll:

```css
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; }
.nav.scrolled {
  background: rgba(10,9,7,0.80);
  backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid var(--border-subtle);
}
```

**Run Shell** — always blurred. The user is inside a document; the header is a
persistent orientation device, not a hero overlay. Same visual recipe, applied
unconditionally, plus the Stage Rail and the Meta Line.

---

## 2.15 Footer (skill rule ⑨)

Inside a rounded elevated panel, not flush with the page.

```css
.footer-wrapper { padding: 0 24px 24px; background: var(--bg-base); }
.footer-panel {
  background: var(--bg-footer); border-radius: var(--r-xl);
  box-shadow: inset 0 1px 0 rgba(255,248,230,0.06);
  padding: 48px 48px 24px;
}
```

Contains the wordmark, a one-line description, three or four links, and the
status badge: green dot + `[ALL SYSTEMS OPERATIONAL]` in `--font-mono`,
`--success`.

Full footer on `/` only. Run pages get a minimal footer bar: run ID Meta Line,
copy-link, and "Start another idea."

---

## 2.16 Modals & drawers

The product needs very few. Two patterns, both `--bg-card`, `--r-xl`,
`box-shadow: 0 24px 80px rgba(0,0,0,0.65)`, backdrop
`rgba(6,5,4,0.72)` + `backdrop-filter: blur(4px)`.

- **Evidence Drawer** — right side, 480px wide, full height, slides in. The
  workhorse. Used from every citation chip and finding card.
- **Confirm Modal** — centred, 440px max-width. Used exactly twice: discarding
  an in-progress conversation, and re-running research on an edited brief.

No modal is ever used for primary content. Nothing important lives behind one.

---

## 2.17 Where `clean-design` is borrowed from

`dark-luxury-design` is a landing-page skill; this product is mostly a reading
application. Where the primary skill is silent, these `clean-design`
conventions are adopted — none of them conflict with dark-luxury:

| Borrowed | Applied to |
|---|---|
| Numbered step sections (`01`, `02`, `03`) | `/` "What you get"; build roadmap steps |
| Accordion pattern with rotating glyph | Open Question Cards, dimension detail |
| Tight reading measure and comfortable body leading | All prose surfaces (68ch / 1.65) |
| Overline label introducing every section | Realised as the bracket `[Label]` — dark-luxury's form wins |
| "Let whitespace do the work" | Report and roadmap vertical rhythm |
| Card lift on hover, button press `scale(0.98)` | Interaction feedback |
| Mandatory hover + active state on every interactive element | Global |

**Explicitly not borrowed:** the light palette, the 1px-border card treatment,
the Geist/DM Sans stack, and the ban on Inter. Dark-luxury governs all four.

---

## 2.18 Anti-pattern checklist

Run this before calling any screen done.

- [ ] No filled-amber buttons — dark bg + amber border only
- [ ] Primary button glow never fades to invisible
- [ ] No headline lighter than 700; contrast is colour, not weight
- [ ] No `— Label —` dashes; brackets + monospace only
- [ ] No solid borders on cards; inset top highlight + outer shadow
- [ ] No card inside a card
- [ ] Only one elliptical orb, bottom-centre, and only on `/` and the run console
- [ ] Footer sits inside a rounded elevated panel
- [ ] Grain overlay present
- [ ] Scroll reveals attached to major elements
- [ ] Exactly one `.btn-primary` in the viewport
- [ ] No emoji; SVG icons only
- [ ] No red anywhere; no traffic-light confidence
- [ ] No percentage progress bar during the run
- [ ] Every prose claim in the report carries a citation chip
- [ ] Meta Line values are real, never decorative
- [ ] Prose measure ≤ 68ch
