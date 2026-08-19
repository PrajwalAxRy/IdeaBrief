# 09 — Supporting Pages & Surfaces

Four small surfaces. Each earns its place; none is a generic SaaS default.

---

## 9.1 Sources  `/r/[slug]/sources`

### Purpose

A flat, complete list of every verified finding in the run — the audit trail
behind the report. It exists because the trust proposition is
*everything is traceable*, and "everything" implies a place you can see all of
it at once.

It also absorbs the debug page the exec summary's Week 2 calls for, so the same
surface serves the builder and the sceptical reader.

### User intent

*"Show me everything you found, not the narrative."* — a sceptic, an advisor,
or the founder cross-checking a specific claim.

### Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator  ① ✓ ── ② ✓ ── ③ ✓                    [Copy link]   │
│ RUN 7f3a91c4 // 47 VERIFIED // 31 SOURCES // 18 DISCARDED                │
├──────────────────────────────────────────────────────────────────────────┤
│  ← Back to the report                                                    │
│                                                                          │
│  [All sources]                                                           │
│  Every finding that passed the check, in the order it was verified.      │
│                                                                          │
│  All (47)   Problem (12)   Exists (9)   Demand (6)   Money (11)   … ← filter pills
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ [03]  MONEY                                          ● VERIFIED  │   │
│  │ Weave charges $300–600/mo per location                            │   │
│  │ "Plans start at $299 per month per location…"                     │   │
│  │ example.com/pricing · 2026-02-14 · supports                   ↗   │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ [04]  THE PROBLEM                                    ● VERIFIED  │   │
│  │ …                                                                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ────────────────────────────────────────────────────────────────────   │
│  18 excerpts were discarded because the quoted text could not be         │
│  found on the page it came from.                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

### Components & interactions

- **Filter pills** — dimension filters, client-side, `--r-pill`. Active pill:
  `--accent-subtle` bg + `--border-accent`. This is the product's only filter
  UI; it is justified because 47 rows across five dimensions is genuinely more
  than one can scan.
- **Rows, not cards** — dense list separated by `--border-subtle` hairlines,
  hover tint `rgba(255,255,255,0.02)`. Cards here would waste vertical space and
  imply more importance per item than a flat audit list has.
- **Citation numbers match the report exactly** — `[03]` here is `[3]` there.
- Click a row → Evidence Drawer (same component). Click `↗` → source, new tab.
- The discard sentence at the bottom is permanent, not conditional.

### States

- **Loading** — 8 skeleton rows.
- **Default** — as drawn.
- **Empty (filter)** — `No findings in this dimension.` plus a `Show all`
  action. Never a full-page empty illustration.
- **Empty (run)** — if zero verified findings exist, this page says so and
  links to the roadmap, matching the thin-evidence posture.

### Responsive

Single column at every width. At `< 900px` the source/date/stance line wraps to
two lines. Nothing else changes. This page is responsive essentially for free.

---

## 9.2 Invalid run  `/r/[slug]` → not found

### Purpose

The URL *is* the access model, so a bad URL is a first-class scenario — not a
generic 404. It happens when a link is truncated in a chat app, mistyped, or
copied without its last characters.

### Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator                                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    [Run not found]                                       │
│                                                                          │
│              There's nothing                                             │  ← h1, muted
│              at this link.                                               │     / bright
│                                                                          │
│      The link may be incomplete — they're long, and chat apps            │
│      sometimes cut them off. Check you copied the whole thing.           │
│                                                                          │
│      Runs aren't stored against an account, so we can't look one         │
│      up for you.                                                         │
│                                                                          │
│      ┌────────────────────────────────────────────────────────┐         │
│      │  [Recent runs]                          (conditional)   │         │
│      │  SMS rebooking for dental clinics    roadmap      →     │         │
│      │  Tool for freelance video editors    report       →     │         │
│      │  Remembered by this browser only.                        │         │
│      └────────────────────────────────────────────────────────┘         │
│                                                                          │
│                    [  Start a new idea  →  ]                             │
│                                                                          │
│                        ▁▁▁ dim orb ▁▁▁                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### Design notes

- **Names the most likely cause first** (truncated link) rather than blaming
  the user or the system. This is the highest-value sentence on the page.
- **Surfaces recent runs when they exist** — this converts a dead end into a
  recovery for the most common real case: the founder themselves.
- **Honest about why we can't help further** — no auth means no lookup. Say it
  once, plainly, and move on.
- No red, no broken-robot illustration, no "Oops!". One `.btn-primary`.

### Responsive

Single centred column, unchanged at all widths.

---

## 9.3 Global error boundary  `/error`

Catches unhandled client and server exceptions.

```text
                    [Something broke]

              This one's on us.

      An unexpected error stopped the page from loading.
      Your run is still there — reloading usually fixes it.

              [ Reload ]      [ Go to your run → ]

      ERROR 8f2a1c // 2026-08-19 14:31          ← Meta Line, for support
```

- Preserves the run link when the slug is known — the user's work is not lost
  and the page should say so before anything else.
- The error ID in a Meta Line is the one piece of technical detail shown; it
  costs nothing and makes a bug report actionable.
- No stack traces in production. No red. No apology longer than four words.

---

## 9.4 The Recent Runs surface

Not a page — a component appearing on `/` and on the invalid-run page.

### Why it exists

No auth means the URL is the only key, and the most predictable failure in the
entire product is a user losing it. `localStorage` closes ~80% of that gap for
zero backend work and no change to the data model.

### Data shape

```ts
// localStorage["sv.runs"] — capped at 10, most-recent-first
type RecentRun = {
  slug: string
  oneLiner: string          // from the brief; falls back to the raw first input
  stage: 'define' | 'validate' | 'roadmap'
  updatedAt: string         // ISO
}
```

Written on: run creation, brief approval, report completion, roadmap
completion. Read on mount of `/` and the invalid-run page only.

### Rendering

```text
[Recent runs]
─────────────────────────────────────────────────────────────
SMS rebooking for overdue dental patients   roadmap   2d ago  →
Tool for freelance video editors            report    5d ago  →
something in fitness                        define    5d ago  →
─────────────────────────────────────────────────────────────
Remembered by this browser only.
```

- Plain divided rows. Not cards — this is a utility, not a feature, and card
  treatment would imply a runs dashboard the product doesn't have.
- Stage chip in mono `--text-tertiary`; relative time in `--text-tertiary`.
- Hidden entirely when the list is empty. **No empty state.**
- The closing note is required: it sets accurate expectations about durability
  in one line, which is more honest than silently letting someone assume their
  runs are saved somewhere.

### What it deliberately isn't

- Not synced, not searchable, not filterable, not sortable
- No delete UI (browser storage clearing is the mechanism)
- No count badge, no "you have 3 runs"
- Not shown inside the Run Shell — it would imply a workspace

---

## 9.5 Surfaces that are deliberately absent

For the record, so they don't get added by reflex:

| Absent surface | Why |
|---|---|
| Settings / preferences | Nothing to configure. One theme, no account, no notifications. |
| Profile / account | No auth. |
| Pricing | Nothing to sell in v1. |
| Help centre / docs | The product is one flow; if it needs docs, the flow is wrong. |
| Changelog / what's new | No returning-user base yet. |
| Legal pages | Add a minimal privacy note only if the deployment requires one; not a design concern. |
| Dashboard of all runs | Would require auth, and implies a workspace the product isn't. |
| Share modal | The URL is the share mechanism; `Copy link` is the whole feature. |
| Export (PDF / CSV) | Explicitly cut in the exec summary. The URL is the artifact. |
