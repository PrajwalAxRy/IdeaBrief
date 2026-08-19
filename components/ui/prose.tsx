import type { HTMLAttributes } from 'react';

/** Styled long-form container: 68ch measure, relaxed leading. Citation chips render as ordinary children. */
export function Prose({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['prose-content', className].filter(Boolean).join(' ')} {...props} />;
}
