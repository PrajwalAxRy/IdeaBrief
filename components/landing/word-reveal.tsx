'use client';

import { useInView } from '@/lib/hooks/use-in-view';
import { useEffect, useState } from 'react';

type Props = {
  /** Pre-broken lines. The design decides where headlines wrap, not the browser. */
  lines: readonly string[];
  className?: string;
  id?: string;
  /** `mount` for above-the-fold headlines, `scroll` for everything below it. */
  trigger?: 'mount' | 'scroll';
  /** Per-word stagger, ms. */
  stagger?: number;
  /** Delay before the first word moves, ms. */
  delay?: number;
  as?: 'h1' | 'h2' | 'p';
};

/**
 * Per-word mask reveal: each line is a clipped box and the words ride up out of
 * it, staggered. The single most characteristic motion on the page, so it is
 * reserved for section headlines and used nowhere else.
 */
export function WordReveal({
  lines,
  className,
  id,
  trigger = 'scroll',
  stagger = 55,
  delay = 0,
  as: Tag = 'h2',
}: Props) {
  const { ref, inView } = useInView<HTMLHeadingElement>({ threshold: 0.35 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (trigger !== 'mount') return;
    /* One frame after paint, so the words start from their masked position
       rather than snapping — otherwise the first render already has them up. */
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [trigger]);

  const shown = trigger === 'mount' ? mounted : inView;

  /* Running index so the stagger continues across line breaks instead of
     restarting, which would make line 2 overtake the end of line 1. */
  let wordIndex = -1;

  return (
    <Tag ref={ref} id={id} className={className} data-shown={shown}>
      {lines.map((line) => (
        <span className="ob-word-line" key={line}>
          {line.split(' ').map((word, i, all) => {
            wordIndex += 1;
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: words repeat within a line; position is the identity
                key={`${word}-${i}`}
                className="ob-word"
                style={
                  { '--ob-word-delay': `${delay + wordIndex * stagger}ms` } as React.CSSProperties
                }
              >
                {i === all.length - 1 ? word : `${word} `}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
