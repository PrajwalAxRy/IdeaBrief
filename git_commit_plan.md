# Phased commit plan

Goal: turn the current working tree (everything since commit `09f5f2e`, the
P0–P2 scaffold) into **9 commits, one per build phase (P3–P11)**, matching the
phase history already documented in `only_frontend_build_plan.md`. Each
commit should leave the tree in a working/buildable state.

Status: **P3 done** (commit `ba1408b`, pushed to `origin/main`). P4–P11
still pending. When you're ready for the next one, we'll do it phase by
phase; I'll stop and confirm with you before every `git push`.

## How this maps to reality

Almost every changed file is brand-new (untracked) and belongs to exactly
one phase — those are simple `git add <file>` + commit. A small number of
pre-existing files were touched by *more than one* phase (e.g. `CopyButton`
got a prop in P3 and a refactor in P6). Those need `git add -p` (patch mode)
to split into the right commits instead of one whole-file add. They're
called out explicitly in their own section below so nothing gets missed or
misattributed.

---

## P3 — Run Shell, routing, layout — ✅ done (`ba1408b`)

**Commit message:** `Build P3 of the frontend prototype: Run Shell, routing, layout`

Executed with 3 extra slices this file list didn't originally call out
(found while verifying the staged snapshot actually typechecks in
isolation — `npx tsc --noEmit` after stashing everything else):
- `components/layout/run-shell.tsx` also pulls in P11's `SkipLink` — stripped for this commit, restored after.
- `app/r/[slug]/layout.tsx` also pulls in P6's `EvidenceProvider`/`getEvidence` and P10's `isKnownSlug`/`RunNotFound` — stripped for this commit, restored after.
- `lib/format.ts` (an "M" file this plan missed entirely) mixes a P3 helper (`formatElapsed`, `formatClockTime`) with a P8 one (`formatDate`) — split the same way.

These three are now added to the cross-phase table below so P6/P8/P10/P11
pick up their remaining slices correctly.

