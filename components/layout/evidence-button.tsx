'use client';

import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { APP_CHROME } from '@/lib/content/app';

/**
 * The persistent way into the evidence layer from any run page (D16).
 *
 * **Not an `.ob-btn`** — a filled pill in the chrome would compete with the
 * page's one primary action. It is a bordered mono control with a 6px accent
 * square, and **that square is blue doing job two: verification.** It is the
 * only blue in the chrome besides the active stage's rule.
 *
 * The visible text alone (`47 VERIFIED`) reads as a statistic rather than a
 * control, so the accessible name says what pressing it does and folds in the
 * discard count the visible label deliberately leaves out.
 */
export function EvidenceButton({
  verifiedCount,
  discardedCount,
}: { verifiedCount: number; discardedCount: number }) {
  const { layer, openExplorer } = useEvidence();
  const expanded = layer.kind === 'explorer';

  return (
    <button
      type="button"
      className="ob-evidence-btn"
      onClick={openExplorer}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      aria-controls="evidence-explorer"
      aria-label={`Open evidence — ${verifiedCount} verified, ${discardedCount} discarded`}
    >
      <span className="ob-evidence-btn-mark" aria-hidden="true" />
      {verifiedCount} {APP_CHROME.evidenceButtonSuffix}
    </button>
  );
}
