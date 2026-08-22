# Idea Session — build plan

**Status: DONE — 2026-08-22.** Shipped as `components/landing/idea-session.tsx`.
The build-log entry in [`obsidian_app_build_plan.md`](obsidian_app_build_plan.md)
("Idea Session — 2026-08-22") is the record, including **two deliberate
deviations from §3's pre-roll** (two turns rather than one, both `CHAT_SCRIPT`
verbatim) and the reasons. §8's accepted debt is unchanged and still open.
**Surface:** pillar 01 on `/` (the `Define` pillar in `components/landing/pillars.tsx`).
**Read first:** `CLAUDE.md`, then `.claude/skills/obsidian-design/SKILL.md`. This
plan assumes both.

---

## 1. Context — why this exists

Pillar 01 shows a small card previewing what the Define stage is like. It used to
be `BriefFragment`, a static code-drawn brief panel.

On 2026-08-22 it was replaced by a **screen recording of the real Define page**
(queue item C2 in `higgsfield_generation_queue.md`). **That is currently shipped
in the working tree and this plan reverts it.** Three things were wrong with it,
all of which only became visible once it was on screen:

1. **It told the wrong story.** `FRAGMENT_CONVERSATION` in
   `lib/content/landing.ts` is the *fitness* idea — it is the brief produced by
   `CHAT_SCRIPT`, the conversation in section 03 (`CofounderChat`). Pillar 01 and
   section 03 are one continuous narrative. The capture showed the *dental* run
   fixture (`sms-rebooking-4f2a`), dropping an unrelated second idea into the
   middle of that arc.
2. **Geometry fought it.** The Define aside is a fixed 440px column
   (`--define-aside`), so every decision about size, magnification and duration
   was a compromise forced by capturing a fixed-width surface into a 624px slot.
3. **The `I don't know` button could not be in frame.** It sits in the composer
   at the bottom-left of Define; any crop holding both it and the brief panel is
   ≥1240px wide, which renders body text at ~9px. Cause ended up off-screen and
   the pillar copy had to carry it.

Drawn in code all three dissolve, and it matches the repo's own default:
*"Product surfaces are drawn in code as real UI fragments — never screenshots,
never stock."*

The replacement is **not** the old brief panel. It is an **Idea Session**: a
looping preview of Define as a live ideating conversation — the assistant
offering options with trade-offs, an *Investor lens* interjection, and the user
calling it done when they feel done.

### This previews a Define stage that does not exist yet

The real `/r/[slug]/define` still has a `DontKnowButton` and a
`9 of 12 answered · 3 unknown → open questions` counter (`BriefProgress`). The
product owner has decided that page will be reworked — conversation-led, no
counter, no button, novice-friendly — but **that rework is explicitly out of
scope here**. Until it lands, this preview is a promise rather than a picture.
That is a known, accepted debt, recorded in §8.

---

## 2. Decisions already taken — do not relitigate

| | |
|---|---|
| Form | Code-drawn animated conversation, **not** a recording |
| Size | **624×375** — matches pillar 02 (624×375) and 03 (624×362) |
| Duration | **~14s**, minimum 10s |
| Motion | ~~Loop on its own timer~~ → **plays once, `Replay` in the card bar** (changed 2026-08-22, owner). Scroll drives only the card's entrance — *not* scroll-scrubbed |
| Counter | **None.** No `9 of 12`, no `I don't know` button anywhere |
| Investor lens | **Blue** box, labelled `Investor lens` (owner overrode the objection below) |
| Narrative | The **fitness** idea (lapsed lifters), continuous with `CHAT_SCRIPT` |
| Real Define page | Out of scope |

**On the blue box.** Obsidian's rule is that blue has exactly three jobs —
primary action, verification, live/active. This is a deliberate **fourth job**,
chosen by the owner after the conflict was raised. Write it down as a named job
in the design notes rather than leaving it as an undocumented exception someone
later deletes as a mistake. Constraint that still holds: on
`/r/[slug]/validate`, blue-plus-tick means *verified*. The lens box is an
unverified outside opinion and **must not look like verification** — see §5.

---

## 3. The approved copy — ships verbatim

**Card bar:** `Define` left, `Draft` right.

**Opening state — tail of an earlier exchange, half-scrolled:**

> **Groundwork** · …lapsed lifters is specific enough to research.

**Turn 1 — You:**

> honestly not sure what to build first. what do you think?

**Turn 2 — Groundwork (the ideating reply):**

> Depends what you want to find out first. Three shapes, cheapest to most committing:
>
> - **One page and a signup box** — tells you if anyone wants it before you build a thing.
> - **A weekly check-in by text** — nothing to install, and you learn fast whether people reply.
> - **A full programme in an app** — the most convincing, and the hardest to change once it's out.
>
> Whether your people would actually open an app is a question for the research, not a guess.

**Investor lens (blue box):**

> This shape tends to grow on revenue rather than a raise. Worth knowing which you want — it changes what you'd need to prove first.

**Turn 3 — You:**

> let's try the text one. that's enough for now

**Finish:**

