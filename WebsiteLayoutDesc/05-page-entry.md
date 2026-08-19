# 05 — Entry Page  `/`

---

## Purpose

Get someone from "I have an idea" to a running conversation in under ten
seconds, while giving a first-time visitor just enough to understand what will
happen. It is simultaneously the product's front door and its first input
screen — there is no separate marketing site.

## User intent

Two distinct arrivals, and the page serves both without a mode switch:

| Arrival | Intent | What they need |
|---|---|---|
| **Ready** (~60%) | "Let me just type it" | The box, immediately, above the fold, focused |
| **Curious** (~40%) | "What is this?" | Three panels explaining the three outputs, one scroll down |

Design bias: **the box wins.** The curious user can scroll. The ready user must
never have to.

---

## Layout — top to bottom

```text
┌────────────────────────────────────────────────────────────────────────┐
│  ◆ Startup Validator                          How it works    [Start] │  ← nav, transparent→blur
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                  ( No signup. One link. Five minutes. )                │  ← hero badge pill
│                                                                        │
│                          An idea in.                                   │  ← display headline
│                          Clarity out.                                  │     muted / bright
│                                                                        │
│         Describe what you're thinking about — a sentence, a            │  ← subcopy, --text-body
│         paragraph, or just a direction. Even "I don't know yet."       │     max 60ch
│                                                                        │
│      ┌──────────────────────────────────────────────────────────┐     │
│      │                                                          │     │
│      │  I want to do something in fitness, I don't know what…   │     │  ← THE BOX
│      │                                                          │     │     auto-grow, 132px min
│      │                                                          │     │     18px type
│      └──────────────────────────────────────────────────────────┘     │
│                                                                        │
│                          [  Start  →  ]                                │  ← the ONE .btn-primary
│                                                                        │
│         Try:  dental recall SMS  ·  tool for freelance editors  ·      │  ← example seeds
│               something in fitness                                     │     text actions
│                                                                        │
│                    ▁▁▁▁▁ amber elliptical orb ▁▁▁▁▁                    │  ← single, bottom-centre
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [What you get]                                                        │  ← section label
│                                                                        │
│  Three things, in about ten minutes.                                   │  ← h2, colour contrast
│                                                                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐              │
│  │ ▓▓ illustration│  │ ▓▓ illustration│  │ ▓▓ illustration│              │  ← 240px media panel
│  │    240px      │  │    240px      │  │    240px      │              │     bg #0e0c0a
│  ├───────────────┤  ├───────────────┤  ├───────────────┤              │
│  │ 01            │  │ 02            │  │ 03            │              │
│  │ A clear       │  │ What the web  │  │ What to do    │              │
│  │ description   │  │ already says  │  │ on Monday     │              │
│  │               │  │               │  │               │              │
│  │ desc, 1–2 sent│  │ desc, 1–2 sent│  │ desc, 1–2 sent│              │
│  └───────────────┘  └───────────────┘  └───────────────┘              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [How it's different]                                                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │  Every quote is checked against the page it came from.        │     │  ← the trust section
│  │                                                                │     │     ONE card, wide
│  │  ┌────────────────────────────────────────────────────┐      │     │
│  │  │ "Plans start at $299 per month per location…"      │      │     │  ← --bg-surface well
│  │  │  example.com/pricing        [VERIFIED]  ●          │      │     │     real-looking excerpt
│  │  └────────────────────────────────────────────────────┘      │     │
│  │                                                                │     │
│  │  If the words aren't on the page, they don't reach you.       │     │
│  │  47 VERIFIED // 18 DISCARDED // typical run                    │     │  ← Meta Line
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [Recent runs]                                          (conditional)  │
│  ─────────────────────────────────────────────────────────────────    │
│  SMS rebooking for dental clinics        roadmap    2 days ago    →   │  ← localStorage only
│  Tool for freelance video editors        report     5 days ago    →   │
│                                                                        │
│  Remembered by this browser only.                                      │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──── footer panel  --bg-footer  --r-xl ─────────────────────────┐   │
│  │  ◆ Startup Validator                                            │   │
│  │  Takes a vague idea and makes it clearer.                       │   │
│  │                                                                  │   │
│  │  ● [ALL SYSTEMS OPERATIONAL]              © 2026                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Section notes

**Nav** — wordmark left, two items right: `How it works` (scrolls to
`[What you get]`) and a `.btn-secondary.btn-sm` `Start` that focuses The Box.
The nav CTA is *secondary*, not primary — the hero already owns the one primary
button on this page (principle P6).

**Hero badge** — pill, `--r-pill`, `rgba(255,255,255,0.05)` bg,
`--border-subtle`. Copy: `No signup. One link. Five minutes.` Three facts, no
adjectives.

**Headline** — `--text-display`, weight 700, colour contrast per skill rule ②.
`An idea in.` in `--text-muted`, `Clarity ` muted + `out.` in `--text-primary`.

> **Word cycling is omitted.** The skill offers a cycling final word. Here the
> headline is a fixed four-word statement of the value exchange; cycling would
> dilute it and pull the eye away from The Box directly beneath. This is a
> considered omission of an optional skill flourish, not an oversight.

**The Box** — the centrepiece. See §Components below.

**Example seeds** — three text actions. Clicking one *fills* The Box (does not
submit) so the user can edit before starting. The third is deliberately vague
(`something in fitness`) to signal that vagueness is welcome — that single word
choice does more onboarding work than a paragraph of copy would.

**Orb** — one only, bottom-centre, per skill rule ⑦. Sits behind the box/CTA
area so the amber light reads as emanating from the primary action.

**What you get** — three feature cards using skill rule ⑤: a ~240px dark media
panel on top (`#0e0c0a`, `border-bottom: 1px solid var(--border-subtle)`,
`overflow: hidden` on the card) with text below at 24px padding. **No small
icon boxes.**

