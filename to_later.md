# To later

Everything worth your attention that is **not** already tracked as a phase in
[`obsidian_app_build_plan.md`](obsidian_app_build_plan.md)'s progress table.

Rewritten 2026-08-21, at the end of **A15**. **A0–A15 are all `DONE` — the plan
is finished.** Every claim below was measured or grepped on that date; where a
file, a count or a ratio is named, it was verified, not remembered.

**How to read it.** §1 is what someone still owes. §2 is the small set of
decisions left open, each with a recommendation. §3 is deployment — the one
thing that is wrong in production and right in dev. §4 is time you will
otherwise lose to the same traps twice. **§5 matters most in practice** — the
list of things that look like bugs and are not, so a future session doesn't
"fix" a deliberate decision. §6 is the audit set.

**What closed with A14/A15**, so nobody goes looking: Deep Canopy is deleted
(`styles/components.css`, the Deep Canopy `:root` block, `Inter_Tight`,
`IBM_Plex_Mono`, `data-theme`); `/sources` has its error boundary; `openGraph`
and the five OG cards ship (R18); contrast is re-measured against Obsidian and
recorded; the invalid-run page is reachable at all for the first time. R1–R25
are all closed.

---

## 1. Work someone still owes

### 1.1 `RecentRunsList` is missing from `/` — the only *product* gap left

**This is the one item in this file that is a hole in the product rather than
tidying.** `WebsiteLayoutDesc/09-pages-supporting.md` §9.4 says the component
appears on **`/` and the invalid-run page**. It currently has exactly one call
site, `components/layout/run-not-found.tsx`.

Why it matters: no auth means the URL is the only key, and the most predictable
failure in the product is a user losing it. Recent Runs closes ~80% of that gap
for zero backend work — but only if a user can reach it *before* they lose the
link. Today they can only reach it after, by guessing a wrong URL.

The component works and is Obsidian-styled (`.ob-recovery*`, §15). It hides
entirely when empty, so on a first visit it costs nothing. **This is a placement
decision, not a build** — the only question is where on `/` it goes, and the
honest answer is probably below the composer, above the fold's end.

**No phase owns it.** It was logged against A13 and never assigned.

### 1.2 Six files have no product call site

Verified by import grep, 2026-08-21. Every one is reachable only from
`/style-guide` — which means the gallery is keeping them alive, not the product.

| File | Situation | Recommendation |
|---|---|---|
| `components/ui/fragment.tsx` | **Imported nowhere at all**, not even the gallery. A2 promoted it on the strength of three future consumers; A8, A9, A11, A12, A13 and now A14 have each declined it. Seven phases. There are no phases left. | **Delete.** |
| `components/ui/modal.tsx` | Gallery only, and call-site-free since it was written. A13 used Radix directly via `EvidenceOverlay`. | Delete, or name the surface that will want it. |
| `components/ui/inline-editable-field.tsx` + `inline-editable-list.tsx` | Gallery only. A7 moved Define off them. Dead as a pair. | Delete together. |
| `components/ui/prose.tsx` · `components/layout/prose-column.tsx` | Gallery only. `ProseColumn` lost its last product call site when A9 rebuilt the report. | Delete. |
| `components/status/status-badge.tsx` | Gallery only — **and that is now a decision, not an accident.** A14 ruled `RunFooterBar` does not carry it. | **Keep as-is.** Do not re-hunt for a call site. |

**Deleting any of these means amending the naming contract in the same commit**,
or the contract starts describing files that don't exist, which is how it stops
being trusted.

`components/ui/orb.tsx` and `components/ui/media-slot.tsx` look like they belong
on this list and do **not** — the Orb is the invalid-run page's ambient field
and `MediaSlot` renders the three fieldwork briefs. Both have exactly one call
site on purpose.

### 1.3 Assets owed — three fieldwork panels, and nothing else

