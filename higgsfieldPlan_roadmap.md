# HiggsField plan — Roadmap page (`/r/[slug]/roadmap`)

Everything on `/r/[slug]/roadmap` that is currently a labelled slot, a CSS
approximation, or a genuine absence, written as a production brief. Each entry
is self-contained: where it lives, what it must communicate, the prompt, the
format, the delivery path, and the exact code change that swaps it in.

**Status:** the page ships and looks finished *without* any of this. Every
entry below is upgrade work or a real gap in a non-page artefact. Nothing here
blocks A11 or A12, and no phase exit test depends on a generated file existing.

---

## 0. Standing art direction — roadmap addendum

`higgsfieldPlan_shared.md` §0 holds the standing constraints for the whole app
side. **Read it first.** This section only adds what is specific to the roadmap.

| Constraint | Why |
|---|---|
| **This is a working page, not a hero.** Media here is smaller, quieter and more heavily scrimmed than anything on `/`. | The roadmap's job is to be read, copied out of, and worked from. An asset that competes with a 4-line interview script has already failed. |
| **The only permitted human subject in this build lives here.** | Every other run page is product surface, evidence and diagrams. The roadmap is literally about going and talking to people, so photography of people is on-subject exactly once, in §1, and nowhere else. |
| **Survives ~60% darkening**, same as `/`: a `--ob-void` scrim at `opacity: 0.60` plus `grayscale(0.4) contrast(1.06)` on the media itself. | The panels sit 24px from live chalk type. A composition that only works at full brightness reads as mud once scrimmed. |
| **No text, no legible screens, no signage.** | Generated text is garbage at any size, and this page is dense with real text that would fight it. An expo hall with readable banner copy is unusable. |
| **Nothing pulses, nothing cuts.** D17 caps motion on app pages: entrance staggers, structural drawer motion, count-ups. That is the whole budget. | A looping clip that *reads* as looping is a second motion system on a page that was deliberately given one. |

Global palette reference for prompts: near-black `#0A0A0B`, deepest `#060607`,
chalk `#F4F4F5`, accent `#2D7FF9`. Every other colour reference in this file is
named in words, so a token change doesn't invalidate a brief.

**The looping problem.** HiggsField cannot produce a seamless loop, and no
model on it can. Three strategies, in order: (a) **design for near-zero
motion** — a 3–5% drift over 12s ends close enough to its first frame that a
hard loop is invisible under a 0.60 scrim, which is why the motion prompt says
"end almost exactly where it started"; (b) **CSS cross-fade** — two copies of
the same clip offset by half duration, one extra decode; (c) **ping-pong** —
encode forward-then-reversed into the file, free and perfectly seamless, but
only for drift with no directional meaning. For this page (a) is expected to be
sufficient. Do not reverse a `<video>` at runtime.

**Always still first, then image-to-video.** Text-to-video gives no control
over composition, and composition is the entire job in §1. Lock the frame,
approve it, then animate it.

**Spend.** Generation is asynchronous and costs the user's money. Batch the
whole page and ask once, not per asset. **Updated 2026-08-21: §5 shipped in A15
at zero generations, so §1 is the only paid item left on this page and the
realistic total is ~12–13** — about 9–10 stills across §1's three subjects (2–3
variants each, because the first pass on "not stock" reliably fails) plus 3
image-to-video passes. Add 2 only if §2 is made, and its default answer is no.
The original estimate of 16 included §5's composite and §2; neither is owed. Get a yes before the first call, and if three results in a row
come back wrong, stop and report — that is a prompt problem, not luck.

**Tool names change.** Do not hardcode a HiggsField MCP tool name from this
document. List the connector's tools at runtime, read the actual parameter
schema, and fill its params from the `Format:` and `Deliver to:` fields below.

---

## 1. The fieldwork band — 3 panels `[HIGH PRIORITY]`

**This entry leads the file even though the band sits mid-page**, because it is
the only real generated asset the roadmap has and everything else here is
either a diagram, an optional backdrop, or a static card.

