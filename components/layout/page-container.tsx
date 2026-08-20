import type { HTMLAttributes, ReactNode } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'marketing' | 'app';
  children: ReactNode;
}

/** Max-width + horizontal padding. `marketing` (1200px) or `app` (1360px). */
export function PageContainer({
  variant = 'app',
  className = '',
  children,
  ...props
}: PageContainerProps) {
  const widthClass = variant === 'marketing' ? 'max-w-marketing' : 'max-w-app';
  return (
    <div
      className={['mx-auto w-full px-8', widthClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
