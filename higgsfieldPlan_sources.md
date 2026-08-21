# HiggsField plan — Sources / Evidence Explorer

Everything on `/r/[slug]/sources` that is a placeholder, a CSS approximation, a
genuinely blank area, or a missing artefact, written as a production brief. Each
entry is self-contained: what it must communicate, the prompt, the format, the
delivery path, and the exact code change that swaps it in.

**Status:** the page ships and looks finished *without* any of this. Nothing here
is load-bearing — it is all upgrade work, and on this page more of it than usual
is upgrade work that should never be done.

---

## 0. Standing art direction

**Read `higgsfieldPlan_shared.md` §0 first.** Its four standing constraints —
near-monochrome, survives 60% darkening, no text in the frame, no faces in sharp
focus — govern every asset in this file and are not repeated here. What follows
is only what is specific to the Evidence Explorer.

| Constraint | Why |
|---|---|
| **Nothing may move behind a list being read.** | The explorer is a facet rail and **65 dense rows** — 47 verified plus 18 `DiscardRow`s. Drift behind a scrolling list of mono domains and ISO dates reads as smog, not atmosphere. Any motion here is confined to a band the rows never enter. |
| **Nothing may sit behind a live count.** | `FacetRail`'s counts change as facets combine. A count that renders over a moving bloom stops looking like a number and starts looking like a graphic. Rail column, `260px`, is a media-free zone. |
| **This page is an audit log, not a marketing surface.** | Its whole job is to let a reader check the work. Decoration on an audit log is a tell. See §4. |
| **Zero directional meaning in any motion.** | Ping-pong (`higgsfield.md` §5c) is the loop fallback on this page, and ping-pong only works where reversing the clip means nothing. Brief accordingly: drift, not travel. |

Global palette reference for prompts: near-black `#0A0A0B`, deepest `#060607`,
chalk `#F4F4F5`, accent `#2D7FF9`, discard grey `#4A4A52`.

**The looping problem.** HiggsField cannot produce a seamless loop. Design for
near-zero motion first — a 3–5% drift over 12s, ending almost exactly where it
started, is invisible as a hard cut at 50% opacity behind a scrim. If a seam is
still visible, cross-fade two offset copies in CSS (`higgsfield.md` §5b) before
reaching for anything else. Ping-pong is safe on both clips briefed here.

**Generation budget.** This entire file is **one backdrop clip (§1), one optional
zero-state clip in two candidate subjects (§5b), and one OG card that is not a
generation at all (§6)**. Generating everything, at two variants each and stills
before video, is roughly **10 paid generations**. Taking the recommended path —
typographic zero-state, no backdrop — it is **zero**. Generation is asynchronous
and spends the user's money: batch this file together with the other four app-side
plans, ask once with a total, then submit and poll. Never generate one asset per
turn as you write the code.

**Discover the connector's tool names and parameter schema at runtime.** Do not
hardcode a tool name out of this document or out of `references/higgsfield.md` —
the surface changes as models ship. List the tools, read the live parameter
schema, then map the `Format:` and `Deliver to:` fields below onto its params.

**Always still first, then image-to-video.** A still is cheap and tells you
whether the subject is right; locking the frame and animating it is the only way
to control composition.

**One route, one card.** There is exactly one fixture run (`sms-rebooking-4f2a`).
The OG card in §6 is per **route**, not per run — a per-run card would require a
server render, and the URL being the whole access model is the point.

---

## 1. Explorer ambient backdrop `[LOW]`

**Lives in:** the shared app backdrop — `.ob-app-field` in
`styles/obsidian-app.css` §1, specified in `higgsfieldPlan_shared.md` §1 —
scoped to this route by `app/r/[slug]/sources/page.tsx`.
**Currently:** pure CSS. Two radial washes at `--ob-accent-wash` drifting on 38s
and 54s, confined to the top band beneath the header and faded out before the
`01 THE RUN` hairline. It works. On this page it is also doing less work than on
any other route in the app.

**What the backdrop has to say:** *nothing.* That is not a shortfall in the brief,
it is the brief. Define has an empty transcript to fill, the console has 6s of
cold start to hold, the roadmap has a genuinely human subject. This page has a
funnel strip, a facet rail, and 65 rows of record. **The case for atmosphere here
is the weakest of the four pages, and this entry says so plainly rather than
inventing a justification for parity.**

