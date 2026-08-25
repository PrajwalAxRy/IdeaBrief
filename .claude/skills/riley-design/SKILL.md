---
name: riley-design
description: Design and build screens in the "Riley" style — a warm-paper light canvas where surfaces step rather than divide, near-black carries every action, one warm orange marks the thing worth looking at, content lives in nested card tiers instead of paragraphs, and product surfaces are drawn in code. Inspired by Loops crossed with Sonarly and Trackit, with cool grey removed on purpose. Use this for ANY work that produces visible pixels inside `experimentalFrontend/` — new pages, restyling, adding a section, picking a colour, sizing type, laying out a grid, choosing what animates, briefing an image or video, or verifying a screen in the browser. Triggers on "design", "restyle", "make it look", "light theme", "riley", "add a section", "hero", "landing page", or any request that will produce visible pixels in the experimental frontend. Do NOT design from memory or default styling — read this first. When a component's SHAPE isn't specified here (testimonials, docks, footers, pricing tables, dashboards), ask the user for a reference implementation rather than inventing one — they prefer to supply one. For the existing dark app at the repo root, use obsidian-design instead.
---

# Riley

A warm light canvas where structure comes from surfaces stepping against each
other rather than from lines dividing them. Nothing here is cool grey — every
neutral carries warmth, which is the one decision that separates this from the
framework default everybody else ships. Authority comes from near-black at
weight 600; one warm orange marks the single thing in a view worth looking at.

**References:** Loops.so (the alternating warm bands, the eyebrow-over-headline
rhythm, black CTA with an accent text link beside it) crossed with Sonarly (the
bento unit — a code-drawn UI fragment on a tinted panel, text below on white)
and Trackit (the diagram vocabulary: concentric rings, connector lines,
orbiting tiles).

**The failure mode** is a generic modern SaaS page: cool Tailwind greys, a
shadow on every card, the brand colour on every button until it means nothing,
three paragraphs where a component would have said it, and 40px of type doing
the job of 56.

---

## The eleven rules

1. **One file holds every colour value.** Not a component, not a Tailwind
   class, not a `style={{}}`. A colour you need that isn't a token means you
   need a token or a different design.

2. **Warm paper, never grey.** `#F9FAFB`, `#F3F4F6`, `#E5E7EB` and every other
   cool neutral are banned outright — they don't appear in the token file, so
   they can't appear on screen. Every ground, hairline and text tone is warm.
   This is the system's signature and the fastest way to break it.

3. **Every surface sits one step from its neighbour.** White card on linen
   ground, or linen panel inside a white card — never same-on-same. This is
   measured, not stylistic: a hairline against a ground one tier away scores
   **1.05:1** and is invisible on a real display. See "The one-step rule".

4. **Near-black is the action. The accent is the pointer.** Primary buttons are
   `--rl-action`. The accent marks links, active state, live state, and the one
   element in a diagram the eye should land on. **There is no accent-filled
   button** — white on `#F05A28` is 3.39:1 and cannot be made accessible.

5. **Sections separate by ground change, not by a rule.** Bands alternate
   paper ↔ canvas ↔ linen. A 1px line between two full-width sections is the
   wrong instinct here — that belongs to a different system.

6. **Display is weight 600 at `-0.02em`.** Not 400, not `-0.035em`. Thin
   dark-on-light reads flimsy where thin light-on-dark reads elegant; the
   tracking that flatters a white headline on black closes up a black headline
   on white.

7. **Two shadows exist and both must be earned.** Border is the default
   elevation. A shadow means the element genuinely floats above the plane —
   over a photo, over another card, over the page. A shadow on a card that sits
   flat in the grid is the tell of a generic page.

8. **Prose is capped per unit and the cap is enforced.** A card gets a title
   and at most one sentence; a section intro gets at most two. Past that, the
   content is telling you it wants a component. See "The text budget".

9. **The payload is a drawn UI fragment, then a chart, then a generated asset —
   in that order.** Never a screenshot of our own product. See
   `references/media.md`.

