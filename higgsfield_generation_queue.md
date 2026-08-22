# Higgsfield generation queue

Every media asset in the build, **in the order to actually make it**, with a
canonical model-agnostic prompt, format and delivery path. Assembled 2026-08-21
from all six media plans — `higgsfieldPlan.md`, `higgsfieldPlan_shared.md`,
`_define.md`, `_validate.md`, `_roadmap.md` and `_sources.md`. **Those files
remain authoritative for *why*; this one is the *what, and in what order*.**

**Standalone still generation is complete, with one named exception.** The
remaining entries are optional image-to-video references: use the accepted local
WebP as the source frame, send a motion-only prompt, and do not regenerate any
still. **The exception is Batch 2** — the Run Console cold start has no still and
never had one, so it cannot be reached by an i2v call. Read that batch before
assuming everything is covered.

**No open code tasks remain above Gate B.** Batch 0 (app mark / favicon) and Batch 1's
still swap-in both shipped on 2026-08-22. Everything left is optional paid
image-to-video, Batch C, or the blocked Batch 2 decision. **Batch C is no longer
a capture batch by default** — C2 shipped as a capture, was reverted, and
re-shipped as a coded interaction the same day; see that batch.

### Codebase truth overrides stale plan-file paths

The source plans remain authoritative for intent, but several implementation
paths in them predate A15. Use these current facts:

- The shared recipe is `.ob-backdrop` in `styles/obsidian.css`; there is no
  `.ob-app-field` or `.ob-app-backdrop`.
- Each page mounts `AppBackdrop`; `RunShell` does not. The component currently
  accepts only `{ variant }`, so any `src`, asset or state prop named below is a
  **required API extension**, not existing code.
- Validate's backdrop is mounted in `app/r/[slug]/validate/page.tsx`, not
  `components/validate/report/report.tsx`.
- The invalid-run branch lives in `app/not-found.tsx` and renders
  `components/layout/run-not-found.tsx`; no `app/r/[slug]/not-found.tsx` exists.
- The explorer is
  `components/validate/explorer/evidence-explorer.tsx`, not a `sources/`
  subdirectory.
- Define receives no generated asset. Its current CSS blooms are a separate
  implementation discrepancy, not permission to generate one.

## Priority, and what each batch is actually worth

**The port is finished.** A0–A15 all read `DONE`, `styles/components.css` is
deleted, no Deep Canopy remains, and all five OG cards ship. The baseline is not
an unfinished site — **it is a finished, coherent site with one optional cold-start
gap (Batch 2) and optional motion layers everywhere else.** That caps what
generation can add, and the cap is lower than it looks.

**Honest estimate: even the legacy all-15-clip scope moves overall perceived
quality by roughly 5–10%, and most of the remaining upside sits in optional Batch 1
and Batch 3 motion.**

| Order | Batch | Briefed clips / shipping cap | Gens | What it's actually worth |
|---|---|---|---|---|
| **0** | **App mark / favicon — SHIPPED** | — | **0** | Branded SVG, 16/32px ICO, 180px Apple icon and 512px app icon shipped 2026-08-22. |
| **C** | **Captures of the real app** | 1–3 | **0** | **C2 came back as a coded interaction, not a capture — read Batch C before scheduling C1 or C3.** Planning may run in parallel; any final capture waits for frozen surfaces and fixtures. C1 is on hold. |
| **1** | Fieldwork band — **stills SHIPPED** | 3 | **≤7 video calls** | Three WebPs wired 2026-08-22. Optional i2v only; stills alone capture most of the value. |
| **2** | Console cold start | 1 | **BLOCKED** | No source still exists and none is queued — see the batch. Decide it before budgeting it. |
| **3** | Hero collage | 5 / **2** | **≤5 video calls** | The local stills are retained; motion is an optional second pass. |
| — | **↓ GATE B ↓** | | | *Stay at or below 15 paid calls; this buys essentially all available gain.* |

### Why batch 1 motion still outranks batch 3

The three fieldwork stills shipped on 2026-08-22. Optional image-to-video on
that band is still the largest visible motion upgrade left — the hinge between
`01 OPEN QUESTIONS` and `02 BUILD ROADMAP` is now photography, and subtle motion
there reads as editorial polish rather than *assets pending*.

### Why the hero collage is worth doing anyway — and it isn't the pixels

The five hero stills are retained locally as approved WebP assets. They remain
the static treatment; no hero still generation or remote fetch is owed.

**The stronger argument was robustness.** The local copies remove the runtime
dependency on a third-party CDN — a reliability fix wearing a design upgrade's
clothes.

### Why Gate B is where it is

**The risk is asymmetric.** A great asset at `opacity: 0.10` moves the needle
slightly. A bad one — too bright, too busy, too stock — is instantly visible and
attacks a system whose whole argument is restraint. Batch 4b can *silently* erase
every gridline on the report and degrade it from "measurement" to "infographic".
For batches 4 and 5, expected value is genuinely negative, which is why both are
below the line rather than merely last.

---

## Index — remaining work, in execution order

**Queue update — 2026-08-22:** Batch 0 (favicon) and Batch 1 still swap-in
shipped. Standalone stills are complete or retained locally and are no longer
generation tasks. This includes the three fieldwork stills (now wired on
`/r/[slug]/roadmap`), the five local hero stills, and the standalone stills for
the ambient and empty-state surfaces. The detailed entries below remain only as
optional image-to-video references; use the existing local still as the source
frame and do not regenerate it.

| # | Asset | Where it lives on the site | Deliver to | Budget |
|---|---|---|---|---|
| **0 · SHIPPED** | **App mark / favicon** | Every tab and page | `app/favicon.ico` · `app/icon.svg` · `app/apple-icon.png` · `public/icon-512.png` | B0 |
| **C1 · HOLD** | Run Console stream — **coded interaction**, or a capture if it earns it | `/` — **new section; design approval required** | `components/landing/` | BC |
| **C2 · SUPERSEDED** | ~~Capture — brief + `I don't know`~~ → shipped as a **coded interaction** instead | `/` Pillars | `components/landing/idea-session.tsx` | **0** |
| **C3 · SCRIPT** | Roadmap card interactions — **coded interaction** | `/` Pillars, replaces a static `Fragment` | `components/landing/` | BC |
| **1 · SHIPPED** | Fieldwork band — three stills wired | `/r/[slug]/roadmap` band | `ASSETS` in `components/roadmap/fieldwork-band.tsx` | **0** |
| **1 · i2v** | Fieldwork band — optional motion (3 clips) | same | `public/media/roadmap/{conversation,expo,front-desk}.{mp4,webm}` | **≤7** |
| **2 · BLOCKED** | Console cold start — no still exists | `/r/[slug]/validate` Mode A | undecided; see Batch 2 | — |
| — | **Integrated stills** | `backdrop-field` · `app/not-found` · `hero/`×5 · `roadmap/{backdrop,conversation,expo,front-desk}` · `sources/field` · `sources/zero-results` · `validate/report-field` | Shipped; no generation | — |

### Hard call budgets

Every paid submission counts: draft still, final-resolution rerun, alternate
model, upscale/edit endpoint, i2v attempt and contingency. Unused calls do not
roll into a later batch without renewed approval.

| Budget | Draft stills | Final reruns | i2v calls | Contingency | Hard cap |
|---|---:|---:|---:|---:|---:|
| B0 / BC | 0 | 0 | 0 | 0 | **0** |
| B1 fieldwork | 0 | 0 | 3 | 4 | **7** |
| B2 console | 0 | 0 | 2 | 1 | **3** |
| B3 hero | 0 | 0 | 2 | 3 | **5** |

There is no `B5a` row: every below-the-line still is already integrated, so
batches 4 and 5 carry no budget of their own and must draw from a renewed
approval if motion is ever authorized. `B3`'s two i2v calls are the total hero
cap, not two calls per card. If a native high-resolution rerun is unavailable, move
that call to contingency; do not silently add a paid upscale. Model bake-offs
also consume contingency — there is no free pilot outside these caps.

**The legacy full brief contains 15 clips and roughly 60 generations. It is not
the shipping plan.** The approved stills are already local. Remaining paid work
is optional image-to-video only: use the stills already in `public/media/` and
stay within the reduced caps above. Batch C is outside both counts because it
costs no generation credits.

**The stills-only pass is the shipped state and cost zero Higgsfield calls.**
Batch 1 still wiring shipped 2026-08-22. Remaining fieldwork work is optional
video only:

| Family | Still-only implementation | Video-only addition |
|---|---|---|
| Fieldwork | **DONE** — `mp4`/`webm` optional on `FieldworkAsset`; `ASSETS` filled; WebP renders | Conditional player, offscreen pause and pause control |
| Console cold start | DONE — `RunConsole` keeps the CSS backdrop; no still exists | Transient non-looping player and cold-state cross-fade |
| Hero | DONE — local WebP cards replace Unsplash and keep parallax | Optional player on at most two cards plus pause control |
| Report / ambient / empty states | DONE — graded WebP mounted by `AppBackdrop` and the explorer | Conditional player, pause control and state ownership below |
| Product captures | Existing code-drawn `Fragment` remains the fallback | Capture player only after its script and freeze gate |

Every generated video still has a graded WebP poster for first paint and failure.
The console is the exception under reduced motion: `ValidateView` bypasses Mode
A and renders the report directly.

Routes with **no** generated asset anywhere: `/r/[slug]/define` (decided
against — see the do-not-generate list), `/style-guide`, all four loading
skeletons and all error boundaries.

---

## Before the first call

