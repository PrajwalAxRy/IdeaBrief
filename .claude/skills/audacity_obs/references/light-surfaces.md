# Light surfaces

Read this when picking any colour pairing, and again before shipping a screen.

Light themes fail differently from dark ones. A dark screen that's wrong looks
wrong — muddy, low-contrast, obviously broken. **A light screen that's wrong
looks fine and is unreadable.** Warm grey on warm paper at 4.2:1 photographs
beautifully and cannot be read on a laptop outdoors. Every trap in §2 ships
looking correct, and two of them were live in this system's own first draft.

This file exists because Obsidian has no equivalent — on near-black none of
these are failure modes. It is the single most Audacity-specific reference here.

---

## 1. The contrast audit

Run this before calling any screen done. It reads colours **through the
browser** and checks every rendered text node against its actual background, so
it catches inherited colours and toasted bands that a token-table review can't.

```js
// Playwright MCP, per route, at 1440px. Anything in `fails` is a bug.
const lin = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const lum = rgb => {
  const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(n => lin(n / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// Walk up until we hit a non-transparent background — an element's own is
// usually rgba(0,0,0,0), and comparing against that reports pure black.
const groundOf = el => {
  for (let n = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && !/rgba?\([^)]*,\s*0\)$/.test(bg) && bg !== 'transparent') return bg;
  }
  return 'rgb(250, 246, 240)';   // --au-canvas
};

const EXEMPT = /au-discard/;   // the one sanctioned sub-AA colour — see §2.5
const fails = [];
document.querySelectorAll('body *').forEach(el => {
  const text = [...el.childNodes].filter(n => n.nodeType === 3)
    .map(n => n.textContent.trim()).join('');
  if (!text) return;
  const cs = getComputedStyle(el);
  if (cs.visibility === 'hidden' || cs.opacity === '0') return;
  const cls = typeof el.className === 'string' ? el.className : el.tagName;
  if (EXEMPT.test(cls)) return;
  const size = parseFloat(cs.fontSize);
  const weight = parseInt(cs.fontWeight, 10);
  // WCAG "large text": >=24px, or >=18.66px at weight 700+.
  const large = size >= 24 || (size >= 18.66 && weight >= 700);
  const need = large ? 3.0 : 4.5;
  const got = ratio(cs.color, groundOf(el));
  if (got < need) fails.push({ text: text.slice(0, 40), got: +got.toFixed(2), need, size, cls });
});
return fails;
```

Scroll to the bottom and wait before sampling, or unrevealed sections report
`opacity: 0` and get skipped. **Run it again with a `.au-band-void` section in
view** — that ground is 0.10 darker than the canvas and it is where this system
actually fails.

### The reference numbers

Every value in `assets/tokens.css` was computed with this script, not chosen by
eye. Worst case is always `--au-void`.

| Foreground | canvas | void | surface | raised |
|---|---|---|---|---|
| `--au-text` | 16.94 | 15.16 | 17.82 | 18.24 |
| `--au-muted` | 6.93 | 6.20 | 7.29 | 7.46 |
| `--au-dim` | 5.09 | **4.56** | 5.35 | 5.48 |
| `--au-accent` | 4.81 | **4.31** | 5.06 | 5.18 |
| `--au-accent-deep` | 7.03 | 6.29 | 7.39 | 7.57 |
| `--au-discard` | **2.52** | **2.26** | 2.65 | 2.71 |
| `--au-hairline` | 1.27 | 1.14 | 1.34 | 1.37 |
| `--au-hairline-strong` | 1.82 | 1.63 | 1.92 | 1.96 |

Plus: `--au-on-accent` on `--au-accent` is **4.93**, and on `--au-accent-deep`
**7.19** — so the primary button passes at rest and gets *more* readable on
hover, which is the point of the deepen direction.

Bold marks a value at or below the AA line. Those aren't oversights — they're
the constraints §2 encodes.

---

## 2. The five traps

### 2.1 Checking contrast against the canvas and shipping on the void

**This system's own first draft had this bug.** `--au-dim` was `#7A6B58`, which
measures 4.79 against `--au-canvas` — comfortably passing, verified, done.

It measures **4.29 against `--au-void`**, and `--au-void` is where the metadata
layer actually lives: fragment header bars, the footer, the hero band. The
entire mono layer was failing AA in the three places it appears most, while
passing every check anyone would think to run.

**The rule:** a light system has more than one ground, and the check is against
the *worst* one. `--au-dim` is now `#766751` (4.56 on void). Any new text colour
gets checked against all four grounds before it enters the token file, and the
comment records the worst number, not the best.

The general form of this trap: **the ground you designed on is not the ground it
ships on.** On near-black there was effectively one ground and this couldn't
happen.

