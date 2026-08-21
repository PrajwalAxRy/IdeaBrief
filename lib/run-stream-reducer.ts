import {
  DIMENSIONS,
  type Dimension,
  type DiscardedFinding,
  type Finding,
} from './schemas/evidence';
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
  /** Newest first, like `findings`. The console decides whether to render
   *  them; the reducer just accumulates. Kept alongside `discardedCount`
   *  rather than replacing it — the count is the running total the event
   *  carries and is never derived by accumulation. */
  discarded: DiscardedFinding[];
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
    discarded: [],
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
      return {
        ...state,
        discardedCount: event.count,
        discarded: [event.discarded, ...state.discarded],
      };

    case 'complete':
      return { ...state, complete: true };

    default:
      return state;
  }
}

/**
 * The bulk / resume path: fold a prefix of the event log into one state in a
 * single synchronous pass.
 *
 * **It forces `newestFindingId: null`.** A resumed run — or one rendered
 * whole under reduced motion — must animate nothing: twenty-two cards are
 * already there, they did not *just arrive*, and flagging the last one as
 * newest would play an entrance for a finding that landed eighteen seconds
 * ago.
 *
 * Nothing else is added here. The newest discard is already `state.discarded[0]`
 * from the newest-first array, and a second field holding the same fact is how
 * two code paths start.
 */
export function foldRunEvents(events: RunEvent[], initial: RunStreamState): RunStreamState {
  return { ...events.reduce(runStreamReducer, initial), newestFindingId: null };
}