**`public/media/` exists and holds every integrated still**: `backdrop-field.webp`
plus `app/`, `hero/`, `roadmap/`, `sources/` and `validate/`. As checked on
2026-08-22, the six ambient/backdrop entries (`backdrop-field`,
`validate/report-field`, `app/not-found`, `sources/zero-results`,
`roadmap/backdrop`, and `sources/field`) have no `.mp4` or `.webm` files and
are not mounted as video. Their WebP files are the complete shipped state;
video remains optional image-to-video work. Only `capture/` is still missing,
and only Batch C creates it.

### Spend and schema gate

1. **Estimate before submitting.** Higgsfield exposes an estimate endpoint; run
   it with the exact model parameters and get approval for the batch total before
   the first paid call. Failed or moderated requests are not charged, but a weak
   prompt that succeeds still is.
2. **Discover the live model schema.** Higgsfield's public guide documents the
   request lifecycle, not every model's controls. Record which available
   endpoints expose native resolution, duration, seed, negative prompt,
   reference types/strength, camera controls, first/end frames, native FPS,
   output container, watermark and Content Credentials/C2PA. Record the exact
   model/version and verification date. Do not infer a parameter — or its
   behavioral quality — from another model or from this file.
3. **Use the planned variants as the bake-off.** For the first asset in each
   family — fieldwork, hero photography and abstract grounds — spend its first
   two still variants on the two best account-available image models and pick on
   prompt adherence. On the first clip that survives, use the planned motion
   retry to compare the two best video models on temporal stability. Keep each
   winning model fixed for the rest of its family. These calls come from the
   batch's contingency/i2v columns; they never sit outside the hard cap.

### Still-first workflow

1. Generate at the **final 16:9 aspect ratio**. A later crop changes the quiet
   zone and invalidates the composition test.
2. Iterate cheaply at the model's lower native resolution. Change **one
   variable per attempt** and log the change. Once a frame passes, rerun at the
   model's higher native resolution with the same seed when available. Treat the
   result as a new candidate and re-run every composition check; do not assume
   the draft will reproduce exactly. Use a deterministic resize only after the
   native final is accepted, and do not ask prompt words such as `8K` to do the
   resolution parameter's job.
3. Use the cleanest available output as the source still: no compression blocks,
   sharpening halos, fake film border, baked watermark or accidental writing.
4. Review candidates in a batch contact sheet at their actual crop, rotation,
   scrim and text overlay. A set that works together matters more than five
   individually impressive frames.
5. Approve the still **before** image-to-video. A rejected still costs one
   generation; a rejected clip costs the still and the clip.

Start with **one still per subject**. Authorize a second only after naming the
first result's concrete defect; reserve two extra attempts for composition-
critical 3.3 `centre`. Three misses with the same failure are a prompt, control
or model problem, not luck: stop, diagnose one variable, and change only that
variable before spending again.

### Prompt adapter — do not paste blindly

The blockquotes are canonical **still** prompts. If the selected endpoint has a
dedicated negative-prompt field, move the final `No…` sentences into it. If its
own documentation says negative prompting is unsupported, rewrite them as
positive invariants — for example, `unbranded objects; all writing defocused and
unreadable; camera-facing faces outside frame; restrained low saturation; clean
optics`. Copy the rendered prompt text, not Markdown `>` markers. Never send the
same constraint in both fields.

### Image-to-video

The source still already defines subject, composition, lighting and style.
Describe **motion only**. Pick one camera move, not a menu:

> One continuous shot. Over the full clip, [insert exactly one motion line
> from the table below]. Everything else remains nearly still; object count,
> geometry, crop, focus, exposure and lighting stay stable. No cut, transition
> or new object appears.

Do not repeat the still prompt in the video call. Use these lines verbatim for
the first pass. `3% push-in` means scale `1.00 → 1.03`; `3% lateral drift` means
three percent of frame width from first to last frame. Do not let a model invent
its own interpretation.

| Asset | Motion line |
|---|---|
| 1.1 conversation | `the camera makes a 3% push-in; both people hold their pose and the raised hand and notebook remain stable` |
| 1.2 expo | `the camera makes a 3% push-in down the aisle; distant figures remain nearly still and the overhead light does not flicker` |
| 1.3 front desk | `the camera makes a 3% lateral drift along the counter; every object remains fixed` |
| 2 aisle | `the camera makes a 3% push-in down the corridor; only a few dust motes drift slowly` |
| 2 reader | `the camera makes a 3% lateral drift; the spool and film remain fixed and out of focus` |
| 3.1 far-left | `the camera stays locked; the hand, pen and notebook marks remain fixed` |
| 3.2 left | `the camera makes a 2% push-in; both people remain fixed with no limb or facial motion` |
| 3.3 centre | `the camera stays locked; the empty central 40% remains empty and unchanged` |
| 3.4 right | `the camera makes a 2% lateral drift; the screen glow remains constant` |
| 3.5 far-right | `the camera makes a 2% push-in; the defocused texture and brightness remain stable` |
| 4a hero field | `the camera stays locked while the haze makes one barely perceptible, cyclical lateral drift` |
| 4b report field | `the camera stays locked; the paper fibre, lighting and focus remain static` |
| 4c invalid run | `the camera makes a 3% push-in; the lamp, chair and exposure remain fixed` |
| 5a zero results | `the camera makes a 3% push-in; the boxes or drawer and any hand remain fixed` |
| 5b roadmap field | `the camera stays locked while the haze makes one barely perceptible, cyclical drift across the lower right` |
| 5c explorer field | `the camera stays locked while the haze makes one barely perceptible, cyclical drift from the left` |

A push-in or lateral drift is monotonic, so its end frame cannot also equal its
start frame by prompting alone. It therefore needs first/end-frame conditioning
or a baked dissolve. If neither produces a clean boundary, switch that asset to
a locked camera and nearly static scene rather than asking the model to move out
and back; generated reversals usually look like a mistake.

### Loop strategy — capability check first

No prompt guarantees a seamless loop. Before accepting a workaround, inspect
the chosen endpoint for first/end-frame conditioning:

1. **If supported,** supply the accepted still as both first and end frame.
   This is the best control available, but still inspect for a mid-clip morph,
   speed reversal or exposure pulse.
2. **Otherwise,** generate near-zero motion and compare first/last frames side
   by side.
3. If it still seams, bake a short dissolve into **one exported file**. A CSS
   cross-fade with two simultaneous videos doubles decode cost and is a last
   resort, not the default.
4. Ping-pong only non-directional camera or haze motion, and bake the reversed
   half into the file. Never reverse a `<video>` at runtime.

### Run ledger and retention

For every call, record asset id, candidate id, date, model endpoint/version,
request id, correlation id when available, seed, exact positive/negative
prompts, reference role/strength/hash, controls, native dimensions, cost
estimate, parent-still hash, output filename/hash and accept/reject reason.
Change one field per retry so the result teaches you something. Higgsfield
retains outputs for **at least seven days, not indefinitely**; download accepted
and rejected candidates immediately to a working archive outside `public/`.
Seeds are not portable across models and may stop reproducing after a model
update. Never record credentials.

---

## Reference images and conditioning

**A prompt alone is the weakest way to control composition, and composition is
the entire acceptance criterion in this system.** `references/higgsfield.md` §6
says so directly: *"no text prompt reliably delivers that on the first try."*
This section is what to condition on, beyond the words.

### 1. The still → video step already is image conditioning

The legacy ceiling reserved **~40 stills against ~20 video passes**; the revised
staged authorization and hero cap should finish well below it. Every
image-to-video pass is conditioned on a still you have already looked at and
approved. Do not skip ahead to text-to-video on any asset in this file — the
frame is the deliverable, and any permitted motion is only a 0–3% layer on top.

**Practical consequence:** a rejected still costs one generation. A rejected clip
costs the still *and* the clip. Reject hard at the still stage.

### 2. Composition sketches — worth making by hand, ~5 minutes each

Six assets carried a compositional constraint that **decided accept/reject**.
**Five of the six are now settled** — their stills are accepted and integrated,
so the sketch is only useful if that asset is ever regenerated. The table is kept
as the acceptance record, and the one live row is marked.

If a sketch is still needed, feed the connector a crude greyscale block sketch —
black frame, a lighter blob where the subject belongs, flat black where it must
stay empty. No detail, no rendering; the model reads the value distribution.

| Asset | The sketch must show | Why it decides the asset |
|---|---|---|
| 3.3 `centre` — *settled* | Subject mass in the **outer 30% on each side**, central 40% flat black | The 104px headline sits in that central region. Filled = unusable. |
| **2 console cold start — LIVE** | Overlay the actual 320px query rail and findings column; no bright mass behind either | The console is dense even before its first finding and cannot tolerate a focal object behind either column. **The only row that still applies** — see Batch 2. |
| 4b report field — *settled* | Uniform near-black value across the whole frame | A directional gradient can erase figure axes and gridlines even when the subject prompt passes. |
| 4c not-found — *settled* | Single light source **lower right**, left two-thirds flat black | Headline, both paragraphs and `RecentRunsList` occupy the left two-thirds. |
| 5a `archive` — *settled* | Subject mass in the **right 40%**, left 60% flat black | The shipped typography occupies the left 560px of a ~1040px region and needs crop tolerance. |
| 5c explorer field — *settled* | Left 260px and everything below the top 420px flat black | The facet rail is media-free and the field must end before the first run-section hairline. |

Label every reference by role — composition, subject, identity or style — and
record its crop, strength, source and checksum in the ledger. Start sketches at
low reference strength: some models reproduce a sketch's flat aesthetic instead
of using only its layout. The 420px explorer cutoff and rail exclusion are still
enforced by CSS masks; the reference only keeps the source frame quiet.

