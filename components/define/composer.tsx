'use client';

import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/text-area';
import { DEFINE } from '@/lib/content/app';
import type { KeyboardEvent, ReactNode, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

interface ComposerProps {
  /** Visual only — the field never disables, so a keystroke is never dropped. */
  streaming?: boolean;
  /**
   * Returns whether the send was **accepted**. The field is cleared only on
   * `true`, so a rejected send leaves what the user typed exactly where they
   * typed it. Never losing user input is a standing product promise, and
   * `setValue('')` running unconditionally was the one line that broke it.
   */
  onSend: (text: string) => boolean;
  /** `DontKnowButton`, wired by the controller. A6 owns the slot; A7 owns what
   *  the button does. */
  dontKnow?: ReactNode;
  /**
   * An inline notice above the field. Its one consumer is the failed-send
   * state, and **it lives here rather than in the transcript on purpose**: the
   * transcript's scrollport is `aria-hidden` so a typing paragraph is never
   * read letter by letter, which would have made an error — and a focusable
   * `Retry` inside it — invisible to assistive tech and a genuine a11y bug.
   * Here it sits beside the text it is talking about, cannot be scrolled out
   * of view, and is announced normally.
   */
  notice?: ReactNode;
  /**
   * Bumped by the failed-send notice's `Retry`. The composer re-submits **its
   * own current value** — the controller never holds a copy, so a retry can
   * never append a turn while the field still shows the same words.
   */
  retrySignal?: number;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * The message input.
 *
 * **There is no primary button in this column** — the page's one
 * `.ob-btn-primary` is `ApproveButton` in the aside. Streaming is a border
 * step, not a shimmer; Obsidian has no shimmer vocabulary.
 */
export function Composer({
  streaming = false,
  onSend,
  dontKnow,
  notice,
  retrySignal = 0,
  ref,
}: ComposerProps) {
  const [value, setValue] = useState('');
  const sendRef = useRef<() => void>(undefined);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (onSend(trimmed)) setValue('');
  }
  sendRef.current = handleSend;

  /* Skips the initial render — `retrySignal` starts at 0 and only a bump means
     `Retry` was pressed. Reading it through a ref keeps the effect's dependency
     list to the signal alone, so typing a character never re-submits. */
  const firstRef = useRef(true);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `retrySignal` is a re-run trigger, not a value read in the body — the body reads `sendRef`, and listing the send itself would re-fire on every keystroke
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    sendRef.current?.();
  }, [retrySignal]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ob-define-composer">
      <div className="ob-define-composer-inner">
        {notice}
        <div className="ob-composer" data-buffering={streaming || undefined}>
          <TextArea
            ref={ref}
            variant="composer"
            value={value}
            minRows={2}
            placeholder={DEFINE.composer.placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-3">
          {dontKnow}
          <span className="ob-composer-hint ob-meta">
            {streaming ? DEFINE.composer.hintQueued : DEFINE.composer.hint}
          </span>
          <Button variant="ghost" size="sm" onClick={handleSend} disabled={!value.trim()}>
            {DEFINE.composer.send}
          </Button>
        </div>
      </div>
    </div>
  );
}
