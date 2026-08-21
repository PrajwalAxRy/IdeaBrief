import { formatDomain } from './format';
import {
  DIMENSIONS,
  type Dimension,
  DimensionSchema,
  type DiscardedFinding,
  type Finding,
  type Stance,
  StanceSchema,
} from './schemas/evidence';

/**
 * The explorer's facet arithmetic — pure, tested, and the only place any of it
 * happens.
 *
 * **The corpus this module reasons over is all 65 records**, verified and
 * discarded together, because the page's whole argument is that you scroll and
 * hit a struck-through row in situ. A `Record` is the union; every function
 * here takes the mixed list and narrows internally rather than asking callers
 * to pre-split it, which is how the two corpora drift apart.
 *
 * No React, no DOM, no colour, no labels. Display words come from
 * `DIMENSION_SHORT` / `STANCE_LABEL` in `lib/schemas/evidence.ts` (C3) — this
 * module returns enum values and counts and never a string a reader sees.
 */

export type ExplorerRecord = Finding | DiscardedFinding;

export function isDiscard(record: ExplorerRecord): record is DiscardedFinding {
  return record.id.startsWith('DS_');
}

/* ------------------------------------------------------------- the state --- */

export type FacetGroup = 'dim' | 'stance' | 'status' | 'cited' | 'domain' | 'q';

export type SortKey = 'newest' | 'oldest' | 'dimension' | 'stance' | 'number';

export const SORT_KEYS: readonly SortKey[] = [
  'newest',
  'oldest',
  'dimension',
  'stance',
  'number',
] as const;

export interface FacetState {
  dim: string[];
  stance: string[];
  status: string[];
  cited: string[];
  domain: string[];
  q: string[];
  sort: SortKey;
}

/** The literal token for the `One record only` domain bucket. */
export const DOMAIN_TAIL = '__tail';

export const EMPTY_FACETS: FacetState = {
  dim: [],
  stance: [],
  status: [],
  cited: [],
  domain: [],
  q: [],
  sort: 'newest',
};

export const FACET_GROUPS: readonly FacetGroup[] = [
  'dim',
  'stance',
  'status',
  'cited',
  'domain',
  'q',
] as const;

/**
 * **Selecting anything in `STANCE` or `IN THE REPORT` removes all discards.**
 * A discarded excerpt takes no position on anything and was never available to
 * cite — `DiscardedFinding` carries no `stance` field at all (C9), so this is a
 * filter rule rather than a value the explorer has to ignore.
 */
const VERIFIED_ONLY_GROUPS: readonly FacetGroup[] = ['stance', 'cited'] as const;

export function excludesDiscards(state: FacetState): boolean {
  return VERIFIED_ONLY_GROUPS.some((group) => state[group].length > 0);
}

export function activeFacetCount(state: FacetState): number {
  return FACET_GROUPS.reduce((n, group) => n + state[group].length, 0);
}

/* ------------------------------------------------------------- the quarter --- */

/** `2025-07-22` → `2025Q3`. Derived over all 65; no quarter is ever typed in. */
export function quarterOf(sourceDate: string): string {
  const year = sourceDate.slice(0, 4);
  const month = Number(sourceDate.slice(5, 7));
  return `${year}Q${Math.floor((month - 1) / 3) + 1}`;
}

/* ------------------------------------------------------------- the params --- */

const STANCE_VALUES = new Set<string>(StanceSchema.options);
const DIMENSION_VALUES = new Set<string>(DimensionSchema.options);
const STATUS_VALUES = new Set(['verified', 'discarded']);
const CITED_VALUES = new Set(['yes', 'no']);
const QUARTER_RE = /^\d{4}Q[1-4]$/;

function parseList(raw: string | undefined, keep: (value: string) => boolean): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  for (const value of raw.split(',')) {
    const trimmed = value.trim();
    if (trimmed && keep(trimmed)) seen.add(trimmed);
  }
  return [...seen];
}

/**
 * **Drops unknown values silently rather than throwing.** A hand-edited URL
 * must degrade to a view, not to a 500 — the URL is this product's whole access
 * model and a paste that 500s is a paste that loses the reader.
 *
 * `domain` is deliberately unvalidated against the corpus: an unknown host is
 * kept, matches nothing, and renders the empty state, which is the honest
 * answer to "no records from that domain".
 */
export function parseFacetParams(
  params: Record<string, string | string[] | undefined>,
): FacetState {
  const one = (key: string): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const sortRaw = one('sort');
  return {
    dim: parseList(one('dim'), (v) => DIMENSION_VALUES.has(v)),
    stance: parseList(one('stance'), (v) => STANCE_VALUES.has(v)),
    status: parseList(one('status'), (v) => STATUS_VALUES.has(v)),
    cited: parseList(one('cited'), (v) => CITED_VALUES.has(v)),
    domain: parseList(one('domain'), () => true),
    q: parseList(one('q'), (v) => QUARTER_RE.test(v)),
    sort: SORT_KEYS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : 'newest',
  };
}

