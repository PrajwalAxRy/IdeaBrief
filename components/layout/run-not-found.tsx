import { PageContainer } from '@/components/layout/page-container';
import { RecentRunsList } from '@/components/ui/recent-runs-list';
import { SectionLabel } from '@/components/ui/section-label';
import { SUPPORTING } from '@/lib/content/app';
import Link from 'next/link';

/**
 * **The most important supporting surface in this build, and it is not a
 * generic 404.**
 *
 * The slug is the entire access model, so a truncated or mistyped link is the
 * single most likely real failure in the product. It gets `--ob-h1`, two
 * sentences that name the actual cause, and a recovery path — where the root
 * 404 gets `--ob-h2` and one sentence.
 *
 * It renders no additional backdrop: the shared not-found boundary owns the
 * photographic field for both root and invalid-run surfaces.
 */
export function RunNotFound() {
  const copy = SUPPORTING.notFoundRun;

  return (
    <>
      <PageContainer variant="marketing">
        <SectionLabel>{copy.eyebrow}</SectionLabel>

        <h1 className="ob-h1 ob-standalone-head-line mt-7">{copy.headline}</h1>

        <div className="ob-standalone-copy mt-7">
          {copy.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <RecentRunsList />

        <div className="ob-standalone-actions">
          <Link href="/" className="ob-btn ob-btn-primary">
            {copy.action}
            <span className="ob-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
