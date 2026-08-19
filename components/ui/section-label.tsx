import type { ReactNode } from 'react';

/** `[Bracket]` monospace amber overline — the single most-used branded element. Never `— Label —`. */
export function SectionLabel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={['section-label', className].filter(Boolean).join(' ')}>[{children}]</span>
  );
}
