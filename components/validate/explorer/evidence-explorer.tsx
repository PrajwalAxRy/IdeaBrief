'use client';

import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { citationNumberForFindingId } from '@/lib/citations';
import { SOURCES } from '@/lib/content/app';
import {
  EMPTY_FACETS,
  type ExplorerRecord,
  type FacetGroup,
  type FacetState,
  SORT_KEYS,
  type SortKey,
  activeFacetCount,
  applyFacets,
  domainFacets,
  facetCounts,
  isDiscard,
  quartersOf,
  serializeFacetParams,
  sortRecords,
  toggleFacet,
} from '@/lib/explorer-facets';
import {
  DIMENSION_SHORT,
  type Dimension,
  type Discarded,
  type Evidence,
  STANCE_LABEL,
  type Stance,
} from '@/lib/schemas/evidence';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DiscardRow } from './discard-row';
import { EvidenceRow } from './evidence-row';
import { FacetRail } from './facet-rail';

/** 264ms of stagger + a 320ms row = 584ms, well inside the D17 structural band. */
const ENTRANCE_MS = 600;

/**
 * The one client island on `/sources`: facet state, URL sync, sort, derived
 * counts, and the drawer's scope.
 *
 * **`citedIds` crosses the boundary as `string[]`.** A `Set` prop is
 * serialisable in React 19, but the array is one less thing to be right about
 * and the island rebuilds the `Set` in a memo anyway.
 *
 * **Facet state lives in the URL.** A page whose entire access model is a
 * shareable URL should have a shareable filtered view. Initial state is parsed
 * on the *server* from `searchParams` and arrives as `initialFacets`, so a deep
 * link is correct on first paint with no flash; updates go out through
 * `window.history.replaceState`, not `router.replace` — no server round-trip,
 * no `useSearchParams`, therefore no `<Suspense>` boundary and no re-render
 * storm.
 *
 * **R13 — the drawer walks what is on screen.** `setScope(visibleRecordIds)`
 * runs whenever the visible set changes, and `setScope(null)` on unmount gives
 * every other route the full corpus back. The readout (`3 of 14 · FILTERED`) is
 * A5's and is not restated here.
 */
