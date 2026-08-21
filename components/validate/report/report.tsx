import { SectionIndex } from '@/components/layout/section-index';
import { MetaLine } from '@/components/ui/meta-line';
import { SectionLabel } from '@/components/ui/section-label';
import {
  citationCoverage,
  citedFindingIds,
  deriveEvidenceState,
} from '@/lib/analytics/evidence-stats';
import { REPORT, REPORT_SECTIONS } from '@/lib/content/app';
import type { RunSummary } from '@/lib/run-summary';
import { DIMENSIONS, DIMENSION_LABEL, type Evidence } from '@/lib/schemas/evidence';
import type { Report as ReportData } from '@/lib/schemas/report';
import type { ThinDimensionOverrides } from '@/lib/thin-evidence';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CompetitorCard } from './competitor-card';
import { DimensionSection, type DimensionWeight } from './dimension-section';
import { EvidenceState } from './evidence-state';
import { buildReportFigures, uncitedByDimension } from './report-figures';
import { ReportRow } from './report-row';
import { SummarySection } from './summary-section';
import { SurprisePanel } from './surprise-panel';
import { ThinEvidenceNotice } from './thin-evidence-notice';
import { UnansweredSection } from './unanswered-section';

interface ReportProps {
  slug: string;
  oneLiner: string;
  report: ReportData;
  evidence: Evidence;
  summary: RunSummary;
  researchedDate: string;
  isThin: boolean;
  /** Prototype-only QA override for the thin variant — see the build log. */
  thinOverrides?: ThinDimensionOverrides;
}

/**
 * **Density follows the evidence, not a prescribed rhythm.** The blueprint's
 * low→high→medium→low→low sequence predates the fixture and doesn't match it.
 */
function weightFor(confidence: string, count: number): DimensionWeight {
  if (confidence === 'solid' && count >= 10) return 'full';
  return count >= 4 ? 'standard' : 'compact';
}

function Section({
  id,
  eyebrow,
  index,
  h2,
  children,
}: {
  id: string;
  eyebrow: string;
  index: string;
  h2: string;
  children: ReactNode;
}) {
  const headingId = `${id}-h`;
  return (
    <section className="ob-report-section" id={id} aria-labelledby={headingId}>
      {/* The eyebrow's trailing hairline runs the full 1080 on every section,
          including the two that then narrow to the 580px reading column. */}
      <div className="ob-report-full">
        <SectionLabel index={index}>{eyebrow}</SectionLabel>
        <h2 className="ob-h2 mt-8" id={headingId}>
          {h2}
        </h2>
      </div>
      {children}
    </section>
  );
}

/**
 * Mode B — the evidence-backed picture of what the world already says, and the
 * artefact people actually share.
 *
 * **D5, the editorial body:** prose at 580px on the left, the data layer at
 * 400px on the right, aligned to the claim it belongs to. `ReportRow` is used
 * by §02 and §03 only — the reading portion. §01, §04, §05 and §06 are
 * full-measure blocks because their content *is* the data layer. Alternating a
 * 580px reading column against four full-measure breaks is the page's rhythm,
 * not an exception to D5.
 *
 * Ships almost no JS: the client leaves are `CitationChip`, `Accordion`,
 * `SectionIndex` and `EvidenceRail`. `Report` itself and every section
 * component below it are Server Components.
 */
