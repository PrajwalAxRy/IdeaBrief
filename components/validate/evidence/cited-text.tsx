import type { ReactNode } from 'react';
import { CitationChip } from './citation-chip';

const CITATION_PATTERN = /\[(\d+)\]/g;

/**
 * Splits prose containing `[n]` markers into an array of plain text and
 * `CitationChip` nodes.
 *
 * **Preserve the plain-function pattern.** It is a function and not a
 * component precisely so a Server Component can splice `CitationChip` — a
 * client leaf — into its own output without becoming a Client Component
 * itself. That single mechanism is what keeps the entire report out of the
 * client bundle. If it is ever converted to a `<CitedText>` component it must
 * remain a server component.
 *
 * The `firstChipGetsHint` option is gone: `CitationHint` reads its own
 * dismissal from context and callers render it as a sibling of the paragraph,
 * so no flag has to be threaded down to the first chip.
 */
export function renderCitedText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CITATION_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));

    const n = Number(match[1]);
    nodes.push(<CitationChip key={`citation-${index}-${n}`} n={n} />);
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
