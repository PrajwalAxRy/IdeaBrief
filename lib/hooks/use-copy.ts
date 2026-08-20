'use client';

import { useRef, useState } from 'react';
import type { RefObject } from 'react';

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * The shared clipboard-write contract (11.5): plain text only, label swap for
 * exactly 2000ms, reset (not stack) the timer on rapid clicks, DOM-selection
 * fallback on failure. Extracted out of `CopyButton` so `ScriptBlock`'s
 * `Copy script`/`Copy all scripts` (P9) can reuse the identical behaviour
 * instead of re-implementing the timer/fallback logic.
 */
export function useCopy(sourceRef?: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
      if (sourceRef?.current) {
        const range = document.createRange();
        range.selectNodeContents(sourceRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2000);
  }

  return { state, copy };
}
