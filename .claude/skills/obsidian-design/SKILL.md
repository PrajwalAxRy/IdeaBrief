---
name: obsidian-design
description: Design and build screens in the "Obsidian" style — a near-black canvas where 1px hairlines carve the entire layout, oversized weight-400 display type with hard negative tracking, one electric-blue accent that only ever means action/verification/live, code-drawn product UI instead of screenshots, and scroll-driven motion. Inspired by Hyperstudio crossed with vev/pageTheme. This is the default design system for everything at the REPO ROOT — `app/`, `components/`, `styles/` — use it for ANY work that produces visible pixels there: new pages, restyling, adding a section, picking a colour, sizing type, laying out a grid, choosing what animates, briefing an image or video, or verifying a screen in the browser. Triggers on "design", "restyle", "make it look", "overhaul the UI", "add a section", "hero", "landing page", "the look", "obsidian", "dark theme", or any request that will produce visible pixels in the root app. Do NOT design from memory or default styling — read this first. EXCEPTION: `experimentalFrontend/` is a separate light-theme app owned entirely by the riley-design skill — use that instead for anything under that directory, and never mix `--ob-*` and `--rl-*` tokens across the boundary.
---

# Obsidian

A near-black canvas where everything is carved out by light. Hairline borders
are not decoration on the layout — they *are* the layout. Type is enormous and
set at weight 400, so authority comes from scale and negative tracking rather
than from boldness. Exactly one hue exists, and it always means something.

**References:** Hyperstudio (the hairline grid, weight-400 display type, the
refusal of shadows) crossed with vev.design / pageTheme (near-black ground, an
oversized headline sitting inside a perspective media collage, one electric
blue).

**The failure mode** is a generic dark SaaS page: three hues, type too small,
sections separated by background colour instead of a rule, drop shadows
everywhere, an accent used as decoration until it means nothing.

---

## The ten rules

1. **One file holds every colour value.** Not a component, not a Tailwind
   class, not a `style={{}}`. A colour you need that isn't a token means you
   need a token or a different design.

2. **Hairlines are the layout.** Sections are separated by a 1px rule and
   nothing else — no background bands, no gradient transitions, no alternating
   surfaces. If you're reaching for a background change to separate two
   sections, use a rule.

3. **No shadows. Ever.** Elevation reads through a border and a surface
   lightness step. The only thing on the page that "lifts" is the primary
   button, and it lifts through colour contrast.

4. **Weight 400 at every size, including display.** A 104px headline at weight
   400 *is* the voice of this system. Bold display type is the single fastest
   way to make it look like something else. Weight 500 exists only for the mono
   metadata layer.

5. **Type is bigger than feels comfortable, tracked tighter than feels safe.**
   Display 58→104px at `-0.035em`. Section headlines 42→68px at `-0.03em`.
   Body never below 16px, and never tracked tight.

6. **One accent, three jobs.** Electric blue marks the primary action,
   verification/confirmed state, and live/active state. Nothing else. Not the
   logo, not section numerals, not separators, not icons. If you can't say
   which of the three jobs a blue thing is doing, it shouldn't be blue.

7. **Sections breathe at 120–160px.** Under 96px between two sections reads as
   one crowded block.

8. **Product surfaces are drawn in code, not photographed.** A screenshot of
   your UI is worse than the UI itself rendered as markup. See
   `references/media.md` — this is the rule most likely to be broken.

9. **Motion is ambient-and-slow or structural-and-fast, never in between.**
   Ambient: 20–50s, infinite, so subtle a screenshot can't tell. Structural:
   150–320ms, triggered. There is no 2-second "fun" animation. See
   `references/motion.md`.

10. **Measure, don't eyeball.** A screenshot proves a thing looks right; it does
    not prove a rule applied. Read computed styles. See
    `references/verification.md`.

---

## Colour

Values live in the token file (`assets/tokens.css` is paste-ready). Reproduced
here so you can reason about them — never copy a hex into a component.

### Surfaces — four levels

| Token | Value | Use |
|---|---|---|
| `--ob-canvas` | `#0A0A0B` | Page ground. The default. |
| `--ob-void` | `#060607` | Hero band, footer, and any surface meant to read as *deeper* than the page. |
| `--ob-surface` | `#101012` | Cards, panels, inputs. |
| `--ob-raised` | `#17171B` | The one level above a card — a user's own message, a selected row. |