Nothing generated exists. **Every page ships complete and looks finished with
zero assets present** — that is the design, not a gap. The OG cards are drawn in
code and already committed, so §4 of `higgsfieldPlan_shared.md` is closed.

The only labelled slots rendering anywhere are the **three fieldwork panels** on
`/roadmap` (`components/roadmap/fieldwork-band.tsx`). Correctly sized,
hairline-framed, each carrying its art-direction brief on screen.

**Do not delete them as cleanup.** A slot is the spec for an asset someone still
owes; deleting it deletes the requirement.

The swap is one constant:

```ts
// components/roadmap/fieldwork-band.tsx
const ASSETS: Partial<Record<string, FieldworkAsset>> = {};   // ← fill this
```

`FieldworkMedia` already handles reduced motion (poster, not a paused video),
WebM-before-MP4, and the scrim. Panel height is driven by `aspect-ratio: 16 / 9`
on the *frame*, so the band's height does not change when an asset lands —
measure `.ob-fieldwork-grid` before and after anyway.

Briefs and delivery paths: `higgsfieldPlan_roadmap.md` §1; read
`higgsfieldPlan_shared.md` §0 first. **Generation costs money** — roughly 12–16
paid generations for this band. Batch and ask once.

**Aspect ratio is settled: 16:9. There is nothing to decide before generating.**
An earlier version of this file called it an open conflict; it was not. A11
adjudicated it in the build log, the CSS ships `aspect-ratio: 16 / 9`, the
component passes `ratio="16/9"`, and the media plan specifies 16:9 at
1920×1080 — only the A11 phase body's prose still said `4 / 5`, and that line
was corrected on 2026-08-21 along with a stale `gap: 32px` (the grid is 24px).
Generate against **16:9, 1920×1080**.

`higgsfieldPlan_roadmap.md` §1's "code change to swap in" was corrected in the
same pass: it described adding an optional `src` to the panel type in
`lib/content/app.ts`, but A11 shipped the `ASSETS` record above instead. The
plan now documents what is actually in the tree.

### 1.4 Nine ad-hoc `matchMedia` reads against three uses of the shared hook

`lib/hooks/use-reduced-motion.ts` exists and is correct (reads in an effect,
subscribes to `change`). Three components use it: `define-conversation.tsx`,
`scroll-reveal.tsx`, `fieldwork-media.tsx`.

Six read `matchMedia('(prefers-reduced-motion: reduce)')` directly instead:
`count-up.tsx`, `cofounder-chat.tsx`, `hero-collage.tsx`, `verification.tsx`,
`roadmap-context.tsx`, `validate-view.tsx`, plus `use-run-stream.ts`.

**Not a bug — every one was verified correct under emulation** — but it is six
places to update if the query ever changes, and **none of them subscribes to
`change`**, so a user toggling the OS setting mid-session gets a stale answer
from six components and a live one from three. Low priority, genuinely
inconsistent.

---

## 2. Decisions left open, with recommendations

| # | What | Recommendation |
|---|---|---|
| 1 | **`.ob-dot`'s pulse is a `box-shadow` ring**, expanding `0 → 5px` in `@keyframes ob-pulse`. Standing rule 7 permits shadows only on `.ob-btn` (focus, primary hover). Present on `/` and `/style-guide`. | **Sanction it by name in the rule.** It is a blue ring used as a live indicator — the same family as the two permitted blue rings — and it is not elevation. Its reduced-motion end state is already correct (the 100% keyframe is `opacity: 1`, no ring). |
| 2 | **Three 999px radii on non-buttons on `/`**: `.ob-nav-inner` (a `<div>`), `.ob-badge` (an `<a>`), `.ob-badge-tag` (a `<span>`). Standing rule 8 says nothing but a button gets a pill. (`.ob-seed` *is* a `<button>` and is legal.) | Either restyle to `--ob-r-tag`/`--ob-r-card`, or amend rule 8 to permit a pill on a *control-shaped* element. Do not leave it undecided — it is the only place the rule is contradicted. |
| 3 | `/style-guide`'s foundations section draws a **64px swatch circle**. | Leave it. A colour swatch is a specimen, not product UI. Noted only so the audit's `borderRadius > 100px` check has a known answer. |
| 4 | **`/` is the least-swept surface in the repo.** A14 and A15 covered `/r/[slug]/*`, `/style-guide` and the supporting surfaces. `/` was only touched where the sweep forced it (two motion retunes, one button variant). | If the landing page matters commercially, it deserves its own pass. Items 1 and 2 are both there. |

