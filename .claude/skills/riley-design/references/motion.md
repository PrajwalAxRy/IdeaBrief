# Motion

Read this before adding any animation, scroll behaviour, reveal, or transition.

---

## 1. The philosophy: one reveal, everywhere

All three visual references use **the same entrance animation on every element
of every section**: fade from 0, rise 20px, 500ms, once on scroll into view,
staggered by index. Not one of them varies it for emphasis.

That is the correct instinct and it is the rule here. **The variety in a Riley
page comes from the content, not the choreography.** A page where the cards
fade, the headline slides, the chart wipes and the stat counts is not more
alive — it's noisier, and every one of those motions is competing for the same
attention the content needs.

So the entire motion vocabulary is:

| Class | What | Duration |
|---|---|---|
| **Reveal** | Everything entering on scroll. One recipe. | `--rl-dur-reveal` 500ms |
| **Structural** | Hover, focus, tab change, accordion, layout swap. | 150 / 220 / 320ms |
| **Ambient** | Marquee and the live dot. That is the complete list. | 20s+ / 2s |

Anything that doesn't fit one of those three is almost certainly decoration.
There is no 2-second "fun" animation.

---

## 2. The reveal

```css
.rl-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity var(--rl-dur-reveal) var(--rl-ease-out),
    transform var(--rl-dur-reveal) var(--rl-ease-out);
}
.rl-reveal[data-revealed='true'] { opacity: 1; transform: none; }
```

`--rl-ease-out` is `cubic-bezier(0.16, 1, 0.3, 1)` — fast out of the gate, long
settle. It's what makes 500ms read as crisp rather than slow.

**20px, not 40.** A long rise reads as a page that isn't ready. The element
should look like it's settling, not arriving from off-screen.

**Never animate a headline's individual words or characters on a light ground.**
Per-word reveals work on dark because the text emerges from the ground; on
paper, half-faded black text reads as a rendering bug.

### Implementation

Use an `IntersectionObserver`, not a scroll listener, and **disconnect after
firing** — `once` is not optional. A reveal that replays on scroll-up is the
fastest way to make a page feel cheap.

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

