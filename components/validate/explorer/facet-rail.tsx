'use client';

import { SOURCES } from '@/lib/content/app';
import {
  DOMAIN_TAIL,
  type DomainFacet,
  type FacetCounts,
  type FacetGroup,
  type FacetState,
  activeFacetCount,
} from '@/lib/explorer-facets';
import { DIMENSIONS, DIMENSION_SHORT, STANCE_LABEL, type Stance } from '@/lib/schemas/evidence';

/** Positive to negative — the order every other stance surface uses. */
const STANCE_ORDER: readonly Stance[] = ['supports', 'neutral', 'challenges'] as const;

/**
 * Six live-counted facet groups.
 *
 * **Every facet is a `<button aria-pressed>`, not a checkbox and not a pill.**
 * Nothing but a button gets a pill radius; these are 4px `--ob-r-tag`.
 * `.ob-facet[aria-pressed='true']` is where blue lives on this page — job
 * three, live/active. Besides focus rings and the single `.ob-btn-primary` in
 * the foot, the only other accent on `/sources` is the funnel's verified bar
 * (C8).
 *
 * **Every legend is a real `<h3>`** — a filter rail is a landmark a
 * screen-reader user navigates by, and these six are C17's `/sources` h3 count.
 *
 * **Words come from `DIMENSION_SHORT` and `STANCE_LABEL`** (C3), so `challenges`
 * renders `Contests`. There is no local label map here; the deleted
 * `DIMENSION_FILTER_LABEL` in `sources-list.tsx` was the third of R14's three
 * vocabularies and it went with the file. Uppercasing is `text-transform` in
 * CSS, never a second string table.
 *
 * **A facet whose count is 0 is disabled, never hidden.** Hiding one makes the
 * rail jump and destroys the no-layout-shift guarantee — the exit test
 * re-measures the rail's height after every click for exactly this.
 */
export function FacetRail({
  counts,
  domains,
  quarters,
  state,
  total,
  onToggle,
  onClear,
}: {
  counts: FacetCounts;
  domains: DomainFacet[];
  quarters: string[];
  state: FacetState;
  total: number;
  onToggle: (group: FacetGroup, value: string) => void;
  onClear: () => void;
}) {
  const active = activeFacetCount(state) > 0;

  const facet = (group: FacetGroup, value: string, label: string, count: number) => (
    <button
      key={`${group}:${value}`}
      type="button"
      className={count === 0 ? 'ob-facet ob-facet--empty' : 'ob-facet'}
      aria-pressed={state[group].includes(value)}
      aria-disabled={count === 0 || undefined}
      disabled={count === 0}
      onClick={() => onToggle(group, value)}
    >
      <span className="ob-facet-label">{label}</span>
      <span className="ob-facet-count">{count}</span>
    </button>
  );

  const group = (
    key: FacetGroup,
    legend: string,
    children: React.ReactNode,
    note?: string,
    className?: string,
  ) => (
    <section className="ob-facet-group" id={`facet-${key}`} aria-labelledby={`facet-${key}-h`}>
      <h3 className="ob-facet-legend" id={`facet-${key}-h`}>
        {legend}
      </h3>
      <div className={className ? `ob-facet-list ${className}` : 'ob-facet-list'}>{children}</div>
      {note ? <p className="ob-facet-note ob-meta">{note}</p> : null}
    </section>
  );

  const verifiedOnlyNote = SOURCES.facets.verifiedOnlyNote;

  return (
    <nav className="ob-rail" aria-label={SOURCES.facets.railLabel}>
      {/* Fixed height, so swapping `Clear all` for the idle line shifts nothing. */}
      <div className="ob-rail-head">
        {active ? (
          <button type="button" className="ob-btn-bare ob-rail-clear" onClick={onClear}>
            {SOURCES.facets.clear}
          </button>
        ) : (
          <span className="ob-meta">{SOURCES.facets.idle(total)}</span>
        )}
      </div>

      {group(
        'dim',
        SOURCES.facets.legends.dim,
        DIMENSIONS.map((d) => facet('dim', d, DIMENSION_SHORT[d], counts.dim[d])),
      )}

      {group(
        'stance',
        SOURCES.facets.legends.stance,
        /* **Reading order, not schema order.** `StanceSchema.options` is
           `supports · challenges · neutral`, but every other stance surface in
           the system — `StanceBar`, `StanceCounts`, the dimension strip — runs
           supports → neutral → contests, positive to negative. A rail that
           ordered them differently would be a fourth ordering of a vocabulary
           R14 already had three spellings of. The words still come from
           `STANCE_LABEL`; only the sequence is stated here. */
        STANCE_ORDER.map((s) => facet('stance', s, STANCE_LABEL[s], counts.stance[s])),
        verifiedOnlyNote,
      )}

      {group(
        'status',
        SOURCES.facets.legends.status,
        (['verified', 'discarded'] as const).map((s) =>
          facet('status', s, SOURCES.facets.statusLabels[s], counts.status[s]),
        ),
      )}

      {group(
        'cited',
        SOURCES.facets.legends.cited,
        (['yes', 'no'] as const).map((c) =>
          facet('cited', c, SOURCES.facets.citedLabels[c], counts.cited[c]),
        ),
        verifiedOnlyNote,
      )}

      {/* A1 authored three deliberate kept/discarded domain collisions precisely
          so this facet shows a domain with both — so those three read higher
          here than their bar in the figure beside it, and the delta is the
          discards. Hence the note. */}
      {group(
        'domain',
        SOURCES.facets.legends.domain,
        domains.map((d) =>
          facet(
            'domain',
            d.value,
            d.value === DOMAIN_TAIL ? SOURCES.facets.domainTail : d.value,
            counts.domain[d.value] ?? 0,
          ),
        ),
        SOURCES.facets.domainNote,
        'ob-facet-list--scroll',
      )}

      {group(
        'q',
        SOURCES.facets.legends.q,
        quarters.map((q) => facet('q', q, SOURCES.facets.quarter(q), counts.q[q] ?? 0)),
      )}
    </nav>
  );
}
