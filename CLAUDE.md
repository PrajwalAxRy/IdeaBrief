# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Scope: hardcoded frontend only

**This repo is a clickable frontend prototype. There is no AI work and no backend work happening here, and none should be added.**

- No LLM calls, no API keys, no prompt engineering, no `ai`/`@ai-sdk/react` usage.
- No database, no `app/api/*` route handlers, no server pipeline, no SSE endpoint.
- Every piece of data is a hardcoded fixture in `lib/fixtures/`.
- The Define "conversation" is a scripted fixture replayed character-by-character; the research "run" is a fixture event log replayed on `setTimeout`. Nothing is generated.

The fakes sit behind the *exact interfaces a real backend would satisfy later*, so a future swap is mechanical. Preserve those interfaces; don't shortcut through them. If a task seems to need a real backend or model call, stop and ask — the answer is almost certainly a fixture.

## Commands

```bash
npm run dev                        # next dev
npm run build                      # next build (also the typecheck gate)
npm test                           # vitest run — tests/unit/**/*.test.ts, node env
npx vitest run tests/unit/citations.test.ts     # one file
npx vitest run -t 'citation'       # one test by name
npm run lint                       # biome check . (lint + format + import order)
npx biome check --write .          # autofix
npx tsc --noEmit                   # typecheck without a full build
```

There is no separate `typecheck` script and no committed E2E suite. Verify browser behaviour with the **Playwright MCP** against a running `next dev` — screenshot at 1440px and 1280px, drive keyboard flows with real key presses.

## The three seams

These are the whole point of the prototype's structure:

| Seam | Today | Later becomes |
|---|---|---|
| `lib/db/queries.ts` | `async` functions returning Zod-parsed fixtures | Postgres reads |
| `lib/hooks/use-run-stream.ts` | Replays `lib/fixtures/run-events.ts` on a timer | Native `EventSource` against `/api/run/[slug]/stream` |
| Define conversation | Scripted turns from `lib/fixtures/conversation.ts` | Vercel AI SDK `useChat` against `/api/chat` |

Rules:

- **No component may import from `lib/fixtures/` directly.** `lib/db/queries.ts` is the only file that does. Every fixture is parsed through its Zod schema at the seam — a fixture that fails its schema is a bug now, not later.
- `queries.ts` signatures are always `(slug: string) => Promise<T>`. The prototype has exactly one fixture run, so `slug` is only validated, never used to select data.
- `useRunStream(slug)` branches on `process.env.NEXT_PUBLIC_USE_FIXTURES` **inside the hook, nowhere else**.
- `app/actions/create-run.ts` is not a real server action — it's a client-side slug generator plus `localStorage` writes (`sv.idea.*`, `sv.runStarted.*`). `localStorage` is also how the app knows a brief was "just approved" (the server fixture is always `status: 'complete'`), and how Recent Runs works in the absence of auth.

## Architecture

**Routes.** `/` (entry) · `/r/[slug]` (redirects by status via `resolveRunRedirect`) · `/r/[slug]/define|validate|roadmap|sources` · `/style-guide` (dev-only component gallery). `app/r/[slug]/layout.tsx` wraps every run page in `RunShell` (header, `StageRail`, `MetaLine`, copy-link, footer) and mounts `EvidenceProvider`.

**Server-first.** Server Components by default. `'use client'` is budgeted to a 13-name allowlist (`TheBox`, `Composer`, `MessageStream`, `BriefPanel`, `RunConsole`, `CitationChip`, `EvidenceDrawer`, `Accordion`, `CopyButton`, `RecentRunsList`, `SegmentedControl`, `SectionIndex`, `FilterPill`). Adding one beyond that requires a build-log note explaining why. Wrappers over Radix primitives stay server components — Radix self-declares `'use client'` in its own package.

**Component tiers.** `components/ui/` = primitives with no product knowledge. `components/status/`, `components/layout/` = shared product chrome. `components/{entry,define,validate,roadmap}/` = page-owned.

**State.** No state library, deliberately. Server Components hold run data; `useRunStream` holds the one real-time surface; `EvidenceProvider` (`components/validate/evidence/evidence-context.tsx`) is the app's single global UI context — which finding is open in the drawer.

**Citations.** `[n]` numbers derive from the finding id's numeric suffix (`EV_12` → `12`) in `lib/citations.ts`, never from array position, so they can't drift when evidence is re-sorted or filtered. Report prose schemas `.refine()` that every `[n]` in the text has a matching citation entry and vice versa.

**Stage state** is a pure function of `RunStatus` (`lib/run-stage.ts`), not of the current route.

## Styling rules (enforced by review, not tooling)