### 3. Existing images are crop references, not conditioning inputs

Batch 3's five hero stills — now local WebPs in `public/media/hero/`, downloaded
from their original Unsplash sources — show the current crop and mass
distribution, but do **not** feed them to a generator. They carry a
photographer's content and style, can leak unwanted visual features into the
result, and their licence may not grant model-conditioning rights. Use the live card geometry to
make a neutral greyscale block sketch instead. Only use a third-party image as a
model input after verifying both its licence and the selected model's terms.

### 4. Open question — check before accepting `references/higgsfield.md` §5

`references/higgsfield.md` §5 states flatly that *"every model gives you a clip
with a start and an end that don't match"* and then spends three subsections on
workarounds. **It does not mention start-frame + end-frame conditioning.**

Several video models expose keyframe variants elsewhere. **If the Higgsfield
endpoint exposes an end-frame parameter, test the accepted still as both ends.**
That constrains the boundary but does not guarantee good motion between them, so
the first/last-frame and temporal-coherence checks still apply.

**Check the live schema before generating any clip.** Higgsfield's public API
guide does not document this control as a platform-wide feature as of
2026-08-21; it is model-specific and unverified here.

### 5. What must never be used as a reference

**Screenshots of this product, fed to a generator.** Not for the pillars, not for
the console, not for a landing-page demo. `higgsfieldPlan_shared.md` §6 is
explicit about the failure mode: *"generated approximations of your own UI are
uncanny and date instantly."* A model given a screenshot of `BriefPanel` returns
something that is almost `BriefPanel`, and almost is worse than either the real
thing or an honest photograph.

**If you want the product on screen, capture it — see Batch C.** That is a
different operation with a different tool and it costs nothing.

### 6. Rights, identity and provenance

- Use only references you own or are licensed to use for model conditioning.
- Before paid work, verify the selected endpoint's commercial-use terms,
  input/output retention and training policy, watermark rules and any
  jurisdictional AI-disclosure requirement; save a dated terms/licence snapshot.
- Do not request a real person, celebrity, customer, logo or recognisable
  business. Reject public-figure resemblance, trademarks, uniforms, patient
  information or identifiable reference-person imitation. Human figures here
  are fictional and atmospheric.
- Keep the original generator output, the final grade/export and the run ledger
  together. Preserve Content Credentials/C2PA when the endpoint supplies them;
  otherwise the ledger and hashes are the provenance. The public filename is not
  enough.
- These images must never be presented as research evidence. Batch 1 is an
  editorial illustration of fieldwork and remains visually separated from
  citation-linked findings.

---

## The acceptance test every asset must pass

From `higgsfieldPlan_shared.md` §0. This is the constraint the file itself flags
as *the one that will get broken*.

Composite the asset with its **real crop, `object-position`, filter, scrim, veil,
opacity and live type**, then test at both 1440px and 1280px. Apply the line test
only where real hairlines, report gridlines or text cross media. Capture the
existing CSS/still state as the baseline, then the candidate state. Sample final
rendered pixels in linear-light relative luminance along every crossing:

- each line's minimum local contrast against adjacent pixels must retain at
  least **80% of its baseline value** across its full length;
- essential text must still meet its applicable WCAG contrast threshold at the
  worst sampled location;
- a sighted review must still read every tested line as continuous.

If any stretch disappears, the asset is too busy at the point of use. Recompose
before trying to rescue it with a global grade.

Any still reused for an OG card gets a separate 1200×630 crop/safe-zone review;
passing its 16:9 in-product crop does not approve the social crop.

The previous `5 of 255` peak-to-trough rule was not colour-space-safe and its
stated premise was wrong: the opaque hairline token is roughly 25 sRGB code
values above the canvas, not 13. Treat the visual continuity test as
authoritative. Do not measure the raw asset, average the whole frame, or read
only the computed CSS colour — none includes the pixels underneath the line.

Every still must also pass:

- intended text-safe zone empty at both viewport crops;
- intended subject mass remains inside its allowed region after
  `object-fit: cover`, rotation and up to 3% generated camera displacement;
- no accidental readable text, logo, watermark, extra finger/limb, duplicated
  object, melted geometry or compression banding in shadows;
- no face in sharp focus and no resemblance to a known person;
- batch contact sheet feels like one photographic system;
- approved source master is sRGB; video exports are SDR Rec.709, with no HDR/P3
  tag that shifts the blacks in-browser.

Every clip must additionally pass:

- first, middle and last frames preserve object count, anatomy, geometry,
  lighting, focus and exposure;
- for looping clips, first/last frames viewed side by side and ten hard loops
  watched in-browser; for the console cold start, verify fade, pause, source
  detach and unmount at the first finding or five-second limit;
- one camera move only, no hidden cut, snap, morph, flicker or focus breathing;
- zero audio **track**, not merely a muted track;
- reduced motion resolves to the approved still, never a paused partial state.

QC sampling reference only — **do not paste hex values into prompts**:
near-black `#0A0A0B`, deepest `#060607`, chalk `#F4F4F5`, accent `#2D7FF9`,
discard grey `#4A4A52`.

---

## Source masters and web delivery

Generation resolution and browser delivery resolution are different jobs.
Preserve the cleanest native output as a source master outside `public/`; ship
only optimized derivatives.

| Family | Source master | Default web derivative |
|---|---|---|
| Fieldwork panels | Highest verified native 16:9 output | 960×540, 10–12s, ≤1.5 MB per codec |
| Hero centre | Highest verified native 16:9 output | 1280×720, 10–12s, ≤1.5 MB per codec |
| Hero outer cards | Highest verified native 16:9 output | 960×540, 10–12s, ≤900 KB per codec |
| Full-viewport atmosphere | Highest verified native 16:9 output | 1920×1080 maximum, ≤2.5 MB per codec |
| Product capture | Exact CSS-pixel capture; never upscale | Native crop, 24–30 fps, shortest honest action, ≤3 MB per codec |

Duration labels are presentation targets, not API requirements. Use the
shortest verified native duration even when it is below 12 seconds. Do not chain
or interpolate generations merely to reach 20 seconds; build any clean repeat
in post.

These are performance budgets, not generation parameters or reasons to crush
the image. Do not regenerate solely to obtain a duration, resolution or codec:
transcode after approval. If upscaling is unavoidable, use one temporally aware
video pass rather than independent frame upscaling, then reject shimmer. If an
accepted clip cannot meet a budget without visible banding or damaged text,
shorten it, reduce motion, or ship the still — do not raise the budget silently.

Delivery rules:

- MP4: H.264, `yuv420p`, SDR Rec.709, constant frame rate and fast-start
  metadata.
- WebM: VP9, constant frame rate and a keyframe interval no longer than two
  seconds. Keep the source frame rate (24–30 fps); do not interpolate to 60.
- Strip the audio stream entirely and verify it with media metadata.
- Derive the poster from the approved source still through the **same final
  grade and crop** as the video; export WebP in sRGB. Do not pick an arbitrary
  generated video frame.
- Put WebM before MP4; use `autoPlay muted loop playsInline`,
  `object-fit: cover`, and an aspect-ratio wrapper that reserves final space.
  Keep the poster visible if video loading or playback fails.
- `preload="metadata"` only for the one imminent clip. Defer sources for
  below-the-fold media until near the viewport.
- Render no `<video>` at all for `prefers-reduced-motion` or `Save-Data`; CSS
  hiding is insufficient because it can still download and decode. Pause
  offscreen media and all media while the document is hidden.
- Keep pages and `AppBackdrop` server-first. Where the owner is already client
  (`RunConsole`, `ValidateView`, `HeroCollage`, `FieldworkMedia`,
  `app/not-found.tsx`), that owner conditionally mounts media. Roadmap/sources
  backdrop video would require one shared client media leaf; adding it needs the
  repository's client-boundary build-log note. Do not make a whole page client
  for a background.
- Any autoplay loop continuing beyond five seconds needs a visible pause/stop
  control for WCAG 2.2.2. If that control does not belong on the surface, ship
  the still instead.
- Hero and ambient media are decorative (`alt=""`, `aria-hidden="true"`).
  Fieldwork uses concise descriptive alt text: `Two people in a cramped back
  office; one takes notes while the other speaks.`, `A nearly empty trade-hall
  aisle before opening.`, and `An after-hours reception counter with an open
  appointment book.`
- Use content-hashed filenames or an explicit asset-version query when replacing
  a stable URL; do not rely on users evicting a stale CDN/browser cache. Paths in
  the index are logical stems — append the hash consistently and update the
  typed asset record.
- Five simultaneous hero decoders are not the default. Ship all five stills
  first; if motion materially improves the composite, animate the safest card,
  then at most one more. Do not default to the centre. The existing parallax
  already moves the set.

---

## Prompt corrections — read this once before generating

The six source plans were written separately, and their prompt blocks share
two fixed blocks that were designed for **a subject standing in a dark room**.
Four assets here are not that — they are full-bleed *grounds* — and six subjects
contain writing that the shared negative block forbids outright. Both mismatches
produce a plausible-looking result that fails on delivery, which is the expensive
kind. Every prompt below ships corrected; here is the full diff.

