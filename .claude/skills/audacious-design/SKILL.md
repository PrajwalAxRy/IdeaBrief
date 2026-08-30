---
name: audacious-design
description: Design and build screens in the "Audacious" style — a warm-paper light canvas carrying display type at a scale light themes usually flinch from, where surfaces step rather than divide, authority comes from size rather than weight, near-black carries every action, one warm orange marks the thing worth looking at, and product surfaces are drawn in code rather than screenshotted. Loops crossed with Sonarly and Trackit for the surfaces, crossed with Hyperstudio for the nerve. Use this for ANY work that produces visible pixels inside `experimentalFrontend/` — new pages, restyling, adding a section, picking a colour, sizing type, laying out a grid, choosing what animates, briefing an image or video, or verifying a screen in the browser. Triggers on "design", "restyle", "make it look", "light theme", "audacious", "riley", "add a section", "hero", "landing page", or any request that will produce visible pixels in the experimental frontend. Do NOT design from memory or default styling — read this first. When a component's SHAPE isn't specified here (testimonials, docks, footers, pricing tables, dashboards), ask the user for a reference implementation rather than inventing one — they prefer to supply one. SUPERSEDES riley-design, which is the ancestor of this system: same shape, timider numbers, no motion depth — do not invoke it. The dark app at the repo root is still obsidian-design.
---

# Audacious

A warm light canvas where structure comes from surfaces stepping against each
other rather than from lines dividing them, carrying display type at a scale
light themes usually flinch from. Nothing here is cool grey — every neutral
carries warmth, which is the one decision that separates this from the framework
default everybody else ships. Authority comes from **scale**, not from weight:
the headline is 92px because it is the argument, and it sits at weight 500
because at that size more ink is mass rather than emphasis. One warm orange
marks the single thing in a view worth looking at.

**References:** Loops.so (the alternating warm bands, the eyebrow-over-headline
rhythm, black CTA with an accent text link beside it) crossed with Sonarly (the
bento unit — a code-drawn UI fragment on a tinted panel, text below on white)
and Trackit (the diagram vocabulary: concentric rings, connector lines,
orbiting tiles) — and then crossed with Hyperstudio for the nerve: oversized
display type, code-drawn product surfaces instead of screenshots, sticky
scrollytelling, and an accent kept on a leash.

**The failure mode** is a generic modern SaaS page: cool Tailwind greys, a
shadow on every card, the brand colour on every button until it means nothing,
three paragraphs where a component would have said it, and 40px of type doing
the job of 92.

**The second failure mode, specific to this system**, is a page that spends its
nerve everywhere instead of once: every heading enormous, every section
animated, every card lifted. Audacity is a budget. It buys one 92px headline per
page and one mechanic that runs; spend it twice and the page reads as a template
that discovered a font-size slider.

### What changed from the ancestor system

This supersedes **riley-design** and inherits almost all of it — the warm
grounds, the measured one-step rule, the accent's three jobs, the AA analysis,
the text budget. Do not invoke `riley-design`; it is the same shape with timider
numbers. Five things are genuinely different, and each is an import from the
dark `obsidian-design` system that survived being inverted:

| | Ancestor | Here | Why |
|---|---|---|---|
| Display step | 44→64px, weight 600 | **56→92px, weight 500** | Authority is scale. Past ~72px, weight is mass, and on white it is a black slab. |
| Radii | 8/12/16/24 | **6/10/14/18** | 24px is friendly; 18px is assured. Softness is not warmth. |
| Motion | one reveal, three durations | **+ mechanic tier, + scrollytelling, + performance rules** | The ancestor named the sticky-scroll pattern and never gave a recipe. |
| Section patterns | 10, all static | **+ scrollytelling, proof mechanic, conversation, wordmark** | Four patterns that carry an argument rather than describing one. |
| Ambient | marquee + dot | **+ paper tooth** | Grain is the one atmospheric effect that gains from being on paper. |

What was deliberately **not** imported, and must not be re-litigated:
hairlines-as-layout (measured at 1.30:1 on paper — it does not work),
no-shadows-ever (the two-shadow budget is the correct light answer), per-word
mask reveals, and parallax. Each has its reasoning recorded at the point where
you would otherwise reach for it.

---

## The thirteen rules

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
   `--ad-action`. The accent marks links, active state, live state, and the one
   element in a diagram the eye should land on. **There is no accent-filled
   button** — white on `#F05A28` is 3.39:1 and cannot be made accessible.

5. **Sections separate by ground change, not by a rule.** Bands alternate
   paper ↔ canvas ↔ linen. A 1px line between two full-width sections is the
   wrong instinct here — that belongs to a different system.

