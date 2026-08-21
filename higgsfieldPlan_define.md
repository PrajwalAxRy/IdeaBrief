# HiggsField plan — Define (`/r/[slug]/define`)

Every visual area on `/r/[slug]/define` that could plausibly be filled by a
generated asset, written out and decided. Each entry states what occupies the
area today, what it has to communicate, and either the production brief or the
reason there isn't one. Read `higgsfieldPlan_shared.md` §0 first — this file
defers to it and does not repeat it.

**Status:** the page ships and looks finished with zero generated assets
present. Nothing in this file is load-bearing. **Define has the fewest
legitimate media slots of the four run pages — one, and it is an Open Graph
card.** That is the honest answer and this file says so rather than
manufacturing work.

---

## 0. Standing art direction — Define's additions

The near-monochrome / survives-darkening / no-text-in-frame / no-faces
constraints live in `higgsfieldPlan_shared.md` §0. Four more apply on this page
specifically, and between them they decide §1.

| Constraint | Why |
|---|---|
| **Nothing moves behind live type.** | The user is typing here, and reading their own words back at `--ob-body` in `--ob-muted`. Ambient drift under running prose is an attention tax paid on the one page where the content is the user's own sentences. |
| **No photography, at all.** | D18 allocates the app side exactly one photographic moment — the editorial band on `/r/[slug]/roadmap`. Define is not it, and spending the app's only human subject on a working surface would be a mistake. |
| **No scroll, therefore nothing scroll-triggered.** | D9 makes this a fixed frame — `calc(100vh - var(--ob-header-h) - 96px)` with two independent scrollports and no page scroll. Every scroll-driven device on `/` (parallax, reveal, dimming) has no trigger here. D17 already forbids them; on Define they are also mechanically impossible. |
| **The typewriter is the whole motion budget.** | `motion.md`'s binary permits one continuous source per surface. The character stream in `MessageStream` is it. A second continuous layer stacked behind it is exactly the "2-second fun animation" failure the system exists to prevent. |

Global palette reference for any prompt this file might later authorise:
near-black `#0A0A0B`, deepest `#060607`, chalk `#F4F4F5`, accent `#2D7FF9`.
Everywhere else in this file, colours are named in words.

**Naming.** The product is **Groundwork** (D2), locked. On this route it
appears in `lib/content/app.ts` and in `RunIdentity` inside `RunHeader`. If it
ever changes, the OG card in §4 must be re-exported — it is the only artefact
here that bakes the name into pixels.

**Spend.** *Generating media spends the user's money; confirm before the first
call of a session and say roughly how many generations you are about to make.*
**This file commissions zero generations.** If you are batching a spend
confirmation across the five media plans, Define contributes nothing to the
count. Standing rules that would apply the moment that changes: still first,
then image-to-video, never text-to-video; HiggsField **cannot produce a
seamless loop**, so design for near-zero motion (3–5% drift across the clip) and
fall back to a CSS cross-fade of two copies offset by half the duration, or a
ping-pong encode where the motion carries no direction; and **discover the
connector's tool names and parameter schema at runtime** rather than hardcoding
either from any document, including this one.

---

## 1. Ambient backdrop `[LOW — decided against, do not add]`

**Lives in:** nothing. There is no backdrop element on this route and none is
being built. The equivalent on `/` is `.ob-backdrop` in `styles/obsidian.css`.
**Currently:** `--ob-canvas` and the 1px `--ob-hairline` column rule between the
transcript and `BriefPanel`. That is the entire treatment behind the split.

**The case for adding one.** Define is the only run page with a fixed 100vh
frame, which is the cheapest possible host for a full-bleed loop — it never has
to survive being scrolled past, never has to stay legible under arriving
content, and decodes exactly once. It is also the first screen after `/`, so
carrying the hero's atmosphere forward would make the landing page and the
product feel like one object rather than two. And at first paint the frame is
genuinely sparse: one seeded user turn on the left, twelve unanswered field rows
on the right, and a great deal of near-black in between.

**The case against, which wins.** Five reasons, in order of weight:

- **Someone is typing.** This is the one page in the app whose content is the
  user's own words, entered live. Motion behind live type is a legibility cost
  and, worse, an attention cost, paid continuously and returning nothing.
- **The transcript is already the motion.** A second continuous source stacked
  behind the first violates `motion.md`'s binary and D17's cap in the same
  stroke.
