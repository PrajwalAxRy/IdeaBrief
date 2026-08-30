---
name: audacity_obs
description: Design and build screens in the "Audacity" style — Obsidian inverted onto warm paper. A warm off-white canvas where 1px sand-coloured hairlines carve the entire layout, oversized weight-400 display type with hard negative tracking, one burnt-orange accent that only ever means action/verification/live, code-drawn product UI instead of screenshots, and scroll-driven motion. Same bones as obsidian-design, re-tuned for a light ground rather than merely lightened. Use it for ANY work that produces visible pixels on a surface that has been declared Audacity: new pages, restyling, adding a section, picking a colour, sizing type, laying out a grid, choosing what animates, briefing an image or video, or verifying a screen in the browser. Triggers on "audacity", "audacity_obs", "warm light theme", "light obsidian", "paper theme", or "design"/"restyle"/"make it look"/"add a section"/"hero"/"landing page" when the target surface is Audacity. Do NOT design from memory or default styling — read this first. EXCEPTION: the dark app at the repo root belongs to obsidian-design and `experimentalFrontend/` belongs to audacious-design; never mix `--au-*` tokens with `--ob-*` or `--rl-*` across those boundaries.
---

# Audacity

Warm paper lit from one side. Everything is carved out by line rather than by
fill. Hairline borders are not decoration on the layout — they *are* the layout.
Type is enormous and set at weight 400, so authority comes from scale and
negative tracking rather than from boldness. Exactly one hue exists, and it
always means something.

**This is Obsidian's light sibling, not a light mode bolted onto Obsidian.**
The ten rules, the sixteen-step scale, the seven leadings, the no-shadow law,
the one-accent-three-jobs law and the motion grammar all carry over unchanged.
What changes is that a light ground breaks four things a dark ground hides, and
each of those got re-tuned rather than inverted: see "What actually changed"
below. Do not port a value from `--ob-*` by flipping its lightness.

**References:** Hyperstudio's hairline grid and weight-400 display type,
carried onto the warm paper of an offset-printed spec sheet. Ink on stock, not
a UI on a white background.

**The failure mode** is a generic light SaaS page: cool grey borders on pure
white, type too small, sections separated by an alternating grey band, drop
shadows under every card, a blue-tinted "neutral" palette, an accent used as
decoration until it means nothing. The second failure mode is subtler and more
common here — **washed out**. Weight-400 type on paper renders visually lighter
than the same weight on near-black, and the reflex is to bump everything to
weight 500. That is the wrong fix; see rule 4.

---

## The ten rules

1. **One file holds every colour value.** Not a component, not a Tailwind
   class, not a `style={{}}`. A colour you need that isn't a token means you
   need a token or a different design.

2. **Hairlines are the layout, and a rule is the only separator.** No
   alternating surfaces, no gradient transitions. If you're reaching for a
   background change to *separate two sections*, use a rule — an alternating
   band is the default move on white and it is banned here.

   Two amendments the light ground forces, both in `light-surfaces.md`:
   **a hairline confirms an edge, it no longer creates one** (§2.4 — at 1.14:1
   on `--au-void` it doesn't render, so every element sits one tier from its
   ground), and **a band is a register change, not a separator** (§3). The
   hero and footer sit on `--au-void`; that says "this part of the page is a
   different kind of thing", which is a different claim from "a new section
   starts here". Two or three per page, never two in a row.

3. **No shadows. Ever.** Elevation reads through a border and a surface step.
   The only thing on the page that "lifts" is the primary button, and it lifts
   through colour contrast. A light theme makes this harder — a shadow under a
   card is the reflex — and the discipline is exactly what keeps it from
   looking like every other light product.

4. **Weight 400 at every size, including display.** A 104px headline at weight
   400 *is* the voice of this system. Weight 500 exists only for the mono
   metadata layer. When display type reads too light on paper, the fixes in
   order are: check that `-webkit-font-smoothing: antialiased` is **off** (it
   is a dark-theme correction and it thins type here — recipes §0), then go
   bigger, then track tighter. Never go to 500.

