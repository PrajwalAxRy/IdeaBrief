# Verification

**A screenshot proves a thing looks right. It does not prove a rule applied —
and on a light ground it does not prove anyone can read it.**

Most of the expensive failures in `pitfalls.md` are invisible in a screenshot:
the page looks plausible, just tighter, cooler or duller than intended. The
contrast failures in `light-surfaces.md` are worse — they photograph
*beautifully*. So the loop is *look, then measure*, and the measuring is not
optional.

Driven through the Playwright MCP against a running dev server.

---

## 1. The loop

```
1. Start dev server, navigate at 1440×900
2. Screenshot each section          → does it read right?
3. Measure the rules                → did the CSS actually apply?
4. Run the two audits               → type scale + contrast
5. Tab the whole page               → is every control reachable and visible?
6. Probe hover on every control     → does each one respond?
7. Emulate reduced motion           → does it resolve, or freeze?
8. Repeat at 1280
9. Console: zero errors
10. Build + typecheck + lint + tests
```

Steps 3–7 are the ones that get skipped and the ones that find bugs. Step 4 is
the one unique to a light system.

---

## 2. Look

```
browser_resize  1440 × 900
browser_navigate  http://localhost:3000
browser_take_screenshot
```

Scroll by section rather than one enormous full-page capture — a 7000px image
is unreadable and burns context:

```js
() => document.querySelectorAll('.ad-bento')[1].scrollIntoView({ block: 'center' })
```

**Two traps, both in `pitfalls.md`:** anything cycling will be caught mid-state
and look broken — drive it to a known state first. Anything with an entrance
transition needs a beat before capture (§7).

Read at **1440 and 1280**. No mobile — this system is desktop-only.

### Band rhythm

Worth one look on the full-page capture specifically: **no two adjacent
sections share a ground.** Two `--ad-band-paper` in a row produces a 256px void
where a boundary should be, and it reads as a broken page rather than a
generous one.

```js
() => [...document.querySelectorAll('section')]
  .map(s => getComputedStyle(s).backgroundColor)
  .filter((bg, i, a) => i > 0 && bg === a[i - 1]);   // non-empty = repeated band
```

---

## 3. Measure

This is the step that distinguishes a verified screen from a screenshotted one.

### 3a. Did the cascade work?

The highest-value single check in the system. Pick an element carrying both a
recipe class and a layout utility, and confirm the utility won:

```js
() => {
  const el = document.querySelector('#features-headline');   // "ad-h1 mt-8"
  return {
    cls: el.className,
    marginTop: getComputedStyle(el).marginTop,   // must be "32px", not "0px"
    fontSize: getComputedStyle(el).fontSize,
  };
}
```

`marginTop: "0px"` on an element with `mt-8` means the recipe stylesheet is
unlayered. `pitfalls.md` §1.

### 3b. Did the tokens resolve?

```js
() => {
  const cs = n => getComputedStyle(document.querySelector(n));
  return {
    canvas:  cs('body').backgroundColor,               // rgb(250, 249, 247)
    btnBg:   cs('.ad-btn--primary').backgroundColor,   // rgb(26, 23, 20)
    link:    cs('.ad-link').color,                     // rgb(174, 61, 18)
    display: cs('.ad-display').fontSize,
  };
}
```

A token that resolved to `rgba(0, 0, 0, 0)` or a fallback is a typo'd custom
property — `pitfalls.md` §2. A link reading `rgb(240, 90, 40)` means someone
used `--ad-accent` where `--ad-accent-text` belongs — that's a 3.39:1 failure.

### 3c. Did a state machine actually run?

Sample over time rather than photographing one instant:

```js
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = [];
  for (let i = 0; i < 6; i++) {
    const el = document.querySelector('.ad-steps');
    out.push({
      t: i * 700,
      active: el?.querySelector('.ad-step--active')?.dataset.step,
      opacity: getComputedStyle(el.querySelector('.ad-reveal')).opacity,
    });
    await sleep(700);
  }
  return out;
}
```

You want to see the states change. That's proof; a picture isn't.

### 3d. Did anything shift?

For anything that streams, types, or gets swapped in:

```js
() => document.querySelector('.ad-bento__visual').getBoundingClientRect().height
```

Measure before and after. Equal, or the reserved space is wrong.

---

## 4. The two audits

Both must come back empty. Run them at **1440 and 1280** — four of the type
tokens are `clamp()`s and resolve differently, so a single-width check misses a
rule that only misbehaves at one size.

### 4a. Type scale

The script is in `SKILL.md` §"Closing the scale". It resolves the sixteen tokens
*through the browser* and flags any rendered text node that isn't on one of
them, plus any leading outside the seven permitted values.

Scroll to the bottom and wait before sampling, or unrevealed sections report
whatever they inherit rather than what they'll paint.

### 4b. Contrast

The script is in `light-surfaces.md` §1. It walks up to each node's real
background, so it catches inherited colours and inverted bands that a
token-table review can't.

