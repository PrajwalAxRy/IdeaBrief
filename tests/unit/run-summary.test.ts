import { discardedFixture } from '@/lib/fixtures/discarded';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { runEventsFixture } from '@/lib/fixtures/run-events';
import { computeRunSummary } from '@/lib/run-summary';
import { describe, expect, it } from 'vitest';

describe('run-summary — Meta Line values must be real, never decorative', () => {
  it('matches the fixture target volumes: 19 queries, 31 pages, 47 verified, 18 discarded', () => {
    const summary = computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture);
    expect(summary.query_count).toBe(19);
    expect(summary.pages_fetched).toBe(31);
    expect(summary.verified_count).toBe(47);
    expect(summary.discarded_count).toBe(18);
  });

  it('pages_fetched counts distinct source URLs, not finding count', () => {
    const withDuplicateSource = [...evidenceFixture, { ...evidenceFixture[0], id: 'EV_99' }];
    const summary = computeRunSummary(withDuplicateSource, runEventsFixture, discardedFixture);
    expect(summary.verified_count).toBe(48);
    expect(summary.pages_fetched).toBe(31);
  });

  it('counts 29 distinct domains across 31 pages', () => {
    const summary = computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture);
    expect(summary.domains_count).toBe(29);
  });

  it('carries the corpus date range, 2025-01-08 to 2025-12-04', () => {
    const summary = computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture);
    expect(summary.earliest_source_date).toBe('2025-01-08');
    expect(summary.latest_source_date).toBe('2025-12-04');
  });

  it('refuses a discard corpus that disagrees with the event log', () => {
    expect(() =>
      computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture.slice(0, 17)),
    ).toThrow(/17 records but the event log ends at 18/);
  });
});