Note the direction: `--ob-void` is **darker** than the canvas. In a system with
no shadows, "recessed" and "elevated" are both just lightness steps, and the
hero reading darker than the page is what makes the content above it float.

### Hairlines — the structural line work

| Token | Value | Use |
|---|---|---|
| `--ob-hairline` | `#232326` | Every section divider, card border, table rule. The most-used value in the system. |
| `--ob-hairline-strong` | `#34343C` | Hover state of a bordered control; the one border meant to be noticed. |
| `--ob-hairline-accent` | `rgba(45,127,249,0.42)` | Border of a *verified* object only. |

### Text — three levels and a dim

| Token | Value | Use |
|---|---|---|
| `--ob-text` | `#F4F4F5` | Headlines, values, anything being asserted. |
| `--ob-muted` | `#8A8A93` | All running prose. This is the default body colour. |
| `--ob-dim` | `#5B5B64` | Mono metadata, labels, timestamps, domains. |
| `--ob-on-accent` | `#FFFFFF` | Text sitting on the accent fill. |

Body copy is `--ob-muted`, not `--ob-text`. Bright body copy flattens the page
— the contrast between a white headline and grey prose is doing real work.

### Accent — one hue, three jobs

| Token | Value | Use |
|---|---|---|
| `--ob-accent` | `#2D7FF9` | Primary action · verification · live/active. |
| `--ob-accent-bright` | `#5C9DFF` | Hover of the above. |
| `--ob-accent-wash` | `rgba(45,127,249,0.12)` | Ambient bloom, focus ring fill. |
| `--ob-accent-ring` | `rgba(45,127,249,0.30)` | Pulse ring on a live dot. |
| `--ob-accent-glow` | `rgba(45,127,249,0.40)` | The single glow permitted, on primary-button hover. |

### Negative / discard state

| Token | Value | Use |
|---|---|---|
| `--ob-discard` | `#4A4A52` | Something that failed a check and is leaving. |

**There is no red in this system.** A rejected item is a non-event, not an
error: it goes grey, strikes through, drops a few pixels, and stops mattering.
Red would make failure feel like the user's fault. Reserve any warning hue for
a genuine destructive confirmation, and add it as a deliberate exception.

---

## Typography

**Geist** (display, UI, body) and **Geist Mono** (metadata only). Geist is the
closest freely-available stand-in for Aeonik, which is what the reference uses.
No third face.

Substitutes, in order of preference if Geist is unavailable: Instrument Sans,
Schibsted Grotesk, Onest. Avoid Inter — it is too neutral to carry a 104px
headline at weight 400.

### Scale

**Sixteen steps in four tiers, and there is no seventeenth.** A size that is
not one of these tokens is a bug — see "Closing the scale" below for why this
is stated so bluntly.

**Display tier** — sans, weight 400, hard negative tracking. Headings only.

| Token | Value | Use |
|---|---|---|
| `--ob-display` | `clamp(58px, 7.2vw, 104px)` | Hero headline. One per page. |
| `--ob-h1` | `clamp(42px, 4.6vw, 68px)` | Section headline. |
| `--ob-h2` | `clamp(30px, 3vw, 44px)` | Sub-section, panel title. |
| `--ob-h3` | `23px` | Card title. |
| `--ob-lead` | `21px` | Hero subcopy and section intros only. |

**Text tier** — sans, weight 400, `--ob-tracking-snug`.

| Token | Value | Use |
|---|---|---|
| `--ob-sub` | `18px` | The step between body and lead: wordmark, pulled excerpt, composer, a card title too small for `--ob-h3`. |
| `--ob-body` | `16px` | Running prose. |
| `--ob-sm` | `14px` | Dense UI, buttons, chat, secondary copy. |
| `--ob-xs` | `13px` | The dense step: figure notes, small buttons, tooltip proof lines. |

**Meta tier** — mono, weight 500, `+0.10em`, uppercase.

| Token | Value | Use |
|---|---|---|
| `--ob-meta` | `12px` | The layer's home size. |
| `--ob-meta-sm` | `11px` | Micro-label inside another element. |
| `--ob-meta-xs` | `10px` | Chips, citation superscripts, tags. |

