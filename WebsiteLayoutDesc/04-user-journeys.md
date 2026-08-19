# 04 — Primary User Journeys

Format: `Entry → Action → Action → Result → Next logical action`, with decision
points, abandonment risks, and the UI's response to each.

---

## 4.1 The happy path, end to end

```text
ENTRY          Lands on /  (organic, or a link someone sent them)
   │
   ├─ reads headline + placeholder  ......................... ~4s
   │
ACTION         Types into The Box, or clicks an example seed
   │           "I want to do something in fitness, I don't know what yet"
   │
ACTION         Presses Start  (or ⌘/Ctrl+Enter)
   │
RESULT         Run created → redirect to /r/[slug]/define
   │           AI's first message is already streaming on arrival
   │
ACTION         Conversation. 3–8 exchanges. Uses "I don't know" freely.
   │           Watches the Brief Panel fill in on the right.
   │
DECISION ◆     AI proposes the brief when the picture is clear enough
   │
ACTION         Reviews brief · edits any field inline · approves
   │
RESULT         Research starts. Redirect to /r/[slug]/validate (Run Console)
   │           One quiet line: "This page is your run. Bookmark it."
   │
WAIT           ~3–5 min. Queries tick. Findings land verified, one by one.
   │           User may close the tab here — run continues.
   │
RESULT         Report renders. What we found → dimensions → competitors →
   │           surprises → what we couldn't answer
   │
ACTION         Reads. Hovers citation chips. Opens Evidence Drawer 2–5 times.
   │
NEXT           Clicks "What to do next →" at the end of the report
   │
RESULT         /r/[slug]/roadmap — 4–7 open questions + the build plan
   │
ACTION         Expands question #1 · clicks Copy script
   │
EXIT           Leaves with: a link, a script in their clipboard, and a plan
```

**Total time from arrival to a copied interview script: 10–14 minutes.**
That number is the product's real success metric and every friction decision
below is measured against it.

---

## 4.2 Journey A — Vague idea (the primary case)

The user this product was designed for.

```text
/  ──▶  types "something in fitness"  ──▶  Start
                                              │
                             ┌────────────────┘
                             ▼
        AI: "Fitness is broad — help me narrow it. Who's the person
             you picture using this, and what are they doing today?"
                             │
        User: "I don't know really, maybe people who quit the gym"
                             │
        AI recommends: proposes two concrete directions, asks which
             is closer  ◆ DECISION POINT
                             │
        User picks one, answers 2 more, taps [I don't know] twice
                             │
        AI proposes a brief with 3 fields = "unknown"
                             │
        Brief Panel shows those 3 fields tagged  → open question
                             │
        User approves  ──▶  research  ──▶  report  ──▶  roadmap
```

**Where the UI must guide:**
- The AI *recommends* rather than interrogates — the exec summary is explicit
  that it should push back on "everyone" as a customer and propose the two-week
  version of a six-month scope. UI support: when the AI offers concrete
  options, render them as **selectable suggestion chips** below the message, so
  choosing costs one click instead of a typed sentence.
- Every `unknown` field in the Brief Panel shows its destination
  (`→ open question`). This turns a gap from a failure into a feature, in view,
  before the user can feel bad about it.

**Abandonment risk: HIGH at the first AI question.** If the first question
feels like a form field, this user leaves. Mitigation: the AI's opening message
is one sentence of framing plus one open question, never a list; the composer is
already focused; the Don't-Know Button is visible before they need it.

---

## 4.3 Journey B — Well-formed idea (the fast path)

The exec summary target: *"If someone arrives with a well-formed idea, the AI
should recognize it, propose a brief almost immediately, and ask two questions
at most."*

```text
/  ──▶  pastes a full paragraph  ──▶  Start
                                         │
        AI: proposes a near-complete brief in its FIRST message,
            asks the two things it genuinely can't infer
                                         │
        Brief Panel arrives ~80% filled  ◆ DECISION POINT
                                         │
              ┌──────────────────────────┴─────────────────────┐
              ▼                                                ▼
    answers the 2 questions                        edits fields directly
    → brief completes                              in the Brief Panel,
                                                   ignores the questions
              └──────────────────────────┬─────────────────────┘
                                         ▼
                                   Approve  ──▶  research
```

