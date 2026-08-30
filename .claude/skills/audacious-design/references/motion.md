# Motion

Read this before adding any animation, scroll behaviour, reveal, or transition.

---

## 1. The philosophy: two speeds, and nothing between them

Motion here is either **ambient and slow** or **structural and fast**. The gap
between them is deliberate — it is what keeps a page composed rather than busy.

| | Ambient | Structural |
|---|---|---|
| Duration | 20s+ | 150–900ms |
| Trigger | none, infinite | user action or scroll position |
| Purpose | atmosphere | communicates state or arrival |
| Subtlety | a screenshot can't tell it's moving | clearly visible |
| Reduced motion | **stopped** | **resolved to end state** |

A 2-second easing curve on a hover, or a 3-second "fun" loop, belongs to
neither category. Delete it.

Within *structural*, one further rule, and it is the one that keeps this system
from turning into a showreel: **there is one reveal recipe and every entering
element uses it.** All four visual references behind this system animate every
element of every section identically — fade from 0, rise 20px, once on scroll,
staggered by index — and not one of them varies it for emphasis.

**The variety on a page comes from the content, not the choreography.** A page
where the cards fade, the headline slides, the chart wipes and the stat counts
is not more alive; it is noisier, and every one of those motions competes for
the attention the content needs.

So the complete vocabulary is:

| Class | What | Duration |
|---|---|---|
| **Reveal** | Everything entering on scroll. One recipe. | `--ad-dur-reveal` 500ms |
| **Structural** | Hover, focus, tab change, accordion, layout swap. | 150 / 220 / 320ms |
| **Mechanic** | A sequence that *is* the argument. Rare — see §7. | `--ad-dur-enter` 900ms |
| **Ambient** | Marquee, live dot, paper tooth. That is the whole list. | 20s+ / 2s / static |

---

## 2. No animation library

Everything below is CSS transitions + `IntersectionObserver` + at most **one**
`requestAnimationFrame` listener per page. That is enough for the entire system,
and it means:

- No hydration cost for motion.
- No library version risk.
- Animations are GPU-composited, because they are plain CSS transitions.
- Reduced motion is handled in one media query rather than at N call sites.

Reach for a library only when you need physics — spring-following drag, gesture
velocity. Scroll reveals, count-ups and typewriters don't.

If you are already using `motion` v12, `whileInView` with
`viewport={{ once: true }}` is the equivalent of §3 and is what the references
do. Either is fine. **Don't mix both in one page.**

---

## 3. The reveal

```css
.ad-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--ad-dur-reveal) var(--ad-ease-out),
    transform var(--ad-dur-reveal) var(--ad-ease-out);
}
.ad-reveal[data-revealed='true'] { opacity: 1; transform: none; }
```

`--ad-ease-out` is `cubic-bezier(0.16, 1, 0.3, 1)` — fast out of the gate, long
settle. It is what makes 500ms read as crisp rather than slow.

**20px, not 40.** A long rise reads as a page that isn't ready. The element
should look like it is settling, not arriving from off-screen.

**No blur on the reveal.** The dark ancestor system adds `filter: blur(8px)` so
elements resolve into focus rather than sliding in, and on a near-black ground
that is the single detail separating it from a generic fade-up. On paper it is
the opposite: blurred dark text on white reads as a font that hasn't loaded, and
the first frame looks like a rendering fault rather than an intention. Rise and
fade only.

**Never animate a headline's individual words or characters.** Per-word mask
reveals are the signature motion of the dark system and they do not survive
inversion for the same reason: text emerging from a dark ground reads as
arriving, while half-revealed black words on paper read as broken. This is not a
tuning problem — there is no stagger value that fixes it.

### Implementation

Use an `IntersectionObserver`, not a scroll listener, and **disconnect after
firing** — `once` is not optional. A reveal that replays on scroll-up is the
fastest way to make a page feel cheap.

Note the two fall-open branches. Both matter more than they look: a reveal that
fails to fire leaves content at `opacity: 0` forever, so every failure path has
to end with the content **shown**, never with it hidden.

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