**If replaced:** a full-bleed 20s loop of very slow volumetric haze in near-black
with one faint cool-blue bloom drifting laterally through it — the same subject
as the landing hero's ambient field, at roughly half its amplitude. It has to be
dark and still enough that a 12px mono domain string at `--ob-dim` set over the
band stays readable without a second scrim. It renders in the top 420px only and
must resolve to flat `--ob-canvas` before the `01 THE RUN` rule.

**Prompt template:**

> `<subject>`. Shot on 35mm, shallow depth of field, single hard key light from
> one side, deep shadow everywhere else. Near-monochrome, desaturated, cool
> grade. Matte black background. Cinematic, restrained, documentary — not stock
> photography. No text, no logos, no legible screens, no watermarks. Nobody
> looking at the camera. No bright saturated colour. No lens flare.

`<subject>` = *Very slow-moving volumetric haze in a near-black room, a single
faint cool-blue bloom drifting through it from the left, photographed as a long
exposure of dust in a projector beam — the upper third of the frame open and
almost featureless.*

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

**Format:** 16:9, 2560×1440, 20s, MP4 (H.264) + WebM (VP9), no audio.
**Deliver to:** `public/media/sources/field.{mp4,webm}` plus `field.jpg` as the
poster frame.

**Code change to swap in:** in `app/r/[slug]/sources/page.tsx`, add a `<video
autoPlay muted loop playsInline preload="metadata" poster="/media/sources/field.jpg">`
as the first child of the `.ob-app-field` div, WebM source before MP4. Keep the
CSS gradients underneath as the fallback — do not delete them. Gate on
`prefers-reduced-motion` read in an effect, never during render; under reduce,
render the poster `<img>` and nothing else. **The backdrop div must not gain
`position: relative`, `overflow`, `contain`, or `filter`** — `FacetRail` sits in
the same stacking context and any of those turns the backdrop into its scroll
container, killing `position: sticky` silently (`pitfalls.md` §5). Verify by
walking the rail's ancestors for a non-`visible` overflow after the swap. The
funnel strip, rail, rows and drawer are untouched.

**Do not** make this brighter or busier than the CSS version it replaces. **If
you can tell it is there, it is wrong.**

---

## 2. Title band — `Everything we checked.` `[LOW — do not replace]`

**Lives in:** `app/r/[slug]/sources/page.tsx`, copy from `lib/content/app.ts`.
**Currently:** an h1 at `--ob-h1` in `--ob-text`, weight 400, `-0.03em`, over the
lead `47 excerpts passed the check. 18 didn't. All of it is here.` at `--ob-lead`
in `--ob-muted`, closed by a 1px `--ob-hairline` rule.

**Leave this alone.** The type *is* the visual. The lead is a two-clause sentence
whose second clause is the whole product claim, and putting anything behind it —
a still, a bloom, a slot — makes the claim look staged. The display moment on
this route belongs to the report (`--ob-display` on `/validate` Mode B, per the
agreed copy); Sources deliberately opens one step quieter.

Listed here only so a future pass doesn't read the absence of a hero asset as an
oversight.

---

## 3. `01 THE RUN` — funnel strip and domain concentration `[LOW — do not replace]`

**Lives in:** `components/figures/run-funnel.tsx` → `RunFunnel` and
`components/figures/domain-concentration.tsx` → `DomainConcentration`, each
wrapped in `Figure`, rendered under the `01 THE RUN` `.ob-eyebrow`.
**Currently:** hand-drawn CSS/SVG. `RunFunnel` draws 19 queries → 31 pages → 47
verified → 18 discarded as four proportional segments. `DomainConcentration`
draws ranked bars showing `capterra-like.example` supplying 5 findings and 24 of
29 domains appearing exactly once.

**Do not replace, and do not generate an alternative.** Three reasons, in order
of how much they matter:

1. **The pass rate is the trust claim of the entire product.** 47 kept against 18
   discarded is the single number that separates this from a summarising toy. It
   has to be real DOM a reader can inspect, count, and cite — not a picture of a
   claim.
2. Standing rule 13 and `media.md` §8: diagrams and charts are SVG. **There is no
   charting library in this repo and none will be added.** A generated funnel
   cannot be citation-linked, cannot respond to a facet, cannot be read by a
   screen reader, and goes stale the moment the fixture changes.
