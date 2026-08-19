import type { ElementType, ReactNode } from 'react';

interface DisplayHeadlineProps {
  muted: ReactNode;
  bright: ReactNode;
  as?: ElementType;
  /** Puts the muted/bright halves on separate lines instead of one. */
  breakBetween?: boolean;
  className?: string;
}

/**
 * Muted/bright split headline (skill rule ②) — contrast is colour, never
 * weight. Takes `muted` and `bright` props so the split can't be applied
 * inconsistently by a call site writing raw spans.
 */
export function DisplayHeadline({
  muted,
  bright,
  as: Tag = 'h1',
  breakBetween = false,
  className = '',
}: DisplayHeadlineProps) {
  return (
    <Tag className={['display-headline', className].filter(Boolean).join(' ')}>
      <span className="hl-muted">{muted}</span>
      {breakBetween ? <br /> : ' '}
      <span className="hl-bright">{bright}</span>
    </Tag>
  );
}