5. **Type is bigger than feels comfortable, tracked tighter than feels safe.**
   Display 58→104px at `-0.028em`. Section headlines 42→68px at `-0.022em`.
   Body never below 16px, and never tracked tight. Those tracking values are
   **looser than Obsidian's** and deliberately so — dark type on a bright ground
   optically closes up rather than blooming open, so porting `-0.035em` across
   fills in the counters. See "Tracking and leading".

6. **One accent, three jobs.** Burnt orange marks the primary action,
   verification/confirmed state, and live/active state. Nothing else. Not the
   logo, not section numerals, not separators, not icons. If you can't say
   which of the three jobs an orange thing is doing, it shouldn't be orange.

7. **Sections breathe at 120–160px.** Under 96px between two sections reads as
   one crowded block.

8. **Product surfaces are drawn in code, not photographed.** A screenshot of
   your UI is worse than the UI itself rendered as markup. See
   `references/media.md` — this is the rule most likely to be broken.

9. **Motion is ambient-and-slow or structural-and-fast, never in between.**
   Ambient: 20–50s, infinite, so subtle a screenshot can't tell. Structural:
   150–320ms, triggered. There is no 2-second "fun" animation. See
   `references/motion.md`.

10. **Measure, don't eyeball.** A screenshot proves a thing looks right; it does
    not prove a rule applied. Read computed styles. See
    `references/verification.md`.

---

## What actually changed from Obsidian

Four things a dark ground hides. Each is a real re-tuning, not an inversion —
these are the places where mechanically flipping a value produces a bug.

| | Obsidian | Audacity | Why |
|---|---|---|---|
| **Accent hover** | brightens (`--ob-accent-bright`) | **deepens** (`--au-accent-deep`) | On near-black, brightening raises contrast. On paper it lowers it, and the label on a primary button goes unreadable. There is deliberately no `--au-accent-bright` token to reach for. |
| **Hover wash** | lightens (white at 4%) | **darkens** (warm-black at 4.5%) | A white-on-white hover is invisible. |
| **Font smoothing** | `antialiased` | **`auto`** | `antialiased` thins glyphs. That's a correction for light-on-dark bloom; on paper it just makes weight-400 type look under-baked. |
| **Ambient bloom** | accent wash, opacity 0.85 | **accent at 0.45, second bloom uses `--au-void`** | An accent wash over near-black is invisible until it's strong; the same wash over warm paper casts the whole page orange. Two accent blooms stack into a visible tint — the second one is toasted paper instead. |
| **Tracking** | display `-0.035em`, body `-0.015em` | **display `-0.028em`, body `-0.008em`**, and four display-tier values instead of three | Light-on-dark blooms outward, so counters read wider than they measure and hard negative tracking claws that back. Dark-on-light does the reverse — the paper bleeds inward, and `-0.035em` at 104px closes the bowls of `a`/`e`/`o` until the line reads as one dark mass. Tracking is also a function of size, so display and h1 can't share a ceiling. |
| **Leading** | display `0.98`, body `1.6` | **display `1.02`, body `1.65`** | A near-solid setting reads as sculptural in white-on-black and as collided in ink. Dark ink on a bright ground needs more air before a paragraph starts striping. |
| **Hairline's job** | creates every edge | **confirms an edge the tier step already made** | `--au-hairline` is 1.27:1 on canvas and 1.14:1 on `--au-void`. At 1.14 it does not render. The layout is still hairline-carved, but every element must sit one tier from its ground or the line has nothing to confirm. |

Two further notes that aren't table rows:

- **Photography inverts too.** Obsidian scrims images *dark*, toward
  `--ob-void`. Audacity scrims them *light*, toward `--au-canvas`, and the
  grade is warm rather than cool. See `references/media.md` §3 — a
  dark-scrimmed photo on paper reads as a hole punched in the page.
- **Cool grey is banned outright.** Not discouraged — banned. A neutral
  `#F5F5F5` or `#E5E5E5` sitting next to these tokens reads distinctly blue and
  breaks the paper in one element. Every surface, hairline, and text value in
  this system is warm, including the ones that look like they could be neutral.
- **There is more than one ground now, and the check is against the worst.**
  Obsidian effectively had one. Audacity has four, and `--au-void` sits 0.10
  below the canvas — which is where the metadata layer actually lives. A colour
  verified against `--au-canvas` and shipped on `--au-void` is this system's
  signature failure; it had it in its own first draft. `light-surfaces.md` §2.1.