**Lives in:** `app/r/[slug]/roadmap/page.tsx` → `<FieldworkBand />`, defined in
`components/roadmap/fieldwork-band.tsx`, content in `lib/content/app.ts` →
`ROADMAP.fieldwork`. Recipes are the `.ob-fieldwork-*` block of
`styles/obsidian-app.css`. **`FieldworkBand` and `FieldworkMedia` enter the
plan's naming contract when A11 builds them; do not rename either.**

**Currently:** the approved standalone stills are retained locally at
`public/media/roadmap/{conversation,expo,front-desk}.webp`. The three
`MediaSlot`s remain until their static swap is wired; no still generation is
owed. `ASSETS` is still empty, so no video is mounted either. Any remaining
HiggsField work is optional image-to-video using these local stills as source
frames.

**Where it sits, and why.** Between `01 OPEN QUESTIONS` and `02 BUILD ROADMAP`,
as the page's hinge, full `--ob-container` width (1200px) with a 1px
`--ob-hairline` above and below and `padding-block: 96px`. It is deliberately
**not** at the top of the page and deliberately **not** at the bottom. At the
top it would be decoration over a headline; at the bottom it would be a
send-off. In the middle it does structural work: everything above it is a
question the web declined to answer, everything below it assumes you went and
asked. The band is the sentence between those two halves, and the fact that the
open-question stack is capped at 920px while the band and the week axis both
run the full 1200px is what makes the hinge read as a widening.

**What the band has to say:** *the answers to these six questions are not
online, and getting them means an awkward conversation with a stranger.* Not
"collaboration". Not "team". Not "startup life". The subject is somebody in the
middle of a specific, slightly uncomfortable piece of fieldwork — asking a busy
office manager a question she has no reason to answer, standing at an expo
stand nobody is visiting yet, watching a front desk to see what actually
happens when a patient cancels. **If a panel could appear in a bank's annual
report, it is wrong and must be regenerated.**

The three panels map one-to-one onto research the fixture actually asks for, so
the captions are true statements about this run rather than atmosphere.

| Panel | Caption (mono, `--ob-dim`, `.ob-meta`) | Maps to | Subject brief |
|---|---|---|---|
| `conversation` | `01 · 8–10 CONVERSATIONS` | Q01 — who approves a $200–300/mo tool | Two people at a small table in a back office, three-quarter from behind and to one side. One is mid-sentence with a hand half-raised; the other is writing in a notebook and not looking up. A paper cup, a folder, a chair pushed out. Cramped, fluorescent-adjacent, **not a meeting room**. Nobody is presenting to anybody. |
| `expo` | `02 · ONE REGIONAL EXPO` | Q03 — which channel gets the first 10 clinics | A trade-hall aisle photographed from a distance down its length, wide open, mostly empty. Backs of two or three figures far away. Booth frames and pipe-and-drape are visible only as dark geometry — no legible signage anywhere. Overhead light in hard pools with black between them. It should look like the first hour of the first day, before anyone arrives. |
| `front-desk` | `03 · ONE PILOT PRACTICE, ~200 PATIENTS` | Q04 — will patients with no texting history opt in | A reception counter after hours, shot low and close along the countertop. A desk phone handset, a paper appointment book left open, a pen. One screen present but angled away and completely out of focus. No people. The single hard key light comes from off-frame left and dies within a metre. |

**Prompt template** (swap the subject line per row):

> `<subject>`. Shot on 35mm, shallow depth of field, single hard key light from
> one side, deep shadow everywhere else. Near-monochrome, desaturated, cool
> grade. Matte black background. Cinematic, restrained, documentary — not stock
> photography.

**Negatives** (fixed, append to every prompt):

> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

**Format:** 16:9, 1920×1080, 12s (10–14s acceptable), MP4 (H.264) + WebM (VP9),
**no audio**. Rendered size is ~378×213 CSS px per panel — deliver at full
1920×1080 anyway so the OG card in §5 can crop from the same still.

