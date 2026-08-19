import { evidenceFixture } from '@/lib/fixtures/evidence';
import type { Finding } from '@/lib/schemas/evidence';
import { countsByDimension, isThinEvidence } from '@/lib/thin-evidence';
import { describe, expect, it } from 'vitest';

describe('thin-evidence trigger rule — the one place it lives', () => {
  it('the primary fixture run is not thin, despite Practical being thin on its own', () => {
    const counts = countsByDimension(evidenceFixture);
    expect(counts.PRACTICAL).toBe(2);
    expect(isThinEvidence(evidenceFixture)).toBe(false);
  });

  it('triggers when total findings fall below 12', () => {
    const sparse = evidenceFixture.slice(0, 10);
    expect(isThinEvidence(sparse)).toBe(true);
  });

  it('triggers when 3 or more dimensions have fewer than 2 findings, even if the total is high', () => {
    const findings: Finding[] = [
      ...evidenceFixture.filter((f) => f.dimension === 'PROBLEM'),
      { ...evidenceFixture[0], id: 'EV_90', dimension: 'WHAT_EXISTS' },
      { ...evidenceFixture[0], id: 'EV_91', dimension: 'MONEY' },
    ];
    // PROBLEM has 14, WHAT_EXISTS has 1, MONEY has 1, DEMAND_SIGNALS has 0, PRACTICAL has 0
    // -> 3 dimensions below 2, total is comfortably above 12.
    expect(findings.length).toBeGreaterThanOrEqual(12);
    expect(isThinEvidence(findings)).toBe(true);
  });

  it('ignores unverified findings when counting', () => {
    const withUnverified: Finding[] = [
      ...evidenceFixture,
      { ...evidenceFixture[0], id: 'EV_99', verified: false },
    ];
    expect(countsByDimension(withUnverified)[evidenceFixture[0].dimension]).toBe(
      countsByDimension(evidenceFixture)[evidenceFixture[0].dimension],
    );
  });
});
