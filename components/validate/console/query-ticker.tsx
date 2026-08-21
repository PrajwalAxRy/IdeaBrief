import { APP_CONSOLE } from '@/lib/content/app';
import type { QueryRow } from '@/lib/run-stream-reducer';
import type { CSSProperties } from 'react';

/** Rows visible in the collapsed window. 6 × 34px = 204px. */
const WINDOW_ROWS = 6;

const GLYPH: Record<QueryRow['state'], string> = {
  queued: '○',
  running: '◐',
  done: '✓',
};

/**
 * Trust device 1 — the actual generated search queries, as they run, and it
 * must actually tick.
 *
 * It used to render `queries.slice(0, 5)`: all five read `✓` within the first
 * two seconds and never changed again, while queries 6–19 ran invisibly behind
 * a one-way `… 14 more`. **The track now holds all nineteen rows** and rolls
 * under a clipped, edge-masked window that follows the frontier.
 *
 * **The roll is a compositor transform and React writes only the variable** —
 * CSS reads `--ob-ticker-offset` and owns the `transform` outright, so there is
 * exactly one owner of that property (pitfalls §4) and nothing animates a
 * height, a top or a margin (motion.md §7).
 *
 * No `'use client'` of its own: it is only ever rendered inside `RunConsole`'s
 * client subtree, so the parent's `onToggleExpand` attaches safely here.
 */
export function QueryTicker({
  queries,
  expanded,
  onToggleExpand,
}: {
  queries: QueryRow[];
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  /* The highest index that is no longer queued — the live edge of the run. The
     window sits three rows behind it so an arriving row is never at the very
     bottom of the clip when it starts running. */
  let frontier = -1;
  for (const row of queries) if (row.state !== 'queued') frontier = row.index;
  const maxStart = Math.max(0, queries.length - WINDOW_ROWS);
  const windowStart = expanded ? 0 : Math.min(Math.max(frontier - 3, 0), maxStart);

  return (
    <div className="ob-ticker" data-expanded={expanded}>
      <p className="ob-meta">{APP_CONSOLE.queriesLabel}</p>

      <div
        className="ob-ticker-view"
        style={{ ['--ob-ticker-offset' as string]: String(windowStart) } as CSSProperties}
      >
        <ul className="ob-ticker-track">
          {queries.map((row) => (
            <li key={row.index} className="ob-qrow" data-state={row.state}>
              <span className="ob-qglyph" data-state={row.state} aria-hidden="true">
                {GLYPH[row.state]}
              </span>
              {/* Ellipsised by design — the longest query overflows a 284px
                  text column. The full string stays in `title` and in the
                  aria-live summary, so nothing is lost. */}
              <span className="ob-qrow-text" title={row.query}>
                {row.query}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Two-way. The one-way `… 14 more` was the tell that the rest of the
          list was never meant to be read. */}
      <button type="button" className="ob-btn-bare self-start" onClick={onToggleExpand}>
        {expanded ? APP_CONSOLE.queriesCollapse : APP_CONSOLE.queriesExpand(queries.length)}
      </button>
    </div>
  );
}
