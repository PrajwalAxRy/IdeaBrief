import { REPORT } from '@/lib/content/app';
import type { UnansweredItem } from '@/lib/schemas/report';
import Link from 'next/link';

interface UnansweredSectionProps {
  unanswered: UnansweredItem[];
  slug: string;
  /** Thin variant: this section takes the weight normally spent on surprises. */
  elevated?: boolean;
}

/**
 * §06 — the deliberate on-ramp into the roadmap. **The report ends pointing
 * forward; that is its job.**
 *
 * It owns **the page's only `.ob-btn-primary`, in both variants** —
 * `ThinEvidenceNotice`'s CTA is ghost precisely so this one stays unique
 * (rule 11).
 *
 * `why_unanswered` is rendered, not dropped: the difference between a gap and
 * an omission is *why the web couldn't say*.
 */
export function UnansweredSection({ unanswered, slug, elevated = false }: UnansweredSectionProps) {
  return (
    <div data-elevated={elevated || undefined}>
      <p className="ob-lead">{REPORT.unanswered.lead(unanswered.length)}</p>

      {unanswered.map((item, index) => (
        <div key={item.question} className="ob-unans-row">
          <span className="ob-unans-ord ob-meta">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <p className={elevated ? 'ob-h3' : 'ob-body'}>{item.question}</p>
            <p className="ob-unans-why">{item.why_unanswered}</p>
          </div>
        </div>
      ))}

      <p className="ob-body">{REPORT.unanswered.line}</p>

      <Link href={`/r/${slug}/roadmap`} className="ob-btn ob-btn-primary">
        {REPORT.unanswered.action}
      </Link>
    </div>
  );
}
