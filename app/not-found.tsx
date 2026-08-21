'use client';

import { AppBackdrop } from '@/components/layout/app-backdrop';
import { PageContainer } from '@/components/layout/page-container';
import { RunNotFound } from '@/components/layout/run-not-found';
import { Wordmark } from '@/components/layout/wordmark';
import { SectionLabel } from '@/components/ui/section-label';
import { SUPPORTING } from '@/lib/content/app';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RUN_PATH_PATTERN = /^\/r\//;

/**
 * The app's one not-found boundary, serving two surfaces.
 *
 * **Why one file and not two.** `app/r/[slug]/layout.tsx` is what calls
 * `notFound()` — it is the thing that knows whether a run exists — and
 * `notFound()` "terminates rendering of the route segment where it was
 * thrown". A segment's own `not-found.tsx` renders *inside* that segment's
 * layout, so it can never catch a throw from the layout itself; the error
 * propagates here instead. A `app/r/[slug]/not-found.tsx` would therefore be
 * unreachable by the only thing that would ever trigger it — and if it *were*
 * reachable it would render wrapped in `RunShell`, claiming a header, a stage
 * rail and a footer for a run that does not exist.
 *
 * So the branch lives here, read off `usePathname()` — the same pattern
 * `app/error.tsx` already uses, for the same structural reason: a boundary
 * cannot receive route params.
 *
 * The chrome is the wordmark and one hairline, deliberately: whatever failed,
 * it was the run layout, and rendering its furniture would be a lie about what
 * still works.
 */
export default function NotFound() {
  const pathname = usePathname();
  const isRunLink = RUN_PATH_PATTERN.test(pathname ?? '');
  const copy = SUPPORTING.notFound;

  return (
    <div className="ob-standalone">
      {/* One field for both branches. The plate is the empty-desk still; the CSS
          blooms underneath are what shows if it never paints. */}
      <AppBackdrop variant="standalone" />

      <header className="ob-standalone-head">
        <PageContainer variant="marketing">
          <Wordmark />
          <hr className="ob-rule" />
        </PageContainer>
      </header>

      <main id="main" className="ob-standalone-body">
        {isRunLink ? (
          <RunNotFound />
        ) : (
          <PageContainer variant="marketing">
            <SectionLabel>{copy.eyebrow}</SectionLabel>

            <h1 className="ob-h2 ob-standalone-head-line mt-7">{copy.headline}</h1>

            <div className="ob-standalone-copy mt-7">
              <p>{copy.body}</p>
            </div>

            <div className="ob-standalone-actions">
              <Link href="/" className="ob-btn ob-btn-primary">
                {copy.action}
                <span className="ob-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </PageContainer>
        )}
      </main>
    </div>
  );
}