| # | Affects | Plan-file wording | What ships here | Why |
|---|---|---|---|---|
| **PC1** | 4a, 5b, 5c | `Matte black background.` | `The haze fills the frame edge to edge and falls away to black with no visible border.` | These three are **grounds, not subjects**. "Background" instructs the model to place the haze *on* something, producing a visible edge. The report field (4b) is handled separately as a uniform macro texture with no vignette. |
| **PC2** | 4a, 5b, 5c | `shallow depth of field` + generated `cool-blue bloom` | dropped; neutral monochrome field | Volumetric haze has no subject plane to focus on, and a generator cannot hold the product's exact accent hue across three clips. CSS supplies the controlled accent wash. Asking for shallow DoF invites an invented sharp object. |
| **PC3** | 3.3, 2-`reader`, 5a-`archive`, 5a-`drawer` | constraint stated in prose only | constraint moved **into** the prompt | "Empty central 40%", "the spool must be out of focus", and "left 60% featureless" are the accept/reject criteria. A constraint the model never sees cannot be met, and these are the ones that decide whether the asset is usable at all. |
| **PC4** | 3.1, 3.2, 3.3, 4a, 5b, 5c | `Slow drift of the pen` · `a shift of weight` · `Camera pushes in very slowly` · `moving/drifting haze` | dropped from the **still** prompt; carried by the i2v pass | The workflow is still-first. Motion words in a still prompt only bias composition — they can't produce motion, and they nudge the model toward a blurred frame. || **PC5** | 1.1, 1.3, 3.1, 3.2, 3.3, 3.5 | `No text` | `No legible text` | Each of these subjects **contains writing** — notebooks, printed notes, sticky notes, an appointment book or a monitor texture. A hard `No text` fights the subject and the model resolves it as mush or drops the subject. **Illegible is the goal; absent is not.** Strict `No text` is kept everywhere the subject has no writing in it. |
| **PC6** | 3.5 | `Dense text and data on a monitor` | `Dense illegible text-like texture on a monitor` | The same conflict at the subject end. The brief's own intent is *"so it reads as texture not content"* — this says it in the words the model acts on. |
| **PC7** | 1.1, 1.2, 3.4, 4c | generic `single hard key light from one side` | each subject's specific practical light wins | The back-office fluorescent, expo's overhead pools, laptop's screen glow and invalid-run lamp each conflict with the generic side key. Keeping both asks the model to solve two lighting diagrams. The corrected prompts below contain one source each. |
| **PC8 · HISTORICAL** | **C2 (reverted)** | `I don't know` flipping `9 of 12 answered · 3 unknown` | the counter flipping **from** `9 of 12 answered · 3 unknown → open questions` **to** `8 of 12 answered · 4 unknown → open questions` | The card described an interaction the app does not have. `answeredCount` (`lib/brief-state.ts:165`) resolves against the **base fixture statuses**, not `revealed`, and `lib/fixtures/brief.ts` ships exactly 9 filled / 3 unknown / 0 pending — so `9 of 12 · 3 unknown` is on screen from first paint and **never moves**. Pressing `I don't know` on a filled field moves the count **down**. The card also dropped the real string's `→ open questions` suffix. Making the counter track `revealed` instead would be a **product decision, not a media task**, and was out of scope for a capture. **Kept although C2 was reverted:** the finding is about the app, not the recording, and it is still true — the Define counter never moves on its own. Anyone briefing a Define surface, coded or captured, needs it. (The shipped `IdeaSession` shows no counter at all, by decision.) |
| **PC9 · STANDING** | **any capture** | *(unstated)* — capture at 1440×900 | capture at **2160×1350 with `html{zoom:1.5}`**, cropped 660×564, drawn at 440 CSS px | The Define aside is a fixed 440px column (`--define-aside`), so a 1440 capture yields only 440 real pixels and drawing it at fragment width upscales it — which `How to capture` forbids. Recording zoomed makes the draw a downscale instead. **2880×1800 (zoom 2) does not work**: Chromium's screencast cannot keep up and stretches the timebase ~10× — 2501 frames for a 10-second session — so the recording desynchronises from reality and frames show states that never existed. 2160×1350 measured 270 frames against 11.7s wall clock, which is correct. **This one outlives C2 and is not historical.** The timebase stretch is silent — the file plays, the frames look plausible, and only a frame-count-against-wall-clock check catches it. **Anyone attempting any capture must verify frame count against wall clock before trusting the take.** |
| **PC10 · HISTORICAL** | **C2 (reverted)** | *(unstated)* — draw the capture at the 624px fragment width | draw it at **440px**, its true app scale | A 440px app column stretched to 624px magnifies its 12px labels to ~17px, so the fragment reads as a zoomed screenshot rather than a UI at rest, out of register with the code-drawn fragments beside it. At 440 the box is 440×376 — within a pixel of pillar 02's 375px height. **Kept as the worked example of reason 2** in "Why C2 came back as code": a capture cannot be sized to the slot, so the slot ends up sized to the capture. The coded replacement is simply 624×375, because code has no intrinsic scale to preserve. |

---

## Batch 0 — App mark / favicon `[SHIPPED 2026-08-22 · ZERO GENERATIONS]`

**Not a generation, and the highest quality-per-effort item in the media
backlog.** Completed before opening a generation tool.

**Shipped:** the inherited Next.js favicon was replaced. The branded
`app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png` and
`public/icon-512.png` now use the same resting Groundwork glyph.

**Brief:** the `LogoMark` glyph from `components/layout/logomark.tsx` standing
alone — an outlined square with a filled lower-left corner stone, a surveyed
plot with one corner set. Chalk on near-black, on a 32-unit viewBox with the
glyph at 24 and 4 units of padding all round. Stroke weight is 1 unit at 32.
The shipped icon uses the resting state, not the nav's 90° hover rotation.

**Deliver to:** a branded multi-size `app/favicon.ico` (16 and 32px),
`app/icon.svg`, `app/apple-icon.png` (180px), and `public/icon-512.png`.

Rasterize every size directly from the same SVG in sRGB. Pixel-check 16px: the
outline stays open and the lower-left stone stays distinct.

**Code change:** replace the inherited `app/favicon.ico`; add `app/icon.svg` and
`app/apple-icon.png`. Next 16.3's file conventions emit their tags
automatically. Inspect the rendered `<head>` and verify every emitted icon is
branded. `public/icon-512.png` is not auto-discovered.

**Do not send this to a generator.** Diffusion cannot hold crisp 1px geometry at
icon scale.

---

## Batch C — Product surfaces in motion `[ZERO GENERATIONS]`

**Not a Higgsfield batch.** Lettered rather than numbered because it is a
different operation with a different tool. **It costs no generation credits
either way.**

**Read "Why C2 came back as code" below before scheduling C1 or C3.** This batch
was written as *captures of the real app*, and C2 shipped that way on
2026-08-22 and was reverted the same day. The default for a pillar slot is now a
**coded interaction**; a capture has to argue for itself against three specific
failures, and only C1 plausibly can. Where a capture is still the answer,
planning can run in parallel but final recording waits until the relevant
surface, fixtures and media swaps are frozen.

**Pillar 02 went the same way on 2026-08-22, without ever entering this queue.**
Its static evidence `Fragment` was replaced by `ValidateSession`
(`components/landing/validate-session.tsx`) — a coded interaction: a revenue
model drawing itself, three competitors swinging in on a 3D arc, and those same
three elements collapsing into assumption rows that resolve one at a time. A
capture was ruled out up front for the reason that decides every card in this
batch: **small text**. Video generators cannot render `EV_04` or `TAM $2.4B`
legibly, codecs turn 1px hairlines to mush, and near-black gradients band.
`higgsfieldPlan.md` §3 has been updated to match. Two of the three pillars are
now coded interactions; only pillar 03 (C3) is still static, and it is already
scripted as a coded interaction too. **No pillar slot is a capture candidate.**

### Why this exists, and why now

Three separate plan files independently reached the same conclusion — that the
honest upgrade for a product surface is a **recording of the real app**, not a
generation:

- `higgsfieldPlan.md` §3 (pillars): *"screen-recording-style loops of these same
  surfaces in motion — fields filling in, evidence rows landing one at a time,
  chips resolving from grey to blue. That is a screen recording of the real app
  **once the run pages are built**, not a generated asset."*
- `_roadmap.md` §3: *"The only honest upgrade is a screen recording of the real
  cards in motion — the accordion opening, the dependency pulse landing, the copy
  label swapping to `Copied`."*
- `_shared.md` §6 reaches it from the other direction: a generated approximation
  of your own UI *"is uncanny and dates instantly."*

**All three deferred it on the same condition, and that condition is now met.**
A0–A15 all read `DONE`. The run pages exist. This was impossible when the plans
were written and is possible today.

### The distinction that makes this legal

The system's rule is *"never screenshots"* (CLAUDE.md; `media.md` §2; standing
rule 13). That rule forbids **pasting a static PNG of your own UI into a slot** —
which is why `components/landing/fragments.tsx` draws those surfaces in code
instead. It does not forbid capturing the app in motion, and the three plan files
above endorse exactly that.

The line, stated once:

| | Verdict |
|---|---|
| Static screenshot of the UI, shipped as an image | **Forbidden** — draw it in code as a `Fragment` |
| Screenshot fed to a generator as a reference | **Forbidden** — uncanny, see §5 of the conditioning section |
| Screen recording of the live app, shipped as video | **Endorsed** — and it is a capture, not a generation |
| Captured video under reduced motion | **Use the code-drawn `Fragment`** — not a screenshot poster |

**One hard exception, from `_shared.md` §6:** do **not** replace the live Run
Console on `/r/[slug]/validate` with a recording of itself. There, the visitor
watching it happen *is* the argument. A capture is only honest on a surface where
the live thing cannot be — which means the landing page.

### Candidates, ranked

