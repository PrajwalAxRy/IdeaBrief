# 16 — MVP Scope & Implementation Priorities

---

## 16.1 In scope — the complete v1 frontend

Five routes, three pillars, one theme.

| # | Surface | Route | Spec |
|---|---|---|---|
| 1 | Entry | `/` | [05](05-page-entry.md) |
| 2 | Define | `/r/[slug]/define` | [06](06-page-define.md) |
| 3 | Validate — Run Console | `/r/[slug]/validate` (running) | [07](07-page-validate.md#mode-a--run-console) |
| 4 | Validate — Report | `/r/[slug]/validate` (complete) | [07](07-page-validate.md#mode-b--the-report) |
| 5 | Roadmap | `/r/[slug]/roadmap` | [08](08-page-roadmap.md) |
| 6 | Sources | `/r/[slug]/sources` | [09](09-pages-supporting.md#91-sources-rslugsources) |
| 7 | Invalid run | `/r/[slug]` → not found | [09](09-pages-supporting.md#92-invalid-run-rslug--not-found) |
| 8 | Error boundary | `/error` | [09](09-pages-supporting.md#93-global-error-boundary-error) |

Plus the cross-cutting systems: the Evidence Drawer, the citation system, the
`localStorage` recent-runs list, and the SSE run stream.

---

## 16.2 Out of scope — and the reason

Grouped by why, not by feature. Anything here that gets built is scope creep,
and this table is the argument against it.

### Cut because the exec summary cut it

| Not building | Exec summary reference |
|---|---|
| Login, signup, accounts, sessions | *"A run lives at its own URL; that URL is the key."* |
| Billing, pricing, credits, free tiers | *"Removed because the priority is a working product."* |
| Teams, collaboration, comments, permissions | Same |
| Monitoring, change alerts, email digests | Same |
| Mobile design, WCAG work, accessibility audit | Same — see [13](13-responsive-and-accessibility.md) |
| PDF export, spreadsheet export | Same |
| Analytics, telemetry, outcome tracking | Same |
| Any 0–100 score, composite index, weighted rubric | *"No score. No verdict."* |
| Decision postures, verdicts, readiness ladders | Same |
| Gates of any kind | *"No legal gate, no safety gate, no feasibility gate."* |
| Evidence levels, claim ledgers, contradiction graphs | *"v3 had twelve [fields], several of them a model guessing."* |
| Founder-constraint intake (runway, visa, IP) | Cut in v4 |
| Comparing two ideas side by side | On the "after it works" list |
| Re-running research on a changed idea | On the "after it works" list |

### Cut because the UI doesn't need it

| Not building | Reason |
|---|---|
| Toast/notification system | Every success is confirmed in place ([11](11-interaction-patterns.md#112-feedback-patterns)) |
| Settings page | Nothing to configure |
| Dark/light toggle | One theme |
| Onboarding tour, coach marks, welcome modal | The product is one flow; a tour would be an admission it isn't clear ([03](03-information-architecture.md#38-onboarding)) |
| Dashboard of all runs | Implies a workspace; needs auth |
| Global search | Nothing to search across |
| Share modal | `Copy link` is the whole feature |
| Chart library | No scores → no charts ([02](02-visual-direction.md#211-data-visualisation)) |
| Form library | No forms |
| State management library | No cross-page state ([14](14-tech-stack.md)) |

### Cut for now, cheap to add later

| Deferred | Add when |
|---|---|
| Sentry / error reporting | After the first ten real users — before that, you're watching them use it directly |
| OG image per run | When someone actually shares a link publicly. Static OG image ships in v1. |
| `aria-live` on streams, skip link | Recommended anyway — ~15 lines total, see [13](13-responsive-and-accessibility.md#two-things-worth-doing-anyway-at-near-zero-cost) |
| Mobile layout | See [17 R1](17-open-questions.md#r1--shared-links-open-on-phones) — this is the one cut worth reconsidering |

---

## 16.3 Implementation priorities

Sequenced against the exec summary's four-week plan, which requires a working
thing at the end of every week.

### Week 0 — Foundations (1–2 days, before Week 1)

Not in the exec summary's plan, but everything else depends on it.

| Priority | Item |
|---|---|
| P0 | `styles/tokens.css` — the complete token set |
| P0 | `styles/globals.css` — reset, fonts, grain overlay, focus ring |
| P0 | `styles/components.css` — `.btn` + pulse, `.card` + inset highlight, `.well`, `.meta-line`, `.section-label` |
| P0 | `Button` and `Card` — prove the glow and the borderless elevation render right |
| P1 | `PageContainer`, `ProseColumn`, `SectionLabel`, `MetaLine`, `DisplayHeadline` |
| P1 | Zod schemas for `Brief`, `Evidence`, `Report`, `Roadmap` |

**Exit test:** a throwaway page showing a primary button, a card, a section
label, and a meta line, that looks unmistakably like the intended aesthetic.

### Week 1 — Pillar 1

> *"At the end of this week you can hand the URL to someone and they'll get a
> clear written version of their idea."*

| Priority | Item |
|---|---|
| P0 | `/` — hero, The Box, Start, create-run action, redirect |
| P0 | `RunShell` + `StageRail` (Define active, others locked) |
| P0 | `MessageStream`, `Message`, `Composer` — streaming conversation via AI SDK |
| P0 | **`DontKnowButton`** — the highest-leverage single control in the product |
| P0 | `BriefPanel` + `BriefField` with pending / filled / unknown states |
| P0 | `InlineEditableField` — commit on blur/Enter, revert on Esc |
| P0 | Approve → lock → redirect |
| P1 | `SuggestionChip` |
| P1 | `/` below-fold: `WhatYouGet`, `TrustSection`, `FooterPanel` |
| P1 | `RecentRunsList` + `useRecentRuns` |
| P2 | `ExampleSeed`, `Orb`, scroll reveals |

**Cut first if behind:** suggestion chips, the orb, the trust section. **Never
cut:** the Don't-Know Button or the unknown → open-question tagging. Those two
are the difference between a conversation and the form the exec summary
deleted.

### Week 2 — Pipeline (frontend is light)

> *"Output is raw JSON on a debug page."*

| Priority | Item |
|---|---|
| P0 | `/r/[slug]/sources` — doubles as the Week 2 debug page |
| P0 | `useRunStream` hook + SSE event reducer |
| P1 | `FindingCard` (the most reused product component) |
| P1 | `VerifiedBadge` |

Building `sources` now rather than later means Week 2's debug need and the
product's audit trail are the same surface. No throwaway work.

### Week 3 — Pillar 2

> *"Streaming progress on screen."*

| Priority | Item |
|---|---|
| P0 | `RunConsole`: `PhaseStrip`, `QueryTicker`, `CoverageBar`, `FindingStream` |
| P0 | Console → Report cross-fade on `complete` |
| P0 | `Report`: summary, `DimensionSection` ×5, `ConfidenceNote` |
| P0 | `CompetitorCard` — field-rendered, never prose |
| P0 | **`CitationChip` + `EvidenceDrawer`** — the differentiator; do not defer |
| P1 | `SurprisePanel` |
| P1 | `SectionIndex` scrollspy |
| P1 | `ThinEvidenceNotice` + the reordered thin variant |
| P2 | Citation hover popover (Layer 2 of disclosure) |

**The one thing that cannot slip:** the citation system. A report without
one-click source verification is a chat prompt with better typography, and the
exec summary is explicit that verification is *"the one thing that makes this
better than a chat prompt."*

The thin-evidence variant is P1 rather than P2 because the exec summary flags
it as an open decision *"worth designing before it happens by accident"* — and
it will happen during the ten-real-ideas test.

### Week 4 — Pillar 3 + polish

| Priority | Item |
|---|---|
| P0 | `OpenQuestionCard` — the labelled grid, collapsed/expanded |
| P0 | `ScriptBlock` + `CopyButton` with clean plain-text output |
| P0 | `RoadmapTimeline` + `RoadmapStep` + `NotInItList` |
| P0 | `DependencyChip` — bidirectional wiring between 3a and 3b |
| P1 | `SegmentedControl` with scrollspy |
| P1 | Invalid-run page, error boundary |
| P1 | End-to-end pass: loading choreography, error copy, empty states |
| P2 | `prefers-reduced-motion`, `aria-live` on streams, skip link |
| P2 | Playwright happy-path test |

**Cut first if behind:** the segmented control (the page still scrolls), the
survey rows, `Copy all scripts`. **Never cut:** `DependencyChip` — the exec
summary calls that link *"the whole reason both halves are in one product."*

---

## 16.4 The five things that must be right

If everything else is mediocre and these five are excellent, the product works.

| # | Thing | Why | Where |
|---|---|---|---|
| 1 | **The Don't-Know Button** | Makes the conversation a conversation instead of a form. The exec summary's single most important rule. | [06](06-page-define.md#the-dont-know-button) |
| 2 | **The Brief Panel assembling live** | Gives the conversation a visible destination — the main defence against mid-chat abandonment. | [06](06-page-define.md#the-brief-panel) |
| 3 | **Findings landing verified, with the discard count** | The trust moment, and the reason someone waits five minutes. | [07](07-page-validate.md#the-four-trust-devices) |
| 4 | **The citation system, three layers deep** | The differentiator. One click from any claim to verbatim source text. | [07](07-page-validate.md#the-citation-system) |
| 5 | **Copy script, producing clean plain text** | The moment the product changes what someone does. | [08](08-page-roadmap.md#the-script-block-and-copy-script) |

Note that four of the five are small components. The product's quality is
concentrated in a handful of details, not in the page layouts.

---

## 16.5 Definition of done, per surface

A surface ships when:

- [ ] It matches its page spec's layout, components, and copy strings
- [ ] Default, loading, empty, error, and success states all exist ([12](12-states.md))
- [ ] Exactly one `.btn-primary` is visible in the viewport
- [ ] The [anti-pattern checklist](02-visual-direction.md#218-anti-pattern-checklist) passes
- [ ] Every interactive element has hover, `:focus-visible`, and active states
- [ ] Keyboard-only operation completes the surface's primary task
- [ ] No hex colour appears outside `tokens.css`
- [ ] No layout shift when streamed content arrives
- [ ] It's been read at 1440px and 1280px
- [ ] Copy contains no banned patterns ([05](05-page-entry.md#copy-specification), [12](12-states.md#error-copy-library))

---

## 16.6 After the ten real ideas

The exec summary's instruction:

> Put ten real ideas through it, from ten real people, and watch where the
> output is thin. Fix that before adding anything.

Frontend-specific things to watch during those ten runs, and what each would
imply:

| Observation | Likely UI change |
|---|---|
| Users abandon mid-conversation | AI turns are too long, or the brief isn't visibly assembling fast enough — surface a proposed brief earlier |
| Users approve a brief with 5+ unknowns | The conversation is ending too eagerly; or the unknown tagging is reassuring people out of answering |
| Nobody opens the Evidence Drawer | The citation affordance isn't reading as clickable — strengthen the chip, or the hint isn't landing |
| Users leave during the run and don't return | The "you can close this tab" line isn't enough; consider making the first verified finding arrive faster |
| Users stop at the report | The bridge into Roadmap is too weak — strengthen "What we couldn't answer" as an on-ramp |
| Nobody copies a script | The scripts aren't good enough, or `Copy script` isn't prominent enough — check which before changing UI |
| Thin-evidence runs are common | Promote the thin variant from an edge case to a primary designed path |
| Reports get opened on phones | Reinstate mobile — see [17 R1](17-open-questions.md#r1--shared-links-open-on-phones) |

**Instrumenting these requires analytics, which the exec summary cut.** For ten
users, watch them directly instead — it's better data and it's free.
