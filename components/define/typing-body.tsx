'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The per-character typewriter leaf.
 *
 * **Per-character `count` lives here and nowhere higher** (pitfalls §12). A
 * character counter one level up re-renders the whole transcript sixty-plus
 * times per turn; here it re-renders one paragraph.
 *
 * Mount it with a stable `key` per turn and **never sync it by effect** — the
 * key is the reset.
 *
 * **The callbacks are held in refs rather than depended on.** The plan's rule
 * is that `onDone` must be `useCallback`-stable or the tick effect restarts
 * every render and the turn never finishes; a ref makes that unrepresentable
 * instead of merely required, so a caller passing an inline arrow cannot
 * silently stall a turn. The controller keeps its handler stable anyway.
 *
 * Under reduced motion the whole text is set on mount, no caret renders, and
 * the turn simply appears complete.
 */
export function TypingBody({
  text,
  msPerChar,
  reduced,
  onDone,
  onGrow,
}: {
  text: string;
  msPerChar: number;
  reduced: boolean;
  onDone: () => void;
  onGrow?: () => void;
}) {
  const [count, setCount] = useState(() => (reduced ? text.length : 0));
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const onGrowRef = useRef(onGrow);
  onGrowRef.current = onGrow;

  useEffect(() => {
    if (doneRef.current) return;

    if (reduced || count >= text.length) {
      doneRef.current = true;
      onDoneRef.current();
      return;
    }

    const timer = setTimeout(() => {
      setCount((n) => n + 1);
      onGrowRef.current?.();
    }, msPerChar);
    return () => clearTimeout(timer);
  }, [count, text.length, msPerChar, reduced]);

  const shown = reduced ? text : text.slice(0, count);
  const typing = !reduced && count < text.length;

  return (
    <>
      {shown}
      {typing && <span className="ob-caret" aria-hidden="true" />}
    </>
  );
}
