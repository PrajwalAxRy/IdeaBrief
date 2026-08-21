import type { RunStatus } from './schemas/run';

export type StageState = 'locked' | 'active' | 'done';

/** The three stages of a run. `sources` is deliberately not one of them. */
export type StageKey = 'define' | 'validate' | 'roadmap';

/**
 * A route under `/r/[slug]/*`. `sources` is the evidence layer, not a stage
 * (D16) — it appears here because `RunHeader` and `AppBackdrop` are keyed on
 * the route, and nowhere in `StageStates`.
 */
export type RunSegment = StageKey | 'sources';

/**
 * `AppBackdrop`'s prop names the *surface*, not the strength (C13). The
 * component maps surface → strength internally, so a route changes its
 * atmosphere by changing one CSS rule rather than its JSX. `'standalone'` is
 * the 404 / error surfaces, which live outside the run shell.
 */
export type BackdropVariant = RunSegment | 'standalone';

export interface StageStates {
  define: StageState;
  validate: StageState;
  roadmap: StageState;
}

/**
 * What the browser knows that the server does not. Read from `localStorage` by
 * `useRunProgress`, and `null` on the server and on the first client render —
 * which is exactly why it can only ever *add* reachability (see below).
 */
export interface RunProgress {
  briefApproved: boolean;
  briefTouched: boolean;
}

/**
 * Honest per-page stage state (D19), derived from the route plus whatever
 * local progress the browser has — never from the always-`complete` fixture
 * alone.
 *
 * **`progress` only ever adds reachability, never removes it.** That single
 * property is what makes a cold shared link safe: a recipient with an empty
 * `localStorage` gets the `status`-only floor, which for a `complete` run is
 * all three reachable, so they see exactly what the owner sees minus the "you
 * are here" — which they get from their own URL. It is also why the first
 * client paint can match SSR (`progress = null` on both sides) and then widen
 * without a hydration mismatch, the same pattern `useRecentRuns` already uses.
 *
 * On `/sources` no key is `active`: sources is not a stage.
 */
export function getStageStates(
  status: RunStatus,
  segment: RunSegment,
  progress: RunProgress | null,
): StageStates {
  const reach: Record<StageKey, boolean> = {
    define: true,
    validate: status !== 'define' || progress?.briefApproved === true,
    roadmap: status === 'complete',
  };

  /* Reachability is tested *before* "you are here", which is the one ordering
     the plan's own test cases pin: `('define', 'validate', null)` must read
     `locked`, not `active`. Standing on an unreachable segment does not unlock
     it — that is the whole of the cold-link floor. */
  const stateFor = (key: StageKey): StageState => {
    if (!reach[key]) return 'locked';
    return key === segment ? 'active' : 'done';
  };

  return {
    define: stateFor('define'),
    validate: stateFor('validate'),
    roadmap: stateFor('roadmap'),
  };
}

/**
 * `/r/[slug]` resolves to the furthest meaningful stage. A complete run
 * lands on Validate (the report), not Roadmap — the report is what a shared
 * link recipient needs first (03 §3.3).
 */
export function resolveRunRedirect(status: RunStatus): '/define' | '/validate' {
  return status === 'define' ? '/define' : '/validate';
}
