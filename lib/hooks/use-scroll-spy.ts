'use client';

import { useEffect, useState } from 'react';

/** Only used if `--ob-anchor-inset` can't be read (SSR-adjacent edge, or a
 *  stylesheet that hasn't applied yet). Same number the token holds today. */
const SPY_FALLBACK = 136;

/**
 * The inset is *derived from the same token the anchor landing uses*, so the
 * two cannot disagree. `main [id] { scroll-margin-top: var(--ob-anchor-inset) }`
 * is the one rule that positions a jumped-to section (C2); reading the token
 * here means a section that has just been scrolled to lands at exactly the
 * line this hook compares against.
 */
function topInset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--ob-anchor-inset')
    .trim();
  return Number.parseFloat(raw) || SPY_FALLBACK;
}

/**
 * Tracks which of `ids` is the "active" section for a sticky scrollspy —
 * `SectionIndex` (Report) today, `SegmentedControl` (Roadmap) later.
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
 * **R16 — the effect depends on the ids' *value*, not the array's identity.**
 * `SectionIndex` passes `items.map(...)`, a fresh array every render, and the
 * array used to be the effect dependency: every state update tore down and
 * re-registered the scroll listeners. The list is joined to a string key and
 * reconstructed *inside* the effect, so nothing closes over the unstable
 * reference and callers need no discipline at all.
 *
 * Returns a setter too: a `scrollIntoView` landing spot can round to a
 * fraction of a pixel either side of the threshold line (also caught live —
 * a scroll-jump click sometimes left the *previous* entry active by a
 * sub-pixel margin), so `SectionIndex` sets the clicked target optimistically
 * and this hook's own scroll listener takes back over on the next real scroll.
 * The 1px of slack in the comparison below absorbs the same rounding.
 *
 * Also treats "scrolled to the bottom of the page" as "the last section is
 * active" — the last section can't always reach the top-inset line (there's
 * no more content below it to scroll), which otherwise left the
 * second-to-last entry stuck active forever once you reached the end.
 */
export function useScrollSpy(ids: string[]): [string | null, (id: string) => void] {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let inset = topInset();

    function recompute() {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top - inset <= 1) current = element;
      }
      setActiveId(current.id);
    }

    function onResize() {
      inset = topInset();
      recompute();
    }

    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', onResize);
    };
  }, [key]);

  return [activeId, setActiveId];
}
