import { CoverageBar } from '@/components/status/coverage-bar';
import { APP_CONSOLE } from '@/lib/content/app';
import type { QueryRow } from '@/lib/run-stream-reducer';
import {
  DIMENSIONS,
  DIMENSION_SHORT,
  type Dimension,
  type DiscardedFinding,
} from '@/lib/schemas/evidence';
import { DiscardTicker } from './discard-ticker';
import { QueryTicker } from './query-ticker';

/** Past the midpoint of a ~45s run, a dimension still on 0 or 1 has earned the tag. */
const THIN_AFTER_MS = 24_000;

/**
 * The console's sticky left rail: the query ticker, the five coverage bars,
 * and the discard ticker, separated by `.ob-rule` — reuse, not a new separator
 * class.
 *
 * It exists so `RunConsole` stops being a 200-line client component that also
 * does layout. Nothing here holds state.
 *
 * **Labels come from `DIMENSION_SHORT` (C3)**, uppercased in CSS, never as a
 * second string — which is why the label column is 84px rather than the 124px
 * the long vocabulary needed.
 */
export function ConsoleRail({
  slug,
  queries,
  expanded,
  onToggleExpand,
  counts,
  running,
  elapsedMs,
  discardedCount,
  lastDiscard,
}: {
  slug: string;
  queries: QueryRow[];
  expanded: boolean;
  onToggleExpand: () => void;
  counts: Record<Dimension, number>;
  running: boolean;
  elapsedMs: number;
  discardedCount: number;
  lastDiscard: DiscardedFinding | null;
}) {
  const max = Math.max(1, ...DIMENSIONS.map((dimension) => counts[dimension]));

  return (
    <aside className="ob-console-rail">
      <QueryTicker queries={queries} expanded={expanded} onToggleExpand={onToggleExpand} />

      <hr className="ob-rule" />

      <div className="ob-cov">
        <p className="ob-meta">{APP_CONSOLE.coverageLabel}</p>
        {DIMENSIONS.map((dimension) => (
          <CoverageBar
            key={dimension}
            label={DIMENSION_SHORT[dimension]}
            count={counts[dimension]}
            max={max}
            thin={counts[dimension] <= 1 && (!running || elapsedMs > THIN_AFTER_MS)}
          />
        ))}
      </div>

      <hr className="ob-rule" />

      <DiscardTicker slug={slug} count={discardedCount} last={lastDiscard} running={running} />
    </aside>
  );
}
