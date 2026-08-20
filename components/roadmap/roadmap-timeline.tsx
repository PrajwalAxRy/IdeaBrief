import type { RoadmapPhase, RoadmapStep as RoadmapStepData } from '@/lib/schemas/roadmap';
import { RoadmapStep } from './roadmap-step';

/** The vertical spine — five fixed steps, named exactly as in the exec summary. */
export function RoadmapTimeline({
  steps,
  accentPhase,
}: {
  steps: RoadmapStepData[];
  accentPhase: RoadmapPhase;
}) {
  return (
    <ol className="roadmap-timeline">
      {steps.map((step) => (
        <RoadmapStep key={step.phase} step={step} accentPhase={accentPhase} />
      ))}
    </ol>
  );
}
