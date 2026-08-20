# Media & imagery

The rule that decides everything else: **never ship a visual area that isn't
accounted for.** A blank div is a bug. There are exactly four legitimate fills,
and they're in priority order.

---

## 1. The decision tree

For any visual area, work down this list and stop at the first `yes`.

**1. Is it showing your own product?** → **Draw it in code.** Not a screenshot,
not a mockup, not a video. See §2.

**2. Is it atmosphere — texture, light, depth, motion?** → **CSS.** Blooms,
gradients, grain, drifting fields, dot matrices, animated rules. See
`motion.md` §8.

**3. Is the subject genuinely human or physical** — a person, a place, a
material, something that exists in the world? → **Photography is permitted**,
under the treatment rules in §3. This is a narrow door: heroes and the
occasional editorial band. It is not a licence for decorative stock.

**4. None of the above, and you can't make it right now?** → **A labelled
slot** carrying its art-direction brief. See §5.

There is no fifth option.

---

## 2. Product surfaces are drawn in code

**A screenshot of your own UI is always worse than that UI rendered as markup.**
It's blurrier, it can't use your tokens, it goes stale the moment the product
changes, it doesn't respond to the viewport, and it can't be read by a screen
reader. It also *looks* like a screenshot, which reads as a slide deck.

So: build the fragment.

```
┌─────────────────────────────────────────────┐
│ IDEA BRIEF                 DRAFT · EDITABLE │  ← mono header bar, on --ob-void
├─────────────────────────────────────────────┤
│ PRODUCT   Return programme for people who…  │  ← real rows, real tokens
│ CUSTOMER  Lapsed lifters, 2–6 years out     │
│ PROBLEM   Restarting alone feels humiliating│
│ MAKES $   [ UNKNOWN ]                       │  ← real chip component
├─────────────────────────────────────────────┤
│ 2 UNKNOWNS → OPEN QUESTIONS.                │
└─────────────────────────────────────────────┘
```

The recipe is one container (`.ob-frag`) with a header bar on the deeper
surface and a body on the card surface. Everything inside uses the same chips,
rules, and type scale as the real product.

**Make the fragment argue for the product.** Choose the content so it
demonstrates something specific:

- A brief with two fields visibly marked `UNKNOWN` proves "nothing is invented
  to fill a field" better than any sentence about it.
- An evidence list where one row is struck through and marked `DISCARDED`
  proves the verification claim.
- An interview script written out in full proves "we write the material" in a
  way "we generate interview questions" never will.

A fragment showing a happy path with no tension is decoration. A fragment
showing the product's actual character is the argument.

**These fragments stay server components.** They're static markup; nothing
about them needs to be interactive.

---

## 3. When photography is allowed, and how it must be treated

Photography earns its place only where the subject is genuinely human or
physical. When it does, it is **atmosphere behind type**, never content in its
own right — and it has to survive that role.

### The four constraints

| Constraint | Why |
|---|---|
| **Near-monochrome.** Desaturate to ~30–40%. | One hue exists and it means *verified / action / live*. A warm skin tone or a green plant competes with the only colour carrying meaning. |
| **Survives ~60% darkening.** Every image sits under a scrim at `opacity: 0.62` plus a radial veil. | If the composition only works at full brightness, it reads as mud here. |
| **No text in frame.** | Generated text is garbage at any size; real text fights the actual headline. |
| **No faces in sharp focus.** | Faces pull the eye off the headline. Backs of heads, hands, out-of-focus figures are fine. |

### The scrim + veil recipe

Two layers. The per-card scrim keeps the image from competing; the veil
dissolves the whole collage into the canvas so it has no visible boundary.

```css
/* per card — the image never appears at full strength */
.ob-collage-card::after {
  content: ''; position: absolute; inset: 0;
  background: var(--ob-void); opacity: 0.62;
}

/* over the whole collage — no hard edges anywhere */
.ob-collage-veil {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(120% 78% at 50% 46%, transparent 0%, var(--ob-void) 76%),
    linear-gradient(to bottom, var(--ob-void) 0%, transparent 22%,
                                transparent 58%, var(--ob-void) 96%);
}
```

Plus `filter: grayscale(0.35) contrast(1.05)` on the image itself.

---

## 4. The hero collage

The signature composition: an oversized headline sitting *inside* a field of
perspective-tilted media cards.

### Geometry

