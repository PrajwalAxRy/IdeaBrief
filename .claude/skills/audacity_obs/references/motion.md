# Motion

Motion in this system is either **ambient and slow** or **structural and fast**.
There is nothing in between, and the gap between them is deliberate: it's what
keeps a page feeling composed rather than busy.

| | Ambient | Structural |
|---|---|---|
| Duration | 20–50s | 150–900ms |
| Trigger | none, infinite | user action or scroll position |
| Purpose | atmosphere | communicates state or arrival |
| Subtlety | a screenshot can't tell it's moving | clearly visible |
| Reduced motion | **stopped** | **resolved to end state** |

A 2-second easing curve on a hover, or a 3-second "fun" loop, belongs to
neither category. Delete it.

**One thing to carry through this whole file: ambient motion has a smaller
budget on paper than it does on near-black.** A drifting bloom over a dark
ground is invisible until it's strong; the same bloom over `--au-canvas` tints
the page. Every ambient opacity here is roughly half what the dark system uses,
and the test is in §8.

---

## 1. No animation library

Everything below is CSS transitions + `IntersectionObserver` + at most one
`requestAnimationFrame` scroll listener per page. That is enough for the whole
system, and it means:

- No hydration cost for motion.
- No library version risk.
- Animations are GPU-composited because they're plain CSS transitions.
- Reduced-motion is handled in one media query rather than at N call sites.

Reach for a library only when you need physics (spring-following drag, gesture
velocity). Scroll reveals, parallax, typewriters, and count-ups don't.

---

## 2. Timing tokens

```css
--au-ease:  cubic-bezier(0.16, 1, 0.3, 1);   /* the only easing in the system */
--au-fast:  180ms;   /* press, tap-back, icon nudge */
--au-base:  320ms;   /* hover, colour, border, condense */
--au-enter: 900ms;   /* reveal, mask, the verification rule drawing */
```

One easing curve everywhere. It is a hard out-ease: things arrive quickly and
settle slowly, which is what makes a 900ms reveal feel unhurried rather than
slow.

---

## 3. The reveal primitives

### 3a. Blur-up reveal — the workhorse

JS flips a boolean; CSS does all the animating. No per-frame work.

```css
.au-reveal {
  opacity: 0;
  transform: translateY(22px);
  filter: blur(8px);
  transition:
    opacity var(--au-enter) var(--au-ease),
    transform var(--au-enter) var(--au-ease),
    filter var(--au-enter) var(--au-ease);
  transition-delay: var(--au-reveal-delay, 0ms);
}
.au-reveal[data-shown='true'] { opacity: 1; transform: none; filter: blur(0); }
```

