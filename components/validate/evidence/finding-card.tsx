import { VerifiedBadge } from '@/components/status/verified-badge';
import { APP_EVIDENCE } from '@/lib/content/app';
import { formatDate, formatDomain } from '@/lib/format';
import { DIMENSION_LABEL, type Finding } from '@/lib/schemas/evidence';
import { StanceMark } from './stance-mark';

interface FindingCardProps {
  finding: Finding;
  variant: 'stream' | 'accordion' | 'row';
  /** Stream only — A8 flips this; A5 supplies the CSS the flip drives. */
  state?: 'pending' | 'verified';
  /**
   * The claim becomes a `<button>` when this is supplied. Left undefined in
   * Server Component call sites (the report's dimension accordions), which is
   * why this component itself never needs `'use client'`.
   */
  onOpenEvidence?: () => void;
  /** Row variant — the explorer's leading `[03]`. Outside prose, so legal (C12). */
  citationNumber?: number;
  /** From `citedFindingIds(report)`. Renders `CITED` when true and **nothing**
   *  when false: 23 of 47 findings are cited nowhere, and labelling them
   *  "uncited" would read as a verdict on them. Absence is the signal. */
  citedInReport?: boolean;
}

/**
 * One verified finding — the most reused product component. `variant` selects
 * layout, not a distinct component.
 *
 * **R12 is dead, and the fix deletes three hacks at once.** This used to be a
 * `<div role="button" tabIndex={0} onKeyDown>` wrapping an `<a>`: nested
 * interactive content, a screen reader announcing the whole row as one enormous
 * button label, a `stopPropagation` on the anchor, and a "only attach onClick
 * when a client caller supplies one" contortion. **The card is not the button;
 * the claim is.** A real `<button>` gets Enter and Space for free, and with no
 * ancestor handler there is nothing left to stop propagating.
 *
 * **Stance renders in all three variants.** It used to render only in the
 * drawer and the row, which meant that in the console stream and in every
 * report accordion a finding that contradicts the idea was pixel-identical to
 * one that supports it. For a product whose entire pitch is honest evidence,
 * that was the worst omission in the app.
 */
export function FindingCard({
  finding,
  variant,
  state,
  onOpenEvidence,
  citationNumber,
  citedInReport = false,
}: FindingCardProps) {
  const citationLabel =
    citationNumber === undefined ? undefined : `[${String(citationNumber).padStart(2, '0')}]`;

  return (
    <article
      className="ob-finding"
      data-variant={variant}
      data-stance={finding.stance}
      data-state={variant === 'stream' ? state : undefined}
    >
      <header className="ob-finding-head gap-3">
        {citationLabel && <span className="ob-meta">{citationLabel}</span>}
        <span className="ob-meta">{DIMENSION_LABEL[finding.dimension]}</span>
        <StanceMark stance={finding.stance} />
        {citedInReport && (
          <span className="ob-finding-cited ob-meta" title={APP_EVIDENCE.citedTitle}>
            {APP_EVIDENCE.citedMarker}
          </span>
        )}
        <VerifiedBadge />
      </header>

      {onOpenEvidence ? (
        <button
          type="button"
          className="ob-finding-claim"
          onClick={onOpenEvidence}
          aria-label={`Open evidence ${citationNumber ?? ''}: ${finding.text}`}
        >
          {finding.text}
        </button>
      ) : (
        <p className="ob-finding-claim">{finding.text}</p>
      )}

      <blockquote className="ob-finding-excerpt">{finding.excerpt}</blockquote>

      {/* Always in the DOM in the stream variant so its 1px is reserved from
          the first frame (rule 12). `display: none` in the other two —
          verification happened minutes ago. */}
      <div className="ob-verify-rule" aria-hidden="true" />

      <p className="ob-finding-source">
        <a
          className="ob-finding-source-link"
          href={finding.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatDomain(finding.source_url)}{' '}
          <span className="ob-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
        <span className="ob-meta">{formatDate(finding.source_date)}</span>
      </p>
    </article>
  );
}
