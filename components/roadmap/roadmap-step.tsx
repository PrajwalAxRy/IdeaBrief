import {
  ROADMAP_PHASE_LABEL,
  type RoadmapPhase,
  type RoadmapStep as RoadmapStepData,
} from '@/lib/schemas/roadmap';
import { DependencyChips } from './dependency-chip';
import { NotInItList } from './not-in-it-list';
import { TimelineNode } from './timeline-node';

const SUBTITLE: Partial<Record<RoadmapPhase, string>> = {
  FIRST_THING_TO_BUILD: 'the smallest version a real user could use',
};

/**
 * One block on the build-roadmap timeline. Plain Server Component — the
 * only client leaf inside it is `TimelineNode` (needs to know if it's the
 * current pulse target) and `DependencyChips` (needs to trigger a scroll).
 */
export function RoadmapStep({
  step,
  accentPhase,
}: {
  step: RoadmapStepData;
  accentPhase: RoadmapPhase;
}) {
  const isAccent = step.phase === accentPhase;

  return (
    <li id={`step-${step.phase}`} className="timeline-step">
      <TimelineNode phase={step.phase} accent={isAccent} />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="timeline-step-heading">{ROADMAP_PHASE_LABEL[step.phase]}</h3>
          {SUBTITLE[step.phase] && <span className="meta-line">{SUBTITLE[step.phase]}</span>}
        </div>
        <p style={{ color: 'var(--text-body)', lineHeight: 'var(--leading-relaxed)' }}>
          {step.description}
        </p>
        {step.cut_list && step.cut_list.length > 0 && <NotInItList items={step.cut_list} />}
        <div className="flex flex-wrap items-center gap-4">
          {step.estimate && <span className="meta-line">{step.estimate}</span>}
          <DependencyChips questionIds={step.dependencies} />
        </div>
      </div>
    </li>
  );
}