**Deliver to:** `public/media/roadmap/{conversation,expo,front-desk}.{mp4,webm}`
plus a `.jpg` poster frame each at the same path.

**Code change to swap in — one object literal, and nothing else.** A11 shipped
the swap point as a module-level record in `components/roadmap/fieldwork-band.tsx`
keyed by panel id, rather than as an optional `src` on the panel type. This keeps
`lib/content/app.ts` free of asset paths, so the content file stays copy-only:

```ts
// components/roadmap/fieldwork-band.tsx — currently `{}`
const ASSETS: Partial<Record<string, FieldworkAsset>> = {
  conversation: {
    mp4: '/media/roadmap/conversation.mp4',
    webm: '/media/roadmap/conversation.webm',
    poster: '/media/roadmap/conversation.jpg',
  },
  // …expo, front-desk
};
```

`FieldworkAsset` is `{ mp4, webm, poster }`, exported from `fieldwork-media.tsx`.
A partially-filled record is legal and expected — a panel with no entry keeps its
`MediaSlot`, so the three can land one at a time.

`FieldworkBand` stays a **server component**. It renders `<MediaSlot>` when a
panel has no entry and `<FieldworkMedia asset={asset} alt={panel.brief} />` when
it does, so the slot and the asset are the same branch and the band's height
never changes.
`FieldworkMedia` is the `'use client'` leaf and the only one — it reads
`prefers-reduced-motion` in an effect (never during render; that breaks SSR
hydration), renders `<img src={poster}>` under reduced motion and
`<video autoPlay muted loop playsInline preload="metadata" poster={poster}>`
with WebM before MP4 otherwise. **Unchanged:** the `.ob-fieldwork-panel::after`
scrim, the `grayscale(0.4) contrast(1.06)` filter on `.ob-fieldwork-media`, the
`aspect-ratio: 16/9` and `--ob-r-card` frame, the `gap: 24px` three-column
grid, the `.ob-meta` captions, and the `.ob-reveal` entrance stagger at
`--ob-reveal-delay` 0ms / 110ms / 220ms. All of those operate on the wrapper,
not the media. Re-measure `.ob-fieldwork-grid` height before and after the
swap; it must be identical (Standing rule 12).

Band copy, verbatim, in `lib/content/app.ts` → `ROADMAP.fieldwork`:

- headline (`.ob-h2`): **"None of the answers are online."**
- lead (`.ob-lead`, `--ob-muted`, capped at 720px): **"Everything above is a
  question the web has already declined to answer. Everything below assumes you
  went and asked."**

**Additionally, for this band and nowhere else: no suits, no handshakes, no
glass-walled conference room, no laptop hero shot, no whiteboard, no sticky
notes.** The whiteboard is the landing page's vocabulary and reusing it here
makes the two surfaces look like the same page. If the first pass comes back
looking like a stock "business meeting", the fix is a tighter, more specific
subject line — an unglamorous room, an awkward angle, one person clearly not
enjoying this — not a different treatment.

---

## 2. Roadmap ambient backdrop `[LOW]`

**Lives in:** the page-owned `<AppBackdrop variant="roadmap" />`, using the
`.ob-backdrop` recipe in `styles/obsidian.css` with its per-route
`[data-variant]` offset in `styles/obsidian-app.css` §5. It is varied per route.
The roadmap variant differs from the other
three only in bloom position — low and right, sitting behind the week axis
rather than behind the headline.

**Currently:** the approved neutral still is shipped at
`public/media/roadmap/backdrop.webp` above the CSS fallback. Still generation is
complete; only optional image-to-video work remains. No
`backdrop.mp4` or `.webm` currently exists, so the WebP is the shipped runtime
asset.

**If replaced:** a full-bleed 20s loop of extremely slow volumetric haze in
near-black with a single faint cool-blue bloom drifting across the lower right.
A long exposure of dust in a projector beam, not a nebula. It must stay dark
enough that `--ob-dim` mono at 12px is still legible over it, which is a harder
bar than the landing page's — there, the backdrop only ever sits behind display
type at 104px.

