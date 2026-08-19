/** The three-dot "AI is composing" indicator. Opacity cycle, no text. */
export function RestIndicator({ className = '' }: { className?: string }) {
  return (
    <output
      aria-label="AI is composing"
      className={['rest-indicator', className].filter(Boolean).join(' ')}
    >
      <span className="rest-indicator-dot" />
      <span className="rest-indicator-dot" />
      <span className="rest-indicator-dot" />
    </output>
  );
}
