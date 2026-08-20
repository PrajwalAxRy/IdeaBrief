import type { ReactNode } from 'react';
import { CitationChip } from './citation-chip';

const CITATION_PATTERN = /\[(\d+)\]/g;

/**
 * Splits prose containing `[n]` markers into an array of plain text and
 * `CitationChip` nodes. A plain function (not a component) so Server
 * Components — `SummarySection`, `DimensionSection` (P8) — can call it
 * directly and embed the resulting `CitationChip` elements inline without
 * needing to become Client Components themselves; only `CitationChip` (one
 * of the thirteen) ships JS. Part of "the citation system, built once,
 * before any of its four consumers" (P6 goal) — not in P6's literal file
 * list, but the chip component is useless without it, so it's built now
 * alongside `EvidenceContext`/`CitationChip` rather than deferred to P8.
 */
export function renderCitedText(
  text: string,
  options?: { firstChipGetsHint?: boolean },
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let chipCount = 0;

  for (const match of text.matchAll(CITATION_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    const n = Number(match[1]);
    nodes.push(
      <CitationChip
        key={`citation-${index}-${n}`}
        n={n}
        hintCandidate={Boolean(options?.firstChipGetsHint) && chipCount === 0}
      />,
    );
    chipCount += 1;
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