**One rule survives unchanged and it's worth saying why: weight 400.** The
temptation on paper is to compensate for apparent lightness with weight, and
the light references in `design_inspiration/` all do — `font-semibold` and
`font-bold` are the two most common classes in them. Hyperstudio, which is
Obsidian's own source, is explicit that weight 400 across all sizes is the
signature and authority comes from scale and tracking alone. That mechanism is
optical and ground-independent: past roughly 72px, added weight stops reading
as emphasis and starts reading as mass. On paper it also reads as *ink* — a
104px semibold headline is a black slab and the page loses its paper. If a
headline isn't carrying the page, the fix is a shorter headline.

---

## Colour

Values live in the token file (`assets/tokens.css` is paste-ready). Reproduced
here so you can reason about them — never copy a hex into a component.

### Surfaces — four levels

| Token | Value | Use |
|---|---|---|
| `--au-canvas` | `#FAF6F0` | Page ground — warm paper. The default. |
| `--au-void` | `#F1E9DE` | Toasted paper. Hero band, footer, and any surface meant to read as *deeper* than the page. |
| `--au-surface` | `#FFFCF7` | Cards, panels, inputs. |
| `--au-raised` | `#FFFFFF` | The one level above a card — a user's own message, a selected row. |

Note the direction — it is the same as Obsidian's, mirrored. `--au-void` is
**deeper and warmer** than the canvas; cards step the other way, toward white.
In a system with no shadows, "recessed" and "elevated" are both just steps along
one axis, and the hero reading deeper than the page is what makes the content
above it float. `--au-raised` is the only pure-white value in the system, and it
is reserved for that one job.

### Hairlines — the structural line work

| Token | Value | canvas / void | Use |
|---|---|---|---|
| `--au-hairline` | `#E6DBCB` | 1.27 / **1.14** | Every section divider, card border, table rule. The most-used value in the system. |
| `--au-hairline-strong` | `#C8B79C` | 1.82 / 1.63 | Hover state of a bordered control; the one border meant to be noticed. Also the condensed nav bar, which has no self-evident edge on paper. |
| `--au-hairline-accent` | `rgba(191,68,19,0.42)` | — | Border of a *verified* object only. |

`--au-hairline` sits about 4–5% below the canvas in lightness. That gap is the
whole system: push it darker and the page turns into a wireframe, lighter and
the layout stops being carved at all.

**But at 1.14:1 it does not render inside a `--au-void` band.** This is the one
structural concession the light ground forces, and it changes the hairline's
*job* rather than its value: **the tier step makes the edge, the hairline
confirms it.** Every element sits at least one tier from its ground; `.au-well`
ships with no border at all for exactly this reason. Never darken the token to
survive the void — its 1.27 on canvas is the job it actually has, and darkening
it turns every card on the page into a wireframe. Full rule in
`light-surfaces.md` §2.4 and `recipes.css` §5.

### Text — three levels and a dim

Measured against all four grounds, worst case shown. Re-run `light-surfaces.md`
§1 if you change any of these.

| Token | Value | canvas | void (worst) | Use |
|---|---|---|---|---|
| `--au-text` | `#1A1410` | 16.94 | 15.16 | Headlines, values, anything being asserted. |
| `--au-muted` | `#5F5347` | 6.93 | 6.20 | All running prose. This is the default body colour. |
| `--au-dim` | `#766751` | 5.09 | 4.56 | Mono metadata, labels, timestamps, domains. |
| `--au-on-accent` | `#FFF8F2` | — | 4.93 on `--au-accent` | Text sitting on the accent fill. |

Body copy is `--au-muted`, not `--au-text`. Uniformly near-black body copy
flattens the page — the contrast between an espresso headline and warm-taupe
prose is doing real work. Note that `--au-muted` is *darker* than a naive
inversion of Obsidian's grey prose would give you: that inversion lands around
4:1 and fails.

`--au-dim` is a metadata colour, not a prose colour. It clears AA everywhere,
but a full paragraph at 4.56 is legible rather than comfortable.

All four are warm-black rather than black. Pure `#000` on warm paper reads as a
hole rather than as ink.

### Accent — one hue, three jobs

