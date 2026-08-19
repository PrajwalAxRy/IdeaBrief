# 15 — Suggested Project Structure

Organised so that the three pillars are visible in the folder tree. Someone
opening this repo cold should be able to map it to the executive summary in
thirty seconds.

---

## 15.1 Tree

```text
startup-validator/
├── app/
│   ├── layout.tsx                   # <html>, fonts, grain overlay, global styles
│   ├── page.tsx                     # / — entry (RSC)
│   ├── error.tsx                    # global error boundary  → 09
│   ├── not-found.tsx                # fallback 404
│   │
│   ├── actions/
│   │   └── create-run.ts            # server action: insert run, kick off pillar 1
│   │
│   ├── r/
│   │   └── [slug]/
│   │       ├── layout.tsx           # <RunShell> — loads run, renders StageRail
│   │       ├── page.tsx             # resolves status → redirect to a stage
│   │       ├── not-found.tsx        # invalid run page  → 09
│   │       │
│   │       ├── define/
│   │       │   └── page.tsx
│   │       ├── validate/
│   │       │   ├── page.tsx         # picks Run Console vs Report from status
│   │       │   └── loading.tsx      # streamed skeletons
│   │       ├── roadmap/
│   │       │   └── page.tsx
│   │       └── sources/
│   │           └── page.tsx
│   │
│   └── api/
│       ├── chat/route.ts            # pillar 1 — LLM conversation (AI SDK)
│       ├── brief/route.ts           # brief field patch + approve
│       ├── run/[slug]/stream/route.ts   # SSE — pillar 2 progress
│       └── run/[slug]/status/route.ts   # polling fallback
│
├── components/
│   ├── ui/                          # TIER 1 — primitives, no product knowledge
│   │   ├── button.tsx
│   │   ├── icon-button.tsx
│   │   ├── text-action.tsx
│   │   ├── copy-button.tsx
│   │   ├── text-area.tsx
│   │   ├── inline-editable-field.tsx
│   │   ├── inline-editable-list.tsx
│   │   ├── filter-pill.tsx
│   │   ├── card.tsx
│   │   ├── well.tsx
│   │   ├── drawer.tsx
│   │   ├── modal.tsx
│   │   ├── popover.tsx
│   │   ├── tooltip.tsx
│   │   ├── accordion.tsx
│   │   ├── divider.tsx
│   │   ├── section-label.tsx
│   │   ├── display-headline.tsx
│   │   ├── meta-line.tsx
│   │   ├── prose.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-note.tsx
│   │   ├── spinner.tsx
│   │   └── rest-indicator.tsx
│   │
│   ├── layout/                      # app shell & navigation
│   │   ├── run-shell.tsx
│   │   ├── landing-nav.tsx
│   │   ├── stage-rail.tsx
│   │   ├── section-index.tsx
│   │   ├── segmented-control.tsx
│   │   ├── page-container.tsx
│   │   ├── prose-column.tsx
│   │   ├── two-column.tsx
│   │   ├── footer-panel.tsx
│   │   └── run-footer-bar.tsx
│   │
│   ├── status/                      # status & data display
│   │   ├── verified-badge.tsx
│   │   ├── confidence-note.tsx
│   │   ├── coverage-bar.tsx
│   │   ├── phase-strip.tsx
│   │   ├── stage-chip.tsx
│   │   └── status-badge.tsx
│   │
│   ├── entry/                       # TIER 3 — / page sections
│   │   ├── hero.tsx
│   │   ├── the-box.tsx
│   │   ├── example-seed.tsx
│   │   ├── what-you-get.tsx
│   │   ├── trust-section.tsx
│   │   ├── recent-runs-list.tsx
│   │   └── orb.tsx
│   │
│   ├── define/                      # PILLAR 1
│   │   ├── message-stream.tsx
│   │   ├── message.tsx
│   │   ├── composer.tsx
│   │   ├── dont-know-button.tsx
│   │   ├── suggestion-chip.tsx
│   │   ├── brief-panel.tsx
│   │   ├── brief-field.tsx
│   │   └── approve-button.tsx
│   │
│   ├── validate/                    # PILLAR 2
│   │   ├── console/
│   │   │   ├── run-console.tsx
│   │   │   ├── query-ticker.tsx
│   │   │   └── finding-stream.tsx
│   │   ├── report/
│   │   │   ├── report.tsx
│   │   │   ├── summary-section.tsx
│   │   │   ├── dimension-section.tsx
│   │   │   ├── competitor-card.tsx
│   │   │   ├── surprise-panel.tsx
│   │   │   ├── unanswered-section.tsx
│   │   │   └── thin-evidence-notice.tsx
│   │   └── evidence/                # shared by console + report + roadmap
│   │       ├── finding-card.tsx
│   │       ├── citation-chip.tsx
│   │       ├── evidence-drawer.tsx
│   │       └── evidence-context.tsx # the one global UI context
│   │
│   └── roadmap/                     # PILLAR 3
│       ├── open-question-card.tsx
│       ├── script-block.tsx
│       ├── roadmap-timeline.tsx
│       ├── roadmap-step.tsx
│       ├── not-in-it-list.tsx
│       └── dependency-chip.tsx
│
├── lib/
│   ├── schemas/                     # Zod — the LLM/UI contract
│   │   ├── brief.ts
│   │   ├── evidence.ts
│   │   ├── report.ts
│   │   ├── roadmap.ts
│   │   └── run.ts
│   ├── hooks/
│   │   ├── use-run-stream.ts        # the entire real-time layer
│   │   ├── use-recent-runs.ts       # localStorage
│   │   ├── use-scroll-spy.ts
│   │   └── use-copy.ts
│   ├── db/
│   │   ├── client.ts
│   │   └── queries.ts               # one function per read the UI needs
│   ├── citations.ts                 # global, stable [n] numbering
│   ├── thin-evidence.ts             # the thin-run trigger rule, in one place
│   └── format.ts                    # relative time, domain extraction, counts
│
├── styles/
│   ├── tokens.css                   # :root — the ONLY place colours are defined
│   ├── globals.css                  # reset, base type, grain overlay, focus ring
│   └── components.css               # .btn, .card, .well, .meta-line, keyframes
│
├── public/
│   └── og/                          # static OG image(s)
│
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
│       └── happy-path.spec.ts
│
├── tailwind.config.ts               # layout utilities only; @theme reads tokens.css
├── tsconfig.json
└── package.json
```

