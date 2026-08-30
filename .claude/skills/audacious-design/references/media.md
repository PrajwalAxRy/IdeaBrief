# Media & imagery

The rule that decides everything else: **never ship a visual area that isn't
accounted for.** A blank div is a bug.

This file matters more here than in a text-led system, because Audacious's text
budget pushes explanation *out* of prose and *into* the visual area. Rule 8 says
a card gets one sentence; that only works if whatever sits above the sentence is
carrying real weight.

---

## 1. The decision tree

For any visual area, work down this list and stop at the first `yes`.

**1. Is it showing your own product?** → **Draw it in code.** Not a screenshot,
not a mockup, not a video of it. See §2.

**2. Is it data — a quantity, a distribution, a change over time?** → **A
chart.** Read the `dataviz` skill first; Audacious supplies the ground, hairline and
type tokens, `dataviz` owns the chart form and mark specs. Series colours are
`--ad-series-1` … `-6`. See §3.

**3. Is it a relationship, a sequence, or a structure?** → **A diagram in code.**
Connector-linked step cards, a ring of orbiting tiles, a two-column mapping. The
vocabulary is in §4.

**4. Is it an abstract capability with no interface to show** — deliverability,
compliance, uptime? → **One 64px line icon** at 3px stroke in `--ad-accent`,
centred in an empty area (`.ad-card-icon`). Reach for this only after 1–3 have
genuinely failed: if the concept *has* an interface, draw the interface.

**5. Is the subject genuinely human or physical** — a person, a place, a
material? → **Photography or a generated still is permitted**, under the
treatment rules in §5. This is a narrow door: the hero and the occasional
editorial band. It is not a licence for decorative stock.

**6. None of the above, and you can't make it right now?** → **A labelled slot**
carrying its art-direction brief. See §7.

There is no seventh option.

Note what's missing: there's no "abstract decorative graphic" branch. A blurred
gradient orb is what a page reaches for when nobody decided what the area is
for. The single exception is `.ad-bloom` — a static warm glow **tethered to the
hero product panel**, one per page. Containment is the whole distinction: a
gradient bound to a panel reads as the product emitting light; the same gradient
floating free reads as an undecided area with the lights turned up.

**And if none of the six fits, ask for a reference** (SKILL.md rule 13) before
inventing a seventh. That's cheaper than building the wrong thing.

---

## 2. Product surfaces are drawn in code

**A screenshot of your own UI is always worse than that UI rendered as markup.**
It's blurrier, it can't use your tokens, it goes stale the moment the product
changes, it doesn't respond to the viewport, and no screen reader can read it.
It also *looks* like a screenshot, which reads as a slide deck.

So: build the fragment. It goes in `.ad-bento__visual`, on `--ad-linen`, and it
uses the same chips, rows and type scale as the real product.

```
┌───────────────────────────────────────────────┐
│ ░░ .ad-bento__visual — on --ad-linen ░░░░░░░░ │
│                                               │
│   ┌─ .ad-row ────────────────────────────┐   │
│   │ ◆ Crunchbase        [ VERIFIED ]     │   │  ← real chip component
│   └──────────────────────────────────────┘   │
│   ┌─ .ad-row ────────────────────────────┐   │
│   │ ◆ Forum thread      [ THIN ]         │   │
│   └──────────────────────────────────────┘   │
│   ┌─ .ad-row ────────────────────────────┐   │
│   │ ~~◆ Vendor blog~~   [ DISCARDED ]    │   │  ← .ad-discarded, goes faint
│   └──────────────────────────────────────┘   │
├───────────────────────────────────────────────┤
│  Every source is checked                      │  ← .ad-h3
│  Three of eleven didn't survive.              │  ← one sentence. That's the budget.
└───────────────────────────────────────────────┘
```

**Make the fragment argue for the product.** Choose the content so it
demonstrates something specific:

- A brief with two fields visibly marked `UNKNOWN` proves "nothing is invented
  to fill a field" better than any sentence about it.
- An evidence list where one row is struck through and marked `DISCARDED`
  proves the verification claim, and does it in the system's own idiom — a
  rejected thing goes `--ad-faint` and stops mattering.
- A roadmap phase with a visible tripwire proves the product has opinions.

