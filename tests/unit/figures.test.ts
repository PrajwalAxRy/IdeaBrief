import { assertFigureSourced } from '@/components/figures/figure';
import { barShare } from '@/components/figures/gap-bar';
import { ladderGutters } from '@/components/figures/value-ladder';
import { priceLadder } from '@/lib/analytics/report-figures';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { describe, expect, it } from 'vitest';

describe('assertFigureSourced — an uncited mark is a bug now, not later', () => {
  it('throws when a figure has neither citations nor a source', () => {
    expect(() =>
      assertFigureSourced({ caption: 'THE PRICE LADDER', citations: [], source: undefined }),
    ).toThrow(/unsourced/);
  });

  it('throws when both are absent entirely', () => {
    expect(() => assertFigureSourced({ caption: 'STANCE' })).toThrow(
      /Figure "STANCE" is unsourced/,
    );
  });

  it('passes with citations alone', () => {
    expect(() =>
      assertFigureSourced({ caption: 'THE PRICE LADDER', citations: [26] }),
    ).not.toThrow();
  });

  it('passes with a corpus source alone', () => {
    expect(() =>
      assertFigureSourced({
        caption: 'STANCE',
        source: { label: 'ALL 47 FINDINGS', href: '/r/x/sources' },
      }),
    ).not.toThrow();
  });
});

describe('figure geometry', () => {
  it('barShare is value over max, and zero-safe', () => {
    expect(barShare(19, 47)).toBeCloseTo(19 / 47, 6);
    expect(barShare(47, 47)).toBe(1);
    expect(barShare(5, 0)).toBe(0);
  });

  it('ladderGutters puts thresholds right and everything else left', () => {
    const rungs = priceLadder(evidenceFixture);
    expect(ladderGutters(rungs)).toEqual(['left', 'left', 'left', 'right']);
  });

  it('the threshold is the only right-gutter rung, which is what keeps $299 and ~$300 apart', () => {
    const rungs = priceLadder(evidenceFixture);
    const gutters = ladderGutters(rungs);
    const rightIndexes = gutters.flatMap((g, i) => (g === 'right' ? [i] : []));
    expect(rightIndexes).toHaveLength(1);
    expect(rungs[rightIndexes[0]].form).toBe('threshold');
  });
});
