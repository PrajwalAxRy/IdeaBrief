/**
 * The Groundwork mark: a stroked square with a filled quarter set into its
 * lower-left — ground, and the piece of it that has been laid.
 *
 * Pure `currentColor` so it inherits whatever it sits in, with no colour value
 * of its own. **This is the repo's one glyph definition** — `Wordmark` renders
 * it rather than inlining a second copy, and so does the landing nav.
 */
export function LogoMark({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      className={['shrink-0', className].filter(Boolean).join(' ')}
    >
      <rect x="0.5" y="0.5" width="14" height="14" stroke="currentColor" />
      <rect x="1" y="9" width="5" height="5" fill="currentColor" />
    </svg>
  );
}
