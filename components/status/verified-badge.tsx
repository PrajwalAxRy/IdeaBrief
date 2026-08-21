import { Check } from 'lucide-react';

/**
 * `✓ VERIFIED` — the trust marker, on every finding, everywhere.
 *
 * Reuses the landing page's `.ob-chip .ob-chip-verified` verbatim. **Accent is
 * legal here: this is the verification job, and it is the reason that job
 * exists.**
 *
 * A2 ships the static appearance only. A5 drives the pending/resolved opacity
 * states; A8 owns the timing — the badge fades in at **+180ms after the
 * verification rule finishes drawing**, never before it (C13). Verification is
 * not a label that appears on a card; it is a thing that visibly finishes.
 */
export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span className={['ob-chip ob-chip-verified', className].filter(Boolean).join(' ')}>
      <Check size={12} aria-hidden="true" />
      VERIFIED
    </span>
  );
}
