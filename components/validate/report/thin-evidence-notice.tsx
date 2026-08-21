import { REPORT } from '@/lib/content/app';
import Link from 'next/link';

/**
 * The honest panel for low-yield runs. Diagnostic, never apologetic, never
 * encouraging — **apologise exactly once**, then get on with it.
 *
 * **Its CTA is ghost, not primary.** `UnansweredSection` owns the page's only
 * primary in both variants; two of them on one page is rule 11's exact failure.
 */
export function ThinEvidenceNotice({ slug }: { slug: string }) {
  return (
    <div className="ob-report-full ob-thin-notice">
      <p className="ob-h3">{REPORT.thin.title}</p>
      <p className="ob-body">{REPORT.thin.body}</p>
      <Link href={`/r/${slug}/roadmap`} className="ob-btn ob-btn-ghost">
        {REPORT.thin.action}
      </Link>
    </div>
  );
}
