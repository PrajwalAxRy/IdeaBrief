# Accounts, Sign In & Pricing — build plan

> **Phases A20–A25.** This file is the execution plan for adding accounts, a
> sign-in flow, saved runs and a pricing surface. It extends
> [`obsidian_app_build_plan.md`](obsidian_app_build_plan.md), which stays
> authoritative for A0–A19, the twenty locked decisions D1–D20, the 23 standing
> rules and the inherited-defect table. Read that file's standing rules first;
> everything here is subordinate to them except where a new locked decision
> (D21–D28, §1) says otherwise.
>
> Two phases here touch `/r/[slug]/*` (A22, A23). Per CLAUDE.md those must also
> append to `obsidian_app_build_plan.md`'s build log before they close.
>
> **Status: A20 DONE. A21–A25 planned.** See the build log at §10 for what A20
> actually shipped and where it deviated from this plan.

---

## 0. Why this exists, and what it contradicts

This is the first phase block that **contradicts `executive_summary.md` rather
than executing it.** That has to be said out loud, because a future session that
reads the specs cold will otherwise correctly conclude this work is out of
scope.

`executive_summary.md:72-73`, under *"Removed because the priority is a working
product"*:

> - Login, accounts, auth. A run lives at its own URL; that URL is the key.
> - Billing, Stripe, pricing tiers, credits, free-tier design.

`:384` — *"Five tables. **No users table.**"* · `:408` — *"`runs.id` is a long
random slug. That is the entire access model for v1 — no accounts, no sessions,
no permissions."* · `:428` — *"No auth provider. No Stripe."*

Sourced verbatim into five more spec files: `16-scope-and-priorities.md:34-35`,
`14-tech-stack.md:227` (*"Auth UI — none"*), `README.md:122`,
`09-pages-supporting.md:220-230` (*"Profile / account | No auth."* ·
*"Pricing | Nothing to sell in v1."*), `10-component-system.md:161`
(*"| Avatar | No users. |"*).

**The reopening is nevertheless pre-sanctioned by the same document.**
`:470-471`, under *"What comes after it works"*:

> - Accounts, so people can find their old runs without a bookmark
> - A way to charge

and `14-tech-stack.md:185` names the exact trigger: *"**Revisit if:** accounts
arrive (post-v1)."*

So this is not scope creep against the product definition — it is the product
definition's own next chapter, pulled forward by the owner. It is recorded as
**D21** rather than as an edit to D1–D20, which
`obsidian_app_build_plan.md` states are *"not open for re-litigation
mid-build."* Additions are permitted; amendments are not.

**One thing the owner has not decided and A25 must ask before it closes:**
whether `executive_summary.md` is amended in place or gains a v5 addendum
section. Until then two binding documents disagree. See §7.1.

---

## 1. Locked decisions (D21–D28)

These come from an explicit product-owner session and are closed. They are
numbered continuing from D20 in `obsidian_app_build_plan.md`.

### D21 — Accounts and pricing are reopened from the post-v1 list

The owner has pulled `executive_summary.md:470-471` forward. This block builds a
**clickable prototype of the account flow only**: no auth provider, no network,
no cookie, no server-side identity, no payment. The fake sits behind the exact
interfaces a real backend would satisfy, per CLAUDE.md's standing seam rule.

### D22 — The account is required to **run research**, and nowhere else

- The landing composer is **unchanged**. Anyone can type an idea and land on
  `/r/<slug>/define` with no account.
- The Define conversation is **unchanged**. Anyone can talk to the cofounder,
  edit the brief, and fill every field.
- **Approving the brief** — the moment the ~45s research run would start — is
  where the account is required. This is where the cost is in the real product.
- Nothing else anywhere is gated.

*Cost, stated plainly:* this is the "you've done the work, now pay the toll"
shape. A user invests several minutes in the conversation before meeting the
wall. A22 mitigates it by keeping the brief on screen, never losing input, and
resuming the approve automatically after sign-in — but the friction is
structural and the owner accepted it.

### D23 — There is no plan limit, no quota, and no meter

No tier gates anything. No usage counter renders anywhere in the product flow.
A free account gets the entire product — Define, Validate, Roadmap, unlimited
runs, every source. This keeps `executive_summary.md`'s *"Gates of any kind …
It never stops the run"* intact for everything except D22's single wall.

**Consequence:** no `Entitlement` type, no `lib/entitlement.ts`, no quota
schema, no `checkRunGate`. The map produced designs for all of these; they are
**not built**. Do not add them speculatively.

### D24 — `/pricing` is a route with a labelled placeholder