10. **Measure, don't eyeball.** A screenshot proves a thing looks right; it does
    not prove a rule applied, and on light it does not prove anyone can read it.
    Run both audits. See `references/verification.md`.

11. **When you don't know what a component should look like, ask for a
    reference — don't invent one.** This system was derived from reference
    implementations and is extended the same way. See below.

---

## Asking for a reference

**The user prefers giving a reference over having one invented, and has said so
explicitly. Asking is encouraged, not an imposition.** Every rule in this file
was derived from real reference implementations; a component built from
imagination is the one part of a screen that won't match the rest.

### When to ask

Ask when you're about to build a component this file doesn't specify and you'd
be guessing at its *shape* — not its colour or type, which the tokens already
decide. Concretely: testimonial walls, docks, footers, pricing tables,
comparison tables, changelogs, blog indexes, empty states, onboarding flows,
data tables, command palettes, dashboards, navigation patterns beyond a simple
bar.

The test: **could two competent designers produce structurally different things
from this brief?** If yes, ask. If the answer is fully determined by
"Components" and "Section patterns" below, build it.

### How to ask

Ask *before* building, not after — a rewrite costs more than a question. Be
specific about what you're stuck on, and say what you'd do otherwise so the user
can just confirm if that's fine:

> Building the pricing section. Riley specifies the card, the chosen-plan
> border and the segmented control, but not the plan-comparison layout — 3-up
> cards, a feature matrix, or cards plus a matrix below. Do you have a
> reference? Otherwise I'll do 3-up cards with `--rl-line-ink` on the
> recommended plan.

One question, one component, with a default attached. Don't batch six questions
into a wall, and don't block on the answer — build everything that doesn't
depend on it first.

### What to do with the answer

A reference is a **source to derive from, not a file to copy**. Extract the
structure — the tiers, the grid, the hierarchy, what's a chip versus a row — and
re-express it in Riley's tokens and recipes. A pasted reference brings cool
greys, its own type scale, `style={{}}` colours and its own accent, all of which
break rule 1 and rule 2 on contact.

Then **write down what you learned**: add the pattern to "Components" or
"Section patterns" in this file. A reference used once and forgotten means the
next component gets guessed at again.

Where a reference contradicts a rule here, say so rather than silently picking
one. The references this system came from disagree with it in at least three
places — see the notes under "Components" and "Dark bands" — and those
disagreements were resolved deliberately, not by accident.

---

## Colour

Values live in the token file (`assets/tokens.css` is paste-ready). Reproduced
here so you can reason about them — never copy a hex into a component. Every
contrast figure below was computed, not estimated; the script that produced
them is in `references/light-surfaces.md`.

### Grounds — four warm levels

| Token | Value | Use |
|---|---|---|
| `--rl-paper` | `#FFFFFF` | Card faces, and the brighter of two alternating bands. |
| `--rl-canvas` | `#FAF9F7` | Page ground. The default. |
| `--rl-linen` | `#F4F1EB` | Tinted panel inside a card; the dimmer alternating band. |
| `--rl-inset` | `#EBE6DD` | Wells — code blocks, empty states, the deepest recess. |

These are the warm replacements for `white / gray-50 / gray-100 / gray-200`.
The warmth is small in hex and large on screen: `#FAF9F7` beside `#F9FAFB` is
obviously the warmer one the moment they share a viewport, and a page built
entirely from one or the other reads as either considered or defaulted.

### The one-step rule

An element must sit **at least one tier away** from whatever it sits on. The
reason is measurable — `--rl-line` against each ground:

| Ground | Hairline contrast |
|---|---|
| `--rl-paper` | 1.30:1 |
| `--rl-canvas` | 1.24:1 |
| `--rl-linen` | 1.15:1 |
| `--rl-inset` | **1.05:1** |

A bordered card on `--rl-inset` has no visible border. So: white card on linen,
linen panel on white, inset well inside a linen panel. Never a linen card on a
linen band with a hairline and a hope.

### Hairlines

| Token | Value | Use |
|---|---|---|
| `--rl-line` | `#E7E1D7` | Default border: cards, rows, table rules, inputs. |
| `--rl-line-strong` | `#D6CEC0` | Hover state of a bordered control. |
| `--rl-line-ink` | `#1A1714` | The one border meant to be *chosen* — the highlighted plan, the selected card. Near-black, not accent. |