| | Interaction | Where it would go | Note |
|---|---|---|---|
| **C1 · HOLD** | Run Console, one honest 10–14s excerpt — queries resolving, findings landing, discard count climbing | `/` — a new section | Requires landing-section design approval. **The one surface where a real capture may still argue for itself** — see below. If captured, label it an excerpt and do not speed-ramp it. |
| **C2 · SUPERSEDED 2026-08-22** | ~~`Product` settling in, then `I don't know` flipping the counter down to `8 of 12 answered · 4 unknown`~~ | `/` Pillars | **Shipped, reverted, and re-shipped as a coded interaction the same day** — `IdeaSession`. Read "Why C2 came back as code" below before attempting C1 or C3 as a capture. |
| **C3 · SCRIPT** | Roadmap card — accordion opening, `DependencyChip` pulse, `Copied` label swap, 6–10s | `/` Pillars | Named verbatim by `_roadmap.md` §3. **Approach changed to a coded interaction** — same three reasons as C2. Still in the queue; only the method changed. |

**C1 is a new landing section, not an asset swap — treat it as a design change,
not a media task.** `/` currently runs Hero → `DimensionMarquee` → `Pillars` →
`Verification` → `CofounderChat`, and it already has two live motion moments
(`Verification`'s draw-on rule, `CofounderChat`'s typing). D17 caps continuous
motion sources per surface. **Adding a third needs a decision about what it
displaces, not just a file.** Do not ship it as "one more section."

C2 and C3 are cheaper and safer: they replace a static `Fragment` in a slot that
already exists, with no layout change.

### Why C2 came back as code `[2026-08-22 — read this before C1 or C3]`

**C2 shipped as a capture and was reverted the same day.** Not because the
capture was badly made — it met every value in its own card — but because three
problems only became visible once it was on screen, and all three are properties
of *capturing a fixed-width app surface into a fixed-width slot*, not of that
one recording. **Assume they apply to C3, and largely to C1.**

1. **A capture ships the fixture's narrative, not the section's.** Pillar 01 and
   section 03 (`CofounderChat`) are one continuous story — the *fitness* idea,
   lapsed lifters, `CHAT_SCRIPT` into `FRAGMENT_CONVERSATION`. The only Define
   surface that exists to capture is the *dental* run (`sms-rebooking-4f2a`), so
   the capture dropped an unrelated second idea into the middle of that arc.
   Nothing about the recording was wrong; the source was. **C3 has the same
   problem** — the roadmap fixture is dental too, and pillar 03 sits in the same
   arc.
2. **Geometry stops being a design decision and becomes a constraint.** The
   Define aside is a fixed 440px column (`--define-aside`), so size,
   magnification, zoom level and duration were all compromises forced by the
   source. PC9 and PC10 are both symptoms of this, not independent findings.
3. **The frame cannot always hold the argument.** `I don't know` sits in the
   composer at the bottom-left; any crop containing both it and the brief panel
   is ≥1240px wide, which renders body text at ~9px. The cause ended up
   off-screen and the pillar's own copy had to carry it.

Drawn in code all three dissolve, and it is the repo's own default: *"Product
surfaces are drawn in code as real UI fragments — never screenshots, never
stock."* The replacement, `components/landing/idea-session.tsx`, is a ~14s
looping conversation at exactly 624×375, in rhythm with pillars 02 and 03,
narratively continuous with section 03, with a genuine reduced-motion end state
and zero bytes of media.

**C1 is the one surface where a capture may still argue for itself.** The Run
Console's claim *is* duration and accumulation — queries resolving, findings
landing, the discard count climbing over 45 seconds — and it is a full-width
surface, so reason 2 does not bite. Reason 1 still does: it would be the dental
run on a page telling a fitness story. Settle that before recording anything.
Note the hard exception in "The distinction that makes this legal" still stands
either way: never replace the *live* Run Console on `/r/[slug]/validate` with a
recording of itself.

### Capture-script gate

No final recording starts until its card contains all of these values:

| Field | Required value |
|---|---|
| Source route | Exact route and fixture slug |
| Freeze point | Git commit/hash for the surface and `lib/fixtures/` |
| State setup | Exact local/session-storage keys and URL query |
| Crop | Stable selector and expected CSS-pixel bounds |
| Timeline | Timestamped clicks/keys and expected intermediate states |
| Finish | Exact final state and hold duration |
| Delivery | Duration, FPS, codec budget and code-drawn fallback |

C1 remains `HOLD` until the new section is approved. C3 remains `SCRIPT` until
its card is filled and replayed twice with identical bounds and state. A
filename and a general interaction description are not a script.

### C2's filled card `[HISTORICAL — the capture this describes was reverted 2026-08-22]`

**Kept, not deleted.** The interaction it describes is no longer on the site —
see "Why C2 came back as code" above — but this is the only worked example of a
filled capture-script card in the repo, and every row in it is a real value that
had to be discovered. **If C1 or C3 is ever recorded, fill a card that looks
like this one.** The `Viewport`, `Layout pin` and `Crop` rows in particular are
the ones that cost the most to find.

| Field | Value |
|---|---|
| Source route | `http://localhost:<port>/r/sms-rebooking-4f2a/define`, served by `next build && next start` — **not `next dev`**, whose Strict Mode double-invokes the mount effect that seeds the first turn |
| Freeze point | `5f03394` + the working tree of 2026-08-22; `lib/fixtures/brief.ts` at 9 filled / 3 unknown / 0 pending |
| State setup | `addInitScript` clears every `sv.*` key, then writes `sv.brief.sms-rebooking-4f2a` = `{v:1, revealed:[all 12 except product and customer], unknown:[], edited:[], values:{}, approvedAt:null}` |
| Viewport | 2160×1350, `deviceScaleFactor:1`, `reducedMotion:'no-preference'`, `html{zoom:1.5}` applied **after** `goto` |
| Layout pin | `html,body{height:900px}`, `.ob-app{height:900px}`, `main.ob-app-main[data-chrome='surface']{height:calc(900px - var(--ob-header-h))}` — without this, `100vh` doubles under zoom, the document overflows, and `composerRef.focus()` scrolls the whole page mid-take |
| Hygiene | scrollbars and cursor suppressed; mouse parked outside the crop after the click |
| Crop | measured at runtime — `x 1500, y 134, 660×564`, from `.ob-define-aside` and `.ob-brief-progress` rects |
| Timeline | settle starts 5.71s · `Product` filled 6.60s · click 7.88s · end 9.81s (wall clock) |
| Trim | in 5.0s, out 9.4s of the recording — **an in-point choice, not an edit**; no cut within the take, no speed ramp, no reordering |
| Finish | `8 of 12 answered · 4 unknown → open questions`, `Product` = `unknown → OPEN QUESTION`, held ~1.4s |
| Delivery | 4.40s · 25fps · 660×564 · H.264 175KB + VP9 107KB · **no audio track** · `public/media/capture/brief.{mp4,webm}` |
| Drawn at | 440 CSS px — a downscale from 660. Never looped; plays once on `IntersectionObserver`, rests on the final frame |
| Fallback | the code-drawn `Fragment`, never a poster still; under reduced motion **no `<video>` is mounted at all** |

### How to capture

**Playwright MCP against a running `next dev`, at 1440px** — the same loop
`references/verification.md` prescribes for verifying a screen. Record the
component's exact bounding box, not the browser window; wait for fonts and the
fixture state to settle; hide the pointer; and use deterministic local-storage
state. Clear unrelated local storage and confirm the frame contains fixture data
only — no personal idea text, email, path, notification or browser chrome.
Record the fixture commit/hash in the ledger. Capture at CSS-pixel resolution
and 24–30 fps. Never upscale.

Deliver MP4 + WebM to `public/media/capture/`. Do **not** deliver a static
screenshot poster: keep the existing code-drawn `Fragment` behind the video,
reveal the video only after `canplay`, and render the `Fragment` alone under
reduced motion. C1 must design and build an equivalent code-drawn static
end-state before it can ship.

If the motion is essential to understanding the claim, adjacent copy must state
the same sequence. Otherwise mark the video decorative. Autoplay remains muted
and the encoded file contains no audio track.

**The three things that will go wrong:**

- **Staleness.** A capture is a photograph of one fixture state. The moment a
  fixture number changes, the recording disagrees with the app — and this product
  is *about* its numbers matching. Re-record whenever `lib/fixtures/` changes, or
  don't ship it.
- **Weight.** A screen recording of dense type is far heavier than the
  photographic clips in this file, because there is no scrim hiding compression
  artefacts. Keep only the shortest complete action, then check text edges and
  the size budget at 1440px before committing.
- **Misleading edits.** No jump cut, speed ramp or reordered event. C1 is a
  labelled continuous excerpt; C2/C3 each show one complete real interaction.

---

## Batch 1 — Fieldwork band, 3 clips `[STILLS SHIPPED 2026-08-22 · optional i2v]`

**Stills shipped 2026-08-22.** The three approved WebPs at
`public/media/roadmap/{conversation,expo,front-desk}.webp` are wired in
`ASSETS` and render through `FieldworkMedia`. The band is now the page's
editorial hinge — photography where the web declined to answer.

**Remaining work in this batch is optional image-to-video only.** Composite the
band at 1440px and 1280px before authorizing motion. Stills alone capture most
of this batch's value.

**What the band has to say:** *the answers to these six questions are not online,
and getting them means an awkward conversation with a stranger.* Not
"collaboration". Not "team". Not "startup life". **If a panel could appear in a
bank's annual report, it is wrong and must be regenerated.**

**For this band and nowhere else: no suits, no handshakes, no glass-walled
conference room, no laptop hero shot, no whiteboard, no sticky notes.** The
whiteboard is the landing page's vocabulary (batch 3, `centre`) and reusing it
here makes the two surfaces look like the same page.

