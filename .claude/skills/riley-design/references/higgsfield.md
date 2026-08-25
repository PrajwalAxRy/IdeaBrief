# HiggsField integration

Generating and swapping in real media. Covers the connector, turning a
media-plan entry into a prompt that produces something usable *in a warm light
system*, and the constraints that will bite.

**The treatment blocks here are inverted from a dark system's.** If you've
carried a "matte black background, cool grade, hard key light" prompt over by
habit, everything it returns will punch a hole in the page. See §4.

---

## 1. Setup

The official hosted server is the safe pick — OAuth against a HiggsField
account, no API key in your config:

```json
{
  "mcpServers": {
    "higgsfield": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.higgsfield.ai/mcp"]
    }
  }
}
```

Community servers exist (`geopopos/higgsfield_ai_mcp`, `jfikrat/higgsfield-mcp`).
They need API keys or browser session tokens; prefer the hosted endpoint unless
you need something it doesn't expose.

**Discover tool names at runtime — don't hardcode them from this document.** The
surface changes as models ship. List the connector's tools and read the actual
parameter schema before the first call.

---

## 2. What it can and can't do

**Image models:** Soul, Soul 2.0, Nano Banana Pro, Flux, Flux 2, Seedream 5.0
Lite, GPT Image 2. **Video:** Seedance, Seedance 2.0, Kling, Kling 3.0, Veo 3.1,
Sora 2, Minimax Hailuo 02, WAN 2.6.

| Can | Can't |
|---|---|
| 4K stills | Render legible text reliably |
| Video up to ~15s | **Produce a seamless loop** — see §5 |
| Image-to-video with motion presets | Match an exact brand hex |
| Trained character consistency across shots | Replace a code-drawn UI fragment convincingly |
| Async generation with polled results | Give you the same frame twice |

**Generation is asynchronous.** Submit, then poll. Don't block a turn waiting.

---

## 3. The spend rule

**Generating media spends the user's money. Confirm before the first call of a
session, and say roughly how many generations you're about to make.**

Not optional politeness — a media plan with seven sections and five variants
each is 35 paid generations. Get a yes.

- **Batch a plan, then ask once.** "6 clips across 5 slots, ~2 variants each.
  Proceed?" beats asking per asset.
- **Generate stills before video.** A still is cheaper and tells you whether the
  prompt is right. Lock the frame, then animate it — image-to-video also gives
  far more control than text-to-video.
- **Don't silently regenerate.** If a result is wrong, say what was wrong and
  what you'll change before spending again.
- **Stop and report on a run of failures.** Three bad results is a prompt
  problem, not a luck problem.

---

## 4. Brief → prompt

Media-plan entries (`media.md` §7) are written for a human *or* a generator.
Translating one into a prompt means adding the treatment language this system
needs and the brief leaves implicit.

Four blocks, in order:

```
<subject> · <treatment> · <negatives> · <format>
```

**The treatment block is fixed for this system. Reuse it verbatim:**

> Shot on 50mm, soft directional daylight from a large window, gentle falloff,
> no hard shadow. Bright, airy, high-key exposure. Warm neutral grade — bone,
> oatmeal, warm stone, paper. Matte off-white background. Editorial and
> restrained, quietly observed — not stock photography.

**The negative block is also fixed:**

> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No cool blue, slate or grey cast. No saturated colour. No hard shadow,
> no lens flare, no bokeh balls, no vignette.

Which leaves the subject as the only thing you write per asset.

**Two of those negatives are load-bearing and easy to drop.** "No cool blue,
slate or grey cast" is rule 2 reaching into the generator — a model asked for
"neutral" returns something cool roughly every time, and a cool-cast image on
warm paper is the most visible way to break the system with one asset. "No
vignette" matters because a vignette is a dark edge, and dark edges are what a
light page can least afford.

### Worked example

Media-plan entry:

> `hero/panel` — 16:9, sits behind and below the headline. A desk mid-work:
> printouts, a notebook, a half-drunk coffee. Must be near-featureless in its
> upper third.

Prompt:

> A desk photographed from slightly above mid-work — printouts fanned out, an
> open notebook, a half-drunk coffee off to one side, the upper third of the
> frame empty tabletop and out of focus. Shot on 50mm, soft directional daylight
> from a large window, gentle falloff, no hard shadow. Bright, airy, high-key
> exposure. Warm neutral grade — bone, oatmeal, warm stone, paper. Matte
> off-white background. Editorial and restrained, quietly observed — not stock
> photography. No text, no logos, no legible screens, no watermarks. Nobody
> looking at the camera. No cool blue, slate or grey cast. No saturated colour.
> No hard shadow, no lens flare, no bokeh balls, no vignette.

Note the translation: *"near-featureless in its upper third"* is a design note.
*"the upper third of the frame empty tabletop and out of focus"* is a prompt —
something a model can act on.

### Motion prompt (image-to-video)

Also near-fixed:

> Extremely slow, single continuous camera move — a 3–5% push-in or lateral
> drift across the whole clip. No cuts, no zoom snap, no subject entering or
> leaving frame. Light stays constant. The shot should end almost exactly where
> it started.

"Light stays constant" is the light-system addition: a drifting exposure is
barely visible on a dark ground and obvious on paper.

---

## 5. The looping problem

**This system wants seamless loops. Generative video does not produce them.**
Every model gives you a clip whose start and end don't match. Plan for it — don't
discover it after generating six clips.

