# Pitfalls

Failure modes where **the code is correct and the screen is still wrong**. Every
one of these was hit for real. They share a property that makes them expensive:
nothing throws, nothing warns, and the stylesheet reads as if it works.

Read §1 and §2 first when something "should have applied" and didn't.

---

## 1. Unlayered CSS silently beats every Tailwind utility

**The single most expensive bug in this system.**

### Symptom

Layout utilities do nothing. `mt-8` produces no margin. `text-[15px]` renders
at 16px. `gap-2` is ignored. No error, no warning — the class is in the DOM and
the element just doesn't move. It looks like a Tailwind config problem, or like
the build didn't pick up the class. It is neither.

### Cause

CSS cascade layers. **Unlayered rules beat every layered rule, regardless of
specificity.** Tailwind v4's `@import "tailwindcss"` puts utilities in
`@layer utilities`. If your recipe stylesheet is imported unlayered, then:

```css
/* unlayered — wins */          /* @layer utilities — loses */
.ob-h1 { margin: 0; }           .mt-8 { margin-top: 2rem; }
.ob-body { font-size: 16px; }   .text-\[15px\] { font-size: 15px; }
.ob-btn { gap: 10px; }          .gap-2 { gap: 0.5rem; }
```

Every type recipe with `margin: 0` in it — which is most of them — silently
kills spacing at the call site. The more disciplined your recipes are, the more
utilities they break.

### Fix

Import the recipe stylesheet into `components`, which Tailwind declares *ahead*
of `utilities`:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./recipes.css" layer(components);   /* ← the layer() is the fix */
```

Now the recipe is the default and a layout utility at the call site overrides
it, which is the contract the two are supposed to have.

### How to catch it

Never trust the screenshot — the page will look plausible, just tighter than
intended. Measure:

```js
// via Playwright MCP browser_evaluate
() => {
  const el = document.querySelector('#some-headline');   // has class "ob-h1 mt-8"
  return { cls: el.className, marginTop: getComputedStyle(el).marginTop };
}
```

`marginTop: "0px"` on an element carrying `mt-8` is the signature. After the
fix it reads `"32px"`.

### Where it hides

Any stylesheet imported after `@import "tailwindcss"` without a `layer()`.
Check every recipe file in the project, not just the one you wrote — a
pre-existing unlayered stylesheet has this bug whether or not anyone noticed.

---

## 2. Global `@layer base` rules leak another system's accent

### Symptom

Focus rings and text selection render in the *wrong hue* — a colour from a
design system you thought you'd left behind. Everything you explicitly styled
is correct; only the things you didn't style are wrong.

### Cause

A global base rule that hard-codes an accent, typically:

```css
@layer base {
  :focus-visible { outline: 2px solid var(--accent); }
  ::selection    { background: var(--accent); }
}
```

Any element you gave an explicit `:focus-visible` rule is fine. Every element
you *didn't* — skip links, wordmarks, badges, plain anchors — falls through to
the global default and picks up the old hue.

### Fix

Override scope-locally rather than editing the global rule, if another surface
still wants the original:

```css
/* in your recipes file, which is in @layer components — later than base,
   so layer order alone wins and there's no specificity war */
