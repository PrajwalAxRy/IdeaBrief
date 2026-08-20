'use client';

import { EmptyNote } from '@/components/ui/empty-note';
import { FilterPill } from '@/components/ui/filter-pill';
import { TextAction } from '@/components/ui/text-action';
import { citationNumberForFindingId } from '@/lib/citations';
import { DIMENSIONS, type Dimension, type Finding } from '@/lib/schemas/evidence';
import { useMemo, useState } from 'react';
import { useEvidence } from './evidence/evidence-context';
import { FindingCard } from './evidence/finding-card';

const DIMENSION_FILTER_LABEL: Record<Dimension, string> = {
  PROBLEM: 'Problem',
  WHAT_EXISTS: 'Exists',
  DEMAND_SIGNALS: 'Demand',
  MONEY: 'Money',
  PRACTICAL: 'Practical',
};

/**
 * The Sources page body — dimension filter pills (the product's only filter
 * UI) plus the dense, divided list of rows. `'use client'` beyond the
 * 13-name allowlist (logged, same precedent as `EvidenceContext`): filtering
 * needs local state, and rows need to open the evidence drawer on click,
 * which `FindingCard` only does when an already-client ancestor wires it up.
 */
export function SourcesList({ evidence }: { evidence: Finding[] }) {
  const { open } = useEvidence();
  const [activeFilter, setActiveFilter] = useState<Dimension | null>(null);

  const countsByDimension = useMemo(() => {
    const counts = Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Record<Dimension, number>;
    for (const finding of evidence) counts[finding.dimension] += 1;
    return counts;
  }, [evidence]);

  const visible = activeFilter ? evidence.filter((f) => f.dimension === activeFilter) : evidence;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <FilterPill active={activeFilter === null} onToggle={() => setActiveFilter(null)}>
          All ({evidence.length})
        </FilterPill>
        {DIMENSIONS.map((dimension) => (
          <FilterPill
            key={dimension}
            active={activeFilter === dimension}
            onToggle={(next) => setActiveFilter(next ? dimension : null)}
          >
            {DIMENSION_FILTER_LABEL[dimension]} ({countsByDimension[dimension]})
          </FilterPill>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyNote action={<TextAction onClick={() => setActiveFilter(null)}>Show all</TextAction>}>
          No findings in this dimension.
        </EmptyNote>
      ) : (
        <div className="sources-rows">
          {visible.map((finding) => {
            const citation = citationNumberForFindingId(finding.id);
            return (
              <FindingCard
                key={finding.id}
                finding={finding}
                variant="row"
                citationNumber={citation}
                onOpenEvidence={() => open(citation)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
