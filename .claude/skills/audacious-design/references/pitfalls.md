# Pitfalls

Failure modes where **the code is correct and the screen is still wrong**. They
share a property that makes them expensive: nothing throws, nothing warns, and
the stylesheet reads as if it works.

Read §1 and §2 first when something "should have applied" and didn't.

§1–§9 are inherited from a real project that hit every one of them. §10–§14 are
specific to this system.

---

## 1. Unlayered CSS silently beats every Tailwind utility

**The single most expensive bug in this class of system.** It has shipped twice
in the sibling project — once globally, once for one page — and both times the
page still looked plausible.

### Symptom

Layout utilities do nothing. `mt-8` produces no margin. `gap-2` is ignored. No
error, no warning — the class is in the DOM and the element just doesn't move.
It looks like a Tailwind config problem. It is not.

### Cause

CSS cascade layers. **Unlayered rules beat every layered rule, regardless of
specificity.** Tailwind v4's `@import "tailwindcss"` puts utilities in
`@layer utilities`. If `audacious.css` is imported unlayered:

```css
/* unlayered — wins */        /* @layer utilities — loses */
.ad-h1  { margin: 0; }        .mt-8  { margin-top: 2rem; }
.ad-btn { gap: 8px; }         .gap-2 { gap: 0.5rem; }
```

Every type recipe with `margin: 0` in it silently kills spacing at the call
site. The more disciplined your recipes, the more utilities they break.

