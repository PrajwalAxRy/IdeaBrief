'use client';

import { readRunStartedAt } from '@/app/actions/create-run';
import { runEventsFixture, runEventsTotalMs } from '@/lib/fixtures/run-events';
import {
  type RunStreamState,
  initialRunStreamState,
  runStreamReducer,
} from '@/lib/run-stream-reducer';
import { useEffect, useRef, useState } from 'react';

/**
 * One of the three seams (see the prototype contract in
 * `only_frontend_build_plan.md`) — branches on `NEXT_PUBLIC_USE_FIXTURES`
 * here, nowhere else. The `else` branch (a real `EventSource` against
 * `/api/run/[slug]/stream`) doesn't exist yet; this prototype only ever
 * takes the fixture-replay path, but the return shape below is written to
 * match what that real implementation would need to produce.
 */
const USE_FIXTURES = process.env.NEXT_PUBLIC_USE_FIXTURES !== 'false';

const ALL_QUERIES = runEventsFixture
  .filter((event) => event.type === 'query.start')
  .map((event) => (event.type === 'query.start' ? event.query : ''));

export interface UseRunStreamResult {
  status: 'connecting' | 'running' | 'complete';
  phase: RunStreamState['phase'];
  elapsedMs: number;
  queries: RunStreamState['queries'];
  findings: RunStreamState['findings'];
  newestFindingId: string | null;
  discarded: number;
  counts: RunStreamState['counts'];
}

function finalState(): RunStreamState {
  return runEventsFixture.reduce(runStreamReducer, initialRunStreamState(ALL_QUERIES));
}

/**
 * Whether `slug` is inside its fake "just approved" replay window right now —
 * exported so `ValidateView` can decide *whether to mount the Run Console at
 * all* (a cold visit should render the finished report directly, no
 * cross-fade — there was nothing to fade from) using the exact same rule
 * `useRunStream` itself falls back to.
 */
export function isRunStreamActive(slug: string): boolean {
  if (!USE_FIXTURES) return false;
  const startedAtMs = readRunStartedAt(slug);
  if (startedAtMs === null) return false;
  return Date.now() - startedAtMs < runEventsTotalMs;
}

/**
 * The fixture replayer behind the real interface. Reads the client-recorded
 * moment the brief was approved for this `slug` (`null` for a cold visitor —
 * e.g. someone opening a shared link, who should just see the finished
 * report, never a replay of a run that already happened) — matching the
 * contract's `useRunStream(slug)` signature; the localStorage lookup stays
 * inside the hook rather than becoming a second thing every caller has to
 * thread through.
 *
 * Simplification (logged): if the page is reloaded partway through the ~75s
 * window, the replay restarts from t=0 rather than resuming exactly where it
 * left off — sub-second resume accuracy isn't worth the complexity for a
 * fixture-only prototype. Past the window entirely, the run is just treated
 * as finished (no replay, straight to the report), which is the behaviour
 * that actually matters: closing the tab and coming back later shows the
 * report, not a stale animation.
 */
export function useRunStream(slug: string): UseRunStreamResult {
  const [startedAtMs] = useState<number | null>(() => readRunStartedAt(slug));
  const [alreadyFinished] = useState<boolean>(() => !isRunStreamActive(slug));

  const [state, setState] = useState<RunStreamState>(() =>
    alreadyFinished ? finalState() : initialRunStreamState(ALL_QUERIES),
  );
  const [elapsedMs, setElapsedMs] = useState<number>(() =>
    alreadyFinished ? runEventsTotalMs : 0,
  );
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (alreadyFinished) return;

    function scheduleNext() {
      const idx = indexRef.current;
      if (idx >= runEventsFixture.length) return;
      const event = runEventsFixture[idx];
      timerRef.current = setTimeout(() => {
        setState((prev) => runStreamReducer(prev, event));
        indexRef.current = idx + 1;
        scheduleNext();
      }, event.delayMs);
    }
    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Runs exactly once — `slug`/`startedAtMs` are stable identity for the mount, not re-run triggers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alreadyFinished]);

  useEffect(() => {
    if (alreadyFinished || startedAtMs === null) return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAtMs), 1000);
    return () => clearInterval(interval);
  }, [alreadyFinished, startedAtMs]);

  const status: UseRunStreamResult['status'] = state.complete
    ? 'complete'
    : state.phase === 'starting'
      ? 'connecting'
      : 'running';

  return {
    status,
    phase: state.phase,
    elapsedMs,
    queries: state.queries,
    findings: state.findings,
    newestFindingId: state.newestFindingId,
    discarded: state.discardedCount,
    counts: state.counts,
  };
}
