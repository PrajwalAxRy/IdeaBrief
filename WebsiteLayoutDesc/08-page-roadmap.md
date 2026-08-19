# 08 — Roadmap  `/r/[slug]/roadmap`

> Pillar 3. Two halves on one page: **(a)** the open questions only real people
> can answer, with the material to go ask them, and **(b)** a build plan wired
> to those questions.

---

## Purpose

Convert research into action. This is where the product either changes what
someone does on Monday or doesn't.

The exec summary is emphatic that the two halves belong together:

> The roadmap is explicitly wired to 3a: it names which open question would
> change which step. **That link is the whole reason both halves are in one
> product.**

## User intent

*"Fine — what do I actually do now?"*

They want something they can act on today, and they want to know what not to
waste time on. They will copy something out of this page into another tool.

---

## Why one page, not two tabs

Tabs would hide half the content and, worse, would break the wiring — a
Dependency Chip on a build step that jumps to a *different tab* loses the
sense of connection entirely.

**Decision: one scrolling page, two sections, with a sticky segmented control
that scroll-jumps between them.** The control is orientation, not navigation;
both halves stay in one document so the cross-links work by scrolling and
highlighting.

---

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator   ① Define ✓ ── ② Validate ✓ ── ③ Roadmap ●  [Copy link] │
│ RUN 7f3a91c4 // 6 OPEN QUESTIONS // 5 BUILD STEPS                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   What to do                                                                 │  ← h1 muted
│   next.                                                                      │     / bright
│                                                                              │
│   SMS rebooking for overdue dental patients                                  │
│                                                                              │
│  ┌──────────────────────────────────────────┐                               │
│  │  Open questions  │  Build roadmap        │   ← sticky segmented control  │
│  └──────────────────────────────────────────┘      (scroll-jump, not tabs)  │
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│  [Open questions]                                                            │
│                                                                              │
│  Six things the web can't tell you. Ordered by how much the answer           │
│  would change your plan.                                                     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ 01                                          ▴                       │     │  ← EXPANDED
│  │                                                                     │     │     card--featured
│  │ QUESTION     Do clinics actually track which patients are overdue? │     │
│  │                                                                     │     │
│  │ WHY IT       If they already have a list, this is an automation     │     │
│  │ MATTERS      product. If they don't, you have to build the list     │     │
│  │              first — a different product and a much harder sell.    │     │
│  │                                                                     │     │
│  │ ASK          Office managers at independent practices, 1–3 locations│     │
│  │                                                                     │     │
│  │ FIND THEM    · Dental office manager Facebook groups  ↗            │     │  ← real links
│  │              · r/dentistry  ↗                                       │     │     from Pillar 2
│  │              · Local practices you can walk into                    │     │
│  │              · 40+ named people in the forum threads we found [12] │     │  ← citation chip
│  │                                                                     │     │
│  │ HOW MANY     6–8 conversations is enough to see the pattern         │     │
│  │                                                                     │     │
│  │ THE SCRIPT   ┌────────────────────────────────────────────────┐    │     │
│  │              │ 1. Walk me through what happens when a patient │    │     │  ← --bg-surface
│  │              │    misses their recall.                         │    │     │     Script Block
│  │              │ 2. How do you know who's overdue right now?    │    │     │
│  │              │ 3. When was the last time you chased one?      │    │     │
│  │              │    What happened?                               │    │     │
│  │              │ 4. What would have to be true for you to not   │    │     │
│  │              │    need to think about it?                      │    │     │
│  │              └────────────────────────────────────────────────┘    │     │
│  │                                            [ Copy script ]         │     │  ← primary action
│  │                                                                     │     │     of the card
│  │ WHAT YOU     If most can pull the list in under a minute →          │     │
│  │ LEARN        automation. If most say "we don't really know" →       │     │
│  │              the list is the product.                               │     │
│  │                                                                     │     │
│  │ ─────────────────────────────────────────────────────────────────  │     │
│  │ Changes:  ▸ First thing to build                                   │     │  ← forward link
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ 02   What would a practice pay for this specifically?         ▾    │     │  ← COLLAPSED
│  │      ASK  Practice owners, 1–3 locations                            │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ 03   Which practice management system do they actually use?   ▾    │     │
│  │      ASK  Office managers                                           │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│  … 04, 05, 06                                                                │
│                                                                              │
│                                              [ Copy all scripts ]            │  ← secondary
│                                                                              │
│  ══════════════════════════════════════════════════════════════════════════ │
│  [Build roadmap]                                                             │
│                                                                              │
│  How to actually make this — specific to your idea, and honest about         │
│  what to leave out.                                                          │
│                                                                              │
│   ●───  BEFORE YOU BUILD                                                     │  ← timeline spine
│   │     The 6–8 conversations above. Two weeks. Nothing here is              │
│   │     expensive to change yet, and question 01 changes what you            │
│   │     build first.                                                          │
│   │     ◂ depends on  Q01                        ← Dependency Chip           │
│   │                                                                           │
│   ●───  FIRST THING TO BUILD                                                 │
│   │     the smallest version a real user could use                           │
│   │                                                                           │
│   │     A single-clinic tool: paste in a CSV of overdue patients,            │
│   │     it drafts and sends the messages, you watch what comes back.         │
│   │                                                                           │
│   │     ┌──────────────────────────────────────────────────────┐            │
│   │     │  NOT IN IT                                            │            │  ← the cut list,
│   │     │  · the PMS integration                                │            │     given weight
│   │     │  · the dashboard                                      │            │
│   │     │  · multi-user                                         │            │
│   │     │  · billing                                            │            │
│   │     └──────────────────────────────────────────────────────┘            │
│   │     Roughly 2–3 weeks. You'd run it manually for the first clinic.       │
│   │     ◂ depends on  Q01  Q03                                               │
│   │                                                                           │
│   ●───  THEN                                                                 │
│   │     Only after a clinic uses it twice: the practice management           │
│   │     integration for whichever system your interviews said they use.      │
│   │     ◂ depends on  Q03                                                    │
│   │                                                                           │
│   ●───  LATER, AND ONLY IF                                                   │
│   │     · Dashboard and reporting — only once someone asks for it.           │
│   │     · Self-serve signup — only once you've sold three manually.          │
│   │                                                                           │
│   ●───  WHAT WOULD CHANGE THIS PLAN                                          │
│         If the interviews say clinics don't have the overdue list, the       │
│         first build becomes finding overdue patients, not messaging          │
│         them. That's a bigger product — stop and rethink scope before        │
│         writing code.                                                         │
│         ◂ depends on  Q01                                                    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  RUN 7f3a91c4   [Copy link]   ← Back to the report   Validate your own idea →│
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## The Open Question Card

