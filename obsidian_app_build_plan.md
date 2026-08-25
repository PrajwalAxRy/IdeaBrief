# Obsidian App Build Plan

> **What this is:** the execution plan for redesigning and reworking the four
> **run pages** — `/r/[slug]/define`, `/validate`, `/roadmap`, `/sources` — plus
> their shared chrome and supporting surfaces, onto the **Obsidian** design
> system that currently ships on `/` only.
>
> **Why it exists:** `/` was rebuilt from scratch in session 6. Everything
> under `/r/[slug]/*` still renders **Deep Canopy** (forest green, light-blue
> accent, Inter Tight) and is explicitly recorded as debt in `CLAUDE.md`. This
> file re-cuts that debt — plus a substantial UX rework agreed with the user —
> into 16 buildable phases, each sized for one session.
>
> **This is not a reskin.** Every page's layout, information architecture, and
> in several cases its core mechanic changes. The twenty decisions in
> [Locked decisions](#locked-decisions) were settled with the user before any
> code was written and are not open for re-litigation mid-build.
>
> **Status:** in progress — see the [progress table](#progress).

> **Design skill — imperative:** every phase in this plan must be built using
> the Claude skill **`obsidian-design`**. Read `SKILL.md` before producing any
> visible pixels, and read the specific `references/` file the phase names.
> Do not design a screen from memory or default styling. `deep-canopy-design`
> and `dark-luxury-design` are **superseded** — do not invoke either. Fall back
> to `clean-design` only for a pattern Obsidian genuinely doesn't cover.

---

## How to use this file

**If you are a Claude session picking this up cold, read this section first.**

1. Find the first phase in the [progress table](#progress) that is not `DONE`.
2. Read [Locked decisions](#locked-decisions), [Standing rules](#standing-rules),
   [The naming contract](#the-naming-contract), [Known rot](#known-rot),
   [Shared contracts](#shared-contracts), and
   [The prototype contract](#the-prototype-contract). These apply to every phase
   and are **not repeated per phase**.

   **[Shared contracts](#shared-contracts) (C1–C14) outranks every phase body.**
   The sixteen phases were drafted in parallel and audited; where two of them
   specified the same shared artefact differently, that section settles it. A
   phase body that contradicts a contract is stale — follow the contract and fix
   the phase on the spot.
3. Read **only** the reference files that phase lists. Do not read the whole
   `WebsiteLayoutDesc/` folder — it will not fit alongside the work, and much of
   it is superseded (see [What the blueprint gets wrong now](#what-the-blueprint-gets-wrong-now)).
4. Build exactly the files that phase lists. Do not build ahead. A later phase
   depending on your output is fine; you building that later phase early is not.
5. Run the phase's **exit test** with the **Playwright MCP** against a running
   `next dev` — navigate, screenshot at 1440 and 1280, *measure computed
   styles*, drive keyboard flows with real key presses, emulate reduced motion.
   Reading compiled output does not pass an exit test. See
   [`references/verification.md`](.claude/skills/obsidian-design/references/verification.md).
6. **Update this file before you finish:** set the phase's status in the
   progress table, and append to the [Build log](#build-log) — deviations,
   deferrals, decisions the next session needs.
7. Stop. Do not start the next phase unless the user asked for it.

**If a phase is running long, stop and mark it `PARTIAL`** with a note on
exactly what is left. A half-finished phase honestly recorded is worth more
than a rushed one marked done.

**The single highest-value habit in this build:** after editing any recipe
stylesheet, *measure* whether the rule applied. Three separate cascade bugs in
this repo's history produced a plausible-looking page with every Tailwind
spacing utility silently dead. See [Standing rules](#standing-rules) §1 and
`references/pitfalls.md` §1.

---

## Locked decisions

Settled with the user before any code was written. Build against these; do not
reopen them.

| # | Decision | Choice |
|---|---|---|
| D1 | **Theme scope** | **Promote Obsidian to global.** `--ob-*` tokens move to `:root`, `data-theme="obsidian"` moves to `<html>`, and the Deep Canopy `:root` block plus `styles/components.css` are **deleted** at the end of the build. One system, no scoping, no second token set. |
| D2 | **Product name** | **Groundwork**, everywhere. Replaces `IdeaBrief` in the run chrome wordmark. |
| D3 | **Fixture & schema freedom** | **Extend freely.** New fields and new fixture content are in scope, provided every addition is something a real backend could plausibly return and is Zod-validated at the seam. |
| D4 | **Surfaces in scope** | The four run pages · the run shell chrome · the 404 / invalid-run / error boundaries · `/style-guide`. |
| D5 | **Report layout** | **Editorial two-column** — prose at a readable measure on the left, the data/evidence layer on the right, aligned to the claim it belongs to. Not a 68ch column in a 1360px page. |
| D6 | **Data visualisation** | **Rich.** A visual layer runs through the whole report. All marks hand-drawn CSS/SVG — no charting library. Every mark is citation-linked. |
| D7 | **Synthesis** | Add a non-judgmental **`EvidenceState`** band above the summary: what the evidence is strong on, thin on, and actively contests — stated as properties of the evidence, never as a judgement of the idea. **No verdict, no score, no gate.** |
| D8 | **Run Console** | **Re-timed** to ~45s with the first finding inside 6s and no dead tail. Stays a separate mode, then **cross-fades** into the report (a 400ms cross-fade that today is a missing CSS class). |
| D9 | **Define layout** | **Full-height split, both columns independently scrolled.** No page scroll. Composer pinned bottom-left, Approve pinned bottom-right. A working surface, not a document. |
| D10 | **Don't-Know Button** | **Fully functional.** The brief becomes live client state layered over the fixture; pressing it marks that field `unknown → open question`, the count updates, and the roadmap's open-question set reflects it. |
| D11 | **Transcript** | **Typeset, and actually differentiated** — no bubbles (blueprint rule), but differentiated by measure, colour, indentation and a hairline. Today AI and user turns are pixel-identical because the two differentiating classes don't exist. |
| D12 | **Approve gating** | Appears once the **core fields** are filled (~turn 5–6), with a live `n unanswered → open questions` **`ConsequenceLine`** beside it. Talking past that point is optional. |
| D13 | ~~**Roadmap timeline**~~ **SUPERSEDED by A16.** | ~~Time-scaled horizontal plan on a shared week axis.~~ The week axis is **deleted**: it could not express overlap (a bar started on an integer track or not at all), and overlap is the whole point of the journey chart. Replaced by continuous 0–1 fractions, **no axis and no scale**, and two bar treatments carrying the honesty rule. **The half of D13 that survives** is the tripwire: still off the chart, still not a phase, for exactly the reason D13 gave. |
| D14 | **Dependencies** | Build the missing pulse **and** show **fan-out as weight** — a question that governs three steps reads heavier than one that governs one. No separate graph diagram. |
| D15 | **Sources** | Becomes a full-width **`EvidenceExplorer`**: facet rail (dimension · stance · cited · domain · recency) with live counts, dense rows, a funnel strip on top, and the **18 discards as real records with reasons** in their own facet. |
| D16 | **Evidence navigation** | The three-pillar `StageRail` stays intact. A persistent **`EvidenceButton`** in the run chrome opens the explorer from any page. Evidence is a layer available everywhere, not a fifth destination. |
| D17 | **Motion budget** | **Restrained.** Entrance staggers on first paint, the verification rule drawing itself, count-ups on run stats, structural drawer/accordion motion. **No parallax, no word reveals, no ambient scroll-dimming on working pages.** The full vocabulary stays on `/`. |
| D18 | **Generated media** | Four briefed categories: per-page **ambient backdrops**, the **waiting moments** (console cold start, empty states, invalid-run), **OG cards per route**, and one **editorial band on the roadmap** (the only honestly-human subject on the app side). One `higgsfieldPlan_<page>.md` per page plus a shared file. |
| D19 | **Run chrome** | **Sticky condensing header** (ported from the landing nav) + **honest per-page stage state** derived from route + `localStorage` progress, not from the always-`complete` fixture. Also fixes the scrollspy inset, which already assumes a stickiness the header doesn't have. |
| D20 | **Phasing** | **Many small phases, one page per session** — 16 phases, each with its own exit test and room to verify properly in the browser. |

---

## The prototype contract

Unchanged from [`only_frontend_build_plan.md`](only_frontend_build_plan.md), and
still binding. **No database, no LLM calls, no server pipeline, no API routes.**
Every piece of data is a fixture. The fakes sit behind the exact interfaces a
real backend would satisfy later.

### The three seams

| Seam | Today | Later becomes |
|---|---|---|
| `lib/db/queries.ts` | `async` functions returning Zod-parsed fixtures | Postgres reads |
| `lib/hooks/use-run-stream.ts` | Replays `lib/fixtures/run-events.ts` on a timer | Native `EventSource` against `/api/run/[slug]/stream` |
| Define conversation | Scripted turns from `lib/fixtures/conversation.ts` | Vercel AI SDK `useChat` against `/api/chat` |

- **No component imports from `lib/fixtures/` directly.** `lib/db/queries.ts` is
  the only file that does. Tests may.
- `queries.ts` signatures are always `(slug: string) => Promise<T>`.
- `useRunStream(slug)` branches on `NEXT_PUBLIC_USE_FIXTURES` **inside the hook,
  nowhere else.**
- **D3 adds one new seam obligation.** The dynamic brief (D10) is *client*
  state, not server state — it layers over the fixture and persists to
  `localStorage`. It must sit behind `lib/brief-state.ts` so a future
  `PATCH /api/brief` swap is mechanical. See
  [A1](#a1--data-layer-schemas-fixtures-derivations) and
  [C4](#c4--the-brief-state-libbrief-statets).
- `lib/content/landing.ts` is static site copy and is the **one sanctioned
  exception** to the no-direct-import rule. App-page copy follows the same
  pattern in `lib/content/app.ts`.

---

## Standing rules

Apply to every phase. Violations found in a later phase are fixed on the spot,
not logged.

0. **Use the `obsidian-design` skill for all design and build work.** Read
   `SKILL.md`, plus the `references/` file the phase names. Never design from
   memory. `deep-canopy-design` and `dark-luxury-design` are superseded.
1. **Every stylesheet in `styles/` must be layered.** Recipe files are imported
   `@import "./x.css" layer(components);`. Global CSS lives inside `@layer base`.
   Unlayered rules beat every layered rule regardless of specificity — this has
   silently zeroed out every Tailwind spacing utility in this app **three
   times**. It produces no error and the page still looks plausible. **After
   editing any recipe stylesheet, measure a computed style before believing a
   rule applied.**
2. **`styles/tokens.css` is the only file permitted to contain a colour value.**
   Not in a component, not in a Tailwind class, not in `style={{}}`. A colour you
   need that isn't a token means you need a token or a different design.
3. **Tailwind is for layout only** — flex, grid, spacing, sizing. `tailwind.config.ts`
   has no `colors` key and must not gain one. Colour, shadow, border, and
   typography come from recipes or `style={{}}` reading CSS variables.
4. **An undefined CSS custom property silently voids its whole declaration**, and
   an `animation:` name with no matching `@keyframes` fails silently and
   statically. After editing a recipe stylesheet, diff used-vs-defined:
   `grep -oE 'var\(--[a-z0-9-]+' styles/*.css | sort -u` against
   `grep -oE '^\s*--[a-z0-9-]+' styles/tokens.css | sort -u`. **This build
   inherits four classes that are emitted by shipped components and defined
   nowhere** — see [Known rot](#known-rot).
5. **Blue has exactly three jobs** — primary action, verification, live/active
   state. Not the logo, not section numerals, not separators, not section
   labels, not citation-chip decoration. If you can't name which of the three
   jobs a blue thing is doing, it shouldn't be blue. **There is no red in this
   system**; a discarded or failed item goes `--ob-discard` grey, strikes
   through, and stops mattering.
6. **Weight 400 at every size, including display.** Weight 500 exists only for
   the mono metadata layer. Authority comes from scale and negative tracking.
7. **No shadows** except the two blue rings on `.ob-btn` (focus, primary hover).
   Elevation is a border and a surface lightness step.
8. **Nothing but a button has a pill radius.** Chips 4px, cards 10px, large
   panels 16px.
9. **Sections are separated by a 1px rule, never a background change.** Section
   padding 120–160px on marketing surfaces; app surfaces may go tighter but
   never below 64px between two distinct sections.
10. **Every interactive element ships hover, `:focus-visible`, active and
    disabled at build time.** Focus rings must **snap** — `transition: none` in
    the `:focus-visible` rule.
11. **Exactly one `.ob-btn-primary` visible per viewport.** Enforced by review,
    and verifiable: see `references/verification.md` §6.
12. **No layout shift when streamed or late content arrives.** Reserve the exact
    final height. Measure `getBoundingClientRect().height` before and after.
13. **Product surfaces are drawn in code**, never screenshotted, never generated.
    Diagrams and charts are SVG/CSS. See `references/media.md` §2 and §8.
14. **Never ship a visual area that isn't accounted for.** A blank div is a bug.
    Four legitimate fills, in priority order: code-drawn UI → CSS atmosphere →
    photography (human/physical subjects only, under the treatment rules) → a
    labelled `MediaSlot` carrying its art-direction brief. Do not delete a slot
    as cleanup — it is the spec for an asset someone still owes.
15. **Never render model text as markdown.** Everything renders through typed
    components from validated fields. `react-markdown` is deliberately absent.
16. **Reduced motion has two halves and both are required.** CSS must *resolve
    to the end state*, not merely stop. JS must branch separately — auto-advancing
    content is motion too. Read `matchMedia` in an effect, never during render.
17. **Desktop only.** Read at 1440px **and** 1280px. Do not add mobile breakpoints.
18. **No new dependencies.** Available: four Radix packages (`collapsible`,
    `dialog`, `popover`, `tooltip`), `lucide-react`, `motion` v12 (Drawer/Modal
    enter-exit only), `zod` v3. **There is no charting library and none will be
    added** — every mark in this plan is hand-drawn. If a phase seems to need a
    dependency, log it and ask.
19. **Use the names in [The naming contract](#the-naming-contract) verbatim.**
    Vocabulary drift between plan and code is the main reason a plan stops being
    useful after week two.
20. **Files `kebab-case.tsx`; components `PascalCase`; hooks `use-kebab-case.ts`
    exporting `useCamelCase`; schemas `PascalCaseSchema`.** Biome: single quotes,
    semicolons, trailing commas, 2-space indent, 100 columns.
21. **Consult the Context7 MCP** before writing against an unfamiliar API —
    Tailwind v4, Radix, Zod v3, Vitest, `motion`, Next 16.
22. **`'use client'` — the 13-name allowlist is retired.** It was written for an
    app shell whose pages carried run data; this build has live streams,
    scroll-spy, facets, a dynamic brief and a global drawer. The replacement rule:
    **push the client boundary as deep as it goes**, keep pages and section
    components server-rendered, and put interactivity in leaves. A page-level
    `'use client'` needs a build-log note explaining why the boundary couldn't
    go deeper.

---

## The naming contract

Names below are the vocabulary of this build. Use them verbatim in code, in the
build log, and in conversation.

### Kept from the existing glossary — do not rename

`RunShell` · `StageRail` · `RunFooterBar` · `PageContainer` · `ProseColumn` ·
`TwoColumn` · `BackLink` · `Wordmark` · `LogoMark` · `SectionIndex` ·
`SegmentedControl` · `Button` · `IconButton` · `TextAction` · `CopyButton` ·
`CopyLinkButton` · `TextArea` · `InlineEditableField` · `InlineEditableList` ·
`FilterPill` · `Card` · `Well` · `Drawer` · `Modal` · `Popover` · `Tooltip` ·
`Accordion` · `Divider` · `SectionLabel` · `DisplayHeadline` · `MetaLine` ·
`Prose` · `MediaSlot` · `Skeleton` / `SkeletonText` / `FieldSkeleton` ·
`EmptyNote` · `Spinner` · `RestIndicator` · `SkipLink` · `Reveal` ·
`VerifiedBadge` · `ConfidenceNote` · `CoverageBar` · `PhaseStrip` · `StageChip` ·
`StatusBadge` · `RecentRunsList` · `BriefPanel` · `BriefField` · `MessageStream` ·
`Message` · `Composer` · `DontKnowButton` · `SuggestionChip` · `ApproveButton` ·
`RunConsole` · `QueryTicker` · `FindingStream` · `FindingCard` · `CitationChip` ·
`EvidenceDrawer` · `EvidenceProvider` · `Report` · `SummarySection` ·
`DimensionSection` · `CompetitorCard` · `SurprisePanel` · `UnansweredSection` ·
`ThinEvidenceNotice` · `SourcesList` · `OpenQuestionCard` · `ScriptBlock` ·
`RoadmapTimeline` · `RoadmapStep` · `NotInItList` · `DependencyChip` · `Orb`

### New — introduced by this build

**Chrome**

| Name | What it is |
|---|---|
| `RunHeader` | The sticky condensing header inside `RunShell`. Owns the two scroll data-attributes. |
| `EvidenceButton` | The persistent `47 VERIFIED` control in the header that opens the `EvidenceExplorer`. D16. |
| `RunIdentity` | Wordmark + run one-liner + run id, the header's left cluster. |
| `RunMain` | The client leaf that reads the active segment and stamps `<main>`. A4. |
| `EvidenceOverlay` | The full-height dialog `EvidenceButton` opens. A4. |
| `AppBackdrop` | The per-page ambient field. Each **page** renders it, never the layout — C13. A4. |

**Figures — the data-visual kit, `components/figures/`**

Every mark below is hand-drawn CSS/SVG, server-rendered, and wrapped in a
`Figure`. **A figure with no citation is a bug.**

| Name | What it draws |
|---|---|
| `Figure` | The wrapper for every mark: mono caption above, mark, source citations below, reserved height. Nothing draws outside one. |
| `NumberCallout` | One large mono value + unit + label + citation. The device that pulls a quantity out of a sentence. |
| `StanceBar` | supports / neutral / contests as a segmented hairline-ruled bar with counts. |
| `RecencyStrip` | A dated tick per finding across a shared time axis, oldest → newest. |
| `ValueLadder` | Several money values on one vertical axis with labels and citations. The price ladder. |
| `GapBar` | Two magnitudes on a shared scale, for order-of-magnitude comparisons. |
| `RunFunnel` | queries → pages → verified → discarded, as four proportional segments. |
| `CapabilityMatrix` | competitors × capabilities, `yes` / `partial` / `no` / `unknown`. |
| `DomainConcentration` | Ranked domain bars — how much of the evidence comes from how few places. |
| `DimensionStrip` | The 5-up state-of-the-evidence strip: per dimension a `CoverageBar`, a `StanceBar`, and a `ConfidenceNote`. |
| `FanOutMeter` | How many roadmap steps an open question governs. D14. |
| `WeekAxis` | The roadmap's shared week ruler. |
| `PlanBar` | One roadmap step positioned and sized on the `WeekAxis`. |

**Surfaces**

| Name | What it is |
|---|---|
| `EvidenceState` | The report's opening band. Strong on / thin on / contested. D7. |
| `ReportRow` | The report's two-column band — prose left, figure aside right. Collapses to one column when a section has no figure. A9. |
| `EvidenceRail` | The uncited-findings surface beneath a dimension's paragraph. 23 of 47 findings are quoted nowhere in the report; this is where they surface. A9. |
| `StanceMark` | The inline supports / neutral / contests mark plus its word. Fill treatment, never hue. A5. |
| `CitationHint` | The one-time "citations are clickable" line. A normal-flow sibling of the paragraph, never absolutely positioned. A5. |
| `TypingBody` | The per-character typewriter leaf. Per-character state lives here and nowhere higher. A6. |
| `DefineHandoff` | What replaces the composer once the brief is approved — the bookmark line and the forward link. A7. |
| `ConsoleRail` | The console's sticky left rail: query ticker, coverage, discards. A8. |
| `DiscardTicker` | The live discard counter and its most recent reason. A8. |
| `CountUp` | The rAF numeral leaf. The only client component in the figure layer. A10. |
| `OpenQuestionsSection` | The open-questions composition; owns the D10 promotion pass. A11. |
| `FindThemRow` | One `FIND THEM` row — link, count, or plain text. A11. |
| `DependencyChips` / `ChangesLink` | The plural container and the reverse-direction variant of `DependencyChip`. A11. |
| `RoadmapExit` | The roadmap's terminal band. The run has no next stage, so this is where it ends. A12. |
| `FieldworkBand` | The roadmap's hinge between its two sections — three panels on going and talking to real people. D18's one sanctioned human subject on the app side. A11. |
| `FieldworkMedia` | One panel of the band. Renders a labelled `MediaSlot` today and a scrimmed video once an asset lands — the single swap point. A11. |
| `EvidenceRow` | One dense verified row in the explorer. A13. |
| `RunBand` | The explorer's `01 THE RUN` composition — funnel plus domain concentration. A13. |
| `EvidenceExplorer` | The `/sources` composition: funnel strip + `FacetRail` + rows. D15. |
| `FacetRail` | The explorer's left rail of facet groups with live counts. |
| `DiscardRow` | One discarded excerpt with its reason. The trust claim made visible. D15. |
| `TripwirePanel` | `WHAT WOULD CHANGE THIS PLAN`, lifted off the build axis. D13. |
| `SurveyBlock` | The `THE SURVEY` rows on an `OpenQuestionCard`. Specified in the blueprint, cut during the first build, reinstated here. |
| `BriefProgress` | `9 of 12 answered · 3 unknown → open questions`. |
| `ConsequenceLine` | The live line beside `ApproveButton` stating what approving now costs. D12. |
| `Fragment` | The code-drawn product-surface container, ported in from the landing page. |

**Lib**

| Name | What it holds |
|---|---|
| `lib/brief-state.ts` | The dynamic brief: reducer, `localStorage` persistence (`sv.brief.<slug>`), and the unknown set the roadmap reads. D10. |
| `lib/hooks/use-brief-state.ts` | `useBriefState(slug, brief)` — the client hook over the above. |
| `lib/hooks/use-run-progress.ts` | `useRunProgress(slug)` — the `localStorage` progress read behind the honest `StageRail`. A4. |
| `lib/hooks/use-reduced-motion.ts` | `useReducedMotion()` — the JS half of standing rule 16. Reads `matchMedia` in an effect. A6. |
| `lib/hooks/use-brief-state.ts` | `useBriefState(slug, brief)` — the client hook over `lib/brief-state.ts`. A7. |
| `lib/evidence-scope.ts` | Pure scope arithmetic: which ids `next`/`prev` may walk. Fixes R13. A5. |
| `lib/analytics/evidence-stats.ts` | Stance rollups, domain concentration, recency buckets, citation coverage. Pure. |
| `lib/analytics/report-figures.ts` | Price ladder, ROI gap, capability matrix, funnel. Pure, derived from validated data. |
| `lib/run-plan.ts` | Roadmap week math — offsets, spans, total horizon. Pure. |
| `lib/explorer-facets.ts` | The explorer's facet arithmetic over all 65 records: parse/serialise, OR-within/AND-across filtering, counts-excluding-own-group, domain and quarter buckets, five total-order sorts. Pure. A13. |
| `lib/content/app.ts` | Every string the four run pages render. Same pattern as `lib/content/landing.ts`. |

---

## Known rot

Inherited defects. Each is fixed by a named phase; none should be discovered
again.

| # | Defect | Fixed in |
|---|---|---|
| R1 | `styles/components.css` is imported **unlayered**, so every recipe outranks every Tailwind utility on the same element. Live consequence today: `.section-label { margin-bottom: 16px }` beats layout intent everywhere a label appears. | A0 |
| R2 | **Four classes are emitted by shipped components and defined in no stylesheet** — `.timeline-node`, `.timeline-node--accent`, `.timeline-node--pulse`, `.card--pulse`. Together they delete the roadmap's accent-phase emphasis and the *entire* dependency-chip pulse feedback. | A11, A12 |
| R3 | **Five more undefined classes on Define** — `.composer`, `.composer--streaming`, `.message-text`, `.message-text--ai`, `.message-text--user`. AI and user turns are therefore pixel-identical apart from one 12px glyph. | A6 |
| R4 | **Three more undefined classes on the console** — `.query-glyph`, `.query-glyph--queued/running/done`, `.finding-card--entering`, `.report-cross-fade`. The findings' entrance animation and the console→report cross-fade do not exist. | A8 |
| R5 | The **Don't-Know Button is a no-op.** It sends a string; the panel's `3 unknown` is read from a static fixture regardless. The product's headline mechanic does nothing. | A7 |
| R6 | **Editing the one-liner silently fails** — `valueFor()` short-circuits `one_liner` to the override prop and never consults `overrides`, so the edit reverts *and* an `edited` marker appears. | A7 |
| R7 | **Focus stealing corrupts brief edits.** Every finished AI turn unconditionally focuses the composer; if you're mid-edit in a brief field, `onBlur` commits your half-typed value. | A7 |
| R8 | **Hydration mismatch on the seeded message** — `resolveIdeaText` returns the fixture on the server and `localStorage` on the client. | A7 |
| R9 | `SegmentedControl` and `.run-shell-header` both document themselves as sticky and neither is. `useScrollSpy`'s `TOP_INSET = 112` is calibrated for a stickiness that doesn't exist. | A4 |
| R10 | `TwoColumn`'s `position: sticky` sidebar is a no-op on Define — a sticky element that fills its own containing block never pins. | A6 |
| R11 | The `↓ New message` pill is a **sibling** of the scroll container, so `position: sticky` has no scrollport and it becomes a static flex item squeezing the transcript. | A6 |
| R12 | **`role="button"` on a div containing an `<a>`** in `FindingCard`'s clickable variants — nested interactive content, and a screen reader announces the whole row as one button label. | A5 |
| R13 | Drawer `←`/`→` walk the full 47-item corpus **ignoring the active filter**, with no position readout. | A5, A13 |
| R14 | **Three vocabularies for the same five dimensions** — `Exists`/`Demand` on pills, `WHAT EXISTS`/`DEMAND SIGNALS` on rows, raw `DEMAND_SIGNALS` in the drawer. | A1 |
| R15 | **`.oq-collapsed-question` is `nowrap` + ellipsis** against 90–140-character questions, so the collapsed list reads as six near-identical fragments. And expanding a card *hides* its own question from the header. | A11 |
| R16 | `useScrollSpy(items.map(...))` receives a fresh array identity every render and `ids` is the effect dependency — every state update tears down and re-registers the listeners. | A4 |
| R17 | `.finding-row` animates all 47 rows simultaneously on mount **and on every filter change**, with no stagger. | A13 |
| R18 | `app/layout.tsx` has **no `openGraph` block and no image**. Every shared run link — the product's entire distribution model — previews as bare text. | A15 |
| R19 | `RunShell` renders no skip link despite `<main id="main">` existing, and `SkipLink` exists unused. | A4 |
| R20 | Route-level `loading.tsx` skeletons don't match their final shapes (Define stubs 6 of 12 fields and a 44px block against a ~213px headline). | A14 |
| R21 | `.meta-line`'s `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` clips **the price off every `CompetitorCard`** — the single most decision-relevant field on the card — in a 2-col grid inside a 600px column. Same risk on `DimensionSection`'s meta line. | A2 |
| R22 | **Every section headline on the shipped landing page renders in Inter Tight, not Geist.** `.ob-h1`, `.ob-h2` and `.ob-h3` set size, weight, tracking, leading and colour but **no `font-family`**, so `@layer base`'s `h1,…,h6 { font-family: var(--font-display) }` applies to the element. `.ob-display` happens to declare it, which is why the hero looks right and nothing was ever noticed. Verified in `styles/obsidian.css:159–186` against `styles/globals.css:54–60`. | A0 |
| R23 | Moving `data-theme` to `<html>` (A0) makes `@layer base`'s `body { font-family: var(--font-text) }` — a *direct* declaration — beat the inherited `--ob-font`, silently reverting the whole app including `/` to Inter Tight. Latent until A0 makes the move; A0 must land the higher-specificity base override in the same commit. | A0 |
| R25 | **`/sources` overflows its viewport by 4px at 1280** — a `.ob-finding-source-link` row inside the still-Deep-Canopy `SourcesList` extends to `right: 1269` against a 1265px client width. Standing rule 17 requires both widths clean. Found by A8–A11's audit sweep; the page is untouched by those four phases and `SourcesList` is deleted outright by A13, so fixing the component now is work thrown away. **A13 must assert `scrollWidth === clientWidth` at 1280 on the rebuilt explorer.** | A13 |
| R24 | **Hydration mismatch on `/validate`.** `ValidateView` does `useState(() => isRunStreamActive(slug))`, which reads `localStorage` — `false` on the server, `true` on the client — so the server renders the Report and the client regenerates the Console. Same class as R8; only visible in the freshly-approved state. Found by A1's exit test, confirmed pre-existing. | A8 |

---

## Shared contracts

**Read this before any phase. It overrides any phase body that disagrees with it.**

Sixteen phases were drafted in parallel against one brief. Where two of them
fully specified the same shared artefact — a module's exported API, a schema
shape, a fixture number, a stylesheet section number — they disagreed. Every
such conflict is settled here, once, and the phase bodies defer to this section
rather than restating it. **A phase that redeclares something below is stale;
this section wins and the phase gets amended on the spot.**

The rule that prevents a recurrence: **a shared artefact is specified in exactly
one place.** A phase that consumes one references it; a phase that creates one
owns it outright.

---

### C1 — `styles/obsidian-app.css`: the section map

One file, sixteen numbered sections, each owned by exactly one phase. **A0
creates the file with all sixteen banners present and empty; every later phase
fills its own and appends nothing.** Section numbers never shift.

| § | Section banner | Owner |
|---|---|---|
| §1 | `APP SHELL` — containers, `main` inset, anchor inset, skip target | A0 |
| §2 | `PRIMITIVES — SURFACES & TYPE` — card, well, rule, eyebrow, meta, headline | A2 |
| §3 | `PRIMITIVES — CONTROLS & OVERLAYS` — button, chip, pill, input, drawer, modal, popover, accordion, slot | A2 |
| §4 | `FIGURES` — the `Figure` frame, shared marks, stance fills, axes | A3 |
| §5 | `RUN CHROME` — header, identity, rail, evidence button, footer | A4 |
| §6 | `EVIDENCE` — citation chip, drawer bodies, finding card | A5 |
| §7 | `DEFINE — LAYOUT & TRANSCRIPT` | A6 |
| §8 | `DEFINE — BRIEF PANEL` | A7 |
| §9 | `CONSOLE` | A8 |
| §10 | `REPORT — STRUCTURE` | A9 |
| §11 | `REPORT — FIGURES` | A10 |
| §12 | `ROADMAP — OPEN QUESTIONS` | A11 |
| §13 | `ROADMAP — BUILD PLAN` | A12 |
| §14 | `EVIDENCE EXPLORER` | A13 |
| §15 | `STATES & SUPPORTING SURFACES` | A14 |
| §16 | `REDUCED MOTION` — the app-side reduce block | A15 finalises; A0 seeds |

- **§16 is the only home for app-side reduced-motion rules.** `styles/obsidian.css`
  §16 stays as it is and is not extended by any phase in this plan.
- **Every `@keyframes` declared in `obsidian-app.css` is prefixed `ob-app-`.**
  A duplicate `@keyframes` name is silently *replaced*, not merged, and
  `obsidian-app.css` is imported after `obsidian.css` in the same layer — so an
  unprefixed `ob-pulse` here would kill the live dot on every route with no
  error. Grep the name across `styles/*.css` before declaring one.

---

### C2 — Foundation ownership

**A0 owns `styles/obsidian-app.css`, its `layer(components)` import line, and
every new token.** No later phase creates the file, adds the import, or declares
a token. Where a phase body says "add `--ob-hatch` if A0 didn't", it means
**assert the value and move on**.

Tokens A0 declares, complete:
`--ob-container-app: 1360px` · `--ob-container-report: 1080px` ·
`--ob-report-prose: 580px` · `--ob-report-aside: 400px` ·
`--ob-header-h: 72px` · `--ob-header-h-condensed: 56px` ·
`--ob-anchor-inset: 136px` · `--ob-section-gap-app: 96px` ·
`--ob-grid: rgba(244,244,245,0.06)` · `--ob-hatch: rgba(244,244,245,0.10)`

**`--ob-anchor-inset` is 136px and there is exactly one rule that applies it**,
in §1: `main [id] { scroll-margin-top: var(--ob-anchor-inset) }`. 136 = 56px
condensed header + 48px sticky section index + 32px of air. No phase overrides
it, raises it, or writes a competing selector — three phases tried, at three
values, and the earlier ones win on specificity (pitfalls §11).

---

### C3 — Vocabulary maps: one home, `lib/schemas/evidence.ts`

R14 is *"three vocabularies for the same five dimensions"*. Four phases
proposed four homes for the fix. There is one:

```ts
export const DIMENSION_LABEL: Record<Dimension, string> = {
  PROBLEM: 'The problem', WHAT_EXISTS: 'What exists',
  DEMAND_SIGNALS: 'Demand signals', MONEY: 'Money',
  PRACTICAL: 'Practical realities',
};
export const DIMENSION_SHORT: Record<Dimension, string> = {
  PROBLEM: 'Problem', WHAT_EXISTS: 'Exists',
  DEMAND_SIGNALS: 'Demand', MONEY: 'Money', PRACTICAL: 'Practical',
};
export const STANCE_LABEL: Record<Stance, string> = {
  supports: 'Supports', neutral: 'Neutral', challenges: 'Contests',
};
export const DISCARD_REASON_LABEL: Record<DiscardReason, string> = {
  excerpt_not_found_on_page: 'The quoted text was not on the page it came from.',
  page_changed_since_index:  'The page changed between being indexed and being read.',
  paywalled:                 'The page was behind a paywall when we fetched it.',
  quote_paraphrased_not_verbatim: 'The quote was a paraphrase, not the page’s own words.',
};
```

- **`DIMENSION_LABEL` is the long form** (report headings, drawer, finding card);
  **`DIMENSION_SHORT` is the compact form** (facet pills, coverage rails, strips).
  `PRACTICAL` is `Practical realities` long and `Practical` short. Nothing else.
- **There is no `lib/dimensions.ts`.** There are no label maps in
  `lib/content/app.ts`. There is no inline stance-word map in any component.
- A1 creates all four. Every other phase imports them.

---

### C4 — The brief state: `lib/brief-state.ts`

A1 ships the module complete, **to this signature**, and A7 only wires the hook.

```ts
export type BriefPatch = {
  v: 1;
  revealed: BriefFieldKey[];      // fields the conversation has reached
  unknown: BriefFieldKey[];       // fields marked unknown, by the user or the fixture
  edited: BriefFieldKey[];        // fields the user retyped
  values: Partial<Record<BriefFieldKey, string | string[]>>;  // what they retyped it to
  approvedAt: string | null;      // ISO, set once
};
export type BriefAction =
  | { type: 'hydrate'; patch: BriefPatch }
  | { type: 'reveal'; key: BriefFieldKey }
  | { type: 'markUnknown'; key: BriefFieldKey }
  | { type: 'edit'; key: BriefFieldKey; value: string | string[] }
  | { type: 'approve'; at: string };

export function briefReducer(state: BriefPatch, action: BriefAction): BriefPatch;
export function emptyBriefPatch(): BriefPatch;
export function resolveBrief(base: Brief, patch: BriefPatch): Brief;
export function unknownKeys(base: Brief, patch: BriefPatch): BriefFieldKey[];
export function answeredCount(base: Brief, patch: BriefPatch): number;
export function unansweredCount(base: Brief, patch: BriefPatch): number;
export function coreFilled(base: Brief, patch: BriefPatch): boolean;
export function readBriefPatch(slug: string): BriefPatch | null;   // localStorage
export function writeBriefPatch(slug: string, patch: BriefPatch): void;
```

- Storage key `sv.brief.<slug>`. The discriminator is **`v`**, and a payload
  whose `v !== 1` is discarded on read.
- `tests/unit/brief-state.test.ts` is written against **these** names.
- **The edited values live in the patch, in `values`.** An earlier draft of this
  contract kept them in a separate store at `sv.brief.<slug>.values` and had
  `resolveBrief(base, patch)` read them — which cannot work, because
  `BriefPatch` carries no `slug` to look the store up with. A1's and A7's
  authors both hit it independently and both invented the same workaround; that
  is the tell that the contract was wrong, not the phases. **`resolveBrief` is
  pure, two-argument, and has everything it needs.** There is one storage key,
  and a patch is still a plausible `PATCH /api/brief` body — more so with the
  values in it, not less.

---

### C5 — ~~The roadmap week model~~ → the journey model: `lib/run-plan.ts`

> **SUPERSEDED by A16.** Everything below described a twelve-week integer axis
> that no longer exists. The replacement, in `lib/run-plan.ts` and
> `lib/schemas/roadmap.ts`:
>
> - **`tracks[] → bars[]`, not `steps[]`.** Tracks are data so the chart can be
>   built out of what an idea requires; a closed enum could not carry a
>   marketplace's supply-seeding track or a hardware idea's tooling lead time.
> - **Positions are fractions of the journey (`0`–`1`), not weeks.** `barSpan()`
>   converts to percentages — which is *not* the "geometry smuggled into the data
>   layer" C5 forbade, because the fractions are already the model. The thing C5
>   actually banned was a module *inventing* geometry from week integers, and
>   there are no week integers left to invent from.
> - **A bar carries `weeks_low`/`weeks_high` only when `clock: 'theirs'`.** The
>   schema makes the other combination unrepresentable, which is what stops build
>   estimates creeping back one edit at a time.
> - API: `barsByTrack` · `barSpan` · `durationLabel` · `externalWeeks` ·
>   `clockSplit` · `allAmbushes` · `citedAmbushes` · `barById`. No `planSpans`,
>   no `planHorizon`, no `isOnAxis`.
> - **The count is `14 STEPS · 10–13 WEEKS NOT YOURS`, everywhere** — the run
>   header meta, the page meta, and the OG description, all from `externalWeeks`.
>   "12 weeks" and "4 build steps · 1 tripwire" are now false.
>
> The geometry note below is still true of `.ob-container` and still the reason
> every assertion about the chart is a **ratio, never a pixel**.

Three horizons were proposed (17 / 14 / 12). **The answer is 12**, because that
is what D13's visible `W1…W12` axis and A11's header line depend on.

Schema, in `lib/schemas/roadmap.ts`:
```ts
kind: z.enum(['build', 'tripwire']),
start_week: z.number().int().positive().nullable(),
duration_weeks: z.number().int().positive().nullable(),  // null = open-ended
// `estimate` is DELETED. The week fields replace it.
// .refine — a 'build' step has a start_week; a 'tripwire' step has neither field.
```

| Step | `phase` | `kind` | `start_week` | `duration_weeks` | Span |
|---|---|---|---|---|---|
| S01 | `BEFORE_YOU_BUILD` | build | 1 | 2 | W1–W2 |
| S02 | `FIRST_THING_TO_BUILD` | build | 3 | 4 | W3–W6 |
| S03 | `THEN` | build | 7 | 5 | W7–W11 |
| S04 | `LATER_AND_ONLY_IF` | build | 12 | `null` | W12 → open-ended |
| S05 | `WHAT_WOULD_CHANGE_THIS_PLAN` | tripwire | `null` | `null` | off-axis |

API: `planSpans(roadmap): PlanSpan[]` · `planHorizon(roadmap): number` (12) ·
`isOnAxis(step): boolean`. No `buildRunPlan`, no `planLanes`, no `open_ended`
field, no `leftPct`/`widthPct`.

**Geometry.** `.ob-container` is `max-width: 1200px; padding-inline: 40px`, so
the axis content box is **1120px — twelve tracks of 93.33px, not 100px.** Every
exit test that touches the axis asserts **ratios**, not pixels: a bar's width
divided by the mark width must equal `duration / 12` within 0.5%.

**The count is `4 BUILD STEPS · 1 TRIPWIRE`, everywhere** — the run header meta
(A4), the page meta (A11), and the OG description (A15). "Five build steps" is
now false; D13 takes the tripwire off the axis.

---

### C6 — `OpenQuestion`: priority, brief link, fan-out

- **`priority: z.number().int().positive()`** — a rank, because A11 sorts on it
  and does arithmetic with it. Values: **Q06 1 · Q01 2 · Q04 3 · Q02 4 ·
  Q05 5 · Q03 6.** `effort` stays the enum A1 defines.
- **`brief_field: BriefFieldKeySchema.nullable()`**, in `lib/schemas/roadmap.ts`.
  Not `from_brief_field`, not `string`, and **there is no
  `lib/schemas/open-question.ts`** — open questions live in the roadmap schema
  and fixture, beside the refinements that validate them.
- **The dependency edges, final:** S01 ← Q01, Q06 · S02 ← Q02, Q04, Q05 ·
  S03 ← Q06 · S04 ← Q03, Q06 · S05 ← Q01, Q04.
- **Fan-out, derived from exactly those edges:** Q01 2 · Q02 1 · Q03 1 ·
  Q04 2 · Q05 1 · Q06 3. Sorting by fan-out descending, ties broken by rank,
  reproduces the priority order above — which is why `FanOutMeter` and the
  card order agree without a second source. **Any phase quoting a different
  fan-out number is wrong.**

---

### C7 — `CapabilityMatrix`

Schema, in `lib/schemas/report.ts`:
```ts
const CapabilitySchema = z.object({
  key: z.enum(['reminders','recall','waitlist','auto_rebook','pms_integration']),
  level: z.enum(['yes','partial','no','unknown']),
  citations: z.array(z.number().int().positive()),
});
// CompetitorSchema.capabilities: z.array(CapabilitySchema).length(5)
//   .refine(c => c.level === 'unknown' || c.citations.length >= 1)
// ReportSchema.idea_capabilities: z.array(CapabilityKeySchema)
```

Five keys, never four. Cell values are A10's. **The idea is a fourth *column*,
not a row**, headed `THIS IDEA` with a `NOT EVIDENCE` chip, its cells reading
`CLAIMED` or `—` with **no square marks at all**, under the line *"The last
column is your brief, not a finding. Nothing in it has been checked."*

**That register split is the only thing standing between this figure and a
verdict.** An idea row drawn first, in the same marks as the competitors, is a
comparison chart that says *we win* from a column with no evidence behind it.
Do not simplify it back.

---

### C8 — `RunFunnel`

- **One component, two densities, one axis rule.** The bars are shares of the
  **largest segment (47)**. They are never normalised to a total. `47 / 65`
  looks like a pass rate, and this product does not publish pass rates.
- **The report renders `variant="compact"`** — bars and counts only — in §02's
  aside beside the summary, 140px. **`/sources` §01 owns the expanded version**
  with the discard-reason breakout beside it. A13 does not delete the report's.
- Its verified bar is `--ob-accent` (job 2, verification) and its discarded bar
  is `--ob-discard`. **It is the only accent mark in the entire figure layer**,
  in both homes. Active facet state on `/sources` lives on
  `[aria-pressed='true']` controls, not on figure fills.

---

### C9 — Discards

```ts
DiscardedFindingSchema = {
  id: /^DS_\d{2}$/, excerpt, source_url, source_date,
  dimension, attempted_query, discard_reason,
}
```

- **There is no `text` field, and none is added.** A discarded excerpt never
  became a finding, so there is no claim to render. Inventing one is precisely
  what "nothing is invented to fill a field" forbids. `DiscardRow` leads with
  the struck-through **excerpt**; its props are `{ record: DiscardedFinding; index: number }`.
- `discard_reason` is the four-value enum in C3 and **always renders through
  `DISCARD_REASON_LABEL`** — never the raw key. **It is always sans and never
  `--ob-discard`**, which measures 2.25:1 and is deliberately illegible; the
  sentence D15 exists to surface must not be set in it, and mono carries no
  sentences. Size and weight are per surface, because a row and a 520px panel
  are not the same reading job:
  - **In a `DiscardRow`** — `--ob-sm` in `--ob-muted`, with only the
    `DISCARDED —` prefix in mono `--ob-discard`.
  - **In the drawer**, where the reason is the lead — `--ob-h3` in `--ob-text`.
    A 13px muted line is not a lead at the top of a panel.
- Distribution across the 18: `excerpt_not_found_on_page` 7 ·
  `page_changed_since_index` 5 · `paywalled` 3 ·
  `quote_paraphrased_not_verbatim` 3. Per dimension: PROBLEM 5 · WHAT_EXISTS 4 ·
  DEMAND_SIGNALS 3 · MONEY 4 · PRACTICAL 2.
- `discard_reason` is **removed from `FindingSchema`.** Two ways to express a
  discard is how the explorer ends up with two code paths.
- **`getDiscarded(slug)` is wired in two places**: `app/r/[slug]/layout.tsx`
  (A4) so `EvidenceProvider` can hold them, and `app/r/[slug]/sources/page.tsx`
  (A13) so the explorer can render them. A1 creating it and nobody calling it
  was the single most consequential gap in the first draft.
- **Discard rows do open the drawer.** It is the natural place to read the whole
  failed excerpt and its reason. `EvidenceProvider` carries a `scope` — the
  currently filtered id list — and `next`/`prev` walk **only that scope**, so
  they never cross from verified into discarded, and the drawer shows a
  `n of m` readout against the scope, not against 47.

---

### C10 — The analytics API, frozen in A1

A1 writes these once; A3, A10 and A13 import them and add nothing with a new
spelling. If a figure needs a different return shape, **A1's signature and its
test change** — a second name does not appear.

```
lib/analytics/evidence-stats.ts
  stanceOverall(evidence): { supports: number; neutral: number; contests: number }
  stanceByDimension(evidence): Record<Dimension, { supports; neutral; contests }>
  recencyTicks(evidence, report, dimension?): { id: string; date: string; cited: boolean }[]
    // amended in A1: `cited` can only be answered by the report.
  domainConcentration(evidence): { domain: string; count: number }[]   // desc
  citationCoverage(report, evidence): { cited: Set<number>; uncited: Set<number> }
    // "cited" = quoted in the report's RUNNING PROSE — the summary plus the
    // five dimension paragraphs. Not the surprises panel, not the capability
    // cells; counting those gives 30/17, not the 24/23 below. Pinned in A1.
  citedFindingIds(report): Set<string>
  deriveEvidenceState(report, evidence): { strong: Dimension[]; thin: Dimension[]; contested: Dimension[] }

lib/analytics/report-figures.ts
  priceLadder(evidence): LadderRung[]
  roiGap(evidence): { lostLow; lostHigh; costLow; costHigh; ratioLow; ratioHigh }
  capabilityMatrix(report): MatrixModel
  runFunnel(summary): { label: string; value: number; share: number }[]  // share = value / max
  numberCallouts(evidence, dimension): CalloutModel[]

lib/run-plan.ts
  planSpans(roadmap) · planHorizon(roadmap) · isOnAxis(step)
  fanOut(roadmap): Record<string, RoadmapStep[]>   // question id -> the steps naming it,
                                                   // tripwire included; a count is .length
    // amended in A1: was spelled `RoadmapPhase[]`, but A11 partitions the
    // result with `isOnAxis(step)`, which a phase enum cannot satisfy. The
    // comment was right; the type was the slip.
```

**`deriveEvidenceState`'s thresholds, stated once and nowhere else:**
`strong` = `confidence === 'solid'` · `thin` = `confidence === 'thin' || count < 3` ·
`contested` = `challenges >= 2 || challenges / count >= 0.15`. A dimension may
appear in two lists; that is the honest result and is not suppressed.

---

### C11 — Figure numbers, settled

Every figure renders a **derived** value. These are what the derivations return
on this fixture, and no phase types them into a component:

- **Price ladder** — four rungs: a **band** `$150–250` "what practices say
  they'd pay" `[26]` · `$199/mo` Recall360 `[34]` · `$299/mo` ChairSync `[33]` ·
  a **dashed threshold** at `~$300/mo` "owner sign-off" `[42]`.
- **ROI gap** — `$2,000–4,000/mo` lost production `[41]` against `$199–299/mo`
  tool cost `[33][34]`, ratio **`10–20×`**. Not `$3,000` vs `$200`; not `15×`;
  not `6.7×/13.4×`. EV_26 is a *willingness to pay*, not a tool price, and must
  never be used as one.
- **Number callouts** — `14.2%` `[2]` · `16.8% → 9.1%` `[7]` · `18%` `[9]` ·
  `130,000 / 70%` `[32]` · `0 of 9` `[19]` · `14` `[24]` · `2–3 weeks` `[46]` ·
  `30 s` `[20]` · `100/min` `[47]`. **`0 of 9` is the only callout that gets
  `emphasis="lead"`**; spending that treatment twice spends it.
- **Surprises** are `{ headline, detail: CitedTextSchema }` with citations
  `[42][44]` · `[25][29]` · `[35][36]`. **Not `[25][31]`** — EV_31 is
  ChairSync's *live* $6M raise, and pairing it with a shutdown claim would make
  the fixture assert that a competitor priced elsewhere in the same report has
  closed. `CitedTextSchema.refine()` would pass it happily; it is still a lie.

---

### C12 — Shared class names

Defined once, in the section named, and used everywhere else by import:

| Class | Meaning | Defined in |
|---|---|---|
| `.ob-fig` | the `Figure` wrapper | §4 (A3) |
| `.ob-fig-mark` | the mark area whose height is reserved | §4 (A3) |
| `.ob-fig-value` | any rendered numeral inside a mark | §4 (A3) |
| `.ob-fig-bar` | any bar inside a mark | §4 (A3) |
| `.ob-stance-bar` | the `StanceBar` figure container | §4 (A3) |
| `.ob-stance-mark` | the inline per-row stance mark | §6 (A5) |
| `.ob-stance-supports` / `-neutral` / `-contests` | the three fills, shared by both | §4 (A3) |
| `.ob-cite` | a citation chip | §6 (A5) |

- The hatch is one geometry:
  `repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px)`.
- **The bracket rule is scoped:** `.ob-cite` is the only element permitted to
  render a bracketed number **inside running prose** (`.ob-report-prose`,
  `.ob-prose`). `[03]` on an explorer row and `[Q02]` in a skeleton are outside
  prose and are legal. A5's assertion is scoped accordingly.

---

### C13 — Ownership of things two phases both wanted

| Thing | Owner | Not the owner |
|---|---|---|
| `styles/obsidian-app.css`, its import, all new tokens | A0 | A2, A4, A5, A10 assert only |
| The verification moment's **CSS** (`.ob-verify-rule`, badge opacity states) | A5 | — |
| The verification moment's **attributes and timings** (see the sequence below) | A8 | A5's exit test does not sample the stream |
| `components/entry/*` | A2 moves `orb.tsx` and `recent-runs-list.tsx` to `components/ui/` and deletes the rest | A8 and A14 reference `components/ui/` |
| `Orb` | A14 keeps it on the invalid-run page | A8 removes it from the console (the backdrop replaces it) |
| `.ob-backdrop` | **each page** renders `<AppBackdrop variant=… />` as its first child; the layout cannot see the segment | not `RunShell` |

**`AppBackdrop`'s prop names the *surface*, not the strength.** The union is
`type BackdropVariant = 'define' | 'validate' | 'roadmap' | 'sources' | 'standalone'`,
exported from `lib/run-stage.ts` beside `RunSegment`; `'standalone'` is the
404 and error surfaces, which are outside the run shell. The component maps
surface → strength internally and emits `data-variant`, so a route changes its
atmosphere by changing one CSS rule, not its JSX. **The media plans'
`none` / `ambient` / `clip` vocabulary describes that internal strength and is
not the prop value** — `higgsfieldPlan_shared.md` §1's table is the mapping,
not the API.
| `FindingCard`'s three variants | all three survive; A13 builds `EvidenceRow` alongside | A13 deletes nothing |
| `TwoColumn` | deleted in A2, with **three** call sites replaced — `define-conversation.tsx`, `report.tsx`, **and `app/r/[slug]/define/loading.tsx`** | A6 must not expect the file |
| `tests/unit/run-stage.test.ts` | A4 updates it to the new signature and runs the full toolchain gate | — |
| Heading outlines, all routes | **[C17](#c17--heading-outlines-per-route)** | not A15, and not the page phases individually |

**The verification sequence, per finding card, in full.** An earlier draft
pinned the badge at entrance + 180ms while `.ob-verify-rule` draws over
`--ob-enter` (900ms) — which lands the **verdict before the proof it is a
verdict about**, inverting the meaning of the one device the whole product is
built on. A8's author flagged it. The order is:

| t | What happens |
|---|---|
| `0` | Card enters — fade + 12px rise over **320ms**, `--ob-ease`. |
| `320ms` | `.ob-verify-rule` begins drawing, `scaleX(0) → scaleX(1)` from the left over **900ms**. |
| `1220ms` | The rule lands and `VerifiedBadge` fades in over **180ms** — *as* the proof completes, never before it. |

Total ~1.4s per card, independent per card, so overlapping arrivals are fine and
expected — findings land every 0.5–1s. This is the same two-beat shape the
landing page's verification demo uses, and it is why that demo is convincing.
**Verification is not a label that appears on a card; it is a thing that
visibly finishes.**

---

### C14 — Every exit test ends the same way

`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build` · zero
console errors at 1440 **and** 1280. A4's draft omitted this; no phase may.

---

### C15 — The shell vocabulary, and where the header's height is held

Three phases spelled the run shell three ways. There is one spelling:

- `RunShell` renders `<div className="ob-app">`.
- `RunMain` renders `<main id="main" className="ob-app-main" data-chrome={…} data-segment={…}>`.
- **`.ob-run-shell` and `.ob-run-main` do not exist.** Everything else in the
  chrome is `.ob-run-*` (`.ob-run-header`, `.ob-run-identity`, `.ob-run-footer`…).

**The header's height is held exactly once, by A4's spacer.** `.ob-run-header`
is `position: fixed`; `.ob-run-header-spacer` is an `aria-hidden` sibling at a
permanent `height: var(--ob-header-h)`. **A0 §1 therefore declares no
`padding-block-start` on `.ob-app-main`** — an earlier draft had both, which
offsets every page by 144px instead of 72. A0 §1 owns only the structural
shape (`.ob-app` flex column, `.ob-app-main { flex: 1 }`, the container widths,
the anchor inset, the skip target); the spacer is §5's.

The spacer is the right mechanism and not an arbitrary pick: the header
condenses 72px → 56px on scroll, and a spacer of constant height means that
condense reflows nothing below it (standing rule 12). It is also what makes
Define's `calc(100vh - var(--ob-header-h) - 96px)` exact rather than
approximate. **Surface mode is A4's, in §5, and is quoted here so no phase
paraphrases it:**

```css
main.ob-app-main[data-chrome='surface'] { height: calc(100vh - var(--ob-header-h)); overflow: hidden }
main[data-chrome='surface'] ~ .ob-run-footer { display: none }
```

---

### C16 — `EvidenceButton` opens an overlay; `/sources` stays a route

D16 says evidence is *a layer available everywhere, not a fifth destination*.
So:

- `EvidenceButton` opens **`EvidenceOverlay`** — a full-height Radix dialog,
  `aria-haspopup="dialog"`, `aria-controls="evidence-explorer"`, focus-trapped,
  Esc to close, focus restored. It is not a route push.
- **`/r/[slug]/sources` remains a real, linkable, shareable route.** The URL is
  the whole access model; an evidence view you cannot paste to someone would
  contradict the product's only distribution mechanic.
- **The overlay's body is swapped, its chrome is not.** A4 builds the overlay
  with today's `SourcesList` inside it, so the chrome is real and working from
  session 3. **A13 replaces that body with `<EvidenceExplorer />` in the same
  commit that deletes `SourcesList`** — `components/layout/evidence-overlay.tsx`
  is in A13's Build list for exactly this reason. Deleting `SourcesList`
  without it fails `npx tsc --noEmit`, which C14 makes the gate.
- Both entry points render the same `EvidenceExplorer`. The route wraps it in
  `RunShell`; the overlay wraps it in the dialog. One component, two frames.

---

### C17 — Heading outlines, per route

A15 asserts the document outline on every route and three phases disagreed with
it about their own markup. **This table is the single source; A15 asserts what
is written here and carries no expectation of its own.**

**The rule that makes it consistent: a numbered section is an `<h2>` on every
route.** On the report the eyebrow is a `<p>` above a separate `<h2>` headline;
on the roadmap and the explorer there is no separate headline, so **the eyebrow
*is* the `<h2>`** and takes `.ob-eyebrow`'s styling. Heading *size* is a class;
heading *level* is structure. Nothing on any route skips a level.

| Route | h1 | h2 | h3 | h4 |
|---|---|---|---|---|
| `/define` | 1 — `What are you building?` | 1 — `THE BRIEF` | 0 | 0 |
| `/validate` Mode A | 1 — `Reading the web about your idea.` | 0 | 0 | 0 |
| `/validate` Mode B | 1 — `What the web already says.` | **6** — the numbered sections | **11** — 5 dimensions + 3 surprises + 3 competitors | 0 |
| `/roadmap` | 1 — `What happens next.` | **3** — `01 THE JOURNEY`, `02 OPEN QUESTIONS`, `03 WHAT IT COSTS TO RUN` | **12** — 6 track names + 6 questions | 0 |
| `/sources` | 1 — `Everything we checked.` | **2** — `How the evidence was gathered.`, `Every record, verified and discarded.` | **6** — the facet legends | 0 |

Each `<section>` still takes its accessible name from `aria-labelledby`
pointing at its own heading. An accordion question is
`<h3><button aria-expanded>…</button></h3>` — the standard pattern; the button
is inside the heading, never the other way round.

**A13's amendment to the `/sources` row, recorded rather than silently
applied.** The count is unchanged at two h2s; what the row now names is the
*text* of them. A13's body specifies "an `.ob-eyebrow` numeral in chalk over a
real sentence `<h2>`", which this route has and the roadmap does not — so the
eyebrow-is-the-heading rule above applies to `/roadmap` and not here. Both
routes still put a numbered section at `<h2>`; on one the eyebrow carries the
level, on the other it sits above an element that does.

**A15's amendment to the `/validate` row, recorded rather than silently
applied.** The row read `h3 ×8 · h4 ×3`, with the three competitor names as
`<h4>`. Measured, that is a **2→4 level skip** — the competitors section's own
heading is its `<h2>` and there is no intervening level between it and a
competitor name, so the `<h4>` had nothing to nest under. `CompetitorCard` now
emits `<h3 className="ob-h3">`: the rendered size is identical, because size is
a class and level is structure. The route is `h1 ×1 · h2 ×6 · h3 ×11 · h4 ×0`,
and no route in the build emits an `<h4>`.

**If a phase adds a section, it updates this table in the same commit.** A15
diffs the live outline against it and fixes neither side silently.

---

## What the blueprint gets wrong now

`WebsiteLayoutDesc/` is still the source of truth for **product intent** — what
each page is for, what it must say, what states must exist. It is **not** the
source of truth for the visual system or several page layouts. Read it for the
first, ignore it for the second.

- **`02-visual-direction.md` is entirely superseded.** It specifies dark-luxury
  amber (`--accent: #d4a03c`, Inter + JetBrains Mono, grain, filled-glow
  buttons). Two systems have replaced it since. Every colour, token name and
  motion timing in that file is unusable.
- **`05-page-entry.md` no longer describes `/`.** The landing page was rebuilt.
  Out of scope for this plan except for one carried-over gap: `RecentRunsList`
  is absent from `/`, which breaks the stated lost-link recovery obligation.
  Logged for a future phase, **not built here**.
- **The `'use client'` allowlist in `10-component-system.md` is retired** — see
  Standing rule 22.
- **"No charts" in the decision log meant no score gauges, dials or radar
  charts.** It was reasoning from "no scores means no scoring visuals". D6
  overrides the letter of it, not the spirit: nothing in this build rates the
  idea. Every mark describes *the evidence*, is citation-linked, and prints its
  raw number alongside.
- **Survey rows on `OpenQuestionCard` were a sanctioned cut**, recorded in
  `16-scope-and-priorities.md` as cut-first-if-behind. D3 reinstates them.
- The a11y contrast note in `13-responsive-and-accessibility.md` marked
  "Resolved 2026-08-20" was **measured against the amber palette that no longer
  exists**. Contrast must be re-measured against Obsidian in A15.

**Product intent that is still binding, and that this plan must not break:**
no verdict, no score, no gates · "I don't know" is always acceptable and is
never a blocker · nothing is invented to fill a field · every claim links to a
real source · competitor data is rendered from fields, never prose · no fake
percentages · the URL is the whole access model · no toasts, no illustrated
empty states, no confetti · the report ends pointing forward into the roadmap.

---

## Progress

| Phase | Name | Status | Session |
|---|---|---|---|
| A0 | Foundation — global Obsidian, layering, naming | `DONE` | 2026-08-21 |
| A1 | Data layer — schemas, fixtures, derivations | `DONE` | 2026-08-21 |
| A2 | Primitives I — the Obsidian app kit | `DONE` | 2026-08-21 |
| A3 | Primitives II — the figure kit | `DONE` | 2026-08-21 |
| A4 | Run chrome — sticky header, honest stage state | `DONE` | 2026-08-21 |
| A5 | Evidence system — chip, drawer, finding card | `DONE` | 2026-08-21 |
| A6 | Define — layout and transcript | `DONE` | 2026-08-21 |
| A7 | Define — the live brief mechanic | `DONE` | 2026-08-21 |
| A8 | Validate — the Run Console | `DONE` | 2026-08-21 |
| A9 | Validate — the Report, structure | `DONE` | 2026-08-21 |
| A10 | Validate — the Report, data layer | `DONE` | 2026-08-21 |
| A11 | Roadmap — open questions | `DONE` | 2026-08-21 |
| A12 | Roadmap — the time-scaled build plan | `DONE` | 2026-08-21 |
| A13 | Sources — the Evidence Explorer | `DONE` | 2026-08-21 |
| A14 | Supporting surfaces + the state matrix | `DONE` | 2026-08-21 |
| A15 | Sweep — motion, a11y, deletion, DoD | `DONE` | 2026-08-21 |
| A16 | Roadmap — rebuilt as the journey (supersedes A12) | `DONE` | 2026-08-23 |
| A17 | Roadmap — rebuilt for readability (supersedes A16) | `DONE` | 2026-08-24 |
| A18 | Legibility — the grey ramp measured up, app-wide | `DONE` | 2026-08-24 |
| A19 | Type scale — closed at 16 steps, app-wide | `DONE` | 2026-08-24 |

Status values: `TODO` · `IN PROGRESS` · `PARTIAL` · `DONE`

**Dependency order is strict for A0–A5.** After A5, the four page pairs
(A6–A7, A8–A10, A11–A12, A13) are independent of each other and may be done in
any order. A14 and A15 come last.

---

# Phases

## A0 — Foundation: global Obsidian, layering, naming

**Goal:** every route in the app renders on the Obsidian canvas, in Geist, reading `--ob-*` tokens from `:root`, with `styles/components.css` finally layered — and the four still-Deep-Canopy page bodies survive it. Nothing looks finished. This phase exists so no later phase has to fight the cascade, invent a token, or guess where its rules go.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/pitfalls.md` (§1, §2, §3, §5, §11), `references/verification.md` (§3)

**Build:**
- `styles/tokens.css` — change the `[data-theme="obsidian"]` selector to `:root`; rewrite its header comment; append the ten new tokens listed in [C2](#c2--foundation-ownership).
- `styles/globals.css` — layer `components.css`; add two `@layer base` override rules for `body` and headings under obsidian; drop one property from the global `:focus-visible` rule; add the `styles/obsidian-app.css` import.
- `styles/obsidian-app.css` — **new file, created here and by no one else.** All sixteen section banners from [C1](#c1--stylesobsidian-appcss-the-section-map) present and in order. A0 writes §1 for real, seeds §16, and leaves §2–§15 as empty banners.
- `app/layout.tsx` — `data-theme="obsidian"` onto `<html>`; `metadata` gains `applicationName` and a `title.template`.
- `app/page.tsx` — remove `data-theme="obsidian"` from the wrapper `<div>` (it is now inherited from `<html>`; two sources of truth is how a scope bug starts).
- `lib/content/app.ts` — **new file.** Every string the four run pages render, seeded with the agreed page copy.
- `components/layout/wordmark.tsx`, `components/layout/logomark.tsx`, `app/style-guide/page.tsx`, `components/style-guide/sections/foundations.tsx` — the D2 rename.

**Notes:**

- **D1, cheapest possible promotion.** Every selector in `styles/obsidian.css` is written under `[data-theme='obsidian']`. Putting that attribute on `<html>` promotes all 16 recipe sections globally in one character-level edit and changes nothing about how they resolve. The *tokens* move to `:root` in this phase; the *attribute* stays until A15 strips it from the recipe selectors. Do not attempt both halves now.
- **The single thing this phase must not get wrong (R23).** Today the chain is `<body>` (Inter Tight, from `@layer base`) → `<div data-theme="obsidian">` (Geist, direct declaration) → content. Move the attribute to `<html>` and the chain becomes `<html>` (Geist) → `<body>` (Inter Tight, *direct declaration*, beats inheritance) → content — **and the whole app, `/` included, silently reverts to Inter Tight.** The fix is a higher-specificity base rule, in `@layer base` immediately after the existing `body` block:
  ```css
  [data-theme='obsidian'] body {
    background: transparent;
    color: var(--ob-muted);
    font-family: var(--ob-font);
    font-size: var(--ob-body);
    line-height: var(--ob-leading-body);
    letter-spacing: var(--ob-tracking-snug);
  }
  ```
  `background: transparent` is load-bearing: `--bg-base` (`#071613`, forest green) would otherwise paint straight over the `--ob-canvas` that `<html>` is now carrying.
- **Second latent bug, found while writing this plan (R22): `/`'s display type is currently Inter Tight, not Geist.** `.ob-display`/`.ob-h1`/`.ob-h2`/`.ob-h3` set size, weight, tracking, leading and colour but **no `font-family`**, and `@layer base`'s `h1,h2,…,h6 { font-family: var(--font-display) }` is a direct declaration on the element that beats inherited `--ob-font`. The 104px hero headline has been rendering in the one face the skill explicitly says to avoid. Fix in `@layer base`, after the existing heading rule:
  ```css
  [data-theme='obsidian'] :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--ob-font);
    color: var(--ob-text);
    font-weight: var(--ob-weight);
    letter-spacing: var(--ob-tracking-snug);
    line-height: var(--ob-leading-tight);
  }
  ```
  It must live in `base`, not in `obsidian-app.css`. In `@layer components` its specificity (0,1,1) would outrank `.ob-h1` (0,1,0) and eat every headline's own tracking.
- Remove `border-radius: var(--r-md)` from the global `:focus-visible` rule in `@layer base`. `pitfalls.md` §2 names it: it applies to the *element*, squaring off or rounding whatever it lands on. `outline` + `outline-offset` are the whole indicator.
- **R1 — `@import "./components.css" layer(components);`.** This is the phase's other headline change and it **will shift spacing on `/r/[slug]/define|validate|roadmap|sources`**: every Deep Canopy recipe that sets `margin`, `padding` or `gap` currently outranks every Tailwind utility on the same element, and after this it does not. `.section-label { margin-bottom: var(--sp-4) }` is the live example in the rot table. **This is correct and expected.** Those four page bodies are rewritten in A6–A13. A0's job is to confirm nothing *catastrophically* breaks — no overlapping text, no zero-height container, no unreachable control — not to chase pixel parity on markup that is about to be deleted. Import order in `globals.css` stays `tokens.css` → `components.css` → `obsidian.css` → `obsidian-app.css`; same layer, so source order decides ties and Obsidian wins.
- **A0 deliberately promotes canvas and typeface globally.** After this phase the run pages render near-black ground, Geist, weight-400 headings, and Deep Canopy's green cards, light-blue `.section-label`s and amber-era borders on top. They will look half-ported. **That is the correct interim state and must not be "fixed" by re-scoping anything.**
- The global grain overlay (`body::before`, `--grain-opacity: 0.035`) already applies to `/` today and is left alone; it reads a Deep Canopy token that survives until A15. Logged, not touched.

**New tokens — A0 declares them, per [C2](#c2--foundation-ownership); no later phase does.** Type the ten names and values from C2, not from this phase body, under a `/* App surfaces — added by the app port */` banner appended to the (now `:root`) `--ob-*` block. What each is for, and why the number:

- `--ob-container-app` — the chrome, console and explorer width. Wider than `/`'s 1200 because the explorer is a facet rail plus 65 dense rows and the console is a two-column stream.
- `--ob-container-report` — the report body grid. Narrower than the app width on purpose: D5's editorial two-column is prose plus an aside, not a dashboard.
- `--ob-report-prose` / `--ob-report-aside` — D5's two columns, fixed once so A9 and A10 cannot disagree about the measure.
- `--ob-header-h` / `--ob-header-h-condensed` — D19's sticky condensing header, at rest and condensed. **Both are A0's.** A4 asserts these values and adds neither.
- `--ob-anchor-inset` — see below. **136px, and A4/A9's competing values are gone.**
- `--ob-section-gap-app` — Standing rule 9's app-side value, fixed once so nine later phases don't each pick a number. The marketing `--ob-section-gap` (160px) stays untouched and is for `/` only.
- `--ob-grid` / `--ob-hatch` — figure axes/gridlines and the contests-stance hatch. They are **colour values** and may therefore exist nowhere but `tokens.css`. C12 pins the hatch's single geometry; A3 writes that geometry, not a second token.

**`styles/obsidian-app.css` — the file A0 creates.** Imported `@import "./obsidian-app.css" layer(components);`, `.ob-` prefixed throughout, section banners matching `styles/obsidian.css`'s house style. **The sixteen sections, their titles and their owners are [C1](#c1--stylesobsidian-appcss-the-section-map); do not restate the map in this file's header comment and do not renumber it.** A0 emits every banner in the form:

```css
/* ============================================================
   7. DEFINE — LAYOUT & TRANSCRIPT                    [owner: A6]
   ============================================================ */
```

so a session opening the file finds its own section by number *and* by name, and an empty section is visibly reserved rather than missing.

The file's header comment carries exactly three standing facts and nothing else: (1) the section map lives in the plan at C1, and sections never shift; (2) **every `@keyframes` declared in this file is prefixed `ob-app-`** — a duplicate `@keyframes` name is silently *replaced*, not merged, and this file is imported after `obsidian.css` in the same layer, so an unprefixed `ob-pulse` here would kill the live dot on every route with no error; (3) **this file carries no `[data-theme]` selector and never redeclares a class defined in `obsidian.css`** — A0 moved the theme to `<html>` and the tokens to `:root`, so re-scoping would push every rule here to specificity 0,2,0 and silently outrank the landing recipes for no gain.

**§1 — `APP SHELL`, the only section A0 fills:**

```css
.ob-container-app    { width:100%; max-width:var(--ob-container-app);    margin-inline:auto; padding-inline:var(--ob-gutter) }
.ob-container-report { width:100%; max-width:var(--ob-container-report); margin-inline:auto; padding-inline:var(--ob-gutter) }
.ob-app-main         { flex: 1 }
main [id], #main     { scroll-margin-top: var(--ob-anchor-inset) }
```

- **`--ob-anchor-inset` is applied by that one rule and nothing else.** 136 = 56px condensed header + 48px sticky section index + 32px of air. Three phases each wrote a competing anchor rule at three values and the earliest one won on specificity every time (pitfalls §11); C2 settles it here. `#main` joins that rule's selector list rather than opening a second one, because the skip link's own target needs the identical inset and a second rule is precisely what C2 forbids. `.ob-skip` itself already exists in `obsidian.css` §12 and is not redeclared.
- **A0 declares no class no later phase emits.** Per [C15](#c15--the-shell-vocabulary-and-where-the-headers-height-is-held) the shell is `.ob-app` and its main is `.ob-app-main`; `.ob-run-shell` and `.ob-run-main` do not exist. A0 §1 defines only the structural shape — the flex column and `flex: 1` — plus the container widths, the anchor inset and the skip target. **A0 sets no `padding-block-start`:** the header's height is held by A4's `.ob-run-header-spacer`, and declaring both offsets every page by 144px instead of 72. The header's own chrome, the rail, the evidence button and the footer are **§5 (A4)**.
- **Three container widths, three content boxes**, all with `--ob-gutter` (40px) inline padding: `.ob-container` 1200 → **1120**, `.ob-container-app` 1360 → 1280, `.ob-container-report` 1080 → 1000. **A0 does not change `.ob-container`** — [C5](#c5--the-roadmap-week-model-librun-plants)'s week-axis ratios are measured inside its 1120px content box, and moving it silently retunes A12's exit test.

**§16 — `REDUCED MOTION`, seeded here, finalised by A15.** A0 writes the banner and an open `@media (prefers-reduced-motion: reduce) { }` block carrying one doc comment: *this is the only home for app-side reduced-motion rules; `styles/obsidian.css` §16 is not extended by any phase in this plan; every phase that ships a transition or an animation adds its end-state resolution here in the same session (Standing rule 16).* The universal `animation-duration/transition-duration` blanket already lives in `obsidian.css` §16 and, with `data-theme` now on `<html>`, already covers every app route — **it is not duplicated here**, because a second `!important` universal rule is noise that makes A15's completeness diff harder to read, not easier.

**`lib/content/app.ts`** — same header rule as `lib/content/landing.ts`, restated verbatim in the file's doc comment: *static app copy, deliberately not in `lib/fixtures/`, deliberately not routed through `lib/db/queries.ts`, imported directly — the one sanctioned exception.* Plain TS, `as const`, no Zod, no async. Banner-commented groups, seeded with:
- `APP_BRAND = { name: 'Groundwork' }`
- `META_SEPARATOR = ' · '` — **the middot, not ` // `.** The `//` form is Deep Canopy; every `MetaLine` in this build joins on this constant.
- `DEFINE = { title: 'What are you building?', briefHead: 'THE BRIEF', progress: { answeredLabel: 'answered', unknownLabel: 'unknown → open questions' } }` — `BriefProgress` composes `9 of 12 answered · 3 unknown → open questions` from counts; the numbers are never strings.
- `VALIDATE_CONSOLE = { h1: 'Reading the web about your idea.' }`
- `VALIDATE_REPORT = { h1: 'What the web already says.' }`
- `ROADMAP = { h1: 'What to do next.', lead: "Six things the web can't tell you, and the plan that depends on them." }`
- `SOURCES = { h1: 'Everything we checked.', lead: "47 excerpts passed the check. 18 didn't. All of it is here." }` — the two numerals are a **deliberate, commented duplication** of fixture volumes, because copy is design here and a computed sentence would read like a dashboard.
- `REPORT_SECTIONS`, `ROADMAP_SECTIONS`, `SOURCES_SECTIONS` — the numeral spine, as `{ index, label, id }` triples: `01 STATE OF THE EVIDENCE` / `02 WHAT WE FOUND` / `03 THE FIVE DIMENSIONS` / `04 WHO ELSE IS DOING THIS` / `05 WHAT SURPRISED US` / `06 WHAT WE COULDN'T ANSWER`; `01 OPEN QUESTIONS` / `02 BUILD ROADMAP`; `01 THE RUN` / `02 EVERYTHING WE CHECKED`. Define and the Console carry no spine and get no entry. The six report entries are the six `<h2>`s of [C13](#c13--ownership-of-things-two-phases-both-wanted)'s heading outline — if this list ever gains a seventh, A15's outline assertion is what will catch it.

Two things this file **must not** contain, both settled elsewhere:

- **No label map of any kind.** `DIMENSION_LABEL`, `DIMENSION_SHORT`, `STANCE_LABEL` and `DISCARD_REASON_LABEL` all live in `lib/schemas/evidence.ts` per [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), created in A1. R14 is *three vocabularies for the same five dimensions*; a fourth home in a copy file is how it comes back. Say so in the file's doc comment so the next session doesn't add one helpfully.
- **No step or question counts.** The roadmap's `4 BUILD STEPS · 1 TRIPWIRE` is derived from `planSpans` per [C5](#c5--the-roadmap-week-model-librun-plants) and rendered by A4, A11 and A15 from the data. `SOURCES`'s 47/18 are the one commented exception above, and they are the whole exception.

**D2 — the Groundwork rename, exact sites and strings:**

| File | From | To |
|---|---|---|
| `components/layout/wordmark.tsx` :11 | `IdeaBrief` | `Groundwork` |
| `components/layout/wordmark.tsx` :4 (doc) | `The IdeaBrief brand mark` | `The Groundwork brand mark` |
| `components/layout/logomark.tsx` :2 (doc) | `The IdeaBrief mark` | `The Groundwork mark` |
| `app/style-guide/page.tsx` :14 | `'Style Guide — IdeaBrief'` | `'Style Guide — Groundwork'` |
| `components/style-guide/sections/foundations.tsx` :71 | specimen word `IdeaBrief` | `Groundwork` |

`app/layout.tsx` metadata becomes `title: { default: 'Groundwork — from a hunch to something you can defend', template: '%s — Groundwork' }` plus `applicationName: 'Groundwork'`. **No `openGraph` block — R18 belongs to A15**, and adding a half one now guarantees it never gets finished. `Wordmark` keeps its Deep Canopy `.run-shell-wordmark` class; A4 replaces it.

**The ritual (Standing rule 4).** Run all four after every stylesheet edit in this phase, and paste the output into the build log:
```bash
grep -ohE 'var\(--ob-[a-z0-9-]+' styles/*.css | sed 's/var(//' | sort -u > /tmp/ob-used.txt
grep -ohE '^\s*--ob-[a-z0-9-]+' styles/tokens.css | tr -d ' :' | sort -u > /tmp/ob-defined.txt
comm -23 /tmp/ob-used.txt /tmp/ob-defined.txt          # must print nothing
grep -ohE 'animation:[^;]*' styles/*.css | grep -oE '\bob-[a-z-]+' | sort -u   # ⊆ next line
grep -ohE '@keyframes[[:space:]]+[a-z0-9-]+' styles/*.css | awk '{print $2}' | sort -u
grep -oE '@keyframes[[:space:]]+[a-z0-9-]+' styles/obsidian-app.css | awk '{print $2}' \
  | grep -v '^ob-app-' || echo 'C1 keyframes prefix: clean'   # must print the clean line
```
And record the R2/R3/R4 baseline — twelve classes shipped components emit that no stylesheet defines, so each later phase can prove it closed its own:
```bash
for c in timeline-node timeline-node--accent timeline-node--pulse card--pulse \
         composer composer--streaming message-text message-text--ai message-text--user \
         query-glyph finding-card--entering report-cross-fade; do
  printf '%-26s %s\n' "$c" "$(grep -c "\.$c" styles/*.css | paste -sd+ - | bc)"; done
```
All twelve read `0` today. A0 changes none of them.

**`tailwind.config.ts` — confirm, don't edit.** There is no `colors` key and none is added. `content` is `['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']` and **`lib/` is deliberately absent**: a Tailwind class written in `lib/content/app.ts` would never be scanned and would silently do nothing. **Copy files carry strings, never class names.** If a copy entry seems to need a class, the layout decision is in the wrong file.

**Not built in A0:** no component is restyled beyond the five rename strings. No figure, no chrome, no page body, no schema, no fixture. **§2–§15 of `obsidian-app.css` stay empty banners.** The Deep Canopy `:root` block and `styles/components.css` are **not** deleted — that is A15, and deleting them here strands four page bodies with no styling at all.

**Exit test:** with `next dev` running, drive the **Playwright MCP** at 1440×900 and then at 1280.

1. **Typeface and canvas.** On `/`, read `getComputedStyle(document.body).fontFamily` — must contain `Geist`, must *not* contain `Inter`. Same on `document.querySelector('h1')`, plus `fontWeight === '400'` (R22 closed). `getComputedStyle(document.documentElement).backgroundColor` must be `rgb(10, 10, 11)` and `getComputedStyle(document.body).backgroundColor` must be `rgba(0, 0, 0, 0)` (R23 closed).
2. **The measured cascade check (R1).** On `/r/sms-rebooking-4f2a/validate`, evaluate a probe — append `<div class="section-label mb-0">x</div>` to `document.body`, read `getComputedStyle(el).marginBottom`, remove it. It must read `0px`; `16px` means the `layer(components)` import didn't land. Run the same probe with `<div class="ob-body mt-8">` and confirm `marginTop: 32px` as the control.
3. **Tokens.** Read `getComputedStyle(document.documentElement).getPropertyValue('--ob-anchor-inset').trim()` — exactly `136px` — and repeat for the other nine names in C2, asserting each value. Any empty string means a token that later phases will silently void a whole declaration on.
4. **The one anchor rule.** On `/r/sms-rebooking-4f2a/validate`, `getComputedStyle(document.querySelector('main [id]')).scrollMarginTop` must be `136px`, and so must `getComputedStyle(document.getElementById('main')).scrollMarginTop`. Then confirm the rule is unique: `[...document.styleSheets].flatMap(s => [...s.cssRules]).filter(r => r.style && r.style.scrollMarginTop).length === 1`.
5. **Container geometry.** Probe `.ob-container-app`, `.ob-container-report` and `.ob-container` in turn, reading `getBoundingClientRect().width` minus `paddingLeft + paddingRight`: **1280 · 1000 · 1120**. The last is the number C5's axis ratios are measured against and must not have moved.
6. **The skeleton.** `grep -c '^   [0-9]\+\. ' styles/obsidian-app.css` returns 16, the titles match C1 in order, and §2–§15 contain no declaration blocks.
7. **Survival.** Walk all four run routes plus `/style-guide` and `/`, screenshotting each at both widths: no overlapping text, no collapsed container, every control still hit-testable. Confirm the wordmark reads `Groundwork` on `/r/sms-rebooking-4f2a/define` and the tab title on `/style-guide` reads `Style Guide — Groundwork`.
8. Per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test` (39/39, unchanged — A0 touches no test), `npm run build`, and `browser_console_messages level:"error"` returning zero on every route **at 1440 and at 1280**.

---

## A1 — Data layer: schemas, fixtures, derivations

**Goal:** every field, fixture record and pure derivation that A3–A13 render exists, is Zod-validated at the seam, and has a unit test. When this phase is done, no later phase invents a number.

**This is the phase most likely to be rushed and least survivable if it is.** Everything from A3 onward reads from what this phase produces. Zod here is **v3**, not v4 — `z.enum`, `.refine`, `.superRefine`, no `z.strictObject`.

**This phase is the owner of five shared artefacts that are specified in the plan's spine, not here.** Build them to the contract, verbatim, and do not re-derive them from the prose in this section: the four vocabulary maps ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)) · `lib/brief-state.ts` ([C4](#c4--the-brief-state-libbrief-statets)) · the roadmap week model ([C5](#c5--the-roadmap-week-model-librun-plants)) · `OpenQuestion`'s priority, brief link and dependency edges ([C6](#c6--openquestion-priority-brief-link-fan-out)) · `CapabilityMatrix`'s schema ([C7](#c7--capabilitymatrix)) · the discard record ([C9](#c9--discards)) · the analytics API ([C10](#c10--the-analytics-api-frozen-in-a1)) · every figure number ([C11](#c11--figure-numbers-settled)).

**Read:** the plan's [Shared contracts](#shared-contracts) in full, `WebsiteLayoutDesc/README.md` (glossary only), the [Naming contract](#the-naming-contract) and [Known rot](#known-rot). Do **not** read `WebsiteLayoutDesc/02-visual-direction.md` — nothing visual happens here.

**Build:**
- `lib/schemas/evidence.ts` — `FactSchema`, `facts` on `FindingSchema`, `DiscardReasonSchema`, `DiscardedFindingSchema`, `DiscardedSchema`, and the four label maps of C3; **delete** `discard_reason` from `FindingSchema`.
- `lib/schemas/report.ts` — the capability vocabulary and `capabilities` on `Competitor`, `idea_capabilities` on `Report` (both per C7), `SurpriseSchema`, structured `unanswered`; **delete** `label` from `DimensionSectionSchema` and add `dimension`.
- `lib/schemas/roadmap.ts` — `id`, `kind`, `start_week`, `duration_weeks` on `RoadmapStep` and the deletion of `estimate` (C5); `priority`, `effort`, `brief_field` on `OpenQuestion` (C6); `sample_size` in `survey`; three new refinements.
- `lib/schemas/brief.ts` — export `BriefFieldKeySchema`.
- `lib/schemas/run.ts` — `finding.discarded` event carries the record.
- `lib/fixtures/queries.ts` — **new.** `RUN_QUERIES`, the 19 strings, lifted out of `run-events.ts`.
- `lib/fixtures/discarded.ts` — **new.** 18 `DiscardedFinding` records.
- `lib/fixtures/evidence.ts` — `facts` on 20 findings.
- `lib/fixtures/report.ts` — capabilities, cited surprises, structured unanswered, `dimension` added, `label` removed.
- `lib/fixtures/roadmap.ts` — step ids, kinds, week spans, `estimate` removed, question priority/effort/`brief_field`, Q04's survey, and the C6 dependency edges.
- `lib/fixtures/run-events.ts` — the D8 re-timing.
- `lib/run-stream-reducer.ts` — accumulate discarded records.
- `lib/run-summary.ts` — three new fields; discards from the fixture.
- `lib/brief-state.ts` — **new.** D10's reducer, resolver and storage, to C4's signature.
- `lib/analytics/evidence-stats.ts`, `lib/analytics/report-figures.ts`, `lib/run-plan.ts` — **new.** All pure, all to C10's signatures.
- `lib/db/queries.ts` — `getDiscarded`.
- `lib/hooks/use-run-stream.ts` — the window constant.
- **R14 sweep:** `components/validate/sources-list.tsx`, `components/validate/evidence/finding-card.tsx`, `components/validate/evidence/evidence-drawer.tsx`, `components/validate/report/dimension-section.tsx` — delete the four competing dimension vocabularies, import the one.
- **The typecheck tail** — four one-to-three-line edits made *only* so `npx tsc --noEmit` stays clean under the schema changes; every one of these components is rewritten properly later and A1 does no design work in them: `components/roadmap/roadmap-step.tsx:41` (drop the `step.estimate` span — A12), `components/validate/report/surprise-panel.tsx` (retype to `Surprise[]`, render `headline` + `detail.text` — A9), `components/validate/report/unanswered-section.tsx` (retype to the structured item, render `question` — A9), and any prop threading in `components/validate/report/report.tsx` that follows.
- `tests/unit/` — six new files, four extended.

**Notes — schemas, exactly:**

- **`Fact`.** The device that gets a number out of a sentence and into a `NumberCallout` / `ValueLadder` / `GapBar`.
  ```ts
  export const FactKindSchema = z.enum(['money', 'rate', 'count', 'duration']);
  export const FactSchema = z.object({
    value: z.number().finite(),
    unit: z.string().min(1),
    label: z.string().min(1),
    kind: FactKindSchema,
    /** Optional figure grouping key — several findings' facts drawn on one axis. */
    series: z.string().min(1).optional(),
    /** The backend's own judgement that this number is worth pulling out of the sentence. */
    callout: z.boolean().optional(),
  }).refine((f) => (f.unit === '%' ? f.value >= 0 && f.value <= 100 : true), {
    message: 'A percentage fact must be between 0 and 100.',
  });
  ```
  Sanctioned `unit` strings, closed by convention and asserted in the fixture: `'USD'` · `'USD/mo'` · `'%'` · `'min'` · `'min/day'` · `'s'` · `'weeks'` · `'practices'` · `'names'` · `'tools'` · `'add-ons'` · `'events/min'`. `FindingSchema` gains `facts: z.array(FactSchema).min(1).optional()`.
- **Fact assignment — 20 findings, 28 facts.** Every number the contract lists as "buried in prose", pinned to the finding whose excerpt actually contains it. The `✦` column marks the nine findings whose facts are `callout: true`:

  | Finding | Facts (`value` `unit` — `label`) | `series` | ✦ |
  |---|---|---|---|
  | EV_01 | `20 min` — Per manual call-down | — | |
  | EV_02 | `14.2 %` — Same-week cancellation rate | — | ✦ |
  | EV_03 | `180 USD` — Lost production per empty chair-hour | — | |
  | EV_07 | `16.8 %` — No-show rate, no automated reminders · `9.1 %` — with them | `no_show` | ✦ |
  | EV_08 | `45 min/day` — Front-desk rebooking calls, low · `90 min/day` — high | `desk_time` | |
  | EV_09 | `18 %` — Patients who prefer a phone call | — | ✦ |
  | EV_13 | `15 names` — Waitlist length, low · `20 names` — high | `waitlist` | |
  | EV_19 | `0 tools` — Rebook end-to-end · `9 tools` — Reviewed | `coverage` | ✦ |
  | EV_20 | `30 s` — Webhook latency after a status change | — | ✦ |
  | EV_24 | `14 add-ons` — Already listed on one PMS marketplace | — | ✦ |
  | EV_26 | `150 USD/mo` — Willingness to pay, low · `250 USD/mo` — high | `price_ladder` | |
  | EV_31 | `6000000 USD` — Series A raised by the largest adjacent competitor | — | |
  | EV_32 | `130000 practices` — Addressable market · `70 %` — Independent or small-group | `market` | ✦ |
  | EV_33 | `299 USD/mo` — ChairSync, per location | `price_ladder` | |
  | EV_34 | `199 USD/mo` — Recall360 starter, billed annually | `price_ladder` | |
  | EV_41 | `2000 USD/mo` — Lost production, low · `4000 USD/mo` — high | `roi_gap` | |
  | EV_42 | `300 USD/mo` — Owner sign-off threshold | `price_ladder` | |
  | EV_43 | `20 %` — PMS marketplace revenue share | — | |
  | EV_46 | `2 weeks` — Partner agreement, low · `3 weeks` — high | `partner` | ✦ |
  | EV_47 | `100 events/min` — Webhook rate limit per integration | — | ✦ |

  The nine flagged findings are exactly C11's nine number callouts, and the flag is what keeps that list out of a component. **The eleven unflagged findings are not weaker numbers** — they are already carried by another mark or by prose: `price_ladder` and `roi_gap` belong to `ValueLadder` and `GapBar`, `desk_time` and `waitlist` are prose magnitudes, EV_03's `$180` is the per-hour figure the ROI sentence is built on, and EV_31's `$6M` is a competitor fact `CompetitorCard` prints. Nine callouts across a six-section report is roughly one every one-and-a-half sections; flagging fifteen would spend the device.

  **The contract's "$6M Series A competitor that shut down [31]" conflates two findings and the fixture must not.** EV_31 is ChairSync's live $6M raise; EV_25 is the 2022 rebooking startup that went dark and carries **no** fact — there is no number in its excerpt and inventing one would break "nothing is invented to fill a field". C11 pins the surprise that describes the shutdown to `[25][29]` for exactly this reason. `EV_09`'s `18 %` is the report's only quantified counter-signal and the one flagged fact whose finding has `stance: 'challenges'`; A10 renders it inside the contested band, not buried.
- **`DiscardedFinding` — D15's trust claim, made into records.** The schema, the four-value `discard_reason` enum, the reason distribution (7/5/3/3), the dimension distribution (5/4/3/4/2), the absence of a `text` field and the removal of `discard_reason` from `FindingSchema` are all fixed by [C9](#c9--discards). A1 builds exactly that, plus `DiscardedSchema = z.array(DiscardedFindingSchema).length(18)` and ids `DS_01`–`DS_18`.

  What A1 owns on top of C9, and must assert at module scope in the style `run-events.ts` already uses (`if (…) throw new Error(…)`, not in Zod):
  - **Every `attempted_query` is one of the 19 strings in `RUN_QUERIES`.** A discard whose query was never run is a record about nothing. This is also why `attempted_query` exists at all: it is the only field that answers *what were we even looking for*, and C9 puts discard rows in the drawer, which is where it reads.
  - **Every `source_url` is a domain that appears nowhere in `evidenceFixture`, except three deliberate collisions** — `capterra-like.example`, `smallpracticeforum.example`, `openpms.example` — so the explorer's domain facet shows at least one domain with both kept and discarded rows. Without the collisions the facet reads as two disjoint corpora, which is a lie about how a real run behaves.
  - `PRACTICAL 2` discards against `PRACTICAL 2` kept is the honest shape of a thin dimension and is the number A13's facet counts are built on. It is not padded to make the row look busier.
- **The four vocabulary maps — R14, closed for good.** `DIMENSION_LABEL`, `DIMENSION_SHORT`, `STANCE_LABEL` and `DISCARD_REASON_LABEL` go in `lib/schemas/evidence.ts`, beside the schema, matching the `ROADMAP_PHASE_LABEL` precedent already set in `lib/schemas/roadmap.ts`. **Type all four from [C3](#c3--vocabulary-maps-one-home-libschemasevidencets) verbatim, including `PRACTICAL: 'Practical realities'` long and `'Practical'` short.** Then the sweep:
  - delete `DIMENSION_CARD_LABEL` from `components/validate/evidence/finding-card.tsx`;
  - delete `DIMENSION_FILTER_LABEL` from `components/validate/sources-list.tsx`;
  - replace the raw `openFinding.dimension` passed to `MetaLine` in `components/validate/evidence/evidence-drawer.tsx` with `DIMENSION_LABEL[openFinding.dimension]`;
  - delete `label` from `DimensionSectionSchema`, add `dimension: DimensionSchema`, refine that each entry's `dimension` equals its key in `ReportDimensionsSchema`, drop the field from all five fixture sections, and change `components/validate/report/dimension-section.tsx:38` and `:43` to read `DIMENSION_LABEL[data.dimension]`. The `dimension` field is what makes every consumer able to reach the map without threading the object key, and it is why the fourth vocabulary cannot come back.

  **Uppercasing for the mono meta layer is `text-transform: uppercase` in CSS and never a second string** — that rule is what killed the third vocabulary and it is the reason there are two dimension maps here, not three. There is no `lib/dimensions.ts`, no label map in `lib/content/app.ts`, and no inline stance-word map in any component; C3 says so and A1 is the phase that makes it true.
- **Report — `CapabilityMatrix` (D6).** Schema exactly as [C7](#c7--capabilitymatrix) states: five keys, `z.array(CapabilitySchema).length(5)` on `Competitor`, `citations: z.array(number)` per cell refined so `level !== 'unknown'` implies at least one citation, and `Report.idea_capabilities: z.array(CapabilityKeySchema)`. A1 adds the display map beside it:
  ```ts
  export const CAPABILITY_LABEL: Record<CapabilityKey, string> = {
    reminders: 'Reminder texts', recall: 'Recall campaigns', waitlist: 'Waitlist',
    auto_rebook: 'Automatic rebooking on cancellation', pms_integration: 'PMS integration',
  };
  ```
  Fixture values, the settled set:

  | | reminders | recall | waitlist | auto_rebook | pms_integration |
  |---|---|---|---|---|---|
  | ChairSync | `yes` [15] | `yes` [15] | `no` [15] | `no` [15][19] | `unknown` — |
  | Recall360 | `yes` [16][23] | `yes` [18][23] | `partial` [16] | `no` [16][19] | `unknown` — |
  | FrontDeskPro | `partial` [17] | `unknown` — | `unknown` — | `no` [19] | `yes` [17][24] |

  `idea_capabilities: ['waitlist', 'auto_rebook', 'pms_integration']`.

  **Why the schema is shaped this way, and why A1 must not "simplify" it back.** The refinement is the schema stating the trust rule out loud — a filled cell with no source is a bug, not a rendering choice — while an `unknown` cell legally carries none, because *we didn't find out* is a real answer and a citation for it would be fake. And the idea is a fourth **column**, not a row: headed `THIS IDEA`, cells reading `CLAIMED` or `—`, no square marks at all, under the line *"The last column is your brief, not a finding. Nothing in it has been checked."* An idea row drawn first in the same marks as the competitors is a comparison chart that says *we win* from a column with no evidence behind it. C7 calls that register split the only thing standing between this figure and a verdict; the array-of-keys shape for `idea_capabilities` is what enforces it, because there is no `level` to draw a mark from.
- **Report — `EvidenceState` (D7) is derived, not stored.** Strong / thin / contested are pure functions of counts, confidence and stance, all already validated. Storing them would let the band drift from the numbers printed beside it, and a stored editorial sentence is a verdict wearing a description's clothes. The band's static framing copy lives in `lib/content/app.ts`; the three lists come from `deriveEvidenceState`. **No `ReportSchema` field is added for D7.**
- **Report — `surprises` becomes cited, `unanswered` becomes structured.**
  ```ts
  export const SurpriseSchema = z.object({ headline: z.string().min(1).max(80), detail: CitedTextSchema });
  surprises: z.array(SurpriseSchema).min(2).max(3),
  unanswered: z.array(z.object({ question: z.string().min(1), why_unanswered: z.string().min(1) })).min(1),
  ```
  The three fixture surprises, headline and detail, with the citations [C11](#c11--figure-numbers-settled) settles — `[42][44]` · `[25][29]` · `[35][36]`:
  1. `The owner signs off, not the office manager.` — *"Several threads mention the practice owner has to approve anything recurring, even at solo-owner shops where an office manager runs daily operations [44]. Above roughly $300 a month it stops being the office manager's decision at all [42]."*
  2. `Someone already tried this wedge and shut down.` — *"A rebooking-specific startup listed in a 2022 directory no longer has an active website [25], and at least one practice remembers being pitched something similar that never shipped [29]."*
  3. `The objection is the contract, not the price.` — *"Pricing resistance was almost entirely about contract length and per-message billing rather than the flat monthly fee [35][36]. A 12-month minimum almost stopped one practice signing with a competitor [36]."*

  **`[25][29]`, never `[25][31]`.** EV_31 is ChairSync's live $6M raise and ChairSync is priced two sections earlier in the same report; pairing it with a shutdown claim makes the fixture assert that a still-trading competitor has closed. `CitedTextSchema.refine()` passes it happily because both numbers resolve — which is exactly why the fixture, not the schema, is where this has to be got right. EV_29 is the practice that remembers a pitch that never shipped, and it is what the sentence actually says.

  §06 says what we couldn't answer *and why the web couldn't say*, which is the difference between a gap and an omission. Exact `why_unanswered` strings: `'No public source lists PMS market share by practice size; every figure found was vendor-published.'` · `'Every opt-in rate found was measured at practices already sending reminder texts.'` · `'Reviews quote reminder open rates, never a rebooking-offer conversion rate.'`
- **Roadmap — D13 and D14.** The week model is [C5](#c5--the-roadmap-week-model-librun-plants): `kind`, nullable `start_week` / `duration_weeks`, `duration_weeks: null` meaning open-ended, `estimate` **deleted**, and the S01–S05 span table. Do not restate the horizon, the spans or the API here; type them from C5. A1 adds around it:
  ```ts
  id: z.string().regex(/^S\d{2}$/),   // stable key for PlanBar / DependencyChip
  ```
  and three new `RoadmapSchema` refinements: **(a)** step ids unique; **(b)** exactly one step has `kind: 'tripwire'`, and that step has **neither** `start_week` nor `duration_weeks` — *it is a tripwire, not a phase, and giving it a bar is the exact mistake D13 exists to undo*; **(c)** every `build` step has a `start_week`, and `start_week` is non-decreasing in array order. Note the asymmetry in (c) and keep it: a build step **must** have a start and **may** have a null duration, which is what makes S04's dissolving right edge legal instead of a schema violation.

  `estimate`'s deletion is the reason `components/roadmap/roadmap-step.tsx:41` is in the typecheck tail. The four fixture strings go with it — `'ongoing, demand-driven'` is now expressed as `duration_weeks: null`, which is the same claim in a form a bar can draw.

  `OpenQuestion` gains `priority`, `effort` and `brief_field` per [C6](#c6--openquestion-priority-brief-link-fan-out): an integer rank (**Q06 1 · Q01 2 · Q04 3 · Q02 4 · Q05 5 · Q03 6**), `brief_field: BriefFieldKeySchema.nullable()` in **`lib/schemas/roadmap.ts`** — there is no `lib/schemas/open-question.ts` and no phase creates one — and the dependency edge list **S01 ← Q01, Q06 · S02 ← Q02, Q04, Q05 · S03 ← Q06 · S04 ← Q03, Q06 · S05 ← Q01, Q04**, ten edges, replacing whatever the fixture carries today. `effort` is A1's, and it is the enum: `z.enum(['hours','days','weeks'])`, with **Q01** days · **Q02** days · **Q03** weeks · **Q04** weeks · **Q05** weeks · **Q06** hours. `brief_field` values: **Q01** `who_decides` · **Q02** `what_makes_this_different` · **Q03** `how_customers_find_it` · **Q04, Q05, Q06** `null` — three of six questions trace back to a brief field, which is what makes D10's promotion visible without making it uniform.

  Those ten edges produce C6's fan-out — `Q01 2 · Q02 1 · Q03 1 · Q04 2 · Q05 1 · Q06 3` — and sorting by fan-out descending with ties broken by rank reproduces the priority order exactly. That agreement is not a coincidence to be preserved by hand; it is why `FanOutMeter`'s caption and the card order can be read off the same data with no second source. **A number in any phase that disagrees with C6's fan-out is wrong, including one derived from an older edge list.**

  `survey` gains a required `sample_size: z.string().min(1)`, and Q04's survey grows to three questions so `SurveyBlock` has three rows: the existing two plus `'If not, what would change your mind?'`; `sample_size: '~200 patients over 4 weeks at one practice.'`; note unchanged.
- **RunEvent re-timing (D8).** The old generator front-loaded 16.3s of query chatter before the first finding and then absorbed ~40s of slack into a single `complete` delay — a dead tail on a screen whose whole job is to feel alive. Replace the constants and the emission order:
  ```ts
  const QUERY_START_DELAY = 90;
  const QUERY_DONE_DELAY  = 130;
  const FETCH_PHASE_DELAY = 220;
  const VERIFY_PHASE_DELAY = 180;
  const VERIFY_DELAY_CYCLE = [620, 700, 780, 860, 940, 660, 720];   // 7 values, mean 754ms
  const DISCARD_DELAY = 200;
  const WRITING_PHASE_DELAY = 420;
  const COMPLETE_DELAY = 900;
  const DISCARD_AFTER_VERIFIED = [2,5,8,11,14,17,20,22,25,27,30,32,34,36,38,41,43,45];
  const INTERLEAVED_QUERY_AFTER_VERIFIED = [1,3,5,7,9,11];
  ```
  Order: `phase searching` (0) → queries 0–5 → `phase fetching` (220) → queries 6–12 → `phase verifying` (180) → the 47 findings on the cycle, with the remaining six query pairs (13–18) emitted after verified findings 1/3/5/7/9/11 and the 18 discards after the verified indices listed → `phase writing` (420) → `complete` (900). Checkpoints, which the test asserts: **`phase verifying` at t=3,260ms · first `finding.verified` at t=3,880ms · `runEventsTotalMs` ≈ 45,080ms.** No discard lands after finding 45, so the last four seconds are findings and the writing beat, not a counter ticking alone.

  `finding.discarded` gains the **whole record**: `{ type: 'finding.discarded', delayMs, count, discarded: DiscardedFindingSchema }`, and the 18 events carry `DS_01`–`DS_18` in order. It carries the record rather than a `{ domain, reason }` pair because a pair is a second, lossier shape for data that already exists, and the console can derive both from the record — `formatDomain(record.source_url)` and `DISCARD_REASON_LABEL[record.discard_reason]`. **A8 must not introduce the pair.** `count` stays the running total the client displays and never accumulates. `lib/run-stream-reducer.ts` gains `discarded: DiscardedFinding[]` (newest-first) alongside the existing `discardedCount`; **A8 owns whether the console renders them.**

  `isRunStreamActive`'s window stops being the implicit 75s budget: export `export const RUN_STREAM_WINDOW_MS = runEventsTotalMs + 4_000;` from `lib/hooks/use-run-stream.ts` (≈49s) and compare against that, so a visitor who lands at t=44.9s isn't dropped mid-cross-fade. The documented reload-restarts-from-zero simplification stands; A8 decides whether to change it.
- **`lib/brief-state.ts` (D10) — the mechanic R5 and R6 both live in.** **Ships complete in A1, to the exact signature in [C4](#c4--the-brief-state-libbrief-statets)** — `BriefPatch` with the `v` discriminator, its three key arrays, its `values` map and `approvedAt`, the five `BriefAction` variants, and the nine exported functions. A7 wires `useBriefState` over it and changes nothing about the module surface. Do not type this API from memory; it is the one module in the build that two phases both touch.

  What A1 owns around C4's signature:
  - `BRIEF_STORAGE_PREFIX = 'sv.brief.'`, and **there is exactly one key: `sv.brief.<slug>`.** The edited values are a field *on the patch* (`values: Partial<Record<BriefFieldKey, string | string[]>>`, [C4](#c4--the-brief-state-libbrief-statets)), not a second store — a `resolveBrief(base, patch)` that has to reach a store cannot, because a patch carries no slug. Ship no `readBriefValues` / `writeBriefValues`. `readBriefPatch` discards a payload whose `v !== 1` rather than migrating it, and a payload missing `values` is malformed and discarded with the rest.
  - `resolveBrief(base, patch)` applies **status** transitions only: a key in `patch.unknown` becomes `{ status: 'unknown', value: '' }` (or `[]` for the three list fields); a key in `patch.revealed` that is still `pending` becomes `filled`. Its output still passes `BriefSchema`, and a unit test says so. **There is exactly one function that resolves a field's displayed status, and it is `resolveBrief`.** R6 exists because `valueFor()` short-circuited `one_liner` past the override map; a single resolver makes that class of bug unrepresentable.
  - `unknownKeys`, `answeredCount`, `unansweredCount` and `coreFilled` all read `resolveBrief(base, patch)` and never the raw base. `coreFilled` is D12's gate and is the only one with an opinion baked in: the core is `one_liner · product · customer · problem · what_makes_this_different · first_version_scope`, six of the twelve, and it is true when each is `filled` **or** `unknown` — "I don't know" is an answer and is never a blocker.
  - **Everything except the four storage functions is pure and node-testable**; those four are the entire seam, so swapping them for `GET`/`PATCH /api/brief/<slug>` is a four-function change and touches no component.
- **`lib/analytics/evidence-stats.ts` and `lib/analytics/report-figures.ts`, `lib/run-plan.ts`.** **The exported surface is frozen in [C10](#c10--the-analytics-api-frozen-in-a1)** — sixteen functions, those names, those return shapes. A1 writes them once; A3, A10, A11, A12 and A13 import them and add nothing with a new spelling. If a figure later needs a different return shape, C10's signature and its test change here; a second name does not appear. Anything C10 does not list (`factsFor`, `factsInSeries`, the series-form table below) stays **module-private**.

  The return types C10 names but does not spell out, fixed here:
  ```ts
  export type LadderRung =
    | { form: 'band';      low: number; high: number; unit: string; label: string; citations: number[] }
    | { form: 'point';     value: number;             unit: string; label: string; citations: number[] }
    | { form: 'threshold'; value: number;             unit: string; label: string; citations: number[] };
  export type CalloutForm = 'single' | 'band' | 'transition' | 'of' | 'compound';
  export interface CalloutModel { findingId: string; citation: number; form: CalloutForm; facts: Fact[]; label: string }
  export interface MatrixModel {
    capabilities: CapabilityKey[];
    competitors: Array<{ name: string; cells: Array<{ key: CapabilityKey; level: CapabilityLevel; citations: number[] }> }>;
    idea: Array<{ key: CapabilityKey; claimed: boolean }>;   // no `level`, deliberately — C7
    citations: number[];                                     // the footer set, ascending
  }
  export interface PlanSpan { step: RoadmapStep; startWeek: number; endWeek: number | null; openEnded: boolean }
  ```
  `fanOut(roadmap): Record<string, RoadmapPhase[]>` — question id → **the steps naming it**, in axis order, **tripwire included**, because the tripwire genuinely does depend on the question. The shape is fixed by [C10](#c10--the-analytics-api-frozen-in-a1) and returns the edges rather than a count, because A11 needs to partition them with `isOnAxis`; a count is `.length`. There is no `fanOutMax` — the meter's denominator is `Math.max(...Object.values(fanOut(roadmap)).map(v => v.length))`, which is 3, and the caption's denominator is the step count, which is 5: `Q06 governs 3 of 5`, per [C5](#c5--the-roadmap-week-model-librun-plants)'s `4 BUILD STEPS · 1 TRIPWIRE`.

  Derivation notes, one per function that has one:
  - `stanceOverall` / `stanceByDimension` return their third key as **`contests`**, not `challenges` — C10's spelling, and the one place the schema value `challenges` is translated into the display word. `STANCE_LABEL` (C3) is the map; nothing downstream translates it again. Fixture totals: **25 supports · 15 neutral · 7 contests**, and by dimension the contests are `PROBLEM 2 · WHAT_EXISTS 1 · DEMAND_SIGNALS 1 · MONEY 3 · PRACTICAL 0`.
  - `domainConcentration` counts **findings, not unique URLs** — the question is how much of the evidence comes from how few places — uses `formatDomain` from `lib/format.ts`, and sorts by count then domain name so ties are deterministic. On the fixture: **29 domains**, top three `capterra-like.example` 5, `billingtalk.example` 3, `smallpracticeforum.example` 3, i.e. 11 of 47 from three places. No `share` field and no `limit` argument — the figure takes its own head and tail (A13).
  - `recencyTicks(evidence, dimension?)` returns one tick per finding, ascending by date, each carrying `cited` from `citedFindingIds(report)`. On the fixture the span runs **2025-01-08** (EV_10) to **2025-12-04** (EV_44) across 47 ticks. The strip computes positions from the returned min and max; there is no stored offset, because an offset baked into the data cannot be re-scoped when the strip is drawn per dimension.
  - `citationCoverage(report, evidence)` returns two `Set<number>`s of citation numbers: **24 cited, 23 uncited, summing to 47.** Those 23 are `EvidenceRail`'s entire reason to exist — findings the run verified and the report never quotes — and the number is asserted here so no page recounts it.
  - `deriveEvidenceState(report, evidence)` returns three `Dimension[]`. **Its thresholds are stated in [C10](#c10--the-analytics-api-frozen-in-a1) and nowhere else — not here, not in A9.** On this fixture they give **strong** `PROBLEM (14)`, `WHAT_EXISTS (11)`, `MONEY (13)`; **thin** `PRACTICAL (2)`; **contested** `PROBLEM (2 of 14)`, `MONEY (3 of 13)`. `DEMAND_SIGNALS` lands in **none** of the three groups, at 1 contest in 7 findings — `0.143`, six thousandths under the `0.15` ratio threshold. That edge is deliberate, the test pins it, and it must not be "rounded up" or patched: seven findings at mixed confidence with one challenger is genuinely neither strong nor thin, and a band that forces all five dimensions into a bucket is a scorecard. `DimensionStrip` (A10) shows all five regardless. A dimension may legitimately appear in two lists — `PROBLEM` and `MONEY` do — and that is the honest result, not a bug to suppress.
  - `priceLadder(evidence)` reads the `price_ladder` series and returns **four rungs**, exactly [C11](#c11--figure-numbers-settled): the **band** `$150–250` "what practices say they'd pay" `[26]` · the **point** `$199/mo` Recall360 `[34]` · the **point** `$299/mo` ChairSync `[33]` · the dashed **threshold** at `~$300/mo` "owner sign-off" `[42]`. EV_26's two facts collapse into one band rung because they are one claim with two ends; drawing them as two points would put a willingness-to-pay figure on the same footing as a published price. **This is the strongest single figure in the report: the stated willingness-to-pay band straddles both competitors and stops one dollar under the owner-approval ceiling.**
  - `roiGap(evidence)` reads the `roi_gap` series and returns `lostLow 2000 · lostHigh 4000` `[41]` against `costLow 199 · costHigh 299` `[34][33]`, with `ratioLow ≈ 10.05` and `ratioHigh ≈ 20.10` — the `10–20×` C11 settles, rounded for display by the component and never by the function. **Both ratios divide by the same denominator, `costLow`**, because a band divided by a band produces four ratios and only one of them is a sentence; the bar prints `$2,000–4,000/mo` against `$199–299/mo` in full with both citations, so a reader can do the other three divisions themselves. **EV_26 is a willingness to pay and is never used as a tool price** — that substitution is what produced the `$3,000 vs $200, 15×` figure the audit found, and there is no finding anywhere in the corpus containing either number.
  - `numberCallouts(evidence, dimension)` returns the `callout: true` facts belonging to findings in that dimension, grouped by `series` and in fixture order — **nine across the five dimensions**, exactly C11's list. The `form` comes from one private table keyed by series, not from inspecting values: `no_show → 'transition'`, `coverage → 'of'`, `market → 'compound'`, `partner → 'band'`, everything unseriesed → `'single'`; the `price_ladder` and `roi_gap` series are excluded outright because they belong to their own marks. **`emphasis` is not a field on this model** — it is a `NumberCallout` prop, and C11 spends it exactly once, on `0 of 9` `[19]`. Spending it twice spends it.
  - `runFunnel(summary)` returns `19 QUERIES · 31 PAGES · 47 VERIFIED · 18 DISCARDED` with `share = value / max(values)`, per [C8](#c8--runfunnel). **The segments are proportional to the largest, not percentages of a whole — nothing here sums to anything, and `47 / 65` looks like a pass rate, which this product does not publish.** Say that in the function's doc comment, because someone will try to normalise it, and two phases already did.
  - `lib/run-plan.ts` exports `planSpans` · `planHorizon` · `isOnAxis` · `fanOut` and nothing else. `planHorizon` returns **12**. `isOnAxis(step)` is `step.kind === 'build'`, which is the single place D13's "the tripwire is not a phase" becomes code. **No `buildRunPlan`, no `planLanes`, no `leftPct`/`widthPct`** — pixel and percentage geometry belongs to the CSS grid A12 builds, and a percentage returned from a pure module is a layout decision smuggled into the data layer.
- **`lib/run-summary.ts`** — `RunSummary` gains `domains_count`, `earliest_source_date`, `latest_source_date`; `computeRunSummary(evidence, events, discarded)` takes the discard fixture and sets `discarded_count = discarded.length`, asserting it equals the last `finding.discarded` event's `count`. Fixture values: `19 · 31 · 29 · 47 · 18 · '2025-01-08' · '2025-12-04'`.
- **`lib/db/queries.ts`** — add `export async function getDiscarded(slug: string): Promise<Discarded>` following the identical `await requireSlug(slug); return DiscardedSchema.parse(discardedFixture);` shape, and thread `discardedFixture` into `getRunSummary`. **A1 creates it; [C9](#c9--discards) wires it in two places — `app/r/[slug]/layout.tsx` (A4) so `EvidenceProvider` can hold the records, and `app/r/[slug]/sources/page.tsx` (A13) so the explorer can render them.** A1 creating this and nobody calling it was the single most consequential gap in the first draft; the build log entry for this phase names both call sites so neither session has to rediscover them.

  **Derivations do not get a query.** `deriveEvidenceState`, `planSpans` and everything in `lib/analytics/` are pure functions over data the page already fetched; putting them behind an `async (slug) => Promise<T>` would fake a network round-trip that will never exist.

**Notes — tests.** Six new files in `tests/unit/`, four extended. Exact `describe`/`it` names:

- `discarded.test.ts` — `describe('the discard corpus')`: `it('is 18 records, DS_01 through DS_18')` · `it('every attempted_query is one of the 19 run queries')` · `it('reason distribution is 7/5/3/3')` · `it('dimension distribution is 5/4/3/4/2')` · `it('three domains appear in both the kept and discarded corpora')` · `it('has no text field on any record')` · `it('rejects a discard with an unknown reason')` · `it('DISCARD_REASON_LABEL covers every enum value with a sentence')`.
- `evidence-stats.test.ts` — `it('stanceOverall is 25 supports, 15 neutral, 7 contests')` · `it('stanceByDimension puts 2 contests in PROBLEM and 3 in MONEY')` · `it('domainConcentration finds 29 domains and ranks capterra-like.example first')` · `it('the top three domains account for 11 of 47 findings')` · `it('recencyTicks runs 2025-01-08 to 2025-12-04 across 47 ticks')` · `it('citationCoverage splits 47 findings into 24 cited and 23 uncited')` · `it('citedFindingIds and citationCoverage agree')` · `it('deriveEvidenceState is strong on PROBLEM/WHAT_EXISTS/MONEY, thin on PRACTICAL, contested on PROBLEM/MONEY')` · `it('leaves DEMAND_SIGNALS in no band at 1 contest in 7')`.
- `report-figures.test.ts` — `it('priceLadder is four rungs ascending — a band, two points and a threshold')` · `it('every ladder rung carries at least one citation')` · `it('roiGap pairs $2,000-4,000 against $199-299 for 10x to 20x')` · `it('roiGap never sources a tool price to EV_26')` · `it('capabilityMatrix returns five keys, three competitors and an idea column with no levels')` · `it('every non-unknown competitor cell carries a citation')` · `it('numberCallouts returns exactly the nine flagged facts')` · `it('runFunnel shares are proportional to the largest segment, not to a total')`.
- `run-plan.test.ts` — `it('planHorizon is 12 weeks')` · `it('the four build spans tile W1-W2, W3-W6, W7-W11 and W12 onward')` · `it('S04 is open-ended — duration_weeks is null and endWeek is null')` · `it('isOnAxis excludes the tripwire and includes all four build steps')` · `it('fanOut is Q01 2, Q02 1, Q03 1, Q04 2, Q05 1, Q06 3')` · `it('sorting by fan-out descending, ties by rank, reproduces the priority order')`.
- `brief-state.test.ts`, written against [C4](#c4--the-brief-state-libbrief-statets)'s names — `it('markUnknown moves a filled field into patch.unknown')` · `it('reveal promotes a pending field to filled through resolveBrief')` · `it('edit records the key without storing the value in the patch')` (R6) · `it('resolveBrief output still passes BriefSchema')` · `it('answeredCount and unansweredCount read 9 and 3 on the fixture')` · `it('coreFilled is true once the six core fields are filled or unknown')` · `it('approve stamps approvedAt exactly once')` · `it('a stored payload whose v is not 1 is discarded, not migrated')` · `it('the reducer never mutates its input')`.
- `run-events-timing.test.ts` — `it('emits phase verifying at 3,260ms')` · `it('lands the first verified finding under 6 seconds')` · `it('totals between 43s and 47s')` · `it('emits all 19 queries, 47 findings and 18 discards')` · `it('carries a full DiscardedFinding on every discard event')` · `it('has no discard in the final four seconds')`.
- Extend `schemas.test.ts` — `it('every fact carries a value, unit, label and kind')` · `it('rejects a percentage fact above 100')` · `it('rejects a capability claim with no citation')` · `it('accepts an unknown capability cell with no citation')` · `it('rejects a tripwire step carrying a week span')` · `it('rejects a build step missing start_week')` · `it('accepts a build step with a null duration')` · `it('rejects duplicate step ids')` · `it('rejects a surprise whose detail has no citation')` · `it('rejects an open question with an unknown brief_field')` · `it('rejects a dimension section whose dimension does not match its key')`.
- Extend `run-summary.test.ts` (`domains_count` 29, the two dates), `run-stream-reducer.test.ts` (`it('accumulates discarded records newest-first while still setting the count from the event')`), and `queries.test.ts` (`it('getDiscarded resolves 18 Zod-validated records')`).

**Not built in A1:** no component beyond the four R14 imports and the four typecheck-tail edits, no CSS, no page. `lib/hooks/use-brief-state.ts` is **A7** — A1 ships only the pure module underneath it, complete. Every figure that consumes `report-figures.ts` and `evidence-stats.ts` is **A3**. The console's use of the re-timed event log and the discard records is **A8**. `EvidenceState`'s band, `CapabilityMatrix`'s markup, `DiscardRow`, `SurveyBlock`, `WeekAxis`, `PlanBar` and `FanOutMeter` are A9–A13. **If a derivation here has no test, the phase is not done.**

**Exit test:**

1. `npm test` runs green across **13 files** — the 7 existing plus 6 new — with **at least 39 existing plus 45 new assertions**, and every `it()` name above present verbatim.
2. `npx tsc --noEmit` clean, with no `any` introduced and no optional chaining introduced at a call site by a schema that should have been explicit. Grep the diff for `?.` against the new schema fields; a `.length(5)` array and a five-key object both index without it, and a `z.record` does not — which is why C7's shape is an array.
3. **Prove the contract numbers are the fixture's numbers, not prose.** In a node one-liner, print `planHorizon(roadmap)`, `fanOut(roadmap)`, `priceLadder(evidence).length`, `roiGap(evidence).ratioLow/.ratioHigh`, `runFunnel(summary).map(s => s.share)`, `numberCallouts` totalled across the five dimensions, and `deriveEvidenceState(...)`. Compare each against C5, C6, C8, C10 and C11 line by line and paste the output into the build log. Any mismatch is a fixture bug now, not a rendering bug in six sessions.
4. **Prove the fixtures are live rather than merely parsed.** With `next dev` running, drive the **Playwright MCP** to `/r/sms-rebooking-4f2a/define`, clear `localStorage`, run `localStorage.setItem('sv.runStarted.sms-rebooking-4f2a', String(Date.now()))`, navigate to `/r/sms-rebooking-4f2a/validate` and sample the console over time — 12 samples at 700ms, reading the visible verified count and the elapsed readout. The first finding must be on screen **before the 6s sample**, the count must reach 47, the discard counter must reach 18, and the run must reach its complete state **between 43s and 47s** with no interval longer than 1.2s where nothing changed. Deep Canopy is still rendering that page and it will look wrong; the numbers and the timing are what is being measured.
5. Per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at **1440 and 1280** on `/`, all four run routes and `/style-guide`.
6. Append to the build log: the fact-assignment table with its nine callout flags, the timing checkpoints, the two `getDiscarded` call sites A4 and A13 owe, and the step-3 output — so A3, A8, A10 and A12 never re-derive any of it.

**Notes — contract concerns:**

- **Edited values live on the patch, in `values`** ([C4](#c4--the-brief-state-libbrief-statets)). An earlier draft of the contract kept them in a second store at `sv.brief.<slug>.values` and had `resolveBrief(base, patch)` read them, which cannot work — `BriefPatch` carries no `slug`. The contract was amended rather than worked around: `values: Partial<Record<BriefFieldKey, string | string[]>>` is a field on the patch, `resolveBrief` stays pure and two-argument, and there is **one** storage key. Build no `readBriefValues`/`writeBriefValues` pair.

---

## A2 — Primitives I: the Obsidian app kit

**Goal:** every shared primitive — `components/ui/`, `components/status/`, and the non-chrome half of `components/layout/` — renders Obsidian recipes instead of Deep Canopy ones. After this phase no page-level phase ever has to decide what a card, a chip, a confidence mark or a focus ring looks like. `/style-guide` proves it.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/pitfalls.md` (§1, §2, §3, §7), `references/motion.md` (the ambient band, for the orb), `references/verification.md` (§3, §4, §6), `WebsiteLayoutDesc/10-component-system.md`, and this plan's [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C12](#c12--shared-class-names), [C13](#c13--ownership-of-things-two-phases-both-wanted)

**Build:**
- `styles/obsidian-app.css` — fill **§2 `PRIMITIVES — SURFACES & TYPE`** and **§3 `PRIMITIVES — CONTROLS & OVERLAYS`**, the two banners A0 left empty ([C1](#c1--stylesobsidian-appcss-the-section-map)). Class lists below. No other section is touched, no banner is renumbered, and no new banner is added.
- `styles/obsidian-app.css` §16 — this phase's reduced-motion end states appended to the app-side reduce block ([C1](#c1--stylesobsidian-appcss-the-section-map)).
- `components/ui/*.tsx` — all 29 existing files re-authored per the disposition table.
- `components/ui/fragment.tsx` — **new.** `Fragment` promoted out of the landing page.
- `components/ui/orb.tsx`, `components/ui/recent-runs-list.tsx` — moved from `components/entry/` ([C13](#c13--ownership-of-things-two-phases-both-wanted)).
- `components/status/*.tsx` — all 6.
- `components/layout/page-container.tsx`, `prose-column.tsx`, `back-link.tsx`, `wordmark.tsx`, `logomark.tsx`, **`segmented-control.tsx`** (see the Notes — A4 does not own this one).
- **Deleted:** `components/layout/two-column.tsx`, `components/layout/landing-nav.tsx`, `components/layout/footer-panel.tsx`, and the whole of `components/entry/` (`hero.tsx`, `what-you-get.tsx`, `trust-section.tsx`, `box-section.tsx`, `the-box.tsx`, `example-seed.tsx` after the two live files move out).
- `components/style-guide/sections/foundations.tsx`, `ui-atoms.tsx` — rewritten. **`layout.tsx` — the `LandingNav` and `FooterPanel` rows deleted with the components; `BackLink`, `PageContainer`, `ProseColumn`, `SegmentedControl` and `StageRail` kept.** Without this the style guide imports two files this phase removes and `npm run build` fails at the C14 gate. `entry.tsx` — deleted. `app/style-guide/page.tsx` — nav items updated, data pulled through `lib/db/queries.ts`.

**Notes:**

- **This phase creates no file in `styles/`, adds no import line, and declares no token.** A0 owns `styles/obsidian-app.css`, its `layer(components)` import and all ten new tokens ([C2](#c2--foundation-ownership)). A2 **asserts** the four it consumes and moves on: `--ob-container-app` (1360px, via `PageContainer variant='app'`), `--ob-container-report` (1080px, `variant='report'`), `--ob-report-prose` (580px, `.ob-prose` and `ProseColumn`), `--ob-hatch` (the `.ob-slot` weave). `--ob-header-h` / `--ob-header-h-condensed` / `--ob-anchor-inset` also already exist; A2 neither uses nor overrides them, and in particular **does not write a second `scroll-margin-top` rule** — there is exactly one, in §1 ([C2](#c2--foundation-ownership)).
- **Section numbers come from [C1](#c1--stylesobsidian-appcss-the-section-map) and nowhere else.** A2 fills §2 and §3. It writes no reserved-section map of its own into the header comment — A0's is the only one, and a second copy is how the file ended up with five.
- **Every `@keyframes` this phase declares is prefixed `ob-app-`** ([C1](#c1--stylesobsidian-appcss-the-section-map)): `ob-app-shimmer`, `ob-app-spin`, `ob-app-rest`, `ob-app-breathe`. `obsidian-app.css` is imported after `obsidian.css` in the same layer, and a duplicate `@keyframes` name is silently *replaced*, not merged — an unprefixed `ob-pulse` here would kill the live dot on every route with no error. Grep the name across `styles/*.css` before declaring one.
- **`styles/obsidian-app.css` carries no `[data-theme]` selector.** A0 moved the theme to `<html>` and the tokens to `:root`; re-scoping would push every rule here to specificity 0,2,0 and silently outrank `styles/obsidian.css` for no gain. Corollary: **this file never redeclares a class defined in `obsidian.css`.** A2 *consumes* `.ob-rule`, `.ob-eyebrow`, `.ob-em`, `.ob-meta`, `.ob-rule-v`, `.ob-btn` / `.ob-btn-primary` / `.ob-btn-ghost` / `.ob-btn-bare`, `.ob-chip` / `.ob-chip-verified`, `.ob-dot`, `.ob-skip`, `.ob-reveal`, `.ob-frag*`, `.ob-wordmark*` and `.ob-composer` unchanged. If a landing recipe needs a change, change it there.
- **Focus rings on anything that is not a `.ob-btn` use `outline`, never `box-shadow`.** `outline: 2px solid var(--ob-accent); outline-offset: 2px; transition: none;`. This keeps "zero `box-shadow` outside the primary button" literally true and therefore machine-checkable (verification.md §6.4). Rule 7 stays intact.
- **Reduced motion goes in `styles/obsidian-app.css` §16 — the only home for app-side reduce rules ([C1](#c1--stylesobsidian-appcss-the-section-map)).** `styles/obsidian.css` §16 is not extended by this phase or any other. Standing rule 16 makes the end state a per-phase obligation, so A2 appends its own three, and A15 audits the union in one file rather than two: `.ob-skeleton { animation: none; background: var(--ob-surface) }` · `.ob-rest-dot { animation: none; opacity: 1 }` · `.ob-orb { animation: none }`. `.ob-spinner` keeps its rotation — it is a determinate-progress affordance on a button, not decoration, and stopping it would leave a static glyph claiming work is happening.
- **The hatch is one geometry, fixed in [C12](#c12--shared-class-names):** `repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px)`. `.ob-slot` writes exactly that string; A3 writes the same string on `.ob-stance-contests` and `.ob-plan-bar-conditional` in §4. There is no shared `.ob-hatch` utility class — a class that exists only to be composed into three unrelated boxes reads as a fourth system. If you change the weave, grep the string across `styles/` and change all of them.

**Disposition — `components/ui/`, all 29 files:**

| File | Fate | What changes |
|---|---|---|
| `accordion.tsx` | **ported** | Same API, same `grid-template-rows: 0fr→1fr` mechanism, `inert` on closed inner. Classes → `.ob-acc` / `.ob-acc-trigger` / `.ob-acc-wrap[data-state]` / `.ob-acc-body` / `.ob-acc-chevron`. Duration `--ob-base` (320ms), easing `--ob-ease`. |
| `ambient-note.tsx` | **ported** | Still dev-only (`return null` in production). `.ob-ambient`, `--ob-dim`, mono 11px, `◆` retained. |
| `button.tsx` | **reshaped** | `variant?: 'primary' \| 'ghost' \| 'bare'` (was `'primary' \| 'secondary'`), `size?: 'md' \| 'sm'`. Maps to `.ob-btn` + `.ob-btn-primary` / `.ob-btn-ghost` / `.ob-btn-bare`; `size='sm'` adds new `.ob-btn-sm` (`padding: 8px 16px; font-size: 13px`). `.ob-btn:focus-visible` already carries `transition: none` — **do not remove it; a ring that fades over 320ms reads as lag** (pitfalls §7). Sweep every `variant="secondary"` call site to `"ghost"`. |
| `card.tsx` | **reshaped** | `featured` → `verified`. `.ob-card` = `background: var(--ob-surface); border: 1px solid var(--ob-hairline); border-radius: var(--ob-r-card)`. **No inset highlight, no outer shadow, no gradient — the whole of the old recipe is deleted, not translated** (rule 7). `.ob-card-interactive:hover` = `border-color: var(--ob-hairline-strong); background: var(--ob-raised)`, transition `--ob-base --ob-ease`, **no `translateY`**. `.ob-card-verified` = `border-color: var(--ob-hairline-accent)` and nothing else — no glow, no wash fill. **`verified` is legal only where the object genuinely passed verification: a verified `FindingCard`, the approved brief, `EvidenceState`'s strong-on column. It is not an emphasis prop.** Existing `featured` call sites drop to plain `Card`; their own phase re-decides emphasis (a left hairline, `.ob-proof`-style, is the house answer). |
| `copy-button.tsx` | **ported** | Client. API, 2000ms label swap, timer reset, `Press ⌘C` failure path all unchanged. `variant='button'` now emits `ob-btn ob-btn-ghost ob-btn-sm`. Still the product's only success feedback; still no toasts. |
| `copy-link-button.tsx` | **ported** | Async server component, `headers()` host resolution unchanged. |
| `display-headline.tsx` | **reshaped** | **Confirmed as the device, with the split inverted to match Obsidian.** Obsidian headings default to `--ob-text`, so `bright` needs no class and `.hl-bright` is deleted; only the muted half is marked. New prop `level?: 'display' \| 'h1' \| 'h2'` (default `'h1'`) selecting `.ob-display` / `.ob-h1` / `.ob-h2`. Muted span → new `.ob-hl-muted { color: var(--ob-muted) }`. Weight stays 400 on both halves (rule 6) — contrast is colour, never weight. |
| `divider.tsx` | **ported** | Now `<hr className="ob-rule">`. `.ob-rule` already exists; no new recipe. |
| `drawer.tsx` | **ported** | Client, `motion` v12 kept (rule 18 permits it for enter/exit). Width 480px → **520px**: the drawer shows an `.ob-excerpt` at 18px and 480px gave a ~44-character measure. Overlay `--ob-scrim`, fade `duration: 0.18`; content `x: '100%' → 0`, `duration: 0.32, ease: [0.16, 1, 0.3, 1]`. Panel = `--ob-surface`, `border-left: 1px solid var(--ob-hairline)`, `border-radius: 0`, **no shadow**. `onCloseAutoFocus` stays. |
| `empty-note.tsx` | **ported** | `.ob-empty` — 15px `--ob-muted`. One honest sentence, at most one action, still no illustration. |
| `filter-pill.tsx` | **reshaped** | Keeps the contract name. Renders `.ob-toggle` at `--ob-r-tag` **4px** — **a filter is a chip, not a button, and rule 8 permits a pill only on `.ob-btn`.** Adds `count?: number`, printed as a mono suffix (`Money 13`) because the facet rail (A13) needs live counts. `aria-pressed` retained; `[aria-pressed='true']` → `border-color: var(--ob-accent); color: var(--ob-text)` — accent legal here as **active state**. |
| `icon-button.tsx` | **ported** | `.ob-icon-btn`, 32×32, `--ob-r-tag`, hairline border on hover only. `label` still required. |
| `inline-editable-field.tsx` | **ported** | Fully controlled, no internal state. `.ob-inline` (display button, `Pencil` 14 at `--ob-dim`) / `.ob-inline-input` (`--ob-surface`, hairline, focus → `--ob-hairline-accent` + `outline`). |
| `inline-editable-list.tsx` | **ported** | Same recipes plus the `X` `IconButton` row and the `Plus` `TextAction`. |
| `media-slot.tsx` | **ported** | API unchanged (`ratio, kind, label, brief, source, className`), classes swapped. Spec below. |
| `meta-line.tsx` | **reshaped** | Separator and wrapping. Spec below. |
| `modal.tsx` | **ported** | 440px, `--ob-surface`, 1px `--ob-hairline`, `--ob-r-lg` 16px, **no shadow** — over a `--ob-scrim` overlay the surface step alone reads elevated. Overlay `0.18`, content `opacity` + `scale .97→1` at `0.2`, translate `-50%/-50%` preserved in every keyframe. Still zero call sites; A7 gives it one. |
| `popover.tsx` | **ported** | `.ob-popover` — `--ob-raised`, hairline, `--ob-r-card`, `sideOffset={8}`, no arrow. Stays a server component; hover delay remains the caller's job. |
| `prose.tsx` | **ported** | `.ob-prose` = `max-width: var(--ob-report-prose)` (580px, A0's token), `color: var(--ob-muted)`, 16px / 1.6. Not 68ch — the report grid owns the measure now. `.ob-prose` is one of the two selectors the bracket monopoly is scoped to ([C12](#c12--shared-class-names)). |
| `rest-indicator.tsx` | **ported** | `.ob-rest` / `.ob-rest-dot`, 4px dots at `--ob-dim`, opacity cycle 1.4s via `@keyframes ob-app-rest`. **Not accent.** Blue's live-state job belongs to the run stream's `.ob-dot`; a blue typing indicator makes blue mean "waiting". |
| `reveal.tsx` | **replaced** | Re-authored over the `.ob-reveal` mechanism: `<div className="ob-reveal" data-shown={inView} style={{ '--ob-reveal-delay': `${delayMs}ms` }}>` driven by `useInView`. The old IntersectionObserver + inline `transitionDelay` implementation is deleted. `components/landing/scroll-reveal.tsx` is **left alone** — `/` is out of scope; A15 may dedupe. |
| `section-label.tsx` | **reshaped** | Spec below. |
| `skeleton.tsx` | **ported** | Three exports unchanged. `.ob-skeleton` = `background: linear-gradient(90deg, var(--ob-surface), var(--ob-raised), var(--ob-surface))`, `background-size: 200% 100%`, `animation: ob-app-shimmer 1.6s linear infinite`, `border-radius: var(--ob-r-tag)`. New `@keyframes ob-app-shimmer` in §3 — **an `animation:` name with no matching `@keyframes` fails silently and statically** (rule 4). `LINE_WIDTHS` and `FieldSkeleton`'s 20px/70% stay; A14 rebuilds the route skeletons on top of them. |
| `skip-link.tsx` | **ported** | Renders `.ob-skip`, the class the landing page already defines. Still unmounted — **A4 mounts it in `RunShell` (R19).** |
| `spinner.tsx` | **ported** | `.ob-spinner`, `currentColor`, `@keyframes ob-app-spin`. Buttons and phase glyphs only. |
| `text-action.tsx` | **ported** | `.ob-text-action` — 14px `--ob-muted`, hover → `--ob-text` with a 1px `--ob-hairline-strong` underline via `border-bottom`, `outline` focus. Still the default tertiary action. |
| `text-area.tsx` | **reshaped** | `variant?: 'field' \| 'composer'` (was `'default' \| 'hero'`). `'composer'` maps onto the existing `.ob-composer textarea` (18px / 1.55). `field-sizing: content` auto-grow retained — still no JS measure hook. |
| `tooltip.tsx` | **ported** | `.ob-tooltip` — `--ob-raised`, hairline, `--ob-r-tag`, 12px sans, `sideOffset={6}`. Own `Provider delayDuration={300}`; still a server component. |
| `well.tsx` | **ported** | `.ob-well` = `background: var(--ob-void); border: 1px solid var(--ob-hairline); border-radius: var(--ob-r-tag)`. Recessed reads as *darker* here, not lighter — `--ob-void` is below `--ob-canvas` by design. |

**Disposition — `components/status/`:**

- **`VerifiedBadge`** — reuses the landing's `.ob-chip .ob-chip-verified` verbatim, with a 12px lucide `Check` and the word `VERIFIED`. **Accent is legal: this is the verification job, and it is the reason the job exists.** A5 drives its pending/resolved opacity states; A8 owns the timing (badge at **+180ms** after the rule, [C13](#c13--ownership-of-things-two-phases-both-wanted)). A2 ships the static appearance only.
- **`StatusBadge`** — **reshaped.** Brackets dropped; copy is now `ALL SYSTEMS OPERATIONAL`. Dot is `.ob-dot` (accent, pulsing) — legal as **live state**. Its only call site, `FooterPanel`, is deleted in this phase; the component is kept and A14 decides whether `RunFooterBar` carries it. Say so in the build log rather than leaving a component nobody can find a use for.
- **`StageChip`** — `.ob-chip` at 4px. **It is a pill today and must stop being one** (rule 8). Mono 10px uppercase, `--ob-dim`, 1px `--ob-hairline`.
- **`ConfidenceNote`** — three 3×10px bars + the literal word. Filled `--ob-text`, empty `--ob-hairline-strong`. Word colour: `solid` → `--ob-text`, `mixed` → `--ob-muted`, `thin` → `--ob-dim`. **Never accent.** Confidence is a property of the evidence — it is not an action, not a verification, and not a live state, so under rule 5 it cannot be blue. The Deep Canopy `--conf-solid` mapping to the accent is deleted, not re-pointed. A3's `DimensionStrip` composes this component unchanged; it must therefore look right at the bottom of a 5-up column, not only in a card.
- **`CoverageBar`** — track `--ob-hairline`, fill `--ob-text`, height 6px, `--ob-r-tag`, and a `height` prop honoured down to **2px** because `DimensionStrip` (A3) draws it at 2. **Not accent.** The raw count still prints alongside in `.ob-meta` with `font-variant-numeric: tabular-nums` — the number is the truth, the bar is the shape.
- **`PhaseStrip`** — four names, fixed order, no percentage. Pending `--ob-dim`; done `--ob-muted` with an 11px `Check`; **active `--ob-accent` with a leading `.ob-dot` — accent legal as live state.** Elapsed printed in `.ob-meta`, `tabular-nums`.

**Disposition — `components/layout/`:**

- **`PageContainer`** — reshaped: `variant?: 'app' | 'report' | 'marketing'`, default `'app'`. Reads `.ob-container-app` (1360) / `.ob-container-report` (1080) / `.ob-container` (1200). **All three classes already exist — the first two in §1 (A0), the third in `obsidian.css` §2.** `PageContainer` picks one; it defines none.
- **`ProseColumn`** — reshaped to `max-width: var(--ob-report-prose)`.
- **`TwoColumn`** — **deleted (R10).** Its `position: sticky` sidebar is a no-op on Define because a sticky element filling its own containing block never pins, and every page in this build has a bespoke grid: the Define split (`minmax(0,1fr) 440px`, both columns their own scrollport), the report grid (`580px 400px`, gap 100px), the explorer (`260px minmax(0,1fr)`). **A generic two-column that no page can actually use is how R10 happened in the first place.** It has **three** call sites, not two ([C13](#c13--ownership-of-things-two-phases-both-wanted)) — `components/define/define-conversation.tsx`, `components/validate/report/report.tsx` **and `app/r/[slug]/define/loading.tsx`**. Replace all three with an inline `<div className="grid items-start gap-12 grid-cols-[minmax(0,1fr)_400px]">`; the first two are fully re-laid-out in A6 and A9, the third in A14. **Missing the `loading.tsx` call site breaks the build on a file no phase reads until A14 — check it explicitly before deleting.** A6 does not expect this file to survive.
- **`BackLink`** — ported onto `.ob-text-action`, `←` prefix retained.
- **`Wordmark`** — reshaped: the word becomes **`Groundwork`** (D2), classes become the existing `.ob-wordmark` / `.ob-wordmark-glyph`, and the glyph rotates 90° on hover.
- **`LogoMark`** — re-authored to the Obsidian mark: a 15×15 `currentColor` SVG, `<rect x=0.5 y=0.5 width=14 height=14>` stroked plus `<rect x=1 y=9 width=5 height=5>` filled. The Deep Canopy cut-gem is deleted. **This is the repo's one glyph definition**, and `Wordmark` renders it rather than inlining a second copy. **A2 does not touch `components/landing/site-nav.tsx`** — A4 owns `Wordmark` and makes that edit, so the landing nav is edited once by one phase (see A4's Build list). A2's job here ends at the component.
- **`LandingNav`, `FooterPanel`** — deleted. Superseded by `components/landing/site-nav.tsx` / `site-footer.tsx`, alive only via `/style-guide`.
- **`SectionIndex`, `RunShell`, `StageRail`, `RunFooterBar`** — **not this phase.** They are chrome and carry R9 and R16; A4 owns them, in §5 (and A9 rebuilds `SectionIndex` as a horizontal strip in §10).
- **`SegmentedControl` *is* this phase**, and this is the one correction to the chrome/primitive split. It is a `components/layout/` primitive with no run-data knowledge, A4's Build list does not contain it, and A11 wraps it in its own `.ob-roadmap-nav` rather than overriding it — so deferring it left it owned by nobody. A2 ports it: `.ob-segmented` (4px `--ob-r-tag` track on `--ob-surface`, 1px `--ob-hairline`), `.ob-segmented-item` (`--ob-sm`, `--ob-muted`, hover `--ob-text`), `.ob-segmented-item--on` (`--ob-raised`, `--ob-text`, `aria-pressed='true'`). **Nothing here is a pill** — that radius is buttons only. R9's stickiness is the *wrapper's* job and stays A11's.

**`components/entry/` is deleted entirely, and this phase is the only place that decision is made** ([C13](#c13--ownership-of-things-two-phases-both-wanted)). `orb.tsx` and `recent-runs-list.tsx` move to `components/ui/` first; the other six go. Any later phase referring to `components/entry/orb.tsx` or `components/entry/recent-runs-list.tsx` means `components/ui/`. `Orb` is **ported, and it keeps exactly one call site** — A14's invalid-run page; A8 removes the console's (the backdrop replaces it). `.ob-orb` = a 360px circle, `background: radial-gradient(circle, var(--ob-accent-wash) 0%, transparent 68%)`, `filter: blur(28px)`, `animation: ob-app-breathe 38s var(--ob-ease) infinite`, `aria-hidden`, `dimmed` → `opacity: 0.45`. 38s sits inside the ambient band (20–50s). `RecentRunsList` is **ported** — client, `useRecentRuns`, hidden entirely when empty, footnote "Remembered by this browser only." unchanged.

**`the-box.tsx` is deleted in A2, not A15.** It is reachable only through `box-section.tsx`, which nothing imports, and `createRun` now runs solely through the landing composer in `components/landing/cofounder-chat.tsx`. **Record in the build log the two behaviours it carried that the landing composer does not — the `sessionStorage['sv.box.draft']` mirror and the live character count — so A15 can decide whether the landing composer should gain them.** Deleting the file without recording that is how a working affordance disappears silently.

**`.ob-slot` — the MediaSlot recipe, in full (Standing rule 14).** There is no obsidian equivalent today and every page in this build needs one. It lives in §3.
```css
.ob-slot {
  display: flex; flex-direction: column; justify-content: flex-end; gap: 6px;
  padding: 20px;
  border: 1px dashed var(--ob-hairline-strong);
  border-radius: var(--ob-r-card);
  background-color: var(--ob-surface);
  background-image: repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px);
}
.ob-slot-kind   { /* .ob-meta scale */ color: var(--ob-dim); }
.ob-slot-label  { font-size: var(--ob-sm); color: var(--ob-text); letter-spacing: var(--ob-tracking-snug); }
.ob-slot-brief  { font-size: 13px; line-height: 1.5; color: var(--ob-muted); max-width: 52ch; }
.ob-slot-source { /* .ob-meta scale */ color: var(--ob-dim); }
```
The `background-image` is [C12](#c12--shared-class-names)'s single hatch geometry, written out rather than composed — 6px period, not 7. Height is reserved by the inline `aspect-ratio` from `ratio` — filling a slot must cause zero layout shift. `role="img"` with `aria-label={`Placeholder for ${kind}: ${label}. ${brief}`}`. **It renders in production on purpose.** A slot is the spec for an asset someone still owes; deleting one as cleanup deletes the requirement.

**`SectionLabel` — the blue has to go (Standing rule 5).** New signature:
```ts
SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string })
```
renders
```tsx
<p className="ob-eyebrow ob-meta">
  {index ? <span className="ob-em">{index}</span> : null}
  <span>{children}</span>
</p>
```
`.ob-eyebrow` and `.ob-em` already exist in `obsidian.css` — no new recipe, no redeclaration. The numeral is **chalk**, the label is `--ob-dim`, and `.ob-eyebrow::after` supplies the `flex: 1` hairline running off to the right. **The brackets do not survive.** The bracket was Deep Canopy's device for making a mono label read as a machine token; Obsidian's device is the numeral plus the trailing rule, and `[01] [WHAT WE FOUND]` reads as two tokens fighting each other — the closing bracket also duplicates the terminator the hairline already provides. **This is the half of the bracket rule A2 owns:** after this phase nothing in running prose renders a `[` except A5's `.ob-cite` ([C12](#c12--shared-class-names)). `[03]` on an explorer row and `[Q02]` in a skeleton sit outside prose and stay legal. The element changes from `<span>` to `<p>`; sweep all 16 call sites for any that nest it inside a paragraph.

**`MetaLine` — separator and truncation (R21).** New signature:
```ts
MetaLine({ parts, tone = 'dim', className }: { parts: string[]; tone?: 'dim' | 'bright'; className?: string })
```
Each part after the first renders `<span className="ob-metaline-part"><span className="ob-metaline-sep" aria-hidden="true">·</span>{part}</span>` — the separator lives inside the following part's span so it can never orphan onto the start of a wrapped line, and is `aria-hidden` so it is never spoken. Parts are joined on `META_SEPARATOR` from `lib/content/app.ts` (A0), never on a literal.
```css
.ob-metaline { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 10px; row-gap: 4px; }
.ob-metaline-sep { margin-right: 10px; color: var(--ob-hairline-strong); }
```
`tone='bright'` adds `.ob-meta-bright`. **The `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` triple in the old `.meta-line` is deleted, not translated.** It currently clips the price off a `CompetitorCard`'s meta line, which is the single most decision-relevant field on that card, and the same risk sits on `DimensionSection`'s meta line. **R21 is already in the rot table and this phase closes it** — the exit test measures that the line wraps rather than truncating.

**`Fragment` — promoted to a shared primitive.** `components/ui/fragment.tsx`, server component, using the `.ob-frag*` classes that already exist in `styles/obsidian.css` §11 — **do not duplicate them into `obsidian-app.css`.**
```ts
export function Fragment(props: { title: string; status?: string; children: ReactNode; foot?: ReactNode; className?: string }): JSX.Element
export function FragmentRow(props: { label: string; children: ReactNode; className?: string }): JSX.Element
```
It exists because rule 13 says a product surface is drawn in code, never screenshotted, and `/`'s fragment cards are the drawn-UI grammar this build inherits. **Be honest about its consumers: today it has exactly one, the `/style-guide` gallery.** No page phase's Build list names it. Do not write "A8/A9/A11 want it" into the build log — if none of them adopts it by A15, it is dead code and A15's sweep deletes it along with its entry in the naming contract. Record that as an open item rather than a promise. **The name collides with `React.Fragment`** — a file importing both is a build error waiting to happen. Import it as `import { Fragment } from '@/components/ui/fragment'` and use `<>…</>` for React fragments in the same file, always.

**`styles/obsidian-app.css` §2 and §3, exactly.** Banner titles are [C1](#c1--stylesobsidian-appcss-the-section-map)'s verbatim; the summary words in C1's table name the topic, not an exhaustive list, and a class that already lives in `obsidian.css` is consumed here rather than restated.

§2 `PRIMITIVES — SURFACES & TYPE`: `.ob-card` `.ob-card-interactive` `.ob-card-verified` `.ob-panel` `.ob-well` `.ob-prose` `.ob-hl-muted` `.ob-metaline` `.ob-metaline-part` `.ob-metaline-sep` `.ob-meta-bright` `.ob-orb` + `@keyframes ob-app-breathe`.

§3 `PRIMITIVES — CONTROLS & OVERLAYS`: `.ob-btn-sm` `.ob-icon-btn` `.ob-text-action` `.ob-inline` `.ob-inline-input` `.ob-toggle` `.ob-conf` `.ob-conf-bar` `.ob-conf-bar-on` `.ob-conf-word` `.ob-coverage` `.ob-coverage-track` `.ob-coverage-fill` `.ob-phase` `.ob-phase-item` `.ob-phase-item-active` `.ob-phase-item-done` `.ob-status` `.ob-skeleton` `.ob-spinner` `.ob-rest` `.ob-rest-dot` `.ob-empty` `.ob-ambient` `.ob-acc` `.ob-acc-trigger` `.ob-acc-wrap` `.ob-acc-body` `.ob-acc-chevron` `.ob-overlay` `.ob-drawer` `.ob-drawer-head` `.ob-drawer-body` `.ob-drawer-foot` `.ob-modal` `.ob-popover` `.ob-tooltip` `.ob-slot` `.ob-slot-kind` `.ob-slot-label` `.ob-slot-brief` `.ob-slot-source`, plus `@keyframes ob-app-shimmer`, `ob-app-spin`, `ob-app-rest`.

**Not in either list, deliberately:** `.ob-container-app` / `.ob-container-report` (§1, A0), `.ob-fig*` and the stance fills (§4, A3), `.ob-cite` and `.ob-stance-mark` (§6, A5). A2 defines nothing another phase's contract already owns.

**Exit test:** run `next dev` and drive `/style-guide` with the Playwright MCP at 1440×900 and 1280×800. (1) **Cascade:** read `getComputedStyle` on an element carrying both `.ob-card` and `mt-8` — `marginTop` must be `"32px"`, not `"0px"`; a zero here means the new stylesheet went in unlayered (pitfalls §1). (2) **Tokens, asserted not declared:** `.ob-card` reports `backgroundColor: rgb(16, 16, 18)`, `borderTopColor: rgb(35, 35, 38)`, `borderRadius: 10px`; a `PageContainer variant='app'` reports `maxWidth: 1360px` and `variant='report'` `1080px`; `.ob-prose` reports `maxWidth: 580px`. All five are A0's tokens read back — if any is `none` or `0px`, an `--ob-*` is undefined and has voided its whole declaration (rule 4). (3) **Shadow audit:** `[...document.querySelectorAll('#ui-atoms *')].filter(n => getComputedStyle(n).boxShadow !== 'none')` returns only elements whose `className` contains `ob-btn`. (4) **Pill audit:** no element with a computed `border-radius` above 100px unless it carries `ob-btn`. (5) **The blue audit, and the one that matters most:** collect every element under `#ui-atoms` whose computed `color`, `borderTopColor` or `backgroundColor` is `rgb(45, 127, 249)`, and assert each one's class is in the closed set `ob-btn-primary`, `ob-chip-verified`, `ob-dot`, `ob-phase-item-active`, `ob-toggle[aria-pressed="true"]` — a `ConfidenceNote` bar, a `CoverageBar` fill, a `SectionLabel` numeral or a `RestIndicator` dot appearing in that list is a rule-5 failure and fails the phase. (6) **Focus:** press `Tab` 12 times with real key presses, `waitForTimeout(80)` between each, reading `outline` and `boxShadow` off `document.activeElement` — every row shows an indicator, every indicator is the accent, and none is mid-transition. (7) `document.querySelector('.ob-eyebrow').textContent` contains no `[`. (8) **MetaLine (R21):** set a `.ob-metaline` container to `width: 320px` via `browser_evaluate` and confirm `getBoundingClientRect().height` exceeds one line-height while `getComputedStyle(...).textOverflow` is not `ellipsis`. (9) **Keyframes resolve:** for each of `ob-app-shimmer`, `ob-app-spin`, `ob-app-rest`, `ob-app-breathe`, read `getComputedStyle` on the element that uses it and assert `animationName` is that exact string and `animationDuration` is non-zero — a name with no matching `@keyframes` reports the name and animates nothing, so also sample `.ob-skeleton`'s `backgroundPosition` twice 400ms apart and assert it changed. (10) **Reduced motion:** `emulateMedia({ reducedMotion: 'reduce' })`, reload, wait 800ms, and assert `.ob-skeleton` and `.ob-rest-dot` report `animationName: 'none'` with `opacity: 1`, and `.ob-orb` reports `animationName: 'none'`; reset to `no-preference`. (11) Navigate to `/`, screenshot, and confirm `.ob-wordmark-glyph`'s bounding box is still 15×15 — the `LogoMark` refactor must not have moved the landing nav. (12) Confirm the three `TwoColumn` call sites are gone: `grep -rn "TwoColumn" app components` returns nothing, and `/r/sms-rebooking-4f2a/define` still renders with `loading.tsx` compiled. (13) `browser_console_messages level:"error"` returns zero **at both 1440 and 1280**, then `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` all pass ([C14](#c14--every-exit-test-ends-the-same-way)).

---

## A3 — Primitives II: the figure kit

**Goal:** every mark in the naming contract's Figures table exists in `components/figures/`, hand-drawn, server-rendered, citation-linked, and rendered on `/style-guide` with the real fixture data it will carry in production. After this phase A9, A10, A11, A12 and A13 compose figures; none of them invents one, and none of them types a number or a height into a component.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/media.md` (§1, §2), `references/verification.md` (§3, §6), `WebsiteLayoutDesc/07-page-validate.md`, and this plan's [C1](#c1--stylesobsidian-appcss-the-section-map), [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), [C5](#c5--the-roadmap-week-model-librun-plants), [C6](#c6--openquestion-priority-brief-link-fan-out), [C7](#c7--capabilitymatrix), [C8](#c8--runfunnel), [C10](#c10--the-analytics-api-frozen-in-a1), [C11](#c11--figure-numbers-settled), [C12](#c12--shared-class-names)

**Build:**
- `styles/obsidian-app.css` **§4 `FIGURES`** — the whole figure kit in one section: the `Figure` frame, the shared marks, the stance fills, the axes. Class list below, grouped under three comment sub-heads inside the one banner. **A3 fills §4 and nothing else** ([C1](#c1--stylesobsidian-appcss-the-section-map)).
- `components/figures/figure.tsx` — `Figure`, `assertFigureSourced`, and the height constants.
- `components/figures/number-callout.tsx` · `stance-bar.tsx` · `recency-strip.tsx` · `value-ladder.tsx` · `gap-bar.tsx` · `run-funnel.tsx` · `capability-matrix.tsx` · `domain-concentration.tsx` · `dimension-strip.tsx` · `fan-out-meter.tsx` · `week-axis.tsx` · `plan-bar.tsx`
- `components/style-guide/sections/figures.tsx` — new section; `app/style-guide/page.tsx` gains `{ id: 'figures', label: 'Figures' }`. **A14 extends this file; it does not create it.**
- `tests/unit/figures.test.ts` — `assertFigureSourced` and the two pure geometry helpers this phase owns.

**Notes:**

- **Every file in `components/figures/` is a server component. No `'use client'` anywhere in the directory** — a figure needing a client boundary is a design failure, not a licence (rule 22). Entrance motion is `Reveal` at the call site, wrapping the figure, never inside it. **No figure animates a value in this phase.** A10 adds the report's `scaleX` bar reveal and its count-up leaf on top of these classes; D17 permits count-ups on run stats, which live on the header (A4) and on `RunFunnel` (A13).
- **There is no charting library and none will be added** (rule 18). Every mark below is divs or hand-written SVG.
- **`font-variant-numeric: tabular-nums` is declared once, on `.ob-fig`**, and inherited by every numeral in every mark. One declaration satisfies the whole rule and cannot be forgotten per-figure.
- **Medium rule:** divs when the mark is rectangles on one axis, or when it carries real text that must not scale with a viewBox. Inline SVG when the mark needs a shared coordinate space with marks at arbitrary fractional positions. Every `<line>` in every SVG carries **`vector-effect="non-scaling-stroke"`** — without it a `preserveAspectRatio="none"` viewBox turns a 1px hairline into a 0.7px smear at 1280.
- **Axis lines are `--ob-grid`, 1px, and there are no gridlines behind bars.** A single baseline rule, nothing else. Obsidian's hairlines are structural; a chart-furniture grid is exactly the generic-dark-dashboard failure mode the system exists to avoid.
- **The analytics API is [C10](#c10--the-analytics-api-frozen-in-a1)'s, frozen in A1. A3 imports it and renames nothing.** Every mark's props are shaped to what those functions already return. If a mark genuinely needs a different return shape, **A1's signature and its test change** — a second spelling never appears in `components/figures/`, and this phase adds no function to `lib/analytics/`. The two pure helpers A3 does own are geometry, not data: `barShare(value, max)` and `ladderGutters(rungs)`, both local to their component files and both unit-tested.
- **Dimension and stance words come from `DIMENSION_LABEL`, `DIMENSION_SHORT` and `STANCE_LABEL` in `lib/schemas/evidence.ts`** ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)). No figure derives a label locally, and **there is no label map in `lib/content/app.ts`**. `DimensionStrip` is a strip, so it takes the **short** form — `Problem · Exists · Demand · Money · Practical`. The schema's stance value is `challenges`; the word the reader sees is `Contests`, and that mapping lives in `STANCE_LABEL`, once. Mono uppercase contexts get `text-transform: uppercase`, never a second string.
- **`/style-guide` gets its data through `lib/db/queries.ts`, like every page.** No figure section imports from `lib/fixtures/` — the prototype contract holds here too. Every number in the gallery is the number the report will render, which is why the fixture column below quotes derivations rather than literals.
- **Every mark exports its own reserved height, and call sites reserve with the constant.** `figure.tsx` re-exports them as `FIG_H`. The keys, complete, so no later phase invents one or types a literal: `callout` 96 · `calloutLead` 128 · `stance` 56 · `ladder` 260 · `gap` 180 · `funnelCompact` 140 · `funnelExpanded` 190 · `matrix` 260 · `recency` 64 · `strip` 140 · `reasonBreakout` 140 · `weekAxis` 56 · `planBar` 72 · `fanOut` 48, plus one helper — `domains(rowCount: number, tailCount?: number): number`, which returns `44 + rowCount * 28 + (tailCount ? 36 : 0)` and yields **396** on this fixture's thirteen rows plus a tail. **A13 and A9 call these by name; a number typed into a page is the bug this list exists to prevent.** A9 reserves slots against these numbers, A10 measures against A9's recorded array, and A12/A13 place the axis and the funnel — a literal `140` typed into a page is how the zero-shift contract breaks between two already-passed phases. A mark that renders taller than its declared height is a bug in the mark, not in the reservation.

**`Figure` — the wrapper. Nothing draws outside one.**
```ts
type FigureProps = {
  caption: string;                              // mono, uppercase
  citations?: number[];                         // [n] numbers, never finding ids
  source?: { label: string; href: string };     // corpus-level provenance
  height: number;                               // reserved px for the mark, from FIG_H
  note?: string;                                // one sans line, --ob-muted
  stance?: Stance;                              // 'challenges' gives the mark the contests treatment
  children: ReactNode;
  className?: string;
};
export function assertFigureSourced(f: Pick<FigureProps, 'caption' | 'citations' | 'source'>): void;
```
DOM:
```html
<figure class="ob-fig">
  <p class="ob-fig-cap ob-meta">THE PRICE LADDER</p>
  <div class="ob-fig-mark" style="--ob-fig-h:260px">…mark…</div>
  <figcaption class="ob-fig-foot">
    <p class="ob-fig-note">optional sans line</p>
    <p class="ob-fig-cite ob-meta">SOURCE <span class="ob-fig-cite-n">26</span> …</p>
  </figcaption>
</figure>
```
`.ob-fig { border-top: 1px solid var(--ob-hairline); padding-top: 16px; display: flex; flex-direction: column; gap: 14px; font-variant-numeric: tabular-nums; }` — **the frame is a hairline, not a card.** Figures stacked in the report's aside column read as a ruled list, which is what the system's hairline grammar wants. `.ob-fig-mark { min-height: var(--ob-fig-h); }` — `min-height`, not `height`, so an overflowing mark shows up as a measured mismatch in the exit test rather than silently clipping. `Figure` always sets `--ob-fig-h`; there is **no fallback value in the declaration**, because a fallback would hide a missing height instead of voiding the rule loudly.

`stance='challenges'` gives the mark area the contests treatment — transparent fill, 1px `--ob-text` border, the shared hatch — and appends a `.ob-chip` to the caption reading `STANCE_LABEL.challenges` uppercased. **This is the prop A10 uses for the `18%` counter-signal callout**; it exists here so A10 wires rather than widens.

`source` is one object, not two flat props. A10's aggregate figures pass `{ label: 'ALL 47 FINDINGS', href: '/r/{slug}/sources' }` through it.

**`assertFigureSourced` throws when `!citations?.length && !source`**, with the message `Figure "${caption}" is unsourced. Every figure links to a [n] citation or to the evidence it summarises (D6).` `Figure` calls it when `process.env.NODE_ENV !== 'production'`. **This is the figure layer's equivalent of the report schema's cited-prose `.refine()` — an uncited mark is a bug now, not a review comment later.** It is exported from `figure.tsx` and unit-tested in `tests/unit/figures.test.ts` so the guarantee survives without a DOM test runner; **no other phase re-declares it.** The `source` escape hatch exists for corpus-level marks (`StanceBar`, `RunFunnel`, `DomainConcentration`, `RecencyStrip`, `DimensionStrip`, `FanOutMeter`) whose honest provenance is a link into the evidence, not a single `[n]`.

**Citation-chip handoff:** A3 renders each citation number as a plain `.ob-fig-cite-n` span. **A5 replaces that span with `CitationChip` in one place — `figure.tsx` — and every figure in the app gains a working chip**, at which point the bracket monopoly of [C12](#c12--shared-class-names) covers the figure footer too. Do not reach forward for `CitationChip` here; A5 does not exist yet.

**Accessibility — one rule, two named exceptions.** Every mark is `role="img"` on `.ob-fig-mark` with a composed `aria-label` that states every value in the mark; the `<figcaption>` carries the caption and citations as real text. **Exception 1: `CapabilityMatrix` renders a real `<table>`** — three competitors plus an idea column across five capabilities compressed into one aria-label sentence is unusable, and a matrix is genuinely tabular data. **Exception 2: `NumberCallout` carries no `role`** — it is literally a number, a unit and a label, and already reads correctly. No figure ships a visually-hidden duplicate table; doubling every number in the accessibility tree is worse than one good label.

**The twelve marks.** Fixture columns quote what the [C10](#c10--the-analytics-api-frozen-in-a1) derivations return on this run's data, per [C5](#c5--the-roadmap-week-model-librun-plants), [C6](#c6--openquestion-priority-brief-link-fan-out), [C7](#c7--capabilitymatrix) and [C11](#c11--figure-numbers-settled). **Nothing here is typed into a component.**

| Mark | File · signature | How it draws · reserved height · colour |
|---|---|---|
| **NumberCallout** | `number-callout.tsx` — `{ value: string; unit?: string; label: string; secondary?: string; citations: number[]; size?: 'default' \| 'compact'; emphasis?: 'lead' }` | Divs, no geometry. `.ob-callout-value` (also carrying `.ob-fig-value`) mono `clamp(40px,4vw,56px)` weight 400, `-0.02em`, `--ob-text`; `.ob-callout-unit` mono 16px `--ob-muted`; `.ob-callout-label` sans 15px `--ob-muted`, `max-width: 34ch`. `size='compact'` drops the value to 28px for a stacked-rows figure; `emphasis='lead'` raises it to `--ob-h1` (68px). **`value`, `unit` and `label` are the strings `factsFor()` already produced at the seam — no figure formats a number and no figure writes a label.** h **96** default · **128** lead · **48** per compact row. **Not blue.** Fixtures, both variants shown: default `14.2%` `[2]`; lead `0 of 9` `[19]` — **and `0 of 9` is the only callout in the report that gets lead emphasis ([C11](#c11--figure-numbers-settled)); the gallery shows the treatment once so a later phase can see what spending it looks like.** |
| **StanceBar** | `stance-bar.tsx` — `{ supports: number; neutral: number; contests: number; compact?: boolean; source?: {label,href}; citations?: number[] }` | Three `.ob-stance-seg` divs inside `.ob-stance-bar`, proportion via `style={{ flexGrow: n }}`, 22px tall (6px when `compact`), `gap: 2px`, 1px hairline between segments. A zero count renders **nothing**, not a zero-width sliver. `.ob-stance-key` below prints a 10×10 swatch, the `STANCE_LABEL` word and the count for each; `compact` omits the key. **h 56 · 24 compact. No hue at all** — see the fill treatment below. Props take `stanceOverall(evidence)` / `stanceByDimension(evidence)[d]` verbatim ([C10](#c10--the-analytics-api-frozen-in-a1)). Fixture: `25 / 15 / 7`, sourced `{ label: 'ALL 47 FINDINGS', href: '…/sources' }` — **the rollup's provenance is the corpus, not a citation list; it uses the `source` hatch, not a fabricated `[n]` set.** |
| **RecencyStrip** | `recency-strip.tsx` — `{ ticks: { id: string; date: string; cited: boolean }[]; from: string; to: string; source: {label,href} }` | **Inline SVG**, `viewBox="0 0 1000 44"`, `preserveAspectRatio="none"`, `width="100%" height="44"`, every line `vector-effect="non-scaling-stroke"`. 47 ticks at arbitrary fractional x on one axis is exactly the case divs lose: 47 absolutely-positioned nodes with no shared coordinate space. Baseline `y=36` at `--ob-grid`. **A cited finding draws a full-height tick `y 10→36` at `--ob-text`; an uncited one draws `y 26→36` at `--ob-dim`** — so the strip doubles as a picture of how much of the corpus the prose actually uses. Two `.ob-meta` bounds below: `JAN 2025` left, `DEC 2025` right. **h 64. Not blue, and no stance encoding** — `recencyTicks` carries `cited`, not `stance` ([C10](#c10--the-analytics-api-frozen-in-a1)), and a second variable on a 47-tick strip is unreadable anyway. Fixture: all 47 findings, `2025-01-08` → `2025-12-04`, 24 cited / 23 uncited. |
| **ValueLadder** | `value-ladder.tsx` — `{ rungs: LadderRung[]; axisMax: number; ticks: number[]; citations: number[] }` | **CSS, not SVG** — every rung carries real text at real sizes and must not scale with a viewBox. `position: relative` box, left axis 1px `--ob-grid` with `.ob-meta` ticks. Each rung positions at `top = (1 - value / axisMax) * markHeight`. Three kinds, and the kind is in the data ([C10](#c10--the-analytics-api-frozen-in-a1) returns `LadderRung[]`): `point` — a full-width 1px `--ob-hairline-strong` rule, label sans-left, value mono-right (`.ob-fig-value`); `band` — a 1px-bordered box spanning its low→high, hatch-free, label left; `threshold` — a **1px dashed** rule across the full mark width, label and value in the **right** gutter. **Points label left, thresholds label right, which is what keeps `$299` and `~$300` legible one pixel apart** — `ladderGutters(rungs)` assigns the gutters and is the only geometry the component computes. h **260**. **Not blue.** Fixture, [C11](#c11--figure-numbers-settled)'s four rungs on a 0→$320 axis with ticks at `$0 $100 $200 $300`: band `$150–250` *what practices say they'd pay* `[26]` · `$199/mo` *Recall360 starter* `[34]` · `$299/mo` *ChairSync* `[33]` · threshold `~$300/mo` *owner sign-off* `[42]`. citations `[26,33,34,42]`. |
| **GapBar** | `gap-bar.tsx` — `{ a: Side; b: Side; ratio: string; citations: number[] }` where `Side = { label: string; display: string; low: number; high: number; citations: number[] }` | Divs. Two 18px `.ob-fig-bar` spans on a shared scale (`max` = the larger `high`), each drawn as a **range** from `low` to `high`, label above in sans 15px, value printed at the bar end in mono `.ob-fig-value`. One baseline rule at `--ob-grid` under both. `a` fills `--ob-text`, `b` fills `--ob-hairline-strong`. `.ob-gap-ratio` prints the multiple. **h 180. Not blue.** Fixture, from `roiGap(evidence)` ([C11](#c11--figure-numbers-settled)): a = `Lost production, per month` `$2,000–4,000/mo` `[41]`; b = `What a tool like this costs` `$199–299/mo` `[33][34]`; ratio `10–20×`. **Bar b is nearly invisible and that is the finding — no broken axis, no log scale, no inset.** citations `[33,34,41]`. |
| **RunFunnel** | `run-funnel.tsx` — `{ queries: number; pages: number; verified: number; discarded: number; variant?: 'compact' \| 'expanded'; source: {label,href} }` | **One component, two densities** ([C8](#c8--runfunnel)). 4-row grid `132px minmax(0,1fr) auto` — label / `.ob-fig-bar` / value. **Bar width is `value / max(values)` — a share of the largest segment, 47, never of a total. `47 / 65` looks like a pass rate and this product does not publish pass rates.** `compact` = 26px bars, 12px gaps, counts inside; `expanded` = 34px bars, 18px gaps, counts outside with room for A13's per-row line beside it. **h 140 compact · 190 expanded.** **This is the only figure in the kit that contains the accent, and only on the verified row: `.ob-funnel-bar-verified` is `--ob-accent` because the row means *verified*, one of blue's three jobs. `.ob-funnel-bar-discarded` is `--ob-discard`; queries and pages are `--ob-hairline-strong`. There is no red on the discarded row and there never will be.** Row order is fixed `queries · pages · verified · discarded` so discarded sits directly under verified and `47 + 18 = 65` reads as the extraction total. Fixture: `19 / 31 / 47 / 18` → widths `40.43% · 65.96% · 100% · 38.30%`; `source={{ label: 'ALL 65 RECORDS', href: '/r/sms-rebooking-4f2a/sources#the-run' }}`. **Both homes are real: the report's §02 aside renders `compact`, `/sources` §01 renders `expanded`. Neither deletes the other.** |
| **CapabilityMatrix** | `capability-matrix.tsx` — `{ model: MatrixModel; citations: number[] }` | A real `<table>`, `table-layout: fixed`, `<caption class="sr-only">`, columns `240px repeat(4, minmax(0,1fr))`, head row 36px, five body rows at 44px. `border-bottom: 1px solid var(--ob-hairline)` on rows, `--ob-hairline-strong` under the header. **No vertical rules, no gridlines.** Reads `capabilityMatrix(report)` ([C10](#c10--the-analytics-api-frozen-in-a1)) — **five capability keys, three competitor columns of `{key, level, citations[]}` cells, and the idea as a fourth column** ([C7](#c7--capabilitymatrix)). Competitor cell marks, no hue: `yes` = filled 8px square `--ob-text` · `partial` = 8px square, 1px `--ob-text` border, **left half filled** · `no` = 8px square, 1px `--ob-hairline-strong` border, empty · `unknown` = **an em-dash in `--ob-dim`, carrying no hatch and no box.** Every cell also prints the word in `.ob-meta`. **The fourth column is in a different register on purpose:** headed `THIS IDEA` with a `.ob-chip` reading `NOT EVIDENCE`, its cells read `CLAIMED` or `—` with **no square mark at all**, under `.ob-meta`: *"The last column is your brief, not a finding. Nothing in it has been checked."* **That register split is the only thing standing between this figure and a verdict — do not simplify it back into a fourth row of marks.** h **260. Not blue.** Fixture: A10's cell values via the model; citations `[15,16,17,18,19,23,24]`. |
| **DomainConcentration** | `domain-concentration.tsx` — `{ rows: { domain: string; count: number }[]; tailCount?: number; tailLabel?: string; activeDomains?: string[]; onToggleDomain?: (d: string) => void; source: {label,href} }` | Divs, grid `168px minmax(0,1fr) 40px`. Domain in mono 12px `--ob-dim`, truncated with `text-overflow: ellipsis` — **legal here and nowhere else in the build; a truncated hostname loses nothing, a truncated competitor price loses the decision.** `.ob-domain-bar` (also `.ob-fig-bar`) 14px `--ob-text`, width `count / rows[0].count`, count mono right. A `tailCount` renders `.ob-domain-tail`: one strip of hairline-separated ticks with `tailLabel` beneath. **No arbitrary top-N cut and no tie-breaking** — the caller decides where the tail starts. When `onToggleDomain` is supplied each row renders as a `<button aria-pressed>`; **the pressed treatment is a control state (A13, §14) on the row's label and hairline, never a fill on `.ob-domain-bar`** — [C8](#c8--runfunnel) keeps the funnel's verified bar the only accent mark in the figure layer. h `rows.length * 28 + (tailCount ? 32 : 0)` = **396** on this fixture. **Not blue.** Fixture, derived from `domainConcentration(evidence)`: the 13 domains with ≥2 findings (`capterra-like.example` 5 · `billingtalk.example` 3 · `smallpracticeforum.example` 3 · ten at 2), tail 16, `note="31 sources across 29 domains. Nothing here rests on one publisher."` — **with these numbers the figure's job is to show the evidence is *not* concentrated, which is a real finding and the reason it earns its place.** |
| **DimensionStrip** | `dimension-strip.tsx` — `{ cells: { key: Dimension; count: number; max: number; supports: number; neutral: number; contests: number; confidence: Confidence; href: string }[]; source: {label,href} }` | 5-up grid `repeat(5, minmax(0,1fr)); gap: 24px`, with **`.ob-rule-v` between columns — the class that has existed and gone unused since the landing build; this figure is what it was for.** Each cell is an `<a href="#dimension-{KEY}">` containing: the `DIMENSION_SHORT` word in `.ob-meta` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)) · the count at 28px mono `.ob-fig-value` with a `FINDINGS` suffix · a 2px `CoverageBar` scaled to the run's own max · a 6px `StanceBar compact` · `ConfidenceNote`. Wrapped in one `Figure`, caption `EVIDENCE BY DIMENSION`. h **140. Not blue** — `ConfidenceNote` is chalk/muted/dim by A2, and this is the strip where a blue "solid" would be most tempting and most wrong. Fixture: `Problem 14 · 11/1/2 · solid` · `Exists 11 · 6/4/1 · solid` · `Demand 7 · 4/2/1 · mixed` · `Money 13 · 4/6/3 · solid` · `Practical 2 · 0/2/0 · thin`; max 14, counts summing to 47; `source` → `/sources`. |
| **FanOutMeter** | `fan-out-meter.tsx` — `{ governs: number; total: number; stepLabels: string[] }` | Divs. `total` ticks in a row, 3px × 16px, `gap: 3px`; `governs` of them `--ob-text`, the rest `--ob-hairline-strong`; then mono `GOVERNS 3 OF 5 STEPS`. **Fan-out reads as filled mass, which is D14's whole point — a question governing three steps is visibly heavier than one governing one, with no second diagram.** h **40. Not blue.** Wrapped in a `Figure` whose `source` is `{ label: '3 STEPS DEPEND ON THIS', href: '#step-01' }`. Fixture, from `fanOut(roadmap)` over [C6](#c6--openquestion-priority-brief-link-fan-out)'s edges: **Q06 governs 3 of 5** (S01, S03, S04). The five per-question values are `Q01 2 · Q02 1 · Q03 1 · Q04 2 · Q05 1 · Q06 3` and no phase quotes a different set. `total` is 5 — four build steps and the tripwire, which genuinely does depend on its questions. |
| **WeekAxis** | `week-axis.tsx` — `{ weeks: number; children?: ReactNode }` | **CSS, not SVG** — `PlanBar` must share this coordinate space and carries text, and percentage positioning gives that natively where a viewBox does not. `.ob-week-axis` = `position: relative; height: 32px; border-top: 1px solid var(--ob-grid)`. One `.ob-week-tick` per week at `left: calc((i - 1) / weeks * 100%)`, 1px × 6px `--ob-grid`, with a `.ob-week-label` `.ob-meta` beneath. **Weeks are 1-indexed and `weeks` comes from `planHorizon(roadmap)` — 12 ([C5](#c5--the-roadmap-week-model-librun-plants)); the horizon is not restated here and not passed as a literal.** `children` render into `.ob-week-lanes` beneath, sharing the box. h **32 + lanes. Not blue.** **The content box is 1120px inside `.ob-container`, so a track is 93.33px, not 100** — every assertion about this axis is a **ratio**, never a pixel. |
| **PlanBar** | `plan-bar.tsx` — `{ label: string; startWeek: number; durationWeeks: number \| null; horizon: number; phase: RoadmapPhase; dependencies: string[]; href?: string }` | Divs. `.ob-plan-lane` 36px tall; `.ob-plan-bar` at `left: (startWeek - 1) / horizon * 100%`, width `duration / horizon * 100%`, `--ob-surface` fill, 1px `--ob-hairline-strong`, `--ob-r-tag`, label inside at 14px `--ob-text` with a `title` for the overflow case, dependencies as a mono `Q01 Q03` suffix. **`durationWeeks === null` is open-ended ([C5](#c5--the-roadmap-week-model-librun-plants))**: the bar runs from its start to the axis end and its right edge dissolves under a `mask-image: linear-gradient(to right, #000 60%, transparent)` — no hard stop under the words "ongoing, demand-driven", and no invented end week. **`phase === 'LATER_AND_ONLY_IF'` additionally draws the bar with the shared hatch — conditional work is not committed work, and the hatch says so without inventing a colour.** h **44 per lane. Not blue.** Fixture, from `planSpans(roadmap)`: `Before you build` W1 ×2 · `First thing to build` W3 ×4 · `Then` W7 ×5 · `Later, and only if` W12 open-ended *hatched + dissolved*. **Four bars, never five — the fifth step is the tripwire, which D13 lifts off the axis into `TripwirePanel`, and the count is `4 BUILD STEPS · 1 TRIPWIRE` everywhere it is printed.** `isOnAxis(step)` is the only test for whether a step gets a bar. |

**The stance treatment, defined once in §4 and used by everything** ([C12](#c12--shared-class-names)):
```css
.ob-stance-supports { background: var(--ob-text); }
.ob-stance-neutral  { background: var(--ob-hairline-strong); }
.ob-stance-contests { background-color: transparent;
                      border: 1px solid var(--ob-text);
                      background-image: repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px); }
```
**Stance is expressed by fill treatment, never by hue — there is no red in this system and blue is spent on action, verification and live state.** These three classes are the single definition, and the hatch is the single geometry [C12](#c12--shared-class-names) fixes: `StanceBar`'s segments here, `Figure`'s `stance` treatment, `PlanBar`'s conditional bar, **A5's `.ob-stance-mark` and A13's row marks all compose them and none redefines them.** `.ob-stance-bar` is this figure's container and `.ob-stance-mark` is A5's inline mark — two names, two owners, one set of fills, no collision. **The word always accompanies the mark**; a swatch alone is a legend nobody read.

**`styles/obsidian-app.css` §4 `FIGURES`, exactly.** One banner, three comment sub-heads inside it.

*Frame and shared marks:* `.ob-fig` `.ob-fig-cap` `.ob-fig-mark` `.ob-fig-foot` `.ob-fig-note` `.ob-fig-cite` `.ob-fig-cite-n` `.ob-fig-value` `.ob-fig-bar` `.ob-fig-axis` `.ob-fig-baseline` `.ob-stance-supports` `.ob-stance-neutral` `.ob-stance-contests` `.ob-stance-key` `.ob-stance-key-item` `.ob-stance-swatch` `.ob-cell-yes` `.ob-cell-partial` `.ob-cell-no` `.ob-cell-unknown`.

**`.ob-fig-value` and `.ob-fig-bar` are marker classes carried *in addition* to each mark's own class** — `.ob-callout-value .ob-fig-value`, `.ob-funnel-bar .ob-fig-bar`, and so on. They exist so A10's numeral scrape and bar sampling and A14's figure audit select real nodes instead of returning an empty list and passing vacuously. **Every rendered numeral inside a mark carries `.ob-fig-value`; every bar carries `.ob-fig-bar`. No exceptions, and the exit test counts them.** `.ob-cell-unknown` is the em-dash cell — `--ob-dim`, no box, no hatch.

*The marks:* `.ob-callout` `.ob-callout-value` `.ob-callout-unit` `.ob-callout-label` `.ob-callout-lead` · `.ob-stance-bar` `.ob-stance-seg` `.ob-stance-compact` · `.ob-recency` `.ob-recency-bounds` · `.ob-ladder` `.ob-ladder-axis` `.ob-ladder-rung` `.ob-ladder-band` `.ob-ladder-threshold` `.ob-ladder-label` `.ob-ladder-value` · `.ob-gap` `.ob-gap-row` `.ob-gap-track` `.ob-gap-fill` `.ob-gap-fill-alt` `.ob-gap-ratio` · `.ob-funnel` `.ob-funnel-row` `.ob-funnel-bar` `.ob-funnel-bar-verified` `.ob-funnel-bar-discarded` `.ob-funnel-expanded` · `.ob-matrix` `.ob-matrix-head` `.ob-matrix-cell` `.ob-matrix-idea` · `.ob-domains` `.ob-domain-row` `.ob-domain-bar` `.ob-domain-tail` · `.ob-dimstrip` `.ob-dimstrip-col` · `.ob-fanout` `.ob-fanout-tick` `.ob-fanout-tick-on` · `.ob-week-axis` `.ob-week-tick` `.ob-week-label` `.ob-week-lanes` · `.ob-plan-lane` `.ob-plan-bar` `.ob-plan-bar-conditional` `.ob-plan-bar-open` `.ob-plan-deps`.

**No `@keyframes` are added in §4. Nothing in the figure kit moves in this phase** — so A3 writes no reduced-motion rule either. A10 adds the report's bar reveal and count-up and owns their end states in §16 ([C1](#c1--stylesobsidian-appcss-the-section-map)); A13 owns the funnel count-up's JS branch. **A3 introduces no component or module name absent from the naming contract.**

**Exit test:** with `next dev` running, drive `/style-guide#figures` with the Playwright MCP at 1440×900 and 1280×800, with all twelve marks rendered from the real fixture through `lib/db/queries.ts`. (1) **Reserved height, the headline claim:** for every `.ob-fig-mark`, `getBoundingClientRect().height` equals the value of `--ob-fig-h` on that node exactly, at both viewports, and every one of those values is a member of the exported `FIG_H` — a mark that overflows its reservation is a layout shift waiting for A9. (2) **Blue audit:** across `#figures`, the only element computing `rgb(45, 127, 249)` on any of `color`, `backgroundColor` or `borderTopColor` is the funnel's verified bar. Every other hit fails the phase — and note no domain row is pressed on this page, so the assertion is exact. (3) **Stance treatment:** `getComputedStyle('.ob-stance-contests').backgroundImage` contains `repeating-linear-gradient` and its `backgroundColor` is `rgba(0, 0, 0, 0)`; `.ob-stance-supports` is `rgb(244, 244, 245)`. Then scan every element for a red-dominant `rgb(r,g,b)` (`r > g + 40 && r > b + 40`) — the result must be empty. (4) **Marker classes are populated:** `document.querySelectorAll('.ob-fig-value').length >= 20` and `document.querySelectorAll('.ob-fig-bar').length >= 12`; an empty list here is the vacuous-pass failure A10 and A14 inherit. (5) **The numbers are the settled ones:** scrape `[...document.querySelectorAll('.ob-fig-value')].map(n => n.textContent)` and assert it contains `14.2%`, `0 of 9`, `$150–250`, `$199/mo`, `$299/mo`, `~$300/mo`, `$2,000–4,000/mo`, `$199–299/mo`, `10–20×`, `19`, `31`, `47`, `18` — and contains **none** of `$3,000`, `$200`, `15×`, `6.7×`, `13.4×`. (6) **Funnel axis:** the four bars' widths divided by `.ob-fig-mark`'s width equal `19/47`, `31/47`, `1`, `18/47` within 0.5%; render the `expanded` variant beside it and assert the same four ratios. (7) **Week axis, ratios not pixels ([C5](#c5--the-roadmap-week-model-librun-plants)):** twelve `.ob-week-tick`s; `document.querySelectorAll('.ob-plan-bar').length === 4`; for each bar, `width / markWidth` equals `duration / 12` within 0.5% and `left / markWidth` equals `(start - 1) / 12` within 0.5%; the open-ended bar reports a non-`none` `maskImage`; no bar carries the tripwire's label. (8) **The idea column is a different register:** inside the `THIS IDEA` column, `querySelectorAll('.ob-cell-yes, .ob-cell-partial, .ob-cell-no').length === 0`, its cells' text is only `CLAIMED` or `—`, and the `NOT EVIDENCE` chip is present. (9) **No chart furniture:** no element inside any `.ob-fig-mark` has a computed border or background matching `--ob-grid` except `.ob-fig-baseline`, `.ob-ladder-axis` and `.ob-week-axis`. (10) **Numerals:** `getComputedStyle` on any numeral inside a `.ob-fig` reports `font-variant-numeric: tabular-nums` by inheritance. (11) **SVG strokes:** read the rendered width of a `.ob-recency line` at both viewports — approximately 1 CSS pixel at each; a value that changes between 1440 and 1280 means `vector-effect` is missing. (12) **Every figure is sourced in the DOM:** every `.ob-fig` contains either a `.ob-fig-cite-n` or a `.ob-fig-cite` anchor. (13) **Nothing moves:** `page.emulateMedia({ reducedMotion: 'reduce' })`, reload, wait 1200ms, and assert every element under `#figures` reports `animationName: 'none'`; then reset to `no-preference` and assert the same, because this phase's kit is static under both. (14) `npx vitest run tests/unit/figures.test.ts` proves `assertFigureSourced` throws for `{ citations: [], source: undefined }`, passes for either alternative, and pins `barShare` and `ladderGutters`. (15) `browser_console_messages level:"error"` returns zero **at both 1440 and 1280**, then `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` ([C14](#c14--every-exit-test-ends-the-same-way)).

---

## A4 — Run chrome: sticky header, honest stage state

**Goal:** every `/r/[slug]/*` page is framed by an Obsidian header that is genuinely fixed, condenses on scroll exactly the way the landing nav does, tells you which stage you are actually on, and carries a persistent way into the evidence layer from any page. When this phase is done the chrome is finished and never touched again; the page bodies below it are still Deep Canopy and that is fine.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` §7 (performance) and §6 (reduced motion), `references/pitfalls.md` §5 and §11, `references/verification.md` §3 and §4, `components/landing/site-nav.tsx`, `styles/obsidian.css` §6, and — before anything else — [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C5](#c5--the-roadmap-week-model-librun-plants), [C9](#c9--discards), [C10](#c10--the-analytics-api-frozen-in-a1), [C13](#c13--ownership-of-things-two-phases-both-wanted), [C14](#c14--every-exit-test-ends-the-same-way). Verify `useSelectedLayoutSegment`'s import path and return value against `node_modules/next/dist/docs/` before writing it (AGENTS.md — this is not the Next.js you know).

**Build:**
- `styles/obsidian-app.css` **§5 `RUN CHROME`** — fill A0's empty banner ([C1](#c1--stylesobsidian-appcss-the-section-map)). Do not create the file, do not add a banner, do not renumber. Class list below.
- `components/layout/run-header.tsx` — new `RunHeader`, the chrome's only scroll-aware component.
- `components/layout/run-identity.tsx` — new `RunIdentity`.
- `components/layout/run-main.tsx` — new `RunMain`, a client leaf that reads the active segment and stamps `<main>`. *Add to the naming contract.*
- `components/layout/evidence-button.tsx` — new `EvidenceButton` (D16). Chrome, so `components/layout/`, not `components/validate/`.
- `components/layout/evidence-overlay.tsx` — new `EvidenceOverlay`, the full-height Radix Dialog the button opens. *Add to the naming contract.*
- `components/layout/app-backdrop.tsx` — new `AppBackdrop`, the per-page ambient field ([C13](#c13--ownership-of-things-two-phases-both-wanted)). *Add to the naming contract.*
- `components/layout/run-shell.tsx` — rewritten. Stays a **server** component.
- `components/layout/stage-rail.tsx` — rewritten, now a client leaf.
- `components/layout/wordmark.tsx` — rewritten to the Obsidian mark + `Groundwork` (D2), gains `size?: 'md' | 'sm'`.
- `components/landing/site-nav.tsx` — swaps its inline `Mark()` for the shared `Wordmark` (which renders A2's `LogoMark`). **One glyph definition in the repo, and one phase editing this file** — A2 re-authors `LogoMark` and deliberately leaves the call site to A4. This touches `/`; it is a pure refactor and the exit test measures that `/` did not move (verification.md §8).
- `components/layout/run-footer-bar.tsx` — restyled.
- `components/ui/skip-link.tsx` — `className` becomes `ob-skip` (R19).
- `app/page.tsx` — its hand-rolled `<a href="#main" className="ob-skip">` becomes `<SkipLink />`.
- `lib/run-stage.ts` — new signature and derivation (D19).
- `tests/unit/run-stage.test.ts` — rewritten to the three-argument signature ([C13](#c13--ownership-of-things-two-phases-both-wanted)). Cases listed below.
- `lib/hooks/use-run-progress.ts` — new `useRunProgress(slug)`. *Add to the naming contract.*
- `lib/hooks/use-scroll-spy.ts` — R16 fix plus a derived inset.
- `lib/content/app.ts` — the `APP_CHROME` strings listed below.
- `app/r/[slug]/layout.tsx` — one `Promise.all`, `getDiscarded` wired ([C9](#c9--discards)), the four per-segment meta arrays, `SkipLink` mounted.
- `app/r/[slug]/{define,validate,roadmap,sources}/page.tsx` — one line each: `<AppBackdrop variant="…" />` as the page's first child.
- `components/validate/evidence/evidence-context.tsx` — gains the `layer` union, `openExplorer`, `closeExplorer`, and the `discarded` prop. **A5 owns the rest of the provider's shape.**

**Notes:**

- **A4 declares no tokens and creates no stylesheet** ([C2](#c2--foundation-ownership)). `--ob-header-h: 72px`, `--ob-header-h-condensed: 56px`, `--ob-container-app: 1360px` and `--ob-anchor-inset: 136px` already exist; this phase asserts their computed values in the exit test and moves on. If one is missing, A0 did not finish — stop and fix A0 rather than declaring it here.
- **A4 writes no `scroll-margin-top` rule at all.** A0 §1 owns the single anchor rule, `main [id] { scroll-margin-top: var(--ob-anchor-inset) }` at 136px ([C2](#c2--foundation-ownership)), and the `#main` skip target beside it. Three phases previously wrote competing insets at three values and the earliest won on specificity (pitfalls §11). A4's contribution is to make the number *true*: 136 = 56px condensed header + 48px sticky `SectionIndex` (A9) + 32px of air, and this phase is what makes the header genuinely fixed so that arithmetic describes something real. **A4 asserts 136px; it does not raise, lower, or re-target it.**
- **The shell element is A0's `.ob-app`, not a second class** ([C15](#c15--the-shell-vocabulary-and-where-the-headers-height-is-held)). `RunShell` renders `<div className="ob-app">`; `<main id="main" className="ob-app-main">`. §5 adds only variant rules on top (`main.ob-app-main[data-chrome='surface']`), so A0's §1 classes have a consumer and there is no parallel `.ob-run-shell` vocabulary. Everything else in the chrome is `.ob-run-*`.
- **The header is `position: fixed`, and a constant-height spacer holds its place.** `.ob-run-header` is `fixed; top:0; left:0; right:0; z-index:50`; `.ob-run-header-spacer` is a sibling `aria-hidden` div at a permanent `height: var(--ob-header-h)`. Condensing therefore reflows nothing below it — standing rule 12 survives a header that changes height. It is also what makes Define's `calc(100vh - var(--ob-header-h) - 96px)` arithmetic in A6 exact rather than approximate.
- **Port the `SiteNav` mechanism verbatim:** one `useEffect`, one `requestAnimationFrame` guard variable, one `{ passive: true }` scroll listener, `setScrolled(window.scrollY > 24)`, `read()` called once immediately so a mid-page reload starts condensed. **React must never re-render on scroll beyond that single boolean** — no scroll position in state, no transform written from React, nothing else in the effect. Everything visual hangs off `data-scrolled` in CSS.
- `.ob-run-header` transitions `height var(--ob-base) var(--ob-ease)` 72px → 56px, and at `[data-scrolled='true']` gains `border-bottom: 1px solid var(--ob-hairline)`, `background: var(--ob-scrim)`, `backdrop-filter: blur(14px)`. At rest it is fully transparent with no border — the page owns the top of the screen until you move.
- **The 16px the header loses is the mono meta layer folding away.** `.ob-run-meta` transitions `max-height` 18px → 0 and `opacity` 1 → 0 over `--ob-base`. That is the only `height`/`max-height` animation permitted in this build; it is one element inside a fixed bar and nothing below it can move.
- Check pitfalls §5 before believing any of this: **if A0 left `overflow-x: clip` on the global root when it promoted Obsidian to `:root`, sticky and fixed positioning both go strange.** Keep `overflow-x: clip` scoped to the landing hero section only. Verify by walking ancestors of `.ob-run-header` collecting any with `overflow !== 'visible'` — the list must be empty.
- **Header grid.** `.ob-run-header-inner` = `.ob-container-app` width (`max-width: var(--ob-container-app)`, `padding-inline: var(--ob-gutter)`, `margin-inline: auto`), `display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; gap: 32px; height: 100%`. Left `RunIdentity`, centre `StageRail`, right `.ob-run-actions { justify-self: end; display:flex; align-items:center; gap: 12px }` holding `EvidenceButton` then the `CopyLinkButton` node.
- **`RunHeader` is the client boundary, and `CopyLinkButton` is passed through it, not rendered by it.** `CopyLinkButton` is an async server component that reads `headers()`; a client component cannot render one. Signature:
  ```ts
  RunHeader({ slug, status, oneLiner, metaBySegment, copyLink, verifiedCount, discardedCount }: {
    slug: string; status: RunStatus; oneLiner: string;
    metaBySegment: Record<RunSegment, string[]>;
    copyLink: ReactNode;              // <CopyLinkButton slug={slug} />, server-rendered in the layout
    verifiedCount: number; discardedCount: number;
  })
  ```
  It calls `useSelectedLayoutSegment()` once and derives `segment: RunSegment = 'define' | 'validate' | 'roadmap' | 'sources'` from it, defaulting to `'validate'` if the hook returns `null`. That one read feeds the meta selection, `StageRail`'s `segment`, and nothing else. **`RunShell` stays a server component and the four page bodies stay server-rendered** — they arrive as `children` and pass straight through (standing rule 22: the boundary is at the chrome, not the page).
- **`RunMain`** — `'use client'`, four lines: `useSelectedLayoutSegment()` → `<main id="main" className="ob-app-main" data-chrome={segment === 'define' ? 'surface' : 'document'} data-segment={segment}>{children}</main>`. Children are server-rendered and passed as props; nothing under `/r/[slug]/*` joins the client bundle because of this file.
- **Which pages get a footer, and how it is suppressed without a second segment read.** `main.ob-app-main[data-chrome='surface'] { height: calc(100vh - var(--ob-header-h)); overflow: hidden }` and `main[data-chrome='surface'] ~ .ob-run-footer { display: none }`. **Define is a working surface with no page scroll (D9), and a 64px footer under a `100vh` column would reintroduce exactly the scrollbar D9 removes.** Validate/Roadmap/Sources are documents and keep it. Validate's Mode A console keeps the footer for now; A8 decides whether to suppress it and logs the answer. The general-sibling selector works because `RunFooterBar` always follows `<main>` in `RunShell`'s output — keep that order.
  `.ob-run-footer` = `border-top: 1px solid var(--ob-hairline)`, `.ob-container-app`, `display:flex; align-items:center; justify-content:space-between; height:64px`. Left `<span className="ob-meta">RUN sms-rebooking-4f2a</span>`; right a `flex gap-6` of `CopyLinkButton` and `<Link className="ob-btn ob-btn-bare">Start another idea <span className="ob-arrow">→</span></Link>`.
- **`AppBackdrop` — atmosphere is the page's, not the shell's ([C13](#c13--ownership-of-things-two-phases-both-wanted)).** `AppBackdrop({ variant }: { variant: RunSegment })` renders exactly `<div className="ob-backdrop" data-variant={variant} aria-hidden="true" />`. The recipe already exists in `styles/obsidian.css` §1 (two drifting radial blooms at 34s and 52s — ambient, legal under D17) and **is not redefined here**; §5 carries only the four `data-variant` offset rules, which shift the blooms so four pages don't share one composition. They land later in source order in the same layer at equal specificity, so they win over the base rule — measure it rather than trusting it. A4 adds the element to each of the four page files as their first child and each page phase keeps it, changing only `variant`. **The layout cannot see the segment, so the layout does not mount it** — and this is what A8 removes the console's `<Orb dimmed />` in favour of, so the console is never left with no atmosphere at all (standing rule 14). `Orb` itself survives on the invalid-run page until A14 decides ([C13](#c13--ownership-of-things-two-phases-both-wanted)).
- **`RunIdentity`** — `RunIdentity({ slug, oneLiner, metaParts }: { slug: string; oneLiner: string; metaParts: string[] })`, server component. Two stacked lines: row one is `<Wordmark size="sm" />` + `<hr className="ob-rule-v" />` + the one-liner; row two is `<MetaLine parts={metaParts} className="ob-run-meta" />`. `.ob-run-oneliner` is `font-size: var(--ob-sm); color: var(--ob-text); letter-spacing: var(--ob-tracking-snug); max-width: 46ch; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`, and carries `title={oneLiner}` so a sighted user can recover the full string. **No `aria-label` — CSS truncation does not truncate the accessibility tree, so the full text is already announced; adding one would duplicate it.** `.ob-rule-v` already exists in `styles/obsidian.css`; do not redeclare it.
- `Wordmark` renders **`<LogoMark />`** (A2's re-authored surveyed square — `rect 0.5,0.5,14,14 stroke` + `rect 1,9,5,5 fill`, `currentColor`) beside the word **`Groundwork`** (D2). It does not inline its own copy of the glyph. `size="md"` → 18px, `size="sm"` → 16px. It keeps `.ob-wordmark` and the 90°-on-hover glyph rotation. `LogoMark` and the string `IdeaBrief` survive nowhere in the chrome after this phase; the file itself is deleted in A15 with the rest of Deep Canopy.
- **`StageRail` becomes honest (D19), and that means it becomes a client leaf.** New signature:
  ```ts
  StageRail({ slug, status, segment }: { slug: string; status: RunStatus; segment: StageKey | 'sources' })
  ```
  `lib/run-stage.ts` gains `export type StageKey = 'define' | 'validate' | 'roadmap'`, `export type RunSegment = StageKey | 'sources'`, `export interface RunProgress { briefApproved: boolean; briefTouched: boolean }`, and
  ```ts
  getStageStates(status: RunStatus, segment: RunSegment, progress: RunProgress | null): StageStates
  ```
  Derivation, exactly: build `reach = { define: true, validate: status !== 'define' || progress?.briefApproved === true, roadmap: status === 'complete' }`, then for each key `k` — `k === segment` → `'active'`; `!reach[k]` → `'locked'`; otherwise `'done'`. **`progress` only ever adds reachability, never removes it.** That single property is what makes the cold shared link safe: a recipient with an empty `localStorage` gets the `status`-only floor, which for the `complete` fixture is all three reachable, so they see exactly what the owner sees minus the "you are here", which they get from their own URL. It is also why the first client paint can match SSR (`progress = null` on both sides) and then widen without a hydration mismatch — the same pattern `useRecentRuns` already uses, where SSR is always `[]`. `resolveRunRedirect(status)` is unchanged.
- **`tests/unit/run-stage.test.ts`, rewritten ([C13](#c13--ownership-of-things-two-phases-both-wanted)).** The file exists today and asserts the one-argument form; from this session on, `npm test` is a gate every later phase depends on, so it is updated here and not discovered broken in A6. Cases, exactly: `('define', 'define', null)` → `active/locked/locked`; `('validating', 'validate', null)` → `done/active/locked`; `('complete', 'roadmap', null)` → `done/done/active`; `('complete', 'sources', null)` → `done/done/done` **and no key is `'active'`**; the cold-link floor `('define', 'validate', null)` → validate `'locked'` while `('define', 'validate', { briefApproved: true, briefTouched: true })` → validate `'active'`; and the monotonicity property — for every `(status, segment)` pair, no key that is non-`locked` at `progress = null` becomes `locked` with a progress object. Keep the existing `resolveRunRedirect` case unchanged.
- `lib/hooks/use-run-progress.ts` — `useRunProgress(slug: string): RunProgress | null`. Returns `null` until an effect runs, then `{ briefApproved: readBriefPatch(slug)?.approvedAt != null || readRunStartedAt(slug) !== null, briefTouched: readBriefPatch(slug) !== null }`, whole thing in `try/catch` (storage may be disabled). `readBriefPatch` and the `sv.brief.<slug>` key are A1's, to the signature in [C4](#c4--the-brief-state-libbrief-statets); `readRunStartedAt` is the existing `app/actions/create-run.ts` export and remains the pre-A7 fallback, so a run approved before the brief patch existed still reads as approved.
- **`'use client'` on `StageRail` is logged, and costs nothing** — `RunHeader` is already a client component and the rail is its child. This is standing rule 22 working as intended: the boundary is at the leaf that actually needs `localStorage`.
- **Stage segment treatment.** `<nav aria-label="Run stages"><ol className="ob-stage-rail">`, each item `<li>` containing either `<Link className="ob-stage" data-state="done|active" aria-current={active ? 'page' : undefined}>` or, when locked, `<span className="ob-stage" data-state="locked" title={hint}>`. Each carries `<span className="ob-stage-node" aria-hidden />` + `<span className="ob-stage-label">`.
  - Node is a **7px square, never a circle or a pill** (rule 8, and it matches the wordmark's language): `locked` = transparent with `1px solid var(--ob-dim)`; `done` = solid `var(--ob-muted)`; `active` = solid `var(--ob-accent)`.
  - `.ob-stage-label` is the mono meta layer — 12px, `var(--ob-weight-meta)`, `+0.1em`, `text-transform: uppercase`. Copy strings stay title case in `lib/content/app.ts`; CSS uppercases them.
  - `active` → label `var(--ob-text)`, `border-bottom: 1px solid var(--ob-accent)` (1px, not Deep Canopy's 2px). **This is blue doing job three: live/active, "you are here." Nothing else in the chrome is blue except the evidence mark.**
  - `done` → label `var(--ob-muted)`; `:hover` → `var(--ob-text)` + `border-bottom-color: var(--ob-hairline-strong)`.
  - `locked` → label `var(--ob-dim)`, `cursor: default`, **and no `:hover` rule exists for it at all.** Not a disabled link, not `aria-disabled`, no pointer feedback. Only the `title`.
  - `:focus-visible` on `.ob-stage` uses the system ring and snaps: `outline: none; transition: none; box-shadow: 0 0 0 2px var(--ob-canvas), 0 0 0 4px var(--ob-accent)`.
  - Locked hints, verbatim: validate `"Approve the brief to unlock Validate."`, roadmap `"Finish the research to unlock the roadmap."` **Define's hint is deleted — Define is the run's origin and is never locked.**
  - On `/sources`, no segment is active and none is aria-current. Sources is not a stage; it is the evidence layer (D16).
- **`EvidenceButton` (D16).** `EvidenceButton({ verifiedCount, discardedCount }: { verifiedCount: number; discardedCount: number })`, client leaf calling `openExplorer()` from `useEvidence()`. Visible copy is `` `${verifiedCount} VERIFIED` `` → **`47 VERIFIED`**. It is **not** an `.ob-btn` — a pill in the chrome would compete with the page's one `.ob-btn-primary`. `.ob-evidence-btn` = `inline-flex; align-items:center; gap:8px; padding:6px 12px; border:1px solid var(--ob-hairline); border-radius: var(--ob-r-tag); background: transparent`, mono meta type, `color: var(--ob-muted)`. Inside, `.ob-evidence-btn-mark` is a 6px `var(--ob-accent)` square. **That square is blue doing job two: verification. Name it out loud in the build log.** Hover → `border-color: var(--ob-hairline-accent); color: var(--ob-text)`. `:active` → `transform: scale(0.98)`. `:focus-visible` → the snapping ring.
  ARIA: `type="button"`, `aria-haspopup="dialog"`, `aria-expanded={explorerOpen}`, `aria-controls="evidence-explorer"`, and `aria-label={`Open evidence — ${verifiedCount} verified, ${discardedCount} discarded`}` because the visible text alone reads as a statistic, not a control.
- **It opens a full-height overlay, not a route push, and `/r/[slug]/sources` still exists.** The justification, recorded here so A13 doesn't relitigate it: D16 says evidence is *a layer available everywhere, not a fifth destination*, and a route push makes it exactly the fifth destination while throwing away the reader's scroll position mid-report. Interaction depth stays at one (button → explorer) and is independent of the chip → popover → drawer path that is already three deep. Closing with Esc returns you to the same pixel. The route remains the linkable, shareable, crawlable form of the same composition, and A13 builds `EvidenceExplorer` once and mounts it in both.
  `EvidenceOverlay` is a Radix `Dialog` at `inset: 0` (`.ob-evidence-overlay`: `background: var(--ob-canvas)`, a `.ob-run-header`-height top bar `.ob-evidence-overlay-head` carrying the title `"Everything we checked"` and an `IconButton` close, body scrolls). **Until A13 its body renders today's `SourcesList`** — a real, working overlay now, with a one-component swap later. The overlay chrome does not change in A13.
- **Coexistence with `EvidenceDrawer`: they are mutually exclusive by construction, not by two booleans.** A4 replaces `openId: string | null` in `EvidenceProvider` with a discriminated union, which A5 extends with `{ kind: 'discarded'; id }`:
  ```ts
  export type EvidenceLayer =
    | { kind: 'none' }
    | { kind: 'finding'; id: string }
    | { kind: 'explorer' };
  ```
  `openExplorer()` sets `{kind:'explorer'}`; `open(n)` sets `{kind:'finding'}`. Two stacked modals are structurally impossible. **A5 owns the rest of the provider's shape — `scope`, `position`, `seenIds`, `openDiscarded`; A4 adds only the union, `openExplorer`, `closeExplorer`, and threads the `discarded` prop through.**
- **The run layout, in full.** One `Promise.all([getRun, getRunSummary, getEvidence, getDiscarded, getRoadmap])` — five fixture reads, all through `lib/db/queries.ts`, none of them a network call. `getDiscarded(slug)` is wired **here** and its 18 records are passed to `<EvidenceProvider evidence={evidence} discarded={discarded}>`; this is one of the two required call sites and A13's page is the other ([C9](#c9--discards)). Without it A5's provider shape cannot be satisfied at all.
- **`MetaLine` is A2's** — `parts: string[]`, joined on `META_SEPARATOR` (` · `, A0's constant), no `nowrap`/ellipsis triple. A4 asserts the middot form in its exit test and changes nothing about the component. Per-segment parts are built server-side by `buildMetaParts(run, segment)` in `app/r/[slug]/layout.tsx`, called once per segment into a `Record<RunSegment, string[]>` that `RunHeader` selects from:

  | segment | parts |
  |---|---|
  | `define` | `RUN sms-rebooking-4f2a` · `DRAFT` · `STARTED 09:12` |
  | `validate` | `RUN sms-rebooking-4f2a` · `RESEARCHED 14 AUG 2026` · `47 VERIFIED` · `31 SOURCES` |
  | `roadmap` | `RUN sms-rebooking-4f2a` · `RESEARCHED 14 AUG 2026` · `4 BUILD STEPS` · `1 TRIPWIRE` |
  | `sources` | `RUN sms-rebooking-4f2a` · `47 VERIFIED` · `18 DISCARDED` · `29 DOMAINS` |

  **`4 BUILD STEPS · 1 TRIPWIRE`, per [C5](#c5--the-roadmap-week-model-librun-plants), and it is derived, not typed:** `roadmap.steps.filter(isOnAxis).length` and `roadmap.steps.length - onAxis` (`isOnAxis` is [C10](#c10--the-analytics-api-frozen-in-a1)'s, in `lib/run-plan.ts`). "Five build steps" is false — D13 lifts the tripwire off the axis — and this row sits 72px above A11's page MetaLine, which reads the same two numbers. `29 DOMAINS` is `domainConcentration(evidence).length` ([C10](#c10--the-analytics-api-frozen-in-a1)); `18 DISCARDED` and `47 VERIFIED` come from `getRunSummary`.
  **The header meta is the run's static ledger and nothing else.** It does not branch on stream state and it does not carry the live brief count — anything the user can change while looking at it belongs on the page, not in the chrome. It also does not duplicate a number the page directly below already prints: **A8's proposed fifth part `18 DISCARDED` on the `validate` row is declined here**, because A9's report carries its own MetaLine with that count and the roadmap's step-count collision is the exact defect [C5](#c5--the-roadmap-week-model-librun-plants) had to settle. The discard count lives on the `sources` row and in `EvidenceButton`'s `aria-label`.
- **`SkipLink` mounted (R19).** First child inside `RunShell`, before `RunHeader`, targeting `#main`. `.ob-skip` in `styles/obsidian.css` §6 gains `z-index: 70` so it lands above the header's 50. `app/page.tsx` drops its hand-rolled anchor in favour of the component — one definition.
- **`useScrollSpy` — R16, and the inset recalibration.** Two changes, both inside the hook so no caller has to be disciplined:
  1. **The effect depends on the ids' *value*, not the array's identity.** `const key = ids.join('|')`, effect dependency `[key]`, and the id list is reconstructed inside the effect from `key.split('|')` so nothing closes over the unstable `ids` reference. `SectionIndex`'s `items.map(...)` can keep passing a fresh array every render and the listeners are registered exactly once.
  2. The inset is **derived from the same token the anchor landing uses**, so the two cannot disagree:
     ```ts
     const SPY_FALLBACK = 136;
     function topInset(): number {
       const raw = getComputedStyle(document.documentElement)
         .getPropertyValue('--ob-anchor-inset').trim();
       return Number.parseFloat(raw) || SPY_FALLBACK;   // 136 today
     }
     ```
     Read once per effect run and again on `resize`. The comparison carries the slack instead of a second constant: `if (element.getBoundingClientRect().top - inset <= 1) current = element;` — **1px absorbs the sub-pixel rounding a `scrollIntoView` landing produces, which is the sibling bug R16 was about.** A section that has just been scrolled to lands at exactly the inset and is therefore unambiguously active. A9 asserts `topInset() === 136` and will find nothing to fix. R9 is closed by the header now genuinely being fixed — the inset finally describes something true. The "atBottom" branch and the returned optimistic setter are unchanged.
- **§5's class list, exactly** — so A15's reduce-completeness diff has something to grep against: `.ob-run-header` `.ob-run-header-inner` `.ob-run-header-spacer` `.ob-run-actions` `.ob-run-identity` `.ob-run-oneliner` `.ob-run-meta` `.ob-stage-rail` `.ob-stage` `.ob-stage-node` `.ob-stage-label` `.ob-evidence-btn` `.ob-evidence-btn-mark` `.ob-evidence-overlay` `.ob-evidence-overlay-head` `.ob-run-footer`, plus the variant selectors `main.ob-app-main[data-chrome]`, `main[data-chrome='surface'] ~ .ob-run-footer` and `.ob-backdrop[data-variant]`. **§5 declares no `@keyframes`** — the condense is a transition, not an animation. Had it needed one it would be `ob-app-`-prefixed ([C1](#c1--stylesobsidian-appcss-the-section-map)); an unprefixed name here silently replaces a landing keyframe of the same name on every route.
- **Reduced motion is the one place here where you do *not* skip the listener.** The condense is a state change, not motion; the rAF listener attaches regardless. The app-side reduce home is `obsidian-app.css` **§16**, owned by A15 with A0's seed ([C1](#c1--stylesobsidian-appcss-the-section-map)) — **A4 writes nothing into it.** Handoff, recorded here and in the build log so A15's completeness diff can tick them off: `.ob-run-header` and `.ob-run-meta` need **no explicit end state**, because both properties are driven entirely by `data-scrolled` and the blanket's zeroed durations land them on whichever state the attribute names. The header simply snaps between 72 and 56. That is correct.
- Copy added to `lib/content/app.ts` under an `APP_CHROME` banner: `stages: [{ key:'define', label:'Define' }, { key:'validate', label:'Validate' }, { key:'roadmap', label:'Roadmap' }]`, `lockedHints: { validate: 'Approve the brief to unlock Validate.', roadmap: 'Finish the research to unlock the roadmap.' }`, `evidenceButtonSuffix: 'VERIFIED'`, `explorerTitle: 'Everything we checked'`, `footerAction: 'Start another idea'`, `skipLabel: 'Skip to content'`, `copyLinkLabel: 'Copy link'`. Strings only — never a class name (A0's rule: `lib/` is outside Tailwind's `content` glob).

**Exit test:** With `next dev` running, drive the **Playwright MCP** at 1440×900 to `/r/sms-rebooking-4f2a/validate`. **Measure the stickiness, don't look at it:** `.ob-run-header`'s `getBoundingClientRect().top` must be `0` both at scroll 0 and after `window.scrollTo(0, 1200)`; its computed `height` must read `72px` at rest and `56px` after `scrollTo(0, 400)` plus a 500ms wait (past `--ob-base` — reading earlier returns a partially interpolated value, pitfalls §7); `dataset.scrolled` must be `"true"`; `borderBottomColor` must resolve to `rgb(35, 35, 38)` and not `rgba(0, 0, 0, 0)`; `backdropFilter` must contain `blur(14px)`. Prove zero shift: `.ob-run-header-spacer` height is `72px` at both scroll positions and `main.getBoundingClientRect().top + scrollY` is byte-identical before and after the condense. Prove the cascade: `.ob-run-actions` carries `gap-3` and computed `columnGap` must be `12px`, not `0px` (pitfalls §1). **Assert A0's tokens rather than declaring them:** read `getPropertyValue` on `document.documentElement` for `--ob-header-h` (`72px`), `--ob-header-h-condensed` (`56px`), `--ob-container-app` (`1360px`) and `--ob-anchor-inset` (`136px`); a blank return means A0 is unfinished and this phase stops. **Tab the header with real key presses** — twelve `page.keyboard.press('Tab')` at 80ms apart, reading `document.activeElement`'s class, `outline`, `boxShadow` and `matches(':focus-visible')` each time; `el.focus()` is not acceptable and will report no focus rings where there are (pitfalls §6). Order must be SkipLink → Wordmark → each unlocked stage → EvidenceButton → CopyLinkButton, every row must show an indicator, and every ring colour must resolve to `rgb(45, 127, 249)`. The first Tab must bring `.ob-skip` on screen (`top >= 0`) at `zIndex: 70`. Then walk all four routes reading `[...document.querySelectorAll('.ob-stage')].map(el => el.dataset.state)`: expect `['active','done','done']`, `['done','active','done']`, `['done','done','active']`, and on `/sources` `['done','done','done']` with `document.querySelectorAll('[aria-current="page"]').length === 0`. On `/roadmap` read the header `.ob-metaline` text and assert it contains `4 BUILD STEPS` and `1 TRIPWIRE` and **does not contain** `5 BUILD STEPS`; on `/sources` assert it contains `18 DISCARDED` and `29 DOMAINS`, and that `.ob-evidence-btn`'s `aria-label` reads `Open evidence — 47 verified, 18 discarded` (the proof `getDiscarded` and the summary both reached the chrome). Assert every route has exactly one `.ob-backdrop` with a non-empty `dataset.variant`, and that on `/define` `main` reports `dataset.chrome === 'surface'` with `getComputedStyle('.ob-run-footer').display === 'none'` and `document.documentElement.scrollHeight <= window.innerHeight + 1`, while `/validate` reports `'document'` with a visible footer. Clear `localStorage`, reload `/define`, and confirm the cold-link floor: zero `.ob-stage[data-state="locked"]` and zero hydration errors in the console. Confirm the scrollspy fix by monkey-patching `window.addEventListener` to count `'scroll'` registrations, clicking five `SectionIndex` links, and asserting the count stays at zero after mount; and read `getComputedStyle(document.querySelector('#dimensions')).scrollMarginTop` — it must be **`136px`**, A0's single anchor rule, unchanged by this phase. Finally navigate to `/` and confirm it is untouched (verification.md §8): the nav still condenses, the wordmark still reads `Groundwork`, `.ob-wordmark-glyph`'s box is still 15×15. Repeat the height, condense and footer measurements at 1280. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test` (including the rewritten `run-stage.test.ts`), `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A5 — Evidence system: chip, drawer, finding card

**Goal:** the three-layer disclosure — chip, popover, drawer — is rebuilt in Obsidian, works identically on every route, and finally shows the two things it has always hidden: whether a finding supports or contests the idea, and where you are in the corpus. The drawer becomes the one place any record — verified or discarded — can be read in full, and the verification moment gets its CSS contract so the console's arrival animation is literally the landing page's proof animation.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` §5a and §6, `references/pitfalls.md` §4, §6, §7, §8, `references/verification.md` §3c, `styles/obsidian.css` §12, and [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), [C9](#c9--discards), [C10](#c10--the-analytics-api-frozen-in-a1), [C12](#c12--shared-class-names), [C13](#c13--ownership-of-things-two-phases-both-wanted), [C14](#c14--every-exit-test-ends-the-same-way).

**Build:**
- `styles/obsidian-app.css` **§6 `EVIDENCE`** — fill A0's empty banner ([C1](#c1--stylesobsidian-appcss-the-section-map)). Class list below. No new tokens ([C2](#c2--foundation-ownership)): `--ob-hatch` already exists and this phase asserts it.
- `components/validate/evidence/citation-chip.tsx` — rewritten.
- `components/validate/evidence/citation-hint.tsx` — new `CitationHint`.
- `components/validate/evidence/cited-text.tsx` — signature simplified, mechanism preserved.
- `components/validate/evidence/stance-mark.tsx` — new `StanceMark`.
- `components/validate/evidence/finding-card.tsx` — rewritten markup (R12). All three variants survive ([C13](#c13--ownership-of-things-two-phases-both-wanted)).
- `components/validate/evidence/evidence-drawer.tsx` — rewritten, two body layouts.
- `components/validate/evidence/evidence-context.tsx` — new shape (R13), building on A4's `layer` union.
- `lib/evidence-scope.ts` — **new, pure.** The scope arithmetic behind R13. *Add to the naming contract.*
- `tests/unit/evidence-scope.test.ts` — new.
- `lib/content/app.ts` — the `APP_EVIDENCE` strings listed below.
- **Naming contract:** add `StanceMark` and `CitationHint` to the *New — introduced by this build* table under **Surfaces**.

**Notes:**

- **`CitationChip` is Layer 1, and blue is legitimate here** — the chip's job is verification: it is a pointer at proof, and clicking it is the action that produces the proof. That is two of blue's three jobs at once, which is why it survives when section labels do not.
- **The bracket rule, scoped as [C12](#c12--shared-class-names) settles it.** Today `[Section label]` and `[12]` are both bracketed accent mono, which teaches the reader that a heading is a click target. A2 already resolves half of it: `SectionLabel` becomes the chalk numeral spine with the trailing `.ob-eyebrow` hairline and drops its brackets entirely. A5 locks the other half: **`.ob-cite` is the only element permitted to render a bracketed number *inside running prose*** — `.ob-report-prose` and `.ob-prose`. `[03]` on an explorer row and `[Q02]` in a loading skeleton are outside prose and are legal; they are ordinals in a grid cell, not references in a sentence. The assertion in the exit test is scoped accordingly, and it is the scoped form that is machine-checkable without generating false failures in A13 and A14.
- `.ob-cite` — mono 11px, `var(--ob-weight-meta)`, `letter-spacing: 0.04em`, `line-height: 1`, `color: var(--ob-accent)`, `padding: 1px 3px`, `margin-inline: 1px`, `border-radius: var(--ob-r-tag)`, `border: 1px solid transparent`, `background: transparent`, `vertical-align: baseline`, `transition: background/border-color/color var(--ob-fast) var(--ob-ease)`.
  - `:hover` → `background: var(--ob-accent-wash); border-color: var(--ob-hairline-accent); color: var(--ob-accent-bright)`.
  - `:focus-visible` → `outline: none; transition: none; box-shadow: 0 0 0 2px var(--ob-canvas), 0 0 0 4px var(--ob-accent)`. **The `transition: none` is required — a focus ring that fades in over 180ms reads as lag.**
  - `:active` → `transform: translateY(0.5px)`.
  - `[data-open='true']` → filled: `background: var(--ob-accent); color: var(--ob-on-accent); border-color: var(--ob-accent)`. This is blue's third job, and it fixes something genuinely missing: **with the drawer arrow-walking a corpus, nothing today tells you which sentence you came from.**
  - `[data-seen='true']` → `border-bottom: 1px solid var(--ob-hairline-accent)` and nothing else. `:visited` does not apply to a `<button>`, so "seen" is a `Set<string>` on the provider, **in memory only, no `localStorage`, no `sessionStorage`** — it answers "have I already checked this one?" for the reading session and is meaningless after it.
- **The 300ms hover delay is preserved exactly** — `setTimeout(300)` on `mouseenter`/`focus`, cleared on `mouseleave`/`blur`. Keyboard parity is not optional: focus opens the popover too.
- `.ob-cite-pop` replaces `.popover-content`: `max-width: 340px; padding: 16px; background: var(--ob-surface); border: 1px solid var(--ob-hairline); border-radius: var(--ob-r-card)`, **no `box-shadow`** (rule 7), `sideOffset={8}`, `side="top"`. Body: the excerpt in curly quotes at `--ob-sm`/1.55/`var(--ob-text)`; an `<hr className="ob-rule">`; then a row with `domain · 14 Mar 2025` in `.ob-meta` on the left and `<StanceMark stance={…} />` + `VerifiedBadge` on the right. **The popover gains stance, which it has never carried** — a source that contests the idea should not be able to ambush the reader only at layer three.
- **The one-time hint moves out of absolute positioning entirely (r08 §8k).** Today `.citation-hint` is `position: absolute; top: calc(100% + 6px)` under a chip mid-paragraph, and in a 21px/1.55 lead it lands squarely on the following line of body text. **Delete the absolute positioning.** `CitationHint` is now a normal-flow sibling rendered *after* the paragraph that owns the first chip: `.ob-cite-hint` = 13px sans (not mono — mono carries no sentences), `color: var(--ob-dim)`, `border-left: 1px solid var(--ob-hairline)`, `padding-left: 12px`, `margin-top: 12px`. Copy, verbatim: **`"Hover any citation to see the source. Click to open the full evidence."`** On dismissal it collapses `max-height` → 0 and `opacity` → 0 over `--ob-fast`; the shift is user-initiated, one-time, and below the line the reader has already left.
- **`renderCitedText` stays a plain function, and the `firstChipGetsHint` option is deleted.** New signature: `renderCitedText(text: string): ReactNode[]`. Callers render `{renderCitedText(summary.text)}` and then `<CitationHint />` as a sibling; `CitationHint` reads `hintDismissed` from context and returns `null` when dismissed, so no caller passes a flag. **Preserve the plain-function pattern: it is a function and not a component precisely so a Server Component can splice `CitationChip` — a client leaf — into its own output without becoming a client component itself. That single mechanism is what keeps the entire report out of the client bundle.** If it is ever converted to a `<CitedText>` component it must remain a server component.
- **`StanceMark` — stance is expressed by fill treatment, never by hue, and A5 does not define the fills.** `StanceMark({ stance, withLabel = true }: { stance: Stance; withLabel?: boolean })` renders
  ```tsx
  <span className="ob-stance-row" data-stance={stance}>
    <span className={`ob-stance-mark ob-stance-${fillKey(stance)}`} aria-hidden />
    <span className={withLabel ? 'ob-stance-word' : 'sr-only'}>{STANCE_LABEL[stance]}</span>
  </span>
  ```
  where `fillKey` maps the enum to `supports` / `neutral` / `contests`. **`.ob-stance-supports` / `-neutral` / `-contests` are A3's, defined once in §4, and carry the one hatch geometry — `repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px)` ([C12](#c12--shared-class-names)). A5 declares none of the three and no second weave.** §6 defines only `.ob-stance-mark` (the 10×10 box, zero radius, sizing and vertical alignment for an inline row) and `.ob-stance-row` / `.ob-stance-word`. **The container class `.ob-stance` belongs to nothing here** — `.ob-stance-bar` is A3's `StanceBar` figure wrapper, and the collision between the two was two `.ob-stance` blocks leaking box properties onto each other's element.
  **The word always accompanies the mark; the mark is never mute** — `withLabel={false}` emits the word `sr-only`, it does not omit it. `.ob-stance-word` is `.ob-meta`-sized at `var(--ob-dim)`, except on `challenges` where it lifts to `var(--ob-muted)` — the one counter-signal on a card must not be its dimmest element. **There is no red. A contesting finding is not an error.**
  **The words come from `STANCE_LABEL` in `lib/schemas/evidence.ts` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets))** — `challenges → 'Contests'`. The schema enum value stays `challenges`; the rendered word is `Contests`; **there is no inline map in this component and no `stanceWords` entry in `lib/content/app.ts`.** That map was R14's other half and it has exactly one home.
- **`FindingCard` — R12, and the fix deletes three hacks at once.** Today a `<div role="button" tabIndex={0} onKeyDown={…}>` wraps an `<a>`, which is nested interactive content, announces the whole row as one enormous button label, and forces both the `stopPropagation` on the anchor and the "only attach `onClick` when a client caller supplies one" contortion. **The card is not the button; the claim is.** Exact markup:
  ```tsx
  <article className="ob-finding" data-variant={variant} data-stance={finding.stance}
           data-state={variant === 'stream' ? state : undefined}>
    <header className="ob-finding-head">
      <span className="ob-meta">{citationLabel}</span>
      <span className="ob-meta">{DIMENSION_LABEL[finding.dimension]}</span>
      <StanceMark stance={finding.stance} />
      {citedInReport && <span className="ob-finding-cited ob-meta" title="Quoted in the report">CITED</span>}
      <VerifiedBadge />
    </header>
    {onOpenEvidence
      ? <button type="button" className="ob-finding-claim" onClick={onOpenEvidence}
                aria-label={`Open evidence ${n}: ${finding.text}`}>{finding.text}</button>
      : <p className="ob-finding-claim">{finding.text}</p>}
    <blockquote className="ob-finding-excerpt">{finding.excerpt}</blockquote>
    <div className="ob-verify-rule" aria-hidden="true" />
    <p className="ob-finding-source">
      <a className="ob-finding-source-link" href={finding.source_url}
         target="_blank" rel="noopener noreferrer">
        {formatDomain(finding.source_url)} <span className="ob-arrow" aria-hidden>↗</span>
      </a>
      <span className="ob-meta">{formatDate(finding.source_date)}</span>
    </p>
  </article>
  ```
  No `role`, no `tabIndex`, no `onKeyDown` shim — a real `<button>` gets Enter and Space for free — and no `stopPropagation`, because there is no longer an ancestor handler to stop. `FindingCard` stays a server component. `DIMENSION_LABEL` is the long form and is uppercased by `.ob-meta`'s `text-transform`, never by a second string table ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)). The card still reads as one object: `.ob-finding:hover { border-color: var(--ob-hairline-strong) }`, and `.ob-finding-claim:hover` adds `color: var(--ob-text)` with a 1px `var(--ob-hairline-accent)` underline at `text-underline-offset: 4px`.
- **Variants are layout only, driven by `data-variant`, and all three survive ([C13](#c13--ownership-of-things-two-phases-both-wanted)):**
  - `stream` — `background: var(--ob-surface); border: 1px solid var(--ob-hairline); border-radius: var(--ob-r-card); padding: 20px`. The verify rule is live.
  - `accordion` — **no card at all.** `border-top: 1px solid var(--ob-hairline); padding: 20px 0`, no radius, no background. Hairlines are the layout, and eleven nested cards inside a report section is a different system. The verify rule is `display: none` — verification happened minutes ago.
  - `row` — dense: `display: grid; grid-template-columns: 52px minmax(0,1fr) 140px; gap: 16px; padding: 14px 0; border-top: 1px solid var(--ob-hairline)`. Column one is `[12]` plus the stance mark stacked; column two is claim then excerpt clamped to two lines (`-webkit-line-clamp: 2`); column three is domain over date, right-aligned. Verify rule `display: none`. **A13 builds `EvidenceRow` beside this variant and deletes nothing here.**
- **Stance renders in all three variants.** Today it renders only in the drawer and the `row` variant, which means in the console stream and in every report accordion **a finding that contradicts the idea is pixel-identical to one that supports it. For a product whose entire pitch is honest evidence, that is the worst omission in the app.** Fixing it is the point of this phase as much as the drawer is.
- **The cited-in-report marker.** `citedInReport?: boolean` on `FindingCardProps`, sourced from `citedFindingIds(report): Set<string>` in `lib/analytics/evidence-stats.ts`, which A1 ships to the signature frozen in [C10](#c10--the-analytics-api-frozen-in-a1) and which is built by running `extractCitationNumbers` over every `CitedText` in the report. Renders `CITED` in `.ob-meta` when true and **nothing** when false — 23 of 47 findings are cited nowhere, and labelling 23 records "uncited" would read as a verdict on them. Absence is the signal.
- **`EvidenceProvider` — the new shape.** A4 introduced the `layer` union, `openExplorer`/`closeExplorer` and the `discarded` prop; A5 adds the fourth member, the scope, the position and the seen set:
  ```ts
  export type EvidenceLayer =
    | { kind: 'none' }
    | { kind: 'finding'; id: string }
    | { kind: 'discarded'; id: string }
    | { kind: 'explorer' };

  interface EvidenceContextValue {
    evidence: Finding[];
    discarded: DiscardedFinding[];
    layer: EvidenceLayer;
    /** The ordered id list `next`/`prev` walk. The 47 verified ids unless a surface narrows it. */
    scope: string[];
    /** A filtering surface publishes its visible, ordered ids here. `null` restores the corpus. */
    setScope: (ids: string[] | null) => void;
    openFinding: Finding | null;
    openDiscarded: DiscardedFinding | null;
    /** 1-based position within the effective scope. `null` when nothing is open. */
    position: { index: number; total: number; filtered: boolean } | null;
    open: (citation: number) => void;
    openById: (id: string) => void;
    close: () => void;
    next: () => void;
    prev: () => void;
    openExplorer: () => void;
    closeExplorer: () => void;
    findFinding: (citation: number) => Finding | undefined;
    seenIds: ReadonlySet<string>;
    hintDismissed: boolean;
    dismissHint: () => void;
    triggerRef: RefObject<HTMLElement | null>;
  }
  ```
  `openById(id)` resolves against `evidence` first and `discarded` second, setting `{kind:'finding'}` or `{kind:'discarded'}` accordingly; an id in neither corpus is a no-op with a `console.warn` outside production. **That one function is the whole discard entry point — `DiscardRow` calls it ([C9](#c9--discards)) and needs no second API.**
- **R13, exactly, and the arithmetic is pure and tested.** `lib/evidence-scope.ts` exports `effectiveScope(scope, allIds, openId): { ids: string[]; filtered: boolean }`, `positionOf(ids, id): { index: number; total: number } | null`, and `step(ids, id, delta): string | null`. `next`/`prev` index into the effective scope, never into `evidence`. `SourcesList` today, and `EvidenceExplorer` in A13, call `setScope(visibleIds)` in an effect on every filter change; the report and the console call `setScope(null)`. **The default scope is the 47 verified ids** — which is what stops a chip clicked in report prose from ever walking into a discard, and why `/sources` is the only surface where a walk crosses record kinds, because there the discards are on screen between the verified rows and crossing is the page's entire argument ([C9](#c9--discards)). **Guard:** if the open id is not in `scope` — you clicked a chip in prose while a filter is live — the walk falls back to the full corpus for that one open and `position.filtered` is `false`. It must never dead-end at a disabled Prev and a disabled Next. `step` returns `null` at either end; **there is no wrapping.**
  `tests/unit/evidence-scope.test.ts` asserts: position within a 13-id scope; `step` returning `null` at both ends; the out-of-scope fallback returning the full corpus with `filtered: false`; a mixed `['EV_02','DS_07','EV_05']` scope stepping through the discard without special-casing; and `setScope(null)` restoring 47.
- **Drawer footer, with the position readout — and this spelling is the drawer's, not the explorer's.** `.ob-drawer-foot` = `display: grid; grid-template-columns: 1fr auto 1fr; align-items: center`. Prev left, `.ob-drawer-pos` centre, Next right. Prev/Next are `.ob-btn .ob-btn-bare` reading `← Previous` and `Next →`, `:disabled` at the ends (`opacity: .38; cursor: not-allowed`). The readout is `.ob-meta` and reads **`3 of 47`** unfiltered and **`3 of 14 · FILTERED`** when `position.filtered` is true (`.ob-meta` uppercases it on screen). **A13's `{i} OF {n} IN THIS FILTER` phrasing is superseded — the drawer is A5's component and carries one string table.** A13 asserts these strings; it does not re-word them.
- `←`/`→` stay bound on `window` — Radix already traps focus inside the dialog — **but the handler must bail when the event target is an `<input>`, `<textarea>`, or `isContentEditable`**, or A13's facet search box will page the drawer while you type. **Keep the Radix focus trap and the `onCloseAutoFocus` → `triggerRef.current?.focus()` restore exactly as they are**: with no `Dialog.Trigger` in the tree Radix restores focus to `<body>`, which drops a keyboard reader at the top of the document every time they close a citation.
- **Two drawer body layouts.**
  *Verified* (`layer.kind === 'finding'`), title `Evidence 12`:
  1. `MetaLine` — `EV_12 · VERIFIED · THE PROBLEM` (the dimension through `DIMENSION_LABEL`, uppercased by CSS).
  2. **The claim at `--ob-h3` (23px, weight 400, `var(--ob-text)`)** — it is the thing you opened the drawer for and should be the largest type in it; today it is plain body.
  3. `.ob-verify-rule`, drawn once on mount. The drawer is a verification moment too.
  4. Field label `Verbatim excerpt`; the excerpt in `.ob-excerpt` (18px/1.5) on a `var(--ob-surface)` panel with `border-left: 1px solid var(--ob-hairline-accent)`; caption below, verbatim: `"This exact text was found on the page below."`
  5. Field label `Source`; the domain as a link with `↗`; `Published 14 Mar 2025` via `formatDate` (today it prints the raw ISO); a `Stance` row carrying `StanceMark` plus the word.
  6. Footer: Prev · position · Next.

  *Discarded* (`layer.kind === 'discarded'`), title `Discarded excerpt`. **A `DiscardedFinding` has no `text` field and none is added ([C9](#c9--discards)) — there is no claim to lead with, because the excerpt never became one, and inventing one is exactly what "nothing is invented to fill a field" forbids:**
  1. `MetaLine` — **`DS_07 · DISCARDED · MONEY`.** Ids are `DS_01`–`DS_18`, `/^DS_\d{2}$/`; there is no `DQ_` prefix anywhere in this build.
  2. **The reason leads**, rendered through `DISCARD_REASON_LABEL` from `lib/schemas/evidence.ts` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)) — never the raw enum key, which on screen would read `excerpt_not_found_on_page` and turn D15's trust claim into a database dump. It is **sans, at `--ob-h3`, in `--ob-text`** — never mono (it is a sentence with a verb) and **never `--ob-discard`**, which measures 2.25:1 and is deliberately illegible. **This is the trust claim made visible: opening a discard tells you first why it was thrown away.**
  3. The excerpt below, in the landing page's discarded treatment ported verbatim: `color: var(--ob-discard); text-decoration: line-through; text-decoration-thickness: 1px`, panel at `opacity: 0.62; transform: translateY(6px)`.
  4. `.ob-meta` line `ATTEMPTED QUERY` above the `attempted_query` string in sans `--ob-sm` `--ob-muted` — A1 authors and asserts the field against the 19 `RUN_QUERIES`, and this is the surface that reads it. A field nothing renders is a field that should not exist.
  5. The source row, identical to the verified layout.
  6. A closing `.ob-meta` line: `NOT USED IN THE REPORT`.
  7. Footer: Prev · position · Next, against the same scope. No `VerifiedBadge`, no verify rule, **and no red anywhere** — it goes grey, strikes through, drops six pixels, and stops mattering.

  **This body has exactly one trigger and it is not dead UI: `DiscardRow` opens it ([C9](#c9--discards)), built in A13.** Until that session lands there is no discard row on screen, so A5 proves the body's CSS with a DOM probe and its walk arithmetic with `evidence-scope.test.ts`, and A13's exit test proves the click-through. Do not add a temporary trigger to make it clickable sooner.
- **The verification moment — the CSS contract is A5's; the attributes and the timings are A8's ([C13](#c13--ownership-of-things-two-phases-both-wanted)).** Today it does not exist at all (R4's missing `.finding-card--entering`). A5 supplies three things and no more:
  1. The `<div className="ob-verify-rule" />` is **always in the DOM** in the `stream` variant so its 1px is reserved from the first frame (rule 12). **Do not redefine `.ob-verify-rule`** — it lives in `styles/obsidian.css` §12 (`scaleX(0) → scaleX(1)` over `--ob-enter`, `transform-origin: left center`) and a second definition is how two systems drift. §6 adds only the scoping and the end state:
     ```css
     .ob-finding[data-variant='stream'] .ob-verify-rule { /* inherits §12 */ }
     .ob-finding[data-state='verified'] .ob-verify-rule { transform: scaleX(1); }
     ```
  2. The badge's **opacity states, with no duration and no delay of their own**:
     ```css
     .ob-finding[data-state='pending']  .ob-chip-verified { opacity: 0; transform: translateY(4px); }
     .ob-finding[data-state='verified'] .ob-chip-verified { opacity: 1; transform: none; }
     ```
  3. `transform` keeps exactly one owner per element (pitfalls §4): `scaleX` lives on the rule's own node, the badge's `translateY` on the badge, and the card's entrance — **320ms, on `.ob-fstream-item`, with the rule then drawing for 900ms and the badge resolving at ~1220ms per [C13](#c13--ownership-of-things-two-phases-both-wanted)** — is A8's wrapper and A8's numbers. A5 states no duration for either and **A5's exit test does not sample the stream**, because the component that flips `data-state` is still the Deep Canopy `FindingStream` until session 5. **The result is that the console's arrival animation and the landing page's proof animation are literally the same CSS rule — the promise `/` makes is kept, on the same 1px line, inside the product.**
- **Reduced motion — handoff, not a second block.** §16 of `obsidian-app.css` is the only app-side reduce home and it is A15's to finalise ([C1](#c1--stylesobsidian-appcss-the-section-map)); A5 writes nothing into it and **nothing into `styles/obsidian.css` §16**. The end states A15 must carry, recorded here and in the build log so the completeness diff can tick them off: `.ob-finding[data-state] .ob-verify-rule { transform: scaleX(1) }`, `.ob-finding[data-state] .ob-chip-verified { opacity: 1; transform: none }`, `.ob-cite-hint { transition: none; max-height: none }`. The JS half — A8 skipping the pending frame entirely so no card ever renders unverified — is A8's.
- **§6's class list, exactly:** `.ob-cite` `.ob-cite-pop` `.ob-cite-hint` · `.ob-stance-row` `.ob-stance-mark` `.ob-stance-word` · `.ob-finding` `.ob-finding-head` `.ob-finding-claim` `.ob-finding-excerpt` `.ob-finding-cited` `.ob-finding-source` `.ob-finding-source-link` · `.ob-drawer-pos` `.ob-field-label` `.ob-excerpt` `.ob-discard-panel` `.ob-discard-excerpt` `.ob-discard-reason`, plus the two `.ob-verify-rule` scoping selectors above. `.ob-drawer` / `-head` / `-body` / `-foot` are A2's §3 and are not redeclared; `.ob-stance-supports` / `-neutral` / `-contests` are A3's §4 and are not redeclared. **§6 declares no `@keyframes`** (and would prefix one `ob-app-` if it did — [C1](#c1--stylesobsidian-appcss-the-section-map)).
- Copy added to `lib/content/app.ts` under an `APP_EVIDENCE` banner: `hint`, `excerptCaption: 'This exact text was found on the page below.'`, `fieldLabels: { finding: 'Finding', excerpt: 'Verbatim excerpt', source: 'Source', stance: 'Stance', attemptedQuery: 'Attempted query' }`, `drawerTitles: { verified: (n) => \`Evidence ${n}\`, discarded: 'Discarded excerpt' }`, `prev: '← Previous'`, `next: 'Next →'`, `filteredSuffix: 'FILTERED'`, `notUsed: 'NOT USED IN THE REPORT'`, `citedMarker: 'CITED'`, `citedTitle: 'Quoted in the report'`. **No `stanceWords`, no dimension map, no discard-reason map** — all four live in `lib/schemas/evidence.ts` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)).
- **The reason's size is per surface, and [C9](#c9--discards) now says so explicitly.** Here in the drawer it is the lead: `--ob-h3` in `--ob-text`. In a `DiscardRow` it is `--ob-sm` in `--ob-muted`. **Sans in both, and never `--ob-discard` in either** — that grey measures 2.25:1 and the sentence is the trust claim.

**Exit test:** With `next dev` running, drive the **Playwright MCP** to `/r/sms-rebooking-4f2a/validate` at 1440×900 **without seeding `sv.runStarted`** — the run resolves to Mode B and the report's accordions are the surface under test; the console stream belongs to A8 ([C13](#c13--ownership-of-things-two-phases-both-wanted)) and is not sampled here. **(1) The verification CSS, proved by probe rather than by the stream:** append `<article class="ob-finding" data-variant="stream" data-state="pending"><div class="ob-verify-rule"></div><span class="ob-chip ob-chip-verified">VERIFIED</span></article>` to `main`, read `getComputedStyle('.ob-verify-rule').transform` → `matrix(0, 0, 0, 1, 0, 0)` and the badge's `opacity` → `0`; flip `dataset.state = 'verified'`, wait 1000ms (past `--ob-enter`), re-read → `matrix(1, 0, 0, 1, 0, 0)` and `1`; remove the probe. **(2) One hatch, one weave:** `getComputedStyle('.ob-stance-contests').backgroundImage` must contain `repeating-linear-gradient` and the token stops `1px 6px`, its `backgroundColor` must be `rgba(0, 0, 0, 0)`, and `.ob-stance-supports` must be `rgb(244, 244, 245)`; then `grep -oh 'repeating-linear-gradient(45deg[^;]*' styles/*.css | sort -u` — every distinct hit must be byte-identical to [C12](#c12--shared-class-names)'s geometry, and `grep -c '^\.ob-stance-contests' styles/obsidian-app.css` must be `1`. **(3) R12 is dead:** `document.querySelectorAll('[role="button"] a').length === 0` and `document.querySelectorAll('.ob-finding[role]').length === 0`. **(4) The scoped bracket rule:** every leaf element inside `.ob-report-prose, .ob-prose` whose `textContent` starts with `[` carries `ob-cite`; and `grep -rn '\[' components/validate/report --include=*.tsx` shows no bracketed literal outside a citation renderer. Elements outside prose are not sampled — `[03]` and `[Q02]` are legal ([C12](#c12--shared-class-names)). **(5) Stance in every variant:** open a dimension accordion and assert `document.querySelectorAll('.ob-stance-row').length === document.querySelectorAll('.ob-finding').length`; repeat on `/sources`, where the `row` variant renders. Assert `document.querySelectorAll('.ob-stance').length === 0` — the colliding container class is gone. **(6) No red anywhere:** scan every element's computed `color`, `backgroundColor` and `borderTopColor` for any `rgb(r,g,b)` with `r > g + 40 && r > b + 40` — the result must be empty. **(7) The hint no longer occludes:** `getComputedStyle('.ob-cite-hint').position === 'static'` and its `getBoundingClientRect().top >= previousElementSibling.getBoundingClientRect().bottom - 1`. **(8) The 300ms delay:** hover a chip, wait 200ms (no `.ob-cite-pop` in the DOM), wait a further 300ms (present); then read the chip's `dataset.open === 'true'` after clicking, and its `backgroundColor` → `rgb(45, 127, 249)`. **(9) R13 on `/sources`:** click the `Money 13` pill, open the first row's claim button, read `.ob-drawer-pos` → `3 of 13 · FILTERED` for the third record and `1 of 13 · FILTERED` for the first; press `ArrowRight` three times with **real key presses** and assert the drawer's MetaLine id is the fourth id of the filtered list — not `EV_02`; press `ArrowLeft` past the start and assert `Previous` is `disabled` and the readout did not wrap. **(10) Trap and restore:** with the drawer open, five Tabs must keep `document.activeElement.closest('[role="dialog"]')` non-null, and Escape must return focus to the `.ob-cite` reading `[2]`. **(11) Focus rings:** Tab through a report paragraph with real key presses and confirm every `.ob-cite` shows a `boxShadow` containing `rgb(45, 127, 249)` with `transitionDuration: 0s`. **(12) Cascade** (pitfalls §1): `.ob-finding-head` carries `gap-3` and must compute `columnGap: 12px`, not `0px`; and `getPropertyValue('--ob-hatch')` on the root must be non-empty — a blank voids the whole contests declaration silently. **(13) Reduced motion:** `emulateMedia({ reducedMotion: 'reduce' })`, reload, re-run the probe from (1) and assert the rule reads `matrix(1, 0, 0, 1, 0, 0)` and the badge `opacity: 1` **on the first frame**, with no wait. Repeat (2), (5) and (12) at 1280. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test` (including the new `tests/unit/evidence-scope.test.ts`), `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A6 — Define: layout and transcript

**Goal:** `/r/[slug]/define` becomes a full-height working surface on Obsidian — two independently-scrolled columns that exactly fill the viewport with no page scroll, a typeset transcript where an AI turn and a user turn are visibly different objects, and a composer that cannot drop a keystroke. Implements **D9** and **D11**; fixes **R3**, **R10**, **R11**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` (§5b typewriter, §6 reduced motion, §7 performance), `references/pitfalls.md` (**§5 sticky-in-overflow, §12 per-character state — read both before writing any component**, plus §1 layering), `WebsiteLayoutDesc/06-page-define.md`, `WebsiteLayoutDesc/12-states.md`, and this plan's [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership) and [C13](#c13--ownership-of-things-two-phases-both-wanted).

**Build:**
- `styles/obsidian-app.css` **§7 `DEFINE — LAYOUT & TRANSCRIPT`** — fill the banner A0 left empty. The section map is [C1](#c1--stylesobsidian-appcss-the-section-map); do not restate it, do not renumber it, do not append a section. §8 is A7's and is left alone by this phase.
- `app/r/[slug]/define/page.tsx` — server component; drops `PageContainer`, renders `<AppBackdrop variant="define" />` as its first child ([C13](#c13--ownership-of-things-two-phases-both-wanted)) and `<DefineConversation>` as the only other child of `<main>`, so the fill-mode `:has()` selector matches a direct child.
- `components/define/define-conversation.tsx` — rewritten controller.
- `components/define/message-stream.tsx` — `MessageStream`, rewritten.
- `components/define/message.tsx` — `Message`, rewritten.
- `components/define/typing-body.tsx` — **`TypingBody`**, new leaf. *Add to the naming contract.*
- `components/define/composer.tsx` — `Composer`, rewritten.
- `components/define/suggestion-chip.tsx` — `SuggestionChip`, now renders `.ob-seed`.
- `components/define/brief-progress.tsx` — **`BriefProgress`** (already in the naming contract), presentational: `(props: { answered: number; total: number; unknown: number }) => JSX`. A6 owns the component and its copy template; A7 changes only where the three numbers come from.
- `lib/hooks/use-reduced-motion.ts` — `useReducedMotion(): boolean`. Reads `matchMedia` **in an effect**, subscribes to `change`, returns `false` on the server and on the first client render.
- `lib/content/app.ts` — the `DEFINE` block (every string below), extending the stub A0 seeded.
- `lib/fixtures/conversation.ts` + `lib/schemas/conversation.ts` + `lib/db/queries.ts` — chips on three more turns, turn 11 rewritten, a new closing-line array (D3).
- `components/style-guide/sections/define.tsx` — `getConversation`'s return shape changes, so its `DefineConversation` call site changes with it. One-line fix; A14 rebuilds the gallery properly. Without it `npx tsc --noEmit` fails and [C14](#c14--every-exit-test-ends-the-same-way) can't pass.

**Not built here:** `styles/tokens.css` — [C2](#c2--foundation-ownership) gives A0 every token in this build, and this phase declares none. `components/layout/run-shell.tsx` — chrome is A4's, and A4 already derives what Define needs (below).

**Notes:**

- **The split (D9), and who owns which half of it.** A4 already gives `RunShell` `chrome: 'document' | 'surface'`, derives `'surface'` for the `define` segment, renders **no `RunFooterBar`** there, and sets `main.ob-app-main[data-chrome='surface'] { height: calc(100vh - var(--ob-header-h)); overflow: hidden }` — the selector and the value are [C15](#c15--the-shell-vocabulary-and-where-the-headers-height-is-held)'s, and `.ob-run-shell` does not exist. **That is A4's rule in §5 and this phase does not restate it, re-derive it, or write a competing `:has()` selector for the footer.** A6 adds exactly one shell-adjacent rule, keyed on its own class so it can never leak to another route: `main:has(> .ob-define) { min-height: 0; }`. Because A4's header is `position: fixed` behind a constant 72px spacer and the shell is a fixed-height flex column, `main`'s used height is already exactly `100vh − var(--ob-header-h)` — **no `calc()` appears anywhere in this phase and the arithmetic is still exact.** Because there is no page scroll, `RunHeader` never condenses here; the header stays 72px on this route for its whole life.
- **The three Define constants are locals, not tokens.** [C2](#c2--foundation-ownership) reserves token declaration to A0, and none of these three is shared with another phase, so they are declared once as plain custom properties on the component root — deliberately **without** the `--ob-` prefix, so A0's used-vs-defined ritual (standing rule 4) keeps passing untouched: `.ob-define { --define-band-h: 96px; --define-aside: 440px; --define-measure: 64ch; }`. Do not promote them to `styles/tokens.css` as a tidy-up; a fourth phase declaring a fourth `--ob-define-*` is exactly the failure C2 exists to stop.
- `.ob-define { height: 100%; display: grid; grid-template-rows: var(--define-band-h) minmax(0,1fr); }`. The second row therefore measures exactly `100vh − 72 − 96` — the agreed constant, expressed as tracks so it stays exact at 1280 as well as 1440. `.ob-define-split { display: grid; grid-template-columns: minmax(0,1fr) var(--define-aside); min-height: 0; }`, **no `gap`** — the columns butt against a `border-left: 1px solid var(--ob-hairline)` on the aside, so the hairline runs floor to ceiling. Full-bleed; not container-capped. Both columns are `min-height: 0` or the grid rows refuse to shrink.
- `.ob-define-band { height: var(--define-band-h); display: flex; align-items: center; justify-content: space-between; padding-inline: 40px; border-bottom: 1px solid var(--ob-hairline); }`. Left: `<h1 className="ob-h2">What are you building?</h1>`. Right: `BriefProgress`. **The band height is a constant, not a consequence of the h1's clamp** — that is why the row arithmetic survives a viewport change.
- **Two scrollports, no sticky.** Left column: `grid-template-rows: minmax(0,1fr) auto` — `.ob-define-scrollwrap` then `.ob-define-composer`. Right column: `grid-template-rows: auto minmax(0,1fr) auto` — `.ob-define-aside-head`, `.ob-define-aside-scroll`, `.ob-define-aside-foot`. **Nothing on this page uses `position: sticky`.** R10 is fixed by not using `TwoColumn` here at all — **`components/layout/two-column.tsx` was deleted in A2 with all three of its call sites replaced, `app/r/[slug]/define/loading.tsx` included** ([C13](#c13--ownership-of-things-two-phases-both-wanted)); do not go looking for the file. Verify with the pitfalls §6 audit snippet: zero `position: sticky` nodes inside `.ob-define`.
- **The aside is a shell here and a panel in A7.** §7 defines the three aside slots — `.ob-define-aside`, `.ob-define-aside-head`, `.ob-define-aside-scroll`, `.ob-define-aside-foot` — their tracks, padding and the hairlines between them, and nothing about their contents. Every `.ob-brief*`, `.ob-consequence` and `.ob-approve` rule is §8's. Two phases styling one column is how the last stylesheet ended up with two owners per section.
- **R11.** `.ob-define-scrollwrap { position: relative; min-height: 0; display: grid; }` holds two children: `.ob-define-scroll { overflow-y: auto; min-height: 0; padding-block: 32px 56px; }` and the pill `.ob-define-newmsg { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); z-index: 2; }`. Absolute against the wrapper, **not `sticky` inside the scrollport** — a sticky-bottom child resolves against the scrolled content flow and vanishes whenever the last turn is shorter than the port. It no longer participates in the column grid, so it cannot squeeze the transcript. Copy: `↓ New message`. It is a `<button>`, so `--ob-r-pill` is legal on it (rule 8).
- **One measure for the column.** `.ob-define-thread` and the composer's inner wrapper are both `max-width: var(--define-measure); margin-inline: auto;`. Hairlines (composer `border-top`, band `border-bottom`) span the full column; content is measured. **This is critique (r): messages and the input now share both edges exactly**, instead of a 545px message above an 848px textarea.
- **D11 — the two turn treatments.** `.ob-msg { display: block; }`, `.ob-msg + .ob-msg { margin-top: 40px; }`, `.ob-msg-role` is `.ob-meta` at `--ob-dim` with `margin-bottom: 10px`.
  - `[data-role='assistant']` — role line `GROUNDWORK`. Body `--ob-text`, `--ob-body` 16px, `line-height: var(--ob-leading-body)`, full 64ch, flush left, no border.
  - `[data-role='user']` — role line `YOU`. `margin-left: 40px; border-left: 1px solid var(--ob-hairline-strong); padding-left: 20px;` spanning role line and body. Body `--ob-muted`, `--ob-sm` 14px, `max-width: 52ch`.
  - **The AI's turns are chalk because they are the document** — they are the questions the brief is built from and the only new text on the page. The user's own words are context, already known to them, so they take the muted body colour, the tighter measure and the indent. That direction is the blueprint's (`06-page-define.md`: AI text brighter "because it's what the user reads") and it is the same chalk/muted contrast the rest of Obsidian runs on.
  - **The `▸` glyph is deleted and no part of the transcript is blue.** The blinking `.ob-caret` is the only accent in the column and its job is *live*.
  - **Kills R3's five undefined classes** — `.composer`, `.composer--streaming`, `.message-text`, `.message-text--ai`, `.message-text--user` are removed from the tree in this phase. Grep for each afterwards; zero hits, and record the five against A0's twelve-class baseline.
- **Typewriter.** Reuse the landing's tuned values exactly (`motion.md` §5b): **15ms/char for AI turns, 24ms/char for the seeded user idea**, hold **460ms** after a turn under 120 characters and **900ms** after one at or over it. `REST_MS = 420` before each AI turn (down from 700, because a hold now follows as well). A blue `.ob-caret` blinks at the cursor. **Per-character `count` lives in `TypingBody` and nowhere else** (pitfalls §12); `TypingBody` is mounted with `key={`${slug}-${turnIndex}`}` and never synced by effect; its `onDone` is `useCallback`-stable or the effect restarts every render and the turn never finishes.
- **`.ob-caret` and `ob-blink` are reused, not redeclared.** Both already exist in `styles/obsidian.css` §13. Per [C1](#c1--stylesobsidian-appcss-the-section-map) a `@keyframes` name repeated in `obsidian-app.css` silently *replaces* the earlier one, and `obsidian-app.css` loads after `obsidian.css` in the same layer — so re-declaring `ob-blink` here would change the landing page's caret with no error anywhere. **This phase declares no `@keyframes` at all**; if a later fix genuinely needs one it is prefixed `ob-app-` and greped across `styles/*.css` first.
- **The double entrance (critique g) is fixed structurally.** There is no separate streaming node. The controller appends the assistant entry to `messages` **when the turn starts**, carrying its full text plus `streaming: true`; `Message` renders `<TypingBody>` while streaming and the plain text after, inside the **same** `.ob-msg` element. The wrapper never unmounts, so its entrance transition runs exactly once. `.ob-msg` reuses `.ob-reveal`'s vocabulary at half strength: `opacity 0→1, translateY(10px)→0` over `--ob-base`, driven by a `data-entering` attribute flipped one rAF after mount. No blur — blur-up is the marketing reveal.
- **Scroll follow without re-rendering.** `MessageStream` owns the scrollport ref and hands `TypingBody` a `useCallback`-stable `onGrow` that writes `el.scrollTop = el.scrollHeight` directly to the node (`motion.md` §7: never re-render React on continuous motion). The existing 48px `userScrolledUp` suspension stays and gates both `onGrow` and the `.ob-define-newmsg` pill's visibility.
- **Composer.** Reuses `.ob-composer` from `styles/obsidian.css` §13 unchanged — A2's rule that `obsidian-app.css` never redeclares an `obsidian.css` class holds here — plus these §7 additions: `.ob-define-composer .ob-composer textarea { font-size: var(--ob-body); }` (18px is the landing's hero input; a working surface is 16px), `rows={2}`, placeholder `Type your answer…`. Below the field, a row holding `DontKnowButton` (`.ob-btn .ob-btn-ghost`, label `I don't know`) left and `Send` (`.ob-btn .ob-btn-ghost`) right — **there is no primary button in this column**; the page's one `.ob-btn-primary` is `ApproveButton` in the aside (A7). Between them, `.ob-composer-hint` in `.ob-meta`: `ENTER TO SEND · ⇧ENTER NEW LINE`, swapping to `QUEUED` while a turn streams. `Enter` sends, `Shift+Enter` newlines. Streaming affordance is `.ob-composer[data-buffering='true'] { border-color: var(--ob-hairline-strong); }` — a border step, not a shimmer; Obsidian has no shimmer vocabulary. **Note for A15:** `.ob-composer:focus-within` carries a `box-shadow: 0 0 0 4px var(--ob-accent-wash)` inherited from the landing recipe, which is the one shadow in this build outside `.ob-btn`. It is not changed here — changing it changes `/` — but it belongs in A15's shadow audit as a known, named exception rather than a surprise.
- **Input can never be dropped.** Delete `pendingSendRef` entirely. `handleSend(text)` appends the user message to the transcript **immediately, always**; if `aiBusyRef.current` it increments `pendingTurnsRef` instead of starting a turn, and `finishAiTurn` decrements and starts the next. **A second send while the AI is typing produces two visible user turns and two answers in order — nothing is buffered into a slot that a third send can overwrite.**
- **`SuggestionChip`: four turns get chips, not one.** Chips attach to the turns filling `customer`, `who_decides`, `how_it_makes_money` and `how_customers_find_it` — the four questions with a genuinely enumerable answer space. The seven open-ended turns get none, which is correct; making every turn multiple-choice would turn the conversation back into the form the exec summary deleted. **Four of eleven is a pattern; one of eleven reads as a glitch.** Address chips by *field key* in code and content, never by array index — A7 reorders the fixture. New sets (max 4, per blueprint): `who_decides` → `The practice owner` · `The office manager` · `Both have to agree`; `how_it_makes_money` → `Flat monthly fee` · `Per booking recovered` · `Not sure yet`; `how_customers_find_it` → `Cold outreach` · `Dental associations` · `The PMS marketplace`. Rendered in `.ob-define-chips` (`flex flex-wrap gap-2`) inside the scrollport, cleared once answered.
- **The dead end (critique k) gets a real end state.** Rewrite the `open_questions` turn so it stops asking a question: `Good — everything's in the brief on the right. Anything marked as an open question is worth confirming with a real practice before you build. When you're ready, approve it and I'll start the research.` When it completes, the controller sets `conversationClosed` and the composer is **replaced** — not disabled — by `.ob-define-closed`: a hairline-topped block with `.ob-meta` `CONVERSATION COMPLETE`, the sans line `You can still edit any field in the brief. Approve when you're ready.`, and a `.ob-btn .ob-btn-ghost` reading `Add something else` that restores the composer. Anything sent after that is answered by a turn drawn from a new `closingAckFixture` (cycled, never the same line twice running), which fills no fields and does not advance `turnIndexRef`: `Got it. The brief on the right is what the research reads, so edit any field there directly.` · `Noted. Nothing else is blocking — approve whenever you're ready.` · `Understood. If that changes a field, edit it in the brief and it'll go into the research.` `ConversationSchema` gains a sibling `ClosingLinesSchema = z.array(z.string().min(1)).min(1)`; `getConversation(slug)` returns `{ turns, closing }`, both Zod-parsed at the seam. That return-shape change is why `components/style-guide/sections/define.tsx` is in the build list.
- **`BriefProgress`, and its one copy template.** Presentational and stateless; A7 supplies live counts. The template lives in the `DEFINE` block and is the only place this sentence is assembled:
  ```ts
  progress: (answered: number, total: number, unknown: number) =>
    unknown === 0
      ? `${answered} of ${total} answered`
      : `${answered} of ${total} answered · ${unknown} unknown → open question${unknown === 1 ? '' : 's'}`
  ```
  `.ob-meta` at `--ob-dim` with the numerals in `.ob-meta-bright`, `aria-live="polite"`, `font-variant-numeric: tabular-nums` so a rising count doesn't jitter the band. In this phase it renders the server brief's own counts — `9 of 12 answered · 3 unknown → open questions`.
- **Reduced motion, both halves.** CSS: the app-side reduce rules go in **`obsidian-app.css` §16**, the single home [C1](#c1--stylesobsidian-appcss-the-section-map) names (A0 seeds it, A15 audits it); `styles/obsidian.css` §16 is not extended by this phase or any other. Add `.ob-msg[data-entering] { opacity: 1; transform: none; }` and `.ob-caret { animation: none; opacity: 1; }` there — resolve to the end state, never merely stop. JS: `useReducedMotion()` short-circuits `REST_MS` to 0, sets `count = text.length` on `TypingBody` mount, renders no `.ob-caret`, and skips the hold. A turn simply appears, complete.
- **§7 class list, exactly:** `.ob-define` · `.ob-define-band` · `.ob-define-split` · `.ob-define-col` · `.ob-define-scrollwrap` · `.ob-define-scroll` · `.ob-define-thread` · `.ob-define-newmsg` · `.ob-define-chips` · `.ob-define-composer` · `.ob-composer-hint` · `.ob-define-closed` · `.ob-define-aside` · `.ob-define-aside-head` · `.ob-define-aside-scroll` · `.ob-define-aside-foot` · `.ob-msg` (+ `[data-role]`, `[data-entering]`) · `.ob-msg-role` · `.ob-msg-body`. No `@keyframes`. After writing them, run the pitfalls §3 used-vs-defined diff against `styles/tokens.css` before believing any rule applied.
- **Accessibility handoff.** The transcript's `sr-only` live-region treatment and the composer's focus discipline (R7) are **A7's** — they belong with the phase that owns the aside's focus behaviour, and splitting a focus policy across two phases is how R7 happened. A6 ships the visible structure; A7 adds `aria-hidden` to it and the log beside it.

**Exit test:** With the Playwright MCP against `next dev`, load `/r/sms-rebooking-4f2a/define` at 1440×900 and again at 1280×800. **Measure `document.documentElement.scrollHeight === window.innerHeight`** — the page must not scroll at either width. Measure `.ob-define-split`'s `getBoundingClientRect().height` and assert it equals `innerHeight - 72 - 96` exactly, and that `.ob-define-aside`'s width computes to `440px` at both widths. Read computed `color` on `.ob-msg[data-role="assistant"] .ob-msg-body` (`rgb(244, 244, 245)`) and on `[data-role="user"] .ob-msg-body` (`rgb(138, 138, 147)`), and computed `fontSize` 16px vs 14px. Assert `.ob-msg-body` and `.ob-composer` report the same `getBoundingClientRect().left`. Prove the cascade landed (pitfalls §1): `.ob-define-chips` carries `gap-2` and computed `columnGap` must be `8px`, not `0px`. Capture `.ob-define-composer` and `.ob-define-aside` `getBoundingClientRect().top` before the first AI turn arrives and 6s later — **both identical, proving no layout shift from streamed content** (standing rule 12). Run the pitfalls §6 sticky audit over `.ob-define` — zero results — and assert `getComputedStyle('.ob-define-newmsg').position === 'absolute'` while `.ob-define-scroll`'s height is unchanged with the pill present and absent (R11). Prove R3 is closed: `['composer','message-text','message-text--ai','message-text--user'].every(c => document.getElementsByClassName(c).length === 0)`. Type two messages in rapid succession while a turn is streaming and assert both appear in the transcript and both receive an answer, in order. Confirm exactly one `.ob-btn-primary` is visible in the viewport. Scan every element's `color`, `backgroundColor` and `borderTopColor` under `.ob-define-split > :first-child` for `rgb(45, 127, 249)` — the only hit may be `.ob-caret`. Then `emulateMedia({ reducedMotion: 'reduce' })`, reload, wait 1200ms, and assert `document.querySelector('.ob-caret') === null`, the first AI turn's full text is present, and `getComputedStyle('.ob-msg').opacity === '1'` with `transform: none`. Finish per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A7 — Define: the live brief mechanic

**Goal:** the brief becomes live client state layered over the fixture, so pressing `I don't know` actually marks a field `unknown → open question`, the counts move, the consequence of approving early is stated in words, and all of it survives a reload. This is the phase that makes the product's headline promise true. Implements **D10** and **D12**; fixes **R5**, **R6**, **R7**, **R8**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/pitfalls.md` (§3 undefined custom properties, §10 reduced motion resolving), `references/verification.md` (§4 keyboard with real key presses), `WebsiteLayoutDesc/06-page-define.md`, `WebsiteLayoutDesc/11-interaction-patterns.md`, and this plan's [C1](#c1--stylesobsidian-appcss-the-section-map), [C4](#c4--the-brief-state-libbrief-statets) and [C6](#c6--openquestion-priority-brief-link-fan-out) — **read C4 before writing a line of this phase.**

**Build:**
- `styles/obsidian-app.css` **§8 `DEFINE — BRIEF PANEL`** — fill the banner A0 left empty, per [C1](#c1--stylesobsidian-appcss-the-section-map). §7 is A6's and is not touched.
- `lib/hooks/use-brief-state.ts` — **`useBriefState(slug, brief)`**, the one new module in this phase.
- `components/define/brief-panel.tsx` — `BriefPanel`, rewritten.
- `components/define/brief-field.tsx` — `BriefField`, rewritten; prop count drops from 16 to 6.
- `components/define/dont-know-button.tsx` — `DontKnowButton`, now functional.
- `components/define/approve-button.tsx` — `ApproveButton`.
- `components/define/consequence-line.tsx` — **`ConsequenceLine`**, new (already in the naming contract).
- `components/define/define-handoff.tsx` — **`DefineHandoff`**, new. *Add to the naming contract.*
- `components/define/define-conversation.tsx` — wire the controller to `useBriefState`; delete `oneLinerOverride` and the `resolveIdeaText` initialiser.
- `components/style-guide/sections/define.tsx` — drops the `oneLinerOverride` prop from its `BriefPanel` call. One line; without it `npx tsc --noEmit` fails and [C14](#c14--every-exit-test-ends-the-same-way) can't pass.
- `lib/fixtures/conversation.ts` — one reorder (below).
- `lib/content/app.ts` — the `BRIEF` block.

**Not built here, and the three that most need saying:**
- **`lib/brief-state.ts` is not written, extended, or re-signed in this phase.** [C4](#c4--the-brief-state-libbrief-statets) fixes its exported surface and A1 ships it complete against that signature, with `tests/unit/brief-state.test.ts` written to the same names. A7's job is the hook and the components above it. **There is no rewrite here and nothing in the module's API is A7's to change** — if a component seems to need a different signature, C4 changes, not the module.
- **`lib/schemas/open-question.ts` and `lib/fixtures/open-questions.ts` do not exist and are not created.** Per [C6](#c6--openquestion-priority-brief-link-fan-out), `brief_field: BriefFieldKeySchema.nullable()` lives on `OpenQuestion` in `lib/schemas/roadmap.ts`, beside the refinements that validate it, and A1 lands it with the fixture values. Not `from_brief_field`, not `string`, not a second module.
- `styles/tokens.css` — [C2](#c2--foundation-ownership); this phase declares no token. `SETTLE_MS = 900` is asserted against `--ob-enter`, not defined as anything.

**Notes:**

- **What the hook does, given the module already exists.** `useBriefState(slug, brief)` is a thin `useReducer` over `briefReducer`/`emptyBriefPatch` plus three effects: hydrate on mount, persist on change via `writeBriefPatch`, and mirror edited *values*. Return shape, and the only thing every component below consumes:
  ```ts
  {
    brief: Brief;                 // resolved, still passes BriefSchema
    revealed: BriefFieldKey[];
    unknown: BriefFieldKey[];     // unknownKeys(base, patch)
    answered: number; unanswered: number;
    coreFilled: boolean; approvedAt: string | null;
    reveal(key: BriefFieldKey): void;      // one key per call, per C4
    markUnknown(key: BriefFieldKey): void;
    edit(key: BriefFieldKey, value: string | string[]): void;
    approve(at: string): void;
  }
  ```
  A turn that fills two keys dispatches two `reveal`s; the action carries one `key`, not an array.
- **Where the edited values live.** On the patch, in `values` ([C4](#c4--the-brief-state-libbrief-statets)) — `edited` records *which* keys the user retyped and `values` records what to. The hook holds no parallel value state, reads no second key, and applies nothing to `base` before calling `resolveBrief(base, patch)`; the resolver has everything it needs. **One function resolves a field's displayed value and the component never reaches around it** — that single-resolver property is what makes R6's class of bug unrepresentable, and it is why nothing is applied outside it or sprinkled through `BriefField`.
- **`patch.unknown` records what the user marked.** The fixture's own three (`who_decides`, `what_makes_this_different`, `how_customers_find_it`) live on the server `Brief` and are never copied into storage — a stored copy would freeze a fixture change into a returning user's browser, which is the same reason C4 forbids storing a resolved brief. `unknownKeys(base, patch)` returns the **union**, which is the sense in which C4 documents the field as unknown "by the user or the fixture", and it is the single reader every surface uses: `BriefProgress`, `ConsequenceLine`, and A11's promotion pass alike.
- **`sv.brief.<slug>` is the seam.** `page.tsx` awaits `getBrief(slug)` and passes the Zod-parsed `Brief` down as a prop; the hook layers over that prop. **No component imports a fixture.** A future `PATCH /api/brief` swaps `writeBriefPatch` and the values mirror, and nothing else.
- **R8 — hydration.** The reducer's initial state is `emptyBriefPatch()`, derived from nothing but the server `brief`. `readBriefPatch`, the values mirror and `readStoredIdeaText` are all read in a **mount effect** that dispatches `hydrate`. Never during render. `resolveIdeaText`'s `useState(() => …)` initialiser is deleted outright — it is the mismatch. The seeded user message types in after mount anyway (A6), so the server HTML and the first client render are identical.
- **R6 — the one-liner.** `one_liner` becomes an ordinary field: no prop, no special case. It is seeded during `hydrate` from `readStoredIdeaText(slug) ?? brief.one_liner.value`, recorded through the same `edit` path as any other field. The `oneLinerOverride` prop is deleted from `BriefPanel` and both of its call sites, and `valueFor()` loses its short-circuit entirely. **The special case was the bug; delete the special case, not the symptom.**
- **R5 — `DontKnowButton` becomes functional.** The controller tracks `currentAsk = conversation.turns[turnIndexRef.current - 1]?.fills[0] ?? null` — the field the last completed AI turn asked about. Press → `markUnknown(currentAsk)`, append a user turn with the literal text `I don't know` (it is what the user said), then play a **transient acknowledgement turn** before the next scripted question. The ack comes from a new `dontKnowAckFixture` array, cycled, and does **not** advance `turnIndexRef`: `That's fine — it goes in as an open question.` · `No problem. I'll leave that one open.` · `Fine — that becomes something to find out.` The script never revisits a filled field, so **the AI never re-asks**. Before the first AI turn completes, `currentAsk` is `null` and the button carries `aria-disabled="true"` with a no-op handler (so it stays focusable) plus `aria-describedby` pointing at an `sr-only` span: `Available once the first question is asked.`
- **The handoff to A11, in one sentence and no more.** `OpenQuestion.brief_field` is [C6](#c6--openquestion-priority-brief-link-fan-out)'s and A1 ships it; A11 owns the promotion pass, the `FROM YOUR BRIEF` badge and the `ALSO UNKNOWN` well. All this phase guarantees is that `unknownKeys(base, patch)` is readable from `/roadmap` at first paint and after hydration. **An unknown field with no matching fixture question adds nothing — no question is ever fabricated to match a field the user skipped**, and that rule belongs to both phases equally.
- **The four field states plus one marker**, all on `.ob-brief-field[data-state]` / `[data-edited='true']`:
  - **`waiting`** (not yet determined) — mono label at `--ob-dim`, and in place of a value a full-width `1px` rule at `--ob-hairline`. **No shimmer, no animation.** Critique (q) is right: eleven simultaneous shimmer bars read as a stalled fetch. Eleven quiet ruled lines read as an outline of what is coming. **Shimmer on Define now means one thing only — pending-because-loading — and it exists only in `app/r/[slug]/define/loading.tsx`** (A14, R20), where A14 has already ruled it a static block anyway.
  - **`settling`** (being determined) — the value fades `--ob-dim` → `--ob-text` over `--ob-base` while `.ob-brief-rule` draws itself `scaleX(0) → scaleX(1)` from the left over `--ob-enter` (900ms), `transform-origin: left center`. `SETTLE_MS = 900`, asserted equal to `--ob-enter`. **The rule is `--ob-hairline-strong`, not accent.** The blueprint's amber tint would become blue here, and a field being filled in is not a primary action, not a verification, and not a live state — it fails all three jobs, so it does not get the accent. It gets the same self-drawing-rule device the verification moment uses, in chalk.
  - **`filled`** — mono `.ob-brief-label` at `--ob-dim`, `.ob-brief-value` at `--ob-text` `--ob-sm` 14px, a 13px `Pencil` at `--ob-dim` appearing on `:hover`/`:focus-visible` at the row's right edge.
  - **`unknown`** — the word `unknown` in `--ob-muted` italic, followed by `.ob-tag-open`: `--ob-r-tag` 4px, `border: 1px dashed var(--ob-hairline-strong)`, mono 10px uppercase `--ob-dim`, reading `→ OPEN QUESTION`. Not blue, not red — **there is no red in this system**, and an unanswered field is not a failure.
  - **`edited`** is a marker, not a state: `.ob-tag-edited`, mono 10px `--ob-dim`, `EDITED`, beside the label. Reverting to the original value clears both the marker and the key from `patch.edited`.
- **Field labels have one home.** The twelve display strings (`One-liner`, `Product`, `Customer`, `Who decides`, `Problem`, `How they solve it today`, `What makes this different`, `First version scope`, `How it makes money`, `How customers find it`, `Assumptions`, `Open questions`) and the five-group ordering move out of `brief-panel.tsx` into the `BRIEF` block of `lib/content/app.ts` as `fieldLabels` / `fieldGroups`. A11's `You marked "Who decides" unknown.` line and A14's `define/loading.tsx` both read `fieldLabels`, so the string exists once. **This is page copy, not one of [C3](#c3--vocabulary-maps-one-home-libschemasevidencets)'s vocabulary maps** — C3 governs the dimension / stance / discard vocabulary and is untouched by this phase.
- **One editing model.** Today string fields need a click (Enter/Esc/blur commit) and list items are always-live inputs with no commit key. **Unify toward the explicit model: a list field is edited as a whole.** Clicking a field or its `Pencil` opens exactly one `.ob-brief-editor` — an `<input>` for a string field, a `<textarea>` for a list field with **one item per line**. `Enter` commits a string; in the list textarea `Enter` makes a new item and `⌘/Ctrl+Enter` commits; `Esc` cancels; blur commits both. Commit for a list is `value.split('\n').map(s => s.trim()).filter(Boolean)`, dispatched as a single `edit`. `InlineEditableList`'s per-item `×`/`+ Add` UI leaves Define; if nothing else references the component after this phase, A15 deletes it. Locked list rendering keys on index, killing the duplicate-`key` collision on repeated strings.
- **R7 — focus stealing.** `finishAiTurn` focuses the composer **only when focus is not already somewhere deliberate**: `const el = document.activeElement; if (!el || el === document.body || transcriptColRef.current?.contains(el)) composerRef.current?.focus();`. **Focus is never taken out of the aside column.** `onBlur={onCommit}` on the editor stays — it is correct for a click-away — and is now safe because nothing yanks focus mid-edit.
- **D12 — gating.** Core fields are exactly five: **`one_liner`, `product`, `customer`, `problem`, `first_version_scope`** — what it is, who it is for, what is broken, and what v1 covers, i.e. everything a research run needs to generate queries. Everything else refines. To reach that at D12's stated ~turn 5, move the `first_version_scope` turn from index 6 to index 4 in `conversationFixture` (D3); the new order is `product · customer · problem · how_they_solve_it_today · first_version_scope · who_decides · what_makes_this_different · how_it_makes_money · how_customers_find_it · assumptions · open_questions`. No turn text changes — both moved turns open with transitions that read correctly in the new position. `coreFilled(base, patch)` is C4's function and is the only test of the threshold. **`ApproveButton` is absent before `coreFilled`, never disabled**, and appears on turn 5's settle. Talking past it is optional.
- **`ConsequenceLine`.** Rendered at `--ob-sm` 14px `--ob-muted`, `max-width: 36ch`, directly above the button in `.ob-define-aside-foot` (A6 owns that slot's box; this phase owns what sits in it), with `aria-live="polite"`. "Unanswered" means fields marked `unknown` **plus** fields the conversation has not yet reached — the honest count, and the reason the line moves while you talk. Exact template in the `BRIEF` block:
  ```ts
  consequence: (n: number) =>
    n === 0
      ? 'Nothing is unanswered. The research starts from a complete brief.'
      : `Approve now and ${n} unanswered ${n === 1 ? 'field becomes an open question' : 'fields become open questions'}.`
  ```
  The four points that matter, all derived from `unansweredCount(base, patch)` and none of them typed as a string: at the earliest approve (end of turn 5, 6 of 12 revealed) `Approve now and 6 unanswered fields become open questions.` · mid-conversation with one Don't-Know pressed (end of turn 8) `Approve now and 4 unanswered fields become open questions.` · full script on fixture defaults `Approve now and 3 unanswered fields become open questions.` · the singular case `Approve now and 1 unanswered field becomes an open question.`
- **`BriefProgress` is A6's component and A6's copy template.** This phase changes one thing about it: the three numbers now come from `answeredCount` / `unknownKeys` / `BRIEF_FIELD_KEYS.length` through the hook instead of from the server brief. Do not re-author the template here; it exists once, in the `DEFINE` block.
- **Approve.** `ApproveButton` is the page's one `.ob-btn-primary`, full width of the aside foot, label `Approve and research`; beneath it in sans `--ob-sm` `--ob-dim`: `Takes about five minutes.` (spelled out — the mono numeral layer is for data). On click, `approving`: 14px `Spinner` + label `Starting research…`, disabled, `APPROVE_SPINNER_MS = 600` (300ms is below perception). Then `approve(now)` → the brief locks read-only, `.ob-define-aside-head` gains `.ob-meta` `APPROVED 14:32 · LOCKED WHILE RESEARCH RUNS`, and `markRunStarted(slug)` + `upsertRecentRun({ stage: 'validating' })` fire. The lock is `[data-approved='true']` on `.ob-brief`, which removes every `.ob-brief-edit` affordance and makes each row a plain `<div>` again — a disabled button the user can still tab to on a locked panel is noise.
- **No `Modal` on Define.** A2's disposition note predicts this phase gives `Modal` its first call site; it does not. Approving is a direct action, and a confirmation dialog over a decision the product explicitly tells you it is fine to take early would contradict D12. **Record in the build log that `Modal` is still call-site-free** so A13 or A14 can claim it rather than each assuming the other did.
- **The bookmark line gets read.** Today it flashes for 500ms; it is one of the IA's three non-optional access obligations. **On approve, `DefineHandoff` replaces the whole left column** — not a line under a composer: `.ob-meta` `RUN STARTED`; `.ob-h2` `This page is your run.`; `.ob-lead` `Bookmark it — there's no login to get back.`; the full run URL as selectable mono `--ob-sm` in a `--ob-surface` box with a hairline, beside a `CopyLinkButton`; and a `.ob-btn .ob-btn-primary` reading `Watch the research →`. Under it `.ob-define-handoff-rule` draws `scaleX(0) → scaleX(1)` in `--ob-accent` over `APPROVE_HANDOFF_MS = 4000`, then the redirect fires — **blue because the run is live, which is job three.** The button skips ahead immediately. Because the left column's primary now exists, the aside's `ApproveButton` is gone by construction and rule 11 holds through the transition. **Under reduced motion there is no auto-redirect at all** and the rule is static at `scaleX(1)`: an auto-advance the user did not trigger is motion, and the escape is the button that is already there.
- **Accessibility.** The visible transcript (A6's structure) gains `aria-hidden="true"`; a sibling `<div className="sr-only" role="log" aria-live="polite" aria-relevant="additions">` receives one `<p>` per **completed** turn, prefixed `Groundwork: ` or `You: `. That gives exactly one announcement per turn at the moment it arrives and none per character — today only `RestIndicator` announces, i.e. the waiting and not the answer. `RestIndicator` keeps its `<output aria-label="AI is composing">`. Each brief row in display mode is a `<button>` with `aria-label={`${label}: ${value}. Edit.`}`; an unknown row announces `${label}: unknown, will become an open question.`
- **Reduced motion.** Both halves, and the CSS half goes in **`obsidian-app.css` §16** — the single app-side home [C1](#c1--stylesobsidian-appcss-the-section-map) names; `styles/obsidian.css` §16 is not extended. Add `.ob-brief-rule { transform: scaleX(1); }` and `.ob-define-handoff-rule { transform: scaleX(1); }` (pitfalls §10 — resolve, never freeze). The JS half is the suppressed auto-redirect above, branched from `useReducedMotion()` (A6's hook), read in an effect and never during render.
- **§8 class list, exactly:** `.ob-brief` (+ `[data-approved='true']`) · `.ob-brief-group` · `.ob-brief-field` (+ `[data-state='waiting'|'settling'|'filled'|'unknown']`, `[data-edited='true']`) · `.ob-brief-label` · `.ob-brief-value` · `.ob-brief-rule` · `.ob-brief-edit` · `.ob-brief-editor` · `.ob-tag-open` · `.ob-tag-edited` · `.ob-brief-progress` · `.ob-consequence` · `.ob-approve` · `.ob-define-handoff` · `.ob-define-handoff-url` · `.ob-define-handoff-rule`. **No `@keyframes`** — both rules here are transitions on `transform`, not animations; if one is ever needed it is prefixed `ob-app-` per [C1](#c1--stylesobsidian-appcss-the-section-map). After writing them, run the pitfalls §3 diff of used-vs-defined custom properties against `styles/tokens.css` before believing any rule applied.
- **The hook applies nothing itself.** [C4](#c4--the-brief-state-libbrief-statets) now carries edited values on the patch (`values`), so `useBriefState` hydrates one object from one key and hands it straight to `resolveBrief(base, patch)`. There is no second store to read and no pre-pass over `base` — if you find yourself writing one, the patch you loaded is the old shape.

**Exit test:** With the Playwright MCP against `next dev` at 1440×900, load `/r/sms-rebooking-4f2a/define` with `localStorage` cleared and wait for the first AI turn to settle. Assert `document.querySelectorAll('.skeleton, .ob-skeleton').length === 0` and that `[data-state="waiting"]` counts **11** at first paint (twelve fields less the seeded one-liner). **Click `I don't know` with a real mouse click**, then assert three things changed together: the asked field's `data-state` is `unknown` and it contains `.ob-tag-open`; `.ob-brief-progress` text has incremented its unknown count by one; `.ob-consequence` text has changed. **Reload and assert the same field is still `unknown`**, then read `localStorage['sv.brief.sms-rebooking-4f2a']` and confirm it parses to `{ v: 1, revealed, unknown, edited, values, approvedAt }` with the `unknown` array holding **only** the key you clicked — no resolved brief, no fixture unknowns, no `version` key, and **no second `sv.brief.<slug>.values` key in `localStorage` at all**. Click the one-liner, type a new value, press `Enter`, and assert the displayed text is the new value (not the original) and `.ob-tag-edited` is present — R6 — then reload and confirm the edit survives — carried in the patch's own `values` map under the single `sv.brief.<slug>` key. Open a brief field editor, then wait for an AI turn to complete, and assert `document.activeElement` is still the editor and its value is unchanged — R7. Read computed `transform` on `.ob-brief-rule` for a just-settled field over six 300ms samples and confirm it moves `matrix(0, …)` → `matrix(1, …)`; a sample set that is `matrix(1, …)` throughout means the rAF flip ran in the insertion frame and the transition never played, which is a failure, not a pass. Confirm `ApproveButton` is **absent** from the DOM before turn 5 settles (not merely disabled) and present after, and that exactly one `.ob-btn-primary` is visible before approve and exactly one after. Tab the aside with real `Tab` presses and confirm every control shows an indicator resolving to `rgb(45, 127, 249)` with `transitionDuration: 0s`. Scan every element under `.ob-define-aside` for a computed `color`/`backgroundColor`/`borderTopColor` matching `rgb(r,g,b)` with `r > g + 40 && r > b + 40` — the result must be empty, because there is no red. Approve, and assert `.ob-define-handoff` has replaced the transcript column, the URL box holds the full run URL, and `markRunStarted` wrote `sv.runStarted.sms-rebooking-4f2a`. Then `emulateMedia({ reducedMotion: 'reduce' })`, reload, approve again, and assert the page does **not** navigate within 6s while `Watch the research →` is present and `getComputedStyle('.ob-define-handoff-rule').transform === 'matrix(1, 0, 0, 1, 0, 0)'`. Repeat the field-state and focus measurements at 1280. Finish per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A8 — Validate: the Run Console

**Goal:** the console becomes the product's strongest trust device instead of its most degraded surface. It replays A1's re-timed schedule with the first verified finding on screen inside four seconds, queries and findings overlapping, discards interleaved and reasoned, no dead tail — and it cross-fades into the report instead of hard-swapping. All four named trust devices work, in Obsidian. Implements **D8**, fixes **R4**, obeys **D17**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` (§2 timing tokens, §5a the verification sequence, §6 the reduced-motion contract, §7 performance), `references/verification.md` (§3c "did a state machine actually run", §3d layout shift), `references/pitfalls.md` (§1 layering, §3 undefined properties, §4 one transform owner, §8 screenshotting a cycling animation, §10 freeze-vs-resolve), `WebsiteLayoutDesc/07-page-validate.md` (Mode A only — the four trust devices and the state list), and **`lib/fixtures/run-events.ts` as A1 shipped it** — this phase measures against that schedule and does not author it.

**Build:**
- `lib/run-stream-reducer.ts` — add **one** export: `foldRunEvents(events: RunEvent[], initial: RunStreamState): RunStreamState`, the bulk/resume path. It forces `newestFindingId: null` on its result so a resumed or reduced-motion state animates nothing. **Nothing else is added here** — the newest discard is already `state.discarded[0]` from A1's newest-first array, and a second field holding the same fact is how two code paths start.
- `lib/hooks/use-run-stream.ts` — resume-from-offset, the derived event timeline, the reduced-motion branch, stall detection, and the newest discard threaded into `UseRunStreamResult`.
- `lib/content/app.ts` — the `APP_CONSOLE` copy block (every string below).
- `styles/obsidian-app.css` **§9 `CONSOLE`** — fill the banner A0 created. Section number, banner text and the `ob-app-` keyframes prefix are [C1](#c1--stylesobsidian-appcss-the-section-map); this phase invents no numbering and takes no "next free integer".
- `components/validate/validate-view.tsx` — rewritten: three-state mode machine + the cross-fade.
- `components/validate/console/run-console.tsx` — rewritten.
- `components/validate/console/query-ticker.tsx` — rewritten.
- `components/validate/console/console-rail.tsx` — **new**, `ConsoleRail`. *Add to the naming contract.*
- `components/validate/console/discard-ticker.tsx` — **new**, `DiscardTicker`. *Add to the naming contract.*
- `components/validate/console/finding-stream.tsx` — rewritten.
- `components/status/phase-strip.tsx`, `components/status/coverage-bar.tsx` — new signatures, console presentation.
- `components/layout/app-backdrop.tsx` — **new** `AppBackdrop`, *if A6 has not already created it*: a server component emitting `<div className="ob-backdrop" data-variant={variant} aria-hidden="true" />` over the recipe that already exists in `styles/obsidian.css`. *Add to the naming contract.*
- `app/r/[slug]/validate/page.tsx` — renders `<AppBackdrop variant="validate" />` as its first child per [C13](#c13--ownership-of-things-two-phases-both-wanted); drops the `dimensionLabels` prop; accepts `?stall=1`.
- **Delete** `<Orb dimmed />` and its import from `run-console.tsx`. The component itself lives at `components/ui/orb.tsx` after A2 and survives — C13 keeps it on A14's invalid-run page, which becomes its only call site.

**Notes:**

**What this phase does not own, and must not restate.**
- **The event schedule is A1's.** `lib/fixtures/run-events.ts`, its constants, its emission order and `run-events-timing.test.ts` all belong to the data layer. A8 consumes `runEventsFixture`, `runEventsTotalMs` and `RUN_STREAM_WINDOW_MS` and measures the consequences below; it does not edit the fixture and does not publish a competing table of absolute milliseconds. A1 also explicitly deferred two decisions to this phase — *whether the console renders the discard records* (**yes**, one at a time, see trust device 4) and *whether reload resumes* (**yes**, see mode selection).
- **The verification moment's CSS is A5's; its attributes and timings are A8's** ([C13](#c13--ownership-of-things-two-phases-both-wanted)). A5 writes `.ob-verify-rule`'s scoping and the `VerifiedBadge` opacity states into §6. A8 writes the wrapper that carries the attributes, and owns the two numbers: **card entrance `--ob-base` (320ms); badge at `+180ms`.** Do not write badge CSS into §9 and do not redefine `.ob-verify-rule` — it lives in `styles/obsidian.css` §12.
- **The header meta is A4's `buildMetaParts` table** and A8 does not extend it. A4's rule — "the header meta is the run's static ledger, it does not branch on stream state" — is the reason: the live discard count belongs on the page, and the settled `18 DISCARDED` belongs to `/sources` and to A9's report `MetaLine`, both of which already carry it.
- **Tokens and the stylesheet file are A0's** ([C2](#c2--foundation-ownership)). A8 declares no token. The ticker's row pitch is a **recipe-local custom property**, `.ob-ticker { --ob-ticker-row: 34px }`, scoped to the one component that uses it — a row height used by a single recipe was never a design token.
- **Discards are [C9](#c9--discards).** The record has no `text`, the reason renders through `DISCARD_REASON_LABEL` from `lib/schemas/evidence.ts` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)), never as the raw key, and never in `--ob-discard`.
- **`Fragment` is not used here.** The console *is* a live product surface; it is not a code-drawn depiction of one. A2's promotion of `components/ui/fragment.tsx` must not count this phase as a consumer.

**The re-timing (D8), as consequences A8 measures.** The old fixture was a sequence, not a run: 19 queries finished before finding #1 existed (17s of "Nothing verified yet."), then ~40s of a frozen "Writing" screen. A1's replacement interleaves them. From A1's constants the checkpoints are **`phase verifying` at 3,260ms · first `finding.verified` at 3,880ms · `runEventsTotalMs` ≈ 45,080ms**, with the last discard after verified #45 and the tail being `writing` (420ms) then `complete` (900ms). **These are consequences to verify in the browser, not to assume:**

| What must be true on screen | Where it comes from |
|---|---|
| A query row ticks inside the first second | queries 0–5 emit at 90/130ms cadence from t=0 |
| Two or more query rows read `running` at some sample, and the running *set changes* between samples | queries 13–18 are interleaved after verified findings 1/3/5/7/9/11 |
| First card lands under **4s**, and unconditionally under the phase's headline 6s | first `finding.verified` at 3,880ms |
| No surface is silent for more than **1.0s** | largest single delay constant is 940ms; the 8,000ms stall chain is therefore never tripped by the fixture |
| The gap between the last finding and `complete` is **1,320ms** | `WRITING_PHASE_DELAY` 420 + `COMPLETE_DELAY` 900 |
| The clock freezes at `0:45` | `runEventsTotalMs` ≈ 45,080ms |

The elapsed clock is **wall time** (`Date.now() - startedAtMs`), never a sum of `delayMs`, so it cannot drift from the replay.

**Layout.** `.ob-console` declares a recipe-local `--ob-console-chrome: calc(var(--ob-header-h) + 64px)` — A4's fixed header plus A4's 64px `.ob-run-footer`, asserted here, declared there — and fills `min-height: calc(100vh - var(--ob-console-chrome))`, `padding-block: 48px 40px`, inside `.ob-container-app`. **A4's `chrome: 'document'` stands and the run footer keeps rendering on Mode A** (this is the decision A4 handed to A8): subtracting its height is cheaper than making `RunShell` mode-aware, it keeps `window.scrollY` at 0 for the cross-fade, and the footer's register — run id, copy link, start another idea — is chrome, not a second instruction. `.ob-console-head` is a title band with `min-height: 168px` **reserved** — h1 `Reading the web about your idea.` at `--ob-h1` (Mode A stays at `--ob-h1`; A9 owns the page's one `--ob-display` moment), the one-liner at `--ob-lead` `--ob-muted`, then the `PhaseStrip`. `.ob-console-grid` is `grid-template-columns: 320px minmax(0,1fr); gap: 64px; flex: 1; min-height: 0`. `.ob-console-rail` is `position: sticky; top: calc(var(--ob-header-h) + 24px); align-self: start; display: flex; flex-direction: column; gap: 28px`, its three blocks separated by `<hr className="ob-rule" />` — reuse, no new separator class. `.ob-console-foot` beneath the grid at `.ob-body`, `max-w-[62ch]`, `min-height: 36px` reserved: `You can close this tab — the run keeps going. Come back to this link.`

**`ConsoleRail`** is the rail's composition and exists so `RunConsole` stops being a 200-line client component that also does layout:
```ts
ConsoleRail({ slug, queries, expanded, onToggleExpand, counts, running, elapsedMs,
              discardedCount, lastDiscard }: {
  slug: string; queries: QueryRow[]; expanded: boolean; onToggleExpand: () => void;
  counts: Record<Dimension, number>; running: boolean; elapsedMs: number;
  discardedCount: number; lastDiscard: DiscardedFinding | null;
})
```

**`PhaseStrip` — four phases, elapsed, no percentage, no ETA, ever.** `.ob-phase` / `.ob-phase-list` / `.ob-phase-item[data-state='pending'|'active'|'done']` / `.ob-phase-clock` / `.ob-phase-note`. **These classes are §9's, not §3's:** C1 scopes A2's §3 to button, chip, pill, input, drawer, modal, popover, accordion and slot, and a `data-state` API and a `.ob-phase-item-active` modifier API cannot both drive one component — where A2's draft class list still names `.ob-phase-item-active` / `-done` or `.ob-coverage*`, this phase's attribute contract supersedes it. Labels mono 12px uppercase: `SEARCHING` `FETCHING` `VERIFYING` `WRITING`. `pending` = `--ob-dim` at `opacity: .5`; `done` = `--ob-dim` at full; `active` = `--ob-text` preceded by a 6px `.ob-dot` (accent — **live state, one of blue's three jobs, and the one pulsing thing in the system**; it reuses `obsidian.css`'s existing `ob-pulse`, and §9 declares no keyframes for it). Exactly one `.ob-dot` is ever visible on this page. Separator is `.ob-phase-item + .ob-phase-item { border-left: 1px solid var(--ob-hairline); margin-left: 16px; padding-left: 16px }` — a hairline, not a glyph. Clock is mono `tabular-nums`, `min-width: 5ch` so `0:09 → 0:10` cannot jitter the band. `.ob-phase-note` reserves `min-height: 17px` permanently. New signature:
```ts
PhaseStrip({ phase, elapsedMs, state, note, className }: {
  phase: RunPhaseName; elapsedMs: number;
  state: 'connecting' | 'running' | 'stalled' | 'complete';
  note?: string; className?: string;
})
```

**Trust device 1 — `QueryTicker`, which must actually tick.** Today it renders `queries.slice(0, 5)`: all five read `✓` early and never change, queries 6–19 run invisibly behind `… 14 more`, and `onToggleExpand` is one-way.
- **Window.** `frontier` = the highest index whose state is not `queued`. `windowStart = clamp(frontier - 3, 0, queries.length - 6)`. The track holds **all 19 rows**; `.ob-ticker-view` clips to `calc(6 * var(--ob-ticker-row))` = 204px and masks its top and bottom 14px with a linear-gradient so rows dissolve at the edges. `.ob-ticker-track` carries `transform: translateY(calc(var(--ob-ticker-offset, 0) * var(--ob-ticker-row) * -1)); transition: transform var(--ob-base) var(--ob-ease)`, with `--ob-ticker-offset` set inline from `windowStart`. **The list rolls on a compositor transform — never a height, top or margin animation (motion.md §7), and `transform` on this node has exactly one owner: CSS reads the variable, React writes only the variable (pitfalls §4).**
- **Expand/collapse is two-way**: `onToggleExpand: () => setQueriesExpanded((v) => !v)`. `[data-expanded='true']` sets the view height to `calc(19 * var(--ob-ticker-row))` and `mask-image: none`; the offset goes to 0. **The height change is instantaneous and deliberately untransitioned** — height is a layout property and the system does not animate one. Button copy: collapsed `All 19 queries ↓`, expanded `Collapse ↑`, both `.ob-btn-bare` at `--ob-meta`.
- **Overflow (the live bug).** `.ob-qrow` is `grid-template-columns: 14px minmax(0,1fr); gap: 8px; height: 26px; margin-bottom: 8px` — 34px pitch, matching `--ob-ticker-row`. `.ob-qrow-text` is mono **12px** (not 14), `text-transform: none`, `letter-spacing: 0`, `white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0`. The longest query is `dental practice management marketplace add-ons` (45 chars ≈ 356px) against ~284px of text column, so it ellipsises by design; the full string is carried in `title` and in the aria-live summary, so nothing is lost. Colour: `running` → `--ob-muted`, `queued`/`done` → `--ob-dim`.
- **R4 — the glyph, which is defined in no stylesheet today.** `.ob-qglyph` = `width: 14px; text-align: center; font-size: 11px; line-height: 1`, plus three states: `[data-state='queued']` `○` `--ob-dim` `opacity: .55` · `[data-state='running']` `◐` `var(--ob-accent)` with `animation: ob-app-qspin 1.6s linear infinite` · `[data-state='done']` `✓` `--ob-dim`. The new `@keyframes ob-app-qspin { to { transform: rotate(360deg) } }` carries the `ob-app-` prefix C1 requires and is grepped across `styles/*.css` before it is written. **`done` is deliberately not blue: a query returning is not a verification. Blue here is doing the live/active job on `◐` and nothing else.** Emit the state as a `data-state` attribute, not a `--modifier` class, so the exit test can read it.

**Trust device 2 — `CoverageBar` ×5.** `.ob-cov` group; `.ob-cov-row` is `grid-template-columns: 84px minmax(0,1fr) 34px 30px; gap: 12px; height: 22px`. **Labels come from `DIMENSION_SHORT`** (C3) — `Problem` `Exists` `Demand` `Money` `Practical`, uppercased in CSS, never a second string — so the label column is 84px, not the 124px the long vocabulary needed. `.ob-cov-track` 2px `--ob-hairline`; `.ob-cov-fill` 2px `background: var(--ob-text)` — **chalk, not blue: a coverage count is neither action, verification, nor live** — with `transform-origin: left center; transform: scaleX(var(--ob-cov-fill, 0)); transition: transform var(--ob-base) var(--ob-ease)`. Bar is relative to the run's own maximum (`Math.max(1, ...counts)`), never to 100%. `.ob-cov-count` mono `tabular-nums` `--ob-text`, right-aligned — **the raw count is the truth, the bar is the gesture.**
- **The `thin` tag.** Rendered when `count <= 1 && (!running || elapsedMs > 24_000)` — past the midpoint of a ~45s run. `.ob-cov-thin` is a 10px mono lowercase chip, `--ob-r-tag`, 1px `--ob-hairline`, `--ob-dim`, reading `thin`. **Its 34px column exists in the grid from first paint whether or not the tag is present**, so its arrival shifts nothing (standing rule 12). On the canonical fixture `PRACTICAL` (final count 2) sits at 0–1 past 24s and earns it; `MONEY` never does.
- Prop: `CoverageBar({ label, count, max, thin, className }: { label: string; count: number; max: number; thin?: boolean; className?: string })`.

**Trust device 3 — `FindingStream`.**
- **R4 — `.finding-card--entering` exists in no stylesheet, so the entrance and the delayed badge are inert.** The stream owns arrival, not `FindingCard` (which A5 keeps presentational). Each card is wrapped in `<li className="ob-fstream-item" data-entered={…}>`, mounted `data-entered="false"` and flipped to `"true"` one `requestAnimationFrame` later — **a value set in the same frame as insertion does not transition, and a card that reads `true` in every sample is the failure signature, not a pass.** `.ob-fstream-item` = `opacity: 0; transform: translateY(12px); transition: opacity var(--ob-base) var(--ob-ease), transform var(--ob-base) var(--ob-ease)`; `[data-entered='true']` resolves to `opacity: 1; transform: none`. **Fade + 12px rise over 320ms.** Delete the 520ms `justArrivedId` timer — it controlled a class that animated nothing.
- **The delayed `VERIFIED` badge — and it is delayed behind the *rule*, not behind the card.** The item's rAF sets `data-state="verified"` on the `FindingCard`, and **A8 owns the two numbers A5's §6 rule carries: the badge's opacity transition is `var(--ob-fast)` (180ms), delayed `calc(var(--ob-base) + var(--ob-enter))` (1220ms)** — entrance 320ms, then `.ob-verify-rule` drawing for 900ms, then the badge over 180ms as the rule lands. Still three durations, no fourth. **This is [C13](#c13--ownership-of-things-two-phases-both-wanted)'s sequence table, spelled once.** An earlier draft delayed the badge only 180ms, putting the verdict on screen at ~360ms while the proof was still drawing — do not shorten it back.
- **The `.ob-verify-rule` draws itself beneath the excerpt**, over `--ob-enter`, from A5's recipe. Its 1px plus margins are reserved in the pending state so nothing moves when it draws.
- **Excerpt inline during the run, never behind a click** — `variant="stream"` already does this; it is a constraint, not an option. All three `FindingCard` variants survive (C13); this phase deletes none of them.
- Cap at 25 with `+{n} earlier findings` in `.ob-fstream-more` (`.ob-btn-bare`).
- **Scroll management — the structural fix.** Today cards prepend into a column that grows past 5,000px, and anyone who scrolls to read gets pushed down by every arrival. **The stream becomes its own scrollport and the page stops growing at all.** `.ob-fstream` = `overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; height: calc(100vh - var(--ob-console-chrome) - 292px); min-height: 420px; position: relative` — 292 = the head's reserved 168 + the 88 of `padding-block` + the footer line's 36. On every arrival a `useLayoutEffect` compares `scrollHeight` before and after the commit and, **when `scrollTop > 4`, adds the delta to `scrollTop`** — the user's reading position is pinned to the pixel. When `scrollTop <= 4` (the default) it does nothing and cards simply appear at the top. A `.ob-fstream-jump` control sits `position: sticky; top: 0` **inside the scrollport** (this is R11's mistake made correctly — the pill must be a child of the scroll container, never a sibling) reading `↑ {n} new`, counting arrivals since the user scrolled away; clicking scrolls to 0 and clears. Styled `.ob-btn .ob-btn-ghost` with `padding: 6px 14px` and `font-size: var(--ob-meta)`.
- Signature: `FindingStream({ findings, newestFindingId, running, connecting }: { findings: Finding[]; newestFindingId: string | null; running: boolean; connecting: boolean })`.

**Trust device 4 — the discard count, and what it now says.** A1's `finding.discarded` event carries the **full `DiscardedFinding` record**, and the reducer accumulates them newest-first, so the console reads `stream.discarded[0]` and needs no second shape. **Decision, the one A1 deferred here: the console surfaces one discard at a time, live, and never accumulates a list.** `DiscardTicker` renders the standing line `<span class="ob-em">{count}</span> excerpts discarded` / `didn't match the page`, plus a single fixed slot beneath it showing only the most recent:
- `.ob-discard-last-meta` — mono `--ob-meta`, `--ob-discard`: `LAST · {formatDomain(record.source_url)}`.
- `.ob-discard-last-reason` — **sans, `--ob-sm`, `--ob-muted`**, rendered as `DISCARD_REASON_LABEL[record.discard_reason]` and never the enum key (C9). `--ob-discard` measures 2.25:1 and is deliberately illegible; the sentence D15 exists to surface must not be set in it, which is why only the `LAST ·` prefix and the domain wear it.
- `.ob-discard-last` reserves `min-height: 66px` — one 17px mono line, 6px, and two 14px/1.5 sans lines, which is what the longest of the four labels (`The quote was a paraphrase, not the page's own words.`) occupies in a 320px rail. All four labels must occupy the same slot height; the exit test measures it rather than trusting it.
- Each swap blinks the slot to `opacity: 0` for `--ob-fast` and back — the only motion in the block. **A number is a claim; one visible reason at a time is proof, and one slot costs no vertical growth and no attention.** It is the same argument the landing page's verification section makes by letting one of three excerpts fail.
- On `complete` the slot resolves to `.ob-discard-done`: `All {n} are listed in Sources.` (sans, `--ob-sm`) with a `TextAction` to `/r/{slug}/sources`.
- `DiscardTicker({ count, last, running }: { count: number; last: DiscardedFinding | null; running: boolean })`.

**The `Orb` — cut it, and put something honest in its place.** It is `position: absolute; bottom: -240px; z-index: -1` inside a column that grew to ~5,000px, so it has always parked below the fold; the positioning bug is a symptom of it never having had a job here. It is also Deep Canopy (`.orb` lives in `styles/components.css`, which A15 deletes). Obsidian's ambient field is `.ob-backdrop`, `position: fixed`, which cannot fall below a growing column — and per [C13](#c13--ownership-of-things-two-phases-both-wanted) **the page mounts it, not `RunShell`**: `app/r/[slug]/validate/page.tsx` renders `<AppBackdrop variant="validate" />` as its first child, one field serving both Mode A and Mode B, because the page cannot know the client-side mode and **two ambient fields on one page is one too many under D17.** A8 writes no backdrop CSS: the default two blooms (34s / 52s, ambient, already in `obsidian.css`) are the console's atmosphere and `variant` selects nothing here. Standing rule 14 is satisfied by a real field, not by a removed one. Remove the `Orb` import and element from `run-console.tsx`; the component stays at `components/ui/orb.tsx` and keeps its one surviving call site on A14's invalid-run page.

**The cross-fade (D8, R4).** `.report-cross-fade` exists in no stylesheet; console → report is a hard swap today. `ValidateView` becomes a three-state machine, `mode: 'console' | 'crossing' | 'report'`:
- On `complete` the console holds **600ms** with all four phases `done` and the clock frozen — `.ob-phase-note` reads `0:45 · COMPLETE` (mono, no verb) — then `mode` goes `'crossing'`.
- `.ob-xfade` is `display: grid; min-height: calc(100vh - var(--ob-console-chrome))` with `> * { grid-area: 1 / 1 }`, so **both trees occupy the same cell and the page height never collapses mid-fade**. `.ob-xfade-out` transitions `opacity 400ms var(--ob-ease)` to 0; `.ob-xfade-in` transitions `opacity 400ms var(--ob-ease) 120ms` to 1 — the 120ms offset prevents a double-bright frame. Nothing translates; translating a full report is nausea.
- At +520ms `mode` becomes `'report'` and the console unmounts.
- **No scroll jump:** the console page does not scroll (the stream owns its own scrollport and the footer's height is subtracted, not added), so `window.scrollY` is 0. Assert it before flipping to `'crossing'` and, if non-zero, `window.scrollTo({ top: 0, behavior: 'auto' })` *before* the fade starts, never during. **No route change** — same URL, state only.
- **The report's `#what-we-found` (A9's §02) reveals 200ms after the fade so the eye lands on it first.** The report is a server-rendered slot A8 cannot reach inside, so target it from the wrapper by id: `.ob-xfade-report[data-arrived='false'] #what-we-found { opacity: 0 }` and `[data-arrived='true'] #what-we-found { opacity: 1; transition: opacity var(--ob-base) var(--ob-ease) 200ms }`. `data-arrived` flips to `'true'` 400ms after `'crossing'` begins. **A cold visitor renders with `data-arrived` absent entirely — the attribute selector never matches, so there is no flash of hidden content and no fade on the common path.**

**Mode selection.** `isRunStreamActive(slug)` compares `Date.now() - readRunStartedAt(slug)` against A1's exported `RUN_STREAM_WINDOW_MS` (`runEventsTotalMs + 4_000`, ≈49.1s). It is read once, at mount, so a 900ms redirect from Define costs nothing. A8 restates neither number.
- **Cold visitor on a shared link** (`readRunStartedAt → null`): Mode B directly. **No replay, no console, no clock, no cross-fade wrapper, no `data-arrived`.** A9's report title band already carries the pinned final state; A visitor who never waited is never shown a wait.
- **Mid-run reload — fix it, don't keep it.** This is the second decision A1 deferred. Today the replay restarts at t=0 while the elapsed clock keeps true wall time, so at a 20s reload the clock reads `0:20` while finding #1 is landing. The two visibly desync, and the clock is precisely the element the console asks the user to trust. The fix, entirely inside `use-run-stream.ts`: derive the absolute timeline once at module scope from the fixture itself — `const TIMELINE = runEventsFixture.reduce<number[]>((acc, e, i) => (acc.push((acc[i-1] ?? 0) + e.delayMs), acc), [])` — so **no edit to A1's fixture file is needed and no second source of truth is created**. On mount compute `resumeAtMs = Date.now() - startedAtMs`, `foldRunEvents` every event whose `TIMELINE[i] <= resumeAtMs` into the initial state synchronously (no animation — the fold forces `newestFindingId: null`), set `indexRef.current` to the first un-fired index, and schedule it after `TIMELINE[i] - resumeAtMs` ms. From there the existing self-rescheduling chain is unchanged. **A reload at 20s now shows ~22 findings already present, the clock at 0:20, and the next finding landing on time.**
- **Landing inside the 4s window slack.** When `resumeAtMs >= runEventsTotalMs` the fold completes everything, and `ValidateView` mounts straight into `'crossing'` — a 400ms fade rather than a hard cut. That is the slack's whole purpose; do not drop such a visitor to Mode B.
- Log the resume in the build log as a deliberate reversal of the simplification recorded in `use-run-stream.ts`'s doc comment, and delete that comment.
- **Hydration.** `ValidateView` renders Mode B on the server and on the first client render, and promotes to console mode inside a **`useLayoutEffect`** (never a `useEffect` — that runs after paint and the report would flash for a frame; never during render — `matchMedia` and `localStorage` would break SSR, which is R8's disease). The layout effect reads `isRunStreamActive(slug)` **and** `matchMedia('(prefers-reduced-motion: reduce)').matches` together, and promotes only when active and not reduced.
- **`dimensionLabels` is deleted from `ValidateView` and `RunConsole`.** Per C3 the coverage rail imports `DIMENSION_SHORT` from `lib/schemas/evidence.ts` directly. The prop was sourced from `report.dimensions[d].label`, which A1 removes from the schema anyway.

**States, with exact copy.**
| State | When | What renders |
|---|---|---|
| **Connecting** | before the first `phase` event | `PhaseStrip` replaced by `<p class="ob-meta">CONNECTING…</p>`; all 19 rows `○`; three `.ob-fstream-skel` blocks (148px, 1px `--ob-hairline`, `--ob-r-card`, `opacity: .4`, **no animation and not `.ob-skeleton`** — a breathing skeleton is neither ambient nor structural) |
| **Running, no findings** | 0 → 3.9s | `Nothing verified yet. Findings appear here as they pass the check.` at `.ob-body` `--ob-muted`, in `.ob-fstream-empty`, which reserves the stream's full height. **The re-timing cuts this from 17s to under 4s; it still needs its sentence, because the sentence is what makes four seconds legible.** |
| **Running with findings** | 3.9s → ~43.8s | The default. |
| **Stalled** | no event for 8,000ms | `.ob-phase-note` reads `Still working — some pages are slow to fetch.` (sans, `--ob-sm`, `--ob-dim` — it has a verb, so it is not mono). At 40,000ms since the last event: `This is taking longer than usual.` plus an `.ob-btn .ob-btn-ghost` `Refresh`. **The fixture never trips this** (max inter-event gap 940ms); `?stall=1` suppresses the chain after finding #8 (≈9.2s) so both rungs can be verified. This state is **built**, not absent — A14's state matrix records it as `built + QA param ?stall=1 (A8)`. |
| **Complete** | ≈45.1s | All four phases `done`, clock frozen, `.ob-phase-note` = `0:45 · COMPLETE`, held 600ms, then the cross-fade. |

**Screen readers.** A single `aria-live="polite"` region, but 84 per-item announcements in 45s is a firehose. **Write a running summary, debounced to at most one write per 3,000ms:** `{n} of 19 queries searched. {m} findings verified.` The full text of the newest finding and the newest query stay reachable in the DOM and in `title`; nothing is hidden, only un-shouted.

**Reduced motion.** Two halves, both required.
- **CSS end states go into `styles/obsidian-app.css` §16**, the single app-side reduce home (C1). §9 opens no `@media` block of its own, and nothing here is appended to `styles/obsidian.css` §16. Selectors A8 contributes: `.ob-fstream-item { opacity: 1; transform: none }`, `.ob-ticker-track { transform: none }`, `.ob-qglyph[data-state='running'] { animation: none }`, `.ob-discard-last { opacity: 1 }`, `.ob-xfade-out { opacity: 0 }` / `.ob-xfade-in { opacity: 1 }`. `.ob-cov-fill` keeps its inline `scaleX` — it resolves to the end state because the value is data, not an animation.
- **JS, and this is the half CSS cannot fix: a 45-second replay is auto-advancing content, which is motion.** Under `prefers-reduced-motion`, `ValidateView` never promotes to console mode — the visitor gets **the report, directly, in its final state**, with no fade and no `data-arrived`, and `useRunStream` is never mounted, so no timer chain is scheduled. The hook still carries the branch A15 §3.2 names (`finalState()` immediately, `elapsedMs = runEventsTotalMs`, no `setTimeout`) for any other caller, and its own reduced-motion read happens in an effect, never during render. Justification, and log it: the console exists to make a wait legible; under reduced motion there is no wait to make legible, and a fully-resolved console that dissolves 400ms later is a flash, not a surface. Everything it carried — 19 queries, per-dimension counts, 18 discards with reasons — is present in A9's report and A13's explorer. **This is the one case where "resolve to the end state" means "render the end state's page."** A15's reduced-motion finding count on `/validate` therefore reads the report's cards, not the stream's; note it there.

**§9's complete class list, so A15's reduce-completeness diff has a target.** `.ob-console` `.ob-console-head` `.ob-console-grid` `.ob-console-rail` `.ob-console-foot` · `.ob-phase` `.ob-phase-list` `.ob-phase-item` `.ob-phase-clock` `.ob-phase-note` · `.ob-ticker` `.ob-ticker-view` `.ob-ticker-track` `.ob-qrow` `.ob-qrow-text` `.ob-qglyph` · `.ob-cov` `.ob-cov-row` `.ob-cov-track` `.ob-cov-fill` `.ob-cov-count` `.ob-cov-thin` · `.ob-discard-block` `.ob-discard-count` `.ob-discard-last` `.ob-discard-last-meta` `.ob-discard-last-reason` `.ob-discard-done` · `.ob-fstream` `.ob-fstream-item` `.ob-fstream-skel` `.ob-fstream-empty` `.ob-fstream-jump` `.ob-fstream-more` · `.ob-xfade` `.ob-xfade-out` `.ob-xfade-in` `.ob-xfade-report`, plus `@keyframes ob-app-qspin`. Everything else the console renders is borrowed and never redefined here: `.ob-container-app` `.ob-rule` `.ob-dot` `.ob-btn*` `.ob-meta` `.ob-body` `.ob-lead` `.ob-h1` `.ob-em` (A0/A2), `.ob-backdrop` `.ob-verify-rule` (`obsidian.css`), `.ob-finding*` `.ob-chip-verified` `.ob-cite` (A5, per [C12](#c12--shared-class-names)).

**Hygiene.** Every Deep Canopy class name leaves the console tree — `.query-ticker-row`, `.query-text`, `.query-glyph*`, `.finding-card--entering`, `.phase-strip*`, `.coverage-*`, `.orb*`, `.report-cross-fade`, `.empty-note`, `.meta-line`, `.section-label`, `.divider`. Deleting the recipes themselves is A15's sweep; A8 stops emitting them. After writing §9, run the used-vs-defined diff (`grep -oE 'var\(--[a-z0-9-]+' styles/obsidian-app.css | sort -u` against `styles/tokens.css`) and the `animation:`-name-vs-`@keyframes` check, and grep `ob-app-qspin` across `styles/*.css` to confirm it collides with nothing — **R4 is exactly this class of bug and this phase must not create a fifth instance of it.**

- **The badge lands as the rule finishes, not 180ms after the card.** [C13](#c13--ownership-of-things-two-phases-both-wanted) carries the full sequence: entrance 320ms → rule draws 900ms → badge fades in over 180ms at ~1220ms. **The verdict follows the proof.** An earlier draft had the chip arriving at ~360ms while the rule was still drawing, which inverts the meaning of the only device the product's whole trust claim rests on. ~1.4s per card, independent per card; overlapping arrivals are expected at a 0.5–1s cadence.

**Exit test:** With the Playwright MCP against `next dev` at 1440×900, seed the window (`localStorage.setItem('sv.runStarted.sms-rebooking-4f2a', String(Date.now()))`) and navigate to `/r/sms-rebooking-4f2a/validate`, recording `performance.now()`. **(1) First finding fast:** poll every 100ms for `document.querySelectorAll('.ob-fstream-item').length >= 1`; assert elapsed `< 6000` and record the actual figure, which should read ≈3.9s against A1's schedule — this is the phase's headline number. **(2) Prove the state machine runs** (verification.md §3c), sampling 6 × 700ms and reading: `getComputedStyle('.ob-ticker-track').transform` (must advance `matrix(1,0,0,1,0,0)` → `matrix(1,0,0,1,0,-34)` → further, i.e. the ticker actually ticks); the index set of `.ob-qglyph[data-state="running"]` (non-empty at some sample, and **different between samples** — proof that queries 6–19 are visible, not hidden behind `… 14 more`); each `.ob-cov-fill` transform going `matrix(0,…)` → non-zero; `.ob-fstream-item:first-child`'s `data-entered` observed `false` at least once and `true` after; `.ob-verify-rule` transform observed `matrix(0,…)` then `matrix(1,…)`. A screenshot proves none of this. **(3) Zero layout shift as cards prepend:** sample `.ob-console-head`, `.ob-console-grid`, `.ob-console-rail`, `.ob-discard-last` and `.ob-fstream` `getBoundingClientRect().height` ten times across the run — all five identical every sample, including as the clock rolls `0:09 → 0:10`, as the `thin` tag appears on `PRACTICAL`, and across at least three different discard reasons in the slot. **(4) Scroll pinning:** set `.ob-fstream` `scrollTop = 400`, note the `offsetTop` of the card then at the viewport top, wait 3s (≥3 arrivals), assert it moved by ≤2px; assert `.ob-fstream-jump` exists with text matching `/^↑ \d+ new$/` and that clicking it returns `scrollTop` to 0; assert `window.scrollY === 0` throughout. **(5) Discards read as sentences:** assert `document.body.innerText` contains none of the four raw enum keys, that `.ob-discard-last-reason`'s `color` resolves to `rgb(138, 138, 147)` (`--ob-muted`, not `--ob-discard`), and that its text is one of the four `DISCARD_REASON_LABEL` strings verbatim. **(6) The cross-fade:** at ~45.2s, sample every 80ms and confirm `.ob-xfade-out` and `.ob-xfade-in` are in the DOM simultaneously with both opacities strictly between 0 and 1 at some sample; `window.scrollY === 0` before and after; `location.pathname` unchanged; `#what-we-found` opacity `0` at fade start and `1` by +700ms. **(7) Cascade** (pitfalls §1): `.ob-qrow-text` `fontSize === '12px'`, `.ob-cov-fill` `backgroundColor === 'rgb(244, 244, 245)'`, `.ob-console-grid` `gap === '64px'`, and one element carrying both a recipe class and a Tailwind margin utility where the utility wins. **(8) Blue and atmosphere:** collect every element under `.ob-console` whose computed `color`, `backgroundColor` or `borderTopColor` is `rgb(45, 127, 249)` and assert each carries one of `ob-dot`, `ob-qglyph`, `ob-chip-verified`, `ob-verify-rule`; assert `document.querySelectorAll('.ob-dot').length === 1`; assert exactly one `.ob-backdrop` exists on the page and zero `.orb`. **(9) Reduced motion:** `emulateMedia({ reducedMotion: 'reduce' })`, reseed `sv.runStarted`, reload — `.ob-console` must **not** exist, `#what-we-found` opacity must be `1`, and no `setTimeout`-driven mutation may occur (re-read `.ob-fstream-item` count after 3s; unchanged, because the element is absent). Restore `no-preference`. **(10) Resume:** reseed `sv.runStarted` to `Date.now() - 20000`, reload, and within 500ms assert `.ob-fstream-item` count is `>= 18`, `.ob-phase-clock` reads `0:20`, every visible item is `data-entered="true"` (nothing animated in), and a further card arrives within 1,200ms. **(11) Stalled:** navigate with `?stall=1`, wait 9s past the last arrival, assert `.ob-phase-note` reads `Still working — some pages are slow to fetch.` and that `PhaseStrip`'s `state` is reflected as `stalled`. Repeat 1–3, 7 and 8 at 1280. Then per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and `browser_console_messages level:"error"` returning zero at **both** 1440 and 1280.

---

## A9 — Validate: the Report, structure

**Goal:** `/r/[slug]/validate` in Mode B renders a complete, readable, correctly-outlined Obsidian report — full-bleed title band, sticky section index, editorial two-column body, six numbered sections, eighteen real headings — with every figure slot occupied by an honest reservation at its exact final height, so A10 draws marks into it with zero layout shift. Implements **D5** and **D7**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/pitfalls.md` (§1 first, §11 for the anchor inset), `references/verification.md` §3, `WebsiteLayoutDesc/07-page-validate.md` (Mode B only), `lib/fixtures/report.ts`, `lib/fixtures/evidence.ts`, and — before writing a line — [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), [C8](#c8--runfunnel), [C10](#c10--the-analytics-api-frozen-in-a1), [C11](#c11--figure-numbers-settled), [C12](#c12--shared-class-names), [C13](#c13--ownership-of-things-two-phases-both-wanted), [C14](#c14--every-exit-test-ends-the-same-way).

**Build:**
- `components/validate/report/report.tsx` — rewritten. Owns section order, the thin partition, the section-index item list, and nothing else.
- `components/validate/report/report-row.tsx` — **new. `ReportRow`.** The two-column band. *Add to the naming contract.*
- `components/validate/report/evidence-state.tsx` — **new. `EvidenceState`.** D7.
- `components/validate/report/evidence-rail.tsx` — **new. `EvidenceRail`.** The uncited-findings surface. *Add to the naming contract.*
- `components/validate/report/summary-section.tsx` · `dimension-section.tsx` · `competitor-card.tsx` · `surprise-panel.tsx` · `unanswered-section.tsx` · `thin-evidence-notice.tsx` — all rewritten.
- `components/layout/section-index.tsx` — rewritten as a sticky **horizontal** strip.
- `app/r/[slug]/validate/page.tsx` — renders `<AppBackdrop variant="validate" />` as its first child per [C13] (*add `AppBackdrop` to the naming contract if no earlier phase has*), then passes derived props — dimension weights, per-dimension uncited id sets, the `EvidenceState` model — down from A1's pure functions.
- `lib/content/app.ts` — the `REPORT` block: every string below, extending the `VALIDATE_REPORT` and `REPORT_SECTIONS` entries A0 seeded. A10 adds four more keys to the same block; do not re-cut it.
- `lib/citations.ts` — `assertEverySentenceCited(text: string): void`.
- `lib/hooks/use-scroll-spy.ts` — one-line inset correction, below.
- `lib/fixtures/report.ts` — **verify only.** See the surprises note in §05.
- `styles/obsidian-app.css` **§10 `REPORT — STRUCTURE`** — the recipe block, filled into the banner A0 already created.

**Notes:**

- **Nothing about the stylesheet's shape is decided here.** The file, its import and every token are A0's ([C2](#c2--foundation-ownership)); the section map is [C1](#c1--stylesobsidian-appcss-the-section-map) and A9 fills **§10 and only §10**. Do not restate a section map, do not renumber, do not append a new banner. A9 declares **no `@keyframes`** (see the motion note); if that ever changes, the name is prefixed `ob-app-` per C1.
- **Every colour and every length token A9 reads already exists.** `--ob-anchor-inset`, `--ob-header-h-condensed`, `--ob-container-report`, `--ob-report-prose`, `--ob-report-aside` are declared once, in A0. A9 **asserts** their computed values and declares none of them. This phase adds no line to `styles/tokens.css`.

- **The title band.** `.ob-report-head`, full-bleed, `background: var(--ob-void)`, `border-bottom: 1px solid var(--ob-hairline)`, `padding-block: 88px 64px`, contents inside `.ob-report-body`. Exact rhythm, top to bottom: `<h1 class="ob-display" style="max-width: 14ch">` reading **`What the web already says.`** → 28px → `<p class="ob-lead" style="max-width: 52ch">` the run one-liner, `SMS rebooking for dental clinics` → 44px → `MetaLine` reading **`RESEARCHED 14 AUG 2026 · 47 VERIFIED · 31 SOURCES · 18 DISCARDED`**. This is the page's **one** `--ob-display` moment (the report is the artefact people share). Mode A's h1 stays at `--ob-h1`, per the contract. A8 relies on this line existing: a cold visitor who never saw the console gets the run's whole ledger here and is never shown a wait.
- **`MetaLine` joins with `' · '`, not `' // '`.** The separator is A0's `META_SEPARATOR` constant in `lib/content/app.ts`; the `//` form is Deep Canopy. **R21 — dropping `.meta-line`'s `nowrap` + ellipsis — is A2's**, and A9 is its loudest consumer: the report's meta lines wrap, on the title band, on every `CompetitorCard` price and on every `.ob-dim-meta` date range. If A2 shipped and the ellipsis is still computed, fix it in `components/ui/meta-line.tsx` on the spot and log it rather than working around it here.

- **D5 — the editorial body.** One wrapper, one row primitive:
  ```css
  .ob-report-body { width:100%; max-width: calc(var(--ob-container-report) + var(--ob-gutter)*2);
                    margin-inline:auto; padding-inline: var(--ob-gutter); }
  .ob-report-row  { display:grid; grid-template-columns: var(--ob-report-prose) var(--ob-report-aside);
                    gap:100px; align-items:start; }
  .ob-report-row[data-aside='none'] { grid-template-columns: var(--ob-report-prose); }
  .ob-report-prose > * + * { margin-top:24px; }
  .ob-report-aside > * + * { margin-top:40px; }
  ```
  580 + 100 + 400 = 1080 = `--ob-container-report`, so the wrapper's max-width is `1080 + 2×40 = 1160px`. **This deviates from `.ob-container`'s formula deliberately** (there, max-width includes the gutter); note it in the recipe comment or someone will "fix" it. It is also why the report body is *not* the 1120px content box the roadmap axis uses in [C5](#c5--the-roadmap-week-model-librun-plants) — two different containers, two different jobs, and neither is a bug in the other.
- **`ReportRow` props:** `{ aside?: ReactNode; children: ReactNode }`. It emits `data-aside="none"` when `aside` is nullish.
- **The adjacency rule, stated once: a figure sits beside the paragraph that cites it, and the aside stack is ordered to match the order those citations appear in that paragraph.** The unit of adjacency is the prose block: one `ReportRow` per prose block, one aside stack per row, `align-items: start` so the first figure's cap-height lines up with the paragraph's first line.
- **When a section has no figure the row collapses to one column and the prose column does not widen.** 580px is the measure for the whole document; a column that breathes in and out makes the page ragged and destroys the straight left–right edge that the hairlines depend on. `data-aside="none"` removes the second track entirely, so there is no element in the empty half — **Standing rule 14 is about a rendered blank div, and this renders nothing.**
- **`ReportRow` is used by sections 02 and 03 only** (the summary plus five dimensions — the reading portion, ~60% of the page). **Sections 01, 04, 05 and 06 are full-measure blocks** (`.ob-report-full`, 1080px) because their content *is* the data layer: the evidence strip, the capability matrix and three competitor rows, three oversized surprise statements, and the forward-pointing list. Alternating a 580px reading column against four full-measure breaks is the page's rhythm, not an exception to D5.

- **The section spine.** Six top-level sections, each `<section class="ob-report-section" id=…>` and `border-top: 1px solid var(--ob-hairline); padding-block: 96px` (the first has no top border; 96px is `--ob-section-gap-app`, A0's token, not a fresh number). Each opens with `SectionLabel` — restyled in A2 to the Obsidian `.ob-eyebrow`: mono numeral in `.ob-em` **chalk, never blue**, label, then `::after { content:''; flex:1; height:1px; background: var(--ob-hairline) }` running off the right across the full 1080px. Then an `<h2 class="ob-h2 mt-8" style="max-width:20ch">`.

  | id | Eyebrow | `<h2>` |
  |---|---|---|
  | `#evidence-state` | `01 STATE OF THE EVIDENCE` | `What this evidence can and can't carry.` |
  | `#what-we-found` | `02 WHAT WE FOUND` | `The short version.` |
  | `#dimensions` | `03 THE FIVE DIMENSIONS` | `The five things we looked for.` |
  | `#competitors` | `04 WHO ELSE IS DOING THIS` | `Who is already in this space.` |
  | `#surprises` | `05 WHAT SURPRISED US` | `Three things we didn't expect.` |
  | `#unanswered` | `06 WHAT WE COULDN'T ANSWER` | `What the web couldn't tell us.` |

  §05's headline is count-derived from `surprises.length` via a 2/3 numeral-word map (`Two` / `Three`). `#what-we-found` is also A8's cross-fade target — it renders at `opacity: 0` only when the wrapper carries `data-arrived="false"`, an attribute a cold visit never emits, so A9 must not give the section its own opacity.

- **Fix critique (f) — the report currently emits exactly one heading.** The outline is the one [C17](#c17--heading-outlines-per-route) fixes for the whole build: **h1 ×1 · h2 ×6 · h3 ×8 · h4 ×3.** The eight h3 are five `DimensionSection` heads (at `--ob-h3`, 23px) and three `SurprisePanel` headlines (rendered at `--ob-h1`; **size is not level**). Competitor names are the three `<h4>` inside §04. `SectionIndex` links only at real `<h2>`-bearing sections; the five `#dimension-*` ids are linked from `DimensionStrip` cells (A10), which is why they stop being orphans. A15 asserts this exact outline — if A15's draft still expects three competitor h3, C13 is what settles it.
- **Fix R14 — one vocabulary for the five dimensions.** The report imports **`DIMENSION_LABEL` from `lib/schemas/evidence.ts`** ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)) and never reads `data.label`, which A1 deletes from the schema. **There is no `lib/dimensions.ts` and A9 does not create one.** The five h3 therefore read `The problem` · `What exists` · `Demand signals` · `Money` · `Practical realities`. `DIMENSION_SHORT` is the compact form and belongs to strips and rails, not to a heading — A10's `DimensionStrip` uses it, this section does not.
- **Fix critique (g) — `[Section label]` and `[12]` stop being the same token.** Section labels are chalk mono with no brackets. **`CitationChip` is the only blue thing in running prose, and its blue is job 2, verification.** Say this out loud in the §10 recipe comment. The bracket monopoly is scoped to running prose per [C12](#c12--shared-class-names): inside `.ob-report-prose` the only element permitted to render `[` or `]` is `.ob-cite`. `[nn]` on an `EvidenceRail` row is outside prose and is legal.

- **D7 — `EvidenceState`, §01.** The three lists come from `deriveEvidenceState(report, evidence)`. **Its thresholds are stated once, in [C10](#c10--the-analytics-api-frozen-in-a1), and are not restated here** — A9 renders whatever the function returns and never re-implements the rule. On this fixture it resolves to: **strong** → *the problem, what exists, money*; **thin** → *practical realities*; **contested** → *the problem, money*; `DEMAND_SIGNALS` lands in none of the three and that is correct. A dimension may appear in two lists; that is the honest result and must not be suppressed.
  Rendered as a three-up, separated by two `.ob-rule-v` verticals (their first use in the system — defined on the landing page, never called):
  ```
  STRONG ON            │ THIN ON              │ ACTIVELY CONTESTED
  The problem ·        │ Practical realities  │ The problem · Money
  What exists · Money  │                      │
  ```
  `.ob-estate-key` = `.ob-meta`; `.ob-estate-value` = 23px / `--ob-leading-tight` / `--ob-text`, items joined ` · ` on `META_SEPARATOR`. An empty list renders `nothing yet` in `--ob-dim` — never a blank cell. **No bold anywhere: weight is 400, and the mono key layer is the only 500 in the system.**
  Directly beneath, full measure, `.ob-estate-note` at `--ob-body` `--ob-muted`: **"This describes the evidence, not the idea. A thin dimension means the web was quiet, not that the answer is no."** That sentence is the whole point of D7 — it is the only thing standing between this band and a verdict. Do not shorten it, do not move it above the three-up, do not let a later pass turn it into a tooltip.
  Then 48px, then the `DimensionStrip` (A10 fills it) in a container reserving **exactly 140px**, then 40px, then the overall `StanceBar` figure at 56px. Section footer `.ob-meta`: `31 SOURCES · 29 DOMAINS · 18 EXCERPTS DISCARDED`. **§01 carries no funnel** — see §02.

- **`SummarySection`, §02.** Prose at `--ob-lead` (21px), `--ob-muted`, in the prose column; **`RunFunnel` in the aside, `variant="compact"`, 140px of mark, per [C8](#c8--runfunnel)** — that is settled and A9 reserves the slot on the strength of it. `/sources` §01 owns the expanded version with the discard-reason breakout; the report's compact one is not deleted by A13. The forward link lives on the `Figure`'s own `source` prop — `{ label: 'THE FULL RUN →', href: '/r/{slug}/sources#the-run' }` — so the report points at the audit surface **without** a second mono line beneath it. If a later session finds both a funnel and a loose `SEE THE RUN →` line here, the line is the duplicate.
  **Every sentence in §02 carries at least one citation and uncited prose here is a bug** — `CitedTextSchema.refine()` already guarantees the bidirectional `[n]` ↔ `citations` agreement, but not *per sentence*. A9 adds `assertEverySentenceCited(text)` in `lib/citations.ts`: splits on `/(?<=[.!?])\s+/`, throws when any sentence has no `[n]`, runs only when `process.env.NODE_ENV !== 'production'`. Call it on `summary.text` **and on all five `dimensions[*].prose.text`**. The current fixture passes all six.

- **The five `DimensionSection`s, §03.** Each is `<article class="ob-dim" data-weight=…>` with `id="dimension-{KEY}"`. Head row: `.ob-dim-index` mono `01 / 05` left, `<h3 class="ob-h3">` label from `DIMENSION_LABEL`, `ConfidenceNote` right. Beneath: `.ob-dim-meta` — `14 FINDINGS · 12 SOURCES · JAN–DEC 2025`, wrapping, no ellipsis.
  **Density follows the evidence, not the blueprint's prescribed low→high→medium→low→low rhythm** — that rhythm predates the fixture and doesn't match it. A1 derives `weight`: `solid && count>=10` → `full`; else `count>=4` → `standard`; else `compact`. For this fixture: **PROBLEM full · WHAT_EXISTS full · DEMAND_SIGNALS standard · MONEY full · PRACTICAL compact.**
  What actually differs — this is the answer to critique (c), and three bars plus a lowercase word is not it:
  - **`full`** — 96px of section space; aside carries up to four figures; `EvidenceRail` beneath the paragraph showing every uncited finding in the dimension; an `Accordion` titled `Show all {n} findings`.
  - **`standard`** — 72px; aside carries up to two figures; `EvidenceRail` capped at 3 rows with a `+{n} more →` link; accordion present.
  - **`compact`** — 72px; **no accordion at all.** With two findings there is nothing to hide, so both render inline in the prose column as **`FindingCard variant="row"`** — a variant that **survives**, per [C13](#c13--ownership-of-things-two-phases-both-wanted): A13 builds `EvidenceRow` alongside it and deletes nothing. The head gains a `.ob-chip` reading `THIN`; the paragraph is one sentence. **A thin dimension shows everything it has; a solid one hides its long tail behind a disclosure. That inversion is the differentiation.**
- **Fix critique (d) — 23 of 47 findings are cited nowhere.** `EvidenceRail`, in the **prose column**, directly beneath the paragraph and above the accordion. Its classes are `.ob-erail`, `.ob-erail-head`, `.ob-erail-row`, `.ob-erail-foot` — **deliberately not `.ob-rail*`, which A13 takes for the explorer's facet rail in §14.** Header `.ob-meta`: `NOT QUOTED ABOVE · 7`. Rows at 56px each, separated by `.ob-rule`: `[nn]` mono numeral (the real citation number, from `citationNumberForFindingId`), the finding's `text` clamped to two lines at 15px, then `domain · date` in `.ob-meta`. Row click → `open(n)` on `EvidenceProvider` — a `<button>`, not `role="button"` on a div (R12). Footer link `All 14 in the problem →` to `/r/{slug}/sources?dim=PROBLEM` — **`dim`, the param name A13 parses**, not `dimension`. Per-dimension uncited counts for this fixture, derived from `citationCoverage(report, evidence)` and never typed in: **PROBLEM 7 · WHAT_EXISTS 6 · DEMAND_SIGNALS 3 · MONEY 7 · PRACTICAL 0.** PRACTICAL renders no rail (it has none) and that is not a hole — its two findings are already inline.
  Plus, at the foot of §03, full measure: `.ob-body` reading **"23 of 47 findings aren't quoted anywhere above. All of them are in the explorer."** — derived, never hardcoded — with an `.ob-btn ob-btn-ghost` `See everything we checked →` to `/r/{slug}/sources`.

- **`CompetitorCard`, §04, full measure.** **Fixes (h) and (i) at once: no 2-column grid, so no orphan; no `.meta-line` clipping, so no ellipsised prices.** Each competitor is one row separated by `.ob-rule`, `padding-block: 48px`:
  - head: `grid-template-columns: 260px minmax(0,1fr) 260px; gap:48px` — `<h4 class="ob-h3">{name}</h4>` + `.ob-meta` geography on the left; `difference_from_idea` at `--ob-body` in the middle; `price` on the right as a **field**, `--ob-text`, 15px, wrapping freely.
  - below: a labelled grid `grid-template-columns: 132px minmax(0,1fr); gap: 20px 24px`, mono keys `MOAT` · `TAKE FROM THEM` · `IGNORE`. **No accordion** — hiding four fields behind a per-card click is exactly the barrier critique (m) names. **Field-rendered, never prose. A missing optional renders `not established from available evidence` in `--ob-dim` — never omitted, never guessed.** FrontDeskPro's `moat` and `ignore` are absent on purpose; both must be visible on screen.
  - `competitors.length === 0` → **the entire section is omitted**, index entry included. An empty grid or "no competitors found" reads as encouragement, i.e. a verdict.
  - **Coordination with A10:** A10 adds `CapabilityMatrix` as a full-measure `Figure` **above** the three rows. It does **not** replace them. The matrix answers "who does what"; the cards answer "who they are, what they charge, what to take and what to ignore." A9 reserves the matrix's slot at **260px** of mark height plus `Figure` chrome. The matrix's fourth column is a `THIS IDEA` column in a different register, not a fourth competitor row — [C7](#c7--capabilitymatrix) — so §04's h4 count stays three.

- **`SurprisePanel`, §05, full measure. Fixes critique (j).** Today the largest type on the page is three list ordinals at up to 68px. Now: **the ordinal drops to `.ob-meta`** (12px mono, `--ob-dim`) and **the surprise itself takes the type** — three rows, `grid-template-columns: 56px minmax(0,1fr); gap: 40px`, separated by `.ob-rule` at 56px padding-block, each with `<h3 class="ob-h1" style="max-width:22ch">` headline and a `--ob-body` detail at `max-width: 62ch`. **No card, no featured ring** — Obsidian has no shadows and no featured card; the weight comes from `--ob-h1` type down a hairline-ruled page. This is the screenshot moment.
  **The shape and the citations are settled in [C11](#c11--figure-numbers-settled)** — `{ headline, detail: CitedTextSchema }`, cited `[42][44]` · `[25][29]` · `[35][36]`, and **never `[25][31]`**. A9 adds no schema and edits no schema file; A1 ships `SurpriseSchema` and the fixture. A9 is, however, the only phase that writes the copy down, so the three records read exactly:
  1. `The owner signs off, not the office manager.` — *"Several threads mention the practice owner has to approve anything recurring, even at solo-owner shops where an office manager runs daily operations [44]. Above roughly $300 a month it stops being the office manager's decision at all [42]."*
  2. `Someone already tried this wedge and shut down.` — *"A rebooking-specific startup listed in a 2022 directory no longer has an active website [25], and at least one practice remembers being pitched something similar that never shipped [29]."*
  3. `The objection is the contract, not the price.` — *"Pricing resistance was almost entirely about contract length and per-message billing rather than the flat monthly fee [35][36]. A 12-month minimum almost stopped one practice signing with a competitor [36]."*

  If A1's fixture text differs, amend **A1's fixture** to this and log it — do not re-cut the schema and do not fork the strings into `lib/content/app.ts`; they are data, not copy. Type ladder after this phase, end to end: h1 `--ob-display` (104 at 1440) → surprise headline `--ob-h1` (66) → section `--ob-h2` (43) → dimension `--ob-h3` (23) → `--ob-lead` (21) → `--ob-body` (16) → `--ob-meta` (12).

- **`UnansweredSection`, §06, full measure.** Lead at `--ob-lead`: `Three things no amount of reading settles.` (count-derived). Then numbered rows, `grid-template-columns: 56px minmax(0,1fr)`, mono ordinal, `question` at `--ob-body` `max-width: 68ch` with `why_unanswered` beneath at `--ob-sm` `--ob-muted`, `.ob-rule` between, 28px padding-block. Then `--ob-body`: `Each one has a script and a way to find the people to run it on.` Then **the page's one `.ob-btn ob-btn-primary`**: `What to do next →` to `/r/{slug}/roadmap`. The report ends pointing forward; that is its job.
- **Fix critique (n) — two primaries in thin mode.** `ThinEvidenceNotice`'s CTA becomes `.ob-btn ob-btn-ghost`. **`UnansweredSection` owns the only primary on this page in both variants.**

- **`SectionIndex`, rebuilt.** Today it has one entry ("Dimensions") covering ~60% of the page. Now a **sticky horizontal strip**, `.ob-secindex`: `position: sticky; top: var(--ob-header-h-condensed); height: 48px; background: var(--ob-scrim); backdrop-filter: blur(14px); border-bottom: 1px solid var(--ob-hairline); z-index: 40`, contents in `.ob-report-body`, `display:flex; gap:32px; align-items:center`. Six `.ob-secindex-link`s in `.ob-meta`: `01 EVIDENCE` · `02 SUMMARY` · `03 DIMENSIONS` · `04 COMPETITORS` · `05 SURPRISES` · `06 UNANSWERED` (≈760px at 12px mono +0.1em, comfortable inside 1080). Active: `color: var(--ob-text)` plus a 2px `--ob-accent` bottom rule — **blue job 3, live/active state.** Hover `--ob-muted → --ob-text`; `:focus-visible` gets `transition: none`.
  Props become `{ items: {id,label}[]; inset?: number }` — the old `meta` slot is gone; its content now lives in the title band's `MetaLine` and §01's footer.
- **Anchor inset — assert, never declare.** `--ob-anchor-inset` is 136px and the single rule applying it is A0's `main [id] { scroll-margin-top: var(--ob-anchor-inset) }` in §1 ([C2](#c2--foundation-ownership)). Every `.ob-report-section` and every `.ob-dim` is inside `main` and carries an `id`, so all eleven anchors are already covered; **A9 writes no `scroll-margin-top` anywhere.** 136 is exactly this page's stack — condensed header 56 + index strip 48 + 32 of air — which is why C2 chose it, and A9's job is to prove it computes rather than to re-derive it.
- **The scrollspy needs nothing from A9 — assert it and move on.** A4 already derives the spy line from `--ob-anchor-inset` itself, so the line and the anchor landing point cannot disagree, and it carries the 1px slack (`top - inset <= 1`) that makes a section which has *just* been scrolled to unambiguously active rather than one sub-pixel short of its own line. A9 asserts `topInset() === 136` and `scrollMarginTop === 136px` and expects to change nothing. **If you find yourself editing `lib/hooks/use-scroll-spy.ts` in this phase, stop** — either A4 is unfinished, or you are re-solving R16 from a stale reading of it.

- **Thin variant (`?thin=1`).** Order: `ThinEvidenceNotice` (full measure, immediately under the title band, `.ob-btn-ghost`) → §01 `EvidenceState`, which is *most* useful when evidence is thin and whose STRONG ON cell reads `nothing yet` when no dimension is `solid` → §02 → §03 with sub-2-finding dimensions collapsed into one `.ob-meta`-headed `LITTLE EVIDENCE` block, one line each, never five empty sections → §04 (omitted only at zero competitors) → §05 → §06, which keeps its numeral and its final position but takes the weight normally spent on surprises: items render at `--ob-h3` and the section gets 128px of space above it. **Section numerals are identifiers, not positions — they never re-index.** Tone: diagnostic, never apologetic, never encouraging; apologise exactly once.

- **Figure slots in A9 are honest, not blank.** Each aside slot ships the real `Figure` wrapper from A3 — real caption, real `citations` or `source`, real citation footer — with the mark area (`.ob-fig-mark`) at its **exact final height**, filled with the figure's raw numbers as a plain mono list. A10 replaces the list with the drawn mark at the same height. This satisfies Standing rule 14 (never blank) and rule 12 (reserve the exact height) simultaneously, and it means the report is genuinely finished at the end of A9. Reserved mark heights, **passed as `Figure`'s `height` prop at these call sites**:
  `number` 96 · `number` with `emphasis="lead"` 128 · `stance` 56 · `ladder` 260 · `gap` 180 · `funnel` 140 · `matrix` 260 · `recency` 64 · `strip` 140 · the PRACTICAL constraints group 156. `Figure` chrome adds 12px above the mark and 16px + a 16.8px citation row below.
  **A3's per-mark table gives its own `/style-guide` heights and a different number there is not a conflict** — `height` is a prop, the call site sets it, and the report's column is 400px wide where the gallery's is not. What must not differ is A9's number and A10's number for the same slot; that is what exit test (10) and A10's exit test (1) pin together.
- **Motion in A9: none.** The section spine, the rows and the rails do not animate; the only motion on this page is A10's figure layer and A8's cross-fade, both inside D17's budget. A9 therefore declares no `@keyframes`, no `transition` beyond the `:focus-visible` and hover states Standing rule 10 requires, and **no reduced-motion rule** — there is nothing to resolve to an end state. If that ever changes, the rule goes in **§16**, the only home for app-side reduce rules (C1), never in §10.
- **A9 uses no `Fragment`.** A2's promotion note names the console, the report and the roadmap as its three consumers; the report is not one. Its visual layer is figures and hairlines, not code-drawn product surfaces. Log it so A2's justification can be re-checked against the two phases that do use it.

**§10 `REPORT — STRUCTURE`, the class list, exactly:** `.ob-report-head` `.ob-report-body` `.ob-report-row` `.ob-report-prose` `.ob-report-aside` `.ob-report-full` `.ob-report-section` · `.ob-estate` `.ob-estate-key` `.ob-estate-value` `.ob-estate-note` · `.ob-dim` `.ob-dim-index` `.ob-dim-meta` `.ob-dim-head` · `.ob-erail` `.ob-erail-head` `.ob-erail-row` `.ob-erail-foot` · `.ob-comp-row` `.ob-comp-head` `.ob-comp-fields` `.ob-comp-key` `.ob-comp-missing` · `.ob-surprise-row` `.ob-surprise-ord` · `.ob-unans-row` `.ob-unans-ord` `.ob-unans-why` · `.ob-secindex` `.ob-secindex-link`. **No figure class is defined here** — `.ob-fig*`, `.ob-stance*` and `.ob-cite` live in §4 and §6 per [C12](#c12--shared-class-names), and A9 consumes them without redeclaring one.

**Exit test:** Run `next dev`, drive the Playwright MCP at 1440×900 and again at 1280. **Measure, don't look.** (1) Cascade: read `getComputedStyle` on an `.ob-h2` carrying `mt-8` → `marginTop` must be `"32px"`; a `0px` here means §10 wasn't imported with `layer(components)` and every Tailwind utility on the page is dead. (2) Grid: `getComputedStyle(document.querySelector('.ob-report-row')).gridTemplateColumns === "580px 400px"` and `columnGap === "100px"`; at 1280 the same two tracks (the report body is fixed-width, not fluid). (3) Outline: `[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.tagName)` must be exactly **1 × H1, 6 × H2, 8 × H3, 3 × H4**, in document order with no level skipped — the outline [C17](#c17--heading-outlines-per-route) pins and A15 re-asserts. (4) Anchor inset: `getComputedStyle(document.querySelector('.ob-report-section')).scrollMarginTop` and the same on an `.ob-dim` must both read `"136px"`, and `document.querySelectorAll('[style*="scroll-margin"], .ob-report-section[style]').length` must be 0 — A9 declares no competing rule (C2). (5) Anchors land: click each of the six `.ob-secindex-link`s with real clicks; after each, the target's `getBoundingClientRect().top` must equal **136 ± 2** — anything under 104 means the sticky header plus the index strip is eating the heading (pitfalls §11). (6) Scrollspy: scroll to `#dimension-MONEY`; exactly one `.ob-secindex-link[data-active='true']` and its text starts `03`. Then click `04 COMPETITORS` and re-read after 600ms — the active link must be `04`, which is the assertion the 152px spy line exists to pass. (7) The five `#dimension-*` ids each have at least one in-page `<a href>` pointing at them. (8) Citations: click the chip `[26]` in Money's paragraph; the drawer title reads `EV_26`; `Esc` returns focus to that chip. (9) Bracket monopoly, scoped per C12: every leaf element inside `.ob-report-prose` whose text starts with `[` carries `ob-cite`. (10) Exactly one `.ob-btn-primary` is in the viewport at scroll positions 0, 25%, 50%, 75%, 100%. (11) `?thin=1`: `ThinEvidenceNotice` is the first element after the title band, its CTA's `borderRadius > 100` but its `backgroundColor` is transparent, and there is exactly one `.ob-btn-primary` in the document. (12) Record `[...document.querySelectorAll('.ob-fig-mark')].map(n=>n.getBoundingClientRect().height)` at **both** viewports and paste both arrays into the A9 build log — **A10's exit test replays them and must match element for element.** The array must contain the 140px funnel entry; if it doesn't, the §02 aside is blank and the phase fails on Standing rule 14. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and `browser_console_messages level:"error"` returning zero at 1440 **and** 1280.

---

## A10 — Validate: the Report, data layer

**Goal:** every figure slot A9 reserved is drawn with real, derived fixture data, citation-linked, hand-drawn in CSS/SVG, at exactly the height A9 measured. The report's quantities stop being 16px strings inside paragraphs. Implements **D6**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` §5c and §6, `references/media.md` §2, `references/verification.md` §3d, `lib/fixtures/evidence.ts`, `lib/analytics/` (as A1 left it), and — before writing a line — [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), [C7](#c7--capabilitymatrix), [C8](#c8--runfunnel), [C10](#c10--the-analytics-api-frozen-in-a1), [C11](#c11--figure-numbers-settled), [C12](#c12--shared-class-names), [C14](#c14--every-exit-test-ends-the-same-way).

**Build:**
- `components/validate/report/report-figures.tsx` — **the one place that maps a section or dimension to its aside stack.** Server component, no client JS beyond the count-up leaves.
- `components/validate/report/dimension-section.tsx` — accepts the built aside; no other change.
- `components/figures/number-callout.tsx` — widen: `emphasis?: 'lead'` and `size?: 'compact'`.
- `components/figures/figure.tsx` — widen: `stance?: Stance`, for the one contested mark. Everything else about `FigureProps` — `caption`, `citations`, `source: { label, href }`, `height`, `note` — is A3's and is used as shipped. **There is no `sourceNote`/`sourceHref` pair; it is `source`.**
- `components/figures/value-ladder.tsx` · `gap-bar.tsx` · `run-funnel.tsx` · `capability-matrix.tsx` · `dimension-strip.tsx` · `recency-strip.tsx` · `stance-bar.tsx` — wired, and amended only where a note below names the amendment.
- `components/figures/count-up.tsx` — **new leaf. `CountUp`.** The only `'use client'` file A10 adds. *Add to the naming contract.*
- `lib/content/app.ts` — four authored figure notes appended to A9's `REPORT` block: `counterSignalNote`, `ladderNote`, `practicalNote`, `capabilityNote`.
- `styles/obsidian-app.css` **§11 `REPORT — FIGURES`** — placement, adjacency, the lead-emphasis modifier, the contested treatment, the idea column, the ladder band and threshold, the count-up leaf.
- `styles/obsidian-app.css` **§16** — two reduced-motion declarations, below.
- `tests/unit/report-figures.test.ts` — **extended** (A1 created it).

**Notes:**

- **A10 adds no module, no token, no schema and no fixture.** The analytics API is frozen in [C10](#c10--the-analytics-api-frozen-in-a1): A10 imports `priceLadder`, `roiGap`, `capabilityMatrix`, `runFunnel`, `numberCallouts`, `stanceOverall`, `stanceByDimension`, `recencyTicks`, `citationCoverage`, `citedFindingIds` and `deriveEvidenceState` **at those exact spellings** and introduces no `build*` variant of any of them. If a figure genuinely needs a different return shape, A1's signature and A1's test change — a second name does not appear. The capability schema and fixture are A1's per [C7](#c7--capabilitymatrix); `--ob-grid` and `--ob-hatch` are A0's per [C2](#c2--foundation-ownership) and A10 asserts their values rather than declaring them. The section map is [C1](#c1--stylesobsidian-appcss-the-section-map) and A10 fills **§11 and only §11**, plus its two lines in §16.
- **`deriveContestedNote` does not exist and is not created.** The Money sentence below is composed at the call site in `report-figures.tsx` from `stanceOverall(evidence)` and `stanceByDimension(evidence)` — both already frozen in C10 — so no new analytics export appears four phases after the API was closed.
- **The prose rule, stated once and applied everywhere: a number that moves into a figure stays in the sentence.** The report is the artefact people share and quote; sentences with holes in them read as broken. The figure is a **second encoding, not a replacement** — the figure carries the magnitude, the sentence carries the meaning. **A10 edits zero words of report prose**, which also means zero churn against `CitedTextSchema`'s bidirectional refine. The one exception is data that today exists *only* in an ellipsised meta line (competitor `price`); A9 already moved that to a field, not a figure.
- **Every figure carries at least one source.** `Figure` takes `citations: number[]` **or** `source: { label, href }` for aggregate marks whose provenance is a whole corpus. A3's exported `assertFigureSourced` throws when both are empty; A10 additionally runs `assertCitationsResolve(citations, evidence)` at the call site in `report-figures.tsx`, throwing when any `[n]` has no matching `EV_nn`, under `NODE_ENV !== 'production'`. **A figure with no citation is a bug** — the assertions are how that stops being a slogan. Exactly two figures use the `source` escape hatch: `DimensionStrip` and `RecencyStrip`. `RunFunnel` uses it too, for its forward link, *and* is a corpus mark — three call sites, one rule.
- **Stance is fill treatment, never hue, and the treatment is defined once.** `.ob-stance-supports` / `-neutral` / `-contests` live in §4 (A3) per [C12](#c12--shared-class-names), with **one hatch geometry** — `repeating-linear-gradient(45deg, var(--ob-hatch) 0 1px, transparent 1px 6px)`. **A10 redefines none of them and writes no second hatch.** The word always accompanies the mark — `SUPPORTS 25` sits under its segment, never in a detached legend. There is no red anywhere in this layer.
- **Exactly one blue mark exists in the entire figure layer** — `RunFunnel`'s verified bar, because it means verification (job 2), per [C8](#c8--runfunnel). Nothing else in a figure is `--ob-accent`. Axes and gridlines are `--ob-grid`.
- **Labels come from [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), and the long/short split matters here.** `DimensionStrip` cells are a strip, so they render **`DIMENSION_SHORT`** — `Problem` · `Exists` · `Demand` · `Money` · `Practical`. A9's §03 headings render `DIMENSION_LABEL` — `The problem` … `Practical realities`. Stance words come from `STANCE_LABEL` (`challenges` → `Contests`). **No figure derives a label locally and there is no map in `lib/content/app.ts`.**

**The figures, in document order.**

- **`DimensionStrip` — §01, inside `EvidenceState`, full measure, 5 × `minmax(0,1fr)`, 24px gaps, 140px.** Each cell is an `<a href="#dimension-{KEY}">` (this is what un-orphans the five ids A9 exposed). Cell contents: `.ob-meta` label from `DIMENSION_SHORT` · count at 28px mono `tabular-nums` + `.ob-meta` suffix `FINDINGS` · a 2px `CoverageBar` scaled to the run's own max of 14 · a 6px `StanceBar compact` · `ConfidenceNote`.
  Exact fixture values — **derived at runtime, never typed into the component:**
  | | count | bar | supports / neutral / contests | confidence |
  |---|---|---|---|---|
  | Problem | 14 | 100% | 11 / 1 / 2 | solid |
  | Exists | 11 | 78.6% | 6 / 4 / 1 | solid |
  | Demand | 7 | 50.0% | 4 / 2 / 1 | mixed |
  | Money | 13 | 92.9% | 4 / 6 / 3 | solid |
  | Practical | 2 | 14.3% | 0 / 2 / 0 | thin |
  `source: { label: 'ALL 47 FINDINGS', href: '/r/{slug}/sources' }`. **This is one of the figures exempt from per-mark citations** — its source is the whole corpus.

- **`StanceBar` (overall) — §01, full measure, below the strip, 56px.** Caption `STANCE ACROSS ALL 47 FINDINGS`. Segments `supports 25` · `neutral 15` · `contests 7`, sized by `flexGrow`, 1px hairline between segments, labels beneath in `.ob-meta` through `STANCE_LABEL`. `source: { label: 'ALL 47 FINDINGS', href: '/r/{slug}/sources' }`.
  **The single most decision-relevant fact hidden in this data lives here**, printed as a `.ob-body` line beneath the *Money* `StanceBar` in Money's aside (below), not under this one: Money is the only dimension where `neutral + contests > supports`. Compose it from `stanceOverall` and `stanceByDimension` and print whatever they yield — **do not hardcode a count.** Against today's fixture it resolves to *3 of the 7 contests* (EV_35 per-message billing, EV_36 the 12-month minimum, EV_39 "bundle it into our PMS instead"), not 4; earlier plan prose said 4. **The derivation is authoritative; if a later fixture edit changes it, the sentence changes with it.**

- **`RunFunnel` — §02, `variant="compact"`, in the aside beside the summary paragraph, 140px.** The report keeps it and `/sources` §01 owns the expanded version with the discard-reason breakout: **one component, two densities, settled in [C8](#c8--runfunnel).** A13 does not delete this one; if a session finds a competing instruction in A13's body, C8 wins.
  **The axis rule is C8's and is not restated as percentages of anything else:** the four bars are shares of the **largest segment, 47**, straight from `runFunnel(summary)`'s `share = value / max`. On this fixture that draws `19 QUERIES` at 40.4% · `31 PAGES` at 66.0% · `47 VERIFIED` at 100%, **`--ob-accent`** · `18 DISCARDED` at 38.3%, `--ob-discard`. **Nothing here sums to a whole.** A 0→65 axis would make `47/65` read as a pass rate, and this product does not publish pass rates.
  Compact means bars and counts only — no per-segment prose, no reason breakout. 26px bars, 12px gaps (4×26 + 3×12 = 140, which is A9's reservation exactly), the count printed inside each in mono `tabular-nums`, the label in `.ob-meta` to the left. `source: { label: 'THE FULL RUN →', href: '/r/{slug}/sources#the-run' }`.

- **§03 / The problem** — paragraph cites `[1][2][4][7][12][14]`; aside stack, in citation order. Values and citations come from `numberCallouts(evidence, 'PROBLEM')`, whose roster is fixed in [C11](#c11--figure-numbers-settled):
  1. **`NumberCallout` `14.2%`** · `AVERAGE SAME-WEEK CANCELLATION RATE` · sub-label `412 practices surveyed` · 96px.
  2. **`NumberCallout` `16.8% → 9.1%`** · `NO-SHOW RATE WITHOUT VS WITH AUTOMATED REMINDERS` · 96px. Two mono values with a `→` between and a two-bar comparison at 24px beneath, scaled to 16.8%.
  3. **`NumberCallout` `18%`** · `OF PATIENTS PREFER A PHONE CALL` · 96px, `stance="contests"`. **Treatment, and this is deliberate:** the mark area gets `.ob-stance-contests`' shared hatch and 1px `--ob-text` border — the same class, not a copy — and the caption gains a `.ob-chip` reading `CONTESTS`. **It is exactly the same size as the two figures above it — the report's one quantified counter-signal is neither demoted nor amplified.** Beneath it, `.ob-body`: **"The only number in this report that points the other way."** (`REPORT.counterSignalNote`.)
  4. **`RecencyStrip`** · 64px · see below.

- **§03 / What exists** — paragraph cites `[15][16][19][20][21]`; aside:
  1. **`NumberCallout` `0 of 9`** · `REVIEWED SMS TOOLS REBOOK A CANCELLED SLOT END-TO-END` · **`emphasis="lead"`: value at `--ob-h1`, mark 128px.** This is the wedge the entire idea rests on, and per C11 **it is the only callout in the report that gets lead emphasis.** Spending it twice spends it.
  2. **`NumberCallout` `14`** · `SCHEDULING ADD-ONS ALREADY ON THE PMS MARKETPLACE` · 96px.
  3. **`RecencyStrip`** · 64px.

- **§03 / Demand signals** — paragraph cites `[26][27][29][30]`; aside:
  1. **`NumberCallout` `130,000`** · `DENTAL PRACTICES IN THE ADDRESSABLE MARKET` · secondary `70% INDEPENDENT OR SMALL-GROUP` · 96px. Note its citation is **absent from the prose** — the aside is where it finally surfaces, which is the adjacency rule doing real work.
  2. **`RecencyStrip`** · 64px.

- **§03 / Money** — paragraph cites `[33][34][35][36][41][44]`; aside, and this is the densest slot on the page:
  1. **`ValueLadder` · 260px · caption `THE PRICE LADDER`.** Vertical axis 0→$320, 1px `--ob-grid` spine with `.ob-meta` ticks at `$0 $100 $200 $300`. **The four rungs, their values and their citations are C11's and come from `priceLadder(evidence)`** — the willingness-to-pay **band**, the two competitor points, and the owner sign-off **threshold**. What A10 owns is how each of the three kinds draws:
     - a **band** rung → `.ob-ladder-band`, a filled span between its low and high values at `--ob-hairline-strong`, label sans-left, the range mono-right;
     - a **point** rung → the `.ob-ladder-rung` hairline A3 ships, label left, value right;
     - the **threshold** rung → `.ob-ladder-threshold`, a 1px **dashed** rule across the full mark width, labelled right, because it is a threshold and not a point.
     **This is the report's most decision-critical comparison and it is currently invisible**, spread across three paragraphs and two ellipsised meta lines. Beneath it, `.ob-body` with live chips: *"Both competitors price under the line where a practice owner has to approve the spend [33][34][42]."* (`REPORT.ladderNote`, rendered through `renderCitedText`.)
  2. **`GapBar` · 180px · caption `WHAT'S LOST VS WHAT IT COSTS`.** Driven by `roiGap(evidence)`; **the magnitudes and the ratio are C11's** — lost production against tool cost, at C11's ratio. Drawing: shared 0→$4,000 scale, bar A spanning 50–100% of the mark, bar B spanning 5.0–7.5%, ratio readout in mono to the right. The visual argument is that bar B is nearly invisible; do not "fix" that with a broken axis, a log scale or an inset — **the disproportion is the finding.** Note in the recipe comment that the willingness-to-pay finding is a *stated price* and is never used as the tool cost here.
  3. **`StanceBar` (Money) · 56px** — `4 / 6 / 3` — with the composed contested sentence beneath it.
  4. **`RecencyStrip`** · 64px.

- **§03 / Practical realities** — the whole dimension is three numbers currently written as one 40-word sentence marked "thin". Aside:
  1. **One `Figure`, caption `HARD CONSTRAINTS`, 156px, holding three `NumberCallout size="compact"` rows** (28px mono value left, `.ob-meta` label right, `.ob-rule` between): the partner-agreement duration, the webhook latency, and the webhook rate limit — the three C11 callouts whose facts sit outside the prose. **One of them is a `WHAT_EXISTS` finding, and pulling it in here is correct** — a constraints figure restricted to PRACTICAL's own two findings would understate what is actually known. Beneath, `.ob-body` (`REPORT.practicalNote`): **"Marked thin because we found two findings here. All three of these constraints are hard numbers."**
  2. **`RecencyStrip`** · 64px. Two ticks in Sep–Oct on the same twelve-month axis as every other dimension, blank everywhere else. That emptiness is the most informative thing on the strip; keep the shared scale.

- **`RecencyStrip`, all five — 64px each, identical axis Jan 2025 → Dec 2025**, because the five are only comparable if the scale is shared. Fed by `recencyTicks(evidence, dimension)`. A 1px × 10px tick per finding at its `source_date`; **findings whose id is in `citedFindingIds(report)` get a full-height `--ob-text` tick, the rest get `--ob-dim`** — so the strip doubles as a picture of how much of the dimension the prose actually uses. Axis rule `--ob-grid`; `.ob-meta` end labels `JAN 2025` / `DEC 2025`. Caption `WHEN THIS WAS PUBLISHED`. `source: { label: '14 FINDINGS · JAN 2025 – DEC 2025', href: '/r/{slug}/sources?dim=PROBLEM' }` (per dimension, using A13's `dim` param) — the second citation-exempt figure. Actual spans: problem `2025-01-08 → 2025-12-01` · what exists `2025-01-30 → 2025-11-14` · demand `2025-04-02 → 2025-11-20` · money `2025-01-17 → 2025-12-04` · practical `2025-09-14 → 2025-10-05`.

- **`CapabilityMatrix` — §04, full measure, above the three competitor rows, 260px.** `grid-template-columns: 240px repeat(4, minmax(0,1fr)); gap: 24px`, head row 36px + five rows at 44px, `.ob-rule` between rows, rendered as a real `<table>` per A3's accessibility exception. Rows: `Reminder texts` · `Recall campaigns` · `Waitlist` · `Automatic rebooking on cancellation` · `PMS integration`.
  **The schema is A1's and is settled in [C7](#c7--capabilitymatrix)** — five keys, `citations: number[]` per cell, `idea_capabilities` as a key array, refined so a non-`unknown` cell carries at least one citation. A10 adds nothing to `lib/schemas/report.ts`. C7 defers the **cell values** to this phase, so they are written down here and exactly once:
  **ChairSync** reminders `yes` [15], recall `yes` [15], waitlist `no` [15], auto_rebook `no` [15][19], pms_integration `unknown` []. **Recall360** reminders `yes` [16][23], recall `yes` [18][23], waitlist `partial` [16], auto_rebook `no` [16][19], pms_integration `unknown` []. **FrontDeskPro** reminders `partial` [17], recall `unknown` [], waitlist `unknown` [], auto_rebook `no` [19], pms_integration `yes` [17][24]. `idea_capabilities: ['waitlist','auto_rebook','pms_integration']`. If A1's fixture disagrees, **A1's fixture is amended to this table** and logged; the table is not re-cut to match a fixture.
  Cell marks, no hue: `yes` = filled 8px square `--ob-text` · `partial` = 8px square, 1px `--ob-text` border, **left half** filled · `no` = 8px square, 1px `--ob-hairline-strong` border, empty · `unknown` = an em-dash in `--ob-dim`. **Every cell also prints the word** `YES` / `PARTIAL` / `NO` / `UNKNOWN` in `.ob-meta`. A cell at `unknown` carries no citation and that is correct — unknown *is* the absence of evidence; the assertion is figure-level, not cell-level. **These four marks supersede A3's 10px / bottom-half / hatched-unknown draft**: the drawn matrix is this one, `.ob-cell-unknown` is not a hatch cell, and if A3 shipped the earlier geometry, amend `capability-matrix.tsx` here and log it. One consequence to record: A2 justified the shared hatch with three consumers and the unknown cell is no longer one of them — the hatch's consumers are the contests stance fill and `PlanBar`'s conditional bar.
  **The fourth column's register is [C7](#c7--capabilitymatrix)'s and is not negotiable** — `THIS IDEA` heading, `NOT EVIDENCE` chip, cells reading `CLAIMED` or `—` with **no square marks at all**, and C7's line beneath the matrix, shipped as `REPORT.capabilityNote`. A10 draws it: `.ob-matrix-idea` gets a 1px `--ob-hairline` left rule separating it from the three evidence columns, and `.ob-matrix-idea-cell` is mono `.ob-meta` at `--ob-muted`. **That register split is the only thing standing between this figure and a verdict; do not simplify it back into a fourth row.** Citations footer `[15] [16] [17] [18] [19] [23] [24]`.

- **Motion, and this is the whole budget for the report (D17).** Bars animate `transform: scaleX(0 → 1)`, `transform-origin: left center`, over `--ob-enter` with `--ob-ease`, triggered by `data-shown` from `useInView({ threshold: 0.35 })`. **Never animate `width`** — transform, opacity and filter only. Numerals count up inside `CountUp`: rAF over **1100ms**, ease-out cubic `1-(1-p)**3`, mono with `font-variant-numeric: tabular-nums` (inherited from `.ob-fig`) or the digits jitter as widths change. Figures inside one aside stagger **90ms** apart, capped at 6. **Nothing in the figure layer loops, drifts, pulses or scrolls.** No parallax, no per-word reveal, no scroll-driven dimming — those stay on `/`. **A10 declares no `@keyframes`** — every motion here is a transition or a rAF loop — so C1's `ob-app-` prefix rule has nothing to bite on; if that changes, the name is prefixed and grepped across `styles/*.css` first.
- **Reduced motion has two halves and both are required, and the CSS half goes in §16.** [C1](#c1--stylesobsidian-appcss-the-section-map) makes §16 the only home for app-side reduce rules; A10 adds exactly two declarations there and opens no block in §11: `.ob-fig-bar { transform: scaleX(1) }` so a bar can never sit at zero width, and `.ob-fig-value { opacity: 1 }`. JS: `CountUp` reads `matchMedia('(prefers-reduced-motion: reduce)')` **in an effect, never during render** (it breaks SSR hydration otherwise), subscribes to `change`, and **short-circuits to the final value** — `14.2%` renders as `14.2%`, not as a frozen `0.0%`. Push the per-frame state into that leaf so a counting numeral never re-renders its section, and keep `report-figures.tsx` and every `components/figures/*` file a server component.

- **Absent data, thin runs, and the no-blank-div rule.** A figure whose input is missing **is not rendered and reserves nothing**; because the aside is a top-aligned stack, a shorter stack moves nothing else on the page. Rules: `NumberCallout` with no matching finding → omitted. `ValueLadder` with fewer than two rungs → omitted, and the surviving rung renders as a `NumberCallout` instead. `GapBar` needs both magnitudes → omitted if either is absent. `CapabilityMatrix` with zero competitors → §04 is omitted whole, per the blueprint and per A9. `RecencyStrip` renders down to two findings — two ticks is information. `DimensionStrip` and `RunFunnel` always render; a zero-finding dimension shows `0`, an empty coverage bar, no stance bar, and `ConfidenceNote` `thin`. **If a stack empties completely, `ReportRow` flips to `data-aside="none"`** and the row becomes single-column. There is no path on which a blank div ships.

**§11 `REPORT — FIGURES`, the class list, exactly:** `.ob-rfig-stack` `.ob-rfig-slot` (placement and the 40px aside rhythm) · `.ob-rfig-lead` (the `emphasis="lead"` modifier — value at `--ob-h1`, mark 128px) · `.ob-rfig-contest` (the contested callout's border + shared hatch, composing `.ob-stance-contests`, never redefining it) · `.ob-rfig-note` (the four authored `.ob-body` lines) · `.ob-ladder-band` `.ob-ladder-threshold` · `.ob-matrix-idea` `.ob-matrix-idea-cell` · `.ob-countup`. **Every mark's own geometry lives in §4 (A3) and every shared name lives where [C12](#c12--shared-class-names) says it lives** — `.ob-fig`, `.ob-fig-mark`, `.ob-fig-value`, `.ob-fig-bar`, `.ob-stance-bar`, `.ob-stance-supports/-neutral/-contests`, `.ob-cite`. A10 defines none of them and applies `.ob-fig-value` / `.ob-fig-bar` to every numeral and every bar it draws, because two exit tests select on them.

- **`tests/unit/report-figures.test.ts` (extend A1's file)** must additionally cover: every derived figure value equals the fixture — the nine C11 callouts, the four C11 ladder rungs, C11's ROI magnitudes and ratio, and the three PRACTICAL constraints; `stanceOverall` sums to 47 and equals `25/15/7`; the five `stanceByDimension` rows sum to their `meta.count`; **`runFunnel` shares are `value / 47` and the verified share is exactly `1`** (the C8 regression guard — a 0→65 normalisation must fail this test); `deriveEvidenceState` puts each dimension in the lists C10's thresholds imply; `citedFindingIds(report).size === 24` and the uncited complement is 23; `capabilityMatrix(report)` returns five keys per competitor and an idea column that is a key array, never a cell array; every figure descriptor returned by `report-figures.tsx`'s builder satisfies `assertFigureSourced`; every citation it declares resolves in the evidence corpus.

**Exit test:** Playwright MCP at 1440×900 and 1280, `next dev`. (1) **Zero shift:** re-run A9's measurement — `[...document.querySelectorAll('.ob-fig-mark')].map(n=>n.getBoundingClientRect().height)` must equal the array recorded in the A9 build log for that viewport, element for element, **including the 140px funnel entry**. Any mismatch is a reservation bug, not a rounding artefact. (2) **Numbers:** scrape `[...document.querySelectorAll('.ob-fig-value')].map(n=>n.textContent)` and diff against [C11](#c11--figure-numbers-settled); every value must appear exactly once except the ones the fixture repeats, and the list must be non-empty — an empty node list passes vacuously and proves nothing. (3) **Bars ran:** sample `.ob-fig-bar` `transform` six times at 700ms intervals after scrolling §01 into view; you must see `matrix(0,…)` → `matrix(1,…)`, not a static `none` (a static value means `useInView` never fired or a custom property is undefined — pitfalls §3). (4) **The funnel's axis is C8's:** for each of the four `RunFunnel` bars, `bar.getBoundingClientRect().width / mark.getBoundingClientRect().width` must equal `value / 47` within 0.5% — 0.404, 0.660, 1.000, 0.383. A verified bar at anything but 1.000 means someone normalised to a total. (5) **One blue mark:** collect every element inside a `.ob-fig-mark` on this page whose `backgroundColor` or `borderColor` resolves to `rgb(45, 127, 249)`; the result must be exactly one node, the funnel's verified bar (C8). (6) **No hue for stance, one hatch:** the `contests` segment's `backgroundColor` must be `rgba(0, 0, 0, 0)` and its `backgroundImage` must contain `repeating-linear-gradient(45deg`; assert the contested `NumberCallout`'s mark reports the **same** `backgroundImage` string as `.ob-stance-contests` — two different weaves means a second definition got written. Then scan every computed `color`, `backgroundColor` and `borderTopColor` in the figure layer for any `rgb(r,g,b)` with `r > g + 40 && r > b + 40`: the result must be empty, because there is no red. (7) **Citations resolve:** click one chip in each figure footer (`[26]`, `[41]`, `[19]`, `[9]`, `[46]`) — the drawer opens on the matching `EV_nn` each time, and each chip carries `ob-cite`. (8) **The idea column is not a verdict:** every cell in `.ob-matrix-idea` matches `/^(CLAIMED|—)$/` and `document.querySelectorAll('.ob-matrix-idea .ob-cell-yes, .ob-matrix-idea .ob-cell-partial, .ob-matrix-idea .ob-cell-no').length === 0`; the `NOT EVIDENCE` chip and C7's note line are both on screen. (9) **Labels:** the five `DimensionStrip` cell labels read `Problem · Exists · Demand · Money · Practical` (`DIMENSION_SHORT`) while §03's five h3 read the long forms — C3's split, verified on one page. (10) **Reduced motion:** `emulateMedia({reducedMotion:'reduce'})`, reload, wait 1200ms — every `.ob-fig-value` shows its final number (no `0`), every `.ob-fig-bar` transform is `matrix(1, 0, 0, 1, 0, 0)`, and no element sits at `opacity: 0`. Reset to `no-preference`. (11) `?thin=1` still renders without a single blank `.ob-report-aside`. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and `browser_console_messages level:"error"` returning zero at 1440 **and** 1280.

---

## A11 — Roadmap: open questions

**Goal:** `/r/[slug]/roadmap`'s first half is Obsidian, and the open-question stack finally does the three things it has always claimed to do — read as six distinct questions rather than six truncated fragments, show which question actually matters most, and confirm where a dependency click landed you. Implements **D14**, carries **D10**'s downstream consequence, fixes **R2** (the `.card--pulse` half) and **R15** (both halves). Reinstates `SurveyBlock`.

**Read:** the plan's [Shared contracts](#shared-contracts) — **C1, C2, C4, C6, C10, C12, C13, C14** in full; `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md`, `references/pitfalls.md` §1 §3 §5 §7 §10 §11, `WebsiteLayoutDesc/08-page-roadmap.md`, `WebsiteLayoutDesc/11-interaction-patterns.md` §the copy contract

**Build:**
- `app/r/[slug]/roadmap/page.tsx` — **new page.** `<AppBackdrop variant="roadmap" />` as its first child ([C13](#c13--ownership-of-things-two-phases-both-wanted) — the layout cannot see the segment, so the page renders it and A12 does not add a second), page header, the sticky nav wrapper + `SegmentedControl`, and the `01 OPEN QUESTIONS` section. Server component; sorts the question list server-side and passes the canonical order down. A12 appends `02 BUILD ROADMAP` to this same file.
- `components/roadmap/open-questions-section.tsx` — **new**, `'use client'`. Owns the D10 promotion pass and the `ALSO UNKNOWN` well. `OpenQuestionsSection` *Add to the naming contract.* (it is already in `WebsiteLayoutDesc/README.md`'s glossary; the plan's contract has never carried it).
- `components/roadmap/open-question-card.tsx` — rebuilt. Not a `Card` any more.
- `components/roadmap/survey-block.tsx` — **new**, `SurveyBlock`. Already in the naming contract.
- `components/roadmap/script-block.tsx` — restyled; numbering moves out of the data.
- `components/roadmap/find-them-row.tsx` — **new**, `FindThemRow` *Add to the naming contract.* (a row of `OpenQuestionCard`; it exists as a real file because the dead link branch is a `type` bug, not a styling bug).
- `components/roadmap/dependency-chip.tsx` — `DependencyChips` + `ChangesLink`, restyled. *Add to the naming contract.* for both — they are the plural container and the reverse-direction variant of the contract's `DependencyChip`.
- `components/roadmap/fieldwork-band.tsx` — **new**, `FieldworkBand`, plus `components/roadmap/fieldwork-media.tsx` → `FieldworkMedia`. *Add to the naming contract.* The page's hinge, between `01 OPEN QUESTIONS` and `02 BUILD ROADMAP`. **This is D18's one sanctioned human subject on the app side and it was briefed in `higgsfieldPlan_roadmap.md` §1 before any phase claimed it — it is claimed here.** Copy in `lib/content/app.ts` → `ROADMAP.fieldwork`.
- `components/roadmap/roadmap-context.tsx` — pulse restart fix + `primaryQuestionId`.
- `components/figures/fan-out-meter.tsx` — **composed here, built in A3.** A11 makes exactly one amendment to it; see the ownership note below.
- `styles/obsidian-app.css` **§12 `ROADMAP — OPEN QUESTIONS`** — the banner A0 seeded per [C1](#c1--stylesobsidian-appcss-the-section-map). A11 fills §12 and writes in no other section. The class list is enumerated below.
- `lib/content/app.ts` — every string in this phase, including `buildScriptText` and the number-word map.
- `lib/fixtures/roadmap.ts` — **assert only for the fields [C6](#c6--openquestion-priority-brief-link-fan-out) settles** (`priority`, `brief_field`, `effort`, the dependency edges). Two edits A11 owns because they are presentation leaking into data: strip the `"1. "` prefix from every `script.lines` string, and correct Q04's survey note if A1 shipped it reading `Two-question`. One fixture addition A11 owns: the fourth `brief_field` link, below.
- `tests/unit/roadmap-integrity.test.ts` — **new.**
- Delete from `styles/components.css` §13: `.oq-grid`, `.oq-label`, `.oq-value`, `.oq-value--question`, `.oq-number`, `.oq-collapsed-question`, `.find-them-list`, `.find-them-link`, `.script-block-lines`, `.dependency-chip*`. Deep Canopy leaves with them.

**Notes:**

- **`FieldworkBand` — the page's hinge, and the one place photography is honest on the app side.** Full `--ob-container` 1200px, a 1px `--ob-hairline` above and below, `padding-block: 96px`, three panels in `grid-template-columns: repeat(3, minmax(0,1fr)); gap: 24px`. **It carries no heading** — it sits inside `01 OPEN QUESTIONS`' section as its closing content, which is what keeps the roadmap's outline at [C17](#c17--heading-outlines-per-route)'s `h2 ×2 · h3 ×11`. It earns its position: everything above it is a question the web declined to answer, everything below it assumes you went and asked. At the top of the page it would be decoration over a headline; at the bottom it would be a send-off.
- **It ships as three `MediaSlot`s and that is a finished state, not a gap** (standing rule 14). Each is correctly sized, hairline-framed, and carries its own art-direction brief on screen — subject, treatment, duration, delivery path — from `higgsfieldPlan_roadmap.md` §1. `FieldworkMedia` is the one-component swap point: it renders the slot today and a scrimmed `<video>`/poster once an asset lands, so no other file changes. **Do not delete the slots as cleanup** — a slot is the spec for an asset someone still owes, and deleting it deletes the requirement.
- **Reserved height is exact and does not change when an asset arrives**: each panel is `aspect-ratio: 16 / 9`, so the band's height is a function of the column width alone. A9's zero-shift discipline applies here too — measure the band before and after any swap. **16/9 is settled and shipped** — an earlier draft of this line said `4 / 5`; `higgsfieldPlan_roadmap.md` §1 specifies 16:9 at 1920×1080 and the media plan wins over the phase body on an asset's format. See A11's deviation note. Do not re-open it.

- **What is not restated here.** `priority`'s type and its six values, `brief_field`'s name/type/home, and the dependency edges are [C6](#c6--openquestion-priority-brief-link-fan-out)'s; the schema lives in `lib/schemas/roadmap.ts` and there is no `lib/schemas/open-question.ts`. The brief-state module surface — `readBriefPatch`, `unknownKeys`, the `v: 1` discriminator, the `sv.brief.<slug>` key — is [C4](#c4--the-brief-state-libbrief-statets)'s and ships complete in A1. `fanOut` and the rest of the analytics API are frozen in [C10](#c10--the-analytics-api-frozen-in-a1). A11 declares none of them; it asserts and consumes.
- **`lib/fixtures/roadmap.ts` already carries C6's edges.** Verified in the tree: S01 `['Q01','Q06']` · S02 `['Q02','Q04','Q05']` · S03 `['Q06']` · S04 `['Q03','Q06']` · S05 `['Q01','Q04']`. That is exactly C6's list, so **no edge is added or changed by any phase** — if A1's build log records "one new dependency edge", it was already there and the note is the deviation, not the edit.
- **Layout.** `.ob-oq-stack` is capped at `920px` inside `.ob-container` (1200px, 40px gutters — [C5](#c5--the-roadmap-week-model-librun-plants) states the geometry once and A12's axis depends on it), left-aligned to the container's left edge, not centred. The page header, the sticky nav, the section eyebrows and the `01`/`02` rules all run the full container. One left edge, two right edges — the wide one belongs to the rules, the narrow one to the reading. This is the "roadmap 1200 with the 920 question cap" diagram A14's `/style-guide` `layout` section draws.
- **Page header.** h1 `What to do next.` at `--ob-h1`, weight 400, `--ob-tracking-h1`, `--ob-text`. Lead directly under it at `--ob-lead` in `--ob-muted`: `Six things the web can't tell you, and the plan that depends on them.` Then a `MetaLine` at `--ob-meta`: `6 OPEN QUESTIONS · 4 BUILD STEPS · 1 TRIPWIRE · 12 WEEKS`. The step count and the horizon are [C5](#c5--the-roadmap-week-model-librun-plants)'s — `4 BUILD STEPS · 1 TRIPWIRE` is now the count in the run header (A4), on this line, and in the OG description (A15), so **there is no second count to argue with and this phase does not argue with one.** Separator is ` · `, never ` // `.
- **The sticky nav is a wrapper, not a primitive override.** `.ob-roadmap-nav { position: sticky; top: var(--ob-header-h-condensed); z-index: 20; background: var(--ob-canvas); border-bottom: 1px solid var(--ob-hairline); height: 40px; display: flex; align-items: center; }`, and the `SegmentedControl` sits inside it unchanged. **§12 does not redeclare `.ob-segmented`** — that class is A2's, in §3, and a primitive that hardcodes `position: sticky` is a primitive that cannot be used anywhere else. This is the half of R9 A4 did not own: A4 made the header genuinely fixed, this makes the control under it genuinely pin. **Before believing the stickiness, walk every ancestor for a non-`visible` `overflow`** — A0 moved `overflow-x: clip` from the scoped theme block onto `:root`, and pitfalls §5 is exactly this trap.
- **Anchor inset comes from [C2](#c2--foundation-ownership) and nowhere else.** `--ob-anchor-inset` is `136px` with exactly one rule applying it, `main [id] { scroll-margin-top: var(--ob-anchor-inset) }`, in §1. Every `#question-Qnn` and `#step-PHASE` on this page is inside `<main>` and inherits it. **§12 writes no `scroll-margin-top` rule at all** — the earlier, more specific selector wins and you will spend an afternoon on it (pitfalls §11). 136 against this page's 56 + 40 sticky stack leaves 40px of air; the surplus is deliberate slack, not a mismatch to correct.
- **Section eyebrow.** `<SectionLabel index="01">Open questions</SectionLabel>` — A2's component, used exactly as A9 uses it on the report, with A2's typography and colour split unmodified. §12 adds no `.ob-eyebrow` rule. **Neither part is blue**; section labels are accent-coloured today in Deep Canopy and that ends with A2.
- **The page's heading outline is [C17](#c17--heading-outlines-per-route)'s, not this phase's to invent.** `01 OPEN QUESTIONS` and `02 BUILD ROADMAP` are the section **`<h2>`s**, rendered with `.ob-eyebrow`'s styling — on a route with no separate headline the eyebrow *is* the heading, and each `<section>` takes its accessible name from `aria-labelledby` pointing at it. The page is therefore `h1 ×1` (`What to do next.`) · `h2 ×2` · `h3 ×11` — six question texts here, four step names and one tripwire heading in A12. Every question is `<h3 class="ob-oq-question"><button aria-expanded…>`, the standard accordion pattern with the button inside the heading. **Heading *size* is set by class and is independent of level**, so nothing about the type scale changes; what changes is that the route no longer skips from `h1` to a flat run of `h2`s with no section structure between them.
- **`OpenQuestionCard` is a hairline-ruled row, not a card.** No radius, no border box, no `Card` import. `.ob-oq { border-top: 1px solid var(--ob-hairline); padding: 32px 0; }`, last child gets `border-bottom`. Expanded: `.ob-oq[data-expanded='true'] { background: var(--ob-surface); margin-inline: -24px; padding-inline: 24px; }` — the fill bleeds past the text column, the rules stay put. No shadow, no ring, no `card--featured`.
- **The card is one grid, trigger included.** `.ob-oq-grid { display: grid; grid-template-columns: 160px minmax(0,1fr); column-gap: 32px; row-gap: 28px; }`. `.ob-oq-label` is mono 12px uppercase `+0.1em` weight 500 `--ob-dim`, `padding-top: 6px` to sit on the first text baseline. The seven blueprint labels in fixed order: `QUESTION` · `WHY IT MATTERS` · `ASK` · `FIND THEM` · `HOW MANY` · `THE SCRIPT` · `WHAT YOU LEARN`. **This is the grid A14's `roadmap/loading.tsx` mirrors** — `160px minmax(0,1fr)`, not `120px 1fr`; A14 reads the shipped rule rather than guessing it.
- **R15(b), the fix.** The `QUESTION` row *is* the trigger. It renders at all times, collapsed and expanded, in the same 160px-labelled grid as every other row, so expanding never removes the landmark. The collapsible region begins at `WHY IT MATTERS`. **This preserves the seven-label spine exactly and deletes the duplicate — the question is no longer printed twice on an open card.**
- **R15(a), the fix.** `.ob-oq-question` is `--ob-h3` (23px), weight 400, `--ob-tracking-snug`, `--ob-text`, `line-height: 1.24`. Collapsed it carries `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;` — two lines at 23px in a 760px value column is ~150 characters, so all six fixture questions (90–140) render whole. **The clamp is a guard against a future 200-character question, not a routine truncation.** `nowrap` + ellipsis is deleted. Expanded sets `-webkit-line-clamp: unset`.
- **Under the question, in the trigger:** a `FanOutMeter`, then `.ob-oq-meta` reading `Q06 · 3 STEPS`, then the `ASK` preview. The ask preview is **sans** `--ob-sm` `--ob-muted` prefixed by a mono `ASK` label — it is a sentence, and today it renders through `.meta-line`, i.e. uppercase mono at sentence length. Mono carries no sentences.
- **The card's mono index is the id, not the ordinal.** `Q01`…`Q06`, never `01`…`06`. `DependencyChip` addresses questions by id, `Copy all scripts` heads each block with the id, and the stack sorts by priority — a positional index would drift against all three the moment the order changes. `OpenQuestion.number` stops being rendered anywhere.
- **D14 — fan-out as weight, and the one amendment A11 makes to A3's kit.** `FanOutMeter` is A3's mark; **`.ob-fanout`, `.ob-fanout-tick` and `.ob-fanout-tick-on` live in §4 and §12 declares no `.ob-fanout*` rule** — a mark whose CSS lives in two sections is exactly what C1 exists to prevent. A11 amends the mark once, in A3's file and A3's section, and records it in the build log: the signature becomes `{ governs: number; tripwire: boolean; max: number; caption: string }`, one modifier `.ob-fanout-tick-tripwire` joins §4, and the caption becomes a noun phrase. It draws `max` ticks where `max` is the highest fan-out in the run (**3** here): a governed **build step** is a solid 3×14px `--ob-text` tick, an ungoverned slot is a 1px `--ob-hairline-strong` outline tick, and **the governed tripwire is an outline tick with a 1px `--ob-text` border** — the fill vocabulary from the stance marks, reused. Captions, derived from C6's edges and never typed into a component: Q06 `3 STEPS` · Q01 and Q04 `1 STEP + TRIPWIRE` (fan-out 2 — one build step plus S05) · Q02, Q05, Q03 `1 STEP`. Those totals are C6's `Q01 2 · Q02 1 · Q03 1 · Q04 2 · Q05 1 · Q06 3` exactly. **`FanOutMeter` is exempt from the `Figure`-needs-a-citation rule** — it counts the step list rendered 900px below it, and that list is its own provenance. Record the exemption in the build log so A15 doesn't flag it.
- **`fanOut` returns the edges, not a number.** [C10](#c10--the-analytics-api-frozen-in-a1) fixes both the name and the shape — `fanOut(roadmap): Record<string, RoadmapPhase[]>`, question id → the phases that depend on it, in axis order. A11 partitions each list with `isOnAxis` ([C5](#c5--the-roadmap-week-model-librun-plants)) into `governs` and `tripwire`. **No second name appears and no component recounts the edges.**
- **Ordering rule.** Cards render ascending by `OpenQuestion.priority`, tie-broken by `number` ascending. The six values are [C6](#c6--openquestion-priority-brief-link-fan-out)'s and are not restated here; the resulting document order on a clean load is **Q06, Q01, Q04, Q02, Q05, Q03**. **The sort is authored in the fixture, not computed at render**, so a future backend owns the ordering.
- **D10's downstream consequence — promote, never fabricate.** `brief_field` mapping, which A11 owns: **Q01 → `who_decides`, Q02 → `what_makes_this_different`, Q03 → `how_customers_find_it`, Q04 → `assumptions`**; Q05 and Q06 are `null`, because they came from the research, not the brief. The fourth link is new and deliberate — Q04 asks whether patients who have never had a scheduling text will opt in, and the brief's second assumption is literally *"Patients will opt in to receiving a scheduling text from their dentist"*, so the link is honest **and it is the only one that is reachable**, for the reason in the next bullet.
- **Promotion fires on what the user marked, not on what the run already knew.** The promotion set is `unknownKeys(brief, patch)` ([C4](#c4--the-brief-state-libbrief-statets)) **minus the fields whose server status is already `unknown`**. The fixture ships `who_decides`, `what_makes_this_different` and `how_customers_find_it` unknown; those three are *why* Q01–Q03 exist and are already priced into C6's authored rank. Promoting them would count the same fact twice and would put the three lowest-fan-out questions on top of a page nobody has touched — and C6 states plainly that the card order **is** the priority order. So on a clean load there is no promotion, no badge, no `ALSO UNKNOWN` well, and the order is C6's. Mark `assumptions` unknown in Define and Q04 floats to the top: that reorder is D10 working, visible, once, in response to something you did one screen ago.
- **The promotion arithmetic.** Effective sort key = `priority - 100` for a promoted question, which floats the promoted group above the rest while preserving relative order inside each group. A promoted card carries `.ob-oq-badge` — a 4px-radius mono chip reading `FROM YOUR BRIEF` — and one sans line under the question: `You marked "Assumptions" unknown.` (the brief field's display label, in quotes). Badge and promotion share one trigger; a badge that does not float, or a float with no badge, is a bug.
- **One brief-field label map, not a second one.** The display label comes from the map A7 owns for `BriefPanel`; A11 imports it and declares nothing. If A7 has not yet lifted it out of `components/define/brief-panel.tsx`, A11 lifts it to `lib/schemas/brief.ts` as `BRIEF_FIELD_LABEL`, beside `BriefFieldKeySchema` — the same "labels live next to their schema" precedent [C3](#c3--vocabulary-maps-one-home-libschemasevidencets) sets for dimensions — and records the move. R14 was three vocabularies for five words; this is how a fourth would start.
- **Hydration.** The server renders C6's order because it cannot read `localStorage`. `OpenQuestionsSection` re-sorts in an effect **after** `useBriefState(slug, brief)` hydrates, and only when the promotion set is non-empty. Read `localStorage` in an effect, never during render (R8 is the precedent).
- **Unknowns with no canonical question do not invent one.** Nothing in the run wrote a script for them, and fabricating one violates "nothing is invented to fill a field." They collect in a `Well` above the stack, `.ob-also-unknown`, mono label `ALSO UNKNOWN`, one sans line: `Three more things you marked unknown — how it makes money, first version scope, how they solve it today — didn't turn into research questions. Worth answering; there's no script for them.` Field labels join with ` · `; the count word comes from `lib/content/app.ts`'s number map; the field list is templated, not typed. **A field with a `brief_field` link never appears here — it promotes instead.**
- **R2 — the pulse, finally defined, and named so it cannot kill the live dot.** `.ob-oq[data-pulse]` runs `animation: ob-app-pulse 600ms var(--ob-ease) 1;` with `@keyframes ob-app-pulse { 0%, 30% { border-top-color: var(--ob-hairline-accent); border-bottom-color: var(--ob-hairline-accent); } 100% { border-top-color: var(--ob-hairline); border-bottom-color: var(--ob-hairline); } }`. **The `ob-app-` prefix is [C1](#c1--stylesobsidian-appcss-the-section-map)'s rule and here is the live reason for it:** `@keyframes ob-pulse` already exists in `styles/obsidian.css:368` as the 2.4s live-dot animation, `obsidian-app.css` is imported after it in the same layer, and a duplicate name is silently *replaced*, not merged — an unprefixed declaration here stops `.ob-dot` pulsing on every route, with no error, on a page that still looks right. **This keyframe is declared once, in §12, and A12's §13 reuses it by name.** Blue is legitimate here and the job is **job 3, live/active** — it confirms, for 600ms, that this is the element you just navigated to. No ring, no glow, no shadow; rule 7 permits shadows only on `.ob-btn`.
- **The pulse will not restart on a repeat click unless you make it.** `RoadmapProvider.pulse()` sets the same `pulseTarget` again, the attribute never changes, and a CSS animation does not re-run on an attribute write that leaves the selector matching. Fix: `setPulseTarget(null)`, then `requestAnimationFrame(() => setPulseTarget(domId))`. Absent → present is what restarts it.
- **Reduced motion:** `.ob-oq[data-pulse] { animation: none; border-color: var(--ob-hairline-accent); }` — a hard on/off that still confirms the landing without moving. It goes in **§16**, the app's only reduced-motion home, which A15 finalises; A11 records `.ob-oq[data-pulse]` and `ob-app-pulse` in the build log so A15's grep-the-selectors completeness diff has them. The JS half branches too: `scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })`. `block: 'center'`, not `'start'` — the header is sticky now.
- **Bidirectional wiring, both directions restated.** Forward: on a build step, `.ob-dep-row` reads `◂ depends on` in mono `--ob-dim` followed by `.ob-dep-chip` buttons labelled `Q01` `Q06`; click expands that question, scrolls to it, pulses it. Reverse: at the foot of every open question, above a `1px --ob-hairline` rule, `Changes:` in mono followed by chips labelled `▸ Before you build`, `▸ What would change this plan`; click scrolls to that step and pulses it. `WHAT_WOULD_CHANGE_THIS_PLAN` resolves to `#step-WHAT_WOULD_CHANGE_THIS_PLAN` — A12 keeps that id on the `TripwirePanel`, so no wiring changes. `.ob-dep-chip` is 4px radius, 1px `--ob-hairline`, mono 12px `--ob-muted`; hover raises the border to `--ob-hairline-strong` and the text to `--ob-text` over `--ob-base`; `:focus-visible` gets the accent outline with `transition: none`; `:active` is `translateY(1px)`, not `scale()`. **Not a pill.** **`.ob-dep-row` and `.ob-dep-chip` are declared here, in §12, and A12 reuses them without redeclaring.**
- **`ScriptBlock`.** `.ob-script` is a `Well` on `--ob-void` with a 1px `--ob-hairline` and 10px radius, 20px padding. `.ob-script-line` is sans `--ob-sm` `--ob-text` — the script is material the user reads aloud, not metadata. **Numbering moves into CSS and out of the data:** `.ob-script { counter-reset: ob-script }`, `.ob-script-line { counter-increment: ob-script }`, `.ob-script-line::before { content: counter(ob-script) "."; color: var(--ob-dim); font-family: var(--ob-font-mono); width: 24px; }`. Strip the `"1. "` prefixes from every `script.lines` string in the fixture. The clipboard text is rebuilt by `buildScriptText(lines)` in `lib/content/app.ts` as `lines.map((l, i) => \`${i + 1}. ${l}\`).join('\n')` — **clean plain text: the numbered questions only, no markdown, no labels, no attribution footer.** Key the rendered lines by index, not by content; two identical lines collide today.
- **Copy confirmation is the label swap and nothing else.** `Copy script` → `✓ Copied` for 2000ms → back. Failure → `Press ⌘C` with the text DOM-selected. **There are no toasts in this product.** `Copy all scripts` sits at the foot of §01 and is always `.ob-btn-ghost`.
- **Exactly one primary button.** `RoadmapProvider` gains `primaryQuestionId` — the first expanded question in document order. `ScriptBlock` takes `primary={question.id === primaryQuestionId}`. Multi-expand is unchanged; without this, opening three cards puts three `.ob-btn-primary`s on screen and breaks standing rule 11.
- **`SurveyBlock`** renders the blueprint's two extra rows after `THE SCRIPT`, on Q04 only. Row one, label `THE SURVEY`: a `.ob-script` well carrying the questions **with their answer options**, options on the line below each question in mono 12px `--ob-dim` (`.ob-script-opts`). Exact content:
  1. `Have you received a text from this practice before today?` — `YES / NO / NOT SURE`
  2. `If an earlier appointment opened up, would you want a text about it?` — `YES / NO`
  3. `If no — what would change your mind?` — `FREE TEXT`
  Row two carries an **empty label cell** and two lines: the fixture note `Three-question intercept, handed to patients at check-in for two weeks.` in `--ob-muted`, then the standing line in `--ob-dim`: *"Surveys are for counting things after interviews have told you what to count."* Its copy button reads `Copy survey`, always ghost. The fixture rows and the `sample_size` field land in A1; **A11 asserts them, and if A1 shipped the shipped tree's two-question form with the note reading `Two-question`, corrects both here and records it.**
- **`FIND THEM` must be real, and its link branch must stop being dead code.** `FindThemRow` branches on the `type` discriminator, not on which optional field happens to be present:
  - `link` → resolve `citation_id` through the evidence corpus, render `<a href={finding.source_url} target="_blank" rel="noopener noreferrer">` with the label, a trailing `↗`, and a `CitationChip`. **The href is derived from the cited finding, never authored** — that is why zero `url` fields exist in the fixture and why none should be added. If A1 did not remove `FindThemItemSchema.url`, remove it here and record it; an authored URL alongside a citation is two sources for one fact.
  - `count` → label at `--ob-text` (it asserts a quantity) plus its `CitationChip` where one exists.
  - `text` → plain `--ob-muted`.
  - empty array → the honest sentence, `--ob-dim`: `We didn't find specific communities for this — start with the general ones and ask who else to talk to.` **Never a fabricated list.**
  `FindThemRow` reads the existing `EvidenceProvider` context mounted in `app/r/[slug]/layout.tsx` — no new plumbing, no new prop threaded through the page. `CitationChip` and `.ob-cite` are A5's, from §6; §12 declares no chip rule.
- **§12's complete class list**, so A15's reduce-block diff has a closed set to check against: `.ob-roadmap-nav` · `.ob-oq-stack` · `.ob-oq` · `.ob-oq-grid` · `.ob-oq-label` · `.ob-oq-question` · `.ob-oq-meta` · `.ob-oq-ask` · `.ob-oq-badge` · `.ob-oq-note` · `.ob-also-unknown` · `.ob-script` · `.ob-script-line` · `.ob-script-opts` · `.ob-survey-note` · `.ob-dep-row` · `.ob-dep-chip` · `.ob-changes-row`. Plus one `@keyframes ob-app-pulse`. Nothing else, and nothing outside §12.
- **A11 renders no `Fragment`.** `.ob-script` and the survey well are prose containers, not code-drawn product surfaces. If A2 kept `components/ui/fragment.tsx` on the strength of a roadmap consumer, the consumer is not here — say so in the build log so A2's promotion is re-argued on the console's and the report's evidence, not on this page's.
- **Referential integrity.** `tests/unit/roadmap-integrity.test.ts` asserts (a) every `find_them.citation_id` resolves to an existing `EV_nn` in the evidence fixture; (b) every non-null `brief_field` is a key of `BriefSchema`; (c) `priority` is a permutation of `1..6` and equals C6's table; (d) fan-out computed from the fixture's dependency edges equals C6's `Q01 2 · Q02 1 · Q03 1 · Q04 2 · Q05 1 · Q06 3`; (e) sorting by fan-out descending with ties broken by `priority` reproduces the authored priority order — the assertion that keeps `FanOutMeter` and the card order honest without a second source; (f) `buildScriptText`'s first line starts `1. `; (g) no `script.lines` string starts with a digit-and-period. `RoadmapSchema.refine` checks step→question ids and nothing else; a typo'd citation renders `[99]` and falls silently through `CitationChip`'s not-found branch.
- The `Accordion` wrapper must not draw `.accordion-item { border-bottom }` inside the card. `.ob-oq` owns its rules; the collapsible is `grid-template-rows: 0fr → 1fr` over `--ob-base` with `inert` when closed, and no border of its own.

**Exit test:** With `next dev` running and the **Playwright MCP** at 1440×900, clear `localStorage` and load `/r/sms-rebooking-4f2a/roadmap`. **(1) Canonical order:** read `.ob-oq-meta` text in DOM order — `Q06, Q01, Q04, Q02, Q05, Q03` — and assert `document.querySelectorAll('.ob-oq-badge').length === 0` and no `.ob-also-unknown` exists. **(2) Promotion:** write `sv.brief.sms-rebooking-4f2a` with `{v:1, unknown:['assumptions','how_it_makes_money'], revealed:[], edited:[], approvedAt:null}`, reload, and assert the order becomes `Q04, Q06, Q01, Q02, Q05, Q03`, that Q04 alone carries `.ob-oq-badge` reading `FROM YOUR BRIEF`, that its note reads `You marked "Assumptions" unknown.`, and that `.ob-also-unknown` names `how it makes money` and no field that has a question. Clear storage again. **(3) R15(a):** `getComputedStyle(document.querySelector('.ob-oq-question')).webkitLineClamp === '2'`, and `scrollWidth <= clientWidth` on all six collapsed questions — nothing is ellipsised. **(4) R15(b):** expand Q01 with a real `Enter` on its trigger; `.ob-oq-question`'s `textContent` is identical before and after, and the string appears **exactly once** in the card's subtree. **(5) Fan-out:** count `.ob-fanout-tick` per card — three each — and assert Q01's and Q04's cards each contain exactly one `.ob-fanout-tick-tripwire` and Q06's contains none. **(6) Pulse, forward:** scroll to `02 BUILD ROADMAP`, click the `Q06` `DependencyChip` with a real mouse click, then sample `document.querySelector('#question-Q06').dataset.pulse` and its `borderTopColor` six times at 120ms — the attribute must appear and disappear, and the colour must pass through `rgba(45, 127, 249, 0.42)` before returning to `rgb(35, 35, 38)`. Click the same chip again immediately and confirm the animation restarts (the attribute must go absent for at least one sample). **(7) Pulse, reverse:** click `▸ Before you build` on Q06's `Changes:` row and sample `#step-BEFORE_YOU_BUILD` the same way. **(8) The live dot survived:** on this route and on `/`, assert `getComputedStyle(document.querySelector('.ob-dot')).animationDuration` is still `2.4s` — the one measurement that catches an unprefixed keyframe. **(9)** Count `.ob-btn-primary` elements with a non-zero viewport intersection with three cards open — must be ≤ 1. **(10) Sticky:** scroll 2000px and read `getBoundingClientRect().top` on `.ob-roadmap-nav` — must equal 56. Walk its ancestors collecting any with `overflow !== 'visible'` — must be empty. **(11) Anchor inset:** `getComputedStyle(document.querySelector('#question-Q06')).scrollMarginTop === '136px'`, and `[...document.querySelectorAll('main [id]')]` all report the same value — a second rule anywhere shows up as a divergent number. **(12) Outline:** `[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.tagName)` on the full page is one `H1` and eleven `H2`, no `H3`; `document.querySelector('.ob-eyebrow').tagName === 'P'`. **(13) Reduced motion:** emulate `reducedMotion: 'reduce'`, reload, click a chip — `animationName` is `none` while `borderTopColor` still resolves to the accent, and `scrollIntoView` does not smooth-scroll (position settles within one frame). Reset to `no-preference`. Repeat every layout read at **1280**. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A12 — Roadmap: the time-scaled build plan

**Goal:** the build plan stops being a decorative vertical spine with five equal dots and becomes a time-scaled bar chart on a shared week ruler, where the step you should build first is unmistakable and the risk tripwire is visibly not a build step. Implements **D13**, fixes the other half of **R2** (`.timeline-node`, `--accent`, `--pulse`), and gives the page an exit.

**Read:** the plan's [Shared contracts](#shared-contracts) — **C1, C2, C5, C10, C12, C13, C14** in full; `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md` §2 §7, `references/verification.md` §3 §6, `references/pitfalls.md` §3 §11, `WebsiteLayoutDesc/08-page-roadmap.md`

**Build:**
- `app/r/[slug]/roadmap/page.tsx` — appends the `02 BUILD ROADMAP` section, the `TripwirePanel` band and the `RoadmapExit` band to the page **A11 created**. A11 owns the header, the sticky nav and `<AppBackdrop variant="roadmap" />`; **A12 adds no second backdrop** ([C13](#c13--ownership-of-things-two-phases-both-wanted)).
- `components/roadmap/roadmap-timeline.tsx` — `RoadmapTimeline`, rebuilt as axis + lanes + step blocks.
- `components/roadmap/roadmap-step.tsx` — `RoadmapStep`, rebuilt.
- `components/roadmap/tripwire-panel.tsx` — **new**, `TripwirePanel`. Already in the naming contract.
- `components/roadmap/not-in-it-list.tsx` — `NotInItList`, un-struck.
- `components/roadmap/roadmap-exit.tsx` — **new**, `RoadmapExit`. *Add to the naming contract.* Row for the "New — introduced by this build / Surfaces" table: `RoadmapExit` | The roadmap's terminal band. The run has no next stage, so this is where the evidence layer and a new run are offered.
- `components/figures/week-axis.tsx`, `components/figures/plan-bar.tsx` — **composed here, built in A3.** A12 makes three amendments to them; see the ownership note below. It does not create a second `WeekAxis` or a second `PlanBar`.
- `styles/obsidian-app.css` **§13 `ROADMAP — BUILD PLAN`** — the banner A0 seeded per [C1](#c1--stylesobsidian-appcss-the-section-map). A12 fills §13 and writes in no other section. Class list below.
- `lib/content/app.ts` — every string in this phase.
- `lib/run-plan.ts` — **assert only.** The API is frozen in A1 by [C10](#c10--the-analytics-api-frozen-in-a1) and the model by [C5](#c5--the-roadmap-week-model-librun-plants). A12 adds no export and renames none.
- `lib/fixtures/roadmap.ts`, `lib/schemas/roadmap.ts` — **assert only.** `kind`, `start_week`, `duration_weeks`, the deletion of `estimate` and the five-row span table are [C5](#c5--the-roadmap-week-model-librun-plants)'s and land in A1.
- **Delete** `components/roadmap/timeline-node.tsx` entirely, and `.roadmap-timeline`, `.timeline-step`, `.timeline-step::before`, `.timeline-step-heading`, `.cut-list-items` from `styles/components.css` §13.

**Notes:**

- **What is not restated here.** The week model — 12-week horizon, `duration_weeks: null` = open-ended, the five-row span table, the `planSpans` / `planHorizon` / `isOnAxis` API, the deletion of `estimate`, the absence of `open_ended` / `buildRunPlan` / `planLanes` / `leftPct` / `widthPct`, and the axis geometry — is settled in [C5](#c5--the-roadmap-week-model-librun-plants) and frozen in [C10](#c10--the-analytics-api-frozen-in-a1). **Do not restate the horizon, the spans or the module surface in this phase.** A12 composes them; if `run-plan.test.ts` does not already assert the four spans and a horizon of 12, extend A1's test rather than writing a second one.
- **What A12 changes in A3's figure kit, exactly three things, all recorded in the build log.** A3 built `WeekAxis` and `PlanBar` against a pre-C5 model, so:
  1. **`WeekAxis`'s signature becomes `{ weeks: number; children?: ReactNode }` driven by `planHorizon(roadmap)`** — the `weeks={14}` style-guide fixture and any 0-indexed start go with the old model. Weeks are **1-indexed**, always.
  2. **`PlanBar`'s signature becomes `({ span, name, lead, onSelect }: { span: PlanSpan; name: string; lead: boolean; onSelect: () => void })`**, taking a `PlanSpan` straight from `planSpans` rather than four loose numbers. One component, one signature; the old props are deleted, not deprecated.
  3. **`.ob-plan-bar-conditional` is removed from §4 and from `PlanBar`.** Its hatch said *conditional*; under C5 the fourth lane's actual property is *no end*, which `.ob-plan-bar--open` states below. Two treatments for one bar is how a figure grows a second meaning.
  Everything else in §4 — `.ob-week-axis`, `.ob-week-tick`, `.ob-week-label`, `.ob-week-lanes`, `.ob-plan-bar` — stays A3's and **§13 does not redeclare it.** §13 carries only the two `.ob-plan-bar` modifiers and the page's own classes.
- **R2, the other half.** `.timeline-node`, `.timeline-node--accent` and `.timeline-node--pulse` are emitted by a shipped component and **defined in no stylesheet**. The whole `isThin → accentPhase` computation — threaded from `page.tsx` through `RoadmapTimeline` through `RoadmapStep` into `TimelineNode` — currently produces zero pixels, and the visible dot is `.timeline-step::before`, identical for all five steps. `TimelineNode` is deleted rather than styled; the emphasis moves onto the bar. `accentPhase` keeps its name and its thread, and now has something to change.
- **`WeekAxis`, composed.** It sits in the `.ob-container` content box A11's page establishes — [C5](#c5--the-roadmap-week-model-librun-plants) states that geometry once and it is **not** 12 × 100px. `.ob-week-axis { display: grid; grid-template-columns: repeat(var(--ob-plan-cols, 12), minmax(0,1fr)); }` with `--ob-plan-cols` written inline by `WeekAxis` from `planHorizon()`. **The `, 12` fallback is not optional** — an undefined custom property voids the entire declaration and you get a one-column grid with no error (pitfalls §3). Each `.ob-week-tick` draws `border-left: 1px solid var(--ob-grid)` and carries a mono 12px `--ob-dim` label `W1`…`W12`, `padding: 0 0 8px 8px`. The axis closes with a full-width `1px --ob-grid` bottom rule. Above it, the caption at `--ob-meta` `--ob-dim`, **composed from `planSpans` and never typed**: `12-WEEK HORIZON · 3 DEFINITE SPANS · 1 OPEN-ENDED`. `--ob-grid` is A0's token ([C2](#c2--foundation-ownership)); assert its value, do not declare it. **`WeekAxis` and `PlanBar` are exempt from the `Figure`-needs-a-citation rule** — they are layout derived from the plan, not marks derived from evidence. Record the exemption in the build log.
- **`PlanBar`, placed.** A real `<button>` occupying `grid-column: {span.start} / span {span.weeks ?? cols - span.start + 1}` inside `.ob-week-lanes` — A3's lane container, the same 12-column grid, four rows, `row-gap: 10px`, `margin-top: 12px`. `.ob-plan-bar` is `height: 34px; border: 1px solid var(--ob-hairline); background: var(--ob-surface); border-radius: var(--ob-r-tag); display: flex; align-items: center; padding: 0 12px;` carrying its name in mono 12px uppercase `+0.1em` `--ob-muted`. Hover raises the border to `--ob-hairline-strong` and the label to `--ob-text` over `--ob-base`; `:focus-visible` takes the accent outline with `transition: none`; click scrolls to `#step-{PHASE}` with `block: 'center'` and pulses it. **Not a pill** — 4px, chips-radius; only buttons get 999px and these are bars first. **Four bars, never five**; the tripwire is off the axis and A14's `roadmap/loading.tsx` reserves four, mirroring this grid.
- **The open-ended tail.** `.ob-plan-bar--open` keeps the solid left, top and bottom edges, sets `border-right: none`, and fades out: `mask-image: linear-gradient(to right, currentColor 0%, currentColor 55%, transparent 100%)`. `currentColor`, not a hex — a mask gradient still counts as a colour value under standing rule 2, and `styles/obsidian.css`'s marquee already carries a `#000` literal that should not be copied forward. Its label reads `LATER, AND ONLY IF` and the bar carries no right terminus at all; the tail runs to the container edge and dissolves. It is the only bar with no end, which is the whole point, and it is the visual form of `duration_weeks: null`.
- **`RoadmapStep`** — four blocks under the axis, in axis order, one per on-axis step. `.ob-plan-step { display: grid; grid-template-columns: 160px minmax(0,1fr); column-gap: 32px; padding: 40px 0; border-top: 1px solid var(--ob-hairline); }` — deliberately the same 160px gutter as A11's `.ob-oq-grid`, so the two halves of the page share one left edge. Left gutter carries `.ob-plan-span`, mono 12px `--ob-dim`, **composed from `planSpans`**: `W1–W2 · 2 WEEKS` · `W3–W6 · 4 WEEKS` · `W7–W11 · 5 WEEKS` · `W12 · ONGOING`. Right column carries the name, the subtitle, the description at `--ob-body` `--ob-muted` capped at 64ch, the `NotInItList`, and the `.ob-dep-row` — A11's class, from §12, reused and not redeclared.
- **The five names, verbatim, no substitutions:** `BEFORE YOU BUILD` · `FIRST THING TO BUILD` (subtitle *the smallest version a real user could use*, `--ob-sm` `--ob-dim`) · `THEN` · `LATER, AND ONLY IF` · `WHAT WOULD CHANGE THIS PLAN`. Headings render sentence-case through `ROADMAP_PHASE_LABEL` (already in `lib/schemas/roadmap.ts`); the bars render the uppercase mono form. **One label map, no second one.**
- **Heading levels for §02 are [C17](#c17--heading-outlines-per-route)'s.** The `02 BUILD ROADMAP` eyebrow **is** the section's `<h2>` (on a route with no separate headline the eyebrow is the heading); the four step names and the tripwire heading are `<h3>`, giving the route `h1 ×1 · h2 ×2 · h3 ×11` across A11 and A12 together. Heading *size* is set by class — `.ob-plan-name` at `--ob-h3`, `.ob-plan-name--lead` at `--ob-h2`, the tripwire at `--ob-h3` — and is independent of level. A15 asserts the count; state it in the build log so the outline check has a source.
- **The lead step's emphasis is not blue, and here is why.** Blue has three jobs — primary action, verification, live/active. "The step to build first" is none of them: it is not clicked, not verified, not live. **So the emphasis is scale and fill.** `.ob-plan-bar--lead { background: var(--ob-text); border-color: var(--ob-text); }` with its label in `--ob-canvas` — the only solid-filled bar on the axis, against three `--ob-surface` bars with hairline borders. Its step block's name renders `.ob-plan-name--lead` at `--ob-h2` where every other name is `.ob-plan-name` at `--ob-h3`. This is the same fill vocabulary the stance marks use — solid `--ob-text` is the asserted thing — and it is legible in a screenshot, under reduced motion, and in greyscale. `accentPhase` keeps its name; nothing about it is accent-coloured. **[C8](#c8--runfunnel) is the reason this matters:** the funnel's verified bar is the only accent mark in the entire figure layer, and a blue lead bar here would be the second.
- **`TripwirePanel` (D13).** `WHAT WOULD CHANGE THIS PLAN` lifts off the axis into its own band below the four step blocks, separated by a full-width `1px --ob-hairline` and 64px of padding — the floor for two distinct sections. `.ob-tripwire` is a 16px-radius panel on `--ob-surface` with a 1px `--ob-hairline`, 40px padding, capped at 920px to sit on A11's question measure. Mono label at the top, `--ob-dim`: `NOT A STEP · A TRIPWIRE`. Heading `What would change this plan` at `--ob-h3` size **and `<h3>` level**, per [C17](#c17--heading-outlines-per-route) — it is one of the route's eleven h3s, not a section heading. Then the step description, then one line at `--ob-sm` `--ob-muted`: `Two answers could invalidate this plan before you write any of it.` followed by the `.ob-dep-row` chips `Q01` `Q04` — C5's `kind: 'tripwire'` step and C6's `S05 ← Q01, Q04` edge, rendered, not retyped. It keeps `id="step-WHAT_WOULD_CHANGE_THIS_PLAN"` so A11's `ChangesLink` reverse wiring and the pulse target need no change, and it inherits `--ob-anchor-inset` from §1 like every other `main [id]` ([C2](#c2--foundation-ownership)) — **§13 writes no `scroll-margin-top`.** **It sits on the same spine as three real build steps today; a risk tripwire with a week number attached is a lie about what it is.**
- **`NotInItList` is inverted from what ships today.** `.ob-notinit` is a `Well` on `--ob-void`, 10px radius, 20px padding, mono label `NOT IN IT` at `--ob-dim`. `.ob-notinit-item` is **`--ob-body` at `--ob-text` with no `text-decoration` and no opacity reduction** — full reading weight. Today it is `--text-muted` with `line-through`, which is exactly backwards: *"the most valuable thing this section can do is tell them what not to build yet."* Strike-through belongs to `--ob-discard` and to discarded evidence ([C9](#c9--discards)), nowhere else. Four items on `FIRST THING TO BUILD`, two on `LATER, AND ONLY IF` — the `cut_list` arrays already in the fixture.
- **Thin-evidence variant.** `accentPhase` moves to `WHAT_WOULD_CHANGE_THIS_PLAN`, which is off the axis — so **no lane takes the lead fill**, and the emphasis moves onto the `TripwirePanel` instead: it renders *above* the `WeekAxis`, its label chip takes the solid `--ob-text` fill, and its heading renders at `--ob-h2` size. One added line above it, `--ob-muted`: `The web didn't have much on this, so the thing most likely to change the plan is what to watch — not what to build.` Reachable via `?thin=1`. Do not paint a lead bar under thin; naming a "first thing to build" the evidence can't support is the one judgement this product refuses to make.
- **`RoadmapExit` — the terminal state.** Today the roadmap is the last stage and offers `← Back to the report` plus a footer link, with nothing pointing at `/sources` even though `FIND THEM` cites evidence on every card. The band closes the page: a full-width `1px --ob-hairline`, 96px padding, mono label `END OF THE RUN` at `--ob-dim`, one line at `--ob-lead` in `--ob-muted` — `Nothing here is a verdict. The evidence is all still there.` — then three `.ob-btn-bare` text actions in a row separated by `.ob-rule-v` hairlines: **`Everything we checked →`** to `/r/{slug}/sources`, **`Back to the report →`** to `/r/{slug}/validate`, **`Start another idea →`** to `/`. The first is the point: it is the only link to the explorer from this page, and D16's `EvidenceButton` in the chrome is a layer, not a destination. No `.ob-btn-primary` here — A11's `Copy script` is the page's primary and standing rule 11 is per viewport.
- **Motion budget (D17).** The four `PlanBar`s enter on first paint as a `.ob-reveal` stagger, `120ms` per lane, `--ob-enter`, `--ob-ease`, blur-up — four items, inside A15's "never more than six". Nothing else moves: no parallax, no scroll-driven dimming, no per-word reveal on the step names, no drawing the axis. **No JS writes `transform` anywhere on this route** (pitfalls §4; A15 greps for it). Under reduced motion the reveal resolves to the end state via §16's blanket plus its explicit `.ob-reveal` end state; there is no JS sequence on this half, so nothing needs a second branch.
- **Pulse parity.** `.ob-plan-step[data-pulse]` and `.ob-tripwire[data-pulse]` reuse **A11's `@keyframes ob-app-pulse`** against `border-top-color` / `border-color` respectively — same 600ms, same `--ob-ease`, same `--ob-hairline-accent`, same live/active justification, same absent→present restart via `requestAnimationFrame` in `RoadmapProvider`. **§13 declares no `@keyframes` of its own.** The `ob-app-` prefix is [C1](#c1--stylesobsidian-appcss-the-section-map)'s rule and exists because `@keyframes ob-pulse` in `styles/obsidian.css:368` is the 2.4s live dot; redeclaring that name in this file kills it app-wide with no error. Grep the name across `styles/*.css` before adding any keyframe here. Record `.ob-plan-step[data-pulse]` and `.ob-tripwire[data-pulse]` in the build log so A15's §16 reduce-block diff catches them.
- **§13's complete class list**, closed, for A15's diff: `.ob-plan` · `.ob-plan-step` · `.ob-plan-span` · `.ob-plan-name` · `.ob-plan-name--lead` · `.ob-plan-sub` · `.ob-plan-bar--lead` · `.ob-plan-bar--open` · `.ob-tripwire` · `.ob-tripwire-label` · `.ob-tripwire-note` · `.ob-notinit` · `.ob-notinit-item` · `.ob-exit` · `.ob-exit-label` · `.ob-exit-line` · `.ob-exit-actions`. Everything with a `.ob-week-*` or bare `.ob-plan-bar` / `.ob-plan-lane` prefix belongs to §4 and is A3's.

**Exit test:** With `next dev` running and the **Playwright MCP** at 1440×900, load `/r/sms-rebooking-4f2a/roadmap` and scroll to `02 BUILD ROADMAP`. **(1) The grid resolved:** parse `getComputedStyle(document.querySelector('.ob-week-axis')).gridTemplateColumns` — it must be **twelve** values, not one (a single track proves `--ob-plan-cols` did not resolve), their spread `max − min` must be under 0.5px, and their sum must equal the axis's own content width. **Do not assert `100px`** — per [C5](#c5--the-roadmap-week-model-librun-plants) the content box is 1120px and the tracks are 93.33px. **(2) Ratios, not pixels:** let `M` be `.ob-week-lanes`'s content width; for each `.ob-plan-bar`, `width / M` must equal `2/12`, `4/12`, `5/12`, `1/12` and `(left − laneLeft) / M` must equal `0`, `2/12`, `6/12`, `11/12`, each within **0.5%**. The same assertions must hold unchanged at 1280 — that is what makes them ratios. **(3) Four bars:** `document.querySelectorAll('.ob-plan-bar').length === 4`, and `#step-WHAT_WOULD_CHANGE_THIS_PLAN` is **not** a descendant of `.ob-week-lanes`. **(4) Lead emphasis:** `getComputedStyle('.ob-plan-bar--lead').backgroundColor` is `rgb(244, 244, 245)` and its label `rgb(10, 10, 11)`; **no element inside `.ob-week-lanes` computes `rgb(45, 127, 249)` on `color`, `backgroundColor` or any border colour.** **(5) The open tail:** `.ob-plan-bar--open`'s `maskImage` is a gradient, not `none`, and its `borderRightWidth` is `0px`; assert `document.querySelectorAll('.ob-plan-bar-conditional').length === 0` — the removed A3 class must leave no residue. **(6) NotInIt:** `.ob-notinit-item`'s `textDecorationLine` is `none` and its `color` is `rgb(244, 244, 245)`. **(7) Wiring, both directions, real clicks:** click the `Q06` chip on `BEFORE YOU BUILD` and sample `#question-Q06`'s `dataset.pulse` and `borderTopColor` six times at 120ms — the attribute must appear then disappear and the colour must pass through `rgba(45, 127, 249, 0.42)`; then click `▸ What would change this plan` on Q01's `Changes:` row and sample `#step-WHAT_WOULD_CHANGE_THIS_PLAN` the same way, confirming its heading lands clear of the 56px sticky header. Click a `PlanBar` and confirm it scrolls to and pulses its own step block. **(8) The live dot survived:** `getComputedStyle(document.querySelector('.ob-dot')).animationDuration` is still `2.4s` on this route — the measurement that catches an unprefixed keyframe reaching `ob-pulse`. **(9) Anchor inset:** `getComputedStyle(document.querySelector('#step-BEFORE_YOU_BUILD')).scrollMarginTop === '136px'`, identical on every `main [id]`. **(10) Thin:** load `?thin=1` and assert zero `.ob-plan-bar--lead` elements exist and `.ob-tripwire` precedes `.ob-week-axis` in document order. **(11) Exit band:** tab from the last `PlanBar` through the `RoadmapExit` links with real key presses, reading `outline` off `document.activeElement` at each stop — every one shows an accent indicator, none is mid-transition, and `Everything we checked →` resolves to `/r/sms-rebooking-4f2a/sources`. **(12) Reduced motion:** emulate `reducedMotion: 'reduce'`, reload, and confirm every `.ob-reveal` lane reads `opacity: 1` and `transform: none` and every element under `.ob-plan` reports `animationName: 'none'`; reset to `no-preference`. **(13) No shift:** measure `.ob-plan`'s `getBoundingClientRect().height` before and after the reveal completes — identical. **(14) Outline:** `[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.tagName)` over the whole route is one `H1` and eleven `H2`, no `H3`. Repeat every layout read at **1280**. Then, per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at 1440 **and** 1280.

---

## A13 — Sources: the Evidence Explorer

**Goal:** `/r/[slug]/sources` stops being a 68ch list in a 1360px page and becomes the **`EvidenceExplorer`** — a 2-up run band, a 260px `FacetRail` with six live-counted facet groups, and one uniform 140px row per record across all **65** records, verified and discarded together. Implements **D15** and the destination half of **D16**. When this phase is done, a user can answer "where did this evidence come from, how recent is it, what argues against, and what did the report leave out" without reading a single mono domain string.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md`, `references/pitfalls.md`, `references/verification.md`, `WebsiteLayoutDesc/09-pages-supporting.md`, `WebsiteLayoutDesc/12-states.md`. Plus, in the plan spine: [C1](#c1--stylesobsidian-appcss-the-section-map), [C2](#c2--foundation-ownership), [C3](#c3--vocabulary-maps-one-home-libschemasevidencets), [C8](#c8--runfunnel), [C9](#c9--discards), [C10](#c10--the-analytics-api-frozen-in-a1), [C12](#c12--shared-class-names), [C13](#c13--ownership-of-things-two-phases-both-wanted), [C14](#c14--every-exit-test-ends-the-same-way).

**Build:**
- `app/r/[slug]/sources/page.tsx` — rewritten. Server. `Promise.all([getEvidence(slug), getDiscarded(slug), getReport(slug), getRunSummary(slug)])`. **`getDiscarded` is wired here per [C9](#c9--discards)** — A1 created it, A4's layout is the other call site, and this page is where the 18 records reach the screen. Parses `searchParams` into `initialFacets` via `parseFacetParams`, derives `citedIds` from `citedFindingIds(report)` ([C10](#c10--the-analytics-api-frozen-in-a1)), renders `<AppBackdrop variant="sources" />` as its first child ([C13](#c13--ownership-of-things-two-phases-both-wanted)), then `<RunBand />` (server) and `<EvidenceExplorer />`. Adds `getReport` to this page's reads — it did not load the report before, and the `IN THE REPORT` facet requires it.
- `app/r/[slug]/sources/loading.tsx` — rewritten to the shipped shape, so **A14 has nothing to re-derive**: the `01 THE RUN` band frame reserving `FIG_H.funnelExpanded` / `FIG_H.reasonBreakout` / `FIG_H.domains(...)` — **190 / 140 / 396 on this fixture, read from the constants A3 exports and never typed in** — a 260px rail block carrying the **six real legends** (`DIMENSION` `STANCE` `STATUS` `IN THE REPORT` `DOMAIN` `WHEN`) as live text, and ten `.ob-src-skeleton` rows at exactly 140px. Its current markup emits `.finding-row`, a class this page no longer uses. **A14 owns the state-matrix audit (R20); A13's job is to leave a skeleton A14 only has to measure.**
- `components/validate/explorer/evidence-explorer.tsx` — `'use client'`. The one client island: facet state, URL sync, sort, derived counts, drawer scope. Props `{ slug, evidence, discarded, citedIds, summary, initialFacets }`. `citedIds` crosses the boundary as `string[]` and the island rebuilds the `Set` — a `Set` prop is serialisable in React 19 but the array is one less thing to be right about.
- `components/validate/explorer/facet-rail.tsx` — `{ counts: FacetCounts, domains: DomainFacet[], state: FacetState, onToggle: (group: FacetGroup, value: string) => void, onClear: () => void }`.
- `components/validate/explorer/evidence-row.tsx` — `EvidenceRow`, `{ finding: Finding; citationNumber: number; cited: boolean; index: number; onOpen: () => void }`. ***Add to the naming contract.*** [C13](#c13--ownership-of-things-two-phases-both-wanted) is explicit that `EvidenceRow` is built **alongside** `FindingCard`, which keeps all three of its variants — **A13 deletes no variant.**
- `components/validate/explorer/discard-row.tsx` — `DiscardRow`, `{ record: DiscardedFinding; index: number; onOpen: () => void }`, per [C9](#c9--discards).
- `components/validate/explorer/run-band.tsx` — `RunBand`, the `01 THE RUN` composition. **Server component.** ***Add to the naming contract.***
- `components/figures/run-funnel.tsx`, `components/figures/domain-concentration.tsx` — **A3 owns these components and their geometry.** A13 owns their data, captions, placement and reserved heights, and passes `variant="expanded"` / a `limit`. A13 amends neither one's fills.
- `lib/explorer-facets.ts` — pure. `FacetState`, `FacetGroup`, `FacetCounts`, `DomainFacet`, `parseFacetParams`, `serializeFacetParams`, `applyFacets`, `facetCounts`, `domainFacets`, `quarterOf`, `sortRecords`. **Addition to the naming contract; log it.**
- `lib/content/app.ts` — the `sources` copy block, every string below. **No label map goes here** ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)).
- `styles/obsidian-app.css` **§14 `EVIDENCE EXPLORER`** — the section A0 banner-stubbed and A13 alone fills ([C1](#c1--stylesobsidian-appcss-the-section-map)). The section number is fixed and does not float; there is no "next free integer".
- `tests/unit/explorer-facets.test.ts` — new.
- **Delete** `components/validate/sources-list.tsx`, superseded by `EvidenceExplorer`. Its recipe classes die with `styles/components.css` in A15. A5's R13 proof, written against `SourcesList`'s `Money (13)` pill, moves onto the explorer's `Money` facet — note the migration in the build log.

**Notes:**

*Page head and spine*
- h1 `Everything we checked.` at `--ob-h1`, `--ob-text`. Lead `47 excerpts passed the check. 18 didn't. All of it is here.` at `--ob-lead`, `--ob-muted`. Back control `.ob-btn-bare`, copy `← Back to the report`, → `/r/${slug}/validate`.
- Two bands, each an `.ob-eyebrow` numeral in chalk (never blue) over a real sentence `<h2>`: `01 THE RUN` / `How the evidence was gathered.` on `#the-run`; `02 EVERYTHING WE CHECKED` / `Every record, verified and discarded.` on `#everything-we-checked`. Under the second h2, one sub-line at `--ob-body`/`--ob-muted`: `Every excerpt the run touched, verified and discarded, newest first.`
- **Anchor offset is not A13's.** `--ob-anchor-inset` is declared and applied by exactly one rule in §1 ([C2](#c2--foundation-ownership)); A13 writes no `scroll-margin-top`, on these two ids or anywhere else.
- **The page's heading outline is `h1 ×1 · h2 ×2 · h3 ×6`** — the six h3s are the facet legends (below). Record it in the build log; A15 §4 audits `/sources` against exactly this and should not have to guess.
- Page closes with `.ob-src-foot`: mono `END OF THE EVIDENCE · 65 RECORDS` and the page's single `.ob-btn-primary`, `What to do next →` → `/r/${slug}/roadmap`. The page currently dead-ends; it now points forward.
- **Sources stays out of the `StageRail`** (D16). The header's `EvidenceButton` (A4) is the way in from other routes and it **opens `EvidenceOverlay`** ([C16](#c16--evidencebutton-opens-an-overlay-sources-stays-a-route)) — while `/r/[slug]/sources` stays a real, linkable route rendering the same `EvidenceExplorer` inside `RunShell` instead of inside the dialog. One component, two frames. A13 guarantees `?dim=…` and `#the-run` land correctly so A10 can deep-link `/r/${slug}/sources?dim=MONEY` from a dimension section.

*`01 THE RUN` — the band*
- `.ob-run-band` is `display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 64px; align-items: start;` inside `--ob-container-app`, above the rail/list grid and separated from it by a `.ob-rule`. Left column is a `.ob-run-col` (`display: flex; flex-direction: column; gap: 24px`); right column is the domain figure.
- **`RunFunnel` renders in both homes and A13 deletes nothing** ([C8](#c8--runfunnel)). The report keeps `variant="compact"` in §02's aside; `/sources` §01 owns the **expanded** version with the discard-reason breakout attached to it. Do not restate the axis rule, the fills or the accent here — C8 settles all three, including that the funnel's verified bar is the only accent mark in the figure layer in either home. A13 passes `height={FIG_H.funnelExpanded}` — **the constant A3 exports, never a literal; A3 is explicit that a typed number is how the zero-shift contract breaks** — caption `THE RUN`, and `source={{ label: 'ALL 65 RECORDS', href: '#everything-we-checked' }}`.
- Under the funnel, one line at `--ob-sm`/`--ob-muted`: `Every excerpt is kept, including the 18 that failed the check. Each carries the reason it was dropped.`
- **The discard-reason breakout** sits directly beneath the funnel's `18 DISCARDED` bar, sharing its origin so the four reasons read as a decomposition of that one bar rather than a second population. It is **not a new mark** — A3's figure kit is closed and A13 invents nothing in it. It is a `<dl class="ob-discard-reasons">` inside an A3 `Figure`: four `.ob-discard-reason-row`s, hairline-separated, `grid-template-columns: minmax(0,1fr) 44px`. Reason sentence left in **sans `--ob-sm` `--ob-muted`**, rendered through `DISCARD_REASON_LABEL` ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)); count right in mono `--ob-meta`/`--ob-text`. Counts are the distribution in [C9](#c9--discards) — **7 · 5 · 3 · 3** — read from the fixture, never typed in. Caption `WHY 18 WERE DROPPED`, `height={FIG_H.reasonBreakout}`, `source={{ label: 'SHOW THE 18', href: '?status=discarded' }}`. No bars: four sentences with counts is the clearest possible read of eighteen records, and a bar chart of 7/5/3/3 beside a funnel that deliberately doesn't sum to a whole would teach the reader the wrong ruler.
- `DomainConcentration` — caption `WHERE IT CAME FROM`, sub-line `47 VERIFIED FINDINGS · 31 URLS · 29 DOMAINS · LARGEST SUPPLIES 5`, `height={FIG_H.domains(rows.length, tailCount)}` — again the exported helper, not a literal. A13 passes the full `domainConcentration(evidence)` array ([C10](#c10--the-analytics-api-frozen-in-a1)) with a `limit` that draws every domain with **≥2 verified findings — 13 rows** — plus A3's remainder row, whose label A13 supplies as `16 domains, one finding each`. A3 owns the row geometry, the truncation rule and the bar fill; A13 owns the data and the words.
- **Verified distribution, computed from the fixture — derive it, never hardcode it:** `capterra-like.example` 5 · `billingtalk.example` 3 · `smallpracticeforum.example` 3 · then **ten** domains at 2 (`app-marketplace`, `dentalfrontdesk.forum`, `dentalhrforum`, `dentalofficemgrs`, `g2reviews`, `hygienetalk`, `investorletter`, `openpms`, `pmsvendorblog`, `softwarematch`) · then **sixteen** at 1. Totals: 29 domains, 47 findings. `r07.md` §7's "24 of 29 domains appear exactly once" and "capterra supplies 5 of the 11 What exists findings" are both **wrong** — the true figures are 16 of 29, and capterra supplies 3 of the 11 `WHAT_EXISTS` plus 2 `MONEY`. A1's `evidence-stats.test.ts` already asserts the real distribution; A13 asserts nothing new about it.
- **The figure is not interactive, and that is deliberate.** Filtering lives on `[aria-pressed]` controls in the rail, never on a figure fill ([C8](#c8--runfunnel)); a domain bar that toggled would need a pressed treatment inside the one layer the plan keeps free of accent, and would drag `components/figures/*` — server components, all of them (A3) — into the client island for one click target. The figure's `source` link is `{ label: 'FILTER BY DOMAIN', href: '#facet-domain' }`, which moves focus to the `DOMAIN` group where the toggling actually is. `RunBand` therefore stays server-rendered and the client boundary stays on the list.
- **Nothing in this band animates.** A3's rule stands: no figure animates a value, and D17's count-ups live on the run header (A4). The only motion on `/sources` is the row stagger below.

*Layout*
- `.ob-explorer { display: grid; grid-template-columns: var(--ob-src-rail) minmax(0,1fr); gap: 64px; }` inside `--ob-container-app`. Locals declared on `.ob-explorer`: `--ob-src-rail: 260px; --ob-src-row-h: 140px;`. **These are component-scoped custom properties, not tokens — A13 declares no token and adds no colour** ([C2](#c2--foundation-ownership)).
- Measured content widths: list column **1036px at 1440**, **876px at 1280** (`1360 − 260 − 64`; `1200 − 260 − 64`). Row text column = list − 460px fixed = **576px / 416px**.
- `.ob-rail { position: sticky; top: calc(var(--ob-header-h-condensed) + 24px); max-height: calc(100vh - var(--ob-header-h-condensed) - 48px); overflow-y: auto; }`. The domain group gets its own `max-height: 240px; overflow-y: auto` so a long ranked list doesn't dominate the rail. This `top` can honestly reference the token because **A4 made the header actually sticky (R9)**.

*`FacetRail` — markup, groups, exact counts*
- The rail is a `<nav aria-label="Filter the evidence">` containing six `<section class="ob-facet-group" aria-labelledby="…">`, each led by an `<h3 class="ob-facet-legend">` in mono `--ob-meta`/`--ob-dim`/`--ob-tracking-meta`. Real headings, because a filter rail is a landmark a screen-reader user navigates by; this is the markup A15 §4 expects to find. Every facet is a `<button class="ob-facet" aria-pressed>` with `.ob-facet-label` left and `.ob-facet-count` right. Not checkboxes, not pills — **nothing but a button has a pill radius, and these are 4px `--ob-r-tag`.**
- **Dimension words come from `DIMENSION_SHORT`** ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)) — the rail is a compact context. Stance words come from `STANCE_LABEL`, so the enum value `challenges` renders `Contests`. A13 defines no local label map; the deleted `DIMENSION_FILTER_LABEL` in `sources-list.tsx` was the third of R14's three vocabularies and it goes with the file. Mono uppercase is `text-transform: uppercase` in CSS, never a second string table.

| Legend | Facets and this fixture's counts | Scope |
|---|---|---|
| `DIMENSION` | Problem 19 · Exists 15 · Demand 10 · Money 17 · Practical 4 | all 65 |
| `STANCE` | Supports 25 · Neutral 15 · Contests 7 | verified only |
| `STATUS` | Verified 47 · Discarded 18 | all 65 |
| `IN THE REPORT` | Cited 24 · Not cited 23 | verified only |
| `DOMAIN` | ranked domains with ≥2 records + `One record only` | all 65 |
| `WHEN` | Q1 2025 · Q2 2025 · Q3 2025 · Q4 2025 | all 65 |

- **Every group states its scope and the scope is enforced, not implied.** `DIMENSION`, `STATUS`, `DOMAIN` and `WHEN` span all **65** records; `STANCE` and `IN THE REPORT` span the **47** verified only. The dimension counts are the verified `14 · 11 · 7 · 13 · 2` plus the discard distribution in [C9](#c9--discards) (`PROBLEM 5 · WHAT_EXISTS 4 · DEMAND_SIGNALS 3 · MONEY 4 · PRACTICAL 2`), which is exactly why A1 authored that distribution. **`Practical 4` against `Practical 2` verified is the number that makes a thin dimension visible** — Practical discarded as much as it kept, and a rail scoped to 47 would hide the one fact worth seeing.
- **`WHEN` is derived over all 65 and never typed in.** `quarterOf(source_date)` buckets both corpora; the four counts sum to 65, and restricted to the verified subset they are `9 · 12 · 13 · 13`. A1 does not pin the discards' quarter distribution and A13 does not invent one — whatever the 18 `source_date`s are, the rail reports them.
- **`DOMAIN` is derived over all 65**, ranked descending by count then hostname, every domain with ≥2 records listed, everything else collected into one `One record only` bucket. A1 authored three deliberate kept/discarded collisions (`capterra-like.example`, `smallpracticeforum.example`, `openpms.example`) precisely so this facet shows a domain with both — so those three read higher here than their bar in the figure beside it, and the delta is the discards. Say so in the group's `.ob-facet-note`: `COUNTS INCLUDE DISCARDS`.
- **Interaction model: OR within a group, AND across groups.** Multi-select everywhere. No group has an "All" control; zero selections in a group means that group imposes no constraint. Default state is **no facets active — all 65 records**, discards interleaved by date. That default is the page's whole argument: you scroll and hit a struck-through row in situ.
- **Counts are computed against the result set filtered by every group *except their own.*** Worked example the exit test asserts: with `Money` selected, the `DIMENSION` counts stay `19 · 15 · 10 · 17 · 4` while `STANCE` recomputes to `Supports 4 · Neutral 6 · Contests 3` (Money's 13 verified) and `WHEN` recomputes over Money's 17 records. Selecting a facet must never zero its siblings.
- A facet whose count is 0 renders `.ob-facet--empty` — `--ob-dim`, `disabled`, `aria-disabled` — and is **never hidden.** Hiding a facet makes the rail jump and destroys the no-layout-shift guarantee.
- **Selecting anything in `STANCE` or `IN THE REPORT` removes all discards from the result.** A discarded excerpt takes no position on anything and was never available to cite. The rail shows `.ob-facet-note` beneath the group, mono `--ob-meta`/`--ob-dim`: `DISCARDS EXCLUDED — A DISCARDED EXCERPT HAS NO STANCE`. `DiscardedFinding` carries no `stance` field at all ([C9](#c9--discards)), so this is a filter rule, not a value the explorer has to ignore.
- Rail head: `Clear all` (`.ob-rail-clear`, `.ob-btn-bare`) when ≥1 facet is active, otherwise the mono line `NO FACETS · 65 RECORDS`. The block is fixed-height so swapping one for the other shifts nothing.
- **Cited/uncited is derived, never hardcoded** — `citationCoverage(report, evidence)` and `citedFindingIds(report)` from [C10](#c10--the-analytics-api-frozen-in-a1). `cited.size + uncited.size === 47` is an invariant the test asserts. If A9/A10's `EvidenceState` band adds cited prose, the count moves and that is correct.
- **This facet is the reason the page exists.** The console spends 45 seconds proving the run found 47 things and the report shows you 24. `Not cited (23)` is the one control in the product that surfaces the other half.
- **`.ob-facet[aria-pressed='true']` is where blue lives on this page** — job three, live/active state: `color: var(--ob-accent)`, `border-color: var(--ob-hairline-accent)`, `background: var(--ob-accent-wash)`. Besides focus rings and the single `.ob-btn-primary` in the foot, the only other accent on `/sources` is the funnel's verified bar ([C8](#c8--runfunnel)).

*Facet state lives in the URL — decided*
- A page whose entire access model is a shareable URL should have a shareable filtered view. Params, all optional, all omitted when their group is empty: `dim` (enum values, comma-joined) · `stance` (`supports,challenges,neutral` — **enum values, not display labels**) · `status` (`verified,discarded`) · `cited` (`yes,no`) · `domain` (hosts; the singleton bucket is the literal token `__tail`) · `q` (`2025Q1`…`2025Q4`) · `sort` (omitted when `newest`).
- Initial state is parsed **on the server** from `searchParams` and passed as `initialFacets` — so a deep link is correct on first paint with no flash. Updates are written client-side with `window.history.replaceState`, not `router.replace`: no server round-trip, no `useSearchParams`, therefore no `<Suspense>` boundary and no re-render storm. Verify the exact API against `node_modules/next/dist/docs/` before writing it.
- `parseFacetParams` / `serializeFacetParams` round-trip losslessly and drop unknown values silently rather than throwing — a hand-edited URL must degrade, not 500.

*Rows — exact anatomy*
- `.ob-src-list` is a `<ul>`; each row is an `<li class="ob-src-row">`. `display: grid; grid-template-columns: 56px 132px minmax(0,1fr) 200px; column-gap: 24px; padding: 18px 0; border-bottom: 1px solid var(--ob-hairline); min-height: var(--ob-src-row-h); position: relative;`
  1. **56px `.ob-src-num`** — `[03]` mono `--ob-meta`, colour `--ob-dim`. **Not blue** — a citation number here is neither an action, nor verification, nor live. It is legal outside running prose ([C12](#c12--shared-class-names)); the bracket monopoly is scoped to `.ob-prose` / `.ob-report-prose`. Below it `.ob-src-cited`, mono `--ob-meta`/`--ob-muted`, reading `CITED` when the report cites it and rendering nothing when it doesn't. 47 rows shouting `NOT CITED` is noise; the facet does the counting.
  2. **132px `.ob-src-class`** — `.ob-src-dim` renders `DIMENSION_SHORT[dimension]` in mono `--ob-meta`, `--ob-dim`, `text-transform: uppercase`, `letter-spacing: var(--ob-tracking-meta)`. Below it `.ob-src-stance`, which renders A5's `<StanceMark stance={…} />` — mark plus word, no local marks and no third spelling. The three fills are `.ob-stance-supports` / `-neutral` / `-contests`, defined once in §4 by A3, and `.ob-stance-mark` is A5's ([C12](#c12--shared-class-names)). **The word always accompanies the mark.**
  3. **1fr `.ob-src-body`** — `.ob-src-text` at `--ob-body`/`--ob-text`, clamped to 2 lines; then `.ob-src-excerpt` at `--ob-sm`/`--ob-muted`, clamped to 2 lines, with a 1px `--ob-hairline-strong` left rule at 12px padding. Both clamps via `display:-webkit-box; -webkit-line-clamp; overflow:hidden`. **The excerpt is untruncated today, so rows run 90–160px with no rhythm; the full verbatim excerpt now lives in the `EvidenceDrawer`, which the row opens.**
  4. **200px `.ob-src-meta`** — `.ob-src-domain` and `.ob-src-date` in mono `--ob-meta`/`--ob-dim`, then `.ob-src-out`, the `↗` anchor to `source_url`, `target="_blank" rel="noopener noreferrer"`.
- **Every row is exactly 140px.** Verified content box = 2×25.6 + 8 + 2×22.4 = 104, plus 36px padding. That uniformity is the fix for the current list's total absence of rhythm and it makes the layout-shift assertion trivial. If a measured value differs, correct `min-height` — **the invariant is that all 65 rows are identical, not the number 140.**
- **R12 — no `role="button"` on a div containing an `<a>`.** The row carries no role. `.ob-src-open` is a real `<button>` wrapping the leading text with `::after { content:''; position:absolute; inset:0; }` stretching the hit target over the row; `.ob-src-out` gets `position: relative; z-index: 1` so it stays separately clickable and separately tabbable. Accessible name: `Open evidence for finding {n}` on a verified row, `Open discarded record {id}` on a discard. Tab order per row is button → anchor. `document.querySelectorAll('[role="button"] a').length` must be 0, discards included.

*`DiscardRow` (D15)*
- The 18 discards are records, not a footnote — id, dimension, the excerpt that failed, the query that found it, source URL, date, and `discard_reason`, from A1's fixture. They interleave with verified rows in the default view, sorted by the same key. **Seeing a discard land between two verified findings, mid-scroll, is the trust claim.** A grey sentence under a divider after 47 rows of scrolling is not.
- **A `DiscardedFinding` has no `text` field and none is added** ([C9](#c9--discards)) — the excerpt never became a finding, so there is no claim to render and none is invented. The row leads with the struck excerpt.
- `.ob-src-row--discarded`, column by column: **(1)** no citation number — it was never admitted to the corpus — a 1px × 20px `--ob-discard` tick instead; **(2)** `DISCARDED` in mono `--ob-discard`, and no stance mark; **(3)** `.ob-src-excerpt` first, at `--ob-body`, `color: var(--ob-discard)`, `text-decoration: line-through; text-decoration-color: var(--ob-discard); text-decoration-thickness: 1px`, clamped to 2 lines — it is the thing that failed, so it stays the largest element in the row; then `.ob-src-reason`; then `.ob-src-query`, sans `--ob-sm`/`--ob-dim`, reading `Found by: “{attempted_query}”`, one line, clamped — A1 asserts every one of these is one of the 19 `RUN_QUERIES` and this is where that assertion becomes visible; **(4)** the same domain / date / `↗` block as a verified row.
- **`.ob-src-reason` is sans at `--ob-sm` in `--ob-muted`, and only the `DISCARDED — ` prefix is mono `--ob-discard`** ([C9](#c9--discards)). It renders `DISCARD_REASON_LABEL[discard_reason]` — the sentence, never the enum key ([C3](#c3--vocabulary-maps-one-home-libschemasevidencets)). Two reasons for this, and both are load-bearing: `--ob-discard` measures 2.25:1 on canvas and is deliberately illegible, so setting the one string D15 exists to surface in it would defeat the feature; and the labels are sentences with verbs in them, which the mono meta layer does not carry. A15 §5 rules the same way; this note exists so it cannot drift back.
- Content height: 2×22.4 + 8 + 22.4 + 6 + 22.4 ≈ 104. The design law says a discarded thing drops 6px, but in a hairline-ruled list a `translateY` would break the rule rhythm, so **the content drops, not the row**: `padding: 23px 0 11px` — 6px lower, netting the same 140px. Hairlines stay on the grid.
- **Never red. There is no red in this system.** The exit test asserts it across every computed `color` and `background-color` in the list.
- **A discard row opens the drawer** ([C9](#c9--discards)). It is the natural place to read the whole failed excerpt and its reason, and A5 already built the *Discarded* body layout for it. The row calls `openById(record.id)`; A5's provider resolves a `DS_*` id to `{ kind: 'discarded' }`. A5's example MetaLine reads `DQ_07`; A1's ids are `DS_01`–`DS_18` — if that typo survives into A5's shipped drawer, fix it on the spot rather than logging it.

*Sorting — and the misleading header sentence*
- `.ob-sort` is five mono `.ob-sort-btn`s: `NEWEST` · `OLDEST` · `DIMENSION` · `STANCE` · `NUMBER`. Active gets `.ob-sort-btn--on` (`--ob-text` + a 1px underline rule), not blue. **Default `NEWEST`** — `source_date` descending, ties broken by record id ascending, always deterministic.
- Two sorts need a stated rule for records that lack the key, and both get one: under `STANCE`, discards sort into their own trailing block by id (they have no stance); under `NUMBER`, discards follow all 47 verified, ordered by `DS_` id ascending (they have no citation number). Neither is dropped, and no comparator ever returns 0 for two different records.
- `.ob-src-count`, mono `--ob-meta`/`--ob-muted`, `aria-live="polite"`, exact template `SHOWING {n} OF {total} · {sortLabel}` with `sortLabel` ∈ `NEWEST FIRST` / `OLDEST FIRST` / `BY DIMENSION` / `BY STANCE` / `BY NUMBER`. `total` is always 65, the corpus, never the current scope. Default reads `SHOWING 65 OF 65 · NEWEST FIRST`.
- **This kills "Every finding that passed the check, in the order it was verified."** That sentence is literally true and practically a lie: the array is grouped by dimension, dates zigzag backwards inside each block, and a reader infers either a ranking or a chronology and gets neither. The new line describes exactly what is on screen and changes when the screen does.

*Motion — R17*
- Today all 47 rows fire `message-in 320ms` simultaneously on mount **and again on every filter change.** Replace with: `.ob-src-list[data-entrance='on'] .ob-src-row { animation: ob-app-src-row-in var(--ob-base) var(--ob-ease) both; animation-delay: var(--ob-src-delay, 0ms); }`, keyframes `from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none }`. **The `ob-app-` prefix is mandatory** ([C1](#c1--stylesobsidian-appcss-the-section-map)) — a duplicate `@keyframes` name in this file silently replaces the one in `obsidian.css` on every route, with no error.
- Delay is set inline as `style={{ '--ob-src-delay': `${Math.min(index, 11) * 24}ms` }}` — **capped at 12 rows / 264ms**, and rows past the cap take the cap's delay so they arrive *with* row 12, never before it. Total entrance 264 + 320 = 584ms, well inside the D17 structural band.
- `data-entrance` starts `on` and an effect flips it to `off` after 600ms. **Nothing animates on a facet change, ever.** Keyed by record id, so React reuses nodes anyway; the flag makes it deterministic rather than incidental.
- Reduced motion goes in **§16, the single app-side reduce block** ([C1](#c1--stylesobsidian-appcss-the-section-map)) — not a second `@media` in §14, and not `styles/obsidian.css`. A13 leaves that section complete for its own selectors and A15 finalises it: `.ob-src-row { animation: none; opacity: 1; transform: none; }` — **resolves to the end state, does not merely stop.** JS drives no motion here (it sets an attribute), so no JS branch is required; note that in the build log so a reviewer doesn't flag rule 16.

*Drawer scope — R13*
- The drawer's `←`/`→` walk the full 47-item corpus today, ignoring the filter, with no position readout. `EvidenceExplorer` calls A5's **`setScope(visibleRecordIds)`** in an effect whenever the visible set changes — every visible record in rendered order, verified and discarded — and `setScope(null)` on unmount so every other route gets the full corpus back. `next`/`prev` index into `scope`, so the walk is exactly the list on screen ([C9](#c9--discards)).
- **The readout is A5's and A13 does not restate it.** A5's `.ob-drawer-pos` prints `3 of 47` unscoped and `3 of 14 · FILTERED` when `position.filtered` is true; A5's `filteredSuffix` string is the single source. Prev is disabled at the first record, Next at the last — no wrapping. A5 also owns the guard for a chip opened from prose while a filter is live.
- A5's `←`/`→` handler already bails when the event target is an input, textarea or contenteditable, which is what keeps arrow keys from paging the drawer while the rail has focus.

*Empty result*
- `.ob-src-empty`, no illustration, no toast: `Nothing matches this combination.` at `--ob-h3`, then a mono line naming the active facets separated by ` · ` (e.g. `MONEY · CONTESTS · Q1 2025`), then `.ob-btn-ghost` `Clear all facets`. The whole-run zero case (unreachable with this fixture) keeps its honest branch, restyled: `Nothing passed the check for this run.` plus the roadmap link. **These two strings live in `lib/content/app.ts` under the `sources` block and are the only copies** — A14's skeleton and empty-state work reads them rather than writing its own.

*`styles/obsidian-app.css` §14 — the class list*
`.ob-run-band` `.ob-run-col` `.ob-discard-reasons` `.ob-discard-reason-row` `.ob-discard-reason-label` `.ob-discard-reason-count` · `.ob-explorer` `.ob-rail` `.ob-rail-clear` `.ob-facet-group` `.ob-facet-legend` `.ob-facet` `.ob-facet-label` `.ob-facet-count` `.ob-facet--empty` `.ob-facet-note` · `.ob-sort` `.ob-sort-btn` `.ob-sort-btn--on` `.ob-src-count` · `.ob-src-list` `.ob-src-row` `.ob-src-row--discarded` `.ob-src-num` `.ob-src-cited` `.ob-src-tick` `.ob-src-class` `.ob-src-dim` `.ob-src-stance` `.ob-src-body` `.ob-src-open` `.ob-src-text` `.ob-src-excerpt` `.ob-src-reason` `.ob-src-query` `.ob-src-meta` `.ob-src-domain` `.ob-src-date` `.ob-src-out` · `.ob-src-empty` `.ob-src-foot` `.ob-src-skeleton`. One `@keyframes ob-app-src-row-in`. No token declarations, no colour values, no second `--ob-anchor-inset` rule, no reduce block.

*Handed on*
- **This segment has no `error.tsx`** — roadmap has one, sources doesn't, so a `getEvidence`/`getDiscarded`/`getReport` failure falls through to the app boundary and loses the `RunShell` chrome. **A14 builds `app/r/[slug]/sources/error.tsx`** matching the roadmap's shape with the copy `Couldn't load the evidence.` / `Try again` / `Back to the report`.
- A14 also owns the R20 audit of `sources/loading.tsx`. The shape it must match is the one built here: six facet legends by name, 260px rail, ten 140px rows, and the band's three reserved mark heights (`FIG_H.funnelExpanded` / `FIG_H.reasonBreakout` / `FIG_H.domains(...)` = 190 / 140 / 396). Record all of it in the build log.

*Tests*
- `tests/unit/explorer-facets.test.ts`: param round-trip; unknown values dropped not thrown; OR-within / AND-across semantics; counts exclude their own group; dimension counts over 65 are `19 · 15 · 10 · 17 · 4` and their verified subset is `14 · 11 · 7 · 13 · 2`; `Money ∩ contests === 3`; `Money ∩ contests ∩ Q3 === 2`; selecting any `STANCE` or `IN THE REPORT` facet yields a result set with zero `DS_` ids; quarter buckets sum to 65 and their verified subset is `[9,12,13,13]`; domain facets sum to 65 and `capterra-like.example`, `smallpracticeforum.example` and `openpms.example` each exceed their verified count; `cited.size + uncited.size === 47`; all five sorts total-order deterministically over the mixed 65 with no comparator returning 0 for distinct records.

**Exit test:** Run `next dev` and drive `/r/sms-rebooking-4f2a/sources` with the **Playwright MCP** at 1440 and 1280, measuring computed values throughout — no screenshot is evidence here. Measure `getComputedStyle(document.querySelector('.ob-explorer')).gridTemplateColumns` — first track exactly `260px`; measure the list column's `getBoundingClientRect().width` as **1036** at 1440 and **876** at 1280. In `#the-run`, assert the three `.ob-fig-mark` heights are exactly **176**, **140** and **424**, and that the only element computing `rgb(45, 127, 249)` on `color`, `backgroundColor` or `borderTopColor` inside `#the-run` is `.ob-funnel-bar-verified`. Assert `document.querySelectorAll('.ob-src-row').length === 65` and that **every** row's `getBoundingClientRect().height === 140`, discards included. Assert the outline: exactly 1 `h1`, 2 `h2` and 6 `h3` in `main`, the six `h3`s reading `DIMENSION` `STANCE` `STATUS` `IN THE REPORT` `DOMAIN` `WHEN` inside `nav[aria-label="Filter the evidence"]`. Record `document.querySelector('#everything-we-checked').getBoundingClientRect().top` and `.ob-rail` height, then click `Money`: assert `.ob-src-count` reads `SHOWING 17 OF 65 · NEWEST FIRST`, the `DIMENSION` counts are still `19 · 15 · 10 · 17 · 4`, and `STANCE` now reads `Supports 4 · Neutral 6 · Contests 3`. Click `Contests` → `SHOWING 3 OF 65` and zero `.ob-src-row--discarded` in the list. Click `Q3 2025` → `SHOWING 2 OF 65`. After each click, re-measure the `#everything-we-checked` top and the `.ob-rail` height — **both must be byte-identical to the pre-click values**; no facet may have been hidden. Assert the URL is now `?dim=MONEY&stance=challenges&q=2025Q3`, reload, and assert the same two rows render on first paint. Open the first row: assert `.ob-drawer-pos` reads `1 of 2 · FILTERED`, press `ArrowRight` with a real key press, assert it reads `2 of 2 · FILTERED` and that Next is `disabled`. Clear all, select `Discarded` alone: assert 18 rows, every one `.ob-src-row--discarded`, every one carrying a visible `.ob-src-reason` whose text is a sentence from `DISCARD_REASON_LABEL` and never a snake_case key, `getComputedStyle(reason).fontFamily` resolving to the sans stack and its `color` to `--ob-muted`'s value, `getComputedStyle(excerpt).textDecorationLine === 'line-through'`, and **no computed `color` or `background-color` anywhere in the list parsing to a red-dominant RGB** (`r > g + 40 && r > b + 40`). Open a discard: assert the drawer title is `Discarded excerpt`, its MetaLine id matches `/^DS_\d{2}$/`, and `.ob-drawer-pos` reads against 18, not 47. Assert `document.querySelectorAll('[role="button"] a').length === 0` and that exactly one `.ob-btn-primary` is present. Emulate `prefers-reduced-motion: reduce`, reload, and assert every `.ob-src-row` reports `opacity: 1` and `transform: none` on the first frame. With motion on, assert `.ob-src-list` carries `data-entrance="on"` at load and `"off"` within 600ms, then click a facet and assert every visible row's computed `animation-name` is `none`. Grep `styles/*.css` for a second `@keyframes` named `ob-app-src-row-in` or any unprefixed keyframe in `obsidian-app.css`, grep the diff for hardcoded colour values outside `styles/tokens.css`, and diff used-vs-defined custom properties across `styles/obsidian-app.css` — an undefined `--ob-*` voids its whole declaration silently. Finish per [C14](#c14--every-exit-test-ends-the-same-way): `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and `browser_console_messages level:"error"` returning zero at **both** 1440 and 1280.

---

## A14 — Supporting surfaces + the state matrix

**Goal:** every surface a user can reach that isn't one of the four run pages renders Obsidian, and the loading/empty/error/success matrix is walked page by page and *settled* — every state either built, built behind a QA param, or recorded as deliberately unreachable with the reason. Implements the remainder of **D4**; fixes **R20**.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/verification.md`, `references/pitfalls.md` (§1, §2, §7), `WebsiteLayoutDesc/12-states.md`, `WebsiteLayoutDesc/09-pages-supporting.md`

**Build:**
- `styles/obsidian-app.css` **§15 `STATES & SUPPORTING SURFACES`** — the one section this phase writes. A0 left the banner empty; see [C1](#c1--stylesobsidian-appcss-the-section-map) for the map, and do not renumber anything. Classes, exactly: `.ob-standalone` `.ob-standalone-head` `.ob-standalone-body` `.ob-recovery` `.ob-recovery-row` `.ob-recovery-foot` `.ob-error-panel` `.ob-error-title` `.ob-error-actions` `.ob-skel` `.ob-skel-line` `.ob-skel-field` `.ob-skel-row` `.ob-skel-grid`. **No `@keyframes` in this section at all** — nothing here moves, so §15 contributes nothing to §16.
- `styles/tokens.css` — **untouched.** This phase declares no token and no colour value ([C2](#c2--foundation-ownership)).
- `lib/content/app.ts` — new `SUPPORTING` export holding every string below verbatim. **It does not hold the sources empty-facet copy** — that is A13's `sources` block and is imported, not duplicated.
- `app/r/[slug]/not-found.tsx` — rewrite
- `app/not-found.tsx` — rewrite
- `app/error.tsx` — rewrite
- `app/r/[slug]/roadmap/error.tsx` — rewrite
- `app/r/[slug]/sources/error.tsx` — **new** (handed over by A13)
- `app/r/[slug]/define/loading.tsx`, `validate/loading.tsx`, `roadmap/loading.tsx`, `sources/loading.tsx` — all four rewritten (R20). A2 left `define/loading.tsx` on an inline grid when it deleted `TwoColumn` ([C13](#c13--ownership-of-things-two-phases-both-wanted) — that was the third call site); this phase replaces the placeholder with the real split geometry.
- `components/ui/skeleton.tsx` — `Skeleton` / `SkeletonText` / `FieldSkeleton`; class names unchanged (`.ob-skeleton`), the shimmer removed
- `components/ui/recent-runs-list.tsx` — A2 moved and ported it; A14 owns only its `.ob-recovery*` recipe and its `RECENT RUNS` head on the invalid-run page
- `app/r/[slug]/{define,validate,roadmap,sources}/page.tsx` — **QA params only.** Two lines each: `?broken=1` throws; `define` additionally forwards `?sendfail=1` as a prop. No other change to any of the four pages.
- `components/define/define-conversation.tsx` — the `?sendfail=1` branch only; the controller is A6/A7's and is not otherwise touched
- `app/style-guide/page.tsx` + `components/style-guide/sections/*` — rebuilt against the Obsidian kit
- `components/style-guide/sections/states.tsx` — **new**; `figures.tsx` — **extended** (A3 created it); `evidence.tsx`, `chrome.tsx` — **new**; `define.tsx`, `roadmap.tsx`, `validate.tsx` — **deleted** (see the gallery note below). `entry.tsx` was already deleted in A2.

**Notes:**

- **`components/entry/` no longer exists.** A2 moved `orb.tsx` and `recent-runs-list.tsx` into `components/ui/` and deleted the rest ([C13](#c13--ownership-of-things-two-phases-both-wanted)); that call is A2's and this phase does not reopen it, does not re-audit `the-box.tsx`, and imports both survivors from `components/ui/`. Any path of the form `components/entry/*` in an older draft is stale.
- **The invalid-run page is the most important surface in this phase and it is not a 404.** The slug is the entire access model, so a truncated link is the single most likely real failure in the product. It stays deliberately outside `RunShell` — `app/r/[slug]/layout.tsx` is the thing that called `notFound()`, so rendering its chrome would be a lie. Chrome is `Wordmark` only (`.ob-wordmark` + `.ob-wordmark-glyph`, "Groundwork" per **D2**) and a `<hr className="ob-rule">` beneath it.
- **`Orb` stays here, and this is its only surviving call site** ([C13](#c13--ownership-of-things-two-phases-both-wanted)). A2 ported it to `.ob-orb` — a 360px radial-gradient circle at `--ob-accent-wash`, `blur(28px)`, `aria-hidden`, breathing at 38s, which sits inside the ambient band (20–50s) and is legal under D17. A8 removed the console's; nothing else calls it. **This page therefore renders no `AppBackdrop`** — one ambient field per surface, and the Orb is this one's. The root 404 and root error render `<AppBackdrop variant="standalone" />`, and the two segment error boundaries render `<AppBackdrop variant={segment} />` as their first child exactly as the page they replace would, because C13 puts the backdrop on the page and an error boundary *is* the segment's rendered tree. (`AppBackdrop` comes from [C13](#c13--ownership-of-things-two-phases-both-wanted); *add to the naming contract* if the phase that built it didn't.) **A15 does not delete `components/ui/orb.tsx`.**
- Type scale maps to how first-class the surface is, and nothing here spends the display size: **invalid run `--ob-h1`, root 404 `--ob-h2`, root error `--ob-h2`, segment errors `--ob-h3`.** A 104px "There's nothing at this link." is theatrical about the user's failure — the surface's job is recovery, not announcement.
- **Exact copy — invalid run** (`SUPPORTING.notFoundRun`): eyebrow `RUN NOT FOUND` · headline `There's nothing at this link.` · para 1 `The link may be incomplete — they're long, and chat apps sometimes cut them off. Check you copied the whole thing.` · para 2 `Runs aren't stored against an account, so we can't look one up for you.` · recovery head `RECENT RUNS` · footnote `Remembered by this browser only.` · CTA `Start a new idea` (`.ob-btn .ob-btn-primary` + `.ob-arrow`).
- **`RecentRunsList` hides entirely when empty and gains no empty state.** Hide, don't placeholder. When it hides, the CTA is the only thing under the paragraphs and that is the correct page.
- **Exact copy — root 404:** eyebrow `NOT FOUND` · headline `There's nothing here.` · body `That address doesn't match anything in this product.` · CTA `Start an idea`.
- **Exact copy — root error** (`app/error.tsx`): eyebrow `SOMETHING BROKE` · headline `This one's on us.` · body `An unexpected error stopped the page from loading.` · second body, only when a slug is present, `Your run is still there — reloading usually fixes it.` · primary `Reload` · secondary `Go to your run` + `.ob-arrow`, still a plain `<a>` not `next/link` (a full navigation is the safer recovery when client router state may be mid-failure) · footer meta `ERROR {digest} · {YYYY-MM-DD HH:MM}`. **The separator is ` · `, not ` // `** — `//` is Deep Canopy. Keep `retry` (not `reset`) — next@16.3 — and keep the `usePathname()` + `/^\/r\/([^/]+)/` slug extraction, since an error boundary cannot receive route params. Set `fontWeight: var(--ob-weight)`; the current file hard-codes `700`, which violates Obsidian law 4.
- **Exact copy — roadmap error:** `We couldn't write the roadmap for this run.` / `The research is finished and safe — you can try again.` / `Try again` / `Back to the report`.
- **Exact copy — sources error (new file):** `We couldn't load the evidence for this run.` / `The report is finished and safe — every finding is still on it.` / `Try again` / `Back to the report`. Same segment-scoped shape as roadmap's: nested below `app/r/[slug]/layout.tsx` so `RunShell` chrome stays mounted. **A13's hand-over note quotes a shorter first line (`Couldn't load the evidence.`); A14 owns this file and the fuller sentence is what ships** — record the divergence in the build log so it isn't "corrected" back.
- **`.ob-error-panel`: `background: var(--ob-surface)`, `border-left: 2px solid var(--ob-accent)`, `border-radius: var(--ob-r-card)`, `padding: 28px 32px`, no shadow, no red.** The accent rule is doing the **live/active** job — it marks the one region of a broken page that still works and still has an action in it. Name that job out loud in the section comment. Nothing else on any error surface is blue except that rule and the one `.ob-btn-primary`; a third blue thing means one of them is wrong.
- **Banned error copy, restated so it can't drift back in:** no "Oops!", no bare "Something went wrong", no "Please try again later", no exclamation marks, no emoji, no blame. Every string names a cause or a next step. Errors are inline and adjacent — no modals, no top banners, no toasts.
- **Skeletons do not shimmer, anywhere.** A 1.4–1.6s infinite shimmer is neither ambient (20–50s) nor structural (150–900ms), so it is banned by the motion binary and A15's automated check would flag it. `.ob-skeleton` becomes a static `var(--ob-surface)` block at `var(--ob-r-tag)` on the canvas, with **zero animation**. `SkeletonText` keeps the varied line widths `100 / 92 / 96 / 80 / 88%` — uniform bars look synthetic. **This phase therefore strips the `animation` declaration from `.ob-skeleton` and deletes `@keyframes ob-app-shimmer` from §3**, which A2 wrote and which after this rewrite has no consumer. **The class name does not change** — `.ob-skeleton` is referenced by A2's exit test and by four route-level `loading.tsx` files, and renaming it to buy nothing is exactly the churn the naming contract exists to prevent. This is the one edit A14 makes outside §15, it removes rules rather than adding them, and it goes in the build log as a deviation against A2. **A7's parenthetical that shimmer "exists only in `app/r/[slug]/define/loading.tsx`" is stale — it survives nowhere.**
- **The Obsidian answer to a loading state is that the hairlines are already correct.** Every rule, every `.ob-eyebrow` section numeral, every mono label, and every static string from `lib/content/app.ts` renders *for real* in the fallback; only data-derived content is a blank block. A skeleton that already has the page's structure is not a placeholder, it is the page with its content pending — which is also the only honest way to distinguish *pending* from *empty*.
- **These four skeletons mirror grids that A6–A13 already shipped. Read the shipped grid and mirror it** — open the real page, read `gridTemplateColumns`, `columnGap` and the row heights off it with `getComputedStyle`, and write those numbers into the fallback. The figures below are the settled values as of A6–A13; where a page moved, the shipped page wins and the build log records the delta. A14 runs last for exactly this reason.
- **`define/loading.tsx`** (fixes R20's worst case — today it stubs 6 of 12 fields and a 44px block against a ~213px headline): the split at `calc(100vh - var(--ob-header-h))`, band row `var(--ob-define-band-h)` 96px then `.ob-define-split` at `minmax(0,1fr) var(--ob-define-aside)` (440px) with **no gap** and the aside's `border-left` hairline running floor to ceiling — A6's geometry exactly. Band: the real `<h1 class="ob-h2">What are you building?</h1>` left, a 12px × 180px block reserving `BriefProgress` right. Left column: one AI turn as three `.ob-skel-line` at `96% / 88% / 54%` inside the 64ch measure, then the **composer's real frame** — hairline top, the real hint line `ENTER TO SEND · ⇧ENTER NEW LINE`, both ghost buttons — with the textarea **disabled**. *(Deliberate change from the first draft's "live and focused": a live textarea inside a Suspense fallback silently discards whatever was typed the instant the real tree replaces it, which breaks "never lose user input" — the exact promise the `?sendfail=1` state exists to protect. The frame's height is identical either way, which is all the contract needs.)* Right column: real `<h2 class="ob-eyebrow">THE BRIEF</h2>`, then **12** `.ob-skel-field` rows (real mono label, 20px value block at 62%) — the brief fixture has twelve fields — then a 12px × 280px block. No `ApproveButton`: it does not exist until a brief does.
- **`validate/loading.tsx` renders Mode B's shape, not Mode A's.** The route cannot know which mode it will land in — `isRunStreamActive` is a client-side `localStorage` read the server fallback can't see — and a cold visitor on a shared link is the overwhelmingly common arrival. Composition: the real title band (`.ob-report-head`, `--ob-void`, `padding-block: 88px 64px`) carrying the real `<h1 class="ob-display">What the web already says.</h1>`, a 21px × 420px block for the one-liner and a 12px × 460px block reserving the `MetaLine`; then the real `SectionIndex` strip at 48px with all six labels rendered for real — `01 EVIDENCE` · `02 SUMMARY` · `03 DIMENSIONS` · `04 COMPETITORS` · `05 SURPRISES` · `06 UNANSWERED`. Then `.ob-report-row` at `var(--ob-report-prose) var(--ob-report-aside)` gap `100px` inside `.ob-report-body`. Left: real `01 STATE OF THE EVIDENCE` eyebrow + five `DimensionStrip` column stubs (14px label block, 8px bar block) in a 140px reservation, real `02 WHAT WE FOUND` eyebrow + six `.ob-skel-line`. Right: one `Figure` frame at its reserved height — 12px caption block, a 140px `.ob-fig-mark` (the funnel's reservation, [C8](#c8--runfunnel)), 12px × 90px citation row.
- **`roadmap/loading.tsx`:** real h1 `What to do next.`, real lead, a 12px × 520px block reserving the page `MetaLine`, the real sticky `SegmentedControl`, real `01 OPEN QUESTIONS` eyebrow. Then the first card expanded on A11's real grid — `.ob-oq-grid` at **`160px minmax(0,1fr)`, `column-gap: 32px`, `row-gap: 28px`** — with **all seven label cells rendered for real** (`QUESTION` `WHY IT MATTERS` `ASK` `FIND THEM` `HOW MANY` `THE SCRIPT` `WHAT YOU LEARN`) and only the value cells blanked. Then five collapsed rows separated by `.ob-rule`, each with its real mono id and a 23px question block at **78% width that wraps** (R15 — no `nowrap`, no ellipsis, ever again). **The ids and their order come from the fixture's `priority` rank ([C6](#c6--openquestion-priority-brief-link-fan-out)) — expanded `Q06`, then `Q01 · Q04 · Q02 · Q05 · Q03`** — and they render as A11 renders them, bare mono, not bracketed. D10's promotion pass only reorders after hydration, so the fallback's order is the first-paint order. Then real `02 BUILD ROADMAP` eyebrow, the `WeekAxis` drawn with its twelve tick hairlines and no labels, **four** `PlanBar` lane reservations at 34px on a 12-column grid, the `TripwirePanel` frame carrying its real `WHAT WOULD CHANGE THIS PLAN` head **below and off the axis**, and the `RoadmapExit` band's rule and real `END OF THE RUN` label. Weeks, spans and the four-bar count are [C5](#c5--the-roadmap-week-model-librun-plants)'s; do not restate a horizon here and do not draw a fifth lane — a skeleton that shows the tripwire as a timed lane re-asserts the exact lie D13 removes, in the first frame the user sees.
- **`sources/loading.tsx`:** real `01 THE RUN` eyebrow, then the real `.ob-run-band` — two `minmax(0,1fr)` tracks, gap `64px` — with each column's figure reserved at the height the shipped page reports; the left column is `RunFunnel` in its expanded density ([C8](#c8--runfunnel)). Then `.ob-explorer` at `260px minmax(0,1fr)` gap `64px` inside `--ob-container-app`. Rail: **six** real facet-group heads, A13's legends verbatim — `DIMENSION` · `STANCE` · `STATUS` · `IN THE REPORT` · `DOMAIN` · `WHEN` — each over four blanked rows, and the rail's fixed-height head block. Body: real `02 EVERYTHING WE CHECKED` eyebrow, the real subhead, the five real `.ob-sort-btn` labels (`NEWEST` `OLDEST` `DIMENSION` `STANCE` `NUMBER`), a 12px block for `.ob-src-count`, then eight row skeletons on A13's exact row grid — `56px 132px minmax(0,1fr) 200px`, `column-gap: 24px` — **each at the shipped `--ob-src-row-h`**, hairline-separated.
- **Fixtures resolve synchronously, so these fallbacks essentially never paint. Two things make them verifiable anyway.** (1) Temporarily insert `await new Promise((resolve) => setTimeout(resolve, 2500));` at the top of each route's `page.tsx` — **never in `lib/db/queries.ts`**, which is a seam and must stay honest — measure, then remove before committing. (2) Permanently: `components/style-guide/sections/states.tsx` imports all four `loading.tsx` default exports and renders them, so the skeletons have a reviewable home that survives this session. (2) is the durable answer; (1) is how you prove the reserved heights are right.
- **The height contract (Standing rule 12):** for each route, measure `document.querySelector('main').getBoundingClientRect().height` under the throttle and again after content lands. **|Δ| ≤ 8px or the reserved space is wrong.**
- **Media (D18):** append this phase's entries to `higgsfieldPlan_shared.md` — the invalid-run atmosphere and the error-surface treatment. Nothing here is load-bearing; every surface ships complete with zero generated assets, and the Orb is the shipped answer, not a placeholder for one.

**The state matrix, settled per page.** Build column: `built` · `QA param` · `absent`.

| Page | State | Disposition |
|---|---|---|
| Define | loading | built — above |
| Define | empty | **absent, unreachable by construction** — a run always carries a seeded first turn |
| Define | error: send failed | **QA param `?sendfail=1`** — the third send renders the inline error under the turn, `Couldn't send that. Your text is safe.` + `Retry`, with the composer's text preserved. Worth building: it is the only surface that exercises *never lose user input*, which is a standing product promise |
| Define | error: stream interrupted | **absent** — the transcript is a scripted typewriter with nothing to interrupt. Record the copy (`— interrupted` / `Continue`) in the build log, not in `lib/content/app.ts`; dead copy rots |
| Define | error: page throw | **QA param `?broken=1` → root boundary.** Deliberately not given a segment boundary: on Define nothing has been produced yet, so there is no completed work that losing the chrome would strand |
| Define | success | A7 — brief proposed, `ApproveButton` + `ConsequenceLine` appear; `DefineHandoff` replaces the left column; locked-after-approval read-only state. A14 verifies all three exist |
| Validate A | empty | **built** — reachable in the first ~5.2s of the re-timed console (D8). `Nothing verified yet. Findings appear here as they pass the check.` |
| Validate A | stalled | **built + QA param `?stall=1` (A8).** A8 owns the mechanism and the copy — `Still working — some pages are slow to fetch.` at 8s, `This is taking longer than usual.` + `Refresh` at 40s — and suppresses the event chain after finding #8 so it is reachable. The fixture's own maximum inter-event gap is 1.7s, so it never trips naturally. A14 verifies it renders and shifts nothing |
| Validate A | SSE disconnected | **absent by contract** — there is no SSE. The copy belongs with the seam TODO in `lib/hooks/use-run-stream.ts` |
| Validate B | thin evidence | **QA param `?thin=1`** — exists, keep |
| Validate B | error | **QA param `?broken=1` → root boundary.** A report failure *is* the run failure, so the whole-page treatment is honest here |
| Validate B | success | one-time reveal of `02 WHAT WE FOUND` 200ms after the console cross-fade (A8/A9) |
| Roadmap | empty (<4 questions) | **absent** — fixture has 6. Recorded |
| Roadmap | generating | **absent** — no pipeline. Recorded |
| Roadmap | error | **built + `?broken=1`** — segment boundary, chrome survives |
| Sources | empty facet | **built and genuinely reachable** — e.g. dimension `PRACTICAL` + stance `contests` = 0 rows. **The copy is A13's `sources` block in `lib/content/app.ts`** (`Nothing matches this combination.` + `Clear all facets`), imported, never re-authored — two strings for one sentence is how R14 started |
| Sources | empty run (0 verified) | **absent** — recorded |
| Sources | error | **built + `?broken=1`** — new segment boundary |
| All | copy action | label swap to `✓ Copied` for 2000ms; failure → `Press ⌘C` + DOM selection. No toasts anywhere in this product |

**Rules restated, because this is the phase that enforces them:** nothing under 400ms gets an indicator · no full-page loaders, no route-transition spinners, no progress bars · **no illustrated empty states, ever** · hide, don't placeholder · one sentence and at most one action · **distinguish pending from empty** · never lose user input · never lose completed work — a later-stage failure still shows everything already verified · never frame emptiness as failure *or* success · never apologise twice.

**`StatusBadge`'s fate, decided here because A2 deferred it.** `RunFooterBar` does **not** carry it. `ALL SYSTEMS OPERATIONAL` is a status-page claim this product cannot make from a fixture, and its `.ob-dot` would put a second pulsing accent dot in the same viewport as `PhaseStrip`'s active phase — A15 caps that at one. The component survives in `/style-guide#ui-atoms` and nowhere else; record the decision in the build log so nobody hunts for its call site.

**`/style-guide`, rebuilt.** Sections in order: `foundations` (four surfaces as stacked rules, three hairlines, the type scale rendered at real size, the three durations and one easing as live specimens) · `ui-atoms` (`.ob-btn-primary` / `.ob-btn-ghost` / `.ob-btn-bare`, `.ob-chip` + `.ob-chip-verified`, `.ob-badge`, `.ob-dot`, `.ob-meta`, `.ob-eyebrow`, `StatusBadge`) · `layout` (the five agreed grids drawn as labelled hairline diagrams — report `580/400` gap 100, define `1fr/440` no gap, explorer `260/1fr` gap 64, console `320/1fr` gap 64, roadmap 1200 with the 920 question cap) · **`figures` — extended, not created: A3 built this section; A14 confirms all twelve marks render inside their `Figure` wrapper with real fixture data and real citations, and adds the two A3 could not draw until A11/A12 supplied their models** · `evidence` (`CitationChip`, its popover, `EvidenceDrawer`, all three `FindingCard` variants — [C13](#c13--ownership-of-things-two-phases-both-wanted), none were deleted — plus `EvidenceRow` and `DiscardRow`) · `chrome` (`RunHeader` expanded and condensed, `StageRail` in all three states, `EvidenceButton`) · **`states`** (the four skeletons, the five error surfaces, `EmptyNote`, `ThinEvidenceNotice`). **`define.tsx`, `roadmap.tsx` and `validate.tsx` are deleted**: they are page-composition galleries, the four real pages now *are* that gallery, and a second copy of a page rots exactly the way `entry.tsx` did. Change `metadata.title` to `Style Guide — Groundwork` (D2).

**Exit test:** with `next dev` running, drive the **Playwright MCP** through eight checks at 1440×900 and again at 1280. **(1) Invalid run** — `/r/definitely-not-a-run`: `getComputedStyle(document.body).backgroundColor === 'rgb(10, 10, 11)'`; the h1's `fontSize >= 42` and `fontWeight === '400'`; `[...document.querySelectorAll('*')].filter(n => getComputedStyle(n).boxShadow !== 'none').length === 0`; exactly one visible `.ob-btn-primary`; zero elements matching `[class*="btn-secondary"], .card, .section-label` (Deep Canopy leftovers); `.ob-orb` present with `animationDuration: '38s'` and `document.querySelectorAll('.ob-backdrop').length === 0` — one ambient field, and it is the Orb. **(2) Boundaries** — `/nope`, `/r/{slug}/define?broken=1`, `/r/{slug}/validate?broken=1`, `/r/{slug}/roadmap?broken=1`, `/r/{slug}/sources?broken=1`: each renders its intended boundary; on the two segment boundaries assert `document.querySelector('.ob-run-header') !== null` (chrome survived) and on the three root ones that it is `null`; on every one of the five assert no computed `color` or `backgroundColor` parses to a red-dominant RGB. **(3) Reserved height** — add the 2500ms throttle to all four `page.tsx` files, reload each route, measure `main`'s `getBoundingClientRect().height` at t=1000ms and again after content lands, **assert |Δ| ≤ 8px on all four**, then remove the throttle. **(4) Skeleton fidelity, the R20 assertions** — on `define/loading` count `.ob-skel-field` and assert it is **12**, not 6; on every route assert every `.ob-skel*` node reports `animationName: 'none'` (no shimmer survived); read `getComputedStyle(el).gridTemplateColumns` off the fallback's `.ob-oq-grid`, `.ob-explorer` and `.ob-report-row` and assert each string is **identical** to the same read on the loaded page. **(5) Shape parity, per finding** — `roadmap/loading` renders exactly **4** `PlanBar` lane reservations and a `TripwirePanel` frame that is not a descendant of `.ob-plan-lanes`; `sources/loading`'s rail renders exactly **6** `.ob-facet-legend` nodes whose `textContent` array equals `['DIMENSION','STANCE','STATUS','IN THE REPORT','DOMAIN','WHEN']`; every `.ob-skel-row` height equals the loaded page's `.ob-src-row` height. **(6) Input safety** — `/r/{slug}/define?sendfail=1`: type text, send, confirm the inline error renders and `document.querySelector('textarea').value` still holds the typed string. **(7) `/style-guide`** — assert `document.querySelectorAll('.ob-fig').length > 0` **first** (a zero-length list passes every following assertion vacuously and proves nothing), then that **every `.ob-fig` contains at least one `.ob-cite` or one `.ob-fig-cite`** — the wrapper is `.ob-fig` and the chip is `.ob-cite` ([C12](#c12--shared-class-names)), and `source` is A3's sanctioned alternative to a `[n]`; assert `#states` renders four skeleton blocks and five error surfaces, and that `#ui-atoms` contains exactly one `.ob-dot`. **(8)** `browser_console_messages level:"error"` returns **0** on every route above, then `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` ([C14](#c14--every-exit-test-ends-the-same-way)).

---

## A15 — Sweep: motion, a11y, deletion, DoD

**Goal:** the build is finished. Deep Canopy is gone from the repository, the motion inventory is proven to obey the binary, reduced motion resolves in both halves, the a11y floor is verified with real key presses, contrast is measured against Obsidian rather than against a palette that no longer exists, and every shared link previews as a real card. Nothing new is designed in this phase.

**Read:** `.claude/skills/obsidian-design/SKILL.md`, `references/motion.md`, `references/verification.md` (the whole loop), `references/pitfalls.md` (§1, §2, §3, §4, §5, §6, §10), `WebsiteLayoutDesc/13-responsive-and-accessibility.md`, `WebsiteLayoutDesc/11-interaction-patterns.md §11.6`, `WebsiteLayoutDesc/16-scope-and-priorities.md §16.5`

**Build:**
- Delete `styles/components.css` (1843 lines)
- `styles/globals.css` — drop its import, rewrite the whole `@layer base` block onto `--ob-*`, and fold A0's two `[data-theme='obsidian']` base overrides into the plain rules (see step 4 — this is the trap in this phase)
- `styles/tokens.css` — delete the Deep Canopy `:root` block (currently lines 4–122). **The `--ob-*` block already lives on `:root`; A0 moved it and owns every token** ([C2](#c2--foundation-ownership)) — assert, do not re-declare, and add none here
- `styles/obsidian.css` — strip `[data-theme="obsidian"]` from every selector; §1 absorbs the grain pseudo-element. **§16 is de-scoped but not extended** — its blanket and its four end states stay exactly as they are ([C1](#c1--stylesobsidian-appcss-the-section-map))
- `styles/obsidian-app.css` **§16 `REDUCED MOTION`** — A0 seeded it; A15 completes it. This is the only home for app-side reduce rules ([C1](#c1--stylesobsidian-appcss-the-section-map))
- `styles/obsidian-app.css` — three motion retunes only, named in §2. No new class, no new section
- `app/page.tsx` / `app/layout.tsx` — remove `data-theme`; delete the `Inter_Tight` and `IBM_Plex_Mono` imports and their `.variable` entries
- `app/layout.tsx` — `metadataBase`, `openGraph`, `twitter`, title template (R18)
- `app/r/[slug]/layout.tsx` — `metadata.robots = { index: false, follow: false }`
- `app/r/[slug]/{define,validate,roadmap,sources}/page.tsx` — `generateMetadata`, and one `sr-only` `<h2>` each on roadmap and sources (§4)
- `app/style-guide/og/page.tsx` — **new**, dev-only; five 1200×630 code-drawn OG frames
- `public/og/{default,define,validate,roadmap,sources}.png` — screenshotted out of the above

---

### 1. The Deep Canopy deletion (D1)

**This is the single most dangerous edit in the build.** It cannot be verified by looking — a route that silently loses every recipe still renders plausible-looking unstyled HTML on a dark background. Do it in this order and verify after each step.

**Step 0 — the baseline.** Before touching a file, sweep every route at 1440 and record a JSON blob into the build log: `/`, `/r/sms-rebooking-4f2a`, `/define`, `/validate`, `/validate?thin=1`, `/roadmap`, `/sources`, `/r/no-such-run`, `/nope`, `/style-guide`. Per route capture `getComputedStyle(document.body).backgroundColor`, `document.querySelectorAll('*').length`, the h1's `fontSize`/`fontWeight`/`color`/`letterSpacing`, the count of elements with `boxShadow !== 'none'`, and the computed `marginTop` of one element carrying **both** a recipe class and a Tailwind margin utility. **This baseline is the only thing that can prove the deletion was inert.** Without it you are guessing.

**Step 1 — no call site still reads a Deep Canopy token.** Run `grep -rnoE 'var\(--[a-z0-9-]+' --include=*.tsx --include=*.ts --include=*.css app components lib styles | grep -v 'var(--ob-'`. **Do not write it as a single `-E` pattern with `(?!ob-)`** — POSIX ERE has no lookahead, so that form matches nothing and reports a clean tree on a dirty one. `-P` works where GNU PCRE is available; the piped form works everywhere and is what this step uses. Every hit outside `styles/tokens.css` and `styles/components.css` is a call site that will void its whole declaration the moment the token vanishes (pitfalls §3 — the declaration dies silently and entirely, not partially). Fix each to its `--ob-*` equivalent. **Do not proceed while this grep returns anything else.**

**Step 2 — no call site still uses a Deep Canopy recipe class.** Build the inventory with `grep -oE '^\.[a-z][a-z0-9-]*' styles/components.css | sort -u`, then intersect it against every class actually emitted: `grep -rhoE 'className="[^"]*"' app components | tr ' "' '\n\n' | sed 's/[>{}]//g' | sort -u`. Any intersection is live. Expect stragglers around `.finding-row`, `.sources-rows`, `.error-panel`, `.run-shell-header`, `.meta-line`, `.stage-*`, `.skeleton`, `.text-action`, `.btn*`, `.card*`, `.well`. Fix before deleting.

**Step 3 — delete.** Remove `styles/components.css` and the `@import "./components.css";` line from `styles/globals.css`. Run `npm run build`. **Re-run the step-0 sweep and diff it.** Any route whose body `backgroundColor` or h1 `fontSize` moved is a call site steps 1–2 missed — that route is now partially unstyled and looks fine in a screenshot.

**Step 4 — rewrite `@layer base`, in the same commit as steps 5 and 6, or the app goes unstyled.** `body` currently reads `--bg-base`, `--text-body`, `--font-text`, `--text-body-size`, `--leading-relaxed` → `--ob-canvas`, `--ob-muted`, `--ob-font`, `--ob-body`, `--ob-leading-body`. The `h1..h6` rule reads `--font-display`, `--text-primary`, `--weight-bold`, `--tracking-snug`, `--leading-tight` → `--ob-font`, `--ob-text`, **`--ob-weight` (400 — this is a real visual change and it is the correct one, Obsidian law 4)**, `--ob-tracking-h2`, `--ob-leading-tight`. `::selection` → `--ob-accent` / `--ob-on-accent`. `:focus-visible` → `outline: 2px solid var(--ob-accent); outline-offset: 2px;` and **delete `border-radius: var(--r-md)` entirely** — that radius applies to the *element*, so it visibly squares off every pill button the instant it receives focus (pitfalls §2, second half).
  **The trap, and it is R23 wearing a different hat.** A0 landed two higher-specificity base rules — `[data-theme='obsidian'] body { … }` and `[data-theme='obsidian'] :is(h1,…,h6) { … }` — precisely so the theme attribute on `<html>` could beat `@layer base`'s direct `body` declaration. **Step 6 removes that attribute, at which point both rules stop matching and the entire app silently reverts to Inter Tight on a forest-green body** — the exact failure A0 was written to prevent, re-armed. So step 4's rewrite *is* the fold: the `--ob-*` values move into the plain `body` and `h1..h6` rules and A0's two scoped overrides are deleted in the same edit. Verify by reading `getComputedStyle(document.body).fontFamily` and `.backgroundColor` on `/` **after** step 6, not before.
  Move the grain `body::before` into `styles/obsidian.css` §1 with a literal `opacity: 0.035`. Grain belongs with the backdrop, not in a Deep Canopy base layer; it takes a literal rather than a token because [C2](#c2--foundation-ownership) closes the token list at ten and a custom property with exactly one consumer is not earning its place.

**Step 5 — de-scope the tokens and the recipes.** In `styles/tokens.css`, delete the Deep Canopy `:root` block; the `--ob-*` block is already `:root` (A0) and is not touched. In `styles/obsidian.css`, strip the `[data-theme="obsidian"]` prefix from every selector — scripted replace, then verify `grep -c 'data-theme' styles/obsidian.css` returns **0** and `npx biome check --write styles/obsidian.css` passes. The §16 blanket's `[data-theme="obsidian"] *` becomes a bare `*`, which is what we want now that Obsidian is the only system. **This is a de-scoping, not an extension — §16 of `obsidian.css` gains no rule** ([C1](#c1--stylesobsidian-appcss-the-section-map)). **The one specificity risk worth naming:** rules like `[data-theme='obsidian'] :focus-visible` lose a class of specificity, but they live in `@layer components` and `@layer base` is declared before it, so layer order still wins. Measure it rather than trusting it.

**Step 6 — remove the attribute.** `grep -rn 'data-theme' app components` must return nothing. If A0 moved it to `<html>` in `app/layout.tsx`, that is where it dies. Re-read the step-4 verification immediately after.

**Step 7 — drop the dead fonts.** `app/layout.tsx` still loads `Inter_Tight` and `IBM_Plex_Mono` for a system that no longer exists. Delete both imports and both `.variable` entries from the `<html>` className. **This removes two Google Font requests from every route in the app.** Verify: `getComputedStyle(document.body).fontFamily` contains `Geist` on every route, and the network panel shows no `Inter_Tight` request.

**Step 8 — final sweep, diff against step 0, record the numbers in the build log.** State explicitly which routes moved and why.

**One inherited decision to close.** A2's build log records the two behaviours `the-box.tsx` carried that `components/landing/cofounder-chat.tsx` does not — the `sessionStorage['sv.box.draft']` mirror and the live character count. A15 decides: port them or record them as deliberately dropped, with the reason, in the build log. This is a decision, not a design; leaving it open is how a working affordance disappears silently.

---

### 2. The motion pass (D17)

Enumerate every animation in the app after A14 and put each in one of two buckets. **Nothing sits between 900ms and 20s** except the named exceptions below.

**Ambient (20–50s, infinite, no trigger):** `.ob-backdrop::before` bloom **34s** (`ob-drift`) · `.ob-backdrop::after` bloom **52s** (`ob-drift-alt`) · `.ob-marquee-track` **46s** linear (`ob-marquee`, `/` only) · `.ob-orb` breathe **38s** (`ob-app-breathe`, the invalid-run page only — [C13](#c13--ownership-of-things-two-phases-both-wanted) keeps `Orb` there and A14 gives it its one surviving call site). That is the complete list. Ambient motion lives on pseudo-elements or on childless `aria-hidden` nodes, never on a node with children (performance rule: avoid promoting a whole subtree to its own layer).

**Structural (150–900ms, triggered):** `.ob-reveal` blur-up at `--ob-enter`, staggered 80–160ms, never more than six items · `.ob-verify-rule` `scaleX(0→1)` at `--ob-enter` (A5 owns the CSS, [C13](#c13--ownership-of-things-two-phases-both-wanted)) · `.ob-fstream-item` entrance and its `VerifiedBadge` delay — **A8 owns those attributes and timings, fixed by [C13](#c13--ownership-of-things-two-phases-both-wanted) at entrance 320ms → rule 900ms → badge 180ms at ~1220ms; A15 measures the order (badge opacity must still be 0 while the rule's `scaleX` is between 0 and 1) and does not set the numbers** · `.ob-verdict` at `--ob-base` · Drawer 260ms content / 200ms overlay and Modal 200ms / 180ms via `motion` v12 · Accordion `grid-template-rows: 0fr→1fr` **retuned to `--ob-base` 320ms** (it is 300ms today, which is a fourth duration) · `RunHeader` condense at `--ob-base` · `.ob-ticker-track` translate at `--ob-base` · the console→report cross-fade at 400ms with its 120ms offset, and `#what-we-found` at `--ob-base` on a 200ms delay · `DiscardTicker`'s slot blink at `--ob-fast` · `ob-app-pulse` 600ms once, on the dependency pulse and its `.ob-plan-step` / `.ob-tripwire` parity uses · `ob-app-src-row-in` at `--ob-base`, capped at twelve rows / 264ms of stagger · hover colour/border at `--ob-base` · press at `--ob-fast` · discard treatment (grey to `--ob-discard`, strike, 6px drop) at `--ob-base` · count-ups **retuned to `--ob-enter` 900ms**, a deliberate deviation from `motion.md` §5c's 1100ms because this system has exactly three durations and will not grow a fourth.

**Three retunes this phase makes, all downward into the binary, all logged as deviations against the phase that set them:**
1. **Accordion 300ms → `--ob-base`.** A fourth duration is a fourth duration even when it is close.
2. **`.ob-rest-dot` 1.4s → 2400ms** (A2). 1400ms sits in the dead zone. It becomes the system's one infinite period, shared with the live dot: **there is exactly one infinite duration in this app, 2400ms, and two things use it** — the accent `.ob-dot` and the dim `.ob-rest-dot`. That is a rule a machine can check.
3. **`ob-app-qspin` 1.6s and `.ob-spinner` → `var(--ob-enter)` linear infinite** (A8, A2). 1600ms is in the dead zone; 900ms is the top of the structural band and reads correctly as a spinner. **A rotational spinner is the only place `linear` is permitted besides the marquee**, because an eased rotation visibly pulses.

**`@keyframes` hygiene, and the check that catches the worst silent failure in this build.** `grep -n '@keyframes' styles/obsidian-app.css` — **every name matches `^ob-app-`**, and no name in that file also appears in `styles/obsidian.css` ([C1](#c1--stylesobsidian-appcss-the-section-map)). A duplicate name is *replaced*, not merged, and `obsidian-app.css` loads second in the same layer, so an unprefixed `ob-pulse` there would stop the live dot on every route with no error, no warning and no visual clue beyond a dot that has quietly gone still. The dot's own animation is `ob-pulse` in `styles/obsidian.css` and stays there, unprefixed and untouched.

**Two sanctioned non-durations, both recorded in the build log as exceptions:** the typewriter is a *rate*, 15ms/char for the machine voice and 24ms/char for the human voice, with a ~460ms beat after a short turn and ~900ms after a long one. And **`ob-pulse` at 2400ms infinite on the live dot** — a 30s pulse does not read as live. Cap it: **exactly one live dot visible per viewport** (which is also why A14 kept `StatusBadge` out of `RunFooterBar`).

**One sanctioned long transition:** `.ob-define-handoff-rule` draws `scaleX(0→1)` over **4000ms** (A7's `APPROVE_HANDOFF_MS`). It is not a transition, it is a **countdown** — its duration *is* the wait it depicts, exactly as the typewriter's rate is the speech it depicts — and the user can end it at any moment with the `Watch the research →` button that is already on screen. Under reduced motion A7 removes the auto-redirect entirely and pins the rule at `scaleX(1)`. Add it to the binary's allowlist by name, not by widening the band.

**Focus rings carry `transition: none`.** A ring that fades in over 320ms is a usability bug, and it will also make you measure a nonsense interpolated value and conclude the ring doesn't exist (pitfalls §7).

**`transform` has exactly one owner everywhere** (pitfalls §4). D17 bans parallax on app pages, so `grep -rn "style.transform\|setProperty('transform'" app components lib` must return **only** `components/landing/hero-collage.tsx`. Zero JS transform writers under `/r/[slug]/*`. Any component whose CSS animates `transform` must not also be written to by JS, and vice versa — entrance on such nodes is opacity-only.

**The automated binary check, run per route:**
```js
[...document.querySelectorAll('*')].flatMap(n => {
  const s = getComputedStyle(n);
  return [...s.animationDuration.split(', '), ...s.transitionDuration.split(', ')]
    .map(d => (d.endsWith('ms') ? parseFloat(d) : parseFloat(d) * 1000))
    .filter(ms => ms > 0 && (ms > 900 && ms < 20000))
    .map(ms => ({ ms, cls: n.className.toString().slice(0, 60) }));
})
```
**Must return only `.ob-dot` and `.ob-rest-dot` rows at 2400, plus `.ob-define-handoff-rule` at 4000 on Define's approved state.** Anything else is a bug, not an exception. Then the easing check: every non-zero `transitionTimingFunction` equals `cubic-bezier(0.16, 1, 0.3, 1)`, with `linear` permitted on `.ob-marquee-track`, `.ob-spinner` and `.ob-qglyph[data-state='running']` alone.

---

### 3. The reduced-motion contract, both halves

**CSS half.** Two blocks, one job each, and [C1](#c1--stylesobsidian-appcss-the-section-map) settles which is which: `styles/obsidian.css` §16 keeps the global blanket and the four landing end states it already carries (`.ob-reveal`, `.ob-word`, `.ob-verify-rule`, `.ob-verdict`) and gains nothing; **`styles/obsidian-app.css` §16 carries every app-side end state.** The blanket must *resolve to the end state*, not merely stop (pitfalls §10): `animation-duration` and `transition-duration` `0.001ms !important`, `animation-iteration-count: 1 !important`, `transition-delay: 0ms !important`, `html { scroll-behavior: auto }`. §16 then names, at minimum: `.ob-fstream-item { opacity: 1; transform: none }` · `.ob-chip-verified { opacity: 1 }` · `.ob-finding[data-state] .ob-verify-rule { transform: scaleX(1) }` · `.ob-ticker-track { transform: none }` · `.ob-fig-bar { transform: scaleX(1) }` · `.ob-cov-fill` keeps its inline `scaleX` (it is data, not animation) · `.ob-brief-rule { transform: scaleX(1) }` · `.ob-define-handoff-rule { transform: scaleX(1) }` · `.ob-caret { display: none }` · `.ob-oq[data-pulse] { animation: none; border-color: var(--ob-hairline-accent) }` and the same for `.ob-plan-step[data-pulse]` / `.ob-tripwire[data-pulse]` · `.ob-src-row { animation: none; opacity: 1; transform: none }` · `.ob-msg[data-entering] { opacity: 1; transform: none }` · `.ob-plan-bar` lanes' `.ob-reveal` end state.

**The completeness proof is a diff, not a read:** `grep -oE '^\.ob-[a-z0-9-]+' styles/obsidian-app.css | sort -u` against the selector list inside §16 of the same file. Any class that appears in a `transition:` or an `animation:` and not in §16 is a hole. Because C1 puts every app-side reduce rule in one block, this diff is a single-file operation — that is the whole reason the contract exists.

**JS half — five branches that CSS cannot fix.** Read `matchMedia('(prefers-reduced-motion: reduce)')` **in an effect, never during render**, and subscribe to `change`.
1. **The Define typewriter** renders the whole transcript at once, no caret, `SuggestionChip`s present, composer focused — and the approve handoff does **not** auto-redirect.
2. **`useRunStream` is never mounted:** `ValidateView` does not promote to console mode at all, so the visitor gets the report directly in its final state, no fade, no `data-arrived`, and no `setTimeout` chain is ever scheduled.
3. **Count-ups** short-circuit to their final value; no rAF loop starts.
4. **Entrance staggers** resolve: every `.ob-reveal` carries `data-shown="true"` on first paint without scrolling, and `.ob-src-list` never carries `data-entrance="on"`.
5. **Scroll-jump** in `SectionIndex`, `SegmentedControl`, `DependencyChip` and `PlanBar` uses `behavior: 'auto'`, not `'smooth'`.

**The verification script shape** — emulate, reload, wait, read, and above all **count**:
```
browser: emulateMedia({ reducedMotion: 'reduce' }) → navigate → wait 1200ms → one evaluate returning:
  opacities:  [...document.querySelectorAll('.ob-reveal')].map(n => getComputedStyle(n).opacity)
  transforms: [...document.querySelectorAll('.ob-word, .ob-verify-rule')].map(n => getComputedStyle(n).transform)
  durations:  [...document.querySelectorAll('*')].map(n => getComputedStyle(n).animationDuration).filter(d => parseFloat(d) > 0.01)
  counts:     { turns:    document.querySelectorAll('[data-turn]').length,
                console:  !!document.querySelector('.ob-console'),
                findings: document.querySelectorAll('.ob-finding').length,
                rows:     document.querySelectorAll('.ob-src-row').length,
                caret:    !!document.querySelector('.ob-caret'),
                counters: [...document.querySelectorAll('.ob-fig-value[data-value]')].map(n => [n.textContent.trim(), n.dataset.value]) }
→ emulateMedia({ reducedMotion: 'no-preference' })
```
Pass: opacities all `1`, transforms all `none` (or `matrix(1, 0, 0, 1, 0, 0)`), durations empty, `turns` equals the fixture's full turn count, `console` is `false` on `/validate`, `rows` is 65 on `/sources`, `caret` is `false`, and every counter's text equals its `data-value`. **Assert `counters.length > 0` before comparing** — an empty list satisfies `every()` and would prove nothing, which is the exact shape of a check that passes for years while measuring air. **The counts are the half CSS cannot reach and are therefore the ones most likely to be broken — check them at t=1200ms, not at t=45000ms, or you have proved nothing.**

---

### 4. The a11y floor

**Document outline — one `<h1>` per page, no level skipped.** Read it with `[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => [h.tagName, h.textContent.trim().slice(0, 48)])`.

**The rule that makes all four outlines legible: the numbered eyebrow is a `<p>`, never a heading.** A2 rebuilt `SectionLabel` as `<p class="ob-eyebrow ob-meta">`, so `01 STATE OF THE EVIDENCE` and `02 BUILD ROADMAP` are labels, not headings — and **size is not level**, so a surprise headline at `--ob-h1` is still an `<h3>` and a tripwire heading at `--ob-h3` is still an `<h2>`. Expected outlines:

- **Define:** h1 `What are you building?` (rendered at `--ob-h2`) → h2 `THE BRIEF` (a real `<h2>` wearing `.ob-eyebrow`; the class is styling, the `SectionLabel` component is what emits a `<p>`). After approval the left column becomes `DefineHandoff`, adding h2 `This page is your run.` Transcript turns are not headings.
- **Validate B:** **h1 ×1 · h2 ×6 · h3 ×8 (five dimension heads + three surprise headlines) · h4 ×3 (competitor names)**, in document order with no level skipped — [C17](#c17--heading-outlines-per-route) fixes this outline and A9 builds it. The six `<h2>`s are the *sentences* (`What this evidence can and can't carry.`, `The short version.`, `The five things we looked for.`, `Who is already in this space.`, `Three things we didn't expect.`, `What the web couldn't tell us.`), not the `01`–`06` strings. A9 fixed a page that previously emitted exactly one heading; A15 proves it stayed fixed.
- **Roadmap:** h1 `What to do next.` → **h2 ×2** → **h3 ×11**, per [C17](#c17--heading-outlines-per-route). The two `<h2>`s are the numbered section headings `01 OPEN QUESTIONS` and `02 BUILD ROADMAP`, visible and carrying `.ob-eyebrow`'s styling — **not `sr-only`**, because a visible label that is already the section's accessible name should not be duplicated invisibly. The eleven `<h3>`s are six `OpenQuestionCard` questions, four `RoadmapStep` names ([C5](#c5--the-roadmap-week-model-librun-plants) — four, because the tripwire is not a build step). `RoadmapExit`'s `END OF THE RUN` is a mono label and is deliberately outside the outline.
- **Sources:** h1 `Everything we checked.` → **h2 ×2** (`01 THE RUN`, `02 EVERYTHING WE CHECKED`, visible eyebrow-styled headings) → **h3 ×6**, per [C17](#c17--heading-outlines-per-route). **The `FacetRail` groups *are* headings** — A13 builds the rail as `<nav aria-label="Filter the evidence">` containing six `<section class="ob-facet-group" aria-labelledby>` each led by an `<h3 class="ob-facet-legend">`, because a filter rail is a landmark a screen-reader user navigates by and its groups are how they do it. Assert instead that `.ob-rail` contains exactly six `[role="group"]` and that each one's `aria-labelledby` resolves to a rendered legend with non-empty text. Rows are not headings.

**A15's one permitted markup edit.** Roadmap and Sources open their sections with a numbered eyebrow and no heading, which is a level skip from `<h1>` straight to `<h3>`. Add one `<h2 className="sr-only">` per numbered section in `app/r/[slug]/roadmap/page.tsx` and `app/r/[slug]/sources/page.tsx`, with the eyebrow's own words in sentence case — `Open questions`, `Build roadmap`, `The run`, `Everything we checked`. Four lines, no visual change, and it turns the outline assertion above from aspirational into checkable. Record it in the build log against A11, A12 and A13 so the next person knows why those elements exist.

**Focus rings, verified with real Tab presses.** `el.focus()` does not trigger `:focus-visible` and will tell you there are no focus rings when there are (pitfalls §6). Loop 40 × `browser_press_key Tab` + 80ms, reading `outline`, `outlineColor`, `boxShadow`, `textDecorationLine` and `matches(':focus-visible')` off `document.activeElement`. **Pass: every row shows at least one indicator and every `outlineColor` is `rgb(45, 127, 249)`.** A ring in any other hue is a base rule leaking (pitfalls §2) — likely a Deep Canopy remnant step 4 missed.

**Focus trap and restore.** Open the `EvidenceDrawer` by tabbing to a `CitationChip` and pressing Enter; Tab six times and assert `document.activeElement.closest('[role="dialog"]')` is non-null every time; press Escape and assert focus is back on the originating chip (this is exactly what `onCloseAutoFocus` exists for — with no `Dialog.Trigger` in tree, Radix restores to `<body>`). Repeat for `Modal` and for the `EvidenceOverlay` the header's `EvidenceButton` opens.

**`aria-live="polite"`** on the `FindingStream` container — the console writes a debounced running summary rather than 66 per-item announcements — and on the `MessageStream`'s `sr-only` `role="log"` sibling, which receives one `<p>` per completed turn. Assert the attributes exist and that the transcript log's node count equals the completed-turn count: this is the difference between the run being narrated and being silent.

**The skip link (R19).** `SkipLink` renders inside `RunShell` (A4). First Tab press on any run page focuses it, its computed `top` becomes `>= 0` at `zIndex: 70`; Enter moves focus into `#main`.

**Form labels** on all three inputs: the composer textarea, every `InlineEditableField` input (`aria-label={label}`), and the landing composer.

**The keyboard map, each verified with real presses:** `⌘/Ctrl+Enter` starts a run from the landing composer · `Enter` **sends** and `Shift+Enter` newlines in the `Composer` (deliberately inverted from The Box) · `Enter` commits and `Esc` reverts on an inline editable field · `Esc` closes Drawer, Modal, Popover and the evidence overlay · `←`/`→` walk prev/next evidence in the Drawer **within the active scope, with a position readout** (R13; the scope is `EvidenceProvider`'s and never crosses from verified into discarded — [C9](#c9--discards)) · `Space`/`Enter` toggles an `Accordion` header · `Tab` follows source order and is trapped in Drawer and Modal.

---

### 5. Contrast, re-measured against Obsidian

The blueprint's "Resolved 2026-08-20" note was measured against an amber palette that no longer exists. Compute WCAG 2.1 ratios from `styles/tokens.css` directly and **record the table in the build log**. Expected values, to be confirmed:

| Foreground | on `--ob-canvas` | on `--ob-surface` | on `--ob-void` |
|---|---|---|---|
| `--ob-text` #f4f4f5 | 18.0:1 | 17.3:1 | 18.4:1 |
| `--ob-muted` #8a8a93 | 5.79:1 | 5.56:1 | 5.92:1 |
| `--ob-dim` #5b5b64 | 2.94:1 | **2.83:1** | 3.01:1 |
| `--ob-discard` #4a4a52 | 2.25:1 | — | — |
| `--ob-accent` as text | 5.20:1 | — | — |

Plus `--ob-on-accent` white on `--ob-accent`: **3.81:1**.

Five findings and five rulings:
- **`--ob-muted` passes AA everywhere (worst case 5.56:1).** Body copy is fine.
- **`--ob-dim` fails AA at 12px.** Ruling: `.ob-meta` keeps `--ob-dim` and is permitted only for metadata that is duplicated or non-essential — ids, timestamps, domains, index numerals. **Wherever a mono string is the only place a number appears — the header's `47 VERIFIED`, the funnel counts, a figure's value — it uses the existing `.ob-meta-bright` recipe instead.** Audit every `.ob-meta` call site against that rule.
- **White on `--ob-accent` is 3.81:1** — short of AA for the 14px weight-400 `.ob-btn-primary` label. Neither a heavier weight nor a larger size changes contrast; the only fix is a darker blue, which would replace the design system's single identifying hue. **Ruling: accepted and documented, with the number written down.** Accent-as-text on canvas is 5.20:1 and passes, so the exposure is the primary button's label and nothing else.
- **`--ob-hairline` on canvas is 1.26:1 and `--ob-hairline-strong` is 1.61:1**, both below 1.4.11's 3:1 for meaningful non-text. Accepted, with the mitigation stated as a rule: **no boundary is ever the only carrier of meaning** — a hairline always separates content that is also separated by whitespace and a label.
- **`--ob-discard` at 2.25:1 is deliberate** — a discarded item is meant to stop mattering. [C9](#c9--discards) already settles the consequence: a `DiscardRow` renders its reason through `DISCARD_REASON_LABEL` in **sans `--ob-sm` `--ob-muted`**, with only the `DISCARDED —` prefix in mono `--ob-discard`. A15 measures it and does not restate it. The reasons are sentences; mono carries no sentences.

---

### 6. R18 — OG metadata

Sharing a run is the product's entire distribution model and every shared link currently previews as bare text.

- `app/layout.tsx`: add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')`, `title: { default: 'Groundwork — from a hunch to something you can defend', template: '%s — Groundwork' }`, an `openGraph` block (`type: 'website'`, `siteName: 'Groundwork'`, `url: '/'`, `images: [{ url: '/og/default.png', width: 1200, height: 630, alt: 'Groundwork — an evidence-backed picture of an early idea.' }]`) and a matching `twitter: { card: 'summary_large_image' }`.
- **`app/r/[slug]/layout.tsx` exports `metadata.robots = { index: false, follow: false }`.** The slug is the whole access model — a run indexed by a search engine defeats it entirely. This one line covers all four sub-routes.
- `generateMetadata({ params })` on each run page, awaiting `getBrief` / `getRunSummary` so every string is real: **validate** → title `{one_liner}`, description `47 verified findings from 31 sources. Every claim matched to text on a real page.`, image `/og/validate.png` — **this is the card that actually gets shared, so it gets the most attention** · **define** → `Define — {one_liner}` / `The idea brief for this run. 9 of 12 fields answered.` / `/og/define.png` · **roadmap** → `What to do next — {one_liner}` / **`Six open questions and a four-step build plan.`** / `/og/roadmap.png` · **sources** → `Everything we checked — {one_liner}` / `47 excerpts passed the check. 18 didn't.` / `/og/sources.png`. The roadmap count is [C5](#c5--the-roadmap-week-model-librun-plants)'s and is the same string the run header and the page meta carry; **assert all three read the same** — a shared card that says five while the page says four is the lie D13 removed, republished on the artefact that travels furthest.
- **The images are drawn in code and committed as static PNGs.** An `og:image` pointing at a 404 is worse than no tag. Add dev-only `app/style-guide/og/page.tsx` rendering five 1200×630 frames, each `data-og="<name>"`: `--ob-void` ground, one hairline frame inset 48px, the wordmark top-left in mono, the page's own h1 at 72px weight 400 at `-0.035em`, and a bottom mono meta line (validate's reads `47 VERIFIED · 31 SOURCES · 18 DISCARDED · NO SCORE`; roadmap's reads `6 OPEN QUESTIONS · 4 BUILD STEPS · 1 TRIPWIRE · 12 WEEKS`). Exactly one blue element per card — the `●` on `VERIFIED`. Screenshot each frame with the Playwright MCP at `scale: "css"` targeting the element, save to `public/og/*.png`. No dependency, no route handler, no server pipeline; rule 13 satisfied because a product surface is drawn in code. The `higgsfieldPlan_*` OG entries become upgrades rather than gaps — update their priority tags accordingly.

---

### 7. Automated sanity checks — run this numbered list on every route

1. **Orphan colour literals in inline styles:** `[...document.querySelectorAll('[style]')].map(n => n.getAttribute('style')).filter(s => /#[0-9a-f]{3,8}\b|rgba?\(/i.test(s))` → must be `[]`.
2. **Exactly one visible `.ob-btn-primary`** (top < innerHeight, bottom > 0, opacity ≠ 0).
3. **Nothing but a button wears a pill radius:** collect `borderRadius > 100px` and filter out `.ob-btn*` → must be `[]`.
4. **Zero `box-shadow`** outside the primary button's hover glow and the two snapping focus rings.
5. **Sticky columns not trapped in an overflow ancestor:** walk every `.sticky`/`position: sticky` element's ancestors collecting any with `overflow !== 'visible'` → must be `[]`. Bites hard here: the report's `SectionIndex`, the roadmap's `SegmentedControl`, the explorer's `FacetRail` and the console's left rail are all sticky, and any theme-root `overflow-x: clip` left over from the hero kills all four silently (pitfalls §5).
6. **The motion binary** — the §2 snippet, returning only the three named exceptions.
7. **One easing** — every non-zero `transitionTimingFunction` is `cubic-bezier(0.16, 1, 0.3, 1)`; `linear` on the marquee and the two spinners only.
8. **No unresolved custom property:** for every `--ob-*` name referenced in the stylesheets, assert `getComputedStyle(document.documentElement).getPropertyValue(name).trim() !== ''`. A typo'd property voids its entire declaration with no warning (pitfalls §3).
9. **No orphan `animation:` name:** every `animation` shorthand name in `styles/*.css` has a matching `@keyframes`, and every `@keyframes` in `obsidian-app.css` is `ob-app-`-prefixed and unique across both files ([C1](#c1--stylesobsidian-appcss-the-section-map)).
10. **`--ob-anchor-inset` has exactly one applying rule.** `grep -n 'scroll-margin-top' styles/*.css` returns one hit reading `main [id] { scroll-margin-top: var(--ob-anchor-inset) }` in §1 ([C2](#c2--foundation-ownership)); then click every in-page anchor on the report, the roadmap and the explorer with real clicks and assert each target lands between **130 and 145px** from the viewport top.
11. **The cascade still works:** pick one element per route carrying both a `.ob-` recipe class and a Tailwind spacing utility and confirm the utility won. `marginTop: "0px"` on an element with `mt-8` means a recipe stylesheet lost its `layer()` (pitfalls §1). Run this **after** the deletion, not before.

### 8. Toolchain gate

`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build` · `browser_console_messages level:"error", all:true` returning **0** on every route at 1440 **and** 1280 ([C14](#c14--every-exit-test-ends-the-same-way)). The dev server is forgiving in ways a production build is not — the build is the gate, and it runs even for a pure styling change.

---

### Definition of done, per surface

**Chrome (`RunShell` / `RunHeader` / `StageRail` / `EvidenceButton`)**
- [ ] Header condenses `--ob-header-h` → `--ob-header-h-condensed` at `--ob-base`, and is genuinely fixed with a constant-height spacer (R9)
- [ ] `useScrollSpy`'s `TOP_INSET` is derived from `--ob-header-h`, and its `ids` dependency is a stable identity (R16)
- [ ] `SkipLink` present and first in tab order (R19)
- [ ] Stage state is honest per page, derived from route + `localStorage`, and `progress` only ever adds reachability (D19)
- [ ] `EvidenceButton` opens the explorer from all four pages (D16)
- [ ] Header meta reads `4 BUILD STEPS · 1 TRIPWIRE` on roadmap, matching the page and the OG card ([C5](#c5--the-roadmap-week-model-librun-plants))
- [ ] One `.ob-btn-primary` in view, hover/focus-visible/active/disabled all present, focus ring snaps

**Define**
- [ ] Full-height split, both columns their own scrollport, no page scroll (D9)
- [ ] AI and user turns visibly differentiated by measure, colour, indentation and a hairline — never bubbles (D11, R3)
- [ ] `DontKnowButton` actually mutates the brief and the roadmap's open-question set (D10, R5), through `lib/brief-state.ts`'s settled API ([C4](#c4--the-brief-state-libbrief-statets))
- [ ] One-liner edits persist (R6); the composer never steals focus mid-edit (R7); no hydration mismatch on the seeded turn (R8)
- [ ] `ApproveButton` + `ConsequenceLine` appear at the core-field threshold (D12)
- [ ] Loading skeleton stubs **12** fields and does not shimmer; `?sendfail=1` preserves typed text
- [ ] Keyboard alone completes: type → send → don't-know → edit a field → approve

**Validate — Run Console**
- [ ] ~43s total, first finding inside 6s, no dead tail (D8)
- [ ] Cross-fades into the report over 400ms — the class exists this time (R4)
- [ ] `PhaseStrip` shows elapsed and never a percentage; discard count present in both the rail and the meta line
- [ ] `aria-live` narration on the finding stream, debounced, not per finding
- [ ] `?stall=1` reaches the stalled state and shifts nothing
- [ ] Under reduced motion the report renders directly at t=1200ms — `.ob-console` never mounts

**Validate — Report**
- [ ] Editorial two-column at `580 / 400` gap `100` inside `--ob-container-report` (D5)
- [ ] `EvidenceState` band opens the page; no verdict, no score, no gate anywhere (D7)
- [ ] Every figure is citation-linked and hand-drawn; **no charting library present in `package.json`** (D6)
- [ ] `CapabilityMatrix` renders the idea as a fourth **column** in the `CLAIMED` / `—` register with no marks ([C7](#c7--capabilitymatrix)); the ROI gap reads **10–20×** and `0 of 9` is the only lead callout ([C11](#c11--figure-numbers-settled))
- [ ] Section numerals `01`–`06` are chalk, not blue; every blue thing on the page names one of the three jobs
- [ ] Correct outline: **h1 ×1 · h2 ×6 · h3 ×8 · h4 ×3** ([C17](#c17--heading-outlines-per-route)) — the page no longer emits a single heading
- [ ] `?thin=1` still reorders correctly; the page ends pointing forward into the roadmap

**Roadmap**
- [ ] Time-scaled `WeekAxis` with four `PlanBar`s over a 12-week horizon, asserted as **ratios**; `TripwirePanel` lifted off the axis and unnumbered (D13, [C5](#c5--the-roadmap-week-model-librun-plants))
- [ ] Dependency pulse exists on `ob-app-pulse` (R2) and fan-out reads as weight, to [C6](#c6--openquestion-priority-brief-link-fan-out)'s numbers (D14)
- [ ] Collapsed questions wrap in full — no `nowrap`, no ellipsis — and expanding a card keeps its own question visible (R15)
- [ ] `SurveyBlock` rows present where a survey fits
- [ ] `Copy script` yields clean plain text: numbered questions only, no markdown, no labels, no attribution

**Sources**
- [ ] `FacetRail` with six live-counted groups; counts computed against every group except their own (D15)
- [ ] The 18 discards are real records rendered through `DISCARD_REASON_LABEL` in sans `--ob-muted` ([C9](#c9--discards)), and they open the drawer within the filtered scope
- [ ] **Rows stagger on mount only, capped at 12; nothing animates on a facet change (R17)**
- [ ] Drawer `←`/`→` respect the active scope and show a position readout (R13)
- [ ] `role="button"` never wraps an `<a>` (R12)
- [ ] Empty-facet state reachable and correct, on A13's single copy block

**Supporting surfaces**
- [ ] Invalid run, root 404, root error, roadmap error, sources error all Obsidian, all with the exact copy, **no red anywhere**
- [ ] Four loading skeletons match their final shapes within 8px, and none of them animates
- [ ] `/style-guide` renders the full kit including every figure with real data and a citation
- [ ] Every shared link previews as a real 1200×630 card; run pages are `noindex`

**Exit test:** run `references/verification.md` §1 end to end, all nine steps, on all ten routes at 1440 **and** 1280 — look, measure, tab with real key presses, probe hover mechanically, emulate reduced motion, repeat at the second width, console clean. Then do the whole product journey once by keyboard alone with reduced motion on: `/` → type an idea → ⌘↵ → Define → send a turn → press Don't know → edit a brief field → Approve (no auto-redirect; take the button) → the report renders directly → Tab to a citation chip → Enter → walk evidence with `←`/`→` → Esc back onto the chip → Roadmap → expand Q03 → copy its script → Sources → apply two facets → open a discard → clear them. **Record in the build log: the step-0 vs step-8 baseline diff for all ten routes, the full contrast table with its five rulings, the motion inventory with its three named exceptions and its three retunes, the `@keyframes` prefix audit, the four sr-only `<h2>`s and why they exist, the `the-box.tsx` decision, and the reduced-motion element counts.** Measured numbers, not screenshots — a screenshot proves a thing looks right and this phase is entirely about whether rules applied. Close with `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, and zero console errors at both widths ([C14](#c14--every-exit-test-ends-the-same-way)).

---

## Session boundaries

| Session | Phases | Ends with |
|---|---|---|
| 1 | A0, A1 | The app renders Obsidian tokens globally; every new schema field is parsed and tested. Nothing looks finished yet. |
| 2 | A2, A3 | `/style-guide` renders the full Obsidian kit including every figure with real fixture data. |
| 3 | A4, A5 | The chrome is done and the evidence layer works on every route. Page bodies are still Deep Canopy. |
| 4 | A6, A7 | Define is finished, including a working Don't-Know Button. |
| 5 | A8 | The Run Console is finished and re-timed. |
| 6 | A9, A10 | The Report is finished, including the whole figure layer. |
| 7 | A11, A12 | Roadmap is finished. |
| 8 | A13 | The Evidence Explorer is finished. |
| 9 | A14, A15 | Supporting surfaces, then the sweep: Deep Canopy deleted, OG cards, a11y and reduced-motion verified. |

A9 + A10 is the heaviest pairing and may want a session each.

---

## Build log

Append one entry per phase. Note deviations, deferrals, and decisions the next
session needs.

<!-- Format:
### A0 — 2026-08-21
- Decision: …
- Deviation: …
- Deferred: …
- Verified: …
-->

### A0 — 2026-08-21 — Foundation: global Obsidian, layering, naming

**Shipped.** `styles/tokens.css` `[data-theme="obsidian"]` → `:root` with the
ten C2 tokens appended under an `App surfaces` banner · `styles/globals.css`
now imports `components.css`, `obsidian.css` and the new `obsidian-app.css`
into `layer(components)` in that order, carries the two R22/R23 base overrides,
and has lost `border-radius` from the global `:focus-visible` ·
`styles/obsidian-app.css` created with all sixteen C1 banners, §1 filled, §16
seeded · `data-theme` on `<html>` and removed from `app/page.tsx`'s wrapper ·
`lib/content/app.ts` created · the five D2 rename sites.

**Deviation — `/style-guide`'s metadata title.** The phase body says set it to
`'Style Guide — Groundwork'`, but the root layout now carries
`title.template: '%s — Groundwork'`, which would render
`Style Guide — Groundwork — Groundwork`. Shipped as `title: 'Style Guide'`,
which resolves to the string the exit test asserts. **Any future page-level
`metadata.title` in this app is a bare page name, never suffixed** — the
template supplies the suffix. `app/layout.tsx` is the only file that spells the
product name in a title.

**Deviation — exit test 4's uniqueness assertion, amended.** The test asks that
exactly one stylesheet rule set `scroll-margin-top`. Four do. Only one of them
is A0's, and it is the only rule anywhere that reads `--ob-anchor-inset`:

| Selector | Value | Where | Disposition |
|---|---|---|---|
| `main [id], #main` | `var(--ob-anchor-inset)` | `obsidian-app.css` §1 | A0's. The one C2 permits. |
| `.report-section` | `var(--sp-24)` (96px) | `components.css:1562` | Deep Canopy debt. A9 rewrites the markup; A15 deletes the file. |
| `.roadmap-section` | `var(--sp-24)` (96px) | `components.css:1713` | Same, A11 / A15. |
| `.scroll-mt-24` | Tailwind utility | generated | `components/style-guide/section.tsx:16` only — a dev surface, on no run route. |

The two `components.css` rules are specificity (0,1,0) against `main [id]`'s
(0,1,1), so they lose everywhere it applies; **measured, all 18 anchored
elements inside `<main>` on `/validate` compute `136px`.** A0 deliberately did
not edit them — its "Not built" list forbids touching those page bodies, and
they die with the markup. **A9, A11 and A15 must delete them rather than
rediscover them.** The assertion that actually protects C2, and the one to run
from here on, is: *exactly one rule reads `var(--ob-anchor-inset)`*.

**Deviation — banner grep.** The three standing facts in `obsidian-app.css`'s
header were written as a numbered list, which the exit test's
`grep -cE '^   [0-9]+\. '` counted as banners (19, not 16). Re-set as bullets;
the grep now returns exactly 16. **Do not renumber that header list back.**

**Ritual output (Standing rule 4).**
- Used-but-undefined `--ob-*`: `--ob-reveal-delay`, `--ob-word-delay`. **Both
  are expected and neither is a token** — they are set inline from JS by
  `.ob-reveal` and the landing word-reveal. Every other `--ob-*` resolves.
- Every `animation:` name (`ob-blink` `ob-cue` `ob-drift` `ob-drift-alt`
  `ob-marquee` `ob-pulse`) has a matching `@keyframes`.
- `obsidian-app.css` declares no `@keyframes` yet, so the `ob-app-` prefix
  check is clean by construction.

**R2/R3/R4 baseline — all twelve classes read `0` occurrences in `styles/`,
unchanged by A0:** `timeline-node` · `timeline-node--accent` ·
`timeline-node--pulse` · `card--pulse` · `composer` · `composer--streaming` ·
`message-text` · `message-text--ai` · `message-text--user` · `query-glyph` ·
`finding-card--entering` · `report-cross-fade`. A6, A8, A11 and A12 each prove
they closed their own.

**Verified in the browser** at 1440×900 and 1280×800 against `next dev`:
1. `/`: `body` and `h1` both `Geist`, no `Inter`; `h1` weight `400` (**R22
   closed**); `html` background `rgb(10, 10, 11)`, `body` `rgba(0, 0, 0, 0)`
   (**R23 closed**). Per-class tracking survives the base override —
   `.ob-display` still computes `-3.63px` at `103.68px`, `.ob-h1` `-1.99px` at
   `66.24px`, which is why that rule has to sit in `@layer base`.
2. **R1 closed, measured:** the `.section-label mb-0` probe reads `0px`
   (`16px` before); the `.ob-body mt-8` control reads `32px`.
3. All ten C2 tokens resolve at their stated values.
4. Anchor inset `136px` on all 18 anchored elements and on `#main`; one rule
   reads the token.
5. Container content boxes measure **1280 · 1000 · 1120** exactly.
   `.ob-container` is untouched, so C5's week-axis ratios are safe.
6. `obsidian-app.css`: 16 banners, titles matching C1 in order, zero
   declaration blocks in §2–§15.
7. All six routes return 200 with `data-theme="obsidian"` on `<html>`; no
   horizontal overflow, no offscreen node, no sub-4px control at either width.
   Wordmark reads `Groundwork`; `/style-guide` tab title reads
   `Style Guide — Groundwork`.
8. `npx tsc --noEmit` clean · `npm run lint` clean (174 files) · `npm test`
   **39/39** unchanged · `npm run build` clean · zero console errors at 1440
   and 1280 on every route.

**Note for the next session — a dev-server trap that cost time here.** Adding a
new file to an `@import` chain does **not** invalidate Turbopack's dev CSS
cache. A long-running `next dev` kept serving
`Can't resolve './obsidian-app.css'` as a 500 on every route long after the
file existed, while `npm run build` compiled clean. **If a stylesheet edit
appears not to exist, kill `next dev`, `rm -rf .next`, restart** — do not go
looking for a cascade bug.

**Interim state, on purpose (A0).** The four run pages now render near-black ground
and Geist with Deep Canopy's green cards, light-blue section labels and
amber-era borders on top, and `DisplayHeadline` still renders weight 700. They
look half-ported. That is A0's correct output and must not be "fixed" by
re-scoping anything — A2 reshapes the primitives, A6–A13 the page bodies.

---

### A1 — 2026-08-21 — Data layer: schemas, fixtures, derivations

**Shipped, complete.** All five schema files · `lib/fixtures/queries.ts` and
`lib/fixtures/discarded.ts` (new) · facts on 20 findings · the report's
capabilities / cited surprises / structured unanswered / `dimension` key · the
roadmap's ids, kinds, week spans, priority, effort, `brief_field` and Q04
survey · the D8 re-timing · `lib/brief-state.ts` · the three analytics modules ·
`getDiscarded` · `RUN_STREAM_WINDOW_MS` · the R14 sweep · the typecheck tail.
**Tests: 7 files / 39 assertions → 13 files / 102.**

**Every contract number is the fixture's number.** Printed from the real
derivations and compared to C5, C6, C7, C8, C10 and C11 line by line — all
match, none needed a fixture correction:

```
C5  planHorizon        12
C5  spans              S01 W1-2 · S02 W3-6 · S03 W7-11 · S04 W12-open
C6  fanOut             Q01 2 · Q02 1 · Q03 1 · Q04 2 · Q05 1 · Q06 3
C11 priceLadder        band 150-250 · point 199 · point 299 · threshold 300
C11 roiGap             10.05x - 20.10x  (lost 2000-4000 vs cost 199-299)
C8  runFunnel          19 40.43% · 31 65.96% · 47 100.00% · 18 38.30%
C11 numberCallouts     9
C10 evidenceState      strong PROBLEM/WHAT_EXISTS/MONEY · thin PRACTICAL
                       · contested PROBLEM/MONEY  (DEMAND_SIGNALS in none)
C10 citationCoverage   24 cited / 23 uncited
C10 stanceOverall      25 supports · 15 neutral · 7 contests
C10 domains            29 — capterra-like 5, billingtalk 3, smallpracticeforum 3
C7  matrix             5 keys · 3 competitors · idea 3/5 claimed
                       · citations 15,16,17,18,19,23,24
    summary            19 · 31 · 29 · 47 · 18 · 2025-01-08 · 2025-12-04
```

**Timing checkpoints, exact:** `phase verifying` **3,260ms** · first
`finding.verified` **3,880ms** · `runEventsTotalMs` **45,080ms** · longest
single `delayMs` **940ms** · 3,120ms of findings-and-writing after the last
discard.

**Three C10 signature amendments.** C10 says a figure needing a different shape
changes A1's signature rather than growing a second spelling. Three did:

1. **`recencyTicks(evidence, report, dimension?)`** — C10 spelled it
   `(evidence, dimension?)` but requires each tick to carry `cited`, which
   only the report can answer. The report is now the second argument.
2. **`fanOut(roadmap): Record<string, RoadmapStep[]>`** — C10's type said
   `RoadmapPhase[]` while its own comment said "the steps naming it", and A11
   is specified to partition the result with `isOnAxis(step)`, which a phase
   enum cannot satisfy. The comment was right; the type was a slip.
3. **`computeRunSummary(evidence, events, discarded)`** now throws if the
   discard corpus and the event log disagree on the count, rather than
   silently preferring one.

**`citationCoverage` — where 24/23 actually comes from, pinned.** The contract
gives the split but not the input set, and the obvious reading (every `[n]`
anywhere in the report) yields **30/17**. The 24/23 the contract states is
**summary + the five dimension paragraphs only** — the report's *running
prose*, excluding the surprises panel and the capability cells. That is also
the semantically right set: the sole consumer of the inverse is `EvidenceRail`,
which hangs under a dimension's paragraph and surfaces what that paragraph
didn't quote, and a citation buried in a matrix cell is data a reader can look
up rather than prose that used the finding. **Documented on
`reportCitationNumbers`; A9 and A13 must not widen it without re-deriving the
number.**

**Deviation — one test name.** The plan lists
`it('has no discard in the final four seconds')`, but the pinned
`DISCARD_AFTER_VERIFIED` array ends at verified 45, leaving a **3,120ms** tail
(two findings + the writing beat). The two are inconsistent: reaching a 4s tail
would need the array to end at 43. The constants win — they reproduce all three
pinned checkpoints to the millisecond — so the test ships as **`has no discard
in the final three seconds`** and the prose number was loose. Every other
`it()` name in the phase body is present verbatim.

**Deviation — `EV_43`'s fact is unflagged and that is correct.** It is a
20% marketplace revenue share, a business-model fact rather than an evidence
callout; the plan's own table leaves it unflagged and the nine flagged findings
are exactly C11's nine. 28 facts across 20 findings; 9 carry `callout: true`.

**New rot, found by A1's exit test — logged as R24, not fixed here.** Driving
the freshly-approved state raises a **hydration mismatch on `/validate`**:
`ValidateView` does `useState(() => isRunStreamActive(slug))`, which reads
`localStorage` — `false` on the server, `true` on the client — so the server
renders the report and the client regenerates the console. Same class as R8.
Confirmed pre-existing: `git diff` shows A1 touched neither
`components/validate/validate-view.tsx` nor `app/actions/create-run.ts`, and
only changed the *duration* inside `isRunStreamActive`. **A8 owns this
surface** — added to the rot table.

**Two `getDiscarded` call sites are owed**, and neither exists yet:
`app/r/[slug]/layout.tsx` (**A4**, so `EvidenceProvider` can hold the records —
C9 puts discard rows in the drawer) and `app/r/[slug]/sources/page.tsx`
(**A13**). A1 creating the query and nobody calling it was the single most
consequential gap in the first draft; it is now written down in both phases'
direction.

**Verified in the browser** (Playwright MCP, `next dev`, freshly-approved
state at 1440 and 1280): findings arrive **one at a time every 750–900ms** with
no interval above 1.2s, the discard counter reaches **18**, the run reaches
**47** and cross-fades to the report at **≈45s**.

*A measurement trap worth not repeating:* `.finding-card-header` exists in
**both** the console stream and the report's accordions, so a poll that reads
it across the cross-fade appears to show 47 cards arriving early followed by a
20-second stall. That is the selector, not a dead tail — scope the selector to
the console subtree, or trust `run-events-timing.test.ts`, which reads the
event log directly.

**Not done here, by design:** `lib/hooks/use-brief-state.ts` is A7 — A1 shipped
only the pure module beneath it, complete to C4. Every figure consuming these
derivations is A3. The console's use of the discard records is A8.

---

### A2 — 2026-08-21 — Primitives I: the Obsidian app kit

**Shipped.** `obsidian-app.css` §2 and §3 filled, plus A2's three end states in
§16 · all 29 `components/ui/` files re-authored · `fragment.tsx` created ·
`orb.tsx` and `recent-runs-list.tsx` moved to `components/ui/` · all six
`components/status/` · the six `components/layout/` primitives A2 owns ·
ten files deleted · the style guide rewritten and re-pointed at
`lib/db/queries.ts`.

**Deletions, complete:** the whole of `components/entry/` (6 files, after the
two live ones moved out) · `two-column.tsx` · `landing-nav.tsx` ·
`footer-panel.tsx` · `components/style-guide/sections/entry.tsx`.

**`TwoColumn`'s third call site was real and would have broken the build.**
`app/r/[slug]/define/loading.tsx` is a file no phase reads until A14; C13 flags
it and it was there. All three sites now carry an inline grid and a comment
naming the phase that re-lays them out (A6, A9, A14).

**`the-box.tsx` deleted here, not in A15 — and it carried two behaviours the
landing composer does not.** Recorded so A15 can decide whether to reinstate
them on `components/landing/cofounder-chat.tsx`:
1. a `sessionStorage['sv.box.draft']` mirror, so a half-typed idea survived a
   reload;
2. a live character count.

**`.ob-meta-bright` was NOT redeclared.** C1's §2 class list names it, but it
already exists in `obsidian.css` §5 and this file never redeclares a landing
class. `MetaLine`'s `tone='bright'` composes the existing one.

**One class beyond C1's lists: `.ob-recent-row`.** `RecentRunsList` needed a
hover/focus treatment and had a Deep Canopy class with no Obsidian equivalent.
Declared in §2 rather than left undefined (rule 4).

**A correctness fix worth carrying forward.** `Wordmark` initially put
`.ob-wordmark-glyph` on a wrapper `<span>`. That class animates `transform`,
which **does not apply to a non-replaced inline element**, so the 90° hover
rotation would have silently done nothing. `LogoMark` now takes a `className`
and the class goes on the SVG. `components/landing/site-nav.tsx` still inlines
its own copy of the mark and is untouched, per A2's scope — **A4 dedupes it.**

**Disposition notes the later phases need:**
- `Card.featured` → `Card.verified`, and it now means *verified*, not
  *important*. Five call sites dropped to plain `Card`, each with a comment
  naming the phase that re-decides its emphasis: `open-question-card` (A11),
  `surprise-panel`, `thin-evidence-notice`, `unanswered-section` (A9), and the
  style guide.
- `Button` variant `secondary` → `ghost`; all call sites swept.
- `TextArea` variant `hero` → `composer`.
- `SectionLabel` is now a `<p>`, takes an optional `index`, and **renders no
  brackets**. All 16 call sites checked for paragraph nesting.
- `StatusBadge` has **zero call sites** after `FooterPanel`'s deletion. Kept
  because A14 decides whether `RunFooterBar` carries it; if not, A15 deletes it.
- `Fragment` has **exactly one consumer, the style-guide gallery**. No page
  phase's Build list names it. If nothing adopts it by A15, it is dead code.
  This is an open item, not a promise.

**Not this phase, correctly:** `RunShell`, `RunFooterBar`, `StageRail` and
`SectionIndex` still emit their Deep Canopy classes. They are chrome, they carry
R9 and R16, and A4 owns them in §5.

**Verified in the browser** at 1440×900 and 1280×800 on `/style-guide`:
1. **Cascade:** `.ob-card mt-8` reports `marginTop: 32px` — the new stylesheet
   is layered.
2. **Tokens read back:** `.ob-card` `rgb(16,16,18)` / border `rgb(35,35,38)` /
   radius `10px`; `PageContainer` `app` 1360, `report` 1080; `.ob-prose` 580.
3. **Shadow audit:** zero elements under `#ui-atoms` compute a `box-shadow`
   outside `.ob-btn`.
4. **Pill audit:** zero elements with radius > 100px outside `.ob-btn`.
5. **Blue audit — the one that matters.** Five accent hits under `#ui-atoms`,
   all legal: four `.ob-btn-primary` and one `.ob-toggle[aria-pressed="true"]`.
   No `ConfidenceNote` bar, no `CoverageBar` fill, no `SectionLabel` numeral, no
   `RestIndicator` dot.
6. **Focus:** 12 real `Tab` presses; every stop shows a `solid rgb(45,127,249)`
   outline, `boxShadow: none`, and **`transitionDuration: 0s`** — the ring
   snaps. (The width reads 1.6px, not 2px: the harness browser sits at 1.07
   zoom. The declared value is 2px.)
7. **No bracket in any `.ob-eyebrow`.**
8. **R21 closed, measured.** Forced to a 180px container, a `MetaLine` wraps to
   96px across six lines with `textOverflow: clip` and
   `scrollWidth <= clientWidth` — the full text is visible. The old `.meta-line`
   would have clipped it to one line.
9. **Keyframes resolve:** `.ob-skeleton`/`.ob-rest-dot`/`.ob-spinner` report
   `ob-app-shimmer`/`ob-app-rest`/`ob-app-spin` with non-zero durations, **and**
   `.ob-skeleton`'s `backgroundPosition` moves `28.14% → -73.94%` over 400ms —
   proving the `@keyframes` exist rather than just the name.
10. **Reduced motion:** skeleton and rest-dot report `animationName: none` at
    `opacity: 1`; the spinner keeps rotating, by design.
11. `/`'s `.ob-wordmark-glyph` still measures **15×15** — the `LogoMark`
    refactor didn't move the landing nav.
12. `grep -rn "TwoColumn"` returns only the three explanatory comments; no
    reference to `components/entry/` survives; all six routes return 200.
13. Zero console errors at 1440 **and** 1280 · `npx tsc --noEmit` ·
    `npm run lint` (177 files) · `npm test` **102/102** · `npm run build`.

**Two observations logged, neither fixed here:**
- **`/` has two `.ob-btn-primary` in its first viewport** — the nav's `Start`
  and the hero's `Start with an idea`. That is standing rule 11, and it is
  pre-existing: A2 touched nothing on the landing page. **For A15.**
- **Four brackets still render inside `.ob-prose`**, all from page-owned
  components A2 does not touch: `[01]` on `FindingCard`'s row variant (A5) and
  the roadmap question numerals (A11). A2's half of the bracket monopoly —
  nothing *it* owns renders one — holds; A5 closes the rest when `.ob-cite`
  lands.

---

### A3 — 2026-08-21 — Primitives II: the figure kit

**Shipped.** `obsidian-app.css` §4 in full · `components/figures/` — `Figure`
(+ `assertFigureSourced` + `FIG_H`) and all twelve marks · a new
`FiguresSection` on `/style-guide`, rendering every mark from the real fixture
through `lib/db/queries.ts` · `tests/unit/figures.test.ts` (7 assertions).
**No `'use client'` anywhere in `components/figures/`**, and §4 declares no
`@keyframes` — nothing in the kit moves in this phase.

**Four marks overflowed their reserved height, and the marks were fixed, not
the numbers.** This is exactly what exit test 1 exists to catch, and it caught
it on the first run:

| Mark | Declared | First measured | Fix |
|---|---|---|---|
| `RecencyStrip` | 64 | 64.8 | bounds `margin-top` 4→3, `line-height: 1.2` |
| `GapBar` | 180 | 195.8 | row gap 18→12, ratio `line-height: 1.1` |
| `CapabilityMatrix` | 260 | 287.4 | explicit row heights (34 + 5×44 + 6 rules), cell padding to `0 12px`, head `nowrap` |
| `DimensionStrip` | 140 | 142 | column gap 10→9 |

All thirteen marks now measure **exactly** their `--ob-fig-h` at 1440 **and**
1280. A9 can reserve against `FIG_H` and trust it.

**`FIG_H.domains` returns 444 on this fixture, not the 396 the plan states.**
The phase body gives both the formula (`44 + rowCount * 28 + (tailCount ? 36 :
0)`) and the result ("**396** on this fixture's thirteen rows plus a tail"), and
they are inconsistent: 13 rows plus a tail is `44 + 364 + 36 = 444`, and no
integer row count yields 396 under that formula. **The formula is
authoritative** — it is the code the plan tells you to type, and the gallery
measures 444/444. A13 should reserve from the function, never from the literal.

**One real formatting bug, found by the numbers scrape.** `ValueLadder`'s band
rendered `$150/mo–250` — `formatMoney` appended the unit to the *low* value and
then concatenated the high. A range now carries no unit suffix at all
(`$150–250`), because the axis and the point rungs already establish `/mo` and
`$150/mo–250/mo` reads as two prices rather than one band. That is also the
spelling C11 settles on.

**Two marks were rendering outside a `Figure` and now are not.** `NumberCallout`
and `WeekAxis`/`PlanBar` were placed bare in the first draft of the gallery.
"Nothing draws outside one" is a real constraint — an unwrapped mark has no
reserved height and no citation footer — so both are wrapped. That took the
measured mark count from 10 to 13.

**Verified in the browser** at 1440×900 and 1280×800 on `/style-guide#figures`,
every mark rendered from real fixture data:
1. **Reserved height:** all 13 `.ob-fig-mark`s equal their `--ob-fig-h` exactly,
   at both viewports.
2. **Blue audit:** exactly **two** accent elements in the whole section, both
   `.ob-funnel-bar-verified` (compact and expanded). Nothing else in the figure
   layer is blue.
3. **Stance treatment:** `.ob-stance-contests` computes
   `backgroundColor: rgba(0,0,0,0)` with a `repeating-linear-gradient` and a
   `rgb(244,244,245)` border; `.ob-stance-supports` is chalk. **A red-dominant
   scan (`r > g+40 && r > b+40`) returns empty.**
4. **Marker classes populated:** 40 `.ob-fig-value` (≥20 required) and 23
   `.ob-fig-bar` (≥12) — no vacuous pass for A10 or A14 to inherit.
5. **The numbers are the settled ones.** All thirteen required values present —
   `14.2%` `0 of 9` `$150–250` `$199/mo` `$299/mo` `~$300/mo`
   `$2,000–4,000/mo` `$199–299/mo` `10–20×` `19` `31` `47` `18` — and **none**
   of `$3,000` `$200` `15×` `6.7×` `13.4×`.
6. **Funnel axis:** bar widths over the track measure `0.4042 · 0.6595 · 1 ·
   0.383` against an expected `19/47 · 31/47 · 1 · 18/47` — inside 0.5% in both
   variants, at both viewports.
7. **Week axis, ratios not pixels:** 12 ticks; **4** `.ob-plan-bar`s, never 5;
   left/width ratios `0/0.1667 · 0.1667/0.3333 · 0.5/0.4167 · 0.9167/0.0833`,
   each exactly `(start-1)/12` and `duration/12`. The open-ended bar reports a
   non-`none` `maskImage` **and** the conditional hatch; no bar carries the
   tripwire's label.
8. **The idea column is a different register:** zero
   `.ob-cell-yes/-partial/-no` inside `THIS IDEA`, cells read only `CLAIMED` or
   `—`, and the `NOT EVIDENCE` chip is present.
9. **No chart furniture:** the only elements computing `--ob-grid` inside a mark
   are `.ob-ladder-axis`, `.ob-fig-baseline`, `.ob-week-axis` and
   `.ob-week-tick`.
10. **Numerals:** `font-variant-numeric: tabular-nums` inherited from `.ob-fig`
    — declared once, cannot be forgotten per figure.
11. **SVG strokes:** all **48** `.ob-recency line`s carry
    `vector-effect="non-scaling-stroke"` and compute `1px`, with the SVG
    rendering at 1280 against a 1000-unit viewBox — a 1.28× x-scale that would
    smear the hairline without it. *Note for later phases:*
    `getBoundingClientRect()` on a vertical `<line>` returns width 0; assert
    `getComputedStyle().strokeWidth` and the attribute instead.
12. **Every figure is sourced in the DOM** — zero `.ob-fig` without a
    `.ob-fig-cite-n` or a `.ob-fig-cite-link`.
13. **Nothing moves, under either setting:** `animationName` is `none` for every
    element under `#figures` with reduced motion **and** without it. Under
    reduce every element reports `1e-06s` — that is obsidian.css §16's universal
    blanket, not a per-element transition; under `no-preference` the only real
    transition in the section is `.ob-dimstrip-col`'s 0.18s hover colour.
14. `npx vitest run tests/unit/figures.test.ts` — 7/7: `assertFigureSourced`
    throws for `{citations: [], source: undefined}`, passes for either
    alternative, and `barShare` / `ladderGutters` are pinned.
15. Zero console errors at both widths · `npx tsc --noEmit` · `npm run lint` ·
    `npm test` **14 files / 109 tests** · `npm run build`.

**For the phases that compose these:** `Figure`'s `stance='challenges'` prop is
built and gives the mark the contests treatment plus a chip — **A10 wires it for
the `18%` counter-signal, it does not need to widen anything.** `RunFunnel`'s
`children` slot is where A13's per-row reason breakout goes.
`DomainConcentration` takes `onToggleDomain`/`activeDomains` for A13's facet,
and its pressed state already lives on the label and hairline, never the bar
fill.

---

### A4 — 2026-08-21 — Run chrome: sticky header, honest stage state

**Shipped.** `obsidian-app.css` §5 in full · `RunHeader` · `RunIdentity` ·
`RunMain` · `EvidenceButton` · `EvidenceOverlay` · `AppBackdrop` · `RunShell`
rewritten (still a server component) · `StageRail` rewritten as a client leaf ·
`Wordmark` gains `size` · `site-nav.tsx` dedupes onto it · `RunFooterBar`
restyled · `SkipLink` mounted and adopted by `app/page.tsx` · `lib/run-stage.ts`
re-signed · `use-run-progress.ts` · `use-scroll-spy.ts` (R16 + derived inset) ·
`APP_CHROME` · the run layout's one `Promise.all` with `getDiscarded` wired ·
`AppBackdrop` on all four pages.

**Deviation — the derivation order in the phase body is wrong; the test cases
are right.** The body says *"`k === segment` → `'active'`; `!reach[k]` →
`'locked'`; otherwise `'done'`"*, but its own pinned case
`('define', 'validate', null)` → validate `'locked'` is unreachable under that
order — the segment check fires first and returns `'active'`. **Reachability is
tested first**, then "you are here". Standing on an unreachable segment does not
unlock it, which is the whole of the cold-link floor. All seven cases and the
monotonicity property pass.

**Deviation — `Wordmark`'s `size` is the *word's* type size, not the glyph's.**
The body gives `md → 18px, sm → 16px` while the exit test requires `/`'s glyph
to still measure 15×15. `.ob-wordmark` is 18px today, so `size` is the font
size; the glyph stays `LogoMark`'s 15 at both. Measured: `/` unmoved.

**Deviation — the header ledger spans all three columns.** `RunIdentity` renders
both of its lines as the body specifies, but `.ob-run-identity` is
`display: contents` so the header grid places them independently: the top line
in column one, the `MetaLine` across `1 / -1`. Measured at 1440, the roadmap
ledger is ~640px against a ~440px column, and `.ob-run-meta`'s 18px clip turned
the wrap into a **silently truncated ledger** reading only
`RUN … · RESEARCHED 14 AUG 2026`. `MetaLine` wraps and does not truncate (R21);
the fix is to give it the width it needs, never to put the `nowrap`/ellipsis
triple back.

**Deviation — §5 gains one rule C15's quote omits:
`.ob-app:has(> main[data-chrome='surface']) { height: 100vh }`.** Surface mode
needs the shell **pinned**, not merely floored. §1's
`.ob-app { min-height: 100vh }` lets a tall child grow the column, and
`.ob-app-main`'s `flex: 1` resolves to `flex-basis: 0%`, **which overrides
`height` on the main axis** — so C15's `height: calc(100vh - var(--ob-header-h))`
is ignored on its own and `main` stretches to its content. Measured 1110px
against an expected 828px until this landed. A6's `min-height: 0` is necessary
and was not sufficient.

**`overflow-x: clip` removed from the theme root.** A0 moved `data-theme` to
`<html>`, which silently promoted `[data-theme="obsidian"] { overflow-x: clip }`
to the document root — pitfalls §5's exact trap, and A4's note predicted it. The
two elements that actually overflow clip themselves already (`.ob-hero` is
`overflow: clip`, `.ob-marquee` is `overflow: hidden`), so it was removable
rather than needing re-scoping. Verified: `scrollWidth === clientWidth` on every
route, and the ancestor walk from `.ob-run-header` returns **zero** non-`visible`
overflow ancestors. **A9's sticky `SectionIndex` depends on this staying gone.**

**Blue, named out loud.** Two accent elements in the chrome and no others: the
active stage's 1px `border-bottom` and its node (job three, live/active), and
`.ob-evidence-btn-mark`'s 6px square (**job two, verification**).

**`EvidenceOverlay` restores focus itself.** With no `Dialog.Trigger` in the
tree Radix lands on `<body>`; `openExplorer` records the trigger and
`onCloseAutoFocus` puts focus back. Measured: Esc returns to `.ob-evidence-btn`.

**Verified in the browser** at 1440×900 and 1280×800:
1. `.ob-run-header` `top: 0` at scroll 0, 400 and 1500; height `72px` → `56px`;
   `dataset.scrolled` `"true"`; `borderBottomColor` `rgb(35, 35, 38)`;
   `backdropFilter` `blur(14px)`.
2. **Zero shift:** spacer `72px` at both scroll positions and
   `main.top + scrollY` byte-identical (72 → 72).
3. **Cascade:** `.ob-run-actions` carries `gap-3` and computes `columnGap: 12px`.
4. A0's four tokens read back `72px · 56px · 1360px · 136px`;
   `#dimensions`'s `scrollMarginTop` is `136px`, unchanged by this phase.
5. **Tab order, twelve real key presses:** SkipLink → Wordmark → Define →
   Validate → Roadmap → EvidenceButton → CopyLinkButton, every stop showing a
   `rgb(45, 127, 249)` indicator at `transitionDuration: 0s`. First Tab brings
   `.ob-skip` to `top: 0` at `zIndex: 70`.
6. Stage states across the four routes: `['active','done','done']` ·
   `['done','active','done']` · `['done','done','active']` ·
   `['done','done','done']` with **zero** `[aria-current="page"]` on `/sources`.
7. Header meta: `4 BUILD STEPS` and `1 TRIPWIRE` on `/roadmap` (**no**
   `5 BUILD STEPS`); `18 DISCARDED` and `29 DOMAINS` on `/sources`;
   `EvidenceButton`'s `aria-label` reads exactly
   `Open evidence — 47 verified, 18 discarded`.
8. One `.ob-backdrop` per route with a non-empty `data-variant`; `/define`
   reports `data-chrome="surface"` with the footer at `display: none`;
   `/validate` reports `document` with a visible footer.
9. Cold-link floor: `localStorage` cleared, `/define` reloaded — zero
   `.ob-stage[data-state="locked"]`, zero hydration errors.
10. **R16 closed, measured:** scroll-listener registrations stay at 4 after
    mount **and after five `SectionIndex` clicks**.
11. `EvidenceOverlay` opens at `inset: 0` on `--ob-canvas` with 47 rows,
    `aria-expanded` flips, Esc closes and restores focus.
12. `/` untouched: glyph still 15×15, wordmark 18px reading `Groundwork`, nav
    still condenses 1200 → 940 with the scrim.
13. `npx tsc --noEmit` · `npm run lint` · `npm test` **112/112** ·
    `npm run build` · zero console errors at both widths.

**Owed to A6, and honest about it:** `/define`'s
`scrollHeight <= innerHeight + 1` could not pass in A4 — the interim Deep Canopy
body overflowed `main`. It passes as of A6.

---

### A5 — 2026-08-21 — Evidence system: chip, drawer, finding card

**Shipped.** `obsidian-app.css` §6 in full · `CitationChip` rewritten ·
`CitationHint` (new) · `renderCitedText` simplified · `StanceMark` (new) ·
`FindingCard` rewritten (R12) · `EvidenceDrawer` rewritten with both body
layouts · `EvidenceProvider`'s full shape · `lib/evidence-scope.ts` +
`tests/unit/evidence-scope.test.ts` (7) · `APP_EVIDENCE`.

**Deviation — `Popover` gains an optional `className`.** `.ob-cite-pop` has to
compose onto A2's `.ob-popover`, and the primitive hard-coded its class.
Additive only; the base recipe is never replaced.

**Deviation — the drawer's verify rule uses `@starting-style`, not a keyframe.**
The body asks for it "drawn once on mount", but §6 declares no `@keyframes` and
a CSS transition does not run on initial render. `@starting-style` supplies the
origin with no keyframe and no JS, and degrades to the correct end state where
unsupported. Measured mid-draw at `matrix(0.984779, …)`, so it genuinely
animates. **A7 reuses the same device for `.ob-brief-rule` and the handoff rule.**

**Deviation — A5 wrote nothing into §16, exactly as the body says, and the exit
test still passes.** Under reduce the universal blanket in `obsidian.css` §16
zeroes the durations, so flipping `data-state` to `verified` lands the rule at
`scaleX(1)` and the badge at `opacity: 1` within two frames. **The three end
states A15 must carry are still owed and are recorded here:**
`.ob-finding[data-state] .ob-verify-rule { transform: scaleX(1) }` ·
`.ob-finding[data-state] .ob-chip-verified { opacity: 1; transform: none }` ·
`.ob-cite-hint { transition: none; max-height: none }`. The JS half — A8
skipping the pending frame so no card ever renders unverified — is A8's.

**`citedInReport` is wired, not just typed.** `report.tsx` calls
`citedFindingIds(report)` once and threads it through `DimensionSection`.
Measured: **24** `CITED` markers across 47 findings, which is A1's pinned 24/23
split rendering rather than a number typed into a component.

**The console keeps `state="verified"` for now.** `FindingStream` passes it
unconditionally and `justArrivedId`'s 520ms timer is deleted; **A8 owns the
pending → verified sequence and its timings** (C13). A5 shipped the CSS the flip
drives, proved by DOM probe rather than by sampling a stream it does not own.

**Verified in the browser** at 1440×900 and 1280×800:
1. **The verification CSS, by probe:** `pending` reads
   `matrix(0, 0, 0, 1, 0, 0)` / `opacity: 0`; flipped to `verified` and waited
   past `--ob-enter`, `matrix(1, 0, 0, 1, 0, 0)` / `opacity: 1`.
2. **One hatch, one weave:** `.ob-stance-contests` computes
   `backgroundColor: rgba(0,0,0,0)` with a `repeating-linear-gradient` at
   `rgba(244,244,245,0.1)` stops; `.ob-stance-supports` is `rgb(244,244,245)`.
   `--ob-hatch` resolves non-empty.
3. **R12 dead:** zero `[role="button"] a`, zero `.ob-finding[role]`, and zero
   occurrences of `finding-row` · `finding-card` · `citation-chip` ·
   `citation-hint` in the DOM.
4. **The scoped bracket rule:** zero leaf elements inside report prose whose
   text starts with `[` and lack `.ob-cite`.
5. **Stance in every variant:** 47 findings and 47 `.ob-stance-row` with every
   accordion open; the `row` variant matches on `/sources`. `.ob-stance`, the
   colliding container class, is **zero**.
6. **No red anywhere:** the `r > g + 40 && r > b + 40` scan over every element's
   `color` / `backgroundColor` / `borderTopColor` returns empty.
7. **The hint no longer occludes:** `position: static`, and its top (844.65) is
   below its previous sibling's bottom (816.65).
8. **The 300ms delay:** zero popovers at 200ms, one at 550ms;
   `max-width: 340px`, `boxShadow: none`, `--ob-surface` ground, stance present.
   Clicking fills the chip `rgb(45, 127, 249)`.
9. **R13 on `/sources`:** Money filter → 13 rows; the third row reads
   `3 of 13 · FILTERED`; three real `ArrowRight` presses reach
   `6 of 13 · FILTERED` at `EV_38` — **never `EV_02`**; walking past the start
   parks at `1 of 13 · FILTERED` with `Previous` disabled and **no wrap**.
10. **Trap and restore:** five Tabs stay inside `[role="dialog"]`; Escape
    returns focus to the `.ob-cite` reading `[2]`.
11. Every `.ob-cite` focus ring resolves to `rgb(45, 127, 249)` at
    `transitionDuration: 0s`.
12. **Cascade:** `.ob-finding-head` carries `gap-3` and computes `12px`.
13. **Reduced motion:** the probe resolves to `matrix(1, …)` / `opacity: 1`
    within two frames at `transitionDuration: 1e-06s`.
14. Drawer: title `Evidence 2`, `MetaLine` `EV_02 · VERIFIED · The problem`,
    claim at **23px** (`--ob-h3`), position `2 of 47`.
15. `npx tsc --noEmit` · `npm run lint` · `npm test` **119/119** ·
    `npm run build` · zero console errors at both widths.

---

### A6 — 2026-08-21 — Define: layout and transcript

**Shipped.** `obsidian-app.css` §7 in full plus A6's two end states in §16 ·
`define/page.tsx` rewritten to a bare surface · `DefineConversation` rewritten ·
`MessageStream` · `Message` · `TypingBody` (new) · `Composer` ·
`SuggestionChip` → `.ob-seed` · `BriefProgress` (new) · `use-reduced-motion.ts` ·
the `DEFINE` copy block · the conversation fixture's chips, turn 11 and closing
lines, with `getConversation` returning `{ turns, closing }` through a re-shaped
`ConversationSchema` · the style-guide call site.

**The shell fix belongs to A4's §5 and is logged there.** A6's own
`main:has(> .ob-define) { min-height: 0 }` is necessary but **not sufficient**:
`flex: 1` resolves to `flex-basis: 0%` and overrides `height` on the main axis,
so the shell itself has to be pinned. Both rules are required; neither works
alone.

**Deviation — `TypingBody` holds its callbacks in refs.** The body requires
`onDone` to be `useCallback`-stable "or the effect restarts every render and the
turn never finishes". A ref makes that **unrepresentable** rather than merely
required, so a caller passing an inline arrow cannot silently stall a turn. The
controller keeps its handler stable anyway, via an `inFlightRef` that records
what the in-flight turn *is* so `finishTurn` never reads the transcript back.

**The end state is a state machine, not a flag.** `InFlight` is
`seed | scripted | ack | closing`; the `ack` member is A7's Don't-Know
acknowledgement, added here because the type is one thing.

**Verified in the browser** at 1440×900 and 1280×800:
1. **No page scroll at either width** — `scrollHeight - innerHeight === 0`.
2. `.ob-define-split` measures **732** at 900 and **632** at 800, exactly
   `innerHeight - 72 - 96`; `.ob-define-aside` is **440px** at both.
3. **D11 measured:** assistant body `rgb(244, 244, 245)` at 16px, user body
   `rgb(138, 138, 147)` at 14px.
4. **One measure:** `.ob-msg-body` and `.ob-composer` report the same
   `left` — 161/161 at 1440, 81/81 at 1280.
5. **Zero layout shift from streamed content:** `.ob-define-composer` and
   `.ob-define-aside` `top` identical before the first AI turn and 6.5s later.
6. **R10/R11:** zero `position: sticky` nodes inside `.ob-define`;
   `.ob-define-newmsg` is `position: absolute`.
7. **R3 closed:** `composer` · `composer--streaming` · `message-text` ·
   `message-text--ai` · `message-text--user` all read **zero** in the DOM and in
   `components/`. (`variant="composer"` on `TextArea` is a prop, not a class.)
8. **Input is never dropped:** two sends in rapid succession while a turn
   streamed produced `user, assistant, user, assistant, user, assistant` — both
   visible, both answered, in order.
9. Zero visible `.ob-btn-primary` in the transcript column, and the only accent
   under `.ob-define-split > :first-child` is `.ob-caret` —
   `rgb(45, 127, 249)`, 2px, animating `ob-blink`.
10. **Reduced motion:** no `.ob-caret` in the DOM, the first AI turn's full 181
    characters present, `.ob-msg` at `opacity: 1` / `transform: none`.
11. `npx tsc --noEmit` · `npm run lint` · `npm test` **119/119** ·
    `npm run build` · zero console errors at both widths.

---

### A7 — 2026-08-21 — Define: the live brief mechanic

**Shipped.** `obsidian-app.css` §8 in full plus A7's two end states in §16 ·
`use-brief-state.ts` · `BriefPanel` rewritten · `BriefField` rewritten (6 props,
down from 16) · `DontKnowButton` functional · `ApproveButton` · `ConsequenceLine`
(new) · `DefineHandoff` (new) · the controller wired to the hook · the fixture
reorder and `dontKnowAcksFixture` · the `BRIEF` copy block · the transcript's
`sr-only` live log.

**Deviation — `lib/brief-state.ts` was changed, and it had to be.** A7 says the
module is not this phase's to re-sign; two things in it made D12 unbuildable,
and both are body changes with no signature change:

1. **`coreFilled` was vacuously true on the real fixture.** It asked only
   whether the resolved status was non-`pending`, and `briefFixture` ships every
   field `filled` or `unknown` — so the gate opened on the first paint and
   `ApproveButton` was on screen before a single question had been asked. The
   existing unit test hid this by inventing a `pending` brief the app never
   sees. **The gate now tests *reach*** — `revealed` / `unknown` / `values` —
   which is what D12 actually means: the server brief is the answer set, the
   patch is how far the conversation has got.
2. **`CORE_BRIEF_FIELD_KEYS` was six, including `what_makes_this_different`.**
   A7 names five. With six, the gate could not open before turn 7 whatever the
   fixture order was, and D12's "~turn 5–6" is unreachable.

`tests/unit/brief-state.test.ts` is rewritten to both; 11 assertions.

**Deviation — `unanswered` is computed in the hook, not read from
`unansweredCount`.** A7 defines it as *"fields marked unknown **plus** fields the
conversation has not yet reached"*, but `unansweredCount` returns
`unknownKeys().length`, which on this fixture is a constant **3** from the first
paint — a `ConsequenceLine` that never moves while you talk, the exact opposite
of the rationale the phase gives for it. The union is computed in the hook A7
owns rather than by re-signing a module A7 is told not to touch. It reproduces
two of the phase's three pinned numbers exactly — **6** at the earliest approve
and **3** on the full script. **The third, "4 at the end of turn 8", is not
reproducible under any reading**: at that point three fields are unreached and
three resolve `unknown`, union five. The prose number is loose; the derivation
is right.

**A real bug found by the exit test's own number.** `[data-state="waiting"]` read
**12** at first paint instead of 11, and `sv.brief.<slug>` held `revealed: []`
forever. The hydrate effect dispatched three actions, and the persist effect —
which runs in the *same commit* — wrote the still-pristine patch first; the next
mount then hydrated `revealed: []` back over the seed and `one_liner` was never
seeded again. Two fixes: **the seed is folded into a single `hydrate` payload**,
and **a pristine patch is never written at all** (writing one is not a no-op —
it is a claim that this browser has been here, which `useRunProgress` reads as
`briefTouched`).

**`Modal` is still call-site-free.** A2 predicted this phase would give it one;
it does not. Approving is a direct action, and a confirmation dialog over a
decision the product explicitly says is fine to take early would contradict D12.
**A13 or A14 should claim it or A15 should delete it** — recorded so neither
assumes the other did.

**`InlineEditableField` and `InlineEditableList` have left Define.** The unified
editor is local to `BriefField`. If nothing else references them after A13,
A15 deletes both.

**Verified in the browser** at 1440×900 and 1280×800:
1. First paint: **11** `[data-state="waiting"]`, zero `.skeleton`/`.ob-skeleton`,
   store reads `{"v":1,"revealed":["one_liner"],…}`.
2. **R5 closed.** A real mouse click on `I don't know` moved three things
   together: the asked field to `data-state="unknown"` carrying `.ob-tag-open`;
   `.ob-brief-progress` from `9 of 12 answered · 3 unknown` to
   `8 of 12 answered · 4 unknown`; and `.ob-consequence`. Storage holds
   `unknown: ["product"]` — **only the clicked key**, no fixture unknowns, no
   resolved brief, no `version` key — under **exactly one** `sv.brief.*` key,
   and **no `sv.brief.<slug>.values` key exists at all**. Survives reload.
3. **R6 closed.** The one-liner edits to `Rebooking, but for physio`, shows
   `EDITED`, persists in the patch's own `values` map, and survives a reload.
4. **R7 closed.** With an editor open and half-typed, an AI turn completed and
   `document.activeElement` was still `.ob-brief-editor` with its value intact.
5. **The settle rule animates:** sampled `matrix(0.989…)` → `matrix(0.999994…)`
   mid-draw, not pinned at `matrix(1, …)`.
6. **D12 measured:** `.ob-approve` count is `0, 0, 0, 1` across turns 1–4 and
   the turn that lands `first_version_scope` — **absent, not disabled**, and
   present exactly at turn 5 with `revealed` holding the six expected keys.
   `.ob-consequence` reads
   `Approve now and 6 unanswered fields become open questions.`
   Exactly one visible `.ob-btn-primary` before and after.
7. **Approve → handoff:** `.ob-define-handoff` replaces the transcript column
   (`.ob-define-scrollwrap` count 0), the box holds the full run URL,
   `sv.runStarted.*` is written and `approvedAt` stamped, the aside head reads
   `APPROVED 05:25 · LOCKED WHILE RESEARCH RUNS`, `.ob-brief` is
   `data-approved="true"` with **zero** pencils and **zero** edit buttons, and
   the rule draws linearly 0.146 → 0.275 → 0.404 → 0.529 before the redirect.
8. **Reduced motion:** no caret; `.ob-brief-rule` at `matrix(1, …)`; after
   approving the page **does not navigate within 6.5s** while
   `Watch the research →` is present, and `.ob-define-handoff-rule` is static at
   `matrix(1, 0, 0, 1, 0, 0)`.
9. Every aside control shows a `rgb(45, 127, 249)` indicator at
   `transitionDuration: 0s`, with accessible names reading `One-liner: … Edit.`
   and `Product: … Edit.`; the no-red scan over `.ob-define-aside` returns
   empty. Both widths.
10. `npx tsc --noEmit` · `npm run lint` · `npm test` **121/121** ·
    `npm run build` · **zero console errors on all six routes** with clean
    storage.

**R24 is still open and still A8's.** The one hydration error anywhere in the
app appears on `/validate` **only in the freshly-approved state** —
`ValidateView`'s `useState(() => isRunStreamActive(slug))`. Confirmed unchanged
by these four phases: with `localStorage` cleared, all six routes report zero
errors.

**Standing-rule 4 ritual, after A7.**
- Used-but-undefined `--ob-*`: `--ob-reveal-delay`, `--ob-word-delay`,
  `--ob-fig-h`. **All three are set inline from JS and none is a token** —
  `--ob-fig-h` is A3's per-figure reservation and joins A0's two.
- Every `animation:` name resolves to a matching `@keyframes`.
- Every `@keyframes` in `obsidian-app.css` is `ob-app-` prefixed:
  `ob-app-breathe` · `ob-app-rest` · `ob-app-shimmer` · `ob-app-spin`. §5, §6,
  §7 and §8 declare none.
- R2/R4's classes are untouched and still owed: `timeline-node*` and
  `card--pulse` (A11/A12), `report-cross-fade` (A8). R3's five are **closed**.

---

### A8 — 2026-08-21 — Validate: the Run Console

**Shipped.** `obsidian-app.css` §9 in full plus A8's six end states in §16 ·
`foldRunEvents` · `use-run-stream.ts` rewritten (resume, derived `TIMELINE`,
stall chain, reduced-motion branch, `lastDiscard`, `runStreamEntry`) ·
`ValidateView` rewritten (three-state machine, R24 closed) · `RunConsole` ·
`QueryTicker` · `ConsoleRail` (new) · `DiscardTicker` (new) · `FindingStream` ·
`PhaseStrip` and `CoverageBar` re-signed · `APP_CONSOLE` · the validate page
drops `dimensionLabels` and accepts `?stall=1` · `Orb` gone from the console.

**R4 is closed.** `.query-glyph*`, `.finding-card--entering` and
`.report-cross-fade` were emitted by shipped components and defined in no
stylesheet. All three now exist as `.ob-qglyph[data-state]`,
`.ob-fstream-item[data-entered]` and `.ob-xfade*`. `@keyframes ob-app-qspin` is
the one keyframe §9 declares; grepped across `styles/*.css` before writing.

**R24 is closed.** `ValidateView` renders Mode B on the server *and* the first
client render and promotes in a `useLayoutEffect`.

**Two real bugs the exit test found, both worth recording.**

1. **The resume fold was applied twice and there was no way to see it except by
   counting.** `setState(prev => foldRunEvents(slice, prev))` is a pure updater,
   but React's dev double-invoke runs the mount effect twice, so the same
   twenty-two events folded onto the already-folded state: PROBLEM read **28**
   findings against a fourteen-finding dimension, and React logged 42 duplicate
   -key errors. **The fold is now absolute** — `foldRunEvents(slice,
   initialRunStreamState(ALL_QUERIES))` — which is idempotent and is also the
   honest shape: this is *the run's state at t*, not *add these to whatever is
   there*. Any future resume path must fold absolutely for the same reason.
2. **`↑ n new` never appeared, and the reason was the 25-card cap.** The pin
   effect compared `scrollHeight` before and after; with the visible list capped
   a prepend also drops a card off the bottom, so the height barely moves while
   the content *above the reader* grows by a whole card. Both the pill trigger
   and the compensation were wrong. **The pin is now anchored to an element** —
   `data-fid` on each item, remember which one the reader is looking at and
   restore its `offsetTop` — which is exact under both regimes. Native scroll
   anchoring was silently doing the job instead and is now off
   (`overflow-anchor: none`) so two mechanisms can't fight over one pixel.
   The pill's own 33px of flow space is compensated separately, because it
   appears in the render *after* the arrival that caused it and the pin effect
   cannot see it. Measured drift with all three in place: **1.2px**.

**Deviation — `CoverageBar` keeps one prop beyond A8's five.** `DimensionStrip`
(A3, §4) composes it at 2px inside a 5-up figure column and would be wrecked by
the rail's `84px 1fr 34px 30px` grid, so `variant?: 'rail' | 'bare'` is
additive, defaulting to `rail`. The rail owns the contract; `bare` is the track
alone. `.ob-coverage*` and `.ob-phase*` are **deleted** from §2/§3 rather than
left as a second definition, per A8's own note that the attribute contract
supersedes A2's modifier classes.

**Deviation — the elapsed clock is seeded from wall time at mount, not from 0.**
A reload at 20s read `0:00` for a quarter of a second before the interval
caught up — which is precisely the desync the resume path exists to remove.

**Deviation — exit test (2)'s "two or more query rows read `running`" is
unreachable, and the fixture is right, not the test.** A1's log emits
`query.start` then `query.done` as a pair, 90/130ms apart, so exactly one query
is ever running. Instrumented at 60ms, **eleven distinct running rows** were
observed (indices 8 through 18) — the running *set changes*, which is the half
that proves queries 6–19 are visible rather than hidden behind `… 14 more`.

**Deviation — the `thin` tag also lands on MONEY and DEMAND, briefly.** The
phase body says PRACTICAL earns it and MONEY never does; that assumed a
different arrival order. `evidenceFixture` streams in dimension order, so at 24s
MONEY genuinely has zero findings and the tag is the honest live readout. The
rule is the rule; the prose number was written before the fixture.

**The console page carries ~240px of scroll at 900px of viewport, by design.**
The rail needs 679px against the 439px the grid has left after a 179px head, so
`position: sticky` on the rail is load-bearing rather than decorative. The
*stream* never grows — its height is fixed against the viewport
(`100vh - chrome - 292px`) and `overscroll-behavior: contain` keeps a wheel
inside it from chaining out — so `window.scrollY` measured **0 throughout**
every test, which is what the cross-fade's precondition needs.

**`.meta-line` still appears in `/validate`'s DOM** — from the Deep Canopy
report body (A9) and nowhere in the console subtree. A9 removes it.

**Verified in the browser** at 1440×900 and 1280×800:
1. **First finding at 3,881.2ms**, against A1's pinned 3,880ms — the phase's
   headline number, measured by `MutationObserver` rather than by polling.
   4,186ms wall at 1280 including page load.
2. **Every card is inserted `data-entered="false"` / `data-state="pending"`** —
   all eleven observed insertions, so the entrance and the delayed badge
   genuinely run rather than reading `true` in every sample.
   `.ob-verify-rule` sampled mid-draw at `matrix(0.914…)`, `matrix(0.591…)`,
   `matrix(0.999…)`.
3. **Ticker rolls:** `matrix(1,0,0,1,0,-339.979)` → `-340` → `-374`, i.e. the
   window advances a whole 34px row.
4. **Zero layout shift across the whole run:** `.ob-console-head` 179.23,
   `.ob-console-grid` 678.8, `.ob-console-rail` 678.8, `.ob-discard-last` 66,
   `.ob-fstream` 472 — **one distinct value each across ten samples**, including
   as the clock rolled and as all four discard reasons cycled through the slot.
5. **Scroll pinning:** anchor drift **1.2px** over ≥4 arrivals; `↑ 4 new`
   matches `/^↑ \d+ new$/`; clicking returns `scrollTop` to 0;
   `window.scrollY === 0` throughout.
6. **Discards read as sentences:** all four `DISCARD_REASON_LABEL` strings
   observed verbatim in the slot, `color: rgb(138, 138, 147)` (`--ob-muted`, not
   `--ob-discard`), and **zero** raw enum keys anywhere in `document.body`.
7. **Cross-fade:** `.ob-xfade-out` at 0.0006 and `.ob-xfade-in` at 0.978 in the
   same sample — both in the DOM, both strictly between 0 and 1;
   `#what-we-found` 0 → 1; `data-arrived="true"`; console unmounted;
   `location.pathname` unchanged; `window.scrollY` 0 before and after.
8. **Clock froze at `0:45`**, note `0:45 · COMPLETE`.
9. **Coverage:** every `.ob-cov-fill` goes `matrix(0,…)` → non-zero; chalk
   `rgb(244, 244, 245)`, never accent.
10. **Blue audit:** the only accent-computing elements under `.ob-console` are
    `.ob-dot`, `.ob-qglyph[data-state="running"]`, `.ob-chip-verified` (and the
    lucide `<svg>`/`<path>` inheriting its colour) and `.ob-verify-rule`.
    Exactly **one** `.ob-dot`; exactly one `.ob-backdrop`; **zero** `.orb`;
    zero `.ob-btn-primary`.
11. **Reduced motion:** no `.ob-console` in the DOM at all, `#what-we-found` at
    opacity 1, no `.ob-xfade`, and zero `setTimeout`-driven mutation over 3s.
12. **Resume at 20s:** 20 findings already present, clock `0:21`, **every** item
    `data-entered="true"` (nothing animated in), 7 discards, and two more
    findings landing within 1.2s.
13. **Stalled:** `?stall=1` suppresses after finding #8 (≈11.3s); at ≈8.1s of
    silence `.ob-phase` flips to `data-state="stalled"` and the note reads
    `Still working — some pages are slow to fetch.`
14. **Ticker expand is two-way:** 204px → 646px (19 × 34) with `mask-image:
    none`, label `All 19 queries ↓` ↔ `Collapse ↑`, and back to 204px.
15. `npx tsc --noEmit` · `npm run lint` · `npm test` **121/121** ·
    `npm run build` · **zero console errors** at both widths.

**Owed by later phases:** `#what-we-found` must keep that exact id (A9 —
it is the cross-fade's reveal target, and the wrapper cannot reach inside the
server-rendered report by any other means).

---

### A9 — 2026-08-21 — Validate: the Report, structure

**Shipped.** `obsidian-app.css` §10 in full · `Report` rewritten ·
`ReportRow` (new) · `EvidenceState` (new) · `EvidenceRail` (new) ·
`report-figures.tsx` (new) · `SummarySection` · `DimensionSection` ·
`CompetitorCard` · `SurprisePanel` · `UnansweredSection` ·
`ThinEvidenceNotice` all rewritten · `SectionIndex` rebuilt as a sticky
horizontal strip · `assertEverySentenceCited` · `formatMonthRange` ·
the `REPORT` copy block · `REPORT_SECTIONS`' ids shortened · the style-guide
call site re-propped.

**`report-figures.tsx` exists in A9, not A10, and that is the point.** A9 is
told to ship every aside slot as a real `Figure` at its exact final height.
Building five section-local aside stacks and then throwing them away in A10
would be two implementations of one adjacency rule, so the builder A10 owns is
created here with `FigureNumbers` — the figure's own raw values, in mono,
inside the real frame — as the mark. **A10 replaces only the mark children**,
which is what makes the zero-shift claim testable rather than asserted.

**The measured `.ob-fig-mark` heights, for A10's exit test (1) to replay.
Identical at 1440 and 1280:**

```
[140, 56, 140, 96, 96, 96, 64, 128, 96, 64, 96, 64, 260, 180, 56, 64, 156, 64, 260]
```

Nineteen figures: strip 140 · overall stance 56 · **funnel 140** · PROBLEM's
three callouts 96/96/96 + recency 64 · EXISTS lead 128 + callout 96 + recency
64 · DEMAND callout 96 + recency 64 · MONEY ladder 260 + gap 180 + stance 56 +
recency 64 · PRACTICAL constraints 156 + recency 64 · matrix 260.

**Deviation — three shared artefacts gained one member each, all additive.**
`FIG_H.constraints: 156` (A9 must pass `height` from `FIG_H`, never a literal,
and PRACTICAL's group had no entry) · `NumberCallout.label` became **optional**
(in the report the `Figure` caption carries the label, and two copies of the
same sentence 14px apart is not a design) · `.ob-comp-price` joins §10's class
list, because the phase body specifies the price as a *field* at 15px
`--ob-text` and there was no class for it.

**Deviation — the nine callout captions are derived, not typed.** The phase
body spells them editorially (`AVERAGE SAME-WEEK CANCELLATION RATE`). They are
rendered from `numberCallouts(...).label`, which is `sharedLabel` over the
finding's own facts, uppercased by `.ob-meta`. Typing nine strings into a copy
file that duplicate fixture data is how a second vocabulary starts, and C3 was
written about exactly that. If a caption reads weakly, **the lever is the
fixture's fact label**, not a string in `lib/content/app.ts`.

**Deviation — `formatMonthRange`.** The fixture stores `"2025-01 to 2025-12"`,
a database value, and the phase body asks the meta line to read `JAN–DEC 2025`.
A three-line formatter in `lib/format.ts` beats either a second fixture field
or a raw range on screen.

**Amendment — exit test (9)'s bracket selector is too broad, and the contract
already says so.** It reads *every leaf inside `.ob-report-prose` whose text
starts with `[` carries `ob-cite`*, but A9 itself puts `EvidenceRail` **in the
prose column** and states that its `[nn]` is outside prose and legal (C12).
Twenty-three rail numerals fail the literal selector and none of them is a
violation. **The assertion is `.ob-report-prose *` excluding `.closest('.ob-erail')`**,
which returns empty. A15 should use that form.

**Amendment — exit test (10) reads "exactly one primary in the viewport" and
must be "at most one".** Standing rule 11 is a ceiling. Measured across five
scroll positions: `0, 0, 0, 0, 1` — the report's single primary is the last
thing on the page, which is the whole of §06's job. Document total: **1**.

**The `?thin=1` outline differs from the canonical one and is correct.**
`buildThinPreviewOverrides` truncates all five dimensions below two findings, so
all five collapse into the `LITTLE EVIDENCE` block and the five dimension `h3`
disappear: `H1 · H2×6 · H3×3 · H4×3`. The five headings exist only when there
are five dimension sections to head.

**C17's `/validate` outline has §04 going `h2 → h4` with no `h3` between it.**
That is the contract's own table (competitor names are `h4`), and it is what
shipped. Flagging it here so A15 doesn't "fix" one side of it silently.

**Verified in the browser** at 1440×900 and 1280×800, `localStorage` cleared
(the cold path — no console, no cross-fade wrapper):
1. **Cascade:** `.ob-h2` carrying `mt-8` computes `marginTop: 32px`. A `0px`
   here would mean §10 wasn't layered and every Tailwind utility on the page
   was dead.
2. **Grid:** `.ob-report-row` is `580px 400px` with `columnGap: 100px` at
   **both** widths — the report body is fixed, not fluid — and zero horizontal
   overflow at 1280.
3. **Outline:** `H1,H2,H2,H2,H3,H3,H3,H3,H3,H2,H4,H4,H4,H2,H3,H3,H3,H2` =
   **1 × H1, 6 × H2, 8 × H3, 3 × H4**, C17 exactly, at both widths.
4. **Anchor inset:** `scrollMarginTop` reads `136px` on `.ob-report-section`
   *and* on `.ob-dim`, with **zero** competing inline or element-scoped rules.
5. **Anchors land:** all six index links clicked for real →
   `getBoundingClientRect().top === 136` on every one. (Two clicks needed a
   2.2s settle rather than 900ms: `#dimensions` → `#competitors` is a ~4,000px
   smooth scroll, and the first measurement caught it mid-flight at 350.)
6. **Scrollspy:** at `#dimension-MONEY` exactly one active link, reading `03
   DIMENSIONS`; clicking `04 COMPETITORS` moves it to `04`.
7. **The five `#dimension-*` ids each have exactly one in-page `<a href>`** —
   from the strip's cells, which is what un-orphans them.
8. **Citations:** clicking `[33]` in Money's paragraph opens the drawer on
   `EV_33 · VERIFIED · Money`; `Esc` returns focus to that chip.
9. **Bracket monopoly** (scoped per the amendment above): empty.
10. **Figure slots:** 19 `.ob-fig-mark`s at the array above, **including the
    140px funnel** — the §02 aside is occupied, not blank.
11. **`?thin=1`:** the notice is the first thing in the report body, its CTA is
    a ghost pill (`borderRadius: 999`, `backgroundColor: rgba(0,0,0,0)`),
    exactly **one** `.ob-btn-primary` in the document, and **zero** empty
    `.ob-report-aside` elements.
12. **Numerals are chalk:** `.ob-eyebrow .ob-em` and `.ob-secindex-link .ob-em`
    both compute `rgb(244, 244, 245)`. The only accent in the strip is the
    active link's 2px bottom rule (job 3).
13. **Zero legacy `.meta-line`** left in `/validate`'s DOM — A8 logged it as
    owed here and it is closed.
14. `npx tsc --noEmit` · `npm run lint` · `npm test` **121/121** ·
    `npm run build` · **zero console errors** at both widths.

---

### A10 — 2026-08-21 — Validate: the Report, data layer

**Shipped.** `obsidian-app.css` §11 in full plus A10's two end states in §16 ·
`report-figures.tsx`'s marks swapped from A9's reservations to the drawn
figures · `CountUp` (new, the only `'use client'` file A10 adds) · `Figure`'s
footer citations became real `CitationChip`s · `NumberCallout` gained `compare`
· `RunFunnel` / `StanceBar` / `DimensionStrip` wired to `CountUp` ·
`CapabilityMatrix` reads `REPORT.figures.capabilityNote` and emits
`.ob-matrix-idea-cell` · the four authored notes · `report-figures.test.ts`
extended 8 → 16 assertions (suite **129/129**).

**Deviation — `Reveal` is the `data-shown` carrier, not a new client
component.** A10 is specified as adding exactly one `'use client'` file
(`CountUp`), and the bars need an in-view signal. `Reveal` already exists,
already carries `data-shown` and `--ob-reveal-delay`, so §11 **neutralises its
own hide** (`.ob-rfig-slot { opacity: 1; transform: none }`) and uses it purely
as the signal. The consequence matters: **nothing in the report is invisible
without JavaScript** — a report that hides itself when JS fails would be a poor
trade for one fewer file.

**Two marks overflowed their reservation and the marks were fixed, not the
numbers** — which is what exit test (1) is for, and it caught both on the first
replay:

| Mark | Reserved | Measured | Cause | Fix |
|---|---|---|---|---|
| PROBLEM `16.8% → 9.1%` | 96 | **112 at 1440 only** | the value at `clamp(40px,4vw,56px)` is 56px at 1440 and the string wraps to a second line; at 1280 it is 51.2px and fits | `.ob-rfig-transition .ob-callout-value { font-size: 34px }`, plus the two-bar comparison the phase body asks for |
| PRACTICAL `HARD CONSTRAINTS` | 156 | **164.6 at both** | `.ob-callout` stacks value over label, so three rows measured ~54.2 each | the compact row is **28px value left, `.ob-meta` label right** — one line, as specified — so three rows plus two rules fit 146 |

**Deviation — `.ob-rfig-note` is spelled as a scope, and `.ob-rfig-rows` is
new.** The four authored sentences render through §4's `.ob-fig-note` sized up
by `.ob-rfig-slot .ob-fig-note` rather than a second class on the same element.
`.ob-rfig-rows` is the PRACTICAL constraints container and is the one class in
§11 beyond A10's list. `.ob-ladder-band`, `.ob-ladder-threshold` and
`.ob-matrix-idea` are **A3's, already in §4**, and §11 redeclares none of them
— A3 also already shipped the four cell marks exactly as A10 specifies (8px,
left-half `partial`, em-dash `unknown`), so no amendment to
`capability-matrix.tsx`'s geometry was needed.

**The reduce rule needed a second selector, and only a measurement found it.**
`.ob-fig-bar { transform: scaleX(1) }` in §16 is (0,1,0) and **loses to §11's
`.ob-rfig-slot .ob-fig-bar` (0,2,0) regardless of order** — eight report bars
sat frozen at `scaleX(0)` under `prefers-reduced-motion`, which is precisely
the freeze-instead-of-resolve failure rule 16 exists to prevent. §16 now
carries both selectors, with the reason written above it.

**A stale CSS bundle cost twenty minutes and is worth recording.** After the
first §11 edits, `document.styleSheets` contained **zero** rules matching
`ob-rfig-transition` / `ob-rfig-rows` while the file on disk had them and the
brace balance was clean — Turbopack had stopped recompiling the stylesheet. The
tell is checking `document.styleSheets` for the selector rather than trusting a
computed value; the fix is restarting `next dev`. **Always confirm the rule
exists in the browser's CSSOM before concluding a rule is losing a specificity
fight.**

**Tooling note for the next session.** Restarting the dev server with
`taskkill //F //IM node.exe` also kills the **Playwright MCP server**. It does
not recover on its own; `/mcp` reconnects it, and the first `browser_*` call
after a reconnect fails once with *"Target page, context or browser has been
closed"* — **retry it, the second call launches cleanly.** Kill the dev server
by port or PID instead.

While the MCP was down, A10's and A11's exit tests were driven by `playwright`
out of the globally-installed `@playwright/mcp` (`node_modules/playwright`),
pointed at the already-downloaded `chromium_headless_shell-1187` via
`executablePath` — **no project dependency was added** (rule 18 intact). That
is a usable fallback, not a substitute: **every headline assertion for A8, A9,
A10 and A11 was then re-run through the Playwright MCP itself**, on real
Chrome, and reproduced — the A9/A10 height array matched element for element,
`/` still reported `2.4s` on `.ob-dot`, and the console logged zero errors.

**Verified in the browser** at 1440×900 and 1280×800:
1. **Zero shift, the headline assertion:** A9's recorded array replays element
   for element at **both** viewports —
   `[140,56,140,96,96,96,64,128,96,64,96,64,260,180,56,64,156,64,260]`,
   including the 140px funnel.
2. **The numbers are C11's**, scraped from `.ob-fig-value`: `14.2%` ·
   `16.8% → 9.1%` · `18%` · `0 of 9` · `14` · `130,000` (+ a `70%` secondary) ·
   `$150–250` · `$199/mo` · `$299/mo` · `~$300/mo` · `$2,000–4,000/mo` ·
   `$199–299/mo` · `10–20×` · `30` · `2–3` · `100/min`. **None** of `$3,000`,
   `$200`, `15×`, `6.7×`, `13.4×`.
3. **Bars ran:** `matrix(0,…)` → `0.308` → `0.813` → `0.950` → `0.990` →
   `0.999` as §02 scrolled in — a real transition, not a static value.
4. **The funnel's axis is C8's:** `0.4042 · 0.6596 · 1.0000 · 0.3830` against
   `19/47 · 31/47 · 1 · 18/47`, inside 0.5%. **The verified bar is exactly
   1.000** — a 0→65 normalisation fails this.
5. **One blue mark in the entire figure layer**, and it is
   `.ob-funnel-bar-verified`. Nothing else inside a `.ob-fig-mark` computes
   `rgb(45, 127, 249)`.
6. **One hatch, no hue, no red:** the `contests` segment is
   `backgroundColor: rgba(0,0,0,0)` with a `repeating-linear-gradient`, and the
   contested callout's mark reports the **identical** `backgroundImage` string —
   one weave, not two. The `r > g+40 && r > b+40` scan over the figure layer
   returns empty.
7. **Citations resolve:** clicking `[26]`, `[41]`, `[19]`, `[9]`, `[46]` in
   figure footers opens `EV_26 · Demand signals`, `EV_41 · Money`,
   `EV_19 · What exists`, `EV_09 · The problem`, `EV_46 · Practical realities`.
   **23 `.ob-cite` in figure footers and zero legacy `.ob-fig-cite-n` spans.**
8. **The idea column is not a verdict:** its five cells read
   `— — CLAIMED CLAIMED CLAIMED`, it contains **zero**
   `.ob-cell-yes/-partial/-no`, and both the `NOT EVIDENCE` chip and C7's note
   line are on screen.
9. **C3's split, on one page:** the strip reads `Problem · Exists · Demand ·
   Money · Practical` while §03's five `h3` read `The problem · What exists ·
   Demand signals · Money · Practical realities`.
10. **Reduced motion:** every `.ob-countup` shows its final value (`14 11 7 13
    2 · 25 15 7 · 19 31 47 18 · 4 6 3`), **zero** `.ob-fig-value` reads `0`,
    **zero** bars are anything but `matrix(1,0,0,1,0,0)`, and nothing in a mark
    sits at `opacity: 0`.
11. **`?thin=1`:** zero empty `.ob-report-aside`, **zero** blank `.ob-fig-mark`,
    one `.ob-btn-primary`, four figures still drawn.
12. `npx tsc --noEmit` · `npm run lint` · `npm test` **129/129** ·
    `npm run build` · **zero console errors** across `/validate`,
    `/validate?thin=1`, `/` and `/style-guide` at both widths, and zero
    horizontal overflow.

---

### A11 — 2026-08-21 — Roadmap: open questions

**Shipped.** `obsidian-app.css` §12 in full plus A11's two end states in §16 ·
`app/r/[slug]/roadmap/page.tsx` rewritten · `OpenQuestionsSection` (new) ·
`OpenQuestionCard` rebuilt · `SurveyBlock` (new) · `FindThemRow` (new) ·
`FieldworkBand` + `FieldworkMedia` (new) · `ScriptBlock` restyled with CSS
numbering · `DependencyChips` / `ChangesLink` restyled ·
`roadmap-context.tsx` (pulse restart + `primaryQuestionId`) ·
`FanOutMeter` re-signed · `SectionLabel` gained `as` · the `ROADMAP` copy block
and `buildScriptText` · the fixture's four edits · the schema's `SurveyQuestion`
and the removal of `FindThemItem.url` · `tests/unit/roadmap-integrity.test.ts`
(9 assertions; suite **138/138**) · fourteen Deep Canopy rule blocks deleted
from `styles/components.css` §13.

**R15 is closed, both halves.** The `QUESTION` row *is* the trigger and renders
in the same 160px-labelled grid collapsed and expanded, so the landmark never
disappears and the question is no longer printed twice on an open card — the
string appears **exactly once** in the card's subtree before and after a real
`Enter`. `nowrap` + ellipsis is gone.

**R2's `.card--pulse` half is closed** — `.ob-oq[data-pulse]` on
`@keyframes ob-app-pulse`. `.timeline-node*` remains A12's.

**Deviation — the clamp is 3 lines, not 2, and the measurement is why.** The
phase body reasons "two lines at 23px in a 760px column is ~150 characters". The
value column is **728px** (920 − 160 − 32), and Q02 runs **153** characters: at
two lines it clipped, measured. Three lines is ~220 characters — **still a guard
against a future 200-character question, and it clips nothing that exists.**
All five collapsed questions now report `scrollHeight <= clientHeight`.

**Deviation — the fieldwork panels are `16 / 9`, not `4 / 5`.** The phase body
says `4 / 5`; `higgsfieldPlan_roadmap.md` §1 specifies 16:9 at 1920×1080 with a
rendered size of ~378×213 CSS px, and it is the file the deliverable is cut
against. **Measured 357×201 per panel at 1280.** The media plan wins over the
phase body on an asset's format.

**Deviation — the reverse pulse needed the attribute moved.** Exit test (7)
samples `#step-BEFORE_YOU_BUILD`'s `dataset.pulse`, and the shipped code put
the pulse on `TimelineNode` as `.timeline-node--pulse` — a class defined in no
stylesheet (R2), so the reverse chip scrolled you somewhere and gave you no
confirmation you had arrived. `RoadmapStep` became a client leaf and carries
`data-pulse` on the `<li>` the chips actually target. §12 gives it the minimum
visible confirmation (the same keyframe against a transparent block hairline),
explicitly scoped `.ob-roadmap .timeline-step[data-pulse]` and marked as
**A12's to absorb** when it rebuilds §02 on the week axis. What must survive
that rebuild: `id="step-{PHASE}"` and `data-pulse`.

**Deviation — `.ob-oq-grid` appears twice per card, at one column template.**
The plan says "the card is one grid, trigger included". The collapsible needs
its own element for `grid-template-rows: 0fr → 1fr`, so the trigger and the body
are two grids at the identical `160px minmax(0,1fr)` — visually one spine,
measured `160px 728px` on both.

**Deviation — `FanOutMeter`'s `source` label is `THE PLAN →`, not the caption.**
Printing the noun phrase as caption, as the mark's word, *and* as the source
label put `1 STEP + TRIPWIRE` on screen three times inside one card. The source
is the step list this counts, so the footer now says so and links to it.

**Amendment — exit test (12) is stale and C17 settles it.** The test expects
"one `H1` and eleven `H2`, no `H3`" with `.ob-eyebrow` as a `P` — that is a
description of the *broken* page. C17 pins `/roadmap` at **h1 ×1 · h2 ×2 ·
h3 ×11**, and the phase body's own notes say the eyebrow *is* the `h2`.
Measured: `H1,H2,H3×6,H2,H3×5` and `.ob-eyebrow` is an `H2`. `SectionLabel`
gained `as?: 'p' | 'h2'` for it — heading *size* stays a class, heading *level*
becomes structure.

**Amendment — the pulse restart is one frame and cannot be sampled at 110ms.**
Exit test (6) asks that a repeat click makes `data-pulse` "go absent for at
least one sample". `setPulseTarget(null)` → `requestAnimationFrame` → set again
is ~16ms, so no realistic poll catches it. **The restart is proved by colour
instead**: after the first pulse has fully ended (`rgb(138, 138, 147)`), a
second click puts the border back to `rgba(45, 127, 249, 0.42)` within 120ms.
An animation that did not restart could not do that.

**On the D10 arithmetic, since it is easy to get backwards.** The promotion set
is `unknownKeys(brief, patch)` **minus the fields whose server status is already
`unknown`**. The fixture ships `who_decides`, `what_makes_this_different` and
`how_customers_find_it` unknown — those three are *why* Q01–Q03 exist and are
already priced into C6's authored rank. Promoting them would count the same fact
twice and would put the three lowest-fan-out questions on top of a page nobody
had touched.

**Verified in the browser** at 1440×900 and 1280×800:
1. **Canonical order** on a cleared `localStorage`: `Q06, Q01, Q04, Q02, Q05,
   Q03`, **zero** `.ob-oq-badge`, **zero** `.ob-also-unknown`.
2. **Promotion:** seeding `{v:1, unknown:['assumptions','how_it_makes_money']}`
   reorders to **`Q04, Q06, Q01, Q02, Q05, Q03`**; Q04 alone carries
   `FROM YOUR BRIEF`; its note reads `You marked “Assumptions” unknown.`; and
   `ALSO UNKNOWN` names **`how it makes money`** and no field that has a
   question.
3. **R15(a):** `webkitLineClamp` is `3` on a collapsed question, and all five
   collapsed questions (117, 140, **153**, 72, 110 chars) report
   `scrollHeight <= clientHeight`.
4. **R15(b):** a real `Enter` on Q01's trigger expands it; the question's
   `textContent` is byte-identical before and after and occurs **exactly once**
   in the card's subtree.
5. **Fan-out:** three ticks per card; Q06 has three filled and **zero**
   tripwire ticks; Q01 and Q04 each have one filled and **exactly one**
   `.ob-fanout-tick-tripwire` — C6's `Q01 2 · Q04 2 · Q06 3` drawn.
6. **Pulse, forward:** clicking `Q06` in §02 puts `data-pulse` on
   `#question-Q06`, drives `animationName: ob-app-pulse`, and the border passes
   through **`rgba(45, 127, 249, 0.42)`** before returning to `rgb(35, 35, 38)`.
7. **Pulse, reverse:** `▸ Before you build` on Q06's `Changes:` row does the
   same to `#step-BEFORE_YOU_BUILD`. Restart proved by colour, above.
8. **The live dot survived the keyframe** — `/` still reports
   `animationDuration: 2.4s` on `.ob-dot`. This is the one measurement that
   catches an unprefixed `@keyframes`, and it is the whole reason C1 exists.
9. **One primary:** with **four** cards open, exactly **one** visible
   `.ob-btn-primary`.
10. **Sticky:** at scroll 2000 `.ob-roadmap-nav` reports `top: 56`, and the
    ancestor walk for a non-`visible` `overflow` returns **empty**.
11. **Anchor inset:** every `main [id]` on the page reports `136px` — one
    unique value, so no competing rule exists.
12. **Outline:** `H1,H2,H3,H3,H3,H3,H3,H3,H2,H3,H3,H3,H3,H3` — h1 ×1, h2 ×2,
    h3 ×11, exactly C17, at both widths. `.ob-eyebrow` is an `H2`.
13. **Reduced motion:** `animationName: none` on a pulsed card while the border
    still resolves to `rgba(45, 127, 249, 0.42)` — a hard on/off that still
    confirms the landing; `.ob-oq-body`'s transition is `1e-06s`; and
    `scrollIntoView` settles within one frame.
14. **The survey is real:** Q04 renders three `.ob-script-opts` reading
    `YES / NO / NOT SURE`, `YES / NO`, `FREE TEXT`, and the card's label spine
    is the eight-row form (`QUESTION … THE SURVEY … WHAT YOU LEARN`).
15. **`FIND THEM`'s link branch is alive:** Q01 renders one external
    `target="_blank"` anchor whose href is `dentalofficemgrs.example/...` —
    **derived from EV_44's `source_url`, not authored** — beside its chip.
16. **Layout at 1280:** `.ob-oq-grid` is `160px 728px`, the stack is 920,
    the fieldwork band is three columns of 357.3 holding **3 `MediaSlot`s**,
    zero horizontal overflow.
17. **Zero Deep Canopy classes** in the roadmap's DOM: `oq-grid`, `oq-label`,
    `oq-collapsed-question`, `find-them-list`, `script-block-lines`,
    `dependency-chip` and `meta-line` all return nothing.
18. `npx tsc --noEmit` · `npm run lint` · `npm test` **138/138** ·
    `npm run build` · **zero console errors on all six routes** at both widths.

**Owed to A12.** `RoadmapStep` is now a client component and `styles/components.css`
still holds `.timeline-*`; §02's rebuild takes both. The `.ob-roadmap
.timeline-step[data-pulse]` rule in §12 is a placeholder for whatever A12's
`PlanBar` uses, and `styles/components.css` §13's banner records exactly what
A11 removed so A12 knows what is left.

---

### Audit — 2026-08-21 — A8 · A9 · A10 · A11, re-checked end to end

A full re-run of all four phases' exit tests **through the Playwright MCP**
(real Chrome, not the headless shell), plus the static rituals the standing
rules ask for. Four defects found and fixed, one logged as `R25`.

**Static rituals.**
- **Rule 4, used-vs-defined `--ob-*`:** the only unresolved names are
  `--ob-cov-fill`, `--ob-fig-h`, `--ob-reveal-delay`, `--ob-ticker-offset` and
  `--ob-word-delay` — **all five set inline from JS**, none a token. Clean.
- **Every `animation:` name resolves to a `@keyframes`.** Every real
  `@keyframes` in `obsidian-app.css` is `ob-app-` prefixed (`breathe`,
  `shimmer`, `spin`, `rest`, `qspin`, `pulse`); the two apparent violations a
  naive grep reports are *inside comments* — the C1 note and §12's explanation
  of why the prefix exists.
- **Emitted-but-defined-nowhere classes** — the R2/R3/R4 failure class,
  checked by extracting every `ob-*` token from `components/`, `app/` and
  `lib/` and diffing against every stylesheet. **Two found, both fixed:**
  `.ob-unans-ord` (§10 named it; I never wrote the rule) and
  `.ob-metaline-part` (A2's, a bare flex item whose comment claims the
  separator "can never orphan" — now `white-space: nowrap`, which makes the
  claim true; **this is not R21 returning**, that was `nowrap` + `overflow:
  hidden` + ellipsis on the whole line).
- **Dead CSS in §9–§12:** one found and removed — `.ob-fig-raw`, A9's
  reservation list, orphaned when A10 replaced all nineteen placeholders. The
  §10 comment that justified keeping it was a rationalisation for dead CSS.
- **Cross-section ownership:** every multi-section class is either a §16
  reduced-motion pair (the contract) or a legitimately *scoped* descendant
  (`.ob-rfig-slot .ob-fig-bar`, `.ob-dim-head .ob-conf`, …). **One genuine
  slip fixed:** `.ob-callout-compare` / `-bar` were declared unscoped in §11,
  but a mark's own geometry lives in §4 — A10's own note says so. Moved.
- **Colour literals outside `tokens.css`:** two `#000` stops, both in
  `mask-image` gradients. **A mask's black is alpha, not colour** — it must
  stay pure regardless of theme, so tokenising it would be wrong rather than
  merely unnecessary. Same reading as A12's `.ob-plan-bar-open`; now commented
  where mine lives.
- **Zero `lib/fixtures` imports** outside `lib/db/queries.ts`.

**Browser, every numbered exit-test item, at 1440×900 and 1280×800.**

*A8, all eleven.* First finding **4,345ms** at 1440 / **4,111ms** at 1280
(in-page `MutationObserver` puts the first insertion at 2,658ms after
`DOMContentLoaded`); **19 of 19 cards inserted `data-entered="false"` /
`data-state="pending"`**; ticker advances `-340 → -374`; **12 distinct running
query sets**; zero layout shift (one unique height tuple across eight samples);
anchor drift **1.1px** with `↑ 4 new` matching `/^↑ \d+ new$/` and click
returning `scrollTop` to 0; cross-fade with both layers at `0.0006 / 0.9785`
simultaneously, `#what-we-found` 0 → 1, `scrollY` 0, path unchanged;
`0:45 · COMPLETE`; discard reason a sentence in `rgb(138,138,147)` with **zero**
raw enum keys; cascade healthy; **zero** blue offenders, 1 `.ob-dot`, 1
backdrop, 0 orbs; reduced motion mounts no console and mutates nothing over 3s;
resume at 20s shows 21 cards, clock `0:22`, **all** `data-entered="true"`, and
a further arrival; `?stall=1` reaches `data-state="stalled"` with the right note.

*A9, all twelve.* `580px 400px / 100px`; `mt-8` → `32px`; outline
`H1,H2×6,H3×8,H4×3`; `scrollMarginTop` `136px` with zero competing rules; **all
six index links land at exactly `136`** under real clicks; scrollspy
`03 DIMENSIONS` → `04 COMPETITORS`; five `#dimension-*` each with one in-page
link; `[33]` → `EV_33 · VERIFIED · Money` with `Esc` restoring focus; bracket
monopoly empty; primaries `0,0,0,0,1` (≤1, document total 1); `?thin=1` ghost
CTA at radius 999 / transparent.

*A10, all eleven.* **Height array matches A9's recording element for element at
both viewports**; every C11 value present and none of `$3,000` / `$200` / `15×`;
bars run `matrix(0,…) → 0.950`; funnel `0.4042 · 0.6595 · 1.0000 · 0.3830` with
**verified exactly 1.000**; exactly one blue mark; one hatch weave shared by the
stance segment and the contested callout, zero reds; all five figure-footer
chips resolve to the right `EV_nn`; idea column `— — CLAIMED CLAIMED CLAIMED`
with zero square marks; `DIMENSION_SHORT` vs `DIMENSION_LABEL` split verified on
one page; reduced motion resolves every numeral and bar.

*A11, all thirteen.* Canonical order, zero badges; promotion →
`Q04, Q06, Q01, Q02, Q05, Q03` with Q04 alone badged and
`You marked “Assumptions” unknown.`; clamp `3` with **all five** collapsed
questions whole; real `Enter` leaves the question text byte-identical and
occurring exactly once; fan-out `3 / 3 / 3` ticks with the tripwire tick only on
Q01 and Q04; forward and reverse pulses both pass through
`rgba(45, 127, 249, 0.42)` and clear, and a repeat click restarts (settled
`rgb(35,35,38)` → accent within 120ms); `/`'s `.ob-dot` still `2.4s`; **one**
visible primary with three cards open; nav pins at `56` with zero non-`visible`
overflow ancestors; one unique `136px` inset; outline `H1,H2×2,H3×11`; reduced
motion `animationName: none` with the border still accent and the scroll settled
in one frame; **zero** Deep Canopy classes in the DOM by exact token match.

**One defect logged, not fixed: `R25`.** `/sources` overflows by **4px at
1280** — a `.ob-finding-source-link` in the Deep Canopy `SourcesList`. The page
is untouched by these four phases and A13 deletes the component outright, so
fixing it now is work thrown away. A13 must assert
`scrollWidth === clientWidth` at 1280.

**Toolchain, after every fix:** `npx tsc --noEmit` · `npm run lint` ·
`npm test` **138/138** · `npm run build` · **zero console errors across eight
route/variant combinations at both widths**.


### A12 — 2026-08-21 — Roadmap: the time-scaled build plan

**Shipped.** `02 BUILD ROADMAP` is a time-scaled bar chart on a shared week
ruler. Four bars, the tripwire off the axis in its own band, and the page now
has an exit.

**The three amendments to A3's figure kit, as C13 requires them recorded:**

1. **`WeekAxis` — rebuilt from absolute percentages onto one CSS grid.** Its
   signature is `{ weeks, caption?, children? }`, driven by
   `planHorizon(roadmap)`; weeks are 1-indexed. Ticks are `border-left` on grid
   cells, the axis closes with a bottom `--ob-grid` rule, and the caption is
   composed from `planSpans` — measured `12-WEEK HORIZON · 3 DEFINITE SPANS ·
   1 OPEN-ENDED`. `--ob-plan-cols` is written inline and read by both the ruler
   and the lane grid, **with the `, 12` fallback in both declarations**.
2. **`PlanBar` — signature is now `{ span, name, lead, onSelect, cols, row,
   revealed, delayMs }`.** It takes a `PlanSpan` straight from `planSpans`
   rather than four loose numbers. Two props beyond the plan's list, both
   forced by the grid: **`row`, because grid's default *sparse* auto-placement
   packs W3–W6 into the same row as W1–W2 and silently collapses four lanes
   into one**; and `revealed`/`delayMs`, which carry the stagger without a
   wrapper element (a `<Reveal>` div between the lane grid and the bar would
   break `grid-column` placement outright).
3. **`.ob-plan-bar-conditional` is removed** from §4 and from the component.
   Zero residue in the DOM, asserted.

**`WeekAxis` and `PlanBar` are exempt from the `Figure`-needs-a-citation rule**
— they are layout derived from the plan, not marks derived from evidence.
Neither is wrapped in a `Figure` on the page.

**R2, closed.** `components/roadmap/timeline-node.tsx` is deleted, along with
`.roadmap-timeline`, `.roadmap-timeline::before`, `.timeline-step`,
`.timeline-step::before`, `.timeline-step-heading` and `.cut-list-items` from
`styles/components.css` §13 — that banner is now empty and says so. A11's
interim `.ob-roadmap .timeline-step[data-pulse]` rule in §12 is gone too,
absorbed by §13's `.ob-plan-step[data-pulse]` / `.ob-tripwire[data-pulse]`,
both on A11's `ob-app-pulse`. **§13 declares no `@keyframes` and no
`scroll-margin-top`.**

**Heading outline, for A15:** `/roadmap` measures `H1 ×1 · H2 ×2 · H3 ×11` —
exactly C17's row, unchanged under `?thin=1`. The `02 BUILD ROADMAP` eyebrow is
the `<h2>`; the four step names and the tripwire heading are h3s.
**A12's own exit test item (14) said "one `H1` and eleven `H2`, no `H3`", which
contradicts C17.** C17 is the single source and is what shipped; the exit-test
line is the slip.

**Three plan values that could not be used verbatim, all measured:**

- **`.ob-plan-bar:hover` sets `background: var(--ob-raised)`, not
  `var(--ob-base)`.** `--ob-base` is the 320ms duration token; the declaration
  would have voided silently and hover would have done nothing to the fill.
- **`.ob-plan-bar:active` is a border change, not a `translateY(1px)`.**
  `.ob-reveal` owns this element's `transform` for the length of the lane
  stagger, and a `:active` translate wins by source order — a pressed bar would
  strand 22px low mid-entrance.
- **`.ob-plan-bar--open`'s label is `text-overflow: clip`, not `ellipsis`.** One
  week is 93px and `LATER, AND ONLY IF` does not fit; an ellipsis rendered
  `LATER, …`, which reads as *truncated* when the claim is *this does not end*.
  Clipped, the label runs off the edge and fades under the bar's own mask.

**Motion, for A15's §16 diff.** Two selectors added to the app-side reduce
block: `.ob-plan-step[data-pulse]` and `.ob-tripwire[data-pulse]`, both
resolving to a held `--ob-hairline-accent` rather than merely stopping. The
lane stagger is `.ob-reveal` (4 lanes × 120ms), whose end state
`obsidian.css` §16 already resolves — **measured `opacity: 1`,
`transform: none`, `filter: none` under reduce.** **No JS branch is needed on
this half**: JS sets one data attribute and CSS animates, and
`scrollIntoView({ behavior: 'auto' })` under reduce is already
`RoadmapProvider`'s from A11. **No JS writes `transform` on this route.**

**Style guide.** The `WeekAxis + PlanBar` row moved out of `figures.tsx` and
into the Roadmap section's composed `RoadmapTimeline`. `PlanBar` is now a real
`<button>` with an `onSelect`, so it can only live inside a client subtree with
a `RoadmapProvider` above it; keeping a row in the server-rendered figure
gallery would have meant a second, inert geometry for the same figure.

**Exit test, measured at 1440 and 1280.** Twelve resolved tracks, spread
**0.0125px**, summing to **1119.99** against an axis content width of **1120**
— the C5 geometry, not 12 × 100px. Bar widths `2/4/5/1` twelfths at starts
`0/2/6/11`, **exact to three decimals and byte-identical at both widths**.
Four `.ob-plan-bar`s; `#step-WHAT_WOULD_CHANGE_THIS_PLAN` is not a descendant
of `.ob-week-lanes`. `.ob-plan-bar--lead` computes `rgb(244, 244, 245)` with a
`rgb(10, 10, 11)` label, and **zero elements under `.ob-week-lanes` compute
`rgb(45, 127, 249)` on any colour property**. The open bar's `maskImage` is a
gradient with `borderRightWidth: 0px`; zero `.ob-plan-bar-conditional`.
`.ob-notinit-item` is `textDecorationLine: none`, `rgb(244, 244, 245)`.
Real-click wiring both ways: a `PlanBar` → `#step-THEN`, the `Q06` chip →
`#question-Q06`, and Q01's `▸ What would change this plan` →
`#step-WHAT_WOULD_CHANGE_THIS_PLAN`, each sampled six times at 120ms —
attribute absent → present → absent, colour passing through
`rgba(45, 127, 249, 0.42)`, headings landing clear of the 56px header.
`scrollMarginTop: 136px`. `?thin=1`: zero `.ob-plan-bar--lead`, `.ob-tripwire`
precedes `.ob-week-axis` in document order, its label chip takes the solid
`--ob-text` fill and its heading renders at 43.2px. Tabbing the exit band with
real key presses gives all three links a `1.6px solid rgb(45, 127, 249)`
indicator at `transitionDuration: 0s`, and `Everything we checked →` resolves
to `/r/sms-rebooking-4f2a/sources`.

**Exit-test item 8 could not be run as written.** It asserts `.ob-dot`'s
`animationDuration` is still `2.4s` on this route; **there is no `.ob-dot` in
the DOM on `/roadmap`** — the live dot is the console's, and a completed run
does not render one. The property it protects is still guarded: §13 declares no
`@keyframes` at all, so there is nothing here that could shadow
`obsidian.css`'s `ob-pulse`.

**One layout defect found by screenshot and fixed:** `.ob-plan > * + *` and an
explicit `.ob-plan-steps { margin-top: 56px }` stacked into a 112px hole under
the last lane. The explicit rule is gone; measured gap is now **56px**.

**Toolchain:** `npx tsc --noEmit` · `npm run lint` · `npm test` **138/138** ·
`npm run build` · **zero console errors at 1440 and 1280**.

---

### A13 — 2026-08-21 — Sources: the Evidence Explorer

**Shipped.** `/sources` is the `EvidenceExplorer`: a 2-up `01 THE RUN` band, a
260px `FacetRail` with six live-counted groups, and one uniform 140px row per
record across all **65**, verified and discarded interleaved by date. The page
had been a 68ch list in a 1360px page with no way to answer where the evidence
came from, how recent it is, what argues against, or what the report left out.

**`lib/explorer-facets.ts`, added to the naming contract.** Pure: `FacetState`,
`FacetGroup`, `FacetCounts`, `DomainFacet`, `parseFacetParams`,
`serializeFacetParams`, `applyFacets`, `facetCounts`, `domainFacets`,
`quarterOf`, `quartersOf`, `sortRecords`, plus `ExplorerRecord`/`isDiscard`/
`toggleFacet`/`EMPTY_FACETS`/`DOMAIN_TAIL`. **25 new unit tests, all green on
the first run** — every number in A13's facet table is the fixture's, not a
transcription: dimensions `19 · 15 · 10 · 17 · 4` over 65 and `14 · 11 · 7 ·
13 · 2` verified, `Money ∩ Contests = 3`, `∩ Q3 = 2`, quarters summing to 65
with a verified subset of `9 · 12 · 13 · 13`, all three deliberate
kept/discarded domain collisions reading higher than their verified figure, and
`cited + uncited = 47`. Each of the five sorts is asserted to be a **total
order** by re-sorting its own output and a reversed input and demanding an
identical id sequence — the cheapest test that catches a comparator returning 0
for two distinct records.

**Deleted:** `components/validate/sources-list.tsx`, and with it the third of
R14's three dimension vocabularies (`DIMENSION_FILTER_LABEL`). **R13's proof
migrated** from `SourcesList`'s `Money (13)` pill to the explorer's `Money`
facet, and is now stronger: the drawer readout is measured at
`1 of 2 · FILTERED` → `2 of 2 · FILTERED` with Next `disabled`, against a
two-record filtered scope.

**Four things beyond A13's Build list, each forced and each load-bearing:**

1. **`app/r/[slug]/layout.tsx` gained `getReport`** (six fixture reads, not
   five) and passes `citedIds` through `RunShell` to `EvidenceOverlay`. C16
   requires the overlay to render the same `EvidenceExplorer`, and the
   `IN THE REPORT` facet cannot exist without the report.
2. **`EvidenceExplorer` gained `syncUrl`, default `true`; the overlay passes
   `false`.** The dialog is a layer over whatever route you were reading, and
   `window.history.replaceState` from inside it would write `?dim=MONEY` onto
   `/validate`'s URL — corrupting the one thing this product distributes.
   Verified: opening the overlay on `/validate` leaves `location.search` empty.
3. **`RunHeader` no longer renders `EvidenceButton` on the `sources`
   segment.** On the explorer's own route the button opens a dialog containing
   the page you are looking at, and two mounted explorers would both call
   `setScope` — the overlay's unfiltered list mounting last and silently
   winning over the route's live filter.
4. **`describeActive` routes every part through its label map.** The empty
   state printed `CHALLENGES` while the rail two inches left said `Contests` —
   a fourth spelling of R14's vocabulary, surfacing exactly where a confused
   reader is looking.

**Four measured corrections to the plan's own numbers:**

- **The list column is 956px at 1440, not 1036.** A13 computed `1360 − 260 −
  64`, but `--ob-container-app` is 1360 **including** its 40px gutters, so the
  content box is 1280 and the column is `1280 − 260 − 64 = 956`. At 1280 the
  plan's second figure is right for the same reason it was wrong for the first:
  876, measured 860.8 once the vertical scrollbar is accounted for.
- **The three `.ob-fig-mark` heights are 190 / 140 / 444, not 176 / 140 / 424.**
  190 and `FIG_H.domains(13, 16) = 444` are what the exported constants
  actually return; A13's exit-test line disagreed with its own Build list,
  which said 190 / 140 / 396. **The reason breakout initially measured 150.4
  against its reserved 140** — a mark taller than its declared height is a bug
  in the mark, so `.ob-discard-reason-row`'s padding went 8px → 6px and it now
  lands at 140 exactly.
- **`.ob-src-row` uses `height`, not `min-height`.** With `min-height` the
  three row shapes measured **140 / 140.8 / 144** — sub-pixel line-box rounding
  on the two-line clamps plus the discard row's third line. A13 says the
  invariant is that all 65 rows are *identical*, not that they are 140, and a
  0.8px near-miss is invisible in a screenshot and fatal to the layout-shift
  assertion. Both content stacks are measured to land under the box (verified
  138, discarded 139.2); `scrollHeight > clientHeight` is **0 rows**.
- **The `STANCE` rail runs supports → neutral → contests, not schema order.**
  `StanceSchema.options` is `supports · challenges · neutral`, and rendering
  that order would have put a fourth sequencing of the stance vocabulary on
  screen beside three surfaces that all read positive-to-negative.

**R25, closed.** The 4px horizontal overflow at 1280 that A8's audit logged
against the old `SourcesList` survived the rewrite in a new host: a
`.ob-src-domain` measured **243.6px inside a 200px track**. Truncated with
R21's one sanctioned ellipsis — a hostname loses nothing, and the `↗` beneath
it still resolves to the exact URL. `scrollWidth − clientWidth` is now **0 at
both 1440 and 1280**.

**§14's class list, as shipped.** Everything in A13's closed list, plus eight
this composition needed: `.ob-sources` `.ob-sources-head` `.ob-sources-band`
`.ob-sources-h2` `.ob-sources-sub` (the page frame, which the plan named in
prose but not in the list), `.ob-explorer-main` (the grid's second child needs
`min-width: 0` or a 200px meta column blows the track out), `.ob-rail-head`
(the fixed-height block that makes `Clear all` ↔ the idle line shift nothing),
`.ob-facet-list` / `.ob-facet-list--scroll` (the domain group's own
`max-height`, which the plan specifies but gave no hook for),
`.ob-src-discarded`, `.ob-src-reason-prefix` and `.ob-run-note`. **No token, no
colour value, no second `--ob-anchor-inset` rule, no reduce block in §14.**

**Motion, for A15's §16 diff.** One selector *pair* added:
`.ob-src-list[data-entrance='on'] .ob-src-row, .ob-src-row`. **The long
selector is not redundant, and this was measured rather than reasoned about** —
exactly the trap already recorded for A10's `.ob-rfig-slot .ob-fig-bar`. §14's
`.ob-src-list[data-entrance='on'] .ob-src-row` is (0,2,1) and out-specifies a
bare `.ob-src-row` regardless of order, so with only the short selector every
row still reported `animationName: 'ob-app-src-row-in'` under reduce. It
*looked* correct only because `obsidian.css` §16's universal blanket crushes
the duration to 0.001ms — the rule was dead and the blanket was covering for
it. Now all 65 rows report `animationName: none`, `opacity: 1`,
`transform: none`. **No JS branch is required on this half**: JS sets one data
attribute and CSS does all the animating, so there is nothing for
`useReducedMotion()` to switch off — noted so a reviewer does not flag standing
rule 16.

**Exit test, measured at 1440 and 1280.** `.ob-explorer`'s first track is
exactly `260px`. **65 `.ob-src-row`s, every one 140px, 18 of them
`--discarded`.** Outline: 1 `h1`, 2 `h2`, 6 `h3`, the six h3s reading
`DIMENSION` `STANCE` `STATUS` `IN THE REPORT` `DOMAIN` `WHEN` inside
`nav[aria-label="Filter the evidence"]`. The only element computing
`rgb(45, 127, 249)` inside `#the-run` is `.ob-funnel-bar-verified`. The click
sequence: `Money` → `SHOWING 17 OF 65 · NEWEST FIRST` with `DIMENSION` still
`19 · 15 · 10 · 17 · 4` and `STANCE` recomputed to `Supports 4 · Neutral 6 ·
Contests 3`; `Contests` → `SHOWING 3 OF 65` and zero discards; `Q3 2025` →
`SHOWING 2 OF 65`. **After every click `#everything-we-checked`'s top and
`.ob-rail`'s height are byte-identical** (1139.775 / 796 throughout) and the
facet count stays 30 — nothing was hidden. URL reads exactly
`?dim=MONEY&stance=challenges&q=2025Q3`; reloading it renders the same two rows
on first paint with the three facets already pressed at `rgb(45, 127, 249)`.
`Discarded` alone → 18 rows, all `--discarded`, every reason a **sentence**
(never a snake_case key) in the sans stack at `rgb(138, 138, 147)` with only
its prefix at `--ob-discard`'s `rgb(74, 74, 82)`, excerpts `line-through`, and
**zero red-dominant computed colours anywhere in the list**. Opening a discard
gives drawer title `Discarded excerpt`, id `DS_10`, position against 18.
`[role="button"] a` is **0**; exactly one `.ob-btn-primary`.
`data-entrance` is `"on"` at load and `"off"` within 600ms, and every visible
row's `animation-name` is `none` after a facet click. Empty combination renders
`Nothing matches this combination.` over `PRACTICAL · CONTESTS · Q1 2025` and a
`Clear all facets` ghost button. Grep audits: **no unprefixed `@keyframes` in
`obsidian-app.css`**, exactly one `ob-app-src-row-in` across `styles/*.css`, no
new hardcoded colour outside `tokens.css`, and every undefined `--ob-*` in the
file is one a component writes inline (`--ob-plan-cols`, `--ob-src-delay`,
`--ob-reveal-delay`, `--ob-fig-h`, `--ob-cov-fill`, `--ob-ticker-offset`), each
with its fallback where one is wanted.

**Handed to A14, as A13 owes it.** `sources/loading.tsx` is rebuilt to the
shipped shape and needs only measuring: the `01 THE RUN` frame reserving
`FIG_H.funnelExpanded` / `FIG_H.reasonBreakout` / `FIG_H.domains(13, 16)` =
**190 / 140 / 444** read from the exported constants, a 260px rail carrying the
**six real legends as live text**, and ten `.ob-src-skeleton` rows at
`--ob-src-row-h`. It no longer emits `.finding-row`. **A14 still owns
`app/r/[slug]/sources/error.tsx`** — this segment has none, so a
`getEvidence`/`getDiscarded`/`getReport` failure still falls through to the app
boundary and loses the `RunShell` chrome. The two empty-state strings
(`Nothing matches this combination.`, `Nothing passed the check for this run.`)
live in `SOURCES` in `lib/content/app.ts` and are the only copies.

**Toolchain:** `npx tsc --noEmit` · `npm run lint` · `npm test` **163/163**
(138 + 25 new) · `npm run build` · **zero console errors at 1440 and 1280**.

---

### A14 — 2026-08-21 — Supporting surfaces + the state matrix

**Shipped.** Every surface outside the four run pages renders Obsidian, the four
route-level skeletons mirror the grids they stand in for, and the state matrix is
walked and settled. `/style-guide` is rebuilt around the three things that have
no route of their own.

**The invalid-run page was structurally unreachable, and that is the finding of
this phase.** Nothing in the tree called `notFound()` — `getRun` ignores its slug
by contract — so `/r/definitely-not-a-run` rendered the fixture run in full. The
exit test navigating there and asserting an Obsidian 404 would have passed
against a fully-rendered report: an assertion measuring air. Fixed with one seam
function, `runExists(slug)` in `lib/db/queries.ts` (a `SELECT 1` later), called
from `app/r/[slug]/layout.tsx` before its six reads. Two slugs are real: the
fixture's, and any 10-char lowercase-hex slug `createRun` could have minted.
**Six new unit tests** pin both classes and the four ways to be wrong.

**`app/r/[slug]/not-found.tsx` is deleted, and this is a deviation from the Build
list with a measured reason.** `notFound()` "terminates rendering of the route
segment where it was thrown", and a segment's own `not-found.tsx` renders *inside*
that segment's layout — so a throw from the layout can never reach it. Measured:
the first build of this phase rendered the **root** 404 (`There's nothing here.`)
at `/r/definitely-not-a-run`, not the run-specific one. And had it been reachable
it would have rendered wrapped in `RunShell`, claiming a header, a stage rail and
a footer for a run that does not exist — which the phase body forbids. The branch
now lives in `app/not-found.tsx`, a client component reading `usePathname()` —
the same pattern `app/error.tsx` already uses for the same structural reason, that
a boundary cannot receive route params. The surface itself is
`components/layout/run-not-found.tsx`. One boundary, correct 404 status, no
chrome, correct copy for both cases.

**§15 as shipped.** All fourteen named classes, plus **one beyond the closed
list**: `.ob-send-error`. The `?sendfail=1` state needed a register between
`.ob-error-panel` (a 28/32 panel, far too heavy for one line in a 64ch column)
and nothing at all. Recorded here rather than folded silently into a neighbour.
**No `@keyframes` in §15**, as specified — nothing on these surfaces moves.

**The one edit outside §15, as sanctioned: the shimmer is gone.** `.ob-skeleton`
was `ob-app-shimmer 1.6s linear infinite` — neither ambient (20–50s) nor
structural (150–900ms), so it sat in the dead zone the motion binary exists to
keep empty, and it claimed work was happening on a block that was only waiting.
`@keyframes ob-app-shimmer` is deleted with it, and §16's now-dead
`.ob-skeleton { animation: none }` entry with that. **A2's build-log line
asserting the shimmer's `backgroundPosition` moves over 400ms is superseded.**
The class name is unchanged.

**`.ob-skel-row` exists but `/sources` does not use it.** §14 already ships
`.ob-src-skeleton`, pinned to `--ob-src-row-h` and measured by A13 at exactly
140px. A second identical class to satisfy a literal string in an exit test is
the churn the naming contract exists to prevent, so `.ob-skel-row` serves the
roadmap's five collapsed question rows, which had no class, and the exit test's
row-height assertion reads `.ob-src-skeleton`. Measured: `.ob-src-skeleton` 140px
== `.ob-src-row` 140px.

**Four measured corrections to the skeletons, each found by measuring rather than
reasoning:**

- **`FIG_H.x` is the height of the *mark*, not of the figure.** Reserving only
  the marks left `/sources`'s `01 THE RUN` band **114.1px short**, which dragged
  the whole explorer up the instant the band landed. Each mark is now wrapped in
  the real `.ob-fig` frame with a real caption and a real footer; the band's
  height delta is **1.6px**.
- **A blank sized by a typed number is a blank sized wrong.** A `height: 21`
  block standing in for a 21px `.ob-lead` reserves 21px, but the paragraph is
  31.5px because its line-height is 1.5; the same error on a 12px mono ledger
  (16.8px line box) is 4.8px. Together they pushed the report's sticky section
  index down by exactly **15.3px**. Fixed structurally with `SkeletonInline`,
  which is `height: 1em` inside the *real* element, so the element's own
  line-height sets the height and it cannot drift. Validate and roadmap now
  measure **0.00px** on both top and height.
- **The `/sources` back link renders as real text, not a blank.** Its words and
  its arrow are knowable before any data arrives; only its `href` is not. A blank
  was also 8.4px short, because `.ob-text-action` is an `inline-flex` whose height
  its content sets.
- **The plan's `|Δ| ≤ 8px` on `main`'s height only holds for Define**, which is
  pinned at `calc(100vh - header)` and measured **0**. The other three are
  scrolling documents whose fallbacks are legitimately shorter than their loaded
  pages (validate 1593 → 11109). Matching total height would mean reserving
  11109px of blank space for content that resolves instantly. The equivalent
  invariant, and the one that actually prevents a visible jump, is that
  **elements present in both states land at identical offsets** — asserted per
  route and now ≤ 1.6px everywhere.

**Measured, on the four fallbacks:** `.ob-skel-field` count on define is **12**,
not 6 (R20's worst case). Every `.ob-skel*` node reports `animationName: 'none'`.
`gridTemplateColumns` is byte-identical between fallback and loaded page on all
four grids — define `1000px 440px`, report `580px 400px`, `.ob-oq-grid`
`160px 728px`, `.ob-explorer` `260px 956px`. Roadmap renders exactly **4**
`PlanBar` lane reservations with the `TripwirePanel` outside `.ob-week-lanes`,
and its six question ids render in C6's priority rank — expanded `Q06`, then
`Q01 · Q04 · Q02 · Q05 · Q03`. The rail renders exactly **6** `.ob-facet-legend`
nodes reading `['DIMENSION','STANCE','STATUS','IN THE REPORT','DOMAIN','WHEN']`.

**`?sendfail=1`, and the one line that broke the promise it exists to protect.**
`Composer.handleSend` called `setValue('')` **unconditionally**, so a rejected
send cleared the field regardless. `onSend` now returns `boolean` and the field
clears only on `true`. Retry re-submits the composer's *own* current value via a
`retrySignal` counter rather than a copy the controller stashed — a stashed copy
would append a turn while the field still showed the same words. On rejection
**no user turn is appended**: nothing was sent, so nothing happened. Measured:
sends 1 and 2 land and clear; send 3 renders `Couldn't send that. Your text is
safe.` + `Retry` with `textarea.value === 'attempt number 3'` and the user-turn
count unchanged at 3; Retry then sends it, clears the field and dismisses the
notice.

**The notice lives above the composer, not in the transcript, and that is an a11y
fix not a layout preference.** The first build put it in the thread — where the
plan's wording points — but `.ob-define-scroll` carries `aria-hidden="true"` so a
typing paragraph is never read letter by letter. An error rendered there is
invisible to assistive tech, and a focusable `Retry` inside an `aria-hidden`
subtree is a genuine violation. Moving it into `Composer`'s `notice` slot also
puts it beside the text it is about and out of reach of the scrollport.

**`StatusBadge`'s fate, decided.** `RunFooterBar` does **not** carry it.
`ALL SYSTEMS OPERATIONAL` is a status-page claim this product cannot make from a
fixture, and its `.ob-dot` would put a second pulsing accent dot in the same
viewport as `PhaseStrip`'s. It survives in `/style-guide#ui-atoms` and nowhere
else — measured: exactly one `.ob-dot` on the page, and it is in `#ui-atoms`.

**`/style-guide`, rebuilt.** Seven sections: `foundations` · `ui-atoms` ·
`layout` · `figures` · **`evidence`** · **`chrome`** · **`states`**.
`define.tsx`, `roadmap.tsx` and `validate.tsx` are **deleted** — page-composition
galleries, and the four real routes now *are* that gallery. `RunHeader` is
deliberately not reproduced in `chrome`: it is `position: fixed` with a
constant-height spacer, so a specimen would need its defining property switched
off. Measured: 17 `.ob-fig`, **zero without a citation**; all three `FindingCard`
variants; three `StageRail` states; `#states` renders all four skeletons (12
skel-fields, 6 legends, 12 week ticks) and six error surfaces, every one static.
`metadata.title` stays `'Style Guide'` — the root template is `'%s — Groundwork'`,
so it already renders `Style Guide — Groundwork`; writing the suffix would double
it.

**The state matrix, walked.** Every row disposed of as the table specifies.
Define gains `?broken=1` (root boundary, deliberately no segment boundary —
nothing has been produced yet that losing the chrome would strand) and
`?sendfail=1`; `/sources` gains `?broken=1` and its new segment boundary. The
sources error copy is the **fuller** sentence, diverging from A13's hand-over note
as the phase body requires — recorded so it is not "corrected" back.

**Exit test, measured at 1440 and 1280.** Invalid run: `<html>` background
`rgb(10, 10, 11)`, h1 66.24px at weight 400 in Geist, **0** box-shadows, exactly
**1** visible `.ob-btn-primary`, **0** Deep Canopy leftovers, `.ob-orb` present at
`38s` running `ob-app-breathe`, **0** `.ob-backdrop`, no run chrome, no horizontal
overflow. Boundaries: chrome survives on both segment boundaries and is absent on
the root one; **zero red-dominant computed colours on all five**. Toolchain:
`npx tsc --noEmit` · `npm run lint` · `npm test` **166/166** (163 + 3 new
`runExists` cases) · `npm run build`.

**Two console-error exceptions, both honest.** The invalid-run and root-404
routes log `Failed to load resource: … 404 (Not Found)` — that is the document's
own intended status, not a JS error. And in **dev only**, an aborted Server
Component makes React's performance tracing emit
`TypeError: … 'RunLayout' cannot have a negative time stamp`; confirmed absent
under `next start`.

---

### A15 — 2026-08-21 — Sweep: motion, a11y, deletion, DoD

**Shipped.** Deep Canopy is gone from the repository, the motion inventory obeys
the binary, reduced motion resolves in both halves, the a11y floor is verified
with real key presses, contrast is measured against Obsidian, and every shared
link previews as a real 1200×630 card.

**The deletion was inert, and the baseline is what proves it.** Step 0 swept nine
routes before touching a file; step 8 re-swept them. Every visual metric is
**identical**: `<html>` background `rgb(10, 10, 11)` and body font Geist on all
nine; h1 size/weight/colour/tracking/family unchanged on every route
(`103.68px/400/rgb(244,244,245)/-3.6288px/Geist` on `/`, validate and
style-guide; `66.24px` on roadmap, sources and the invalid run; `43.2px` on
define and `/nope`); box-shadow counts unchanged (1 · 0 · 0 · 0 · 0 · 0 · 0 · 0 · 1).

**The cascade still works, which is the check that matters most.** An element
carrying both a `.ob-` recipe and a Tailwind margin still resolves to the
utility: `ob-h1 mt-8` → `32px`, `ob-h2 mt-8` → `32px`,
`ob-h1 ob-standalone-head-line mt-7` → `28px`. Had a recipe file lost its
`layer()`, these would read `0px` and the page would still look plausible.

**Two intended deltas, both explained.** `body`'s background moved
`rgba(0, 0, 0, 0)` → `rgb(10, 10, 11)`: A0's `transparent` existed only to stop
the green `--bg-base` painting over the canvas `<html>` carries, and with the
green gone, painting the same colour twice is a no-op that makes
`getComputedStyle(document.body).backgroundColor` an honest thing to assert.
`.ob-backdrop` is `z-index: 0`, not negative, so it still paints above it. And
node counts rose 12–17 per route — **entirely the 16 new OG/Twitter `<meta>` tags
in `<head>`**; `document.body.querySelectorAll('*')` is unchanged.

**Step 4 was the trap, exactly as written.** A0 landed
`[data-theme='obsidian'] body` and `[data-theme='obsidian'] :is(h1..h6)` at
higher specificity so the attribute could beat `@layer base`'s direct `body`
declaration. Step 6 removes that attribute, at which point both rules stop
matching and the whole app reverts to Inter Tight on forest green — silently. So
the fold **is** the fix: the `--ob-*` values moved into the plain rules and both
scoped overrides were deleted in the same edit, and `getComputedStyle` was read
**after** step 6, not before.

**One deviation from step 4's mapping.** `h1..h6` keeps `--ob-tracking-snug`
rather than moving to `--ob-tracking-h2`. That mapping was written before A0
landed the rule it is mapping; snug is what A0 chose and what every route was
measured against, and every heading that matters carries `.ob-display` /
`.ob-h1` / `.ob-h2` / `.ob-h3`, each of which sets its own tracking.

**The grain would have failed loudly and didn't.** `body::before` read
`var(--grain-opacity)`, a Deep Canopy token with no `--ob-*` equivalent — the
moment `tokens.css` lost its first `:root`, that declaration would have voided
entirely, leaving a **fully opaque noise layer over the whole product** with no
error. Moved into `obsidian.css` §1 with a literal `0.035` in the same commit,
and measured at `0.035` on all nine routes afterward.

**Two rules deleted rather than de-scoped.** `obsidian.css`'s `:focus-visible`
and `::selection` existed only to beat globals.css's Deep Canopy `--accent`
(#7FB8E8). Step 4 rewrote those base rules onto `--ob-accent`, so the overrides
became two rules restating what they were overriding — and the specificity risk
step 5 flags went with them.

**Motion: five retunes and two named exceptions.**

1. **`.ob-rest-dot` 1.4s → 2400ms**, its stagger delays scaled `0.16/0.32s` →
   `274/549ms`.
2. **`ob-app-qspin` 1.6s → `--ob-enter`** (900ms), `linear` retained.
3. **`ob-cue` 2.6s → 2400ms**, joining the system's one infinite period.
4. **`.ob-collage-card` 1400ms → `--ob-enter`** — a hardcoded entrance transition
   written inline in `hero-collage.tsx`, invisible to a stylesheet grep. Its
   easing is now the token rather than a repeated literal.
5. **`CountUp` 1100ms → 900ms** — a rAF loop, so the motion binary *cannot see
   it*, which is precisely why it is written down.

The Accordion retune the plan asks for was already unnecessary: the live
`.ob-acc-wrap` was on `var(--ob-base)`, and the 300ms copy was
`components.css`'s, now deleted. `.ob-spinner` was already at 900ms.

**Two sanctioned dead-zone exceptions, allowlisted by name, not by widening the
band.** `.ob-caret` at **1000ms**: a caret blink is a depiction of a real object
— a hardware cursor blinks at about 1Hz — and at 2400ms it reads as broken rather
than as typing, the same argument that makes the typewriter's 15ms/char a rate
rather than a duration. And `.ob-define-handoff-rule` at **4000ms**, which is a
countdown, not a transition.

**The binary, measured per route.** `/validate`, `/roadmap`, `/sources`,
`/r/no-such-run` and `/nope` return **empty**. `/define` returns only `.ob-caret`
at 1000. `/` and `/style-guide` return only `.ob-dot` / `.ob-rest-dot` at 2400.
Easing: every non-zero `transitionTimingFunction` on every route is
`cubic-bezier(0.16, 1, 0.3, 1)`.

**`@keyframes` hygiene.** Six real declarations in `obsidian-app.css`, every one
`ob-app-`-prefixed (`breathe` · `spin` · `rest` · `qspin` · `pulse` ·
`src-row-in`); six in `obsidian.css` (`ob-blink` · `ob-cue` · `ob-drift` ·
`ob-drift-alt` · `ob-marquee` · `ob-pulse`); **zero collisions**. Note for
whoever greps this next: a naive `grep '@keyframes'` reports `ob-pulse`,
`ob-app-shimmer` and `anywhere` in `obsidian-app.css` — all three are prose in
comments. Anchor the pattern to the line start.

**Reduced motion: the completeness diff found a real hole.** Diffing the 57
animated `.ob-*` classes in §1–§15 against §16's selector list surfaced
`.ob-chip-verified`, which §6 sets to `opacity: 0; transform: translateY(4px)`
at **(0,3,0)** under `[data-state='pending']`. A bare `.ob-chip-verified` in §16
is (0,1,0) and loses regardless of order — the rule the plan asks for would have
been **dead on arrival**, and would have looked fine because the universal
blanket crushes the duration to 0.001ms. **This is the third instance of that
exact trap in this file** (A10's `.ob-fig-bar`, A13's `.ob-src-row`). Fixed with
`.ob-finding[data-state] .ob-chip-verified` and a matching `.ob-verify-rule`
entry. `.ob-xfade-report` deliberately gets **no** entry: under reduce
`ValidateView` returns the report with no wrapper, so
`[data-arrived='false'] #what-we-found` cannot match.

**Reduced motion, JS half, measured at t=1200ms.** `/validate`: `.ob-console` is
**false** — the report renders directly, 47 findings, no fade, no timer chain.
All `.ob-reveal` at `opacity: 1`, all measured transforms `none`, and the live
animation-duration list is **empty on all four routes**. `caret: false` on
Define. `/sources` renders all **65** rows. Two gaps closed so these assertions
are real rather than vacuous: `CountUp` now emits `data-value` (the plan warns
that `every()` on an empty list passes), and `ScrollReveal` sets
`data-shown={reduced || inView}` — the pixels were already right, but only
because the blanket was covering for an attribute that never flipped, which is
exactly how a dead rule hides.

**A11y floor, verified with real Tab presses** (`el.focus()` does not trigger
`:focus-visible`). 40 consecutive presses on `/sources`: **40/40 show an
indicator**, every `outlineColor` is `rgb(45, 127, 249)`, every ring reports
`transitionDuration: 0s` — they snap — and `SkipLink` is **first** in tab order
(R19).

**Document outlines match C17 exactly**, after two markup fixes:

- **Define emitted `<p>THE BRIEF</p>`, not an `<h2>`.** C17 requires h1 ×1 ·
  h2 ×1. Promoted; `.ob-meta` sets family, size, weight, tracking, transform and
  colour in `@layer components`, so the level changed and not one pixel did.
- **`/validate` skipped h2 → h4 at `ChairSync`.** `CompetitorCard` emitted
  `<h4 className="ob-h3">` under a section whose own heading is its `<h2>`, with
  no intervening level — a real skip. Now `<h3>`, identical size. **C17's table
  is amended in the same commit**, per its own instruction: the route is
  `h1 ×1 · h2 ×6 · h3 ×11 · h4 ×0`, and no route in the build emits an `<h4>`.

Measured outlines: define `1/1/0`, validate `1/6/11/0`, roadmap `1/2/11`,
sources `1/2/6` with six `.ob-facet-legend` `<h3>`s inside
`nav[aria-label="Filter the evidence"]`, invalid-run and root-404 `1/0/0`. **No
route skips a level.** The four `sr-only <h2>`s A15 reserved the right to add
were **not needed** — A11, A12 and A13 had already shipped `SectionLabel as="h2"`
on roadmap and real sentence `<h2>`s on sources.

**Contrast, computed from `styles/tokens.css` and recorded.**

| Foreground | on `--ob-canvas` | on `--ob-void` | on `--ob-surface` |
|---|---|---|---|
| `--ob-text` #f4f4f5 | 18.00 | 18.43 | 17.29 |
| `--ob-muted` #8a8a93 | 5.78 | 5.92 | 5.55 |
| `--ob-dim` #5b5b64 | 2.95 | 3.01 | **2.83** |
| `--ob-discard` #4a4a52 | 2.25 | 2.31 | 2.17 |
| `--ob-accent` as text | 5.20 | 5.32 | 4.99 |

`--ob-on-accent` on `--ob-accent`: **3.81**. `--ob-hairline` on canvas **1.26**;
`--ob-hairline-strong` **1.60**.

Five rulings, unchanged from the plan and now measured rather than expected:
`--ob-muted` passes AA everywhere (worst case 5.55) · `--ob-dim` fails AA at 12px
and is permitted only for duplicated or non-essential metadata · white on accent
is 3.81 and is **accepted and documented**, because the only fix is a darker blue
and that would replace the system's single identifying hue · the hairlines are
below 1.4.11's 3:1 and are accepted because **no boundary is ever the only
carrier of meaning** · `--ob-discard` at 2.25 is deliberate.

**The `.ob-meta` audit passes with no change.** The three call sites the ruling
names are already bright: the header's `47 VERIFIED` (`.ob-evidence-btn`) and
`SHOWING 65 OF 65` (`.ob-src-count`) both compute `rgb(138, 138, 147)` =
`--ob-muted` at 5.78, and `.ob-fig-value` computes `rgb(244, 244, 245)` at 18.0.
The two `--ob-dim` ledgers that remain — the header's and each page's `MetaLine`
— restate figures the page itself prints (the funnel, the axis caption, the facet
counts), which is exactly the duplicated-metadata case the ruling permits.

**R18, closed.** `metadataBase`, `openGraph` and `twitter` on `app/layout.tsx`;
`generateMetadata` on all four run pages with **every number derived**;
`metadata.robots = { index: false, follow: false }` on `app/r/[slug]/layout.tsx`
— `follow: false` as well, because a crawler that indexes none of them but
follows all of them still leaks a stranger's URLs. Five cards drawn in code by
the dev-only `app/style-guide/og/page.tsx` and committed to `public/og/`, each
**verified 1200×630**, at most one blue element per card. **C5's three-way
agreement asserted:** the OG description reads `a 4-step build plan`, the run
header reads `4 BUILD STEPS · 1 TRIPWIRE`, and the page meta line reads
`4 BUILD STEPS` — all three the same.

**`the-box.tsx`'s two behaviours: both deliberately dropped.** The
`sessionStorage['sv.box.draft']` mirror existed because `TheBox` was the only
place a typed idea lived before a run existed. `createRun` now writes the text to
`localStorage` under `sv.idea.{slug}` the instant a run starts, and a second key
shadowing the first is one more thing that can go stale; the *never lose user
input* promise is carried where it actually bites, on the Define composer, and is
verified by `?sendfail=1`. The live character count is dropped because
`SHORTCUT_HINT_AT` already surfaces the only useful part of it — that you have
said enough — and a raw counter is a form affordance on a product whose own OG
card says `NOT A FORM`.

**Automated sanity checks, nine routes × two widths.** Zero orphan colour
literals in inline styles; exactly one visible `.ob-btn-primary`; no pill radius
on a non-button; zero box-shadows; **no sticky element trapped in an overflow
ancestor**; `scrollWidth === clientWidth` on every route at both widths; every
`--ob-*` referenced resolves non-empty. **All six run and supporting routes are
completely clean at both widths.**

**Two fixes the sweep forced.** `/` rendered **two** visible `.ob-btn-primary` —
the nav's `Start` and the hero's `Start with an idea`, both in view at 900px
height, which is rule 11's exact failure; the nav's is now `.ob-btn-ghost`, since
the hero's is the page's action and the nav's is the persistent way back to it.
And `#states` wrapped three skeletons in `overflow-hidden`, which silently killed
`position: sticky` on the report index, the roadmap control and the facet rail —
a gallery that disables the property its specimens are defined by. Removed.

**Three findings left open, all on `/` or `/style-guide`, none introduced by A14
or A15 and none in either phase's Build list.** Recorded rather than fixed,
because restyling a signed-off landing surface at the end of a sweep is not this
phase's call:

- `.ob-nav-inner`, `.ob-badge` and `.ob-badge-tag` carry a 999px radius on a
  `<div>`, an `<a>` and a `<span>`. Rule 8 says nothing but a button gets a pill.
  (`.ob-seed` is a `<button>` and is legal.)
- `/style-guide`'s foundations section draws a 64px swatch circle — a specimen,
  not product UI.
- **`.ob-dot`'s pulse is a `box-shadow` ring**, expanding `0 → 5px` in
  `ob-pulse`. Rule 7 permits shadows only on `.ob-btn`. Recommended disposition:
  **sanction it by name** — it is a blue ring used as a live indicator, the same
  family as the two permitted blue rings, and it is not elevation. Its
  reduced-motion end state is correct (the 100% keyframe is `opacity: 1` with no
  ring).

**Toolchain:** `npx tsc --noEmit` · `npm run lint` (230 files, clean) ·
`npm test` **166/166** · `npm run build` · console clean at 1440 **and** 1280 on
every route, the two intentional 404 document statuses excepted.

---

### C2 — 2026-08-22 — Capture: the Define brief on the landing Pillars

Not a phase — the first item from Batch C of
[`higgsfield_generation_queue.md`](higgsfield_generation_queue.md), unblocked by
A0–A15 being `DONE`. **Zero generation credits: this is a recording of the real
app, not a generated asset.** Pillar 01's static `BriefFragment` now upgrades to
a 4.4s clip of `/r/sms-rebooking-4f2a/define` in motion.

**New:** `components/landing/fragment-capture.tsx`,
`public/media/capture/brief.{mp4,webm}`. **Changed:**
`components/landing/pillars.tsx`, `styles/obsidian.css`.

**No fourteenth `'use client'`.** `FragmentCapture` carries no directive —
`Pillars` already has one, so everything it imports is in the client graph and
the hooks work without spending a name from the allowlist.

**Three things the queue's C2 card got wrong, all now corrected there** (PC8,
PC9, PC10):

1. **The interaction it described does not exist.** `answeredCount` resolves
   against the *base fixture statuses*, not `revealed`, and the fixture ships
   exactly 9 filled / 3 unknown / 0 pending — so `9 of 12 answered · 3 unknown`
   is on screen from first paint and never moves. `I don't know` on a filled
   field moves the count **down**, to `8 of 12 answered · 4 unknown`. That is
   what shipped, and it is the better claim: the number falling because someone
   admitted ignorance is the product's whole thesis in one frame.
2. **A 1440 capture cannot be drawn at fragment width.** The Define aside is a
   fixed 440px column, so 1440 yields 440 real pixels and any wider draw is an
   upscale, which the capture rules forbid. Recording at `zoom:1.5` on a
   2160×1350 viewport yields 660 and makes the draw a downscale. **Zoom 2 at
   2880×1800 silently fails** — Chromium's screencast can't keep up and
   stretches the timebase ~10× (2501 frames for a 10s session), so extracted
   frames show states that never existed. Verify frame count against wall clock
   before trusting any capture.
3. **Fragment width was the wrong target anyway.** Drawn at 624 the app's 12px
   labels render ~17px and it reads as a zoomed screenshot. Drawn at its true
   440 it sits in register, and the box lands at 440×376 — within a pixel of
   pillar 02's 375.

**Two traps for anyone recording another one.** `100vh` doubles under `zoom`, so
the document overflowed and `composerRef.focus()` scrolled the whole page
mid-take; the height pins in C2's card fix it. And the seed is **load-bearing,
not a shortcut** — with `revealed: []` the frame would read *"9 of 12 answered"*
above twelve empty hairlines, contradicting itself on screen.

**It does not loop.** The end state *is* the argument, so looping would snap the
counter back to 9 and read as the number wobbling. It plays once on
`IntersectionObserver` and rests on its final frame. The fallback is the
code-drawn `Fragment` — never a poster still, which is the one thing the media
rules forbid outright — and under reduced motion no `<video>` is mounted at all.

**Standing obligation:** a capture is a photograph of one fixture state, and
this product is *about* its numbers matching. **Re-record whenever
`lib/fixtures/` changes, or pull the asset.**

**Toolchain:** `npx tsc --noEmit` · `npm run lint` (my files clean; six
pre-existing format offenders left untouched) · `npm test` **166/166** ·
`npm run build` · verified at 1440 **and** 1280: box 440×376, intrinsic 660×564,
`upscaled: false`, `loop: false`, WebM preferred over MP4; reduced motion →
**0 `<video>` elements**; with the asset blocked entirely the box stays reserved
and the fragment stays at full opacity — no layout shift.

**Superseded the same day — see the Idea Session entry below.** The capture was
reverted and `public/media/capture/` deleted. Everything above stands as the
record of how it was made, and PC9's timebase warning outlives it.

---

### Idea Session — 2026-08-22 — Pillar 01 as a coded interaction, reverting C2

Not a phase. Executes [`idea_session_build_plan.md`](idea_session_build_plan.md),
which **reverts the C2 capture logged above** and replaces it with a code-drawn
looping conversation.

**New:** `components/landing/idea-session.tsx`,
`tests/unit/session-script.test.ts`. **Changed:** `lib/content/landing.ts`
(`SESSION`, `SESSION_SCRIPT`, `sessionStepMs`, `sessionTotalMs`),
`components/landing/pillars.tsx`, `styles/obsidian.css`,
`higgsfield_generation_queue.md`. **Deleted:**
`components/landing/fragment-capture.tsx`, `public/media/capture/brief.{mp4,webm}`,
the `.ob-frag-capture*` recipes.

**Why the capture went, and it was not the recording's fault.** It met every
value in its own card. Three things only became visible once it was on screen:

1. **It told the wrong story.** Pillar 01 and section 03 (`CofounderChat`) are
   one continuous narrative — the *fitness* idea, lapsed lifters. The only
   Define surface available to capture is the *dental* fixture
   (`sms-rebooking-4f2a`), so the capture dropped an unrelated second idea into
   the middle of that arc. **This is the one worth remembering**: a capture
   ships the fixture's narrative, and the fixture was chosen for the app, not
   for the section.
2. **Geometry stopped being a design decision.** The Define aside is a fixed
   440px column, so size, zoom and duration were all compromises forced by the
   source — PC9 and PC10 are symptoms of that, not independent findings.
3. **The frame couldn't hold the argument.** `I don't know` sits in the composer
   at the bottom-left; any crop holding both it and the brief panel is ≥1240px
   wide, which renders body text at ~9px. The cause ended up off-screen.

Drawn in code all three dissolve, and it is the repo's own default. The queue's
Batch C is rewritten accordingly: C2 `SUPERSEDED`, C1 and C3 kept but re-aimed
at coded interactions, with C1 noted as the one surface where a capture may
still argue for itself (its claim *is* duration, and it is full-width).

**Blue's fourth job, written down on purpose.** The Investor lens box is blue
and is not a primary action, a verification, or a live state. That is a
deliberate owner decision taken after the conflict with rule 6 was raised, and
it is recorded as a *named job* — **an outside lens on the idea** — in the
comment above `.ob-session-lens`, precisely so a later reader deletes it
knowingly or not at all. The constraint that survives: on `/r/[slug]/validate`,
blue-plus-tick means verified, and this must never be mistaken for it. Measured
side by side — lens: `rgba(45,127,249,0.12)` fill, 2px accent rule on the **left
edge only**, no icon, `0 4px 4px 0` radius. `.ob-chip-verified`: transparent
fill, 1px `--ob-hairline-accent` border **all round**, a `✓`, 4px radius, 10px
uppercase mono. No new token; `styles/tokens.css` is untouched.

**The fixed-height scrolling transcript is the whole trick.** The script is ~3×
the card's height, so the viewport is fixed and content scrolls up as steps
land. Card height is therefore constant *by construction* rather than by
reserving space — measured 374.8px at every one of 46 samples across a full
18.6s cycle, width 624 throughout.

**Two implementation notes worth keeping.** Every step stays mounted once it is
reachable and is told `active={false}` when it finishes, rather than being
swapped from a "playing" slot into a "completed" list — otherwise the per-item
entrance animations re-fire the instant a step completes. And the transcript is
**bottom-anchored** (`justify-content: flex-end` + `min-height: 100%`):
top-aligned, the first two seconds of every pass showed one line above ~190px of
nothing, and pillar 01 read underfilled against 02's dense evidence rows.

**Two deviations from the plan, both in §3's pre-roll, both deliberate.** The
plan lists a single opening line; the shipped pre-roll is **two turns**, and the
second is longer. Both are `CHAT_SCRIPT` **verbatim** (its turns 3 and 4, the
second elided only at the front, `…` standing in for `Good — `), so no new copy
was written and the continuity the plan is protecting is strengthened, not
weakened. It buys two things: the card is 67% full at rest instead of 33%, and
turn 1 — *"honestly not sure what to build first"* — now answers a question
that is actually on screen (*"what does the first version actually do for them
in week one?"*) instead of arriving unprompted. The plan's `**Groundwork** ·`
prefix on that line is read as its speaker notation, consistent with how every
other block in §3 is labelled, and is not rendered — one attributed bubble among
seven unattributed ones would read as a bug.

**Timing is derived, not typed in.** `sessionStepMs` sums `text.length ×
msPerChar` (15 AI / 24 user, `CofounderChat`'s tuned values) plus holds;
`sessionTotalMs` = **13,598ms**, mirroring `runEventsTotalMs` so the timeline is
assertable from node. 14s rather than the 10s floor because at 10s the three
options arrive faster than they can be read.

**Deliberately not done, per plan §8:** the real `/r/[slug]/define` is unchanged,
so this previews a stage that does not exist yet — it still has a
`DontKnowButton` and a `BriefProgress` counter. Accepted debt, owner's call.
Pillar 01's `proof` line still says *"Ends with a written brief on screen"*,
which is true of the product but no longer what the picture shows; left pending
a call from the owner.

**Toolchain:** `npx tsc --noEmit` · `npm test` **181/181** · `npm run build` ·
`npx biome check` on my five files **clean** (repo-wide count went 204 → 199;
the pre-existing offenders are far more than the six the plan names, and were
left untouched). Verified with Playwright against `next build && next start` at
**1440 and 1280**: cards 624×375 / 624×375 / 624×362 — pillar 01 now matches 02
exactly; **one distinct height and one width across a full cycle**; loop resets
(block count 2→9→2) and **stops advancing when scrolled out of view** (8→8→8
over 7s); reduced motion → 9 blocks settled, `finish` present, transcript pinned
to the end, `scroll-behavior: auto`, **0 carets**, unchanged after 16s; no
horizontal overflow; **0 console errors**.

**One trap, and it cost real time.** A `next start` whose port was already held
by an earlier server fails with `EADDRINUSE` **into a log file you are not
reading**, and the browser keeps being served the *previous* build. The symptom
is a stylesheet rule that is provably in `.next/static/chunks/*.css` and
provably absent from `getComputedStyle` — which reads exactly like
`references/pitfalls.md` §1 and is not. Diagnostic: compare the chunk filenames
the page actually requests against the files on disk. If the page names a chunk
that does not exist, it is a stale server, not a cascade bug.

---

### Idea Session — 2026-08-22 — Replay instead of loop, and a closing press

Owner change, same day, on top of the entry above. Two asks: **a replay button
instead of the loop**, and **an ending where a pointer comes in and clicks
`Start the research`**. `idea_session_build_plan.md` §2's `Motion` row and §4's
timeline are amended in place rather than left to disagree with the code.

**Changed:** `lib/content/landing.ts` (`SESSION.replayLabel`,
`SESSION_POINTER_MS`, `sessionPointerTotalMs`, finish `holdMs` 3,200 → 1,200),
`components/landing/idea-session.tsx`, `styles/obsidian.css`,
`tests/unit/session-script.test.ts`.

**The loop is gone and that is a better card.** Looping made pillar 01 the
loudest thing on a page already carrying two continuous motion sources
(`Verification`'s draw-on rule, `CofounderChat`'s typing), which is what D17
caps. It also undid the new ending every 13 seconds — a card that presses its
own CTA and then wipes it reads as indecision, not as an ending. It now plays
once on scroll-in, rests, and `Replay` in the card bar is the only way back. It
still pauses when scrolled out, so leaving mid-run and coming back resumes
rather than skipping to a finished card.

**The closing gesture is drawn, not dispatched.** The CTA is a `<span>` with no
handler — it always was, because a focusable control that does nothing is worse
than a picture of one — so the press is a `data-pressed` attribute driving a dip
plus one expanding ring, and the pointer is a `MousePointer2` glyph translated
across the card. Nothing is clicked. That is consistent: the button is drawn, so
the press is drawn.

**`travel` is the second sanctioned exception to the motion binary,
allowlisted by name in `styles/obsidian.css` beside `.ob-caret`.** 760ms sits in
the dead zone between structural (150–320ms) and ambient (20–50s). It belongs
there for the same reason the caret's 1s blink does: it is not a transition, it
is a *depiction of a real object*, and a hand does not move a pointer 130px in
320ms — at `--ob-base` it reads as a glitch. The press (340ms) and the ring
(`--ob-base`) need no exception and got none.

> **Superseded by the tuning pass below.** The owner slowed the gesture and
> enlarged the ripple the same day; the exception now covers every duration in
> it, and the numbers in this entry are the pre-tuning ones.

**Three things measurement caught that a screenshot would not have:**

1. **The ring was invisible while measuring perfectly.** First pass used
   `--ob-accent-ring` (30% alpha) at `inset: -1px` — semantically the right
   token, named "pulse ring on a live dot". On screen it was nothing: a 0.8px
   rendered border at 30% starting *exactly on top of* the button's own accent
   border, fully faded before it cleared the edge. Solid `--ob-accent` at
   `inset: -3px` reads. **`getComputedStyle` said the animation was running the
   whole time.**
2. **The replay button silently grew the card by 4px.** `.ob-btn` is declared
   after `.ob-meta` at equal specificity, so it wins every shared property — the
   label rendered 14px sans, sentence case, next to a 12px uppercase mono
   `DRAFT`, and its inherited 1.6 line-height made a 19px line inside a 17px
   bar. Pillar 01's header went to 44px against 02 and 03's 40px. Fixed by
   re-declaring the meta layer in `.ob-session-replay` (later still) and pinning
   `line-height: 1`; the padding survives only as hit area, cancelled in layout
   by an equal negative margin.
3. **The focus ring was being clipped.** `.ob-btn:focus-visible` draws a 4px
   box-shadow spread and `.ob-frag` clips to the card, so at `padding-block:
   10px` the ring's top and bottom arcs were cut. 7px puts the button box at
   28px with the ring landing 2px inside the bar, hit area still 28–30px.

**Reduced motion drops both new pieces entirely** — no pointer, no replay
control (a button promising motion the visitor asked not to have). §16 carries a
comment saying so, because an absent rule there is otherwise indistinguishable
from a forgotten one.

`sessionTotalMs` is now **13,338ms** and includes the pointer beat, so the
number still means "one full pass". *(14,528ms after the tuning pass below.)*

**Toolchain:** `npx tsc --noEmit` · `npm test` **183/183** · `npm run build` ·
biome clean on my files. Verified at **1440 and 1280**: bars **40/40/40** across
all three pillars, cards 624×374 / 624×374 / 624×361; **one distinct height and
one width across the whole run, pointer beat included**; phase order measured
`travel → press → done` at 743ms / 332ms against the 760/340 constants; rests at
9 blocks and **does not restart after 17s**; `Replay` drops it to 3 blocks and
replays; keyboard-reachable with `:focus-visible` matching and `transition:
none`; reduced motion → 0 pointers, 0 replay buttons, 0 carets, 9 blocks pinned
to the end; **0 console errors**.

---

### Idea Session — 2026-08-22 — Slower gesture, bigger ripple

Owner tuning pass on the entry above: *"make the motion slower and increase the
ripple effect."* No Playwright — the owner verifies this one by eye.

| | Before | After |
|---|---|---|
| Pointer glide | 760ms | **1,150ms** |
| Cursor click nudge | 220ms | **320ms** |
| Button squash | 320ms | **520ms** |
| Rings | 320ms, stagger 120ms | **620ms, stagger 180ms** |
| Ring reach | 18px | **19px** (the ceiling — see below) |
| Inner ripple | — | **680ms, crosses the whole button face** |
| `press` window | 460ms | **880ms** |
| `linger` | 640ms | **900ms** |
| `sessionTotalMs` | 13,338ms | **14,528ms** |

**The size had to come from inside the button, because the rings cannot grow.**
They are capped at 19px by geometry, not taste: the CTA sits 20px from
`.ob-session-scroll`'s padding box, which is where the clip happens, so a larger
concentric ring loses its left arc. `.ob-session-cta-ripple` spreads *within* the
pill instead — clipped by the thing it is filling, so it has no ceiling and
crosses all 152px. It starts at 42% / 55%, the same contact point `IdeaSession`
measures the pointer's target with, so it reads as coming from the click rather
than from the button. `--ob-on-accent` is the token; the softness is `opacity`
on the element, so no colour value is introduced.

Centring it needed no magic number: `width: 100%` + `aspect-ratio: 1` makes the
circle as wide and tall as the button's width, and percentage margins resolve
against the containing block's **width on both axes**, so `margin: -50% 0 0 -50%`
lands it on the contact point.

**The motion-binary exception is now explicitly the whole gesture, not just
`travel`.** Every duration in it — glide, squash, rings, ripple — sits in the
dead zone. That is a real widening of a standing rule and it is written down as
such, in the block comment above `.ob-session-pointer` and in
`SESSION_POINTER_MS`'s doc comment, so a later reader finds the decision instead
of inferring a mistake. The justification is unchanged and still narrow: these
depict a physical event, and physical events at this scale do not resolve in
320ms. **The rule still binds everywhere else on the surface**, which both
comments say out loud.

`press` is still a window rather than an animation, and the test that guards it
now asserts the new floor: it must outlast the second ring (180ms stagger +
620ms travel = 800ms) or the ripple is cut off mid-spread.

**Toolchain:** `npx tsc --noEmit` clean · `npm test` **199/199** · `npm run
build` clean · biome clean across my line range. No browser verification, by
request.

---

### A16 — 2026-08-23 — Roadmap, rebuilt as the journey

Reworked `/r/[slug]/roadmap` from first principles, at the user's request, for
the reader it actually has. Supersedes **A12** wholesale and half of **A11**.

**The frame that changed everything.** The old page answered "what do I build,
in what order". The reader arriving on it has just watched a research run tell
them three companies already do this and charge $300 — and their live questions
are *can I actually do this*, *what does doing it consist of*, *what will ambush
me*, and *what will it cost*. The page is now the whole road from here to a
paying customer, not the build half of it.

**The reader, settled.** *Technically capable, commercially naive* — an engineer
with an idea. That closes `executive_summary.md` open decision #4 (no
technical-ability question in Pillar 1, no no-code branch) and it sharpens the
content: the ambushes skew legal, commercial and operational, never "how to
deploy". *Prove it by hand* survives but is re-motivated — not "you can't code"
but "don't write the automation until you know the rate it's automating".

**The one rule the model rests on:** *estimate the clocks you don't control,
milestone the ones you do.* Carrier registration takes 2–3 weeks whether you are
brilliant or slow; "build the MVP" is unknowable, and a number on it is a lie
that becomes shame when it slips. `BarSchema.refine` makes the wrong combination
**unrepresentable** — a `theirs` bar must carry a week range, a `yours` bar must
not — because this is exactly the rule that erodes one well-meaning edit at a
time. Two bar treatments carry it visually: solid and hard-edged versus soft and
open-ended, so the reader learns it from the picture.

**Why the week axis had to go (superseding D13/C5).** Every realisation the user
asked the page to produce is about *overlap* — marketing starting at ~80% built,
the partner application starting before the build ends. A discrete integer-week
grid cannot express any of them: a bar started on a track or not at all. Bars
now anchor to *each other* (`starts_when`), positions are 0–1 fractions, and
**there is no axis, no scale and no gridline** — drawing a "month 4" rule
promises a date the model cannot keep. The tripwire stays off the chart, which is
the half of D13 that was right.

**The headline is derived, not authored.** `externalWeeks()` sums the bars on
other people's clocks: *10–13 of these weeks are not yours, and they run
alongside your build only if you start them early.* The founder who applies to a
partner programme after finishing the build loses two months for nothing. That
number, the page meta, the run-header meta and the OG description all come from
the one helper.

**Ambushes are generated, not brainstormed.** Five species (lead time ·
threshold · obligation · delayed signal · won't-repeat) asked of one idea. An
entry must name a proper noun or a threshold and must cost time, money or
legality — "that sounds great means nothing" and "a gmail address gets no
replies" were both drafted and both cut, the first as advice the reader
half-knows, the second because its worst outcome is embarrassment. **No per-bar
quota** — 5 of 14 bars carry none; a quota is precisely what manufactures filler.
`source: 'run'` ambushes must cite and nothing else may, so exactly two carry
chips (`[46]`, `[47]`) — the honest number, because the run's `PRACTICAL`
dimension came back `thin` with two findings. `universal` is capped at three by
a refinement.

**Costs are bands, not prices** (`$` / `$$` / `$$$` / `free`), defined once in
real money in the legend and never again. Prices rot: a fixture asserting a
per-message rate is wrong within a year and makes every other number on the page
suspect. Two sanctioned exceptions where a figure *is* the insight — the legend,
and "at $200 a month, 42 practices is $100,000 a year".

**The interview scripts and surveys are deleted**, from the schema, the fixture,
the content file and the CSS, along with `ScriptBlock`, `SurveyBlock` and
`buildScriptText`. They were roughly half the old page's height. This is a
product decision, not a tidy-up — `executive_summary.md:273` promised a
copy-pasteable script as a rule of Pillar 3a, so that file was amended in the
same change and `roadmap-integrity.test.ts` now *asserts the absence* so a
well-meaning restoration re-inflates nothing.

**Two bugs found by measuring, both of the "CSS applied but not on screen"
class:**

1. **The backdrop paints over every static word on the page.** `AppBackdrop`
   renders as a *sibling* of the page container inside `main` and is
   `position: fixed; z-index: 0`. A positioned element paints at step 6 of its
   stacking context; static in-flow text at step 5. So the h1, the lead, the
   track labels and the bar names were all invisible, while the bars and
   milestone flags survived *because they are absolutely positioned and later in
   tree order* — which is what made it look like a font or colour problem. It is
   invisible until the backdrop asset exists: with `/media/roadmap/backdrop.webp`
   missing the `<img>` painted nothing, which is why it shipped. Fixed with
   `position: relative; z-index: 1` on `.ob-roadmap`. **`z-index: -1` on the
   backdrop is not the alternative** — `globals.css` records that it must stay
   above the body background or it disappears entirely. Diagnosis took four
   wrong hypotheses; what settled it was injecting a red background that also
   did not paint, which separated *paint* from *layout* and *colour*.
   **`.ob-report`, `.ob-define`, `.ob-sources` and `.ob-explorer` have the same
   latent defect and are NOT fixed here** — same one-line rule, left out of scope
   deliberately rather than swept in.
2. **Replacing §13 wholesale dropped four still-live rules.** `.ob-exit`,
   `.ob-exit-label`, `.ob-exit-line` and `.ob-exit-actions` belong to
   `RoadmapExit`, which survived the rewrite; without them its three links
   collapsed into one run-on line. Caught by diffing the old section's selector
   list against the new one — worth doing on any wholesale section replacement.

**One React rule worth writing down, because it took three passes to state
correctly.** Passing a **client** component as a pre-built element prop from a
server page produces *"Each child in a list should have a unique key"* — an
RSC-serialised client element rendered in children position arrives without the
positional key static JSX would have given it. **Server** component element props
are fine. So:

- `Journey` and `TripwirePanel` are client components → they now take **data**
  (`groups`/`milestones`/`journeyCaption`, `tripwires`/`thin`) and
  `RoadmapSections` renders them. Both are already client-side, so this costs no
  bundle.
- `FieldworkBand` and `MoneyBlock` are server components → they **stay** element
  props, which is what keeps them off the client bundle.
- `RoadmapExit` moved out of the provider entirely and is rendered by the page
  after `<RoadmapSections/>`. It reads no roadmap navigation state, so being
  inside the provider was never buying anything.

I initially recorded that server-component element props were the exception
*and* that `RoadmapExit` was fine where it was; the first half is right, the
second was wrong — it was still inside the provider's children array. Verified
by clean reload, not by reasoning: zero console errors, zero warnings.

**Also swept:** an emitted-but-undefined class audit over every `ob-` class the
new components emit (found and declared `.ob-journey-cap` and `.ob-money`, the
R2 failure class); the milestone `end`-anchor threshold moved 0.75 → 0.5 after
measuring a 2px label overlap in lane 0; the `TAKES` row stopped appending the
track's note, which read as if it described the duration.

**Files.** Rewritten: `lib/schemas/roadmap.ts`, `lib/fixtures/roadmap.ts`,
`lib/run-plan.ts`, `app/r/[slug]/roadmap/{page,loading}.tsx`,
`components/roadmap/{open-question-card,dependency-chip,tripwire-panel}.tsx`,
`tests/unit/{run-plan,roadmap-integrity}.test.ts`, `styles/obsidian-app.css` §4
and §13. New: `components/roadmap/{journey,bar-detail,ambush-line,money-block,
roadmap-sections}.tsx`, `components/figures/{journey-bar,milestone-rail}.tsx`.
Deleted: `components/roadmap/{script-block,survey-block,roadmap-timeline,
roadmap-step,not-in-it-list,open-questions-section}.tsx`,
`components/figures/{plan-bar,week-axis}.tsx`.

**Verification.** `npx tsc --noEmit` clean · `npm test` **208/208** ·
`npm run build` clean · biome clean. Browser-verified at **1440px and 1280px**
via Playwright MCP: zero console errors; heading outline h1×1 · h2×3 · h3×12
with no level skips; milestone labels collision-free in both lanes at both
widths; no bar tail overflowing its track; **no `yours` bar rendering a week
number anywhere in the DOM** (the model's core rule asserted against rendered
output, not just the fixture); no `background-image` behind any bar track.

**Not done, and deliberately.** The empty/thin case (`executive_summary.md`'s
open decision #3) still leans on the run for its opening line and its
find-them citations; `?thin=1` swaps the tripwire note but the page has no
genuine second mode. The three other run pages keep the backdrop defect.

---

### A17 — 2026-08-24 — Roadmap, rebuilt for readability

Reworked `/r/[slug]/roadmap` again, at the user's request. Supersedes **A16**
wholesale, and with it the last of **A11** and **A12**.

**The complaint.** *"Too much information and highly cramped, hard to read and
follow through and not intuitive."* A16's page was accurate and unreadable:
fourteen bars across six tracks in 18px rows with two fill treatments and a
legend explaining them, six full-height open-question cards, a photo band, a
cost table and a tripwire grid — 7,247px at 1440. Every individual decision in
it was defensible. That is the point worth recording: **the defect was not in
any one component, so no component-level fix could have reached it.**

**The frame.** This page is an *overview that makes someone think critically
about the journey*. It is not a research brief they execute from, and it is not
a build plan. Everything that survived had to earn its place against that
sentence; the deep dive is theirs to do.

**Decisions, taken with the user before any code.**

| | |
|---|---|
| Rows | **Five**, one level, no sub-steps: Talk to customers · Test it by hand · Build the product · Get found · Win your first customers. Schema caps it at six. |
| Setup | **Off the chart entirely**, into a flat list with no timeline. |
| Canvas | Chart on a **light card**; the rest of the page stays `--ob-canvas`. |
| Axis | **Milestone markers M1–M5**, name and proof on hover/focus. No months, no dates. |
| Step detail | **Trimmed** — what it is · when to start · what you'll hit. Cost and cut-list only where real. |
| Questions | **Question and consequence only.** |
| Kept | What it costs · What would change all of this. |
| Dropped | The fieldwork photo band. |

**Why the setup items came off the chart.** A domain purchase takes ten minutes
and a carrier registration is three weeks of *waiting*. Drawing them as bars
next to "build the product" asserted they were comparable efforts, and it cost
five of the fourteen rows. As a flat list they read in twenty seconds.

**The wait number moved, and got better.** `externalWeeks` summed every `theirs`
bar and reported 10–13 weeks. `waitWeeks` sums `setup` alone and reports **6–8**.
The two phase-level waits it dropped (interview scheduling, waiting for real
cancellations) were real but are not queues anyone can join early, so counting
them alongside a carrier registration blurred the one actionable point. The
number is smaller and now supports a specific instruction: start these today and
they cost nothing; start them when you need them and they cost two months.

**What the axis solved.** A16 argued for *no axis at all* — a "month 4" rule
promises a date the model cannot keep. That reasoning still holds and the
conclusion still cost the reader any sense of scale. Marking the axis with the
five unfakeable milestones gives somewhere to stand without inventing a
calendar: horizontal position means **progress**, and progress is measured in
things that happened. `MilestoneSchema` was already exactly the right shape for
this; nothing about it changed.

**Three system rules broken on purpose, at the user's direction** (*"don't focus
on maintaining the theme for this page"*). All three are documented at the
token, not the call site:

1. **The card is light.** The one figure/ground inversion in the app. A five-row
   Gantt is the only object on the app side a reader tracks horizontally, and
   dark-on-light is easier to track across.
2. **`--ob-rm-sky` is blue and is doing none of blue's three jobs.** Here hue
   means *identity* — five rows need five tints so a bar, its section heading
   and its jump link are recognisably one step. It is ~30% lighter than
   `--ob-accent` and never appears on the dark canvas.
3. **Ten new tokens in a list C2 declared closed.** Same escape hatch the glass
   field took: the alternative is colour literals in a component, which
   `tokens.css` forbids outright.

**Navigation is a scroll, not a swap.** A16's bar filled a fixed detail panel;
A17's bar scrolls to that step's own section. The reader's position in the
document now always matches what they asked to see, `--ob-anchor-inset` puts it
below the sticky nav (measured: 136px, nav bottom 125px), and there is nothing
to remember about which bar is "selected". It also deleted `RoadmapProvider`
entirely — the cross-section wiring it existed for is gone.

**Two bugs found by measuring, not by looking.**

- **`transform` creates a stacking context.** `.ob-rm-mark` carries
  `translateX(-50%)`, which trapped `.ob-rm-tip`'s `z-index: 3` inside the
  marker — against the lane rules below it counted for nothing, and those are
  positioned elements later in tree order, so a gridline painted straight
  through the tooltip's text. The fix is a `z-index` on the *marker*; raising
  the tip's own does nothing at any value. Recorded in §12 next to the rule.
  (Corollary worth knowing: `elementFromPoint` is **not** a paint-order test on
  an element with `pointer-events: none` — it skips it and reports what is
  behind. That produced one false negative while verifying the fix.)
- **`.ob-roadmap-head .ob-meta-line` matched nothing.** The class is
  `ob-metaline`. A silent no-op that left the run's meta line 4px under a
  paragraph — pitfalls §1, again, and again only visible when measured.

**Deleted.** `journey.tsx` · `bar-detail.tsx` · `roadmap-sections.tsx` ·
`roadmap-context.tsx` · `dependency-chip.tsx` · `open-question-card.tsx` ·
`find-them-row.tsx` · `fieldwork-band.tsx` · `fieldwork-media.tsx` ·
`figures/journey-bar.tsx` · `figures/milestone-rail.tsx` ·
`figures/fan-out-meter.tsx`. The last one had no product consumer left and was
alive only in the style-guide gallery — which is how the previous roadmap
accumulated marks nobody could point at a screen for. Schema drops `tracks`,
`bars`, `Clock`, `FindThemItem`, `barsForQuestion` and four `OpenQuestion`
fields; adds `Phase`, `SetupItem` and `PhaseTint`.

**Also fixed while in the file.** `/style-guide/og`'s roadmap card listed
`OPEN QUESTIONS` twice — a copy/paste that shipped in A15 because the card still
looked plausible.

**Verification.** `npx tsc --noEmit` clean · `npm test` 213 passing across 19
files · `npm run build` clean · biome clean. Browser-verified at **1440px and
1280px** via Playwright MCP: zero console errors across three consecutive cold
loads; bar click and keyboard `Enter` both land the target section at 136px with
the nav bottom at 125px; every bar and marker takes a visible `--ob-accent`
focus ring; marker tooltip opens on **focus** as well as hover; no element
overflows the viewport at 1280; reduced motion **resolves** bars to `scaleX(1)`
rather than freezing them at 0.

**The honest number.** 7,402px, against 7,247px before — the page is *not*
shorter. Density per screen is down roughly 40% and every section is now
scannable, which is what the complaint was actually about, but five expanded
step sections cost more height than the one swap-in-place panel they replaced.
That is the price of "clicking a bar takes me to its own section", which was
asked for explicitly. Three further cuts were identified and **not** taken,
because they remove content the user did not ask to lose: the ten-row cost table
(~400px), the setup ambushes (~260px), and the third ambush on P5 (~110px).

**Not done, and deliberately.** The fieldwork detail an open question used to
carry — who to ask, where to find them, how many conversations — is gone with
its cards. It was real and useful and it is not what an overview is for. If it
comes back it belongs somewhere else, not here. `?thin=1` still only swaps the
tripwire note; the page has no genuine second mode. The three other run pages
keep the `AppBackdrop` z-index defect; `.ob-roadmap` still lifts itself clear.

---

### A18 — 2026-08-24 — Legibility: the grey ramp measured up

**The complaint, verbatim:** the meta lines, the figure captions and the tripwire
body "are quite hard to read as they are very dim… make all the elements easy to
read and brighten them up. This website is supposed to be easily readable." The
three strings named were `5 STEPS · 6 OPEN QUESTIONS · 6–8 WEEKS OF WAITING`,
the roadmap axis caption, and the `DELAYED SIGNAL` ambush on P1 — all `--ob-dim`.

**Diagnosis.** `--ob-dim` was `#5b5b64`: **3.2:1** on `--ob-canvas`. It is not a
decorative layer — 200 of its usages are in `obsidian-app.css` alone, and it
carries every meta line, figure caption and ambush body on the run pages, at
12–15px. It failed AA outright at exactly the sizes it renders at. `--ob-muted`
was `#8a8a93` (5.8:1), passing but with no headroom above dim once dim moved.
`--ob-discard` was the worst at `#4a4a52`, **2.4:1**, and on `/sources` it
carries eighteen full 16px excerpts — real reading, not an animation frame.

**Fixed at the token layer, which is the whole point of having one.** Three
values in `tokens.css` lifted the entire app at once: `--ob-muted` → `#b0b0b8`
(9.2:1), `--ob-dim` → `#7c7c86` (5.3:1), `--ob-discard` → `#7a7a84` (4.7:1).
The three levels still separate cleanly; they now do it inside a band that is
legible end to end rather than fading out at the bottom. Discard sits only just
under dim now — deliberate, because its state is already carried by the
`line-through`, the `DISCARDED` tag and the panel treatment, none of which need
the text to be too faint to read. Hairlines went with them (`#232326` → `#2e2e34`,
`#34343c` → `#43434d`) plus `--ob-grid`, `--ob-hatch` and both `--ob-rm-rule`s:
in a system where 1px lines *are* the layout, leaving the structure behind while
the text brightens turns a carved page into floating text.

**Three places stacked two de-emphasis mechanisms on one string** — a dim colour
token *and* an opacity multiplier — which is what put them far below the token's
own floor. `.ob-phase-item[data-state="pending"]` (`--ob-dim` × 0.5 ≈ 2.6:1) and
`.ob-qglyph[data-state="queued"]` (× 0.55) lost the opacity; the token is the one
that stays. `.ob-discard-panel` went 0.62 → 0.8. The roadmap fork's hover
de-emphasis went 0.34 → 0.55 (branch) and 0.30 → 0.45 (rail): the branch the
cursor is *not* on is still a thing you are meant to read while comparing.

**Verified by measurement, not by eye.** A composite-contrast sweep run in the
Playwright MCP over `/`, `/define`, `/validate`, `/roadmap` and `/sources` —
walking to the first opaque ancestor background and multiplying the full
ancestor opacity chain, so a doubly-dimmed string is scored as it actually
paints. Landing was scrolled to the bottom first so every reveal had fired.
**Every text node on all five pages now clears 4.5:1**, with one exception below.

**One finding left open, deliberately: white on `--ob-accent` is 3.81:1.**
`.ob-btn-primary` and `.ob-badge-tag`. Fixing it means darkening `#2D7FF9`, which
(a) is pinned by name in the skill and in `CLAUDE.md`, and (b) makes the page
*less* bright — the opposite of the request — to fix the one element nobody said
was hard to read. Flagged for the user rather than taken silently.

**Not touched.** A pre-existing Biome formatting error on a `.ob-rm-bar-fill`
`transition` — confirmed present on the stashed tree, so it is A17's, not this
change's, and sweeping it in would have hidden it in an unrelated diff.

---

### A19 — 2026-08-24 — Type scale: closed at 16 steps

**The ask:** read the landing page's typography, write down the actual format,
and put the rest of the site on it — then update the skill.

**The landing turned out not to have one format either.** The documented scale
was eight steps. A computed-style sweep in the Playwright MCP over every text
node found **15 distinct sizes on `/`** and, worse, **38 distinct size+leading
pairs on `/r/[slug]/validate`** — the app carrying roughly twice the typographic
variety of the landing at the same level of content. Source: **67 hardcoded
pixel `font-size` values across three stylesheets** (20 in `obsidian.css`, 41 in
`obsidian-app.css`, 6 in `roadmap-experiment.css`) plus **six `text-[15px]`
Tailwind escapes in landing components**. Leading was worse than size: `1.1`,
`1.15`, `1.2`, `1.3`, `1.45`, `1.55`, `1.65`, `1.7` and two `17px` literals were
all in the tree, so the *same size rendered at three or four different leadings
on one page*. Weight was the one thing already clean — 400/500 throughout.

**Read the direction of the drift:** it lived almost entirely in the app, not
the landing. Marketing pages get designed; product pages get extended, one
`font-size: 15px` at a time, each a local decision nobody could see from
anywhere else.

**Three things had genuinely earned a step and never got one** — an 18px
sub-lead (`.ob-wordmark`, `.ob-excerpt`, the composer), a 13px dense step (six
landing sites, eight app), and the 11/10px mono micro-labels (chips, `.ob-cite`,
tags). Those are now `--ob-sub`, `--ob-xs`, `--ob-meta-sm`, `--ob-meta-xs`.
Figure numerals got their own tier (`--ob-fig-xl/lg/md/sm` + `--ob-tracking-fig`)
because a number is not a heading: mono for tabular digits, flat leading, and
never the display tier's tracking. Everything else snapped to its nearest
neighbour.

**Casualties worth knowing.** `15px` is gone — it existed only as those six
Tailwind escapes and five app rules, never as a landing recipe, and is `--ob-sm`
now (28 elements on `/validate` shrank 1px). `17px` and `19px` both became
`--ob-sub` (±1px, on `.ob-rm-row-name`, `.ob-setup-name`, `.ob-oq-q`). `34px`
became `--ob-fig-md` (33). Leading collapsed to seven values; `1.55`/`1.65`/`1.7`
all became `--ob-leading-body`.

**A third knowing addition to the token list C2 declared closed**, after the
glass field and the roadmap chart, and by far the largest. Same justification as
both: the alternative is literals in the recipes, and the escape hatch the rule
names is a token. It *closes* the scale rather than extending it — the header on
the block states the rule as "a size that is not one of these tokens is a bug".

**`.ob-sub` / `.ob-sm` / `.ob-xs` recipe classes were added to `obsidian.css`
§3** so a component always has a token-backed way to name a size. Without them
the next "slightly smaller than body" need becomes another `text-[15px]`, which
is precisely how 15px got in. The six escapes were replaced with these; there is
now **zero** Tailwind typography anywhere in `components/` or `app/`.

**Three deliberate exceptions, all commented in place**, all in `obsidian.css`:
`.ob-footer-mark`'s `clamp(80px, 15vw, 220px)` stroked watermark (its leading and
tracking are tuned so the baseline clip lands, and it must never get a second
consumer), and the two `em`-relative fragments `.ob-vf-num-unit` / `.ob-vf-num-per`
(proportions of their own numeral, not steps). `.ob-wordmark` keeps a `-0.02em`
literal on purpose — `--ob-tracking-fig` holds the same value but means "figure
numeral", and reading it there would say something untrue about the element.

**Verified by measurement, per route.** The sweep was re-run on `/`, `/define`,
`/validate`, `/roadmap` and `/sources`: **zero off-scale sizes and zero
off-scale leadings on all five**. Pair counts fell — validate 38 → 28, roadmap
24 → 17. `npm run build` passes; `npx tsc --noEmit` clean; Biome clean on all
four stylesheets and the four components touched.

**One thing found and deliberately not fixed: `/validate`, `/define` and
`/sources` currently render their body text invisible.** This is the
`AppBackdrop` z-index defect already documented in `CLAUDE.md` — the backdrop is
a `position: fixed; z-index: 0` sibling, so it paints above static in-flow text,
and only `.ob-roadmap` lifts itself clear. It was dormant because the assets did
not exist; **the untracked `public/media/validate/report-field.webp` now does**,
which switched it on. Confirmed pre-existing by stashing this change and
re-screenshotting — identical. Out of scope for a typography phase, and it wants
its own fix (lift `.ob-report`, `.ob-define`, `.ob-sources`, `.ob-explorer` to
`position: relative; z-index: 1` the way A16 did for `.ob-roadmap` — **not**
`z-index: -1` on the backdrop, which `globals.css` records must stay above the
body background).

---

## Appendix — the media plan files

Five files, all at repo root, all following the format established by
[`higgsfieldPlan.md`](higgsfieldPlan.md) (standing art direction → numbered
entries in page order → priority order):

| File | Covers |
|---|---|
| `higgsfieldPlan_shared.md` | Standing art direction for the app side, the run-chrome ambient system, and invalid-run / error surfaces. **Read this first — the other four defer to its §0.** |
| `higgsfieldPlan_define.md` | Define's backdrop, the empty-transcript moment, its OG card. |
| `higgsfieldPlan_validate.md` | The console's cold-start moment, the report backdrop, the report OG card (the one that actually gets shared). |
| `higgsfieldPlan_roadmap.md` | The roadmap backdrop, the editorial human band, its OG card. |
| `higgsfieldPlan_sources.md` | The explorer backdrop, the zero-results moment, its OG card. |

**Nothing in any of those files is load-bearing.** Every page in this plan must
ship complete and look finished with zero generated assets present. A media
plan entry is an upgrade path, not a dependency.
