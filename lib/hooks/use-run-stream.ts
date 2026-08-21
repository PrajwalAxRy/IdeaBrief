'use client';

import { readRunStartedAt } from '@/app/actions/create-run';
import { RUN_QUERIES } from '@/lib/fixtures/queries';
import { runEventsFixture, runEventsTotalMs } from '@/lib/fixtures/run-events';
import {
  type RunStreamState,
  foldRunEvents,
  initialRunStreamState,
  runStreamReducer,
} from '@/lib/run-stream-reducer';
import type { DiscardedFinding } from '@/lib/schemas/evidence';
import { useEffect, useRef, useState } from 'react';

/**
 * One of the three seams (see the prototype contract) — branches on
 * `NEXT_PUBLIC_USE_FIXTURES` here, nowhere else. The `else` branch (a real
 * `EventSource` against `/api/run/[slug]/stream`) doesn't exist yet; this
 * prototype only ever takes the fixture-replay path, but the return shape
 * below is written to match what that real implementation would produce.
 */
const USE_FIXTURES = process.env.NEXT_PUBLIC_USE_FIXTURES !== 'false';

/* Read from the query fixture rather than scraped back out of the event log:
   D8 interleaves six of the nineteen into the verification stream, and a
   scrape only happens to stay index-aligned because they are still emitted in
   ascending order. `QueryRow.index` must equal the array position. */
const ALL_QUERIES: string[] = [...RUN_QUERIES];

/**
 * The absolute time of every event, derived **once at module scope from the
 * fixture itself** — so resume needs no edit to `lib/fixtures/run-events.ts`
 * and creates no second source of truth. `TIMELINE[i]` is the millisecond
 * offset from `startedAt` at which event `i` fires.
 */
const TIMELINE: number[] = runEventsFixture.reduce<number[]>((acc, event, index) => {
  acc.push((acc[index - 1] ?? 0) + event.delayMs);
  return acc;
}, []);

/**
 * How long after approval a visitor still gets the live replay.
 *
 * `runEventsTotalMs` plus four seconds, so someone landing at t=44.9s isn't
 * dropped mid-cross-fade. **That slack is not dead time**: a visitor inside it
 * folds the whole log and mounts straight into the cross-fade.
 */
export const RUN_STREAM_WINDOW_MS = runEventsTotalMs + 4_000;

/** No event for this long and the console says so rather than sitting silent. */
const STALL_MS = 8_000;
/** The second rung — the one that offers a way out. */
const STALL_LONG_MS = 40_000;
const STALL_POLL_MS = 500;

/** `?stall=1` suppresses the chain after this many verified findings (≈9.2s). */
const STALL_QA_AFTER_FINDINGS = 8;

export type RunStreamStatus = 'connecting' | 'running' | 'stalled' | 'complete';

export interface UseRunStreamResult {
  status: RunStreamStatus;
  phase: RunStreamState['phase'];
  elapsedMs: number;
  queries: RunStreamState['queries'];
  findings: RunStreamState['findings'];
  newestFindingId: string | null;
  discarded: number;
  /** The most recent discard, and only that one. The console surfaces one
   *  reason at a time; it never accumulates a list. `/sources` owns all 18. */
  lastDiscard: DiscardedFinding | null;
  counts: RunStreamState['counts'];
  /** Past the second stall rung — the console offers a refresh. */
  stalledLong: boolean;
}

