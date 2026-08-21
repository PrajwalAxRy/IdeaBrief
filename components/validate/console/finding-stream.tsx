'use client';

import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { FindingCard } from '@/components/validate/evidence/finding-card';
import { citationNumberForFindingId } from '@/lib/citations';
import { APP_CONSOLE } from '@/lib/content/app';
import type { Finding } from '@/lib/schemas/evidence';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const VISIBLE_CAP = 25;
/** Below this the user is still parked at the top and cards simply appear. */
const PINNED_THRESHOLD_PX = 4;
/** `.ob-fstream`'s column gap, asserted here and declared in §9. */
const STREAM_GAP_PX = 16;

/**
 * Trust device 3 — the arriving findings.
 *
 * **The stream owns arrival, not `FindingCard`**, which A5 keeps
 * presentational. Each card mounts `data-entered="false"` and flips to `"true"`
 * one `requestAnimationFrame` later: a value set in the same frame as
 * insertion does not transition, and a card that reads `true` in every sample
 * is the failure signature, not a pass. The card's own `data-state` follows the
 * same frame, which is what drives A5's verification rule and the delayed
 * badge — entrance 320ms, rule 900ms, badge 180ms at ~1220ms (C13).
 * **The verdict follows the proof.**
 *
 * **The stream is its own scrollport and the page stops growing at all.** Cards
 * used to prepend into a column that reached ~5,000px, so anyone who scrolled
 * to read got pushed down by every arrival. Now the reading position is pinned
 * to the pixel, and the `↑ n new` control is a *child* of the scroll container
 * — R11's mistake made correctly.
 */
export function FindingStream({
  findings,
  newestFindingId,
  running,
  connecting,
}: {
  findings: Finding[];
  newestFindingId: string | null;
  running: boolean;
  connecting: boolean;
}) {
  const { open } = useEvidence();
  const [expanded, setExpanded] = useState(false);
  const [entered, setEntered] = useState<ReadonlySet<string>>(() => new Set());
  const [newCount, setNewCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const pillShownRef = useRef(false);
  const anchorRef = useRef<{ id: string; offsetTop: number } | null>(null);
  const seenNewestRef = useRef<string | null>(null);

  /** Remember which card the reader is looking at, and where it sits. */
  function recordAnchor() {
    const el = scrollRef.current;
    if (!el) return;
    const items = [...el.querySelectorAll<HTMLElement>('.ob-fstream-item')];
    const anchor = items.find((item) => item.offsetTop >= el.scrollTop) ?? items[0];
    const id = anchor?.dataset.fid;
    anchorRef.current = id ? { id, offsetTop: anchor.offsetTop } : null;
  }

  /* Pin the reading position **to the element, not to a height delta.** The
     visible list is capped at 25, so a prepend also drops a card off the
     bottom and `scrollHeight` barely moves while the content above the reader
     grows by a whole card. Re-finding the anchor and restoring its offset is
     exact under both regimes. Native scroll anchoring is off (`overflow-anchor:
     none` in §9) so the browser and this effect can't fight over the same
     pixel.

     Only when they have actually scrolled away; at the top, cards should
     simply appear. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: the count is the trigger — the effect measures the DOM, it does not read the array.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const previous = anchorRef.current;
    if (previous && el.scrollTop > PINNED_THRESHOLD_PX) {
      const node = el.querySelector<HTMLElement>(`[data-fid="${previous.id}"]`);
      if (node) el.scrollTop += node.offsetTop - previous.offsetTop;
      setNewCount((n) => n + 1);
    }
    recordAnchor();
  }, [findings.length]);

  /* The jump pill is a *child* of the scrollport (R11 done correctly), so it
     takes flow space the frame it appears — 33px plus the column's 16px gap,
     which would otherwise read as a 49px drift the moment the reader scrolls
     away. It appears in the render *after* the arrival that caused it, so the
     pin effect above cannot see it; this is the only place that can. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: `recordAnchor` reads refs only; listing it would re-run this every render and re-add the offset.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const shown = newCount > 0;
    if (!el || shown === pillShownRef.current) return;
    pillShownRef.current = shown;
    if (shown && pillRef.current) {
      el.scrollTop += pillRef.current.getBoundingClientRect().height + STREAM_GAP_PX;
      recordAnchor();
    }
  }, [newCount]);

  /* The entrance flag, one frame after insertion. */
  useEffect(() => {
    if (!newestFindingId || newestFindingId === seenNewestRef.current) return;
    seenNewestRef.current = newestFindingId;
    const id = newestFindingId;
    const frame = requestAnimationFrame(() =>
      setEntered((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [newestFindingId]);

  function jumpToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    setNewCount(0);
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop <= PINNED_THRESHOLD_PX && newCount !== 0) setNewCount(0);
    recordAnchor();
  }

  const visible = expanded ? findings : findings.slice(0, VISIBLE_CAP);
  const hiddenCount = findings.length - visible.length;

  return (
    <div className="ob-fstream" ref={scrollRef} onScroll={onScroll}>
      {newCount > 0 && (
        <button
          type="button"
          ref={pillRef}
          className="ob-btn ob-btn-ghost ob-fstream-jump"
          onClick={jumpToTop}
        >
          {APP_CONSOLE.jump(newCount)}
        </button>
      )}

      {connecting &&
        ['a', 'b', 'c'].map((key) => (
          <div key={key} className="ob-fstream-skel" aria-hidden="true" />
        ))}

      {!connecting && findings.length === 0 && running && (
        // The re-timing cuts this from 17s to under 4s. It still needs its
        // sentence, because the sentence is what makes four seconds legible.
        <p className="ob-fstream-empty">{APP_CONSOLE.emptyStream}</p>
      )}

      <ul className="flex flex-col gap-4">
        {visible.map((finding) => {
          /* A resumed or reduced-motion render carries no `newestFindingId`, so
             nothing already on screen animates in. Anything not flagged is
             treated as having always been there. */
          const isNewest = finding.id === newestFindingId;
          const hasEntered = !isNewest || entered.has(finding.id);
          return (
            <li
              key={finding.id}
              className="ob-fstream-item"
              data-fid={finding.id}
              data-entered={hasEntered}
            >
              <FindingCard
                finding={finding}
                variant="stream"
                state={hasEntered ? 'verified' : 'pending'}
                onOpenEvidence={() => open(citationNumberForFindingId(finding.id))}
              />
            </li>
          );
        })}
      </ul>

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          className="ob-btn-bare ob-fstream-more"
          onClick={() => setExpanded(true)}
        >
          {APP_CONSOLE.earlier(hiddenCount)}
        </button>
      )}
    </div>
  );
}