| Token | Value | Use |
|---|---|---|
| `--au-accent` | `#BF4413` | Primary action · verification · live/active. |
| `--au-accent-deep` | `#96330B` | Hover of the above. **Deeper, not brighter** — see the change table. |
| `--au-accent-wash` | `rgba(191,68,19,0.10)` | Ambient bloom, focus ring fill. |
| `--au-accent-ring` | `rgba(191,68,19,0.28)` | Pulse ring on a live dot. |
| `--au-accent-glow` | `rgba(191,68,19,0.32)` | The single glow permitted, on primary-button hover. |

Every alpha here is lower than Obsidian's equivalent. Translucent colour reads
far more strongly over paper than over near-black; carrying the dark system's
alphas across is what turns the page orange. If you add an `rgba()` token, start
at roughly a third of what the dark value would be and measure up — never start
from the dark value and nudge down.

**The accent is burnt rather than bright, and that is load-bearing.** Measured:
`--au-accent` as text is 4.81 on canvas, 4.31 on void; `--au-on-accent` on the
fill is 4.93. Every light-theme reference in `design_inspiration/` reaches for a
brighter orange — `#F05A28`, `#FF6B35`, `#FC5200` — and those land around
3.2–3.6:1 against warm paper. They fail AA as text *and* fail under white, which
is why systems built on them must split the accent into a marks-only value plus
a darker accent-text value, and hand the filled button to a near-black instead.

Audacity doesn't need that split: one token does all three jobs and rule 6 stays
literally one hue. **The price is that it will look conservative next to those
references.** That's the trade — this accent has to survive being a 1px rule, a
10px chip label, a filled button, and body-adjacent text, and a bright orange
can only do the first. Don't brighten it.

Two constraints that follow:

- **4.31 on `--au-void` is the tightest number in the system.** Accent text at
  `--au-meta-xs` inside a toasted band is the first thing to re-measure after
  any change.
- **Colour is not an affordance.** An inline prose link needs an underline as
  well as the hue — `.au-link-inline` ships with one. A link that is only a
  slightly darker word is invisible to anyone who can't separate the hue.

### Negative / discard state

| Token | Value | Use |
|---|---|---|
| `--au-discard` | `#A99B89` | Something that failed a check and is leaving. |

**There is no red in this system** — which matters more here, because the accent
is already warm. A rejected item is a non-event, not an error: it fades toward
the paper, strikes through, drops a few pixels, and stops mattering. Red would
both make failure feel like the user's fault and read as a second orange.
Reserve any warning hue for a genuine destructive confirmation, and add it as a
deliberate exception — computed against paper, not borrowed from a ramp.

`--au-discard` measures **2.52** on canvas and is the one text colour in the
system below AA. That's deliberate and it matches Obsidian's equivalent almost
exactly (2.16) — "stops mattering" is the whole job. It becomes an
accessibility bug the moment it is the *only* signal, so the rule is: pair it
with a strikethrough **and** a chip reading `DISCARDED` in `--au-dim`. If a user
has to read the discarded text to understand what happened, it isn't discarded,
it's illegible. This is the one colour the contrast audit exempts, and the
exemption is conditional on the pairing.

---

## Typography

Identical to Obsidian. **Geist** (display, UI, body) and **Geist Mono**
(metadata only). No third face.

Substitutes, in order of preference if Geist is unavailable: Instrument Sans,
Schibsted Grotesk, Onest. Avoid Inter — it is too neutral to carry a 104px
headline at weight 400.

### Scale

**Sixteen steps in four tiers, and there is no seventeenth.** A size that is
not one of these tokens is a bug — see "Closing the scale" below for why this
is stated so bluntly.

**Display tier** — sans, weight 400, hard negative tracking. Headings only.

| Token | Value | Use |
|---|---|---|
| `--au-display` | `clamp(58px, 7.2vw, 104px)` | Hero headline. One per page. |
| `--au-h1` | `clamp(42px, 4.6vw, 68px)` | Section headline. |
| `--au-h2` | `clamp(30px, 3vw, 44px)` | Sub-section, panel title. |
| `--au-h3` | `23px` | Card title. |
| `--au-lead` | `21px` | Hero subcopy and section intros only. |

**Text tier** — sans, weight 400, `--au-tracking-snug`.

