# 11 — Interaction Patterns

Cross-cutting behaviour. Where a page file and this file disagree, this file
is the general rule and the page file is the local exception.

---

## 11.1 Progressive disclosure — the product's core pattern

Three consistent depths everywhere:

```text
GLANCE            →  READ              →  VERIFY
summary               detail               source

"What we found"   →  dimension prose   →  finding excerpt  →  the page
question + ask    →  full script       →  the community link
competitor name   →  moat/take/ignore  →  the source
brief one-liner   →  all fields        →  the conversation turn
```

**Rule: never more than one expansion between the user and the underlying
evidence.** If verifying a claim takes three clicks, the trust proposition
fails — nobody does three clicks.

Disclosure mechanisms, and when each is right:

| Mechanism | Use when | Do not use when |
|---|---|---|
| **Accordion** | Detail belongs in reading flow and the user may want several open at once | The content is short enough to just show |
| **Drawer** | Detail is a reference lookup that shouldn't lose reading position | It's the main content |
| **Popover** | A 1–2 second peek is enough (citation excerpts) | The content needs interaction |
| **Modal** | A destructive action needs confirmation | Anything else |

Accordions in this product **never auto-collapse siblings**. A user comparing
two dimensions or two questions must be able to open both.

---

## 11.2 Feedback patterns

### The product has no toast system

Every success is confirmed **in place, on the element that caused it.**

| Action | Confirmation |
|---|---|
| Copy link | Button label → `✓ Copied`, 2s, then reverts |
| Copy script | Same |
| Brief field edit | Value updates; no confirmation (the new value *is* the confirmation) |
| Approve brief | Button → `Starting research…`, then navigation |
| Send message | Turn appears immediately (optimistic) |

**Why no toasts:** a toast is a notification about something that happened
elsewhere. In this product, everything happens where the user is looking. A
toast system would be infrastructure for feedback that doesn't exist.

### Errors are inline and adjacent

Every error appears next to the thing that failed, preserves user input, and
offers exactly one retry.

```text
┌────────────────────────────────────────────┐
│  the user's content, still editable        │
└────────────────────────────────────────────┘
 ▎ Couldn't send that. Your text is safe.
 ▎                                [ Retry ]
   ↑ 2px --accent left border, --text-primary copy
```

No red. No modal. No error code in the user's face (error IDs live in
`MetaLine` on the global boundary only). Never lose what the user typed.

### Optimistic updates

Applied to: message send, brief field edit, accordion state, filter pills.
Not applied to: brief approval (starts real spend), re-running research.

On failure, revert the optimistic state **and** show the inline error with the
user's input restored to the input.

---

## 11.3 Streaming and real-time

Two streams with different characters.

### Conversation streaming (Define)

- Token-by-token text append. **No per-token animation** — animating each token
  makes text feel slower than it is.
- Auto-scroll only when the user is already within ~120px of the bottom.
  Otherwise suspend and show `↓ New message`.
- The composer stays interactive throughout; keystrokes are buffered and sent
  when the turn ends. **Never drop input.**
- A turn that fails mid-stream keeps its partial text, marked `— interrupted`,
  with a `Continue` action. Never delete text the user has already read.

### Run streaming (Validate)

- SSE with named events: `phase`, `query.start`, `query.done`,
  `finding.verified`, `finding.discarded`, `complete`, `error`.
- New findings **prepend** with entrance animation; the `VerifiedBadge` fades
  in 180ms after its card so verification reads as an event.
- Counters (`MetaLine`, `CoverageBar`) update without animation — a number that
  animates on every increment becomes noise at 47 increments.
- **Reconnection:** exponential backoff, 3 attempts, then poll `/status` every
  5s. On reconnect, **refetch state rather than replay** — findings that landed
  while disconnected appear at once, without animation. Animating a backlog
  looks broken.
- Tab hidden → the browser may throttle; on `visibilitychange` back to visible,
  refetch immediately rather than trusting the stream.

---

## 11.4 Navigation and orientation

- **Stage transitions are real navigations** (`<a>` / `<Link>`), so Back works.
  The one exception is Run Console → Report, which is an in-place cross-fade
  because the URL doesn't change.
- **Scroll position resets to top** on stage change, **preserves** on Back.
- **Scroll-jump links** (`SegmentedControl`, `SectionIndex`, `DependencyChip`)
  use `scrollIntoView({ behavior: 'smooth', block: 'start' })` with
  `scroll-margin-top` set to clear the sticky header. Disabled under
  `prefers-reduced-motion` (jumps instantly instead).
- **Cross-link targets pulse once** on arrival: a 600ms amber ring fade. This
  is essential — smooth-scrolling to a target the user then has to find on the
  screen is only half a link.
- **Sticky elements** clear the 72px `RunShell` header: `top: 96px`.

---

## 11.5 The copy-to-clipboard pattern

Used more than any other action in the product, and it deserves specification.

```ts
// Behaviour contract for every CopyButton
1. Write plain text — never HTML, never markdown, never rich text
2. Swap the label to "✓ Copied" for exactly 2000ms
3. Revert; do not stack timers on rapid clicks (reset the existing one)
4. On clipboard failure: label → "Press ⌘C" and select the text in the DOM
5. Never show a toast, never open a modal, never animate beyond the label swap
```