---

## 3. Deployment — one thing is wrong in production today

**`NEXT_PUBLIC_SITE_URL` is unset and there is no `.env` file in the repo.**

`app/layout.tsx` falls back to `http://localhost:3000`, which means
`metadataBase` resolves every `og:image` to `http://localhost:3000/og/*.png`.
In dev that is correct. **In production every shared link previews with a broken
image** — which is R18 re-opened on the product's only distribution mechanic,
via config rather than code.

Set it at deploy time. Verify by reading the rendered tag, not the source:

```js
document.querySelector('meta[property="og:image"]').content
```

Two smaller deployment notes:

- **The five OG PNGs are committed static files** (`public/og/*.png`) and carry
  baked-in numbers — `47 VERIFIED · 31 SOURCES · 18 DISCARDED`,
  `6 OPEN QUESTIONS · 4 BUILD STEPS · 1 TRIPWIRE · 12 WEEKS`. If the fixture
  ever changes, **the cards go stale silently**; the page metadata is derived
  and will disagree with them. Re-screenshot from `/style-guide/og` — the frames
  read the same queries the pages do.
- **`/style-guide` and `/style-guide/og` are dev surfaces that build and deploy
  like any other route.** `/style-guide/og` sets `robots: noindex, nofollow`;
  `/style-guide` does not. Decide whether either should ship publicly.

---

## 4. Traps that cost time in this build

**A class-name or keyframe grep that doesn't strip comments will lie to you, and
it did again in A15.** `grep '@keyframes' styles/obsidian-app.css` reports
`ob-pulse`, `ob-app-shimmer` and `anywhere` — **all three are prose in
comments**, and `ob-pulse` appearing to be declared in that file is exactly the
catastrophe C1 warns about (it would silently kill the live dot app-wide).
Anchor to the line start, or strip comments first:

```py
re.sub(r'/\*.*?\*/', '', css, flags=re.S)
```

Same class of error already burned this build three times — `oq-grid` is a
substring of `ob-oq-grid`, `@keyframes` appears in prose, and `card` / `well` /
`nav` / `lead` match JSDoc and JS identifiers all over `components/`. **Match
exact tokens, on comment-stripped source, anchored where possible.**

**`notFound()` thrown in a layout does not render that segment's
`not-found.tsx`.** It "terminates rendering of the route segment where it was
thrown", and a segment's own boundary renders *inside* its layout — so the throw
propagates to the parent. A14 measured this: `app/r/[slug]/not-found.tsx`
rendered the **root** 404. The file was deleted and the branch moved into
`app/not-found.tsx` on `usePathname()`. **Do not re-create it.**

**§16 loses specificity fights silently, and it has now happened three times.**
A10: `.ob-fig-bar` `(0,1,0)` lost to §11's `.ob-rfig-slot .ob-fig-bar` `(0,2,0)`.
A13: `.ob-src-row` lost to §14's `.ob-src-list[data-entrance='on'] .ob-src-row`
`(0,2,1)`. A15: `.ob-chip-verified` would have lost to §6's
`.ob-finding[data-state='pending'] .ob-chip-verified` `(0,3,0)`.