| Token | Value | Use |
|---|---|---|
| `--au-sub` | `18px` | The step between body and lead: wordmark, pulled excerpt, composer, a card title too small for `--au-h3`. |
| `--au-body` | `16px` | Running prose. |
| `--au-sm` | `14px` | Dense UI, buttons, chat, secondary copy. |
| `--au-xs` | `13px` | The dense step: figure notes, small buttons, tooltip proof lines. |

**Meta tier** — mono, weight 500, `+0.10em`, uppercase.

| Token | Value | Use |
|---|---|---|
| `--au-meta` | `12px` | The layer's home size. |
| `--au-meta-sm` | `11px` | Micro-label inside another element. |
| `--au-meta-xs` | `10px` | Chips, citation superscripts, tags. |

The two below 12px are for labels that sit *inside* another element. Never set
a line that has to be read at 10 or 11px.

**Figure numerals** — mono, weight 400, `--au-tracking-fig` (`-0.02em`),
leading `1`. A separate tier because a number is not a heading: mono so digits
are tabular, and never the display tier's tracking.

| Token | Value |
|---|---|
| `--au-fig-xl` | `clamp(40px, 4vw, 56px)` |
| `--au-fig-lg` | `44px` |
| `--au-fig-md` | `33px` |
| `--au-fig-sm` | `28px` |

### Tracking and leading

**Looser than Obsidian at every step.** This is the correction most likely to be
skipped when porting, because the numbers still look aggressive on paper.

- Display: `-0.028em`, leading `1.02`.
- h1: `-0.022em` · h2: `-0.018em`, leading `1.08`.
- Body and UI: `-0.008em`, leading `1.65`.
- Mono metadata: `+0.10em`, uppercase, leading `1.4`.
- Figure numerals: `-0.01em`, leading `1`.

The mechanism is optical, not stylistic. Light type on a dark ground blooms
outward, so counters and letter gaps read *wider* than they measure — negative
tracking claws that back, and `-0.035em` on a 104px white-on-black headline
reads as confident. Dark type on a bright ground does the reverse: the paper
bleeds inward and counters read *tighter* than they measure. Port `-0.035em`
across and a 104px headline closes up — the bowls of `a`, `e` and `o` start
filling in and the line reads as one dark mass rather than as words.

Tracking is also a function of **size**, not just of ground, which is why the
display tier has four values instead of sharing a ceiling: at 104px a counter is
enormous in absolute terms and can afford `-0.028em`; at 44px the same value is
cramped. The body value `-0.008em` still keeps the UI feeling related to the
headline, which was the point of the slight negative in the first place — but
past `-0.012em` on paper, 16px copy starts losing word spacing.

**Leading is seven values, same as sizes are sixteen.** `--au-leading-display`
`1.02` · `--au-leading-flat` `1` · `--au-leading-tight` `1.08` ·
`--au-leading-snug` `1.25` · `--au-leading-meta` `1.4` · `--au-leading-lead`
`1.5` · `--au-leading-body` `1.65`. Nothing between them. A 1.55 or a 1.7 in a
recipe is how one size ends up rendering at four different leadings on one
page — which is the single most common way a set of screens stops looking like
one system while every individual screen still looks fine.

Two of those steps are looser than Obsidian's for the same optical reason as the
tracking: a near-solid `0.98` display setting reads as sculptural in
white-on-black and as *collided* in ink, and body copy needs `1.65` before a
paragraph of dark ink stops striping on a bright ground.

### Closing the scale

A scale that lists sixteen steps and silently tolerates a seventeenth is not a
scale. Measure it, per route:

