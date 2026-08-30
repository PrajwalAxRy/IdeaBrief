import type { Stage } from '@/lib/content/trial3';

const STAGES: { id: Stage; num: string; label: string }[] = [
  { id: 'define', num: '01', label: 'Define' },
  { id: 'validate', num: '02', label: 'Validate' },
  { id: 'roadmap', num: '03', label: 'Roadmap' },
];

/**
 * Define → Validate → Roadmap. The product's main navigation, so it sits in
 * the one place present on every screen: the centre of the top bar, above the
 * three columns rather than inside one of them.
 *
 * **Two independent states, and keeping them apart is what keeps the accent
 * honest.** `runStage` is where the run actually *is* — it carries the live
 * dot, which is one of the accent's three jobs. `view` is what you are
 * currently *looking at* — it gets an underline rule and full text colour,
 * never colour. Previewing a locked stage is not a live state, so the two
 * cannot share a signal. Recipes in `audacity.css` §9.
 *
 * The connector between items is a `--au-hairline-strong` rule: it sits on the
 * canvas and has to read as a deliberate line rather than as a border, which
 * is the one case the strong token exists for.
 */
export function StageRail({
  view,
  runStage,
  onView,
}: {
  view: Stage;
  runStage: Stage;
  onView: (stage: Stage) => void;
}) {
  return (
    <nav aria-label="Run stages">
      <ol className="au-stages">
        {STAGES.map((stage, index) => (
          <li key={stage.id} className="flex items-center">
            {index > 0 ? <span className="au-stage-link" aria-hidden="true" /> : null}

            <button
              type="button"
              className="au-stage"
              data-view={stage.id === view}
              data-run={stage.id === runStage ? 'current' : 'locked'}
              aria-current={stage.id === view ? 'page' : undefined}
              onClick={() => onView(stage.id)}
            >
              <span className="au-stage-num">{stage.num}</span>
              <span className="au-stage-label">{stage.label}</span>
              {stage.id === runStage ? <span className="au-dot" aria-hidden="true" /> : null}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