```jsx
export function ScrollReveal({ children, delay = 0, className, threshold = 0.15 }) {
  const { ref, inView } = useInView({ threshold });
  return (
    <div
      ref={ref}
      className={className ? `au-reveal ${className}` : 'au-reveal'}
      data-shown={inView}
      style={{ '--au-reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

The `blur(8px)` is what distinguishes this from a generic fade-up — it reads as
something resolving into focus rather than sliding in. Don't exceed 8px; past
that it reads as a mistake on the first frame.

**Stagger via `delay`, 80–160ms per item.** Never stagger more than ~6 items;
past that the last one arrives after the reader has moved on.

### 3b. Per-word mask reveal — headlines only

The signature motion of the system. Reserved for section headlines; using it
anywhere else spends its impact.

```css
.au-word-line { display: block; overflow: hidden; padding-bottom: 0.08em; }
.au-word {
  display: inline-block;
  transform: translateY(105%);
  transition: transform var(--au-enter) var(--au-ease);
  transition-delay: var(--au-word-delay, 0ms);
  white-space: pre;
}
[data-shown='true'] .au-word { transform: none; }
```

Three things that are easy to get wrong:

- **`padding-bottom: 0.08em` on the line.** Without it, descenders (`g`, `y`,
  `p`) get clipped by the `overflow: hidden` in the resting state.
- **Break lines by hand.** Pass pre-split lines, don't let the browser wrap —
  a mask reveal on a line that rewraps at a different viewport looks broken.
- **Run the stagger index across lines, not per line.** Restarting per line
  makes line 2's first word overtake line 1's last word.

```jsx
let wordIndex = -1;             // continues across line breaks
lines.map(line => (
  <span className="au-word-line" key={line}>
    {line.split(' ').map((word, i, all) => {
      wordIndex += 1;
      return (
        <span key={`${word}-${i}`} className="au-word"
              style={{ '--au-word-delay': `${delay + wordIndex * stagger}ms` }}>
          {i === all.length - 1 ? word : `${word} `}
        </span>
      );
    })}
  </span>
))
```

Stagger 48–62ms per word. Above-the-fold headlines trigger on mount (one
`requestAnimationFrame` after paint, so they start masked); everything below
triggers on intersection.

**One light-theme note.** The mask relies on `overflow: hidden` on an element
whose background matches whatever sits behind it. On paper that is usually
`--au-canvas`, but inside a fragment card or a hero band it is `--au-surface` or
`--au-void` — and a word sliding up out of the *wrong* paper tone leaves a
visible seam for the length of the reveal. On near-black the three surfaces were
close enough that nobody noticed. Check the mask against its actual parent
surface, not against the canvas.

### 3c. The `useInView` hook

Everything reveal-shaped goes through this. It **falls open** — if
`IntersectionObserver` is unavailable, content is shown rather than stuck at
opacity 0.

```js
export function useInView({ threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }

    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) { setInView(true); if (once) observer.disconnect(); }
      else if (!once) setInView(false);
    }, { threshold, rootMargin });

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
```

`once: true` for reveals (a reveal that replays on scroll-up is noise).
`once: false` for anything that should pause when off-screen.

---

## 4. Scroll-driven patterns

### 4a. Parallax collage

One rAF-throttled listener writes transforms straight to nodes. **React never
re-renders on scroll.**

```js
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frame = 0;

  const read = () => {
    frame = 0;
    const y = window.scrollY;
    const progress = Math.min(y / Math.max(window.innerHeight, 1), 1.2);  // clamp
    for (let i = 0; i < CARDS.length; i += 1) {
      const node = refs.current[i], card = CARDS[i];
      if (!node || !card) continue;
      node.style.transform =
        `translate3d(0, ${(-y * card.depth).toFixed(2)}px, 0) ` +
        `rotate(${card.rotate}deg) scale(${(1 + progress * 0.06).toFixed(3)})`;
    }
  };

  const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
  read();
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
}, []);
```

- **`depth` semantics:** `translateY(-scrollY * depth)` — higher depth moves up
  faster, which reads as *closer*. Big background elements get `0.16`; small
  foreground cards get `0.55–0.60`.
- **Clamp `progress`.** Without it, a long page drives absurd offsets.
- **`{ passive: true }`** or you block scrolling.
- **`transform` has exactly one owner** — see `pitfalls.md` §4. The entrance
  animation on these nodes must be opacity-only.

### 4b. Sticky scrollytelling — the house layout

The "pinned, advancing one at a time" feel, without ever taking the scrollbar
away. A sticky left column, a normally-scrolling right column, and a thin
observer band across the viewport middle deciding which panel is live.

```jsx
<div className="grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-24">
  <div><div className="sticky top-[22vh]">{/* head + rail */}</div></div>
  <div className="flex flex-col gap-40">{/* panels */}</div>
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
- **Keep the last active when nothing intersects**, or the rail flickers to 0
  in the gaps between panels.
- Make the rail's ticks real `<button>`s that scroll to their panel with
  `block: 'center'`.
- **Dim inactive panels to `--au-dim-inactive` (0.5), not Obsidian's 0.42.**
  Fading toward a dark ground removes contrast gradually, so 0.42 is a strong
  dim there. Fading toward paper removes it much faster — `--au-muted` at 0.42
  on the canvas lands near 3:1 and reads as *disabled* rather than as
  not-yet-your-turn. The token is the default, but the binding criterion is the
  ratio: an inactive panel's body copy should still clear roughly 3:1. Measure
  it with the script in `light-surfaces.md` §1 rather than trusting the number.
- **Check `overflow` on ancestors** — see `pitfalls.md` §5.

### 4c. Marquee

```css
.au-marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.au-marquee-track { display: flex; width: max-content; animation: au-marquee 46s linear infinite; }
.au-marquee:hover .au-marquee-track { animation-play-state: paused; }
@keyframes au-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

The `#000` in the `mask-image` is **not a colour** — a mask reads alpha only,
and any opaque value works. It is the one hex permitted outside the token file,
and it means "opaque", not "black". Don't token it and don't invert it for the
light theme.

For a seamless loop the track must contain **the same set twice** and translate
exactly `-50%`:

```js
const half = [...ITEMS, ...ITEMS, ...ITEMS];   // enough copies to overfill the viewport
const track = [...half, ...half];              // then double it
```

`linear`, never eased — an eased marquee visibly stutters at the loop point.
Pause on hover so it can be read. **A marquee must carry real information**; a
strip of adjectives is filler and reads as one.

---

## 5. State-machine motion

### 5a. The verification sequence

The most important motion in the system: an excerpt lands, a 1px rule draws
itself left-to-right underneath it, and a verdict resolves.

```css
.au-verify-rule {
  height: 1px; background: var(--au-accent);
  transform: scaleX(0); transform-origin: left center;
  transition: transform var(--au-enter) var(--au-ease);
}
[data-state='verified'] .au-verify-rule,
[data-state='discarded'] .au-verify-rule { transform: scaleX(1); }
[data-state='discarded'] .au-verify-rule { background: var(--au-discard); }
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

- **Reserve the space** for the rule and verdict in the pending state, so
  nothing shifts when they arrive.
- **Show the failure.** A demo where everything passes proves nothing; the
  discarded case is the argument.
- Give the user cycle dots so they can drive it themselves.
- **The discard rule must still be visible.** `--au-discard` on paper is a
  low-contrast warm grey by design — that's the point, it's leaving — but a 1px
  line at that value can vanish entirely against `--au-surface`. Check it on the
  actual card surface, and if it disappears, the fix is to keep the rule and
  drop the *text* instead, not to darken the token.

### 5b. Typewriter

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
  return <Bubble turn={turn}>{turn.text.slice(0, count)}<span className="au-caret" /></Bubble>;
}
```

