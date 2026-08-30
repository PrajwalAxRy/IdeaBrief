'use client';

import { COMPOSER_PLACEHOLDER } from '@/lib/content/trial1';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
};

/**
 * The composer, docked to the bottom of the thread pane.
 *
 * The focus ring lives on the wrapper via `:focus-within`, not on the textarea:
 * the field is borderless inside the shell, so a ring on the field alone would
 * draw a rounded rectangle floating inside a second rounded rectangle. The
 * stylesheet also has to explicitly kill the field's own `:focus-visible`
 * outline, since the global focus rule would otherwise put it back.
 *
 * Send is the page's one `.rl-btn--primary`. Everything else on screen —
 * "New idea", "Share", "Settings" — is secondary or quiet, which is what keeps
 * that budget honest.
 */
export function Composer({ value, onChange, onSend, disabled }: Props) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  /* Grow to fit, up to the max-height in the recipe. Reset to `auto` first —
     without that, scrollHeight is measured against the current height and the
     field can only ever get taller, never shrink back when text is deleted. */
  /* `value` is the trigger, not an input: the effect measures the DOM node
     rather than reading the prop, but it has to re-measure on every keystroke,
     so the dependency is load-bearing even though the body never names it. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: value is a re-measure trigger, not read
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="rl-dock">
      <div className="rl-dock__measure">
        <div className="rl-composer">
          <textarea
            ref={fieldRef}
            rows={1}
            className="rl-composer__field"
            placeholder={COMPOSER_PLACEHOLDER}
            aria-label="Message"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (canSend) onSend();
              }
            }}
          />

          <button
            type="button"
            className="rl-btn rl-btn--primary rl-btn--icon"
            aria-label="Send message"
            disabled={!canSend}
            onClick={onSend}
          >
            <ArrowUp size={17} aria-hidden="true" />
          </button>
        </div>

        {/* Earns its place: it answers the question the control just raised. */}
        <p className="rl-hint mt-2 px-1">
          Enter to send · Shift + Enter for a new line. Nothing here is saved to an account.
        </p>
      </div>
    </div>
  );
}
