# Media & imagery

The rule that decides everything else: **never ship a visual area that isn't
accounted for.** A blank div is a bug. There are exactly four legitimate fills,
and they're in priority order.

**§3 is the part of this system that genuinely inverts.** Everything else on
this page is identical to the dark system; the photographic treatment is not,
and applying the dark treatment on paper produces the single ugliest result
Audacity can produce — a dark-scrimmed image reads as a hole punched in the
sheet. If you are here to place a photograph, read §3 before anything else.

---

## 1. The decision tree

For any visual area, work down this list and stop at the first `yes`.

**1. Is it showing your own product?** → **Draw it in code.** Not a screenshot,
not a mockup, not a video. See §2.

**2. Is it atmosphere — texture, light, depth, motion?** → **CSS.** Blooms,
gradients, paper grain, drifting fields, dot matrices, animated rules. See
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
│ IDEA BRIEF                 DRAFT · EDITABLE │  ← mono header bar, on --au-void
├─────────────────────────────────────────────┤
│ PRODUCT   Return programme for people who…  │  ← real rows, real tokens
│ CUSTOMER  Lapsed lifters, 2–6 years out     │
│ PROBLEM   Restarting alone feels humiliating│
│ MAKES $   [ UNKNOWN ]                       │  ← real chip component
├─────────────────────────────────────────────┤
│ 2 UNKNOWNS → OPEN QUESTIONS.                │
└─────────────────────────────────────────────┘
```

The recipe is one container (`.au-frag`) with a header bar on the toasted
surface and a body on the card surface. Everything inside uses the same chips,
rules, and type scale as the real product.

**A light-theme fragment needs its rows checked, not assumed.** On near-black
the three surfaces were within a few percent of each other and every internal
rule read cleanly. Here `--au-void` (header bar), `--au-surface` (body) and
`--au-hairline` (row rules) are separated by single-digit lightness steps on a
much brighter ground, and a fragment that looks crisp in a design tool can flatten
into one pale rectangle on a real display. Screenshot it and confirm you can
count the rows.

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

On paper, the goal is a **photograph printed on the page**, not a photograph
floating above it. It should look like it was run through the same press as the
type: light, warm, low-contrast, with no hard edge anywhere.

### The four constraints

| Constraint | Why |
|---|---|
| **Warm near-monochrome.** Desaturate to ~30–40%, then bias warm — a duotone toward `--au-void`, not a neutral greyscale. | One hue exists and it means *verified / action / live*. A cool or neutral grade drops a cold rectangle into a warm page and is the fastest way to break the paper. |
| **Survives being washed *up*, not down.** Every image sits under a paper scrim at `opacity: 0.62` plus a radial veil, both in `--au-canvas`. | The image must read at roughly 40% strength *lighter* than shot. A composition that only holds at full contrast turns to mud in the opposite direction here — it goes chalky, not muddy. |
| **No text in frame.** | Generated text is garbage at any size; real text fights the actual headline. |
| **No faces in sharp focus.** | Faces pull the eye off the headline. Backs of heads, hands, out-of-focus figures are fine. |

**Source photographs shot bright and low-contrast.** This is the practical
consequence and it is easy to miss: the dark system wanted a hard key light and
deep shadow, because it was scrimming *down* into black and needed something
left to see. Audacity scrims *up* into paper. A moody, high-contrast, deep-shadow
image lightened by 40% doesn't become airy — it becomes flat and grey, and the
black areas stay stubbornly present as smudges. Ask for high-key, diffuse,
overexposed-by-a-stop material instead. See `higgsfield.md` §4.

### The scrim + veil recipe

Two layers. The per-card scrim keeps the image from competing; the veil
dissolves the whole collage into the canvas so it has no visible boundary. Note
that both read `--au-canvas` where the dark system read `--ob-void` — the veil
must match the surface the collage sits on, and on paper that is the canvas.

```css
/* per card — the image never appears at full strength */
.au-collage-card::after {
  content: ''; position: absolute; inset: 0;
  background: var(--au-canvas); opacity: 0.62;
}

