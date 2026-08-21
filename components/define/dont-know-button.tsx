'use client';

import { DEFINE } from '@/lib/content/app';

/**
 * The one-tap "I don't know" — present from the first question, always, and
 * **functional** (R5). It used to send a string into a transcript while the
 * panel's `3 unknown` was read from a static fixture regardless: the product's
 * headline mechanic did nothing.
 *
 * Before the first AI turn completes there is no field to mark, so it is
 * `aria-disabled` with a no-op handler — **still focusable**, with the reason
 * announced from a hidden span rather than left to be guessed at.
 */
export function DontKnowButton({
  onClick,
  available = true,
}: { onClick: () => void; available?: boolean }) {
  return (
    <>
      <button
        type="button"
        className="ob-btn ob-btn-ghost ob-btn-sm"
        aria-disabled={available ? undefined : true}
        aria-describedby={available ? undefined : 'dont-know-unavailable'}
        onClick={available ? onClick : undefined}
      >
        {DEFINE.composer.dontKnow}
      </button>
      {!available && (
        <span id="dont-know-unavailable" className="sr-only">
          Available once the first question is asked.
        </span>
      )}
    </>
  );
}
