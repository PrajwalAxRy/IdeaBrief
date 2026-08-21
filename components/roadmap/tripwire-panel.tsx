'use client';

import { ROADMAP } from '@/lib/content/app';
import { ROADMAP_PHASE_LABEL, type RoadmapStep } from '@/lib/schemas/roadmap';
import { DependencyChips } from './dependency-chip';
import { useRoadmapNav } from './roadmap-context';

/**
 * D13, made into a component: `WHAT WOULD CHANGE THIS PLAN` lifts off the week
 * axis into its own band.
 *
 * **It sat on the same spine as three real build steps, with a dot and a
 * position in a sequence. A risk tripwire with a week number attached is a lie
 * about what it is** — it is not scheduled, it does not finish, and nothing
 * downstream waits on it. Off the axis, with its own label, it reads as the
 * thing it is.
 *
 * The heading is `<h3>` **level** at `--ob-h3` **size** (C17): it is one of the
 * route's eleven h3s, not a section heading. Level is structure, size is a
 * class.
 *
 * Keeps `id="step-WHAT_WOULD_CHANGE_THIS_PLAN"` and `data-pulse`, so A11's
 * reverse `ChangesLink` wiring needed no change at all.
 *
 * Under thin evidence it renders **above** the axis and takes the emphasis the
 * lead bar would otherwise have — there is no lead bar under thin, because
 * naming a first thing to build the evidence can't support is the one
 * judgement this product refuses to make.
 */
export function TripwirePanel({ step, thin = false }: { step: RoadmapStep; thin?: boolean }) {
  const { isPulsing } = useRoadmapNav();
  const pulsing = isPulsing(`step-${step.phase}`);

  return (
    <div
      id={`step-${step.phase}`}
      className="ob-tripwire"
      data-lead={thin ? '' : undefined}
      data-pulse={pulsing ? '' : undefined}
    >
      {thin ? <p className="ob-tripwire-thin">{ROADMAP.tripwire.thinNote}</p> : null}
      <p className="ob-tripwire-label ob-meta">{ROADMAP.tripwire.label}</p>
      <h3 className={thin ? 'ob-plan-name ob-plan-name--lead' : 'ob-plan-name'}>
        {ROADMAP_PHASE_LABEL[step.phase]}
      </h3>
      <p className="ob-plan-desc">{step.description}</p>
      <p className="ob-tripwire-note">{ROADMAP.tripwire.note}</p>
      <DependencyChips questionIds={step.dependencies} />
    </div>
  );
}
