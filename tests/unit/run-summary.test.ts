import { evidenceFixture } from '@/lib/fixtures/evidence';
import { runEventsFixture } from '@/lib/fixtures/run-events';
import { computeRunSummary } from '@/lib/run-summary';
import { describe, expect, it } from 'vitest';

describe('run-summary — Meta Line values must be real, never decorative', () => {
  it('matches the fixture target volumes: 19 queries, 31 pages, 47 verified, 18 discarded', () => {
    const summary = computeRunSummary(evidenceFixture, runEventsFixture);
    expect(summary.query_count).toBe(19);
    expect(summary.pages_fetched).toBe(31);
    expect(summary.verified_count).toBe(47);
    expect(summary.discarded_count).toBe(18);
  });

  it('pages_fetched counts distinct source URLs, not finding count', () => {
    const withDuplicateSource = [...evidenceFixture, { ...evidenceFixture[0], id: 'EV_99' }];
    const summary = computeRunSummary(withDuplicateSource, runEventsFixture);
    expect(summary.verified_count).toBe(48);
    expect(summary.pages_fetched).toBe(31);
  });
});
