import { APP_CONSOLE } from '@/lib/content/app';
import { formatElapsed } from '@/lib/format';
import type { RunPhaseName } from '@/lib/schemas/run';

/**
 * Four named phases and the elapsed time. **No percentage and no ETA, ever** —
 * the product does not know how long this takes and will not pretend to.
 *
 * State is a `data-state` attribute, not a `--modifier` class: one component
 * cannot be driven by two APIs, and an attribute is what an exit test can read
 * back. `pending` · `active` · `done`.
 *
 * The active phase is preceded by a pulsing `.ob-dot` — accent, and one of
 * blue's three jobs: live state. **Exactly one `.ob-dot` is ever visible on
 * this page**, which is why the dot is here and not on the queries or the
 * findings.
 */
export function PhaseStrip({
  phase,
  elapsedMs,
  state,
  note,
  className = '',
}: {
  phase: RunPhaseName;
  elapsedMs: number;
  state: 'connecting' | 'running' | 'stalled' | 'complete';
  note?: string;
  className?: string;
}) {
  const currentIndex = APP_CONSOLE.phases.findIndex((entry) => entry.key === phase);
  const done = state === 'complete';

  return (
    <div className={['ob-phase', className].filter(Boolean).join(' ')} data-state={state}>
      <ol className="ob-phase-list">
        {APP_CONSOLE.phases.map((entry, index) => {
          const itemState = done
            ? 'done'
            : index === currentIndex
              ? 'active'
              : index < currentIndex
                ? 'done'
                : 'pending';
          return (
            <li key={entry.key} className="ob-phase-item" data-state={itemState}>
              {itemState === 'active' ? <span className="ob-dot" aria-hidden="true" /> : null}
              {entry.label}
            </li>
          );
        })}
      </ol>
      <span className="ob-phase-clock">{formatElapsed(elapsedMs)}</span>
      {/* Permanently reserved, whether or not there is a note to put in it. */}
      <p className="ob-phase-note">{note ?? ''}</p>
    </div>
  );
}