6. **Weight goes DOWN as size goes up.** Display (56–92px) is weight 500;
   section heads are 600; there is no 700 anywhere. Past roughly 72px, added
   weight stops reading as emphasis and starts reading as mass — and on white it
   reads as ink, turning the headline into a slab and costing the page its
   paper. The ancestor system set display at 600 because its display topped out
   at 64px, where that is still true. It isn't true at 92.

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

10. **Audacity is a budget, and it buys exactly two things per page.** One
    `--ad-display` headline, and one mechanic that runs (§"Section patterns").
    Everything else is calm. A page where every heading is enormous and every
    section animates has spent the same nerve four times and reads as a
    template, not as a position. If a second section wants the display step,
    one of them is not the argument.

11. **Motion is ambient-and-slow or structural-and-fast, never in between**, and
    **there is one reveal recipe for everything that enters.** Ambient: 20s+,
    infinite, so subtle a screenshot can't tell. Structural: 150–320ms,
    triggered. The variety on a page comes from the content, not the
    choreography. There is no 2-second "fun" animation. See
    `references/motion.md`.

12. **Measure, don't eyeball.** A screenshot proves a thing looks right; it does
    not prove a rule applied, and on light it does not prove anyone can read it.
    Run both audits. See `references/verification.md`.

13. **When you don't know what a component should look like, ask for a
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

> Building the pricing section. Audacious specifies the card, the chosen-plan
> border and the segmented control, but not the plan-comparison layout — 3-up
> cards, a feature matrix, or cards plus a matrix below. Do you have a
> reference? Otherwise I'll do 3-up cards with `--ad-line-ink` on the
> recommended plan.

One question, one component, with a default attached. Don't batch six questions
into a wall, and don't block on the answer — build everything that doesn't
depend on it first.

### What to do with the answer

A reference is a **source to derive from, not a file to copy**. Extract the
structure — the tiers, the grid, the hierarchy, what's a chip versus a row — and
re-express it in Audacious's tokens and recipes. A pasted reference brings cool
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
| `--ad-paper` | `#FFFFFF` | Card faces, and the brighter of two alternating bands. |
| `--ad-canvas` | `#FAF9F7` | Page ground. The default. |
| `--ad-linen` | `#F4F1EB` | Tinted panel inside a card; the dimmer alternating band. |
| `--ad-inset` | `#EBE6DD` | Wells — code blocks, empty states, the deepest recess. |

These are the warm replacements for `white / gray-50 / gray-100 / gray-200`.
The warmth is small in hex and large on screen: `#FAF9F7` beside `#F9FAFB` is
obviously the warmer one the moment they share a viewport, and a page built
entirely from one or the other reads as either considered or defaulted.

### The one-step rule

An element must sit **at least one tier away** from whatever it sits on. The
reason is measurable — `--ad-line` against each ground:

| Ground | Hairline contrast |
|---|---|
| `--ad-paper` | 1.30:1 |
| `--ad-canvas` | 1.24:1 |
| `--ad-linen` | 1.15:1 |
| `--ad-inset` | **1.05:1** |

A bordered card on `--ad-inset` has no visible border. So: white card on linen,
linen panel on white, inset well inside a linen panel. Never a linen card on a
linen band with a hairline and a hope.

### Hairlines

| Token | Value | Use |
|---|---|---|
| `--ad-line` | `#E7E1D7` | Default border: cards, rows, table rules, inputs. |
| `--ad-line-strong` | `#D6CEC0` | Hover state of a bordered control. |
| `--ad-line-ink` | `#1A1714` | The one border meant to be *chosen* — the highlighted plan, the selected card. Near-black, not accent. |

### Text — four levels

| Token | Value | Worst-ground contrast | Use |
|---|---|---|---|
| `--ad-ink` | `#1A1714` | 14.36:1 | Headlines, values, anything asserted. Warm near-black, never `#000`. |
| `--ad-body` | `#57514A` | 6.30:1 | All running prose. The default body colour. |
| `--ad-muted` | `#776E64` | 4.02:1 | Secondary copy and metadata. **AA on paper and canvas only** — see below. |
| `--ad-faint` | `#8C8175` | 3.07:1 | **Never text.** Disabled controls, icon strokes, decorative rules. |

Two traps here, both specific to light themes and both the direct cause of
inaccessible "clean" pages:

- **`--ad-muted` is not universal.** It passes AA on `--ad-paper` (5.00) and
  `--ad-canvas` (4.75) and fails on `--ad-linen` (4.44) and `--ad-inset`
  (4.02). Use `--ad-body` for secondary copy on the two darker grounds.