3. Every mark here is derived from `lib/analytics/evidence-stats.ts` and prints
   its raw number alongside. That is the whole reason D6's rich data layer is
   permitted under a blueprint that once said "no charts".

No format or delivery block, because there is nothing to deliver. **HiggsField is
the wrong tool for this one; noted here so it isn't mistaken for a gap.**

---

## 4. `02 EVERYTHING WE CHECKED` — rail, rows, discards, drawer `[LOW — do not replace]`

**Lives in:** `components/validate/sources/evidence-explorer.tsx` →
`EvidenceExplorer`; `components/validate/sources/facet-rail.tsx` → `FacetRail`;
`components/validate/evidence/finding-card.tsx` at `variant="row"`;
`components/validate/sources/discard-row.tsx` → `DiscardRow`;
`components/validate/evidence/evidence-drawer.tsx` → `EvidenceDrawer`.
**Currently:** a `260px minmax(0,1fr)` grid at `gap: 64px` inside
`--ob-container-app`. Facet groups for dimension · stance · cited · domain ·
recency with live counts; 47 verified rows; 18 `DiscardRow`s carrying real
reasons; stance expressed by fill treatment — solid chalk for supports, solid
`--ob-hairline-strong` for neutral, transparent with a 1px chalk border and a
45° `--ob-hatch` fill for contests — never by hue.

**The honest note, and the reason this entry is longer than the ones above.**
This page's job is **auditability**. Decorated auditability reads as marketing.
Every pixel in this region should look like a record someone could check, and an
atmospheric wash behind a struck-through discarded excerpt actively undermines
the one claim the discard is there to make. **The default answer for every
remaining slot on this page is no.** This entry exists so a future pass doesn't
add atmosphere for its own sake and call it polish.

Two specifics worth naming so they survive a later designer:

- **The `DiscardRow` treatment is the system's no-red rule doing real work.**
  A discard goes `--ob-discard` grey, strikes through, drops 6px, and stops
  mattering. Any generated "rejected" visual — a red tint, a torn edge, a
  crossed-out photograph — reintroduces failure-as-error and makes the reader
  feel accused instead of informed. There is no red in this system.
- **The drawer is a live surface with keyboard navigation and a position
  readout.** A rendered approximation of it would be strictly worse for exactly
  the reason `media.md` §8 gives: the visitor can drive the DOM version.

No format or delivery block. Listed here only so a future pass doesn't "upgrade"
it by mistake.

---

## 5. The zero-results moment `[MEDIUM]`

**Lives in:** `components/validate/sources/evidence-explorer.tsx` — the branch
taken when the active facet combination yields zero rows. The region is the
`minmax(0,1fr)` right column of the explorer grid: roughly **1040 × 620px** in the
middle of the densest page in the app.
**Currently:** nothing, and worse, today's equivalent branch in
`components/validate/sources-list.tsx` is *unreachable* — every dimension has at
least two findings, so the empty state has never rendered once (r07 §6d).
**A13 makes it reachable for the first time.** Cross three facets — `PRACTICAL`
(2 findings) × `contests` (neither of the 2 contests anything) × `cited in
report` — and the list empties. That is standing rule 14's blank div, arriving
the moment the facet rail ships, in the largest single area on the page.

**What the empty state has to say:** *the evidence doesn't cover this.* Not
"no results", not an error, not an apology. **The absence is itself a finding
about the corpus, and this is the one moment on the page where the product can
prove its own honesty by declining to fill a gap.** Everything below follows from
that sentence.

Two options are briefed. **Ship Option A.**

### Option A — typographic `[RECOMMENDED, zero generations]`

No asset at all. The empty state is set as a record of the query that produced it.

**Build:** **A13 owns this state, its copy and its classes** — `.ob-src-empty` in `styles/obsidian-app.css` **§14 `EVIDENCE EXPLORER`** (§9 is the Console). This entry records only the reserved height and the Option B upgrade path; it authors no new copy —
`min-height: 620px; display: grid; place-content: center; justify-items: start;
gap: 24px; max-width: 560px;`. The fixed `min-height` is not cosmetic: it is what
stops the page from collapsing and re-expanding as facets toggle (standing rule
12). Measure `getBoundingClientRect().height` on the region with rows present and
with rows absent — equal, or the reserved space is wrong.

