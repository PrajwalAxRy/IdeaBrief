# Light surfaces

Read this when picking any colour pairing, and again before shipping a screen.

Light themes fail differently from dark ones. A dark screen that's wrong looks
wrong — muddy, low-contrast, obviously broken. A light screen that's wrong looks
*fine* and is unreadable: grey-on-white body copy at 3.8:1 photographs
beautifully and cannot be read by a person on a laptop outdoors. Every trap in
§2 ships looking correct.

---

## 1. The contrast audit

Run this before calling any screen done. It reads the tokens **through the
browser** and checks every rendered text node against its actual background, so
it catches inherited colours and inverted bands that a token-table review can't.

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
// Walk up until we hit a non-transparent background — the element's own is
// usually `rgba(0,0,0,0)`, and comparing against that reports pure black.
const groundOf = el => {
  for (let n = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor;
    if (bg && !/rgba?\([^)]*,\s*0\)$/.test(bg) && bg !== 'transparent') return bg;
  }
  return 'rgb(255, 255, 255)';
};

const fails = [];
document.querySelectorAll('body *').forEach(el => {
  const text = [...el.childNodes].filter(n => n.nodeType === 3)
    .map(n => n.textContent.trim()).join('');
  if (!text) return;
  const cs = getComputedStyle(el);
  if (cs.visibility === 'hidden' || cs.opacity === '0') return;
  const size = parseFloat(cs.fontSize);
  const weight = parseInt(cs.fontWeight, 10);
  // WCAG "large text": >=24px, or >=18.66px at weight 700+.
  const large = size >= 24 || (size >= 18.66 && weight >= 700);
  const need = large ? 3.0 : 4.5;
  const got = ratio(cs.color, groundOf(el));
  if (got < need) fails.push({
    text: text.slice(0, 40),
    got: +got.toFixed(2),
    need,
    size,
    cls: typeof el.className === 'string' ? el.className : el.tagName,
  });
});
return fails;
```

Scroll to the bottom and wait before sampling, or unrevealed sections report
`opacity: 0` and get skipped. Run it again inside any `.rl-invert` band — the
tokens are different there and a component that passes on paper can fail on the
dark ground.

### The reference numbers

Every value in `assets/tokens.css` was computed, not chosen by eye. Worst-case
ratio against the four grounds:

| Foreground | paper | canvas | linen | inset |
|---|---|---|---|---|
| `--rl-ink` | 17.85 | 16.96 | 15.83 | 14.36 |
| `--rl-body` | 7.83 | 7.44 | 6.95 | 6.30 |
| `--rl-muted` | 5.00 | 4.75 | **4.44** | **4.02** |
| `--rl-faint` | **3.05** | **2.90** | **2.71** | **2.46** |
| `--rl-accent` | **3.39** | **3.22** | **3.01** | **2.73** |
| `--rl-accent-text` | 6.04 | 5.74 | 5.36 | 4.86 |
| `--rl-positive` | 6.51 | 6.19 | 5.78 | 5.24 |
| `--rl-caution` | 6.78 | 6.45 | 6.02 | 5.46 |
| `--rl-critical` | 6.35 | 6.03 | 5.63 | 5.11 |
| `--rl-info` | 7.47 | 7.10 | 6.62 | 6.01 |

Bold = fails AA for body text. Those aren't mistakes; they're the constraints
the rules encode.

---

## 2. The five traps

### 2.1 Porting a dark system's muted body colour

The single most common failure in this genre, and the one most likely to arrive
by way of a "just invert it" instinct.

In a dark system, body copy sits at a mid-grey against a white headline, and the
contrast between the two is doing real compositional work. Invert that literally
and you get mid-grey on white — which measures somewhere around 3.5–4.4:1 and
fails. The page still looks tasteful. Nobody notices until someone tries to read
it in daylight.

**The rule:** body copy is `--rl-body` (`#57514A`, 6.30:1 at worst). `--rl-muted`
is for *secondary* copy and metadata, and only on `--rl-paper` and `--rl-canvas`.
On `--rl-linen` and `--rl-inset` it drops to 4.44 and 4.02 — use `--rl-body`.

