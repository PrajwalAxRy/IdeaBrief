'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS_PER_TICK = 3;
const TICK_MS = 16;

/**
 * Replays one scripted assistant reply character-by-character.
 *
 * **Nothing is generated.** `full` is a fixed string from
 * `lib/content/trial3.ts`; this hook only controls how it arrives. It stands
 * where the real Define seam would put the Vercel AI SDK's `useChat` — see
 * CLAUDE.md §"The three seams" — so a future swap replaces the source of
 * `full` and leaves every caller alone.
 *
 * `prefers-reduced-motion` resolves to the **full** text immediately and
 * settles in the same tick. That distinction matters: a JS-driven sequence
 * cannot be fixed by the CSS blanket in `audacity.css` §14, and stopping the
 * timer without settling would leave the reply frozen mid-sentence — a
 * partial state, which is worse than the animation it was meant to spare.
 *
 * `onSettled` is held in a ref so a caller can pass an inline closure without
 * restarting the run on every render.
 */
export function useScriptedReply(full: string | null, onSettled: () => void): string {
  const [typed, setTyped] = useState('');
  const settled = useRef(onSettled);
  settled.current = onSettled;

  useEffect(() => {
    if (full === null) {
      setTyped('');
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(full);
      settled.current();
      return;
    }

    setTyped('');
    let cursor = 0;
    const id = window.setInterval(() => {
      cursor = Math.min(full.length, cursor + CHARS_PER_TICK);
      setTyped(full.slice(0, cursor));
      if (cursor >= full.length) {
        window.clearInterval(id);
        settled.current();
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [full]);

  return typed;
}