**All three looked fine on screen**, because `obsidian.css` §16's universal
blanket crushes `animation-duration` to 0.001ms — the rule was dead and the
blanket was covering for it. **Assert `animationName === 'none'`, not just the
end state.** Every phase shipping a *scoped* transition must add a
matching-specificity end state, listing both selectors.

**`el.focus()` does not trigger `:focus-visible`, and it does not trigger
focus-restore either.** A15 measured "focus did not return to the originating
chip on Escape" — a false alarm caused by focusing the chip programmatically
instead of tabbing to it. With a real `Tab` press the restore works exactly as
designed. **Drive focus tests with real key presses, both ways.**

**`FIG_H.x` is the height of the *mark*, not of the figure.** A figure is
caption + mark + footer. Reserving only the mark left `/sources`'s `01 THE RUN`
band **114px short**. Any skeleton standing in for a `Figure` must wrap the mark
in the real `.ob-fig` frame.

**A blank sized by a typed number is a blank sized wrong.** `height: 21` for a
21px `.ob-lead` reserves 21px; the paragraph is 31.5px, because line-height is
1.5. The same error on a 12px mono line is 4.8px. Together they shifted the
report's sticky index by **15.3px**. Use `SkeletonInline` (`height: 1em` inside
the *real* element) so the element's own line-height sets the height.

**Turbopack can serve a stale CSS bundle.** A new rule in the file, braces
balanced, specificity correct, and `getComputedStyle` still reporting the old
value — through a hard reload, a `?cachebust=`, and `touch`. Only a dev-server
restart picked it up. Confirm the selector is in the CSSOM before concluding it
lost a specificity fight:

```js
[...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch { return [] } })
  .filter(r => (r.selectorText ?? '').includes('your-class'))
```

Empty → restart `next dev`; it is not a CSS problem.

**A CSS grid with explicit `grid-column` and no `grid-row` packs items into one
row.** Auto-placement is *sparse*: A12's four plan bars all fit in row 1 and
silently collapsed into one lane. Explicit `gridRow` is required, and the
failure renders as a plausible picture rather than an error.

**An `--ob-*` fallback is not optional on anything a component writes inline.**
`repeat(var(--ob-plan-cols, 12), …)` — without the `, 12` an undefined property
voids the *entire declaration* and you get a one-column grid with no error.

**Restarting `next dev` with `taskkill //F //IM node.exe` kills the Playwright
MCP server too.** It does not recover on its own; `/mcp` reconnects it, and the
first `browser_*` call after a reconnect fails once with *"Target page, context
or browser has been closed"* — retry it. Kill by port or PID instead.

**React's dev double-invoke breaks non-idempotent mount effects.** Fold
absolutely (`fold(events, initialState())`), never incrementally
(`setState(prev => …)`).