/* over the whole collage — no hard edges anywhere */
.au-collage-veil {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(120% 78% at 50% 46%, transparent 0%, var(--au-canvas) 76%),
    linear-gradient(to bottom, var(--au-canvas) 0%, transparent 22%,
                                transparent 58%, var(--au-canvas) 96%);
}
```

Plus, on the image itself:

```css
.au-collage-card img {
  filter: grayscale(0.65) sepia(0.22) contrast(0.92) brightness(1.08);
}
```

Four values rather than the dark system's two, and each is doing a job:
`grayscale` + `sepia` together are a cheap warm duotone; `contrast(0.92)` opens
the shadows so nothing stays as a dark smudge under the paper scrim;
`brightness(1.08)` lifts the whole thing onto the page. Tune `sepia` first if
the result feels cold, `contrast` first if it feels dirty.

**Headline legibility is the check that actually matters.** Dark type over a
lightened photo is a harder legibility problem than light type over a darkened
one, because the image's own bright areas race the paper rather than the ink.
Sample the darkest and lightest points of the image under the headline and
confirm `--au-text` clears 4.5:1 against both. If it doesn't, raise the scrim
opacity before touching anything else — never add a text shadow.

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
- **The collage cards get no border** — and this is the one place in the system
  where that's true, so it needs stating precisely rather than as a general
  rule. A **standalone content image** on paper *does* get a hairline and a
  radius: a full-bleed photo with a hard edge against warm paper looks
  unfinished, and the border makes it a considered object. (That is the
  opposite of the dark-system instinct, where a border on an image reads as a
  frame nobody asked for.) The collage is the exception because the veil's
  entire job is that it has no boundary — a bordered card turns a field into a
  moodboard. Bordered = a discrete object; unbordered + veiled = atmosphere.

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
  brief="Wall of sticky notes and half-erased whiteboard diagrams. High-key and diffuse, warm near-monochrome, shadows open — it gets washed toward paper, not darkened. Middle third must stay quiet — the headline sits over it. No legible text, nobody facing camera."
  source="12s seamless loop, 1920×1080, MP4 + WebM + poster. → public/media/hero/centre.*"
/>
```

Rules:

- **The brief is written for whoever fills it** — a person or a generator. Be
  specific about subject, treatment, crop, motion, duration, and destination.
  "A nice abstract image" is not a brief.
- **Name colours in words** ("warm paper", "burnt orange"), never as hex, so the
  brief survives a token change.
- **Say which direction it will be scrimmed.** This is Audacity-specific and it
  changes what should be shot. "Gets washed toward paper" belongs in every
  photographic brief in this system.
- **Reserve the exact final height.** Filling a slot must cause zero layout
  shift.
- **A slot on paper needs a visible frame.** On near-black an empty labelled
  area was self-evidently a placeholder. On `--au-canvas` an unstyled slot can
  read as intentional whitespace and get shipped. Give it a dashed
  `--au-hairline-strong` border and the mono label at `--au-dim` so nobody
  mistakes a hole for a design decision.
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
   placeholder that isn't scrimmed and warm-graded tells you nothing about how
   the real asset will look — and on paper it tells you *less* than nothing,
   because an untreated stock photo is bright and saturated and will look
   fine-ish while the treated version reveals the composition doesn't work.

Placeholders are for §3 subjects only. **Never placeholder a product surface** —
build the fragment. A stock photo of a laptop where your product should be is
the single most damaging thing you can put on the page.

---

## 7. The media plan

Every project keeps one file — a media plan at the repo root — listing every
placeholder, every slot, and every code-drawn approximation that could be
upgraded. One section each, with:

- where it lives (file + the symbol that renders it)
- what it currently is
- what it must communicate
- the prompt
- format: aspect, resolution, duration, loop, codecs
- delivery path
- **the exact code change that swaps it in**
- priority

It opens with standing art direction (§3's constraints, including the
scrimmed-toward-paper note) so no entry has to repeat them, and it ends with a
priority order that distinguishes **real gaps** from **upgrades**. An OG image
that doesn't exist outranks a hero that already looks good.

Mark anything that should *not* be replaced, and say why. A live DOM animation
is more convincing than a video of it, because the visitor can drive it — write
that down or someone will "upgrade" it later.

See `higgsfield.md` for generating the assets and swapping them in.