The most distinctive component in the product. Its structure comes directly
from the exec summary's ASCII specimen, and rendering it as a **labelled grid**
rather than prose is what makes it feel like a working document rather than
model output.

### Grid structure

Two columns: a 120px monospace label column and a content column.

```css
.oq-grid { display: grid; grid-template-columns: 120px 1fr; gap: 20px 24px; }
.oq-label {
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em;
  color: var(--text-tertiary); text-transform: uppercase; padding-top: 3px;
}
.oq-value { color: var(--text-body); font-size: 15px; line-height: 1.6; }
.oq-value--question { color: var(--text-primary); font-size: 18px; font-weight: 600; }
```

Labels, in fixed order: `QUESTION` · `WHY IT MATTERS` · `ASK` · `FIND THEM` ·
`HOW MANY` · `THE SCRIPT` · `WHAT YOU LEARN`.

Where a survey fits, two extra rows appear after `THE SCRIPT`:
`THE SURVEY` (actual question wording + answer options in a Script Block) and a
one-line note: *"Surveys are for counting things after interviews have told you
what to count."* — verbatim from the exec summary's intent.

### Collapsed vs expanded

- **Question 01 is expanded on load.** Everything else is collapsed. Reduces a
  wall of six long cards to one readable card plus five scannable rows.