It is the only place photography is honestly on-subject anywhere in the app. Do
not regenerate the shipped stills; authorize optional video only after compositing.

### 1.1 `conversation` — caption `01 · 8–10 CONVERSATIONS`

> Two people at a small table in a back office, three-quarter from behind and to
> one side. One is mid-sentence with a hand half-raised; the other is writing in
> a notebook and not looking up. A paper cup, a folder, a chair pushed out.
> Cramped, not a meeting room. Nobody is presenting to anybody. One harsh
> overhead fluorescent practical just outside frame creates a narrow pool of
> light; the rest of the room falls into deep shadow. Shot on 35mm, shallow
> depth of field. Near-monochrome, desaturated, cool grade. Matte black
> background. Cinematic, restrained, documentary — not stock photography. No
> legible text, no logos, no legible screens, no watermarks. Nobody looking at
> the camera; no face in sharp focus. No bright saturated colour, cyan/teal
> cast, lens flare, decorative bokeh, glossy CGI or polished corporate-stock
> styling. No suits, handshakes, glass walls, presentation pose, laptop as focal
> subject, whiteboard, sticky notes or aspirational office styling.

### 1.2 `expo` — caption `02 · ONE REGIONAL EXPO`

> A trade-hall aisle photographed from a distance down its length, wide open,
> mostly empty. Backs of two or three figures far away. Booth frames and
> pipe-and-drape visible only as dark geometry — no legible signage anywhere.
> Overhead light in hard pools with black between them. The first hour of the
> first day, before anyone arrives. Shot on 35mm with moderate depth of field so
> the aisle geometry remains readable; deep shadow everywhere outside the
> overhead pools. Near-monochrome, desaturated, cool grade. Matte black
> background. Cinematic, restrained, documentary — not stock photography. No
> text, logos, legible screens or watermarks. No face in sharp focus or looking
> toward camera. No crowd, branded booth, stage, neon, saturated colour,
> cyan/teal cast, lens flare, decorative bokeh, glossy CGI or polished event
> photography. No suits, handshakes, glass walls, presentation pose, laptop as
> focal subject, whiteboard, sticky notes or aspirational office styling.

### 1.3 `front-desk` — caption `03 · ONE PILOT PRACTICE, ~200 PATIENTS`

> A reception counter after hours, shot low and close along the countertop. A
> desk phone handset, a paper appointment book left open, a pen. One screen
> present but angled away and completely out of focus. No people. The single
> hard key light comes from off-frame left and dies within a metre. Shot on
> 35mm, shallow depth of field, deep shadow everywhere else. Near-monochrome,
> desaturated, cool grade. Matte black background. Cinematic, restrained,
> documentary — not stock photography. No legible text, no logos, no legible
> screens, no watermarks. No illuminated display, staged product shot, pristine
> showroom counter or readable appointment marks. No bright saturated colour,
> cyan/teal cast, lens flare, decorative bokeh, glossy CGI or polished
> corporate-stock styling. No suits, handshakes, glass walls, presentation pose,
> laptop as focal subject, whiteboard, sticky notes or aspirational office
> styling.

**Source format:** highest verified native 16:9 still/video master, 10–12s.
**Aspect ratio is settled — do not revisit it.** Preserve the full-resolution
accepted still so the roadmap OG card can crop from it; ship the 960×540
derivatives in the delivery contract, not five times the pixels each panel
displays.

**Deliver to:** `public/media/roadmap/{conversation,expo,front-desk}.{mp4,webm,webp}`

**Swap-in — shipped 2026-08-22.** `ASSETS` in
`components/roadmap/fieldwork-band.tsx` carries poster-only entries for all three
panels. Add `mp4`/`webm` to a panel's record when optional video lands; until
then `FieldworkMedia` renders the WebP. Re-measure `.ob-fieldwork-grid` height
before and after any video swap: identical, because the frame's `aspect-ratio`
owns it in both branches.

**If only the stills land, ship them as stills** — done. Optional video is a
second pass.

---

# GATE A — after Batch 1 stills, before more photography or any loop

**Passed 2026-08-22** — three fieldwork stills composite at 1440px and 1280px.
If optional motion does not feel worth it after review, stop Batch 1 i2v, Batch 3
and all below-line generation. More of the same bet will not rescue it.

Batch 2 is independently permitted because it addresses cold-start behavior,
not photographic polish. Its generated media must remain visible for at most
five seconds, then cross-fade to the CSS backdrop even if no finding has landed.

**Motion gate:** no looping i2v call is authorized until its surface has an
approved, visible pause/stop control and a named implementation owner. Without
that decision, Batch 1, Batch 3, captures and all ambient families are
**still-only**. Reduced motion is not a substitute for a control available to
all users. One surface-level `Pause media` control may govern every clip on that
surface; record its location, label, focus behavior and resume state before
spending.

---

## Batch 2 — Run Console cold start `[BLOCKED · decide before budgeting]`

**Why it was ranked high:** the single highest-anxiety moment in the product. The
user has just approved a brief, the page changed, and for ~6 seconds nothing
lands. The shared plan calls this *"the one place this genuinely earns its keep."*

**What it has to say:** *machinery is already working.* Not "please wait", not
decoration, not a mood. **It does the job a spinner does without being a
spinner** — a spinner says "we are busy"; this says "there is a machine, and it
is big." Depth, scale, one working light, dust in the air.

**Why it is blocked, stated plainly.** This is the one batch where the
"stills are complete" rule does not hold. **No `aisle` or `reader` still was ever
generated, and nothing exists at `public/media/validate/console-coldstart.*`.**
Every other batch can go straight to image-to-video because it has an approved
local source frame; this one cannot. Image-to-video needs a first frame, and a
`<video>` needs a poster, so the batch has two unmet prerequisites, not one.

**Two honest options — pick one before spending anything:**

1. **Drop the batch.** `RunConsole` keeps the CSS backdrop, which is the current
   shipped state and is finished. This is the default.
2. **Reopen still generation for exactly one subject.** Generate `aisle` only,
   accept it as both the poster and the i2v source frame, and update the "stills
   are complete" line at the top of this file. `reader` stays unbriefed unless
   `aisle` fails a named criterion.

The candidate prompts below are retained for option 2 and are **not** authorized
by the current queue state.

### `aisle` — primary

> A long, narrow corridor between tall dark equipment racks, receding into
> blackness, lit only by one hard light source far down the corridor on one
> side. Fine dust suspended in the air catches the light. The near end of the
> corridor is almost entirely black. Shot on 35mm, shallow depth of field,
> single hard key light from one side, deep shadow everywhere else.
> Near-monochrome, desaturated, cool grade. Matte black background. Cinematic,
> restrained, documentary — not stock photography. Unbranded mechanical
> archive or scanning racks, not a server room. No text, logos, legible screens,
> coloured LEDs, glossy data centre, cyberpunk lighting, sci-fi machinery,
> people, watermarks, bright saturated colour or lens flare.

### `reader` — alternate

> A microfilm reading machine in an unlit archive room, one spool half-unwound,
> the lens housing catching a single hard sidelight. The spool and the film
> are well out of focus; everything beyond the machine falls away to black.
> Shot from slightly above and to one side. Shot on 35mm, shallow depth of
> field, single hard key light from one side, deep shadow everywhere else.
> Near-monochrome, desaturated, cool grade. Matte black background. Cinematic,
> restrained, documentary — not stock photography. No lit display, readable
> labels, logos, watermarks, bright saturated colour or lens flare. The machine
> housing may be sharp; the spool and film remain soft. No people.

`aisle` reads as machinery immediately, has real depth for a push-in, and its
centre is naturally dark — the 320px query rail and the findings column both sit
over it. `reader` says *reading the web* more literally and the spool gives one
focal detail, but it is riskier: it is closer to "a screen", and **if the
spool comes back sharp the candidate is dead** — it violates this candidate's
composition requirement, and no regrade fixes it.

**Source format:** highest verified native 16:9 output, 10–12s.
The old 20s rationale was false — a 20s file still restarts twice during a 45s
run. The shorter clip covers the cold state and is then unmounted; it does not
need to loop. Ship no larger than 1920×1080.

**Deliver to:** `public/media/validate/console-coldstart.{mp4,webm,webp}` — the
`webp` is the poster and is mandatory, which is precisely why option 1 above
cannot be reached by an i2v call alone.

**Shipping behavior:** `0.34` only while zero findings have landed, for a
maximum of five seconds. Test the composite there. At the first finding or the
five-second limit, enter `fading`: cold media goes `0.34 → 0` while the existing
CSS `AppBackdrop` returns `0 → its normal opacity`. After the cross-fade, pause
the video, detach its sources and unmount it. The source never loops.

**Required code change — none of this exists yet.** `RunConsole` owns
`stream.findings`, so it owns this transient waiting-state video. Render it as a
fixed, `aria-hidden` child only while `findings.length === 0`, with a short
fade-out state before unmount. Suppress the generic `.ob-backdrop` only while the
cold child is `active`; during `fading`, cross-fade both layers so no blank frame
appears. Do **not** pass `data-cold` to `AppBackdrop`: its current API accepts
only `{ variant }`, and no `[data-cold]` CSS rule exists. Under reduced motion,
`ValidateView` bypasses the console and renders the report; under `Save-Data`,
the console uses only the CSS backdrop.

---

## Batch 3 — Hero collage, local stills + up to 2 clips `[HIGH · motion optional]`

The five approved local hero WebP stills are already used by the collage. No still
generation or remote fetch is owed. The only remaining work in this batch is
optional image-to-video on at most two cards.

