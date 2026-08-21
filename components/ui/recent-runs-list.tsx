'use client';

import { StageChip } from '@/components/status/stage-chip';
import { SectionLabel } from '@/components/ui/section-label';
import { SUPPORTING } from '@/lib/content/app';
import { formatRelativeTime } from '@/lib/format';
import { useRecentRuns } from '@/lib/hooks/use-recent-runs';
import Link from 'next/link';

/**
 * The recovery path on the invalid-run page, and its only call site.
 *
 * No auth means the URL is the only key, so the most predictable failure in the
 * product is a user losing it; `localStorage` closes most of that gap for zero
 * backend work. A plain divided list, not a card grid — this is a utility, and
 * card treatment would imply a runs dashboard the product does not have.
 *
 * **Hidden entirely when empty, with no empty state.** Hide, don't
 * placeholder. When it hides, the CTA is the only thing under the paragraphs,
 * and that is the correct page.
 *
 * The closing note is required: it sets accurate expectations about durability
 * in one line, which is more honest than letting someone assume their runs are
 * saved somewhere.
 */
export function RecentRunsList() {
  const { runs } = useRecentRuns();

  if (runs.length === 0) return null;

  return (
    <section className="ob-recovery">
      <SectionLabel>{SUPPORTING.notFoundRun.recoveryHead}</SectionLabel>
      <ul className="mt-4">
        {runs.map((run) => (
          <li key={run.slug} className="ob-recovery-row">
            <Link href={`/r/${run.slug}`} className="ob-recent-row flex items-center gap-6 py-4">
              <span className="ob-body ob-body-bright flex-1 truncate">{run.oneLiner}</span>
              <StageChip stage={run.stage} />
              <span className="ob-meta">{formatRelativeTime(run.updatedAt)}</span>
              <span aria-hidden="true" className="ob-hl-muted">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="ob-recovery-foot ob-meta">{SUPPORTING.notFoundRun.footnote}</p>
    </section>
  );
}
