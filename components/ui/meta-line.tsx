/**
 * Monospace `//`-separated technical metadata. `parts` must be real values —
 * this component should never be handed decorative data.
 */
export function MetaLine({ parts, className = '' }: { parts: string[]; className?: string }) {
  return <p className={['meta-line', className].filter(Boolean).join(' ')}>{parts.join(' // ')}</p>;
}
