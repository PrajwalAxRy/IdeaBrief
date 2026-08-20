import { PageContainer } from '@/components/layout/page-container';
import { Wordmark } from '@/components/layout/wordmark';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * The generic 404 for any URL outside `/r/[slug]/*` (e.g. a typo'd path).
 * Distinct from `app/r/[slug]/not-found.tsx` — that one is 09.2's
 * run-specific scenario (a truncated link, recent runs as a recovery path);
 * this one has no run context to reason about, so it stays plain.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="run-shell-header">
        <PageContainer variant="app">
          <div className="flex items-center py-4">
            <Wordmark />
          </div>
        </PageContainer>
      </header>

      <main className="flex flex-1 items-center justify-center py-24">
        <PageContainer variant="marketing" className="flex flex-col items-center gap-6 text-center">
          <SectionLabel>Not found</SectionLabel>
          <DisplayHeadline as="h1" muted="There's nothing" bright="here." />
          <p style={{ color: 'var(--text-body)' }}>
            The page you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Link href="/" className="btn btn-primary">
            Go home
            <ArrowRight size={16} />
          </Link>
        </PageContainer>
      </main>
    </div>
  );
}
