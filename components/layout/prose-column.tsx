import type { HTMLAttributes, ReactNode } from 'react';

/** Enforces the 68ch reading measure and vertical rhythm for long-form content — report, roadmap. */
export function ProseColumn({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={['mx-auto w-full max-w-prose', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
