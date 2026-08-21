'use client';

import { useScrollSpy } from '@/lib/hooks/use-scroll-spy';
import type { MouseEvent } from 'react';

export interface SectionIndexItem {
  id: string;
  label: string;
  /** The mono numeral. Optional so `/style-guide` can use the same strip. */
  index?: string;
}

/**
 * A sticky **horizontal** strip, not a sidebar list.
 *
 * It used to be a vertical rail with one entry ("Dimensions") covering roughly
 * 60% of the page — an index that could not tell you where you were. Six
 * entries across the top of the reading column can, and it buys back the 240px
 * the sidebar was spending to say almost nothing.
 *
 * The active entry takes a 2px accent bottom rule — **blue job 3, live/active
 * state.** Nothing else here is blue.
 *
 * `inset` overrides where it pins; the default is the condensed header, which
 * is the same 56px `--ob-anchor-inset` budgets for.
 */
export function SectionIndex({
  items,
  inset,
}: {
  items: SectionIndexItem[];
  inset?: number;
}) {
  const [activeId, setActiveId] = useScrollSpy(items.map((item) => item.id));

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav
      className="ob-secindex"
      aria-label="Report sections"
      style={inset === undefined ? undefined : { top: `${inset}px` }}
    >
      {/* The strip's contents share the report body's measure, so the `01`
          lines up with the prose column's left edge. §10 gives this element its
          flex row — no second class. */}
      <div className="ob-report-body">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(event) => handleClick(event, item.id)}
            className="ob-secindex-link ob-meta"
            data-active={activeId === item.id}
            aria-current={activeId === item.id ? 'true' : undefined}
          >
            {item.index ? <span className="ob-em">{item.index}</span> : null}
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
