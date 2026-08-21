import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** The hover treatment. Only for cards that are themselves clickable. */
  interactive?: boolean;
  /**
   * An accent hairline, and nothing else — no glow, no wash fill.
   *
   * **Legal only where the object genuinely passed verification**: a verified
   * `FindingCard`, the approved brief, `EvidenceState`'s strong-on column. It
   * is not an emphasis prop. Where the old `featured` meant "make this
   * important", the house answer is a left hairline in the `.ob-proof` style.
   */
  verified?: boolean;
  padding?: 'compact' | 'feature' | 'none';
}

/**
 * The base surface: a hairline border and a surface lightness step. No shadow,
 * no inset highlight, no gradient (standing rule 7) — elevation is a border and
 * a surface step. Never nests; use `Well` instead.
 */
export function Card({
  interactive = false,
  verified = false,
  padding = 'compact',
  className = '',
  ...props
}: CardProps) {
  const paddingClass = padding === 'compact' ? 'p-6' : padding === 'feature' ? 'p-8' : '';
  const classes = [
    'ob-card',
    interactive ? 'ob-card-interactive' : '',
    verified ? 'ob-card-verified' : '',
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}