New files (`git add` whole file):
- `lib/run-summary.ts`
- `components/ui/copy-link-button.tsx`
- `components/status/confidence-note.tsx`, `coverage-bar.tsx`, `phase-strip.tsx`, `stage-chip.tsx`, `status-badge.tsx`, `verified-badge.tsx` (built now, not wired into any page until P6–P9 — see the phase's own build log note)
- `components/layout/run-shell.tsx`, `stage-rail.tsx`, `page-container.tsx`, `two-column.tsx`, `prose-column.tsx`, `run-footer-bar.tsx`
- `app/r/[slug]/layout.tsx`
- `app/r/[slug]/page.tsx`
- `tests/unit/run-summary.test.ts`

Modified files (whole file, single-phase):
- `lib/db/queries.ts` — adds `getConversation`/`getRunSummary`
- `styles/globals.css` — moves the reset/body/grain/heading/focus rules into `@layer base` (the P3 cascade-layers bug fix); this file's entire diff belongs here, nothing later touches it

Cross-phase files with a P3 slice (see "Cross-phase files" section for exact handling):
- `lib/run-stage.ts` — **P3 slice only**: `getStageStates` + `resolveRunRedirect` (not `isKnownSlug`, that's P10)
- `tests/unit/run-stage.test.ts` — **P3 slice only**: the `run-stage — StageRail state...` describe block (not the `isKnownSlug` describe block, that's P10)
- `components/ui/copy-button.tsx` — **P3 slice only**: add the `text?: string` prop and branch `handleClick` on `getText ? getText() : (text ?? '')`, but keep the existing local `useState`/`useRef` clipboard logic as-is (the `useCopy` hook extraction is P6)
- `styles/components.css` — P3's banner sections (see table below)

---

## P4 — Entry page `/`

**Commit message:** `Build P4 of the frontend prototype: Entry page /`

New files:
- `components/entry/hero.tsx`, `the-box.tsx`, `example-seed.tsx`, `orb.tsx`, `trust-section.tsx`, `what-you-get.tsx`, `recent-runs-list.tsx`
- `components/layout/landing-nav.tsx`, `footer-panel.tsx`
- `lib/hooks/use-recent-runs.ts`

Modified files (whole file, single-phase):
- `app/page.tsx` — full rewrite from the create-next-app placeholder to the real entry page
- `components/ui/text-area.tsx` — adds `ref` prop
- `components/ui/display-headline.tsx` — adds `reverse` prop

Cross-phase files with a P4 slice:
- `app/actions/create-run.ts` — **P4 slice only**: `createRun` + `readStoredIdeaText` (not `markRunStarted`/`readRunStartedAt`, that's P7)
- `styles/components.css` — P4's banner sections

---

## P5 — Define: conversation + Brief Panel

**Commit message:** `Build P5 of the frontend prototype: Define conversation + Brief Panel`

New files:
- `components/define/` — all 9 files (`approve-button.tsx`, `brief-field.tsx`, `brief-panel.tsx`, `composer.tsx`, `define-conversation.tsx`, `dont-know-button.tsx`, `message-stream.tsx`, `message.tsx`, `suggestion-chip.tsx`)
- `app/r/[slug]/define/page.tsx`

Modified files (whole file, single-phase):
- `lib/schemas/conversation.ts` — adds optional `chips?: string[]`
- `lib/fixtures/conversation.ts` — populates `chips` on one turn

Cross-phase files with a P5 slice:
- `components/define/define-conversation.tsx` — **P5 slice only**: everything except the `markRunStarted` import/call in `handleApprove` (that one line + its import is P7 — small enough to split by hand if `git add -p` bundles it with surrounding context)
- `styles/components.css` — P5's banner sections

---

## P6 — Evidence system + `/sources`

**Commit message:** `Build P6 of the frontend prototype: Evidence system + /sources`

New files:
- `components/validate/evidence/` — all 5 files (`citation-chip.tsx`, `cited-text.tsx`, `evidence-context.tsx`, `evidence-drawer.tsx`, `finding-card.tsx`)
- `components/validate/sources-list.tsx`
- `components/layout/back-link.tsx`
- `lib/hooks/use-copy.ts`
- `app/r/[slug]/sources/page.tsx`

Cross-phase files with a P6 slice:
- `components/ui/copy-button.tsx` — **P6 slice**: swap the local `useState`/`useRef`/timer body for the new `useCopy` hook (this is the other half of P3's slice above — net result after both commits is today's actual file)
- `components/ui/drawer.tsx` — **P6 slice**: add the `onCloseAutoFocus?` prop to the interface and pass it through to `Dialog.Content`, on top of the *existing* (pre-motion) implementation — do **not** bring in `motion`/`AnimatePresence`/`'use client'` yet, that's P11. (`EvidenceDrawer`'s own `onCloseAutoFocus` usage depends on this prop existing, so it can't be deferred to P11.)
- `app/r/[slug]/layout.tsx` — **P6 slice**: wrap `{children}` in `<EvidenceProvider evidence={evidence}>`, and add `getEvidence` to the `Promise.all` fetch (on top of P3's base version, which fetches only `getRun`)
- `components/define/define-conversation.tsx` — n/a here (see P5/P7 split)
- `styles/components.css` — P6's banner sections

---

## P7 — Validate: Run Console

**Commit message:** `Build P7 of the frontend prototype: Validate Run Console`

New files:
- `components/validate/console/` — all 3 files (`finding-stream.tsx`, `query-ticker.tsx`, `run-console.tsx`)
- `lib/hooks/use-run-stream.ts`
- `lib/run-stream-reducer.ts`
- `app/r/[slug]/validate/loading.tsx`
- `tests/unit/run-stream-reducer.test.ts`

Cross-phase files with a P7 slice:
- `app/actions/create-run.ts` — **P7 slice**: `markRunStarted` + `readRunStartedAt`
- `components/define/define-conversation.tsx` — **P7 slice**: the `markRunStarted` import + call inside `handleApprove`
- `app/r/[slug]/validate/page.tsx` — **P7 slice only**: the base page (Suspense + `useRunStream` + Run Console ⇄ Report cross-fade), *without* the `?thin=1` handling (P8) or `?broken=1` handling (P10)
- `styles/components.css` — P7's banner sections

---

## P8 — Validate: the Report

**Commit message:** `Build P8 of the frontend prototype: Validate Report`

New files:
- `components/validate/report/` — all 7 files (`competitor-card.tsx`, `dimension-section.tsx`, `report.tsx`, `summary-section.tsx`, `surprise-panel.tsx`, `thin-evidence-notice.tsx`, `unanswered-section.tsx`)
- `components/validate/validate-view.tsx`
- `components/layout/section-index.tsx`
- `lib/hooks/use-scroll-spy.ts`

Modified files (whole file, single-phase):
- `lib/thin-evidence.ts` — adds `buildThinPreviewOverrides` (the pre-existing `isThinEvidence` export is untouched)

Cross-phase files with a P8 slice:
- `app/r/[slug]/validate/page.tsx` — **P8 slice**: add `?thin=1` handling via `buildThinPreviewOverrides`
- `lib/format.ts` — **P8 slice**: `formatDate` + its `dateFormatter` const (on top of P3's `formatElapsed`/`formatClockTime`)
- `styles/components.css` — P8's banner sections

---

## P9 — Roadmap

**Commit message:** `Build P9 of the frontend prototype: Roadmap`

New files:
- `components/roadmap/` — all 8 files (`dependency-chip.tsx`, `not-in-it-list.tsx`, `open-question-card.tsx`, `roadmap-context.tsx`, `roadmap-step.tsx`, `roadmap-timeline.tsx`, `script-block.tsx`, `timeline-node.tsx`)
- `components/layout/segmented-control.tsx`
- `app/r/[slug]/roadmap/page.tsx` (include the `?thin=1` handling — it's native to this phase, not deferred)

Modified files (whole file, single-phase):
- `lib/schemas/roadmap.ts` — adds `ROADMAP_PHASE_LABEL`
- `tailwind.config.ts` — adds the `roadmap: '900px'` container size

Artifacts for this phase:
- `p9-*.png` (9 screenshots)

Cross-phase files with a P9 slice:
- `styles/components.css` — P9's banner sections

---

## P10 — Supporting pages + state matrix

**Commit message:** `Build P10 of the frontend prototype: supporting pages + state matrix`

New files:
- `app/error.tsx`, `app/not-found.tsx`
- `app/r/[slug]/not-found.tsx`
- `app/r/[slug]/roadmap/error.tsx`, `app/r/[slug]/roadmap/loading.tsx`
- `app/r/[slug]/define/loading.tsx`
- `app/r/[slug]/sources/loading.tsx`

Artifacts for this phase:
- `p10-*.png` (6 screenshots)

Cross-phase files with a P10 slice:
- `lib/run-stage.ts` — **P10 slice**: `isKnownSlug` + the `GENERATED_SLUG_PATTERN` const
- `tests/unit/run-stage.test.ts` — **P10 slice**: the `isKnownSlug — the 09.2 invalid-run check` describe block
- `app/r/[slug]/validate/page.tsx` — **P10 slice**: `?broken=1` QA affordance
- `app/r/[slug]/roadmap/page.tsx` — **P10 slice**: `?broken=1` QA affordance
- `styles/components.css` — P10's banner sections (the error-panel styling)

---

## P11 — Motion, a11y floor, DoD sweep

**Commit message:** `Build P11 of the frontend prototype: motion, a11y floor, DoD sweep`

New files:
- `components/ui/reveal.tsx`, `components/ui/skip-link.tsx`

Modified files (whole file, single-phase):
- `components/ui/modal.tsx` — full `motion`/`AnimatePresence` rewrite (nothing before P11 depends on `Modal` — it's unused outside the deleted kitchen-sink demo — so this is safe to take as one whole-file commit)

Cross-phase files with a P11 slice (in addition to the `drawer.tsx` one already listed above):
- `components/layout/run-shell.tsx` — **P11 slice**: add the `SkipLink` import + `<SkipLink />` render (on top of P3's base version)
- `app/r/[slug]/layout.tsx` — **P11 slice**: n/a — no P11-specific change found here; P6 and P10 slices above already account for its full current content

Deletions (per the P11 exit test, already confirmed with the user in that session):
- `app/kitchen-sink/kitchen-sink-client.tsx`, `app/kitchen-sink/page.tsx`
- `app/proof/page.tsx`

Artifacts for this phase:
- `p11-*.png` (11 screenshots)
- **All of `.playwright-mcp/`** (58 console/page-snapshot files) — these are an undifferentiated flat log of the whole session's Playwright MCP verification, not attributable to individual earlier phases without opening each one. Bundling them here as the final end-to-end verification sweep is the pragmatic call; reshuffle later if you want per-phase precision.

Cross-phase files with a P11 slice:
- `components/ui/drawer.tsx` — **P11 slice**: add `'use client'`, `motion`/`AnimatePresence`, `EASE_OUT`, `forceMount`/`asChild` on top of P6's `onCloseAutoFocus` addition
- `components/entry/what-you-get.tsx` — wait, this file is new in this working tree (P4), so its P11 changes (raw-hex bug fix + `Reveal` wiring) are just part of the one P4 commit already covered above — **no extra slice needed**, ignore.
- `styles/components.css` — P11's banner sections

---

## Cross-phase files — how to split them

These are the files where a straight `git add <file>` would either break an
earlier phase's build (by including code it doesn't need yet) or misattribute
a change. Use `git add -p` (or `git add -e` for a manual hunk edit) at the
phase where each slice is listed above. Suggested order: do the **earlier**
phase's slice first, leaving the rest unstaged, commit, then the file's
remaining diff is exactly the later phase's slice.

| File | Slices |
|---|---|
| `lib/run-stage.ts` | P3 (`getStageStates`, `resolveRunRedirect`) → P10 (`isKnownSlug`) |
| `tests/unit/run-stage.test.ts` | P3 (first `describe` block) → P10 (`isKnownSlug` `describe` block) |
| `components/ui/copy-button.tsx` | P3 (`text` prop, old state logic kept) → P6 (swap to `useCopy` hook) |
| `app/actions/create-run.ts` | P4 (`createRun`, `readStoredIdeaText`) → P7 (`markRunStarted`, `readRunStartedAt`) |
| `components/define/define-conversation.tsx` | P5 (everything) → P7 (`markRunStarted` wiring in `handleApprove`, 1 import + 1 call) |
| `components/ui/drawer.tsx` | P6 (`onCloseAutoFocus` passthrough, no motion yet) → P11 (motion/`AnimatePresence` rewrite) |
| `app/r/[slug]/validate/page.tsx` | P7 (base page) → P8 (`?thin=1`) → P10 (`?broken=1`) |
| `app/r/[slug]/roadmap/page.tsx` | P9 (base page + `?thin=1`, both native to this phase) → P10 (`?broken=1`) |
| `app/r/[slug]/layout.tsx` | P3 (base: `RunShell` + Meta Line, no evidence, no slug validation) → P6 (`EvidenceProvider` + `getEvidence`) → P10 (`isKnownSlug` check + `RunNotFound`) |
| `components/layout/run-shell.tsx` | P3 (base chrome) → P11 (`SkipLink`) |
| `lib/format.ts` | P3 (`formatElapsed`, `formatClockTime`) → P8 (`formatDate`) |

*(Last three rows found during P3 execution — not in the original file survey. Worth doing the same "stash everything else, `tsc --noEmit`" isolation check at each future phase before committing, since silent forward-references like these don't show up just from reading a diff.)*

None of these splits are required for the app to *work* at every commit
except where noted (`onCloseAutoFocus`, the `text` prop) — those two are
genuine same-phase dependencies, so get them right; the rest are mostly
about matching the historical narrative.

## `styles/components.css` — banner-section → phase mapping

This file grew by ~1250 lines and is the one place nearly every phase left a
mark. It's cleanly delimited by `/* ---------- Section name ---------- */`
comments already in the diff, so `git add -p` can pull section-by-section.
CSS has no compile-time cross-file dependencies, so getting a section's
phase attribution slightly wrong is cosmetic, not a build risk.

| Section (as commented in the file) | Phase |
|---|---|
| Run Shell | P3 |
| Stage Rail | P3 |
| Status components | P3 |
| Drawer | P6 |
| Landing nav | P4 |
| Hero | P4 |
| Footer panel | P4 |
| Recent runs | P4 |
| Define — conversation | P5 |
| Suggestion chip | P5 |
| Composer | P5 |
| Citation chip | P6 |
| Evidence drawer | P6 |
| Finding card | P6 |
| Sources | P6 |
| Brief field | P6 |
| Query ticker | P7 |
| Finding card entrance | P7 |
| Orb, dimmed | P7 |
| Console → Report cross-fade | P7 |
| Report | P8 |
| Section index | P8 |
| Roadmap — segmented control | P9 |
| Roadmap — Open Question Card | P9 |
| Roadmap — cut list | P9 |
| Roadmap — build timeline | P9 |
| Roadmap — Dependency Chip | P9 |
| Error panel | P10 |
| Modal | P11 |
| Skip link | P11 |
| Scroll reveal | P11 |

## `only_frontend_build_plan.md`

This doc's own diff is naturally phase-shaped (it has a dated `### P3 —
2026-08-19` ... `### P11 — 2026-08-20` section per phase, plus the status
table update at the top). Split it with `git add -p`: the P0–P2 table rows
flipping `TODO → DONE` should land with whichever commit is the *first* one
in this plan (P3, so the table isn't inconsistent with reality at any
intermediate commit), and each `### PN` log section lands in that phase's
own commit.

## Execution notes

- Nothing will be committed or pushed until you say go.
- I'll confirm with you before every `git push`, phase by phase, per your
  answer above — not just once at the start.
- Suggested commit body: reuse each phase's own `### PN` bullet list from
  `only_frontend_build_plan.md` as the commit message body (trimmed), since
  it already describes exactly what changed and why — no need to re-write
  it from scratch.









https://cloud.comfy.org/oauth/authorize?response_type=code&client_id=comfy-cli&redirect_uri=http%3A%2F%2F127.0.0.1%3A58521%2Fcallbackscope=comfy-cloud%3Aworkflows%3Aread+comfy-cloud%3Aworkflows%3Awrite+comfy-cloud%3Ajobs%3Aread+comfy-cloud%3Ajobs%3Awrite+comfy-cloud%3Afiles%3Aread+comfy-cloud%3Afiles%3Awrite+comfy-cloud%3Aassets%3Aread+comfy-cloud%3Aassets%3Awrite+comfy-cloud%3Ahub%3Ar+comfy-cloud%3Ahub%3Awrite+comfy-cloud%3Auser%3Aread+comfy-cloud%3Asettings%3Aread+comfy-cloud%3Asettings%3Awrite+comfy-cloud%3Abilling%3Aread&state=cmpDK2ZDDx0Ygz69me8tYw&code_challenge=TehxSQTekZ24LVcADG-rdf1fhjz5RUUy8P4fcp2HHlQ&code_challenge_method=S256&resource=https%3A%2F%2Fcloud.comfy.org%2Fapi