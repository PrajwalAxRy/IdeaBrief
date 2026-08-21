# HiggsField plan — the run pages (shared)

Standing art direction for the **app side** of the product — `/r/[slug]/define`,
`/validate`, `/roadmap`, `/sources`, and the surfaces around them. The four
per-page files (`higgsfieldPlan_define.md`, `_validate.md`, `_roadmap.md`,
`_sources.md`) defer to §0 here and must not restate it. This file also owns the
artefacts no single page can own: the ambient system, the invalid-run surface,
the error boundaries and the shared Open Graph block.

**Status:** every run page in `obsidian_app_build_plan.md` must ship complete and
look finished with **zero** generated assets present. Nothing in this file or the
four beside it is load-bearing. A media-plan entry is an upgrade path, not a
dependency — with two exceptions, both flagged, both costing zero generations.

---

## 0. Standing art direction — the app side

Read this before generating anything for any run page. The landing page's `§0`
in [`higgsfieldPlan.md`](higgsfieldPlan.md) still applies in full; everything
below either tightens it or adds to it.

| Constraint | Why |
|---|---|
| **Near-monochrome.** Desaturate to roughly 30–40% of natural saturation. | One hue exists and it means *primary action / verification / live*. A warm skin tone behind a `VERIFIED` chip competes with the only colour carrying meaning. |
| **Survives 60% darkening.** | Every asset here renders under a scrim. If the composition only works at full brightness, it reads as mud. |
| **No text in the frame.** | Generated text is garbage at any size, and the app surfaces are *made of* real text — mono ids, domains, counts, excerpts. Fake text next to real text is instantly legible as fake. |
| **Loops seamlessly, first and last frame match.** | Nothing on these pages cuts. A run page can sit open for minutes. |
| **No faces in sharp focus.** | A face pulls the eye off a 47-row evidence table it took real work to make readable. |
| **An order of magnitude quieter than the landing hero.** | **This is the sixth constraint and it is the one that will get broken.** A landing asset sits behind a 104px headline and can afford structure. An app asset sits behind 12px mono at `--ob-dim`, behind 1px hairlines that *are* the layout, behind a 1px accent rule drawing itself over 900ms. It is not decoration behind a claim; it is air behind a tool. |

**The test for the sixth constraint.** Composite the asset under its shipping
opacity, draw three 1px rules across it in the hairline colour at a third, a
half, and two thirds height, and screenshot at 1440px. Each rule must read as one
continuous line across the full width. If any stretch of it disappears into a
brighter patch, the asset is too busy for an app surface — that is a composition
failure, not a grade failure, and regrading will not fix it. Numerically: after
the shipping multiply, peak-to-trough luminance across the frame must stay under
roughly 5 of 255, because the hairline itself sits only about 13 of 255 above the
canvas. Anything brighter starts erasing the layout.

Global palette reference for prompts: near-black `#0A0A0B`, deepest `#060607`,
chalk `#F4F4F5`, accent `#2D7FF9`, discard grey `#4A4A52`. **This line is the
only place a hex appears in any of the five files** — it is repeated verbatim at
the top of each page file so that no brief has to be read with a second file
open, and nowhere else in any of them is a colour written as a hex. Everywhere
else colour is named in words — "near-black", "cool blue", "chalk" — so a brief
survives a token change.

**Naming (D2).** The product is **Groundwork** on the app side too. Today the run
chrome renders `IdeaBrief` via `Wordmark` in `components/layout/wordmark.tsx`; A0
replaces that string and swaps `LogoMark`'s faceted-gem glyph for the landing's
`Mark()`. Any asset carrying the name — the OG cards in §4 and the four page
files — is regenerated if the name changes. Nothing else in this file contains
the word.

