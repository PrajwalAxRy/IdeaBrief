# Startup Validator — Frontend Design Blueprint

> Design plan for the v1 (fourth revision) MVP described in
> [`../executive_summary.md`](../executive_summary.md).
>
> **Status:** design only. No code has been written, no packages installed,
> no framework initialised. This folder is the specification a frontend
> engineer reads *before* opening an editor.

---

## How to read this

Read in order the first time. After that, jump.

| # | File | What's in it |
|---|---|---|
| — | `README.md` | This file — index, decision log, glossary |
| 01 | [`01-product-and-principles.md`](01-product-and-principles.md) | What the UI is for, who uses it, the eight design principles |
| 02 | [`02-visual-direction.md`](02-visual-direction.md) | Full visual system: tokens, type, surfaces, buttons, cards, motion |
| 03 | [`03-information-architecture.md`](03-information-architecture.md) | IA, sitemap, route map, navigation model, URL/access model |
| 04 | [`04-user-journeys.md`](04-user-journeys.md) | Flow maps, decision points, abandonment risks, friction removal |
| 05 | [`05-page-entry.md`](05-page-entry.md) | `/` — the one box, framed |
| 06 | [`06-page-define.md`](06-page-define.md) | `/r/[slug]/define` — conversation + idea brief |
| 07 | [`07-page-validate.md`](07-page-validate.md) | `/r/[slug]/validate` — live run console + the report |
| 08 | [`08-page-roadmap.md`](08-page-roadmap.md) | `/r/[slug]/roadmap` — open questions + build plan |
| 09 | [`09-pages-supporting.md`](09-pages-supporting.md) | Sources list, invalid run, recent runs, error pages |
| 10 | [`10-component-system.md`](10-component-system.md) | Every reusable primitive and its role |
| 11 | [`11-interaction-patterns.md`](11-interaction-patterns.md) | Motion, hover/focus, disclosure, drawers, copy actions |
| 12 | [`12-states.md`](12-states.md) | Loading / empty / error / success matrix per surface |
| 13 | [`13-responsive-and-accessibility.md`](13-responsive-and-accessibility.md) | Desktop-only strategy + the a11y floor we keep anyway |
| 14 | [`14-tech-stack.md`](14-tech-stack.md) | Recommended stack, with reasoning per choice |
| 15 | [`15-project-structure.md`](15-project-structure.md) | Suggested folder layout and code organisation |
| 16 | [`16-scope-and-priorities.md`](16-scope-and-priorities.md) | MVP boundaries, what's explicitly out, week-by-week build order |
| 17 | [`17-open-questions.md`](17-open-questions.md) | Assumptions made, questions still open, flagged risks |

---

## The product in one paragraph

A person arrives with a half-formed idea. They type it into one box. An AI
talks to them like a thoughtful cofounder until it can write down what they're
actually building — the **brief**. That brief triggers a **research run** that
searches the web, fetches pages, and mechanically verifies that every quoted
excerpt really appears on the page it claims to come from. What survives
becomes a **report**. From the brief plus the verified findings, the product
writes a **roadmap**: the questions only real humans can answer (with the
interview scripts written out), and a build plan wired to those questions.
No login. No score. No verdict. The whole thing lives at one URL.

---

## Decision log

Decisions made during this design pass, and why. These are settled — reopen
them deliberately, not by accident.

