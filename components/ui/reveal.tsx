'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import type { CSSProperties, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset for siblings. */
  delayMs?: number;
}

/**
 * Scroll-triggered entrance, re-authored over the `.ob-reveal` mechanism in
 * styles/obsidian.css §15: the observer flips one data attribute and CSS does
 * all the animating, so nothing runs per frame. Latches on first entry and
 * never re-triggers on scroll-back.
 *
 * The old IntersectionObserver-plus-inline-`transitionDelay` implementation is
 * deleted, not translated. `components/landing/scroll-reveal.tsx` is
 * deliberately left alone — `/` is out of scope; A15 may dedupe.
 *
 * Reduced motion is handled by `.ob-reveal`'s own reduce block in
 * obsidian.css §16, which resolves to the end state rather than merely
 * stopping (rule 16).
 */
export function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={['ob-reveal', className].filter(Boolean).join(' ')}
      data-shown={inView}
      style={{ '--ob-reveal-delay': `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
