import type { ReactNode } from 'react';

/**
 * D5's editorial band — prose at a readable measure on the left, the data layer
 * on the right, aligned to the claim it belongs to.
 *
 * **The adjacency rule, stated once: a figure sits beside the paragraph that
 * cites it, and the aside stack is ordered to match the order those citations
 * appear in that paragraph.** The unit of adjacency is the prose block: one
 * `ReportRow` per prose block, one aside stack per row, `align-items: start` so
 * the first figure's cap-height lines up with the paragraph's first line.
 *
 * **When a section has no figure the row collapses to one column and the prose
 * column does not widen.** 580px is the measure for the whole document; a
 * column that breathes in and out makes the page ragged and destroys the
 * straight left–right edge the hairlines depend on. `data-aside="none"` removes
 * the second track entirely, so there is no element in the empty half — rule 14
 * is about a rendered blank div, and this renders nothing.
 */
export function ReportRow({ aside, children }: { aside?: ReactNode; children: ReactNode }) {
  const hasAside = aside !== null && aside !== undefined && aside !== false;

  return (
    <div className="ob-report-row" data-aside={hasAside ? undefined : 'none'}>
      <div className="ob-report-prose">{children}</div>
      {hasAside ? <div className="ob-report-aside">{aside}</div> : null}
    </div>
  );
}
