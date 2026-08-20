'use client';

import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/text-area';
import type { KeyboardEvent, Ref } from 'react';
import { useState } from 'react';
import { DontKnowButton } from './dont-know-button';

interface ComposerProps {
  /** Visual-only — the textarea itself never actually disables, so keystrokes are never lost. */
  streaming?: boolean;
  onSend: (text: string) => void;
  onDontKnow: () => void;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * The message input: `TextArea` + `DontKnowButton` + `Send`. Buffers
 * keystrokes while the AI streams — `streaming` only toggles a shimmer look,
 * the field stays fully typeable throughout.
 */
export function Composer({ streaming = false, onSend, onDontKnow, ref }: ComposerProps) {
  const [value, setValue] = useState('');

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={['composer', streaming ? 'composer--streaming' : ''].filter(Boolean).join(' ')}>
      <TextArea
        ref={ref}
        value={value}
        minRows={2}
        placeholder="Type your answer…"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between pt-3">
        <DontKnowButton onClick={onDontKnow} />
        <Button size="sm" onClick={handleSend} disabled={!value.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
