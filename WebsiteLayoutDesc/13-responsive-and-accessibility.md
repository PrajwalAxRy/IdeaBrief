# 13 — Responsive Strategy & Accessibility

---

## 13.1 The scope decision

The executive summary explicitly cuts both:

> **Removed because the priority is a working product:**
> … Mobile design, WCAG work, accessibility audit, PDF export.

**Decision (user-confirmed): desktop only.** No mobile design work, no
accessibility audit, no WCAG conformance target in v1.

This document therefore does two things: defines how far the desktop build
should stretch before it breaks, and defines the accessibility floor that comes
free with correct implementation — the things that cost nothing now and cost a
great deal to retrofit.

---

## 13.2 Responsive strategy — desktop-first, with a floor

### Target and support

| Width | Status | Effort |
|---|---|---|
| **≥ 1440px** | Ideal | Layouts designed here |
| **1280–1439px** | Primary target | Fully designed and tested |
| **1024–1279px** | Supported | Fluid containers; no layout redesign |
| **900–1023px** | Degrades gracefully | Three specific collapse rules (below) |
| **< 900px** | **Not designed** | Single-column fallbacks only; no testing |

Design at **1440px**. Verify at **1280px**. Sanity-check at **1024px**. Ignore
below 900px except for the fallbacks listed.

### The three collapse rules worth building

These are not "mobile design" — they are the minimum to stop a laptop user
(1280px browser with devtools open ≈ 900px viewport) from hitting a broken
page. Roughly half a day total.

**R1 — Define: two columns → conversation + bottom bar (< 900px)**
The Brief Panel collapses to a sticky bottom summary bar showing the one-liner,
the unknown count, and the Approve button. Tapping it opens the full brief as a
right drawer. Without this, a 400px panel and a 64ch conversation cannot
coexist and both become unusable.

**R2 — Report: index hides, competitors go 1-up (< 900px)**
The `SectionIndex` is removed (not squeezed) and replaced by a compact
section-jump control under the header. Competitor cards stack.

**R3 — Open Question grid: label column stacks (< 900px)**
`grid-template-columns: 120px 1fr` → `1fr`, with labels above values. This is
the single highest-value adaptive rule in the product — the labelled grid is
completely unusable when the content column drops below ~400px.

### Global fluid behaviour (free, already in the tokens)

- Type scales via `clamp()` on every display and heading size — already in the
  token set, no extra work
- Containers are `max-width` + percentage, not fixed widths
- Every grid uses `repeat(auto-fit, minmax(…))` or an explicit breakpoint
- `ProseColumn` caps at 68ch, so text never over-stretches on ultrawide

### Ultrawide (> 1920px)

Content stays centred at its max-width. The orb and grain scale with the
viewport. **Nothing stretches to fill** — a 68ch report on a 2560px monitor
should sit in a comfortable centred column, which is exactly what the aesthetic
wants anyway.

### Explicitly not built