**Generation is asynchronous and spends the user's money.** This file's own
contents are roughly **four generations** — §1 delivers no asset of its own, §2
is one still plus two or three motion passes, and §3, §4 and §5 are zero.
Across all five media-plan files the order of magnitude is **thirty**: five
backdrop-family clips (two on validate, one each on roadmap and sources, plus
§2's), the roadmap's editorial band, the two optional empty-state moments, and
~2 variants each — with every OG card at zero because it is drawn rather than
generated. Batch the whole plan and
ask once — "this is N clips across M slots, ~2 variants each, proceed?" — rather
than asking per asset. Generate the still first and lock the frame, *then*
image-to-video; text-to-video gives no control over composition and composition
is the entire job here. Three bad results in a row is a prompt problem, not luck
— stop and report rather than spending again.

**HiggsField cannot produce a seamless loop.** The strategy for every clip in
these five files is 5a from `references/higgsfield.md`: **design for near-zero
motion.** A 3–5% drift over 12–20 seconds, ending almost exactly where it
started, viewed at 16% opacity behind a veil, hard-loops invisibly. If a clip
still visibly seams, the two fallbacks in order are (b) a CSS cross-fade — two
copies of the same file offset by half the duration on a 12s `opacity` keyframe,
costing one extra decode — and (c) ping-pong, forward then reversed, encoded into
the file rather than reversed at runtime, and **only** for motion with no
directional meaning. Do not reach for either before trying a quieter clip.

**Discover the connector's tool schema at runtime.** HiggsField's MCP surface
changes as models ship. List the connector's tools and read the live parameter
schema before the first call; do not hardcode tool names or parameter shapes out
of this document or out of `references/higgsfield.md`. This plan supplies
subject, treatment, negatives, format, duration, aspect and destination — you map
those onto whatever the schema actually is at call time.

---

## 1. The backdrop system — mount point, routing, treatment `[MEDIUM]`

**Lives in:** `.ob-backdrop` in `styles/obsidian.css` §1 today — two counter-drifting
radial blooms of the accent wash on 34s and 52s loops, `position: fixed`, mounted
once by `app/page.tsx`. On the app side the mount point is
`components/layout/app-backdrop.tsx` → `AppBackdrop`, rendered **by each page**,
not by `app/r/[slug]/layout.tsx` — a server layout can't see which segment is
rendering and must not sniff the pathname to find out. **The recipe is
`.ob-backdrop`, the landing page's own, already in `styles/obsidian.css` §1**;
the per-route `[data-variant]` offsets are added in `styles/obsidian-app.css`
**§5 `RUN CHROME`** (A4). There is no `.ob-app-backdrop`.

**Currently:** nothing. The run pages have no atmosphere at all; they are Deep
Canopy flat surfaces. A4 builds the mount point as part of the run chrome. If
`AppBackdrop` doesn't exist when you come to swap this in, build it then — it is
a server component, three props, four lines of JSX.

**This entry owns the system, not the clip.** The mount point, the routing
table, the treatment rules, the opacity and the swap-in diff are settled here
once and are identical on every route. **The clip itself is briefed per page**
— D18 asks for *"a distinct atmospheric loop behind each of the four pages…
different character per stage: unresolved on Define, searching on Validate,
resolved on Roadmap"* — so each page file owns its own subject, its own path,
and its own argument for whether the route deserves one at all.

**What that means in practice:** the four page files were written to that brief
and, having each argued it out, landed on **three clips, not four** —
`higgsfieldPlan_validate.md` briefs two (the console cold start and a quieter
report field), `_roadmap.md` one, `_sources.md` one, and `_define.md` decides
against a backdrop entirely and records the brief it would have needed so a
future pass fails against a written spec rather than inventing its own. Read
each page file for the subject; read this section for everything else.

**What must not drift between them.** One `AppBackdrop` component, one recipe,
one opacity (`0.16`), one veil, one reduced-motion rule, and the treatment and
negative blocks below verbatim. **Four routes may differ in subject; they may
not differ in treatment.** If two of these clips can be told apart at a glance
by anything other than what they are pictures of, one of them is too bright.

**Which routes mount it:**

**`variant` names the *surface*, not the strength.** The prop is
`BackdropVariant = 'define' | 'validate' | 'roadmap' | 'sources' | 'standalone'`,
exported from `lib/run-stage.ts`, and the component maps surface → strength
internally and emits `data-variant`. The `none` / `ambient` / `clip` vocabulary
below is **that internal strength** — this table is the mapping, not the API, so
a route changes its atmosphere by changing one CSS rule rather than its JSX.
**Every route ships at the "today" column and stays completely finished there**;
the right-hand column is what it becomes if and when its asset lands.

| Route | Ships today | Once its clip lands | Why |
|---|---|---|---|
| `/r/[slug]/define` | `'none'` | **stays `'none'`** | D9 makes Define a full-height split with two independent scrollports and no page scroll. It is where you type, and the composer is pinned. Atmosphere behind a working surface with a live caret in it is noise. `higgsfieldPlan_define.md` §1 argues this out and records the brief it would need if ever overridden. |
| `/r/[slug]/validate` — Mode A, the console | `'ambient'` | `'clip'` — `_validate.md` | **The one place this genuinely earns its keep.** D8 re-times the run to ~45s; that is the only sustained waiting moment in the product and the only surface with real empty space in it. Highest-priority clip of the four. |
| `/r/[slug]/validate` — Mode B, the report | `'ambient'` | `'clip'` — `_validate.md` | A distinct, quieter field. The report is a document with a display headline and a figure layer, so this one is nearly invisible even by the standards of this section. |
| `/r/[slug]/roadmap` | `'ambient'` | `'clip'` — `_roadmap.md` | D18's "resolved" end of the arc. Low priority — the page carries a week axis and an editorial band already. |
| `/r/[slug]/sources` | `'ambient'` | `'clip'` — `_sources.md` | The weakest case of the four, and `_sources.md` says so plainly: D15 makes this a facet rail plus 65 dense rows, and a backdrop behind a table is a legibility tax. Briefed, ranked last, default answer no. |
| `/r/[slug]` not-found | `'ambient'` | `'clip'` — §2 below | Its own asset, not a page file's. See §2 — this is the one that gets *worse* on a known date. |
| Error boundaries | `'none'` | **stays `'none'`** | See §3. Atmosphere behind a stack-trace digest reads as indifference. |

**What every backdrop has to say, whatever its subject:** *nothing.* This is the
entry most likely to be over-delivered. It is not a subject, it is a
temperature — a room with the lights off and one cold source somewhere
off-frame. **If a viewer can describe what it is a picture of, it is wrong**, on
any of the four routes.

**The shared prompt skeleton.** Each page file supplies only the first
paragraph — its subject line. The two blocks beneath it are fixed and are
reproduced verbatim in every page file; **do not edit them there, and do not
let a page file's subject grow into a scene.**

> `<the page file's subject line>`
>
> Shot on 35mm, shallow depth of field, single hard key light from one side, deep
> shadow everywhere else. Near-monochrome, desaturated, cool grade. Matte black
> background. Cinematic, restrained, documentary — not stock photography.
>
> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video), identical on all four:** *Extremely slow,
single continuous camera move — a 3–5% push-in or lateral drift across the whole
clip. No cuts, no zoom snap, no subject entering or leaving frame. The shot
should end almost exactly where it started.*

