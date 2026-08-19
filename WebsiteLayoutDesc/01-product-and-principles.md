# 01 — Product UI Summary & Design Principles

---

## 1.1 What the interface is actually for

The product is not a dashboard. It is a **document that gets written in front
of you, in three acts, in about ten minutes.**

That framing drives every layout decision in this blueprint. The user is not
managing a workspace, monitoring metrics, or configuring anything. They are
watching a piece of thinking get assembled on their behalf, participating
where only they can, and then leaving with an artifact.

So the interface behaves like a document, not an application:

- Long-form, single-column-biased reading surfaces
- Generous vertical rhythm, editorial typography
- Navigation is *position in the document*, not a menu of features
- Almost no chrome, almost no controls
- The few controls that exist are unmissable

## 1.2 Who is on the other side of the screen

From the exec summary, verbatim in intent:

> People at the earliest stage: an idea in their head, no product, no
> customers, often no company. First-time founders, side-project builders,
> people who just quit or are thinking about it. They are not sophisticated
> buyers of research and **they will not tolerate a form.**

Four consequences for the UI:

1. **No jargon anywhere in the chrome.** Not "posture," not "evidence level,"
   not "claim," not "synthesis," not "pipeline." Labels are plain English.
   The one exception is the monospace **Meta Line**, which is deliberately
   technical — see §1.4.
2. **Nothing that looks like a form.** No field grids, no required-asterisks,
   no multi-step wizard with a progress bar. The Define stage is a
   conversation and must look like one.
3. **"I don't know" must be free.** This is the single most important rule in
   the exec summary's Pillar 1. In the UI it becomes a **button**, not
   something the user has to compose a sentence to express. See
   [06](06-page-define.md#the-dont-know-button).
4. **They are unlikely to come back on their own.** No auth, no email. The
   URL is everything. The UI must make keeping the URL effortless and make
   losing it recoverable.

## 1.3 The three pillars as the shape of the product

```text
      DEFINE                  VALIDATE                 ROADMAP
   ─────────────           ─────────────            ─────────────
   You talk.               You watch.               You act.
   AI asks.                AI works.                AI hands over.
   ~5 minutes              ~5 minutes               read + copy
   interactive             spectating               instructional

   Output:                 Output:                  Output:
   an approved brief       a cited report           questions + build plan
```

Each pillar has a **different interaction temperature**, and the UI should
feel different in each:

| Pillar | Temperature | UI consequence |
|---|---|---|
| Define | High engagement — the user is typing | Tight, centred, focused. Composer always in reach. Minimal surrounding content. |
| Validate | Zero engagement while running, then dense reading | Ambient and alive while running; editorial and scannable when done. |
| Roadmap | Medium — reading, copying, planning | Structured, copy-pastable, cross-linked. Built to be used in another tab. |

Fighting this — e.g. making Define look like a report, or making the report
look interactive — would be a mistake. Let them feel different.

## 1.4 The trust proposition is a UI feature

The exec summary is blunt about what makes this better than a chat prompt:

> Mechanical citation verification. Every quoted excerpt is checked against
> the text of the page it came from before it can appear in the report.

**This is not a backend detail. It is the product's core differentiator, and
the interface has to carry it.** Three mechanisms:

1. **The `VERIFIED` badge on every Finding Card**, appearing at the moment the
   string match passes — visible during the run, not just after.
2. **Citation Chips everywhere prose makes a claim**, one click from the
   verbatim excerpt in the Evidence Drawer. Nothing in the report asserts
   anything the user can't check in two seconds.
3. **The discard count, shown openly.** `47 VERIFIED // 18 DISCARDED` in the
   Meta Line. Showing what we threw away is more persuasive than showing what
   we kept. This is the reason the Meta Line exists and is allowed to be
   technical — it's evidence of machinery, and machinery is trust.

## 1.5 Design principles

Eight principles. When two page-level decisions conflict, resolve up to these.

### P1 — The artifact is the interface

Every screen is either producing the document or showing the document. There
is no "app around the document." Resist adding shell features (search, filters,
settings) that imply a workspace the product doesn't have.

### P2 — Honest progress, never theatrical progress

No percentage bars, no fake ETAs, no "Analyzing your market…" spinners with
invented stages. Show the real thing: the actual query strings, the actual
page count, the actual verified count, the actual elapsed time. The work is
genuinely interesting to watch — don't replace it with a decoration.

*Corollary:* if we don't know how long something will take, we say so, and we
say what's happening right now instead.

### P3 — Every claim is one click from its source

No exceptions in the report. A sentence with no citation is a sentence the
model made up, and it should be visually distinguishable from one that isn't.

### P4 — "I don't know" is a first-class answer

Not just in the conversation — everywhere. Unknown brief fields render as
`unknown` with a visible onward path ("→ becomes an open question"), not as
empty states or errors. Thin evidence renders as an honest notice, not as a
failure. The product's posture is *we'll tell you what we don't know*, and the
UI should never make the user feel that a gap is their fault.

### P5 — Progressive disclosure, always downward

Summary first, detail on demand, source on click. The report's opening is
three to five sentences. Open Questions show question + who to ask, expanding
to the full script. Competitor Cards show name + price + difference,
expanding to moat and takeaways. Nobody meets the full corpus at once.

### P6 — One primary action per view

The `dark-luxury-design` primary button carries an always-visible pulsing
glow. That is correct and powerful for *the* next action, and unbearable if
eight things pulse at once. **Exactly one `.btn-primary` per viewport.**
Everything else is `.btn-secondary` (which the skill already defines with no
glow) or a text action. This is a discipline rule, not a deviation from the
skill.

### P7 — Keep the user oriented in a document they didn't write

They will scroll a long report. At every point they should know: which of the
three stages they're in, how far through it they are, and how to get back to
the top. The Stage Rail is always visible; long surfaces get a scrollspy
index; the run ID is always on screen.

### P8 — Premium means restraint, not decoration

The aesthetic budget goes to: type, spacing, one accent, one orb, grain, and
motion that means something. It does not go to: extra gradients, nested cards,
glassmorphic panels stacked on glassmorphic panels, or ornament. If an element
doesn't help someone understand their idea better, it's cut.

## 1.6 What the interface must emphasise

Ranked. When space or attention is contested, higher wins.

1. **The one box** on arrival — nothing competes with it
2. **The brief assembling** during Define — the user must see progress toward
   an artifact, or the conversation feels like aimless chat
3. **Findings landing verified** during the run — the trust moment
4. **"What we found"** — the three-to-five sentences at the top of the report
5. **"What surprised us"** — the section people screenshot; give it weight
6. **The open questions with their scripts** — the most actionable output
7. **What *not* to build** inside the roadmap — the exec summary calls this the
   most valuable thing the section can do; do not bury it in a muted list

## 1.7 What the interface must de-emphasise or refuse

- **No verdict, score, or rating** anywhere — including implied ones. No
  traffic-light colours on dimensions, no A–F grades, no thumbs.
- **No gating.** Nothing is disabled because research "found a problem."
  Concerning findings are findings.
- **No urgency manufacture.** No countdowns, no "3 people are validating right
  now," no upsell interstitials.
- **No engagement loops.** No streaks, no gamification, no "come back
  tomorrow."

The product's credibility comes from being an honest instrument. A single
growth-hack pattern in the UI would undo it.