- **Porting `--ob-muted` from a dark system is the mistake to avoid.** In
  Obsidian, grey body copy against a white headline is doing real work. Inverted
  onto light it produces grey-on-white body text that measures under 4.5:1 —
  the single most common accessibility failure in this genre. Body copy here is
  `--ad-body`, which is dark enough to read and light enough to sit below the
  headline.

### The accent — one hue, three jobs, and it is never a button

| Token | Value | Use |
|---|---|---|
| `--ad-accent` | `#F05A28` | **Marks, not text.** Live dot, active-tab rule, progress fill, chart series, the one icon tile. |
| `--ad-accent-text` | `#AE3D12` | The AA-safe variant for **any accent-coloured text or link**. 4.86:1 at worst. |
| `--ad-accent-solid` | `#C43F15` | The one fill that carries white text (5.16:1). For an accent control that genuinely must be filled — rare. |
| `--ad-accent-wash` | `#FDF0EA` | Chip and callout background. Pair with `--ad-accent-text`. |
| `--ad-accent-line` | `rgba(240,90,40,0.35)` | Border of an accent-marked object. |

**The three jobs: link, active/live, focal point.** If you can't name which one
a warm-orange thing is doing, it shouldn't be warm orange.

**Why there is no accent button.** White on `--ad-accent` is **3.39:1** — below
AA for any text size. Darkening the fill until white passes lands on
`--ad-accent-solid`, which is muddy at button scale and competes with
`--ad-action` for the same meaning. Both the palette and all three references
independently arrive at the same answer: the button is black, and the accent
sits beside it as a text link.

### Action

| Token | Value | Use |
|---|---|---|
| `--ad-action` | `#1A1714` | Primary button fill. 17.85:1 with white. |
| `--ad-action-hover` | `#332D27` | Hover. Lightens — on light grounds, a black control hovering *lighter* reads as pressed-ready; darkening reads as dead. |
| `--ad-on-action` | `#FFFFFF` | Text on the above. |

### Semantic — four, and they are not the accent

| Token | Value | Wash | Worst-ground |
|---|---|---|---|
| `--ad-positive` | `#1A6B42` | `#E8F4ED` | 5.24:1 |
| `--ad-caution` | `#7E5205` | `#FDF3E2` | 5.46:1 |
| `--ad-critical` | `#B32D1B` | `#FBEDEA` | 5.11:1 |
| `--ad-info` | `#1B559A` | `#E8F0FA` | 6.01:1 |

All four carry white text on their solid fill. **Unlike Obsidian, red is
permitted here** — a light product page reads a red badge as a status, not as
blame, and the references all use one. It still isn't for a rejected item: a
discarded thing goes `--ad-faint` and stops mattering. Reserve `--ad-critical`
for a genuine failed state or destructive confirmation.

`--ad-critical` and `--ad-accent` are close enough in hue to collide if they
touch. Never put a critical badge inside an accent-marked card.

### Chart palette

Six categorical series, tuned to sit on warm grounds without any of them
reading as the accent. `--ad-series-1` through `--ad-series-6` in the token
file. Before building any chart, read the **`dataviz`** skill — it owns chart
form, palette validation and mark specs; Audacious only supplies the ground,
hairline and type tokens the chart sits in.

---

## Typography

**Geist** (display, UI, body) and **Geist Mono** (metadata only). Already loaded
in this repo. No third face.

If Geist is unavailable, in order: Instrument Sans, Schibsted Grotesk, Onest.

### Scale

**Sixteen steps in four tiers, and there is no seventeenth.** A size that is not
one of these tokens is a bug — see "Closing the scale".

**Display tier** — headings only, and **weight is a function of size** (rule 6).

| Token | Value | Weight | Tracking | Use |
|---|---|---|---|---|
| `--ad-display` | `clamp(56px, 6.6vw, 92px)` | **500** | `-0.024em` | Hero headline. One per page. |
| `--ad-h1` | `clamp(38px, 4.2vw, 58px)` | 600 | `-0.015em` | Section headline. |
| `--ad-h2` | `clamp(26px, 2.6vw, 38px)` | 600 | `-0.015em` | Sub-section, panel title. |
| `--ad-h3` | `22px` | 600 | `-0.008em` | Card title. |
| `--ad-lead` | `20px` | 400 | `-0.008em` | Hero subcopy and section intros only. |

**There is no 700.** The ancestor system permitted bold on the hero because its
hero topped out at 64px, where bold still reads as emphasis. At 92px it reads as
a banner ad. If a headline isn't carrying the page, the fix is a shorter
headline, never a heavier one.

