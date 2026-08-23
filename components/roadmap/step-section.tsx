import { ROADMAP } from '@/lib/content/app';
import { phaseAnchor } from '@/lib/run-plan';
import type { Phase } from '@/lib/schemas/roadmap';
import { AmbushLine } from './ambush-line';

/**
 * One step, read in full. The destination of a bar click in the chart.
 *
 * **Trimmed on purpose (A17).** The predecessor rendered six labelled rows per
 * step — what it is, starts when, costs, not in it, what you'll hit, answers —
 * inside a detail panel that swapped content in place. Five of those stacked
 * would be most of the page again, and the reader is here for an overview, not
 * an execution brief.
 *
 * What survives is three things and two conditionals. The summary and
 * `START WHEN` always render, because a step with no trigger is a step nobody
 * knows when to begin. `COSTS` renders only above `free`, since "this one is
 * free" is worth saying once in the cost section rather than five times here.
 * `NOT IN IT` renders only where there is a real answer — on this run that is
 * the build alone, which is exactly where a first-time founder overbuilds.
 *
 * The ambush list is allowed to be empty and says so. A per-step quota is the
 * mechanism that manufactures filler, so the honest empty state is a feature.
 */
export function StepSection({ phase, index }: { phase: Phase; index: number }) {
  const headingId = `${phaseAnchor(phase.id)}-h`;

  return (
    <article
      className="ob-step"
      id={phaseAnchor(phase.id)}
      data-tint={phase.tint}
      aria-labelledby={headingId}
    >
      <div className="ob-step-head">
        <p className="ob-step-index ob-meta" aria-hidden="true">
          <span className="ob-step-dot" />
          {String(index + 1).padStart(2, '0')}
        </p>
        <div className="ob-step-title">
          <h3 className="ob-step-name" id={headingId}>
            {phase.name}
          </h3>
          <p className="ob-step-tagline">{phase.tagline}</p>
        </div>
      </div>

      <div className="ob-step-body">
        <div className="ob-step-main">
          <p className="ob-step-summary">{phase.summary}</p>

          <div className="ob-step-facts">
            <div className="ob-step-fact">
              <p className="ob-step-fact-label ob-meta">{ROADMAP.step.startsWhen}</p>
              <p className="ob-step-fact-value">{phase.starts_when}</p>
            </div>

            {phase.cost !== 'free' && (
              <div className="ob-step-fact">
                <p className="ob-step-fact-label ob-meta">{ROADMAP.step.cost}</p>
                <p className="ob-step-fact-value">
                  <span className="ob-money-band" data-band={phase.cost}>
                    {phase.cost}
                  </span>
                </p>
              </div>
            )}
          </div>

          {phase.not_in_it && phase.not_in_it.length > 0 && (
            <div className="ob-step-cut">
              <p className="ob-step-fact-label ob-meta">{ROADMAP.step.notInIt}</p>
              <ul className="ob-step-cut-list">
                {phase.not_in_it.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="ob-step-aside">
          <p className="ob-step-fact-label ob-meta">{ROADMAP.step.ambushes}</p>
          {phase.ambushes.length > 0 ? (
            <ul className="ob-ambush-list">
              {phase.ambushes.map((ambush) => (
                <AmbushLine ambush={ambush} key={ambush.id} />
              ))}
            </ul>
          ) : (
            <p className="ob-step-noambush">{ROADMAP.step.noAmbush}</p>
          )}
        </div>
      </div>
    </article>
  );
}
