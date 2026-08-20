'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

type Options = {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  rootMargin?: string;
  /** Latch on first entry and stop observing. Reveals want this; scrollytelling doesn't. */
  once?: boolean;
};

/**
 * IntersectionObserver as a hook. The landing page drives every reveal from
 * this rather than from scroll position, so nothing runs per-frame — the
 * observer flips a boolean, CSS does the animating.
 *
 * Falls open: if IntersectionObserver is unavailable the element is treated as
 * visible immediately, so content is never left stuck at opacity 0.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px', once = true } = options;
  const ref = useRef<T>(null) as RefObject<T | null>;
  const [inView, setInView] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `ref` is a stable object and `ref.current` is read once at effect time; listing it would re-run the observer on every render.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
