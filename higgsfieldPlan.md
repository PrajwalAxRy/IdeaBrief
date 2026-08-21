# HiggsField plan — Obsidian landing page

Everything on `/` that is currently a placeholder, a CSS approximation, or a
deliberate empty slot, written as a production brief. Each entry is
self-contained: what it must communicate, the prompt, the format, the delivery
path, and the exact code change that swaps it in.

**Status:** the page ships and looks finished *without* any of this. Nothing
here is load-bearing — it is all upgrade work.

---

## 0. Standing art direction

Read this before generating anything. Every asset on this page has to survive
the same three constraints, and an asset that ignores them will look wrong no
matter how good it is on its own.

| Constraint | Why |
|---|---|
| **Near-monochrome.** Desaturate to roughly 30–40% of natural saturation. | The system has exactly one hue (`#2D7FF9`) and it means *verified / primary action / live*. A warm skin tone or a green plant in a hero card competes with the only colour that carries meaning. |
| **Survives 60% darkening.** Every hero card renders under a `--ob-void` scrim at `opacity: 0.62`, then a radial veil on top. | Assets are atmosphere behind white display type at 104px. If the composition only works at full brightness, it will read as mud here. |
| **No text in the frame.** | Generated text renders as garbage at any size, and real UI text would fight the actual headline. |
| **Loops seamlessly, no cuts.** First and last frame must match. | Nothing on this page cuts. All motion is continuous drift. |
| **No faces in sharp focus.** | Faces pull the eye off the headline. Bodies, hands, backs of heads, out-of-focus figures — fine. |

Global palette reference for prompts: near-black `#0A0A0B`, deepest `#060607`,
chalk `#F4F4F5`, accent `#2D7FF9`.

**Provisional naming.** The product is called **Groundwork** throughout, chosen
as a placeholder. It appears in `lib/content/landing.ts` (`BRAND.name`), the
`<title>` in `app/layout.tsx`, and the footer watermark. One find-and-replace on
`Groundwork` changes all three. If the name changes, the footer watermark and OG
image (§6) both need regenerating.

---

## 1. Hero collage — 5 cards `[HIGH PRIORITY]`

**Lives in:** `lib/content/landing.ts` → `COLLAGE`, rendered by
`components/landing/hero-collage.tsx`.
**Currently:** five hotlinked Unsplash stills, each verified reachable. They are
generic "people working" stock and they are the weakest thing on the page.

**What the collage has to say:** *early-stage work being figured out.* Not
polished startup-office stock. Notebooks, whiteboards, screens mid-thought,
someone alone at 11pm. The hero claim is "from a hunch to something you can
defend" — these images are the *hunch* end of that sentence.

Each card is currently a still. **The upgrade is turning each into a 10–14s
silent video loop**, which is what makes the hero feel alive rather than
composited.

| Slot | Geometry (% of hero) | Parallax depth | Brief |
|---|---|---|---|
| `far-left` | 26% × 30% @ (-8%, 30%), rotate −8° | 0.34 | Hand writing in a notebook, overhead, low light. Slow drift of the pen. |
| `left` | 22% × 26% @ (10%, 58%), rotate +5° | 0.60 | Two people at a table mid-conversation, shot from behind, shallow depth. Barely any movement — a shift of weight. |
| `centre` | 46% × 42% @ (27%, 24%), rotate 0° | 0.16 | **The important one — it sits directly behind the headline.** A wall of sticky notes / a whiteboard covered in half-erased diagrams. Camera pushes in *very* slowly. Must be near-featureless in the middle third so the headline has somewhere to sit. |
| `right` | 24% × 28% @ (70%, 55%), rotate −5° | 0.58 | Over-shoulder of a laptop showing an abstract dashboard-like shape (no legible UI). Screen glow is the only light. |
| `far-right` | 26% × 30% @ (82%, 28%), rotate +8° | 0.34 | Dense text/data on a monitor, heavily out of focus, so it reads as texture not content. |

**Prompt template** (swap the subject line per row):

> `<subject>`. Shot on 35mm, shallow depth of field, single hard key light from
> one side, deep shadow everywhere else. Near-monochrome, desaturated, cool
> grade. Matte black background. No text, no logos, no legible screens. Nobody
> looking at the camera. Cinematic, restrained, documentary — not stock
> photography.

**Motion prompt (image-to-video):** *Extremely slow, single continuous camera
move — a 3–5% push-in or lateral drift over the whole clip. No cuts, no zoom
snap, no subject entering or leaving frame. The clip must loop: end where it
started.*

**Format:** 16:9, 1920×1080, 12s, MP4 (H.264) + WebM (VP9), no audio.
**Deliver to:** `public/media/hero/{far-left,left,centre,right,far-right}.{mp4,webm}`
plus a `.jpg` poster frame each.

