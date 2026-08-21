import type { HTMLAttributes, ReactNode } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'app' | 'report' | 'marketing';
  children: ReactNode;
}

/**
 * Max-width plus the 40px gutter. Three widths, three content boxes:
 * `app` 1360 → 1280 · `report` 1080 → 1000 · `marketing` 1200 → 1120.
 *
 * **All three classes already exist** — the first two in obsidian-app.css §1
 * (A0), the third in obsidian.css §2. This component picks one; it defines
 * none. The marketing width in particular is what C5's week-axis ratios are
 * measured inside, so it must not move.
 */
const VARIANT_CLASS = {
  app: 'ob-container-app',
  report: 'ob-container-report',
  marketing: 'ob-container',
} as const;

export function PageContainer({
  variant = 'app',
  className = '',
  children,
  ...props
}: PageContainerProps) {
  return (
    <div className={[VARIANT_CLASS[variant], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
