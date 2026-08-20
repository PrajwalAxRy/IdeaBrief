'use client';

import { PageContainer } from '@/components/layout/page-container';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Segment-scoped error boundary (08's "Error — roadmap generation failed").
 * Nested one level below `app/r/[slug]/layout.tsx`, so an error thrown while
 * rendering the roadmap page replaces only this content — the RunShell
 * chrome (header, Stage Rail, footer) stays mounted, matching the spec's
 * "the report is intact and reachable." Uses `.error-panel` (12.4 rule 1:
 * `--text-primary` copy, 2px `--accent` left border, no red) rather than the
 * full-page centred treatment `app/error.tsx` uses, since this error is
 * inline/adjacent to still-working chrome, not a whole-app failure.
 */
export default function RoadmapError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const slug = /^\/r\/([^/]+)/.exec(pathname ?? '')?.[1] ?? '';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer variant="app" className="py-16">
      <div className="mx-auto flex w-full max-w-roadmap flex-col gap-4">
        <div className="error-panel flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p
              style={{ color: 'var(--text-primary)', fontSize: 'var(--text-h3)', fontWeight: 600 }}
            >
              We couldn&rsquo;t write the roadmap for this run.
            </p>
            <p style={{ color: 'var(--text-body)' }}>
              The research is finished and safe — you can try again.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="btn btn-primary" onClick={() => retry()}>
              Try again
            </button>
            <Link href={`/r/${slug}/validate`} className="btn btn-secondary">
              Back to the report
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