**Two console "errors" are expected and honest.** `/r/{bad-slug}` and `/nope`
log `Failed to load resource: … 404` — that is the document's own intended
status, not a JS error. And in **dev only**, an aborted Server Component makes
React's performance tracing emit `TypeError: … 'RunLayout' cannot have a
negative time stamp`; confirmed absent under `next start`. Do not chase either.

---

## 5. Deliberate decisions — do not "fix" these

Each looks wrong at a glance and is not. Every one is in the build log with its
reasoning; this is the short list so nobody has to find it.

> **Corrected 2026-08-21.** The previous version of this file said *"`/validate`'s
> §04 goes `h2 → h4` with no `h3` — that is C17's own table."* **That is no
> longer true and following it would re-introduce a real defect.** A15 measured
> it as a genuine 2→4 level skip: the competitors section's own heading is its
> `<h2>` and there is no intervening level, so the `<h4>` had nothing to nest
> under. `CompetitorCard` now emits `<h3 className="ob-h3">` — identical size,
> correct level — and C17's table was amended in the same commit. The route is
> `h1 ×1 · h2 ×6 · h3 ×11 · h4 ×0`, and **no route in the build emits an
> `<h4>`**.

**Define's `THE BRIEF` is an `<h2>` wearing `.ob-meta`.** Size is a class, level
is structure. `.ob-meta` sets family, size, weight, tracking, transform and
colour in `@layer components`, so the element changed and not one pixel did.

**`body` paints `--ob-canvas` even though `<html>` already does.** A0's
`transparent` existed only to stop the green `--bg-base` painting over the
canvas. With Deep Canopy gone, painting the same colour twice is a no-op that
makes `getComputedStyle(document.body).backgroundColor` an honest thing to
assert. `.ob-backdrop` is `z-index: 0`, not negative, so it still paints above.

**`h1..h6` keeps `--ob-tracking-snug`, not `--ob-tracking-h2`.** The plan's step
4 maps it to `h2`, but that mapping predates the rule it is mapping. Snug is
what A0 chose and what every route was measured against, and every heading that
matters carries `.ob-display` / `.ob-h1` / `.ob-h2` / `.ob-h3`, each setting its
own.

**The grain's opacity is a literal `0.035`, not a token.** C2 closes the token
list, and a custom property with exactly one consumer is not earning its place.
It previously read `var(--grain-opacity)` — a Deep Canopy token — which would
have voided the whole declaration when that block died, leaving a **fully opaque
noise layer over the product** with no error.

**Skeletons do not shimmer, anywhere, and `.ob-skeleton` has no §16 entry.**
1.6s is neither ambient (20–50s) nor structural (150–900ms), and an infinite
pulse claims work is happening on a block that is only waiting. The class is
static, so there is nothing left for reduced motion to resolve.

**`/sources`' loading skeleton uses `.ob-src-skeleton`, not `.ob-skel-row`.**
§14 already ships a row skeleton pinned to `--ob-src-row-h` and measured at
exactly 140px. `.ob-skel-row` serves the roadmap's collapsed questions, which
had no class. Two classes for one row is how R14 started.

**The failed-send notice sits above the composer, not in the transcript.**
`.ob-define-scroll` carries `aria-hidden="true"` so a typing paragraph is never
read letter by letter — an error rendered there is invisible to assistive tech,
and a focusable `Retry` inside an `aria-hidden` subtree is a genuine violation.

**`Composer.onSend` returns `boolean`, and the field clears only on `true`.**
It used to call `setValue('')` unconditionally, which destroyed the user's text
on a failed send — the exact promise `?sendfail=1` exists to protect. Retry
re-submits the composer's *own* value via `retrySignal`, never a stashed copy,
or a retry appends a turn while the field still shows the same words.

**The `|Δ| ≤ 8px` skeleton height contract only applies to Define.** Define is
pinned at `calc(100vh - header)` and measures 0. The other three are scrolling
documents whose fallbacks are legitimately shorter than their loaded pages
(validate 1593 → 11109); matching total height would mean reserving 11,109px of
blank space for content that resolves instantly. **The invariant that actually
prevents a visible jump is that elements present in both states land at
identical offsets** — asserted per route, ≤ 1.6px everywhere.

**`/style-guide`'s `metadata.title` is `'Style Guide'`, not
`'Style Guide — Groundwork'`.** The root template is `'%s — Groundwork'`, so it
already renders the full string; writing the suffix would double it.

**The style guide has no `define` / `roadmap` / `validate` sections.** They were
page-composition galleries and the four real routes now *are* that gallery. A
duplicate page rots the way `entry.tsx` did. What replaced them —
`evidence`, `chrome`, `states` — are the three things with no route of their own.

**`RunHeader` is not reproduced in the style guide.** It is `position: fixed`
with a constant-height spacer; a specimen would need its defining property
switched off, which proves nothing. Its parts are shown instead.

**The `#states` skeleton frames carry no `overflow-hidden`** (except Define,
whose real geometry *is* clipped). Any `overflow` other than `visible` on an
ancestor silently kills `position: sticky`, and three of those skeletons carry a
sticky element. A gallery that disables the property its specimens are defined
by is a gallery that lies.

