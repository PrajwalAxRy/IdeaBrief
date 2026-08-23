# Executive Summary: Startup Validator

> Fourth revision, August 2026. This is a deliberate reset.
>
> v3 is archived at `executive_summary_v3_archived.md` (1,809 lines), v2 at
> `executive_summary_v2_archived.md`. Both described a product that would take
> six to nine months to build and that a first-time founder with a half-formed
> idea could not use. This revision cuts to three things and a working product.

## What this is

A tool for someone who has an idea and wants clarity on it.

They arrive with a sentence, a hunch, or a half-formed direction. They leave with
three things: a clear written description of what they're actually building, an
evidence-backed picture of what the world already says about it, and a concrete
list of what to do next — both the questions only real humans can answer, and the
plan for building the thing.

It does not predict success. It does not score ideas. It does not gate, block,
or refuse. It takes a vague idea and makes it clearer, cheaply and quickly.

## Who it's for

People at the earliest stage: an idea in their head, no product, no customers,
often no company. First-time founders, side-project builders, people who just
quit or are thinking about it. They are not sophisticated buyers of research and
they will not tolerate a form.

Everything in this document assumes that user. Where v3 had a feature for
franchise buyers with personal guarantees, this has nothing — that person is not
the user.

---

## The three pillars

| | Pillar | What the user gets |
|---|---|---|
| **1** | **Define** | A conversation with an AI that turns a vague idea into a clear, structured description of the product, the customer, the problem, and the assumptions underneath it. |
| **2** | **Validate** | A research run that goes to the web, finds what's actually known, and reports back with every claim linked to a real source. |
| **3** | **Roadmap** | Two lists: **(a)** the open questions that only real people can answer, with the interview and survey material written out, and **(b)** a build roadmap for actually making the thing. |

That is the entire product. If a feature does not sit inside one of those three,
it is not in v1.

---

## What v1 deliberately does not have

This list is as important as the feature list. Everything here was in v2 or v3.

**Removed because the user is early-stage and these get in their way:**

- Gates of any kind — no legal gate, no safety gate, no feasibility gate, no
  blocking. If research surfaces something concerning, it appears as a finding
  and possibly as an open question. It never stops the run.
- Decision postures (RESEARCH / VALIDATE / STOP / PILOT / BUILD / SCALE), verdicts,
  and readiness ladders. A person with an idea doesn't need to be told which rung
  they're on.
- Any 0–100 score, composite index, or weighted rubric.
- Economic engines, archetypes, modifiers, routing, founder-constraint packs.
  One flow for every idea.
- Anchored 0–4 evidence levels, claim ledgers with lineage, contradiction
  graphs, per-claim boundary conditions.
- Founder-constraint intake: runway, capital budget, downside exposure, visa
  status, employment IP, personal guarantees.
- Financial models, unit economics templates, spreadsheet export.

**Removed because the priority is a working product:**

- Login, accounts, auth. A run lives at its own URL; that URL is the key.
- Billing, Stripe, pricing tiers, credits, free-tier design.
- Teams, collaboration, comments, sharing permissions.
- Monitoring, change alerts, email digests, drip campaigns.
- Caching strategy, concurrency governors, rate-limit capacity planning,
  token-budget optimization, model tiering.
- Evaluation harness, gold-standard report corpus, inter-rater agreement.
- Mobile design, WCAG work, accessibility audit, PDF export.
- Analytics, telemetry, outcome tracking, the data moat, pgvector, RAG over
  historical ideas.

**Kept from v3, because it is the one thing that makes this better than a chat prompt:**

- Mechanical citation verification. Every quoted excerpt is checked against the
  text of the page it came from before it can appear in the report. It costs
  almost nothing to build and it is the difference between real research and
  confident fiction.

---

## Pillar 1 — Define the idea

The user types one thing into one box. It can be a sentence, a paragraph, or
"I want to do something in fitness, I don't know what yet."

Then the AI talks to them. Not a form, not a wizard, not a progress bar — a real
conversation with someone who acts like a thoughtful cofounder. It asks what it
needs to ask, in whatever order makes sense, and it stops when the picture is
clear enough to research.

Across that conversation it should:

- **Clarify** — who exactly is this for, what are they doing today instead, what
  does the first version actually do.
- **Recommend** — actively. If the idea is three products, say so and suggest
  which one to start with. If the customer is "everyone," push back. If the
  described scope is six months of work, propose the two-week version.
- **Accept "I don't know."** For any question. This is the single most important
  rule in the conversation. An early-stage person doesn't know their pricing,
  their exact customer, or their channel — that's why they're here. Every "I
  don't know" is recorded and becomes either a research question for Pillar 2 or
  an open question in Pillar 3. It is never a blocker and never asked twice.

