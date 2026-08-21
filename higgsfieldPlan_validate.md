# HiggsField plan — Validate (`/r/[slug]/validate`)

Everything on the Validate route — the Run Console in Mode A and the Report in
Mode B — that is currently a CSS approximation, a deliberate empty moment, or a
real absence, written as a production brief. Each entry is self-contained: what
it must communicate, the prompt, the format, the delivery path, and the exact
code change that swaps it in.

**Status:** the page ships and looks finished *without* any of this. Every entry
below is an upgrade path, not a dependency — with exactly one exception, §4, the
OG card, which is a real absence and the highest-priority item across all five
media-plan files.

---

## 0. Standing art direction

**Defer to `higgsfieldPlan_shared.md` §0.** Every constraint there — the
near-monochrome rule, surviving heavy darkening, no text in frame, no faces in
sharp focus, the loop obligation — applies to every asset in this file and is
not repeated. Read it first.

Palette reference, repeated once so this file is usable on its own: near-black
`#0A0A0B`, deepest `#060607`, chalk `#F4F4F5`, accent `#2D7FF9`. Everywhere else
in this file colours are named in words, so a brief survives a token change.

Three constraints are **specific to Validate** and override the shared file
where they conflict:

| Constraint | Why |
|---|---|
| **Quieter than `/`.** Ambient media on this route caps at `opacity: 0.10` on the report and `0.34` on the console cold start only. | The landing page's hero media sits behind a 104px headline and nothing else. This route sits behind hairline figure axes drawn at `--ob-grid` = `rgba(244,244,245,0.06)`. **A backdrop whose local luminance exceeds that alpha erases every gridline, axis and tick in `components/figures/`** — the figures stop reading as measurements and start reading as decoration. This is the single easiest way to make the report worse. |
| **Nothing may imply a source, a publication, or a verdict.** | Every `source_url` in the fixture is a dead `.example` domain. An asset showing a newspaper masthead, a logo wall, a browser chrome, a favicon strip or a document with a visible publisher implies real journalism this prototype does not have. Same rule for verdict language: the product has no score and no go/no-go (D7), so no asset may carry a tick, a cross, a gauge, a dial, a thumbs-up or a green/red pairing. |
| **No human editorial band on this route.** | D18 assigns the one honestly-human subject on the app side to the Roadmap. Validate's subjects are physical and mechanical only. See §5. |

**Batching and spend.** Generation is asynchronous and spends the user's money.
The contents of this file are **roughly 12 generations across three batches** —
§1 is 4 stills plus 2 image-to-video passes, §3 is 2 stills plus 2 clips, §4
reuses §3's winning still plus 2 alternates. Ask once per batch, not per asset,
and say the count. Generate stills first, lock the frame, then animate — always.

**Discover the connector's tool schema at runtime.** Do not hardcode tool names
or parameter shapes from any document, this one included; list the MCP server's
tools and read the live parameter schema before the first call.

**HiggsField cannot produce a seamless loop.** Every clip here is briefed for
near-zero motion — a 3–5% drift over the whole duration — so that a hard loop is
invisible at these opacities. If a delivered clip still visibly jumps at the
seam, the fallbacks in preference order are: (a) the CSS cross-fade — two copies
of the same `<video>` offset by half the duration on a `linear infinite` opacity
keyframe; (b) ping-pong — encode the reversed half into the file rather than
reversing at runtime, valid here because none of these subjects has directional
meaning. Do not fix a bad seam by shortening the clip.

**Not covered here:** the invalid-run, 404 and error-boundary surfaces. Those are
covered by `higgsfieldPlan_shared.md`.

---

## 1. Run Console — the cold start `[HIGH PRIORITY]`

**Lives in:** `components/validate/console/run-console.tsx` → `RunConsole`,
inside `ValidateView` Mode A. The field element is a new
the **existing** `.ob-backdrop` element that `app/r/[slug]/validate/page.tsx`
already renders as `<AppBackdrop variant="validate" />`. **There is no second
ambient element on this route** — one field, one opacity ramp, keyed on stream
state; the ramp's rule lives with the other `[data-variant]` offsets in
`styles/obsidian-app.css` §5 `RUN CHROME`.

