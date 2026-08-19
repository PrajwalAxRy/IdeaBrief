import { z } from 'zod';

export const DimensionSchema = z.enum([
  'PROBLEM',
  'WHAT_EXISTS',
  'DEMAND_SIGNALS',
  'MONEY',
  'PRACTICAL',
]);
export type Dimension = z.infer<typeof DimensionSchema>;
export const DIMENSIONS = DimensionSchema.options;

export const StanceSchema = z.enum(['supports', 'challenges', 'neutral']);
export type Stance = z.infer<typeof StanceSchema>;

export const FindingSchema = z.object({
  /** "EV_03" — the numeric suffix IS the global citation number. See lib/citations.ts. */
  id: z.string().regex(/^EV_\d+$/, 'Finding id must look like "EV_03"'),
  dimension: DimensionSchema,
  text: z.string().min(1),
  excerpt: z.string().min(1),
  source_url: z.string().url(),
  source_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'source_date must be an ISO date (YYYY-MM-DD)'),
  stance: StanceSchema,
  verified: z.boolean(),
  discard_reason: z.string().optional(),
});
export type Finding = z.infer<typeof FindingSchema>;

export const EvidenceSchema = z.array(FindingSchema);
export type Evidence = z.infer<typeof EvidenceSchema>;