The conversation ends when the AI assembles an **idea brief** and the user
approves it. They can edit any field inline before approving.

```json
{
  "one_liner": "Software that automatically texts overdue dental patients to rebook",
  "product": "AI patient reactivation assistant for dental clinics",
  "customer": "Independent dental practices, 1-3 locations",
  "who_decides": "Practice owner or office manager",
  "problem": "Patients who miss their 6-month recall never get followed up on, and the front desk has no time to chase them",
  "how_they_solve_it_today": ["manual phone calls", "generic SMS reminder tools", "nothing"],
  "what_makes_this_different": "Focused only on recall, writes the messages itself, no staff time",
  "first_version_scope": "Connect to one practice management system, send messages, log rebookings",
  "how_it_makes_money": "unknown",
  "how_customers_find_it": "unknown",
  "assumptions": [
    "clinics have a meaningful number of lapsed recall patients",
    "the office manager can approve a purchase without a long process",
    "automated patient texting is permitted"
  ],
  "open_questions": [
    "what would clinics pay for this",
    "which practice management system to integrate with first"
  ]
}
```

Fields the user didn't answer are `"unknown"` and flow directly into
`open_questions`. Nothing is invented to fill a field.

**Target: from first input to an approved brief in under five minutes of
conversation.** If someone arrives with a well-formed idea, the AI should
recognize it, propose a brief almost immediately, and ask two questions at most.

---

## Pillar 2 — The validation engine

The brief goes to a research run. Same run for every idea — no routing, no
specialization.

### What it researches

Five dimensions, generated as search queries from the brief:

1. **The problem** — is there evidence this problem is real, who has it, how
   often, and what it costs them
2. **What exists already** — direct competitors, adjacent tools, and the manual
   workaround people currently use
3. **Demand signals** — people describing this problem in their own words:
   forums, communities, reviews, complaints, search behavior
4. **Money** — what people currently pay for solutions to this, and what
   competitors charge
5. **Practical realities** — anything that materially shapes the build: rules,
   platform dependencies, obvious technical constraints

That's it. Not eight dimensions, not conditional packs.

### How it runs

```text
Idea brief
    ↓
Generate ~15-20 search queries across the five dimensions
    ↓
Search (one API), rank results by title and snippet, fetch the top ~30 pages
    ↓
Extract findings: each one a claim + a verbatim excerpt + the URL
    ↓
VERIFY: excerpt must appear in the fetched page text. No match, discarded.
    ↓
Synthesize: one pass over the verified findings only
    ↓
Report
```

The verification step is a string match. It requires no model and takes
milliseconds. It is the entire trust proposition: nothing reaches the user that
isn't traceable to text on a page that was actually fetched.

### Evidence object

```json
{
  "id": "ev_12",
  "dimension": "money",
  "finding": "Weave charges $300-600/mo per location for practice communication",
  "excerpt": "Plans start at $299 per month per location...",
  "url": "https://example.com/pricing",
  "published_at": "2026-02-14",
  "stance": "supports",
  "verified": true
}
```

Six meaningful fields. v3 had twelve, and several of them were a model guessing.

### What the report says

Written in plain language. No jargon — no "posture," no "claim ledger," no
"non-compensatory," no "evidence level 2."

1. **What we found** — three to five sentences the user could say out loud to
   someone and defend, each linked to a source.
2. **Per dimension**, what the evidence says, with a plain confidence note:
   *solid*, *mixed*, or *we couldn't find much*.
3. **Who else is doing this** — a card per competitor: what they do, who they
   sell to, what they charge, how they differ from this idea, and the one thing
   to learn from them. Rendered from fields, not written as prose, so the
   numbers can't drift.
4. **What surprised us** — the two or three findings that most change how the
   idea should be thought about. This is the section people will screenshot.
5. **What we couldn't answer from the web** — the honest list, which becomes
   Pillar 3a.

There is no verdict. The most useful sentence a research run can produce for an
early-stage person is not "this is a 6/10," it is "three companies already do
this and charge $300 — here's what none of them do."

**Target: full report in under five minutes, with findings appearing on screen
as they're verified.** The page streams; the user watches queries run and
findings land. No fake percentages.

---

## Pillar 3 — The roadmap

Two parts, generated together from the brief plus the verified findings.

> **Revised August 2026.** The roadmap was rebuilt from first principles for the
> reader it actually has: someone who may be perfectly able to build the thing
> and has never run a business. What changed, and why, is recorded inline below.
> The one-line version: the page stopped being a build plan and became **the
> whole journey**, and the interview scripts were cut to make room.

### 3a — Open questions for real people

The web cannot tell you whether someone will pay you. This section names exactly
what's still unknown and who to go ask.

Each open question renders as:

```text
QUESTION    Do clinics actually track which patients are overdue?
WHY IT      If they already have a list, this is an automation product. If they
MATTERS     don't, you have to build the list first, which is a different
            product and a much harder sell.
ASK         Office managers at independent practices, 1-3 locations
FIND THEM   Dental office manager Facebook groups; r/dentistry; local practices
            you can walk into; the 40+ named people in dental forum threads
            we found (links below)
HOW MANY    6-8 conversations is enough to see the pattern
```

Rules for this section:

- **Where to find people is specific**, and pulled from the research run. If the
  run found three active communities where this customer talks, name them with
  links. That is a real output of Pillar 2 and it costs nothing extra, and it is
  **the only place on the roadmap that cites** — everything else here is plan,
  not evidence.
- **Between four and seven questions, ordered by how much they'd change the
  plan.** Not fifteen.
- Each one names the steps it unblocks, and the tripwires it could trip.
- **The written-out interview script and the survey material are cut.** They
  were the largest thing on the page — roughly half its height — and they bought
  none of the orientation the reader actually arrives needing. A script is also
  the part of this a capable person can write themselves once they know the
  question and who to ask; the sequencing and the ambushes are not. This is a
  deliberate reduction in scope, not an oversight.
- The open questions are **no longer a peer of the plan.** They are what the
  plan's first track expands into: the chart links into them and they link back.

### 3b — The journey

Not a build plan. **The whole road from here to a paying customer**, specific to
this idea. Still not generic lean startup advice — the rule that keeps it honest
is that nothing appears in generic form: the skeleton is universal, but every
line is instantiated against this idea, with this idea's numbers.

It renders as a chart of overlapping bars on **tracks** — talk, prove, build, get
found, sell, and the administrative track — with **milestones** flagged above it.
Tracks are data, not a fixed list: a marketplace needs a supply-seeding track
before demand, a hardware idea needs manufacturing lead time, a consumer app
needs store review.

Four rules make it work, and each one exists because the obvious alternative
lies to the reader:

**1. Estimate the clocks you don't control. Milestone the ones you do.**
Carrier registration takes two to three weeks whether the founder is brilliant
or slow. "Build the MVP" is unknowable, and a number printed on it is a lie that
becomes a source of shame when it slips. So a bar carries a week range **only**
when someone else owns the clock, and the two kinds of bar look different — solid
and hard-edged versus soft and open-ended. The reader learns the rule from the
picture.

**2. Bars anchor to each other, never to dates.** "Starts at ~80% built, not
after" is a real, observable trigger. This is the only way to state *overlap*
without inventing a schedule — and overlap is the point. The realisations the
page exists to produce are all of the form *marketing starts before the product
is finished*, *the partner application starts before the build ends*.

**3. There is no axis, no scale and no gridline.** Drawing a "month 4" rule
promises a date the model cannot keep.

**4. The critical path is not the code.** Summing the external clocks yields the
single most useful sentence available: *ten to thirteen of these weeks are not
yours, and they run alongside your build only if you start them early.* The
founder who applies to a partner programme after finishing the build loses two
months for nothing.

Alongside the chart, three things the reader cannot get anywhere else:

- **What you'll hit that you're not expecting.** The highest-value content on the
  page and the easiest to fill with slop, so it is generated rather than
  brainstormed: five species (a hidden lead time, a threshold where free stops
  being free, an obligation that starts with the first customer, a signal that
  arrives later than you'd think, an early success that won't repeat) asked of
  one idea. An entry must name a proper noun or a threshold, and must cost time,
  money or legality — if the worst outcome is embarrassment it is a tip, not an
  ambush. **There is no per-bar quota**; most bars carry none, because a quota is
  exactly what manufactures filler. Ambushes that came out of the research run
  carry a citation; ones merely implied by the idea do not, and the ones true of
  any first business are capped at three.
- **What it costs**, in bands — `$` / `$$` / `$$$` — defined once in real money
  and never as a price. Prices rot; a fixture asserting a per-message rate is
  wrong within a year and makes every other number suspect. Bands are also what
  the reader needs: nobody decides differently between $18 and $24 a month. The
  block carries the free-credit programmes *and the caveat that makes them
  useful* — apply once the company exists, because the clock starts on
  acceptance.
- **What would change all of this** — the tripwires. This is where "no verdict"
  lives. Never *your idea is risky*; always *if this comes back false, here is
  the different plan*.

The journey is explicitly wired to 3a: each bar names the open questions it
unblocks, and each question names the bars it would change. That link is the
whole reason both halves are in one product.

It should be honest about sequencing and aggressive about cutting. The most
valuable thing this section can do for an early-stage person is tell them what
*not* to build yet — and when to start the things that are not building at all.

---

## End-to-end flow

