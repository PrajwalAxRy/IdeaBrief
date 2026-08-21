import { citationCoverage, citedFindingIds } from '@/lib/analytics/evidence-stats';
import { getDiscarded, getEvidence, getReport } from '@/lib/db/queries';
import {
  DOMAIN_TAIL,
  EMPTY_FACETS,
  type ExplorerRecord,
  type FacetState,
  SORT_KEYS,
  applyFacets,
  domainFacets,
  facetCounts,
  isDiscard,
  parseFacetParams,
  quarterOf,
  serializeFacetParams,
  sortRecords,
} from '@/lib/explorer-facets';
import { beforeAll, describe, expect, it } from 'vitest';

const SLUG = 'sms-rebooking-4f2a';

let records: ExplorerRecord[];
let verified: ExplorerRecord[];
let citedIds: ReadonlySet<string>;
let report: Awaited<ReturnType<typeof getReport>>;
let evidence: Awaited<ReturnType<typeof getEvidence>>;

beforeAll(async () => {
  const [ev, discarded, rep] = await Promise.all([
    getEvidence(SLUG),
    getDiscarded(SLUG),
    getReport(SLUG),
  ]);
  evidence = ev;
  report = rep;
  records = [...ev, ...discarded];
  verified = ev;
  citedIds = citedFindingIds(rep);
});

const withFacets = (patch: Partial<FacetState>): FacetState => ({ ...EMPTY_FACETS, ...patch });
const filter = (patch: Partial<FacetState>) => applyFacets(records, withFacets(patch), citedIds);
const counts = (patch: Partial<FacetState>) => {
  const state = withFacets(patch);
  return facetCounts(records, state, citedIds, domainFacets(records));
};

describe('the corpus the explorer reasons over', () => {
  it('is all 65 records, 47 verified and 18 discarded', () => {
    expect(records).toHaveLength(65);
    expect(verified).toHaveLength(47);
    expect(records.filter(isDiscard)).toHaveLength(18);
  });
});

describe('param round-trip', () => {
  it('round-trips losslessly and omits empty groups and the default sort', () => {
    const state = withFacets({ dim: ['MONEY'], stance: ['challenges'], q: ['2025Q3'] });
    const query = serializeFacetParams(state);
    expect(query).toBe('dim=MONEY&stance=challenges&q=2025Q3');
    expect(parseFacetParams(Object.fromEntries(new URLSearchParams(query)))).toEqual(state);
  });

  it('omits sort when newest and carries it otherwise', () => {
    expect(serializeFacetParams(EMPTY_FACETS)).toBe('');
    expect(serializeFacetParams(withFacets({ sort: 'oldest' }))).toBe('sort=oldest');
  });

  it('drops unknown values silently rather than throwing — a hand-edited URL must degrade', () => {
    const parsed = parseFacetParams({
      dim: 'MONEY,NOT_A_DIMENSION',
      stance: 'supports,hostile',
      status: 'verified,pending',
      cited: 'yes,maybe',
      q: '2025Q3,2025Q9,nonsense',
      sort: 'by-vibes',
    });
    expect(parsed.dim).toEqual(['MONEY']);
    expect(parsed.stance).toEqual(['supports']);
    expect(parsed.status).toEqual(['verified']);
    expect(parsed.cited).toEqual(['yes']);
    expect(parsed.q).toEqual(['2025Q3']);
    expect(parsed.sort).toBe('newest');
  });

  it('keeps an unknown domain — it matches nothing and renders the empty state', () => {
    expect(parseFacetParams({ domain: 'nowhere.example' }).domain).toEqual(['nowhere.example']);
    expect(filter({ domain: ['nowhere.example'] })).toHaveLength(0);
  });
});

describe('OR within a group, AND across groups', () => {
  it('ORs inside one group', () => {
    const money = filter({ dim: ['MONEY'] }).length;
    const problem = filter({ dim: ['PROBLEM'] }).length;
    expect(filter({ dim: ['MONEY', 'PROBLEM'] })).toHaveLength(money + problem);
  });

  it('ANDs across groups', () => {
    expect(filter({ dim: ['MONEY'], stance: ['challenges'] })).toHaveLength(3);
    expect(filter({ dim: ['MONEY'], stance: ['challenges'], q: ['2025Q3'] })).toHaveLength(2);
  });
});

describe('dimension counts span all 65 and their verified subset is the report’s', () => {
  it('is 19 · 15 · 10 · 17 · 4 over the corpus', () => {
    const { dim } = counts({});
    expect([dim.PROBLEM, dim.WHAT_EXISTS, dim.DEMAND_SIGNALS, dim.MONEY, dim.PRACTICAL]).toEqual([
      19, 15, 10, 17, 4,
    ]);
  });

  it('is 14 · 11 · 7 · 13 · 2 restricted to verified', () => {
    const { dim } = counts({ status: ['verified'] });
    expect([dim.PROBLEM, dim.WHAT_EXISTS, dim.DEMAND_SIGNALS, dim.MONEY, dim.PRACTICAL]).toEqual([
      14, 11, 7, 13, 2,
    ]);
  });

  it('shows Practical discarding as much as it kept — 4 against 2 verified', () => {
    expect(counts({}).dim.PRACTICAL).toBe(4);
    expect(counts({ status: ['verified'] }).dim.PRACTICAL).toBe(2);
  });
});