**Code change to swap in:** in `hero-collage.tsx`, replace the `<img>` with a
`<video autoPlay muted loop playsInline poster=…>`. Add `poster` to the
`CollageCard` type in `lib/content/landing.ts`. Gate it on
`prefers-reduced-motion` — under reduced motion, render the poster `<img>`
instead of the video. The parallax writer, scrim, veil, and entrance stagger all
stay exactly as they are; they operate on the wrapper, not the media.

---

## 2. Hero ambient field `[MEDIUM]`

**Lives in:** `.ob-backdrop` in `styles/obsidian.css` (two drifting radial
gradients on 34s and 52s loops).
**Currently:** pure CSS. It genuinely works — this is an optional upgrade, not a
gap.

**If replaced:** a full-bleed 20s loop of very slow-moving volumetric haze in
near-black, with one faint cool-blue bloom drifting through it. Think a
long-exposure of dust in a projector beam, not a nebula. It must be dark enough
that white text at 60% opacity is still legible over it.

**Format:** 16:9, 2560×1440, 20s, MP4 + WebM, no audio, seamless loop.
**Deliver to:** `public/media/backdrop-field.{mp4,webm}`
**Code change:** add a `<video>` inside the `.ob-backdrop` div in
`app/page.tsx`, keep the CSS gradients underneath as the poster/fallback.

**Do not** make this brighter or busier than the CSS version it replaces. The
current one is deliberately almost invisible.

---

## 3. Pillar visuals — 3 loops `[MEDIUM]`

**Lives in:** `components/landing/fragments.tsx`, rendered inside
`components/landing/pillars.tsx`.
**Currently:** real, code-drawn product UI — an idea brief with two fields
visibly marked `unknown`, an evidence stream with three `VERIFIED` chips and one
`DISCARDED`, and an open question with its interview script written out.

**These are deliberately not stock images and should not be replaced with any.**
They are accurate depictions of the product's actual output, which is a stronger
argument than any photograph.

**The upgrade, if wanted:** screen-recording-style loops of these same surfaces
*in motion* — fields filling in, evidence rows landing one at a time, chips
resolving from grey to blue. That is a screen recording of the real app once the
run pages are built, not a generated asset. **HiggsField is the wrong tool for
this one; noted here so it isn't mistaken for a gap.**

If a generated asset is wanted anyway, the only honest slot is a small
atmospheric strip *beside* each fragment — not replacing it.

---

## 4. Verification section `[LOW — do not replace]`

**Lives in:** `components/landing/verification.tsx`.
**Currently:** a live DOM animation. An excerpt lands, a 1px accent rule draws
itself left-to-right underneath it over 900ms, and the verdict resolves. One of
the three cycled excerpts *fails* — it greys out, strikes through, and drops 6px.

**Leave this alone.** It is the single most important moment on the page and it
is more convincing as real DOM than as video, because the visitor can click the
cycle dots and drive it themselves. A rendered version would be strictly worse.

Listed here only so a future pass doesn't "upgrade" it by mistake.

---

## 5. Chat section `[LOW]`

**Lives in:** `components/landing/cofounder-chat.tsx`.
**Currently:** a scripted six-turn exchange that types itself character by
character when the section scrolls into view, above a live composer that really
does create a run.

**Optional addition:** a small ambient loop behind the transcript card —
extremely subtle, near-invisible, same treatment as §2. Only if the section
feels flat once the rest of the media lands. **Default answer is no**; the
typing is the motion.

---

## 6. Open Graph / social card `[SHIPPED — A15]`

> **Closed 2026-08-21 by A15. Generate nothing for this.** The card ships as
> `public/og/default.png`, drawn in code by `app/style-guide/og/page.tsx` and
> committed at 1200×630. `app/layout.tsx` carries `metadataBase`, `openGraph`
> and `twitter`. **The delivery path below was `public/og.png` in the original
> draft; it shipped as `public/og/default.png`** — use the real path if this is
> ever redrawn. The brief is kept for that redraw, not as an outstanding ask.

**Was:** nothing. `app/layout.tsx` had `title` and `description` but no
`openGraph` block and no image, so any link to this page previewed as bare text.

**Brief:** the wordmark and the headline "From a hunch to something you can
defend." set in Geist 400 on `#060607`, with a heavily darkened version of the
`centre` hero card behind it and a single blue rule beneath the headline.
Essentially a still of the hero, cropped to 1.91:1.

**Format:** 1200×630 PNG.
**Deliver to:** `public/og/default.png` (shipped path — **not** `public/og.png`,
which this draft named and which does not exist)
**Code change:** add an `openGraph` and `twitter` block to the `metadata` export
in `app/layout.tsx`.

This is the highest-value item in this document after §1, because it is a real
absence rather than an upgrade.

---

## Priority order

1. **§6 OG image** — a real gap, cheap to fill, visible every time the link is shared.
2. **§1 hero collage** — the largest single lift in how designed the page feels.
3. **§2 ambient field** — only if §1 lands and the hero still feels static.
4. §3 / §5 — optional, and easy to make worse.
5. **§4 — do not touch.**
