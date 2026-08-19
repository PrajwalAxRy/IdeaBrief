import { z } from 'zod';
import { extractCitationNumbers } from '../citations';
import { FindingSchema } from './evidence';

export const ConfidenceSchema = z.enum(['solid', 'mixed', 'thin']);
export type Confidence = z.infer<typeof ConfidenceSchema>;

/**
 * Free prose plus its citation numbers. Refined so uncited prose is a schema
 * bug, not a rendering surprise: every `[n]` in the text must be declared in
 * `citations`, every declared citation must actually appear in the text, and
 * the text must cite at least one source.
 */
const CitedTextSchema = z
  .object({
    text: z.string().min(1),
    citations: z.array(z.number().int().positive()),
  })
  .refine(
    (value) => {
      const found = new Set(extractCitationNumbers(value.text));
      if (found.size === 0) return false;
      for (const n of found) {
        if (!value.citations.includes(n)) return false;
      }
      for (const n of value.citations) {
        if (!found.has(n)) return false;
      }
      return true;
    },
    {
      message:
        'Cited text must reference at least one [n] citation, and `citations` must exactly match the [n] markers present in the text.',
    },
  );
export type CitedText = z.infer<typeof CitedTextSchema>;

const DimensionSectionSchema = z.object({
  label: z.string().min(1),
  meta: z.object({
    count: z.number().int().nonnegative(),
    sources: z.number().int().nonnegative(),
    date_range: z.string().min(1),
  }),
  confidence: ConfidenceSchema,
  prose: CitedTextSchema,
  findings: z.array(FindingSchema),
});
export type DimensionSection = z.infer<typeof DimensionSectionSchema>;

const CompetitorSchema = z.object({
  name: z.string().min(1),
  geography: z.string().min(1),
  price: z.string().min(1),
  difference_from_idea: z.string().min(1),
  moat: z.string().optional(),
  take_from_them: z.string().optional(),
  ignore: z.string().optional(),
});
export type Competitor = z.infer<typeof CompetitorSchema>;

/**
 * An explicit object with all 5 named dimension keys required — not
 * `z.record(DimensionSchema, ...)`, which Zod/TS would infer as a partial
 * map and force optional-chaining at every call site
 * (`report.dimensions.PRACTICAL?.confidence`). The exit test requires none.
 */
const ReportDimensionsSchema = z.object({
  PROBLEM: DimensionSectionSchema,
  WHAT_EXISTS: DimensionSectionSchema,
  DEMAND_SIGNALS: DimensionSectionSchema,
  MONEY: DimensionSectionSchema,
  PRACTICAL: DimensionSectionSchema,
});

export const ReportSchema = z.object({
  summary: CitedTextSchema,
  dimensions: ReportDimensionsSchema,
  competitors: z.array(CompetitorSchema).min(1),
  surprises: z.array(z.string().min(1)).min(2).max(3),
  unanswered: z.array(z.string().min(1)).min(1),
});
export type Report = z.infer<typeof ReportSchema>;
