'use client';

import { Copy } from 'lucide-react';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

interface CopyButtonProps {
  /** Called on click to produce the exact plain text to write — never HTML, never markdown. */
  getText?: () => string;
  /**
   * Plain-string alternative to `getText`, for callers that are themselves
   * Server Components (e.g. `CopyLinkButton`) — a function prop can't cross
   * the server/client boundary, but a string can. Exactly one of `getText`
   * or `text` must be given.
   */
  text?: string;
  label?: string;
  variant?: 'button' | 'text';
  className?: string;
  /** Element to select in the DOM as the clipboard-write fallback on failure. */
  sourceRef?: RefObject<HTMLElement | null>;
}

/**
 * The product's only success-feedback mechanism — there are no toasts anywhere.
 * Behaviour contract: plain text only, label swap for exactly 2000ms, reset
 * (not stack) the timer on rapid clicks, "Press ⌘C" + DOM selection on failure.
 */
export function CopyButton({
  getText,
  text,
  label = 'Copy',
  variant = 'text',
  className = '',
  sourceRef,
}: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleClick() {
    const resolvedText = getText ? getText() : (text ?? '');
    try {
      await navigator.clipboard.writeText(resolvedText);
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

  const baseClass = variant === 'button' ? 'btn btn-secondary btn-sm' : 'text-action';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      {state === 'idle' && (
        <>
          <Copy size={14} />
          {label}
        </>
      )}
      {state === 'copied' && '✓ Copied'}
      {state === 'failed' && 'Press ⌘C'}
    </button>
  );
}
