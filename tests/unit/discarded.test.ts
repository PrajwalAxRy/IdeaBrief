import { discardedFixture } from '@/lib/fixtures/discarded';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { RUN_QUERIES } from '@/lib/fixtures/queries';
import { formatDomain } from '@/lib/format';
import {
  DISCARD_REASON_LABEL,
  DiscardReasonSchema,
  DiscardedFindingSchema,
} from '@/lib/schemas/evidence';
import { describe, expect, it } from 'vitest';

const valid = discardedFixture[0];

describe('the discard corpus', () => {
  it('is 18 records, DS_01 through DS_18', () => {
    expect(discardedFixture).toHaveLength(18);
    expect(discardedFixture.map((r) => r.id)).toEqual(
      Array.from({ length: 18 }, (_, i) => `DS_${String(i + 1).padStart(2, '0')}`),
    );
  });

  it('every attempted_query is one of the 19 run queries', () => {
    const queries = new Set<string>(RUN_QUERIES);
    for (const record of discardedFixture) {
      expect(queries.has(record.attempted_query)).toBe(true);
    }
  });

  it('reason distribution is 7/5/3/3', () => {
    const count = (reason: string) =>
      discardedFixture.filter((r) => r.discard_reason === reason).length;
    expect(count('excerpt_not_found_on_page')).toBe(7);
    expect(count('page_changed_since_index')).toBe(5);
    expect(count('paywalled')).toBe(3);
    expect(count('quote_paraphrased_not_verbatim')).toBe(3);
  });

  it('dimension distribution is 5/4/3/4/2', () => {
    const count = (dimension: string) =>
      discardedFixture.filter((r) => r.dimension === dimension).length;
    expect(count('PROBLEM')).toBe(5);
    expect(count('WHAT_EXISTS')).toBe(4);
    expect(count('DEMAND_SIGNALS')).toBe(3);
    expect(count('MONEY')).toBe(4);
    expect(count('PRACTICAL')).toBe(2);
  });

  it('three domains appear in both the kept and discarded corpora', () => {
    const kept = new Set(evidenceFixture.map((f) => formatDomain(f.source_url)));
    const shared = [
      ...new Set(
        discardedFixture.map((r) => formatDomain(r.source_url)).filter((d) => kept.has(d)),
      ),
    ].sort();

    /* Without the collisions the explorer's domain facet reads as two disjoint
       corpora, which is a lie about how a real run behaves. */
    expect(shared).toEqual([
      'capterra-like.example',
      'openpms.example',
      'smallpracticeforum.example',
    ]);
  });

  it('has no text field on any record', () => {
    for (const record of discardedFixture) {
      expect(record).not.toHaveProperty('text');
    }
  });

  it('rejects a discard with an unknown reason', () => {
    const result = DiscardedFindingSchema.safeParse({
      ...valid,
      discard_reason: 'looked_wrong',
    });
    expect(result.success).toBe(false);
  });

  it('DISCARD_REASON_LABEL covers every enum value with a sentence', () => {
    for (const reason of DiscardReasonSchema.options) {
      const label = DISCARD_REASON_LABEL[reason];
      expect(label).toBeTruthy();
      expect(label.endsWith('.')).toBe(true);
    }
  });
});
