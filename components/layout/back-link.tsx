import Link from 'next/link';
import type { ReactNode } from 'react';

/** `←`-prefixed text action. Used on Sources and the roadmap footer. */
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
    <Link href={href} className={['text-action', className].filter(Boolean).join(' ')}>
      ← {children}
    </Link>
  );
}