**Format:** 16:9, 2560×1440, 20s, MP4 (H.264) + WebM (VP9), no audio, plus a
`.jpg` poster.
**Deliver to:** `public/media/roadmap/backdrop.{mp4,webm}`
**Code change if video is approved:** add the shared client media leaf beside
the page-owned `<AppBackdrop variant="roadmap" />` in
`app/r/[slug]/roadmap/page.tsx`, and keep the existing WebP/CSS backdrop as the
poster and reduced-motion fallback. Do not move backdrop ownership into
`RunShell`. Nothing else moves.

**On a page whose job is to be worked from, an ambient video is the least
defensible spend in this file.** It is heavier than the CSS it replaces, it
cannot respond to the viewport, and the thing it improves is atmosphere on a
screen the user is reading interview scripts off. **Default answer is no.** If
it is made anyway, do not make it brighter or busier than the CSS version — the
current one is deliberately almost invisible, and that is the point.

---

## 3. `01 OPEN QUESTIONS` — the card stack `[LOW — do not replace]`

**Lives in:** `components/roadmap/open-question-card.tsx` (`OpenQuestionCard`),
with `ScriptBlock`, `SurveyBlock`, `FanOutMeter` and `DependencyChip` inside
it. Six cards, capped at 920px, stacked under the `01 OPEN QUESTIONS`
`.ob-eyebrow` numeral.

**Currently:** real, code-drawn product surface. Each card carries the question,
why it matters, who to ask, how many, **a four-line interview script written out
in full**, what you'll learn, and — on Q04 — the two survey rows. `FanOutMeter`
draws how many build steps that question governs as hand-drawn SVG weight, so
Q06 (three steps) visibly outweighs Q05 (one).

**These are deliberately not images and must not become any.** media.md §2 is
explicit and this page is its best example: *an interview script written out in
full proves "we write the material" in a way "we generate interview questions"
never will.* A photograph of a script is a photograph of nothing. A generated
approximation of this card would be uncanny, immediately dated, unreadable by a
screen reader, and would delete the copy-out mechanic that is the entire payoff
of the section.

`FanOutMeter` is a **diagram**, and diagrams are SVG — sharper, themeable,
accessible, correct, and citation-linked. There is no charting library in this
project and none will be added.

**The only honest upgrade** is a screen recording of the real cards in motion —
the accordion opening, the dependency pulse landing, the copy label swapping to
`Copied`. That is a capture of the built app, not a generated asset.
**HiggsField is the wrong tool for it; noted here so it isn't mistaken for a
gap.**

Listed so a future pass doesn't "upgrade" it by mistake.

---

## 4. `02 BUILD ROADMAP` — `WeekAxis`, `PlanBar`, `TripwirePanel` `[LOW — do not replace]`

**Lives in:** `components/figures/week-axis.tsx` and
`components/figures/plan-bar.tsx`, composed by
`components/roadmap/roadmap-timeline.tsx`, with
`components/roadmap/tripwire-panel.tsx` lifted out below the axis. Week math is
`lib/run-plan.ts`. The axis runs the full `--ob-container` 1200px.

**Currently:** a time-scaled horizontal plan on a shared week ruler (D13) —
four `PlanBar`s positioned and sized by real week offsets from the fixture's
week spans from `start_week` / `duration_weeks`, gridlines at `--ob-grid`, `WHAT WOULD CHANGE THIS PLAN` lifted off
the axis into an unnumbered `TripwirePanel` because it is a tripwire, not a
build phase.

**This is a chart, and charts are SVG/CSS.** A generated image of a timeline
would be blurry, wrong, un-themeable, unreadable, impossible to link to a
citation, and stale the first time an estimate changes. It also could not carry
the dependency pulse (D14, R2) — a chip click has to actually flash a target in
the DOM, and a video cannot be clicked into.

