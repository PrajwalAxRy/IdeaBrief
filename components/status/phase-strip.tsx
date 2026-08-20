import { formatElapsed } from '@/lib/format';
import type { RunPhaseName } from '@/lib/schemas/run';

const PHASES: { key: RunPhaseName; label: string }[] = [
  { key: 'searching', label: 'Searching' },
  { key: 'fetching', label: 'Fetching' },
  { key: 'verifying', label: 'Verifying' },
  { key: 'writing', label: 'Writing' },
];

/** Four named phases + elapsed time. No percentage, anywhere. */
export function PhaseStrip({
  phase,
  elapsedMs,
  className = '',
}: {
  phase: RunPhaseName;
  elapsedMs: number;
  className?: string;
}) {
  const currentIndex = PHASES.findIndex((entry) => entry.key === phase);

  return (
    <div className={['phase-strip', className].filter(Boolean).join(' ')}>
      <ol className="phase-strip-list">
        {PHASES.map((entry, index) => (
          <li
            key={entry.key}
            className={[
              'phase-strip-item',
              index === currentIndex ? 'phase-strip-item--active' : '',
              index < currentIndex ? 'phase-strip-item--done' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {entry.label}
          </li>
        ))}
      </ol>
      <span className="meta-line">{formatElapsed(elapsedMs)}</span>
    </div>
  );
}