### 2.2 Porting a dark system's muted body colour

The classic version of the "just invert it" instinct.

In a dark system, body copy is a mid-grey against a white headline, and the
contrast *between the two* is doing compositional work. Invert that literally
and you get mid-grey on paper — somewhere around 3.5–4.4:1. It fails, and the
page still looks tasteful.

**The rule:** body copy is `--au-muted` (6.20 at worst), which is darker than
the naive inversion of Obsidian's `--ob-muted` would be. `--au-dim` is for the
mono metadata layer and short labels, not for prose. If a paragraph is set in
`--au-dim`, that's the bug — even though it now passes AA, a full paragraph at
4.56 is legible rather than comfortable.

### 2.3 The accent that can't be text

Every light-theme reference in `design_inspiration/` reaches for a bright
orange — `#F05A28`, `#FF6B35`, `#FC5200`, `#E55A2B`. Against warm paper those
measure roughly **3.2–3.6:1**. They fail AA at every text size, and white on
them fails by the same margin, which is why systems built on them must split
the accent into a marks-only value plus a darker text value, and hand the filled
button to a near-black.

Audacity dodges this by choosing a **burnt** orange instead of a bright one.
`#BF4413` clears AA as text (4.81 / 4.31) *and* carries `--au-on-accent` at
4.93. One token, three jobs, rule 6 intact.

**The rule, and its price:** don't brighten the accent. It will look
conservative next to those references and that is the trade — the accent has to
survive being a 1px rule, a 10px chip label, a filled button, and body-adjacent
text, and a bright orange can only do the first.

Two live constraints that follow:

- **4.31 on `--au-void` is the tightest number in the system.** Accent text at
  `--au-meta-xs` inside a toasted band is the one place to re-measure after any
  change.
- **Colour is not an affordance.** An inline prose link needs an underline as
  well as the hue — `.au-link-inline` ships with one. A link that is only a
  slightly darker word is invisible to anyone who can't separate the hue.

### 2.4 The invisible hairline

The most consequential trap here, because **in this system the hairline is the
layout**. `--au-hairline` against each ground: canvas 1.27, surface 1.34, void
**1.14**.

At 1.14 the border does not render on a real display. So a rule inside a
`--au-band-void` section is simply absent — and since hairlines carry all the
structure, an absent hairline means an absent layout, and the reflex fix is a
shadow, which breaks rule 3 and turns the page generic.

**The rule (the tier rule, in `recipes.css` §5):** every element sits at least
one tier from its ground, and the hairline *confirms* an edge rather than
creating it.

```
ground          element
--au-void    →  --au-surface  or  --au-canvas
--au-canvas  →  --au-surface
--au-surface →  --au-raised,  or --au-canvas for a well
```

`.au-well` deliberately ships with **no** border for exactly this reason — the
tier step does what a 1.3:1 line can't.

Never solve this by darkening `--au-hairline`. Its 1.27 on canvas is the job it
actually has, and darkening it to survive the void turns every card on the page
into a wireframe. If a rule genuinely must be a line inside a toasted band, use
`--au-hairline-strong` (1.63) and accept that it is the strong one.

### 2.5 Sub-AA colour with no second signal

`--au-discard` is 2.52 on canvas. That is intentional and it matches Obsidian's
equivalent almost exactly (2.16) — "stops mattering" is the entire job of the
token, and a rejected item that shouts is worse design than one that fades.

It becomes an accessibility bug the moment it is the *only* signal.

**The rule:** `--au-discard` must never be the sole carrier of the fact that
something was discarded. Pair it with a strikethrough **and** a chip reading
`DISCARDED` in `--au-dim`. If a user has to read the discarded text itself to
understand what happened, it isn't discarded — it's illegible. This is the one
colour the §1 script exempts, and the exemption is conditional on the pairing.

---

## 3. Glare, bands, and an honest tension

Rule 2 says sections are separated by a rule and nothing else — no background
bands. That rule comes from Obsidian, where it is unambiguously right.

On paper it collides with a real physical fact: **a 1440×900 viewport filled
edge-to-edge with near-white at laptop brightness is roughly as luminous as a
lamp pointed at the reader.** It is fatiguing over a long scroll, and worse for
this system, it flattens the page — with no tonal variation, every section reads
at the same distance, which is exactly what a hairline system is trying to avoid.

The resolution is a distinction, not an exception:

- **A rule is a separator.** It says "a new section starts here." That is rule
  2 and it is unchanged — never reach for a background change to divide two
  sections.
- **A band is a register change.** It says "this part of the page is a
  different kind of thing" — the hero, the footer, one closing CTA.
  `.au-band-void` exists for that, and it is why `--au-void` is in the palette
  at all.

Practical consequences:

