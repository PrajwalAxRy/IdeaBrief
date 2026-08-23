'use client';

import { Wordmark } from '@/components/layout/wordmark';
import { HERO } from '@/lib/content/landing';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Transparent over the hero, condensing into a bordered pill on scroll.
 *
 * The primary CTA is deliberately withheld until the hero's own primary button
 * has scrolled away — the system allows exactly one filled button on screen at
 * a time, and this is how that rule survives a fixed header.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setPastHero(y > window.innerHeight * 0.72);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="ob-nav" data-scrolled={scrolled} data-past-hero={pastHero}>
      <div className="ob-nav-inner">
        {/* One glyph definition in the repo. A2 re-authored `LogoMark` and
            deliberately left this call site to A4 — this is that dedupe. */}
        <Wordmark />

        <div className="flex items-center gap-4">
          <Link href={HERO.secondary.href} className="ob-btn ob-btn-bare">
            {HERO.secondary.label}
          </Link>
          {/* **Ghost, not primary (A15).** Measured at 1440×900 and 1280×900,
              this and the hero's `Start with an idea` were both in view at
              once — two filled blue buttons saying the same thing, which is
              rule 11's exact failure. The hero's is the page's one primary;
              this is the persistent way back to it, so it takes the quieter
              treatment and the eye keeps a single target. */}
          <span className="ob-nav-cta">
            <a href="#start" className="ob-btn ob-btn-ghost">
              Start
            </a>
          </span>
        </div>
      </div>
    </header>
  );
}
