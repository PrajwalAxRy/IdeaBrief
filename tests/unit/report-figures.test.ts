import { assertFigureSourced } from '@/components/figures/figure';
import { calloutDisplay } from '@/components/validate/report/report-figures';
import {
  citationCoverage,
  citedFindingIds,
  deriveEvidenceState,
  stanceByDimension,
  stanceOverall,
} from '@/lib/analytics/evidence-stats';
import {
  capabilityMatrix,
  numberCallouts,
  priceLadder,
  roiGap,
  runFunnel,
} from '@/lib/analytics/report-figures';
import { discardedFixture } from '@/lib/fixtures/discarded';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { reportFixture } from '@/lib/fixtures/report';
import { runEventsFixture } from '@/lib/fixtures/run-events';
import { computeRunSummary } from '@/lib/run-summary';
import { DIMENSIONS } from '@/lib/schemas/evidence';
import { describe, expect, it } from 'vitest';

const summary = computeRunSummary(evidenceFixture, runEventsFixture, discardedFixture);

describe('report-figures', () => {
  it('priceLadder is four rungs ascending — a band, two points and a threshold', () => {
    const rungs = priceLadder(evidenceFixture);
    expect(rungs).toHaveLength(4);
    expect(rungs.map((r) => r.form)).toEqual(['band', 'point', 'point', 'threshold']);

    const [band, low, high, threshold] = rungs;
    expect(band).toMatchObject({ form: 'band', low: 150, high: 250, citations: [26] });
    expect(low).toMatchObject({ form: 'point', value: 199, citations: [34] });
    expect(high).toMatchObject({ form: 'point', value: 299, citations: [33] });
    expect(threshold).toMatchObject({ form: 'threshold', value: 300, citations: [42] });
  });

  it('every ladder rung carries at least one citation', () => {
    for (const rung of priceLadder(evidenceFixture)) {
      expect(rung.citations.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('roiGap pairs $2,000-4,000 against $199-299 for 10x to 20x', () => {
    const gap = roiGap(evidenceFixture);
    expect(gap.lostLow).toBe(2000);
    expect(gap.lostHigh).toBe(4000);
    expect(gap.costLow).toBe(199);
    expect(gap.costHigh).toBe(299);
    expect(gap.ratioLow).toBeCloseTo(10.05, 2);
    expect(gap.ratioHigh).toBeCloseTo(20.1, 2);
  });

  it('roiGap never sources a tool price to EV_26', () => {
    /* EV_26 is a willingness to pay. Using it as a tool price is what produced
       the $3,000 vs $200, 15x figure an audit found — numbers that appear in
       no finding anywhere in the corpus. */
    const gap = roiGap(evidenceFixture);
    expect(gap.costLow).not.toBe(150);
    expect(gap.costHigh).not.toBe(250);
    expect(gap.ratioLow).not.toBeCloseTo(13.3, 1);
  });

  it('capabilityMatrix returns five keys, three competitors and an idea column with no levels', () => {
    const model = capabilityMatrix(reportFixture);
    expect(model.capabilities).toHaveLength(5);
    expect(model.competitors).toHaveLength(3);
    expect(model.idea).toHaveLength(5);
    for (const cell of model.idea) {
      expect(cell).not.toHaveProperty('level');
      expect(typeof cell.claimed).toBe('boolean');
    }
    expect(model.idea.filter((c) => c.claimed).map((c) => c.key)).toEqual([
      'waitlist',
      'auto_rebook',
      'pms_integration',
    ]);
    expect(model.citations).toEqual([...model.citations].sort((a, b) => a - b));
  });

  it('every non-unknown competitor cell carries a citation', () => {
    for (const competitor of capabilityMatrix(reportFixture).competitors) {
      for (const cell of competitor.cells) {
        if (cell.level === 'unknown') continue;
        expect(cell.citations.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('numberCallouts returns exactly the nine flagged facts', () => {
    const all = DIMENSIONS.flatMap((dimension) => numberCallouts(evidenceFixture, dimension));
    expect(all.map((c) => c.findingId)).toEqual([
      'EV_02',
      'EV_07',
      'EV_09',
      'EV_19',
      'EV_20',
      'EV_24',
      'EV_32',
      'EV_46',
      'EV_47',
    ]);
    expect(all.map((c) => c.form)).toEqual([
      'single',
      'transition',
      'single',
      'of',
      'single',
      'single',
      'compound',
      'band',
      'single',
    ]);
    /* `emphasis` is a NumberCallout prop, spent once on `0 of 9`. It is not a
       field on this model. */
    for (const callout of all) expect(callout).not.toHaveProperty('emphasis');
  });

  it('runFunnel shares are proportional to the largest segment, not to a total', () => {
    const rows = runFunnel(summary);
    expect(rows.map((r) => r.value)).toEqual([19, 31, 47, 18]);
    expect(rows.map((r) => r.label)).toEqual(['QUERIES', 'PAGES', 'VERIFIED', 'DISCARDED']);
    expect(rows[2].share).toBe(1);
    expect(rows[0].share).toBeCloseTo(19 / 47, 6);
    expect(rows[3].share).toBeCloseTo(18 / 47, 6);
    /* Nothing here sums to anything. 47/65 looks like a pass rate. */
    expect(rows.reduce((sum, r) => sum + r.share, 0)).not.toBeCloseTo(1, 3);
  });

  /* ------------------------------------------------------------- A10 --- */

  it('every rendered figure value equals C11, through the display formatter', () => {
    const shown = (dimension: Parameters<typeof numberCallouts>[1]) =>
      numberCallouts(evidenceFixture, dimension).map((model) => {
        const d = calloutDisplay(model);
        return d.value + (d.unit ? ` ${d.unit}` : '');
      });

    expect(shown('PROBLEM')).toEqual(['14.2%', '16.8% → 9.1%', '18%']);
    expect(shown('WHAT_EXISTS')).toEqual(['0 of 9', '30 s', '14']);
    expect(shown('DEMAND_SIGNALS')).toEqual(['130,000']);
    expect(shown('PRACTICAL')).toEqual(['2–3 weeks', '100/min']);

    /* The compound callout carries its second fact as a secondary line rather
       than a second numeral. */
    const market = numberCallouts(evidenceFixture, 'DEMAND_SIGNALS')[0];
    expect(calloutDisplay(market).secondary).toContain('70%');
  });

  it('never produces the substituted ROI numbers an audit once found', () => {
    const gap = roiGap(evidenceFixture);
    const printed = [
      `$${gap.lostLow}`,
      `$${gap.lostHigh}`,
      `$${gap.costLow}`,
      `$${gap.costHigh}`,
      `${Math.round(gap.ratioLow)}`,
      `${Math.round(gap.ratioHigh)}`,
    ].join(' ');
    for (const wrong of ['$3,000', '$3000', '$200 ', '15×']) {
      expect(printed).not.toContain(wrong);
    }
    expect(Math.round(gap.ratioLow)).toBe(10);
    expect(Math.round(gap.ratioHigh)).toBe(20);
  });

  it('stanceOverall sums to 47 and is 25/15/7', () => {
    const overall = stanceOverall(evidenceFixture);
    expect(overall).toEqual({ supports: 25, neutral: 15, contests: 7 });
    expect(overall.supports + overall.neutral + overall.contests).toBe(evidenceFixture.length);
  });

  it('each stanceByDimension row sums to that dimension meta.count', () => {
    const byDimension = stanceByDimension(evidenceFixture);
    for (const dimension of DIMENSIONS) {
      const row = byDimension[dimension];
      expect(row.supports + row.neutral + row.contests).toBe(
        reportFixture.dimensions[dimension].meta.count,
      );
    }
  });

  it('deriveEvidenceState puts each dimension where C10 thresholds imply', () => {
    const state = deriveEvidenceState(reportFixture, evidenceFixture);
    expect(state.strong).toEqual(['PROBLEM', 'WHAT_EXISTS', 'MONEY']);
    expect(state.thin).toEqual(['PRACTICAL']);
    expect(state.contested).toEqual(['PROBLEM', 'MONEY']);
    /* DEMAND_SIGNALS lands in none of the three, and that is the honest result
       — 1 contest in 7 is 0.143, six thousandths under the ratio threshold. */
    for (const list of [state.strong, state.thin, state.contested]) {
      expect(list).not.toContain('DEMAND_SIGNALS');
    }
  });

  it('the citation split is 24 cited / 23 uncited', () => {
    const { cited, uncited } = citationCoverage(reportFixture, evidenceFixture);
    expect(citedFindingIds(reportFixture).size).toBe(24);
    expect(cited.size).toBe(24);
    expect(uncited.size).toBe(23);
    expect(cited.size + uncited.size).toBe(evidenceFixture.length);
  });

  it('every figure the report builds is sourced', () => {
    /* The three corpus-level marks use the `source` escape hatch; every other
       figure declares `[n]` citations. Both satisfy the assertion; neither
       empty does. */
    expect(() => assertFigureSourced({ caption: 'X', citations: [], source: undefined })).toThrow();
    expect(() =>
      assertFigureSourced({ caption: 'X', citations: [26], source: undefined }),
    ).not.toThrow();
    expect(() =>
      assertFigureSourced({ caption: 'X', citations: [], source: { label: 'A', href: '/b' } }),
    ).not.toThrow();
  });

  it('every citation a report figure declares resolves in the corpus', () => {
    const ids = new Set(evidenceFixture.map((f) => Number(f.id.replace('EV_', ''))));
    const declared = [
      ...priceLadder(evidenceFixture).flatMap((rung) => rung.citations),
      ...capabilityMatrix(reportFixture).citations,
      ...DIMENSIONS.flatMap((d) => numberCallouts(evidenceFixture, d).map((m) => m.citation)),
      33,
      34,
      41,
    ];
    expect(declared.length).toBeGreaterThan(0);
    for (const n of declared) expect(ids.has(n)).toBe(true);
  });
});