### Text — four levels

| Token | Value | Worst-ground contrast | Use |
|---|---|---|---|
| `--rl-ink` | `#1A1714` | 14.36:1 | Headlines, values, anything asserted. Warm near-black, never `#000`. |
| `--rl-body` | `#57514A` | 6.30:1 | All running prose. The default body colour. |
| `--rl-muted` | `#776E64` | 4.02:1 | Secondary copy and metadata. **AA on paper and canvas only** — see below. |
| `--rl-faint` | `#8C8175` | 3.07:1 | **Never text.** Disabled controls, icon strokes, decorative rules. |

Two traps here, both specific to light themes and both the direct cause of
inaccessible "clean" pages:

- **`--rl-muted` is not universal.** It passes AA on `--rl-paper` (5.00) and
  `--rl-canvas` (4.75) and fails on `--rl-linen` (4.44) and `--rl-inset`
  (4.02). Use `--rl-body` for secondary copy on the two darker grounds.
- **Porting `--ob-muted` from a dark system is the mistake to avoid.** In
  Obsidian, grey body copy against a white headline is doing real work. Inverted
  onto light it produces grey-on-white body text that measures under 4.5:1 —
  the single most common accessibility failure in this genre. Body copy here is
  `--rl-body`, which is dark enough to read and light enough to sit below the
  headline.

### The accent — one hue, three jobs, and it is never a button

| Token | Value | Use |
|---|---|---|
| `--rl-accent` | `#F05A28` | **Marks, not text.** Live dot, active-tab rule, progress fill, chart series, the one icon tile. |
| `--rl-accent-text` | `#AE3D12` | The AA-safe variant for **any accent-coloured text or link**. 4.86:1 at worst. |
| `--rl-accent-solid` | `#C43F15` | The one fill that carries white text (5.16:1). For an accent control that genuinely must be filled — rare. |
| `--rl-accent-wash` | `#FDF0EA` | Chip and callout background. Pair with `--rl-accent-text`. |
| `--rl-accent-line` | `rgba(240,90,40,0.35)` | Border of an accent-marked object. |

**The three jobs: link, active/live, focal point.** If you can't name which one
a warm-orange thing is doing, it shouldn't be warm orange.

**Why there is no accent button.** White on `--rl-accent` is **3.39:1** — below
AA for any text size. Darkening the fill until white passes lands on
`--rl-accent-solid`, which is muddy at button scale and competes with
`--rl-action` for the same meaning. Both the palette and all three references
independently arrive at the same answer: the button is black, and the accent
sits beside it as a text link.

### Action

| Token | Value | Use |
|---|---|---|
| `--rl-action` | `#1A1714` | Primary button fill. 17.85:1 with white. |
| `--rl-action-hover` | `#332D27` | Hover. Lightens — on light grounds, a black control hovering *lighter* reads as pressed-ready; darkening reads as dead. |
| `--rl-on-action` | `#FFFFFF` | Text on the above. |

### Semantic — four, and they are not the accent

| Token | Value | Wash | Worst-ground |
|---|---|---|---|
| `--rl-positive` | `#1A6B42` | `#E8F4ED` | 5.24:1 |
| `--rl-caution` | `#7E5205` | `#FDF3E2` | 5.46:1 |
| `--rl-critical` | `#B32D1B` | `#FBEDEA` | 5.11:1 |
| `--rl-info` | `#1B559A` | `#E8F0FA` | 6.01:1 |

All four carry white text on their solid fill. **Unlike Obsidian, red is
permitted here** — a light product page reads a red badge as a status, not as
blame, and the references all use one. It still isn't for a rejected item: a
discarded thing goes `--rl-faint` and stops mattering. Reserve `--rl-critical`
for a genuine failed state or destructive confirmation.

`--rl-critical` and `--rl-accent` are close enough in hue to collide if they
touch. Never put a critical badge inside an accent-marked card.

### Chart palette

