import type { RunStatus } from './schemas/run';

export type StageState = 'locked' | 'active' | 'done';

export interface StageStates {
  define: StageState;
  validate: StageState;
  roadmap: StageState;
}

/**
 * `RunStatus` only has 3 values — there is no distinct "roadmap done" state,
 * so a `complete` run shows every segment as `done` regardless of which run
 * page you're actually on (see 12.6: "Run complete, user on Define: Stage
 * Rail shows all done"). Locked segments carry no affordance at all — they
 * are never a disabled link.
 */
export function getStageStates(status: RunStatus): StageStates {
  switch (status) {
    case 'define':
      return { define: 'active', validate: 'locked', roadmap: 'locked' };
    case 'validating':
      return { define: 'done', validate: 'active', roadmap: 'locked' };
    case 'complete':
      return { define: 'done', validate: 'done', roadmap: 'done' };
  }
}

/**
 * `/r/[slug]` resolves to the furthest meaningful stage. A complete run
 * lands on Validate (the report), not Roadmap — the report is what a shared
 * link recipient needs first (03 §3.3).
 */
export function resolveRunRedirect(status: RunStatus): '/define' | '/validate' {
  return status === 'define' ? '/define' : '/validate';
}
