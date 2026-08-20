import { VerifiedBadge } from '@/components/status/verified-badge';
import { Card } from '@/components/ui/card';
import { Well } from '@/components/ui/well';
import { formatDomain } from '@/lib/format';
import type { Dimension, Finding } from '@/lib/schemas/evidence';

const DIMENSION_CARD_LABEL: Record<Dimension, string> = {
  PROBLEM: 'THE PROBLEM',
  WHAT_EXISTS: 'WHAT EXISTS',
  DEMAND_SIGNALS: 'DEMAND SIGNALS',
  MONEY: 'MONEY',
  PRACTICAL: 'PRACTICAL',
};

interface FindingCardProps {
  finding: Finding;
  variant: 'stream' | 'accordion' | 'row';
  /** Stream only — plays the entrance + delayed-badge animation for a just-verified card. */
  entering?: boolean;
  /**
   * Click-to-open-evidence handler. Left undefined in Server Component call
   * sites (the Report's dimension accordions, per P8: "the interactive
   * islands are CitationChip, Accordion, and SectionIndex only") — `FindingCard`
   * itself never needs `'use client'` because it only ever attaches an
   * `onClick` when a caller that's already inside a client subtree
   * (`FindingStream`, `SourcesList`) supplies one.
   */
  onOpenEvidence?: () => void;
  /** Row variant only — the sources page's leading `[03]` citation number. */
  citationNumber?: number;
}

/**
 * One verified finding: dimension, `VerifiedBadge`, claim, excerpt `Well`,
 * source line — the most reused product component (10-component-system.md).
 * `variant` selects layout, not a distinct component, per convention ⑥.
 */
export function FindingCard({
  finding,
  variant,
  entering = false,
  onOpenEvidence,
  citationNumber,
}: FindingCardProps) {
  const dimensionLabel = DIMENSION_CARD_LABEL[finding.dimension];
  const clickable = Boolean(onOpenEvidence);

  const header = (
    <div className="finding-card-header">
      <span className="finding-card-dimension">
        {variant === 'row' && citationNumber !== undefined && (
          <span className="finding-card-citation">[{String(citationNumber).padStart(2, '0')}]</span>
        )}
        {dimensionLabel}
      </span>
      <VerifiedBadge />
    </div>
  );

  const body = (
    <>
      {header}
      <p className="finding-card-text">{finding.text}</p>
      {variant === 'row' ? (
        <p className="finding-card-excerpt finding-card-excerpt--plain">
          &ldquo;{finding.excerpt}&rdquo;
        </p>
      ) : (
        <Well className="finding-card-excerpt">
          <p>&ldquo;{finding.excerpt}&rdquo;</p>
        </Well>
      )}
      <p className="finding-card-source-line">
        <span>{formatDomain(finding.source_url)}</span>
        <span aria-hidden="true"> · </span>
        <span>{finding.source_date}</span>
        {variant === 'row' && (
          <>
            <span aria-hidden="true"> · </span>
            <span>{finding.stance}</span>
          </>
        )}
        <a
          href={finding.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="finding-card-source-link"
          // Only attached when `clickable` — otherwise this renders from a plain
          // Server Component (the Report's accordion variant), which cannot
          // attach any event handler, not even a no-op one (verified live: Next
          // throws "Event handlers cannot be passed to Client Component props").
          onClick={clickable ? (event) => event.stopPropagation() : undefined}
          aria-label={`Open source: ${finding.source_url}`}
        >
          ↗
        </a>
      </p>
    </>
  );

  if (variant === 'row') {
    return (
      <div
        className={['finding-row', clickable ? 'finding-row--clickable' : '']
          .filter(Boolean)
          .join(' ')}
        onClick={onOpenEvidence}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenEvidence?.();
                }
              }
            : undefined
        }
      >
        {body}
      </div>
    );
  }

  return (
    <Card
      interactive={clickable}
      padding="compact"
      className={['finding-card', variant === 'stream' && entering ? 'finding-card--entering' : '']
        .filter(Boolean)
        .join(' ')}
      onClick={onOpenEvidence}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpenEvidence?.();
              }
            }
          : undefined
      }
    >
      {body}
    </Card>
  );
}
