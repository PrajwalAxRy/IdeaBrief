import { BackLink } from '@/components/layout/back-link';
import { PageContainer } from '@/components/layout/page-container';
import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { SourcesList } from '@/components/validate/sources-list';
import { getEvidence, getRunSummary } from '@/lib/db/queries';
import Link from 'next/link';

export default async function SourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [evidence, summary] = await Promise.all([getEvidence(slug), getRunSummary(slug)]);
  const verified = evidence.filter((finding) => finding.verified);

  return (
    <PageContainer variant="app" className="flex flex-col gap-8 py-12">
      <BackLink href={`/r/${slug}/validate`}>Back to the report</BackLink>

      <div className="flex flex-col gap-2">
        <SectionLabel>All sources</SectionLabel>
        <p style={{ color: 'var(--text-body)' }}>
          Every finding that passed the check, in the order it was verified.
        </p>
      </div>

      {verified.length === 0 ? (
        // Unreached by the current fixture (which always has 47 verified findings) but a
        // real, honest case — matches 09.1's "Empty (run)" state, same posture as the
        // Report's thin-evidence variant rather than a bare empty list.
        <p className="empty-note">
          Nothing was verified for this run.{' '}
          <Link href={`/r/${slug}/roadmap`} className="text-action">
            See the roadmap
          </Link>{' '}
          for what to do next.
        </p>
      ) : (
        <>
          <SourcesList evidence={verified} />
          <Divider />
          <p className="empty-note">
            {summary.discarded_count} excerpts were discarded because the quoted text could not be
            found on the page it came from.
          </p>
        </>
      )}
    </PageContainer>
  );
}
