# Startup Validator — Build Plan

## What this is

An AI-powered market due-diligence tool. A founder enters an idea; the system runs automated desk research, scores it against a deterministic rubric, and returns a report with evidence, validation experiments, and a rough starting plan.

Not a prediction engine. Not a chatbot. Automated research + a scoring rubric + an LLM that explains the output.

Position it as: **"AI-powered pre-validation / market due diligence"** — not "AI tells you whether your idea will succeed."

---

## 1. Core pipeline

```
Founder enters idea
        ↓
LLM normalizes idea → structured JSON hypothesis
        ↓
Research queries generated per dimension
        ↓
Parallel web research (market, competition, demand, pricing, regulation)
        ↓
Structured evidence extracted (20–50 objects)
        ↓
Specialist agents analyze evidence
        ↓
Deterministic scoring formula
        ↓
Confidence score (calculated separately)
        ↓
LLM writes report from structured data
        ↓
Verdict + experiments + rough build path
```

---

## 2. Idea normalization

Don't research the raw sentence. First convert it to structured JSON:

```json
{
  "product": "AI patient reactivation assistant",
  "category": "Dental SaaS",
  "business_model": "B2B SaaS",
  "customer": "Independent dental clinics",
  "buyer": "Practice owner / practice manager",
  "problem": "Patients fail to schedule follow-up appointments",
  "existing_alternatives": ["manual phone calls", "SMS reminder software", "dental PMS"],
  "key_assumptions": [
    "clinics lose meaningful revenue from unbooked recalls",
    "existing tools perform poorly",
    "clinics will permit AI communication with patients"
  ]
}
```

Every downstream agent works from this, not the original sentence.

---

## 3. Research queries

Generate queries across six dimensions and run in parallel:

- Market (TAM, growth, trends)
- Problem (frequency, severity, customer complaints)
- Competitors (direct, indirect, pricing, positioning)
- Pricing (what people currently pay)
- Demand signals (Reddit, forums, communities)
- Regulatory (compliance, platform risk)

Example for the dental idea:
```
"dental patient recall software pricing"
"dental practice missed recall appointments statistics"
site:reddit.com dentists recall patients software
"dental patient communication HIPAA AI"
```

---

## 4. Research layer

Use APIs — don't scrape:

```
Search      Exa / Tavily / Bing / SerpAPI
Extraction  Firecrawl / Playwright
Signals     Reddit, Product Hunt, Google Trends
```

Each result becomes a structured evidence object:

```json
{
  "type": "customer_pain",
  "claim": "Dental practices struggle with overdue patient recalls.",
  "source_type": "industry_report",
  "published_at": "2026-05-12",
  "relevance": 0.91,
  "quality": 0.85,
  "supports": true
}
```

Target 20–50 high-quality evidence objects per validation, not hundreds of raw pages.

---

## 5. Specialist agents

Four agents, each returning structured scores with evidence IDs — no free-form text:

**Demand**
```json
{ "problem_frequency": 82, "problem_severity": 71, "search_demand": 62, "trend_direction": 76 }
```