**When display type reads too light on paper — and it will, the first time —
weight 600 is the wrong fix.** In order: (1) confirm
`-webkit-font-smoothing` is **not** `antialiased`; it is a dark-theme
correction for the optical bloom of light-on-dark, and on paper it just renders
glyphs under-baked. Most Next/Tailwind starters ship it on `<body>`.
(2) Go bigger. (3) Track tighter, to the `-0.024em` ceiling. Only then
reconsider the copy. `recipes.css` §0 sets smoothing back to `auto`; make sure
nothing unlayered beats it.

Note the display step is the **only** place the scale grew. Everything below it
moved by 1–2px or not at all, because the ambition belongs in one place —
inflating the whole scale produces a page that shouts evenly and therefore says
nothing (rule 10).

**Text tier** — weight 400, `--ad-tracking-snug`.

| Token | Value | Use |
|---|---|---|
| `--ad-sub` | `17px` | The step between body and lead: pulled excerpt, composer, a card title too small for `--ad-h3`. |
| `--ad-body-size` | `16px` | Running prose. **Note the name** — `--ad-body` is the body *colour*; the size token carries the `-size` suffix. Getting these two crossed silently voids whichever declaration you used it in. |
| `--ad-sm` | `14px` | Dense UI, buttons, table cells, secondary copy. |
| `--ad-xs` | `13px` | Figure notes, small buttons, tooltip lines. |

**Meta tier** — mono, weight 500, `+0.08em`, uppercase.

| Token | Value | Use |
|---|---|---|
| `--ad-meta` | `12px` | The layer's home size. |
| `--ad-meta-sm` | `11px` | Micro-label inside another element. |
| `--ad-meta-xs` | `10px` | Chips, citation superscripts, tags. |

The two below 12px are for labels that sit *inside* another element. Never set
a line that has to be read at 10 or 11px.

**Figure numerals** — mono, weight 500, `--ad-tracking-fig`, leading `1`. A
separate tier because a number is not a heading: mono so digits are tabular.

| Token | Value |
|---|---|
| `--ad-fig-xl` | `clamp(36px, 3.6vw, 52px)` |
| `--ad-fig-lg` | `40px` |
| `--ad-fig-md` | `30px` |
| `--ad-fig-sm` | `24px` |

### Tracking and leading

- Display: `-0.024em`, leading `1.04`.
- h1/h2: `-0.015em`, leading `1.12`.
- Body and UI: `-0.008em`, leading `1.65`.
- Mono metadata: `+0.08em`, uppercase, leading `1.4`.
- Figure numerals: `-0.01em`, leading `1`.

Two deliberate departures from a dark system, both because the ink is now dark
and the ground is now bright:

- **Tracking is far looser.** `-0.035em` on a white-on-black headline is
  confident; the same value on black-on-white closes the counters and reads
  cramped. But the ceiling is a function of **size**, not of ground — which is
  where this parts company with the ancestor system's flat `-0.02em`. At 92px a
  counter is enormous in absolute terms and `-0.024em` reads as intent; at 38px
  the same value reads as cramped. Hence two values, and **`-0.024em` is
  permitted on `--ad-display` only.** Applying it to h1 or h2 is the exact
  mistake the flat ceiling existed to prevent.
- **Body leading is looser — `1.65`, not `1.6`.** Dark text on a bright ground
  needs marginally more air to stay comfortable at length.

**Leading is seven values, same as sizes are sixteen.**
`--ad-leading-display` `1.04` · `--ad-leading-flat` `1` · `--ad-leading-tight`
`1.12` · `--ad-leading-snug` `1.3` · `--ad-leading-meta` `1.4` ·
`--ad-leading-lead` `1.5` · `--ad-leading-body` `1.65`. Nothing between them. A
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
const TOKENS = ['--ad-display','--ad-h1','--ad-h2','--ad-h3','--ad-lead','--ad-sub',
  '--ad-body-size','--ad-sm','--ad-xs','--ad-meta','--ad-meta-sm','--ad-meta-xs',
  '--ad-fig-xl','--ad-fig-lg','--ad-fig-md','--ad-fig-sm'];
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden';
document.body.appendChild(probe);
const SCALE = new Set(TOKENS.map(t => {
  probe.style.fontSize = `var(${t})`;
  return +parseFloat(getComputedStyle(probe).fontSize).toFixed(2);
}));
probe.remove();

const LEAD = new Set([1, 1.04, 1.12, 1.3, 1.4, 1.5, 1.65]);
const EXEMPT = /ad-watermark/;              // your commented exceptions, if any
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

- **The overflow concentrates just below `--ad-body`.** 15px is where
  "slightly smaller than body" lands when there's no named step. `--ad-sm` and
  `--ad-xs` exist to absorb it.
