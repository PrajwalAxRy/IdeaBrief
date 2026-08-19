# 06 — Define  `/r/[slug]/define`

> Pillar 1. The conversation that turns a vague idea into a structured brief.

---

## Purpose

Produce an **approved idea brief** — a structured object the research run can
work from — through a conversation that never feels like a form. Target from
the exec summary: **under five minutes** to an approved brief; **under 90
seconds** if the user arrives with a well-formed idea.

## User intent

*"I have a rough idea. Help me say what it actually is."*

They are willing to think, but not to fill in fields. They will hit questions
they can't answer and need that to be costless. They want to see it going
somewhere.

---

## The central design problem

A pure chat interface has no visible destination — the user can't tell whether
they're two exchanges or twenty from being done, and that uncertainty is the
main reason people quit a conversational UI.

**Solution: the Brief Panel.** The artifact assembles in a right rail, in view,
while they talk. The conversation is the input; the brief is the output; both
are on screen simultaneously. The user always knows how close they are because
they can see the thing being built.

This is the single most important structural decision on this page.

---

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Startup Validator    ① Define ●  ── ② Validate ○ ── ③ Roadmap ○   [Copy link]│  ← Run Shell
│ RUN 7f3a91c4 // STARTED 14:02 // DRAFT                                        │  ← Meta Line
├──────────────────────────────────────────────────────────────────────┬───────┤
│                                                                       │       │
│  CONVERSATION  (flex, max 64ch measure, centred in its column)        │ BRIEF │
│                                                                       │ PANEL │
│  ┌─────────────────────────────────────────────────────┐             │ 400px │
│  │ Let's work out what you're building.                │  ← h1        │ sticky│
│  │ (muted / bright split)                              │             │       │
│  └─────────────────────────────────────────────────────┘             │       │
│                                                                       │       │
│  ▸ you                                                                │  [Brief]     │
│    I want to do something in fitness, I don't know                    │  ─────────── │
│    what yet                                                           │              │
│                                                                       │  One-liner   │
│  ▸ AI                                                                 │  ░░░░░░░░░   │ ← shimmer
│    Fitness is broad, so let's narrow it before we                     │              │
│    research anything. Who's the person you picture                    │  Product     │
│    using this — and what are they doing about it today?               │  unknown  →  │ ← tagged
│                                                                       │              │
│    ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐         │  Customer    │
│    │ People who quit  │ │ Home-gym owners  │ │ Coaches     │         │  People who  │
│    │ the gym          │ │                  │ │             │         │  quit the gym│ ← filled
│    └──────────────────┘ └──────────────────┘ └─────────────┘         │              │
│         ↑ suggestion chips — one-click answers                        │  Problem     │
│                                                                       │  ░░░░░░░░░   │
│  ▸ you                                                                │              │
│    I don't know                                     ← from the button │  …           │
│                                                                       │              │
│  ▸ AI                                                                 │  ─────────── │
│    That's fine — I'll note it as something to find out.               │  3 unknown → │
│    Let me ask something you'll definitely know…                       │  open        │
│                                                                       │  questions   │
│                                                                       │              │
│  ╭───────────────────────────────────────────────────────╮           │  ┌────────┐  │
│  │ Type your answer…                                      │           │  │Approve │  │ ← .btn-primary
│  │                                                        │           │  │and     │  │   (the ONE)
│  │  [ I don't know ]                            [ Send ] │           │  │research│  │
│  ╰───────────────────────────────────────────────────────╯           │  └────────┘  │
│         ↑ always present, one tap                                     │              │
│                                                                       │  Takes about │
│                                                                       │  5 minutes.  │
├──────────────────────────────────────────────────────────────────────┴───────┤
│  RUN 7f3a91c4                    [Copy link]      Start another idea →        │  ← thin footer
└──────────────────────────────────────────────────────────────────────────────┘
```

Column split: conversation `1fr` (max 760px), Brief Panel `400px` fixed, 48px
gap. Brief Panel is `position: sticky; top: 96px`.

---

## The conversation column

### Message rendering — not chat bubbles

**Messages are typeset, not bubbled.** Chat bubbles read as a toy; this
conversation is producing a document and should look like a transcript in a
well-set report.

```text
▸ you
  I want to do something in fitness, I don't know what yet

▸ AI
  Fitness is broad, so let's narrow it before we research anything.
```

| Part | Treatment |
|---|---|
| Role marker | `▸ you` / `▸ AI` — `--font-mono`, 11px, `--text-tertiary`, `--accent` for the `▸` on AI turns |
| User message | `--text-body`, 16px, `--leading-relaxed`, 64ch measure |
| AI message | `--text-primary`, 16px, `--leading-relaxed`, 64ch measure |
| Gap between turns | 32px |
| Gap between role marker and text | 8px |
| Background | None. No cards, no bubbles, no dividers. |

The AI's turns are brighter than the user's because the AI's turns are what the
user is reading; their own words are context.

**AI turn length is a design constraint, not just a prompt concern:** the
interface is built for one to three short paragraphs plus at most one question.
If turns routinely exceed ~80 words, the interaction stops feeling like a
conversation. Flag this to whoever owns the prompt.

### Suggestion chips

When the AI offers concrete options — which the exec summary explicitly wants
it to do ("If the idea is three products, say so and suggest which one to start
with") — those options render as chips beneath the message.

- `--bg-card`, `--r-md`, 12px 16px padding, `--text-body`
- Hover: border `--border-accent`, text `--text-primary`
- Click: sends that text as the user's turn immediately
- Max 4 chips, wrap to a second row
- Chips disappear once the turn is answered — they're not a persistent control

This converts D3 in [04](04-user-journeys.md#48-decision-points-consolidated)
from a typing task to a click.

### The Don't-Know Button

**The most important control on this page.** The exec summary calls accepting
"I don't know" *"the single most important rule in the conversation."* A rule
that important gets a button, not a hope that the user types it.

```text
╭─────────────────────────────────────────────────────────╮
│  Type your answer…                                       │
│                                                          │
│   [ I don't know ]                            [ Send ]  │
╰─────────────────────────────────────────────────────────╯
```

- Present from the first AI question, always, never contextual
- Style: `.btn-secondary.btn-sm` — visible, unembarrassing, not primary
- Click: sends `I don't know` as a user turn and flags the current question as
  unresolved on the server
- The AI must acknowledge briefly and move on, never re-ask (exec summary rule)
- Effect visible immediately in the Brief Panel: the corresponding field
  resolves to `unknown →` with an `open question` tag

The button's presence is itself the message: *not knowing is expected here.*

### Composer

- Auto-growing textarea, min 2 rows, max ~8 rows then internal scroll
- `Enter` sends; `Shift+Enter` newline (inverted from The Box on `/`, because
  here turns are short and sending is the dominant action)
- Focused on mount and re-focused after every AI turn completes
- Disabled with a subtle shimmer while the AI is streaming; the user can still
  type — input is buffered and sends when the turn ends. Never lose keystrokes.

---

## The Brief Panel

A live-rendering view of the `brief_json` object from the exec summary.

### Field states

| State | Rendering |
|---|---|
| **Not yet determined** | Label + a 3-line shimmer block (`--bg-surface`, subtle sweep). Not "empty" — *pending*. |
| **Being determined** | Shimmer gains a faint amber tint for ~600ms as the value arrives, then settles. Draws the eye to what just changed. |
| **Filled** | Label in `--text-tertiary` 11px mono; value in `--text-primary` 15px. Hover reveals a `Pencil` glyph at the right. |
| **Unknown** | Value renders as `unknown` in `--text-muted` italic, followed by an amber `→ open question` tag at 11px. |
| **Edited by user** | A small `edited` marker in `--text-tertiary` beside the label. Honest provenance, no styling change to the value. |

### Field order

Follows the exec summary's JSON, grouped with hairline dividers:

```text
[Brief]
────────────────────────────
One-liner                      ← always first, largest
────────────────────────────
Product
Customer
Who decides
────────────────────────────
Problem
How they solve it today        ← renders as a chip list
What makes this different
────────────────────────────
First version scope
How it makes money
How customers find it
────────────────────────────
Assumptions                    ← bulleted, --text-body
Open questions                 ← bulleted, amber bullets
────────────────────────────
3 unknown → open questions
```

The trailing summary line (`3 unknown → open questions`) is the panel's most
reassuring element: it reframes the gaps as scheduled work.

### Inline editing

Click any field (or its `Pencil` glyph) → the value becomes a borderless input
that adopts `--accent` border on focus.

- `Enter` or blur commits; `Esc` reverts
- Multi-line fields (problem, scope) become auto-growing textareas
- List fields (assumptions, alternatives) get per-item edit, an `×` to remove,
  and a `+ Add` text action
- Commits are optimistic with a quiet inline retry on failure — never a modal
- No save button. No form. No dirty-state warning.

### The Approve action

```text
┌─────────────────────────┐
│  Approve and research   │   ← .btn-primary, full-width in panel
└─────────────────────────┘
  Takes about 5 minutes.
```

**Enabled the moment the AI has proposed a brief** — not when the conversation
"finishes." This is what makes Journey B fast
([04](04-user-journeys.md#43--journey-b--well-formed-idea-the-fast-path)):
a user who sees a correct brief can go immediately.

Before a brief exists, the panel shows the shimmer skeleton and the button is
absent — not disabled. There is nothing to approve yet, so there is no button.

On click:
1. Button → `Starting research…` with inline spinner, pulse off
2. Brief locks (fields become read-only, `Pencil` glyphs fade)
3. Quiet line appears above the footer:
   `This page is your run. Bookmark it — there's no login to get back.`
4. Redirect to `/r/[slug]/validate`

Total perceived delay should be under a second; the research runs server-side.

---

## Interactions summary

| Trigger | Behaviour |
|---|---|
| Mount | Composer focused; AI's first message streams immediately (it was requested at run creation, so there's no dead air) |
| AI streaming | Text appears token-by-token; no per-token animation; auto-scroll only if the user is already near the bottom |
| User scrolled up | Auto-scroll suspends; a `↓ New message` pill appears bottom-centre of the column |
| Message sent | User turn appends instantly (optimistic); AI turn begins with a three-dot rest state |
| Brief field resolves | Amber-tinted shimmer → value, 600ms |
| Hover brief field | Background tint + `Pencil` glyph |
| Click brief field | Becomes input, text selected |
| Click `I don't know` | Sends turn; field resolves to `unknown →` |
| Click suggestion chip | Sends that text; chips clear |
| Click `Approve and research` | Lock, confirm line, redirect |
| Click `Define` in Stage Rail after approval | Returns read-only; a `Re-run research` secondary action appears, gated behind a confirm modal |

---

## States

### Loading (initial page load)
Run Shell renders immediately from server data. Conversation column shows the
h1 and a single AI shimmer block. Brief Panel shows the full skeleton. The
composer is present and focused — **the user can type before the AI's first
message finishes.**

### Default
As drawn.

### AI thinking
Three-dot rest indicator under `▸ AI`, `--text-muted`, gentle 1.4s opacity
cycle. No "AI is thinking…" copy — the dots suffice and don't age badly.

### Brief proposed (the key transition)
The Brief Panel fills, and a distinct AI turn announces it:
> *Here's what I've got. Edit anything on the right — then run the research.*

The panel gets a one-time `card--featured` amber ring for 1.2s, then settles.
The Approve button appears with its pulse. This is the moment the page changes
character and it should be felt.

### Error — message send failed
Inline under the failed turn:
`Couldn't send that. [Retry]` — text preserved in the composer, amber left
border, no modal.

### Error — AI stream interrupted
The partial turn stays visible, marked `— interrupted` in `--text-tertiary`,
with a `Continue` secondary action. Never delete partial content the user has
already read.

### Empty — no conversation yet
Not possible: the run is created with the user's opening text, so the
conversation always starts with at least one user turn.

### Locked (after approval)
Fields read-only, `Pencil` glyphs gone, a `--text-tertiary` line at panel top:
`Approved 14:07 · locked while research runs`. The conversation remains
scrollable and readable.

---

## Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| **≥ 1280px (target)** | Two columns as drawn: conversation `1fr` (max 760px) + Brief Panel 400px sticky. |
| **1100–1279px** | Brief Panel narrows to 340px; conversation measure holds at 64ch. |
| **900–1099px** | Brief Panel collapses to a **sticky bottom summary bar** showing the one-liner, the unknown count, and the Approve button. Tapping it opens the full brief as a right drawer. Conversation gets full width. |
| **< 900px** | Not designed for v1. The 900px rule above degrades acceptably: single-column conversation with a bottom bar. |

The 900px collapse is the one piece of adaptive layout worth building even in a
desktop-only MVP, because it's a genuine laptop width (a 1280px browser with
devtools open is ~900px) and the two-column layout breaks badly without it.

---

## Copy specification

| Element | Copy |
|---|---|
| Page h1 | `Let's work out` (muted) `what you're building.` (bright) |
| Composer placeholder | `Type your answer…` |
| Don't-know button | `I don't know` |
| Send button | `Send` |
| Panel label | `[Brief]` |
| Unknown value | `unknown` + `→ open question` |
| Unknown summary | `{n} unknown → open questions` |
| Approve button | `Approve and research` |
| Approve subtext | `Takes about 5 minutes.` |
| Post-approval note | `This page is your run. Bookmark it — there's no login to get back.` |
| Locked note | `Approved {time} · locked while research runs` |
| New message pill | `↓ New message` |

**Tone rules:** never congratulate the user ("Great answer!"), never use the
word "validate" as a verb aimed at them, never imply their idea is good or bad.
The AI is a thoughtful cofounder, not a cheerleader and not a judge.
