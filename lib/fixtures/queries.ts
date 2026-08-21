/**
 * The 19 search queries this run issued.
 *
 * Lifted out of `run-events.ts` because two fixtures need them: the event log
 * replays them as `query.start` / `query.done` pairs, and every discard record
 * carries the `attempted_query` it failed under. A discard whose query was
 * never run is a record about nothing, so `discarded.ts` asserts membership of
 * this list at module scope.
 */
export const RUN_QUERIES = [
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

export type RunQuery = (typeof RUN_QUERIES)[number];

if (RUN_QUERIES.length !== 19) {
  throw new Error(`Expected 19 queries, got ${RUN_QUERIES.length}`);
}