> **Three things are still open.**
> That's fine — each one becomes a question the research goes and asks.
> `Start the research` · `Keep talking`

### Why the copy is shaped this way — preserve this on any edit

`executive_summary.md` is binding: **no verdict, no score, no gates**, and
**nothing is invented to fill a field.**

- The bullets assert **trade-offs only**, never facts. An earlier draft said
  *"most of your users probably use iPhones"* — that is precisely the kind of
  claim the Validate stage exists to go and check.
- The one empirical question says so out loud: *"a question for the research, not
  a guess."*
- The Investor lens is a **consequence and a choice**, never a rating. An earlier
  draft — *"low scalability and investment potential"* — was a verdict on the
  idea, which the product promises never to give.
- The finish is a **soft nudge, not a gate**. It names what is open and lets the
  user proceed anyway.

---

## 4. Timeline — ~14s

| t | Beat |
|---|---|
| 0.0 | Rest, mid-conversation |
| 0.6 | **You:** *"honestly not sure…"* types in |
| 2.4 | Groundwork's lead line |
| 3.4 / 4.2 / 5.0 | Bullets land one at a time |
| 5.9 | The *"question for the research"* closer |
| 7.2 | **Investor lens** slides in |
| 9.0 | **You:** *"let's try the text one…"* |
| 10.4 | Finish prompt appears |
| 12.2 | Hold |
| 11.6 | **Pointer glides in** *(added 2026-08-22)* |
| 12.7 | **Presses `Start the research`** — squash, two rings, and a ripple across the button face |
| 13.6 | Pointer lifts |
| 14.5 | **Rests here; `Replay` is the only way back** |

10s was the floor asked for; 14s is used because at 10s the bullets arrive faster
than they can be read. Each bullet needs its own beat.

---

## 5. Implementation

### 5.1 The script is data, with derived timing

Add to `lib/content/landing.ts`, where `CHAT_SCRIPT` already lives:

```ts
export type SessionStep =
  | { kind: 'turn'; role: 'user' | 'ai'; text: string; holdMs: number }
  | { kind: 'bullets'; items: { lead: string; rest: string }[]; stepMs: number; holdMs: number }
  | { kind: 'lens'; text: string; holdMs: number }
  | { kind: 'finish'; heading: string; body: string; primary: string; secondary: string; holdMs: number };

export const SESSION_SCRIPT: SessionStep[] = [ /* §3 */ ];
export const sessionTotalMs = /* derived */;
```

Typing steps derive their duration from `text.length × msPerChar`, reusing
CofounderChat's tuned values: **15ms/char for AI, 24ms/char for user**
(`components/landing/cofounder-chat.tsx:126`). `sessionTotalMs` sums typing plus
holds, mirroring `runEventsTotalMs` in `lib/fixtures/run-events.ts`, so the whole
timeline is assertable from a node test.

### 5.2 `components/landing/idea-session.tsx` (new)

**No `'use client'` directive.** `Pillars` already carries one, so this sits in
the client graph without spending a fourteenth name from the budgeted allowlist
in `CLAUDE.md`.

- `useInView({ threshold: 0.35, once: false })` — `lib/hooks/use-in-view.ts`
  already supports `once: false`, which is what lets the loop **pause when
  scrolled off-screen** rather than animating to an empty room.
- `useReducedMotion()` — `lib/hooks/use-reduced-motion.ts`. Render every step
  settled, transcript pinned to the end, no typing, no loop, no caret. Mirrors
  `CofounderChat`'s `settled` branch; **do not render nothing**.
- Step index advanced by `setTimeout`, the same `turnIndex`/`onDone` handshake
  `CofounderChat` uses. Per-character state lives in the typing child so only
  that node re-renders.
- After the final hold, reset to 0 and loop.

**The fixed-height scrolling transcript is what makes 624×375 possible.** The
full script is roughly 3× the card's height. So the transcript is a fixed-height
viewport whose content scrolls up as turns land — `scrollTop = scrollHeight` in
an effect, `scroll-behavior: smooth`, instant under reduced motion, scrollbar
hidden. Card height is therefore constant, and the finish prompt scrolls in as
the last block rather than being pinned. No layout shift by construction.

### 5.3 Styles — `styles/obsidian.css`

**Reuse, do not invent.** These already exist: `.ob-frag`, `.ob-frag-bar`,
`.ob-bubble`, `.ob-bubble-user`, `.ob-bubble-ai`, `.ob-caret`, `.ob-dot`.
`.ob-bubble` is `max-width: 48ch`, tuned for section 03's 900px column — it needs
a narrower scoped variant at 624.

New recipes: session shell, scroll viewport, bullet list, finish block, lens box.
**Remove** the `.ob-frag-capture*` recipes.

**The Investor lens box:**
- Uses **existing tokens only** — `--ob-accent`, `--ob-accent-wash`
  (`rgba(45,127,249,0.12)`), `--ob-hairline-accent`. **`styles/tokens.css` is not
  touched and no new colour value is introduced.**
- **Must not read as verification.** Blue left-rule plus the low-opacity
  `--ob-accent-wash` surface. Never the solid accent used by `.btn-primary` and
  `✓ VERIFIED`. **Never a checkmark.**

