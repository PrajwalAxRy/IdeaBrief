'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * The JS half of standing rule 16. CSS resolving to the end state is only half
 * the contract — auto-advancing content is motion too, and a typewriter that
 * still types is motion no stylesheet can stop.
 *
 * Reads `matchMedia` **in an effect**, never during render, so the server and
 * the first client paint agree. Returns `false` until that effect runs, which
 * is the same shape `useRunProgress` uses and for the same reason.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(QUERY);
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
