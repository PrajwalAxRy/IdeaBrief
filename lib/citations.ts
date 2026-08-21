import type { Finding } from './schemas/evidence';

const FINDING_ID_PATTERN = /^EV_(\d+)$/;

/**
 * The global, stable `[n]` numbering — one source of truth, read by the
 * report, the sources page, and the roadmap. Derived directly from the
 * finding's own id ("EV_12" -> citation 12) rather than array position, so
 * it can never drift if the evidence array is ever re-sorted or filtered.
 */
export function citationNumberForFindingId(id: string): number {
  const match = FINDING_ID_PATTERN.exec(id);
  if (!match) {
    throw new Error(`Invalid finding id, expected "EV_NN": ${id}`);
  }
  return Number(match[1]);
}

export function buildCitationIndex(evidence: Finding[]): Map<number, Finding> {
  return new Map(evidence.map((finding) => [citationNumberForFindingId(finding.id), finding]));
}

export function findingForCitation(evidence: Finding[], citation: number): Finding | undefined {
  return evidence.find((finding) => citationNumberForFindingId(finding.id) === citation);
}

/** Extracts every `[n]` reference from a block of prose, in order of appearance. */
export function extractCitationNumbers(text: string): number[] {
  return Array.from(text.matchAll(/\[(\d+)\]/g), (match) => Number(match[1]));
}

/**
 * Throws when any sentence in `text` carries no `[n]`.
 *
 * `CitedTextSchema.refine()` already guarantees the bidirectional agreement
 * between the markers in the prose and the declared `citations` array — but
 * **not that every sentence is cited.** A paragraph can satisfy the schema with
 * one citation on its first sentence and four uncited claims after it, which is
 * exactly the failure mode the product's whole pitch cannot survive.
 *
 * Development only: it is a fixture-authoring guard, and a production build
 * should not pay for a regex split on every render.
 */
export function assertEverySentenceCited(text: string): void {
  if (process.env.NODE_ENV === 'production') return;
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (sentence.trim().length === 0) continue;
    if (extractCitationNumbers(sentence).length === 0) {
      throw new Error(`Uncited sentence in report prose: "${sentence.trim()}"`);
    }
  }
}
