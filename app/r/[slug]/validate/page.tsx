import { AppBackdrop } from '@/components/layout/app-backdrop';
import { Report } from '@/components/validate/report/report';
import { ValidateView } from '@/components/validate/validate-view';
import { getBrief, getEvidence, getReport, getRun, getRunSummary } from '@/lib/db/queries';
import { formatDate } from '@/lib/format';
import { buildThinPreviewOverrides, isThinEvidence } from '@/lib/thin-evidence';

/**
 * **This is the card that actually gets shared**, so it gets the most attention:
 * the run's own one-liner as the title, and a description that states the
 * product's whole claim in two sentences. Every number is derived — a shared
 * card that disagrees with the page it advertises is the lie D13 removed,
 * republished on the artefact that travels furthest.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brief, summary] = await Promise.all([getBrief(slug), getRunSummary(slug)]);
  const description = `${summary.verified_count} verified findings from ${summary.pages_fetched} sources. Every claim matched to text on a real page.`;
  return {
    title: brief.one_liner.value,
    description,
    openGraph: {
      title: brief.one_liner.value,
      description,
      images: ['/og/validate.png'],
    },
  };
}

export default async function ValidatePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ thin?: string; broken?: string; stall?: string }>;
}) {
  const { slug } = await params;

  const { thin: thinParam, broken, stall } = await searchParams;

  // Prototype-only QA affordance for exercising the root error boundary
  // (app/error.tsx) — see the P10 build log. There is no real pipeline here
  // that could throw, so this is the only honest way to demonstrate it.
  if (broken === '1') {
    throw new Error('Prototype-only QA trigger for the root error boundary (?broken=1).');
  }
  const [run, brief, report, evidence, summary] = await Promise.all([
    getRun(slug),
    getBrief(slug),
    getReport(slug),
    getEvidence(slug),
    getRunSummary(slug),
  ]);

  // `?thin=1` is a prototype-only QA affordance for exercising the thin-evidence
  // variant against the one always-well-evidenced fixture — see lib/thin-evidence.ts.
  const forceThin = thinParam === '1';
  const isThin = forceThin || isThinEvidence(evidence);
  const thinOverrides = forceThin ? buildThinPreviewOverrides(evidence) : undefined;

  return (
    <>
      {/* C13 — the *page* mounts the ambient field, never the layout: the
          layout cannot see the segment, and one field serves both Mode A and
          Mode B because the page cannot know the client-side mode either. Two
          ambient fields on one page is one too many under D17. */}
      <AppBackdrop variant="validate" />
      <ValidateView
        slug={slug}
        oneLiner={brief.one_liner.value}
        stall={stall === '1'}
        reportSlot={
          <Report
            slug={slug}
            oneLiner={brief.one_liner.value}
            report={report}
            evidence={evidence}
            summary={summary}
            researchedDate={formatDate(run.updated_at)}
            isThin={isThin}
            thinOverrides={thinOverrides}
          />
        }
      />
    </>
  );
}
