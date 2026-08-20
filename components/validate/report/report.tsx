import { PageContainer } from '@/components/layout/page-container';
import { ProseColumn } from '@/components/layout/prose-column';
import { SectionIndex } from '@/components/layout/section-index';
import { TwoColumn } from '@/components/layout/two-column';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { Divider } from '@/components/ui/divider';
import { SectionLabel } from '@/components/ui/section-label';
import { DIMENSIONS } from '@/lib/schemas/evidence';
import type { Report as ReportData } from '@/lib/schemas/report';
import type { ThinDimensionOverrides } from '@/lib/thin-evidence';
import Link from 'next/link';
import { CompetitorCard } from './competitor-card';
import { DimensionSection } from './dimension-section';
import { SummarySection } from './summary-section';
import { SurprisePanel } from './surprise-panel';
import { ThinEvidenceNotice } from './thin-evidence-notice';
import { UnansweredSection } from './unanswered-section';

interface ReportProps {
  slug: string;
  oneLiner: string;
  report: ReportData;
  researchedDate: string;
  verifiedCount: number;
  sourceCount: number;
  isThin: boolean;
  /** Prototype-only QA override for demonstrating the thin variant without a second fixture — see the build log. */
  thinOverrides?: ThinDimensionOverrides;
}

const SECTION_INDEX_ITEMS = [
  { id: 'what-we-found', label: 'What we found' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'surprises', label: 'Surprises' },
  { id: 'unanswered', label: 'Unanswered' },
];

/**
 * Mode B — the evidence-backed picture of what the world already says.
 * Ships almost no JS: the only Client Components anywhere in this tree are
 * `CitationChip`, `Accordion`, and `SectionIndex`, all reached as leaves, not
 * as ancestors — `Report` itself and every section below it are plain
 * Server Components.
 */
export function Report({
  slug,
  oneLiner,
  report,
  researchedDate,
  verifiedCount,
  sourceCount,
  isThin,
  thinOverrides,
}: ReportProps) {
  const dimensionRows = DIMENSIONS.map((dimension) => ({
    dimension,
    data: report.dimensions[dimension],
    count: thinOverrides?.[dimension]?.count ?? report.dimensions[dimension].meta.count,
  }));
  const thinDimensions = isThin ? dimensionRows.filter((row) => row.count < 2) : [];
  const normalDimensions = isThin ? dimensionRows.filter((row) => row.count >= 2) : dimensionRows;

  const content = (
    <ProseColumn className="flex flex-col gap-16">
      <header className="flex flex-col gap-3">
        <DisplayHeadline as="h1" muted="What the web" bright="already says." />
        <p style={{ color: 'var(--text-body)' }}>{oneLiner}</p>
        <p className="meta-line">
          Researched {researchedDate} · {verifiedCount} verified findings
        </p>
      </header>

      {isThin && <ThinEvidenceNotice slug={slug} />}

      <SummarySection summary={report.summary} />
      <Divider />

      <div id="dimensions" className="report-section flex flex-col gap-12">
        {normalDimensions.map(({ dimension, data }) => (
          <DimensionSection
            key={dimension}
            id={`dimension-${dimension}`}
            data={data}
            findingsOverride={thinOverrides?.[dimension]?.findings}
            metaOverride={thinOverrides?.[dimension]}
          />
        ))}

        {thinDimensions.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionLabel>Dimensions with little evidence</SectionLabel>
            {thinDimensions.map(({ dimension, data, count }) => (
              <p key={dimension} className="meta-line">
                {data.label} — {count} finding{count === 1 ? '' : 's'}
              </p>
            ))}
          </div>
        )}
      </div>
      <Divider />

      {report.competitors.length > 0 && (
        <>
          <div id="competitors" className="report-section flex flex-col gap-6">
            <SectionLabel>Who else is doing this</SectionLabel>
            <div className="grid grid-cols-2 gap-6">
              {report.competitors.map((competitor) => (
                <CompetitorCard key={competitor.name} competitor={competitor} />
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      <div id="surprises" className="report-section flex flex-col gap-6">
        <SectionLabel>What surprised us</SectionLabel>
        <SurprisePanel surprises={report.surprises} />
      </div>
      <Divider />

      <UnansweredSection unanswered={report.unanswered} slug={slug} elevated={isThin} />
    </ProseColumn>
  );

  const indexMeta = (
    <div className="flex flex-col gap-1">
      <p className="meta-line">{verifiedCount} findings</p>
      <p className="meta-line">{sourceCount} sources</p>
      <Link href={`/r/${slug}/sources`} className="text-action">
        Sources
      </Link>
    </div>
  );

  return (
    <PageContainer variant="app" className="py-16">
      <TwoColumn
        sidebarWidth={240}
        main={content}
        sidebar={<SectionIndex items={SECTION_INDEX_ITEMS} meta={indexMeta} />}
      />
    </PageContainer>
  );
}