[data-theme='obsidian'] :focus-visible { outline-color: var(--ob-accent); }
[data-theme='obsidian'] ::selection {
  background: var(--ob-accent);
  color: var(--ob-on-accent);
}
```

### Also check

The same base rule often sets `border-radius` on `:focus-visible`, which
applies to the **element**, not just the ring — it will square off a pill on
focus unless your own radius rule sits in a later layer.

---

## 3. An undefined custom property voids its entire declaration

### Symptom

One rule in a block does nothing. The others in the same block work.

### Cause

`var(--typo)` with no fallback makes the **whole declaration** invalid at
computed-value time — not just that one value:

```css
.thing {
  box-shadow: 0 0 0 2px var(--ob-canvas), 0 0 0 4px var(--ob-acccent);
  /*                                                    ↑ typo         */
}
/* Result: NO box-shadow at all. Not a partial one. */
```

This is why a renamed or mistyped token fails silently instead of falling back
to something visible.

### Fix

After editing a recipe stylesheet, diff used-vs-defined:

```bash
# every var() referenced
grep -oE 'var\(--[a-z0-9-]+' styles/recipes.css | sort -u
# every one defined
grep -oE '^\s*--[a-z0-9-]+' styles/tokens.css | sort -u
```

Anything in the first list and not the second is a dead declaration.

**The same trap applies to `animation`:** an `animation: ob-drift 34s ...`
naming a `@keyframes` that doesn't exist fails silently and statically. Check
animation names against the `@keyframes` blocks the same way.

---

## 4. JS-owned `transform` fights CSS-owned `transform`

### Symptom

A parallax or drag element jumps, resets, or ignores its entrance animation.

### Cause

Two writers on one property. If a `requestAnimationFrame` loop writes
`node.style.transform` every frame, any CSS transition or keyframe on
`transform` for the same element is either overwritten or fighting it.

### Fix

**Give `transform` exactly one owner.** If JS owns it, the entrance animation
must use a different property:

```jsx
<div
  style={{
    // JS writes transform every frame — CSS must not touch it
    opacity: mounted ? card.opacity : 0,
    transition: `opacity 1400ms var(--ob-ease) ${delay}ms`,
  }}
