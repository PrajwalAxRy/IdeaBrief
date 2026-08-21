import { ROADMAP } from '@/lib/content/app';
import Link from 'next/link';

/**
 * The roadmap's terminal band. The run has no next stage, so this is where the
 * evidence layer and a new run are offered.
 *
 * The page used to dead-end: `← Back to the report` and a footer link, with
 * **nothing pointing at `/sources`** even though `FIND THEM` cites evidence on
 * every question card. `Everything we checked →` is the point of this band —
 * it is the only link to the explorer from this page, and D16's
 * `EvidenceButton` in the chrome is a layer, not a destination.
 *
 * **No `.ob-btn-primary` here.** A11's `Copy script` is this viewport's
 * primary, and standing rule 11 is per viewport, not per page.
 *
 * Server component; three links and a sentence.
 */
export function RoadmapExit({ slug }: { slug: string }) {
  return (
    <div className="ob-exit">
      <p className="ob-exit-label ob-meta">{ROADMAP.exit.label}</p>
      <p className="ob-exit-line ob-lead">{ROADMAP.exit.line}</p>
      <div className="ob-exit-actions">
        <Link href={`/r/${slug}/sources`} className="ob-btn-bare">
          {ROADMAP.exit.sources}
        </Link>
        <span className="ob-rule-v" aria-hidden="true" />
        <Link href={`/r/${slug}/validate`} className="ob-btn-bare">
          {ROADMAP.exit.report}
        </Link>
        <span className="ob-rule-v" aria-hidden="true" />
        <Link href="/" className="ob-btn-bare">
          {ROADMAP.exit.restart}
        </Link>
      </div>
    </div>
  );
}