### Fix

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./audacious.css" layer(components);   /* ← the layer() is the fix */
```

`components` is declared ahead of `utilities`, so the recipe is the default and
a layout utility at the call site overrides it — the contract the two are
supposed to have.

### How to catch it

Never trust the screenshot; the page looks fine, just tighter than intended.

```js
() => {
  const el = document.querySelector('#some-headline');   // has "ad-h1 mt-8"
  return { cls: el.className, marginTop: getComputedStyle(el).marginTop };
}
```

`marginTop: "0px"` on an element carrying `mt-8` is the signature.

Check **every** stylesheet in the project, not just the one you wrote — a
pre-existing unlayered file has this bug whether or not anyone noticed.

---

## 2. An undefined custom property voids its entire declaration

### Symptom

One rule in a block does nothing. The others in the same block work.

### Cause

`var(--typo)` with no fallback makes the **whole declaration** invalid at
computed-value time — not just that one value:

```css
.thing {
  box-shadow: 0 0 0 2px var(--ad-paper), 0 0 0 4px var(--ad-acccent-ring);
  /*                                                  ↑ typo              */
}
/* Result: NO box-shadow at all. Not a partial one. */
```

This is why a renamed or mistyped token fails silently rather than falling back
to something visible.

### Fix

After editing a recipe stylesheet, diff used-vs-defined:

```bash
grep -oE 'var\(--[a-z0-9-]+' styles/audacious.css | sort -u   # referenced
grep -oE '^\s*--[a-z0-9-]+'   styles/tokens.css | sort -u # defined
```

Anything in the first list and not the second is a dead declaration.

**Same trap for `animation`:** a name with no matching `@keyframes` fails
silently and statically. Check those the same way.

---

## 3. A `transform` creates a stacking context and voids a descendant's z-index

### Symptom

A tooltip, dropdown or popover renders *behind* something it should be above,
and raising its `z-index` — to 10, to 100, to 9999 — changes nothing.

### Cause

Any ancestor with a `transform` (also `filter`, `opacity < 1`, `will-change`,
`backdrop-filter`) creates a stacking context. Everything inside it is stacked
*within* that context, so a descendant cannot out-stack anything outside it at
any value.

The sibling project lost an hour to exactly this: a marker carrying
`translateX(-50%)` for centring meant the tooltip inside it could never clear
the chart gridlines.

### Fix

The `z-index` has to go on the **transformed element**, not the descendant. Or
remove the transform — centring via `translateX(-50%)` can usually become a grid
or flex alignment, which creates no context.

```js
// Find the culprit: walk up and report every stacking context.
() => {
  const el = document.querySelector('.ad-tooltip');
  const out = [];
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    const s = getComputedStyle(n);
    if (s.transform !== 'none' || s.filter !== 'none' ||
        s.opacity !== '1' || s.willChange !== 'auto') {
      out.push({ cls: n.className, transform: s.transform, opacity: s.opacity });
    }
  }
  return out;   // the first entry is the ceiling your z-index can't escape
}
```

---

## 4. `elementFromPoint` is not a paint-order test

### Symptom

You verify that a decorative layer isn't covering your text by calling
`document.elementFromPoint(x, y)`, it returns the text, and you conclude the
stack is fine. It isn't.

### Cause

`elementFromPoint` does **hit testing**, not paint testing. Anything with
`pointer-events: none` is skipped entirely and it reports what's behind. Most
decorative overlays — scrims, gradients, glows, backdrops — carry exactly that.

### Fix

Check paint order structurally: compare `z-index` and `position` up both
ancestor chains, or temporarily set the overlay to `outline: 2px solid red` and
look. For a positioned overlay specifically, see §10.

---

## 5. `position: sticky` dies inside `overflow: hidden`/`clip`

### Symptom

The sticky column just scrolls away. No error.

### Cause

Any ancestor with `overflow` other than `visible` becomes the scroll container,
and the element sticks to *that* — often not scrollable at all.

### Fix

Keep clipping on the section that needs it, never on an ancestor of a sticky
element.

```js
() => {
  const el = document.querySelector('.sticky-column');
  const blockers = [];
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    const o = getComputedStyle(n).overflow;
    if (o !== 'visible') blockers.push({ cls: n.className, overflow: o });
  }
  return blockers;   // non-empty = your sticky is broken or about to be
}
```

---

## 6. `.focus()` does not trigger `:focus-visible`

### Symptom

You audit focus rings by scripting `el.focus()`, read computed styles, and
conclude there are no focus indicators. There are.

### Cause

`:focus-visible` matches on *input modality*. Programmatic focus doesn't qualify
for most element types — only real keyboard interaction does.

### Fix

Drive real keys:

```js
async (page) => {
  const out = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);            // let any transition settle — §7
    out.push(await page.evaluate(() => {
      const el = document.activeElement, s = getComputedStyle(el);
      return {
        cls: el.className,
        focusVisible: el.matches(':focus-visible'),
        outline: s.outlineStyle === 'none' ? null : s.outlineColor,
        shadow: s.boxShadow === 'none' ? null : s.boxShadow.slice(0, 50),
      };
    }));
  }
  return JSON.stringify(out);
}
```

Every row must show *some* indicator.

---

## 7. You measured mid-transition

### Symptom

A focus ring or hover state reads as `rgba(0, 0, 0, 0)`, or an animated value
reads as a nonsense intermediate like `0px 0px 0px 0.258px`.

### Cause

You sampled during the transition. A value fading in over 220ms is genuinely
transparent for the first frames.

### Fix

Wait past the transition, and recognise the signature: a *partially*
interpolated value means the rule is applying and you're early — not that it's
broken.

**Then ask whether the transition should exist.** A focus ring that fades in is
a real usability bug; `:focus-visible` in `recipes.css` carries
`transition: none` for this reason.

---

## 8. Reduced motion that freezes instead of resolving

### Symptom

Under `prefers-reduced-motion`, content is invisible or half-arrived.

### Cause

Killing animations without resolving their end state. `.ad-reveal` starts at
`opacity: 0` and only reaches `1` via transition — disable the transition and it
stays at `0` forever. The page is blank and the CSS is "correct".

### Fix

The reduce block must **resolve to the end state**, not just stop motion.
`recipes.css` §17 does this for `.ad-reveal`; anything you add with an
off-screen start state needs the same treatment.

**JS-driven sequences need a separate branch** — CSS can't fix a typewriter or a
carousel. Render the whole transcript at once, render all cycled items stacked.
Auto-advancing content is motion too. See `motion.md` §6.

---

## 9. A Playwright hover timeout can be correct behaviour

### Symptom

`locator.hover()` times out with *"…intercepts pointer events"* and you go
hunting for a z-index bug.

### Cause

The element is deliberately non-interactive — e.g. a header CTA held back with
`opacity: 0; pointer-events: none` until the hero's has scrolled away.
Playwright still considers it visible (it has a bounding box), tries to hover,
and is correctly blocked.

### Fix

Scope the selector past the decoy (`main .ad-btn--primary`), or
`hover({ force: true })` when deliberately probing a hidden state. **Confirm the
interception is intentional before "fixing" anything** — this is a passing test
wearing a failure costume.

---

## 10. A fixed/absolute backdrop paints above all static text

### Symptom

Body copy sits *underneath* a background layer. Only on pages where the
background asset actually exists, which is how it ships unnoticed.

### Cause

A positioned element (`position: fixed`, `z-index: 0`) painted as a **sibling**
of the content still paints above **static, in-flow** content. Positioned
elements with `z-index: 0` beat non-positioned ones regardless of DOM order.

The sibling project shipped exactly this and four page containers still sit
under it.

### Fix

Lift the content, don't sink the backdrop. `z-index: -1` on the backdrop is
**not** the fix — it drops it behind the body background and it disappears
entirely.

```css
.ad-page { position: relative; z-index: 1; }   /* on the CONTENT container */
```

Verify structurally (`elementFromPoint` will lie here — see §4): check that the
content container has a `position` other than `static`.

---

## 11. `--ad-body` is a colour and `--ad-body-size` is a size

### Symptom

`font-size: var(--ad-body)` renders at the browser default, or a size
declaration silently does nothing.

### Cause

A genuine naming collision in the token file. `--ad-body` is the **colour**
token for running prose; the **size** is `--ad-body-size`. Every other text
token (`--ad-sm`, `--ad-xs`, `--ad-sub`) is a size with no colour counterpart,
so the instinct to type `var(--ad-body)` for 16px is strong and wrong.

`font-size: #57514A` is invalid, so the declaration is dropped — silently, per
§2's mechanism.

