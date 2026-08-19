# 10 — Component System

Reusable primitives, described by **role** rather than implementation. Grouped
by layer. Names here are the names to use in code.

Tiering:
- **Tier 1 — Primitives**: generic, no product knowledge, reusable anywhere
- **Tier 2 — Product components**: know about runs, briefs, findings
- **Tier 3 — Compositions**: whole page sections

---

## Tier 1 — Primitives

### App shell & layout

| Component | Role |
|---|---|
| `RunShell` | The persistent chrome on every `/r/[slug]/*` page: header bar, wordmark, `StageRail`, `MetaLine`, `CopyLinkButton`, and the thin footer. Holds no state beyond what's passed in. Every run page is `<RunShell>{children}</RunShell>`. |
| `LandingNav` | The `/` navigation only. Transparent → blur past 40px. Separate from `RunShell` because its behaviour and contents differ entirely; sharing them would produce a component with two modes and no clear owner. |
| `PageContainer` | Max-width + horizontal padding. Two variants: `marketing` (1200px) and `app` (1360px). |
| `ProseColumn` | Enforces the 68ch reading measure and vertical rhythm for long-form content. Used by the report and roadmap. The single most important layout primitive for readability. |
| `TwoColumn` | `1fr` + fixed sidebar with a configurable collapse breakpoint. Used by Define (conversation + brief) and the report (content + index). |
| `FooterPanel` | The elevated rounded footer per skill rule ⑨, with `StatusBadge`. `/` only. |
| `RunFooterBar` | The thin run-page footer: run ID, copy link, contextual links. |

### Navigation

| Component | Role |
|---|---|
| `StageRail` | **Primary navigation.** Three segments (Define/Validate/Roadmap) with `locked` / `active` / `done` states. Locked segments carry no affordance — dim text, hollow node, no hover, no click. Renders the sliding amber underline on stage change. |
| `SegmentedControl` | Two-to-three segment scroll-jump control. Roadmap only. Sticky, with scrollspy-driven active state. |
| `SectionIndex` | Sticky scrollspy list for long documents. Report only. Amber left-tick on the active entry. |
| `BackLink` | `←`-prefixed text action. Used on Sources and the roadmap footer. |

### Actions