Six categorical series, tuned to sit on warm grounds without any of them
reading as the accent. `--rl-series-1` through `--rl-series-6` in the token
file. Before building any chart, read the **`dataviz`** skill — it owns chart
form, palette validation and mark specs; Riley only supplies the ground,
hairline and type tokens the chart sits in.

---

## Typography

**Geist** (display, UI, body) and **Geist Mono** (metadata only). Already loaded
in this repo. No third face.

If Geist is unavailable, in order: Instrument Sans, Schibsted Grotesk, Onest.

### Scale

**Sixteen steps in four tiers, and there is no seventeenth.** A size that is not
one of these tokens is a bug — see "Closing the scale".

**Display tier** — weight 600, `--rl-tracking-display`. Headings only.

`--rl-w-bold` (700) is permitted on the `--rl-display` step **only**, and it's
a genuine coin-flip: half the reference set sets the hero bold and half sets it
semibold. Section headings are semibold in every calm reference and bold only in
the loudest one — a bold `--rl-h1` tips the page from restrained into shouty.
Pick one for the hero and use it on every page.

| Token | Value | Use |
|---|---|---|
| `--rl-display` | `clamp(44px, 5.2vw, 64px)` | Hero headline. One per page. |
| `--rl-h1` | `clamp(32px, 3.4vw, 44px)` | Section headline. |
| `--rl-h2` | `clamp(24px, 2.2vw, 32px)` | Sub-section, panel title. |
| `--rl-h3` | `20px` | Card title. |
| `--rl-lead` | `19px` | Hero subcopy and section intros only. Weight 400. |

**Text tier** — weight 400, `--rl-tracking-snug`.

| Token | Value | Use |
|---|---|---|
| `--rl-sub` | `17px` | The step between body and lead: pulled excerpt, composer, a card title too small for `--rl-h3`. |
| `--rl-body` | `16px` | Running prose. |
| `--rl-sm` | `14px` | Dense UI, buttons, table cells, secondary copy. |
| `--rl-xs` | `13px` | Figure notes, small buttons, tooltip lines. |

**Meta tier** — mono, weight 500, `+0.08em`, uppercase.

| Token | Value | Use |
|---|---|---|
| `--rl-meta` | `12px` | The layer's home size. |
| `--rl-meta-sm` | `11px` | Micro-label inside another element. |
| `--rl-meta-xs` | `10px` | Chips, citation superscripts, tags. |

The two below 12px are for labels that sit *inside* another element. Never set
a line that has to be read at 10 or 11px.

**Figure numerals** — mono, weight 500, `--rl-tracking-fig`, leading `1`. A
separate tier because a number is not a heading: mono so digits are tabular.

| Token | Value |
|---|---|
| `--rl-fig-xl` | `clamp(36px, 3.6vw, 52px)` |
| `--rl-fig-lg` | `40px` |
| `--rl-fig-md` | `30px` |
| `--rl-fig-sm` | `24px` |

### Tracking and leading

- Display: `-0.02em`, leading `1.04`.
- h1/h2: `-0.015em`, leading `1.12`.
- Body and UI: `-0.008em`, leading `1.65`.
- Mono metadata: `+0.08em`, uppercase, leading `1.4`.
- Figure numerals: `-0.01em`, leading `1`.

Two deliberate departures from a dark system, both because the ink is now dark
and the ground is now bright:

- **Tracking is roughly half as tight.** `-0.035em` on a white-on-black headline
  is confident; the same value on black-on-white closes the counters and reads
  cramped. `-0.02em` is the ceiling.
- **Body leading is looser — `1.65`, not `1.6`.** Dark text on a bright ground
  needs marginally more air to stay comfortable at length.

**Leading is seven values, same as sizes are sixteen.**
`--rl-leading-display` `1.04` · `--rl-leading-flat` `1` · `--rl-leading-tight`
`1.12` · `--rl-leading-snug` `1.3` · `--rl-leading-meta` `1.4` ·
`--rl-leading-lead` `1.5` · `--rl-leading-body` `1.65`. Nothing between them. A
1.55 or a 1.7 in a recipe is how one size ends up rendering at four different
leadings on one page — the single most common way a set of screens stops
looking like one system while every individual screen still looks fine.