/** Every group omitted when empty; `sort` omitted when `newest`. Round-trips losslessly. */
export function serializeFacetParams(state: FacetState): string {
  const parts = new URLSearchParams();
  for (const group of FACET_GROUPS) {
    if (state[group].length > 0) parts.set(group, state[group].join(','));
  }
  if (state.sort !== 'newest') parts.set('sort', state.sort);
  return parts.toString();
}

export function toggleFacet(state: FacetState, group: FacetGroup, value: string): FacetState {
  const current = state[group];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return { ...state, [group]: next };
}

/* -------------------------------------------------------------- filtering --- */

interface FilterContext {
  citedIds: ReadonlySet<string>;
  domainOf: (record: ExplorerRecord) => string;
  tailDomains: ReadonlySet<string>;
}

function matchesGroup(
  record: ExplorerRecord,
  group: FacetGroup,
  selected: string[],
  ctx: FilterContext,
): boolean {
  if (selected.length === 0) return true;

  switch (group) {
    case 'dim':
      return selected.includes(record.dimension);
    case 'stance':
      return !isDiscard(record) && selected.includes(record.stance);
    case 'status':
      return selected.includes(isDiscard(record) ? 'discarded' : 'verified');
    case 'cited':
      if (isDiscard(record)) return false;
      return selected.includes(ctx.citedIds.has(record.id) ? 'yes' : 'no');
    case 'domain': {
      const domain = ctx.domainOf(record);
      return (
        selected.includes(domain) || (selected.includes(DOMAIN_TAIL) && ctx.tailDomains.has(domain))
      );
    }
    case 'q':
      return selected.includes(quarterOf(record.source_date));
  }
}

/**
 * **OR within a group, AND across groups.** Multi-select everywhere; no group
 * has an "All" control, because zero selections in a group already means that
 * group imposes no constraint.
 *
 * `except` is how the count arithmetic works: a group's own counts are computed
 * against the set filtered by *every other* group, so selecting a facet never
 * zeroes its siblings.
 */
export function applyFacets(
  records: ExplorerRecord[],
  state: FacetState,
  citedIds: ReadonlySet<string>,
  except?: FacetGroup,
): ExplorerRecord[] {
  const ctx = contextFor(records, citedIds);
  const groups = FACET_GROUPS.filter((group) => group !== except);
  /* The verified-only rule reads the FULL state, not the reduced one: with
     `Supports` live, the STANCE group's own counts are still counts over
     verified records, so excluding discards while computing them is correct
     and re-admitting them would inflate every sibling by up to 18. */
  const dropDiscards = excludesDiscards(state);
  return records.filter((record) => {
    if (dropDiscards && isDiscard(record)) return false;
    return groups.every((group) => matchesGroup(record, group, state[group], ctx));
  });
}

function contextFor(records: ExplorerRecord[], citedIds: ReadonlySet<string>): FilterContext {
  const counts = new Map<string, number>();
  for (const record of records) {
    const domain = formatDomain(record.source_url);
    counts.set(domain, (counts.get(domain) ?? 0) + 1);
  }
  const tailDomains = new Set([...counts.entries()].filter(([, n]) => n < 2).map(([d]) => d));
  return { citedIds, domainOf: (r) => formatDomain(r.source_url), tailDomains };
}

/* ----------------------------------------------------------------- counts --- */

export interface FacetCounts {
  dim: Record<Dimension, number>;
  stance: Record<Stance, number>;
  status: { verified: number; discarded: number };
  cited: { yes: number; no: number };
  domain: Record<string, number>;
  q: Record<string, number>;
}

export interface DomainFacet {
  /** A hostname, or `DOMAIN_TAIL` for the singleton bucket. */
  value: string;
  count: number;
}