`--rl-faint` is never text. Not for timestamps, not for placeholder copy, not
for "it's only a caption". Disabled controls, icon strokes, decorative rules.

### 2.2 The accent as text

`#F05A28` on white is **3.39:1**. It fails AA at every text size. This is not a
quirk of this particular orange — any hue saturated enough to read as a brand
colour lands in the 3–4:1 band against white, which is why so many otherwise
careful sites have inaccessible links.

**The rule:** `--rl-accent` is for *marks* — a dot, a rule, a bar, a fill, a
chart series. Every accent-coloured **character** uses `--rl-accent-text`
(`#AE3D12`, 4.86:1 at worst).

Colour is also not an affordance on its own. An inline prose link needs an
underline (`.rl-link-inline` has one); a link that's just coloured text is
invisible to anyone who can't distinguish the hue.

### 2.3 White text on an accent fill

`#FFFFFF` on `#F05A28` is **3.39:1** — the same number, for the same reason.
An orange button with white text cannot be made accessible at this hue.

Darkening the fill until white passes lands around `#C43F15`
(`--rl-accent-solid`, 5.16:1), which is muddy at button scale and starts
competing with `--rl-action` for the same meaning. That's a dead end.

**The rule:** the button is `--rl-action`. The accent sits beside it as a text
link. Both the measured palette and all three visual references arrive at this
independently, which is a good sign it's correct rather than merely convenient.

If you genuinely need a filled accent control — a small toggle, a tag — put
`--rl-ink` on `--rl-accent` (5.27:1), not white.

### 2.4 The invisible hairline

`--rl-line` against each ground:

| Ground | Ratio |
|---|---|
| `--rl-paper` | 1.30 |
| `--rl-canvas` | 1.24 |
| `--rl-linen` | 1.15 |
| `--rl-inset` | **1.05** |

At 1.05:1 the border does not render on a real display. A bordered card sitting
on the same tier as its ground has, visually, no border — so the card has no
edge, so the layout has no structure, and the fix people reach for is a shadow,
which breaks rule 7 and turns the page generic.

**The rule (rule 3):** every element sits at least one tier from its ground.
White card on linen. Linen panel inside a white card. Inset well inside a linen
panel. `.rl-well` deliberately ships with *no* border for exactly this reason —
the tier step does the work a border can't.

### 2.5 Neutral-black shadows on warm paper

`rgba(0,0,0,0.08)` over `#FAF9F7` desaturates the paper at the shadow's edge.
One card looks fine. Twelve cards produce a page where every card is ringed with
a faint cool halo, and the warm ground — the system's entire signature — reads
grey again.

**The rule:** shadows are warm. `--rl-lift` and `--rl-lift-panel` use
`rgba(61,48,36,…)`. Inside `.rl-invert` they switch back toward neutral black,
because on a dark ground a warm shadow reads as a brown smudge.

---

## 3. Glare, and why the bands exist

A 1440×900 viewport filled edge-to-edge with `#FFFFFF` at typical laptop
brightness is roughly as luminous as a lightbulb pointed at the reader. It is
genuinely fatiguing over a long scroll, and it flattens the page — with no tonal
variation, every section reads at the same distance.

This is the real reason `--rl-canvas` is the *default* ground and `--rl-paper`
is reserved for card faces and one of two alternating bands. Pure white is a
material in this system, not the substrate.

Practical consequences:

- **Never stack two identical bands.** Two `--rl-band-paper` sections in a row
  produce a 256px void where a boundary should be. Alternate.
- **A long-form section takes `--rl-canvas` or `--rl-linen`,** never paper. Text
  at length on pure white is the worst case for both glare and measure.
- **A dark band every 4–6 sections** resets the eye. That's the functional
  argument for inversion, separate from the compositional one.

