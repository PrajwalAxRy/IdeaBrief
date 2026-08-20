# Verification

**A screenshot proves a thing looks right. It does not prove a rule applied.**

Most of the expensive failures in `pitfalls.md` are invisible in a screenshot —
the page looks plausible, just tighter or duller than intended. So the loop is
*look, then measure*, and the measuring is not optional.

Driven through the Playwright MCP against a running dev server.

---

## 1. The loop

```
1. Start dev server, navigate at 1440×900
2. Screenshot each section          → does it read right?
3. Measure the rules                → did the CSS actually apply?
4. Tab the whole page               → is every control reachable and visible?
5. Probe hover on every control     → does each one respond?
6. Emulate reduced motion           → does it resolve, or freeze?
7. Repeat at 1280
8. Console: zero errors
9. Build + typecheck + lint + tests
```

Steps 3–6 are the ones that get skipped and the ones that find bugs.

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
() => document.querySelectorAll('.ob-pillar-panel')[1].scrollIntoView({ block: 'center' })
```

**Two traps here, both in `pitfalls.md`:**

- Anything cycling (§8) will be caught mid-state and look broken. Drive it to a
  known state first.
- Anything with an entrance transition (§7) needs a beat before capture.

Read at **1440 and 1280**. No mobile — this system is desktop-only.

---

## 3. Measure

This is the step that distinguishes a verified screen from a screenshotted one.

### 3a. Did the cascade work?

The highest-value single check in the system. Pick an element carrying both a
recipe class and a layout utility, and confirm the utility won:

```js
() => {
  const el = document.querySelector('#pillars-headline');   // "ob-h1 mt-8"
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
  const btn = document.querySelector('.ob-btn-primary');
  return {
    canvas: getComputedStyle(document.querySelector('[data-theme]')).backgroundColor,
    btnBg: getComputedStyle(btn).backgroundColor,      // rgb(45, 127, 249)
    display: getComputedStyle(document.querySelector('.ob-display')).fontSize,
  };
}
```

A token that resolved to `rgba(0, 0, 0, 0)` or a fallback is a typo'd custom
property — `pitfalls.md` §3.

### 3c. Did a state machine actually run?

Sample it over time rather than photographing one instant:

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
      verdict: getComputedStyle(card.querySelector('.ob-verdict')).opacity,
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
() => document.querySelector('.ob-frag').getBoundingClientRect().height
```

Measure before and after. Equal, or the reserved space is wrong.

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
the system accent.** A ring in some other hue means a global base rule is
leaking — `pitfalls.md` §2.

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
    await page.waitForTimeout(500);          // past --ob-base
    return { name, changed: before !== (await read()) };
  };
  return JSON.stringify([
    await probe('main .ob-btn-primary', 'primary'),
    await probe('main .ob-btn-ghost', 'ghost'),
    await probe('.ob-nav-link', 'nav link'),
    await probe('.ob-seed', 'chip'),
    await probe('.ob-footer-link', 'footer link'),
  ]);
}
```

`changed: false` on any row is a missing hover state.

Two notes: scope past deliberately-hidden decoys (`main .ob-btn-primary`, not
`.ob-btn-primary`, when a header holds a hidden CTA), and a hover *timeout* may
be correct behaviour — `pitfalls.md` §9.

---

## 5. Reduced motion

```js
async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(1200);
  return await page.evaluate(() => JSON.stringify({
    headlineOpacity: getComputedStyle(document.querySelector('.ob-display')).opacity,
    wordTransform: getComputedStyle(document.querySelector('.ob-word')).transform,
    revealOpacity: getComputedStyle(document.querySelector('.ob-reveal')).opacity,
    marqueeDuration: getComputedStyle(document.querySelector('.ob-marquee-track')).animationDuration,
    // JS-driven sequences must resolve to their FULL state, not freeze
    evidenceCards: document.querySelectorAll('.ob-evidence').length,
    chatBubbles: document.querySelectorAll('.ob-bubble').length,
    caretPresent: !!document.querySelector('.ob-caret'),
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

// Exactly one primary button in the viewport
() => [...document.querySelectorAll('.ob-btn-primary')].filter(n => {
  const r = n.getBoundingClientRect();
  const visible = r.top < innerHeight && r.bottom > 0;
  return visible && getComputedStyle(n).opacity !== '0';
}).length;

// Nothing but a button wears a pill radius
() => [...document.querySelectorAll('*')]
  .filter(n => parseInt(getComputedStyle(n).borderRadius) > 100)
  .filter(n => !n.className.toString().includes('ob-btn'))
  .map(n => n.className.toString());

// No shadows outside the primary-button hover glow
() => [...document.querySelectorAll('*')]
  .filter(n => getComputedStyle(n).boxShadow !== 'none')
  .map(n => n.className.toString());

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

Equally, if you fixed something outside your scope to unblock the build, say so
explicitly in the summary. Silent out-of-scope fixes are how a "styling change"
turns into a mystery regression later.