### Closing the scale

A scale that lists sixteen steps and silently tolerates a seventeenth is not a
scale. Run this per route, at 1440px **and** 1280px:

```js
// In the Playwright MCP. Anything in offScale/offLead is a bug.
// Resolve tokens THROUGH THE BROWSER — four are clamp()s, so their real value
// depends on the viewport. A hardcoded list plus a tolerance band gets this
// wrong in both directions: a clamped token sitting just under its own max
// reads as off-scale, while a genuine stray 15px hides inside the band.
const TOKENS = ['--rl-display','--rl-h1','--rl-h2','--rl-h3','--rl-lead','--rl-sub',
  '--rl-body','--rl-sm','--rl-xs','--rl-meta','--rl-meta-sm','--rl-meta-xs',
  '--rl-fig-xl','--rl-fig-lg','--rl-fig-md','--rl-fig-sm'];
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden';
document.body.appendChild(probe);
const SCALE = new Set(TOKENS.map(t => {
  probe.style.fontSize = `var(${t})`;
  return +parseFloat(getComputedStyle(probe).fontSize).toFixed(2);
}));
probe.remove();

const LEAD = new Set([1, 1.04, 1.12, 1.3, 1.4, 1.5, 1.65]);
const EXEMPT = /rl-watermark/;              // your commented exceptions, if any
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
section reports whatever it inherits rather than what it will paint.

Two lessons carried in from auditing a real product built this way:

- **The overflow concentrates just below `--rl-body`.** 15px is where
  "slightly smaller than body" lands when there's no named step. `--rl-sm` and
  `--rl-xs` exist to absorb it.
- **Tailwind arbitrary values are the leak.** `text-[15px]` reads as harmless
  and bypasses the whole system. The `.rl-sub` / `.rl-sm` / `.rl-xs` recipe
  classes exist so a component always has a token-backed way to say a size.

Deliberate exceptions must be *unrepeatable and commented*. If an exception
could plausibly get a second consumer, it's a missing token, not an exception.

### The metadata layer

Mono, 12px, uppercase, `+0.08em`, `--rl-muted`. It carries ids, counts,
domains, timestamps, section labels and status. It never carries a sentence —
uppercase mono at sentence length is unreadable. If your mono string has a verb
in it, it belongs in sans.

---

## Layout and rhythm

- Container `1200px`, gutter `40px`. `--rl-container-wide` `1320px` for
  chart-bearing or four-up sections only.
- Section padding `128px` standard, `96px` for a tight pairing, never below 80.
  Deliberately tighter than a hairline system: a card-dense page carries its own
  internal whitespace, and 160px on top of that reads as a broken page rather
  than a generous one.
- Radii: `--rl-r-sm` `8px` chips · `--rl-r-md` `12px` rows and inner panels ·
  `--rl-r-lg` `16px` cards · `--rl-r-xl` `24px` large panels and hero cards ·
  `--rl-r-pill` `999px` buttons and badges only.
- **Radius decreases as you nest.** A `--rl-r-md` panel inside a `--rl-r-lg`
  card. Equal radii nested read as a mistake; a larger radius inside a smaller
  one reads as a bug.
- Grids: two-up asymmetric (`420px` + `1fr`) for explanation-plus-artifact;
  three-up for cards; four-up only for numerals or logos.
- **Bento is the house grid.** A 2-column grid where one card spans both columns
  is the default feature layout — it breaks the monotony of an even grid without
  needing a second section.

---

## Elevation — the two-shadow budget

| Token | Use |
|---|---|
| `--rl-lift` | An element that floats over another element or a photo. Stat cards over a hero image, a hovering row, an active segmented thumb. |
| `--rl-lift-panel` | An element that floats over the page: modal, popover, command palette, a hero product panel. |

Both are warm-tinted, not `rgba(0,0,0,…)` — a neutral-black shadow on warm
paper turns the paper grey at the edges and quietly undoes rule 2.

**Everything else uses a border.** Before adding a shadow, answer: *what is this
floating above?* If the answer is "nothing, it's in the grid", it gets
`--rl-line` and no shadow.

---

## Components

Recipes live in a single stylesheet (`assets/recipes.css` is paste-ready).
**Tailwind is for layout only** — flex, grid, spacing, sizing.

- **Button.** Sans, weight 500, `--rl-sm`, pill radius. *Primary:* `--rl-action`
  fill, white text; hover lightens to `--rl-action-hover`. *Secondary:*
  transparent with `--rl-line-strong` border; hover fills `--rl-linen`.
  *Link:* `--rl-accent-text` plus an arrow that translates on hover — this is
  the accent's main job and it appears beside the primary constantly.
  Exactly one primary visible per viewport. **The references disagree with that
  last clause** — two of them put a filled black CTA in the nav *and* another in
  the hero, both reading "Get started free". Keep the rule anyway: hold the
  header's CTA back until the hero's has scrolled out. Two identical primaries
  in one viewport is a real ambiguity, not a house style.
- **Eyebrow.** Two variants, and the choice is per-page not per-section.
  *Plain:* `--rl-sm`, `--rl-muted`, above the headline. *Pill:*
  `--rl-accent-wash` fill, `--rl-accent-text`, pill radius. **Never rotate the
  pill's hue per section** — the third reference does this and it's the one
  thing from it not to copy; it turns the accent into decoration.
- **Credibility badge.** An eyebrow carrying a borrowed logo — "Backed by
  <investor>", "SOC 2". Deliberately **neutral, not accent**: the claim is
  already doing its own work and tinting it spends the accent for nothing.
- **Card.** `--rl-paper` fill, `--rl-line` border, `--rl-r-lg`. The base unit.
- **Bento card.** The house unit: a `--rl-linen` panel holding a drawn UI
  fragment on top, `--rl-paper` with title and one sentence below. Sonarly's
  pattern, and the best answer to "how do I explain this without a paragraph".
- **Icon card.** The bento's sibling, for an **abstract** concept with no UI to
  draw — deliverability, compliance, uptime. One 64px line icon at 3px stroke in
  `--rl-accent`, centred in a 256px empty area, no tinted panel. The accent is
  legitimate here because it's a *mark*: 3.39:1 clears the 3.0 threshold for
  graphical objects, though it would fail as a label. Reach for the bento first
  — an icon is for when there is genuinely nothing to show.
- **Hint line.** `--rl-xs` in `--rl-muted`, directly under a CTA pair: "No card
  required", "One command to install". This is text that *earns* its place — it
  answers the objection the button just raised. Rule 8 is about useless text,
  not short text.
- **Chip.** `--rl-r-sm`, mono `--rl-meta-xs` uppercase. Neutral: `--rl-linen`
  fill, `--rl-line` border. Accent: `--rl-accent-wash` + `--rl-accent-text`.
  Semantic: the matching wash + solid pair.
- **Live dot.** 6px, `--rl-accent`, the only pulsing thing in the system.
- **Segmented control.** `--rl-linen` track, `--rl-paper` thumb with
  `--rl-lift`, pill radius. The thumb is the one place a shadow is doing
  affordance work rather than decoration.
- **Accordion row.** Bottom border only, no card — the fourth reference's FAQ
  pattern. Cards around accordion rows double the border count for nothing.
- **Input / composer.** `--rl-paper`, `--rl-line` border; focus swaps to
  `--rl-accent-line` and adds a 3px `--rl-accent-wash` ring.

Every interactive element ships hover, `:focus-visible`, active and disabled
**at build time**, not in a polish pass. Focus rings must not inherit a hover
transition — set `transition: none` in the `:focus-visible` rule.

---

## Section patterns

Compose pages from these. Each names its media obligation — see
`references/media.md`.

| Pattern | Ground | Media obligation |
|---|---|---|
| **Hero** | `--rl-paper` | A product panel with `--rl-lift-panel` and the one permitted `.rl-bloom`, or a generated still. Photography allowed here only. |
| **Logo marquee** | inherits hero | None. Edge-masked, pauses on hover, real logos only. |
| **Bento feature grid** | `--rl-canvas` | One drawn UI fragment per card. Never stock, never a screenshot. |
| **Two-up explanation** | `--rl-paper` | One artifact — chart, diagram or fragment — in the wide column. |
| **Step / journey** | `--rl-linen` | Connector-linked step cards. The connector is `--rl-line`; the active step is accent-marked. |
| **Stat row** | `--rl-paper` | None. Figure-tier numerals counting up on reveal. |
| **Pricing** | `--rl-canvas` | None. The chosen plan gets `--rl-line-ink`, not accent. |
| **FAQ** | `--rl-paper` | None. Bottom-border rows. |
| **Closing CTA** | dark band | See below. |
| **Footer** | dark band | See below. |

---

## Dark bands

Riley is a light system with **inverted bands**, not a dual-theme system. There
is no toggle and no `prefers-color-scheme` branch.

A band inverts by adding `.rl-invert`, which **remaps the same token names** to
dark values inside that subtree. Components don't know they're inverted — a
`.rl-card` looks correct in both. Never write a `.rl-card--dark`.

**Which sections earn it.** Inversion is punctuation, not decoration:

- The **closing CTA** — the page's one deliberate change of voice.
- The **footer** — anchors the page.
- **At most one** mid-page band, and only where the content is genuinely a
  different register: a testimonial wall, a "how it works" deep-dive, a
  security section.

Three or more dark bands and the page stops being a light page. Two adjacent
dark bands must merge into one.

**Provenance, because this is the one section with no reference behind it.**
None of the four reference implementations uses a dark band anywhere — their
closing CTAs are on white, on warm off-white, or in a pale gradient panel.
Inversion is here because it was asked for, and the placement above is reasoned
rather than observed. **If a dark band doesn't land, this is the first place to
ask for a reference** (rule 11) rather than iterate on a guess.

One thing the references *are* unanimous about: **the closing CTA carries almost
no text.** The tightest is a single `--rl-display` line and one button, with no
subcopy at all. Whatever ground it sits on, don't pad it.

Inside a dark band: `--rl-accent` becomes usable as text again (it clears AA on
a dark ground), so `--rl-accent-text` remaps to the brighter value. This is the
one place the accent gets to be bright.

---

## The text budget

The rule is **no useless text**, not *minimal text*. Where the situation
genuinely demands prose — an explanation, a caveat, a real argument — write it
properly and give it room. What's banned is filler: the sentence that restates
the headline, the paragraph that lists what a component beside it already shows.

Budgets, which are defaults to argue against rather than hard limits:

| Unit | Budget | If you're over it |
|---|---|---|
| Card | Title + 1 sentence | The extra sentence is usually a chip, a stat, or a row in the drawn fragment. |
| Section intro | 2 sentences | Split the section, or move the detail into the artifact. |
| Step in a journey | Title + 1 line | Steps that need paragraphs aren't steps. |
| Hero subcopy | 2 lines | Cut to the claim. |
| Long-form band | Uncapped | Genuinely explanatory content — give it a `680px` measure and `--rl-leading-body`. |

**What to reach for instead of a sentence:**

| The sentence says… | Use |
|---|---|
| "It supports X, Y and Z" | A chip row |
| "It's fast / cheap / accurate" | A figure-tier numeral with a unit and a source |
| "Here's how the flow works" | Connector-linked step cards |
| "The data shows a trend" | A chart (read `dataviz` first) |
| "The interface looks like this" | A drawn UI fragment — never a screenshot |
| "These things relate to each other" | A ring diagram or a two-column mapping |
| "This is verified / live / failed" | A chip or a live dot |

---

## Reference files

Read the one you need; don't read them all up front.

| File | Read it when |
|---|---|
| `references/light-surfaces.md` | Picking any colour pairing, or before shipping. Contrast, glare, warm-shadow tuning, and the inversion mechanics. **Light-specific and the one with no Obsidian equivalent.** |
| `references/motion.md` | Adding any animation, scroll behaviour, reveal, or transition. |
| `references/media.md` | Deciding what fills a visual area — fragment, chart, image, video, or slot. |
| `references/higgsfield.md` | Writing a generative brief, or generating/swapping real assets. |
| `references/verification.md` | Before calling any screen done. The Playwright MCP loop. |
| `references/pitfalls.md` | Something applied in the stylesheet but not on screen. Read this **first** when debugging CSS that "should work". |

`assets/tokens.css` and `assets/recipes.css` are paste-ready starting points.

---

## Setting this up in a new project

1. Paste `assets/tokens.css` into your token file, on `:root`. The
   `.rl-invert` block must come after it in the same file.
2. Paste `assets/recipes.css`. **Import it into `@layer components`**, not
   unlayered — see `references/pitfalls.md` §1. This is not optional; unlayered,
   a `.rl-card { margin: 0 }` silently beats every Tailwind spacing utility on
   the same element.
3. Load Geist + Geist Mono as CSS variables (`next/font/google` exposes both).
4. Tailwind v4 is CSS-first — do **not** re-declare colours in an `@theme`
   block. Tailwind supplies layout utilities only; every colour comes from the
   token file.
5. Check for global `@layer base` rules that hard-code an accent —
   `:focus-visible` and `::selection` are the usual offenders.
6. Grep for cool greys before you ship: `#f9fafb|#f3f4f6|#e5e7eb|gray-\d{2,3}`.
   Any hit is rule 2 broken.

