import { META_SEPARATOR } from '@/lib/content/app';

interface MetaLineProps {
  parts: string[];
  tone?: 'dim' | 'bright';
  className?: string;
}

/**
 * Monospace technical metadata. `parts` must be real values — this component is
 * never handed decorative data.
 *
 * **It wraps; it does not truncate (R21).** The old `.meta-line`'s
 * `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` clipped the
 * price off every `CompetitorCard` — the single most decision-relevant field on
 * the card — in a 2-col grid inside a 600px column, and carried the same risk
 * on `DimensionSection`. That triple is deleted, not translated.
 *
 * The separator lives inside the *following* part's span so it can never orphan
 * onto the start of a wrapped line, and is `aria-hidden` so it is never spoken.
 * Parts join on `META_SEPARATOR`, never a literal.
 */
export function MetaLine({ parts, tone = 'dim', className = '' }: MetaLineProps) {
  const classes = ['ob-metaline', 'ob-meta', tone === 'bright' ? 'ob-meta-bright' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={classes}>
      {parts.map((part, index) =>
        index === 0 ? (
          <span key={part}>{part}</span>
        ) : (
          <span key={part} className="ob-metaline-part">
            <span className="ob-metaline-sep" aria-hidden="true">
              {META_SEPARATOR.trim()}
            </span>
            {part}
          </span>
        ),
      )}
    </p>
  );
}