- **`--au-canvas` is the substrate; `--au-raised` (#FFFFFF) is a material.**
  Pure white is reserved for one tier step, never for the page ground. This is
  the main reason the canvas is `#FAF6F0` and not white.
- **Two or three void bands per page, maximum.** More and the alternation
  becomes the structure, which is the banded-SaaS look rule 2 exists to prevent.
- **Never stack two identical bands.** Two `.au-band-void` sections in a row
  produce a 320px void where a boundary should be.
- **Long-form prose takes `--au-canvas`, never `--au-raised`.** Text at length
  on pure white is the worst case for glare and for measure — cap it with
  `.au-measure` (680px) too.
- **The paper tooth is not optional on a long page.** At 0.025 with
  `mix-blend-mode: multiply` it is invisible in isolation and it is most of what
  keeps a large flat area of canvas from reading as a blank browser default.

---

## 4. Keeping it warm

The difference between `#FAF6F0` and `#F9FAFB` is three hex digits and it is the
whole personality of the system. The failure mode is gradual: someone needs a
neutral in a hurry, types `bg-gray-50`, and the page has one cool patch that
nobody can see in isolation and everybody feels next to the rest.

**Grep before shipping:**

```bash
rg -i '#f9fafb|#f3f4f6|#e5e7eb|#d1d5db|#9ca3af|#6b7280|#374151|#1f2937|#111827' --glob '!*.md'
rg '\b(bg|text|border)-(gray|slate|zinc|neutral|stone)-\d{2,3}\b'
```

Any hit breaks the no-cool-grey rule. Note `stone` is on that list — Tailwind's
stone ramp is warm and *nearly* right, which makes it the most tempting shortcut
and the one that yields a palette carrying two slightly different warmths.

The browser-side equivalent (R ≥ B on every rendered colour) is in
`verification.md` §6. Run both: the grep catches it in source before it ships,
the browser check catches it when it arrived through a dependency's stylesheet.

**Eyeball test, if you need one:** screenshot the page, drop a `#F9FAFB` swatch
next to a `#FAF6F0` region, and look at the boundary. If you can see the seam,
the page is warm. If you can't, something cool has crept in.

---

## 5. Border, tier, or shadow?

Audacity has no shadow. That column is a dead end on purpose, and the table is
here to make the substitution explicit rather than leave it as a prohibition.

| The element… | Gets |
|---|---|
| sits flat in a grid | `--au-hairline`, one tier from its ground |
| is a panel inside a card | one tier step + `--au-hairline` |
| is the deepest well | one tier step, **no border** (`.au-well`) |
| is chosen or selected | `--au-hairline-strong`, or `--au-text` for the one border meant to be chosen |
| is verified | `--au-hairline-accent` |
| floats over the page — modal, popover | one tier to `--au-raised` + `--au-hairline-strong` + a scrim behind it |
| is the primary button | the accent fill, and the one permitted glow on hover |

If you can't name what an element floats above, it doesn't float. And if the
answer to "how do I make this read as elevated" is a shadow, the actual answer
is that it is on the same tier as its ground — see §2.4.

---

## 6. Images on a light ground

Everything about scrimming inverts. `media.md` §3 has the full treatment and the
filter values; this is the short form and the one distinction that file makes
that is easy to miss.

- **A dark image punches a hole in a light page.** On near-black an image
  blends into the ground; here it becomes the heaviest object on screen whether
  or not it's the subject. Either commit to it as the focal point, or lighten
  and desaturate until it recedes.
- **Scrims go light, not dark.** To put text over an image you lighten the
  image (`--au-canvas` at ~62%) and use `--au-text`. A dark scrim plus light
  text is a dark-theme move and reads as a foreign object dropped into the page.
- **Source material must be shot high-key.** A moody, deep-shadow image
  lightened by 40% does not become airy — it goes flat and grey with the black
  areas surviving as smudges. This changes the generative brief, not just the
  CSS: `higgsfield.md` §4.
- **A standalone content image gets a hairline and a radius.** A full-bleed
  photo with a hard edge against warm paper looks unfinished. This is the
  opposite of the dark-system instinct, where a border on an image reads as a
  frame nobody asked for.
- **The hero collage cards do not.** They are the exception, and it's not a
  contradiction: the veil's entire job is that the collage has no boundary, so a
  border on each card turns a field into a moodboard. Bordered = a discrete
  object; unbordered + veiled = atmosphere.
- **Contrast-check text over any image after it loads.** The §1 script walks up
  to the nearest non-transparent background and will report the *scrim*, not the
  photograph — so check the rendered result by eye as well, at both widths, and
  sample the image's brightest region. Dark type over a lightened photo fails in
  the bright areas, which is the opposite of where the dark-system habit looks.