**Currently:** nothing — an empty `1fr` column reading "Nothing verified yet."
The Deep Canopy build parked an `Orb` at `bottom: -240px; z-index: -1` inside a
column that grows past 5,000px, so the one ambient element on the page sat
permanently below the fold and was never seen by anyone. After D8 re-times the
run to ~45s with the first finding inside 6s, the cold start shrinks from 17
seconds to about 6 — but it does not disappear, and **it remains the
highest-anxiety moment in the entire product**: the user has just approved a
brief, the page has changed, and for six seconds nothing lands.

**What the cold start has to say:** *machinery is already working.* Not
"please wait", not decoration, not a mood. The user needs to believe that
between pressing Approve and the first `VERIFIED` chip, something large and
mechanical is turning over on their behalf. Depth, scale, a single working
light, dust in the air. **The clip is doing the job a spinner does, without
being a spinner** — spinners say "we are busy"; this says "there is a machine,
and it is big."

It must also get out of the way. The field runs at `opacity: 0.34` while zero
findings have landed and drops to `0.08` the moment the first one does — the
atmosphere is spent on the empty state and then recedes for the next 40 seconds
of real content.

**Current status — BLOCKED:** neither subject has a generated still, and no
console-coldstart media file exists. The shipped default is to keep the CSS
backdrop and drop this batch. If the batch is explicitly reopened, generate
`aisle` only and use its accepted still as both poster and image-to-video source;
keep `reader` unbriefed unless `aisle` fails a named acceptance criterion.

| Candidate | Subject line for the prompt | Why it might win |
|---|---|---|
| `aisle` (primary) | A long, narrow corridor between tall dark equipment racks, receding into blackness, lit only by one hard light source far down the corridor on one side. Fine dust suspended in the air catches the light. The near end of the corridor is almost entirely black. | Reads as machinery immediately, has real depth for a push-in, and its centre is naturally dark — the console's `320px` query rail and the findings column both sit over it. |
| `reader` (alternate) | A microfilm reading machine in an unlit archive room, one spool half-unwound, the lens housing catching a single hard sidelight. Everything beyond the machine falls away to black. Shot from slightly above and to one side. | Says *reading the web* more literally, and the spool gives one honest moving part. Riskier: it is closer to "a screen", and the negative block forbids legible screens — the spool must be out of focus. |

**Prompt template** (swap the subject line per candidate):

> `<subject>`. Shot on 35mm, shallow depth of field, single hard key light from
> one side, deep shadow everywhere else. Near-monochrome, desaturated, cool
> grade. Matte black background. Cinematic, restrained, documentary — not stock
> photography. No text, no logos, no legible screens, no watermarks. Nobody
> looking at the camera. No bright saturated colour. No lens flare.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift across the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The shot should end almost exactly
where it started.*

**Format if reopened:** highest verified native 16:9 output, 10–12s target, MP4
(H.264) + WebM (VP9), no audio, plus a `.webp` poster frame. This is transient
cold-start media, not a looping background: it is visible for at most five
seconds and is unmounted when the first finding lands or the limit expires.

**Deliver to:** `public/media/validate/console-coldstart.{mp4,webm}` plus
`public/media/validate/console-coldstart.webp`.

**Code change if the batch is approved:** `RunConsole` owns
`stream.findings`, so it should conditionally mount a fixed, `aria-hidden`
media leaf while `findings.length === 0`. Keep the existing page-owned
`<AppBackdrop variant="validate" />` as the CSS fallback; cross-fade the cold
media out when the first finding lands, then pause, detach sources and unmount
it. Do not add a `data-cold` prop to `AppBackdrop`.

