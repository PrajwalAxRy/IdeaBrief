'use client';

import { PlanBar } from '@/components/figures/plan-bar';
import { WeekAxis } from '@/components/figures/week-axis';
import { ROADMAP } from '@/lib/content/app';
import { useInView } from '@/lib/hooks/use-in-view';
import type { PlanSpan } from '@/lib/run-plan';
import { ROADMAP_PHASE_LABEL, type RoadmapPhase } from '@/lib/schemas/roadmap';
import { useRoadmapNav } from './roadmap-context';
import { RoadmapStep } from './roadmap-step';

/** D17's structural stagger: four lanes, 120ms apart. Inside A15's "never more than six". */
const LANE_STAGGER_MS = 120;

/**
 * §02's axis half — the shared week ruler, four bars on it, and the four step
 * blocks beneath it in axis order.
 *
 * **This replaced a decorative vertical spine with five equal dots.** The old
 * `.timeline-node` / `.timeline-node--accent` / `.timeline-node--pulse` triple
 * was emitted by a shipped component and defined in no stylesheet (R2), so the
 * entire `isThin → accentPhase` computation produced zero pixels. `TimelineNode`
 * is deleted rather than styled; the emphasis moved onto the bar, where it is
 * scale and fill rather than a dot.
 *
 * **The tripwire is not here.** `planSpans` filters on `isOnAxis`, so a
 * `kind: 'tripwire'` step gets no bar and no block — it lifts into
 * `TripwirePanel` below. Four bars, never five.
 *
 * `'use client'` because the bars scroll-and-pulse their own step block, which
 * is `RoadmapProvider`'s job, and because the lane stagger latches on an
 * IntersectionObserver. The bars themselves stay presentational.
 */
export function RoadmapTimeline({
  spans,
  horizon,
  accentPhase,
}: {
  spans: PlanSpan[];
  horizon: number;
  accentPhase: RoadmapPhase;
}) {
  const { scrollToStep } = useRoadmapNav();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  const definite = spans.filter((span) => !span.openEnded).length;
  const open = spans.length - definite;

  return (
    <div className="ob-plan">
      {/* The observer sits on the lane block, not on each bar: one observer,
          four CSS transition delays, and nothing runs per frame. */}
      <div ref={ref}>
        <WeekAxis weeks={horizon} caption={ROADMAP.plan.axisCaption(horizon, definite, open)}>
          {spans.map((span, index) => (
            <PlanBar
              key={span.step.id}
              span={span}
              cols={horizon}
              row={index + 1}
              name={ROADMAP_PHASE_LABEL[span.step.phase]}
              lead={span.step.phase === accentPhase}
              revealed={inView}
              delayMs={index * LANE_STAGGER_MS}
              onSelect={() => scrollToStep(span.step.phase)}
            />
          ))}
        </WeekAxis>
      </div>

      <ol className="ob-plan-steps">
        {spans.map((span) => (
          <RoadmapStep key={span.step.id} span={span} lead={span.step.phase === accentPhase} />
        ))}
      </ol>
    </div>
  );
}