---

## Checklist before calling a screen done

- [ ] No colour value outside the token file.
- [ ] Zero cool greys — grep passes.
- [ ] Every surface is one tier from what it sits on.
- [ ] Exactly one primary button visible per viewport, and it is near-black.
- [ ] Every accent thing is a link, an active/live state, or a focal point — named out loud.
- [ ] Accent *text* uses `--rl-accent-text`, never `--rl-accent`.
- [ ] `--rl-muted` does not appear on `--rl-linen` or `--rl-inset`.
- [ ] Display headline ≥ 44px at weight 600 with `-0.02em`.
- [ ] Sections separated by a ground change, not a rule.
- [ ] Every shadow names what it floats above; everything else has a border.
- [ ] Radius decreases as you nest.
- [ ] No card exceeds title + one sentence without a reason.
- [ ] Mono carries no sentences.
- [ ] At most two dark bands, non-adjacent.
- [ ] At most one `.rl-bloom`, on the hero panel.
- [ ] Any component whose shape was invented rather than specified or referenced
      is called out in the summary — not shipped silently. See rule 11.
- [ ] Every interactive element has hover, focus-visible, active, disabled.
- [ ] Focus rings snap — no transition.
- [ ] Ambient motion stops under `prefers-reduced-motion`; auto-advancing
      content resolves to a static full state, not a frozen partial one.