**Critical UI requirement:** the Approve button must be reachable *without
finishing the conversation*. A user who sees a correct brief should not have to
answer two more questions to proceed. The Approve action lives in the Brief
Panel and is enabled as soon as the AI has proposed a brief — the conversation
becomes optional at that point.

This single decision is what makes the fast path actually fast. Time to
approved brief: **under 90 seconds.**

---

## 4.4 Journey C — The wait

Five minutes is a long time on a webpage. This is a spectating journey and its
design goal is *make the machinery legible.*

```text
Brief approved
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  0:00   19 queries written from your brief   ← all shown    │
│  0:08   searching…    Query Ticker starts scrolling         │
│  0:40   first page fetched                                  │
│  0:52   ▸ FINDING lands   [VERIFIED]  ← the trust moment    │
│  1:30   findings accumulating per dimension, counts rise    │
│  2:10   "18 excerpts discarded — didn't match the page"     │
│  3:40   fetching complete · writing the report              │
│  4:20   Report renders in place. No page jump.              │
└─────────────────────────────────────────────────────────────┘
```

**Where users abandon:** minutes 1–3, when nothing feels like it's finishing.

Four mitigations, in order of importance:

1. **The first verified finding must land fast** — ideally under 60 seconds.
   If the pipeline can prioritise returning *one* verified finding early, the
   frontend should surface it prominently. Nothing else buys as much patience.
2. **Show the discard count.** Counter-intuitive but true: `18 DISCARDED` is
   the most credibility-building number on the screen. It proves the filter is
   real.
3. **Explicit permission to leave.** A line under the console:
   `You can close this tab — the run keeps going. Come back to this link.`
   Paired with Copy link. This converts an abandonment into a return visit.
4. **Never show a percentage.** A bar at 40% for 90 seconds is worse than no
   bar. Show counts, elapsed time, and the current phase in words.

**No email capture.** There is no auth and no mailer in v1 — offering "email me
when it's done" would be a promise the product can't keep.

---

## 4.5 Journey D — The thin-evidence run

The exec summary flags this as an open decision. Designed here rather than
discovered by accident.

**Trigger:** total verified findings < 12, or ≥ 3 of 5 dimensions with < 2
findings.

```text
Run completes with 6 verified findings across 2 dimensions
      │
      ▼
Report renders — BUT REORDERED:
      │
      ├─ Thin-Evidence Notice moves to the TOP, above "What we found"
      │     "We found very little about this online.
      │      That is not evidence against your idea — it usually means
      │      the idea is new, very local, or described in words the web
      │      doesn't use yet. The most useful part of this run is the
      │      next section."
      │                                          [ What to do next → ]
      │
      ├─ What we found  (shortened, still cited)
      ├─ Dimensions with findings  (dimensions with none are collapsed
      │     into one line each, not shown as empty sections)
      ├─ Competitors  (omitted entirely if none found — never an empty grid)
      └─ What we couldn't answer  (expanded — this is now the main event)
      │
      ▼
Roadmap becomes the product for this user. The primary CTA on the
report is a .btn-primary pointing at it, not a secondary link.
```

**Design rules for this state:**
- Never render an empty dimension section with a "no results" placeholder ×5.
  Collapse them into a single honest line.
- Never apologise more than once. One notice at the top, then get on with it.
- The tone is *diagnostic, not defeated*. Thin web evidence is information.

---

## 4.6 Journey E — Returning to a run

```text
ENTRY   User opens a bookmarked /r/[slug] two days later
   │
   ├─ Server resolves status → redirects to the right stage
   │
   ├─ Report is complete → lands on /validate showing the finished report
   │
   ├─ Stage Rail shows all three segments done — nothing is "in progress"
   │
NEXT    Reads, or jumps to Roadmap, or copies the link to send to someone
```

**And the failure case:**

```text
ENTRY   User opens / with no memory of their link
   │
   ├─ "[Recent runs]" section on / lists up to 10 from localStorage,
   │   each showing the one-liner + stage + relative time
   │
   ├─ FOUND     → clicks through, resumes
   │
   └─ NOT FOUND → (different browser / cleared storage)
       The section states plainly: "Runs are remembered by this browser
       only. If you've lost a link, the run can't be recovered."
       Then: start a new one.
```

