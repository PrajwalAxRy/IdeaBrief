# 17 — Open Questions, Assumptions & Flagged Risks

Everything this blueprint decided on incomplete information, everything it
inherited as unresolved, and the risks worth revisiting before build.

---

## 17.1 Assumptions made (decided, documented, reversible)

Where the executive summary left UX unspecified, these decisions were made and
the reasoning recorded. Each is a real fork, not a default.

### A1 — The conversation is typeset, not bubbled

**Assumed:** messages render as a transcript (`▸ you` / `▸ AI` + prose), not as
chat bubbles.
**Why:** the conversation is producing a document, and bubbles signal
"messaging app," which sets the wrong expectation about what's being made. It
also lets AI turns use the full 64ch measure rather than a constrained bubble.
**Reverse if:** users don't understand whose turn is whose. Cheap to change.

### A2 — The Brief Panel exists at all

**Assumed:** the brief assembles in a visible right rail during the
conversation rather than appearing only at the end.
**Why:** a chat with no visible destination is the main cause of mid-conversation
abandonment. This is the largest structural addition this blueprint makes
beyond the exec summary's description.
**Cost:** the brief must be emitted incrementally (partial `brief_json` as
fields resolve), not only at the end. **That's a real requirement on the Pillar
1 implementation and needs confirming with whoever builds it.**
**Reverse if:** incremental brief emission proves impractical — the fallback is
a skeleton panel that fills in one step when the AI proposes, which loses most
of the benefit.

### A3 — Approve is available before the conversation ends

**Assumed:** once the AI has proposed a brief, the user can approve immediately
without answering further questions.
**Why:** it's what makes the exec summary's "well-formed idea → brief in two
questions" target actually fast. Forcing conversational completion would
undermine it.
**Risk:** users approve thin briefs and get thin research. Mitigated by the
unknown-count line in the panel, which makes thinness visible before approval.

### A4 — Report and roadmap are separate routes, not one long page

