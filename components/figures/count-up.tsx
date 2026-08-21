'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { useEffect, useState } from 'react';

/**
 * **A15 retune: 1100ms → 900ms, `--ob-enter`.** Long enough to read as
 * counting, short enough not to be a wait — and, more to the point, this system
 * has exactly three durations and will not grow a fourth. A deliberate
 * deviation from `motion.md` §5c, which specifies 1100ms.
 *
 * It is a rAF loop, not a CSS duration, so the motion binary cannot see it.
 * That is exactly why it is written down here.
 */
const DURATION_MS = 900;

/** Ease-out cubic. */
function ease(p: number): number {
  return 1 - (1 - p) ** 3;
}

/**
 * The rAF numeral leaf — **the only client component in the figure layer.**
 *
 * The per-frame state lives here and nowhere higher, so a counting numeral
 * never re-renders its section. Every `components/figures/*` file above it and
 * `report-figures.tsx` stay Server Components.
 *
 * **Reduced motion short-circuits to the final value**, never to a frozen zero
 * — `47` renders as `47`, not as a `0` that will never move. The `matchMedia`
 * read happens in an effect, never during render, or SSR hydration breaks.
 *
 * The initial state is the final value, so the server sends the real number and
 * a reader with no JS sees it.
 */
export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / DURATION_MS);
      setDisplay(Math.round(ease(progress) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    /* `data-value` carries the final number so reduced-motion verification can
       assert `textContent === dataset.value` rather than merely counting nodes.
       Without it the check reads an empty list, and `every()` on an empty list
       passes — the exact shape of an assertion that measures air for years. */
    <span
      ref={ref}
      className={['ob-countup', className].filter(Boolean).join(' ')}
      data-value={value}
    >
      {display}
    </span>
  );
}
