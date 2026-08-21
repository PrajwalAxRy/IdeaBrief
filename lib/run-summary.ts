import { formatDomain } from './format';
import type { DiscardedFinding, Finding } from './schemas/evidence';
import type { RunEvent } from './schemas/run';

export interface RunSummary {
  query_count: number;
  pages_fetched: number;
  /** Distinct hostnames across the verified corpus — how few places the
   *  evidence actually comes from. `DomainConcentration` draws the breakdown;
   *  this is the headline number. */
  domains_count: number;
  verified_count: number;
  discarded_count: number;
  earliest_source_date: string;
  latest_source_date: string;
}

/**
 * Derived from already-validated fixture data (evidence + the SSE event log +
 * the discard corpus), not raw fixture content itself — so it doesn't need its
 * own Zod schema at this seam, just the arithmetic. Meta Line values must be
 * real, never decorative (02 §2.5).
 */
export function computeRunSummary(
  evidence: Finding[],
  events: RunEvent[],
  discarded: DiscardedFinding[],
): RunSummary {
  const verified = evidence.filter((finding) => finding.verified);
  const pages = new Set(verified.map((finding) => finding.source_url));
  const domains = new Set(verified.map((finding) => formatDomain(finding.source_url)));
  const queryCount = events.filter((event) => event.type === 'query.start').length;
  const dates = verified.map((finding) => finding.source_date).sort();

  /* The event log and the discard corpus are two views of the same 18 records;
     if they disagree, one of them is wrong and the console would silently
     display the other. */
  const lastDiscard = events.filter((event) => event.type === 'finding.discarded').at(-1);
  const streamedCount = lastDiscard?.type === 'finding.discarded' ? lastDiscard.count : 0;
  if (streamedCount !== discarded.length) {
    throw new Error(
      `Discard corpus has ${discarded.length} records but the event log ends at ${streamedCount}.`,
    );
  }

  return {
    query_count: queryCount,
    pages_fetched: pages.size,
    domains_count: domains.size,
    verified_count: verified.length,
    discarded_count: discarded.length,
    earliest_source_date: dates[0],
    latest_source_date: dates[dates.length - 1],
  };
}