**The invalid-run page renders no `AppBackdrop`.** One ambient field per
surface, and the `Orb` is this one's — its only surviving call site in the
build. The error boundaries *do* render one, and that does not contradict
`higgsfieldPlan_shared.md` §3: that section forbids **generated media**, and
`AppBackdrop` is code-drawn CSS.

**`runExists()` accepts any 10-char lowercase-hex slug.** It mirrors
`createRun`'s `crypto.randomUUID().replace(/-/g,'').slice(0,10)`. **The two are
coupled and neither file says so at the other end** — if the slug format ever
changes, every run created in a user's browser 404s. A real backend replaces the
body with a lookup and the coupling disappears.

**The lead build step is white, not blue.** Blue has exactly three jobs —
action, verification, live/active — and "the step to build first" is none of
them. It survives greyscale, a screenshot and reduced motion.

**Nothing on `/sources` is blue except pressed facets, focus rings, one primary
button, and the funnel's verified bar.** Citation numbers on explorer rows
(`[03]`) are `--ob-dim`; the active sort is an underline in `--ob-text`. If a
review asks why the filters aren't more prominent, `aria-pressed` carries it.

**A discarded record has no `text` field, and the row leads with a struck
excerpt.** The excerpt never became a finding, so there is no claim to render.
Adding one would invent a field, which the product definition forbids outright.

**Discards interleave with verified rows by date.** Hitting a struck-through row
mid-scroll *is* the trust claim; "tidying" them into a trailing group deletes
the feature.

**`.ob-src-row` uses `height`, not `min-height`.** With `min-height` the three
row shapes measured 140 / 140.8 / 144. The invariant is that all 65 rows are
*identical*, not that they are 140.

**The open-ended plan bar's label is clipped, not ellipsised.** An ellipsis
renders `LATER, …`, which reads as *truncated text* when the claim is *this does
not end*.

**`NOT IN IT` items are full-weight `--ob-text` with no strike.** A cut is a
decision; a discard is a failure. Strike-through belongs to `--ob-discard` alone.

**`EvidenceButton` does not render on `/sources`.** There it would open a dialog
containing the page you are looking at, and two mounted explorers would both
call `setScope`.

**The explorer writes the URL but never reads it back.** Initial state is parsed
on the *server* from `searchParams`; updates go out via `replaceState`. Reading
it back would make the browser the source of truth for state React already holds.
The overlay passes `syncUrl={false}` so a dialog can't rewrite `/validate`'s URL.

**`/sources`' two `<h2>`s are sentences, not the eyebrow numerals.** The
eyebrow-is-the-heading rule applies to routes with no per-band headline
(`/roadmap`). This route has one per band.

**`.ob-caret` blinks at 1000ms and that is inside the motion dead zone
deliberately.** A caret blink depicts a real object — a hardware cursor blinks
at about 1Hz — and at 2400ms it reads as broken rather than as typing. It is
allowlisted **by name**, not by widening the band, exactly like
`.ob-define-handoff-rule`'s 4000ms countdown.

