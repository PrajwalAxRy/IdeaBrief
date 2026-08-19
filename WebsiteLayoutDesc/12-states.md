# 12 — Loading, Empty, Error & Success States

A single reference matrix, then the rules behind it. Page files carry the
detail; this file is the consistency check.

---

## 12.1 State matrix

| Surface | Loading | Empty | Error | Success |
|---|---|---|---|---|
| `/` hero | — (static) | Box empty → `Start` disabled, visible | Inline under box, text preserved | Redirect to Define |
| `/` recent runs | — (client) | **Section hidden entirely** | — (silent; storage failure just hides it) | — |
| Define — conversation | h1 + one AI skeleton; composer live | Impossible (starts with user's text) | Inline under failed turn + `Retry` | — |
| Define — AI turn | `RestIndicator` (3 dots) | — | Partial text kept, `— interrupted` + `Continue` | Turn completes, composer refocuses |
| Define — brief panel | Full field skeleton | Skeleton = the empty state (pending, not absent) | Field-level inline retry | Amber ring pulse 1.2s, Approve appears |
| Define — approve | Button spinner | — | Inline, brief unlocks, retry | Lock + note + redirect |
| Run Console | Phase strip `starting…`, 3 skeleton cards | `Nothing verified yet. Findings appear here as they pass the check.` | Failed panel with partial results preserved | Cross-fade to report, 400ms |
| Run Console — SSE | — | — | `Reconnecting…` bar → poll fallback | Silent resume |
| Report — body | Streamed skeletons per section | Thin-evidence variant (reordered) | Partial report + `Run it again` | One-time reveal of "What we found" |
| Report — dimension | Skeleton row | Collapsed to one line (not an empty section) | — | — |
| Report — competitors | 2 card outlines | **Section omitted entirely** | Missing fields → `not established from available evidence` | — |
| Evidence drawer | Instant (data present) | — | — | — |
| Roadmap | Skeleton: 1 expanded + 5 rows + 5 steps | Render fewer than 4 questions honestly + note | `Try again` + `Back to the report` | — |
| Roadmap — generating | `Writing the questions and the build plan…`, sections stream in | — | As above | Sections appear |
| Copy actions | — | — | Label → `Press ⌘C`, text selected | Label → `✓ Copied`, 2s |
| Sources | 8 skeleton rows | Filter empty → `No findings in this dimension.` + `Show all` | — | — |
| Invalid run | — | Recent runs if any | *is* the error state | — |

---

## 12.2 Loading states — rules

1. **Skeletons match final shape.** Line counts, widths, and spacing mirror the
   real content so nothing shifts on arrival. Vary skeleton line widths —
   uniform bars look synthetic.
2. **Nothing under 400ms gets an indicator.** A flash of spinner is worse than
   a moment of nothing.
3. **Chrome never waits for content.** `RunShell`, headings, and the one-liner
   render from server data immediately, always.
4. **Content resolves in value order** — summary before detail, detail before
   competitors. See [11](11-interaction-patterns.md#118-loading-choreography).
5. **No full-page loaders. No route-transition spinners. No progress bars.**
   The one long wait in the product (the research run) has a purpose-built
   screen that shows real work instead.
6. **Inputs stay live during loading** wherever possible — the Define composer
   accepts typing while the AI streams; The Box accepts typing before the page
   finishes settling.

---

## 12.3 Empty states — rules

The governing principle from [01](01-product-and-principles.md#p4--i-dont-know-is-a-first-class-answer):
**an empty state in this product is usually information, not an absence.**

| Rule | Rationale |
|---|---|
| **No illustrated empty states.** Ever. | An illustration says "there's nothing here"; in this product the emptiness usually *means* something and deserves a sentence instead. |
| **Hide, don't placeholder.** | Recent runs with no runs → hidden. Competitors with none found → section omitted. A placeholder for something that isn't relevant is noise. |
| **One sentence, at most one action.** | `No findings in this dimension.` `[Show all]`. Nothing more. |
| **Never frame emptiness as failure or success.** | "No competitors found!" would read as encouragement — a verdict. Omitting the section says nothing, correctly. |
| **Never apologise twice.** | The thin-evidence run gets exactly one notice at the top, then proceeds normally. |
| **Distinguish *pending* from *empty*.** | An unfilled brief field is a shimmer (pending), not a dash (empty). They mean different things and must look different. |

### The three meaningful empty states

**1. Nothing verified yet (Run Console)** — the highest-anxiety moment in the
product. Needs a sentence explaining what will fill the space:
> `Nothing verified yet. Findings appear here as they pass the check.`

**2. Thin evidence (Report)** — a full designed variant, not an empty state.
See [07](07-page-validate.md#thin-evidence-variant). The web having nothing is
a research finding.

**3. Fewer questions than expected (Roadmap)** — render honestly rather than
padding to hit a target count:
> `Only {n} things were genuinely unresolved after the research.`

---

## 12.4 Error states — rules

1. **No red.** The palette has none. Errors use `--text-primary` copy with a
   2px `--accent` left border on `--bg-card`. A red UI in a product that
   refuses to judge ideas sends the wrong signal, and error-red on a warm dark
   surface looks cheap.
2. **Inline and adjacent.** Errors appear next to what failed. No modals, no
   banners at the top of the page, no toast.
3. **Never lose user input.** Message text stays in the composer. The Box's
   content is mirrored to `sessionStorage`. Brief edits revert visibly, with the
   attempted value restored to the input.
4. **Never lose completed work.** A pipeline failure at synthesis still shows
   every verified finding. A roadmap failure leaves the report fully intact and
   says so.
5. **One retry action.** Not "retry / report / dismiss / learn more."
6. **Name the likely cause when we know it.** The invalid-run page leads with
   "the link may be incomplete" because that's the most common real cause.
7. **Plain language, no codes.** The only exception is the error ID in the
   `MetaLine` on the global boundary, which makes a bug report actionable.

### Error copy library

| Situation | Copy |
|---|---|
| Run creation failed | `Couldn't start the run. Your text is safe — try again.` |
| Message send failed | `Couldn't send that. Your text is safe.` |
| AI stream interrupted | `— interrupted` + `Continue` |
| Brief field save failed | `Didn't save. [Retry]` |
| SSE disconnected | `Reconnecting…` → `Reconnecting — checking every few seconds.` |
| Run stalled 45s | `Still working — some pages are slow to fetch.` |
| Run failed mid-pipeline | `This run didn't finish. We got as far as {phase}. Here's what was verified before it stopped — {n} findings.` |
| Roadmap generation failed | `We couldn't write the roadmap for this run. The research is finished and safe — you can try again.` |
| Invalid slug | `There's nothing at this link.` |
| Unhandled | `This one's on us.` |

**Banned error copy:** "Oops!", "Something went wrong" as the only information,
"Please try again later", any exclamation mark, any emoji, any blame.

---

## 12.5 Success states — rules

The product has very few explicit success moments, deliberately — most
"success" is just the next thing appearing.

| Moment | Treatment | Why this restraint |
|---|---|---|
| Copy | Label → `✓ Copied`, 2s | The user is mid-task; anything more interrupts |
| Brief field saved | Nothing | The new value is the confirmation |
| Brief proposed | Panel amber ring, 1.2s, then settles | A genuine change of page character — worth marking once |
| Finding verified | Card entrance + badge 180ms later | The product's signature moment; the delay makes verification legible |
| Run complete | Cross-fade + "What we found" reveal 200ms after | Rewards the wait without a celebration |
| Brief approved | Lock + one quiet line + redirect | The redirect is the feedback |

**No confetti, no checkmark animations, no "Success!" banners, no completion
percentages, no celebration modals.** The product's tone is a competent
instrument, and instruments don't congratulate you.

---

## 12.6 Transitional and edge states

| State | Handling |
|---|---|
| **Run in progress, user returns later** | `/r/[slug]` resolves to `/validate`, SSE connects mid-run, findings already landed render without animation, elapsed time is computed from `created_at` |
| **Run complete, user on Define** | Stage Rail shows all done; Define is read-only with a `Re-run research` secondary action |
| **Brief approved but research not started** | Treated as running with `phase: starting`. Never a distinct screen. |
| **Two tabs open on the same run** | Both connect to SSE independently. No locking, no conflict warning. Brief edits are last-write-wins — acceptable at this scale, and the alternative (locking) costs more than the problem. |
| **Very long brief field values** | Clamp to 3 lines in the panel with a `show more` text action. Never truncate with an ellipsis and no way to see the rest. |
| **A finding with a very long excerpt** | Clamp to 4 lines in cards; full text always in the Evidence Drawer. |
| **A competitor with most fields missing** | Still renders, with `not established from available evidence` per field. Never omitted — an omitted competitor looks like a bug; a sparse one looks like honest research. |
| **Zero verified findings at all** | The report is the thin-evidence variant at its extreme: the notice, no dimension sections, and a primary CTA to the roadmap. The roadmap still generates — it's built from the brief plus whatever exists. |
| **Slug exists but brief never approved, days later** | Define renders normally. Nothing expires in v1. |

---

## 12.7 State consistency checklist

Before shipping any surface:

- [ ] Loading skeleton matches the final layout — no shift on arrival
- [ ] Nothing under 400ms shows a spinner
- [ ] Empty state is either hidden or one sentence + one action
- [ ] No illustrated empty state
- [ ] Error is inline, adjacent, and preserves input
- [ ] Error copy names a cause or a next step, not just "went wrong"
- [ ] No red anywhere
- [ ] Success is confirmed on the element, not in a toast
- [ ] Completed work survives a later-stage failure
- [ ] Pending and empty are visually distinct
