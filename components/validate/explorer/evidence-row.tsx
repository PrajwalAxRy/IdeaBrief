import { StanceMark } from '@/components/validate/evidence/stance-mark';
import { SOURCES } from '@/lib/content/app';
import { formatDate, formatDomain } from '@/lib/format';
import { DIMENSION_SHORT, type Finding } from '@/lib/schemas/evidence';

/** Capped at 12 rows / 264ms; rows past the cap arrive *with* row 12, never before it. */
const STAGGER_CAP = 11;
const STAGGER_STEP = 24;

export function rowDelay(index: number): string {
  return `${Math.min(index, STAGGER_CAP) * STAGGER_STEP}ms`;
}

/**
 * One verified record in the explorer, at a uniform 140px.
 *
 * Built **alongside** `FindingCard`, which keeps all three of its variants
 * (C13) — a row in a 65-record scan list and a card in report prose are not the
 * same reading job, and collapsing them would have cost one of the two.
 *
 * **R12 — the row carries no `role="button"`.** A div with a button role
 * wrapping an `<a>` is an interactive control inside an interactive control,
 * which is invalid and which screen readers resolve differently from each
 * other. `.ob-src-open` is a real `<button>` whose `::after` stretches over the
 * row; `.ob-src-out` sits above it on `z-index: 1` so the source link stays
 * separately clickable and separately tabbable. Tab order per row is button →
 * anchor.
 *
 * **The excerpt is clamped here and untruncated in the drawer.** It used to run
 * full-length, which is why rows ran 90–160px with no rhythm at all.
 */
export function EvidenceRow({
  finding,
  citationNumber,
  cited,
  index,
  onOpen,
}: {
  finding: Finding;
  citationNumber: number;
  cited: boolean;
  index: number;
  onOpen: () => void;
}) {
  return (
    <li className="ob-src-row" style={{ ['--ob-src-delay' as string]: rowDelay(index) }}>
      <div className="ob-src-num">
        <span className="ob-meta">[{String(citationNumber).padStart(2, '0')}]</span>
        {/* 47 rows shouting NOT CITED is noise; the facet does the counting. */}
        {cited ? <span className="ob-src-cited ob-meta">{SOURCES.row.cited}</span> : null}
      </div>

      <div className="ob-src-class">
        <span className="ob-src-dim ob-meta">{DIMENSION_SHORT[finding.dimension]}</span>
        <span className="ob-src-stance">
          <StanceMark stance={finding.stance} />
        </span>
      </div>

      <div className="ob-src-body">
        <button
          type="button"
          className="ob-src-open ob-src-text"
          onClick={onOpen}
          aria-label={SOURCES.row.openVerified(citationNumber)}
        >
          {finding.text}
        </button>
        <p className="ob-src-excerpt">{finding.excerpt}</p>
      </div>

      <div className="ob-src-meta">
        <span className="ob-src-domain ob-meta">{formatDomain(finding.source_url)}</span>
        <span className="ob-src-date ob-meta">{formatDate(finding.source_date)}</span>
        <a
          className="ob-src-out"
          href={finding.source_url}
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