export function EvidenceExplorer({
  slug,
  evidence,
  discarded,
  citedIds,
  initialFacets,
  syncUrl = true,
}: {
  slug: string;
  evidence: Evidence;
  discarded: Discarded;
  citedIds: string[];
  initialFacets: FacetState;
  /**
   * `false` in the overlay. The dialog is a layer over whatever route you were
   * reading, and writing `?dim=MONEY` onto `/validate`'s URL from inside it
   * would corrupt the one thing this product distributes — the link.
   */
  syncUrl?: boolean;
}) {
  const { openById, setScope } = useEvidence();
  const [state, setState] = useState<FacetState>(initialFacets);
  const [entrance, setEntrance] = useState(true);
  const firstRender = useRef(true);

  const records = useMemo<ExplorerRecord[]>(
    () => [...evidence, ...discarded],
    [evidence, discarded],
  );
  const citedSet = useMemo(() => new Set(citedIds), [citedIds]);
  const domains = useMemo(() => domainFacets(records), [records]);
  const quarters = useMemo(() => quartersOf(records), [records]);

  const counts = useMemo(
    () => facetCounts(records, state, citedSet, domains),
    [records, state, citedSet, domains],
  );

  const visible = useMemo(
    () => sortRecords(applyFacets(records, state, citedSet), state.sort),
    [records, state, citedSet],
  );

  /* The URL is written, never read back — reading it would make the browser the
     source of truth for state React already holds, and the two would race. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!syncUrl) return;
    const query = serializeFacetParams(state);
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [state, syncUrl]);

  /* Nothing animates on a facet change, ever. The flag makes that deterministic
     rather than incidental — rows are keyed by record id, so React reuses the
     nodes regardless, but a keyed reuse is not a guarantee anyone can read. */
  useEffect(() => {
    const timer = setTimeout(() => setEntrance(false), ENTRANCE_MS);
    return () => clearTimeout(timer);
  }, []);

  const visibleKey = visible.map((record) => record.id).join('|');
  useEffect(() => {
    setScope(visibleKey ? visibleKey.split('|') : null);
    return () => setScope(null);
  }, [visibleKey, setScope]);

  const onToggle = useCallback((group: FacetGroup, value: string) => {
    setState((current) => toggleFacet(current, group, value));
  }, []);
  const onClear = useCallback(() => setState(EMPTY_FACETS), []);

  const activeLabels = useMemo(() => describeActive(state, domains), [state, domains]);

  return (
    <div className="ob-explorer" id="evidence-explorer-body">
      <FacetRail
        counts={counts}
        domains={domains}
        quarters={quarters}
        state={state}
        total={records.length}
        onToggle={onToggle}
        onClear={onClear}
      />

      <div className="ob-explorer-main">
        <div className="ob-sort">
          {SOURCES.sort.buttons.map((button) => (
            <button
              key={button.key}
              type="button"
              className={state.sort === button.key ? 'ob-sort-btn ob-sort-btn--on' : 'ob-sort-btn'}
              aria-pressed={state.sort === button.key}
              onClick={() =>
                setState((current) => ({
                  ...current,
                  sort: SORT_KEYS.includes(button.key as SortKey)
                    ? (button.key as SortKey)
                    : current.sort,
                }))
              }
            >
              {button.label}
            </button>
          ))}
        </div>

        <p className="ob-src-count ob-meta" aria-live="polite">
          {SOURCES.sort.count(visible.length, records.length, SOURCES.sort.countLabels[state.sort])}
        </p>

        {visible.length === 0 ? (
          <div className="ob-src-empty">
            <img
              className="ob-src-empty-media"
              src="/media/sources/zero-results.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <div className="ob-src-empty-content">
              <p className="ob-h3">{SOURCES.empty.headline}</p>
              {activeLabels ? <p className="ob-meta">{activeLabels}</p> : null}
              <button type="button" className="ob-btn-ghost" onClick={onClear}>
                {SOURCES.empty.clear}
              </button>
            </div>
          </div>
        ) : (
          <ul className="ob-src-list" data-entrance={entrance ? 'on' : 'off'}>
            {visible.map((record, index) =>
              isDiscard(record) ? (
                <DiscardRow
                  key={record.id}
                  record={record}
                  index={index}
                  onOpen={() => openById(record.id)}
                />
              ) : (
                <EvidenceRow
                  key={record.id}
                  finding={record}
                  citationNumber={citationNumberForFindingId(record.id)}
                  cited={citedSet.has(record.id)}
                  index={index}
                  onOpen={() => openById(record.id)}
                />
              ),
            )}
          </ul>
        )}

        <div className="ob-src-foot">
          <span className="ob-meta">{SOURCES.foot.label(records.length)}</span>
          <Link href={`/r/${slug}/roadmap`} className="ob-btn-primary">
            {SOURCES.foot.next}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * `MONEY · CONTESTS · Q3 2025` — the combination that emptied the list, named.
 *
 * **Every part goes through its label map** (C3). Joining the raw state would
 * print `CHALLENGES` here while the rail two inches to the left says
 * `Contests` — a fourth spelling of the vocabulary R14 already had three of,
 * surfacing in the one place a confused reader is most likely to be looking.
 * Uppercasing is the only transform this function is allowed to apply.
 */
function describeActive(state: FacetState, domains: { value: string }[]): string | null {
  if (activeFacetCount(state) === 0) return null;
  const parts = [
    ...state.dim.map((d) => DIMENSION_SHORT[d as Dimension]),
    ...state.stance.map((s) => STANCE_LABEL[s as Stance]),
    ...state.status.map((s) => SOURCES.facets.statusLabels[s as 'verified' | 'discarded']),
    ...state.cited.map((c) => SOURCES.facets.citedLabels[c as 'yes' | 'no']),
    ...state.domain.map((d) =>
      domains.some((entry) => entry.value === d) && d.startsWith('__')
        ? SOURCES.facets.domainTail
        : d,
    ),
    ...state.q.map((q) => SOURCES.facets.quarter(q)),
  ];
  return parts.join(' · ').toUpperCase();
}
