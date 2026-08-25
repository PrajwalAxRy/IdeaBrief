import { CofounderChat } from '@/components/landing/cofounder-chat';
import { DimensionMarquee } from '@/components/landing/dimension-marquee';
import { Hero } from '@/components/landing/hero';
import { Pillars } from '@/components/landing/pillars';
import { VerifiedStrip } from '@/components/landing/verified-strip';

/**
 * The landing page.
 *
 * Reading order is claim → input → capability → reassurance:
 *   Hero            what this is, in one sentence you could repeat
 *   Marquee         the scope of a research run, stated once
 *   Cofounder chat  01  the demo and the live entry point, on a warm light band
 *   Pillars   02    the three things you actually do here
 *   Verified strip      four cards on a warm band, then the closing ask
 *
 * **The entry point used to sit second, after the pillars.** It now leads: a
 * reader who already knows what they want reaches the composer without
 * scrolling past an explanation they didn't ask for, and one who doesn't gets
 * the same explanation immediately below. The two sections swapped numerals
 * with their positions — a page that counts 02 then 01 reads as a bug.
 *
 * **The proof used to sit between the pillars and the entry point, as its own
 * section.** `The mechanic` was a two-column headline, a cycling excerpt card
 * and a four-up counter row — roughly 900px of page arguing for something a
 * pillar has already shown the reader happening on screen. It is now
 * `VerifiedStrip`: the same argument, four cards, and it stays at the foot of
 * the page rather than travelling with the composer, so the page still closes
 * on the trust argument.
 *
 * **The shell moved up one level in A20.** `SkipLink`, the backdrop, `.ob-layer`,
 * `SiteNav`, `<main id="main">` and `SiteFooter` now live in
 * `app/(site)/layout.tsx`, shared with `/pricing`, `/runs` and `/account`. This
 * file is the page's own content and nothing else. `(site)` is URL-invisible —
 * this is still `/`.
 *
 * Obsidian is not a theme, it is the system: A15 deleted Deep Canopy and with
 * it the `data-theme` attribute, so every recipe in styles/obsidian.css is
 * global and this page declares nothing.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <hr className="ob-rule" />
      <DimensionMarquee />

      {/* No `<hr>` either side of this one, for the same reason `VerifiedStrip`
          has none: `.ob-band` carries its own `border-block`, so the warm band
          and the two hairlines that bound it are one object rather than three
          siblings that could drift apart.

          **The `ob-band-mount` wrapper is the slate side of that boundary**
          (obsidian.css §12B) — a hairline and 24px of deepening slate at each
          edge, so the paper reads as mounted on the board rather than as a raw
          cut from near-black to cream. It is a wrapper rather than a class on
          the section because every token inside `.ob-warm` resolves to the warm
          remap, and a hairline drawn in warm stone is invisible against paper.
          That is also why it is here and not in the component: this is where
          the page's alternation is decided, and the mount is part of it. */}
      <div className="ob-band-mount">
        <CofounderChat />
      </div>

      <Pillars />

      {/* No `<hr>` around this one either: it carries `.ob-band`, which owns
          the surface and a hairline at each edge, so the band and the two rules
          that bound it are one object rather than three siblings that could
          drift apart. The page therefore alternates dark → warm → dark → warm
          and closes on paper, under the CTA back up to the composer.

          Same `ob-band-mount` wrapper as the composer band. As the last child
          of `<main>` its bottom rule drops to `0` — `.ob-footer` carries a
          `border-top` of its own, and two adjacent hairlines are a 2px line. */}
      <div className="ob-band-mount">
        <VerifiedStrip />
      </div>
    </>
  );
}
