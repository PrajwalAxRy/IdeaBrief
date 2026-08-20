import { Orb } from '@/components/entry/orb';
import { RecentRunsList } from '@/components/entry/recent-runs-list';
import { PageContainer } from '@/components/layout/page-container';
import { Wordmark } from '@/components/layout/wordmark';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { SectionLabel } from '@/components/ui/section-label';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * 09.2 — a bad `/r/[slug]` URL is a first-class scenario, not a generic 404:
 * the URL is the whole access model, so a truncated or mistyped link is the
 * single most likely real failure in the product. Rendered when
 * `app/r/[slug]/layout.tsx` calls `notFound()`, which means this page is
 * NOT wrapped by `RunShell` (that layout is the one that threw) — only the
 * root `app/layout.tsx` (fonts, grain overlay) wraps it, matching the
 * mockup's lighter chrome (just the wordmark, no Stage Rail, no run footer).
 */
export default function RunNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="run-shell-header">
        <PageContainer variant="app">
          <div className="flex items-center py-4">
            <Wordmark />
          </div>
        </PageContainer>
      </header>

      <main className="flex flex-1 items-center justify-center py-24">
        <PageContainer variant="marketing" className="flex flex-col items-center gap-6 text-center">
          <SectionLabel>Run not found</SectionLabel>
          <DisplayHeadline as="h1" muted="There's nothing" bright="at this link." />

          <div className="flex max-w-conversation flex-col gap-3">
            <p style={{ color: 'var(--text-body)' }}>
              The link may be incomplete — they&rsquo;re long, and chat apps sometimes cut them off.
              Check you copied the whole thing.
            </p>
            <p style={{ color: 'var(--text-body)' }}>
              Runs aren&rsquo;t stored against an account, so we can&rsquo;t look one up for you.
            </p>
          </div>

          <div className="w-full max-w-conversation">
            <RecentRunsList />
          </div>

          <Link href="/" className="btn btn-primary">
            Start a new idea
            <ArrowRight size={16} />
          </Link>
        </PageContainer>
      </main>

      <Orb dimmed />
    </div>
  );
}
