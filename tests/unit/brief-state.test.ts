import {
  type BriefPatch,
  answeredCount,
  briefReducer,
  coreFilled,
  emptyBriefPatch,
  resolveBrief,
  unansweredCount,
  unknownKeys,
} from '@/lib/brief-state';
import { briefFixture } from '@/lib/fixtures/brief';
import { BriefSchema } from '@/lib/schemas/brief';
import { describe, expect, it, vi } from 'vitest';

const base = BriefSchema.parse(briefFixture);

/** A brief whose core fields ship `pending` — a shape the real fixture never
 *  has, kept only to prove `reveal` promotes through `resolveBrief`. */
const pending = BriefSchema.parse({
  ...base,
  one_liner: { status: 'pending', value: '' },
  product: { status: 'pending', value: '' },
  customer: { status: 'pending', value: '' },
  problem: { status: 'pending', value: '' },
  first_version_scope: { status: 'pending', value: '' },
});

const CORE_ORDER = ['one_liner', 'product', 'customer', 'problem', 'first_version_scope'] as const;

describe('brief-state — the live brief mechanic', () => {
  it('markUnknown moves a filled field into patch.unknown', () => {
    const patch = briefReducer(emptyBriefPatch(), { type: 'markUnknown', key: 'who_decides' });
    expect(patch.unknown).toContain('who_decides');
    expect(unknownKeys(base, patch)).toContain('who_decides');
    expect(resolveBrief(base, patch).who_decides.status).toBe('unknown');
  });

  it('reveal promotes a pending field to filled through resolveBrief', () => {
    const patch = briefReducer(emptyBriefPatch(), { type: 'reveal', key: 'product' });
    expect(resolveBrief(pending, patch).product.status).toBe('filled');
    expect(resolveBrief(pending, emptyBriefPatch()).product.status).toBe('pending');
  });

  it('edit records the key without storing the value in the patch', () => {
    /* R6: `valueFor()` short-circuited `one_liner` past the override map, so
       the edit reverted *and* left an `edited` marker behind. There is now
       exactly one resolver, and the value it reads lives on the patch. */
    const patch = briefReducer(emptyBriefPatch(), {
      type: 'edit',
      key: 'one_liner',
      value: 'Rebooking, but for physio',
    });
    expect(patch.edited).toEqual(['one_liner']);
    expect(patch.values.one_liner).toBe('Rebooking, but for physio');
    expect(resolveBrief(base, patch).one_liner.value).toBe('Rebooking, but for physio');
  });

  it('resolveBrief output still passes BriefSchema', () => {
    const patch = [
      { type: 'markUnknown', key: 'how_they_solve_it_today' } as const,
      { type: 'edit', key: 'one_liner', value: 'Something else' } as const,
      { type: 'reveal', key: 'how_it_makes_money' } as const,
    ].reduce(briefReducer, emptyBriefPatch());

    const resolved = resolveBrief(base, patch);
    expect(() => BriefSchema.parse(resolved)).not.toThrow();
    expect(resolved.how_they_solve_it_today.value).toEqual([]);
  });

  it('answeredCount and unansweredCount read 9 and 3 on the fixture', () => {
    const patch = emptyBriefPatch();
    expect(answeredCount(base, patch)).toBe(9);
    expect(unansweredCount(base, patch)).toBe(3);
  });

  it('coreFilled gates on reach, not on the fixture status', () => {
    /* The real fixture ships every field `filled` or `unknown`, so a gate that
       only asked "is the resolved status non-pending" was vacuously true and
       put ApproveButton on screen before a single question had been asked. */
    expect(coreFilled(base, emptyBriefPatch())).toBe(false);
    expect(coreFilled(pending, emptyBriefPatch())).toBe(false);
  });

  it('coreFilled opens once the conversation has reached all five core fields', () => {
    let patch = emptyBriefPatch();
    for (const key of CORE_ORDER.slice(0, -1)) {
      patch = briefReducer(patch, { type: 'reveal', key });
      expect(coreFilled(base, patch)).toBe(false);
    }
    patch = briefReducer(patch, { type: 'reveal', key: 'first_version_scope' });
    expect(coreFilled(base, patch)).toBe(true);
  });

  it('saying "I don’t know" is an answer and is never a blocker', () => {
    const patch = CORE_ORDER.map((key) => ({ type: 'reveal', key }) as const).reduce(
      briefReducer,
      emptyBriefPatch(),
    );
    const withUnknown = briefReducer(patch, { type: 'markUnknown', key: 'problem' });
    expect(coreFilled(base, withUnknown)).toBe(true);
    expect(coreFilled(pending, withUnknown)).toBe(true);
  });

  it('approve stamps approvedAt exactly once', () => {
    const first = briefReducer(emptyBriefPatch(), {
      type: 'approve',
      at: '2026-08-21T10:00:00.000Z',
    });
    const second = briefReducer(first, { type: 'approve', at: '2026-08-21T11:00:00.000Z' });
    expect(first.approvedAt).toBe('2026-08-21T10:00:00.000Z');
    expect(second.approvedAt).toBe('2026-08-21T10:00:00.000Z');
    expect(second).toBe(first);
  });

  it('a stored payload whose v is not 1 is discarded, not migrated', async () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
      },
    });

    const { readBriefPatch, writeBriefPatch } = await import('@/lib/brief-state');

    writeBriefPatch('demo', emptyBriefPatch());
    expect(readBriefPatch('demo')?.v).toBe(1);

    store.set('sv.brief.demo', JSON.stringify({ ...emptyBriefPatch(), v: 2 }));
    expect(readBriefPatch('demo')).toBeNull();

    /* A payload missing `values` is malformed, not an older shape. */
    store.set('sv.brief.demo', JSON.stringify({ v: 1, revealed: [], unknown: [], edited: [] }));
    expect(readBriefPatch('demo')).toBeNull();

    vi.unstubAllGlobals();
  });

  it('the reducer never mutates its input', () => {
    const before: BriefPatch = emptyBriefPatch();
    const snapshot = JSON.stringify(before);
    briefReducer(before, { type: 'markUnknown', key: 'who_decides' });
    briefReducer(before, { type: 'edit', key: 'product', value: 'x' });
    briefReducer(before, { type: 'reveal', key: 'customer' });
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});