export function Reveal({ index = 0, children }: { index?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Resolve immediately rather than observing — see §6.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
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
      className="rl-reveal"
      data-revealed={shown}
      style={{ '--rl-i': index } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
```

If you're using `motion` v12 instead, `whileInView` with
`viewport={{ once: true }}` is the equivalent and is what the references do.
Either is fine; don't mix both in one page.

**Reserve the space.** A revealing element must occupy its final height from
first paint. `opacity` and `transform` don't affect layout, which is exactly why
the recipe uses them and nothing else — never reveal with `height`, `margin` or
`display`.

---

## 3. Stagger

Delay by index: `--rl-stagger` (100ms) × position.

```css
.rl-reveal[style*='--rl-i'] { transition-delay: calc(var(--rl-i) * var(--rl-stagger)); }
```

**Cap the stagger at six.** Beyond that the last item waits over half a second
after the first and the group stops reading as a group. For a longer list,
restart the index per row, or stagger the rows rather than the items.

**Stagger within a group, never across sections.** Each section's stagger starts
at 0. A page-wide index means section eight begins its entrance three seconds
after it's already on screen.

---

## 4. Structural transitions

Three durations, and the choice is mechanical:

| Duration | For |
|---|---|
| `--rl-dur-fast` 150ms | Colour changes: hover, focus, active. Anything where the user is already looking at the thing. |
| `--rl-dur-base` 220ms | The default. Border swaps, small position shifts, chip state. |
| `--rl-dur-slow` 320ms | Something changing size: accordion open, panel expand, layout change. |

**Transition named properties, never `all`.** `transition: all` picks up
`width`, `height` and `box-shadow` changes you didn't intend, and on a card grid
it turns a hover into a layout reflow.

**Focus rings get `transition: none`.** A ring that fades in over 220ms reads as
lag, and it's a genuine usability bug for keyboard users. `recipes.css` §16 sets
this; don't override it.

### Tab and panel changes

Cross-fade the content, move the indicator. The indicator is the accent rule
under the active tab — it's one of the accent's three jobs and the only thing
that should slide.

If you're using `motion`, `layoutId` on the indicator does this for free. Keep
it to 220ms; a sliding underline is a small object and a long duration makes it
feel heavy.

---

## 5. Ambient motion

The complete list is two items.

**Marquee.** 20–50s, linear, infinite. Duplicate the track and translate
`-50%`, so the loop is seamless. Pause on hover — a moving strip the user is
trying to read is hostile. Use `mask-image` for the edge fade, not two gradient
overlays: an overlay has to know the band colour and breaks the moment the
section moves to a different ground.

**The live dot.** 2s pulse, the only pulsing thing in the system. If a second
thing pulses, neither reads as live.

That's it. No floating orbs, no drifting gradients, no parallax on a light
ground — the third reference uses blurred colour orbs scattered behind its
sections and it's the one element of it not to copy. On a dark canvas an ambient
glow is atmosphere; on warm paper it's a smudge, and it fights rule 2 by putting
an uncontrolled hue on the ground.

**One bounded exception, and it does not move.** `.rl-bloom` is a static warm
glow behind the hero product panel — no animation, one per page. The distinction
is containment, not shape: a gradient *tethered to a panel* reads as the product
emitting light, while the same gradient floating free reads as decoration
covering for an undecided area. If you find yourself adding a second one, the
section needs content, not light.

---

## 6. Reduced motion

Two halves, and the second is the one that breaks.

**CSS half.** `recipes.css` §17 stops the animations *and resolves the reveal to
its end state.* Stopping without resolving leaves `.rl-reveal` at `opacity: 0`
forever — a blank page whose CSS is technically correct. Anything you add with
an off-screen start state needs the same treatment.

**JS half.** CSS cannot fix a typewriter, a carousel, or anything advancing on a
timer. Those need a branch in the component:

```tsx
const reduced = useReducedMotion();          // motion/react, or a matchMedia hook
if (reduced) return <>{items.map(i => <Item key={i.id} {...i} />)}</>;   // all of them
```

**The rule: auto-advancing content resolves to a static FULL state, not a frozen
partial one.** A carousel shows all its items stacked. A typewriter shows the
whole string with no caret. A count-up shows its final number.

`verification.md` §6 is the check. It's the step most likely to fail because
it's the one CSS can't cover.

---

## 7. What not to animate

- **Colour of large surfaces.** A band cross-fading between grounds on scroll
  is expensive to paint and reads as a rendering fault.
- **`box-shadow` on hover for a whole card grid.** Twelve simultaneous shadow
  interpolations is a real frame-rate cost. Transition `border-color` instead —
  and per rule 7 most of those cards shouldn't have a shadow anyway.
- **Anything on a `.rl-invert` boundary.** Animating across the token remap
  produces a frame where half the tokens are inverted.
- **Layout properties.** `width`, `height`, `top`, `margin`, `padding` all
  trigger layout. Use `transform` and `opacity`; they're compositor-only.
  Accordion height is the one justified exception — use a grid-rows trick or
  measure, and accept the cost.
- **The scroll position itself.** No scroll-jacking, no snap on a long page.
  The sticky-left / scrolling-right pattern gives the pinned feel without ever
  taking the scrollbar from the user.

---

## 8. One owner per property

If JS writes `node.style.transform` every frame, CSS must not also transition
`transform` on that element — they overwrite each other and the result jumps or
ignores its entrance.

Give `transform` exactly one owner. If JS owns it, animate `opacity` in CSS
instead. Same rule for a parent/child pair: put the parallax on the parent and
the entrance on the child, never both on one node.

`pitfalls.md` §3 covers the related trap — a `transform` also creates a stacking
context, which silently voids a descendant's `z-index`.
