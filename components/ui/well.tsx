import type { HTMLAttributes } from 'react';

interface WellProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'compact' | 'none';
}

/**
 * Recessed region inside a Card — excerpts, script blocks, NOT IN IT.
 * Recessed reads as *darker* here, not lighter: `--ob-void` sits below
 * `--ob-canvas` by design.
 */
export function Well({ padding = 'compact', className = '', ...props }: WellProps) {
  const paddingClass = padding === 'compact' ? 'p-4' : '';
  return (
    <div className={['ob-well', paddingClass, className].filter(Boolean).join(' ')} {...props} />
  );
}