| Component | Role |
|---|---|
| `Button` | `variant: primary \| secondary`, `size: md \| sm`. Primary carries the mandatory always-visible pulsing amber glow. **Enforce one primary per view by convention, not by code** — see [01 P6](01-product-and-principles.md#p6--one-primary-action-per-view). |
| `IconButton` | 32×32 square, `--bg-surface`, icon at `--text-body`. Drawer close, copy glyphs, external links. Always needs an accessible label. |
| `TextAction` | Inline text button. `--text-body` → `--accent` on hover. The default for tertiary actions — the product uses far more of these than buttons. |
| `CopyButton` | Wraps clipboard write + the confirmation label swap (`Copy script` → `✓ Copied`, 2s). **The product's only success-feedback mechanism.** No toasts anywhere. |
| `CopyLinkButton` | `CopyButton` specialised for the run URL. Always present in `RunShell`. |
| `SuggestionChip` | A one-click answer offered by the AI in the Define conversation. Sends its own text as a user turn. |

### Inputs

| Component | Role |
|---|---|
| `TextArea` | Auto-growing multiline input with configurable min/max rows and submit-key behaviour (`enter` vs `cmd-enter`). Powers The Box and the Composer, which differ only in props. |
| `TheBox` | The `/` hero input. `TextArea` at 18px with the stronger focus glow and the `⌘↵` hint. Distinct component because it's the product's most important input and will attract bespoke tuning. |
| `InlineEditableField` | Label + value that becomes a borderless input on click. `Enter`/blur commits, `Esc` reverts, optimistic with quiet inline retry. Powers every Brief Panel field. |
| `InlineEditableList` | `InlineEditableField` for arrays: per-item edit, `×` remove, `+ Add`. Assumptions, alternatives. |
| `FilterPill` | Toggleable pill. Sources page only — the product's only filter UI. |

> **No `Select`, no `Checkbox`, no `Radio`, no `DatePicker`, no `Form`.**
> The product has no forms. If one of these is ever needed, that's a signal to
> re-read the exec summary before building it.

### Surfaces

| Component | Role |
|---|---|
| `Card` | The base surface: no border, inset top highlight, outer shadow. Props: `interactive` (adds hover lift), `featured` (adds the amber ring). **Never nests.** |
| `Well` | Recessed `--bg-surface` region *inside* a card. Excerpts, script blocks, media panels, the NOT IN IT list. This is the escape hatch that prevents card nesting. |
| `Drawer` | Right-side overlay, 480px, slide-in, focus trap, `Esc` to close, focus restored on close. One instance in the app, driven by state. |
| `Modal` | Centred dialog, 440px. Used exactly twice: discard conversation, re-run research. Never for primary content. |
| `Popover` | Hover/focus-triggered floating panel with a 300ms open delay. Citation chips only. |
| `Tooltip` | Short label on hover/focus for icon-only controls. Never carries information available nowhere else. |
| `Accordion` | Expand/collapse with a rotating chevron. `grid-template-rows: 0fr→1fr` (not `max-height`). Dimension findings, competitor detail, open questions. |
| `Divider` | `1px solid var(--border-subtle)`. |

### Typography & display

| Component | Role |
|---|---|
| `SectionLabel` | `[Bracket]` monospace amber overline. The single most-used branded element. |
| `DisplayHeadline` | Muted/bright split headline per skill rule ②. Takes `muted` and `bright` string props so the split can't be applied inconsistently. |
| `MetaLine` | Monospace `//`-separated technical metadata. **Values must be real** — the component should never be handed decorative data. |
| `Prose` | Styled long-form container: measure, leading, and inline `CitationChip` support. |

### Status & feedback

| Component | Role |
|---|---|
| `VerifiedBadge` | `● VERIFIED` — green dot + mono label. The trust marker. Appears on every finding, everywhere. |
| `ConfidenceNote` | Three bars + word (`solid` / `mixed` / `thin`). **Never a number, never colour-coded.** |
| `StageChip` | Small mono label for a run's stage. Recent runs list. |
| `StatusBadge` | Footer system status: green dot + `[ALL SYSTEMS OPERATIONAL]`. |
| `CoverageBar` | Per-dimension count bar, relative to the run's own maximum. Run Console. |
| `PhaseStrip` | Four named phases + elapsed time. **No percentage.** |
| `Spinner` | Small inline rotating glyph. Buttons and phase glyphs only — never a full-page loader. |
| `RestIndicator` | The three-dot "AI is composing" indicator. Opacity cycle, no text. |

### Loading & empty

| Component | Role |
|---|---|
| `Skeleton` | Shimmer block. Props for line count and width. |
| `SkeletonText` | Multi-line prose skeleton with varied line widths (uniform-width skeletons look wrong). |
| `FieldSkeleton` | Brief Panel pending field: label + shimmer, with the amber-tint settle animation when the value arrives. |
| `EmptyNote` | A single honest sentence plus at most one action. **There is no illustrated empty state anywhere in this product** — illustrations in empty states are filler, and this product's empty states are usually meaningful information. |

---

## Tier 2 — Product components

| Component | Role |
|---|---|
| `BriefPanel` | The right rail on Define. Renders `brief_json` with per-field pending/filled/unknown states, the unknown-count summary, and the Approve action. Contains the page's most important state transition (brief proposed). |
| `BriefField` | One field: label, value, state. Delegates editing to `InlineEditableField`. Renders the `→ open question` tag for `unknown`. |
| `MessageStream` | The Define conversation. Typeset transcript, not bubbles. Handles streaming append, scroll anchoring, and the "user scrolled up" suspension with the `↓ New message` pill. |
| `Message` | One turn: role marker + prose. Two variants, differing only in text colour. |
| `Composer` | The message input: `TextArea` + `DontKnowButton` + `Send`. Buffers keystrokes while the AI streams. |
| `DontKnowButton` | The one-tap "I don't know". Its own component because it carries product meaning, not just a click handler — see [06](06-page-define.md#the-dont-know-button). |
| `QueryTicker` | The live list of real search queries with `○`/`◐`/`✓` states. |
| `FindingCard` | One verified finding: dimension, `VerifiedBadge`, claim, excerpt `Well`, source line. Used in the Run Console stream, the report's dimension accordions, and (as a row variant) the Sources page. **The most reused product component.** |
| `FindingStream` | The Run Console's prepend-with-animation list, capped with a "show earlier" affordance. |
| `CitationChip` | Inline `[n]`. Hover → `Popover` with the excerpt; click → `EvidenceDrawer`. Numbering is global and stable across the report, sources, and roadmap. |
| `EvidenceDrawer` | The full evidence view: finding, verbatim excerpt, the "this text was found on the page below" line, source, stance, and prev/next navigation through the corpus. |
| `DimensionSection` | One of the five report dimensions: label, `ConfidenceNote`, `MetaLine`, prose, findings accordion. |
| `CompetitorCard` | Field-rendered competitor profile. Collapsed: name, geography, price, difference. Expanded: moat, take, ignore. Missing fields render `not established from available evidence` — never omitted, never guessed. |
| `SurprisePanel` | The `featured` card holding two or three numbered surprises. Deliberately the most visually weighted block in the report. |
| `ThinEvidenceNotice` | The honest panel for low-yield runs, with its CTA into the roadmap. |
| `OpenQuestionCard` | The labelled-grid card (`QUESTION` / `WHY IT MATTERS` / `ASK` / `FIND THEM` / `HOW MANY` / `THE SCRIPT` / `WHAT YOU LEARN`), collapsible, with `ScriptBlock`, `CopyButton`, and the forward `Changes:` link. |
| `ScriptBlock` | The copy-pasteable interview script in a `Well`. Copies clean plain text — no markdown, no labels, no attribution. |
| `RoadmapTimeline` | The spine + five `RoadmapStep`s. |
| `RoadmapStep` | One step: mono heading, optional subtitle, body, optional `NotInItList`, `DependencyChip`s. |
| `NotInItList` | The cut list in a `Well` with a mono `NOT IN IT` label. **Full reading weight — not muted, not struck through.** |
| `DependencyChip` | `◂ depends on Q01`. Scrolls to, expands, and pulses its target. Bidirectional with the `Changes:` link on question cards. |
| `RecentRunsList` | Client-only list from `localStorage`. Hidden when empty. Carries the "remembered by this browser only" note. |
| `ExampleSeed` | A clickable idea seed on `/` that fills The Box without submitting. |

---

## Tier 3 — Compositions

Page-level sections, each assembled from the above. Listed for completeness;
specified in the page files.

| Composition | File |
|---|---|
| `Hero` · `WhatYouGet` · `TrustSection` | [05](05-page-entry.md) |
| `DefineLayout` | [06](06-page-define.md) |
| `RunConsole` · `Report` | [07](07-page-validate.md) |
| `OpenQuestionsSection` · `BuildRoadmapSection` | [08](08-page-roadmap.md) |
| `SourcesList` · `InvalidRun` · `ErrorBoundary` | [09](09-pages-supporting.md) |

---

## Components deliberately not built

| Not built | Why |
|---|---|
| `Toast` / notification system | `CopyButton`'s inline label swap covers every success case. Errors are inline and contextual. A toast system is infrastructure for feedback this product doesn't generate. |
| `Table` | The only tabular data is the sources list, which reads better as divided rows. No sorting, no column config, no pagination. |
| `Chart` / any chart wrapper | No scores means no charts. `ConfidenceNote`, `CoverageBar`, and the timeline spine are the complete data-vis surface — all plain `div`s. |
| `Tabs` | The Roadmap uses a scroll-jump `SegmentedControl` instead, deliberately, so cross-links between the halves keep working. Nothing else needs tabs. |
| `Pagination` | Nothing is long enough. The sources list at ~50 rows scrolls. |
| `Avatar` | No users. |
| `Breadcrumb` | Max depth is three and the `StageRail` covers orientation. |
| `CommandPalette` | A power-user affordance for a product a user touches once. |
| `ThemeToggle` | One theme. |

---

## Component conventions

1. **Server Components by default.** Add `'use client'` only for: `TheBox`,
   `Composer`, `MessageStream`, `BriefPanel`, `RunConsole`, `CitationChip`,
   `EvidenceDrawer`, `Accordion`, `CopyButton`, `RecentRunsList`,
   `SegmentedControl`, `SectionIndex`, `FilterPill`. Everything else renders on
   the server.
2. **Styling split:** Tailwind for layout only (flex, grid, spacing, sizing);
   all colour, shadow, glow, border, and typography come from CSS variables via
   a component stylesheet or `style={{}}`. This is the skill's explicit
   instruction and it keeps the token system as the single source of truth.
3. **No component invents a colour.** If a component needs a colour that isn't
   a token, the answer is a token or a different design — not a hex literal.
4. **Every interactive component has hover, focus-visible, and active states.**
   No exceptions.
5. **Loading states live with their component**, not in a central skeleton
   file — a skeleton that drifts from its component is worse than none.
6. **Props over modes.** `FindingCard` takes a `variant` for stream/accordion/
   row rather than three near-duplicate components.
