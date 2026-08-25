import { CLOSING_CTA, PREVIEW_RUNS } from '@/lib/content/landing';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

/**
 * The page's closing ask — a headline, a button, and the four finished runs in
 * a 2×2. The last thing on `/` before the footer.
 *
 * **This is what is left of `VerifiedStrip`.** That section argued the trust
 * mechanic three different ways over three rebuilds — a cycling excerpt card
 * and a counter row, then four stat cards, then a source ledger matching four
 * report claims against the pages they came from — and the owner removed it
 * outright, keeping only the ask at its foot. Gone with it:
 * `.ob-vstrip-head`, the whole `.ob-ledger-*` family, `.ob-web-*`,
 * `.ob-vstrip-bar` / `-seg`, `.ob-chip-discarded`, and `VERIFIED_STRIP`'s
 * `meter` / `ledger` / `rail`. The page no longer *states* the verification
 * argument anywhere; pillar 02 *performs* it, which is where the footer's four
 * ex-`#verification` links now point.
 *
 * It carries **no `id`**. `id="verification"` was on the old section because
 * `FOOTER` linked at it four times; none of those links survive, and an anchor
 * named after a deleted argument is worse than no anchor. `aria-labelledby`
 * points at the section's own heading instead.
 *
 * **It is still the page's second warm band, and it still earns the
 * inversion.** The rule is that a band inverts where the reader *does*
 * something rather than reads about something — and with everything else
 * stripped out, this band is now nothing but things to do. `/` alternates
 * dark → warm → dark → warm and closes on paper, under a button back to the
 * composer 1200px up.
 *
 * **The panel is gone, and the copy with it.** For four revisions this was a
 * bordered, lifted card holding an overline between two rules, an `--ob-h2`, a
 * 44ch lead and a note under the button — a box on the band saying one thing at
 * four lengths. What replaced it, at the user's direction, is the shortest
 * version of the same move: the headline, the button under it, the four runs
 * below. There is no card because the cards are the content — a bordered panel
 * wrapped around a 2×2 of bordered cards is a box in a box, and on paper (where
 * elevation is doing the work `--ob-lift-*` was added for) the outer box would
 * out-rank the four things it contains. The band's own hairlines are the frame.
 *
 * **The 2×2 is the same four runs `CofounderChat` stacks beside the composer,
 * deliberately repeated.** They are a column you read down there and a grid you
 * scan here, 1200px apart, and both are exits from the same page — the row at
 * the top is an alternative to typing, this one is the last offer before the
 * footer. The single source is `PREVIEW_RUNS`; there is no second copy of the
 * content, only a second presentation of it.
 *
 * A Server Component with no client leaf at all. `ScrollReveal` is the only
 * client component below this point on the page.
 *
 * `.ob-btn-primary` is the page's second, and the rule is one visible per
 * viewport, not per page: the composer's Start button never shares a screen
 * with this one.
 */
export function ClosingCta() {
  return (
    <section className="ob-closing ob-warm ob-band ob-paper" aria-labelledby="closing-cta-headline">
      <div className="ob-container">
        <div className="ob-closing-panel">
          <ScrollReveal>
            <h2 id="closing-cta-headline" className="ob-h2">
              {CLOSING_CTA.headline}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={90} className="ob-closing-act">
            <Link href={CLOSING_CTA.href} className="ob-btn ob-btn-primary">
              {CLOSING_CTA.label}
              <ArrowUpRight size={16} className="ob-arrow" aria-hidden="true" />
            </Link>
          </ScrollReveal>

          {/* Same card recipe as the stack beside the composer, unchanged: at
              two columns inside 860px each tile is ~424px, which is within a
              few pixels of the 420px column `.ob-preview-card` was tuned for,
              so the title still breaks where it was measured to break. */}
          <div className="ob-closing-grid">
            {PREVIEW_RUNS.map((run, i) => (
              <ScrollReveal key={run.slug} delay={140 + i * 70}>
                <Link href={`/preview/${run.slug}`} className="ob-preview-card">
                  <span className="min-w-0">
                    <span className="ob-meta ob-preview-sector block">{run.sector}</span>
                    <span className="ob-preview-title block">{run.title}</span>
                    <span className="ob-preview-finding">{run.finding}</span>
                  </span>

                  <span className="ob-preview-go">
                    <ArrowUpRight size={14} className="ob-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
