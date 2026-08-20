import type { ElementType, ReactNode } from 'react';

interface DisplayHeadlineProps {
  muted: ReactNode;
  bright: ReactNode;
  as?: ElementType;
  /** Puts the muted/bright halves on separate lines instead of one. */
  breakBetween?: boolean;
  /** Renders the bright half first — some headlines (e.g. the trust section) lead with the emphasis. */
  reverse?: boolean;
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
  reverse = false,
  className = '',
}: DisplayHeadlineProps) {
  const mutedSpan = <span className="hl-muted">{muted}</span>;
  const brightSpan = <span className="hl-bright">{bright}</span>;
  const separator = breakBetween ? <br /> : ' ';

  return (
    <Tag className={['display-headline', className].filter(Boolean).join(' ')}>
      {reverse ? (
        <>
          {brightSpan}
          {separator}
          {mutedSpan}
        </>
      ) : (
        <>
          {mutedSpan}
          {separator}
          {brightSpan}
        </>
      )}
    </Tag>
  );
}