**What the collage has to say:** *early-stage work being figured out.* Not
polished startup-office stock. Notebooks, whiteboards, screens mid-thought,
someone alone at 11pm. The hero claim is "from a hunch to something you can
defend" — these are the **hunch** end of that sentence.

### 3.1 `far-left` — 26%×30% @ (−8%, 30%), rotate −8°, depth 0.34

> A hand poised above irregular, unreadable marks in a notebook, photographed
> from directly overhead in low light. Shot on 35mm, shallow depth of field,
> single hard key light from one side, deep shadow everywhere else.
> Near-monochrome, desaturated, cool grade. Matte black background. Cinematic,
> restrained, documentary — not stock photography. No readable word, number or
> logo; no newly appearing marks, watermarks, saturated colour or lens flare.

### 3.2 `left` — 22%×26% @ (10%, 58%), rotate +5°, depth 0.60

> Two people at a small kitchen table late at night, seen from behind, quietly
> sorting printed notes and an open notebook. No office, no presentation, no
> staged collaboration pose. Shot on 35mm, shallow depth of field, single hard
> key light from one side, deep shadow everywhere else. Near-monochrome,
> desaturated, cool grade. Matte black background. Cinematic, restrained,
> documentary — not stock photography. No legible text, no logos, no legible
> screens, no watermarks. No face in sharp focus or looking toward camera. No
> bright saturated colour, open-plan office, polished collaboration pose or
> lens flare.

### 3.3 `centre` — 46%×42% @ (27%, 24%), rotate 0°, depth 0.16 · **the one that matters**

> A charcoal wall or dark board fills the frame. Sparse sticky notes and
> half-erased diagram marks occupy only the outer 30% on each side. The central
> 40% contains no note, mark, highlight or readable texture and remains uniformly
> near-black. Shot straight on from a few metres back on 35mm, shallow depth of
> field, with one hard side light that reaches only the outer edges. Cinematic,
> restrained, documentary — not stock photography. No readable text, logos,
> legible screens, watermarks, people, saturated colour or lens flare.

**This card sits directly behind the 104px headline.** The featureless central
40% is not a preference — if it is filled, the headline has nowhere to sit and
the asset is unusable. Reserve up to two retries for this card and reject on
this criterion before judging anything else.

### 3.4 `right` — 24%×28% @ (70%, 55%), rotate −5°, depth 0.58

> Over-shoulder view of a laptop showing an abstract dashboard-like shape with
> no legible UI. The screen is the only light source in the frame, and
> everything outside its glow falls to deep shadow. Shot on 35mm, shallow depth
> of field. Near-monochrome, desaturated, cool grade. Matte black background.
> Cinematic, restrained, documentary — not stock photography. Abstract
> unbranded blocks only on the display. No readable words, numbers, controls or
> logos; no watermarks. Any face stays outside frame or fully soft, and nobody
> looks toward camera. No bright saturated colour or lens flare.

### 3.5 `far-right` — 26%×30% @ (82%, 28%), rotate +8°, depth 0.34

> Heavily defocused rows of alternating light and dark pixels on a monitor,
> reading as pure texture rather than content. Shot on 35mm, shallow depth of
> field, single hard key light from one side, deep shadow everywhere else.
> Near-monochrome, desaturated, cool grade. Matte black background. Cinematic,
> restrained, documentary — not stock photography. No recognizable syntax,
> glyph, word, number, app chrome, logo, watermark, saturated colour or lens
> flare.

**Source format:** the five approved local hero stills already ship as WebP.
If motion still adds something, authorize one 10–12s clip on the card whose safe
zone is least affected; add at most one more after measuring decode and visual
cost. Do not
default to the centre merely because it is largest — its headline safe zone is
the most fragile. Generated motion and wrapper parallax must be reviewed
together; if they read as two camera moves, keep the still.

**Deliver to:** `public/media/hero/{far-left,left,centre,right,far-right}.{mp4,webm,webp}`

**Swap-in:** already complete. `CollageCard` renders the local WebP `<img>`.
Optional video may be added only to approved cards; the parallax writer, scrim,
veil and entrance stagger stay exactly as they are.

---

# GATE B — before Batches 4–5

**Queue update — 2026-08-21:** standalone stills for 4a–4c and 5a–5c have
already been generated outside Higgsfield and are removed from the active
index and call budgets. The detailed briefs below remain only as reference for
optional Higgsfield image-to-video work; do not regenerate their stills.

**Every below-the-line still is already integrated.** Any remaining spend is
optional image-to-video work using those approved local source frames.
Everything below is optional: **4b has implementation downside; 5a is a
judgement call; 5b and 5c are default no.**

**Batch 0 and Batch 1 still wiring both shipped on 2026-08-22.** Nothing above
Gate B blocks Batch 4; the next decision is whether optional i2v on batches 1–3
is still worth the caps below.

---

## Batch 4 — The MEDIUM backdrops, 3 clips `[below the line]`

All three are optional upgrades over CSS that already works, and **every one of
these surfaces is currently finished.** Their own briefs say *"if it is visible,
it is wrong"* — which is an accurate description of their expected contribution.

**4b is the one with teeth.** It can silently erase every gridline on the report.
Read its warning before generating it, not after.

**4a, 5b and 5c use the corrected neutral haze treatment (PC1/PC2).** 4b is a
separate uniform macro ground with no vignette; 4c is a real subject in a room.
Do not paste the batch-1/3 treatment over the haze or report field.

### 4a. Hero ambient field

The approved still is already integrated at
`public/media/backdrop-field.webp`. If motion is approved, use that still as the
source frame; do not generate another image.

**Video deliverables:** `public/media/backdrop-field.{mp4,webm}`.
**Swap-in:** mount the shared client media leaf inside the `.ob-backdrop` wrapper
in `app/page.tsx`; keep the page server-first and the CSS accent wash as the only
source of blue. Never grade the generated neutral bloom toward the accent.

**The documented fallback is real again, and the mechanism matters.** The plans
say "keep the CSS gradients underneath as the fallback", and they now do exactly
that: the blooms stay live and animated on every surface, and the still sits over
them in `.ob-backdrop-plate`. If a plate is absent (`define`), slow, or 404s, the
blooms are what the surface shows.

**The strength lives on the plate's scrim, never on the image.** An earlier pass
put it on the image as `opacity`, which forced a choice between a translucent
plate with two stacked atmospheres or killing the blooms outright. Keeping the
raster fully opaque and scrimming it in `--ob-canvas` at `1 − strength` gives the
same rendered result with one visible field and a working fallback. **Do not
reintroduce `opacity` on `.ob-backdrop-media`** — that is what breaks it.

### 4b. Report ambient field `[highest downside risk in the file]`

**The most constrained asset here.** It sits behind the densest surface in the
product, and every figure draws axes and gridlines. The approved still is already
integrated at `public/media/validate/report-field.webp`; use it as the video
source frame if motion survives the separate gate.

**Any region that reduces the gridline's local contrast enough deletes the
gridline under it.** Alpha is not brightness, so judge the final composite, not
the raw asset or the CSS number. The failure is silent and looks plausible — the
figures still render, they just stop having a measurable frame, and the page
degrades from "measurement" to "infographic". **If the delivered asset still has
a bright edge, crop it out rather than dimming the whole frame**; a uniform dim
keeps that region relatively bright. The uniform macro prompt above exists
specifically to prevent that edge.

Ships at `opacity: 0.10`. **Do not exceed it "to make it visible" — if it is
visible, it is wrong.**

Motion contributes nothing by default, so stop at the still unless a blinded
A/B comparison shows a measurable gain without reducing any figure-line
contrast.

**Video deliverables:** `public/media/validate/report-field.{mp4,webm}`.
**Verify:** use the rendered-pixel baseline test above on every figure gridline;
reading computed CSS colour alone cannot see the media underneath.

**Required code change if video survives:** `ValidateView` owns the
console/report mode and is already client-side, so it conditionally mounts the
fixed report media only in report mode and suppresses the generic
`.ob-backdrop` while that media exists. Do not add a video to `report.tsx`, and
do not invent a `src` prop on the current `AppBackdrop` without extending its
typed API. The media wrapper is `position: fixed; inset: 0; z-index: -1;
pointer-events: none; opacity: 0.10`; its image/video is `width: 100%; height:
100%; object-fit: cover; filter: grayscale(.4)`. Use `preload="metadata"`, WebM
before MP4 and the graded WebP poster. Reduced motion and `Save-Data` mount only
the poster, never the video. The report grid, figures, section spine and
hairlines remain unchanged above it.

### 4c. Invalid-run field

The blankest screen in the product and the only one with no dense type on it —
which makes it the **best** of the three below-the-line backdrops, because
atmosphere has nothing to compete with. **Shipped:** the still replaced the CSS
`Orb` on both branches.

**What it has to say:** *the link was cut, not the run.* Absence, not error.
There is no red in this system and no apology in this copy.

The approved still is already integrated at
`public/media/app/not-found.webp`. Use it as the video source frame; its
lower-right subject and left-side safe zone must remain unchanged.

Ships at `opacity: 0.24`, higher than the shared ambient baseline (`0.16`) but
lower than the console cold-start treatment (`0.34`).

**Video deliverables:** `public/media/app/not-found.{mp4,webm}`.

**Code change — already done.** `app/not-found.tsx` mounts
`.ob-not-found-backdrop` for both the root and run-link branches at
`opacity: 0.24`, and `<Orb dimmed />` is gone from
`components/layout/run-not-found.tsx`. If video is ever added, extend that same
leaf and keep the WebP as the reduced-motion and failure fallback.