Two `CLAUDE.md` traps that bite here: an **undefined custom property silently
voids its whole declaration** (diff used-vs-defined against `styles/tokens.css`
after editing), and the same for `animation:` names against their `@keyframes`.
`styles/obsidian.css` is already imported into `@layer components` — keep it that
way.

### 5.4 Wire-up — `components/landing/pillars.tsx`

`<IdeaSession />` when `pillar.fragment === 'conversation'`; keep `<Fragment />`
for `evidence` and `roadmap`. The existing `ScrollReveal delay={120}` wrapper
**already supplies the scroll-driven entrance** — no new scroll machinery is
needed.

### 5.5 Test — `tests/unit/session-script.test.ts` (new)

Model on `tests/unit/run-events-timing.test.ts`:

- `sessionTotalMs` is **≥ 10s**, and within 12–16s
- step order: bullets precede the lens; the lens precedes the finish
- exactly one `lens` step and one `finish` step
- no empty text anywhere; the finish carries both button labels

---

## 6. Revert the capture

- **Delete** `components/landing/fragment-capture.tsx`
- **Delete** `public/media/capture/brief.mp4` and `brief.webm`
- Remove the `CAPTURES` map and `CaptureAsset` import from `pillars.tsx`
- Remove `.ob-frag-capture*` from `styles/obsidian.css`

---

## 7. Documentation

**`higgsfield_generation_queue.md`**
- Mark **C2 superseded** — coded interaction, not a capture. Restore its main
  table row from `SHIPPED` accordingly.
- Rewrite **C1 and C3's approach** from *capture* to *coded interaction*, but
  **leave them in the queue** — they are not retired. Note on C1 that the live
  Run Console is the one surface where a real capture may still argue for itself.
- **Keep PC9.** The Chromium screencast timebase stretch is a genuine trap: at
  2880×1800 the recorder emitted **2501 frames for a ~10-second session** (a ~10×
  stretch), so extracted frames showed states that never existed in the DOM. At
  2160×1350 it measured 270 frames against 11.7s wall clock, which is correct.
  Anyone attempting a capture again must verify frame count against wall clock.
- PC8 and PC10 relate to the retired capture; mark them historical rather than
  deleting — PC8 documents that the Define counter never moves on its own, which
  stays true of the current app.

**`obsidian_app_build_plan.md`** — append a build-log entry covering the
reversal, the narrative-continuity bug (§1.1), and blue's documented fourth job.

---

## 8. Deliberately not done — record, do not silently skip

- **The real Define page is unchanged.** This preview shows a stage that does not
  exist yet. The owner intends to rework it (and to amend `executive_summary.md`
  alongside), but that is a separate piece of work.
- **Pillar 01's `proof` line** still reads *"Ends with a written brief on screen.
  Edit any field, then approve it."* Still true of the product, but the preview
  no longer shows a brief panel, so copy and picture no longer strictly agree.
  Left as-is pending a call from the owner.
- Pillar 01's **body copy needs no change** — *"it takes 'I don't know' as a real
  answer every single time — each one becomes a research question or an open
  question instead of a wall"* is exactly what this now shows.

---

## 9. Verification

- `npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build`
  - **Lint note:** six files in the repo have **pre-existing** format offences
    (`site-nav.tsx`, `scroll-reveal.tsx`, `hero-collage.tsx`, `globals.css`,
    `tokens.css`, `obsidian-app.css`). Format only your own files; leave those.
- Playwright MCP against `next build && next start` (**not `next dev`** — Strict
  Mode double-invokes effects), at **1440px and 1280px**:
  - card measures **624×~375**, in rhythm with pillars 02 and 03
  - it plays **once** and rests; `Replay` in the card bar restarts it, and it
    **stops advancing when scrolled out of view**
  - the closing pointer travels, presses the CTA, and lifts — and neither it nor
    the replay control is mounted under reduced motion
  - reduced motion → settled end state, no typing, no loop, no caret animation
  - **no layout shift across the whole cycle** — measure the card box at several
    points in the timeline, not only at rest
  - the lens box is visibly distinct from a `✓ VERIFIED` chip on
    `/r/[slug]/validate`
- Screenshot pillar 01 next to 02 and 03 to confirm the section's rhythm holds.

---

## 10. Repo state when this plan was written

Branch `main`, last commit `5f03394`. The working tree already carried uncommitted
changes before this work began (`app/favicon.ico`, `components/roadmap/fieldwork-*`,
`higgsfield_generation_queue.md`, plus untracked `app/icon.svg`,
`app/apple-icon.png`, `images/`, `public/icon-512.png`, `public/media/`,
`public/og/`). The capture work added `components/landing/fragment-capture.tsx`,
`public/media/capture/`, and edits to `pillars.tsx`, `styles/obsidian.css`,
`higgsfield_generation_queue.md` and `obsidian_app_build_plan.md` — **all of which
§6 and §7 undo or amend.**

No new dependencies. No new colour values. No fixture, schema, or `lib/db` changes.
