import { z } from 'zod';
import { DiscardedFindingSchema, FindingSchema } from './evidence';

export const RunStatusSchema = z.enum(['define', 'validating', 'complete']);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const RunSchema = z.object({
  slug: z.string().min(1),
  status: RunStatusSchema,
  /** The raw text typed into The Box — carried through so the run doesn't feel canned. */
  idea_text: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Run = z.infer<typeof RunSchema>;

export const RunPhaseNameSchema = z.enum(['searching', 'fetching', 'verifying', 'writing']);
export type RunPhaseName = z.infer<typeof RunPhaseNameSchema>;

/** Every SSE event carries `delayMs` — the replayer's per-event pause, not a timestamp. */
export const RunEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('phase'),
    delayMs: z.number().int().nonnegative(),
    phase: RunPhaseNameSchema,
    elapsed_ms: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal('query.start'),
    delayMs: z.number().int().nonnegative(),
    query: z.string().min(1),
    index: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal('query.done'),
    delayMs: z.number().int().nonnegative(),
    query: z.string().min(1),
    index: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal('finding.verified'),
    delayMs: z.number().int().nonnegative(),
    finding: FindingSchema,
  }),
  z.object({
    type: z.literal('finding.discarded'),
    delayMs: z.number().int().nonnegative(),
    /** Running total discarded so far — the client just displays it, never accumulates. */
    count: z.number().int().nonnegative(),
    /**
     * The whole record, not a `{ domain, reason }` pair. A pair is a second,
     * lossier shape for data that already exists — the console derives both
     * from the record via `formatDomain(record.source_url)` and
     * `DISCARD_REASON_LABEL[record.discard_reason]`.
     */
    discarded: DiscardedFindingSchema,
  }),
  z.object({
    type: z.literal('complete'),
    delayMs: z.number().int().nonnegative(),
  }),
]);
export type RunEvent = z.infer<typeof RunEventSchema>;
