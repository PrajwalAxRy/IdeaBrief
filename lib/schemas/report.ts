import { z } from 'zod';
import { extractCitationNumbers } from '../citations';
import { DimensionSchema, FindingSchema } from './evidence';

export const ConfidenceSchema = z.enum(['solid', 'mixed', 'thin']);
export type Confidence = z.infer<typeof ConfidenceSchema>;

/**
 * Free prose plus its citation numbers. Refined so uncited prose is a schema
 * bug, not a rendering surprise: every `[n]` in the text must be declared in
 * `citations`, every declared citation must actually appear in the text, and
 * the text must cite at least one source.
 */
export const CitedTextSchema = z
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

/**
 * `label` is gone (R14) — the display word comes from `DIMENSION_LABEL` in
 * ./evidence.ts, keyed off `dimension`. Carrying the key on the section is
 * what lets every consumer reach the map without threading the object key
 * down, and it is why the fourth vocabulary cannot come back.
 */
const DimensionSectionSchema = z.object({
  dimension: DimensionSchema,
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

/* --------------------------------------------------------- capabilities --- */

export const CapabilityKeySchema = z.enum([
  'reminders',
  'recall',
  'waitlist',
  'auto_rebook',
  'pms_integration',
]);
export type CapabilityKey = z.infer<typeof CapabilityKeySchema>;
export const CAPABILITY_KEYS = CapabilityKeySchema.options;

export const CapabilityLevelSchema = z.enum(['yes', 'partial', 'no', 'unknown']);
export type CapabilityLevel = z.infer<typeof CapabilityLevelSchema>;

export const CAPABILITY_LABEL: Record<CapabilityKey, string> = {
  reminders: 'Reminder texts',
  recall: 'Recall campaigns',
  waitlist: 'Waitlist',
  auto_rebook: 'Automatic rebooking on cancellation',
  pms_integration: 'PMS integration',
};

/**
 * One cell of the `CapabilityMatrix`.
 *
 * The refinement is the schema stating the trust rule out loud: a filled cell
 * with no source is a bug, not a rendering choice. An `unknown` cell legally
 * carries no citation, because *we didn't find out* is a real answer and a
 * citation for it would be fake.
 */
const CapabilitySchema = z
  .object({
    key: CapabilityKeySchema,
    level: CapabilityLevelSchema,
    citations: z.array(z.number().int().positive()),
  })
  .refine((c) => c.level === 'unknown' || c.citations.length >= 1, {
    message: 'A capability claim that is not `unknown` must cite at least one finding.',
  });
export type Capability = z.infer<typeof CapabilitySchema>;

const CompetitorSchema = z.object({
  name: z.string().min(1),
  geography: z.string().min(1),
  price: z.string().min(1),
  difference_from_idea: z.string().min(1),
  moat: z.string().optional(),
  take_from_them: z.string().optional(),
  ignore: z.string().optional(),
  /** Exactly the five keys, in `CAPABILITY_KEYS` order. An array rather than a
   *  `z.record` so every call site indexes without optional chaining. */
  capabilities: z.array(CapabilitySchema).length(5),
});
export type Competitor = z.infer<typeof CompetitorSchema>;

/* ------------------------------------------------- surprises / unanswered --- */

export const SurpriseSchema = z.object({
  headline: z.string().min(1).max(80),
  detail: CitedTextSchema,
});
export type Surprise = z.infer<typeof SurpriseSchema>;

/** §06 says what we couldn't answer *and why the web couldn't say* — which is
 *  the difference between a gap and an omission. */
export const UnansweredItemSchema = z.object({
  question: z.string().min(1),
  why_unanswered: z.string().min(1),
});
export type UnansweredItem = z.infer<typeof UnansweredItemSchema>;

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

export const ReportSchema = z
  .object({
    summary: CitedTextSchema,
    dimensions: ReportDimensionsSchema,
    competitors: z.array(CompetitorSchema).min(1),
    surprises: z.array(SurpriseSchema).min(2).max(3),
    unanswered: z.array(UnansweredItemSchema).min(1),
    /**
     * The idea's own claimed capabilities — a list of keys, with no `level`.
     *
     * That shape is deliberate and must not be "simplified" into a fourth
     * competitor row. `CapabilityMatrix` renders the idea as a fourth
     * *column*, headed `THIS IDEA`, its cells reading `CLAIMED` or `—` with no
     * square marks at all. An idea row drawn in the same marks as the
     * competitors is a comparison chart that says *we win* from a column with
     * no evidence behind it; having no `level` to draw a mark from is what
     * enforces the register split (C7).
     */
    idea_capabilities: z.array(CapabilityKeySchema),
  })
  .refine(
    (value) =>
      Object.entries(value.dimensions).every(([key, section]) => section.dimension === key),
    { message: "Each dimension section's `dimension` must equal its key in `dimensions`." },
  );
export type Report = z.infer<typeof ReportSchema>;