/>
```

Same rule applies to a wrapper: if the parent animates `transform`, don't also
parallax the child's `transform` — put the parallax on the parent and the
entrance on the child, or vice versa.

---

## 5. `position: sticky` dies inside `overflow: hidden`/`clip`

### Symptom

The sticky column just scrolls away. No error.

### Cause

Any ancestor with `overflow` other than `visible` becomes the scroll container,
and the element sticks to *that* — which is often not scrollable at all.

This bites specifically in this system because the theme root carries
`overflow-x: clip` to contain the hero collage, and heroes carry
`overflow: clip` to contain the parallax cards.

### Fix

Keep `overflow` clipping on the **hero section only**, never on an ancestor of
a sticky element. If the theme root needs `overflow-x: clip`, confirm your
sticky columns still stick before moving on — this is a measurable check:

```js
() => {
  const el = document.querySelector('.sticky-column');
  let n = el.parentElement, blockers = [];
  while (n && n !== document.body) {
    const o = getComputedStyle(n).overflow;
    if (o !== 'visible') blockers.push({ cls: n.className, overflow: o });
    n = n.parentElement;
  }
  return blockers;   // non-empty = your sticky is broken or about to be
}
```

---

## 6. `.focus()` does not trigger `:focus-visible`

### Symptom

You audit focus rings by scripting `el.focus()` and reading computed styles,
and conclude there are no focus indicators. There are.

### Cause

`:focus-visible` matches on *input modality*. Programmatic focus doesn't
qualify for most element types — only real keyboard interaction does.

### Fix

Drive real keys. Via Playwright MCP:

```js
async (page) => {
  const out = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);          // let any transition settle
    out.push(await page.evaluate(() => {
      const el = document.activeElement, s = getComputedStyle(el);
      return {
        cls: el.className,
        focusVisible: el.matches(':focus-visible'),
        outline: s.outlineStyle === 'none' ? null : s.outlineColor,
        shadow: s.boxShadow === 'none' ? null : s.boxShadow.slice(0, 50),
        underline: s.textDecorationLine,
      };
    }));
  }
  return JSON.stringify(out);
}
```

Every row must show *some* indicator. The `waitForTimeout(80)` matters — see §7.

---

## 7. You measured mid-transition

### Symptom

A focus ring or hover state reads as `rgba(0, 0, 0, 0)`, or an animated value
reads as a nonsense intermediate like `0px 0px 0px 0.258px`.

### Cause

You sampled during the transition. A value fading in over 320ms is genuinely
transparent for the first frames.

### Fix

Wait past the transition before reading, and recognise the signature: a
*partially* interpolated value (alpha 0.13, spread 0.26px) means the rule is
applying and you're early — not that the rule is broken.

**Then ask whether the transition should exist at all.** A focus ring that
fades in over 320ms is a real usability bug; give `:focus-visible` its own
`transition: none`.

---

## 8. Screenshotting a cycling animation catches the wrong state

### Symptom

An auto-advancing component looks empty or broken in every screenshot.

### Cause

You caught it in its pending window. With a 1.2s resolve and a 2.9s hold, over
a quarter of screenshots land on the blank state.

### Fix

Drive it to a known state instead of hoping:

```js
// click the control that resets the cycle, then wait past resolve
() => document.querySelectorAll('.ob-cycle-dot')[0].click()
// then browser_wait_for time: 2.4
```

Or sample the state machine over time rather than looking at a picture:

```js
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = [];
  for (let i = 0; i < 6; i++) {
    const card = document.querySelector('.ob-evidence');
    out.push({
      t: i * 700,
      state: card?.dataset.state,
      rule: getComputedStyle(card.querySelector('.ob-verify-rule')).transform,
    });
    await sleep(700);
  }
  return out;
}
```

That output proves the machine works. A screenshot can't.

---

## 9. A Playwright hover timeout can be correct behaviour

### Symptom

`locator.hover()` times out with *"…intercepts pointer events"* and you go
hunting for a z-index bug.

### Cause

The element is deliberately non-interactive. This system holds back the fixed
header's CTA until the hero's primary has scrolled away, using
`opacity: 0; pointer-events: none`. Playwright still considers it "visible"
(it has a bounding box), tries to hover, and is correctly blocked.

### Fix

Scope the selector past the decoy (`main .ob-btn-primary` rather than
`.ob-btn-primary`), or `hover({ force: true })` when you're deliberately
probing a hidden state. **Confirm the interception is intentional before
"fixing" anything** — this one is a passing test wearing a failure costume.

---

## 10. Reduced motion that freezes instead of resolving

### Symptom

Under `prefers-reduced-motion`, content is invisible or half-arrived.

### Cause

Killing animations without resolving their end state. A reveal at
`opacity: 0` that only reaches `1` via transition stays at `0` forever when the
transition is disabled.

### Fix

The reduce block must **resolve to the end state**, not just stop motion:

```css
@media (prefers-reduced-motion: reduce) {
  [data-theme='obsidian'] *,
  [data-theme='obsidian'] *::before,
  [data-theme='obsidian'] *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
  }
  .ob-reveal { opacity: 1; transform: none; filter: none; }
  .ob-word   { transform: none; }
  .ob-verify-rule { transform: scaleX(1); }
  .ob-verdict     { opacity: 1; transform: none; }
}
```

**And handle JS-driven sequences separately** — CSS can't fix a typewriter or
a cycling carousel. Those need a branch in the component: render the whole
transcript at once, render all cycled items stacked. Auto-advancing content is
motion too. See `references/motion.md` §6.

---

## 11. Fixed header hides anchor targets

### Symptom

In-page anchors land with the heading tucked under the header.

### Fix

`scroll-margin-top` on anchor targets, or `scrollIntoView({ block: 'center' })`
for programmatic jumps. `block: 'center'` sidesteps it entirely and is what the
scrollytelling rail uses.

---

## 12. Per-character state re-renders the whole section

### Symptom

A typewriter feels heavy; unrelated animations stutter while it types.

### Cause

Character-count state held by a parent re-renders every sibling ~60×/second.

### Fix

Push the per-character state into the smallest possible leaf component, and let
the parent hold only "which turn are we on". Remount the leaf with a `key` to
reset it rather than syncing with an effect:

```jsx
{typing ? <TypingBubble key={`${runId}-${turnIndex}`} turn={typing} onDone={advance} /> : null}
```

`onDone` must be `useCallback`-stable or the effect restarts every render and
the typewriter never finishes.