The three media panels should contain *abstracted product surfaces* rendered
in-brand — not stock illustration, not 3D renders:
- 01: a fragment of the Brief Panel, fields resolving from blank to filled
- 02: a fragment of the Finding stream, a `VERIFIED` badge landing
- 03: a fragment of an Open Question Card showing a numbered script

These can be static SVG/CSS compositions. They double as honest previews.

**How it's different** — one wide card containing a realistic verified-excerpt
specimen. This is the highest-value section on the page for a sceptical
visitor, and it works by *showing the mechanism*, not describing it.

**Recent runs** — rendered client-side only, hidden entirely when the list is
empty. Not a card grid — a plain divided list. It is a utility, not a feature.

**Footer** — full panel treatment per skill rule ⑨.

---

## Components used

| Component | Notes |
|---|---|
| `Nav` (landing variant) | Transparent → blur past 40px scroll |
| `HeroBadge` | Pill, static |
| `DisplayHeadline` | Muted/bright split spans |
| `TheBox` | Auto-growing textarea, primary input |
| `Button` (primary, secondary, sm) | One primary on the page |
| `ExampleSeed` | Text action that fills The Box |
| `Orb` | Single elliptical, breathing |
| `SectionLabel` | `[Bracket]` mono amber |
| `FeatureCard` | 240px media panel + text |
| `ExcerptSpecimen` | Recessed well + `VerifiedBadge` + source line |
| `MetaLine` | Mono `//` separated |
| `RecentRunsList` | Client-only, conditional |
| `FooterPanel` | Elevated, with `StatusBadge` |

---

## Interactions

| Trigger | Behaviour |
|---|---|
| Page load | Hero elements stagger in: headline 100ms → subcopy 220ms → box 340ms → CTA 460ms. The Box receives focus at 500ms (after motion settles — focusing mid-animation is disorienting). |
| Typing in The Box | Auto-grows to a max of 320px, then scrolls internally. Character count appears only past 1,200 chars, as a quiet `--text-tertiary` hint — never a hard limit shown up front. |
| The Box empty | `Start` is present but disabled (`opacity: 0.4`, pulse animation removed). It does not disappear — a vanishing CTA is disorienting. |
| The Box non-empty | `Start` enables, pulse animation resumes. |
| `⌘/Ctrl + Enter` | Submits. Hinted in a `--text-tertiary` line under the box once the user has typed ≥ 20 chars: `⌘↵ to start`. |
| `Enter` alone | Inserts a newline. This is a long-form input, not a search field. |
| Click example seed | Fills The Box with the seed text, focuses it, places the caret at the end. Does **not** submit. |
| Scroll past 40px | Nav gains blur + border. |
| Scroll into a section | `.reveal` fires: fade + 20px rise, 90ms stagger between siblings. |
| Hover feature card | `-2px` lift, deeper shadow. |
| Submit | Button label → `Starting…` with a small inline spinner; box becomes read-only; then redirect. |

