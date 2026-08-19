# 07 — Validate  `/r/[slug]/validate`

> Pillar 2. One route, two modes: the **Run Console** while research executes,
> and the **Report** when it completes. This is the product's most important
> surface and the one people will share.

---

## Purpose

**Mode A (Run Console)** — hold the user's attention and trust for three to
five minutes by showing real machinery doing real work.

**Mode B (Report)** — deliver an evidence-backed picture of what the world
already says about the idea, where every claim is one click from its source,
and no claim is a verdict.

## User intent

| Mode | Intent |
|---|---|
| A | *"Is this actually doing something? How long?"* |
| B | *"What do I now know that I didn't ten minutes ago — and can I believe it?"* |
| B, cold visitor | *"What is this and should I take it seriously?"* |

## Mode selection

Server-side, from `runs.status`:

```text
status = running    → Mode A (Run Console), SSE connected
status = complete   → Mode B (Report), fully server-rendered
status = failed     → Failure state, §Error states
```

The transition A → B happens **in place, without navigation.** When the SSE
stream emits `complete`, the console cross-fades to the report over 400ms. No
redirect, no page flash, no scroll jump to top. The user watched it get built;
they should see it become the thing.

---

# MODE A — Run Console

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator   ① Define ✓ ── ② Validate ● ── ③ Roadmap ○  [Copy link] │
│ RUN 7f3a91c4 // 19 QUERIES // 24 PAGES FETCHED // 31 VERIFIED // 12 DISCARDED│  ← live Meta Line
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Reading the web                                                            │  ← h1, muted
│   about your idea.                                                           │     / bright
│                                                                              │
│   SMS rebooking for overdue dental patients          ← the brief one-liner   │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │  ● searching  ────  ○ fetching  ────  ○ verifying  ────  ○ writing │    │  ← phase strip
│   │                                                        2:14 elapsed│    │     words, not %
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
├────────────────────────────────┬─────────────────────────────────────────────┤
│  LEFT RAIL  (320px, sticky)    │  FINDING STREAM  (1fr, max 760px)          │
│                                │                                             │
│  [Queries]                     │  [Verified findings]                        │
│  ─────────────────────         │  ─────────────────────────────────          │
│  ✓ dental recall software      │                                             │
│    pricing                     │  ┌──────────────────────────────────────┐  │
│  ✓ missed dental recall        │  │ MONEY                    ● VERIFIED  │  │  ← newest first
│    appointment statistics      │  │                                       │  │
│  ◐ site:reddit.com dentists    │  │ Weave charges $300–600/mo per        │  │
│    recall patients             │  │ location for practice communication  │  │
│  ○ dental patient texting      │  │                                       │  │
│    HIPAA rules                 │  │ ┌───────────────────────────────────┐│  │
│  … 15 more                     │  │ │ "Plans start at $299 per month    ││  │  ← --bg-surface
│                                │  │ │  per location…"                   ││  │     excerpt well
│  [Coverage]                    │  │ └───────────────────────────────────┘│  │
│  ─────────────────────         │  │ example.com  ·  2026-02-14      ↗    │  │
│  The problem     ▰▰▰▰▰▰▰▱  12  │  └──────────────────────────────────────┘  │
│  What exists     ▰▰▰▰▰▰▱▱   9  │                                             │
│  Demand signals  ▰▰▰▰▱▱▱▱   6  │  ┌──────────────────────────────────────┐  │
│  Money           ▰▰▰▰▰▰▰▱  11  │  │ THE PROBLEM              ● VERIFIED  │  │
│  Practical       ▰▱▱▱▱▱▱▱   2  │  │ …                                     │  │
│                                │  └──────────────────────────────────────┘  │
│  ─────────────────────         │                                             │
│  12 excerpts discarded         │           ▁▁▁ dim amber orb ▁▁▁            │
│  (didn't match the page)       │                                             │
│                                │                                             │
├────────────────────────────────┴─────────────────────────────────────────────┤
│  You can close this tab — the run keeps going. Come back to this link.       │
│                                                    [Copy link]               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## The four trust devices

Everything on this screen exists to make the machinery legible. Four elements
carry that job:

### 1. The Query Ticker (left rail, top)

The **actual generated search queries**, listed as they run. Monospace, 12px,
`--text-body`, with a state glyph:

| Glyph | Meaning | Colour |
|---|---|---|
| `○` | Queued | `--text-tertiary` |
| `◐` | Running | `--accent`, gentle rotation |
| `✓` | Returned | `--text-body` |

Shows the first 4–6 with a `… {n} more` expander. Seeing real, specific,
idea-shaped queries — `site:reddit.com dentists recall patients` — is more
convincing than any amount of progress-bar animation, because it proves the
system understood the idea.

### 2. The Coverage bars (left rail, bottom)

Five dimensions, live counts, bars relative to the run's own maximum (not to
100%). Per [02](02-visual-direction.md#2-coverage-bar-run-console-per-dimension).
A dimension sitting at 0–1 late in the run gets a quiet `thin` tag — early
warning that Journey D may be coming.

### 3. The Finding Stream (main column)

Each verified finding appears as a card the moment it passes verification.
Newest at top. Entrance: fade + 12px rise over 320ms; the `● VERIFIED` badge
fades in **180ms after the card**, so verification reads as a discrete event
rather than a decoration.

Finding Card anatomy:

```text
┌────────────────────────────────────────────────┐
│ MONEY                            ● VERIFIED    │  ← dimension (mono, tertiary)
│                                                 │     badge (mono, --success dot)
│ Weave charges $300–600/mo per location for     │  ← the finding, --text-primary
│ practice communication                          │     15px
│                                                 │
│ ┌─────────────────────────────────────────────┐│
│ │ "Plans start at $299 per month per          ││  ← verbatim excerpt
│ │  location…"                                  ││     --bg-surface well
│ └─────────────────────────────────────────────┘│     --text-body, italic
│                                                 │
│ example.com  ·  2026-02-14                 ↗   │  ← source + date + external
└────────────────────────────────────────────────┘
```

The excerpt is shown **inline, during the run** — not hidden behind a click.
The whole point is that the user watches verifiable text arrive.

Cap the visible stream at ~25 cards to keep the DOM sane; older cards drop off
with a `+{n} earlier findings` line that scrolls them back.

### 4. The discard count

`12 excerpts discarded (didn't match the page)` in the left rail, and in the
header Meta Line.

This is counter-intuitive and correct: **advertising what we threw away is the
strongest possible statement that the filter is real.** Give it a permanent
place, not a tooltip.

## Phase strip

Four phases in plain words, not jargon: `searching` → `fetching` → `verifying`
→ `writing`. Current phase filled amber; completed phases `--text-body` with a
`✓`; upcoming `--text-muted` hollow. Elapsed time in mono at the right.

**No percentage. No ETA.** If a phase runs long, nothing changes — the query
ticker and finding stream carry the sense of motion.

## Interactions (Mode A)

| Trigger | Behaviour |
|---|---|
| SSE `query.start` | Ticker row → `◐` |
| SSE `query.done` | Ticker row → `✓` |
| SSE `finding.verified` | Card prepends with entrance animation; dimension count and bar increment; header Meta Line updates |
| SSE `finding.discarded` | Discard counter increments only — the discarded content is never shown |
| SSE `phase` | Phase strip advances |
| SSE `complete` | Cross-fade to Mode B in place, 400ms |
| Hover Finding Card | `-2px` lift |
| Click Finding Card | Opens Evidence Drawer |
| Click `↗` | Opens source in a new tab (`rel="noopener noreferrer"`) |
| Click `Copy link` | Label → `Copied` for 2s |
| Tab hidden then restored | SSE reconnects; on reconnect the client refetches current state rather than replaying — findings that landed while hidden appear without animation, all at once |

## States (Mode A)

**Connecting** — Phase strip shows `starting…`; ticker shows the queries
(already known from the brief) all at `○`; stream shows three skeleton cards.
Lasts a few seconds at most.

**Running, no findings yet** — The stream shows an honest placeholder, not an
empty box:
> `Nothing verified yet. Findings appear here as they pass the check.`
This is the highest-anxiety moment of the run and it needs a sentence.

**Running, findings arriving** — As drawn.

**Stalled** — no event for 45s: a `--text-tertiary` line under the phase strip:
`Still working — some pages are slow to fetch.` It updates the user without
implying breakage. At 180s with no event, offer a `Refresh` secondary action.

**SSE disconnected** — a quiet bar under the header: `Reconnecting…`. Auto-retry
with backoff. After 3 failures, fall back to polling `GET /r/[slug]/status`
every 5s and say so: `Reconnecting — checking every few seconds.` The run
itself is unaffected; this is purely a view-layer problem and the copy should
not alarm.

**Failed** — see §Error states below.

---

# MODE B — The Report

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator   ① Define ✓ ── ② Validate ✓ ── ③ Roadmap ✓  [Copy link] │
│ RUN 7f3a91c4 // 19 QUERIES // 31 PAGES // 47 VERIFIED // 18 DISCARDED        │
├──────────────────────────────────────────────────────────────────┬───────────┤
│  REPORT  (1fr, prose max 68ch)                                   │  INDEX    │
│                                                                   │  240px    │
│   What the web                                                    │  sticky   │
│   already says.                                                   │           │
│                                                                   │ ▏What we  │  ← scrollspy
│   SMS rebooking for overdue dental patients                       │ ▏found    │     amber tick
│   Researched 19 Aug 2026 · 47 verified findings                   │  Dimensions│    on active
│                                                                   │  Competitors│
│  ══════════════════════════════════════════════════════════════   │  Surprises │
│                                                                   │  Unanswered│
│  [What we found]                                                  │           │
│                                                                   │  ───────  │
│  Three companies already sell recall automation to dental         │  47 findings│
│  practices, and they charge between $199 and $600 a month [3]     │  31 sources │
│  [7]. The specific complaint that shows up repeatedly in          │           │
│  practice-manager communities is not that reminders don't         │  [Sources]│
│  exist, but that nobody knows who is overdue in the first         │           │
│  place [12] [19]. …                                               │           │
│                                    ↑ Citation Chips               │           │
│  ══════════════════════════════════════════════════════════════   │           │
│                                                                   │           │
│  [The problem]                                    ▰▰▰  solid      │  ← Confidence Note
│  DIMENSION: PROBLEM // 12 FINDINGS // 9 SOURCES // 2024-11→2026-06│  ← Meta Line
│                                                                   │           │
│  Plain-language paragraph of what the evidence says, with          │           │
│  citations inline [4] [11].                                       │           │
│                                                                   │           │
│  ▾ Show the 12 findings                          ← accordion      │           │
│                                                                   │           │
│  [What exists already]                            ▰▰▱  mixed      │           │
│  …                                                                │           │
│  [Demand signals]                                 ▰▰▰  solid      │           │
│  [Money]                                          ▰▰▰  solid      │           │
│  [Practical realities]                            ▰▱▱  thin       │           │
│                                                                   │           │
│  ══════════════════════════════════════════════════════════════   │           │
│                                                                   │           │
│  [Who else is doing this]                                         │           │
│                                                                   │           │
│  ┌───────────────────────┐  ┌───────────────────────┐            │           │
│  │ Weave              ↗  │  │ Lighthouse 360     ↗  │            │           │
│  │ US · regional          │  │ US · regional          │            │           │
│  │ $300–600/mo/location   │  │ $329/mo                │            │           │
│  │ ────────────────────   │  │ ────────────────────   │            │           │
│  │ Broad comms suite;     │  │ …                      │            │           │
│  │ yours is recall-only   │  │                        │            │           │
│  │ ▾ moat · take · ignore │  │ ▾ moat · take · ignore │            │           │
│  └───────────────────────┘  └───────────────────────┘            │           │
│                                                                   │           │
│  ══════════════════════════════════════════════════════════════   │           │
│                                                                   │           │
│  [What surprised us]                                              │           │
│  ┌──────────────────────────────────────────────────────────┐    │           │
│  │  card--featured, amber ring, 40px padding                 │    │           │
│  │                                                            │    │           │
│  │  01  Nobody is selling the list, only the messaging.      │    │           │
│  │      Every competitor assumes the practice already knows  │    │           │
│  │      who's overdue. Practice managers say they don't [12].│    │           │
│  │                                                            │    │           │
│  │  02  …                                                     │    │           │
│  └──────────────────────────────────────────────────────────┘    │           │
│                                                                   │           │
│  ══════════════════════════════════════════════════════════════   │           │
│                                                                   │           │
│  [What we couldn't answer from the web]                           │           │
│                                                                   │           │
│  · Whether clinics can actually pull a list of overdue patients   │           │
│  · What a practice would pay for this specifically                │           │
│  · Which practice management system to build against first        │           │
│                                                                   │           │
│  These need real conversations. We've written the scripts.        │           │
│                                                                   │           │
│                    [  What to do next  →  ]      ← the ONE primary│           │
│                                                                   │           │
├──────────────────────────────────────────────────────────────────┴───────────┤
│  RUN 7f3a91c4   [Copy link]   View all sources   Validate your own idea →    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Section-by-section specification

### 1. What we found

Three to five model-written sentences. **Every sentence carries at least one
Citation Chip.** Set larger than body — 18px, `--text-primary`,
`--leading-relaxed` — because it is the executive summary of the whole run.

If a sentence would have no citation, it doesn't ship. A rendering-time
assertion is worth adding: uncited prose in this section is a bug.

### 2. Per dimension × 5

Fixed order matching the exec summary: The problem · What exists already ·
Demand signals · Money · Practical realities.

Each section:
- `[Bracket]` section label, left
- **Confidence Note** right-aligned on the same line: three bars + the word
  (`solid` / `mixed` / `thin`). Never a number, never a colour
- Meta Line beneath with real counts and the date range of sources
- One or two plain-language paragraphs with inline chips
- An accordion: `▾ Show the {n} findings` → expands to Finding Cards
  (same component as Mode A, minus the entrance animation)

**Confidence wording, exactly:** `solid`, `mixed`, `we couldn't find much`
(displayed as `thin` in the compact bar label, spelled out in the section body).
No other vocabulary. Never "high/medium/low confidence" — that reads as a score.

### 3. Who else is doing this

Competitor Cards in a 2-up grid. **Rendered from fields, not written as prose**
— the exec summary is explicit that this is so the numbers can't drift.

Collapsed face: name + `↗`, geography, price, and the one-line
`difference_from_idea`. Expanded (`▾ moat · take · ignore`): moat,
`take_from_them`, `ignore`.

Missing fields render as `not established from available evidence` in
`--text-muted` — **never omitted, never guessed.** That rule comes from the
prior plan and is worth keeping; a blank field looks like a bug, an honest
label looks like rigour.

If zero competitors were found, the section is **omitted entirely** — no empty
grid, no "no competitors found!" (which would read as encouragement, i.e. a
verdict).

### 4. What surprised us

Two or three findings, in a single `card--featured` panel with the amber ring.
Numbered `01` / `02` / `03` in mono amber. 40px padding, generous line height.

This is the section the exec summary predicts people will screenshot, so it is
the one place where visual weight is spent deliberately: the amber ring, the
extra padding, and the isolation from surrounding content all serve
shareability.

### 5. What we couldn't answer from the web

A plain bulleted list in `--text-body`, then one line of framing, then the
single `.btn-primary` on the page: `What to do next →` linking to
`/r/[slug]/roadmap`.

The report ends pointing forward. That is its job.

---

## The citation system

The product's differentiator, expressed in three layers of disclosure.

```text
LAYER 1 — the chip, inline in prose
   … charge between $199 and $600 a month [3] [7].
   ┌──┐
   │[3]│  mono, 11px, --accent, --accent-subtle bg, --r-md (4px),
   └──┘  2px 5px padding, baseline-aligned, cursor: pointer

LAYER 2 — hover popover, 300ms delay, 360px wide
   ┌────────────────────────────────────────┐
   │ "Plans start at $299 per month per     │  ← the excerpt, italic
   │  location…"                             │
   │ ────────────────────────────────────── │
   │ example.com · 2026-02-14   ● VERIFIED  │
   └────────────────────────────────────────┘

LAYER 3 — click → Evidence Drawer, 480px, right
   ┌──────────────────────────────────────────┐
   │  Evidence 3                          ✕   │
   │  EV_03 // VERIFIED // MONEY              │  ← Meta Line
   │  ────────────────────────────────────────│
   │  FINDING                                  │
   │  Weave charges $300–600/mo per location  │
   │                                           │
   │  VERBATIM EXCERPT                         │
   │  ┌──────────────────────────────────────┐│
   │  │ "Plans start at $299 per month per   ││  ← --bg-surface well
   │  │  location, billed annually…"          ││
   │  └──────────────────────────────────────┘│
   │  This text was found on the page below.  │  ← the trust sentence
   │                                           │
   │  SOURCE                                   │
   │  example.com/pricing                  ↗  │
   │  Published 2026-02-14                     │
   │  Stance: supports                         │
   │                                           │
   │  ← Prev evidence      Next evidence →    │  ← walk the corpus
   └──────────────────────────────────────────┘
```

**Chip numbering is global and stable across the run** — `[12]` means the same
finding in the report, the sources page, and the roadmap. This lets the roadmap
cite the same evidence without a second numbering scheme.

The drawer supports keyboard: `Esc` closes, `←`/`→` walk evidence, focus traps
inside, and focus returns to the originating chip on close.

---

## Thin-evidence variant

Triggered per [04](04-user-journeys.md#45--journey-d--the-thin-evidence-run):
< 12 total verified findings, or ≥ 3 dimensions with < 2.

Changes to the layout:

1. **Thin-Evidence Notice moves to the top**, above "What we found", as a
   `card--featured` panel:
   > **We found very little about this online.**
   > That is not evidence against your idea — it usually means the idea is new,
   > very local, or described in words the web doesn't use yet. The most useful
   > part of this run is the next section.
   > `[ What to do next → ]`
2. Empty dimensions **collapse into one line each** under a single
   `[Dimensions with little evidence]` heading — not five empty sections.
3. Competitors section omitted if empty.
4. "What we couldn't answer" is expanded and given the visual weight normally
   spent on "What surprised us".
5. The primary CTA appears **twice**: in the notice and at the end.

Tone: diagnostic, never apologetic, never encouraging. One acknowledgement,
then get on with it.

---

## States (Mode B)

**Loading** — Server-rendered; there is no client loading state for the report
body. If streamed section-by-section (recommended, via React Suspense),
skeletons match the final section shapes: a 4-line block for the summary,
5 header rows for dimensions, 2 card outlines for competitors.

**Default** — As drawn.

**Empty (thin)** — Per the variant above.

**Error — run failed mid-pipeline** — The report route shows what survived:
> **This run didn't finish.**
> We got as far as {phase}. Here's what was verified before it stopped —
> {n} findings. You can run it again from the same brief.
> `[ Run it again ]` `[ View the brief ]`
>
> Partial findings render below in a flat list. **Nothing verified is ever
> thrown away because a later stage failed.**

**Error — no run at this slug** — See [09](09-pages-supporting.md).

**Success — report just completed** (arriving via cross-fade from Mode A) — The
"What we found" section gets a one-time reveal: it fades in 200ms after the
cross-fade completes, so the eye lands on it first. Nothing else is
special-cased.

---

## Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| **≥ 1360px (target)** | Report `1fr` (prose 68ch) + 240px sticky index. Console: 320px rail + `1fr` stream. Competitors 2-up. |
| **1100–1359px** | Index narrows to 200px. Console rail to 280px. Layout otherwise identical. |
| **900–1099px** | Index hides; a compact section-jump control appears under the report header instead. Console rail moves **above** the stream as a horizontal strip (queries as a single scrolling line, coverage as a 5-across row). Competitors drop to 1-up. |
| **< 900px** | Not designed for v1. Single column, index hidden, Evidence Drawer becomes full-width. Readable, unoptimised. |

Because this is the page most likely to be opened from a shared link on a
phone, the `< 900px` single-column fallback is worth the ~half-day it costs
even under a desktop-only scope. Flagged in
[17](17-open-questions.md#r1--shared-links-open-on-phones).
