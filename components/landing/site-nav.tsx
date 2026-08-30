'use client';

import { Wordmark } from '@/components/layout/wordmark';
import { HERO } from '@/lib/content/landing';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Transparent over the hero, condensing into a bordered pill on scroll.
 *
 * The account link is permanent — it is not the page's CTA, so it never
 * competes with the hero's one filled button and has nothing to wait for.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
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
    <header className="ob-nav" data-scrolled={scrolled}>
      <div className="ob-nav-inner">
        {/* One glyph definition in the repo. A2 re-authored `LogoMark` and
            deliberately left this call site to A4 — this is that dedupe. */}
        <Wordmark />

        <div className="flex items-center gap-4">
          <Link href={HERO.secondary.href} className="ob-btn ob-btn-bare">
            {HERO.secondary.label}
          </Link>
          {/* **Ghost, not primary (A15).** A filled button here would sit
              alongside the hero's `Start with an idea` at 1440×900 and
              1280×900 — two primaries on one screen, rule 11's exact failure.
              Now that it says `Sign In` it is no longer a second CTA at all,
              so it stays mounted rather than waiting out the hero. */}
          <span className="ob-nav-cta">
            <a href="#start" className="ob-btn ob-btn-ghost">
              Sign In
            </a>
          </span>
        </div>
      </div>
    </header>
  );
}
