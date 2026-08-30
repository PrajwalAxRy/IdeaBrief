# HiggsField integration

Generating and swapping in real media. This covers the connector, how to turn a
media-plan entry into a prompt that produces something usable in this system,
and the constraints that will bite.

**§4 is the section that differs from the dark system.** Audacity washes images
*toward paper*; Obsidian darkens them into black. That means the fixed treatment
block is not the same block, and a prompt written for the dark system produces
material that cannot be rescued here — a deep-shadow, hard-key, matte-black
image lightened by 40% goes flat and grey with the black areas still present as
smudges. Generate for the treatment you're going to apply.

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

Community servers exist (`geopopos/higgsfield_ai_mcp`,
`jfikrat/higgsfield-mcp`). They need API keys or browser session tokens and
work around bot protection; prefer the hosted endpoint unless you need
something it doesn't expose.

**Discover tool names at runtime — don't hardcode them from this document.**
The surface changes as models ship. List the connector's tools, or search them,
and read the actual parameter schema before the first call.

---

## 2. What it can and can't do

**Models** (image): Soul, Soul 2.0, Nano Banana Pro, Flux, Flux 2, Seedream 5.0
Lite, GPT Image 2. **(video):** Seedance, Seedance 2.0, Kling, Kling 3.0, Veo
3.1, Sora 2, Minimax Hailuo 02, WAN 2.6.

| Can | Can't |
|---|---|
| 4K stills | Render legible text reliably |
| Video up to ~15s | **Produce a seamless loop** — see §5 |
| Image-to-video with motion presets | Match an exact brand hex |
| Trained character consistency across shots | Replace a code-drawn UI fragment convincingly |
| Async generation with polled results | Give you the same frame twice |

One more, specific to this system: **models are heavily biased toward moody,
high-contrast, dark-background imagery.** That is what "cinematic" means to
almost every one of them. High-key material takes more prompt pressure to get,
and it is the material Audacity needs. Expect to say it more than once, and
expect the negative block to do real work.

**Generation is asynchronous.** Submit, then poll. Don't block a turn waiting.

**Generation costs credits.** See §3.

---

## 3. The spend rule

**Generating media spends the user's money. Confirm before the first call of a
session, and say roughly how many generations you're about to make.**

This is not optional politeness — a media plan with seven sections and five
variants each is 35 paid generations. Get a yes.

Practical discipline:

- **Batch a plan, then ask once.** "This is 6 clips across 5 slots, ~2
  variants each. Proceed?" beats asking per asset.
- **Generate stills before video.** A still is cheaper and tells you whether
  the prompt is right. Lock the frame, then animate it — image-to-video also
  gives you far more control than text-to-video.
- **Apply the treatment to the first still before generating the second.** Drop
  it behind the actual scrim and veil (`media.md` §3) and look at it there. In
  this system more than most, a still that looks great raw can wash to nothing,
  and finding that out on generation one saves the other four.
- **Don't silently regenerate.** If the first result is wrong, say what was
  wrong and what you'll change before spending again.
- **Stop and report on a run of failures.** Three bad results is a prompt
  problem, not a luck problem.

---

## 4. Brief → prompt

Media-plan entries (see `media.md` §7) are written for a human *or* a
generator. Translating one into a prompt means adding the treatment language
this system needs and that the brief leaves implicit.

Every prompt carries four blocks in this order:

```
<subject> · <treatment> · <negatives> · <format>
```

**The treatment block is fixed for this system.** Reuse it verbatim:

> Shot on 35mm, shallow depth of field. High-key, soft diffuse light from a
> large source, open shadows, slightly overexposed. Warm near-monochrome — a
> desaturated sepia and bone palette, no cool tones. Pale warm-white background,
> like light card stock. Airy, restrained, editorial — not stock photography.

**The negative block is also fixed:**

> No text, no logos, no legible screens, no watermarks. Nobody looking at the
> camera. No bright saturated colour. No lens flare. No dark or black
> background, no deep shadow, no moody low-key lighting, no vignette, no cool
> blue or teal grade.

Which leaves the subject as the only thing you write per asset.

**Note how much longer the negative block is than the dark system's.** Six of
its clauses exist purely to fight the model's default pull toward low-key
drama. Do not trim them to save tokens — dropping "no dark background" alone is
usually enough to get a black frame back.

### Worked example

Media-plan entry:

> `centre` — 46% × 42%, sits directly behind the headline. A wall of sticky
> notes / whiteboard covered in half-erased diagrams. Must be near-featureless
> in the middle third. Gets washed toward paper.

Prompt:

> A wall of sticky notes and a whiteboard covered in half-erased diagrams,
> photographed straight on from a few metres back in a bright daylit room, the
> centre of the frame uncluttered and out of focus. Shot on 35mm, shallow depth
> of field. High-key, soft diffuse light from a large source, open shadows,
> slightly overexposed. Warm near-monochrome — a desaturated sepia and bone
> palette, no cool tones. Pale warm-white background, like light card stock.
> Airy, restrained, editorial — not stock photography. No text, no logos, no
> legible screens, no watermarks. Nobody looking at the camera. No bright
> saturated colour. No lens flare. No dark or black background, no deep shadow,
> no moody low-key lighting, no vignette, no cool blue or teal grade.

