import { SectionLabel } from '@/components/ui/section-label';
import type { QueryRow } from '@/lib/run-stream-reducer';
import { useEffect, useRef, useState } from 'react';

const VISIBLE_COUNT = 5;

const GLYPH: Record<QueryRow['state'], string> = {
  queued: '○',
  running: '◐',
  done: '✓',
};

/**
 * The actual generated search queries, as they run — no `'use client'` of
 * its own; it's only ever rendered inside `RunConsole`'s already-client
 * subtree, so `onToggleExpand` (owned by the parent) attaches safely here.
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
  const [announcement, setAnnouncement] = useState('');
  const doneCountRef = useRef(0);

  useEffect(() => {
    const done = queries.filter((row) => row.state === 'done');
    if (done.length > doneCountRef.current) {
      const justDone = done.at(-1);
      if (justDone) setAnnouncement(`Searched: ${justDone.query}`);
    }
    doneCountRef.current = done.length;
  }, [queries]);

  const visible = expanded ? queries : queries.slice(0, VISIBLE_COUNT);
  const remaining = queries.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Queries</SectionLabel>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      <ul className="flex flex-col gap-2">
        {visible.map((row) => (
          <li key={row.index} className="query-ticker-row">
            <span className={`query-glyph query-glyph--${row.state}`} aria-hidden="true">
              {GLYPH[row.state]}
            </span>
            <span className="query-text">{row.query}</span>
          </li>
        ))}
      </ul>
      {!expanded && remaining > 0 && (
        <button type="button" className="text-action" onClick={onToggleExpand}>
          … {remaining} more
        </button>
      )}
    </div>
  );
}
