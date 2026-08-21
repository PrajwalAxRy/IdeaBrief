import { APP_CONSOLE } from '@/lib/content/app';
import { formatDomain } from '@/lib/format';
import { DISCARD_REASON_LABEL, type DiscardedFinding } from '@/lib/schemas/evidence';
import Link from 'next/link';

/**
 * Trust device 4 — the discard count, and what it now says.
 *
 * **One discard at a time, live, never a list.** A number is a claim; one
 * visible reason is proof. One slot costs no vertical growth and no attention,
 * and it is the same argument the landing page's verification section makes by
 * letting one of three excerpts fail. All eighteen live on `/sources`.
 *
 * The reason renders through `DISCARD_REASON_LABEL` (C3, C9) and never as the
 * enum key — and it is **sans, `--ob-muted`, never `--ob-discard`**, which
 * measures 2.25:1 and is deliberately illegible. Only the `LAST ·` prefix and
 * the domain wear the discard grey.
 */
export function DiscardTicker({
  count,
  last,
  running,
  slug,
}: {
  count: number;
  last: DiscardedFinding | null;
  running: boolean;
  slug: string;
}) {
  return (
    <div className="ob-discard-block">
      <p className="ob-discard-count">
        <span className="ob-em">{count}</span> {APP_CONSOLE.discardSuffix}
        <br />
        {APP_CONSOLE.discardParen}
      </p>

      {/* A fixed slot at a permanent height: all four reason labels occupy the
          same two sans lines in a 320px rail, so a swap never moves the rail. */}
      <div className="ob-discard-last" data-swap={last?.id ?? 'none'}>
        {running ? (
          last && (
            <>
              <p className="ob-discard-last-meta">
                {APP_CONSOLE.discardLastPrefix} · {formatDomain(last.source_url)}
              </p>
              <p className="ob-discard-last-reason">{DISCARD_REASON_LABEL[last.discard_reason]}</p>
            </>
          )
        ) : (
          <p className="ob-discard-done">
            {APP_CONSOLE.discardDone(count)}{' '}
            <Link href={`/r/${slug}/sources`} className="ob-text-action">
              {APP_CONSOLE.discardDoneAction}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
