import type { HTMLAttributes, ReactNode } from 'react';

/** The report's reading measure — `--ob-report-prose` (580px), not 68ch. */
export function ProseColumn({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={['ob-prose mx-auto w-full', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