function finalState(): RunStreamState {
  return foldRunEvents(runEventsFixture, initialRunStreamState(ALL_QUERIES));
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

/**
 * Milliseconds since this browser recorded the brief being approved, or `null`
 * for a cold visitor (someone opening a shared link, who never waited and must
 * never be shown a wait).
 */
export function readRunElapsedMs(slug: string): number | null {
  if (!USE_FIXTURES) return null;
  const startedAtMs = readRunStartedAt(slug);
  if (startedAtMs === null) return null;
  return Date.now() - startedAtMs;
}

/**
 * Whether `slug` is inside its fake "just approved" replay window right now.
 */
export function isRunStreamActive(slug: string): boolean {
  const elapsed = readRunElapsedMs(slug);
  return elapsed !== null && elapsed < RUN_STREAM_WINDOW_MS;
}

/**
 * The three ways `/validate` can open, resolved from one read.
 *
 * `'cold'` — no recorded approval, or the window has closed: Mode B directly,
 * no replay, no clock, no cross-fade wrapper.
 * `'live'` — mid-run: fold what has already happened and schedule the rest.
 * `'crossing'` — inside the four-second slack past the end: everything has
 * happened, so the visitor gets the 400ms fade rather than a hard cut.
 */
export function runStreamEntry(slug: string): 'cold' | 'live' | 'crossing' {
  const elapsed = readRunElapsedMs(slug);
  if (elapsed === null || elapsed >= RUN_STREAM_WINDOW_MS) return 'cold';
  return elapsed >= runEventsTotalMs ? 'crossing' : 'live';
}

/**
 * The fixture replayer behind the real interface.
 *
 * **Reload resumes.** The replay used to restart at t=0 while the elapsed
 * clock kept true wall time, so a reload at 20s showed `0:20` on the clock
 * while finding #1 was landing — the two visibly desynced, and the clock is
 * precisely the element the console asks the user to trust. Every event whose
 * absolute offset has already passed is folded in synchronously (animating
 * nothing), and the next one is scheduled for the remainder of its own delay.
 *
 * The elapsed clock is wall time, never a sum of `delayMs`, so it cannot drift
 * from the replay. It freezes on `complete` at the run's own duration.
 */
export function useRunStream(slug: string, options: { stall?: boolean } = {}): UseRunStreamResult {
  const { stall = false } = options;

  const [startedAtMs] = useState<number | null>(() => readRunStartedAt(slug));
  const [alreadyFinished] = useState<boolean>(() => !isRunStreamActive(slug));

  const [state, setState] = useState<RunStreamState>(() =>
    alreadyFinished ? finalState() : initialRunStreamState(ALL_QUERIES),
  );
  /* Seeded from wall time, not from zero. A reload at 20s must read `0:20` on
     the very first paint — a clock that starts at `0:00` and jumps a quarter of
     a second later is exactly the desync this resume path exists to remove. */
  const [elapsedMs, setElapsedMs] = useState<number>(() => {
    if (alreadyFinished) return runEventsTotalMs;
    return startedAtMs === null ? 0 : Math.max(0, Date.now() - startedAtMs);
  });
  const [stallLevel, setStallLevel] = useState<0 | 1 | 2>(0);

  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventAtRef = useRef<number>(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `stall` is a QA query param, fixed for the life of the mount; adding it would tear down and restart the replay.
  useEffect(() => {
    if (alreadyFinished || startedAtMs === null) return;

    /* Read in an effect, never during render — `matchMedia` breaks SSR and a
       45-second replay is auto-advancing content, which is motion. */
    if (prefersReducedMotion()) {
      setState(finalState());
      setElapsedMs(runEventsTotalMs);
      return;
    }

    const startedAt = startedAtMs;
    const resumeAtMs = Date.now() - startedAt;
    let firstPending = 0;
    while (firstPending < TIMELINE.length && TIMELINE[firstPending] <= resumeAtMs) {
      firstPending += 1;
    }

    /* Folded from a **fresh** initial state, never from `prev`. React's dev
       double-invoke runs this effect twice on mount, and an incremental fold
       applies the same twenty-two events to the already-folded state — which
       reads as 28 findings in a 14-finding dimension and duplicate React keys.
       An absolute fold is idempotent, and it is also the honest shape: this is
       "the run's state at t", not "add these events to whatever is there." */
    if (firstPending > 0) {
      setState(
        foldRunEvents(runEventsFixture.slice(0, firstPending), initialRunStreamState(ALL_QUERIES)),
      );
    }
    indexRef.current = firstPending;
    lastEventAtRef.current = Date.now();

    let verifiedFired = runEventsFixture
      .slice(0, firstPending)
      .filter((event) => event.type === 'finding.verified').length;

    function scheduleNext() {
      const idx = indexRef.current;
      if (idx >= runEventsFixture.length) return;
      /* The QA affordance for the stalled state. The canonical fixture never
         trips the 8s chain (its largest gap is 940ms), so the only honest way
         to demonstrate a state the product genuinely has is to stop feeding
         the replay. */
      if (stall && verifiedFired >= STALL_QA_AFTER_FINDINGS) return;

      const event = runEventsFixture[idx];
      const dueIn = Math.max(0, TIMELINE[idx] - (Date.now() - startedAt));
      timerRef.current = setTimeout(() => {
        setState((prev) => runStreamReducer(prev, event));
        if (event.type === 'finding.verified') verifiedFired += 1;
        indexRef.current = idx + 1;
        lastEventAtRef.current = Date.now();
        setStallLevel(0);
        scheduleNext();
      }, dueIn);
    }
    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Runs exactly once — `slug`/`startedAtMs`/`stall` are the mount's identity, not re-run triggers.
  }, [alreadyFinished, startedAtMs]);

  useEffect(() => {
    if (alreadyFinished || startedAtMs === null || state.complete) return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAtMs), 250);
    return () => clearInterval(interval);
  }, [alreadyFinished, startedAtMs, state.complete]);

  /* Freeze the clock at the run's own duration the moment it completes. Wall
     time is the truth while the run is running; once it has finished, what the
     clock reports is how long the run took. */
  useEffect(() => {
    if (state.complete) setElapsedMs(runEventsTotalMs);
  }, [state.complete]);

  useEffect(() => {
    if (alreadyFinished || state.complete || lastEventAtRef.current === 0) return;
    const interval = setInterval(() => {
      const since = Date.now() - lastEventAtRef.current;
      setStallLevel(since >= STALL_LONG_MS ? 2 : since >= STALL_MS ? 1 : 0);
    }, STALL_POLL_MS);
    return () => clearInterval(interval);
  }, [alreadyFinished, state.complete]);

  const status: RunStreamStatus = state.complete
    ? 'complete'
    : state.phase === 'starting'
      ? 'connecting'
      : stallLevel > 0
        ? 'stalled'
        : 'running';

  return {
    status,
    phase: state.phase,
    elapsedMs,
    queries: state.queries,
    findings: state.findings,
    newestFindingId: state.newestFindingId,
    discarded: state.discardedCount,
    lastDiscard: state.discarded[0] ?? null,
    counts: state.counts,
    stalledLong: stallLevel === 2,
  };
}
