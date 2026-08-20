'use client';

import { PILLARS, PILLARS_SECTION } from '@/lib/content/landing';
import { useEffect, useRef, useState } from 'react';
import { Fragment } from './fragments';
import { ScrollReveal } from './scroll-reveal';
import { SectionHead } from './section-head';

/**
 * The three pillars, as sticky-left / scrolling-right scrollytelling.
 *
 * The heading column pins while the panels move past it and hand off one at a
 * time — the pinned feel, without ever taking the scrollbar away from the user.
 * Nothing here hijacks or scrubs the scroll; a single IntersectionObserver
 * watching a thin band across the viewport middle decides which panel is live.
 */
export function Pillars() {
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = panelRefs.current.filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const visible = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        }
        /* Keep the last active when the band falls between panels, rather than
           resetting to 0 and making the rail flicker. */
        if (visible.size > 0) setActive(Math.min(...visible));
      },
      /* A 10%-tall band across the middle of the viewport. A panel becomes live
         when it crosses the reader's eyeline, not when it first appears. */
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="ob-section" aria-labelledby="pillars-headline">
      <div className="ob-container grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-24">
        {/* Pinned column */}
        <div className="relative">
          <div className="sticky top-[22vh] flex flex-col gap-14">
            <SectionHead
              index="01"
              id="pillars-headline"
              eyebrow={PILLARS_SECTION.eyebrow}
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
              data-index={i}
              data-dim={i !== active}
              className="ob-pillar-panel"
              ref={(node) => {
                panelRefs.current[i] = node;
              }}
            >
              <div className="flex items-baseline gap-4">
                <span className="ob-pillar-index">{pillar.index}</span>
                <span className="ob-meta">{pillar.kicker}</span>
              </div>

              <h3 className="ob-h2 mt-6 max-w-[17ch]">{pillar.title}</h3>
              <p className="ob-body mt-6 max-w-[58ch]">{pillar.body}</p>

              <p className="ob-body ob-proof mt-6 max-w-[52ch]">{pillar.proof}</p>

              <ScrollReveal delay={120} className="mt-10">
                <Fragment kind={pillar.fragment} />
              </ScrollReveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