- No touch targets sized for fingers, no hover-free interaction paths
- No mobile navigation, hamburger, or bottom tab bar
- No mobile-optimised Evidence Drawer (it goes full-width and that's enough)
- No responsive images or art direction
- No testing on real devices

---

## 13.3 Accessibility — the floor we keep anyway

**No audit, no WCAG target, no assistive-technology testing in v1.** But the
following are consequences of building correctly rather than additional work,
and skipping them creates debt that is expensive to unwind:

### Kept — costs nothing

| Practice | Why it's free |
|---|---|
| **Semantic HTML** | `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<h1>`–`<h3>` in order. Writing `<div onClick>` is not easier than writing `<button>`. |
| **Visible focus rings** | Already specified in the design system (`:focus-visible`, amber, 2px). The work is *not deleting* them. |
| **Keyboard operability** | Comes free with real `<button>` and `<a>` elements. Only the Drawer and Modal need explicit work, and Radix provides it. |
| **Focus trap + restore in overlays** | Radix Dialog does this by default. Using the primitive is the implementation. |
| **`alt=""` on decorative SVG, labels on icon buttons** | One attribute each. |
| **`prefers-reduced-motion`** | ~10 lines of CSS. Also prevents motion sickness complaints from the orb and button pulse, which are the two most aggressive animations in the product. |
| **Form labels on the few inputs** | There are three inputs in the entire product. |
| **`lang="en"` on `<html>`** | One attribute. |
| **Sensible tab order** | A consequence of source order, which is already the reading order. |

### Known gaps, accepted for v1

These are real and documented so nobody claims the product is accessible:

| Gap | Impact | Cost to fix later |
|---|---|---|
| **No screen-reader testing** | Streaming content (conversation tokens, findings landing) is likely to be announced badly or not at all | Medium — needs `aria-live` regions with correct politeness on the `MessageStream` and `FindingStream` |
| **The grain overlay** | Can compound legibility issues for low-vision users even with conformant text contrast | Low — opacity is already a token (`--grain-opacity`) |
| **No skip link** | Keyboard users tab through the `StageRail` on every page | Trivial — add later |
| **Citation chips are small targets** | ~20×16px, below the 24×24 minimum | Trivial — padding |
| **Confidence conveyed by bars + text** | Actually *fine* — text always accompanies the bars, so it isn't colour-only. Noted because it's a common failure this design happens to avoid. | None |

**Resolved (2026-08-20):** contrast was verified and fixed. `--text-muted`
and `--text-tertiary` measured ~2.5–3.0:1 against the dark surfaces — well
below the 4.5:1 AA threshold for normal text — and `--text-body` was passing
but only barely (~4.7–5.1:1). All three were brightened in `styles/tokens.css`
(kept in the same warm tan/gray hue family) and now measure 4.6:1 or better
against every surface in the four-level hierarchy (`--bg-base`,
`--bg-surface`, `--bg-card`). See [02 §2.2](02-visual-direction.md#22-colour-system--tokens).

### Two things worth doing anyway, at near-zero cost

1. **`aria-live="polite"` on the finding stream container** with a visually
   hidden announcement per finding (`Finding verified: {claim}`). Four lines,
   and it's the difference between the run being narrated or silent.
2. **A skip link** to `#main`. Two lines.

Neither constitutes "accessibility work." Both prevent the most obvious
complaints if the product gets any real usage.

---

## 13.4 Browser support

| Browser | Support |
|---|---|
| Chrome / Edge (latest 2) | Full |
| Safari (latest 2) | Full — verify `backdrop-filter` and `mix-blend-mode` on the grain overlay |
| Firefox (latest 2) | Full — verify `mix-blend-mode: overlay` renders the grain at the intended weight |
| Anything else | Untested |

Two features to verify early because the aesthetic depends on them:
- `backdrop-filter: blur()` — the nav and modal backdrop
- `mix-blend-mode: overlay` on a fixed pseudo-element — the grain

Both have a graceful degradation (no blur, no grain) that leaves the product
usable but noticeably flatter. Neither needs a polyfill.

---

## 13.5 Performance targets

Performance *is* a design feature here — the exec summary's "feel fast"
intent and the premium aesthetic both depend on it.

| Metric | Target | Why it matters here |
|---|---|---|
| LCP on `/` | < 1.2s | The Box must be usable immediately |
| CLS on the report | **< 0.02** | A document that jumps while being read destroys the premium feel faster than any visual flaw |
| First content on report | < 1s | Streamed via Suspense |
| First verified finding | < 60s from run start | The single biggest lever on run abandonment ([04](04-user-journeys.md#44--journey-c--the-wait)) |
| JS bundle, `/` | < 90KB gzipped | Mostly static; The Box is the only client component |
| JS bundle, report | < 140KB gzipped | No chart library is a large part of why this is achievable |

Cheap wins that are also design decisions:
- Fonts: two families, `display=swap`, preloaded, subset to Latin
- No chart library, no icon font, no animation library on the landing page
- The grain is an inline data-URI SVG — no network request
- Report is server-rendered; the client bundle is drawers, accordions, chips

---

## 13.6 If mobile is reinstated later

Recorded so the decision is cheap to reverse. The design already anticipates
it in three ways:

1. **Every layout is a two-column-max composition** with a defined collapse
   rule — there is no complex grid to redesign.
2. **`ProseColumn` and the `clamp()` type scale** already produce a correct
   single-column reading experience; the report is ~80% mobile-ready by
   construction.
3. **The three collapse rules in §13.2** are the same rules mobile would need,
   just at a different breakpoint.

The remaining work would be: the Define bottom bar → full-screen brief sheet,
the Evidence Drawer → bottom sheet, touch target sizing, and removing
hover-dependent affordances (the `Pencil`-on-hover in the Brief Panel is the
only one that has no click equivalent — worth fixing now, since a persistent
`Pencil` at low opacity costs nothing).

**Estimated effort: 3–4 days.** Not free, not large. See
[17](17-open-questions.md#r1--shared-links-open-on-phones) for why this may
be worth reconsidering before launch.
