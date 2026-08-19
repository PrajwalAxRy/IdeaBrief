# Frontend-Only Build Plan

> **What this is:** the execution plan for building the Startup Validator
> frontend as a **clickable prototype with no backend**, from the design
> blueprint in [`WebsiteLayoutDesc/`](WebsiteLayoutDesc/).
>
> **Why it exists:** the blueprint is 17 files of *specification*, ordered for
> reading. This file re-cuts it into 12 *buildable* phases, each sized to fit
> in one Claude session's context.
>
> **Status:** not started.

> **Design skill — imperative:** every phase in this plan must be built using
> the Claude skill **`dark-luxury-design`** as the primary design system. Only
> consult the **`clean-design`** skill if a specific reference or pattern is
> needed that `dark-luxury-design` doesn't cover. Do not design or build any
> screen from memory or default styling — invoke the skill.

---

## How to use this file

**If you are a Claude session picking this up cold, read this section first.**

1. Find the first phase in the [progress table](#progress) that is not `DONE`.
2. Read **only** the spec files that phase lists. Do not read the whole
   `WebsiteLayoutDesc/` folder — it will not fit alongside the work.
3. Read [Standing rules](#standing-rules) and [The prototype contract](#the-prototype-contract).
   These apply to every phase and are not repeated per phase.
4. Build exactly the files that phase lists. Do not build ahead. A later phase
   depending on your output is fine; you building that later phase early is not.
5. Run the phase's **exit test**. If it fails, fix it before stopping.
6. **Update this file before you finish:** set the phase's status in the
   progress table, and add a line under
   [Build log](#build-log) noting anything the next session needs to know —
   deviations from spec, deferred items, decisions made.
7. Stop. Do not start the next phase unless the user asked for it.

**If a phase is running long, stop and mark it `PARTIAL`** with a note on
exactly what is left. A half-finished phase honestly recorded is worth more
than a rushed one marked done.

**Suggested session batching:** three phases per session (see
[Session boundaries](#session-boundaries)). P1 and P8 are the two heaviest and
may each want a session of their own.

---

## The prototype contract

This build has **no database, no LLM calls, and no server pipeline.** Every
piece of data is a fixture. But the fakes are placed behind the *exact
interfaces the real backend will later satisfy*, so the swap is mechanical
rather than a rewrite.

### The three seams

| Seam | Prototype implementation | Later becomes |
|---|---|---|
| `lib/db/queries.ts` | `async` functions returning fixture objects | Postgres reads |
| `lib/hooks/use-run-stream.ts` | Replays `lib/fixtures/run-events.ts` on a timer | Native `EventSource` against `/api/run/[slug]/stream` |
| Define conversation | Scripted turns from `lib/fixtures/conversation.ts`, streamed character-by-character | Vercel AI SDK `useChat` against `/api/chat` |

**Rules for the seams — these are the whole point:**

- `queries.ts` exports `getRun`, `getBrief`, `getEvidence`, `getReport`,
  `getRoadmap`. Signatures are `(slug: string) => Promise<T>`. Call sites must
  never know they're fake. **No component imports from `lib/fixtures/` directly.**
- `useRunStream(slug)` returns the same state object either way:
  `{ phase, elapsed, queries, findings, discarded, counts, status }`.
  Branch on `process.env.NEXT_PUBLIC_USE_FIXTURES` inside the hook, nowhere else.
- Every fixture object is parsed through its Zod schema at the seam. If the
  fixture doesn't satisfy the schema, that is a bug now and would have been a
  bug in production later.

### What the user can actually do in the prototype

The typed idea is carried through so the run doesn't feel canned:

1. Type an idea into The Box on `/` → a slug is generated, the raw text is
   stored in `localStorage`, redirect to `/r/[slug]/define`.
2. The Define conversation is **scripted** — the AI's turns come from the
   fixture in order. The user can type anything; their text renders as a real
   user turn, and the next scripted AI turn follows. The Don't-Know Button
   advances the same way and marks the corresponding brief field `unknown`.
3. The Brief Panel fills from the fixture as the conversation advances, except
   `one_liner`, which echoes the user's typed idea.
4. Approve → `/r/[slug]/validate`, the mock run streams for **~75 seconds**
   (the real run is ~5 minutes; the fixture event log carries compressed
   delays), then cross-fades to the report.
5. Report, sources, and roadmap are fully static from fixtures.

### Deliberately not built in the prototype

`app/api/*` route handlers, `app/actions/create-run.ts` as a real server
action (it becomes a client-side slug generator), `lib/db/client.ts`, and any
Playwright E2E. Everything else in
[`15-project-structure.md`](WebsiteLayoutDesc/15-project-structure.md) gets built.

---

## Standing rules

Apply to every phase. Violations found in a later phase should be fixed on the
spot, not logged.

0. **Use the `dark-luxury-design` Claude skill primarily for all design and
   build work.** Fall back to the `clean-design` skill only when a specific
   reference is needed that `dark-luxury-design` does not cover. This applies
   to every phase, with no exceptions.
1. **No hex colour outside `styles/tokens.css`.** Not in a component, not in a
   Tailwind class, not in `style={{}}`. If a colour is needed that isn't a
   token, the answer is a token or a different design.
2. **Tailwind for layout only** — flex, grid, spacing, sizing. All colour,
   shadow, glow, border, and typography come from CSS variables via
   `styles/components.css` or `style={{}}`.
3. **Server Components by default.** `'use client'` is allowed only on these
   thirteen: `TheBox`, `Composer`, `MessageStream`, `BriefPanel`, `RunConsole`,
   `CitationChip`, `EvidenceDrawer`, `Accordion`, `CopyButton`,
   `RecentRunsList`, `SegmentedControl`, `SectionIndex`, `FilterPill`.
   Adding a fourteenth requires a note in the build log explaining why.
4. **Use the glossary names verbatim.** `DependencyChip`, not
   `LinkedQuestionBadge`. The glossary is in
   [`WebsiteLayoutDesc/README.md`](WebsiteLayoutDesc/README.md).
5. **Files `kebab-case.tsx`, components `PascalCase`, hooks
   `use-kebab-case.ts` → `useCamelCase`, schemas `PascalCaseSchema`.**
6. **Every interactive element gets hover, `:focus-visible`, and active
   states.** No exceptions, added at build time not in the polish phase.
7. **Exactly one `.btn-primary` visible per viewport.** By convention, enforced
   by review.
8. **No layout shift when streamed content arrives.** Reserve space.
9. **Desktop only.** Read at 1440px and 1280px. Do not add mobile breakpoints.
10. **No new dependencies** beyond the list in
    [`14-tech-stack.md §14.3`](WebsiteLayoutDesc/14-tech-stack.md), minus `ai`
    and `@ai-sdk/react` which the prototype doesn't need. If a phase seems to
    need one, log it and ask rather than installing.
11. **Never render model text as markdown.** Everything renders through typed
    components from validated fields.

---

## Progress

| Phase | Name | Status | Session |
|---|---|---|---|
| P0 | Scaffold + design tokens | `TODO` | 1 |
| P1 | Tier-1 UI primitives | `TODO` | 1 |
| P2 | Schemas + fixture layer | `TODO` | 1 |
| P3 | Run Shell, routing, layout | `TODO` | 2 |
| P4 | Entry page `/` | `TODO` | 2 |
| P5 | Define — conversation + Brief Panel | `TODO` | 2 |
| P6 | Evidence system + `/sources` | `TODO` | 3 |
| P7 | Validate — Run Console | `TODO` | 3 |
| P8 | Validate — the Report | `TODO` | 3 |
| P9 | Roadmap | `TODO` | 4 |
| P10 | Supporting pages + state matrix | `TODO` | 4 |
| P11 | Motion, a11y floor, DoD sweep | `TODO` | 4 |

Status values: `TODO` · `IN PROGRESS` · `PARTIAL` · `DONE`

---

# Phases

## P0 — Scaffold + design tokens

**Goal:** a running Next.js app whose aesthetic is unmistakably correct, before
a single product component exists.

**Read:** `14-tech-stack.md`, `15-project-structure.md`,
`02-visual-direction.md`, `17-open-questions.md`

**Build:**
- `create-next-app` at the repo root — TypeScript `strict: true`, App Router,
  Tailwind v4, no `src/` dir, import alias `@/*`
- Install only the runtime deps from §14.3 **excluding** `ai` and
  `@ai-sdk/react`; all devDeps except `@playwright/test`
- `styles/tokens.css` — the complete token set from `02`: palette, type scale,
  spacing, radius, shadow, motion. The only file with colour values.
- `styles/globals.css` — reset, base type, Inter + JetBrains Mono, grain
  overlay, focus ring
- `styles/components.css` — `.btn` + pulse keyframes, `.card` + inset
  highlight, `.well`, `.meta-line`, `.section-label`. Copy the skill CSS
  verbatim; do not translate to Tailwind.
- `tailwind.config.ts` — layout utilities only; `@theme` reads `tokens.css`
- `app/layout.tsx` — `<html>`, fonts, grain overlay, global styles
- `biome.json`
- `app/proof/page.tsx` — throwaway: one primary button, one card, one section
  label, one meta line

**Exit test:** `/proof` renders and the multi-layer amber glow, the borderless
card elevation with its inset top highlight, and the grain overlay all look
right. Screenshot it. **This is the phase most worth getting slowly right —
every screen inherits it.**

**Also:** read `17-open-questions.md` and log in the build log any open
question that would cause rework if answered differently later.

---

## P1 — Tier-1 UI primitives

**Goal:** every generic primitive exists and is visually proven, so no later
phase invents one under deadline pressure.

**Read:** `10-component-system.md`, `02-visual-direction.md`,
`11-interaction-patterns.md`

**Build — all under `components/ui/`:**

`button.tsx` · `icon-button.tsx` · `text-action.tsx` · `copy-button.tsx` ·
`text-area.tsx` · `inline-editable-field.tsx` · `inline-editable-list.tsx` ·
`filter-pill.tsx` · `card.tsx` · `well.tsx` · `drawer.tsx` · `modal.tsx` ·
`popover.tsx` · `tooltip.tsx` · `accordion.tsx` · `divider.tsx` ·
`section-label.tsx` · `display-headline.tsx` · `meta-line.tsx` · `prose.tsx` ·
`skeleton.tsx` (+ `SkeletonText`, `FieldSkeleton`) · `empty-note.tsx` ·
`spinner.tsx` · `rest-indicator.tsx`

Plus `app/kitchen-sink/page.tsx` rendering every one in every variant and state.

**Notes:**
- `Drawer`, `Modal`, `Popover`, `Tooltip`, `Accordion` wrap Radix primitives,
  unstyled, with the token skin applied.
- `Accordion` uses `grid-template-rows: 0fr → 1fr`, **not** `max-height`.
- `Card` never nests — `Well` is the escape hatch.
- `CopyButton` owns the label swap (`Copy script` → `✓ Copied`, 2s). It is the
  product's only success-feedback mechanism; there are no toasts anywhere.
- `MetaLine` must never be handed decorative data.
- Build no `Select`, `Checkbox`, `Radio`, `DatePicker`, `Form`, `Table`,
  `Tabs`, `Toast`, `Avatar`, or `Breadcrumb`.

**Exit test:** `/kitchen-sink` shows all primitives; every interactive one has
visible hover, focus-visible, and active states; keyboard alone opens and
closes the drawer, modal, popover, and accordion with focus correctly restored.

---

## P2 — Schemas + fixture layer

**Goal:** one complete, realistic, schema-valid run exists as data. Everything
after this phase renders it.

**This is the phase most likely to be rushed and least survivable if it is.**
Every page from P4 onward is only as good as this fixture.

**Read:** `15-project-structure.md`, plus the
[Fixture data shapes appendix](#appendix--fixture-data-shapes) below. Consult
`07-page-validate.md` and `08-page-roadmap.md` only if a shape is ambiguous.

**Build:**
- `lib/schemas/` — `run.ts`, `brief.ts`, `evidence.ts`, `report.ts`,
  `roadmap.ts`. Zod, with `z.infer` types exported alongside.
- `lib/fixtures/` — one complete run for a plausible idea (suggest: *SMS
  rebooking for dental clinics*, the blueprint's own running example):
  - `brief.ts` — all 12 fields, with **3 marked `unknown`** so the
    unknown → open-question path is exercised
  - `evidence.ts` — **47 verified findings** across the 5 dimensions with
    counts `[12, 9, 6, 11, 2]` (Practical deliberately thin), 31 distinct
    source URLs, real-looking excerpts and dates
  - `report.ts` — summary (every sentence cited), 5 dimension sections with
    confidence `solid`/`mixed`/`thin` all represented, 3 competitors (one with
    two missing fields to exercise `not established from available evidence`),
    3 surprises, 3 unanswered
  - `roadmap.ts` — 6 open questions with full scripts, 5 roadmap steps,
    dependency links wired both directions
  - `run-events.ts` — the SSE event log: 19 `query.start`/`query.done` pairs,
    47 `finding.verified`, 18 `finding.discarded`, 4 `phase` transitions,
    one `complete`. Each event carries a `delayMs` so the replayer's total
    runtime is ~75s.
  - `conversation.ts` — the scripted Define turns, each tagged with which
    brief field it fills
- `lib/db/queries.ts` — `getRun`, `getBrief`, `getEvidence`, `getReport`,
  `getRoadmap`; each `async`, each Zod-parses before returning
- `lib/citations.ts` — global stable `[n]` numbering derived from the evidence
  array. One source of truth, read by report, sources, and roadmap.
- `lib/thin-evidence.ts` — the trigger rule (< 12 findings, or ≥ 3 dimensions
  with < 2) in exactly one place
- `lib/format.ts` — relative time via `Intl.RelativeTimeFormat`, domain
  extraction, count formatting
- `tests/unit/` — Vitest: schemas parse the fixtures; schemas reject a
  malformed payload; citation numbering is stable

**Exit test:** `npx vitest run` passes. Every fixture parses. `getReport()`
returns a typed object with no `any` and no optional-chaining guesswork needed
at the call site.

---

## P3 — Run Shell, routing, layout

**Goal:** all five run routes exist and navigate correctly with placeholder
bodies. The chrome is done so no later phase has to think about it.

**Read:** `03-information-architecture.md`, `10-component-system.md`

**Build:**
- Routes: `app/r/[slug]/layout.tsx`, `page.tsx` (status → stage redirect),
  `define/page.tsx`, `validate/page.tsx`, `roadmap/page.tsx`,
  `sources/page.tsx` — all with placeholder bodies
- `components/layout/` — `run-shell.tsx`, `stage-rail.tsx`,
  `page-container.tsx` (variants `marketing` 1200px / `app` 1360px),
  `prose-column.tsx` (68ch measure), `two-column.tsx`, `run-footer-bar.tsx`,
  `back-link.tsx`
- `components/status/` — `verified-badge.tsx`, `confidence-note.tsx`,
  `coverage-bar.tsx`, `phase-strip.tsx`, `stage-chip.tsx`, `status-badge.tsx`
- `components/ui/copy-link-button.tsx`
- `lib/hooks/use-recent-runs.ts` — `localStorage["sv.runs"]`, capped at 10,
  most-recent-first

**Notes:**
- **Locked Stage Rail segments carry no affordance at all** — dim text, hollow
  node, no hover, no click, a `title` explaining what unlocks them. Not a
  disabled button.
- `/r/[slug]` on a **complete** run redirects to `/validate`, not `/roadmap`.
  The report is what a shared-link recipient needs first.
- Chrome budget: header ~72px, ≥85% of vertical pixels are content.
- `ConfidenceNote` is three bars plus a word. Never a number, never colour-coded.
- `PhaseStrip` shows four named phases and elapsed time. **No percentage.**

**Exit test:** navigating `/r/<fixture-slug>` lands on the right stage; the
Stage Rail shows correct done/active/locked states; `Copy link` copies the
canonical `/r/[slug]` URL and swaps its label inline.

---

## P4 — Entry page `/`

**Read:** `05-page-entry.md`, `03-information-architecture.md §3.8`

**Build:**
- `app/page.tsx`
- `components/entry/` — `hero.tsx`, `the-box.tsx`, `example-seed.tsx`,
  `what-you-get.tsx`, `trust-section.tsx`, `recent-runs-list.tsx`, `orb.tsx`
- `components/layout/landing-nav.tsx` (transparent → blur past 40px),
  `footer-panel.tsx`
- `app/actions/create-run.ts` — prototype version: generate a slug, write the
  typed text + slug to `localStorage`, redirect to `/r/[slug]/define`

**Notes:**
- Three example seeds fill The Box without submitting.
- `RecentRunsList` is hidden when empty and carries the "remembered by this
  browser only" note verbatim — do not soften it into implied durability.
- No onboarding, no tour, no welcome modal.

**Exit test:** type an idea → land on `/r/<new-slug>/define` with the typed
text preserved. Reload `/` → the run appears under Recent runs.

---

## P5 — Define: conversation + Brief Panel

**Goal:** the product's most important interaction, working end to end against
the scripted fixture.

**Read:** `06-page-define.md`, `12-states.md`

**Build:**
- `app/r/[slug]/define/page.tsx`
- `components/define/` — `message-stream.tsx`, `message.tsx`, `composer.tsx`,
  `dont-know-button.tsx`, `suggestion-chip.tsx`, `brief-panel.tsx`,
  `brief-field.tsx`, `approve-button.tsx`
- The scripted-conversation driver: advances `conversation.ts` on each user
  turn, streams the AI turn character-by-character, fills the corresponding
  brief field

**Notes — from `16.4`, four of the product's five critical details are here:**
- **The Don't-Know Button is never cut and never buried.** One tap, always
  visible from the first question, marks its field `unknown`, and that field
  becomes a tagged `→ open question`. This is what makes the surface a
  conversation instead of the form the exec summary deleted.
- **The Brief Panel must visibly assemble** as the conversation progresses —
  `FieldSkeleton` → amber-tint settle → filled. This is the main defence
  against mid-chat abandonment.
- The transcript is **typeset prose, not chat bubbles.** Two variants differing
  only in text colour.
- `MessageStream` handles scroll anchoring and suspends auto-scroll when the
  user scrolls up, surfacing a `↓ New message` pill.
- `Composer` buffers keystrokes while the AI streams.
- `InlineEditableField` powers every brief field: commit on Enter/blur, revert
  on Esc.
- On approve: lock the brief, show the URL-is-the-key line once
  (`This page is your run. Bookmark it — there's no login to get back.`),
  redirect to `/validate`.

**Exit test:** a full conversation runs start to finish; at least one field is
answered with Don't Know and shows as `→ open question`; one field is edited
inline and persists; approve locks and redirects; the Stage Rail unlocks
Validate.

---

## P6 — Evidence system + `/sources`

**Goal:** the citation system, built once, before any of its four consumers.

**`16.4` calls this the thing that cannot slip:** a report without one-click
source verification is a chat prompt with better typography.

**Read:** `07-page-validate.md` (citation system section),
`09-pages-supporting.md §9.1`, `11-interaction-patterns.md`

**Build:**
- `components/validate/evidence/` — `finding-card.tsx` (variants: `stream`,
  `accordion`, `row`), `citation-chip.tsx`, `evidence-drawer.tsx`,
  `evidence-context.tsx` (the app's one global UI context)
- `app/r/[slug]/sources/page.tsx` + `components/validate/sources-list.tsx`
- `lib/hooks/use-copy.ts`

**Notes:**
- Three disclosure layers: chip → hover popover (300ms delay) → drawer.
- The drawer is 480px, right side, focus-trapped, `Esc` closes, focus restored,
  with prev/next navigation through the whole corpus.
- Citation numbers come from `lib/citations.ts` and mean the same thing on the
  report, the sources page, and the roadmap.
- The one-time hover hint (`Hover any [n] to see the source`) is dismissed
  permanently on first interaction via `localStorage`. It is the only
  instructional UI in the product.
- The sources page footer states the discard count plainly:
  `18 excerpts discarded (didn't match the page)`.
- Filter pills by dimension, client-side. This is the product's only filter UI.

**Exit test:** from `/sources`, every row renders with its verified badge and
excerpt; filter pills work; opening the drawer from a row and paging prev/next
through the corpus works by keyboard alone.

---

## P7 — Validate: the Run Console

**Read:** `07-page-validate.md` (Mode A), `12-states.md`

**Build:**
- `lib/hooks/use-run-stream.ts` — the fixture replayer behind the real
  interface (see [the prototype contract](#the-prototype-contract))
- `components/validate/console/` — `run-console.tsx`, `query-ticker.tsx`,
  `finding-stream.tsx`
- `app/r/[slug]/validate/page.tsx` — picks Console vs Report from run status
- `app/r/[slug]/validate/loading.tsx`
- `tests/unit/run-stream-reducer.test.ts`

**Notes — the four trust devices, all four required:**
- `QueryTicker` shows the **real** queries with `○` → `◐` → `✓` states.
- Findings **prepend with animation** as they verify, each carrying
  `● VERIFIED`.
- The discard counter is shown and honest. Discarded content is never displayed.
- `CoverageBar` per dimension, relative to the run's own maximum.
- **No percentage anywhere.** `PhaseStrip` shows named phases and elapsed time.
- The "you can close this tab" line is present.
- Console → Report is a 400ms cross-fade on `complete`.

**Exit test:** load `/validate` on a running fixture; the console streams for
~75s with queries ticking, findings landing, counts incrementing, and no layout
shift; it cross-fades to the report at the end.

---

## P8 — Validate: the Report

**Read:** `07-page-validate.md` (Mode B), `03-information-architecture.md §3.6`

**Build:**
- `components/validate/report/` — `report.tsx`, `summary-section.tsx`,
  `dimension-section.tsx`, `competitor-card.tsx`, `surprise-panel.tsx`,
  `unanswered-section.tsx`, `thin-evidence-notice.tsx`
- `components/layout/section-index.tsx` (sticky scrollspy, amber left-tick)
- `lib/hooks/use-scroll-spy.ts`

**Notes:**
- Section order is fixed: What we found → Per dimension ×5 → Who else is doing
  this → What surprised us → What we couldn't answer. Density deliberately
  alternates low → high → medium → low → low.
- **Every sentence in the summary carries at least one citation.** Uncited
  prose in "What we found" is a bug — assert it at the schema layer.
- `CompetitorCard` is **field-rendered, never prose.** Missing fields render
  `not established from available evidence` — never omitted, never guessed.
- `SurprisePanel` is the `featured` card and the most visually weighted block
  in the report. Give it air.
- Build the `ThinEvidenceNotice` and the reordered thin variant now, not later
  — the blueprint flags it as something that will happen during real testing
  and is worth designing before it happens by accident.
- "What we couldn't answer" is the deliberate on-ramp into Roadmap. It ends the
  page pointing forward.
- This page should ship almost no JS. Keep it server-rendered; the interactive
  islands are `CitationChip`, `Accordion`, and `SectionIndex` only.

**Exit test:** the full report renders from the fixture; every citation chip
opens the right evidence; the scrollspy tracks; toggling the fixture to a thin
run renders the thin variant correctly.

---

## P9 — Roadmap

**Read:** `08-page-roadmap.md`

**Build:**
- `app/r/[slug]/roadmap/page.tsx`
- `components/roadmap/` — `open-question-card.tsx`, `script-block.tsx`,
  `roadmap-timeline.tsx`, `roadmap-step.tsx`, `not-in-it-list.tsx`,
  `dependency-chip.tsx`
- `components/layout/segmented-control.tsx` (sticky, scroll-jump, scrollspy)

**Notes:**
- `OpenQuestionCard` is a labelled grid: `QUESTION` / `WHY IT MATTERS` / `ASK` /
  `FIND THEM` / `HOW MANY` / `THE SCRIPT` / `WHAT YOU LEARN`.
- **`Copy script` must produce clean plain text** — no markdown, no labels, no
  attribution footer. This is one of the product's five critical details: the
  moment it changes what someone actually does. Test what lands on the clipboard.
- **`DependencyChip` is never cut.** `◂ depends on Q01` scrolls to, expands,
  and pulses its target; the question card's `Changes: ▸ First thing to build`
  link does the same in reverse. The blueprint calls this bidirectional link
  the whole reason both halves are in one product.
- `NotInItList` gets **full reading weight** — not muted, not struck through.
  The cut list is content, not a footnote.
- Both halves stay on one page so the wiring between them stays visible. The
  segmented control scroll-jumps; it is not tabs.

**Exit test:** all 6 questions and 5 steps render; clicking a dependency chip
scrolls, expands, and pulses the target in both directions; `Copy script`
puts clean plain text on the clipboard.

---

## P10 — Supporting pages + the state matrix

**Read:** `09-pages-supporting.md`, `12-states.md`

**Build:**
- `app/r/[slug]/not-found.tsx` — the invalid-run page
- `app/error.tsx` — global error boundary
- `app/not-found.tsx` — fallback 404
- Then a **sweep across every surface built so far**, adding the loading,
  empty, error, and success states from `12-states.md` that are missing

**Notes:**
- **There is no illustrated empty state anywhere in this product.** `EmptyNote`
  is one honest sentence plus at most one action.
- Error copy must match the library in `12-states.md` and contain none of the
  banned patterns.
- Loading states live with their component, not in a central skeleton file.
- Skeleton text uses varied line widths — uniform ones look wrong.
- No full-page loaders. `Spinner` appears in buttons and phase glyphs only.

**Exit test:** every surface has all five states reachable; a deliberately
broken fixture renders the error boundary with correct copy rather than a
white screen.

---

## P11 — Motion, a11y floor, DoD sweep

**Read:** `11-interaction-patterns.md`, `13-responsive-and-accessibility.md`,
`16-scope-and-priorities.md §16.5`, `02-visual-direction.md §2.18`

**Build:**
- Scroll reveals via IntersectionObserver; the `motion` package used **only**
  for Drawer and Modal enter/exit
- `prefers-reduced-motion` honoured throughout
- `aria-live` on the query ticker and finding stream; a skip link
- Loading choreography per `11 §11.8`
- Then the **definition-of-done sweep** from `16.5` against every surface

**The DoD checklist, per surface:**
- [ ] Matches its page spec's layout, components, and copy strings
- [ ] Default, loading, empty, error, and success states all exist
- [ ] Exactly one `.btn-primary` visible in the viewport
- [ ] The `02 §2.18` anti-pattern checklist passes
- [ ] Every interactive element has hover, `:focus-visible`, and active states
- [ ] Keyboard-only operation completes the primary task
- [ ] No hex colour outside `tokens.css`
- [ ] No layout shift when streamed content arrives
- [ ] Read at 1440px and 1280px
- [ ] Copy contains no banned patterns

**Exit test:** the full journey — `/` → type → conversation → approve → run →
report → citation → drawer → roadmap → copy script — completes by keyboard
alone, with reduced motion on, with no console errors. Delete `/proof` and
`/kitchen-sink`.

---

## Session boundaries

| Session | Phases | Ends with |
|---|---|---|
| 1 | P0 · P1 · P2 | The aesthetic is proven and the data exists |
| 2 | P3 · P4 · P5 | You can type an idea and get a brief |
| 3 | P6 · P7 · P8 | You can watch a run and read the report |
| 4 | P9 · P10 · P11 | The whole prototype is clickable end to end |

Each session boundary is a working, demonstrable thing — the same discipline
the exec summary applies to its four weeks.

---

## Build log

Append one entry per phase. Note deviations, deferrals, and decisions the next
session needs.

<!-- Format:
### P0 — 2026-08-21
- Deviation: …
- Deferred: …
- Decision: …
-->

_(empty — no phases completed yet)_

---

## Appendix — fixture data shapes

Extracted from `06`–`09` so P2 can build the fixtures without reading all four
page specs. If a shape here conflicts with a page spec, **the page spec wins** —
fix this appendix.

### Brief — 12 fields, each `pending | filled | unknown`

`one_liner` · `product` · `customer` · `who_decides` · `problem` ·
`how_they_solve_it_today` (string[]) · `what_makes_this_different` ·
`first_version_scope` · `how_it_makes_money` · `how_customers_find_it` ·
`assumptions` (string[]) · `open_questions` (string[])

Panel footer shows `{n} unknown → open questions`.

### Finding

```ts
{
  id: string              // "EV_03"
  dimension: "PROBLEM" | "WHAT_EXISTS" | "DEMAND_SIGNALS" | "MONEY" | "PRACTICAL"
  text: string            // the claim
  excerpt: string         // verbatim quote from the source
  source_url: string
  source_date: string     // ISO
  stance: "supports" | "challenges" | "neutral"
  verified: boolean
  discard_reason?: string
}
```

### Report

```ts
{
  summary: { text: string; citations: number[] }   // every sentence cited
  dimensions: Record<DimensionKey, {
    label: string
    meta: { count: number; sources: number; date_range: string }
    confidence: "solid" | "mixed" | "thin"
    prose: string                                   // inline [n] citations
    findings: Finding[]
  }>
  competitors: {
    name: string
    geography: string
    price: string
    difference_from_idea: string
    moat?: string           // absent → "not established from available evidence"
    take_from_them?: string
    ignore?: string
  }[]
  surprises: string[]                               // 2–3, numbered 01/02/03
  unanswered: string[]
}
```

### Open Question

```ts
{
  id: string              // "Q01"
  number: number
  question: string
  why_it_matters: string
  ask: string
  find_them: { type: "link" | "count" | "text"; label: string;
               url?: string; citation_id?: number }[]
  how_many: string
  script: { lines: string[] }                       // numbered, plain text
  what_you_learn: string
  survey?: { questions: string[]; note: string }
}
```

### Roadmap Step

```ts
{
  phase: "BEFORE_YOU_BUILD" | "FIRST_THING_TO_BUILD" | "THEN"
       | "LATER_AND_ONLY_IF" | "WHAT_WOULD_CHANGE_THIS_PLAN"
  description: string
  cut_list?: string[]     // the NOT IN IT block
  estimate?: string
  dependencies: string[]  // ["Q01", "Q03"]
}
```

### SSE events

| Event | Payload |
|---|---|
| `phase` | `{ phase: "searching" \| "fetching" \| "verifying" \| "writing", elapsed_ms }` |
| `query.start` | `{ query, index }` → ticker row `◐` |
| `query.done` | `{ query, index }` → ticker row `✓` |
| `finding.verified` | the full `Finding` object |
| `finding.discarded` | `{ count }` — content never shown |
| `complete` | `{}` → 400ms cross-fade to the report |

### Target volumes for the fixture run

19 queries · 31 sources · 47 verified findings · 18 discarded ·
per-dimension counts `[12, 9, 6, 11, 2]` · 3 competitors · 3 surprises ·
3 unanswered · 6 open questions · 5 roadmap steps · 3 brief fields `unknown`