**Run it a second time inside any `.ad-invert` band.** The tokens are different
there, and a component that passes on paper can fail on the dark ground.

---

## 5. Keyboard and hover

### 5a. Tab the page

**Use real key presses.** `el.focus()` does not trigger `:focus-visible` and
will tell you there are no focus rings when there are — `pitfalls.md` §6.

```js
async (page) => {
  const out = [];
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    out.push(await page.evaluate(() => {
      const el = document.activeElement, s = getComputedStyle(el);
      return {
        cls: el.className.toString().slice(0, 26),
        outline: s.outlineStyle === 'none' ? null : `${s.outlineColor} ${s.outlineWidth}`,
        shadow: s.boxShadow === 'none' ? null : s.boxShadow.slice(0, 40),
      };
    }));
  }
  return JSON.stringify(out);
}
```

Pass condition: **every row shows at least one indicator**, and the outline
colour is `rgb(240, 90, 40)`. A ring in some other hue means a global base rule
is leaking.

### 5b. Probe hover

Every control ships hover, focus-visible, active and disabled at build time.
Verify mechanically rather than trusting the stylesheet:

```js
async (page) => {
  const probe = async (sel, name) => {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    const read = () => el.evaluate(n => {
      const s = getComputedStyle(n);
      return `${s.backgroundColor}|${s.borderTopColor}|${s.color}|${s.boxShadow.slice(0,24)}`;
    });
    const before = await read();
    await el.hover({ force: true });
    await page.waitForTimeout(400);          // past --ad-dur-base
    return { name, changed: before !== (await read()) };
  };
  return JSON.stringify([
    await probe('main .ad-btn--primary', 'primary'),
    await probe('main .ad-btn--secondary', 'secondary'),
    await probe('.ad-link', 'accent link'),
    await probe('.ad-chip', 'chip'),
    await probe('.ad-accordion__trigger', 'accordion'),
    await probe('.ad-input', 'input'),
  ]);
}
```

`changed: false` on any row is a missing hover state. Scope past deliberately
hidden decoys (`main .ad-btn--primary`), and remember a hover *timeout* may be
correct behaviour — `pitfalls.md` §9.

---

## 6. Reduced motion

```js
async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(1200);
  return await page.evaluate(() => JSON.stringify({
    revealOpacity: getComputedStyle(document.querySelector('.ad-reveal')).opacity,
    revealTransform: getComputedStyle(document.querySelector('.ad-reveal')).transform,
    marqueeDuration: getComputedStyle(document.querySelector('.ad-marquee__track')).animationDuration,
    // JS-driven sequences must resolve to their FULL state, not freeze
    cycledItems: document.querySelectorAll('.ad-cycle-item').length,
    caretPresent: !!document.querySelector('.ad-caret'),
  }));
}
```

Pass condition: opacities `1`, transforms `none`, animation durations
effectively zero, **the cycling component renders all its items**, and any
typewriter renders its whole output with no caret.

Then reset: `page.emulateMedia({ reducedMotion: 'no-preference' })`.

The last two are the ones CSS can't fix and are therefore the ones most likely
to be broken — `motion.md` §6.

---

## 7. Sanity checks worth automating

