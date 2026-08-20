import { Report } from '@/components/validate/report/report';
import { ValidateView } from '@/components/validate/validate-view';
import { getBrief, getEvidence, getReport, getRun, getRunSummary } from '@/lib/db/queries';
import { formatDate } from '@/lib/format';
import { DIMENSIONS, type Dimension } from '@/lib/schemas/evidence';
import { isThinEvidence } from '@/lib/thin-evidence';

export default async function ValidatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [run, brief, report, evidence, summary] = await Promise.all([
    getRun(slug),
    getBrief(slug),
    getReport(slug),
    getEvidence(slug),
    getRunSummary(slug),
  ]);

  const isThin = isThinEvidence(evidence);

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
        />
      }
    />
  );
}