---

## 15.2 Organising rules

### 1. Components are grouped by pillar, not by type

`components/define/`, `components/validate/`, `components/roadmap/` mirror the
executive summary directly. A `components/` folder sorted alphabetically into
`atoms/molecules/organisms` would hide the product's structure behind a
taxonomy that has nothing to do with it.

`ui/`, `layout/`, and `status/` are the exception — they hold genuinely generic
pieces used across all three.

### 2. `validate/evidence/` is shared on purpose

`FindingCard`, `CitationChip`, and `EvidenceDrawer` are used by the console,
the report, the roadmap, and the sources page. They live under `validate/`
because that's where the evidence comes from, and the import path
(`components/validate/evidence/...`) makes the provenance obvious from any
call site.

### 3. Colours live in exactly one file

`styles/tokens.css`. If a hex value appears anywhere else — a component, a
Tailwind class, a `style={{}}` — that's a bug. This is the discipline that
keeps the design system from eroding under deadline pressure.

### 4. Zod schemas are the boundary

Every LLM payload passes through `lib/schemas/` before reaching a component.
Components receive typed, validated objects and never parse, never guard
against `undefined` from the model, and never render raw model text as
markup.

### 5. One function per query the UI actually needs

`lib/db/queries.ts` exposes `getRun`, `getBrief`, `getEvidence`, `getReport`,
`getRoadmap` — not a generic ORM surface. The page files stay declarative and
the database access stays auditable.

### 6. Client components are the exception, and they're listed

Per [10](10-component-system.md#component-conventions), only ~13 components
carry `'use client'`. If that list grows, something has drifted — the report in
particular should stay almost entirely server-rendered.

### 7. Two rules that live in exactly one place each

- **`lib/citations.ts`** — the global `[n]` numbering. The report, roadmap, and
  sources page all read from it, so a citation means the same thing everywhere.
- **`lib/thin-evidence.ts`** — the thin-run trigger (< 12 findings, or ≥ 3
  dimensions with < 2). Used by the report, the roadmap, and potentially the
  console's early warning. Duplicating this threshold would produce a report
  that says the evidence is thin next to a roadmap that doesn't.

---

## 15.3 Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Files | `kebab-case.tsx` | `open-question-card.tsx` |
| Components | `PascalCase`, matching the glossary in the README | `OpenQuestionCard` |
| Hooks | `use-kebab-case.ts` → `useCamelCase` | `use-run-stream.ts` → `useRunStream` |
| Zod schemas | `PascalCaseSchema` + inferred type | `BriefSchema`, `type Brief` |
| CSS classes | `kebab-case`, BEM-ish for variants | `.card`, `.card--featured` |
| Tokens | `--kebab-case`, grouped by role | `--bg-card`, `--text-muted` |
| SSE events | `noun.verb` | `finding.verified` |
| Routes | lowercase, singular stage names | `/r/[slug]/validate` |

**Use the glossary names.** If the design doc calls it a `DependencyChip`, the
component is `DependencyChip` — not `LinkedQuestionBadge`. Vocabulary drift
between design and code is the main reason design documents stop being useful
after week two.

---

## 15.4 Where the build starts

The first three files to write, in order:

1. **`styles/tokens.css`** — the entire palette, type scale, spacing, radius,
   and motion tokens from [02](02-visual-direction.md). Nothing else can be
   built correctly until this exists.
2. **`styles/components.css`** — `.btn`, `.btn-primary` with its pulse,
   `.card` with its inset highlight, `.well`, `.meta-line`, `.section-label`,
   the grain overlay, and the focus ring. Copy the skill's CSS verbatim.
3. **`components/ui/button.tsx` + `card.tsx`** — prove the two hardest visual
   recipes (the multi-layer glow and the borderless elevation) render correctly
   before building anything on top of them.

Get those right and the rest of the aesthetic follows almost mechanically. Get
them wrong and every screen inherits it.