- **15–26ms per character.** Slower feels broken; faster stops reading as typing.
- **Vary speed by speaker** — a human typing (24ms) and a machine answering
  (15ms) at identical rates reads as one voice.
- **Beat between turns:** ~460ms after a short turn, ~900ms after a long one.
- Keep the per-character state in the leaf — `pitfalls.md` §12.
- **Reserve the finished transcript's height** on the container
  (`min-h-[520px]`) so the composer below never moves.

### 5c. Count-up

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
change width.

---

## 6. The reduced-motion contract

Two halves. Both are required.

**CSS** stops animation and **resolves transitions to their end state** — see
`pitfalls.md` §10 for the block.

**JS must branch separately.** CSS cannot fix a sequence driven by timers. The
rule: *auto-advancing content is motion too.* Replace the sequence with its
complete resting state.

| Instead of | Render |
|---|---|
| cycling one card of three | all three, stacked, already resolved |
| typing a transcript | the whole transcript, no caret |
| counting up to 38 | `38` |
| a parallax listener | nothing — skip attaching it |

```jsx
const [reduced, setReduced] = useState(false);
useEffect(() => {
  const q = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReduced(q.matches);
  const onChange = e => setReduced(e.matches);
  q.addEventListener('change', onChange);
  return () => q.removeEventListener('change', onChange);
}, []);
```

Read it in an effect, not during render — it's a browser API and will break
SSR hydration otherwise.

Verify it. `references/verification.md` §5 has the check.

---

## 7. Performance rules

- **Animate `transform`, `opacity`, and `filter` only.** Anything that triggers
  layout (`width`, `top`, `margin`, `height`) will drop frames.
- **One scroll listener per page**, rAF-throttled, `{ passive: true }`. Not one
  per component.
- **`will-change: transform`** on nodes a rAF loop writes to — and nowhere
  else; it costs memory per layer.
- **Never re-render React on scroll.** Write to `node.style` directly. State
  changes belong to discrete transitions (which panel is active), not to
  continuous position.
- Ambient animation on a pseudo-element, not on a node with children — it
  avoids promoting a whole subtree to its own layer.

---

## 8. What to build in code rather than brief out

All of these are cheap, need no assets, and look better than a video of them:

- Drifting radial blooms (`@keyframes` on a transformed pseudo-element, 30–50s).
- Scroll-reveal, mask reveal, parallax, marquee, count-up, typewriter.
- The verification rule drawing itself.
- Pulsing live dots; scroll cues; nav condense-on-scroll.
- Border-colour sweeps on hover; arrow nudges.
- Sticky scrollytelling.
- Paper tooth — one global fixed pseudo-element with an SVG turbulence
  data-URI (`.au-tooth`, recipes §9). It does more work here than grain does on
  near-black: it's what keeps a large flat area of `--au-canvas` from reading
  as a blank browser default. Two rules:
  - **`mix-blend-mode: multiply`, not a white or black overlay.** Multiply lets
    the tooth take its hue from whatever ground it sits over, so one element
    tints correctly on canvas, void and surface alike. A neutral overlay at the
    same opacity either washes the paper out or turns it grey, and grey paper
    is this system's whole failure mode.
  - **Keep it at or below `--au-tooth-opacity` (0.025).** Above ~0.03 it stops
    being tooth and starts being noise — and critically, it *dirties the 1.27:1
    hairlines*. That ceiling is tighter for Audacity than for a card-based
    light system, because here the hairlines are the layout and there is no
    contrast budget to spend on texture.

  Note it is not ambient *motion* — it doesn't move, which is why it stays put
  under `prefers-reduced-motion` while the blooms stop.

Anything on this list that arrives as a video file is a regression — it's
heavier, blurrier, and can't respond to the user.

### The ambient budget test

Ambient motion and atmosphere are the easiest things to overdo on a light
ground, and a screenshot won't tell you. Two checks:

```js
// 1. Screenshot the page with the backdrop hidden, then with it shown.
//    If you can point at the bloom's shape in the second image, it's too strong.
() => document.querySelector('.au-backdrop').style.display = 'none';

// 2. Sample the canvas colour far from any bloom, and directly under one.
//    A drift of more than ~3 per channel means the page has an orange cast.
() => {
  const probe = (x, y) => {
    const el = document.elementFromPoint(x, y);
    return getComputedStyle(el).backgroundColor;
  };
  return { corner: probe(8, innerHeight - 8), centre: probe(innerWidth / 2, innerHeight / 2) };
}
```

Check 2 reads *declared* backgrounds, not composited pixels — it catches a
recipe that painted a tint, not the bloom itself. For the bloom, use check 1
and trust your eye on the difference between the two screenshots, which is a
far more sensitive instrument than either one alone.
