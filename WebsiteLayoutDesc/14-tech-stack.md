# 14 — Frontend Technology Stack

The exec summary's constraint governs everything here:

> Deliberately boring and small. … App: Next.js — UI and API routes in one
> deployment. Jobs: a row in `runs` with a status, polled or streamed via SSE.
> No Redis, no queue, no worker service.

Every choice below is justified against *this* product — a four-week MVP, one
deployment, no auth, one long-running job, and a document-shaped UI.

---

## 14.1 The stack

| Layer | Choice | Version target |
|---|---|---|
| Framework | **Next.js, App Router** | 15.x |
| Language | **TypeScript**, `strict: true` | 5.x |
| Styling | **Tailwind CSS v4** (layout only) + **CSS custom properties** (all design tokens) | 4.x |
| UI primitives | **Radix UI**, unstyled | latest |
| Icons | **lucide-react** | latest |
| Schema / validation | **Zod**, shared client + server | 3.x |
| LLM streaming UI | **Vercel AI SDK** (`ai`, `@ai-sdk/react`) — Define conversation only | 5.x |
| Run streaming | **Native `EventSource`** (SSE) in a custom hook | — |
| Server state | **React Server Components** + `fetch` | — |
| Client state | **`useState` / `useReducer`** + one context for the Evidence Drawer | — |
| Animation | **CSS transitions + IntersectionObserver**; **`motion`** for drawer/modal only | 12.x |
| Charts | **None** | — |
| Testing | **Vitest** + **React Testing Library**; **Playwright** for one E2E path | — |
| Formatting / linting | **Biome** (or ESLint + Prettier if the team prefers) | — |
| Hosting | **Vercel** | — |

---

## 14.2 Reasoning, choice by choice

### Framework — Next.js App Router

Mandated by the exec summary, and correct independently:

- **One deployment** for UI and API routes — no separate backend service, which
  matches "no worker service."
- **Server Components** mean the report (the heaviest page) ships almost no JS.
  A 47-finding report with citation popovers would be a large client bundle in
  a client-rendered SPA; here it's server HTML plus a few interactive islands.
