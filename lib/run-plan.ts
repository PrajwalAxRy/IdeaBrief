import type { Roadmap, RoadmapStep } from './schemas/roadmap';

/**
 * The roadmap's week model (C5, D13).
 *
 * **No `leftPct` / `widthPct`, no `planLanes`, no `buildRunPlan`.** Pixel and
 * percentage geometry belongs to the CSS grid A12 builds; a percentage
 * returned from a pure module is a layout decision smuggled into the data
 * layer.
 */

export interface PlanSpan {
  step: RoadmapStep;
  startWeek: number;
  /** null when the step is open-ended. */
  endWeek: number | null;
  openEnded: boolean;
}

/**
 * The single place D13's "the tripwire is not a phase" becomes code. A step
 * that is not on the axis gets no bar — it lifts out into `TripwirePanel`.
 */
export function isOnAxis(step: RoadmapStep): boolean {
  return step.kind === 'build';
}

export function planSpans(roadmap: Roadmap): PlanSpan[] {
  return roadmap.steps.filter(isOnAxis).map((step) => {
    if (step.start_week === null) {
      throw new Error(`${step.id} is on the axis but has no start_week.`);
    }
    const openEnded = step.duration_weeks === null;
    return {
      step,
      startWeek: step.start_week,
      endWeek: openEnded ? null : step.start_week + (step.duration_weeks as number) - 1,
      openEnded,
    };
  });
}

/**
 * The visible `W1…W12` horizon. An open-ended step contributes only its start
 * week — it runs to the edge of the axis and dissolves rather than inventing
 * an end.
 */
export function planHorizon(roadmap: Roadmap): number {
  return planSpans(roadmap).reduce((max, span) => Math.max(max, span.endWeek ?? span.startWeek), 0);
}

/**
 * Question id → the steps naming it, in axis order, **tripwire included** —
 * the tripwire genuinely does depend on its questions.
 *
 * Returns the edges rather than a count because A11 needs to partition them
 * with `isOnAxis`; a count is `.length`. There is no `fanOutMax` — the meter's
 * denominator is the max over these lengths (3), and the caption's denominator
 * is the step count (5): `Q06 governs 3 of 5`.
 */
export function fanOut(roadmap: Roadmap): Record<string, RoadmapStep[]> {
  const out: Record<string, RoadmapStep[]> = {};
  for (const question of roadmap.open_questions) {
    out[question.id] = roadmap.steps.filter((step) => step.dependencies.includes(question.id));
  }
  return out;
}
