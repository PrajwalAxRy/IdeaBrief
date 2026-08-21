import type { ElementType, ReactNode } from 'react';

interface DisplayHeadlineProps {
  muted: ReactNode;
  bright: ReactNode;
  as?: ElementType;
  /** Which type scale to render at. Heading *level* is structure (C17); this
   *  is only size. */
  level?: 'display' | 'h1' | 'h2';
  /** Puts the muted/bright halves on separate lines instead of one. */
  breakBetween?: boolean;
  /** Renders the bright half first — some headlines lead with the emphasis. */
  reverse?: boolean;
  className?: string;
}

const LEVEL_CLASS = { display: 'ob-display', h1: 'ob-h1', h2: 'ob-h2' } as const;

/**
 * The muted/bright split headline — contrast is colour, never weight. Weight
 * stays 400 on both halves (rule 6).
 *
 * The split is inverted relative to Deep Canopy: Obsidian headings already
 * default to `--ob-text`, so the bright half needs no class at all and only the
 * muted half is marked. `.hl-bright` is deleted rather than translated.
 */
export function DisplayHeadline({
  muted,
  bright,
  as: Tag = 'h1',
  level = 'h1',
  breakBetween = false,
  reverse = false,
  className = '',
}: DisplayHeadlineProps) {
  const mutedSpan = <span className="ob-hl-muted">{muted}</span>;
  const brightSpan = <span>{bright}</span>;
  const separator = breakBetween ? <br /> : ' ';

  return (
    <Tag className={[LEVEL_CLASS[level], className].filter(Boolean).join(' ')}>
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