The `TripwirePanel` is a 16px-radius panel on `--ob-surface` with a 1px
`--ob-hairline`, lifted off the axis below the four step blocks — **not a
discard treatment**; `--ob-discard` grey and strike-through belong to
`DiscardRow` on `/sources`, and conflating the two would make a plan you might
still follow look like a thing that has already failed. What the panel states
is a condition, and it states it in the same chalk as everything else on the
page. **There is nothing here for a generator**: it is type, a hairline and a
radius.

**Leave all of it alone.** Listed here only so a future pass doesn't mistake a
timeline for something a generator should draw.

---

## 5. Open Graph / social card for `/r/[slug]/roadmap` `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15. Generate nothing for this.**
> `public/og/roadmap.png` ships, drawn in code by `app/style-guide/og/page.tsx`
> and committed at 1200×630, with `generateMetadata` on the roadmap route naming
> it. Verified: the card, the run header and the page meta line all read
> `4 BUILD STEPS · 1 TRIPWIRE`.
>
> **It shipped without the photographic layer** the brief below asks for — the
> `conversation` still does not exist yet, so the card is purely typographic.
> That is a finished state, not a defect. **If §1 is generated, re-cutting this
> card with the still behind it is an optional upgrade costing one composite —
> it is not owed.** The brief below is kept for that.

**Was:** nothing. R18 — `app/layout.tsx` had no `openGraph` block and no image,
and there was no per-route override, so every shared roadmap link previewed as
bare text while **the URL is the product's entire distribution model**. That is
why it outranked §1 until it landed.

**Brief:** the `Groundwork` wordmark top-left in Geist 400 at small size, then
the page headline **"What to do next."** set in Geist 400 at roughly 88px with
`-0.03em` tracking, chalk on deepest near-black. Beneath it, one mono line in
dim grey, uppercase, `+0.10em`: **`OPEN QUESTIONS · INTERVIEW SCRIPTS · A BUILD
ORDER`**. A 1px chalk hairline runs the full width 40px above the bottom edge,
and the `conversation` still from §1 sits behind everything, cropped hard to the
right third, darkened to roughly 18% and blurred so it reads as texture rather
than as a photograph of two people.

**The card carries no run-specific content — no slug, no idea one-liner, no
counts.** A shared run URL is the only access control this product has, and
baking a private run's substance into a static image that link-unfurlers cache
and republish would leak it. The card describes the *page*, not the *run*.

**There is no blue on this card.** Blue means primary action, verification, or
live state, and a social preview is none of the three. The family resemblance to
the landing card comes from the ground colour, the wordmark, the hairline and
the type — not from the accent. Do not add a blue rule under the headline
because the landing card has one; that rule is the verification mark, and the
roadmap verifies nothing.

**Format:** 1.91:1, 1200×630 PNG. No video, no animated variant.
**Deliver to:** `public/og/roadmap.png`
**Code change:** A15 adds the base `openGraph` and `twitter` blocks to the
`metadata` export in `app/layout.tsx`. This card is the per-route override —
export `generateMetadata` (matching A15, because nothing on it depends
on `params`) from `app/r/[slug]/roadmap/page.tsx` with
`openGraph.images: ['/og/roadmap.png']`, `openGraph.title: 'What to do next.'`
and a description that names the page, never the run. Verify with a real
unfurl, not by looking at the file.

**This depends on D2.** The wordmark reads `Groundwork`. If the product name
changes, this card and every other OG card in the set need regenerating —
one find-and-replace in the code will not touch a PNG.

---

## Priority order

1. ~~**§5 OG card**~~ — **done, A15.** It shipped typographic, with no
   photographic layer, and costs zero generations. **§1 is now the only paid
   item on this page.**
2. **§1 fieldwork band** — the largest lift in how designed the page feels, and
   the only place in the entire app where photography is honestly on-subject.
   Generate all three stills, approve the frames, *then* animate; if only the
   stills land, ship them as stills and leave the videos for later.
3. **§2 ambient backdrop** — only if §1 lands and the page still feels flat.
   Default answer is no.
4. **§3 / §4 — do not touch.** The interview script and the week axis are the
   two strongest things on this page and both are stronger as live DOM than
   they could ever be as media.