**Format, identical on all four:** 16:9, 2560×1440, 20s, MP4 (H.264) + WebM
(VP9), no audio, plus a `.jpg` poster frame.
**Deliver to:** each page file names its own path under
`public/media/<route>/`. **This entry delivers no asset of its own** — there is
no shared base clip, and a path like `public/media/app/backdrop-base.*` should
not appear anywhere.

**Code change to swap in — written once here, referenced by all four page
files.** Inside `AppBackdrop`, the `'clip'` branch renders
`<video autoPlay muted loop playsInline preload="metadata" poster={poster}>`
with the WebM `<source>` before the MP4, `src`/`poster` coming from the
component's own props so a route swaps in by passing a path and nothing else
changes. `.ob-backdrop video` carries
`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;`
and — this is the number that matters — **`opacity: 0.16`**. The opacity *is* the
scrim; do not add a second one. `.ob-backdrop::after` already carries a radial veil
in the same shape as `.ob-collage-veil` on the landing page, so the clip
dissolves into the canvas at the edges instead of ending on a visible rectangle.
Under `prefers-reduced-motion` render the poster `<img>` instead of the video —
read `matchMedia` in an effect, never during render. The existing CSS blooms stay
underneath as the `'ambient'` variant and as the video's fallback; **they are not
deleted by this swap.**

