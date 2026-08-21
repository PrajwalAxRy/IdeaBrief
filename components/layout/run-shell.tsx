import { SkipLink } from '@/components/ui/skip-link';
import type { RunSegment } from '@/lib/run-stage';
import type { RunStatus } from '@/lib/schemas/run';
import type { ReactNode } from 'react';
import { EvidenceOverlay } from './evidence-overlay';
import { RunFooterBar } from './run-footer-bar';
import { RunHeader } from './run-header';
import { RunMain } from './run-main';

interface RunShellProps {
  slug: string;
  status: RunStatus;
  oneLiner: string;
  metaBySegment: Record<RunSegment, string[]>;
  copyLink: ReactNode;
  verifiedCount: number;
  discardedCount: number;
  /** For the overlay's `EvidenceExplorer` — the `IN THE REPORT` facet (C16). */
  citedIds: string[];
  children: ReactNode;
}

/**
 * The persistent chrome on every `/r/[slug]/*` page. **A server component**:
 * the page bodies arrive as `children` and pass straight through, so the
 * client boundary is `RunHeader` and `RunMain`, not the page.
 *
 * `RunFooterBar` must stay the element immediately after `<main>` — §5
 * suppresses it on Define with `main[data-chrome='surface'] ~ .ob-run-footer`,
 * which is how the footer is hidden without a second segment read.
 *
 * The skip link is the first child (R19): `<main id="main">` has existed since
 * P3 with nothing pointing at it.
 */
export function RunShell({
  slug,
  status,
  oneLiner,
  metaBySegment,
  copyLink,
  verifiedCount,
  discardedCount,
  citedIds,
  children,
}: RunShellProps) {
  return (
    <div className="ob-app">
      <SkipLink />
      <RunHeader
        slug={slug}
        status={status}
        oneLiner={oneLiner}
        metaBySegment={metaBySegment}
        copyLink={copyLink}
        verifiedCount={verifiedCount}
        discardedCount={discardedCount}
      />
      <RunMain>{children}</RunMain>
      <RunFooterBar slug={slug} copyLink={copyLink} />
      <EvidenceOverlay slug={slug} citedIds={citedIds} />
    </div>
  );
}