- [ ] Space reserved for anything that streams or arrives late.
- [ ] Read at 1440px **and** 1280px, and *measured* — type audit and contrast
      audit both clean. See `references/verification.md`.

---

## Appendix — this repo

Riley is scoped to **`experimentalFrontend/`**, which is its own Next app. It
does not apply to the existing site at the repo root.

| Thing | Where |
|---|---|
| Tokens | `experimentalFrontend/styles/tokens.css`, on `:root` |
| Recipes | `experimentalFrontend/styles/riley.css`, imported `layer(components)` |
| Components | `experimentalFrontend/components/` |
| Copy | `experimentalFrontend/lib/content/` |
| Fonts | Geist + Geist Mono in the app's `layout.tsx` |

**Arbitration with `obsidian-design`.** Obsidian owns everything at the repo
root — `app/`, `components/`, `styles/`. Riley owns `experimentalFrontend/`
entirely. They share no tokens, no stylesheets and no components; a `--ob-*`
variable inside `experimentalFrontend/` is a mistake, and so is a `--rl-*`
outside it. The product is the same, the design is not — the experimental
frontend is a ground-up redesign with new UX writing, not a re-skin, so don't
port copy across either.

**Both older systems remain superseded.** `deep-canopy-design` and
`dark-luxury-design` describe systems this repo has moved off. Fall back to
`clean-design` only for a specific pattern Riley doesn't cover, and translate
its greys to warm equivalents on the way in.