A fragment showing a happy path with no tension is decoration. A fragment
showing the product's actual character is the argument.

**These fragments stay server components.** Static markup; nothing about them
needs to be interactive.

**One exception worth knowing about:** a *live DOM animation* of the thing being
claimed beats a video of it, because the visitor can watch it actually happen.
If you build one, write it down in the media plan as "do not replace" — someone
will otherwise try to "upgrade" it to a clip later.

---

## 3. Charts

Read the **`dataviz`** skill before writing the first line of chart code. It
owns form selection, palette validation, mark specs and interaction. Audacious only
supplies the frame.

What Audacious contributes:

- Ground: the chart sits on `--ad-paper` or inside a `.ad-panel`.
- Gridlines: `--ad-line`. Axis labels: `.ad-meta`, so they join the metadata
  layer rather than inventing a fourth type treatment.
- Series: `--ad-series-1` … `--ad-series-6`. Series 1 is the accent on purpose —
  in a chart, the primary series *is* the focal point, which is one of the
  accent's three jobs.
- Numerals: the figure tier, mono and tabular, so digits align in a column.

Two Audacious-specific cautions:

- **Don't put a `--ad-critical` mark inside an accent-marked chart.** The two
  hues are close enough to collide and the status stops reading as a status.
- **Every figure needs a source.** `.ad-stat__source` exists for this. A number
  without a receipt is the thing this product exists to argue against.

---

## 4. Diagram vocabulary

Four shapes, all drawn in code, all lifted from the references. These are what
replace "here's how it works" as a paragraph.

| Shape | For | Recipe |
|---|---|---|
| **Connector-linked steps** | A sequence. 3–5 items. | `.ad-steps` — the connector is a hairline on the *container*, behind the cards. A per-card connector overhangs the last one. |
| **Ring of orbiting tiles** | Many things connecting to one thing — integrations, sources. | Concentric `--ad-line` circles, tiles positioned by `cos/sin` at a fixed radius, centre logo on `--ad-paper` with `--ad-lift`. |
| **Two-column mapping** | A before/after, or an input/output. | Two `.ad-panel`s with an arrow between. Resist labelling both columns — the shape says it. |
| **Vertical rolling list** | One item at a time out of many. | Fade masks top and bottom, active item at full opacity, neighbours at 0.4 and 0.15. |

The rolling list is the one to use sparingly — it's auto-advancing content, so
it needs the `prefers-reduced-motion` branch that renders all items stacked
(`motion.md` §6).

---

## 5. Photography, and how it must be treated on a light ground

**Every instinct from a dark system inverts here.** This is the section most
likely to be got wrong by analogy.

| Constraint | Why |
|---|---|
| **Scrims go light, not dark.** A white or `--ad-paper` veil at 60–80%, with `--ad-ink` text over it. | A dark scrim plus white text is a dark-theme move and reads as a foreign object dropped into the page. |
| **Near-monochrome, warm-biased.** Desaturate to ~30–40%, then warm slightly. | One hue exists and it means link / active / focal. A cool blue sky competes with the accent *and* breaks rule 2. |
| **A dark image punches a hole.** | On dark grounds an image blends; here it becomes the heaviest object on screen whether or not it's the subject. Either commit to it as the focal point or lighten it until it recedes. |
| **Every image gets a hairline and a radius.** `--ad-line` at `--ad-r-lg`. | A full-bleed photo with a hard edge against warm paper looks unfinished. The opposite of the dark-system instinct, where a border reads as a frame nobody asked for. |
| **No text in frame.** | Generated text is garbage at any size; real text fights the headline. |
| **No faces in sharp focus.** | Faces pull the eye off the headline. Backs of heads, hands, out-of-focus figures are fine. |

The light-scrim recipe:

```css
.ad-photo { position: relative; overflow: hidden; border-radius: var(--ad-r-lg); }
.ad-photo img { filter: grayscale(0.35) contrast(0.96) brightness(1.06); }
.ad-photo::after {
  content: ''; position: absolute; inset: 0;
  background:
    linear-gradient(to right, var(--ad-paper) 0%, rgba(255,255,255,0.55) 46%, transparent 72%);
}
```

