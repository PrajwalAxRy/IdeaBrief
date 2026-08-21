'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

type Props = {
  children: React.ReactNode;
  /** Stagger in ms, applied as a CSS transition-delay. */
  delay?: number;
  className?: string;
  threshold?: number;
};

/**
 * Blur-up reveal on scroll. Sets `data-shown` and lets `.ob-reveal` in
 * styles/obsidian.css do the work — no per-frame JS.
 *
 * **Under reduced motion `data-shown` is `true` on first paint, without
 * scrolling.** CSS §16 already resolves `.ob-reveal` to its end state, so the
 * pixels were right either way — but the attribute is the JS half of standing
 * rule 16, and leaving it `false` meant the end state depended entirely on a
 * blanket rule. That is how a dead rule hides: it looks correct because
 * something else is covering for it.
 */
export function ScrollReveal({ children, delay = 0, className, threshold = 0.15 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className ? `ob-reveal ${className}` : 'ob-reveal'}
      data-shown={reduced || inView}
      style={{ '--ob-reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