- Collapsed face: number, question text, and the `ASK` line only. Enough to
  decide whether to open it.
- Expanding does not collapse others — accordion behaviour here would fight a
  user comparing two questions.
- Expanded card gets `card--featured` (amber ring). At most one card is
  visually "featured" at a time in practice, which keeps the amber budget
  intact.
- Transition: `grid-template-rows: 0fr → 1fr`, 300ms `--ease-out`.

### The Script Block and Copy script

```text
┌────────────────────────────────────────────────┐
│ 1. Walk me through what happens when a patient │   --bg-surface
│    misses their recall.                         │   --font-sans 14px
│ 2. How do you know who's overdue right now?    │   --leading-relaxed
│ 3. …                                            │   20px padding, --r-md
└────────────────────────────────────────────────┘
                              [ Copy script ]
```

`Copy script` is the **primary action of the card** — the whole point of Pillar
3a is that the material is copy-pasteable. It's a `.btn-primary` when its card
is the expanded one, `.btn-secondary` otherwise (preserving the one-primary
rule, since only one card is expanded by default).

Copies **clean plain text** — the numbered questions only, no markdown, no
labels, no attribution footer. It goes into a notes app or a doc; anything
extra is something the user has to delete.

Confirmation: button label swaps to `Copied` with a `Check` glyph for 2s.
No toast.

`Copy all scripts` at the section end copies all questions in a plain-text
format with question headings — for someone who wants the whole interview guide
in one paste.

### FIND THEM must be real

This row is only valuable if it's specific, and the exec summary says the
specificity comes from the research run at no extra cost. Rendering rules:

- Named communities render as links with `↗` when Pillar 2 found a URL
- A count of named people in threads renders with the Citation Chip pointing at
  the evidence, e.g. `40+ named people in the forum threads we found [12]` —
  chip numbering is shared with the report ([07](07-page-validate.md#the-citation-system))
- Generic items (`local practices you can walk into`) render as plain text
- If the research surfaced nothing usable, the row says
  `We didn't find specific communities for this — start with the general ones
  and ask who else to talk to.` **Never a fabricated list.**

---

## The build roadmap

### Timeline structure

A vertical spine (`1px` `--border-subtle`) with 9px nodes. Five fixed steps,
named exactly as in the exec summary:

`BEFORE YOU BUILD` · `FIRST THING TO BUILD` · `THEN` · `LATER, AND ONLY IF` ·
`WHAT WOULD CHANGE THIS PLAN`

Step headings: mono, 12px, `--text-primary`, wide tracking. `FIRST THING TO
BUILD` carries a `--text-tertiary` subtitle: *the smallest version a real user
could use*. Its node is ringed `--accent` with a soft glow — it is the step the
user acts on after the interviews, and the only one that gets emphasis.

### The NOT IN IT block — deliberately prominent

The exec summary:

> The most valuable thing this section can do for an early-stage person is tell
> them what *not* to build yet.

So the cut list is **not** muted, struck through, or hidden in a footnote. It
gets its own recessed `--bg-surface` well with a mono `NOT IN IT` label and
items in `--text-body` — the same reading weight as the rest of the step. The
visual message is *this list is content, not caveat.*

### Dependency Chips — the wiring

The mechanism that justifies both halves living in one product.

```text
◂ depends on  Q01  Q03
```

- Mono, 11px, `--text-tertiary` for `depends on`, chips in `--accent` on
  `--accent-subtle`
- Click → smooth-scrolls to that Open Question Card, expands it, and pulses its
  amber ring once (600ms)
- **Bidirectional**: each Open Question Card ends with
  `Changes: ▸ First thing to build`, which scrolls down and pulses the step

Without this the page is two unrelated lists. With it, the user can see that
question 01 is load-bearing — which is exactly the insight the product exists
to deliver.

---

## Interactions

| Trigger | Behaviour |
|---|---|
| Mount | Q01 expanded; segmented control sticks below the header on scroll |
| Click segmented control | Smooth scroll to that section; active segment updates |
| Scroll | Segmented control's active state follows position (scrollspy) |
| Click collapsed question | Expands, 300ms; card gains amber ring |
| Click expanded question header | Collapses |
| Click `Copy script` | Clipboard write; label → `Copied` 2s |
| Click `Copy all scripts` | Same, whole guide |
| Click Dependency Chip | Scroll + expand + pulse target |
| Click `Changes: ▸ …` | Scroll + pulse target step |
| Click Citation Chip | Evidence Drawer (same component as the report) |
| Click `↗` on a community | New tab, `noopener noreferrer` |
| Hover a step node | Node ring brightens; no other change |

---

## States

**Loading** — Server-rendered. Streamed skeletons: one expanded-card outline,
five collapsed rows, five timeline steps.

**Default** — As drawn.

**Generating** (if Pillar 3 is produced after the report renders) — The Stage
Rail's Roadmap segment shows `◐` and the page shows:
> `Writing the questions and the build plan…`
> with the same honest phase language as the Run Console. Sections appear as
> they complete: open questions first, roadmap second.

**Empty — fewer than four questions generated** — Render what exists. Do not
pad to reach the exec summary's four-to-seven range. If only two questions are
genuinely open, two questions is the honest output, and a `--text-tertiary`
line says: `Only {n} things were genuinely unresolved after the research.`

**Thin-evidence run** — This page becomes the product's main output
([04](04-user-journeys.md#45--journey-d--the-thin-evidence-run)). Two changes:
a lead-in line above the questions —
> `The web didn't have much on this, which makes these conversations the fastest
> way to learn anything real.`
— and the build roadmap's `WHAT WOULD CHANGE THIS PLAN` step is expanded and
given the accent node instead of `FIRST THING TO BUILD`.

**Error — roadmap generation failed** — The report is intact and reachable, so
this page shows:
> `We couldn't write the roadmap for this run.`
> `The research is finished and safe — you can try again.`
> `[ Try again ]  [ Back to the report ]`

**Success — copy** — Inline label swap only. No toast, no modal, no animation
beyond the label change.

---

## Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| **≥ 1280px (target)** | Content column max 900px, centred. Open Question grid at `120px 1fr`. Timeline full width of the column. |
| **1024–1279px** | Identical; column becomes fluid with 32px gutters. |
| **768–1023px** | Open Question grid **stacks**: label above value (`grid-template-columns: 1fr`, label margin-bottom 6px). This is the single most important adaptive rule on the page — a 120px label column plus a usable content column doesn't fit below ~900px. Timeline unchanged. |
| **< 768px** | Not designed for v1. The stacked grid rule above carries it; Script Blocks scroll horizontally rather than wrap awkwardly. |

---

## Copy specification

| Element | Copy |
|---|---|
| h1 | `What to do` (muted) `next.` (bright) |
| Section A label | `[Open questions]` |
| Section A lead | `{n} things the web can't tell you. Ordered by how much the answer would change your plan.` |
| Section B label | `[Build roadmap]` |
| Section B lead | `How to actually make this — specific to your idea, and honest about what to leave out.` |
| Copy actions | `Copy script` → `Copied` · `Copy all scripts` |
| Dependency | `◂ depends on` / `Changes: ▸` |
| Cut list label | `NOT IN IT` |
| No-communities fallback | `We didn't find specific communities for this — start with the general ones and ask who else to talk to.` |
| Footer links | `← Back to the report` · `Validate your own idea →` |
