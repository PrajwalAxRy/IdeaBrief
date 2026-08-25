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
/* **The split is `card.accent`, which already meant this.** The flag existed to
   put an accent hairline on one of four boxes; it is now what decides which
   card is a step and which is the result, so nothing was added to the content
   model to promote the figure. `31`, `47` and `9` are counts of work done on
   the way to an answer; `38` is the answer, and it is the only one the accent
   is allowed near (verification, job two).

   `?? at(-1)` is a type narrowing, not a fallback with an opinion: `find`
   returns `T | undefined` and the content file has exactly one accent card. If
   that ever stops being true the last card is the one that reads as the
   result, which is the same ordering the strip already depends on. */
const STEPS = VERIFIED_STRIP.cards.filter((card) => !card.accent);
const RESULT = VERIFIED_STRIP.cards.find((card) => card.accent) ?? VERIFIED_STRIP.cards[0];
const DROPPED = STEPS[STEPS.length - 1] ?? RESULT;

export function VerifiedStrip() {
  return (
    <section
      id="verification"
      className="ob-vstrip ob-warm ob-band ob-paper"
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
            content height and the three claim lines no longer bottom out
            together. */}
        <div className="ob-vstrip-grid mt-14">
          {STEPS.map((card, i) => (
            <ScrollReveal key={card.label} delay={i * 90} className="h-full">
              <article className="ob-vstrip-card h-full">
                <CountUp value={card.value} className="ob-vstrip-value" />
                <span className="ob-meta ob-vstrip-label">{card.label}</span>
                <p className="ob-vstrip-claim">{card.claim}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={180}>
          <VerifiedFigure />
        </ScrollReveal>

        {/* The continuation, on the same band: the cards state what the
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

/**
 * The result, as a figure rather than as a fourth box.
 *
 * **It draws the arithmetic the two cards to its left just supplied.** 47
 * excerpts were extracted, 9 failed the match, 38 are in the report — so the
 * bar is 38 of 47 accent and 9 of 47 struck, at true proportion, computed from
 * the same content the cards render. It is a rendering of the claim, not an
 * illustration beside it: change a value in `VERIFIED_STRIP` and the bar moves
 * with it. That is the skill's proof/mechanic pattern — show the mechanism
 * happening, never a picture of it having happened.
 *
 * The total is `kept + dropped` rather than the `47` card, deliberately. Both
 * are 47 today, but the two numbers mean different things — one is what was
 * pulled, the other is what the bar is a partition of — and reading the total
 * off the partition is what guarantees the segments always sum to the track.
 *
 * Still a Server Component. The segments animate from a CSS transition keyed to
 * the `data-shown` that `ScrollReveal` already sets on its wrapper, so the
 * reveal costs no client JS of its own; `CountUp` is the one client leaf, as it
 * is on the three step cards.
 */
function VerifiedFigure() {
  const kept = RESULT.value;
  const dropped = DROPPED.value;
  const total = kept + dropped;

  return (
    <div className="ob-vstrip-figure mt-5">
      <div>
        <CountUp value={kept} className="ob-vstrip-value" />
        <span className="ob-meta ob-vstrip-label">{RESULT.label}</span>
        <p className="ob-vstrip-claim">{RESULT.claim}</p>
      </div>

      {/* `aria-hidden`: the bar is a second rendering of numbers a screen
          reader has already been given twice — once on the `47`/`9` cards and
          once on the numeral to the left. Announcing the partition again would
          be three readings of one fact. */}
      <div aria-hidden="true">
        <div className="ob-vstrip-bar">
          <span
            className="ob-vstrip-seg"
            data-kind="kept"
            style={{ '--ob-seg': `${(kept / total) * 100}%` } as React.CSSProperties}
          />
          <span
            className="ob-vstrip-seg"
            data-kind="dropped"
            style={{ '--ob-seg': `${(dropped / total) * 100}%` } as React.CSSProperties}
          />
        </div>

        <div className="ob-vstrip-legend">
          <span className="ob-meta">
            <span className="ob-vstrip-key" data-kind="kept" />
            {RESULT.label} {kept}
          </span>
          <span className="ob-meta">
            <span className="ob-vstrip-key" data-kind="dropped" />
            {DROPPED.label} {dropped}
          </span>
        </div>
      </div>
    </div>
  );
}
