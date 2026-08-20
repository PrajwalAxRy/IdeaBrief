/**
 * Per-dimension count bar, relative to the run's own maximum — not a
 * percentage of completion. Labelled with the raw count so the number, not
 * the bar, is the truth.
 */
export function CoverageBar({
  label,
  count,
  max,
  className = '',
}: {
  label: string;
  count: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, (count / max) * 100) : 0;

  return (
    <div className={['coverage-bar', className].filter(Boolean).join(' ')}>
      <span className="coverage-bar-label">{label}</span>
      <span className="coverage-track">
        <span className="coverage-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="coverage-bar-count meta-line">{count}</span>
    </div>
  );
}