- **Tailwind arbitrary values are the leak.** `text-[15px]` reads as harmless
  and bypasses the whole system. The `.ad-sub` / `.ad-sm` / `.ad-xs` recipe
  classes exist so a component always has a token-backed way to say a size.

Deliberate exceptions must be *unrepeatable and commented*. If an exception
could plausibly get a second consumer, it's a missing token, not an exception.

### The metadata layer

Mono, 12px, uppercase, `+0.08em`, `--ad-muted`. It carries ids, counts,
domains, timestamps, section labels and status. It never carries a sentence —
uppercase mono at sentence length is unreadable. If your mono string has a verb
in it, it belongs in sans.

---

## Layout and rhythm

- Container `1200px`, gutter `40px`. `--ad-container-wide` `1320px` for
  chart-bearing or four-up sections only.
- Section padding `128px` standard, `96px` for a tight pairing, never below 80.
  Deliberately tighter than a hairline system: a card-dense page carries its own
  internal whitespace, and 160px on top of that reads as a broken page rather
  than a generous one. **One exception**, `--ad-section-wide` `160px`, for a
  section carrying a `--ad-display` headline and almost nothing else — the hero
  and the closing CTA. A 92px line needs room or the scale reads as an accident.
  It is an exception the display step earned, not a repeal of the rule.
- Radii: `--ad-r-sm` `6px` chips · `--ad-r-md` `10px` rows and inner panels ·
  `--ad-r-lg` `14px` cards · `--ad-r-xl` `18px` large panels and hero cards ·
  `--ad-r-pill` `999px` buttons and badges only. **Tightened one notch from the
  ancestor system**: 24px on a card is friendly, 18px is assured, and the
  difference between those two words is most of what separates this from the
  SaaS default. Softness is not warmth — the warmth is already in the grounds,
  and doubling it in the geometry reads as a product apologising for itself.
- **Radius decreases as you nest.** A `--ad-r-md` panel inside a `--ad-r-lg`
  card. Equal radii nested read as a mistake; a larger radius inside a smaller
  one reads as a bug.
- Grids: two-up asymmetric (`420px` + `1fr`) for explanation-plus-artifact;
  three-up for cards; four-up only for numerals or logos.
- **Bento is the house grid.** A 2-column grid where one card spans both columns
  is the default feature layout — it breaks the monotony of an even grid without
  needing a second section.
- **Sticky scrollytelling is the house layout for 2–4 sequential ideas.** A
  sticky `400px` left column, a normally scrolling right column, and an observer
  band across the viewport middle deciding which panel is live. It gives the
  "pinned" feel **without ever taking the scrollbar from the reader**, which is
  why it is here instead of scroll-snap or scroll-jacking. The ancestor system
  named this pattern in a single line and never gave a recipe; there is now one
  — `recipes.css` §18 and `references/motion.md` §6a.

---

## Elevation — the two-shadow budget

| Token | Use |
|---|---|
| `--ad-lift` | An element that floats over another element or a photo. Stat cards over a hero image, a hovering row, an active segmented thumb. |
| `--ad-lift-panel` | An element that floats over the page: modal, popover, command palette, a hero product panel. |

Both are warm-tinted, not `rgba(0,0,0,…)` — a neutral-black shadow on warm
paper turns the paper grey at the edges and quietly undoes rule 2.

**Everything else uses a border.** Before adding a shadow, answer: *what is this
floating above?* If the answer is "nothing, it's in the grid", it gets
`--ad-line` and no shadow.

---

## Components

Recipes live in a single stylesheet (`assets/recipes.css` is paste-ready).
**Tailwind is for layout only** — flex, grid, spacing, sizing.

- **Button.** Sans, weight 500, `--ad-sm`, pill radius. *Primary:* `--ad-action`
  fill, white text; hover lightens to `--ad-action-hover`. *Secondary:*
  transparent with `--ad-line-strong` border; hover fills `--ad-linen`.
  *Link:* `--ad-accent-text` plus an arrow that translates on hover — this is
  the accent's main job and it appears beside the primary constantly.
  Exactly one primary visible per viewport. **The references disagree with that
  last clause** — two of them put a filled black CTA in the nav *and* another in
  the hero, both reading "Get started free". Keep the rule anyway: hold the
  header's CTA back until the hero's has scrolled out. Two identical primaries
  in one viewport is a real ambiguity, not a house style.
- **Eyebrow.** Two variants, and the choice is per-page not per-section.
  *Plain:* `--ad-sm`, `--ad-muted`, above the headline. *Pill:*
  `--ad-accent-wash` fill, `--ad-accent-text`, pill radius. **Never rotate the
  pill's hue per section** — the third reference does this and it's the one
  thing from it not to copy; it turns the accent into decoration.
