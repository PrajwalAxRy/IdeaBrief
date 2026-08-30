import { STAGE_LABEL, STAGE_ORDER, type Stage } from '@/lib/content/trial4';
import { Fragment } from 'react';

type Props = {
  /** Which stage is on screen. */
  view: Stage;
  /** Where the run actually is, which is not the same question. */
  runStage: Stage;
  onView: (stage: Stage) => void;
};

/**
 * Define → Validate → Roadmap. The product's primary navigation, and it sits in
 * the centre of the top bar above all three columns — the one position on the
 * screen that never scrolls away and never has to be looked for.
 *
 * **Two independent states, deliberately not collapsed into one.** `runStage`
 * is where the run has got to; `view` is what is on screen. A stage can be
 * ahead of the run and still be the thing you are looking at — that is exactly
 * what a preview is. Merging them would make the rail claim the run had
 * advanced the moment someone clicked Roadmap out of curiosity.
 *
 * Nothing here is disabled. A stage the run has not reached is dimmed and still
 * opens its preview, because "you cannot see what this produces until you have
 * finished" is the opposite of what the previews are for.
 *
 * No `'use client'`: this is a presentational leaf and `onView` arrives from
 * `Workspace`, which owns the boundary.
 */
export function StageRail({ view, runStage, onView }: Props) {
  const runIndex = STAGE_ORDER.indexOf(runStage);

  return (
    <nav className="t4-stages" aria-label="Run stages">
      {STAGE_ORDER.map((stage, index) => {
        const state = index < runIndex ? 'done' : index === runIndex ? 'current' : 'ahead';
        const viewing = stage === view;

        return (
          <Fragment key={stage}>
            {index > 0 ? <span className="t4-stage-join" aria-hidden="true" /> : null}

            <button
              type="button"
              className="t4-stage-link"
              data-state={state}
              data-view={viewing}
              aria-current={viewing ? 'page' : undefined}
              onClick={() => onView(stage)}
            >
              <span className="t4-stage-num">{`0${index + 1}`}</span>
              <span className="t4-stage-label">{STAGE_LABEL[stage]}</span>

              {/* The accent's live/active job, and its only appearance in the
                  bar: this is where the run is right now. */}
              {state === 'current' ? <span className="ob-dot" aria-label="Current stage" /> : null}
              {state === 'done' ? <span className="t4-stage-done" aria-hidden="true" /> : null}
              {state === 'ahead' ? <span className="t4-stage-tag">Preview</span> : null}
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}