**Loose end this created:** `Orb` now has **zero call sites**.
`components/ui/orb.tsx` and the `.ob-orb` / `.ob-orb-dimmed` rules in
`styles/obsidian-app.css` are dead code and can be deleted in a separate
housekeeping pass. Measure `.ob-recovery` and `.ob-standalone-body` before and
after any such change: identical, or something is pushing the recovery path down
the page.

**Two-layout acceptance:** test root 404 and run-link not-found independently at
1280px and 1440px. On the run branch, test `RecentRunsList` both empty and
populated. The single asset ships only if its lower-right mass and left-side safe
zone work in every state without changing layout.

---

## Batch 5 — The LOW tail, 3 clips `[below the line · expected value negative]`

**Two of the three carry a default answer of no in their own plan files**, and
the third is explicitly gated behind living with the shipped alternative for a
week. Listed because they are fully briefed and would otherwise look like gaps —
not because they should be made.

### 5a. Sources zero-results field `[only after Option A has been lived with]`

**Where:** `/r/[slug]/sources`, the branch in
`components/validate/explorer/evidence-explorer.tsx:176` taken when the active
facet combination yields zero rows. Cross `PRACTICAL` × `contests` × `cited in
report` to reach it.

**The typographic content and its reserved-height contract both shipped.**
`.ob-src-empty` now carries `min-height: 620px` alongside the headline, live
facet echo and ghost `Clear` button, so facet toggles no longer collapse and
re-expand the page.

The typographic state is a defensible permanent answer. **`_sources.md`'s
instruction is to live with it and only then decide.** If the region still reads
as a hole, *the copy is wrong, not the media* — fix the copy before spending a
credit.

The approved `archive` still is already integrated at
`public/media/sources/zero-results.webp`. Use it as the video source frame if
Option B remains approved; do not generate the `drawer` alternate.

**Video deliverables:** `public/media/sources/zero-results.{mp4,webm}`.
**Shipping treatment:** a `--ob-void` scrim at `opacity: 0.62` plus
`grayscale(.35) contrast(1.05)`. Re-measure the region height before and after —
**unchanged**, or the page will collapse and re-expand as facets toggle.

### 5b. Roadmap ambient field `[default answer no]`

**Where:** `/r/[slug]/roadmap`, the `.ob-backdrop` variant. The approved still is
already integrated at `public/media/roadmap/backdrop.webp`; use it as the video
source frame if this optional upgrade survives review.

It must pass the final-composite baseline for `--ob-dim` mono at **12px** — a
harder bar than the landing page's, where the backdrop only ever sits behind
104px display type.

**Video deliverables:** `public/media/roadmap/backdrop.{mp4,webm}`. The CSS
accent wash supplies any blue; the generated file stays neutral.

**Required code change if video survives:** mount the one shared client media
leaf beside the existing page-owned `<AppBackdrop variant="roadmap" />`; keep
the latter as poster/failure fallback and suppress its motion while video is
active. Do not move backdrop ownership into `RunShell`.

> **`_roadmap.md` §2 verbatim:** *"On a page whose job is to be worked from, an
> ambient video is the least defensible spend in this file. Default answer is
> no."* Only consider it if batch 1 has landed and the page still feels flat.

### 5c. Explorer ambient field `[default answer no · ranked last for a reason]`

**Where:** `/r/[slug]/sources`, the top 420px band only. The approved still is
already integrated at `public/media/sources/field.webp`; use it as the video
source frame if this optional upgrade survives review.
**Video deliverables:** `public/media/sources/field.{mp4,webm}`.

The top-420px fade and left-260px rail exclusion are CSS masks, not prompt
effects. The generated field stays neutral; CSS supplies any controlled accent.

**Required code change if video survives:** use the same shared client media
leaf beside the page-owned `<AppBackdrop variant="sources" />`. The leaf owns
conditional loading and playback only; the existing page and facet rail stay
server-first.

**The one swap-in trap on this route:** keep the fixed media leaf outside the
`FacetRail` subtree. Do not add non-visible overflow or layout/paint containment
to any actual ancestor of `FacetRail`; a sibling backdrop cannot itself become
the rail's scroll ancestor. After the swap, inspect the rail's real ancestor
chain and verify sticky behavior at both widths.

> **`_sources.md` ranks this "last, and honestly probably never."** This page is
> an audit log; its whole job is to let a reader check the work, and decoration
> on an audit log is a tell. **If you can tell it is there, it is wrong.**

---

## What is deliberately not in this queue

Not gaps. Each is a functional constraint, not a judgment about generation
quality — an image cannot do these jobs regardless of how good it is.

- **`/r/[slug]/define`'s design contract gets nothing, generated or CSS.**
  Decided against on five grounds in `_define.md` §1 — someone is typing, the
  transcript is already the motion budget, the column hairline carries the
  layout, a full-bleed layer sits behind the pinned composer, and with no scroll
  a backdrop can never resolve. The current nonzero Define bloom rules are
  implementation debt, not permission for media. The brief it *would* need is
  recorded there so a future pass fails against a written spec rather than
  inventing one. **If the frame reads dead, the fix is more metadata, not more
  atmosphere.**
- **The figure kit** (`WeekAxis`, `PlanBar`, `FanOutMeter`, `RunFunnel`,
  `StanceBar`, `DomainConcentration`, …) — each is citation-linked to a real
  finding and prints its raw number beside the mark, and `DependencyChip` clicks
  must flash a target in the DOM. An image can't be clicked into, read aloud, or
  re-themed, and it is wrong the first time a fixture number changes.
- **The Run Console itself** — ~45s of live state. The visitor watches it happen
  rather than watching a recording of it having happened. Batch 2 gives it the
  one thing it actually wants: atmosphere in the empty space *behind* it.
- **Product fragments** — `BriefPanel` with fields visibly marked `unknown`,
  `DiscardRow` struck through with its reason attached, the interview script
  written out in full, `OpenQuestionCard`, `TripwirePanel`, `EvidenceDrawer`.
  These are the product's real output; generated approximations of your own UI
  are uncanny and date instantly.
- **The verification rule** — the 1px accent line scaling from `scaleX(0)` over
  900ms. It is the literal moment of verification and the whole argument the
  product makes.
- **Editorial photography inside the report** — specifically the temptation at
  `05 WHAT SURPRISED US`. D18 allows the app side exactly one human subject and
  batch 1 spends it. A photograph beside a citation-linked finding implies the
  photograph is evidence.
- **Pillar visuals** (`higgsfieldPlan.md` §3) — the honest upgrade is a screen
  recording of the real app, not a generation.
- **Error boundaries and the four loading skeletons** — atmosphere behind a
  stack-trace digest reads as indifference, and a skeleton is the page's own
  hairlines with the data blanked.
- **All five OG cards** — already shipped as committed PNGs in `public/og/`
  (`default`, `define`, `validate`, `roadmap`, `sources`), each 1200×630.
  Optional exception: if batch 1's `conversation` still lands, the roadmap card
  can be re-cut with it behind the type at ~18% and blurred. One composite, not
  owed.

---

## Research basis `[checked 2026-08-21]`

Model names and parameters change; the live account schema remains
authoritative. The workflow and production rules above were checked against:

- [Higgsfield image guide](https://docs.higgsfield.ai/docs/guides/images) —
  specific prompts, low-resolution iteration and explicit aspect/resolution.
- [Higgsfield image-to-video guide](https://docs.higgsfield.ai/docs/guides/video)
  — high-quality source frames, matched aspect ratio, motion prompts, short
  iteration and model comparison.
- [Higgsfield billing and retention](https://docs.higgsfield.ai/docs/concepts/billing-and-retention)
  — exact-request cost estimates and at-least-seven-day output retention.
- [Higgsfield request lifecycle](https://docs.higgsfield.ai/docs/concepts/requests)
  and [error policy](https://docs.higgsfield.ai/docs/concepts/errors) — request
  ids, correlation ids, cancellation, retries and the lack of POST idempotency.
- [Google's image-to-video best practices](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice)
  — clean source frames, one focused scene and motion-only i2v prompts.
- [Runway's image-to-video prompting guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
  — the input frame owns composition/style; the prompt owns motion and temporal
  progression.

The public Higgsfield docs do **not** currently publish one stable,
platform-wide schema for seed, negative prompt, reference strength or end-frame
conditioning. Those capabilities are deliberately gates above, not promises.

---

## After each batch

1. Review the **final encoded derivatives**, not only generator masters. Run the
   rendered-pixel line/text test at the asset's shipping opacity.
2. Inspect first/middle/last and worst-looking frames, then watch ten repetitions
   of every looping clip. If a seam remains, try a quieter pass before a baked
   dissolve or ping-pong. For non-looping cold-start media, test the complete
   mount-to-unmount transition instead.
3. Verify reduced motion renders the approved poster `<img>` for generated media,
   the original code-drawn `Fragment` for product captures, and the final Report
   for Batch 2. No branch requests video under reduced motion or `Save-Data`.
4. Re-measure the container the asset sits in — **height must be unchanged**.
5. Verify file dimensions, frame rate, Rec.709/sRGB tags, codec, size budget and
   absence of an audio stream.
6. Test poster-to-video transition, codec fallback and slow-network failure;
   confirm offscreen/document-hidden media pauses and the pause control works.
7. Measure selected-codec transfer size and CPU/GPU decode with the real number
   of simultaneous clips. Zero console errors at 1440 and 1280; no sticky
   ancestor or layout shift changed during the swap.
8. Record pass/fail and any rejection reason in the ledger.
9. **Ask whether the next batch is still worth it.** The ranking above is an
   estimate; batch 1 landing is the evidence that settles it. If the roadmap
   doesn't feel meaningfully more finished with three real panels in that band,
   the remaining queue will not rescue it.
