import {
  citationCoverage,
  citedFindingIds,
  deriveEvidenceState,
  domainConcentration,
  recencyTicks,
  stanceByDimension,
  stanceOverall,
} from '@/lib/analytics/evidence-stats';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { reportFixture } from '@/lib/fixtures/report';
import { describe, expect, it } from 'vitest';

describe('evidence-stats', () => {
  it('stanceOverall is 25 supports, 15 neutral, 7 contests', () => {
    expect(stanceOverall(evidenceFixture)).toEqual({ supports: 25, neutral: 15, contests: 7 });
  });

  it('stanceByDimension puts 2 contests in PROBLEM and 3 in MONEY', () => {
    const byDimension = stanceByDimension(evidenceFixture);
    expect(byDimension.PROBLEM.contests).toBe(2);
    expect(byDimension.WHAT_EXISTS.contests).toBe(1);
    expect(byDimension.DEMAND_SIGNALS.contests).toBe(1);
    expect(byDimension.MONEY.contests).toBe(3);
    expect(byDimension.PRACTICAL.contests).toBe(0);
  });

  it('domainConcentration finds 29 domains and ranks capterra-like.example first', () => {
    const rows = domainConcentration(evidenceFixture);
    expect(rows).toHaveLength(29);
    expect(rows[0]).toEqual({ domain: 'capterra-like.example', count: 5 });
    /* Sorted by count then name, so ties are deterministic. */
    expect(rows[1].domain < rows[2].domain).toBe(true);
  });

  it('the top three domains account for 11 of 47 findings', () => {
    const rows = domainConcentration(evidenceFixture);
    const top = rows.slice(0, 3).reduce((sum, row) => sum + row.count, 0);
    expect(top).toBe(11);
    expect(rows.reduce((sum, row) => sum + row.count, 0)).toBe(47);
  });

  it('recencyTicks runs 2025-01-08 to 2025-12-04 across 47 ticks', () => {
    const ticks = recencyTicks(evidenceFixture, reportFixture);
    expect(ticks).toHaveLength(47);
    expect(ticks[0].date).toBe('2025-01-08');
    expect(ticks[ticks.length - 1].date).toBe('2025-12-04');
    for (let i = 1; i < ticks.length; i += 1) {
      expect(ticks[i - 1].date <= ticks[i].date).toBe(true);
    }
  });

  it('citationCoverage splits 47 findings into 24 cited and 23 uncited', () => {
    const { cited, uncited } = citationCoverage(reportFixture, evidenceFixture);
    expect(cited.size).toBe(24);
    expect(uncited.size).toBe(23);
    expect(cited.size + uncited.size).toBe(47);
  });

  it('citedFindingIds and citationCoverage agree', () => {
    const ids = citedFindingIds(reportFixture);
    const { cited } = citationCoverage(reportFixture, evidenceFixture);
    expect(ids.size).toBe(cited.size);
    for (const n of cited) {
      expect(ids.has(`EV_${String(n).padStart(2, '0')}`)).toBe(true);
    }
  });

  it('deriveEvidenceState is strong on PROBLEM/WHAT_EXISTS/MONEY, thin on PRACTICAL, contested on PROBLEM/MONEY', () => {
    const state = deriveEvidenceState(reportFixture, evidenceFixture);
    expect(state.strong).toEqual(['PROBLEM', 'WHAT_EXISTS', 'MONEY']);
    expect(state.thin).toEqual(['PRACTICAL']);
    expect(state.contested).toEqual(['PROBLEM', 'MONEY']);
  });

  it('leaves DEMAND_SIGNALS in no band at 1 contest in 7', () => {
    /* 1/7 = 0.143, six thousandths under the 0.15 threshold. Deliberate, and
       not to be rounded up — a band that forces all five dimensions into a
       bucket is a scorecard. */
    const state = deriveEvidenceState(reportFixture, evidenceFixture);
    expect(state.strong).not.toContain('DEMAND_SIGNALS');
    expect(state.thin).not.toContain('DEMAND_SIGNALS');
    expect(state.contested).not.toContain('DEMAND_SIGNALS');
  });
});
