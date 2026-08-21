'use client';

import { AppBackdrop } from '@/components/layout/app-backdrop';
import { SUPPORTING } from '@/lib/content/app';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The explorer's segment-scoped error boundary. **New in A14** — before this,
 * a `getEvidence` / `getDiscarded` / `getReport` failure on `/sources` fell all
 * the way through to the app boundary and took the `RunShell` chrome with it,
 * stranding a finished report behind a whole-page error.
 *
 * Same shape as the roadmap's: nested below `app/r/[slug]/layout.tsx`, so the
 * header, stage rail and footer stay mounted.
 *
 * **The copy diverges from A13's hand-over note deliberately.** That note
 * quoted a shorter first line (`Couldn't load the evidence.`); A14 owns this
 * file and the fuller sentence is what ships, so it names *what* couldn't load
 * and *for which run*. Recorded in the build log so it is not "corrected" back.
 */
export default function SourcesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const slug = /^\/r\/([^/]+)/.exec(pathname ?? '')?.[1] ?? '';
  const copy = SUPPORTING.sourcesError;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <AppBackdrop variant="sources" />
      <div className="ob-container-app ob-sources">
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