**What gets copied, exactly:**

| Source | Clipboard content |
|---|---|
| `Copy link` | The bare canonical URL: `https://…/r/[slug]`. Nothing else — no "Check out my validation!" prefix. |
| `Copy script` | The numbered questions only, one per line. No heading, no labels, no attribution footer. |
| `Copy all scripts` | Each question as a plain heading line, then its numbered questions, blank line between. |

The rule behind all three: **the user is pasting into their own document.**
Anything we add is something they delete.

---

## 11.6 Hover, focus, keyboard

### Focus

One ring, everywhere: `outline: 2px solid var(--accent); outline-offset: 2px`.
Never removed. `:focus-visible` so mouse users don't see it on click.

### Keyboard map

| Key | Context | Action |
|---|---|---|
| `⌘/Ctrl + Enter` | The Box (`/`) | Start the run |
| `Enter` | The Box | Newline (long-form input) |
| `Enter` | Composer (Define) | Send |
| `Shift + Enter` | Composer | Newline |
| `Enter` / `Esc` | Inline editable field | Commit / revert |
| `Esc` | Drawer, Modal, Popover | Close |
| `←` / `→` | Evidence Drawer | Previous / next evidence |
| `Tab` | Everywhere | Standard order; trapped inside drawer and modal |
| `Space` / `Enter` | Accordion header | Toggle |

The `Enter` inversion between The Box and the Composer is deliberate: The Box
takes one long paragraph (newline is common, submit is once); the Composer
takes short turns (submit is constant). Both are hinted in the UI.

### Hover discipline

Hover feedback appears **only on interactive elements.** A hover effect on
static content teaches users to click things that don't respond, and it's a
common failure in dense report layouts. Finding cards are interactive (they
open the drawer) and so they lift; dimension prose is not and so it doesn't.

---

## 11.7 Motion principles

Beyond the timing table in [02](02-visual-direction.md#212-motion):

1. **Motion explains state change; it never decorates.** Every animation in the
   product answers "what just happened" or "where did that come from."
2. **Enter with motion, exit fast.** Entrances are 240–600ms; exits are
   150–220ms. Waiting for something to leave feels broken.
3. **Never animate a number.** Counters update instantly. (The skill's countup
   animation is a landing-page device; the run's counters are live data and
   animating them would obscure the real rate of arrival.)
4. **Never animate on reconnect or bulk load.** Ten cards flying in at once
   reads as a glitch.
5. **One thing moves at a time** in the user's focal area. The orb breathing in
   the periphery is fine; the orb breathing while findings animate and the
   button pulses is not — hence the orb is **dimmed** on the Run Console.
6. **`prefers-reduced-motion` is honoured**, and the reduced experience is
   complete, not degraded: transforms and infinite loops are removed, opacity
   transitions and structural accordion/drawer motion are kept.

---

## 11.8 Loading choreography

The order things appear matters as much as how fast they appear.

```text
Report page load
  1. RunShell + MetaLine         ← instant, server-rendered
  2. Page heading + one-liner    ← instant
  3. "What we found"             ← streamed first (Suspense boundary)
  4. Dimensions                  ← streamed second
  5. Competitors, surprises      ← streamed third
  6. SectionIndex                ← last (client, needs the DOM)
```

**Principle: the most valuable content resolves first**, and chrome never
blocks content. A user who reads only the first screen should get the summary
without waiting for competitor cards to render.

Skeletons match final layout shape closely enough that nothing shifts when
content arrives. Cumulative layout shift on the report should be effectively
zero — a document that jumps while you're reading it destroys the "premium"
feel faster than any visual flaw.

---

## 11.9 Destructive actions

The product has exactly two, and both get a `Modal`:

| Action | Where | Confirm copy |
|---|---|---|
| Re-run research | Define, after approval | `This replaces the existing report. The brief stays as it is.` `[ Re-run research ]` `[ Cancel ]` |
| Discard and restart conversation | Define | `This clears the conversation and the brief. Your original idea text is kept.` `[ Discard ]` `[ Cancel ]` |

Both are secondary actions, both are reachable only from Define, and neither is
in the primary flow. Nothing else in the product destroys anything — there is
no delete run, and there is no way to lose a report.

---

## 11.10 Latency budgets

Targets that shape which interactions need feedback at all.

| Interaction | Budget | Feedback if exceeded |
|---|---|---|
| Any hover/expand | < 100ms | None needed (instant) |
| Copy | < 50ms | None |
| Brief field commit | < 300ms | Optimistic; inline retry on failure |
| Send message → first token | < 1.5s | `RestIndicator` after 400ms |
| Start run → Define page | < 800ms | Button spinner |
| Approve → Run Console | < 800ms | Button spinner |
| Full research run | 3–5 min | The entire Run Console |
| Report page load | < 1s to first content | Streamed skeletons |

Anything under 400ms gets **no loading indicator at all** — a spinner that
flashes for 200ms reads as jank, not as speed.