describe('a group’s counts exclude its own selection', () => {
  it('leaves DIMENSION alone and recomputes STANCE when Money is picked', () => {
    const { dim, stance } = counts({ dim: ['MONEY'] });
    expect([dim.PROBLEM, dim.WHAT_EXISTS, dim.DEMAND_SIGNALS, dim.MONEY, dim.PRACTICAL]).toEqual([
      19, 15, 10, 17, 4,
    ]);
    expect(stance.supports + stance.neutral + stance.challenges).toBe(13);
    expect(stance.challenges).toBe(3);
  });

  it('never zeroes a sibling', () => {
    const { dim } = counts({ dim: ['PRACTICAL'] });
    for (const value of Object.values(dim)) expect(value).toBeGreaterThan(0);
  });
});

describe('STANCE and IN THE REPORT exclude discards', () => {
  it('yields zero DS_ ids for every stance facet', () => {
    for (const stance of ['supports', 'neutral', 'challenges']) {
      const result = filter({ stance: [stance] });
      expect(result.length).toBeGreaterThan(0);
      expect(result.filter(isDiscard)).toHaveLength(0);
    }
  });

  it('yields zero DS_ ids for either cited facet', () => {
    for (const cited of ['yes', 'no']) {
      expect(filter({ cited: [cited] }).filter(isDiscard)).toHaveLength(0);
    }
  });

  it('does not exclude discards for any other group', () => {
    expect(filter({ dim: ['PROBLEM'] }).filter(isDiscard).length).toBeGreaterThan(0);
  });
});

describe('WHEN is derived over all 65', () => {
  it('sums to 65 and its verified subset is 9 · 12 · 13 · 13', () => {
    const all = counts({}).q;
    expect(Object.values(all).reduce((a, b) => a + b, 0)).toBe(65);

    const verifiedQuarters = counts({ status: ['verified'] }).q;
    expect([
      verifiedQuarters['2025Q1'],
      verifiedQuarters['2025Q2'],
      verifiedQuarters['2025Q3'],
      verifiedQuarters['2025Q4'],
    ]).toEqual([9, 12, 13, 13]);
  });

  it('buckets a date into its calendar quarter', () => {
    expect(quarterOf('2025-01-01')).toBe('2025Q1');
    expect(quarterOf('2025-03-31')).toBe('2025Q1');
    expect(quarterOf('2025-04-01')).toBe('2025Q2');
    expect(quarterOf('2025-12-31')).toBe('2025Q4');
  });
});

describe('DOMAIN is derived over all 65 and shows the kept/discarded collisions', () => {
  it('sums to 65 across the ranked domains and the tail', () => {
    const facets = domainFacets(records);
    expect(facets.reduce((n, f) => n + f.count, 0)).toBe(65);
    expect(facets.at(-1)?.value).toBe(DOMAIN_TAIL);
  });

  it('ranks descending by count then hostname', () => {
    const ranked = domainFacets(records).filter((f) => f.value !== DOMAIN_TAIL);
    for (let i = 1; i < ranked.length; i++) {
      const prev = ranked[i - 1];
      const cur = ranked[i];
      expect(prev.count > cur.count || (prev.count === cur.count && prev.value < cur.value)).toBe(
        true,
      );
    }
  });

  it('reads higher than the verified-only figure for the three deliberate collisions', () => {
    const all = new Map(domainFacets(records).map((f) => [f.value, f.count]));
    const kept = new Map(domainFacets(verified).map((f) => [f.value, f.count]));
    for (const domain of [
      'capterra-like.example',
      'smallpracticeforum.example',
      'openpms.example',
    ]) {
      expect((all.get(domain) ?? 0) > (kept.get(domain) ?? 0)).toBe(true);
    }
  });

  it('filters the singleton bucket through the __tail token', () => {
    const tail = domainFacets(records).find((f) => f.value === DOMAIN_TAIL);
    expect(filter({ domain: [DOMAIN_TAIL] })).toHaveLength(tail?.count ?? -1);
  });
});

describe('cited / uncited', () => {
  it('partitions the 47 verified findings exactly', () => {
    const { cited, uncited } = citationCoverage(report, evidence);
    expect(cited.size + uncited.size).toBe(47);
    const { cited: railCounts } = counts({});
    expect(railCounts.yes + railCounts.no).toBe(47);
    expect(railCounts.yes).toBe(cited.size);
  });
});

describe('every sort is a total order over the mixed 65', () => {
  it('keeps all 65 records and never ties two distinct ones', () => {
    for (const sort of SORT_KEYS) {
      const sorted = sortRecords(records, sort);
      expect(sorted).toHaveLength(65);
      expect(new Set(sorted.map((r) => r.id)).size).toBe(65);
      /* Re-sorting an already-sorted list must be a fixed point. A comparator
         returning 0 for two distinct records shows up here as a reorder. */
      expect(sortRecords(sorted, sort).map((r) => r.id)).toEqual(sorted.map((r) => r.id));
      expect(sortRecords([...records].reverse(), sort).map((r) => r.id)).toEqual(
        sorted.map((r) => r.id),
      );
    }
  });

  it('trails discards under stance and under number', () => {
    for (const sort of ['stance', 'number'] as const) {
      const ids = sortRecords(records, sort).map((r) => r.id);
      const firstDiscard = ids.findIndex((id) => id.startsWith('DS_'));
      const lastVerified = ids.map((id) => id.startsWith('EV_')).lastIndexOf(true);
      expect(firstDiscard).toBeGreaterThan(lastVerified);
    }
  });

  it('orders trailing discards by id ascending', () => {
    for (const sort of ['stance', 'number'] as const) {
      const discards = sortRecords(records, sort)
        .filter(isDiscard)
        .map((r) => r.id);
      expect(discards).toEqual([...discards].sort());
    }
  });
});
