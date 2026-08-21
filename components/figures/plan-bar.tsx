import type { PlanSpan } from '@/lib/run-plan';

/**
 * One roadmap step, placed on the `WeekAxis`'s tracks.
 *
 * A12 amended A3's signature: it takes a `PlanSpan` straight from `planSpans`
 * rather than four loose numbers, because four loose numbers is four places the
 * week model can be re-derived wrongly. One component, one signature — the old
 * props are deleted, not deprecated.
 *
 * `span.openEnded` is **open-ended**: the bar runs from its start to the axis
 * end and its right edge dissolves under a mask — no hard stop under the words
 * "later, and only if", and no invented end week. It is the only bar with no
 * end, which is the whole point, and it is the visual form of
 * `duration_weeks: null`.
 *
 * **`.ob-plan-bar-conditional` is gone.** Its hatch said *conditional*; under
 * C5 the fourth lane's actual property is *no end*, which `.ob-plan-bar--open`
 * already states. Two treatments for one bar is how a figure grows a second
 * meaning.
 *
 * **Four bars, never five.** The fifth step is the tripwire, which D13 lifts
 * off the axis into `TripwirePanel`; `isOnAxis(step)` is the only test for
 * whether a step gets a bar.
 *
 * **`lead` is not blue.** Blue has three jobs — action, verification,
 * live/active — and "the step to build first" is none of them. The emphasis is
 * scale and fill: the only solid `--ob-text` bar against three hairline ones,
 * which survives a screenshot, reduced motion and greyscale.
 */
export function PlanBar({
  span,
  name,
  lead,
  onSelect,
  cols,
  row,
  revealed,
  delayMs = 0,
}: {
  span: PlanSpan;
  /** Sentence-case from `ROADMAP_PHASE_LABEL`; CSS uppercases it. */
  name: string;
  lead: boolean;
  onSelect: () => void;
  /** `planHorizon(roadmap)` — the last track the open-ended bar runs to. */
  cols: number;
  /** 1-based lane. **Explicit, because grid's default sparse auto-placement
   *  would happily pack W3–W6 into the same row as W1–W2.** */
  row: number;
  /** Drives `.ob-reveal`'s `data-shown`; the stagger is CSS, never per-frame JS. */
  revealed: boolean;
  delayMs?: number;
}) {
  const weeks = span.openEnded
    ? cols - span.startWeek + 1
    : (span.endWeek as number) - span.startWeek + 1;

  const className = [
    'ob-plan-bar',
    'ob-reveal',
    lead ? 'ob-plan-bar--lead' : '',
    span.openEnded ? 'ob-plan-bar--open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const description = span.openEnded
    ? `week ${span.startWeek} onward, open-ended`
    : `weeks ${span.startWeek} to ${span.endWeek}`;

  return (
    <button
      type="button"
      className={className}
      data-shown={revealed}
      onClick={onSelect}
      style={{
        gridColumn: `${span.startWeek} / span ${weeks}`,
        gridRow: String(row),
        ['--ob-reveal-delay' as string]: `${delayMs}ms`,
      }}
    >
      <span className="ob-plan-bar-label">{name}</span>
      <span className="sr-only">, {description}</span>
    </button>
  );
}
