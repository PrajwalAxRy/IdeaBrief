import { effectiveScope, positionOf, step } from '@/lib/evidence-scope';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { describe, expect, it } from 'vitest';

const ALL = evidenceFixture.map((finding) => finding.id);
const MONEY = evidenceFixture.filter((f) => f.dimension === 'MONEY').map((f) => f.id);

describe('evidence-scope — R13, the walk respects the filter', () => {
  it('the full corpus is 47 and the MONEY facet is 13', () => {
    expect(ALL).toHaveLength(47);
    expect(MONEY).toHaveLength(13);
  });

  it('positions within a 13-id scope, 1-based', () => {
    const { ids, filtered } = effectiveScope(MONEY, ALL, MONEY[2]);
    expect(filtered).toBe(true);
    expect(positionOf(ids, MONEY[2])).toEqual({ index: 3, total: 13 });
    expect(positionOf(ids, MONEY[0])).toEqual({ index: 1, total: 13 });
  });

  it('step returns null at both ends and never wraps', () => {
    expect(step(MONEY, MONEY[0], -1)).toBeNull();
    expect(step(MONEY, MONEY[12], 1)).toBeNull();
    expect(step(MONEY, MONEY[0], 1)).toBe(MONEY[1]);
    expect(step(MONEY, MONEY[12], -1)).toBe(MONEY[11]);
  });

  it('an out-of-scope open falls back to the full corpus, unfiltered', () => {
    /* You clicked a citation in report prose while a filter was live
       elsewhere. It must never dead-end at a disabled Prev and Next. */
    const outsider = ALL.find((id) => !MONEY.includes(id)) as string;
    const scope = effectiveScope(MONEY, ALL, outsider);
    expect(scope.ids).toEqual(ALL);
    expect(scope.filtered).toBe(false);
    expect(step(scope.ids, outsider, 1)).not.toBeNull();
  });

  it('a mixed verified/discarded scope steps through the discard with no special case', () => {
    const mixed = ['EV_02', 'DS_07', 'EV_05'];
    const { ids } = effectiveScope(mixed, ALL, 'EV_02');
    expect(step(ids, 'EV_02', 1)).toBe('DS_07');
    expect(step(ids, 'DS_07', 1)).toBe('EV_05');
    expect(positionOf(ids, 'DS_07')).toEqual({ index: 2, total: 3 });
  });

  it('setScope(null) restores the 47', () => {
    const scope = effectiveScope(null, ALL, 'EV_02');
    expect(scope.ids).toHaveLength(47);
    expect(scope.filtered).toBe(false);
  });

  it('a scope that happens to be the whole corpus is not "filtered"', () => {
    expect(effectiveScope(ALL, ALL, 'EV_02').filtered).toBe(false);
  });
});
