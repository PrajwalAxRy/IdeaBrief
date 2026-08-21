import { ConfidenceNote } from '@/components/status/confidence-note';
import { CoverageBar } from '@/components/status/coverage-bar';
import { DIMENSION_SHORT, type Dimension } from '@/lib/schemas/evidence';
import type { Confidence } from '@/lib/schemas/report';
import { CountUp } from './count-up';
import { FIG_H, Figure, type FigureSource } from './figure';
import { StanceBar } from './stance-bar';

/**
 * The 5-up state-of-the-evidence strip: per dimension a count, a `CoverageBar`,
 * a compact `StanceBar` and a `ConfidenceNote`.
 *
 * Takes the **short** dimension form — `Problem · Exists · Demand · Money ·
 * Practical`.
 *
 * `.ob-rule-v` separates the columns: the class has existed and gone unused
 * since the landing build, and this figure is what it was for.
 *
 * **Not blue** — and this is the strip where a blue "solid" would be most
 * tempting and most wrong. `ConfidenceNote` is chalk/muted/dim by A2.
 */
export type DimensionCell = {
  key: Dimension;
  count: number;
  max: number;
  supports: number;
  neutral: number;
  contests: number;
  confidence: Confidence;
  href: string;
};

export function DimensionStrip({
  cells,
  source,
  caption = 'EVIDENCE BY DIMENSION',
}: {
  cells: DimensionCell[];
  source: FigureSource;
  caption?: string;
}) {
  return (
    <Figure caption={caption} height={FIG_H.strip} source={source}>
      <div className="ob-dimstrip">
        {cells.map((cell) => (
          <a key={cell.key} href={cell.href} className="ob-dimstrip-col">
            <span className="ob-meta">{DIMENSION_SHORT[cell.key]}</span>
            <span className="ob-dimstrip-count">
              <span className="ob-fig-value">
                <CountUp value={cell.count} />
              </span>
              <span className="ob-meta">FINDINGS</span>
            </span>
            {/* The bare track: this column supplies its own label and count. */}
            <CoverageBar variant="bare" label="" count={cell.count} max={cell.max} />
            <StanceBar
              compact
              supports={cell.supports}
              neutral={cell.neutral}
              contests={cell.contests}
            />
            <ConfidenceNote confidence={cell.confidence} />
          </a>
        ))}
      </div>
    </Figure>
  );
}