The gradient direction follows the text: if the headline sits left, the scrim is
strongest left. A uniform scrim washes the whole image out for no benefit.

Contrast-check text over any image with the `light-surfaces.md` §1 script
**after the image loads**. The script walks up to the nearest non-transparent
background and will report the scrim rather than the photograph, so check the
rendered result visually too, at both widths.

---

## 6. Video

Permitted for a hero product panel and for the occasional feature card, which is
what all three references do. Rules:

- **Muted, looped, `playsInline`, `autoPlay`** — and a `poster` that is a real
  frame, so the card never flashes empty.
- **Reserve the exact aspect ratio** so filling it causes zero layout shift.
- **Under `prefers-reduced-motion`, show the poster and don't autoplay.**
- **A video of your own UI is still a screenshot.** It's subject to §2 — draw
  it, or capture the real running app in motion (see `higgsfield.md` §6), but
  don't render a mockup and film it.

---

## 7. Slots, for what you can't make yet

When a position genuinely needs an asset that doesn't exist, author the
**absence** rather than leaving a gap.

A slot is a correctly-sized, visibly-labelled frame stating on screen exactly
what belongs there: kind, aspect ratio, subject, treatment, motion, duration and
destination path.

```jsx
<MediaSlot
  ratio="16/9"
  kind="video"
  label="HERO / PRODUCT PANEL"
  brief="The run console mid-stream: rows arriving, one marked DISCARDED. Warm-paper ground, near-monochrome, no legible body text. Middle third stays quiet — the headline sits over it."
  source="10s seamless loop, 1920×1080, MP4 + WebM + poster. → public/media/hero/panel.*"
/>
```

Rules:

- **The brief is written for whoever fills it** — a person or a generator. Be
  specific about subject, treatment, crop, motion, duration and destination. "A
  nice abstract image" is not a brief.
- **Name colours in words** ("warm paper", "near-black"), never as hex, so the
  brief survives a token change.
- **Reserve the exact final height.** Filling a slot must cause zero layout
  shift.
- **A slot must look deliberate, not broken.** On `--ad-linen`, with a dashed
  `--ad-line-strong` border and `.ad-meta` label. A visitor should read it as
  "this is coming", not "this failed to load".
- **Don't delete a slot as cleanup.** It's the spec for an asset someone still
  owes. Deleting it deletes the requirement.

**Every page must ship complete and look finished with zero generated assets
present.** Nothing in the media plan is load-bearing.

---

## 8. Placeholders

Sometimes the right call is real placeholder imagery now, swapped later —
typically a hero that has to look finished before assets exist.

If you do this:

1. **Verify every URL resolves before committing to it.** A broken hotlink is
   worse than a slot.
   ```bash
   for id in 1454165804606-c3d57bc86b40 1553877522-43269d4ea984; do
     curl -s -o /dev/null -w "%{http_code}  photo-$id\n" \
       "https://images.unsplash.com/photo-$id?w=400&q=60"
   done
   ```
2. **Use a plain `<img>`, not the framework image component.** Routing throwaway
   art through an optimiser makes the build depend on a remote fetch for
   something about to be replaced.
3. **Tag every instance in the media plan** with its replacement brief. A
   placeholder with no brief becomes permanent.
4. **Placeholders are subject to §5's treatment rules.** An unscrimmed,
   unsaturated placeholder tells you nothing about how the real asset will look.

**Never placeholder a product surface** — build the fragment. A stock photo of a
laptop where your product should be is the single most damaging thing you can
put on the page.

---

## 9. The media plan

Keep one file per surface at the app root, listing every slot, every placeholder
and every code-drawn approximation that could be upgraded. One section each,
with:

- where it lives (file + the symbol that renders it)
- what it currently is
- what it must communicate
- the prompt
- format: aspect, resolution, duration, loop, codecs
- delivery path
- **the exact code change that swaps it in**
- priority

Open it with standing art direction (§5's constraints) so no entry repeats them,
and end with a priority order that distinguishes **real gaps** from **upgrades**.
An OG image that doesn't exist outranks a hero that already looks good.

Mark anything that should *not* be replaced, and say why.

See `higgsfield.md` for generating the assets and swapping them in.
