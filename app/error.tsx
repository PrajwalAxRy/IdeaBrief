'use client';

import { PageContainer } from '@/components/layout/page-container';
import { SectionLabel } from '@/components/ui/section-label';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const RUN_SLUG_PATTERN = /^\/r\/([^/]+)/;

/**
 * The root error boundary (09.3) — catches unhandled exceptions anywhere
 * below `app/layout.tsx`. Error boundaries must be Client Components, so
 * "preserves the run link when the slug is known" reads it straight off
 * `usePathname()` rather than route params (which this file can't receive).
 * Uses `retry` (stable as of next@16.3, per the local docs) rather than the
 * older `reset` — this project pins a newer Next than most training data.
 * A plain `<a>` (not `next/link`) for "Go to your run" is deliberate: this
 * screen exists because *something* broke, so a full navigation is a safer
 * recovery path than trusting client router state that may be mid-failure.
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

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer
      variant="marketing"
      className="flex min-h-screen flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <SectionLabel>Something broke</SectionLabel>
      <h1 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-h2)', fontWeight: 700 }}>
        This one&rsquo;s on us.
      </h1>

      <div className="flex max-w-conversation flex-col gap-3">
        <p style={{ color: 'var(--text-body)' }}>
          An unexpected error stopped the page from loading.
        </p>
        {slug && (
          <p style={{ color: 'var(--text-body)' }}>
            Your run is still there — reloading usually fixes it.
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Reload
        </button>
        {slug && (
          <a href={`/r/${slug}`} className="btn btn-secondary">
            Go to your run →
          </a>
        )}
      </div>

      <p className="meta-line">
        {`ERROR ${error.digest ?? '—'} // ${erroredAt.toISOString().slice(0, 16).replace('T', ' ')}`}
      </p>
    </PageContainer>
  );
}
