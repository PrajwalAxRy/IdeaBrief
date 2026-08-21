'use client';

import { ROADMAP } from '@/lib/content/app';
import { ROADMAP_PHASE_LABEL, type RoadmapPhase } from '@/lib/schemas/roadmap';
import { useRoadmapNav } from './roadmap-context';

/**
 * The mechanism that justifies both roadmap halves living on one page.
 *
 * `DependencyChips` is the forward direction — a build step naming the open
 * questions it depends on. `ChangesLink` is the reverse — an open question
 * naming the steps its answer changes. Both scroll, expand the target where
 * relevant, and pulse it once so you can see where you landed.
 *
 * **Not a pill.** 4px radius; the pill radius belongs to buttons alone
 * (rule 8). `:active` is a 1px translate, never a scale.
 */
export function DependencyChips({ questionIds }: { questionIds: string[] }) {
  const { scrollToQuestion } = useRoadmapNav();
  if (questionIds.length === 0) return null;

  return (
    <p className="ob-dep-row">
      <span className="ob-meta">{ROADMAP.dependsOn}</span>
      {questionIds.map((id) => (
        <button key={id} type="button" className="ob-dep-chip" onClick={() => scrollToQuestion(id)}>
          {id}
        </button>
      ))}
    </p>
  );
}

export function ChangesLink({ phases }: { phases: RoadmapPhase[] }) {
  const { scrollToStep } = useRoadmapNav();
  if (phases.length === 0) return null;

  return (
    <p className="ob-dep-row ob-changes-row">
      <span className="ob-meta">{ROADMAP.changes}</span>
      {phases.map((phase) => (
        <button
          key={phase}
          type="button"
          className="ob-dep-chip"
          onClick={() => scrollToStep(phase)}
        >
          ▸ {ROADMAP_PHASE_LABEL[phase]}
        </button>
      ))}
    </p>
  );
}
