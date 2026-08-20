import { DIMENSIONS, type Dimension, type Finding } from './schemas/evidence';
import type { RunEvent, RunPhaseName } from './schemas/run';

export type QueryRowState = 'queued' | 'running' | 'done';

export interface QueryRow {
  index: number;
  query: string;
  state: QueryRowState;
}

export interface RunStreamState {
  /** `'starting'` is the pre-first-event Connecting state — never a real SSE phase. */
  phase: RunPhaseName | 'starting';
  queries: QueryRow[];
  /** Newest first — the order the Finding Stream renders in. */
  findings: Finding[];
  /** The most recently prepended finding's id, for the entrance animation — `null` after a bulk/no-animation update. */
  newestFindingId: string | null;
  discardedCount: number;
  counts: Record<Dimension, number>;
  complete: boolean;
}

export function initialRunStreamState(queries: string[]): RunStreamState {
  return {
    phase: 'starting',
    queries: queries.map((query, index) => ({ index, query, state: 'queued' })),
    findings: [],
    newestFindingId: null,
    discardedCount: 0,
    counts: Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, 0])) as Record<
      Dimension,
      number
    >,
    complete: false,
  };
}

/**
 * Pure event → state transition, deliberately separated from `useRunStream`
 * so it's independently testable (`tests/unit/run-stream-reducer.test.ts`)
 * and so a future real-SSE implementation can reuse it unchanged — only the
 * event *source* (fixture timer vs `EventSource`) differs between the two.
 */
export function runStreamReducer(state: RunStreamState, event: RunEvent): RunStreamState {
  switch (event.type) {
    case 'phase':
      return { ...state, phase: event.phase };

    case 'query.start':
      return {
        ...state,
        queries: state.queries.map((row) =>
          row.index === event.index ? { ...row, state: 'running' } : row,
        ),
      };

    case 'query.done':
      return {
        ...state,
        queries: state.queries.map((row) =>
          row.index === event.index ? { ...row, state: 'done' } : row,
        ),
      };

    case 'finding.verified':
      return {
        ...state,
        findings: [event.finding, ...state.findings],
        newestFindingId: event.finding.id,
        counts: {
          ...state.counts,
          [event.finding.dimension]: state.counts[event.finding.dimension] + 1,
        },
      };

    case 'finding.discarded':
      return { ...state, discardedCount: event.count };

    case 'complete':
      return { ...state, complete: true };

    default:
      return state;
  }
}