export function Reveal({ index = 0, children }: { index?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Resolve immediately rather than observing — see §9.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    // Fall OPEN, never closed: no observer means show the content.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },   // fire just before fully in view
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="ad-reveal"
      data-revealed={shown}
      style={{ '--ad-i': index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
```

**Reserve the space.** A revealing element must occupy its final height from
first paint. `opacity` and `transform` don't affect layout, which is exactly why
the recipe uses them and nothing else — never reveal with `height`, `margin` or
`display`.

**Above-the-fold content triggers on mount, not on intersection.** A hero that
is already in view when the page loads will never fire an intersection callback
in some browsers. Trigger it one `requestAnimationFrame` after paint so it still
starts from its hidden state.

---

## 4. Stagger

Delay by index: `--ad-stagger` (100ms) × position.

```css
.ad-reveal[style*='--ad-i'] { transition-delay: calc(var(--ad-i, 0) * var(--ad-stagger)); }
```

The `, 0` fallback is not decorative. **An undefined custom property voids the
whole declaration** — without it, a missing `--ad-i` kills `transition-delay`
silently, with no error anywhere. See `pitfalls.md` §2.

**Cap the stagger at six.** Beyond that the last item waits over half a second
after the first and the group stops reading as a group. For a longer list,
restart the index per row, or stagger the rows rather than the items.

**Stagger within a group, never across sections.** Each section's stagger starts
at 0. A page-wide index means section eight begins its entrance three seconds
after it is already on screen.

---

## 5. Structural transitions

Three durations, and the choice is mechanical:

| Duration | For |
|---|---|
| `--ad-dur-fast` 150ms | Colour changes: hover, focus, active. Anything where the user is already looking at the thing. |
| `--ad-dur-base` 220ms | The default. Border swaps, small position shifts, chip state. |
| `--ad-dur-slow` 320ms | Something changing size: accordion open, panel expand, layout change. |

**Transition named properties, never `all`.** `transition: all` picks up
`width`, `height` and `box-shadow` changes you didn't intend, and on a card grid
it turns a hover into a layout reflow.

**Focus rings get `transition: none`.** A ring that fades in over 220ms reads as
lag, and it is a genuine usability bug for keyboard users. `recipes.css` §16
sets this; don't override it.

### Tab and panel changes

Cross-fade the content, move the indicator. The indicator is the accent rule
under the active tab — one of the accent's three jobs, and the only thing that
should slide.

With `motion`, `layoutId` on the indicator does this for free. Keep it to 220ms;
a sliding underline is a small object and a long duration makes it feel heavy.

---

## 6. Scroll-driven patterns

### 6a. Sticky scrollytelling — the house layout

The house layout for **2–4 sequential ideas**. A sticky left column, a normally
scrolling right column, and a thin observer band across the viewport middle
deciding which panel is live. It produces the "pinned, advancing one at a time"
feel **without ever taking the scrollbar from the user**, which is the entire
reason it exists here rather than scroll-jacking or scroll-snap.

Recipe: `recipes.css` §18. Markup:

```jsx
<div className="ad-scrolly">
  <div><div className="ad-scrolly__aside">{/* head + rail */}</div></div>
  <div className="ad-scrolly__panels">{/* panels, data-index + data-active */}</div>
</div>
```

```js
const visible = new Set();
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const i = Number(entry.target.dataset.index);
    if (entry.isIntersecting) visible.add(i); else visible.delete(i);
  }
  if (visible.size > 0) setActive(Math.min(...visible));   // keep last when between
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });     // 10% band at the middle
```

- `rootMargin: '-45% 0px -45% 0px'` is a 10%-tall band across the viewport
  centre. A panel goes live when it crosses the reader's eyeline, not when it
  first appears at the bottom.
- **Keep the last active when nothing intersects**, or the rail flickers back to
  panel 0 in the gaps between panels. That is what the `visible.size > 0` guard
  is doing — it is not a null check.
- **Make the rail's ticks real `<button>`s** that scroll to their panel with
  `block: 'center'`. A rail the reader can see but not use is decoration
  pretending to be navigation.
- Inactive panels sit at `--ad-dim-inactive` (0.45). Lower and they read as
  disabled rather than as not-yet-your-turn.
- **Check `overflow` on ancestors** — see `pitfalls.md` §5. An `overflow: hidden`
  anywhere up the tree silently kills `position: sticky` with no error.

### 6b. Marquee

```css
.ad-marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.ad-marquee__track { display: flex; width: max-content; animation: ad-marquee 46s linear infinite; }
.ad-marquee:hover .ad-marquee__track { animation-play-state: paused; }
@keyframes ad-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

For a seamless loop the track must contain **the same set twice** and translate
exactly `-50%`:

```js
const half  = [...ITEMS, ...ITEMS, ...ITEMS];   // enough copies to overfill the viewport
const track = [...half, ...half];               // then double it
```

- `linear`, never eased — an eased marquee visibly stutters at the loop point.
- Pause on hover. A moving strip the reader is trying to read is hostile.
- Use `mask-image` for the edge fade, **not two gradient overlays**: an overlay
  has to know the band colour, and it breaks the moment the section moves to a
  different ground.
- **A marquee must carry real information.** A strip of adjectives is filler and
  reads as one.

### 6c. Parallax — no

The dark ancestor system has a rAF parallax collage and it is one of its better
moments. It does not come across. On a near-black canvas, layers moving at
different depths read as depth; on warm paper the same effect reads as elements
sliding out of alignment, because there is no shadow budget and no atmospheric
falloff to sell the distance. **No parallax on a light ground.**

If you need the hero to feel like it has depth, the answer is the one permitted
`.ad-bloom` behind the product panel plus `--ad-lift-panel`, which is the
system's actual vocabulary for "this floats".

---

## 7. Mechanic motion — when the animation *is* the argument

The one place a longer, sequenced animation is justified: when the thing being
animated is the claim the section is making. A section that says "we check every
source" is better served by a check visibly running than by a sentence and a
screenshot of a check that already ran.

This is `--ad-dur-enter` (900ms), and it is the only 900ms in the system.

### 7a. The state-machine sequence

An excerpt lands, a 1px rule draws itself left-to-right underneath it, a verdict
resolves.

```css
.ad-mechanic__rule {
  height: 1px; background: var(--ad-accent);
  transform: scaleX(0); transform-origin: left center;
  transition: transform var(--ad-dur-enter) var(--ad-ease-out);
}
[data-state='verified'] .ad-mechanic__rule,
[data-state='discarded'] .ad-mechanic__rule { transform: scaleX(1); }
[data-state='discarded'] .ad-mechanic__rule { background: var(--ad-faint); }
```

Driven by a two-beat timer, and **only while on screen**:

```js
useEffect(() => {
  if (!inView || reduced) return;
  const timer = setTimeout(() => {
    if (resolved) { setIndex(i => (i + 1) % ITEMS.length); setResolved(false); }
    else setResolved(true);
  }, resolved ? 2900 : 1200);
  return () => clearTimeout(timer);
}, [inView, resolved, reduced]);
```

- **Reserve the space** for the rule and the verdict in the pending state, so
  nothing shifts when they arrive.
- **Show the failure.** A demo where everything passes proves nothing; the
  discarded case is the argument. Note the discard goes `--ad-faint`, not
  `--ad-critical` — a rejected item is a non-event, not the user's fault.
- Give the reader cycle dots so they can drive it themselves.
- The accent here is doing job 2, verification. That is legitimate. A rule that
  drew itself in accent for *decoration* would not be.

### 7b. Typewriter

```jsx
function TypingBubble({ turn, onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= turn.text.length) {
      const hold = setTimeout(onDone, turn.role === 'user' ? 460 : 900);
      return () => clearTimeout(hold);
    }
    const tick = setTimeout(() => setCount(c => c + 1), turn.role === 'user' ? 24 : 15);
    return () => clearTimeout(tick);
  }, [count, turn, onDone]);
  return <Bubble turn={turn}>{turn.text.slice(0, count)}<span className="ad-caret" /></Bubble>;
}
```

- **15–26ms per character.** Slower feels broken; faster stops reading as typing.
- **Vary speed by speaker** — a human typing (24ms) and a machine answering
  (15ms) at identical rates reads as one voice.
- **Beat between turns:** ~460ms after a short turn, ~900ms after a long one.
- Keep the per-character state in the **leaf** component, or every tick
  re-renders the section. See `pitfalls.md`.
- **Reserve the finished transcript's height** on the container so the composer
  below never moves.

### 7c. Count-up

```js
useEffect(() => {
  if (!inView) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
  let frame = 0, start = 0;
  const step = time => {
    if (!start) start = time;
    const p = Math.min((time - start) / 1100, 1);
    setShown(Math.round(value * (1 - (1 - p) ** 3)));      // ease-out cubic
    if (p < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}, [inView, value]);
```

Mono, `font-variant-numeric: tabular-nums`, or the numerals jitter as digits
change width. The figure tier is mono for exactly this reason.

---

## 8. Ambient motion

The complete list is three items, and one of them doesn't move.

**Marquee.** §6b. 20–50s, linear, infinite, pauses on hover.

**The live dot.** 2s pulse, the only pulsing thing in the system. If a second
thing pulses, neither reads as live.

**Paper tooth.** A static grain overlay, `recipes.css` §17. It is in the ambient
category by intent and not by behaviour — it is texture, not animation. This is
the one atmospheric effect that *gains* from being on paper rather than losing:
grain on a dark canvas reads as film, and on warm stock it reads as the stock
the grounds are already imitating. Keep it under 0.03 opacity or it dirties the
hairlines, which at 1.30:1 cannot afford it.

That is it. **No floating orbs, no drifting gradients, no parallax.** On a dark
canvas an ambient glow is atmosphere; on warm paper it is a smudge, and it
breaks the no-cool-grey rule by putting an uncontrolled hue on the ground.

**One bounded exception, and it does not move.** `.ad-bloom` is a static warm
glow behind the hero product panel — no animation, one per page. The distinction
is containment, not shape: a gradient *tethered to a panel* reads as the product
emitting light, while the same gradient floating free reads as decoration
covering for an undecided area. If you find yourself adding a second one, the
section needs content, not light.

---

## 9. Reduced motion

Two halves, and the second is the one that breaks.

**CSS half.** `recipes.css` §21 stops the animations *and resolves every
off-screen start state to its end state.* Stopping without resolving leaves
`.ad-reveal` at `opacity: 0` forever — a blank page whose CSS is technically
correct. Anything you add with a hidden start state needs the same treatment,
and it must be added **inside that block, which stays last in the file**.

**JS half.** CSS cannot fix a typewriter, a carousel, a scrollytelling observer
or anything advancing on a timer.

**The rule: auto-advancing content resolves to a static FULL state, not a frozen
partial one.**

| Instead of | Render |
|---|---|
| cycling one card of three | all three, stacked, already resolved |
| typing a transcript | the whole transcript, no caret |
| counting up to 38 | `38` |
| a dimmed scrollytelling rail | every panel at full opacity, observer never attached |
| a rAF listener | nothing — skip attaching it |

```tsx
const [reduced, setReduced] = useState(false);
useEffect(() => {
  const q = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReduced(q.matches);
  const onChange = e => setReduced(e.matches);
  q.addEventListener('change', onChange);
  return () => q.removeEventListener('change', onChange);
}, []);
```

Read it **in an effect, not during render** — it is a browser API and will break
SSR hydration otherwise.

`verification.md` §6 is the check. It is the step most likely to fail, because
it is the one CSS cannot cover.

---

## 10. Performance rules

- **Animate `transform` and `opacity` only.** Anything that triggers layout
  (`width`, `top`, `margin`, `height`) will drop frames. Accordion height is the
  one justified exception — use a grid-rows trick or measure, and accept the cost.
- **One scroll listener per page**, rAF-throttled, `{ passive: true }`. Not one
  per component. Omitting `passive` blocks scrolling outright.
- **`will-change: transform`** only on nodes a rAF loop actually writes to. It
  costs memory per layer, and sprayed across a card grid it is a regression.
- **Never re-render React on scroll.** Write to `node.style` directly. State
  changes belong to discrete transitions (which panel is active), not to
  continuous position.
- Put ambient animation on a **pseudo-element**, not on a node with children —
  it avoids promoting a whole subtree to its own layer.

### What not to animate

- **Colour of large surfaces.** A band cross-fading between grounds on scroll is
  expensive to paint and reads as a rendering fault.
- **`box-shadow` on hover across a card grid.** Twelve simultaneous shadow
  interpolations is a real frame-rate cost. Transition `border-color` instead —
  and per the two-shadow budget most of those cards shouldn't have a shadow.
- **Anything on an `.ad-invert` boundary.** Animating across the token remap
  produces a frame where half the tokens are inverted.
- **The scroll position itself.** No scroll-jacking, no snap on a long page.
  §6a gives the pinned feel without ever taking the scrollbar from the reader.

---

## 11. One owner per property

If JS writes `node.style.transform` every frame, CSS must not also transition
`transform` on that element — they overwrite each other and the result either
jumps or ignores its entrance entirely.

Give `transform` **exactly one owner**. If JS owns it, animate `opacity` in CSS
instead. Same rule for a parent/child pair: put the movement on the parent and
the entrance on the child, never both on one node.

`pitfalls.md` §3 covers the related trap — a `transform` also creates a stacking
context, which silently voids a descendant's `z-index` against anything outside
it. The fix always has to go on the *transformed* element, not on the descendant.

---

## 12. Build these in code rather than briefing them out

All of these are cheap, need no assets, and look better than a video of them:

- Scroll reveal, marquee, count-up, typewriter, sticky scrollytelling.
- The mechanic sequence — a rule drawing itself, a verdict resolving.
- Pulsing live dots, scroll cues, nav condense-on-scroll.
- Border-colour sweeps on hover; arrow nudges on link hover.
- The paper tooth overlay.
- Any diagram: concentric rings, connector lines, orbiting tiles.

Anything on this list that arrives as a video file is a regression — it is
heavier, blurrier, cannot respond to the reader, and cannot invert inside an
`.ad-invert` band.
