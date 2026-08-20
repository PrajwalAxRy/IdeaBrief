import { SectionLabel } from '@/components/ui/section-label';
import { renderCitedText } from '@/components/validate/evidence/cited-text';
import type { CitedText } from '@/lib/schemas/report';

/**
 * "What we found" — the whole report in 20 seconds. Every sentence carries
 * at least one citation, enforced at the schema layer (`CitedTextSchema`'s
 * `.refine()`), not re-checked here.
 */
export function SummarySection({ summary }: { summary: CitedText }) {
  return (
    <section id="what-we-found" className="report-section flex flex-col gap-4">
      <SectionLabel>What we found</SectionLabel>
      <p className="report-summary-text">
        {renderCitedText(summary.text, { firstChipGetsHint: true })}
      </p>
    </section>
  );
}