---

## States

### Default
Hero visible, box empty and focused, `Start` disabled, recent runs hidden if
none.

### Typing
Box grown to content, `Start` enabled and pulsing, `⌘↵` hint visible.

### Submitting
```text
┌──────────────────────────────────────────────────┐
│  I want to do something in fitness…              │   ← read-only, --text-body
└──────────────────────────────────────────────────┘
             [  ◐ Starting…  ]                         ← spinner, no pulse
```
Duration should be well under a second (a row insert plus a redirect). If it
exceeds 2s, swap the label to `Still starting…` rather than adding a bar.

### Error — run creation failed
Inline, directly beneath the box. No modal, no red.

```text
┌──────────────────────────────────────────────────┐
│  I want to do something in fitness…              │   ← content preserved, editable
└──────────────────────────────────────────────────┘
  ⚠  Couldn't start the run. Your text is safe —
     try again.                          [ Try again ]
```
Amber left-border on the message, `--text-primary` copy. **The user's text is
never lost.** Also mirrored to `sessionStorage` on submit so a hard refresh
restores it.

### Empty — no recent runs
Section omitted entirely. No "you haven't validated anything yet" placeholder —
on a landing page that's noise.

### Populated — recent runs
Up to 10 rows, most recent first, each: one-liner (truncated to one line),
stage chip, relative time, `→`. Row hover: `rgba(255,255,255,0.02)`.

---

## Responsive behaviour

Per the scope decision, this is a **desktop-first, desktop-only** build. See
[13](13-responsive-and-accessibility.md) for the full rationale and the one
flagged risk.

| Breakpoint | Behaviour |
|---|---|
| **≥ 1280px (target)** | Full layout as drawn. Container 1200px. Feature cards 3-up. |
| **1024–1279px** | Container fluid with 32px gutters. Feature cards remain 3-up, media panels shrink to ~200px. No layout change. |
| **768–1023px** | Feature cards drop to 2-up + 1 wrapped. Display headline steps down via its existing `clamp()`. Nav items collapse to just the wordmark + `Start`. Usable, not optimised. |
| **< 768px** | **Not designed for v1.** The `clamp()` type scale and a single-column fallback (`grid-template-columns: 1fr` on the feature grid, container padding 20px) keep it from breaking, but no further work is done. |

The hero, The Box, and the CTA are single-column and centred at every width, so
the primary path degrades gracefully by construction.

---

## Copy specification

Exact strings, so tone stays consistent:

| Element | Copy |
|---|---|
| Hero badge | `No signup. One link. Five minutes.` |
| Headline | `An idea in.` / `Clarity out.` |
| Subcopy | `Describe what you're thinking about — a sentence, a paragraph, or just a direction. Even "I don't know yet."` |
| Box placeholder | `I want to do something in fitness, I don't know what yet…` |
| Primary CTA | `Start` + `ArrowRight` |
| Seeds label | `Try:` |
| Section 1 label | `[What you get]` |
| Section 1 heading | `Three things,` (muted) `in about ten minutes.` (bright) |
| Card 01 | `A clear description` — *An AI asks what it needs to ask, then writes down what you're actually building. "I don't know" is a fine answer to anything.* |
| Card 02 | `What the web already says` — *A research run across five dimensions. Every claim links to a real page, and every quote is checked against it.* |
| Card 03 | `What to do on Monday` — *The questions only real people can answer, with the interview scripts written out — and a build plan wired to them.* |
| Section 2 label | `[How it's different]` |
| Section 2 heading | `Every quote is checked` (bright) `against the page it came from.` (muted) |
| Section 2 body | `If the words aren't on the page, they don't reach you.` |
| Recent runs label | `[Recent runs]` |
| Recent runs note | `Remembered by this browser only.` |
| Footer tagline | `Takes a vague idea and makes it clearer.` |

**Banned copy patterns on this page:** "Get started today", "Supercharge",
"AI-powered", "Unlock", "Revolutionize", any exclamation mark, any statistic we
haven't measured, any testimonial we don't have.
