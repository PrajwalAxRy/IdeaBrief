'use client';

import { isRunStreamActive } from '@/lib/hooks/use-run-stream';
import type { Dimension } from '@/lib/schemas/evidence';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { RunConsole } from './console/run-console';

interface ValidateViewProps {
  slug: string;
  oneLiner: string;
  dimensionLabels: Record<Dimension, string>;
  /** The Report, already rendered server-side — passed through, never re-rendered client-side, so it stays almost-no-JS. */
  reportSlot: ReactNode;
}

/**
 * Picks Mode A (Run Console) vs Mode B (Report) and owns the in-place,
 * no-navigation cross-fade between them (07: "The transition A → B happens
 * in place... No redirect, no page flash"). Logged beyond the 13-name
 * `'use client'` allowlist — this toggle needs local state and the
 * fresh-approval check needs `localStorage`, neither of which a Server
 * Component can do; `Report` itself is passed in as already-rendered
 * `children`, so it never becomes part of the client bundle.
 */
export function ValidateView({ slug, oneLiner, dimensionLabels, reportSlot }: ValidateViewProps) {
  const [showConsole] = useState(() => isRunStreamActive(slug));
  const [crossFading, setCrossFading] = useState(false);

  if (showConsole && !crossFading) {
    return (
      <RunConsole
        slug={slug}
        oneLiner={oneLiner}
        dimensionLabels={dimensionLabels}
        onComplete={() => setCrossFading(true)}
      />
    );
  }

  return <div className={showConsole ? 'report-cross-fade' : undefined}>{reportSlot}</div>;
}
