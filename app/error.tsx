'use client';

import { AppBackdrop } from '@/components/layout/app-backdrop';
import { PageContainer } from '@/components/layout/page-container';
import { Wordmark } from '@/components/layout/wordmark';
import { MetaLine } from '@/components/ui/meta-line';
import { SectionLabel } from '@/components/ui/section-label';
import { SUPPORTING } from '@/lib/content/app';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const RUN_SLUG_PATTERN = /^\/r\/([^/]+)/;

/**
 * The root error boundary — catches unhandled exceptions anywhere below
 * `app/layout.tsx`.
 *
 * Error boundaries must be Client Components and **cannot receive route
 * params**, so "preserves the run link when the slug is known" reads it
 * straight off `usePathname()`. Uses `retry` (stable as of next@16.3, per the
 * local docs) rather than the older `reset` — this project pins a newer Next
 * than most training data.
 *
 * A plain `<a>` (not `next/link`) for "Go to your run" is deliberate: this
 * screen exists because *something* broke, so a full navigation is a safer
 * recovery path than trusting client router state that may be mid-failure.
 *
 * **No red, no "Oops", no exclamation mark, no apology twice.** The first
 * sentence names the cause; the second, when a slug is present, says what
 * survived.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const pathname = usePathname();
  const slug = RUN_SLUG_PATTERN.exec(pathname ?? '')?.[1];
  const [erroredAt] = useState(() => new Date());
  const copy = SUPPORTING.error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="ob-standalone">
      <AppBackdrop variant="standalone" />

      <header className="ob-standalone-head">
        <PageContainer variant="marketing">
          <Wordmark />
          <hr className="ob-rule" />
        </PageContainer>
      </header>

      <main id="main" className="ob-standalone-body">
        <PageContainer variant="marketing">
          <SectionLabel>{copy.eyebrow}</SectionLabel>

          <h1 className="ob-h2 ob-standalone-head-line mt-7">{copy.headline}</h1>

          <div className="ob-standalone-copy mt-7">
            <p>{copy.body}</p>
            {slug ? <p>{copy.slugBody}</p> : null}
          </div>

          <div className="ob-standalone-actions">
            <button type="button" className="ob-btn ob-btn-primary" onClick={() => retry()}>
              {copy.retry}
            </button>
            {slug ? (
              <a href={`/r/${slug}`} className="ob-btn-bare">
                {/* `.ob-btn-bare` is not a flex row, so the space is the
                    separator — same as `RunFooterBar`'s. */}
                {copy.toRun}{' '}
                <span className="ob-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ) : null}
          </div>

          <MetaLine
            className="ob-standalone-foot"
            parts={copy.digest(
              error.digest ?? '—',
              erroredAt.toISOString().slice(0, 16).replace('T', ' '),
            )}
          />
        </PageContainer>
      </main>
    </div>
  );
}
