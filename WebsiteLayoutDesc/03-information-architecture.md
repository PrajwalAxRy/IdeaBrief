# 03 — Information Architecture

---

## 3.1 The organising idea

**The product is one document with three chapters, and the navigation is the
table of contents.**

There is no workspace, no library, no settings. A user is always in exactly one
of four places:

```text
   ①  the entry page          — before a run exists
   ②  Define                  — writing the brief
   ③  Validate                — running / reading the report
   ④  Roadmap                 — reading what to do
```

Every other surface (Evidence Drawer, sources list, error pages) is a
supporting layer over one of these, not a fifth destination.

## 3.2 Access model — the URL is the key

From the exec summary:

> `runs.id` is a long random slug. That is the entire access model for v1 — no
> accounts, no sessions, no permissions. Anyone with the link has the run.

Three UI obligations follow, and they are not optional:

1. **The link must be trivially copyable at all times.** A `Copy link` action
   lives in the Run Shell header on every run page. On success it confirms
   inline (button label swaps to `Copied`), not with a toast that can be missed.
2. **The user must be told the link is the key**, once, at the moment it first
   matters — immediately after the brief is approved and the run starts, when
   they're about to wait. A single quiet line, not a modal:
   `This page is your run. Bookmark it — there's no login to get back.`
3. **Losing the link must be recoverable.** `localStorage` keeps a list of run
   slugs this browser has visited, surfaced on `/` as **Recent runs**. It does
   not survive a cleared browser or a different device — and the UI says so
   plainly rather than implying durability it doesn't have.

```text
localStorage["sv.runs"] = [
  { slug: "7f3a91c4…", oneLiner: "SMS rebooking for dental clinics",
    stage: "roadmap", updatedAt: "2026-08-19T14:31:00Z" },
  …
]
```

Written on: run creation, brief approval, report completion. Capped at 10,
most-recent-first.

## 3.3 Route map

```text
/                                   Entry — hero + The Box + what you get + recent runs
│
├─ POST (server action) → create run → redirect
│
└─ /r/[slug]                        Canonical shareable URL. Resolves and
   │                                redirects to the furthest meaningful stage:
   │                                  brief not approved  → /define
   │                                  research running    → /validate
   │                                  report done         → /validate
   │                                  roadmap done        → /validate   ← see note
   │
   ├─ /r/[slug]/define              Pillar 1 — conversation + Brief Panel
   ├─ /r/[slug]/validate            Pillar 2 — Run Console (running) OR Report (done)
   ├─ /r/[slug]/roadmap             Pillar 3 — open questions + build plan
   └─ /r/[slug]/sources             Flat list of every verified finding (secondary)

/r/[slug] → 404                     Invalid or expired slug — dedicated page, §09
/error                              Unhandled failure boundary
```

> **Note on the final redirect.** When a run is fully complete, `/r/[slug]`
> lands on **Validate (the report)**, not Roadmap. Reasoning: the report is
> what a recipient of a shared link needs first — it's the evidence, and the
> roadmap is meaningless without it. The report's final section
> ("What we couldn't answer") is the deliberate on-ramp into Roadmap.

### Why sub-paths at all, given "everything lives at one URL"?

The exec summary's intent is *one URL to remember and share*, and `/r/[slug]`
delivers that — it's what the Copy link button copies, always. Sub-paths exist
so that:

- the browser Back button works between stages instead of trapping the user,
- a stage is directly linkable when someone wants to point at the roadmap,
- and the Stage Rail can be plain `<a>` navigation instead of client state.

The user never has to know they exist.

## 3.4 Navigation model

### Primary navigation — the Stage Rail

The three pillars, and nothing else. Persistent in the Run Shell header.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  ◆ Startup Validator      ①  Define  ──  ②  Validate  ──  ③  Roadmap     │
│                              ✓ done       ● active       ○ locked        │
│  RUN 7f3a91c4 // 19 QUERIES // 31 PAGES // 47 VERIFIED    [Copy link]    │
└──────────────────────────────────────────────────────────────────────────┘
```

Three segment states:

| State | Appearance | Clickable |
|---|---|---|
| **Locked** | `--text-muted`, hollow `○` node, no hover | No — but see below |
| **Active** | `--text-primary`, filled amber node, amber underline | Current |
| **Done** | `--text-body`, `✓` node, hover → `--text-primary` | Yes |

**Locked segments are not disabled buttons — they carry no affordance at all.**
A greyed-out clickable-looking thing invites a click and then refuses it, which
is the worst of both. A locked segment is simply dim text with a hollow node
and a `title` explaining what unlocks it.

Progression is strictly linear: Validate unlocks when the brief is approved;
Roadmap unlocks when the report finishes. There is no way to skip, because
each stage's input is the previous stage's output.

### Secondary navigation

Only two, both scoped inside a stage:

1. **Report section index** — a sticky right-rail scrollspy on
   `/validate` when the report is complete. Five entries matching the report's
   five sections. Active entry marked with an amber left-tick.
2. **Roadmap segmented control** — a sticky two-segment control
   (`Open questions` / `Build roadmap`) that scroll-jumps within the page. Both
   sections stay on one page so the wiring between them stays visible — see
   [08](08-page-roadmap.md).

There is deliberately **no** global search, no breadcrumb, no sidebar, and no
"more" menu.

## 3.5 Page hierarchy

```text
Entry  /
│  Depth 0 — no state, no run
│
└── Run  /r/[slug]
    │  Depth 1 — the Run Shell wraps everything below
    │
    ├── Define  /r/[slug]/define
    │   ├── Conversation stream          (primary)
    │   └── Brief Panel                  (secondary, right rail)
    │       └── Field editor             (inline, depth 3)
    │
    ├── Validate  /r/[slug]/validate
    │   ├── Run Console                  (while status = running)
    │   │   ├── Query Ticker
    │   │   ├── Dimension coverage
    │   │   └── Finding stream
    │   └── Report                       (while status = complete)
    │       ├── What we found            (+ Citation Chips)
    │       ├── Per dimension × 5
    │       ├── Who else is doing this   → Competitor Cards
    │       ├── What surprised us        → Surprise Panel
    │       └── What we couldn't answer  → CTA into Roadmap
    │       └── Evidence Drawer          (overlay, depth 3)
    │
    ├── Roadmap  /r/[slug]/roadmap
    │   ├── Open questions               → Open Question Card × 4–7
    │   │   └── Script Block             (expanded, depth 3)
    │   └── Build roadmap                → Roadmap Step × 5
    │       └── Dependency Chip          → links back up to a question
    │
    └── Sources  /r/[slug]/sources
        └── Flat verified findings table (secondary; linked from report footer)
