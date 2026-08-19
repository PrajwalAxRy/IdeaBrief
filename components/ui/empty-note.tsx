import type { ReactNode } from 'react';

/** A single honest sentence plus at most one action. No illustrated empty state anywhere in this product. */
export function EmptyNote({
  children,
  action,
  className = '',
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <p className="empty-note">{children}</p>
      {action}
    </div>
  );
}
