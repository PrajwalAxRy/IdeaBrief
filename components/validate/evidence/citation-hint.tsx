'use client';

import { APP_EVIDENCE } from '@/lib/content/app';
import { useEvidence } from './evidence-context';

/**
 * The one-time "these numbers are clickable" line.
 *
 * **It is no longer absolutely positioned.** It used to be
 * `position: absolute; top: calc(100% + 6px)` under a chip mid-paragraph,
 * which in a 21px/1.55 lead landed it squarely on the following line of body
 * text. It is now a normal-flow sibling rendered *after* the paragraph that
 * owns the first chip, so it cannot occlude anything.
 *
 * It reads `hintDismissed` from context and returns `null` when dismissed, so
 * no caller passes a flag — which is why `renderCitedText` lost its
 * `firstChipGetsHint` option entirely.
 */
export function CitationHint() {
  const { hintDismissed } = useEvidence();
  if (hintDismissed) return null;

  return <p className="ob-cite-hint">{APP_EVIDENCE.hint}</p>;
}
