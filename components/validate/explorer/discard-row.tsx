import { SOURCES } from '@/lib/content/app';
import { formatDate, formatDomain } from '@/lib/format';
import {
  DIMENSION_SHORT,
  DISCARD_REASON_LABEL,
  type DiscardedFinding,
} from '@/lib/schemas/evidence';
import { rowDelay } from './evidence-row';

/**
 * One discarded record — D15's trust claim, in the list rather than in a
 * footnote.
 *
 * **The 18 interleave with the verified rows in the default view, sorted by the
 * same key.** Seeing a discard land between two verified findings, mid-scroll,
 * is the claim. A grey sentence under a divider after 47 rows of scrolling is
 * not.
 *
 * **A `DiscardedFinding` has no `text` field and none is added** (C9) — the
 * excerpt never became a finding, so there is no claim to render and none is
 * invented. The row leads with the struck excerpt, at `--ob-body`, because it
 * is the thing that failed.
 *
 * **The reason is sans at `--ob-sm` in `--ob-muted`; only the `DISCARDED — `
 * prefix is mono `--ob-discard`.** Two load-bearing reasons: `--ob-discard`
 * measures 2.25:1 on canvas and is deliberately illegible, so setting the one
 * string D15 exists to surface in it would defeat the feature; and the labels
 * are sentences with verbs in them, which the mono meta layer does not carry.
 *
 * **Never red. There is no red in this system.** A discard is a non-event, not
 * an error.
 */
export function DiscardRow({
  record,
  index,
  onOpen,
}: {
  record: DiscardedFinding;
  index: number;
  onOpen: () => void;
}) {
  return (
    <li
      className="ob-src-row ob-src-row--discarded"
      style={{ ['--ob-src-delay' as string]: rowDelay(index) }}
    >
      {/* No citation number — it was never admitted to the corpus. */}
      <div className="ob-src-num">
        <span className="ob-src-tick" aria-hidden="true" />
      </div>

      <div className="ob-src-class">
        <span className="ob-src-dim ob-meta">{DIMENSION_SHORT[record.dimension]}</span>
        {/* No stance mark: a discarded excerpt takes no position on anything. */}
        <span className="ob-src-discarded ob-meta">{SOURCES.row.discarded}</span>
      </div>

      <div className="ob-src-body">
        <button
          type="button"
          className="ob-src-open ob-src-excerpt"
          onClick={onOpen}
          aria-label={SOURCES.row.openDiscard(record.id)}
        >
          {record.excerpt}
        </button>
        <p className="ob-src-reason">
          <span className="ob-src-reason-prefix">{SOURCES.row.discardPrefix}</span>
          {DISCARD_REASON_LABEL[record.discard_reason]}
        </p>
        {/* A1 asserts every one of these is one of the 19 RUN_QUERIES; this is
            where that assertion becomes visible. */}
        <p className="ob-src-query">{SOURCES.row.foundBy(record.attempted_query)}</p>
      </div>

      <div className="ob-src-meta">
        <span className="ob-src-domain ob-meta">{formatDomain(record.source_url)}</span>
        <span className="ob-src-date ob-meta">{formatDate(record.source_date)}</span>
        <a
          className="ob-src-out"
          href={record.source_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOURCES.row.outLabel}
        >
          ↗
        </a>
      </div>
    </li>
  );
}