**Competition**
```json
{ "market_saturation": 68, "pricing_power": 73, "differentiation_opportunity": 61, "incumbent_strength": 77 }
```
This agent also emits the per-competitor profiles (geography, moat, difference from idea, take/ignore) described in [8a](#8a-competitive-landscape-per-competitor-profile) — the scores above are the rollup, the profiles are the evidence behind them.

**Economics**
```json
{ "likely_acv": 2400, "gross_margin_potential": 91, "sales_complexity": 52, "expected_retention": 72 }
```

**Risk**
```json
{ "regulatory_exposure": 60, "technical_risk": 40, "platform_dependency": 30 }
```

---

## 6. Deterministic scoring

Don't let the LLM invent the score. Calculate it:

```
Problem / demand             25%
Customer specificity         10%
Competitive opportunity      15%
Monetization                 15%
Distribution / GTM           15%
Technical feasibility        10%
Regulatory / execution risk  10%
```

```python
score = (
    demand * .25 + customer * .10 + competition * .15 +
    monetization * .15 + gtm * .15 + feasibility * .10 + risk * .10
)
```

Store the rubric version alongside every score. When the formula changes, historical scores stay interpretable.

---

## 7. Confidence score (separate)

```
Viability:   82/100   ← how attractive the idea looks
Confidence:  41/100   ← how much to trust that number
```

Calculate from: evidence coverage × source quality × freshness × agreement between sources × number of independent sources.

Low confidence = thin evidence. The system should say so explicitly rather than presenting weak findings with false certainty.

---

## 8. Report

Feed the LLM structured data — it explains the analysis, it doesn't decide it:

```
idea.json / evidence.json / scores.json / competitors.json / risks.json
```

Output:

- **Verdict** — PROMISING / NEEDS WORK / KILL + score + confidence
- **Why** — 4–6 bullets tied to evidence
- **Biggest risk** — the single assumption most likely to kill it
- **Competitive landscape** — per-competitor profile, see below
- **Wedge** — sharper positioning from competitive gaps
- **What would invalidate this** — the specific primary research finding that would change the conclusion

---

## 8a. Competitive landscape (per-competitor profile)

The competitors list in a report today is a flat set of names, pricing, strengths/weaknesses. Not enough to act on. Each competitor entry in the report should answer six questions, in this order:

```
1. Who are they?          name, one-line description, funding/scale signal if known
2. Where do they operate?  country/region of HQ + where they actually sell
                           (local, regional, or global) — not the same thing
3. How are they different  the specific axis of difference from the user's idea
   from the idea?          (narrower/broader scope, different buyer, different price
                           point, different delivery model) — not a strengths list
4. What's their moat?      distribution, switching cost, brand, data, network effects,
                           regulatory license, capital — name the real one, or say "none"
5. What to take from them  the one thing validated by their existence (e.g. pricing
                           anchor, proof of willingness to pay, a channel that works)
6. What to ignore          the thing about them that doesn't transfer to this idea
                           (their scale, their breadth, their market — don't chase it)
```

Structured object per competitor:

```json
{
  "name": "Weave",
  "url": "https://getweave.com",
  "geography": {
    "hq_country": "United States",
    "operating_scope": "regional",     // "local" | "regional" | "global"
    "markets_served": ["US", "Canada"]
  },
  "scale_signal": "Series C, ~$50M raised, 500+ employees",
  "positioning": "All-in-one practice communication platform (calls, texts, payments) for dental/vet clinics",
  "pricing": "$300–600/mo per location",
  "difference_from_idea": "Weave is a broad communication suite; the idea is narrowly focused on recall automation only — a wedge if depth beats breadth, a risk if Weave bundles this in for free",
  "moat": "Deep PMS integrations + multi-year contracts + incumbent brand trust in the vertical",
  "take_from_them": "Their $300–600/mo price point validates willingness to pay in this vertical — use it as a pricing anchor, don't underprice out of fear",
  "ignore": "Their feature breadth and headcount — don't compete on surface area, compete on doing recall automation better than a 10% feature of their suite"
}
```

Rules for the writer LLM:
- Never output a competitor entry with a missing `geography` or `moat` — if research didn't surface it, say "not established from available evidence," don't omit the field or guess.
- `difference_from_idea` must name a specific axis (scope, buyer, price, delivery), not a vague "they're bigger."
- `take_from_them` and `ignore` must each be one concrete, actionable sentence — not a restated strength/weakness list.

---

## 9. Validation experiments

Convert top unvalidated assumptions into testable hypotheses:

```
Assumption   Dental clinics lose >$2k/month from overdue recalls.
Test         Interview 10 practice managers.
Pass         7/10 report >$1k monthly impact.

Assumption   Current recall software isn't effective.
Test         Ask them to show current recall workflow.
Pass         5/10 rely substantially on manual follow-up.

Assumption   They'll pay $199/month.
Test         Offer pilot at $199.
Pass         2 of first 10 agree to pay.
```

---

## 10. Rough build path

Generate a starting plan from the idea's specific risks and customer type — not generic lean startup advice:

```
Week 1–2   Talk to 10 people in [specific customer segment]
           Ask: [3 questions targeting top unvalidated assumptions]

Week 3     Build a landing page — one sentence, one email capture

Week 4     Drive 200 visitors via [channel chosen from customer type]
           Pass condition: 15% signup rate

If pass → Week 5–6: Build the smallest version that tests assumption #1
If fail  → Redefine the customer or the problem
```

A B2B SaaS idea gets different advice than a consumer app. A regulatory risk becomes step one.

---

## 11. Tech stack

```
Frontend    Next.js / React
API         Node/TypeScript or Python/FastAPI
Database    Postgres + pgvector
Auth        Supabase / Clerk / Auth0
Jobs        Redis + BullMQ
LLM         One strong model initially
Search      Tavily / Exa / SerpAPI
Crawler     Firecrawl
Analytics   PostHog
Payments    Stripe
Storage     S3-compatible
```

Validation is async. Stream progress to the UI via SSE — the "researching..." phase should be visible and feel like work is being done.

---

## 12. Start with one model

Don't start with a multi-model ensemble. Start with:

```
1 model + 4 role prompts + search + rubric
```

Most early improvement comes from better evidence → better rubric → better prompts, not another model.

Later, add a second model only as a critic:

```
Research model → conclusion
Critic model   → "which conclusions are unsupported?"
               → re-research weak claims
```

---

## 13. Data layer and moat

Save everything for every validation:

```
idea, category, customer, problem
overall score, criterion scores
experiments chosen, results logged
launched / got customers / pivoted / abandoned
```

With enough data, the system answers things a generic LLM cannot:

> "B2B SaaS ideas like yours that scored well on demand but poorly on distribution tended to stall at GTM."

Use pgvector to embed historical ideas. Each new validation pulls the 20 closest analogues as context for the agents. Don't fine-tune a model — use RAG.

Moat ladder:

```
Level 1   Prompt alone                  — no moat
Level 2   Research orchestration        — mild
Level 3   Scoring ontology              — mild
Level 4   Proprietary evidence          — growing
Level 5   Historical idea/outcome data  — strong
Level 6   Predictive models             — deep
Level 7   Brand + community             — durable
```

MVP ships at levels 2–3. The data model targets 4–5 from day one.

---

## 14. Database schema

```
users

ideas
  id, user_id, raw_idea, normalized_json, category, created_at

validation_runs
  id, idea_id, rubric_version, overall_score, confidence, verdict

evidence
  id, validation_id, type, claim, url, source_type, quality_score, published_at

criterion_scores
  validation_id, criterion, score, reasoning, evidence_ids[]

competitors
  validation_id, company, url, hq_country, operating_scope, markets_served,
  scale_signal, positioning, pricing, difference_from_idea, moat,
  take_from_them, ignore

experiments
  idea_id, hypothesis, method, pass_condition, result

outcomes
  idea_id, website_launched, mvp_launched, customers, revenue, pivoted, abandoned
```

---

## 15. Differentiators

What this product does that IdeaProof and ValidatorAI do not.

**Rough build path** — Neither competitor answers "what do I do on Monday?" This product generates a tailored starting plan from the idea's risks and customer type.

**Separate confidence score** — Both competitors conflate idea attractiveness with evidence quality into one number. This product separates them, and explicitly flags when the evidence is too thin to trust.

**Deterministic scoring** — Competitors let the LLM produce the score, making it non-reproducible. Here a versioned formula with fixed weights produces the score. A 76 means the same thing every run.

**Experiments with pass conditions** — Competitors surface risks. This product converts assumptions into hypothesis tests with a defined pass bar.

**Honest uncertainty labeling** — Evidence is labeled with quality and freshness. Weak or old sources are flagged, including when the system's own output should be distrusted.

**Due diligence framing** — Both competitors frame their score as a verdict. This product frames itself as automated desk research, with real-world validation as the required next step. More credible with skeptical technical users.

**Modern UI** — Both competitors have dated interfaces. A clean, minimal design in the vein of Vercel or Linear is itself a credibility signal. The report should feel worth sharing. Target: dark/light mode, clear hierarchy, monospace data elements, no clutter.
