'use client';

import { SectionLabel } from '@/components/ui/section-label';
import { PILLARS, PILLARS_SECTION } from '@/lib/content/landing';
import { useEffect, useRef, useState } from 'react';
import { Fragment } from './fragments';
import { IdeaSession } from './idea-session';
import { ScrollReveal } from './scroll-reveal';
import { SectionHead } from './section-head';
import { ValidateSession } from './validate-session';

/**
 * The three pillars, as sticky-left / scrolling-right scrollytelling.
 *
 * The heading column pins while the panels move past it and hand off one at a
 * time — the pinned feel, without ever taking the scrollbar away from the user.
 * Nothing here hijacks or scrubs the scroll.
 */
export function Pillars() {
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  /* A panel goes live exactly when *its own title* crosses the reader's
   * eyeline (viewport middle) — not when the panel's outer box (title + body
   * + a sizeable animated fragment, which can run far taller than a title)
   * happens to overlap some band. An IntersectionObserver watching whole
   * panels was tried first: on a tall panel, the callback batch that reported
   * the outgoing panel's bottom leaving the band could land separately from
   * the one reporting the incoming panel's top entering it, so the active
   * fragment dimmed while still on screen and the next one lit before its
   * title had actually arrived. `useScrollSpy` hit the same class of bug for
   * the report's section index and fixed it the same way: recompute from live
   * `getBoundingClientRect()`s against a fixed line, driven by scroll, instead
   * of trusting whatever the observer batched together.
   */
  useEffect(() => {
    const titles = titleRefs.current;
    if (titles.length === 0) return;

    function recompute() {
      const mid = window.innerHeight / 2;
      let current = 0;
      for (let i = 0; i < titles.length; i++) {
        const el = titles[i];
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      }
      setActive(current);
    }

    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, []);

  return (
    <section id="how-it-works" className="ob-section" aria-labelledby="pillars-headline">
      <div className="ob-container grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-24">
        {/* Pinned column */}
        <div className="relative">
          <div className="sticky top-[22vh] flex flex-col gap-14">
            {/* No `index` and no `eyebrow`: the `02 WHAT YOU DO HERE` overline
                is gone. `CofounderChat` dropped its `01` in the same change, so
                a `02` here would be the only numeral on the page — a count that
                starts at two. The per-pillar `01/02/03` labels inside the
                panels are untouched; those number the pillars, not the page. */}
            <SectionHead
              id="pillars-headline"
              headlineLines={['Three things,', 'and nothing else.']}
              lead={PILLARS_SECTION.lead}
            />

            <ScrollReveal delay={280}>
              <nav className="ob-pillar-rail" aria-label="The three pillars">
                {PILLARS.map((pillar, i) => (
                  <button
                    type="button"
                    key={pillar.index}
                    className="ob-pillar-tick"
                    data-active={i === active}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() =>
                      panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  >
                    <span className="ob-meta">{pillar.index}</span>
                    <span className="ob-pillar-tick-label">{pillar.kicker}</span>
                  </button>
                ))}
              </nav>
            </ScrollReveal>
          </div>
        </div>

        {/* Scrolling column */}
        <div className="flex flex-col gap-40">
          {PILLARS.map((pillar, i) => (
            <article
              key={pillar.index}
              data-dim={i !== active}
              className="ob-pillar-panel"
              ref={(node) => {
                panelRefs.current[i] = node;
              }}
            >
              <SectionLabel index={pillar.index}>{pillar.kicker}</SectionLabel>

              <h3
                className="ob-h2 mt-6 max-w-[17ch]"
                ref={(node) => {
                  titleRefs.current[i] = node;
                }}
              >
                {pillar.title}
              </h3>
              <p className="ob-body mt-6 max-w-[58ch]">{pillar.body}</p>

              <p className="ob-body ob-proof mt-6 max-w-[52ch]">{pillar.proof}</p>

              {/* This wrapper is the whole of pillars 01 and 02's scroll-driven
                  motion: the card's entrance. `IdeaSession` and
                  `ValidateSession` each run on their own timer once in view,
                  and neither is ever scroll-scrubbed. */}
              <ScrollReveal delay={120} className="mt-10">
                {pillar.fragment === 'conversation' ? (
                  <IdeaSession />
                ) : pillar.fragment === 'evidence' ? (
                  <ValidateSession />
                ) : (
                  <Fragment kind={pillar.fragment} />
                )}
              </ScrollReveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
