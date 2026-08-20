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
  searchParams: Promise<{ thin?: string; broken?: string }>;
}) {
  const { slug } = await params;
  const { thin: thinParam, broken } = await searchParams;

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