/** Ranked descending by count then hostname; everything with one record collapses into the tail. */
export function domainFacets(records: ExplorerRecord[]): DomainFacet[] {
  const counts = new Map<string, number>();
  for (const record of records) {
    const domain = formatDomain(record.source_url);
    counts.set(domain, (counts.get(domain) ?? 0) + 1);
  }
  const ranked = [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  const tail = [...counts.entries()].filter(([, n]) => n < 2).length;
  return tail > 0 ? [...ranked, { value: DOMAIN_TAIL, count: tail }] : ranked;
}

/** The quarters present in the corpus, ascending — never a typed list of four. */
export function quartersOf(records: ExplorerRecord[]): string[] {
  return [...new Set(records.map((r) => quarterOf(r.source_date)))].sort();
}

/**
 * **Every group's counts are computed against the result set filtered by every
 * group except its own.** Selecting `Money` must leave the DIMENSION counts
 * alone while STANCE and WHEN recompute over Money's records; a rail whose
 * numbers all collapse to the current selection tells you nothing about what
 * else you could pick.
 */
export function facetCounts(
  records: ExplorerRecord[],
  state: FacetState,
  citedIds: ReadonlySet<string>,
  domains: DomainFacet[],
): FacetCounts {
  const ctx = contextFor(records, citedIds);
  const scoped = (group: FacetGroup) => applyFacets(records, state, citedIds, group);

  const dimScope = scoped('dim');
  const stanceScope = scoped('stance').filter((r) => !isDiscard(r));
  const statusScope = scoped('status');
  const citedScope = scoped('cited').filter((r) => !isDiscard(r));
  const domainScope = scoped('domain');
  const quarterScope = scoped('q');

  const dim = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Record<Dimension, number>;
  for (const record of dimScope) dim[record.dimension] += 1;

  const stance: Record<Stance, number> = { supports: 0, neutral: 0, challenges: 0 };
  for (const record of stanceScope) if (!isDiscard(record)) stance[record.stance] += 1;

  const status = { verified: 0, discarded: 0 };
  for (const record of statusScope) {
    if (isDiscard(record)) status.discarded += 1;
    else status.verified += 1;
  }

  const cited = { yes: 0, no: 0 };
  for (const record of citedScope) {
    if (isDiscard(record)) continue;
    if (citedIds.has(record.id)) cited.yes += 1;
    else cited.no += 1;
  }

  const domain = Object.fromEntries(domains.map((d) => [d.value, 0])) as Record<string, number>;
  for (const record of domainScope) {
    const host = ctx.domainOf(record);
    const key = host in domain ? host : DOMAIN_TAIL;
    if (key in domain) domain[key] += 1;
  }

  const q: Record<string, number> = {};
  for (const key of quartersOf(records)) q[key] = 0;
  for (const record of quarterScope) {
    const key = quarterOf(record.source_date);
    q[key] = (q[key] ?? 0) + 1;
  }

  return { dim, stance, status, cited, domain, q };
}

/* ---------------------------------------------------------------- sorting --- */

const DIMENSION_ORDER = new Map(DIMENSIONS.map((d, i) => [d, i]));
const STANCE_ORDER = new Map<Stance, number>([
  ['supports', 0],
  ['neutral', 1],
  ['challenges', 2],
]);

/** `EV_12` → 12, `DS_07` → 7. Never a display string. */
function numericId(record: ExplorerRecord): number {
  return Number(record.id.slice(3));
}

/**
 * All five sorts are **total orders**: no comparator returns 0 for two distinct
 * records, so the list never re-orders itself between renders.
 *
 * Two sorts need a stated rule for records that lack the key, and both get one:
 * under `stance`, discards sort into their own trailing block by id (they have
 * no stance); under `number`, discards follow all 47 verified, ordered by `DS_`
 * id ascending (they have no citation number). **Neither is dropped.**
 */
export function sortRecords(records: ExplorerRecord[], sort: SortKey): ExplorerRecord[] {
  const byId = (a: ExplorerRecord, b: ExplorerRecord) => a.id.localeCompare(b.id);
  const out = [...records];

  switch (sort) {
    case 'newest':
      return out.sort((a, b) => b.source_date.localeCompare(a.source_date) || byId(a, b));
    case 'oldest':
      return out.sort((a, b) => a.source_date.localeCompare(b.source_date) || byId(a, b));
    case 'dimension':
      return out.sort(
        (a, b) =>
          (DIMENSION_ORDER.get(a.dimension) ?? 0) - (DIMENSION_ORDER.get(b.dimension) ?? 0) ||
          b.source_date.localeCompare(a.source_date) ||
          byId(a, b),
      );
    case 'stance':
      return out.sort((a, b) => {
        const aDiscard = isDiscard(a);
        const bDiscard = isDiscard(b);
        if (aDiscard !== bDiscard) return aDiscard ? 1 : -1;
        if (aDiscard || bDiscard) return byId(a, b);
        return (STANCE_ORDER.get(a.stance) ?? 0) - (STANCE_ORDER.get(b.stance) ?? 0) || byId(a, b);
      });
    case 'number':
      return out.sort((a, b) => {
        const aDiscard = isDiscard(a);
        const bDiscard = isDiscard(b);
        if (aDiscard !== bDiscard) return aDiscard ? 1 : -1;
        return numericId(a) - numericId(b);
      });
  }
}