Note what carried over: *"the centre of the frame uncluttered and out of
focus"* is the composition constraint from the brief, restated as something a
model can act on. "Near-featureless in the middle third" is a design note; "the
centre of the frame uncluttered and out of focus" is a prompt. And *"in a bright
daylit room"* was added to the subject rather than left to the treatment block —
giving the model a physical reason for the light gets high-key material far more
reliably than asking for high-key lighting in the abstract.

### Judging a result

Before accepting a still, check the two things that decide whether it survives
the treatment:

1. **Is there any true black in it?** Sample the darkest region. Anything below
   ~15% luminance will still be a visible smudge after the paper scrim, and
   there is no filter that fixes it. Regenerate.
2. **Does the middle third stay quiet once lightened?** Apply
   `filter: grayscale(0.65) sepia(0.22) contrast(0.92) brightness(1.08)` plus
   the 0.62 scrim and put `--au-text` over it. Legibility at 4.5:1 is the
   accept criterion, not how the image looks on its own.

### Motion prompt (image-to-video)

Also near-fixed for this system:

> Extremely slow, single continuous camera move — a 3–5% push-in or lateral
> drift across the whole clip. No cuts, no zoom snap, no subject entering or
> leaving frame. Lighting stays constant and even throughout — no light change,
> no shadow moving across frame. The shot should end almost exactly where it
> started.

The last sentence is doing the work — see §5. The lighting sentence is the
Audacity addition: a moving shadow is invisible on near-black and unmissable on
paper, where the scrim leaves nowhere for it to hide.

---

## 5. The looping problem

**This system wants seamless loops. Generative video does not produce them.**
Every model gives you a clip with a start and an end that don't match. Plan for
it — don't discover it after generating six clips.

Three strategies, in order of preference:

### 5a. Design for near-zero motion (best)

Ask for a 3–5% drift over 12 seconds. The first and last frames end up close
enough that a hard loop is invisible under the scrim. **This is why the motion
prompt says "end almost exactly where it started."** For background atmosphere
at this system's opacity levels, it's usually enough on its own.

One caveat specific to paper: the dark system could hide a loop seam behind a
62% *darkening*, which crushes detail and forgives a lot. Washing an image *up*
preserves edges rather than destroying them, so a seam that Obsidian would have
swallowed can still be faintly visible here. Bias toward the low end of the
drift range — 3%, not 5%.

### 5b. Cross-fade in CSS (no tooling)

Two copies of the same clip, offset by half its duration, cross-fading. Costs
one extra decode, needs no post-production:

```css
.loop-a, .loop-b { position: absolute; inset: 0; object-fit: cover; }
.loop-a { animation: loop-fade 12s linear infinite; }
.loop-b { animation: loop-fade 12s linear infinite -6s; }
@keyframes loop-fade { 0%, 40% { opacity: 1 } 50%, 90% { opacity: 0 } 100% { opacity: 1 } }
```

### 5c. Ping-pong

Play forward then reversed. Free and perfectly seamless, but **only works for
motion with no directional meaning** — a slow drift is fine; anything with an
object travelling through frame reads as obviously reversed. Encode the
reversed half into the file rather than trying to reverse a `<video>` at
runtime.

---

## 6. Model selection

| Need | Reach for |
|---|---|
| Photoreal human/physical stills for a hero | Soul 2.0, Flux 2 |
| A still you'll then animate | Any image model — lock the frame first |
| Slow atmospheric drift from a still | Seedance, Kling 3.0 |
| Longer or more complex camera work | Veo 3.1, Sora 2 |
| Repeating a subject across several shots | Train a character reference first |

**Always: still first, then image-to-video.** Text-to-video gives you no
control over composition, and composition is the whole job here — the centre
card has to stay quiet in its middle third, and no text prompt reliably
delivers that on the first try. It also gives you no control over exposure,
which for this system is the second half of the job.

---

## 7. Swapping an asset in

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
- [ ] The paper scrim, veil, and warm filter still apply — the treatment was
      tuned against the placeholder and must survive the swap.
- [ ] **The headline still clears 4.5:1** over the new asset's brightest and
      darkest points. This is not a formality here: a swap changes the light
      side of the contrast problem, and dark type over a lightened photo fails
      in the bright regions, which is the opposite of where you'd look.
- [ ] **Nothing moved.** Re-measure the section height before and after; the
      whole point of reserving space is that a swap causes zero shift.
- [ ] Delete the media-plan entry, or mark it done.

Then re-verify in the browser — `verification.md`. A swapped asset changes
contrast behind live type, and that needs looking at, not assuming.

---

## 8. What not to generate

| Don't generate | Because |
|---|---|
| Your own product UI | Draw it in code. `media.md` §2. A generated approximation of your interface is uncanny and immediately dated. |
| Anything with text in it | It will be garbage. Render text as text, over the media. |
| Diagrams, charts, flows | SVG. Sharper, themeable, accessible, and correct. |
| Icons | An icon set, or hand-drawn SVG at 1.5px stroke. |
| Logos | Real ones, or don't imply a customer you don't have. |
| Paper texture or grain | CSS. One SVG turbulence data-URI at ~0.05 with `mix-blend-mode: multiply` is sharper, free, resolution-independent, and tints itself off the canvas token. A generated paper texture is a large image that fights every token change. |
| A replacement for a live DOM animation | The visitor can drive the DOM version. A video of an interaction is strictly worse than the interaction. |
| Anything the media plan marks "do not touch" | Someone already decided. |

The last row is worth enforcing. The most convincing moment on a page is
usually something running live in the browser — the strong instinct to
"upgrade" it to a polished video makes it worse every time.