The two below 12px are for labels that sit *inside* another element. Never set
a line that has to be read at 10 or 11px.

**Figure numerals** — mono, weight 400, `--ob-tracking-fig` (`-0.02em`),
leading `1`. A separate tier because a number is not a heading: mono so digits
are tabular, and never the display tier's tracking.

| Token | Value |
|---|---|
| `--ob-fig-xl` | `clamp(40px, 4vw, 56px)` |
| `--ob-fig-lg` | `44px` |
| `--ob-fig-md` | `33px` |
| `--ob-fig-sm` | `28px` |

### Tracking and leading

- Display: `-0.035em`, leading `0.98`.
- h1: `-0.03em` · h2: `-0.025em`, leading `1.08`.
- Body and UI: `-0.015em`, leading `1.6`.
- Mono metadata: `+0.10em`, uppercase, leading `1.4`.
- Figure numerals: `-0.02em`, leading `1`.

The slight negative tracking on body (`-0.015em`) is deliberate and unusual —
it's what keeps the UI feeling related to the headline. Do not take it further;
past `-0.02em` body copy starts to lose word spacing.

**Leading is seven values, same as sizes are sixteen.** `--ob-leading-display`
`0.98` · `--ob-leading-flat` `1` · `--ob-leading-tight` `1.08` ·
`--ob-leading-snug` `1.25` · `--ob-leading-meta` `1.4` · `--ob-leading-lead`
`1.5` · `--ob-leading-body` `1.6`. Nothing between them. A 1.55 or a 1.65 in a
recipe is how one size ends up rendering at four different leadings on one
page — which is the single most common way a set of screens stops looking like
one system while every individual screen still looks fine.

### Closing the scale

A scale that lists eight steps and silently tolerates a ninth is not a scale.
This one was audited by measuring every rendered text node in a real product
built on it, and the measurement is worth repeating on yours:

```js
// In the Playwright MCP, per route. Anything in offScale/offLead is a bug.
// Resolve the tokens THROUGH THE BROWSER rather than hardcoding pixel values:
// three steps are clamp()s, so their real value depends on the viewport. A
// hardcoded list plus a tolerance band gets this wrong in both directions —
// --ob-h1 sits 1.8px under its own max at 1440px and reads as off-scale, while
// a genuine stray 17px hides inside the band around --ob-sub.
const TOKENS = ['--ob-display','--ob-h1','--ob-h2','--ob-h3','--ob-lead','--ob-sub',
  '--ob-body','--ob-sm','--ob-xs','--ob-meta','--ob-meta-sm','--ob-meta-xs',
  '--ob-fig-xl','--ob-fig-lg','--ob-fig-md','--ob-fig-sm'];
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden';
document.body.appendChild(probe);
const SCALE = new Set(TOKENS.map(t => {
  probe.style.fontSize = `var(${t})`;
  return +parseFloat(getComputedStyle(probe).fontSize).toFixed(2);
}));
probe.remove();

const LEAD = new Set([0.98, 1, 1.08, 1.25, 1.4, 1.5, 1.6]);
const EXEMPT = /footer-mark|vf-num-unit|vf-num-per/;  // your commented exceptions
const offScale = [], offLead = [];
document.querySelectorAll('body *').forEach(el => {
  if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
  const cs = getComputedStyle(el);
  const fs = +parseFloat(cs.fontSize).toFixed(2);
  const ratio = Math.round((parseFloat(cs.lineHeight) / fs) * 100) / 100;
  const cls = typeof el.className === 'string' ? el.className : el.tagName;
  if (EXEMPT.test(cls)) return;
  if (!SCALE.has(fs)) offScale.push(`${fs}px ${cls}`);
  if (!LEAD.has(ratio)) offLead.push(`${fs}px/${ratio} ${cls}`);
});
return { offScale: [...new Set(offScale)], offLead: [...new Set(offLead)] };
```

Scroll to the bottom and wait before sampling, or every not-yet-revealed
section reports whatever it inherits rather than what it will paint. Run it at
both 1440px and 1280px — the clamps resolve differently and a rule that only
misbehaves at one width is exactly what a single-width check misses.

