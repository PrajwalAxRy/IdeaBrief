import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import type { Competitor } from '@/lib/schemas/report';

const NOT_ESTABLISHED = 'not established from available evidence';

function CompetitorField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="evidence-field-label">{label}</span>
      <p style={{ color: value ? 'var(--text-body)' : 'var(--text-muted)' }}>
        {value ?? NOT_ESTABLISHED}
      </p>
    </div>
  );
}

/**
 * Field-rendered competitor profile — never prose, so the numbers can't
 * drift (07). Missing optional fields render `not established from
 * available evidence`, never omitted, never guessed.
 */
export function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <Card padding="compact" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-h3)' }}>
          {competitor.name}
        </span>
        <span className="meta-line">{competitor.geography}</span>
        <span className="meta-line">{competitor.price}</span>
      </div>
      <Divider />
      <p style={{ color: 'var(--text-body)' }}>{competitor.difference_from_idea}</p>
      <Accordion title="Moat · take · ignore">
        <div className="flex flex-col gap-4">
          <CompetitorField label="Moat" value={competitor.moat} />
          <CompetitorField label="Take from them" value={competitor.take_from_them} />
          <CompetitorField label="Ignore" value={competitor.ignore} />
        </div>
      </Accordion>
    </Card>
  );
}