```js
// In the Playwright MCP, per route. Anything in offScale/offLead is a bug.
// Resolve the tokens THROUGH THE BROWSER rather than hardcoding pixel values:
// three steps are clamp()s, so their real value depends on the viewport. A
// hardcoded list plus a tolerance band gets this wrong in both directions —
// --au-h1 sits just under its own max at 1440px and reads as off-scale, while
// a genuine stray 17px hides inside the band around --au-sub.
const TOKENS = ['--au-display','--au-h1','--au-h2','--au-h3','--au-lead','--au-sub',
  '--au-body','--au-sm','--au-xs','--au-meta','--au-meta-sm','--au-meta-xs',
  '--au-fig-xl','--au-fig-lg','--au-fig-md','--au-fig-sm'];
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden';
document.body.appendChild(probe);
const SCALE = new Set(TOKENS.map(t => {
  probe.style.fontSize = `var(${t})`;
  return +parseFloat(getComputedStyle(probe).fontSize).toFixed(2);
}));
probe.remove();

// Audacity's seven, NOT Obsidian's — display is 1.02 (not 0.98) and body is
// 1.65 (not 1.6). Porting the dark set here makes every correct line report
// as off-scale, which is worse than not running the check at all.
const LEAD = new Set([1.02, 1, 1.08, 1.25, 1.4, 1.5, 1.65]);
const EXEMPT = /footer-mark/;   // your commented exceptions, if any
const offScale = [], offLead = [];
document.querySelectorAll('body *').forEach(el => {
  if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
  const cs = getComputedStyle(el);
  const fs = +parseFloat(cs.fontSize).toFixed(2);
  const ratio = Math.round((parseFloat(cs.lineHeight) / fs) * 100) / 100;
  const cls = typeof el.className === 'string' ? el.className : el.tagName;
  if (EXEMPT.test(cls)) return;
  if (!SCALE.has(fs)) offScale.push(`${fs}px ${cls}`);
  if (!LEAD.has(ratio)) offLead.push(`${fs}px/${ratio} ${cls}`);
});
return { offScale: [...new Set(offScale)], offLead: [...new Set(offLead)] };
```

Scroll to the bottom and wait before sampling, or every not-yet-revealed
section reports whatever it inherits rather than what it will paint. Run it at
both 1440px and 1280px — the clamps resolve differently and a rule that only
misbehaves at one width is exactly what a single-width check misses.

An audit of a real product built on the parent system found 15 distinct sizes on
its marketing page and **38 distinct size+leading pairs on one app page** —
roughly twice the typographic variety at the same level of content — sourced
from 67 hardcoded pixel values and six `text-[15px]` Tailwind escapes. None of
it was expressive. Each value was a local decision nobody could see from
anywhere else, and the drift lived almost entirely in the *app*, not the landing
page: marketing pages get designed, product pages get extended.

Two lessons worth carrying into a new project:

- **The overflow concentrates just below `--au-body`.** 15px, 17px and 19px
  are where "slightly smaller/larger than body" decisions land when there is
  no named step. `--au-sub` and `--au-xs` exist to absorb them.
- **Tailwind arbitrary values are the leak.** `text-[15px]` reads as harmless
  and bypasses the whole system. The `.au-sub` / `.au-sm` / `.au-xs` recipe
  classes ship on day one for exactly this reason, so a component always has a
  token-backed way to say a size. Keep Tailwind to layout.

Deliberate exceptions are allowed but must be *unrepeatable and commented* — a
stroked footer watermark whose leading and tracking are tuned to make its
baseline clip land is a piece of art, not a step. If an exception could
plausibly get a second consumer, it is a missing token, not an exception.

### The metadata layer

Mono, 12px, uppercase, `+0.10em`, `--au-dim`. It carries ids, counts, domains,
timestamps, section labels, and status. It never carries a sentence — uppercase
mono at sentence length is unreadable. If your mono string has a verb in it,
it belongs in sans.

---

## Layout and rhythm

- Container `1200px`, gutter `40px`. Wider than 1200 and the hairlines stop
  reading as a frame.
- Section padding `160px` standard, `120px` for a tight pairing, never below 96.
- Radii: `4px` tags/chips · `10px` cards · `16px` large panels · `999px`
  buttons only. **Nothing else is a pill.** The system is architectural, not
  soft; a rounded card reads as a different system entirely.
- Grids: two-up asymmetric (`400px` + `1fr`) for scrollytelling; three-up for
  cards; four-up only for numerals. Avoid four-up cards — it shrinks type.
- The sticky-left / scrolling-right pattern is the house layout for anything
  with 2–4 sequential ideas. It gives the "pinned" feel without ever taking the
  scrollbar from the user.

---

## Components

Recipes live in a single stylesheet (`assets/recipes.css` is paste-ready).
**Tailwind is for layout only** — flex, grid, spacing, sizing. No `colors` key
in the Tailwind config.

