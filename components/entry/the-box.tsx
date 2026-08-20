'use client';

import { createRun } from '@/app/actions/create-run';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TextArea } from '@/components/ui/text-area';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ExampleSeed } from './example-seed';

const CHAR_COUNT_THRESHOLD = 1200;
const SHORTCUT_HINT_THRESHOLD = 20;

const EXAMPLE_SEEDS = ['dental recall SMS', 'tool for freelance editors', 'something in fitness'];

/**
 * The `/` hero input cluster — owns all interactive state for the box, the
 * 3 example seeds, and the Start button, since they need to share one value
 * (decision: `TheBox` is the allowlisted client component for this cluster,
 * `ExampleSeed` stays presentational).
 */
export function TheBox() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* No autofocus on mount. The Box now sits below the hero and the three-things
     section, so focusing it on load would scroll the page past its own opening. */

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      window.sessionStorage.setItem('sv.box.draft', trimmed);
    } catch {
      // sessionStorage unavailable — the mirror is best-effort recovery only.
    }
    const slug = createRun(trimmed);
    router.push(`/r/${slug}/define`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  }

  function fillFromSeed(text: string) {
    setValue(text);
    const el = textareaRef.current;
    el?.focus();
    if (el) {
      requestAnimationFrame(() => el.setSelectionRange(text.length, text.length));
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-conversation">
        <TextArea
          ref={textareaRef}
          variant="hero"
          minRows={4}
          value={value}
          disabled={submitting}
          placeholder="I want to do something in fitness, I don't know what yet…"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between pt-2">
          <span className="meta-line">
            {value.trim().length >= SHORTCUT_HINT_THRESHOLD ? '⌘↵ to start' : ''}
          </span>
          <span className="meta-line">
            {value.length > CHAR_COUNT_THRESHOLD ? `${value.length} characters` : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleSubmit} disabled={!value.trim() || submitting}>
          {submitting ? (
            <>
              <Spinner size={16} />
              Starting…
            </>
          ) : (
            <>
              Start
              <ArrowRight size={16} />
            </>
          )}
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-action" style={{ cursor: 'default' }}>
            Try:
          </span>
          {EXAMPLE_SEEDS.map((seed) => (
            <ExampleSeed key={seed} text={seed} onClick={() => fillFromSeed(seed)} />
          ))}
        </div>
      </div>
    </div>
  );
}
