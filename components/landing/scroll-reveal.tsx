'use client';

import { useInView } from '@/lib/hooks/use-in-view';

type Props = {
  children: React.ReactNode;
  /** Stagger in ms, applied as a CSS transition-delay. */
  delay?: number;
  className?: string;
  threshold?: number;
};

/**
 * Blur-up reveal on scroll. Sets `data-shown` and lets `.ob-reveal` in
 * styles/obsidian.css do the work — no per-frame JS, and the whole thing
 * collapses to a no-op under `prefers-reduced-motion`.
 */
export function ScrollReveal({ children, delay = 0, className, threshold = 0.15 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });

  return (
    <div
      ref={ref}
      className={className ? `ob-reveal ${className}` : 'ob-reveal'}
      data-shown={inView}
      style={{ '--ob-reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