- **The hairline is doing the structural work.** D9's split is defined by one
  vertical rule. A soft luminous field behind that rule blurs precisely the edge
  that carries the layout. Rule 2 of the system: hairlines *are* the layout.
- **Two scrollports means a full-bleed layer sits behind both**, including the
  strip under the pinned `Composer` — which is where the eye lives for the whole
  session.
- **A backdrop here can never resolve.** With no scroll there is no arc: it
  would be a 12–20s loop repeating forever behind a static frame. A generated
  clip designed for near-zero motion, played behind a frame that also never
  moves, is a file that does nothing, forever, at the cost of a decode.

**Decision: Define gets no backdrop — generated or CSS.** The near-black canvas
and the column hairline are the treatment. **If the frame ever reads dead, the
fix is more metadata, not more atmosphere** — the mono `THE BRIEF` head, the
live `BriefProgress` line, a turn counter in `MetaLine`. Density is this
system's answer to emptiness.

**If this is ever overridden, the only acceptable brief** — recorded so a future
pass fails against a written spec instead of inventing its own:

> Volumetric haze in near-black, lit by a single cool source far off frame,
> drifting almost imperceptibly. Shot on 35mm, shallow depth of field, single
> hard key light from one side, deep shadow everywhere else. Near-monochrome,
> desaturated, cool grade. Matte black background. Cinematic, restrained,
> documentary — not stock photography.
>
> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

It would live at `public/media/define/backdrop.{mp4,webm}` and would have to sit
under a `--ob-scrim` layer dark enough that `--ob-dim` mono at 12px stays
readable over it. **Deliberately no format or delivery block on this entry — it
does not commission an asset.** If you generate it anyway, measure `.ob-meta`
contrast over it before you keep it, and expect to delete it.

---

## 2. The opening moment — first paint, before the first turn `[LOW — do not replace]`

**Lives in:** `components/define/message-stream.tsx` (`MessageStream`,
`RestIndicator`) and `components/define/brief-panel.tsx` (`BriefPanel`,
`BriefField`, `BriefProgress`), inside the left and right columns of the D9
split.
**Currently:** one seeded user turn, a 700ms three-dot `RestIndicator`, and
**eleven `FieldSkeleton` bars shimmering simultaneously** in the right column.
That last part is a real defect — the same shimmer means "loading from the
network" everywhere else in the app, so the whole rail reads as a stalled fetch
rather than as an outline of what is coming.

**What the moment has to say:** *this is a working surface that has not started
yet, and nothing has been invented to fill it.* Not "loading". The twelve empty
rows are the product's most honest claim made visually — the brief has a fixed
shape, every field is visible from the first second, and none of them contain
anything the user did not say.

**This is a product surface. It is filled in code, and A6/A7 own it.**
`media.md` §1 stops at step one: the area is showing your own product, so it is
drawn as markup. Concretely, the fixes belong to those phases, not to this file
— the shimmer is replaced with a static per-field rest state (mono
`NOT ASKED YET` at `--ob-meta` in `--ob-dim` against a 1px `--ob-hairline` row
rule, no animation), `BriefProgress` reads `1 of 12 answered · 0 unknown` on
first paint, and the transcript column reserves its full height so nothing moves
when the first turn lands. Route-level `app/r/[slug]/define/loading.tsx` must
stub the same shapes at the same heights (R20, fixed in A14).

**HiggsField is the wrong tool for this one; noted here so it isn't mistaken
for a gap.** So is a screen recording — the second instinct after "generate
something" is "record the real thing", and a video of a shimmering rail is
strictly worse than a rail that shimmers.

---

## 3. Transcript and brief panel `[LOW — do not replace]`

**Lives in:** `components/define/message-stream.tsx`, `message.tsx`,
`composer.tsx`, `dont-know-button.tsx`, `brief-panel.tsx`, `brief-field.tsx`,
`approve-button.tsx`, plus the new `BriefProgress` and `ConsequenceLine`.
**Currently:** live DOM. The transcript types itself character by character; the
brief fills field by field as the conversation reaches each one; the
`DontKnowButton` (functional from A7, D10) marks a field `unknown` and the
`BriefProgress` count moves in the same frame.

**Leave all of it alone.** Two reasons, and the second is the important one:

- `media.md` §2 — a product surface rendered as markup beats any image of it. It
  uses the real tokens, responds to the viewport, is readable by a screen
  reader, and does not go stale the day the brief schema gains a field.