- **`styles/tokens.css` is the only file permitted to contain a colour value.** Not in a component, not in a Tailwind class, not in `style={{}}`. If a needed colour isn't a token, the answer is a token or a different design.
- **Tailwind is for layout only** — flex, grid, spacing, sizing. `tailwind.config.ts` deliberately has no `colors` key (it only adds `maxWidth` names). All colour, shadow, glow, border, and typography come from `styles/components.css` recipes or `style={{}}` reading CSS variables.
- **Everything in `styles/` must be layered.** Global CSS lives inside `@layer base` in `styles/globals.css`; recipe stylesheets are imported with `layer(components)`. Unlayered rules beat every layered rule regardless of specificity — this has silently zeroed out every Tailwind spacing utility in the app twice now, once globally and once for the whole landing page. It produces no error and the page still looks plausible, so it is only ever caught by measuring a computed style.
- **Desktop only.** Do not add mobile breakpoints. Read at 1440px and 1280px.
- Every interactive element needs hover, `:focus-visible`, and active states at build time — not in a later polish pass. Exactly one `.btn-primary` visible per viewport.
- Reserve space for streamed content; no layout shift when it arrives.
- **Never render model text as markdown.** Everything renders through typed components from validated fields. `react-markdown` is deliberately not installed.

## Design system

Design and build work uses the **`obsidian-design`** skill. Read `.claude/skills/obsidian-design/SKILL.md` before producing any visible pixels; don't design a screen from memory or default styling. It's a near-black canvas where 1px hairlines carve the entire layout, display type is weight 400 at 58–104px with hard negative tracking, and one electric blue (`#2D7FF9`) means action, verification, or live state — nothing else.

The skill carries reference files for the parts that are easy to get wrong. Read the one you need rather than all of them:

| File | Read it when |
|---|---|
| `references/motion.md` | Adding any animation, scroll behaviour, reveal, or transition. |
| `references/media.md` | Deciding what fills a visual area — image, video, code, or slot. |
| `references/higgsfield.md` | Writing a generative brief, or generating/swapping real assets. |
| `references/verification.md` | Before calling any screen done. The Playwright MCP loop. |
| `references/pitfalls.md` | **First**, whenever CSS applied in the stylesheet but not on screen. |

`assets/tokens.css` and `assets/recipes.css` are paste-ready starting points for a new project.

**Both previous systems are superseded.** `deep-canopy-design` (forest green) and `dark-luxury-design` (amber/gold) describe systems this repo has moved off. Don't invoke either. Forest-green or amber styling found in the tree is a leftover to port, not a valid alternative. Fall back to **`clean-design`** only for a specific pattern Obsidian doesn't cover.

**Current state of the port.** Obsidian ships on `/` only, scoped behind `[data-theme='obsidian']` — tokens in `styles/tokens.css`, recipes in `styles/obsidian.css`, components in `components/landing/`. `/r/[slug]/*` and `/style-guide` still render Deep Canopy and are debt, not a second valid system.

Three rules that bite hardest here:

- **Blue has exactly three jobs** — primary action, verification, live/active. Not the logo, not section numerals, not separators. If you can't name which job a blue thing is doing, it shouldn't be blue.
- **An undefined CSS custom property silently voids its whole declaration.** After editing a recipe stylesheet, diff used-vs-defined variables against `styles/tokens.css` before believing a rule applied. Same for `animation:` names against their `@keyframes`.
- **Recipe stylesheets must be imported into `@layer components`.** `styles/obsidian.css` is; `styles/components.css` is **not**, and therefore still carries the latent bug where `.recipe { margin: 0 }` silently beats every Tailwind spacing utility on the same element. Fix that when porting it. See `references/pitfalls.md` §1.

**Media.** Product surfaces are drawn in code as real UI fragments — never screenshots, never stock. Photography is permitted only where the subject is genuinely human or atmospheric (the hero collage), must be near-monochrome and heavily scrimmed, and always carries a replacement brief in `higgsfieldPlan.md`. Anything that can't be made yet is a labelled slot with its art-direction brief, never a blank div — don't delete a slot to "clean up", it's the spec for an asset someone still owes.

## Conventions

- Files `kebab-case.tsx`; components `PascalCase`; hooks `use-kebab-case.ts` exporting `useCamelCase`; schemas `PascalCaseSchema`.
- Use the glossary names in `WebsiteLayoutDesc/README.md` verbatim in code — `DependencyChip`, not `LinkedQuestionBadge`.
- No new dependencies beyond `WebsiteLayoutDesc/14-tech-stack.md §14.3` (minus `ai`/`@ai-sdk/react`, which the prototype doesn't need). If something seems to need one, ask rather than install.
- Biome: single quotes, semicolons, trailing commas, 2-space indent, 100-col.
- Import alias `@/*` maps to the repo root (also aliased in `vitest.config.ts`).

## Where the specs live

- `only_frontend_build_plan.md` — **the execution plan.** 12 phases (P0–P11), each with a file list and an exit test, plus standing rules and a **build log** recording every deviation, deferral, and decision per phase. Read the progress table first; append to the build log before finishing a phase.
- `WebsiteLayoutDesc/` — the 17-file design blueprint (visual system, IA, per-page specs, component system, states, a11y). It's a reference, not a reading list: read only the files the current phase names. `README.md` there holds the decision log and glossary.
- `executive_summary.md` — the product definition the whole thing answers to.
- `git_commit_plan.md` — how the working tree maps onto one commit per build phase, including which files span phases and need `git add -p`.