Real route, real nav link, real footer link, real metadata, real OG card. The
content is a **labelled placeholder with a brief**, following the house
convention for unbuilt surfaces (CLAUDE.md: *"Anything that can't be made yet is
a labelled slot with its art-direction brief, never a blank div"*). No tiers, no
prices, no feature matrix, no billing toggle.

*This also sidesteps a live contradiction:* `executive_summary.md:340-346`
refuses to print prices at all (*"Prices rot"*), and
`tests/unit/roadmap-integrity.test.ts:116` asserts no cost item quotes one.
A real pricing page needs a stated register split — *our* commercial terms vs.
*research findings about someone else's* costs. Deferred with the page.

### D25 — Shared run links stay fully public

A stranger with the URL sees the entire run — report, sources, roadmap — with no
account and no prompt. `runExists(slug)` is unchanged, no owner check is added,
and `RunSchema` gains no `owner` field.

This preserves `04-user-journeys.md:290` (*"the product's only real distribution
mechanism in v1"*) and `03-information-architecture.md:256` (*"No signup wall,
no 'sign in to view,' no partial blur. The link works."*) verbatim.

`robots: { index: false, follow: false }` **stays** on `/r/[slug]/*`. Its
comment (*"The slug is the whole access model"*) is amended, not deleted — the
slug is still the whole access model for *viewing*.

### D26 — Sign-in is Google, GitHub, or an emailed link. There are no passwords

No password field exists anywhere in the product. No reset flow, no
wrong-password state, no strength meter, no confirm-password.

Because none of the three methods can distinguish a new user from a returning
one, **there is one auth screen at `/sign-in`**. `/sign-up` redirects to it.
The copy is method-neutral: *"New or returning — same door."*

**The magic link resolves instantly.** No "check your inbox" screen is built —
entering an email and submitting signs you in after a short pending state. The
inbox screen is a real screen in the real product and it is deliberately absent
here, because a prototype that dead-ends is worse than one that abbreviates.
Record this in `to_later.md`.

### D27 — Signing in silently claims every anonymous run in this browser

Every row in `sv.runs` with no `accountId` is stamped with the new account's id
on sign-in and appears in `/runs`. No prompt, no confirmation, no notice.

*Deliberate consequence:* on a shared machine, account B inherits account A's
anonymous rows. Acceptable in a prototype; the honest footnote on `/runs`
(§2.5) says the list is browser-local.

### D28 — The wall is a modal, and it is the product's first one

`components/ui/modal.tsx` has existed since P-series and has **no call site in
the product** — it is gallery-only. A22 gives it its first. This reverses the
app's de-facto no-modals-in-the-flow position and sits near
`03-information-architecture.md:244` (*"no exit-intent modal"*) without
violating it: this modal is triggered by the user's own deliberate click on
Approve, not by an exit intent or a timer.

The modal must out-stack `.ob-nav` and `.ob-evidence-overlay`, both at
`z-index: 60`. `.ob-modal` is at 51 today. See §6.2.

### Decided by the repo, not by the owner — recorded so they are not re-asked

| # | Question | Answer | Authority |
|---|---|---|---|
| a | What is the auth identity called? | **`Account`**, never `Session` | `Session` is taken nine ways over (§2.1) |
| b | What is a saved thing called? | **Run** — the existing glossary term | CLAUDE.md makes glossary names binding |
| c | localStorage or cookie? | **localStorage** | A cookie in the root layout opts the whole app out of static prerendering and buys nothing a client-only prototype can use |
| d | Where does new CSS live? | **`styles/obsidian-account.css`** | `obsidian-app.css`'s 16 sections are contractually closed; §16 is its terminator |
| e | New dependencies? | **None** | Standing rule 18 |
| f | New colour tokens? | **None** | C2's token list; nothing below needs one |

---

## 2. Architecture

### 2.1 Naming contract

`Session` is unusable in this codebase. It is already taken by
`SessionOption`, `SessionStep`, `SESSION_SCRIPT`, `sessionStepMs`,
`sessionTotalMs` (`lib/content/landing.ts`), `IdeaSession`
(`components/landing/idea-session.tsx`), `ValidateSession` (pillar 02), nine
`.ob-session-*` classes in `styles/obsidian.css` §11, and two test files.
A `useSession()` in this repo would be genuinely ambiguous.

| Concept | Type / symbol | Storage key | CSS prefix | Never |
|---|---|---|---|---|
| Auth identity | `Account`, `AccountPatch`, `useAccount`, `AccountProvider` | `sv.account` | `.ob-account-*` | `Session`, `useSession`, `sv.session`, `.ob-session-*` |
| A saved run | `RecentRun` (unchanged) | `sv.runs` | `.ob-recovery-*`, `.ob-recent-*` | `SavedRun`, `Workspace`, `Project` |
| Auth surface | `AuthPanel`, `AuthModal` | — | `.ob-auth-*` | `LoginForm`, `SignupForm` |
| Sign-in method | `AuthMethod` = `'google' \| 'github' \| 'email'` | — | — | `Provider` (collides with React context naming) |

Keyframes in the new stylesheet are prefixed **`ob-acct-`**. `obsidian.css` uses
bare `ob-*` and `obsidian-app.css` uses `ob-app-*`; a duplicate `@keyframes`
name is *silently replaced* across every route with no error, and this file
imports last.

Add all of the above to `obsidian_app_build_plan.md`'s naming contract in A20.

### 2.2 Route map

```
BEFORE                          AFTER
──────                          ─────
app/layout.tsx                  app/layout.tsx            ← + AccountProvider
app/page.tsx            /       app/(site)/layout.tsx     ← NEW: the marketing shell
                                app/(site)/page.tsx       /           ← moved
                                app/(site)/pricing/       /pricing    ← NEW (placeholder)
                                app/(site)/runs/          /runs       ← NEW
                                app/(site)/account/       /account    ← NEW
                                app/(auth)/layout.tsx     ← NEW: the standalone shell
                                app/(auth)/sign-in/       /sign-in    ← NEW
                                app/sign-up/page.tsx      /sign-up → redirect  ← NEW
app/r/[slug]/*                  app/r/[slug]/*            ← chrome + gate only
app/style-guide/*               app/style-guide/*         ← + robots, + gallery entries
app/experiment/page.tsx         app/experiment/page.tsx   ← unchanged
app/not-found.tsx               app/not-found.tsx         ← unchanged
app/error.tsx                   app/error.tsx             ← unchanged
```

**Why two route groups.** `app/layout.tsx` renders a bare `<html><body>` with no
nav, no footer and no provider. `app/page.tsx` and `app/experiment/page.tsx`
each hand-roll the marketing shell independently — that is the existing proof
that it gets copied rather than shared. `/pricing`, `/runs` and `/account` all
want that shell; `/sign-in` deliberately does not, because it must not render a
nav carrying a "Sign in" link or a footer that talks about billing.

Both groups are **nested** layouts under the one root layout, not second root
layouts, so the Next 16 full-reload-between-root-layouts caveat does not apply.
The tree has zero route groups today, so this is purely additive.

`/runs` and `/account` carry `robots: { index: false, follow: false }`.
`/pricing` and `/sign-in` are indexable.

### 2.3 State

**The constraint.** `lib/db/queries.ts` is consumed from Server Components.
localStorage is client-only. No server code can see the account, and nothing
should pretend otherwise — `authentication.md:1350` in the bundled Next docs is
explicit that a layout hiding a segment *"does not stop [it] from running or
from appearing in the RSC Payload."* Client-side gating is **decorative**. That
is fine for a prototype and nobody should mistake it for enforcement. Say so in
`lib/account-state.ts`'s module doc.

**The mechanism.**

1. `AccountProvider` (`'use client'`) mounts once in `app/layout.tsx`, wrapping
   `{children}`. Children passed as a prop stay server-rendered — the identical
   mechanism `EvidenceProvider` uses at `app/r/[slug]/layout.tsx:138`. Nothing
   under it joins the client bundle.
2. `useAccount()` returns `Account | null`, and is **`null` on the server and on
   the first client render**, widened in an effect. This is the shape
   `useRunProgress` and `useRecentRuns` already use.
3. **Which effect matters.** `components/validate/validate-view.tsx:31-36`
   records defect R24 verbatim: a `useState(() => …)` initialiser read
   localStorage, evaluated `false` on the server and `true` on the client, and
   *"the server rendered the Report and the client silently regenerated the
   Console."* The prescribed fix is in that file — promote in a
   **`useLayoutEffect`**, *"never a `useEffect` (that runs after paint and the
   report would flash for a frame), never during render."*

   | Surface | Effect | Why |
   |---|---|---|
   | `AccountNav`, `AccountControl` | `useLayoutEffect` | Chrome must not flash |
   | `RecentRunsList` on `/runs` | `useEffect` | Matches `useRecentRuns` today; one paint of empty state is acceptable |
   | `AuthPanel` | neither | It renders the same signed-out markup either way |

4. **Reserved width is mandatory.** Standing rule 12 forbids layout shift.
   `AccountNav` renders a fixed-width slot at the signed-out label's measured
   width while state is `null`, so the nav does not reflow on hydration.
   Measure `getBoundingClientRect().width` before and after in verification.

**Not built:** the zero-flash inline-`<script>`-in-`<head>` escape hatch. It
requires giving `app/layout.tsx` a `<head>` it does not have,
`suppressHydrationWarning` on `<html>`, and carries a documented Strict-Mode dev
trap. The one-frame widen is acceptable here.

**Cross-tab sync is out of scope.** No hook in the repo listens for the
`storage` event. Sign-out in one tab leaves other tabs signed in. Record in
`to_later.md`.

### 2.4 Data seam

`queries.ts`'s contract is `(slug: string) => Promise<T>`. **An account is not a
slug**, so it does not go in that file. A sibling with an explicitly documented
second key:

```ts
// lib/db/account-queries.ts
export async function accountExists(id: string): Promise<boolean>
export async function getAccount(id: string): Promise<Account>
```

Same discipline — `async`, Zod-parsed at the seam, a `requireId` mirroring
`requireSlug`, a boolean predicate mirroring `runExists`. Amend
`lib/db/queries.ts`'s module doc (`:28-40`) to name the sibling and say why the
key differs.

**Pricing copy does not go here.** It is site copy, not run data, and follows
the stated `lib/content/landing.ts` exemption (*"marketing copy will never be
read from Postgres, so faking a seam for it would be misleading"*). It goes in
`lib/content/account.ts`. **Do not create `lib/fixtures/pricing.ts`.**

New schemas in `lib/schemas/account.ts`, snake_case to match `RunSchema`'s
pretend-Postgres rows:

```ts
export const AuthMethodSchema = z.enum(['google', 'github', 'email']);
export const AccountSchema = z.object({
  id: z.string().min(1),            // 'acct_' + 10 hex, mirroring GENERATED_SLUG
  email: z.string().min(3),
  display_name: z.string().min(1),
  auth_method: AuthMethodSchema,
  created_at: z.string(),
});
```

No `plan` field — D23 means there is nothing to put in it. `/account`'s plan row
renders the literal string `Free` from `lib/content/account.ts` and links to
`/pricing`. When pricing becomes real, that is when the field arrives.

`lib/fixtures/accounts.ts` holds **one** demo account, parsed at module scope
exactly like `lib/fixtures/run.ts:16` — a schema change without a matching
fixture change is an import-time crash, not a test failure.

### 2.5 Storage

| Key | Owner | Value | Change |
|---|---|---|---|
| `sv.idea.<slug>` | `app/actions/create-run.ts:3` | raw string | unchanged |
| `sv.runStarted.<slug>` | `app/actions/create-run.ts:36` | `String(Date.now())` | unchanged |
| `sv.brief.<slug>` | `lib/brief-state.ts:33` | `BriefPatch`, `v: 1` | unchanged |
| `sv.runs` | `lib/hooks/use-recent-runs.ts:5` | `RecentRun[]`, cap 10 | **element gains `accountId?: string \| null`** |
| `sv.hint.citation` | `evidence-context.tsx:18` | `'1'` | unchanged |
| **`sv.account`** | `lib/account-state.ts` | `AccountPatch`, `v: 1` | **new** |

`lib/account-state.ts` is modelled on `lib/brief-state.ts` — versioned,
**discard on `v` mismatch, never migrate**, `typeof window` guards on every
accessor, try/catch on every write.

**One deliberate deviation from the house convention:** a failed *sign-in* write
must surface rather than silently no-op. A Sign in button that does nothing in
Safari private mode is a broken demo. Every other write stays silent. Record the
deviation in the module doc.

**`isRecentRun` must be widened, not tightened.** It is a hand-rolled guard
(`:17-26`) checking four string fields. Adding `accountId` as *required* would
discard every existing row on first read, destroying the only run-recovery path
the product has. Treat missing/`null` as anonymous. This is a deliberate
departure from `BriefPatch`'s discard-on-mismatch precedent — record why.

**Sign-out clears `sv.account` only.** `sv.runs` is left intact and filtered by
`accountId` on read. `sv.brief.*`, `sv.idea.*` and `sv.runStarted.*` carry no
notion of who wrote them and are left alone — clearing them would destroy an
anonymous user's work.

**`/runs` when signed out** renders this browser's runs with the honest footnote
rather than redirecting. A redirect driven by client-only auth state flashes.

### 2.6 Styling

**New file: `styles/obsidian-account.css`**, imported from `styles/globals.css`
**between** `obsidian-app.css` and `roadmap-experiment.css`:

```css
@import "./obsidian-account.css" layer(components);
```

The `layer(components)` is not optional. Unlayered, a single
`.ob-auth { margin: 0 }` beats every Tailwind spacing utility on the same
element — this has silently zeroed the app's spacing three times and
`references/pitfalls.md` §1 calls it *"the single most expensive bug in this
system."*

`obsidian-app.css`'s header states its sixteen sections *"never shift and are
never renumbered; each is owned by exactly one phase"*, and §16 (REDUCED MOTION)
is the file's terminator. Appending a §17 after the motion terminator breaks the
completeness diff §16's own comment depends on. The `roadmap-experiment.css`
precedent shows how a fourth stylesheet is added.

Its own sections: **§1 shell · §2 form · §3 auth · §4 account & runs · §5
reduced motion.** §5 is mandatory in the same session (standing rule 16).

**Zero new tokens.** Everything below resolves from `styles/tokens.css` as it
stands. If that turns out false it is a fourth knowing reopening of C2's closed
token list and needs the same written justification A17 and A19 gave.

**Recipes reused, per surface** — almost everything already exists:

| Surface | Existing recipes |
|---|---|
| `/sign-in` | `.ob-standalone`, `-head`, `-head-line`, `-body`, `-copy`, `-actions`, `-foot` (obsidian-app.css:5039-5093) · `.ob-eyebrow.ob-meta` · `.ob-h1` · `.ob-inline-input` (365-379, focus ring included) · `.ob-btn`/`-primary`/`-ghost` · `.ob-approve` + full-width submit + `.ob-approve-note` (2472-2488) — **the only "full-width button with a small centred note under it" recipe in the system, and exactly an auth form's shape** · `.ob-error-panel` (5129-5155) |
| `/runs` | `.ob-container-app` · `.ob-recovery`, `.ob-recovery-row`, `.ob-recovery-foot` (5102-5117) · `.ob-recent-row` (159-169, hover + focus-visible written) · `.ob-chip` via `StageChip` · `.ob-empty` (501) |
| `/account` | `.ob-brief-group`, `-field`, `-label`, `-value` (2264-2325) — the hairline label/value stack **is** the account read view, already built · `.ob-brief-edit`/`-pencil`/`-editor` via `InlineEditableField` · `.ob-metaline` via `MetaLine` · `.ob-modal` for sign-out confirm |
| `/pricing` | `.ob-container` · `.ob-section` · `<hr className="ob-rule" />` · `.ob-eyebrow.ob-meta` · `.ob-h1`/`.ob-lead` · the media-slot recipe for the placeholder |
| Run chrome | `.ob-run-actions` (its `gap-3` stays a Tailwind utility — it is the standing live proof the recipe layer has not eaten the utility layer; **do not move it into CSS**) · `.ob-text-action` |

**New CSS actually required** — a short list:

- **§1** `.ob-auth`, `.ob-pricing`, `.ob-runs`, `.ob-account`, each with
  `position: relative; z-index: 1` and the comment `.ob-roadmap` carries. See
  §6.1 — this is not optional.
- **§2** `.ob-form` (flex column, gap 20) · `.ob-form-row` · `.ob-form-label`
  (`--ob-sm`, `--ob-muted`, sentence case — deliberately *not*
  `.ob-brief-label`, which is mono/uppercase and reads as a data-field key) ·
  `.ob-form-hint` · `.ob-form-error`.
- **§3** `.ob-auth-methods` · `.ob-auth-method` (the OAuth buttons — full width,
  icon + label, ghost) · `.ob-auth-divider` (the "or" hairline with a centred
  label) · `.ob-auth-modal` / `.ob-overlay-top` (§6.2).
- **§4** `.ob-account-nav` (the reserved-width slot) · `.ob-account-menu` ·
  `.ob-account-row`.
- **§5** end states for anything §1–§4 animates. Assert
  `animationName === 'none'`, never just the end state — `obsidian.css` §16's
  universal `*` blanket crushes durations to 0.001ms whether or not a rule
  applied, and has hidden three dead rules.

**Two design questions the system forces and does not answer:**

1. **What does a form error look like in a system with no red?** `--ob-discard`
   is documented as *"never red; it is a non-event, not an error"* and reads as
   *stopped mattering*, not *fix this*. **Answer: reuse `.ob-error-panel`'s
   treatment** — surface + a 2px `--ob-accent` left border, which A14 already
   justified as blue doing its live/active job (*"the one region of a broken
   page that still works"*). It exists, it ships, it needs no new token. Do not
   open C2 for a warning colour.
2. **Is a "signed in" indicator blue?** `.ob-run-actions` already carries
   `.ob-evidence-btn`'s 6px accent square, and the header carries the active
   stage rule. A third accent mark in a 1360px header is one too many.
   **Answer: chalk, not blue.** "Signed in" is not one of blue's three jobs in
   any reading that survives the standing rule.

**Brand marks.** `lucide-react@0.400` ships `Github` but has **no Google mark**
(only `Chrome`). Mixing a lucide stroke icon with a hand-drawn fill icon will
read as a mistake. **Build `components/ui/brand-mark.tsx` with both as
hand-authored monochrome `currentColor` paths** at the system's 16px icon scale.

> Note for the record: Google's brand guidelines want the four-colour G. A
> monochrome treatment is standard practice in dark UIs and is forced here by
> the tokens-only-colour rule. It is a deliberate, known deviation and would
> need revisiting before anything ships publicly with real Google auth.

---

## 3. The four flows, end to end

### 3.1 Anonymous — unchanged until Approve

1. Types an idea into `.ob-composer` on `/`, submits (button or ⌘↵).
2. `cofounder-chat.tsx` `submit()` → `createRun(trimmed)` → mints a 10-hex slug,
   writes `sv.idea.<slug>`, `upsertRecentRun({ stage: 'define' })` →
   `router.push('/r/<slug>/define')`. **No change to this path at all.**
3. Talks to the cofounder. Edits the brief inline. Fills every field.
4. Clicks **Approve** → `handleApprove()` at
   `components/define/define-conversation.tsx:324`.
5. **Signed out → the auth modal opens.** `markRunStarted(slug)` does **not**
   run. The brief stays on screen; nothing is lost.
6. Signs in → the modal closes → the approve **resumes automatically**. The user
   does not click Approve twice.
7. `markRunStarted(slug)` → `upsertRecentRun({ stage: 'validating' })` → the
   45s console.

**Critical ordering:** the gate sits *before* `markRunStarted`. After that write,
`RUN_STREAM_WINDOW_MS` (~49s) replays the research console on every reload for a
user who never signed in.

### 3.2 Signed in

Identical, minus step 5–6. Plus: `createRun` stamps `accountId`, `/runs` lists
it, and `DEFINE.handoff.lead` reads *"Saved to your account"* instead of
*"Bookmark it — there's no login to get back."*

### 3.3 Stranger on a shared link

Opens `/r/<slug>/validate`. Sees the whole report, every source, the roadmap.
The run header shows a bare **Sign in** text action. Nothing is hidden, blurred,
truncated or prompted. To make their *own* run they go to `/` and start one —
and they get all the way through Define before the wall.

### 3.4 Signing in — the claim

`signIn(method, email?)` writes `sv.account`, then calls
`claimAnonymousRuns(accountId)`, which stamps `accountId` onto every `sv.runs`
row that has none. Silent, per D27. `/runs` then filters on `accountId`.

---

## 4. Phases

Six phases, sized to D20's *"many small phases, one page per session."* Each
closes with C14's gate — `npx tsc --noEmit` · `npm run lint` · `npm test` ·
`npm run build` · zero console errors at **1440 and 1280**.

### A20 — Foundation *(no new visible pages)*

The enabling phase. If it is done right, A21–A25 are mostly assembly.

| Do | File |
|---|---|
| Create the marketing shell as a group layout | `app/(site)/layout.tsx` — `SkipLink` + `.ob-backdrop` + `.ob-layer` + `SiteNav` + `<main id="main">` + `SiteFooter`, lifted verbatim out of `app/page.tsx` |
| Move the landing in | `app/page.tsx` → `app/(site)/page.tsx`, stripped to its fragment. Keep the docblock; amend the reading-order paragraph to note the shell moved up |
| Create the standalone shell | `app/(auth)/layout.tsx` — the `.ob-standalone` assembly from `app/not-found.tsx:41-77` |
| New stylesheet + layered import | `styles/obsidian-account.css`, `styles/globals.css` |
| Schemas | `lib/schemas/account.ts` |
| Fixture | `lib/fixtures/accounts.ts` — one account, parsed at module scope |
| Seam | `lib/db/account-queries.ts`; amend `lib/db/queries.ts:28-40`'s doc |
| Client state | `lib/account-state.ts` — `sv.account`, `v: 1`, `readAccount`/`writeAccount`/`clearAccount`/`signIn`/`signOut` |
| Context | `components/account/account-provider.tsx` + `useAccount()`; mount in `app/layout.tsx` |
| Copy | `lib/content/account.ts` — all strings for `/sign-in`, `/runs`, `/account`, `/pricing`, and the new chrome labels |
| Tests | `tests/unit/account-state.test.ts` (copy `brief-state.test.ts:115-137`'s `vi.stubGlobal` + **dynamic** `await import` pattern exactly — a static import captures the unstubbed global), `tests/unit/account-queries.test.ts`, additions to `tests/unit/schemas.test.ts` |

**Also in this phase, and separable if you want to cut it:** fix the live
`AppBackdrop` z-index defect on `.ob-report`, `.ob-define`, `.ob-sources` and
`.ob-explorer` — two lines each. See §6.1. It is not caused by this work, but
every new container inherits it and you will be in the right stylesheet.

**Verify:** `/` renders byte-identically at 1440 and 1280 after the move. The
cascade check (`references/verification.md` §3a) on an element carrying both an
`.ob-*` recipe class and a Tailwind spacing utility — `mt-8` must compute
`32px`, not `0px`.

### A21 — The auth surface

| Do | File |
|---|---|
| Single-line input primitive | `components/ui/text-input.tsx` — **there is none today.** `TextArea` is the only text-entry primitive; the only `<input>`s in the tree are raw `.ob-inline-input` inside `InlineEditableField`/`InlineEditableList`, the latter with no label association at all. Wrap `.ob-inline-input`; do not author a new recipe |
| Label/error/hint plumbing | `components/ui/form-field.tsx` — owns `htmlFor`, `aria-describedby`, `aria-invalid`. **There is no `<form>` element anywhere in `components/` today** |
| Brand marks | `components/ui/brand-mark.tsx` — Google + GitHub, monochrome, `currentColor` |
| Let the button submit | `components/ui/button.tsx` — it hardcodes `type="button"` at line 30, so it **cannot submit a form**. Add `type?: 'button' \| 'submit'`. Cheap, correct, and the alternative (hand-rolled `onKeyDown`) loses native Enter-submit, autofill and password-manager integration |
| The panel, hosted twice | `components/account/auth-panel.tsx` — Google · GitHub · hairline "or" · email + submit. Used by both the page and the modal. `useActionState` (React 19.2) against a plain client async fn gives pending/error state with **no form library** — `14-tech-stack.md:126-134` bans all of them by name |
| The route | `app/(auth)/sign-in/page.tsx` — Server Component wrapping `<AuthPanel />`. `searchParams: Promise<{ next?: string }>` — **the first route in the tree to read a redirect param.** Validate `next` against `^\/(?!\/)` before handing it to `router.replace`; an unvalidated `next` is an open redirect even in a prototype |
| The alias | `app/sign-up/page.tsx` → `redirect('/sign-in')` |

**Verify:** tab the whole form with **real key presses at 80ms intervals** —
`el.focus()` does not trigger `:focus-visible` and will report no rings where
there are. Measure focus rings *after* 500ms; a partially-interpolated
`0px 0px 0px 0.258px` means you sampled early. One-primary audit. Type-scale
audit at both widths.

### A22 — The wall *(touches `/r/[slug]/*` — log it in the main build plan)*

| Do | File |
|---|---|
| Elevate the modal | `components/ui/modal.tsx` gains an elevation variant; `.ob-auth-modal` / `.ob-overlay-top` in the new stylesheet at 62 / 61 (§6.2). Update the docstring — it currently claims *"Used exactly twice in the product"* and it is used zero times |
| The modal host | `components/account/auth-modal.tsx` — `Modal` + `AuthPanel` + an `onSignedIn` callback |
| The gate | `components/define/define-conversation.tsx:324` `handleApprove()` — if `useAccount()` is null, open the modal and **return before `markRunStarted`**. On success, resume the same approve path |

**Verify:** signed out, approve → modal → sign in → the run starts, once.
Reload mid-modal: no console replay, no `sv.runStarted` written. Escape closes
the modal and the brief is untouched. The modal paints above the run header and
above an open evidence overlay.

### A23 — `/runs` and honest history *(touches `/r/[slug]/*`)*

| Do | File |
|---|---|
| Ownership on rows | `lib/hooks/use-recent-runs.ts` — `RecentRun` gains `accountId?: string \| null`; widen `isRecentRun`; `upsertRecentRun` stamps from `readAccount()?.id ?? null`; add `removeRecentRun(slug)` and `claimAnonymousRuns(accountId)` |
| Fix the lying stage chips | `RecentRunStage` has four values and only two are ever written — every finished run shows `validating` forever. Add the `'report'` write at run-stream completion and the `'roadmap'` write on the roadmap page. **A runs list that lies about stage is worse than no runs list** |
| The list becomes a destination | `components/ui/recent-runs-list.tsx` — props `{ variant?: 'recovery' \| 'destination'; head?; footnote?; empty?; accountId? }`. `variant="destination"` renders `empty` instead of `null`. **Keep the divided-hairline treatment** |
| Reverse two rulings, out loud | `recent-runs-list.tsx:14-24` **and** `styles/obsidian-app.css:5097-5101` both state *"a utility, not a card grid — card treatment would imply a runs dashboard the product does not have."* `/runs` makes that dashboard real. **Rewrite both comments in the same commit** — do not silently contradict them |
| The page | `app/(site)/runs/page.tsx` |
| Stop the header lying | `components/layout/run-identity.tsx` — prefer `readStoredIdeaText(slug)` over the fixture's `run.idea_text`. `RecentRun.oneLiner` already holds the user's real typed text, so `/runs` shows five different ideas that all open a header saying *"SMS rebooking for dental clinics"*. One line, and it is the difference between a convincing prototype and an obvious one. Costs a client leaf — budget it |

**Verify:** create three runs with different idea text, confirm three distinct
rows and three distinct headers. Sign out, sign in, confirm the claim.

### A24 — `/account` and the `/pricing` placeholder

| Do | File |
|---|---|
| Account page | `app/(site)/account/page.tsx` + `components/account/account-panel.tsx` — name (editable via `InlineEditableField` verbatim), email, "Signed in via GitHub", hairline, **Plan — Free / See plans →**, hairline, Your runs →, Sign out |
| Sign out | `components/account/sign-out-button.tsx` — confirms via `Modal`. There is no destructive-action language in this system (no red), so a ghost button in a modal is the whole answer |
| Pricing | `app/(site)/pricing/page.tsx` — eyebrow, headline, lead, and a **labelled placeholder with its brief**, in the house media-slot treatment. Metadata `title: 'Pricing'`, indexable, `openGraph.images: ['/og/pricing.png']` |

### A25 — Nav, chrome, copy, docs, sweep

| Do | File |
|---|---|
| Nav | `components/landing/site-nav.tsx` — add a `Pricing` link and `<AccountNav />`. The right cluster at line 49 goes from two children to three, and `.ob-nav-inner` condenses to `max-width: 940px` on scroll — **measure the crowded state scrolled at 1280, not at top-of-page.** Neither new item may be `.ob-btn-primary`: `:53-58` already records A15 demoting this cluster because two filled blue buttons were in view at once |
| Run chrome | `components/layout/run-header.tsx` gains an `account?: ReactNode` prop rendered inside `.ob-run-actions` after `{copyLink}`; `run-shell.tsx` threads it; `app/r/[slug]/layout.tsx` passes `<AccountControl />`. A bare text action — *Sign in* or *Your runs* — never an avatar (no dropdown package, no avatar recipe, and the system's shape vocabulary is squares: `.ob-stage-node` is documented as *"a 7px square, never a circle or a pill"*) |
| Footer | `components/landing/site-footer.tsx` — **line 41 hardcodes `No accounts · No billing · No tracking`, the one copy string in the repo outside the content files.** Move it into `lib/content/landing.ts` while rewriting it. The grid is `grid-cols-[minmax(0,1fr)_auto_auto]` — exactly three tracks; adding links to an existing column is free, a fourth column is a JSX change and `gap-20` × 3 will be tight at 1280 |
| The eight strings | §5.1 |
| OG | Remove `NO LOGIN` from `app/style-guide/og/page.tsx:139`, re-screenshot `public/og/default.png`. Add a sixth card, screenshot `public/og/pricing.png`. These are **code-drawn and screenshotted**, which stays the endorsed path — the media plans' `[SHIPPED — A15]` tag means *do not generate*, not *do not redraw* |
| Free fixes | `HERO.secondary.href = '/r/demo'` **404s today** and renders twice (hero + nav); repoint to `/r/sms-rebooking-4f2a/validate`. Add `robots` to `/style-guide`, which is indexable by omission |
| Docs | §7 |
| Sweep | §8 |

---

## 5. What breaks

### 5.1 Eight strings that become false

Per the owner's decision: **re-scope, keep the voice.** Every one survives with
its personality intact.

| # | Location | Now | Becomes |
|---|---|---|---|
| 1 | `app/layout.tsx:53` | "…No score. No verdict. **No login.**" | "…No score. No verdict. **No paywall.**" |
| 2 | `site-footer.tsx:41` *(hardcoded)* | "No accounts · No billing · No tracking" | "**No paywall** · No billing · No tracking" — **and move the string into `lib/content/landing.ts`** |
| 3 | `lib/content/landing.ts:731` `FOOTER.note` | "A run is a URL. There are no accounts, no billing, and nothing to cancel." | "A run is a URL — share it with anyone. The account is free and there's nothing to cancel." |
| 4 | `lib/content/landing.ts:255` `CHAT_SECTION.footnote` | "**No signup.** Your run lives at its own URL…" | "**Start without an account.** Your run lives at its own URL — share it with anyone, signed in or not." |
| 5 | `lib/content/app.ts:186` `DEFINE.handoff.lead` | "Bookmark it — there's no login to get back." | "Saved to your account — it'll be here when you come back." |
| 6 | `lib/content/app.ts:606` `notFoundRun.body[1]` | "Runs aren't stored against an account, so we can't look one up for you." | Needs signed-in and signed-out variants |
| 7 | `lib/content/app.ts` `notFoundRun.footnote` | "Remembered by this browser only." | **Still true — keep it, and show it on `/runs` too** |
| 8 | `public/og/default.png` | baked `NO LOGIN` | `NO PAYWALL`; re-screenshot from `/style-guide/og` |

> **#4 needs the most care.** "No signup" is the one string that becomes
> *actively* false under D22 — a user reading it under the composer will meet a
> wall four minutes later. The rewrite above is precise about what is free
> (starting, and viewing anyone's run) and silent about what is not, which is
> honest. Do not leave it as-is.

Also: `FOOTER.columns[1]` is headed **"What it is not"** and ends with
**"Not a gate"**, anchored at `#verification` — which will sit a few links from
a Pricing entry. Under D23 nothing gates, so the claim survives; check it reads
that way in context.

### 5.2 Recent Runs — reversed rulings and live defects

- Two explicit design rulings reversed (A23 above).
- `09-pages-supporting.md:208-213` lists six things it *"deliberately isn't"* —
  not synced, not searchable, not filterable, not sortable, no delete UI, no
  count badge, *"Not shown inside the Run Shell — it would imply a workspace."*
  A23 changes the last one by adding a link from the run header, and adds a
  delete affordance. Mark superseded.
- `RecentRunStage` (`define|validating|report|roadmap`) and `RunStatus`
  (`define|validating|complete`) are different unions overlapping on two
  members, with nothing converting between them. Leave it; note it.
- `MAX_RUNS = 10` with **silent eviction of the oldest**. Under D23 there is no
  quota, so this is now the only thing that deletes a user's work, silently. On
  a destination page that is visible. Raise the cap or say so on `/runs`.
- `sv.runs` is the only persisted shape in the app without a Zod schema.

### 5.3 The single fixture run

`lib/db/queries.ts:67-70` accepts **any** 10-lowercase-hex slug purely on shape,
and every getter ignores its slug. Ten saved runs are ten URLs rendering one
identical dental-clinic report.

That is fine for a clickable prototype and must be a **conscious framing
choice**. A23's `RunIdentity` fix makes the header honest, which is most of the
visible lie. Do not "fix" the rest by adding fixture runs — `getRun` would then
have to actually select on slug, which reopens the entire seam.

### 5.4 What does *not* break, and must stay that way

- `runExists` — unchanged. No owner check, no 403. It keeps conflating *no such
  run* into one 404, which is correct under D25.
- `getStageStates` — **entitlement must never become an input.** `run-stage.ts`
  `:41-51` states *"progress only ever adds reachability, never removes it"*,
  and `tests/unit/run-stage.test.ts:55-69` is a property test over every status ×
  segment × progress asserting exactly that. Under D23 nothing locks, so this
  is free — but add an explicit assertion that the account is *not* an input,
  or the property test keeps passing while a second unlock source goes
  untested. That is the identical coverage hole `queries.test.ts:50-57`
  documents from A14.
- `resolveRunRedirect` — unchanged.
- `RunSchema` — gains no `owner`. It would mean touching the schema, the
  module-scope-parsed fixture, `schemas.test.ts` and every `queries.ts` read to
  express something the prototype cannot enforce and does not display.

---

## 6. Traps

### 6.1 The `AppBackdrop` z-index defect is **live**, and every new page inherits it

`.ob-backdrop` is `position: fixed; inset: 0; z-index: 0` and renders as a
**sibling** of the page container inside `<main>`. A positioned element paints
after static in-flow text. **The backdrop paints above the body copy.** Only
`.ob-roadmap` lifts itself clear (`position: relative; z-index: 1`,
obsidian-app.css:3522-3540).

It was invisible while the media assets were missing. **They are now on disk**,
so `/validate`, `/sources`, `/not-found` and `/error` currently render text
under a scrimmed fixed image.

**Every new container class carries `position: relative; z-index: 1` in its
first commit**, with the same comment `.ob-roadmap` carries. `z-index: -1` on
the backdrop is **not** the fix — `globals.css:61-62` records it must stay above
the body background.

### 6.2 The modal renders under two things at `z-index: 60`

Verified stack today:

```
70  .ob-skip
60  .ob-nav (landing) · .ob-evidence-overlay
52  .ob-popover · .ob-tooltip
51  .ob-drawer · .ob-modal          ← the auth modal would land here
50  .ob-overlay (the scrim) · run header
```

On `/r/[slug]/define` the run header is 50, so a modal at 51 over a scrim at 50
technically works (the portal is later in the DOM, so equal z-index resolves in
its favour). **But an open evidence overlay at 60 would cover it**, and any
future trigger from the landing nav would too.

Do not bump `.ob-modal` globally — that silently changes its relationship to
`.ob-drawer`. Add a variant: `.ob-auth-modal` at **62** over `.ob-overlay-top`
at **61**, clearing both 60s and staying under the skip link at 70.

### 6.3 The layer-import trap

Covered in §2.6. The verification is `references/verification.md` §3a. The live
canonical probe is `.ob-run-actions`' `gap-3` — load-bearing on purpose as the
standing proof the recipe layer has not eaten the utility layer. **Do not move
it into CSS while adding the account control next to it.**

### 6.4 The transform / stacking-context trap

A `transform` creates a stacking context and silently voids a descendant's
`z-index` against anything outside it. A17 lost an hour to `.ob-rm-mark`'s
`translateX(-50%)` — the fix had to go on the *transformed* element. `Modal`
animates with `x: '-50%', y: '-50%'`, so **anything inside it that needs to
out-stack something outside it cannot**, at any z-index.

Related, while verifying: `elementFromPoint` is **not** a paint-order test on
anything with `pointer-events: none` — it skips it and reports what is behind.

### 6.5 Hydration — the repo has already paid for this once

R24, closed, recorded verbatim in `components/validate/validate-view.tsx:31-36`.
The prescribed pattern is in §2.3. A signed-in header reproduces it exactly.

### 6.6 `SEGMENTS` is hardcoded in two files

`run-header.tsx:12` and `run-main.tsx:7` both hold
`new Set(['define','validate','roadmap','sources'])` with a **silent fallback to
`'validate'`**. Nothing here adds a run segment, so this should not bite — but
if that changes, both files must change together and neither will error.

Related: `RunFooterBar` **must stay the element immediately after `<main>`** —
§5 hides it on Define via `main[data-chrome='surface'] ~ .ob-run-footer`.
Inserting anything between them silently un-hides the footer on Define and
reintroduces the scrollbar D9 removed.

### 6.7 Storage pollution — there is precedent

`only_frontend_build_plan.md:868-871` records a style-guide demo calling the
**real** `upsertRecentRun` with `new Date(0)`, persisting an epoch timestamp
into live `sv.runs` so `/` rendered *"57 years ago."* **The style-guide's new
auth entries must never call `writeAccount` or `signIn`.** Pass fixture props.

### 6.8 `design_inspiration/WaitList_Hero/` is a trap, not a template

It is the only email-capture form in the repo and it is shadcn, five hardcoded
hexes, and a confetti burst. It violates the tokens rule, standing rule 18, and
`12-states.md:123-138` (*"No confetti… instruments don't congratulate you"*).
Someone will find it while building `/sign-in`. Don't.

### 6.9 Other live items worth knowing

- **No DOM test environment.** `vitest.config.ts` is `environment: 'node'`,
  `include: ['tests/unit/**/*.test.ts']`; jsdom is not installed and
  `@testing-library/react` is installed and inert. **Keep every decision in
  pure modules** (`lib/account-state.ts`) with node tests; verify rendered
  surfaces through Playwright. That is what all 19 existing test files do.
- **There is no toast system.** `copy-button.tsx:27` calls itself *"the
  product's only success-feedback mechanism."* "Signed in" has no confirmation
  channel except a label swap or an `aria-live="polite"` paragraph. Design for
  that, don't invent a toast.
- **`NEXT_PUBLIC_SITE_URL` is unset** and no `.env` is committed, so
  `metadataBase` falls back to `localhost:3000` and every shared link previews
  with a broken OG image in production. The new `/pricing` card inherits it.
- **`/` already overflows horizontally by ~56px at 1280** (bisected to the
  Pillars glass scene, deliberately left alone), so
  `scrollWidth === clientWidth` cannot be used as a pass condition on that page.

---

## 7. Governing documents

### 7.1 `executive_summary.md` — **the owner must choose the form**

Two binding documents will disagree until this is resolved. Options:

- **(a)** A v5 addendum section recording that the prototype now explores the
  post-v1 account shape while v1's definition stands unamended. *Recommended* —
  the document is a dated product definition and rewriting history in it loses
  the record of what was decided when.
- **(b)** Amend `:72-73` and `:470-471` in place.
- **(c)** Leave it and record the divergence only in this plan. *Not
  recommended* — it is the failure this section exists to prevent.

### 7.2 `obsidian_app_build_plan.md`

- Progress-table rows for A20–A25.
- **D21–D28** appended as new locked decisions (§1). Not amendments to D1–D20.
- New names into the naming contract (§2.1).
- Rows in **C17**'s heading-outline table for `/sign-in`, `/runs`, `/account`,
  `/pricing` — *"If a phase adds a section, it updates this table in the same
  commit."*
- Build-log entries for A22 and A23, which touch `/r/[slug]/*`.

### 7.3 Supersession notes

| File | What is now false |
|---|---|
| `09-pages-supporting.md` §9.5 | "Profile / account \| No auth." · "Pricing \| Nothing to sell in v1." · "Dashboard of all runs \| Would require auth" |
| `09-pages-supporting.md` §9.4 | Five of the six "what Recent Runs deliberately isn't" bullets |
| `14-tech-stack.md` §14.2 | "Auth UI — none" · "Forms — none" |
| `10-component-system.md` | "\| Avatar \| No users. \|" (still true — no avatar is built) · `:57-59` "The product has no forms" |
| `03-information-architecture.md` | `:244` "no 'sign up to save'" · `:256` "No signup wall" — **both survive under D25 for viewing; neither survives for running research.** Annotate precisely |
| `16-scope-and-priorities.md` §16.2, `README.md` `:61`, `:64`, `:122-125` | The account/pricing exclusions |

### 7.4 `to_later.md`

- Close §1.1 (`RecentRunsList` missing from `/`) — `/runs` answers it.
- Close §1.2 (`modal.tsx` has no call site) — A22 gives it one.
- Open: the magic-link inbox screen (D26), cross-tab sync (§2.3), the pricing
  register split (D24), `NEXT_PUBLIC_SITE_URL`.

---

## 8. Verification

The mandated loop is `references/verification.md`. The audits these surfaces
will fail first:

- **§6b — exactly one `.ob-btn-primary` visible in the viewport.** Run at 1440
  and 1280, scrolled and unscrolled, on `/`, `/pricing`, `/sign-in`, `/runs`,
  `/account`, and on Define with the modal open. Existing primaries: the hero,
  the composer, `ApproveButton`, `UnansweredSection`.
- **§3a — the cascade check.** An element with both an `.ob-*` recipe class and
  a Tailwind spacing utility; the utility must win. `0px` means the new
  stylesheet is unlayered.
- **§4a — tab with real key presses** at 80ms. The auth panel adds a burst of
  focusables. `el.focus()` does not trigger `:focus-visible`.
- **§4b — probe hover mechanically** with `hover({ force: true })` + 500ms,
  scoped past `.ob-nav-cta`, which is deliberately `opacity: 0;
  pointer-events: none` until `data-past-hero="true"` and will otherwise time
  out as *a passing test wearing a failure costume*.
- **A19 type audit** — resolve the 16 tokens through a hidden probe span (three
  are `clamp()`s) and walk `body *` for off-scale `fontSize`. **Scroll to the
  bottom and wait first**, or un-revealed sections report what they inherit.
  Both widths.
- **Reduced motion** — assert `animationName === 'none'`, not just the end
  state.
- **Isolation** — `/` and all four run pages, before and after the route-group
  move.
- **C14** closes every phase.

---

## 9. Deliberately not built

Recorded so it is not re-litigated, and so a future session does not read the
architecture map and start building things the owner cut.

| Not built | Why |
|---|---|
| `lib/schemas/account.ts`, `lib/fixtures/accounts.ts`, `lib/db/account-queries.ts` | **Deferred in A20 — see §10.** Zero server consumers exist, so it would be a faked seam with one fixture and no callers |
| Pricing tiers, prices, feature matrix, billing toggle | D24 — placeholder only |
| Quota, usage meter, `Entitlement`, `lib/entitlement.ts`, `checkRunGate` | D23 — nothing gates |
| Billing history, invoices, payment method, checkout | Owner cut |
| Passwords, reset flow, "check your inbox" screen | D26 |
| A separate `/sign-up` screen | D26 — one door |
| Avatar, dropdown menu | No `@radix-ui/react-dropdown-menu`, no avatar recipe, and the system's shapes are squares |
| Owner field on `RunSchema`, 403 / `unauthorized()` | D25 — nothing to enforce |
| Cookie session, `proxy.ts`, server-side auth | §2.3 — costs static prerendering, buys nothing |
| Intercepting-route auth modal (`app/@auth/(.)sign-in`) | Needs four boilerplate files and a permanent root-layout change for a URL we already have |
| Second demo persona / persona switcher | One account; revisit if pricing states need demoing |
| Cross-tab sync | §2.3 |
| Teams, sharing permissions, revoke, private runs | D25 |

---

## 10. Build log

### A20 — Foundation · DONE

**Shipped**

- `app/(site)/layout.tsx` — the marketing shell (skip link, backdrop, `.ob-layer`,
  `SiteNav`, `<main id="main">`, `SiteFooter`), lifted out of the landing.
- `app/page.tsx` → `app/(site)/page.tsx` via `git mv`, stripped to its content
  fragment. `(site)` is URL-invisible, so `/` is still `/`.
- `app/(auth)/layout.tsx` — the `.ob-standalone` shell for A21's `/sign-in`.
- `styles/obsidian-account.css` + its `layer(components)` import, placed between
  `obsidian-app.css` and `roadmap-experiment.css`. §1 filled; §2–§5 carry their
  banners and their owning phase.
- `lib/account-state.ts` — the seam. `sv.account`, `v: 1`, discard-don't-migrate.
- `lib/content/account.ts` — `DEMO_IDENTITY` + `ACCOUNT_CHROME`.
- `components/account/account-provider.tsx` — `AccountProvider`, `useAccount`,
  `useAccountPatch`; mounted in `app/layout.tsx`.
- `tests/unit/account-state.test.ts` — 17 tests.

**Gate.** `npx tsc --noEmit` clean (after `rm -rf .next` — see below) ·
`npm run build` clean · `npm test` 230/230 · new files lint clean.
**`/` is still `○ (Static)` in the build output** — the root client provider did
not cost prerendering, which was the main risk of mounting it there.

**Deviations from the plan above, and why**

1. **No `lib/schemas/account.ts`, no `lib/fixtures/accounts.ts`, no
   `lib/db/account-queries.ts`.** The plan specified all three. Building them
   revealed there is **no server consumer for an account anywhere in this
   design**: the identity lives in `localStorage`, `lib/db/queries.ts` is
   consumed from Server Components, and `/runs` and `/account` both read the
   client. A `(id: string) => Promise<Account>` beside the run seam would have
   had one fixture, zero callers, and would have faked a seam for a read that
   never happens — the mistake `only_frontend_build_plan.md` records for
   marketing copy. `lib/account-state.ts` is the honest seam instead, in exactly
   the sense `lib/brief-state.ts` is one, and its module doc carries the
   argument. When a server consumer arrives, the file arrives with it.

2. **`DEMO_IDENTITY` lives in `lib/content/account.ts`, not in a fixture.** In a
   real product an OAuth address arrives inside the provider's token; it is
   never read from our database. Fronting it with a db seam would misdescribe
   where it comes from.

3. **`AccountState` is a three-state union, not `Account | null`.** `null` would
   conflate "not looked yet" with "signed out", and A25's nav renders those
   differently — a reserved-width empty slot versus a Sign in link. Collapsing
   them is precisely how a nav reflows on hydration (standing rule 12).

4. **The existing-surface `AppBackdrop` fix is deferred out of A20**, and the
   plan's "two lines per class" estimate was wrong. `.ob-report` **is not a
   container class** — it does not exist. The Report renders a bare `<>`
   fragment of `.ob-report-section` elements that are direct children of
   `<main>`, siblings of `.ob-backdrop`, so there is nothing to put the guard
   on. A correct fix needs its own investigation and browser measurement rather
   than a guess riding along in a foundation phase. The four **new** containers
   are born with the guard, so nothing added here inherits the defect.
   **Still live on `/validate`, `/sources`, `/not-found`, `/error`.**

**Two environment findings that block the C14 gate as written**

- **`npm run lint` is red repo-wide on this checkout — 187 errors, 185 of them
  pre-existing and none of them code.** Every failure is
  `format: Formatter would have printed…` against CRLF line endings (`␍`),
  i.e. git checked the tree out with `core.autocrlf` while Biome is configured
  for LF. Untouched files like `components/define/consequence-line.tsx` fail
  identically. **Do not "fix" this by reformatting 185 files** — that is a
  spurious repo-wide diff. It wants a `.gitattributes` / `core.autocrlf`
  decision, which is the owner's call. A20's own files were checked
  individually and are clean.
- **`npx tsc --noEmit` fails against a stale `.next`** after any route move:
  `.next/types/validator.ts` still referenced `../../app/page.js`. `rm -rf .next`
  clears it. Worth knowing before diagnosing a phantom type error in A21–A25.

**Verified without a browser** (a stale Playwright profile held the MCP session —
9 live Chrome processes on `mcp-chrome-3c569ef`, locked since 10:58):

- `/` serves the shell in the correct order: `.ob-skip` → `.ob-backdrop` →
  `.ob-backdrop-plate` → `.ob-layer` → `.ob-nav` → `<main id="main">` →
  `.ob-footer`, with hero, marquee, composer, pillars and verified-strip all
  present. 72,339 bytes.
- `.ob-auth` compiles **inside `@layer components`**, in the same block as
  `.ob-roadmap` and `.ob-eyebrow`; the emitted layer order is
  `properties → theme → base → components → utilities`, so a call-site utility
  still outranks a recipe.

**Still owed for A20, and carried into A21's verification pass:**
the measured §3a cascade check (an element carrying both an `.ob-*` recipe class
and a Tailwind spacing utility — `mt-8` must compute `32px`, not `0px`) and the
visual isolation check on `/` at 1440 and 1280. Both need the browser.