**Settle this first:** check whether the connector's current video models expose
**end-frame conditioning**. If they do, `end frame = start frame` retires this
entire section. It's worth one look at the parameter schema before generating
any clip.

Otherwise, three strategies in order of preference:

### 5a. Design for near-zero motion (best)

A 3–5% drift over 12 seconds puts the first and last frames close enough that a
hard loop is invisible. **This is why the motion prompt says "end almost exactly
where it started."**

Note this works *less* well here than on a dark ground: a scrim at 60% hides a
multitude of seams, and Riley's scrims are light and less concealing. Push the
drift toward 3% rather than 5%.

### 5b. Cross-fade in CSS (no tooling)

Two copies of the clip, offset by half its duration, cross-fading. One extra
decode, no post-production:

```css
.rl-loop-a, .rl-loop-b { position: absolute; inset: 0; object-fit: cover; }
.rl-loop-a { animation: rl-loop-fade 12s linear infinite; }
.rl-loop-b { animation: rl-loop-fade 12s linear infinite -6s; }
@keyframes rl-loop-fade { 0%, 40% { opacity: 1 } 50%, 90% { opacity: 0 } 100% { opacity: 1 } }
```

### 5c. Ping-pong

Forward then reversed. Free and perfectly seamless, but **only for motion with
no directional meaning** — a slow drift is fine; anything travelling through
frame reads as obviously reversed. Encode the reversed half into the file rather
than reversing a `<video>` at runtime.

---

## 6. Capturing the real app

There's a line worth drawing precisely, because two of these look similar and
only one is allowed:

| | Verdict |
|---|---|
| A static screenshot of the product shipped as an image | **Forbidden.** `media.md` §2 — draw it in code. |
| A screenshot fed to a generator to "enhance" | **Worse.** You get an uncanny approximation of your own UI. |
| A **Playwright capture of the live app in motion** | **Endorsed.** |

The third is genuinely different: it's the real product, at real resolution,
with real tokens, doing a real thing. For a hero panel showing a run streaming,
or a roadmap assembling, a capture of the actual app beats anything a generator
will produce and beats a static fragment for motion.

Capture at 2× device scale, crop to the panel, and treat it as video — poster
frame, reduced-motion fallback, the lot. And re-capture when the UI changes;
this is the one asset class that goes stale silently.

---

## 7. Model selection

| Need | Reach for |
|---|---|
| Photoreal human/physical stills for a hero | Soul 2.0, Flux 2 |
| A still you'll then animate | Any image model — lock the frame first |
| Slow atmospheric drift from a still | Seedance, Kling 3.0 |
| Longer or more complex camera work | Veo 3.1, Sora 2 |
| Repeating a subject across shots | Train a character reference first |

**Always: still first, then image-to-video.** Text-to-video gives no control
over composition, and composition is the whole job — the quiet third has to stay
quiet, and no text prompt reliably delivers that first try.

The still→video step is already image conditioning. Where a brief calls for a
specific composition, a hand-made greyscale sketch as the conditioning image
gets you there faster than three prompt rewrites.

---

## 8. Swapping an asset in

The media plan names the code change. Typically a placeholder `<img>` becomes a
`<video>` with a poster:

```diff
- <img src={card.src} alt="" loading="lazy" decoding="async" />
+ {reduced ? (
+   <img src={card.poster} alt="" loading="lazy" decoding="async" />
+ ) : (
+   <video
+     autoPlay muted loop playsInline
+     poster={card.poster}
+     preload={eager ? 'auto' : 'metadata'}
+   >
+     <source src={`${card.src}.webm`} type="video/webm" />
+     <source src={`${card.src}.mp4`} type="video/mp4" />
+   </video>
+ )}
```

Checklist for every swap:

- [ ] `muted` **and** `playsInline`, or it won't autoplay.
- [ ] A poster frame, always — it's the reduced-motion fallback and the
      first-paint image.
- [ ] WebM before MP4 in source order.
- [ ] Reduced motion gets the poster, not the video.
- [ ] `preload="metadata"` for everything but the one above-the-fold asset.
- [ ] The light scrim, grayscale filter, hairline and radius still apply — the
      treatment was tuned against the placeholder and must survive the swap.
- [ ] **Re-run the contrast audit.** A swapped asset changes what's behind live
      type. This matters more here than on a dark ground: a brighter-than-
      expected still can push `--rl-ink` over a scrim below 4.5:1, and it will
      still photograph fine. `light-surfaces.md` §1.
- [ ] **Nothing moved.** Re-measure the section height before and after.
- [ ] Delete the media-plan entry, or mark it done.

---

## 9. What not to generate

| Don't generate | Because |
|---|---|
| Your own product UI | Draw it in code (`media.md` §2), or capture the real app (§6). |
| Anything with text in it | It will be garbage. Render text as text, over the media. |
| Diagrams, charts, flows | SVG. Sharper, themeable, accessible, correct. |
| Icons | An icon set, or hand-drawn SVG at 1.5px stroke. |
| Logos | Real ones, or don't imply a customer you don't have. |
| Abstract gradient/orb backgrounds | The thing a page reaches for when nobody decided what the area is for. Not in the `media.md` decision tree for a reason. |
| A replacement for a live DOM animation | The visitor can drive the DOM version. A video of an interaction is strictly worse than the interaction. |
| Anything the media plan marks "do not touch" | Someone already decided. |

The last two are worth enforcing. The most convincing moment on a page is
usually something running live in the browser — the strong instinct to "upgrade"
it to a polished video makes it worse every time.
