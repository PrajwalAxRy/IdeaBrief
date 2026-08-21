import { type RunEvent, RunEventSchema } from '../schemas/run';
import { discardedFixture } from './discarded';
import { evidenceFixture } from './evidence';
import { RUN_QUERIES } from './queries';

/**
 * The replayed SSE log for one research run.
 *
 * **Re-timed in A1 (D8).** The old generator front-loaded 16.3s of query
 * chatter before the first finding and then absorbed ~40s of slack into a
 * single `complete` delay — a dead tail on a screen whose entire job is to
 * feel alive. It now runs ~45s end to end with the first verified finding on
 * screen inside 6s, queries interleaved into the verification stream rather
 * than stacked ahead of it, and no discard in the final four seconds, so the
 * run ends on findings and the writing beat rather than a counter ticking
 * alone.
 *
 * Checkpoints the timing test pins:
 *   `phase verifying` at t=3,260ms · first `finding.verified` at t=3,880ms ·
 *   `runEventsTotalMs` ≈ 45,080ms.
 */

if (evidenceFixture.length !== 47) {
  throw new Error(`Expected 47 findings to replay, got ${evidenceFixture.length}`);
}
if (discardedFixture.length !== 18) {
  throw new Error(`Expected 18 discards to replay, got ${discardedFixture.length}`);
}

/* Cycled, deterministic delays — no Math.random(), so the fixture is
   reproducible run to run. */
const QUERY_START_DELAY = 90;
const QUERY_DONE_DELAY = 130;
const FETCH_PHASE_DELAY = 220;
const VERIFY_PHASE_DELAY = 180;
const VERIFY_DELAY_CYCLE = [620, 700, 780, 860, 940, 660, 720]; // 7 values, mean 754ms
const DISCARD_DELAY = 200;
const WRITING_PHASE_DELAY = 420;
const COMPLETE_DELAY = 900;

/** After which verified-finding counts a discard lands. 18 entries; the last
 *  is 45, so the final two findings and the writing beat run clean. */
const DISCARD_AFTER_VERIFIED = [
  2, 5, 8, 11, 14, 17, 20, 22, 25, 27, 30, 32, 34, 36, 38, 41, 43, 45,
];

/** The remaining six query pairs (indices 13–18) are emitted after these
 *  verified counts, so the ticker keeps moving through the long middle. */
const INTERLEAVED_QUERY_AFTER_VERIFIED = [1, 3, 5, 7, 9, 11];

/** Queries 0–5 fire under `searching`, 6–12 under `fetching`, and 13–18
 *  interleave into `verifying`. */
const QUERIES_BEFORE_FETCHING = 6;
const QUERIES_BEFORE_VERIFYING = 13;

function buildRunEvents(): RunEvent[] {
  const events: RunEvent[] = [];
  let elapsed = 0;

  function push(event: RunEvent) {
    events.push(event);
    elapsed += event.delayMs;
  }

  function pushQuery(index: number) {
    const query = RUN_QUERIES[index];
    push({ type: 'query.start', delayMs: QUERY_START_DELAY, query, index });
    push({ type: 'query.done', delayMs: QUERY_DONE_DELAY, query, index });
  }

  push({ type: 'phase', delayMs: 0, phase: 'searching', elapsed_ms: 0 });
  for (let i = 0; i < QUERIES_BEFORE_FETCHING; i += 1) pushQuery(i);

  push({ type: 'phase', delayMs: FETCH_PHASE_DELAY, phase: 'fetching', elapsed_ms: elapsed });
  for (let i = QUERIES_BEFORE_FETCHING; i < QUERIES_BEFORE_VERIFYING; i += 1) pushQuery(i);

  push({ type: 'phase', delayMs: VERIFY_PHASE_DELAY, phase: 'verifying', elapsed_ms: elapsed });

  let discardIndex = 0;
  let interleavedQuery = QUERIES_BEFORE_VERIFYING;

  for (const [findingIndex, finding] of evidenceFixture.entries()) {
    push({
      type: 'finding.verified',
      delayMs: VERIFY_DELAY_CYCLE[findingIndex % VERIFY_DELAY_CYCLE.length],
      finding,
    });
    const verifiedSoFar = findingIndex + 1;

    if (
      INTERLEAVED_QUERY_AFTER_VERIFIED.includes(verifiedSoFar) &&
      interleavedQuery < RUN_QUERIES.length
    ) {
      pushQuery(interleavedQuery);
      interleavedQuery += 1;
    }

    if (
      discardIndex < discardedFixture.length &&
      DISCARD_AFTER_VERIFIED[discardIndex] === verifiedSoFar
    ) {
      push({
        type: 'finding.discarded',
        delayMs: DISCARD_DELAY,
        count: discardIndex + 1,
        discarded: discardedFixture[discardIndex],
      });
      discardIndex += 1;
    }
  }

  if (discardIndex !== discardedFixture.length) {
    throw new Error(`Emitted ${discardIndex} discards, expected ${discardedFixture.length}`);
  }
  if (interleavedQuery !== RUN_QUERIES.length) {
    throw new Error(`Emitted ${interleavedQuery} queries, expected ${RUN_QUERIES.length}`);
  }

  push({ type: 'phase', delayMs: WRITING_PHASE_DELAY, phase: 'writing', elapsed_ms: elapsed });
  push({ type: 'complete', delayMs: COMPLETE_DELAY });

  return events;
}

export const runEventsFixture: RunEvent[] = buildRunEvents();

export const runEventsTotalMs = runEventsFixture.reduce((sum, event) => sum + event.delayMs, 0);

for (const event of runEventsFixture) {
  RunEventSchema.parse(event);
}
