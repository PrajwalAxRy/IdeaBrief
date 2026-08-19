import type { HTMLAttributes } from 'react';

interface WellProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'compact' | 'none';
}

/** Recessed --bg-surface region inside a Card — excerpts, script blocks, media panels, NOT IN IT. */
export function Well({ padding = 'compact', className = '', ...props }: WellProps) {
  const paddingClass = padding === 'compact' ? 'p-4' : '';
  return <div className={['well', paddingClass, className].filter(Boolean).join(' ')} {...props} />;
}
