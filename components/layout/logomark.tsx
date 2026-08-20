/**
 * The IdeaBrief mark: a cut-gem facet standing in for "vague idea → clear,
 * verified brief". Pure `currentColor` strokes so it inherits the wordmark
 * link's colour (and its hover transition to `--accent`) with no colour value
 * of its own — see styles/tokens.css rule 1.
 */
export function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M9 1L16 6.5L9 17L2 6.5L9 1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.5H16"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path d="M6.6 6.5L9 17" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <path d="M11.4 6.5L9 17" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <path d="M9 1L6.6 6.5" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <path d="M9 1L11.4 6.5" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
    </svg>
  );
}
