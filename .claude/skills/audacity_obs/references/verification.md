# Verification

**A screenshot proves a thing looks right. It does not prove a rule applied.**

Most of the expensive failures in `pitfalls.md` are invisible in a screenshot —
the page looks plausible, just tighter or duller than intended. So the loop is
*look, then measure*, and the measuring is not optional.

A light theme raises the stakes on this. On near-black, a broken rule usually
produced something visibly wrong; on paper, most failures produce something
that reads as *slightly bland*, which passes a glance every time. §3e and §6
carry the checks that exist only because of that.

Driven through the Playwright MCP against a running dev server.

---

## 1. The loop

```
0. grep for cool greys in source     → light-surfaces.md §4
1. Start dev server, navigate at 1440×900
2. Screenshot each section           → does it read right?
3. Measure the rules                 → did the CSS actually apply?
   3e. CONTRAST AUDIT, incl. a void band  → light-surfaces.md §1
4. Tab the whole page                → is every control reachable and visible?
5. Probe hover on every control      → does each one respond?
6. Emulate reduced motion            → does it resolve, or freeze?
7. Repeat at 1280
8. Console: zero errors
9. Build + typecheck + lint + tests
```

Steps 3–6 are the ones that get skipped and the ones that find bugs. Step 3e is
the one that only exists because the ground is light, and it is the one that
found real defects in this system's own tokens.

---

## 2. Look

```
browser_resize  1440 × 900
browser_navigate  http://localhost:3000
browser_take_screenshot
```

Scroll by section rather than taking one enormous full-page capture — a 7000px
image is unreadable and burns context:

```js
() => document.querySelectorAll('.au-pillar-panel')[1].scrollIntoView({ block: 'center' })
```

**Three traps here:**

- Anything cycling (`pitfalls.md` §8) will be caught mid-state and look broken.
  Drive it to a known state first.
- Anything with an entrance transition (§7) needs a beat before capture.
- **A light theme photographs flatteringly.** Low-contrast mistakes — a hairline
  that vanished, a fragment whose rows merged, a disabled-looking inactive panel
  — survive a screenshot review far more often than they would on near-black.
  Look at the *structure* in each capture, not the impression: can you count the
  rules? Can you count the rows?

Read at **1440 and 1280**. No mobile — this system is desktop-only.

---

## 3. Measure

This is the step that distinguishes a verified screen from a screenshotted one.

### 3a. Did the cascade work?

The highest-value single check in the system. Pick an element carrying both a
recipe class and a layout utility, and confirm the utility won:

```js
() => {
  const el = document.querySelector('#pillars-headline');   // "au-h1 mt-8"
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
  const btn = document.querySelector('.au-btn-primary');
  return {
    canvas: getComputedStyle(document.body).backgroundColor,   // rgb(250, 246, 240)
    btnBg: getComputedStyle(btn).backgroundColor,              // rgb(191, 68, 19)
    display: getComputedStyle(document.querySelector('.au-display')).fontSize,
    smoothing: getComputedStyle(document.body).webkitFontSmoothing,  // "auto"
  };
}
```

A token that resolved to `rgba(0, 0, 0, 0)` or a fallback is a typo'd custom
property — `pitfalls.md` §3. `smoothing: "antialiased"` is `pitfalls.md` §13
and is worth catching here rather than after a round of "it looks thin".

### 3c. Did a state machine actually run?

Sample it over time rather than photographing one instant:

```js
async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = [];
  for (let i = 0; i < 6; i++) {
    const card = document.querySelector('.au-evidence');
    out.push({
      t: i * 700,
      state: card?.dataset.state,
      rule: getComputedStyle(card.querySelector('.au-verify-rule')).transform,
      verdict: getComputedStyle(card.querySelector('.au-verdict')).opacity,
    });
    await sleep(700);
  }
  return out;
}
```

You want to see the states change and the transform go `matrix(0,…)` →
`matrix(1,…)`. That's proof; a picture isn't.

### 3d. Did anything shift?

For anything that streams, types, or gets swapped in:

```js
() => document.querySelector('.au-frag').getBoundingClientRect().height
```

Measure before and after. Equal, or the reserved space is wrong.

### 3e. Does every text node clear AA? *(light-theme only)*

**The single highest-value check in this system**, and it lives in
`light-surfaces.md` §1 rather than being duplicated here. Run it per route, and
run it again with a `--au-void` band in view — checking only against the canvas
is exactly how this system shipped a failing metadata layer in its own first
draft (`light-surfaces.md` §2.1).

Anything it returns other than `--au-discard` (which is exempt, conditionally —
§2.5) is a bug.

### 3f. Is the line work still reading? *(light-theme only)*