```tsx
{reduced
  ? <img src="/media/validate/console-coldstart.webp" alt="" />
  : <video autoPlay muted playsInline preload="metadata"
      poster="/media/validate/console-coldstart.webp">
      <source src="/media/validate/console-coldstart.webm" type="video/webm" />
      <source src="/media/validate/console-coldstart.mp4" type="video/mp4" />
    </video>}
```

The recipe carries the opacity ramp and nothing else:

```css
.ob-console-cold { opacity: .34; transition: opacity var(--ob-enter) var(--ob-ease); }
.ob-console-cold[data-state='fading'] { opacity: 0; }
```

`reduced` comes from the existing reduced-motion hook read in an effect, never
during render. Under reduced motion the poster `<img>` renders and the ramp
still applies — it is an opacity change, not motion, and resolving it to `0.08`
instantly is the correct end state.

**If `Orb` still exists in the console after A8, delete it here.** One ambient
element per surface. Two stacked fields is how you get a page that is quietly
brighter than every figure on it.

---

## 2. The live stream, the figures, and the verification rule `[LOW — do not replace]`

Three separate things, listed together because they fail in the same way if
someone "upgrades" them.

**(a) The Run Console's live stream.** `FindingStream`, `QueryTicker`,
`PhaseStrip`, `CoverageBar` and the finding cards that prepend into it, in
`components/validate/console/`. This is 45 seconds of real DOM driven by
`useRunStream` off a validated fixture event log — 19 queries resolving, 47
findings landing, 18 discards counting up. **A video of a run is a video of a
loading screen. The live version is the argument, because the user watches
their own idea being worked on and can read every row as it arrives.** A
rendered version would also be a screenshot of the product, which is forbidden
outright (`media.md` §2, standing rule 13).

**(b) Every figure in `components/figures/`.** `NumberCallout`, `StanceBar`,
`RecencyStrip`, `ValueLadder`, `GapBar`, `RunFunnel`, `CapabilityMatrix`,
`DomainConcentration`, `DimensionStrip`, and the `Figure` wrapper itself. These
are hand-drawn CSS/SVG from validated data, every mark citation-linked (D6).
A generated chart would be a picture of numbers that are not the numbers. There
is no charting library in this repo and none will be added, and that constraint
applies to generated imagery for exactly the same reason.

**(c) The verification rule.** `.ob-verify-rule` — a 1px accent line that draws
itself left-to-right under an excerpt over `--ob-enter` 900ms and resolves to
`VERIFIED` or to a struck-through `DISCARDED` in `--ob-discard` grey. This is
the single most persuasive moment in the system and it is more convincing as
live DOM than as video, because the user can watch a real one fail.

Also do not generate: the console → report cross-fade (D8 — a 400ms CSS class,
R4, currently missing and to be *written*, not filmed), `EvidenceState`,
`ThinEvidenceNotice`, `CompetitorCard`, `SurprisePanel`, or any state reachable
via `?thin=1`.

**Listed here only so a future pass doesn't mistake any of it for a gap.**
HiggsField is the wrong tool for all three; the right tool is the browser.

---

## 3. Report ambient backdrop `[MEDIUM]`

**Lives in:** `app/r/[slug]/validate/page.tsx`, which mounts the page-owned
`<AppBackdrop variant="validate" />` behind the report's
`--ob-container-report` grid. The report component remains focused on report
content. Recipe in the Report section of `styles/obsidian-app.css`.

**Currently:** the approved static paper-fibre WebP is shipped at
`public/media/validate/report-field.webp` at the constrained opacity above, with
the CSS field retained underneath. **Still generation is complete;** only
optional image-to-video work remains — do not regenerate the still. No
`report-field.mp4` or `.webm` currently exists, so the WebP is the shipped
runtime asset.