export function Report({
  slug,
  oneLiner,
  report,
  evidence,
  summary,
  researchedDate,
  isThin,
  thinOverrides,
}: ReportProps) {
  const citedIds = citedFindingIds(report);
  const { cited, uncited } = citationCoverage(report, evidence);
  const evidenceState = deriveEvidenceState(report, evidence);
  const figures = buildReportFigures({ slug, report, evidence, summary });
  const uncitedFor = uncitedByDimension(report, evidence);

  const rows = DIMENSIONS.map((dimension) => ({
    dimension,
    data: report.dimensions[dimension],
    count: thinOverrides?.[dimension]?.count ?? report.dimensions[dimension].meta.count,
  }));
  const thinRows = isThin ? rows.filter((row) => row.count < 2) : [];
  const normalRows = isThin ? rows.filter((row) => row.count >= 2) : rows;

  const sections = Object.fromEntries(REPORT_SECTIONS.map((s) => [s.id, s])) as Record<
    string,
    (typeof REPORT_SECTIONS)[number]
  >;
  const hasCompetitors = report.competitors.length > 0;

  return (
    <>
      {/* Full-bleed. This is the page's one `--ob-display` moment — the report
          is the artefact people share, and a cold visitor who never saw the
          console gets the run's whole ledger here rather than a wait. */}
      <header className="ob-report-head">
        <div className="ob-report-body">
          <h1 className="ob-display" style={{ maxWidth: '14ch' }}>
            {REPORT.h1}
          </h1>
          <p className="ob-lead" style={{ maxWidth: '52ch' }}>
            {oneLiner}
          </p>
          <MetaLine
            parts={[
              `RESEARCHED ${researchedDate.toUpperCase()}`,
              `${summary.verified_count} VERIFIED`,
              `${summary.pages_fetched} SOURCES`,
              `${summary.discarded_count} DISCARDED`,
            ]}
          />
        </div>
      </header>

      {/* An omitted section takes its index entry with it — an entry that
          scrolls nowhere is worse than no entry. */}
      <SectionIndex
        items={REPORT.index
          .filter((entry) => hasCompetitors || entry.id !== 'competitors')
          .map((entry) => ({ ...entry }))}
      />

      <div className="ob-report-body">
        {isThin && <ThinEvidenceNotice slug={slug} />}

        <Section
          id="evidence-state"
          index={sections['evidence-state'].index}
          eyebrow={sections['evidence-state'].label}
          h2={REPORT.sections.evidenceState.h2}
        >
          <div className="ob-report-full">
            <EvidenceState
              strong={evidenceState.strong}
              thin={evidenceState.thin}
              contested={evidenceState.contested}
              strip={figures.strip}
              stance={figures.overallStance}
              footer={`${summary.pages_fetched} SOURCES · ${summary.domains_count} DOMAINS · ${summary.discarded_count} EXCERPTS DISCARDED`}
            />
          </div>
        </Section>

        <Section
          id="what-we-found"
          index={sections['what-we-found'].index}
          eyebrow={sections['what-we-found'].label}
          h2={REPORT.sections.summary.h2}
        >
          <ReportRow aside={figures.summaryAside}>
            <SummarySection summary={report.summary} />
          </ReportRow>
        </Section>

        <Section
          id="dimensions"
          index={sections.dimensions.index}
          eyebrow={sections.dimensions.label}
          h2={REPORT.sections.dimensions.h2}
        >
          {normalRows.map(({ dimension, data }, index) => (
            <DimensionSection
              key={dimension}
              slug={slug}
              index={index + 1}
              total={normalRows.length}
              data={data}
              weight={weightFor(data.confidence, data.meta.count)}
              uncited={uncitedFor[dimension]}
              aside={figures.dimensionAsides[dimension]}
              citedIds={citedIds}
              findingsOverride={thinOverrides?.[dimension]?.findings}
              metaOverride={thinOverrides?.[dimension]}
            />
          ))}

          {thinRows.length > 0 && (
            <div className="ob-report-full">
              <p className="ob-meta">{REPORT.thin.littleEvidence}</p>
              {thinRows.map(({ dimension, count }) => (
                <p key={dimension} className="ob-body">
                  {/* The label, never the raw key — R14's whole point. */}
                  {DIMENSION_LABEL[dimension]} — {count} finding{count === 1 ? '' : 's'}
                </p>
              ))}
            </div>
          )}

          {/* Derived, never hardcoded. 23 of 47 is what this fixture yields. */}
          <div className="ob-report-full ob-uncited">
            <p className="ob-body">
              {REPORT.uncited.line(uncited.size, cited.size + uncited.size)}
            </p>
            <Link href={`/r/${slug}/sources`} className="ob-btn ob-btn-ghost">
              {REPORT.uncited.action}
            </Link>
          </div>
        </Section>

        {/* An empty grid or "no competitors found" reads as encouragement,
            i.e. a verdict — so the whole section goes, index entry included. */}
        {hasCompetitors && (
          <Section
            id="competitors"
            index={sections.competitors.index}
            eyebrow={sections.competitors.label}
            h2={REPORT.sections.competitors.h2}
          >
            <div className="ob-report-full">
              {figures.capabilityMatrix}
              {report.competitors.map((competitor) => (
                <CompetitorCard key={competitor.name} competitor={competitor} />
              ))}
            </div>
          </Section>
        )}

        <Section
          id="surprises"
          index={sections.surprises.index}
          eyebrow={sections.surprises.label}
          h2={REPORT.sections.surprises.h2(report.surprises.length)}
        >
          <div className="ob-report-full">
            <SurprisePanel surprises={report.surprises} />
          </div>
        </Section>

        <Section
          id="unanswered"
          index={sections.unanswered.index}
          eyebrow={sections.unanswered.label}
          h2={REPORT.sections.unanswered.h2}
        >
          <div className="ob-report-full">
            <UnansweredSection unanswered={report.unanswered} slug={slug} elevated={isThin} />
          </div>
        </Section>
      </div>
    </>
  );
}
