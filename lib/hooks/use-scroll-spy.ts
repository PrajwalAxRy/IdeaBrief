'use client';

import { useEffect, useState } from 'react';

/** Clears the sticky `RunShell` header (72px) plus breathing room — matches `.report-section`'s `scroll-margin-top`. */
const TOP_INSET = 112;

/**
 * Tracks which of `ids` is the "active" section for a sticky scrollspy —
 * `SectionIndex` (Report) today, `SegmentedControl` (Roadmap, P9) later.
 *
 * Walks `ids` in document order and picks the last one whose top has
 * scrolled past the header line, rather than reacting only to
 * `IntersectionObserver` entries that changed in a given callback batch.
 * The observer-batch approach was tried first and had a real bug (caught
 * live via the Playwright MCP, not just in review): when a tall section's
 * bottom scrolled out of view in a different callback invocation than the
 * next section's top scrolling in, `entries` sometimes contained only the
 * exiting section, leaving `activeId` stuck on it indefinitely. Recomputing
 * from every observed element's live `getBoundingClientRect()` on each
 * scroll/resize sidesteps that entirely.
 *
 * Returns a setter too: a `scrollIntoView` landing spot can round to a
 * fraction of a pixel either side of the threshold line (also caught live —
 * a scroll-jump click sometimes left the *previous* entry active by a
 * sub-pixel margin), so `SectionIndex` sets the clicked target optimistically
 * and this hook's own scroll listener takes back over on the next real scroll.
 *
 * Also treats "scrolled to the bottom of the page" as "the last section is
 * active" — the last section can't always reach the top-inset line (there's
 * no more content below it to scroll), which otherwise left the
 * second-to-last entry stuck active forever once you reached the end.
 */
export function useScrollSpy(ids: string[]): [string | null, (id: string) => void] {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    function recompute() {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= TOP_INSET) current = element;
      }
      setActiveId(current.id);
    }

    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, [ids]);

  return [activeId, setActiveId];
}