```

Maximum interaction depth is **three**. Nothing in this product justifies a
fourth.

## 3.6 Information architecture of the report

The report is the densest surface, so its internal IA deserves stating
explicitly. Order is fixed and matches the exec summary:

| # | Section | Content type | Density | Why here |
|---|---|---|---|---|
| 1 | **What we found** | 3–5 model-written sentences, each cited | Low | The whole report in 20 seconds. Nothing above it. |
| 2 | **Per dimension** | 5 collapsible sections, each with a Confidence Note + findings | High | The evidence, organised the way it was gathered. |
| 3 | **Who else is doing this** | Field-rendered Competitor Cards | Medium | Concrete, comparative, the most immediately useful part. |
| 4 | **What surprised us** | 2–3 elevated statements | Low | The screenshot moment. Needs air around it, so it sits late where the reader has context. |
| 5 | **What we couldn't answer** | Honest list | Low | The bridge to Pillar 3. Ends the page pointing forward. |

**Design consequence:** density alternates low → high → medium → low → low.
That rhythm is intentional; it gives the reader somewhere to rest and makes the
Surprise Panel land after the heavy middle rather than competing with it.

## 3.7 Content-first vs. chrome-first

Ratio target on every run page: **≥ 85% of vertical pixels are content.**
The Run Shell header is ~72px. There is no sidebar, no toolbar, no footer
beyond a thin bar. If a new chrome element is proposed, something else comes
out.

## 3.8 Onboarding

**There is no onboarding.** No tour, no coach marks, no welcome modal, no
sample-run walkthrough. For a product whose entire promise is "type one thing
and go," an onboarding layer is a contradiction.

What replaces it, in order of when the user meets it:

| Moment | Guidance mechanism |
|---|---|
| Arrival on `/` | The headline and the placeholder in The Box explain the product in ~12 words. Three clickable **example seeds** below the box remove blank-page paralysis. |
| Below the fold on `/` | `[What you get]` — three numbered panels showing the three outputs. Scrolling is opt-in; the box is above it. |
| First AI message in Define | The AI itself sets expectations in one sentence and asks the first question. No system banner. |
| First time the Don't-Know Button matters | The button is visible from the first question. No tooltip needed — the label is the instruction. |
| Brief approval | One quiet line about the URL being the key (§3.2). |
| Run start | The Run Console explains itself by showing real work. |
| Report arrival | The first Citation Chip carries a one-time hover hint: `Hover any [n] to see the source`. Dismissed permanently on first interaction, stored in `localStorage`. |

That last one is the only piece of instructional UI in the product, and it
exists because the citation mechanic is the differentiator and is not
self-evident.

## 3.9 Entry and exit points

**Ways in:**
- Direct to `/` (organic)
- Direct to `/r/[slug]` (a shared link — assume this is a *cold* visitor with
  no context; the report must stand alone and the Run Shell must make it
  obvious what product this is and how to start their own)
- Back from `localStorage` recent runs

**Ways out (all deliberate, none blocked):**
- Close the tab mid-run — the run continues server-side; returning to the URL
  resumes exactly where it is
- `Start another idea` in the run footer → `/` with the current run preserved
  in recent runs
- Copy link and leave

**There is no "delete run," no "sign up to save," and no exit-intent modal.**

## 3.10 Cold-visitor handling on a shared link

A meaningful fraction of report views will be someone the founder sent the link
to. They arrive at `/r/[slug]` with zero context. Three affordances:

1. The Run Shell wordmark links to `/` and reads as a product, not an app.
2. The report's own header states the idea in one line — the brief's
   `one_liner` — so the reader immediately knows what was researched.
3. The run footer carries a single secondary CTA: `Validate your own idea →`.

No signup wall, no "sign in to view," no partial blur. The link works.
