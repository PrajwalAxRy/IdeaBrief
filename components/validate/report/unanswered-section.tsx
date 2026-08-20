import { Card } from '@/components/ui/card';
import { SectionLabel } from '@/components/ui/section-label';
import Link from 'next/link';

interface UnansweredSectionProps {
  unanswered: string[];
  slug: string;
  /** Thin-variant treatment (07): expanded and given the visual weight normally spent on "What surprised us". */
  elevated?: boolean;
}

/**
 * "What we couldn't answer from the web" — the deliberate on-ramp into
 * Roadmap. Ends the page pointing forward with the report's one
 * `.btn-primary`.
 */
export function UnansweredSection({ unanswered, slug, elevated = false }: UnansweredSectionProps) {
  const body = (
    <>
      <SectionLabel>What we couldn&rsquo;t answer from the web</SectionLabel>
      <ul className="report-unanswered-list">
        {unanswered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p style={{ color: 'var(--text-body)' }}>
        These need real conversations. We&rsquo;ve written the scripts.
      </p>
      <Link href={`/r/${slug}/roadmap`} className="btn btn-primary self-start">
        What to do next →
      </Link>
    </>
  );

  return (
    <div id="unanswered" className="report-section flex flex-col gap-4">
      {elevated ? (
        <Card featured padding="feature" className="flex flex-col gap-4">
          {body}
        </Card>
      ) : (
        body
      )}
    </div>
  );
}
