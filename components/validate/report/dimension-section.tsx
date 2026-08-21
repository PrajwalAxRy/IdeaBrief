import { ConfidenceNote } from '@/components/status/confidence-note';
import { Accordion } from '@/components/ui/accordion';
import { MetaLine } from '@/components/ui/meta-line';
import { renderCitedText } from '@/components/validate/evidence/cited-text';
import { FindingCard } from '@/components/validate/evidence/finding-card';
import { assertEverySentenceCited } from '@/lib/citations';
import { REPORT } from '@/lib/content/app';
import { formatMonthRange } from '@/lib/format';
import { DIMENSION_LABEL, type Finding } from '@/lib/schemas/evidence';
import type { DimensionSection as DimensionSectionData } from '@/lib/schemas/report';
import type { ReactNode } from 'react';
import { EvidenceRail } from './evidence-rail';
import { ReportRow } from './report-row';

/** A1 derives this; the component only reads it. */
export type DimensionWeight = 'full' | 'standard' | 'compact';

interface DimensionSectionProps {
  slug: string;
  index: number;
  total: number;
  data: DimensionSectionData;
  weight: DimensionWeight;
  /** The findings in this dimension the report's prose never quotes. */
  uncited: Finding[];
  /** The aside stack. A9 reserves it, A10 draws into it. */
  aside?: ReactNode;
  citedIds?: ReadonlySet<string>;
  /** Prototype-only QA override for the thin-variant toggle. */
  findingsOverride?: Finding[];
  metaOverride?: { count: number; sources: number };
}

/**
 * One of the report's five dimensions.
 *
 * **Density follows the evidence, and what differs is not three bars and a
 * lowercase word.** `full` carries up to four figures, the whole uncited rail
 * and an accordion over its long tail. `standard` caps the rail at three rows
 * and links out. `compact` has **no accordion at all** — with two findings
 * there is nothing to hide, so both render inline as `FindingCard
 * variant="row"` and the head gains a `THIN` chip.
 *
 * **A thin dimension shows everything it has; a solid one hides its long tail
 * behind a disclosure. That inversion is the differentiation.**
 */
export function DimensionSection({
  slug,
  index,
  total,
  data,
  weight,
  uncited,
  aside,
  citedIds,
  findingsOverride,
  metaOverride,
}: DimensionSectionProps) {
  const findings = findingsOverride ?? data.findings;
  const count = metaOverride?.count ?? data.meta.count;
  const sources = metaOverride?.sources ?? data.meta.sources;
  const label = DIMENSION_LABEL[data.dimension];

  assertEverySentenceCited(data.prose.text);

  return (
    <article className="ob-dim" data-weight={weight} id={`dimension-${data.dimension}`}>
      <ReportRow aside={aside}>
        <header className="ob-dim-head">
          <span className="ob-dim-index ob-meta">
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <h3 className="ob-h3">{label}</h3>
          {weight === 'compact' && <span className="ob-chip">{REPORT.dimension.thinTag}</span>}
          <ConfidenceNote confidence={data.confidence} />
        </header>

        {/* Wraps, never truncates (R21). */}
        <MetaLine
          className="ob-dim-meta"
          parts={[
            `${count} FINDINGS`,
            `${sources} SOURCES`,
            formatMonthRange(data.meta.date_range),
          ]}
        />

        <p className="ob-body">{renderCitedText(data.prose.text)}</p>

        {weight === 'compact' ? (
          /* Two findings and nothing to hide — both inline. `variant="row"`
             survives; A13 builds `EvidenceRow` alongside it (C13). */
          findings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              variant="row"
              citedInReport={citedIds?.has(finding.id) ?? false}
            />
          ))
        ) : (
          <>
            <EvidenceRail
              slug={slug}
              dimension={data.dimension}
              findings={uncited}
              cap={weight === 'standard' ? 3 : undefined}
            />
            {findings.length > 0 && (
              <Accordion title={REPORT.dimension.accordion(findings.length)}>
                <div className="flex flex-col gap-4">
                  {findings.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      variant="accordion"
                      citedInReport={citedIds?.has(finding.id) ?? false}
                    />
                  ))}
                </div>
              </Accordion>
            )}
          </>
        )}
      </ReportRow>
    </article>
  );
}