What that audit found on a product whose landing page *looked* consistent: 15
distinct sizes on the marketing page, **38 distinct size+leading pairs on one
app page** — roughly twice the typographic variety at the same level of
content — sourced from 67 hardcoded pixel values across three stylesheets and
six `text-[15px]` Tailwind escapes in components. None of it was expressive.
Each value was a local decision that nobody could see from anywhere else, and
the drift lived almost entirely in the *app*, not the landing page: marketing
pages get designed, product pages get extended.

Two lessons worth carrying into a new project:

- **The overflow concentrates just below `--ob-body`.** 15px, 17px and 19px
  are where "slightly smaller/larger than body" decisions land when there is
  no named step. Naming `--ob-sub` and `--ob-xs` up front removes most of it.
- **Tailwind arbitrary values are the leak.** `text-[15px]` reads as harmless
  and bypasses the whole system. Ship `.ob-sub` / `.ob-sm` / `.ob-xs` recipe
  classes so a component always has a token-backed way to say a size, and keep
  Tailwind to layout.

Deliberate exceptions are allowed but must be *unrepeatable and commented* —
in the reference product exactly three exist: a 220px stroked footer watermark
whose leading and tracking are tuned to make its baseline clip land, and two
`em`-relative fragments of a single numeral. Each is a proportion or a piece of
art, not a step. If an exception could plausibly get a second consumer, it is a
missing token, not an exception.

### The metadata layer

Mono, 12px, uppercase, `+0.10em`, `--ob-dim`. It carries ids, counts, domains,
timestamps, section labels, and status. It never carries a sentence — uppercase
mono at sentence length is unreadable. If your mono string has a verb in it,
it belongs in sans.

---

## Layout and rhythm

- Container `1200px`, gutter `40px`. Wider than 1200 and the hairlines stop
  reading as a frame.
- Section padding `160px` standard, `120px` for a tight pairing, never below 96.
- Radii: `4px` tags/chips · `10px` cards · `16px` large panels · `999px`
  buttons only. **Nothing else is a pill.** The system is architectural, not
  soft; a rounded card reads as a different system entirely.
- Grids: two-up asymmetric (`400px` + `1fr`) for scrollytelling; three-up for
  cards; four-up only for numerals. Avoid four-up cards — it shrinks type.
- The sticky-left / scrolling-right pattern is the house layout for anything
  with 2–4 sequential ideas. It gives the "pinned" feel without ever taking the
  scrollbar from the user.

---

## Components

Recipes live in a single stylesheet (`assets/recipes.css` is paste-ready).
**Tailwind is for layout only** — flex, grid, spacing, sizing. No `colors` key
in the Tailwind config.

- **Button.** Sans, weight 400, 14px, fully pill. *Primary:* solid accent,
  white text; hover brightens and adds the one permitted glow. *Ghost:*
  transparent with a `--ob-hairline-strong` border; hover raises the border to
  full text colour. *Bare:* text plus an arrow that translates on hover.
  Exactly one primary visible per viewport — hold back a fixed header's CTA
  until the hero's has scrolled away.
- **Badge / eyebrow pill.** `--ob-surface` fill, hairline border, pill radius,
  optionally an accent tag chip on the left.
- **Chip.** 4px radius, hairline border, mono 10–12px uppercase. The verified
  variant swaps to `--ob-hairline-accent` + accent text.
- **Live dot.** 6px, accent, the only pulsing thing in the system.
- **Rule.** `1px solid --ob-hairline`. Use it constantly.
- **Fragment card.** A bordered panel with a mono header bar on `--ob-void` and
  a body on `--ob-surface`. This is the container for all code-drawn product UI.
- **Composer / input.** `--ob-surface`, hairline border; focus swaps the border
  to `--ob-hairline-accent` and adds a 4px `--ob-accent-wash` ring.

Every interactive element ships hover, `:focus-visible`, active, and disabled
**at build time**, not in a polish pass. Focus rings must not inherit a hover
transition — a ring that fades in over 320ms reads as lag. Set
`transition: none` in the `:focus-visible` rule.

---

## Section patterns

Compose pages from these. Each names its media obligation — see
`references/media.md`.