- **Streaming SSR with Suspense** delivers the loading choreography in
  [11](11-interaction-patterns.md#118-loading-choreography) natively —
  "What we found" renders while competitors are still resolving.
- **Route handlers** host the SSE endpoint and the LLM proxy in the same app.

One caveat to plan for: the research run may outlive a serverless function
timeout. The exec summary already anticipates this ("run it as a long-running
route or a single small worker process"). **Frontend impact: none**, because
the UI reads run state from Postgres via SSE regardless of what executes the
pipeline. Keep that boundary clean.

### Language — TypeScript, strict

The product is a pipeline of structured objects produced by an LLM
(`brief_json`, `evidence`, `report`, `roadmap`). Types are the contract that
keeps a model's output from silently reshaping the UI. Non-negotiable.

### Styling — Tailwind v4 for layout, CSS variables for tokens

**This split is a direct instruction from the design skill** ("Tailwind for
layout only · `style={{}}` or `<style>` for all colors") and it's right here:

- The design system is a fixed set of tokens ([02](02-visual-direction.md)).
  Putting them in `:root` makes them the single source of truth and keeps the
  skill's CSS copy-pasteable without translation into Tailwind config.
- The glow, grain, inset-highlight, and pulse recipes are multi-layer
  `box-shadow` and `@keyframes` — expressing those as Tailwind utilities is
  worse in every way.
- Tailwind still earns its place for flex/grid/spacing/sizing, where utilities
  genuinely beat writing classes.

Tailwind v4 specifically because its `@theme` directive reads CSS variables
natively, so the two systems compose instead of duplicating.

**Rejected:** CSS-in-JS (runtime cost, RSC friction), CSS Modules alone
(loses utility ergonomics), Tailwind-for-everything (fights the skill).

### UI primitives — Radix, unstyled

Needed: Dialog, Popover, Tooltip, Collapsible, and correct focus management for
the Evidence Drawer.

- Focus trapping, focus restoration, `Esc` handling, scroll locking, and ARIA
  wiring are genuinely hard and genuinely solved. Writing them by hand in a
  four-week MVP is how the drawer ends up subtly broken.
- **Unstyled** means zero inherited visual opinion — critical, because this
  design is highly specific and a pre-skinned library would be fought at every
  step.

**Rejected: shadcn/ui.** It is Radix underneath, so the behaviour is identical,
but its default styling is precisely the generic-SaaS look this product is
trying not to look like. Copying its components in and then rewriting every
class is more work than styling Radix directly, and it invites drift back
toward the defaults.

**Rejected: MUI, Chakra, Mantine, Ant.** Heavy, opinionated, theme systems that
would fight the token approach.

### Icons — lucide-react

Both skills specify Lucide. Tree-shakeable, 1.5px stroke matching the
aesthetic, `currentColor` by default. The product uses ~16 icons; the import
cost is negligible.

### Schema — Zod

The highest-leverage dependency in the stack for *this* product:

- Every major object comes from an LLM and **must** be validated before it
  touches the UI. A malformed `competitors_json` should fail loudly at the
  boundary, not render a broken card.
- One schema definition serves runtime validation, TypeScript types
  (`z.infer`), and — if the LLM layer uses structured outputs — the tool
  schema itself. Three uses, one definition.
- Enables the rendering-time assertions this design calls for: uncited prose in
  "What we found" is a bug and can be caught in the schema layer.

### Forms — none

**No react-hook-form, no Formik, no TanStack Form.**

The product has three inputs: The Box, the Composer, and the Brief Panel's
inline field editor. None is a form. The Brief Panel edits one field at a time
with commit-on-blur — there is no submit, no validation summary, no dirty
tracking, no field array orchestration. A form library here would be ~15KB and
an abstraction over `useState` plus a Zod parse.

If a real form ever appears, that's a signal to re-read the exec summary first.

### LLM conversation — Vercel AI SDK

Scoped to the Define conversation only.

- `useChat` handles the exact problems this page has: token streaming, message
  state, optimistic user turns, abort, and error recovery mid-stream.
- Mature, provider-agnostic, works with Claude.
- The alternative is hand-rolling streaming-response parsing, which is a
  well-known source of subtle bugs (partial UTF-8, backpressure, aborts) for no
  benefit.

**Not used for the research run** — that's a server-side pipeline whose state
lives in Postgres, and its UI needs a plain SSE reader, not a chat abstraction.

### Run streaming — native EventSource

The run emits `phase`, `query.start`, `query.done`, `finding.verified`,
`finding.discarded`, `complete`, `error`. That is a one-way server→client
stream of named events, which is exactly what SSE is.

- `EventSource` is built into the browser: zero dependencies
- Auto-reconnect is native; the polling fallback is ~20 lines
- **WebSockets rejected**: bidirectional, needs connection infrastructure,
  doesn't work with the "no worker service" constraint, and the client never
  sends anything
- **Polling rejected as primary**: the exec summary wants findings appearing as
  they're verified, and 2-second polling makes that feel mechanical

Wrap it in one `useRunStream(slug)` hook. That hook is the entire real-time
layer of the product.

### Server state — RSC + fetch. Client state — `useState`.

**No TanStack Query, no SWR, no Redux, no Zustand, no Jotai.**

This is the choice most likely to be second-guessed, so the reasoning in full:

- **There is no client-side cache to manage.** The report, roadmap, brief, and
  sources are all server-rendered from Postgres at request time. They don't
  refetch, don't invalidate, don't paginate, and don't sync across views.
- **There is exactly one real-time surface** (the run), owned by one hook.
- **There is no cross-page shared state.** No user, no session, no preferences,
  no cart-equivalent. Each page is a function of its slug.
- **The one genuinely global piece of UI state** is "which evidence is open in
  the drawer" — one React context with an ID.

Adding a state library here would be adding a solution with no problem, plus
bundle weight, plus a second mental model for data alongside RSC.

**Revisit if:** accounts arrive (post-v1), or runs become comparable
side-by-side (post-v1). Both are on the exec summary's "after it works" list.

### Animation — CSS first, `motion` for overlays only

- The skill provides its animations as **CSS + IntersectionObserver**, and
  copying them verbatim is both faster and guaranteed-faithful. Scroll reveals,
  the orb, the button pulse, hover lifts, and the accordion are all pure CSS.
- **`motion` (Framer Motion's successor) is added for one job**: enter/exit
  choreography on the Evidence Drawer and Modal. Exit animations in pure CSS
  require keeping unmounted content in the tree, which is genuinely awkward.
- It is **not** imported on `/` or the report body — kept out of the critical
  bundle via the client-component boundary.

### Charts — none

No Recharts, no Visx, no Chart.js, no D3.

The product deliberately has no scores, no time series, and no distributions.
Its three data displays — the three-segment `ConfidenceNote`, the
`CoverageBar`, and the timeline spine — are `div`s with widths. A chart library
would be 40–120KB to render rectangles, and having one installed creates
pressure to add charts the product shouldn't have.

### Testing — thin and targeted

Four weeks means testing has to be chosen, not comprehensive.

| Layer | Tool | What it covers |
|---|---|---|
| Unit | Vitest | Zod schema parsing of LLM payloads (incl. malformed cases); citation-number resolution; `localStorage` recent-runs read/write; the SSE event reducer |
| Component | Vitest + RTL | `InlineEditableField` commit/revert; `CopyButton` label lifecycle; `OpenQuestionCard` expand/collapse; `CitationChip` → drawer |
| E2E | Playwright | **One** happy path: `/` → type → conversation (mocked LLM) → approve → run (mocked SSE) → report → roadmap → copy script |
| Visual | None in v1 | Not worth the setup cost at this scale |

The E2E test is the highest-value item on the list: it's the only thing that
verifies the three pillars actually connect, which is the product's whole
premise.

**Mock the LLM and search providers in all tests.** Never hit real APIs in CI —
runs cost real money.

### Auth UI — none

No Clerk, no NextAuth, no Supabase Auth, no login component, no session
provider. The URL is the access model
([03](03-information-architecture.md#32-access-model--the-url-is-the-key)).
`localStorage` recent runs is the substitute for a runs list, and it is ~30
lines of code with no dependency.

---

## 14.3 Full dependency list

Deliberately short. Every line justified above.

```jsonc
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "zod": "^3",
    "lucide-react": "^0.4xx",
    "@radix-ui/react-dialog": "^1",       // Evidence Drawer, Modal
    "@radix-ui/react-popover": "^1",      // Citation hover
    "@radix-ui/react-tooltip": "^1",      // Icon buttons
    "@radix-ui/react-collapsible": "^1",  // Accordions
    "ai": "^5",                           // Define conversation
    "@ai-sdk/react": "^2",
    "motion": "^12"                       // Drawer/Modal exit only
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "vitest": "^2",
    "@testing-library/react": "^16",
    "@playwright/test": "^1",
    "@biomejs/biome": "^1"
  }
}
```

**Twelve runtime dependencies**, of which four are Radix primitives. That is
the "deliberately boring and small" the exec summary asked for.

---

## 14.4 Things deliberately not installed

| Not installed | Why |
|---|---|
| shadcn/ui | Generic default aesthetic; Radix directly is less work here |
| TanStack Query / SWR | No client cache to manage |
| Redux / Zustand / Jotai | No cross-page state |
| react-hook-form | No forms |
| Recharts / D3 / Visx | No charts |
| date-fns / dayjs | `Intl.RelativeTimeFormat` covers the two places we show relative time |
| clsx / cva | Marginal; template literals are fine at this scale (add `clsx` only if variant logic actually gets messy) |
| next-themes | One theme |
| PostHog / analytics | Explicitly cut in the exec summary |
| Sentry | Worth adding *after* the first ten real users, not before |
| react-markdown | Model output renders through typed components, not raw markdown — this is a deliberate safety and consistency decision |

That last one matters: **rendering LLM output as markdown would let the model
control the layout.** Competitor cards, confidence notes, and open-question
grids all render from *fields*, which is exactly what the exec summary demands
("Rendered from fields, not written as prose, so the numbers can't drift").
Only two surfaces contain free model prose — the summary and the surprises —
and both render as plain paragraphs with citation chips resolved from
structured references, not as markdown.