The hairline is the layout, and on paper it is a 4–5% lightness step rather
than the ~13% step it was on near-black. It survives a design tool and a
screenshot and then disappears on a real display with a slightly aggressive
contrast profile. Measure the actual delta:

```js
// Relative-luminance gap between every rule and the surface behind it.
() => {
  const lum = c => {
    const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number)
      .map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    if (parseFloat(s.borderTopWidth) < 1) return;
    if (s.borderTopStyle === 'none') return;
    let p = el.parentElement, bg = 'rgba(0, 0, 0, 0)';
    while (p && bg === 'rgba(0, 0, 0, 0)') { bg = getComputedStyle(p).backgroundColor; p = p.parentElement; }
    if (bg === 'rgba(0, 0, 0, 0)') return;
    const d = Math.abs(lum(s.borderTopColor) - lum(bg));
    if (d < 0.02) out.push({ cls: el.className.toString().slice(0, 30), d: +d.toFixed(3) });
  });
  return [...new Map(out.map(o => [o.cls, o])).values()];
}
```

Anything returned is a rule you cannot rely on seeing. The fix is
`--au-hairline-strong` on that element, never a new token and never a thicker
border — a 2px rule is a different design.

Run the same idea on the fragment card: header bar, body, and row rules should
come back as three distinguishable values, not one.

---

## 4. Keyboard and hover

### 4a. Tab the page

**Use real key presses.** `el.focus()` does not trigger `:focus-visible` and
will tell you there are no focus rings when there are — `pitfalls.md` §6.

```js
async (page) => {
  const out = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    out.push(await page.evaluate(() => {
      const el = document.activeElement, s = getComputedStyle(el);
      return {
        cls: el.className.toString().slice(0, 26),
        outline: s.outlineStyle === 'none' ? null : `${s.outlineColor} ${s.outlineWidth}`,
        shadow: s.boxShadow === 'none' ? null : s.boxShadow.slice(0, 50),
        underline: s.textDecorationLine === 'none' ? null : 'underline',
      };
    }));
  }
  return JSON.stringify(out);
}
```

Pass condition: **every row shows at least one indicator, and every colour is
`rgb(191, 68, 19)`.** A ring in any other hue — and blue in particular — means a
global base rule is leaking, `pitfalls.md` §2.

### 4b. Probe hover

