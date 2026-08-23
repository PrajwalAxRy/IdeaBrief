'use client';

import { ROADMAP } from '@/lib/content/app';
import { useInView } from '@/lib/hooks/use-in-view';
import { phaseAnchor, phaseSpan } from '@/lib/run-plan';
import type { Milestone, Phase } from '@/lib/schemas/roadmap';
import { useState } from 'react';

const ROW_STAGGER_MS = 90;

/**
 * The journey chart — five rows, and the page's table of contents.
 *
 * **What A17 changed, and why.** The previous chart had six tracks containing
 * fourteen bars: two levels of hierarchy, 18px rows, two fill treatments with a
 * legend to explain them, and a detail panel that changed content in place. It
 * was accurate and nobody could read it. This one has one level, five rows,
 * 34px bars, and clicking a bar takes you to a section rather than swapping a
 * panel — so the reader's position in the document always matches what they
 * asked to see, and the browser Back button works.
 *
 * **The card is light on purpose** — see the `--ob-rm-*` block in `tokens.css`.
 * It is the one figure/ground inversion in the app, taken because a horizontal
 * comparison across five rows is genuinely easier dark-on-light.
 *
 * **The axis is milestones, not months.** A chart with no reference at all was
 * unreadable; a month scale would promise dates this product refuses to
 * promise. The five markers are unfakeable proof points, so horizontal position
 * means *progress* without implying a calendar. Their names are on hover and
 * focus rather than printed, because five labels across 1100px collide.
 */
export function JourneyChart({
  phases,
  milestones,
}: {
  phases: Phase[];
  milestones: Milestone[];
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  /* Hover and focus feed one state, so a keyboard user gets the same tooltip a
     pointer user does rather than a second, lesser affordance. */
  const [openMilestone, setOpenMilestone] = useState<string | null>(null);

  function jumpTo(phaseId: string) {
    document.getElementById(phaseAnchor(phaseId))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="ob-rm-chart" ref={ref}>
      <div className="ob-rm-card">
        {/* The axis. `aria-hidden` on the rules themselves — they are
            decoration — but each marker is a real button so its name and proof
            are reachable without a pointer. */}
        <div className="ob-rm-axis">
          {milestones.map((milestone, index) => (
            <div
              className="ob-rm-mark"
              key={milestone.id}
              style={{ left: `${milestone.at * 100}%` }}
              data-open={openMilestone === milestone.id ? '' : undefined}
            >
              <button
                type="button"
                className="ob-rm-mark-btn"
                onMouseEnter={() => setOpenMilestone(milestone.id)}
                onMouseLeave={() => setOpenMilestone(null)}
                onFocus={() => setOpenMilestone(milestone.id)}
                onBlur={() => setOpenMilestone(null)}
                aria-describedby={`${milestone.id}-tip`}
              >
                <span aria-hidden="true">M{index + 1}</span>
                <span className="sr-only">{milestone.label}</span>
              </button>
              <div className="ob-rm-tip" id={`${milestone.id}-tip`} role="tooltip">
                <p className="ob-rm-tip-label">{milestone.label}</p>
                <p className="ob-rm-tip-proof">{milestone.proof}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="ob-rm-rows">
          {phases.map((phase, index) => {
            const span = phaseSpan(phase);
            return (
              <li className="ob-rm-row" key={phase.id} data-tint={phase.tint}>
                <p className="ob-rm-row-name">{phase.name}</p>

                <div className="ob-rm-lane">
                  {/* The gridlines repeat inside the lane so they read as
                      behind the bars rather than only above them. */}
                  <div className="ob-rm-lane-rules" aria-hidden="true">
                    {milestones.map((milestone) => (
                      <span
                        className="ob-rm-lane-rule"
                        key={milestone.id}
                        style={{ left: `${milestone.at * 100}%` }}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="ob-rm-bar"
                    data-open={span.openEnded ? '' : undefined}
                    data-shown={inView ? 'true' : 'false'}
                    style={{
                      left: `${span.leftPct}%`,
                      width: `${span.widthPct}%`,
                      /* Read by the transition-delay in the recipe. A custom
                         property, not an inline `transition-delay`, so the
                         reduced-motion block can still zero it. */
                      ['--ob-reveal-delay' as string]: `${index * ROW_STAGGER_MS}ms`,
                    }}
                    onClick={() => jumpTo(phase.id)}
                  >
                    <span className="ob-rm-bar-fill" aria-hidden="true" />
                    <span className="sr-only">{ROADMAP.journey.barAction(phase.name)}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="ob-rm-hint" aria-hidden="true">
          {ROADMAP.journey.hint}
        </p>
      </div>

      <p className="ob-rm-axis-cap">{ROADMAP.journey.axisCaption}</p>
    </div>
  );
}