**Do not** make this brighter or busier than the CSS blooms it sits over. The
landing version is deliberately almost invisible; this one is quieter still.

---

## 2. Invalid run / truncated link `[MEDIUM — upgrade, not a gap]`

**Lives in:** `app/r/[slug]/not-found.tsx` (the run-specific surface, deliberately
*not* wrapped in `RunShell` — that layout is what threw) and `app/not-found.tsx`
(the plain 404 with no run context). Both render `<Orb dimmed />` from
`components/ui/orb.tsx` (A2 moves it there from `components/entry/`).

**Currently:** a pure-CSS breathing ellipse whose entire appearance lives in
`.orb` / `.orb--dimmed` in `styles/components.css`. **D1 deletes
`styles/components.css` at the end of the build.** When A15 lands, this surface
would lose its only visual element. **That is no longer true and the entry is
ranked accordingly:** A2 ports `Orb` to `components/ui/orb.tsx` on a new
`.ob-orb` recipe in `obsidian-app.css` §2, so it survives the deletion intact and
this surface ships finished with or without a clip. **This is an upgrade, not a
gap.** It is still the strongest *upgrade* case on the app side — it is the
blankest screen in the product and the only one with no dense type on it — but it
does not outrank the remaining genuine absence (§4's OG block), and the priority
order below reflects that.

**What the invalid-run surface has to say:** *the link was cut, not the run.* The
URL is the entire access model — no login, no account, no recovery email. A
truncated or mistyped link is the one failure mode the product actually has, and
the page's job is to hand the visitor `RecentRunsList` and get out of the way.
The atmosphere must read as **absence, not error.** There is no red in this
system and there is no apology in this copy. Something is not here; that is all.

**Subject:** an empty desk in an unlit room, chair pushed back and turned
slightly away, a single lamp lit at the far edge of frame. Nobody in it. The
composition should be weighted to the lower right so the left two thirds — where
the headline, the two paragraphs and the recovery list sit — stay near-featureless.

**Prompt template:**

> An empty desk in a dark unlit room, the chair pushed back and turned slightly
> away, one small lamp lit at the far right edge of the frame. Nobody present.
> Photographed from a few metres back at seated height, the left two thirds of
> the frame uncluttered and unlit.
>
> Shot on 35mm, shallow depth of field, single hard key light from one side, deep
> shadow everywhere else. Near-monochrome, desaturated, cool grade. Matte black
> background. Cinematic, restrained, documentary — not stock photography.
>
> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

**Format:** 16:9, 2560×1440, 20s, MP4 (H.264) + WebM (VP9), no audio, plus a
`.jpg` poster frame.
**Deliver to:** `public/media/app/not-found.{mp4,webm}` and
`public/media/app/not-found.jpg`

**Code change to swap in:** in **both** `app/r/[slug]/not-found.tsx` and
`app/not-found.tsx`, replace `<Orb dimmed />` with
`<AppBackdrop variant="standalone" src="/media/app/not-found" />` and delete the `Orb`
import. This surface may run the clip at `opacity: 0.24` rather than §1's `0.16`
— it is the blankest screen in the product and the only one with no dense type on
it — set via `[data-variant='standalone']` on `.ob-backdrop`, not an
inline style. Under `prefers-reduced-motion` render the poster `<img>`. The
`DisplayHeadline`, the two paragraphs, the "Start a new idea" CTA and
**`RecentRunsList` — which is the actual recovery path and the reason the page
exists — all stay exactly where they are.** Measure
`document.querySelector('.recent-runs')?.getBoundingClientRect()` before and
after the swap: identical, or the asset is pushing the recovery path down the
page.

Note the ordering. Per **C13**, A8 removes the `Orb` from the Run Console (the
backdrop replaces it there) and A14 keeps it on the invalid-run page — so by the
end of the build this surface is `Orb`'s **only** caller. Filling this slot is
therefore what finally retires the component; until it lands, **do not delete
`Orb`**, or the invalid-run page ships as a blank field.

---

## 3. Error boundaries `[LOW — do not replace]`

**Lives in:** `app/error.tsx` (root, client, uses `retry` per next@16.3) and
`app/r/[slug]/roadmap/error.tsx` (segment-scoped, nested under the run layout so
`RunShell` chrome stays mounted).

**Currently:** `.error-panel` — an accent left border, the failure stated in one
sentence, a "Try again" that calls `retry()`, a second action back to the report,
and the digest plus an ISO timestamp in the mono meta layer. **No red anywhere,
by design.** It is correct as it stands.

**Generate nothing for this surface, now or later.** An error boundary is the one
place in the product where atmosphere is actively hostile: the visitor is stuck,
something failed, and every pixel that is not the retry button is in the way. A
drifting haze loop behind a stack trace digest is the kind of thing that looks
considered in a design review and reads as indifference in production.

The one obligation this surface carries is a **code** obligation, recorded here so
nobody mistakes it for a media gap: when D1 deletes `styles/components.css`,
`.error-panel` dies with it and must be reborn as `.ob-error-panel` in
`styles/obsidian-app.css` — surface at `--ob-surface`, 10px radius, 1px
`--ob-hairline` border, a 2px `--ob-accent` left edge, `--ob-muted` body copy,
`--ob-dim` mono digest line. That is A14/A15 work, not a generation.

Listed here only so a future pass doesn't read the blank space as an opportunity.

---

## 4. Open Graph — the shared block and the fallback card `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15.** R18 is fixed and this is no longer a gap. All
> five cards are drawn in code by the dev-only `app/style-guide/og/page.tsx` and
> committed as `public/og/{default,define,validate,roadmap,sources}.png`, each
> measured at exactly 1200×630. `app/layout.tsx` carries `metadataBase`,
> `openGraph` and `twitter`; each run page has a `generateMetadata` whose every
> number is derived, never typed. Verified: the roadmap card, the run header and
> the page meta line all read `4 BUILD STEPS · 1 TRIPWIRE`.
>
> **What remains here is an upgrade, not a gap** — the cards are typographic by
> choice, and nothing in this section is load-bearing.

**Lives in:** `app/layout.tsx` → the `metadata` export. Today it carries `title`
and `description` and **nothing else** — no `metadataBase`, no `openGraph` block,
no `twitter` block, no image. This is **R18**.

**Currently:** every shared run link previews as bare text. The URL is the whole
distribution model for this product — you finish a run, you paste the link into a
Slack channel or a text message, and someone else opens it. That paste is the
product's only growth mechanic and it currently renders as an unstyled line of
grey text. **This is the highest-priority item across all five media-plan files.**

**And it costs zero generations.** The OG card is a *type* card and is **drawn,
not photographed** — same rule as every other product surface in this system
(`references/media.md` §2). A generated image behind a run's one-liner would be
the single most damaging thing to put on a card whose whole claim is "every number
here came from a real page".

**The shared block** goes in `app/layout.tsx` and is inherited by every route that
doesn't override it:

- `metadataBase: new URL('https://…')` — required, or every relative image path
  in the four per-page files silently fails to resolve.
- `openGraph: { type: 'website', siteName: 'Groundwork', images: [{ url: '/og/default.png', width: 1200, height: 630 }] }`
- `twitter: { card: 'summary_large_image' }`

**The fallback card** — **`public/og/default.png`**. This draft called it
`public/og/run.png`; it shipped as `default.png` and no `run.png` exists. Use
the real name if this is ever redrawn.

**Brief:** deepest near-black ground, edge to edge. Top-left at 48px inset: the
`Mark()` glyph at 22px beside "Groundwork" at 28px, chalk, weight 400, tracking
`-0.02em`. Centre-left, on a 900px measure: the run one-liner set at 54px chalk
weight 400, tracking `-0.03em`, leading `1.06`, hand-broken across two lines.
Directly beneath it a **single 1px accent rule, 220px wide** — this is the one
blue thing on the card and its job is nameable: *verification*, the same rule
that draws itself under every matched excerpt in the product. Bottom-left, mono
12px uppercase at `+0.1em` in the dim grey: `47 VERIFIED · 31 SOURCES · 18 DISCARDED`.
Middot separators, never `//`. Nothing else. No photograph, no gradient, no
border, no logo lockup, no product screenshot.

**Format:** 1.91:1, 1200×630, PNG.
**Deliver to:** `public/og/default.png` (the four page files deliver
`public/og/{define,validate,roadmap,sources}.png` into the same directory).

**Code change:** add `metadataBase`, `openGraph` and `twitter` to the `metadata`
export in `app/layout.tsx`; each run page adds its own `openGraph.images` override
naming its own card.

**Static PNGs, checked in — not `ImageResponse`.** The prototype has exactly one
fixture run with one one-liner, so a runtime-generated card would compute an
identical image on every request in exchange for a font-loading edge runtime and
a new failure mode on the one surface that has to work when pasted into someone
else's client. If the fixture ever multiplies, `app/r/[slug]/opengraph-image.tsx`
with `next/og` is the swap — it ships with Next and adds no dependency.

---

## 6. What stays code-drawn — the do-not-replace list `[LOW — do not replace]`

Every item below is a **product surface, a diagram, or a live DOM state machine**,
and `references/media.md` §8 rules all three out of generation. They are listed
here, by name, so that a future pass reading "no asset delivered" does not read
them as gaps. **HiggsField is the wrong tool for every one of them, and a
generated approximation would be strictly worse than what already renders.**

**The figure kit — `components/figures/`.** `Figure`, `NumberCallout`,
`StanceBar`, `RecencyStrip`, `ValueLadder`, `GapBar`, `RunFunnel`,
`CapabilityMatrix`, `DomainConcentration`, `DimensionStrip`, `FanOutMeter`,
`WeekAxis`, `PlanBar`. *"Diagrams, charts, flows → SVG. Sharper, themeable,
accessible, correct."* Every one of these is citation-linked to a real finding
and prints its raw number alongside the mark; an image of a chart can do neither.
D6 and Standing rule 18 both say the same thing from different directions:
**there is no charting library and none will be added**, and there is no image
route around that either.

**The Run Console — `components/validate/console/`.** `RunConsole`, `QueryTicker`,
`FindingStream`, `FindingCard`. This is ~45 seconds of live state resolving in the
browser, and it is the single most convincing thing in the product because the
visitor watches it happen rather than watching a recording of it having happened.
A screen-recorded loop of it is heavier, blurrier, can't respond to the viewport,
and goes stale the first time a fixture changes. §1 above already gives the
console the one thing it genuinely wants — atmosphere in the empty space *behind*
it.

**The verification rule.** `.ob-verify-rule` — a 1px accent line scaling from
`scaleX(0)` to `scaleX(1)` from the left over 900ms under a matched excerpt.
`higgsfieldPlan.md` §4 already says leave it alone on the landing page; the app
inherits the same mechanism on `FindingCard` and on the drawer, and the same
ruling applies. It is the literal moment of verification and the whole argument
the product makes.

**Every product fragment.** `Fragment`, `BriefPanel` and its `BriefField` rows,
the `EvidenceExplorer`'s dense rows, `DiscardRow`, `CompetitorCard`,
`ScriptBlock`, `SurveyBlock`, `TripwirePanel`. These render real typed data
through the real token set. A brief with three fields visibly marked `unknown`
and a discard row struck through with its reason attached argue for the product
in a way no photograph of a laptop ever will.

**The CSS backdrop blooms.** `.ob-backdrop`'s two counter-drifting radials in
`styles/obsidian.css` §1 are not a placeholder for §1's clip. They are the
`'ambient'` variant, they ship on the report and the roadmap, and they survive the
video swap as its fallback layer. Do not delete them as cleanup.

---

## Priority order

Across all five media-plan files. **Real gaps outrank upgrades**, and one gap here
opens on a known date rather than existing today.

1. ~~**§4 — the Open Graph block and the five cards.**~~ **Done, A15.** All five
   cards ship as committed PNGs and cost zero generations, exactly as predicted.
   Re-rank the rest accordingly.
2. **§2 — the invalid-run surface.** The blankest screen in the product, and the
   only one with no dense type competing for attention — so atmosphere earns more
   here than anywhere else on the app side. **An upgrade, not a gap:** `Orb`
   survives A15 (A2 ports it to `.ob-orb`), so the page is finished without this.
3. **The backdrop clips, and only in this order** — `higgsfieldPlan_validate.md`'s
   console cold start first, and **only** after all four run pages ship and the
   Run Console still reads dead during its 45 seconds. If that one lands and the
   product doesn't feel different, stop: the report field, the roadmap field and
   the explorer field are each a smaller version of the same bet, ranked
   `[MEDIUM]`, `[LOW]` and `[LOW]` by their own files for that reason. §1 here
   delivers no asset — it is the system they all plug into.
4. **`higgsfieldPlan_roadmap.md`'s editorial band** — the only honestly-human
   subject anywhere on the app side, and therefore the easiest of all of these to
   turn into stock photography. Last of the paid items on purpose.
5. **The two empty-state moments** — Define's empty transcript and the explorer's
   zero-results state. Optional, small, and both currently answered by honest
   copy, which is a defensible permanent answer.
6. **§3 and §6 — do not touch.** The error boundaries get nothing, and every
   figure, fragment, console and verification rule in the product stays code-drawn.
---

## 7. Addendum — what A14 and A15 settled `[NO GENERATIONS OWED]`

Appended 2026-08-21, when the supporting surfaces and the sweep landed. Nothing
below is a request for an asset; it records decisions a future media pass would
otherwise reopen.

**The invalid-run surface is finished as code.** §2 ranks it third and calls it
an upgrade rather than a gap, and that reading held: `Orb` survived A15 and is
the page's ambient field, breathing at 38s — inside the 20–50s band and legal
under D17. It is now `Orb`'s **only** call site in the product. Consequently
**this page renders no `AppBackdrop`**, because one ambient field per surface is
the rule and the Orb is this one's; A14's exit test asserts
`document.querySelectorAll('.ob-backdrop').length === 0` there. A clip briefed
by §2 would replace the Orb, not join it.

**The error surfaces get an `AppBackdrop`, and this does not contradict §3.**
§1's table gives error boundaries `'none'` and §3 says *generate nothing* — both
are about **generated media**, and both stand. `AppBackdrop` is code-drawn CSS
atmosphere, and C13 puts it on the page; a segment error boundary *is* the
segment's rendered tree, so the roadmap and sources boundaries render
`<AppBackdrop variant={segment} />` exactly as the page they replace would. The
two root surfaces render `variant="standalone"`, which has no offset rule of its
own and therefore takes the base composition. **§3's code obligation is
discharged:** `.error-panel` died with `styles/components.css` and was reborn as
`.ob-error-panel` in `obsidian-app.css` §15 — `--ob-surface`, 10px radius, a 2px
`--ob-accent` left edge, `--ob-muted` body, `--ob-dim` mono digest. No red, and
measured: zero red-dominant computed colours on any of the five error surfaces.

**The four loading skeletons need no art and never will.** They are the page's
own hairlines with the data-derived content blanked, which is the honest way to
distinguish *pending* from *empty*. Nothing about them is a visual gap.