| Decision | Choice | Reasoning |
|---|---|---|
| Visual direction | **`dark-luxury-design`, amber/gold** | User-selected. Primary skill per brief. `clean-design` used only where it improves clarity and density — see [02 §2.17](02-visual-direction.md). |
| Entry page | **Hybrid: the box, framed** | User-selected. Root is the product, wrapped in a minimal hero. No separate marketing site — there is nothing to sell yet (no billing, no accounts). |
| Responsive | **Desktop-only** | User-selected, matches exec summary's explicit cut. One flagged risk in [17](17-open-questions.md#r1--shared-links-open-on-phones). |
| Accessibility | **No audit; keep the free floor** | Semantic HTML, keyboard nav, visible focus, `prefers-reduced-motion`. These cost nothing at build time and are painful to retrofit. See [13](13-responsive-and-accessibility.md). |
| Navigation | **The three pillars are the nav** | Define → Validate → Roadmap is the entire primary navigation. No sidebar, no settings, no account menu. |
| Run URL shape | **`/r/[slug]` + stage sub-paths** | `/r/[slug]` is the shareable canonical URL and resolves to the most useful complete stage. Sub-paths exist for deep links. See [03](03-information-architecture.md#route-map). |
| Lost-link problem | **`localStorage` recent runs** | No auth means losing the URL loses everything. A client-side list of visited runs closes the hole for zero backend work. |
| Progress display | **Real queries, real counts — no percentage** | Exec summary: "No fake percentages." The run console shows actual queries firing and findings landing. See [07](07-page-validate.md#mode-a--run-console). |
| Charts | **Almost none** | The product deliberately has no scores. No scores means no gauges, no dials, no radar charts. Only a three-segment confidence note and coverage bars. See [02 §2.11](02-visual-direction.md). |
| Typography | **Inter + JetBrains Mono** | `dark-luxury-design` specifies Inter. `clean-design` forbids it. Per the brief, dark-luxury wins on conflict. |
| Global state library | **None** | Server Components hold run data; one SSE hook holds live run state; everything else is local `useState`. See [14](14-tech-stack.md#state-management--none). |
| Component library | **Radix primitives, custom skin** | Behaviour and focus management for free; zero inherited visual opinion. A default shadcn/ui skin would fight the aesthetic. |

---

## Glossary

Names used consistently across every file. Use these exact names in code.

**Product objects**

| Term | Meaning |
|---|---|
| **Run** | One end-to-end pass: brief + research + report + roadmap. Identified by `slug`. |
| **Brief** | The structured idea description produced by Pillar 1 and approved by the user. |
| **Finding** | One verified claim: `finding` + `excerpt` + `url` + `dimension` + `stance`. |
| **Dimension** | One of the five research areas: Problem, What Exists, Demand, Money, Practical. |
| **Report** | Pillar 2 output: summary, per-dimension, competitors, surprises, unanswered. |
| **Open Question** | A Pillar 3a item — something only a human conversation can answer. |
| **Roadmap Step** | A Pillar 3b block: Before / First / Then / Later / What Would Change This. |

**UI components** (specified in [10](10-component-system.md))

| Term | Meaning |
|---|---|
| **Run Shell** | The persistent app chrome: top bar, stage rail, copy-link. |
| **Stage Rail** | The three-segment Define/Validate/Roadmap navigation. Primary nav. |
| **The Box** | The single large input on `/`. |
| **Brief Panel** | The right rail on Define showing the brief assembling live. |
| **Don't-Know Button** | The always-present one-tap "I don't know" in the composer. |
| **Run Console** | The live view while research is executing. |
| **Query Ticker** | Monospace stream of the actual search queries being run. |
| **Finding Card** | One verified finding, as it lands. |
| **Citation Chip** | Inline `[12]` reference in report prose. |
| **Evidence Drawer** | Right-side panel showing an excerpt in full with its source. |
| **Confidence Note** | `solid` / `mixed` / `thin` label on a dimension. Never a number. |
| **Competitor Card** | Field-rendered competitor profile. |
| **Surprise Panel** | Elevated treatment for "What surprised us". |
| **Thin-Evidence Notice** | The honest panel shown when the web returned little. |
| **Open Question Card** | The labelled-grid card for a Pillar 3a question. |
| **Script Block** | The copy-pasteable interview script inside an Open Question Card. |
| **Dependency Chip** | The link from a roadmap step back to the open question that governs it. |
| **Meta Line** | Monospace `//`-separated technical metadata line. |
| **Section Label** | `[Bracket]` monospace overline introducing a section. |

---

## What this blueprint deliberately does not contain

Mirroring the exec summary's own discipline — this list matters as much as
the spec itself.

- No login, signup, password reset, or account settings screens
- No pricing page, checkout, billing portal, or upgrade prompts
- No team, sharing-permission, or comment UI
- No dashboard of many runs, no search across runs, no filters over runs
- No score gauges, radar charts, verdict banners, or readiness ladders
- No onboarding tour, coach marks, or product tour modals
- No notification centre, email preferences, or settings page
- No dark/light toggle — there is one theme and it is the theme

If a screen isn't in [03](03-information-architecture.md#route-map), it isn't
in v1.
