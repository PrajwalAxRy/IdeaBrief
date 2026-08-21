import { APP_CONSOLE } from '@/lib/content/app';

/**
 * Per-dimension count bar, relative to the run's own maximum — **never a
 * percentage of completion, and never accent.** A coverage count is neither an
 * action, a verification, nor a live state, so under rule 5 the fill is chalk.
 * The raw count prints alongside in mono with tabular numerals: **the number
 * is the truth, the bar is the gesture.**
 *
 * The `thin` tag's column exists in the grid whether or not the tag is present
 * — `.ob-cov-count` is placed explicitly in column 4 — so the tag's arrival
 * shifts nothing (rule 12).
 *
 * `variant="bare"` is the track alone, for `DimensionStrip`, which supplies
 * its own label and count in a 5-up column and would be wrecked by the rail's
 * four-track grid. Additive: the rail is the default and owns the contract.
 */
export function CoverageBar({
  label,
  count,
  max,
  thin = false,
  variant = 'rail',
  className = '',
}: {
  label: string;
  count: number;
  max: number;
  thin?: boolean;
  variant?: 'rail' | 'bare';
  className?: string;
}) {
  const share = max > 0 ? Math.min(1, count / max) : 0;
  const track = (extra: string) => (
    <span className={['ob-cov-track', extra].filter(Boolean).join(' ')}>
      <span className="ob-cov-fill" style={{ ['--ob-cov-fill' as string]: String(share) }} />
    </span>
  );

  if (variant === 'bare') return track(className);

  return (
    <div className={['ob-cov-row', className].filter(Boolean).join(' ')}>
      <span className="ob-meta">{label}</span>
      {track('')}
      {thin ? <span className="ob-cov-thin">{APP_CONSOLE.thinTag}</span> : null}
      <span className="ob-cov-count">{count}</span>
    </div>
  );
}