**`--ob-discard` (#4a4a52) measures 2.25:1 and is deliberately below AA.** A
discard is meant to stop mattering. Every *sentence* it would have carried is
set in `--ob-muted` instead. **White on `--ob-accent` is 3.81:1 and is an
accepted, documented exception** — the only fix is a darker blue, which would
replace the system's single identifying hue.

**The console page carries ~240px of page scroll at 1440×900.** `position:
sticky` on the rail is load-bearing. What is measured is that the *stream* never
grows and `window.scrollY` stays 0 during use.

**The `thin` tag appears briefly on MONEY and DEMAND during a run.** The phase
body says only PRACTICAL earns it; that assumed a different arrival order. The
rule is the rule; the prose number predates the fixture.

**The nine report callout captions are derived, not typed.** If a caption reads
weakly, the lever is the fixture's fact label.

**Two `#000` values live outside `tokens.css`**, both in `mask-image` gradients.
A mask's black is *alpha*, not colour.

**`.ob-metaline-part` carries `white-space: nowrap`.** Not R21 coming back — R21
was `nowrap` + `overflow: hidden` + ellipsis on the *whole line*. Holding one
short part together while the container still wraps *between* parts is the
opposite behaviour.

---

## 6. Standing checks worth re-running before anything ships

These caught real defects during A8–A15 and cost nothing to repeat.

1. **Emitted-but-undefined classes.** Extract every `ob-*` token from
   `components/`, `app/` and `lib/`; diff against every selector in
   `styles/*.css`, **comments stripped**. This is the R2/R3/R4 failure class.
2. **Dead CSS** — the same diff in reverse, scoped to the section just written.
3. **Used-vs-defined `--ob-*`.** Anything unresolved must be a property some
   component writes inline. Today that is exactly six — `--ob-cov-fill`,
   `--ob-fig-h`, `--ob-plan-cols`, `--ob-reveal-delay`, `--ob-src-delay`,
   `--ob-ticker-offset` — each with a fallback except `--ob-fig-h`, whose
   absence is deliberate (A3 wants a missing height to void loudly).
4. **One `@keyframes` per name, all `ob-app-`-prefixed in `obsidian-app.css`.**
   Six there (`breathe` `spin` `rest` `qspin` `pulse` `src-row-in`), six in
   `obsidian.css` (`ob-blink` `ob-cue` `ob-drift` `ob-drift-alt` `ob-marquee`
   `ob-pulse`), zero collisions. **Anchor the grep to the line start** (§4).
5. **The motion binary**, per route. Must return only `.ob-dot` /
   `.ob-rest-dot` at 2400, `.ob-caret` at 1000 on `/define`, and
   `.ob-define-handoff-rule` at 4000 on Define's approved state.
   ```js
   [...document.querySelectorAll('*')].flatMap(n => {
     const s = getComputedStyle(n);
     return [...s.animationDuration.split(', '), ...s.transitionDuration.split(', ')]
       .map(d => (d.endsWith('ms') ? parseFloat(d) : parseFloat(d) * 1000))
       .filter(ms => ms > 900 && ms < 20000)
       .map(ms => ({ ms, cls: n.className.toString().slice(0, 60) }));
   })
   ```
6. **`scrollWidth === clientWidth` at 1280 on every route.** R25 sat unnoticed
   for four phases. The one-liner that finds the culprit:
   ```js
   [...document.querySelectorAll('body *')]
     .filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 0.5)
   ```
7. **Reduced motion resolves rather than stops.** Assert `animationName ===
   'none'` *and* the end state — the end state alone cannot distinguish a
   working rule from a dead one the blanket is covering for (§4).
8. **The cascade still works.** Pick one element per route carrying both a
   `.ob-` recipe and a Tailwind spacing utility; confirm the utility won.
   `marginTop: "0px"` on an element with `mt-8` means a recipe stylesheet lost
   its `layer()`. Known-good today: `ob-h1 mt-8` → `32px`,
   `ob-h1 ob-standalone-head-line mt-7` → `28px`.
9. **Document outlines against C17.** One `<h1>` per page, no level skipped, and
   **no `<h4>` anywhere**. Today: define `1/1/0`, validate `1/6/11/0`, roadmap
   `1/2/11`, sources `1/2/6`, supporting surfaces `1/0/0`.
10. **Focus rings with 40 real `Tab` presses**, not `el.focus()`. Every row must
    show an indicator, every `outlineColor` must be `rgb(45, 127, 249)`, and
    every ring must report `transitionDuration: 0s`.
11. **`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build`**, plus
    zero console errors at 1440 **and** 1280 — the two intentional 404 document
    statuses excepted (§4).