### Fix

Use the `.ad-body` recipe class rather than the raw token. It sets both
correctly. If you must write it by hand, `--ad-body-size` for the size.

---

## 12. A nested `.ad-invert` does nothing

### Symptom

A dark band inside a dark band renders identically to its parent, and a
component meant to pop against it disappears.

### Cause

`.ad-invert` remaps token names to dark values. Applied inside an already
inverted subtree, it re-declares the same dark values — there's no toggle
semantics, so nothing flips back.

### Fix

Inversion is punctuation, not a switch. One band, one `.ad-invert`, at the top
of that band. If you need a light card inside a dark band, give it explicit
light tokens or lift it out of the band.

Related: a hardcoded colour anywhere inside an inverted band stays light and
becomes invisible. That's rule 1 enforcing itself visibly — treat it as a
feature and fix the hardcode rather than patching the band.

---

## 13. Cool grey creeps in one utility at a time

### Symptom

The page reads slightly "off" — flatter, more default — and no single element
looks wrong.

### Cause

Someone needed a neutral in a hurry and typed `bg-gray-50` or `border-gray-200`.
One cool patch is invisible in isolation and obvious in aggregate against the
warm ground. Tailwind's `stone` ramp is the worst offender because it's warm and
*nearly* right, giving you a palette with two different warmths in it.

### Fix

Grep before shipping — see `light-surfaces.md` §4 for the full pattern:

```bash
rg '\b(bg|text|border)-(gray|slate|zinc|neutral|stone)-\d{2,3}\b'
```

Any hit is rule 2 broken.

---

## 14. A bordered element on the same tier as its ground has no border

### Symptom

A card has no visible edge. Someone adds a shadow to fix it, and the page starts
looking like every other SaaS site.

### Cause

`--ad-line` against `--ad-inset` is **1.05:1** — it does not render. Against
`--ad-linen` it's 1.15:1, which is visible but weak enough that a
linen-on-linen card reads as unbounded.

### Fix

Rule 3, the one-step rule. White card on linen, linen panel inside a white card,
inset well inside a linen panel. `.ad-well` ships with no border deliberately —
the tier step does the work a border can't.

The measurement, if you need to prove it:

```js
() => {
  const el = document.querySelector('.ad-card');
  const cs = getComputedStyle(el);
  return {
    border: cs.borderTopColor,
    ownBg: cs.backgroundColor,
    parentBg: getComputedStyle(el.parentElement).backgroundColor,
  };   // ownBg === parentBg is the bug
}
```

Full contrast table in `light-surfaces.md` §2.4.