Positions are percentages of the hero box, so the composition holds across
viewport widths. Five cards, arranged so the middle third of the frame stays
quiet enough for type.

| Slot | Size | Position | Rotate | Depth |
|---|---|---|---|---|
| far-left | 26% × 30% | (−8%, 30%) | −8° | 0.34 |
| left | 22% × 26% | (10%, 58%) | +5° | 0.60 |
| **centre** | 46% × 42% | (27%, 24%) | 0° | 0.16 |
| right | 24% × 28% | (70%, 55%) | −5° | 0.58 |
| far-right | 26% × 30% | (82%, 28%) | +8° | 0.34 |

- **The outer cards bleed off both edges** (`-8%` and `82%` with 26% width).
  Cards that all fit inside the viewport read as a gallery, not a field.
- **The centre card sits behind the headline** and must be near-featureless in
  its middle third. It gets the lowest depth so it barely moves — it's the
  background plate.
- **Rotations stay under 10°.** More reads as a scrapbook.
- Depth drives parallax — see `motion.md` §4a.

### Entrance

Opacity only, staggered ~110ms per card. **Never animate `transform` here** —
the parallax loop owns it (`pitfalls.md` §4).

---

## 5. Slots, for what you can't make yet

When a position genuinely needs an asset that doesn't exist, author the
**absence** rather than leaving a gap.

A slot is a correctly-sized, visibly-labelled frame stating on screen exactly
what belongs there: kind, aspect ratio, subject, treatment, motion, duration,
and destination path.

```jsx
<MediaSlot
  ratio="16/9"
  kind="video"
  label="HERO / CENTRE PLATE"
  brief="Wall of sticky notes and half-erased whiteboard diagrams. Near-monochrome, single hard key light, deep shadow. Middle third must stay quiet — the headline sits over it. No legible text, nobody facing camera."
  source="12s seamless loop, 1920×1080, MP4 + WebM + poster. → public/media/hero/centre.*"
/>
```

Rules:

- **The brief is written for whoever fills it** — a person or a generator. Be
  specific about subject, treatment, crop, motion, duration, and destination.
  "A nice abstract image" is not a brief.
- **Name colours in words** ("near-black", "cool blue"), never as hex, so the
  brief survives a token change.
- **Reserve the exact final height.** Filling a slot must cause zero layout
  shift.
- **Don't delete a slot as cleanup.** It's the spec for an asset someone still
  owes. Deleting it deletes the requirement.

---

## 6. Placeholders

Sometimes the right call is real placeholder imagery now, swapped later —
typically for a hero that has to look finished before assets exist.

If you do this:

1. **Verify every URL resolves before committing to it.** A broken hotlink is
   worse than a slot. Check them, don't assume:
   ```bash
   for id in 1454165804606-c3d57bc86b40 1553877522-43269d4ea984; do
     curl -s -o /dev/null -w "%{http_code}  photo-$id\n" \
       "https://images.unsplash.com/photo-$id?w=400&q=60"
   done
   ```
2. **Use a plain `<img>`, not the framework image component.** Routing
   throwaway art through an optimiser makes the build depend on a remote fetch
   for something about to be replaced. Switch to the optimised component when
   local assets land.
3. **Tag every instance in the media plan** with its replacement brief. A
   placeholder with no brief becomes permanent.
4. **Photography placeholders are subject to §3's treatment rules.** A
   placeholder that isn't scrimmed and desaturated tells you nothing about how
   the real asset will look.

Placeholders are for §3 subjects only. **Never placeholder a product surface** —
build the fragment. A stock photo of a laptop where your product should be is
the single most damaging thing you can put on the page.

---

## 7. The media plan

Every project keeps one file — `higgsfieldPlan.md` at the repo root — listing
every placeholder, every slot, and every code-drawn approximation that could be
upgraded. One section each, with:

- where it lives (file + the symbol that renders it)
- what it currently is
- what it must communicate
- the prompt
- format: aspect, resolution, duration, loop, codecs
- delivery path
- **the exact code change that swaps it in**
- priority

It opens with standing art direction (§3's constraints) so no entry has to
repeat them, and it ends with a priority order that distinguishes **real gaps**
from **upgrades**. An OG image that doesn't exist outranks a hero that already
looks good.

Mark anything that should *not* be replaced, and say why. A live DOM animation
is more convincing than a video of it, because the visitor can drive it — write
that down or someone will "upgrade" it later.

See `higgsfield.md` for generating the assets and swapping them in.