The system requires hover, focus-visible, active, and disabled on every control
at build time. Verify hover mechanically rather than trusting the stylesheet:

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
    await page.waitForTimeout(500);          // past --au-base
    return { name, changed: before !== (await read()) };
  };
  return JSON.stringify([
    await probe('main .au-btn-primary', 'primary'),
    await probe('main .au-btn-ghost', 'ghost'),
    await probe('.au-nav-link', 'nav link'),
    await probe('.au-seed', 'chip'),
    await probe('.au-footer-link', 'footer link'),
  ]);
}
```

`changed: false` on any row is a missing hover state. **Include at least one
control that sits on `--au-void` or inside an inverted band** — that is where a
darkening hover wash silently does nothing, and this probe is the only thing
that catches it (`pitfalls.md` §15).

Two notes: scope past deliberately-hidden decoys (`main .au-btn-primary`, not
`.au-btn-primary`, when a header holds a hidden CTA), and a hover *timeout* may
be correct behaviour — `pitfalls.md` §9.

### 4c. The primary button's hover is legible

Specific to this system, because the hover direction is inverted from the
parent's. Confirm the fill went *darker* and the label still clears 4.5:1:

```js
async (page) => {
  const btn = page.locator('main .au-btn-primary').first();
  const read = () => btn.evaluate(n => {
    const s = getComputedStyle(n);
    return { bg: s.backgroundColor, fg: s.color };
  });
  const before = await read();
  await btn.hover();
  await page.waitForTimeout(500);
  return { before, after: await read() };
}
```

The `after.bg` channels must all be **lower** than `before.bg`. Higher means
someone reached for a `-bright` token that doesn't exist here, or defined one.

---

## 5. Reduced motion

```js
async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(1200);
  return await page.evaluate(() => JSON.stringify({
    headlineOpacity: getComputedStyle(document.querySelector('.au-display')).opacity,
    wordTransform: getComputedStyle(document.querySelector('.au-word')).transform,
    revealOpacity: getComputedStyle(document.querySelector('.au-reveal')).opacity,
    marqueeDuration: getComputedStyle(document.querySelector('.au-marquee-track')).animationDuration,
    // JS-driven sequences must resolve to their FULL state, not freeze
    evidenceCards: document.querySelectorAll('.au-evidence').length,
    chatBubbles: document.querySelectorAll('.au-bubble').length,
    caretPresent: !!document.querySelector('.au-caret'),
  }));
}
```

Pass condition:

- opacities `1`, transforms `none` — nothing stuck part-way
- animation durations effectively zero
- **the cycling component renders all its items**, not one
- **the typewriter renders the whole transcript**, no caret

Then reset: `page.emulateMedia({ reducedMotion: 'no-preference' })`.

The last two are the ones CSS can't fix and are therefore the ones most likely
to be broken — `motion.md` §6.

---

## 6. Sanity checks worth automating

```js
// Every colour on the page came from a token — no orphan hexes in inline styles
() => [...document.querySelectorAll('[style]')]
  .map(n => n.getAttribute('style'))
  .filter(s => /#[0-9a-f]{3,8}\b|rgba?\(/i.test(s));

// NOTHING IS COOL. Every surface, border and text colour must be warm (R > B).
// This is the single highest-value Audacity-only check: one leaked neutral
// grey breaks the paper, and it is invisible in isolation.
() => {
  const cool = [];
  const warm = c => {
    const m = c.match(/\d+/g); if (!m) return true;
    const [r, , b] = m.map(Number);
    if (c.includes('rgba') && parseFloat(c.split(',')[3]) === 0) return true;
    return r >= b;
  };
  document.querySelectorAll('body *').forEach(n => {
    const s = getComputedStyle(n);
    for (const p of ['backgroundColor', 'color', 'borderTopColor']) {
      if (!warm(s[p])) cool.push(`${p} ${s[p]} — ${n.className.toString().slice(0, 30)}`);
    }
  });
  return [...new Set(cool)];
}

// Exactly one primary button in the viewport
() => [...document.querySelectorAll('.au-btn-primary')].filter(n => {
  const r = n.getBoundingClientRect();
  const visible = r.top < innerHeight && r.bottom > 0;
  return visible && getComputedStyle(n).opacity !== '0';
}).length;

// Nothing but a button wears a pill radius
() => [...document.querySelectorAll('*')]
  .filter(n => parseInt(getComputedStyle(n).borderRadius) > 100)
  .filter(n => !n.className.toString().includes('au-btn'))
  .map(n => n.className.toString());

// No shadows outside the primary-button hover glow
() => [...document.querySelectorAll('*')]
  .filter(n => getComputedStyle(n).boxShadow !== 'none')
  .map(n => n.className.toString());

// No weight above 400 outside the mono meta layer
() => [...document.querySelectorAll('body *')]
  .filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()))
  .filter(n => {
    const s = getComputedStyle(n);
    return +s.fontWeight > 400 && !s.fontFamily.toLowerCase().includes('mono');
  })
  .map(n => `${getComputedStyle(n).fontWeight} ${n.className.toString().slice(0, 30)}`);

// Nothing still reaching for the dark system
() => [...document.querySelectorAll('[style]')]
  .map(n => n.getAttribute('style'))
  .filter(s => s.includes('--ob-') || s.includes('--rl-'));

// Sticky columns aren't trapped in an overflow container  (pitfalls §5)
() => {
  const el = document.querySelector('.sticky'); let n = el?.parentElement, bad = [];
  while (n && n !== document.body) {
    if (getComputedStyle(n).overflow !== 'visible') bad.push(n.className.toString());
    n = n.parentElement;
  }
  return bad;
}
```

The warm check and the weight check are the two that only exist here. The first
catches a leaked neutral before it becomes five leaked neutrals; the second
catches the "it looks thin, bump it to 500" fix before it ships
(`pitfalls.md` §13).

---

## 7. Console and toolchain

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

## 8. If the app changed under you

When adding a page to an existing project, verify the new system is **isolated**
if it's supposed to be — navigate to a page that should be untouched and
confirm it is. Scoping bugs are silent and one-directional: the new theme
usually looks fine while quietly restyling something three routes away.

**This matters more than usual for Audacity**, because it will normally be
introduced next to a system holding the global `:root`. Two directions to check,
and both are silent:

- **Audacity leaking out.** Navigate to a dark route and confirm it is still
  dark. A second `:root` block instead of a `[data-theme='audacity']` scope
  restyles the entire app by source order, and the page you were working on
  looks perfect throughout.
- **The dark system leaking in.** Run §6's cool-colour check *and* the
  `--ob-`/`--rl-` check on the Audacity route. A near-black token inside an
  Audacity wrapper resolves fine and paints dark-on-dark with no error — the
  element simply becomes unreadable, which reads as a missing element rather
  than as a wrong colour.

Equally, if you fixed something outside your scope to unblock the build, say so
explicitly in the summary. Silent out-of-scope fixes are how a "styling change"
turns into a mystery regression later.