Being honest here is better than a fake recovery flow. There is no email on
file; there is nothing to recover with.

---

## 4.7 Journey F — Cold visitor on a shared link

```text
ENTRY   Someone's friend/advisor opens /r/[slug]
   │
   ├─ No signup wall. No blur. The report loads.
   │
   ├─ Header shows the idea's one-liner → instant context
   │
   ├─ Stage Rail is fully "done" — but Define is clickable, so a curious
   │   reader can see the brief that produced this. That transparency is
   │   worth more than hiding it.
   │
   ├─ Reads the report. Hovers a chip. Sees a real source. Trust forms.
   │
NEXT    Run footer: "Validate your own idea →"  (secondary, unobtrusive)
```

This is the product's only real distribution mechanism in v1. The report has to
be worth forwarding, and forwarding has to work perfectly.

---

## 4.8 Decision points, consolidated

| # | Decision point | Where | If they go left | If they go right | UI support |
|---|---|---|---|---|---|
| D1 | Type something, or bounce | `/` | Bounce | Types | Example seeds; single visible input; no signup |
| D2 | Answer, or abandon the conversation | Define | Abandon | Answers | Don't-Know Button; suggestion chips; short AI turns |
| D3 | Accept the AI's narrowing recommendation | Define | Pushes back in prose | Clicks a suggestion chip | Chips render the AI's options as one-click choices |
| D4 | Approve the brief, or keep editing | Define | Edits inline | Approves | Approve always enabled once proposed; inline edit is 1 click |
| D5 | Wait, or leave | Run Console | Leaves | Waits | Explicit "you can close this tab"; real progress; fast first finding |
| D6 | Trust the report, or dismiss it | Report | Dismisses | Checks a source | Citation chips; verified badges; discard count; drawer |
| D7 | Read the roadmap, or stop at the report | Report end | Stops | Continues | "What we couldn't answer" ends pointing forward; primary CTA |
| D8 | Actually go talk to people | Roadmap | Doesn't | Copies a script | Copy script is a one-click primary action; "find them" is specific and linked |

D5 and D8 are the two the product most needs to win. D5 determines whether they
see any output at all; D8 determines whether the product changed anything.

---

## 4.9 Friction inventory — where we deliberately remove it

| Friction | Removed by |
|---|---|
| Signup before value | No auth at all |
| Blank page paralysis | Three clickable example seeds under The Box |
| Not knowing an answer | Don't-Know Button, one tap, never asked twice |
| Typing a choice the AI offered | Suggestion chips |
| Being forced to finish a conversation | Approve enabled as soon as a brief exists |
| Correcting the AI by arguing | Inline field editing in the Brief Panel |
| Waiting with no information | Real queries, real counts, real elapsed time |
| Being stuck at the screen during the run | "You can close this tab" + copy link |
| Verifying a claim | Hover chip → excerpt; click → full source in drawer |
| Turning a script into something usable | Copy script → clean plain text to clipboard |
| Losing the run | localStorage recent runs + persistent copy link |

## 4.10 Friction we deliberately keep

| Kept friction | Why |
|---|---|
| Brief must be explicitly approved | It's the contract for a 5-minute, real-cost research run. An accidental start wastes the user's time and our money. |
| Roadmap doesn't unlock before the report | The roadmap is generated *from* verified findings. Showing it early would mean showing a generic version, which is exactly what the exec summary says not to build. |
| Re-running research requires confirmation | It discards the existing report. One confirm modal. |

---

## 4.11 Guidance map — where the UI teaches

Ranked by how likely the user is to be lost.

```text
HIGH NEED
  ├─ First AI question         → AI's own framing sentence + visible Don't-Know
  ├─ First citation chip       → one-time hover hint, dismissed forever
  └─ Minute 2 of the run       → phase in plain words + "you can close this tab"

MEDIUM NEED
  ├─ Brief Panel first appears → "unknown" fields tagged "→ open question"
  ├─ Report arrival            → sticky section index shows the shape at a glance
  └─ Roadmap arrival           → first question expanded, rest collapsed

LOW NEED (no UI required)
  ├─ Stage Rail                → three words, self-evident
  ├─ Copy link                 → universal pattern
  └─ Competitor cards          → field labels are the explanation
```