```js
// Every colour came from a token — no orphan hexes in inline styles
() => [...document.querySelectorAll('[style]')]
  .map(n => n.getAttribute('style'))
  .filter(s => /#[0-9a-f]{3,8}\b|rgba?\(/i.test(s));

// Exactly one primary button in the viewport, and it is near-black
() => [...document.querySelectorAll('.ad-btn--primary')].filter(n => {
  const r = n.getBoundingClientRect();
  return r.top < innerHeight && r.bottom > 0 && getComputedStyle(n).opacity !== '0';
}).map(n => getComputedStyle(n).backgroundColor);

// The shadow budget: every shadowed element must be one of the two recipes
() => [...document.querySelectorAll('*')]
  .filter(n => {
    const s = getComputedStyle(n).boxShadow;
    return s !== 'none' && !/inset/.test(s);
  })
  .map(n => n.className.toString())
  .filter(c => !/ad-lift|ad-segmented__item|ad-input/.test(c));   // must be []

// Nothing but a button or badge wears a pill radius
() => [...document.querySelectorAll('*')]
  .filter(n => parseInt(getComputedStyle(n).borderRadius) > 100)
  .map(n => n.className.toString())
  .filter(c => !/ad-btn|ad-chip|ad-dot|ad-eyebrow-pill|ad-badge-credibility|ad-segmented/.test(c));

// Exactly one bloom per page, and it is on the hero
() => document.querySelectorAll('.ad-bloom').length;   // must be 0 or 1

// The one-step rule: no element shares a background with its parent  (pitfalls §14)
() => [...document.querySelectorAll('.ad-card, .ad-panel, .ad-bento')]
  .filter(n => getComputedStyle(n).backgroundColor
            === getComputedStyle(n.parentElement).backgroundColor)
  .map(n => n.className.toString());

// Radius decreases as you nest
() => [...document.querySelectorAll('.ad-card, .ad-panel, .ad-well')]
  .filter(n => {
    const p = n.parentElement.closest('.ad-card, .ad-panel, .ad-panel-xl');
    return p && parseInt(getComputedStyle(n).borderRadius)
              >= parseInt(getComputedStyle(p).borderRadius);
  })
  .map(n => n.className.toString());

// Rule 2, on COMPUTED values: every warm neutral must satisfy R >= G >= B.
// This is the check the greps below CANNOT do. A cool grey that arrived via a
// Tailwind class, a UA default, or a pasted reference has no literal to find —
// but it is still blue, and this catches it in one pass.
//
// Two exclusions, both necessary or the result is all false positives:
//   - Pure greys (R === G === B) and alpha-0. #000, #fff and a transparent
//     border are not the failure mode.
//   - The SEMANTIC and CHART tokens, which are allowed to be cool: a blue
//     "info" badge and a green "positive" badge are not rule-2 breaks. Verified:
//     --ad-positive, --ad-info and both their washes all fail R >= G >= B by
//     design. They are resolved THROUGH THE BROWSER rather than hardcoded, so
//     the allowlist cannot drift from tokens.css.
// Anything returned is a genuine rule-2 break.
() => {
  const ALLOWED = ['--ad-positive','--ad-positive-wash','--ad-info','--ad-info-wash',
    '--ad-caution','--ad-caution-wash','--ad-critical','--ad-critical-wash',
    '--ad-series-1','--ad-series-2','--ad-series-3',
    '--ad-series-4','--ad-series-5','--ad-series-6'];
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden';
  document.body.appendChild(probe);
  const key = v => (v.match(/\d+/g) || []).slice(0, 3).join(',');
  const ok = new Set(ALLOWED.map(t => {
    probe.style.color = '';
    probe.style.color = `var(${t})`;
    return key(getComputedStyle(probe).color);
  }));
  probe.remove();

  return [...document.querySelectorAll('body *')]
    .flatMap(n => {
      const cs = getComputedStyle(n);
      return ['backgroundColor', 'borderTopColor', 'color'].map(p => [p, cs[p]]);
    })
    .filter(([, v]) => /^rgba?\(/.test(v) && !/,\s*0\)$/.test(v))
    .filter(([, v]) => !ok.has(key(v)))
    .map(([p, v]) => [p, v, v.match(/\d+/g).slice(0, 3).map(Number)])
    .filter(([, , [r, g, b]]) => !(r === g && g === b) && !(r >= g && g >= b))
    .map(([p, v]) => `${p}: ${v}`)
    .filter((v, i, a) => a.indexOf(v) === i);   // must be []
};

// Font smoothing — `antialiased` thins weight-500 display type on paper and is
// the most likely reason a correctly-built page still looks washed out. Check
// the COMPUTED value on body, not the stylesheet: most Next/Tailwind starters
// ship the class on <body>, which beats recipes.css §0.
() => getComputedStyle(document.body).webkitFontSmoothing;   // must be 'auto'

// Rule 10, the audacity budget: exactly one display-step headline per page.
() => {
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;font-size:var(--ad-display)';
  document.body.appendChild(probe);
  const target = parseFloat(getComputedStyle(probe).fontSize).toFixed(2);
  probe.remove();
  return [...document.querySelectorAll('body *')]
    .filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()))
    .filter(n => parseFloat(getComputedStyle(n).fontSize).toFixed(2) === target)
    .map(n => n.textContent.trim().slice(0, 40));   // must be length 1
};
```

And the greps, from the shell rather than the browser:

```bash
# Rule 2 — no cool greys anywhere
rg -i '#f9fafb|#f3f4f6|#e5e7eb|#d1d5db|#9ca3af|#6b7280|#374151|#1f2937|#111827' --glob '!*.md'
rg '\b(bg|text|border)-(gray|slate|zinc|neutral|stone)-\d{2,3}\b'

# Rule 1 — no colour or size literals outside the token file
rg -n '(font-size|line-height):\s*\d' --glob '!**/tokens.css' styles/
rg -n 'text-\[\d+px\]'
```

---

## 8. Console and toolchain

```
browser_console_messages  level: "error", all: true    → must be 0
```

Then, before calling anything done:

```bash
npx tsc --noEmit        # types
<lint command>          # formatting + rules
<test command>          # unit tests
<build command>         # the real gate — catches what dev server tolerates
```

A dev server is forgiving in ways a production build is not. **The build is the
gate**, and it's worth running even for a pure styling change.

---

## 9. Isolation

Audacious is scoped to `experimentalFrontend/`. If you've touched anything that
could reach further — a shared config, a root layout, a font import — navigate
to a page that should be untouched and confirm it is. Scoping bugs are silent
and one-directional: the new system usually looks fine while quietly restyling
something three routes away.

Equally, if you fixed something outside your scope to unblock a build, say so
explicitly in the summary. Silent out-of-scope fixes are how a styling change
turns into a mystery regression later.
