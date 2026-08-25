import { CountUp } from '@/components/figures/count-up';
import { VERIFIED_STRIP } from '@/lib/content/landing';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from './scroll-reveal';

/**
 * The trust mechanic, compressed from a section into a banded strip.
 *
 * What was `02 The mechanic` — a headline, a cycling excerpt card that drew a
 * blue rule under a matched quote, and a four-up counter row — is now one head
 * row and four cards on a surface band. See `VERIFIED_STRIP` for why the
 * numbers on those cards are not free to change.
 *
 * **A Server Component**, and the counting numerals do not change that. The old
 * section was `'use client'` end to end because it owned a `useState` cycle
 * *and* a hand-rolled rAF counter — the second of which was a duplicate of
 * `CountUp`, which already exists, already short-circuits under reduced motion,
 * and already renders the final value on the server so a reader with no JS sees
 * a real number. Four client leaves, and nothing above them.
 *
 * It keeps `id="verification"` because `FOOTER` links at it four times.
 *
 * **It is the page's second warm band.** `/` alternates, and the rule a band has
 * to pass is that it is somewhere the reader *does* something — which this now
 * is: the strip closes on a CTA back to the composer. `ob-warm` remaps the
 * `--ob-*` colour tokens in place (tokens.css), so the cards, the numerals, the
 * accent card's hairline and the button invert with no override here and none in
 * `.ob-vstrip`. Blue becomes burnt orange and keeps its three jobs.
 *
 * `page.tsx` wraps it in `ob-band-mount` for the slate side of the boundary
 * (§12B), which has to sit outside `ob-warm` to resolve dark tokens. As the
 * last child of `<main>` its bottom rule drops — `.ob-footer` already carries
 * one.
 */
export function VerifiedStrip() {
  return (
    <section
      id="verification"
      className="ob-vstrip ob-warm ob-band"
      aria-labelledby="verified-label"
    >
      <div className="ob-container">
        <ScrollReveal>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,380px)] items-start gap-16">
            <div>
              <h2 id="verified-label" className="ob-meta ob-meta-solid">
                {VERIFIED_STRIP.label}
              </h2>
              <p className="ob-body mt-4 max-w-[54ch]">{VERIFIED_STRIP.lead}</p>
            </div>

            {/* Same sentence, same treatment it had in the deleted section:
                a hairline down its left edge and full `--ob-text`. */}
            <p className="ob-sm ob-proof">{VERIFIED_STRIP.kicker}</p>
          </div>
        </ScrollReveal>

        {/* `h-full` on both the reveal and the card below: `ScrollReveal`
            renders the grid item, so without it the card stops at its own
            content height and the four claim lines no longer bottom out
            together. */}
        <div className="ob-vstrip-grid mt-14">
          {VERIFIED_STRIP.cards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i * 90} className="h-full">
              <article className="ob-vstrip-card h-full" data-accent={card.accent}>
                <CountUp value={card.value} className="ob-vstrip-value" />
                <span className="ob-meta ob-vstrip-label">{card.label}</span>
                <p className="ob-vstrip-claim">{card.claim}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* The continuation, on the same band: the four cards state what the
            check did to someone else's run, and this turns that into something
            the reader can do about their own. It links up to the composer at
            `#start` rather than carrying a second one — one composer per page,
            and a second input asking for the same sentence reads as two
            different products.

            `.ob-btn-primary` is the page's second, and the rule is one visible
            per viewport, not per page: the composer's Start button is ~1200px
            above this and the two never share a screen. */}
        <ScrollReveal>
          <div className="ob-vstrip-cta mt-16">
            <div>
              <h3 className="ob-h3">{VERIFIED_STRIP.cta.headline}</h3>
              <p className="ob-body mt-3 max-w-[46ch]">{VERIFIED_STRIP.cta.body}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <Link href={VERIFIED_STRIP.cta.href} className="ob-btn ob-btn-primary">
                {VERIFIED_STRIP.cta.label}
                <ArrowUpRight size={16} className="ob-arrow" aria-hidden="true" />
              </Link>
              <span className="ob-meta">{VERIFIED_STRIP.cta.note}</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
