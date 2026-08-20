'use client';

import { BRAND, HERO, NAV_LINKS } from '@/lib/content/landing';
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
        <Link href="/" className="ob-wordmark" aria-label={`${BRAND.name} — home`}>
          <Mark />
          {BRAND.name}
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="ob-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href={HERO.secondary.href} className="ob-btn ob-btn-bare">
            {HERO.secondary.label}
          </Link>
          <span className="ob-nav-cta">
            <a href="#start" className="ob-btn ob-btn-primary">
              Start
            </a>
          </span>
        </div>
      </div>
    </header>
  );
}

/**
 * The mark: a surveyed square with one corner stone set. Rotates 90° on hover
 * (see `.ob-wordmark:hover .ob-wordmark-glyph`).
 */
function Mark() {
  return (
    <svg
      className="ob-wordmark-glyph"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="14" height="14" stroke="currentColor" />
      <rect x="1" y="9" width="5" height="5" fill="currentColor" />
    </svg>
  );
}