**Assumed:** `/validate` and `/roadmap` are distinct.
**Why:** they have different intents (understanding vs acting) and different
reading modes. One page would be very long and would bury the roadmap.
**Tension:** it slightly contradicts "everything lives at one URL." Resolved by
`/r/[slug]` being the canonical shareable URL that resolves to the report, with
sub-paths as deep links the user needn't know about
([03](03-information-architecture.md#route-map)).

### A5 — Open questions and build roadmap share one page

**Assumed:** Pillar 3a and 3b are two sections of one scrolling page, not two
tabs.
**Why:** the Dependency Chips wiring them together only feel like connections
if both halves are in one document. Tabs would break the mechanism the exec
summary calls *"the whole reason both halves are in one product."*

### A6 — `localStorage` recent runs

**Assumed:** the browser remembers visited runs.
**Why:** no auth means the URL is the only key, and losing it is the most
predictable failure in the product. ~30 lines, no backend, no data-model change.
**Limit:** doesn't survive cleared storage or a different device, and the UI
says so plainly rather than implying durability it lacks.

### A7 — The discard count is shown prominently

**Assumed:** `18 DISCARDED` is a permanent, visible number.
**Why:** advertising what was rejected is the strongest available statement
that the verification filter is real. This is the highest-confidence design
call in the document and the cheapest to implement.

### A8 — Confidence is never colour-coded

**Assumed:** `solid` / `mixed` / `thin` render as neutral bars + a word, never
green/amber/red.
**Why:** traffic-light colours read as a verdict, and the product's central
commitment is that it doesn't give verdicts. Colour-coded dimensions would
reintroduce scoring through the back door.

### A9 — Model prose never renders as markdown

**Assumed:** structured fields render through typed components; only the
summary and surprises are free prose, and those render as plain paragraphs with
resolved citation chips.
**Why:** the exec summary requires competitor data to render from fields *"so
the numbers can't drift."* Markdown rendering would hand layout control to the
model and let it produce headings, tables, and emphasis the design doesn't
account for.

### A10 — Onboarding is one hint

**Assumed:** the only instructional UI is a one-time hover hint on the first
citation chip.
**Why:** a product whose promise is "type one thing and go" can't open with a
tour. The citation mechanic is the one genuinely non-obvious interaction and
the one worth a sentence.

---

## 17.2 Flagged risks

### R1 — Shared links open on phones

**The risk.** The product's only distribution mechanism is a founder sending
their report link to an advisor, a friend, or a potential cofounder. A large
share of those recipients will open it on a phone. The desktop-only decision
means they'll get an unoptimised layout at exactly the moment the product is
trying to make its best impression on a new person.

This is the one scope decision in the blueprint that carries real product risk
rather than just polish risk.

**What's already mitigated for free:**
- Every layout is two-column-max with a defined collapse rule
- `ProseColumn` + the `clamp()` type scale produce a correct single-column
  reading experience
- The report is ~80% mobile-readable by construction

**What would break:** the Open Question labelled grid (unusable below ~900px
without the stacking rule), the Define two-column layout, and the Evidence
Drawer at 480px on a 390px screen.

**Recommendation.** Build the three collapse rules in
[13 §13.2](13-responsive-and-accessibility.md#the-three-collapse-rules-worth-building)
— roughly half a day — which makes the report and roadmap *readable* on a phone
without any mobile design work. Full mobile optimisation stays cut.

**Decision needed from:** the product owner, before Week 3.

### R2 — The five-minute wait is the product's biggest funnel risk

Three to five minutes with no output is a long time, and the run happens before
the user has received anything of value beyond the brief.

**Mitigations already designed:** real query ticker, live findings, discard
count, explicit permission to close the tab, no fake percentage.

**The single biggest lever is not a UI decision:** how fast the *first verified
finding* lands. If the pipeline can be arranged to return one verified finding
within ~45 seconds — even by prioritising one fast, likely-productive query —
that buys more patience than every other mitigation combined.

**Action:** raise with whoever builds the Pillar 2 pipeline. This is a
frontend-informed backend requirement.

### R3 — The Brief Panel requires incremental brief emission

Per A2. If Pillar 1 only produces `brief_json` at the end of the conversation,
the panel's core value (visible progress toward an artifact) is lost.

**Action:** confirm before Week 1 that the conversation layer can emit partial
brief state as fields resolve.

### R4 — Citation numbering must be stable and global

`[12]` must mean the same finding in the report, the sources page, and the
roadmap. If numbering is assigned per-section or regenerated per render, the
citation system silently breaks in a way that's hard to notice and destroys
trust when a user does notice.

**Action:** `lib/citations.ts` owns this, assigned once at report generation
and persisted. Not computed at render time.

### R5 — AI turn length is a UI constraint

The conversation layout assumes one to three short paragraphs plus one
question per turn. If turns routinely run 200+ words, the interaction stops
feeling like a conversation and the Define page's design premise fails.

**Action:** this belongs in the Pillar 1 system prompt, and whoever owns it
should know the UI depends on it.

### R6 — Contrast tokens likely fail WCAG AA

`--text-muted` on `--bg-base` is roughly 3.0:1. This is inherent to the skill's
palette and the dark-luxury aesthetic depends on it. Accepted for v1 and
documented in [13](13-responsive-and-accessibility.md#known-gaps-accepted-for-v1)
so nobody claims conformance the product doesn't have.

### R7 — Two open exec-summary decisions have UI consequences

Carried forward from the executive summary's own "Open decisions" section:

| Exec summary question | UI consequence | This blueprint's position |
|---|---|---|
| **#1 Where does the conversation end?** | Determines how many turns the Define page must comfortably hold, and how often the "brief proposed" transition fires early vs late | Designed for 3–8 turns with an early proposal. The Approve-before-completion rule (A3) makes an over-eager AI harmless and an over-persistent one merely slow. |
| **#3 What happens when the web has nothing?** | The thin-evidence variant | **Fully designed** ([07](07-page-validate.md#thin-evidence-variant), [04](04-user-journeys.md#45--journey-d--the-thin-evidence-run)). The exec summary asked for this to be designed before it happens by accident; it now is. |
| **#4 Does the roadmap need the user's technical ability?** | Would add one question to the conversation and change the `FIRST THING TO BUILD` copy | **No UI impact either way.** The roadmap renders whatever the model produces. Safe to defer, as the exec summary suggests. |
| **#2 What does a run cost?** | None | Purely a backend question in v1 (no billing UI). |

---

## 17.3 Genuinely open UX questions

Things this blueprint could not decide from available information. Each needs a
product answer, not a design one.

### Q1 — Should the Define stage remain visible after approval?

Currently: yes, read-only, with a `Re-run research` action.

**For:** transparency; a cold visitor can see the brief that produced the
report, which builds trust in the research.
**Against:** it exposes a rough conversation the founder might not want an
advisor reading.

**Suggested resolution:** keep the *brief* visible, and consider collapsing the
*conversation transcript* behind a `Show the conversation` action. Cheap, and
it separates the artifact from the working.

### Q2 — What happens if the user disagrees with the report?

There is currently no mechanism to flag a finding as wrong, irrelevant, or
misread. Adding one would mean feedback UI, storage, and a moderation question
— none of which is in scope.

**Suggested resolution:** none in v1. Watch the ten real users; if
disagreement is common, it's a signal about extraction quality rather than a
missing feature.

### Q3 — Should there be any way to edit the brief and re-run?

Designed as available (secondary action + confirm modal), but the exec summary
lists *"Re-running research on an idea that has changed"* under "after it
works."

**Suggested resolution:** ship the confirm-gated re-run only if it's nearly
free given how the pipeline is built. Otherwise cut it and let users start a
new run. Flagged because the UI currently assumes it exists.

### Q4 — How many findings should a dimension accordion show at once?

Twelve Finding Cards in one expanded section is a lot of vertical space.

**Suggested resolution:** show all of them — the accordion is already opt-in,
and a "show more" inside a "show more" violates the one-expansion-to-evidence
rule ([11](11-interaction-patterns.md#111-progressive-disclosure--the-products-core-pattern)).
Revisit only if runs routinely produce 20+ findings per dimension.

### Q5 — Does the surprise section need exactly 2–3 items?

The exec summary says two or three. The `SurprisePanel` is designed for that
count and would look thin at one and crowded at five.

**Suggested resolution:** treat 2–3 as a hard constraint on the generation
side, not something the UI adapts to. If only one genuine surprise exists,
showing one is more honest than padding — but the panel needs a single-item
layout variant, which is currently unspecified.

### Q6 — Should the run console keep a permanent record?

After a run completes, the console disappears — the query list, the timings,
and the discard count are only visible in the header Meta Line.

**Suggested resolution:** the Sources page already preserves the findings and
the discard count. Consider adding the query list there too; it's the cheapest
way to keep the "we actually searched for these things" evidence available
after the fact. Not decided.

---

## 17.4 What to verify before writing code

A short list of things that would change the design if they turn out
differently than assumed.

1. **Can Pillar 1 emit partial brief state?** (R3 — affects the Define layout
   fundamentally)
2. **Can the pipeline return one verified finding in under ~60s?** (R2 —
   affects run abandonment more than any UI choice)
3. **Is citation numbering assigned once and persisted?** (R4)
4. **Are AI turns constrained in length?** (R5)
5. **Is the mobile fallback approved?** (R1 — half a day, needs a decision)
6. **Does `mix-blend-mode: overlay` render the grain correctly in Safari and
   Firefox?** (Affects the signature texture; ten minutes to check)

Items 1, 2, and 5 are the ones that would cause real rework if discovered late.
