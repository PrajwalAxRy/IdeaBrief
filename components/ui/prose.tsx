import type { HTMLAttributes } from 'react';

/**
 * Long-form container at the report's own measure (`--ob-report-prose`, 580px)
 * — not 68ch; the report grid owns the measure now. `CitationChip`s render as
 * ordinary children, and this is one of the two selectors the bracket
 * monopoly is scoped to (C12).
 */
export function Prose({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['ob-prose', className].filter(Boolean).join(' ')} {...props} />;
}
