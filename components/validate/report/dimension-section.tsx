import { ConfidenceNote } from '@/components/status/confidence-note';
import { Accordion } from '@/components/ui/accordion';
import { MetaLine } from '@/components/ui/meta-line';
import { SectionLabel } from '@/components/ui/section-label';
import { renderCitedText } from '@/components/validate/evidence/cited-text';
import { FindingCard } from '@/components/validate/evidence/finding-card';
import type { Finding } from '@/lib/schemas/evidence';
import type { DimensionSection as DimensionSectionData } from '@/lib/schemas/report';

interface DimensionSectionProps {
  id: string;
  data: DimensionSectionData;
  /** Prototype-only QA override for the thin-variant toggle (see the build log) — truncates what's shown without touching the real fixture. */
  findingsOverride?: Finding[];
  metaOverride?: { count: number; sources: number };
}

/**
 * One of the report's five dimensions: `[Bracket]` label, `ConfidenceNote`,
 * `MetaLine`, cited prose, and a findings accordion — the accordion reuses
 * `FindingCard`'s `accordion` variant with no `onOpenEvidence`, so this whole
 * section stays a Server Component (P8: "the interactive islands are
 * CitationChip, Accordion, and SectionIndex only").
 */
export function DimensionSection({
  id,
  data,
  findingsOverride,
  metaOverride,
}: DimensionSectionProps) {
  const findings = findingsOverride ?? data.findings;
  const count = metaOverride?.count ?? data.meta.count;
  const sources = metaOverride?.sources ?? data.meta.sources;

  return (
    <div id={id} className="report-section flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <SectionLabel>{data.label}</SectionLabel>
        <ConfidenceNote confidence={data.confidence} />
      </div>
      <MetaLine
        parts={[
          `DIMENSION: ${data.label.toUpperCase()}`,
          `${count} FINDINGS`,
          `${sources} SOURCES`,
          data.meta.date_range,
        ]}
      />
      <p className="report-dimension-prose">{renderCitedText(data.prose.text)}</p>
      {findings.length > 0 && (
        <Accordion title={`Show the ${findings.length} findings`}>
          <div className="flex flex-col gap-4">
            {findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} variant="accordion" />
            ))}
          </div>
        </Accordion>
      )}
    </div>
  );
}