Content, top to bottom, all copy in `lib/content/app.ts`:

1. A 1px `--ob-hairline` rule, 560px wide. The region stays carved, not blank.
2. A mono `--ob-meta` line at `--ob-dim`, uppercase, `+0.1em`, echoing the active
   facets verbatim and separated by middots — for the case above:
   `PRACTICAL · CONTESTS · CITED IN REPORT`. **The query is the content.** This
   line is generated from the live facet state, not written.
3. `"Nothing we found fits all three."` at `--ob-h2`, weight 400,
   `--ob-tracking-h2`, `--ob-text`. The numeral in the sentence is derived from
   the count of active facets, so the string in `lib/content/app.ts` is
   `Nothing we found fits all {n}.` with a one-facet variant
   `Nothing we found is {facet}.`
4. `"Two findings are Practical. Neither contests anything. That gap is a fact
   about the evidence, not a bug in the filter."` at `--ob-body` in `--ob-muted`,
   measure capped at 560px. Derived from the same counts.
5. One `.ob-btn-ghost`: `"Clear the last facet"`. **Ghost, not primary** — the
   `EvidenceButton` in the run header already owns this viewport's single
   `.ob-btn-primary` (standing rule 11).

**Code change:** none beyond A13's own build. This is not a media swap, it is the
correct construction of the state, and it belongs in A13 rather than in a later
media pass.

### Option B — the atmospheric field `[MEDIUM, only after A has shipped and been read]`

**What the clip has to say:** *we looked, and the shelf ends here.* A physical
subject standing in for an exhausted search — permitted under `media.md` §1 step 3
because the subject is genuinely physical, not because the area needs filling.

| Variant | Subject | Why it might be right |
|---|---|---|
| `archive` | A long row of grey archive boxes on steel shelving receding into darkness, lit hard from one side, the near boxes in focus and the far end unresolvable. | Reads as "we went down the row and it stopped." The receding perspective gives a natural quiet zone on the left where the type sits. |
| `drawer` | A single hand pushing a deep filing drawer closed in low light, shot from the side, the drawer front filling the lower third. | More human, more finite. Riskier — a hand implies an actor, and this page's voice is deliberately impersonal. |

Generate `archive` first. Only brief `drawer` if `archive` reads as a stock
photograph of a warehouse.

**Both variants must be near-featureless across the left 560px of the frame**,
because that is exactly where Option A's typography sits and Option B does not
replace it — it goes *behind* it.

**Prompt template** (swap the subject line per variant):

> `<subject>`. Shot on 35mm, shallow depth of field, single hard key light from
> one side, deep shadow everywhere else. Near-monochrome, desaturated, cool
> grade. Matte black background. Cinematic, restrained, documentary — not stock
> photography. No text, no logos, no legible screens, no watermarks. Nobody
> looking at the camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

**Format:** 16:9, 1920×1080, 12s, MP4 (H.264) + WebM (VP9), no audio.
**Deliver to:** `public/media/sources/zero-{archive,drawer}.{mp4,webm}` plus a
`.jpg` poster frame each.

**Code change to swap in:** in `evidence-explorer.tsx`, the zero branch already
renders `<div className="ob-src-empty">`. Add a sibling first child
`<div className="ob-src-empty-media">` holding the `<video autoPlay muted loop
playsInline preload="metadata" poster=…>`, WebM source before MP4. In
`styles/obsidian-app.css` §14: `.ob-src-empty { position: relative; isolation: isolate }`,
`.ob-src-empty-media { position: absolute; inset: 0; z-index: 0; overflow: hidden;
border-radius: var(--ob-r-lg) }`, `.ob-src-empty-media::after { content: ''; position:
absolute; inset: 0; background: var(--ob-void); opacity: .62 }`, `.ob-src-empty > :not(.ob-src-empty-media)
{ position: relative; z-index: 1 }`, and `filter: grayscale(.35) contrast(1.05)`
on the `<video>` itself. Reduced motion renders the poster `<img>` in place of the
`<video>`, branched in an effect. **Every element of Option A stays exactly as it
is** — the rule, the mono facet echo, the h2, the body copy, the ghost button.
The clip is atmosphere behind type, never content. Re-measure the region height
before and after: **620px, unchanged.**