**The hard warning, and it is the reason this entry is `[MEDIUM]` and not
higher:** this backdrop sits behind the densest surface in the product — a
`580px` prose column and a `400px` figure column with `100px` between them, and
every one of those figures draws its axes, ticks and gridlines at `--ob-grid`,
`rgba(244,244,245,0.06)`. **Any region of this asset brighter than that alpha
deletes the gridlines under it.** The failure is silent and looks plausible: the
figures still render, they just stop having a measurable frame, and the page
quietly degrades from "measurement" to "infographic". If the delivered asset has
a bright edge, crop it out rather than dimming the whole frame — a uniform dim
keeps the bright region relatively bright.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% lateral drift across the whole clip. No cuts, no zoom snap, no
subject entering or leaving frame. The shot should end almost exactly where it
started.*

**Format:** 16:9, 2560×1440, 20s, MP4 (H.264) + WebM (VP9), no audio, plus a
`report-field.webp` poster frame.

**Deliver to:** `public/media/validate/report-field.{mp4,webm}`. The approved
still at `public/media/validate/report-field.webp` remains the reduced-motion
and failure fallback.

**Code change to swap in:** add the `<video>` inside `.ob-backdrop` in
`report.tsx`, `preload="metadata"` (it is below the fold on first paint and must
not compete with the console asset for bandwidth), WebM source before MP4,
poster always present. The recipe pins it: `position: fixed; inset: 0;
z-index: -1; opacity: .10; pointer-events: none;` and the video inside is
`width: 100%; height: 100%; object-fit: cover; filter: grayscale(.4)`. Under
reduced motion render the poster `<img>` instead — this asset is ambient, so
under reduced motion it stops, it does not resolve to anything. The report grid,
the `--ob-report-prose` / `--ob-report-aside` columns, every `Figure`, the
section numeral spine and all hairlines stay exactly as they are; this sits
strictly behind them and touches no layout.

**Do not** exceed `opacity: 0.10` "to make it visible". If it is visible, it is
wrong. Measure it: read the computed `backgroundColor` of a figure's gridline
element and its immediate surround before and after the swap, and confirm the
gridline is still distinguishable from the ground.

---

## 4. Report Open Graph card `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15. Generate nothing for this.**
> `public/og/validate.png` ships, drawn in code by `app/style-guide/og/page.tsx`
> and committed at 1200×630, with `generateMetadata` on the validate route
> naming it. The brief below is kept for a redraw, not as an outstanding ask.

**Lives in:** `app/r/[slug]/validate/page.tsx` → `generateMetadata`, image at
`public/og/validate.png` (R20 in the old audit, R18 in this plan's Known rot
table, fixed in A15).

**Was:** every shared run link previewed as bare text. **The URL is the
entire access and distribution model of this product** — there is no auth, no
account, no sharing UI beyond `CopyLinkButton`. The report is the artefact
people send to a co-founder, an advisor or an investor, and right now it arrives
in Slack as a grey rectangle with a hostname in it. **This is the single
highest-value item across all five media-plan files, and it is the only entry in
any of them that fixes a real absence rather than upgrading something that
already works.**

**Composition, exactly.** 1200×630, ground deepest near-black, `72px` gutters,
nothing within `40px` of any edge:

- **Backdrop:** §3's winning still, cropped to 1.91:1 and darkened to
  `opacity: 0.14`. It is texture under the type and nothing else. If §3 has not
  been generated, ship the card on flat deepest near-black — it loses very
  little.
- **Top-left, y≈72:** the `Groundwork` wordmark plus `LogoMark` glyph, chalk,
  Geist 400, 22px.
- **Top-right, baseline-aligned to the wordmark:** `RUN SMS-REBOOKING-4F2A`,
  Geist Mono 500, 13px, uppercase, `+0.1em`, in the dim grey.
- **Headline, x=72, starting y≈220:** `What the web already says.` — Geist 400,
  76px, `-0.03em`, leading `1.02`, chalk. **Break it by hand across two lines:**
  `What the web` / `already says.` Weight 400 at 76px is not negotiable; a bold
  OG headline is the fastest way to make the card look like a different product.
