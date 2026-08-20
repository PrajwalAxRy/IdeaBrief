import type { ReactNode } from 'react';

interface TwoColumnProps {
  main: ReactNode;
  sidebar: ReactNode;
  sidebarWidth?: number;
  className?: string;
}

/**
 * `1fr` + fixed sidebar, sidebar sticky at `top: 96px`. Used by Define
 * (conversation + Brief Panel) and the Report (content + section index).
 * Collapse-to-drawer behaviour below the two-column breakpoint is deferred —
 * this build targets desktop only (1440px/1280px) per the standing rules.
 */
export function TwoColumn({ main, sidebar, sidebarWidth = 400, className = '' }: TwoColumnProps) {
  return (
    <div
      className={['grid items-start gap-12', className].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: `1fr ${sidebarWidth}px` }}
    >
      <div>{main}</div>
      <div style={{ position: 'sticky', top: 96 }}>{sidebar}</div>
    </div>
  );
}
