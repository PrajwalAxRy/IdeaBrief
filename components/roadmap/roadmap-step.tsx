'use client';

import { ROADMAP } from '@/lib/content/app';
import type { PlanSpan } from '@/lib/run-plan';
import { ROADMAP_PHASE_LABEL } from '@/lib/schemas/roadmap';
import { DependencyChips } from './dependency-chip';
import { NotInItList } from './not-in-it-list';
import { useRoadmapNav } from './roadmap-context';

/**
 * One block under the week axis, in axis order.
 *
 * The 160px left gutter is deliberately the same as A11's `.ob-oq-grid`, so
 * both halves of the page share one left edge. Its span line is **composed
 * from the `PlanSpan`** — `W1–W2 · 2 WEEKS`, `W12 · ONGOING` — and never
 * typed; the fixture carries weeks, not sentences.
 *
 * **The lead step's emphasis is size, not colour.** Its name renders at
 * `--ob-h2` against every other name's `--ob-h3`, matching the one solid bar on
 * the axis. `accentPhase` kept its name through A12 and nothing about it is
 * accent-coloured — blue's three jobs are action, verification and live/active,
 * and "build this first" is none of them.
 *
 * What survived the rebuild, because both directions of the dependency wiring
 * address steps through them: `id="step-{PHASE}"` and `data-pulse`.
 */
export function RoadmapStep({ span, lead }: { span: PlanSpan; lead: boolean }) {
  const { isPulsing } = useRoadmapNav();
  const { step } = span;
  const pulsing = isPulsing(`step-${step.phase}`);
  const subtitle = ROADMAP.plan.subtitles[step.phase];

  return (
    <li id={`step-${step.phase}`} className="ob-plan-step" data-pulse={pulsing ? '' : undefined}>
      <p className="ob-plan-span">{ROADMAP.plan.span(span.startWeek, span.endWeek)}</p>

      <div className="ob-plan-body">
        <h3 className={lead ? 'ob-plan-name ob-plan-name--lead' : 'ob-plan-name'}>
          {ROADMAP_PHASE_LABEL[step.phase]}
        </h3>
        {subtitle ? <p className="ob-plan-sub">{subtitle}</p> : null}
        <p className="ob-plan-desc">{step.description}</p>
        {step.cut_list && step.cut_list.length > 0 ? <NotInItList items={step.cut_list} /> : null}
        <DependencyChips questionIds={step.dependencies} />
      </div>
    </li>
  );
}