- **Button.** Sans, weight 400, 14px, fully pill. *Primary:* solid accent,
  warm-white text; hover **deepens** the fill and adds the one permitted glow.
  *Ghost:* transparent with a `--au-hairline-strong` border; hover raises the
  border to full text colour and adds the darkening hover wash. *Bare:* text
  plus an arrow that translates on hover. Exactly one primary visible per
  viewport — hold back a fixed header's CTA until the hero's has scrolled away.
- **Badge / eyebrow pill.** `--au-surface` fill, hairline border, pill radius,
  optionally an accent tag chip on the left.
- **Chip.** 4px radius, hairline border, mono 10–12px uppercase. The verified
  variant swaps to `--au-hairline-accent` + accent text.
- **Live dot.** 6px, accent, the only pulsing thing in the system.
- **Rule.** `1px solid --au-hairline`. Use it constantly — but as confirmation
  of a tier step, not as the only edge. See the tier rule.
- **Fragment card.** A bordered panel with a mono header bar on `--au-void` and
  a body on `--au-surface`. This is the container for all code-drawn product UI.
  The void→surface step is what makes the header boundary read; the border is
  confirmation.
- **Well.** The deepest step — a code block, an empty state, a quoted excerpt
  inside a card. Ships with **no border**: it sits one tier below its parent and
  that step is a stronger edge than a 1.3:1 line. A border here is the tell that
  someone didn't trust the tier.
- **Composer / input.** `--au-surface`, hairline border; focus swaps the border
  to `--au-hairline-accent` and adds a 4px `--au-accent-wash` ring.
- **Inline link.** Accent colour **plus** an underline. Colour alone is not an
  affordance; `.au-link-inline` carries both.
- **Paper tooth.** One global fixed overlay at 0.025, `mix-blend-mode:
  multiply`. Not decoration — it's most of what stops a large flat canvas
  reading as a blank browser default.

Every interactive element ships hover, `:focus-visible`, active, and disabled
**at build time**, not in a polish pass. Focus rings must not inherit a hover
transition — a ring that fades in over 320ms reads as lag. Set
`transition: none` in the `:focus-visible` rule.

---

## Section patterns

Compose pages from these. Each names its media obligation — see
`references/media.md`.

| Pattern | Media obligation |
|---|---|
| **Hero** | Perspective media collage behind the headline (photography allowed here) + a CSS ambient bloom, at Audacity's reduced opacity. |
| **Marquee strip** | None. Mono, edge-masked, pauses on hover. Must carry real information, not filler words. |
| **Scrollytelling pillars** | One code-drawn product fragment per panel. Never stock. |
| **Proof / mechanic** | A live DOM animation of the thing being claimed. Never a video of it. |
| **Conversation band** | None — the transcript and composer are the visual. |
| **Stat row** | None. Oversized mono numerals, counting up on reveal. |
| **Footer** | An oversized stroke-only wordmark as the closing graphic, on `--au-void`. |

---

## Reference files

Read the one you need; don't read them all up front.

| File | Read it when |
|---|---|
| `references/light-surfaces.md` | **Picking any colour pairing, and again before shipping.** The contrast audit script, the five traps, the tier rule, the glare/bands position, the warm-grey greps. This is the one with no Obsidian equivalent — on near-black none of it is a failure mode. |
| `references/motion.md` | Adding any animation, scroll behaviour, reveal, or transition. |
| `references/media.md` | Deciding what fills a visual area — image, video, code, or slot. Read §3 before any photography; the treatment is the part that inverts. |
| `references/higgsfield.md` | Writing a generative brief, or generating/swapping real assets. |
| `references/verification.md` | Before calling any screen done. The Playwright MCP loop. |
| `references/pitfalls.md` | Something applied in the stylesheet but not on screen. Read this **first** when debugging CSS that "should work". |

`assets/tokens.css` and `assets/recipes.css` are paste-ready starting points for
a new project.

---

## Setting this up in a new project

1. Paste `assets/tokens.css` into your token file. Scope it however you like —
   `:root` if the whole app is Audacity, `[data-theme='audacity']` if you're
   introducing it alongside an existing system.
2. Paste `assets/recipes.css`. **Import it into `@layer components`**, not
   unlayered — see `references/pitfalls.md` §1, this is not optional.