- **Credibility badge.** An eyebrow carrying a borrowed logo — "Backed by
  <investor>", "SOC 2". Deliberately **neutral, not accent**: the claim is
  already doing its own work and tinting it spends the accent for nothing.
- **Card.** `--ad-paper` fill, `--ad-line` border, `--ad-r-lg`. The base unit.
- **Bento card.** The house unit: a `--ad-linen` panel holding a drawn UI
  fragment on top, `--ad-paper` with title and one sentence below. Sonarly's
  pattern, and the best answer to "how do I explain this without a paragraph".
- **Icon card.** The bento's sibling, for an **abstract** concept with no UI to
  draw — deliverability, compliance, uptime. One 64px line icon at 3px stroke in
  `--ad-accent`, centred in a 256px empty area, no tinted panel. The accent is
  legitimate here because it's a *mark*: 3.39:1 clears the 3.0 threshold for
  graphical objects, though it would fail as a label. Reach for the bento first
  — an icon is for when there is genuinely nothing to show.
- **Hint line.** `--ad-xs` in `--ad-muted`, directly under a CTA pair: "No card
  required", "One command to install". This is text that *earns* its place — it
  answers the objection the button just raised. Rule 8 is about useless text,
  not short text.
- **Chip.** `--ad-r-sm`, mono `--ad-meta-xs` uppercase. Neutral: `--ad-linen`
  fill, `--ad-line` border. Accent: `--ad-accent-wash` + `--ad-accent-text`.
  Semantic: the matching wash + solid pair.
- **Live dot.** 6px, `--ad-accent`, the only pulsing thing in the system.
- **Segmented control.** `--ad-linen` track, `--ad-paper` thumb with
  `--ad-lift`, pill radius. The thumb is the one place a shadow is doing
  affordance work rather than decoration.
- **Accordion row.** Bottom border only, no card — the fourth reference's FAQ
  pattern. Cards around accordion rows double the border count for nothing.
- **Input / composer.** `--ad-paper`, `--ad-line` border; focus swaps to
  `--ad-accent-line` and adds a 3px `--ad-accent-wash` ring.
- **Section numeral.** `01`, `02` — mono `--ad-meta`, uppercase, tabular,
  `--ad-muted`, sitting above or beside a section head. **Never the accent.** A
  numeral is an index, not an action, a verification or a live state; tinting
  one spends the accent on wayfinding that greyscale already handles. This is
  the single most common way a one-hue system leaks into a two-hue system.
- **Scrollytelling rail.** The sticky column's index. Ticks are **real
  `<button>`s** that scroll their panel into view with `block: 'center'` — a
  rail the reader can see but not use is decoration pretending to be
  navigation. The active tick's top border goes `--ad-accent` (job 2, active
  state); its label goes `--ad-ink`, not accent, because a coloured label would
  need `--ad-accent-text` and would compete with the panel it points at.
- **Footer wordmark.** An oversized stroke-only wordmark as the page's closing
  graphic — `-webkit-text-stroke: 1px --ad-line-strong` over a transparent
  fill, sized so the baseline clips against the footer edge. Stroke, not fill:
  at this size a filled wordmark is a black slab and reads as an error state,
  while an outline reads as a watermark pressed into the paper. This is a
  **deliberate off-scale exception** and is exempted by name in the type audit;
  it must stay unrepeatable. A second consumer means a missing token.

Every interactive element ships hover, `:focus-visible`, active and disabled
**at build time**, not in a polish pass. Focus rings must not inherit a hover
transition — set `transition: none` in the `:focus-visible` rule.

---

## Section patterns

Compose pages from these. Each names its media obligation — see
`references/media.md`.

| Pattern | Ground | Media obligation |
|---|---|---|
| **Hero** | `--ad-paper` | A product panel with `--ad-lift-panel` and the one permitted `.ad-bloom`, or a generated still. Photography allowed here only. Carries the page's one `--ad-display` line and `--ad-section-wide`. |
| **Logo marquee** | inherits hero | None. Edge-masked, pauses on hover, real logos only. Must carry real information — a strip of adjectives is filler and reads as one. |
| **Bento feature grid** | `--ad-canvas` | One drawn UI fragment per card. Never stock, never a screenshot. |
| **Scrollytelling pillars** | `--ad-paper` | One drawn UI fragment per panel. For 2–4 sequential ideas — the alternative to four stacked two-up sections that all look the same. |
| **Proof / mechanic** | `--ad-linen` | **A live DOM animation of the thing being claimed. Never a video of it, never a screenshot of it having happened.** The page's one mechanic (rule 10). |
| **Conversation band** | `--ad-canvas` | None — the transcript and the composer *are* the visual. Reserve the finished transcript's height so the composer never moves. |
| **Two-up explanation** | `--ad-paper` | One artifact — chart, diagram or fragment — in the wide column. |
| **Step / journey** | `--ad-linen` | Connector-linked step cards. The connector is `--ad-line`; the active step is accent-marked. |
| **Stat row** | `--ad-paper` | None. Figure-tier numerals counting up on reveal. |
| **Pricing** | `--ad-canvas` | None. The chosen plan gets `--ad-line-ink`, not accent. |
| **FAQ** | `--ad-paper` | None. Bottom-border rows. |
| **Closing CTA** | dark band | See below. `--ad-section-wide`, almost no text. |
| **Footer** | dark band | The stroke-only wordmark as the closing graphic. |