---

## 4. Keeping it warm

The difference between `#FAF9F7` and `#F9FAFB` is three hex digits and it is
the whole personality of the system. The failure mode is gradual: someone needs
a neutral in a hurry, types `bg-gray-50`, and the page has one cool patch that
nobody can see in isolation but everybody feels next to the rest.

**Grep before shipping:**

```bash
rg -i '#f9fafb|#f3f4f6|#e5e7eb|#d1d5db|#9ca3af|#6b7280|#374151|#1f2937|#111827' --glob '!*.md'
rg '\b(bg|text|border)-(gray|slate|zinc|neutral|stone)-\d{2,3}\b'
```

Any hit is rule 2 broken. Note `stone` is in the list — Tailwind's stone ramp is
warm and *nearly* right, which makes it the most tempting shortcut and the one
that produces a palette with two slightly different warmths in it.

**Eyeball test, if you need one:** screenshot the page, drop a `#F9FAFB` swatch
next to a `#FAF9F7` region, and look at the boundary. If you can see the seam,
the page is warm. If you can't, something cool has crept in.

---

## 5. Inversion mechanics

`.rl-invert` remaps the same token names to dark values. Components don't know
they're inverted — that's the whole point, and it's what stops the system
growing a parallel set of `--dark` variants.

Three things that break it:

**Any component that reads a raw value instead of a token.** A
`style={{ color: '#57514A' }}` stays dark-on-dark inside an inverted band. This
is the practical enforcement mechanism for rule 1 — a hardcoded colour doesn't
just violate a policy, it visibly breaks in the footer.

**A nested `.rl-invert`.** The inner one re-applies already-inverted values, so
nothing changes and the intent silently fails. Inversion is not a toggle.

**`--rl-faint` still fails.** It's 2.50:1 at worst on dark grounds — same
category as light, same rule: never text.

Inside an inverted band, `--rl-accent-text` remaps to `#FF7A4D` (5.79:1 at
worst). This is the one place the accent gets to be bright, because on a dark
ground it finally clears AA. Don't take that as licence to use more of it.

---

## 6. Border or shadow?

| The element… | Gets |
|---|---|
| sits flat in a grid | `--rl-line`, no shadow |
| is a panel inside a card | one tier step, `--rl-line` |
| is the deepest well | one tier step, **no border** |
| floats over a photo or another card | `--rl-lift` |
| is the active thumb of a control | `--rl-lift` |
| floats over the page — modal, popover | `--rl-lift-panel` |
| is a hero product surface | `--rl-lift-panel` |
| is chosen or selected | `--rl-line-ink`, no shadow |

If you can't name what an element floats above, it doesn't float.

---

## 7. Images on a light ground

Everything about scrimming inverts, and the instinct carried over from a dark
system produces the wrong result.

- **A dark image punches a hole in a light page.** On dark grounds an image
  blends; here it becomes the heaviest object on screen whether or not it's the
  subject. Either commit to it as the focal point, or lighten and desaturate it
  until it recedes.
- **Scrims go light, not dark.** To place text over an image here you lighten
  the image (a white or `--rl-paper` scrim at 60–80%) and use `--rl-ink`. A
  dark scrim plus white text is a dark-theme move and it will read as a foreign
  object dropped into the page.
- **Give every image a hairline and a radius.** A full-bleed photo with a hard
  edge against warm paper looks unfinished; `--rl-line` at `--rl-r-lg` makes it
  a considered object. This is the opposite of the dark-system instinct, where
  a border on an image reads as a frame nobody asked for.
- **Contrast-check text over any image** with the §1 script after the image
  loads, not before. The script walks up to the nearest non-transparent
  background and will report the scrim, not the photograph — so check the
  *rendered* result visually as well, at both viewport widths.

See `references/media.md` for what should fill a visual area in the first place,
and `references/higgsfield.md` for briefing one that doesn't exist yet.