```text
One box. A sentence, or "I have a rough idea."
        ↓
Conversation with the AI cofounder — clarifies, recommends, accepts "I don't know"
        ↓
Idea brief assembled → user edits inline → approves
        ↓
Research run: queries → search → fetch → extract → VERIFY EXCERPTS → synthesize
        ↓
Report: what we found, per dimension, competitors, surprises, what's still unknown
        ↓
Roadmap: (a) open questions with scripts and where to find people
         (b) build plan, wired to those questions
        ↓
Everything lives at one URL. Bookmark it, share it, come back to it.
```

---

## Data model

Five tables. No users table.

```text
runs
  id (also the URL slug), created_at, status, current_step

briefs
  run_id, brief_json, conversation_json, approved_at

evidence
  id, run_id, dimension, finding, excerpt, url, published_at, stance, verified

report
  run_id, summary_json, dimensions_json, competitors_json, surprises_json

roadmap
  run_id, open_questions_json, journey_json
```

`journey_json` carries the tracks, the bars, the milestones, the cost model and
the tripwires. It replaced `build_plan_json` when 3b stopped being a build plan.

`runs.id` is a long random slug. That is the entire access model for v1 — no
accounts, no sessions, no permissions. Anyone with the link has the run.

---

## Tech stack

Deliberately boring and small.

```text
App         Next.js — UI and API routes in one deployment
Database    Postgres (Supabase or Neon free tier), plain SQL or Prisma
LLM         One model for everything. Claude Sonnet for the conversation and
            extraction, Opus for synthesis if quality demands it.
Search      One provider — Exa or Tavily
Fetching    The search provider's own content API where possible;
            Firecrawl only for pages that fail
Jobs        A row in `runs` with a status, polled or streamed via SSE.
            No Redis, no queue, no worker service.
Hosting     Vercel
```

No auth provider. No Stripe. No object storage. No vector database. No Redis.

If the research run outlives a serverless function timeout, run it as a
long-running route or a single small worker process — not a queue system.

---

## Build plan

Four weeks to something a real person can use. Sequenced so there's a working
thing at the end of each week.

**Week 1 — Pillar 1**
One page, one box, the conversation, the brief. Brief assembles and saves to
Postgres. No research yet. At the end of this week you can hand the URL to
someone and they'll get a clear written version of their idea, which is already
worth something.

**Week 2 — Pillar 2, the pipeline**
Query generation, search, fetch, extraction, and the verification string match.
Output is raw JSON on a debug page. The goal this week is that the evidence is
real and verified, not that it looks good.

**Week 3 — Pillar 2, the report**
Synthesis and the rendered report page. Competitors and per-dimension sections
render from fields; only the summary and the surprises are model-written.
Streaming progress on screen.

**Week 4 — Pillar 3**
Open questions with community links, and the journey wired to them — tracks,
bars, milestones, the ambushes and the cost bands. Then polish the whole path end
to end and put a real idea through it.

**Then:** put ten real ideas through it, from ten real people, and watch where
the output is thin. Fix that before adding anything from the list below.

---

## What comes after it works

Not now. Recorded so it doesn't get re-litigated.

- Accounts, so people can find their old runs without a bookmark
- A way to charge
- Recording what happened after the interviews, and updating the brief
- Re-running research on an idea that has changed
- Comparing two or three ideas side by side
- Idea-type specialization, if the universal flow proves too shallow for
  non-software ideas

---

## Open decisions

1. **Where does the conversation end?** The AI decides when it has enough for a
   brief. If it's too eager, briefs are thin; too persistent and it becomes the
   form we deleted. Start eager — propose a brief early and let the user push
   back — and tune from real transcripts.

2. **How much does one run cost?** Roughly 30 fetched pages plus extraction plus
   synthesis. Needs measuring in week 2, because if it's $5 the product is
   different from if it's $0.50.

3. **What happens when the web has nothing?** For a genuinely novel or very
   local idea, most dimensions come back empty. The report must say "we found
   very little, and that isn't evidence against your idea" — and Pillar 3 becomes
   the whole product for that user. Worth designing before it happens by accident.

4. ~~**Does the build roadmap need to know the user's technical ability?**~~
   **Decided, August 2026: no — assume they can build it or will find someone.**
   The reader we are actually designing for is *technically capable and
   commercially naive*: an engineer with an idea. They do not need "how to
   deploy"; they need to know that carrier registration exists, that a company
   has to exist before Stripe will pay them, and that $200 a month means 42
   customers for $100k. Asking a technical-ability question in Pillar 1 was the
   scope creep this decision was worried about, and the branch it would have fed
   (no-code, hire-someone) is gone.

   One thing survived the decision: the *prove it by hand* stage. It is no
   longer justified by "you can't code" — it is justified by "don't write the
   automation until you know the conversion rate it's automating", which is the
   version a capable builder respects rather than resents.
