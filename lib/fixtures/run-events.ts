import { type RunEvent, RunEventSchema } from '../schemas/run';
import { evidenceFixture } from './evidence';

const TARGET_TOTAL_MS = 75_000;

const QUERIES = [
  'dental practice no-show rate statistics',
  'front desk waitlist rebooking process',
  'SMS reminder software dental practices',
  'dental appointment cancellation cost',
  'waitlist dental office forum',
  'ChairSync reviews dental',
  'Recall360 pricing',
  'FrontDeskPro scheduling add-ons',
  'dental PMS webhook API cancellation',
  'dental SMS opt-in patient survey',
  'small dental practice software budget approval',
  'dental SaaS pricing per month',
  'per-message SMS pricing complaints',
  'dental conference expo booth demand',
  'dental startup rebooking shut down',
  'dental practice management marketplace add-ons',
  'independent dental practice owner decision maker',
  'dental office manager forum tools',
  'webhook rate limit API partner agreement',
] as const;

if (QUERIES.length !== 19) {
  throw new Error(`Expected 19 queries, got ${QUERIES.length}`);
}
if (evidenceFixture.length !== 47) {
  throw new Error(`Expected 47 findings to replay, got ${evidenceFixture.length}`);
}

/** Cycled, deterministic delays — no Math.random(), so the fixture is reproducible run to run. */
const QUERY_START_DELAY = 220;
const QUERY_DONE_DELAY = 640;
const VERIFY_DELAY_CYCLE = [560, 640, 720, 900, 1040];
const DISCARD_EVERY_N_VERIFIED = 3;

function buildRunEvents(): RunEvent[] {
  const events: RunEvent[] = [];
  let elapsed = 0;

  function push(event: RunEvent) {
    events.push(event);
    elapsed += event.delayMs;
  }

  push({ type: 'phase', delayMs: 0, phase: 'searching', elapsed_ms: 0 });

  QUERIES.forEach((query, index) => {
    push({ type: 'query.start', delayMs: QUERY_START_DELAY, query, index });
    push({ type: 'query.done', delayMs: QUERY_DONE_DELAY, query, index });
  });

  push({ type: 'phase', delayMs: 300, phase: 'fetching', elapsed_ms: elapsed + 300 });
  push({ type: 'phase', delayMs: 250, phase: 'verifying', elapsed_ms: elapsed + 300 + 250 });

  let discardedCount = 0;
  let verifiedSinceDiscard = 0;
  for (const [findingIndex, finding] of evidenceFixture.entries()) {
    const delayMs = VERIFY_DELAY_CYCLE[findingIndex % VERIFY_DELAY_CYCLE.length];
    push({ type: 'finding.verified', delayMs, finding });
    verifiedSinceDiscard += 1;

    if (verifiedSinceDiscard >= DISCARD_EVERY_N_VERIFIED && discardedCount < 18) {
      discardedCount += 1;
      push({ type: 'finding.discarded', delayMs: 380, count: discardedCount });
      verifiedSinceDiscard = 0;
    }
  }
  // Any discards not yet emitted (rounding) land right before the writing phase.
  while (discardedCount < 18) {
    discardedCount += 1;
    push({ type: 'finding.discarded', delayMs: 380, count: discardedCount });
  }

  push({ type: 'phase', delayMs: 600, phase: 'writing', elapsed_ms: elapsed + 600 });

  // Absorb whatever's left of the 75s budget into the pre-complete pause, floor 800ms.
  const remaining = Math.max(TARGET_TOTAL_MS - elapsed, 800);
  push({ type: 'complete', delayMs: remaining });

  return events;
}

export const runEventsFixture: RunEvent[] = buildRunEvents();

export const runEventsTotalMs = runEventsFixture.reduce((sum, event) => sum + event.delayMs, 0);

for (const event of runEventsFixture) {
  RunEventSchema.parse(event);
}
