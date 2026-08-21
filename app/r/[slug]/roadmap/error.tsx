'use client';

import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SUPPORTING } from '@/lib/content/app';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Segment-scoped error boundary. Nested one level below
 * `app/r/[slug]/layout.tsx`, so an error thrown while rendering the roadmap
 * replaces only this content — **the `RunShell` chrome stays mounted**, which
 * is the whole point: never lose completed work. The research is finished and
 * the report is still one click away.
 *
 * It renders `<AppBackdrop variant="roadmap" />` as its first child exactly as
 * the page it replaces would: C13 puts the backdrop on the page, and an error
 * boundary *is* the segment's rendered tree.
 *
 * `.ob-error-panel` rather than the full-page treatment `app/error.tsx` uses —
 * this failure is inline and adjacent to working chrome, not a whole-app
 * failure. Its 2px accent left edge is blue doing job three (live/active): it
 * marks the one region of a broken page that still has an action in it.
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
  const copy = SUPPORTING.roadmapError;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <AppBackdrop variant="roadmap" />
      <div className="ob-container ob-roadmap">
        <div className="ob-error-panel">
          <p className="ob-error-title">{copy.title}</p>
          <p>{copy.body}</p>
          <div className="ob-error-actions">
            <button type="button" className="ob-btn ob-btn-primary" onClick={() => retry()}>
              {copy.retry}
            </button>
            <Link href={`/r/${slug}/validate`} className="ob-btn-bare">
              {copy.back}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
