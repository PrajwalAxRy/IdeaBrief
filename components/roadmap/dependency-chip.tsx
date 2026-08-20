'use client';

import { ROADMAP_PHASE_LABEL, type RoadmapPhase } from '@/lib/schemas/roadmap';
import { useRoadmapNav } from './roadmap-context';

/**
 * The mechanism that justifies both roadmap halves living on one page (08).
 * `DependencyChips` is the forward direction — a build step naming which
 * open questions it depends on. `ChangesLink` is the reverse — an open
 * question naming which build step(s) its answer changes. Both scroll,
 * (re-)expand the target where relevant, and pulse its ring once.
 */
export function DependencyChips({ questionIds }: { questionIds: string[] }) {
  const { scrollToQuestion } = useRoadmapNav();
  if (questionIds.length === 0) return null;

  return (
    <p className="dependency-chip-row">
      <span className="dependency-chip-label">◂ depends on</span>
      {questionIds.map((id) => (
        <button
          key={id}
          type="button"
          className="dependency-chip"
          onClick={() => scrollToQuestion(id)}
        >
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
    <p className="dependency-chip-row">
      <span className="dependency-chip-label">Changes:</span>
      {phases.map((phase) => (
        <button
          key={phase}
          type="button"
          className="dependency-chip"
          onClick={() => scrollToStep(phase)}
        >
          ▸ {ROADMAP_PHASE_LABEL[phase]}
        </button>
      ))}
    </p>
  );
}
