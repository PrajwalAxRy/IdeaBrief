/**
 * The three-dot "AI is composing" indicator. Opacity cycle, no text.
 *
 * Deliberately `--ob-dim`, not accent: blue's live-state job belongs to the run
 * stream's `.ob-dot`, and a blue typing indicator would make blue mean
 * "waiting".
 */
export function RestIndicator({ className = '' }: { className?: string }) {
  return (
    <output
      aria-label="AI is composing"
      className={['ob-rest', className].filter(Boolean).join(' ')}
    >
      <span className="ob-rest-dot" />
      <span className="ob-rest-dot" />
      <span className="ob-rest-dot" />
    </output>
  );
}