| Pattern | Media obligation |
|---|---|
| **Hero** | Perspective media collage behind the headline (photography allowed here) + a CSS ambient bloom. |
| **Marquee strip** | None. Mono, edge-masked, pauses on hover. Must carry real information, not filler words. |
| **Scrollytelling pillars** | One code-drawn product fragment per panel. Never stock. |
| **Proof / mechanic** | A live DOM animation of the thing being claimed. Never a video of it. |
| **Conversation band** | None — the transcript and composer are the visual. |
| **Stat row** | None. Oversized mono numerals, counting up on reveal. |
| **Footer** | An oversized stroke-only wordmark as the closing graphic. |

---

## Reference files

Read the one you need; don't read them all up front.

| File | Read it when |
|---|---|
| `references/motion.md` | Adding any animation, scroll behaviour, reveal, or transition. |
| `references/media.md` | Deciding what fills a visual area — image, video, code, or slot. |
| `references/higgsfield.md` | Writing a generative brief, or generating/swapping real assets. |
| `references/verification.md` | Before calling any screen done. The Playwright MCP loop. |
| `references/pitfalls.md` | Something applied in the stylesheet but not on screen. Read this **first** when debugging CSS that "should work". |

`assets/tokens.css` and `assets/recipes.css` are paste-ready starting points for
a new project.

---

## Setting this up in a new project

1. Paste `assets/tokens.css` into your token file. Scope it however you like —
   `:root` if the whole app is Obsidian, `[data-theme='obsidian']` if you're
   introducing it alongside an existing system.
2. Paste `assets/recipes.css`. **Import it into `@layer components`**, not
   unlayered — see `references/pitfalls.md` §1, this is not optional.
3. Load Geist + Geist Mono as CSS variables (`next/font/google` exposes both).
4. Remove any `colors` key from the Tailwind config.
5. Check for global `@layer base` rules that hard-code an accent —
   `:focus-visible` and `::selection` are the usual offenders.

---

## Checklist before calling a screen done

- [ ] No colour value outside the token file.
- [ ] Exactly one primary button visible per viewport.
- [ ] Every blue thing is an action, a verification, or a live state — named out loud.
- [ ] Display headline ≥ 58px at weight 400 with `-0.035em`.
- [ ] Sections separated by a 1px rule, not a background change.
- [ ] Zero `box-shadow` outside the primary-button hover glow.
- [ ] Nothing but a button has a pill radius.
- [ ] Body copy is `--ob-muted`, not white.
- [ ] Mono carries no sentences.
- [ ] Every interactive element has hover, focus-visible, active, disabled.
- [ ] Focus rings snap — no transition.
- [ ] Ambient motion stops under `prefers-reduced-motion`; auto-advancing
      content resolves to a static full state, not a frozen partial one.
- [ ] Space reserved for anything that streams or arrives late.
- [ ] Read at 1440px **and** 1280px, and *measured* — see `references/verification.md`.

---

## Appendix — this repo

The system ships here as an isolated theme rather than a global one, because
the app surfaces have not been ported yet.

| Thing | Where |
|---|---|
| Tokens | `styles/tokens.css`, in the `[data-theme='obsidian']` block |
| Recipes | `styles/obsidian.css`, imported as `@import "./obsidian.css" layer(components)` |
| Components | `components/landing/` |
| Copy | `lib/content/landing.ts` — static site content, deliberately **not** `lib/fixtures/`, which is the Postgres seam for run data |
| Scope | `<div data-theme="obsidian">` wrapping `app/page.tsx` |
| Fonts | Geist + Geist Mono in `app/layout.tsx` |
| Media plan | `higgsfieldPlan.md` at the repo root |

**Deep Canopy is superseded.** `.claude/skills/deep-canopy-design/` describes
the forest-green system this replaced; `dark-luxury-design` was superseded
before that. Neither should be invoked. Forest-green or amber styling found in
the tree is a leftover to port, not a valid alternative.

**Not yet ported:** `/r/[slug]/*` and `/style-guide` still render Deep Canopy.
When porting, work surface by surface, and expect the two failure modes in
`references/pitfalls.md` §1 and §2 — `styles/components.css` is unlayered and
carries the same latent cascade bug this system already fixed.