- **The visitor can drive it.** Pressing `I don't know` and watching
  `9 of 12 answered · 3 unknown → open questions` change is the single most
  persuasive thing on this page, and it is persuasive *because it responds*. A
  rendered version of that is a claim; the live version is a demonstration.

Listed here only so a future pass doesn't "upgrade" it by mistake. **No hero
still of the brief panel, no loop of fields filling in, no composite of the
transcript.** If a marketing surface later needs a picture of Define, it gets a
code-drawn `Fragment`, the same way `/` does.

---

## 4. Open Graph / social card `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15. Generate nothing for this.** `public/og/define.png`
> ships, drawn in code by `app/style-guide/og/page.tsx` and committed at
> 1200×630; `app/r/[slug]/define/page.tsx` exports `generateMetadata` naming it.
> The brief below is kept for a redraw, not as an outstanding ask.

**Lives in:** `app/r/[slug]/define/page.tsx` → `generateMetadata`, image at
`public/og/define.png`. **Was:** any Define link pasted into Slack, iMessage or
a DM previewed as bare text. **The URL is the entire access model of this
product** — there is no login, and sharing the link is how a second person gets
in — which is why this outranked everything else in the file until it landed.

**What the card has to say:** *a brief is being written here, and it will
contain only what was actually said.* Not a screenshot, not a feature list.

**Brief:** pure typography and hairlines on near-black — **no photograph, no
generated plate, no blue.** Composition, 1200×630:

- Top-left, 64px in from both edges: `GROUNDWORK` in Geist Mono 500 at 20px,
  uppercase, `+0.10em`, in dim grey.
- Headline, left-aligned, baseline at roughly 58% of the card height:
  `Working out what you're building.` — Geist 400 at 68px, `-0.03em`, leading
  `1.08`, chalk. Two lines, broken by hand after `what`.
- A 1px chalk-grey hairline running the full width between the gutters, 40px
  under the headline's last baseline.
- Under the rule, one mono line at 20px, uppercase, `+0.10em`, dim:
  `DEFINE · 12 FIELDS · "I DON'T KNOW" IS AN ANSWER`.
- Nothing else. No mark, no gradient, no vignette.

**Why no blue.** On a static card none of blue's three jobs apply — there is no
action to take, nothing verified, nothing live. The landing card's blue rule
under the headline is legitimate there because it sits beneath a call to action;
here it would be decoration. **The app-side OG family uses a chalk hairline.**
`higgsfieldPlan_shared.md` owns that family — match it, and if it says otherwise,
it wins.

**One card per route, not per run.** A per-run card carrying the run's own
one-liner is what a real backend would render, and it is deliberately out of
scope: it needs server-side image generation, and the prototype contract has no
server pipeline. Four static cards — define, validate, roadmap, sources — is the
whole set.

**Format:** 1.91:1, 1200×630, PNG. Type outlined or embedded (Geist 400 + Geist
Mono 500); no transparency; sRGB.
**Deliver to:** `public/og/define.png`
**Code change to swap in:** add `metadataBase: new URL(...)` to the `metadata`
export in `app/layout.tsx` (once, for all four cards), then export an async
`generateMetadata({ params })` from `app/r/[slug]/define/page.tsx` returning
`title`, `description`, an `openGraph` block with
`images: [{ url: '/og/define.png', width: 1200, height: 630 }]`, and
`twitter: { card: 'summary_large_image' }`. All strings come from
`lib/content/app.ts`, not inline. **Nothing about the rendered page changes** —
this is metadata only, and the page's own layout, copy and measurements must be
identical before and after.

**This is not a HiggsField generation.** It is a design export: type, a rule,
and near-black. Produce it in the design tool or by rendering the same markup at
1200×630 and capturing it — do not spend credits on it, and do not let a
generator near the type.

---

## Priority order

1. **§4 OG card** — the only real gap in this file. Cheap, static, and visible
   every time a Define link is shared. Note that the *report* card in
   `higgsfieldPlan_validate.md` outranks it globally — that is the one people
   actually send — but within Define this is the item.
2. **§2 opening moment** — nothing to commission; it is A6/A7 code work. Listed
   so it is not re-briefed.
3. **§3 transcript and brief panel — do not touch.**
4. **§1 backdrop — decided against.** Re-read the five reasons before
   overriding; four of them are system rules, not preferences.