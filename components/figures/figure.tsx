import { CitationChip } from '@/components/validate/evidence/citation-chip';
import { STANCE_LABEL, type Stance } from '@/lib/schemas/evidence';
import type { ReactNode } from 'react';

/**
 * The wrapper for every mark. **Nothing draws outside one, and a figure with
 * no citation is a bug.**
 *
 * The frame is a hairline, not a card: figures stacked in the report's aside
 * column read as a ruled list, which is what the system's hairline grammar
 * wants.
 */

export type FigureSource = { label: string; href: string };

type FigureProps = {
  /** Mono, uppercase. */
  caption: string;
  /** `[n]` numbers, never finding ids. */
  citations?: number[];
  /** Corpus-level provenance, for marks that summarise rather than quote. */
  source?: FigureSource;
  /** Reserved px for the mark. Always from `FIG_H` — never a literal. */
  height: number;
  /** One sans line. */
  note?: string;
  /** `'challenges'` gives the mark the contests treatment. */
  stance?: Stance;
  children: ReactNode;
  className?: string;
};

/**
 * The figure layer's equivalent of the report schema's cited-prose `.refine()`
 * — an uncited mark is a bug now, not a review comment later.
 *
 * The `source` escape hatch exists for corpus-level marks (`StanceBar`,
 * `RunFunnel`, `DomainConcentration`, `RecencyStrip`, `DimensionStrip`,
 * `FanOutMeter`) whose honest provenance is a link into the evidence rather
 * than a single `[n]`.
 */
export function assertFigureSourced(
  f: Pick<FigureProps, 'caption' | 'citations' | 'source'>,
): void {
  if (!f.citations?.length && !f.source) {
    throw new Error(
      `Figure "${f.caption}" is unsourced. Every figure links to a [n] citation or to the evidence it summarises (D6).`,
    );
  }
}

/**
 * Every mark's reserved height, by name. **A9 reserves slots against these
 * numbers, A10 measures against A9's recorded array, and A12/A13 place the
 * axis and the funnel — a literal typed into a page is the bug this list
 * exists to prevent.**
 *
 * A mark that renders taller than its declared height is a bug in the mark,
 * not in the reservation.
 */
export const FIG_H = {
  callout: 96,
  calloutLead: 128,
  calloutCompactRow: 48,
  stance: 56,
  stanceCompact: 24,
  ladder: 260,
  gap: 180,
  funnelCompact: 140,
  funnelExpanded: 190,
  matrix: 260,
  recency: 64,
  strip: 140,
  reasonBreakout: 140,
  weekAxis: 56,
  planBar: 72,
  fanOut: 48,
  /** PRACTICAL's three-row constraints group: 3 × 48 rows plus two rules and
   *  the group's own gaps. */
  constraints: 156,
  /** 13 rows plus a tail is 396 on this fixture. */
  domains(rowCount: number, tailCount?: number): number {
    return 44 + rowCount * 28 + (tailCount ? 36 : 0);
  },
} as const;

export function Figure({
  caption,
  citations,
  source,
  height,
  note,
  stance,
  children,
  className = '',
}: FigureProps) {
  if (process.env.NODE_ENV !== 'production') {
    assertFigureSourced({ caption, citations, source });
  }

  const contests = stance === 'challenges';

  return (
    <figure className={['ob-fig', className].filter(Boolean).join(' ')}>
      <p className="ob-fig-cap ob-meta">
        {caption}
        {contests ? <span className="ob-chip">{STANCE_LABEL.challenges}</span> : null}
      </p>

      {/* `min-height`, not `height`: an overflowing mark shows up as a measured
          mismatch in the exit test rather than silently clipping. `--ob-fig-h`
          is always set here and the declaration carries no fallback, because a
          fallback would hide a missing height instead of voiding the rule
          loudly. */}
      <div
        className={['ob-fig-mark', contests ? 'ob-fig-mark-contests' : '']
          .filter(Boolean)
          .join(' ')}
        style={{ ['--ob-fig-h' as string]: `${height}px` }}
      >
        {children}
      </div>

      <figcaption className="ob-fig-foot">
        {note ? <p className="ob-fig-note">{note}</p> : null}
        <p className="ob-fig-cite ob-meta">
          SOURCE{' '}
          {/* One place, and every figure in the app gains a working chip: the
              footer's `[n]` opens the same drawer the prose's `[n]` does, so a
              figure is as auditable as a sentence. */}
          {citations?.length ? citations.map((n) => <CitationChip key={n} n={n} />) : null}
          {source ? (
            <a href={source.href} className="ob-fig-cite-link">
              {source.label}
            </a>
          ) : null}
        </p>
      </figcaption>
    </figure>
  );
}