**On the proof/mechanic pattern**, which is the most valuable import here and
the easiest to get wrong: a section claiming "we check every source" is served
far better by a check visibly running than by a sentence beside a screenshot of
a check that already ran. Two non-negotiables — **show the failure** (a demo
where everything passes proves nothing; the discarded case *is* the argument),
and **reserve the space** for every state so nothing shifts as the sequence
advances. `references/motion.md` §7a has the state machine. The discarded state
goes `--ad-faint`, never `--ad-critical`: a rejected item is a non-event, not
the user's fault.

---

## Dark bands

Audacious is a light system with **inverted bands**, not a dual-theme system. There
is no toggle and no `prefers-color-scheme` branch.

A band inverts by adding `.ad-invert`, which **remaps the same token names** to
dark values inside that subtree. Components don't know they're inverted — a
`.ad-card` looks correct in both. Never write a `.ad-card--dark`.

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
ask for a reference** (rule 13) rather than iterate on a guess.

One thing the references *are* unanimous about: **the closing CTA carries almost
no text.** The tightest is a single `--ad-display` line and one button, with no
subcopy at all. Whatever ground it sits on, don't pad it.

Inside a dark band: `--ad-accent` becomes usable as text again (it clears AA on
a dark ground), so `--ad-accent-text` remaps to the brighter value. This is the
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
| Long-form band | Uncapped | Genuinely explanatory content — give it a `680px` measure and `--ad-leading-body`. |

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
   `.ad-invert` block must come after it in the same file.
2. Paste `assets/recipes.css`. **Import it into `@layer components`**, not
   unlayered — see `references/pitfalls.md` §1. This is not optional; unlayered,
   a `.ad-card { margin: 0 }` silently beats every Tailwind spacing utility on
   the same element.
3. Load Geist + Geist Mono as CSS variables (`next/font/google` exposes both).
4. Tailwind v4 is CSS-first — do **not** re-declare colours in an `@theme`
   block. Tailwind supplies layout utilities only; every colour comes from the
   token file.
5. Check for global `@layer base` rules that hard-code an accent —
   `:focus-visible` and `::selection` are the usual offenders.
6. **Remove `-webkit-font-smoothing: antialiased`.** Most Next/Tailwind
   starters ship the `antialiased` class on `<body>`. It is a dark-theme
   correction and it thins weight-500 display type on paper — `recipes.css` §0
   sets it back to `auto`, but a class on `<body>` still wins. This is the
   single most likely reason a page built correctly still looks washed out.
7. Set `color-scheme: light` on the root, so form controls, scrollbars and
   `<select>` popups don't render from the UA's dark palette against the paper.
   `recipes.css` §0 does this too; make sure nothing unlayered beats it.
8. Grep for cool greys before you ship: `#f9fafb|#f3f4f6|#e5e7eb|gray-\d{2,3}`.
   Any hit is rule 2 broken. The grep only catches *literals* — for computed
   values, sample a few rendered borders and confirm **R > G > B** on each. A
   cool grey that arrived through a Tailwind class or a UA default is invisible
   to the grep and obvious to that check.

---

## Checklist before calling a screen done

- [ ] No colour value outside the token file.
- [ ] Zero cool greys — grep passes, **and** sampled borders are R > G > B.
- [ ] Every surface is one tier from what it sits on.
- [ ] Exactly one primary button visible per viewport, and it is near-black.
- [ ] Every accent thing is a link, an active/live state, or a focal point — named out loud.
- [ ] Accent *text* uses `--ad-accent-text`, never `--ad-accent`.
- [ ] Section numerals are **not** accent.
- [ ] `--ad-muted` does not appear on `--ad-linen` or `--ad-inset`.
- [ ] Exactly **one** `--ad-display` headline on the page, at weight 500 with
      `-0.024em`, and `-0.024em` appears nowhere else.