3. Load Geist + Geist Mono as CSS variables (`next/font/google` exposes both).
4. Remove any `colors` key from the Tailwind config.
5. Check for global `@layer base` rules that hard-code an accent —
   `:focus-visible` and `::selection` are the usual offenders.
6. **Check for a global `-webkit-font-smoothing: antialiased`.** Most starters
   ship one, and it will quietly wash out every weight-400 headline on the
   page. Recipes §0 sets it back to `auto`; make sure nothing unlayered wins
   against that.
7. Set `color-scheme: light` on the root, so form controls, scrollbars and
   `<select>` popups don't render dark against the paper.

---

## Checklist before calling a screen done

- [ ] **The contrast audit returns empty** — `light-surfaces.md` §1, run with a
      `--au-void` band in view, not just against the canvas.
- [ ] No colour value outside the token file.
- [ ] No cool grey anywhere — run both greps in `light-surfaces.md` §4 *and* the
      browser R ≥ B sweep in `verification.md` §6.
- [ ] Every element sits one tier from its ground; no hairline is load-bearing
      inside a `--au-void` band.
- [ ] At most two or three void bands, never two in a row, none used as a
      section separator.
- [ ] Exactly one primary button visible per viewport.
- [ ] Every orange thing is an action, a verification, or a live state — named out loud.
- [ ] Every accent-coloured run of text inside a sentence has an underline.
- [ ] Anything in `--au-discard` is also struck through and chipped.
- [ ] Display headline ≥ 58px at weight 400 with `-0.028em`, and **not** at
      weight 500, and **not** at Obsidian's `-0.035em`.
- [ ] `-webkit-font-smoothing` is not `antialiased`.
- [ ] Sections separated by a 1px rule, not a background change.
- [ ] Zero `box-shadow` outside the primary-button hover glow.
- [ ] Primary button hover *deepens*; the label is still readable on it.
- [ ] Nothing but a button has a pill radius.
- [ ] Body copy is `--au-muted`, not `--au-text`.
- [ ] Mono carries no sentences.
- [ ] The ambient bloom is not nameable in a screenshot.
- [ ] Every interactive element has hover, focus-visible, active, disabled.
- [ ] Focus rings snap — no transition.
- [ ] Ambient motion stops under `prefers-reduced-motion`; auto-advancing
      content resolves to a static full state, not a frozen partial one.
- [ ] Space reserved for anything that streams or arrives late.
- [ ] Read at 1440px **and** 1280px, and *measured* — see `references/verification.md`.

---

## Appendix — this repo

**Audacity is not wired into any surface in `startup_validator` yet.** It ships
here as a portable system: the two `assets/` files are the whole starting point,
and nothing in `app/`, `components/` or `styles/` reads an `--au-*` token today.

That matters because the repo root is **globally Obsidian**, on `:root`, with no
`data-theme` attribute anywhere. So:

- **Do not invoke this skill for work at the repo root** unless the request
  explicitly asks for Audacity. `obsidian-design` owns `app/`, `components/`
  and `styles/`; `audacious-design` owns `experimentalFrontend/`.
- **`audacious-design` is a different system, not a near-duplicate.** It is
  also warm and light, which makes them easy to confuse. It carries *near-black*
  as its action colour with warm orange used sparingly, and builds with stepped
  card tiers. Audacity carries *burnt orange* as its one accent and builds with
  hairlines and no fills. Picking the wrong one produces a page that is
  internally consistent and belongs to neither.
- **If Audacity is adopted on a surface here, scope it.** Since Obsidian holds
  the global `:root`, Audacity has to arrive as
  `[data-theme='audacity'] { … }` on a wrapper, not as a second `:root` block —
  a second one would win by source order and restyle the entire dark app.
- **Never let `--au-*` and `--ob-*` meet in one subtree.** They cover the same
  concepts at opposite lightnesses, and every failure this produces is silent:
  an Obsidian recipe inside an Audacity wrapper still resolves its own tokens
  and paints near-black text on near-black paper with no error.

`references/pitfalls.md` §1 and §2 are the two failure modes any adoption here
will hit, and §2 in particular — an existing global base rule leaking Obsidian's
blue into Audacity's focus rings — is close to guaranteed.
