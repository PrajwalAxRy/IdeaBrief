import { STAGES } from '@/lib/content/trial1';

/**
 * Define · Validate · Roadmap.
 *
 * **Peers, not steps.** There are no ordinals, no connectors and no arrow
 * between the three, because the brief was explicitly that this must not read
 * as a 1-2-3 pipeline you can only walk forwards — someone on Roadmap should
 * feel they can drop back into Define without undoing anything. A stepper says
 * the opposite structurally, and structure beats copy every time.
 *
 * Riley's segmented control is the right primitive for exactly that: a set of
 * equal siblings where one happens to be current. Two additions here, both in
 * §18 of the stylesheet — a mono status flag per item, and a real disabled
 * state for the two stages that have no page behind them in this trial.
 *
 * A server component. It has no state: the current stage is a prop and the
 * other two are inert, so there is nothing here to hydrate.
 */
export function StageSwitcher({ current }: { current: string }) {
  return (
    <nav aria-label="Stage" className="flex justify-center">
      <div className="rl-stage">
        {STAGES.map((stage) => {
          const isCurrent = stage.id === current;

          /* Not a <button disabled> and not an <a>. A disabled button is
             removed from the tab order and from the accessibility tree in some
             combinations, which would leave a screen-reader user with no way to
             learn that Validate and Roadmap exist at all — and their existence
             is most of what this control communicates. aria-disabled announces
             the state while keeping the item reachable. */
          return (
            <button
              key={stage.id}
              type="button"
              className="rl-stage__item"
              aria-current={isCurrent ? 'page' : undefined}
              aria-disabled={stage.available ? undefined : 'true'}
              title={stage.available ? undefined : `${stage.label} is not built yet`}
            >
              {stage.label}
              <span className="rl-stage__flag">{stage.flag}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