**If Option B is chosen but not yet generated, the region carries a `MediaSlot`
at `ratio="16/9"`, `kind="video"`, `label="SOURCES / ZERO RESULTS"`, with this
brief and this delivery path written into it** — not a blank div, and not a
deleted requirement (standing rule 14).

**Ship Option A first and live with it for a week.** If the region still reads as
a hole after that, the copy is wrong, not the media. Fix the copy before spending
a credit.

---

## 6. Open Graph / social card — `/r/[slug]/sources` `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15. Generate nothing for this.**
> `public/og/sources.png` ships, drawn in code by `app/style-guide/og/page.tsx`
> and committed at 1200×630, with `generateMetadata` on the sources route naming
> it. The brief below is kept for a redraw, not as an outstanding ask.

**Was:** nothing. R18 — `app/layout.tsx` carried `title` and `description` and
no `openGraph` block and no image, so every shared run link previewed as bare
text. A15 added the blocks and this entry's image.

**What the card has to say:** *this is the receipt.* The report is the artefact
someone reads; the sources URL is the one they forward when they want to say
"check my work." **Of the four route cards, this is the one most likely to be
pasted into a thread by someone arguing a point**, and it has to survive being
seen at 400px wide in a chat client.

**Brief** — composed, not generated:

- Ground `--ob-void`. No photography, no texture, no bloom.
- `Groundwork` top-left, Geist Mono, `--ob-meta`, uppercase, `+0.1em`,
  `--ob-dim`.
- Headline `Everything we checked.` in Geist 400 at ~76px, `-0.03em`,
  `--ob-text`, left-aligned on a 64px margin.
- A single 1px `--ob-hairline` rule spanning the full card width beneath it.
- One mono line under the rule at `--ob-meta`, `--ob-dim`:
  `47 VERIFIED · 18 DISCARDED · 31 SOURCES · 29 DOMAINS`. Middots, not slashes.
- Along the bottom edge, a literal `RunFunnel` — four proportional segments at
  19 / 31 / 47 / 18, drawn to the same spec as the on-page figure, at card width.
- **Blue appears exactly once**, filling the `VERIFIED` segment. That is
  verification, one of its three jobs. Nothing else on the card is blue.

**This is not a HiggsField asset.** The card is 90% text and one hairline
diagram, and generative models cannot render legible text or a correct
proportional bar (`higgsfield.md` §8). Draw it in Figma from the real token
values, or screenshot a code-drawn 1200×630 route at `/style-guide` and export.
Either way it is composed from the system, not generated.

**Ship it as a static PNG, not a generated route.** An `opengraph-image.tsx`
would make a shareable preview depend on a server render, and the URL being the
whole access model is the point of the product. One card per route, not per run.

**Format:** 1.91:1, 1200×630 PNG, sRGB, under 300KB.
**Deliver to:** `public/og/sources.png`
**Code change:** in A15, add `openGraph` and `twitter` blocks to a page-level
`export const metadata` in `app/r/[slug]/sources/page.tsx`:
`images: [{ url: '/og/sources.png', width: 1200, height: 630 }]`,
`title: 'Everything we checked — Groundwork'`,
`description: "47 excerpts passed the check. 18 didn't. All of it is here."`

**The description string must be read out of `lib/content/app.ts`, not retyped.**
It is the page's lead, verbatim, and the two must never drift. If the lead
changes, this PNG is stale and needs regenerating along with it.

This is the highest-value item in this document by a wide margin, because it is a
real absence rather than an upgrade.

---

## Priority order

1. **§6 OG card** — a real gap (R18), cheap to fill, and this is the run URL that
   actually gets forwarded. Not a generation; do it by hand from tokens.
2. **§5 Option A, the typographic zero-state** — free, and A13 is what creates the
   1040 × 620px blank area that makes it mandatory. Standing rule 14: a blank div
   is a bug. This is not optional media work, it is part of building the page.
3. §5 Option B, the archive clip — only after A has shipped and been read for a
   week, and only if the region still reads as a hole. Two variants, ~4
   generations.
4. **§1 backdrop** — last, and honestly probably never. The CSS version is
   correct and this page wants less atmosphere than any other route in the app.
5. **§2 / §3 / §4 — do not touch.** The title band, the funnel, the rows, the
   discards and the drawer are the page. Adding media to any of them makes an
   audit log look like a brochure.