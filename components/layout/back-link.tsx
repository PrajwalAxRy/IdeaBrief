import Link from 'next/link';
import type { ReactNode } from 'react';

/** `←`-prefixed text action. */
export function BackLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={['ob-text-action', className].filter(Boolean).join(' ')}>
      ← {children}
    </Link>
  );
}
