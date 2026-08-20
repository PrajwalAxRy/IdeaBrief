import { Report } from '@/components/validate/report/report';
import { ValidateView } from '@/components/validate/validate-view';
import { getBrief, getEvidence, getReport, getRun, getRunSummary } from '@/lib/db/queries';
import { formatDate } from '@/lib/format';
import { DIMENSIONS, type Dimension } from '@/lib/schemas/evidence';
import { buildThinPreviewOverrides, isThinEvidence } from '@/lib/thin-evidence';

export default async function ValidatePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ thin?: string }>;
}) {
  const { slug } = await params;
  const { thin: thinParam } = await searchParams;
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

  const dimensionLabels = Object.fromEntries(
    DIMENSIONS.map((dimension) => [dimension, report.dimensions[dimension].label]),
  ) as Record<Dimension, string>;

  return (
    <ValidateView
      slug={slug}
      oneLiner={brief.one_liner.value}
      dimensionLabels={dimensionLabels}
      reportSlot={
        <Report
          slug={slug}
          oneLiner={brief.one_liner.value}
          report={report}
          researchedDate={formatDate(run.updated_at)}
          verifiedCount={summary.verified_count}
          sourceCount={summary.pages_fetched}
          isThin={isThin}
          thinOverrides={thinOverrides}
        />
      }
    />
  );
}