- [ ] `-webkit-font-smoothing` is not `antialiased` — check the computed value
      on `<body>`, not just the stylesheet.
- [ ] Exactly **one** mechanic runs on the page, and it shows its failure case.
- [ ] Sections separated by a ground change, not a rule.
- [ ] Every shadow names what it floats above; everything else has a border.
- [ ] Radius decreases as you nest.
- [ ] No card exceeds title + one sentence without a reason.
- [ ] Mono carries no sentences.
- [ ] At most two dark bands, non-adjacent.
- [ ] At most one `.ad-bloom`, on the hero panel.
- [ ] Any component whose shape was invented rather than specified or referenced
      is called out in the summary — not shipped silently. See rule 13.
- [ ] Every interactive element has hover, focus-visible, active, disabled.
- [ ] Focus rings snap — no transition.
- [ ] Ambient motion stops under `prefers-reduced-motion`; auto-advancing
      content resolves to a static full state, not a frozen partial one.
- [ ] Space reserved for anything that streams or arrives late.
- [ ] Read at 1440px **and** 1280px, and *measured* — type audit and contrast
      audit both clean. See `references/verification.md`.

---

## Appendix — this repo

**Nothing in this repo renders Audacious yet, and `experimentalFrontend/` is an
empty directory.** No `--ad-*`, `--rl-*` or `--au-*` token appears anywhere
outside `.claude/skills/`. The ancestor system was specified in full and never
built, which is worth knowing for two reasons: there is **zero migration cost**
to adopting this instead of it, and every number in this file is reasoned rather
than shipped — none of it has survived contact with a real page.

The intended home is `experimentalFrontend/`, its own Next app:

| Thing | Where |
|---|---|
| Tokens | `experimentalFrontend/styles/tokens.css`, on `:root` |
| Recipes | `experimentalFrontend/styles/audacious.css`, imported `layer(components)` |
| Components | `experimentalFrontend/components/` |
| Copy | `experimentalFrontend/lib/content/` |
| Fonts | Geist + Geist Mono in the app's `layout.tsx` |

**Arbitration.** Obsidian owns everything at the repo root — `app/`,
`components/`, `styles/` — globally, on `:root`, with no `data-theme` attribute
anywhere. Audacious owns `experimentalFrontend/`. They share no tokens, no
stylesheets and no components; a `--ob-*` variable inside
`experimentalFrontend/` is a mistake, and so is a `--ad-*` outside it.

**If Audacious is ever adopted at the repo root**, it cannot arrive as a second
`:root` block — Obsidian holds that, and a second one wins by source order and
restyles the entire dark app. It has to be scoped to a wrapper. Every failure
from letting the two meet in one subtree is silent: an Obsidian recipe inside an
Audacious wrapper resolves its own tokens happily and paints near-black text on
near-black paper with no error anywhere.

**`riley-design` is the direct ancestor and is superseded.** Do not invoke it.
It is the same system with a 64px display ceiling, weight-600 display, softer
radii, and no motion depth beyond a single reveal. Everything good in it is
here.

**`audacity_obs` is a sibling, not an ancestor, and the two are alternatives.**
It answers the same question — "what does this product look like on light?" —
from the opposite direction: it inverts Obsidian onto warm paper and keeps
Obsidian's laws intact, so hairlines carve the layout, there are no shadows at
all, and display type is weight 400 at up to 104px. Audacious keeps *Riley's*
laws, so surfaces step instead of ruling, two earned shadows exist, and display
is weight 500 at 92px.

They contradict each other on two measured points, and the disagreement is real
rather than cosmetic:

| | Audacious | `audacity_obs` |
|---|---|---|
| Section separation | Ground change. A hairline on paper measures 1.24–1.30:1 and cannot carry a layout. | A 1px rule, always. Background bands are banned. |
| Elevation | Two earned shadows, warm-tinted. | None, ever — border and surface step only. |

**Pick one per surface and do not blend them.** A page with both ground-change
bands and section rules reads as two systems arguing, which is worse than
either. If `audacity_obs` is chosen for a surface, use that skill and its
`--au-*` tokens wholesale.

Three things from `audacity_obs` are *not* in dispute and have been folded in
here, because they are facts about light grounds rather than positions:
`-webkit-font-smoothing: antialiased` thinning type on paper, accent fills
needing to **deepen** rather than brighten on hover, and translucent alphas
reading far stronger over paper than over near-black.

**Both older systems remain superseded.** `deep-canopy-design` and
`dark-luxury-design` describe systems this repo has moved off. Fall back to
`clean-design` only for a specific pattern Audacious doesn't cover, and translate
its greys to warm equivalents on the way in.