- **One blue rule** directly beneath the headline, 32px below the last baseline:
  1px tall, 220px wide, electric blue, left-aligned to x=72. **This is blue
  doing its verification job** — it is the same rule that draws itself under a
  verified excerpt in the product, held still. It is the only blue on the card,
  and if anything else on the card becomes blue this rule loses its meaning.
- **The run's one-liner,** 28px below the rule: `SMS rebooking for dental
  clinics` — Geist 400, 26px, `-0.015em`, in the muted grey. Not chalk; the
  headline is the assertion and the idea is the subject.
- **Bottom meta line, x=72, baseline y≈558:** `19 QUERIES · 31 SOURCES ·
  47 VERIFIED · 18 DISCARDED` — Geist Mono 500, 15px, uppercase, `+0.1em`, dim
  grey, middot separators. Funnel order, matching `RunFunnel`, not the
  in-page `MetaLine` order.

**`18 DISCARDED` stays on the card.** It is the whole trust claim in two words.
A card that prints only what passed is a scoreboard, and this product does not
keep score.

**What must not appear on this card,** because a preview image is read in half a
second and a wrong signal there is worse than no image: no verdict word
(`validated`, `promising`, `risky`, `go`, `viable`), no score, no percentage, no
gauge, dial, ring, meter or progress bar, no tick or cross glyph, no green and
no red anywhere, no competitor names, no domain names, no favicon strip, no logo
wall, no screenshot or partial render of the report itself. **The card states
what was done, never what it means.** If someone can infer an opinion about the
idea from the card, redo it.

**Format:** 1.91:1, 1200×630 PNG. Static — no video, no animated variant.
Under 300KB.

**Deliver to:** `public/og/validate.png`. The backdrop plate it is built on, if
generated separately, goes to `public/media/validate/og-plate.jpg` at 2560×1440.

**Code change to swap in:** export `generateMetadata` from
`app/r/[slug]/validate/page.tsx` returning `openGraph: { title, description,
images: [{ url: '/og/validate.png', width: 1200, height: 630 }] }` plus
`twitter: { card: 'summary_large_image' }`. Set `metadataBase` in
`app/layout.tsx` or Next emits relative OG URLs and warns at build. Copy comes
from `lib/content/app.ts`, not from string literals in the page.

**This is deliberately a static PNG, not a `next/og` `ImageResponse` route.**
The prototype has exactly one fixture run, so a per-run dynamically rendered
card would render the same three strings every time while introducing the first
server-rendered surface in an app whose contract is that there are none. If the
run corpus ever becomes real, revisit — the composition above is already
parameterised by headline, one-liner and four counts.

---

## 5. Editorial photography inside the report `[LOW — do not add]`

**Lives in:** nowhere, and it should stay that way.

There is an obvious temptation at `05 WHAT SURPRISED US` — three genuinely
human findings, including a well-funded competitor that quietly shut down — to
drop in a photograph and let the section breathe. **Don't.** D18 assigns the one
honestly-human subject on the app side to the Roadmap's editorial band, and it
is one on purpose: a second human image on a different route turns a deliberate
editorial beat into a house style, and a photograph beside a citation-linked
finding implies the photograph is evidence. It isn't. Every surprise in that
section is a claim with a `[n]` behind it, and the correct visual for a claim
with a citation is the citation.

If `05` feels flat once the report is built, the fix is in code and it is
already specified: the section numeral spine, the figure column beside the
prose, and `NumberCallout` pulling `$6M Series A, 2024` [31] out of the sentence
it is currently buried in.

**Listed here so a future pass doesn't read the absence as an oversight.**

---

## Priority order

1. **§4 OG card** — a real absence, cheap to fill, and it fires every single
   time anyone shares a report, which is the product's entire distribution
   model. Highest priority in this file and across all five.
2. **§1 console cold start** — the strongest case for generated atmosphere
   anywhere in the app, and the only place on this route where the user is
   waiting rather than reading.
3. **§3 report backdrop** — only after A10 lands and the figure layer has been
   measured against it. Easy to make the page worse with.
4. **§5 — do not add.**
5. **§2 — do not touch.**