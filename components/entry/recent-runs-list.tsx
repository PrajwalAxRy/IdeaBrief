'use client';

import { StageChip } from '@/components/status/stage-chip';
import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { formatRelativeTime } from '@/lib/format';
import { useRecentRuns } from '@/lib/hooks/use-recent-runs';
import Link from 'next/link';

/**
 * Client-only, hidden entirely when empty (03 §3.2) — a plain divided list,
 * not a card grid. It's a utility, not a feature.
 */
export function RecentRunsList() {
  const { runs } = useRecentRuns();

  if (runs.length === 0) return null;

  return (
    <section className="py-24">
      <SectionLabel>Recent runs</SectionLabel>
      <Divider />
      <ul>
        {runs.map((run) => (
          <li key={run.slug}>
            <Link href={`/r/${run.slug}`} className="recent-run-row flex items-center gap-6 py-4">
              <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                {run.oneLiner}
              </span>
              <StageChip stage={run.stage} />
              <span className="meta-line">{formatRelativeTime(run.updatedAt)}</span>
              <span aria-hidden="true" style={{ color: 'var(--text-body)' }}>
                →
              </span>
            </Link>
            <Divider />
          </li>
        ))}
      </ul>
      <p className="empty-note pt-4">Remembered by this browser only.</p>
    </section>
  );
}
