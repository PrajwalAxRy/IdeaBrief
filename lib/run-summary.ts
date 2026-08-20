import type { Finding } from './schemas/evidence';
import type { RunEvent } from './schemas/run';

export interface RunSummary {
  query_count: number;
  pages_fetched: number;
  verified_count: number;
  discarded_count: number;
}

/**
 * Derived from already-validated fixture data (evidence + the SSE event
 * log), not raw fixture content itself — so it doesn't need its own Zod
 * schema at this seam, just the arithmetic Meta Line values must be real,
 * never decorative (02 §2.5).
 */
export function computeRunSummary(evidence: Finding[], events: RunEvent[]): RunSummary {
  const verified = evidence.filter((finding) => finding.verified);
  const pages = new Set(verified.map((finding) => finding.source_url));
  const queryCount = events.filter((event) => event.type === 'query.start').length;
  const discardEvents = events.filter((event) => event.type === 'finding.discarded');
  const lastDiscard = discardEvents.at(-1);

  return {
    query_count: queryCount,
    pages_fetched: pages.size,
    verified_count: verified.length,
    discarded_count: lastDiscard?.type === 'finding.discarded' ? lastDiscard.count : 0,
  };
}
