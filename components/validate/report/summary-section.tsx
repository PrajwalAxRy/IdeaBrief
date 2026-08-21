import { CitationHint } from '@/components/validate/evidence/citation-hint';
import { renderCitedText } from '@/components/validate/evidence/cited-text';
import { assertEverySentenceCited } from '@/lib/citations';
import type { CitedText } from '@/lib/schemas/report';

/**
 * §02 — the whole report in twenty seconds.
 *
 * **Every sentence carries at least one citation, and uncited prose here is a
 * bug.** `CitedTextSchema.refine()` guarantees the bidirectional agreement
 * between markers and the declared array, but not *per sentence*, so this calls
 * `assertEverySentenceCited` — a fixture-authoring guard that throws in
 * development and costs nothing in production.
 */
export function SummarySection({ summary }: { summary: CitedText }) {
  assertEverySentenceCited(summary.text);

  return (
    <>
      {/* `.ob-lead` — 21px, muted. Borrowed from A2, not redeclared in §10. */}
      <p className="ob-lead">{renderCitedText(summary.text)}</p>
      {/* A normal-flow sibling *after* the paragraph, never absolutely
          positioned under a chip mid-sentence (A5). */}
      <CitationHint />
    </>
  );
}
