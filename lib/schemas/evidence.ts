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

/* ------------------------------------------------------------------ facts --- */

export const FactKindSchema = z.enum(['money', 'rate', 'count', 'duration']);
export type FactKind = z.infer<typeof FactKindSchema>;

/**
 * The device that gets a number out of a sentence and into a figure —
 * `NumberCallout`, `ValueLadder`, `GapBar`. A fact is always pinned to the
 * finding whose excerpt actually contains it; nothing is invented to fill one.
 *
 * Sanctioned `unit` strings, closed by convention and asserted in the fixture:
 * 'USD' · 'USD/mo' · '%' · 'min' · 'min/day' · 's' · 'weeks' · 'practices' ·
 * 'names' · 'tools' · 'add-ons' · 'events/min'.
 */
export const FactSchema = z
  .object({
    value: z.number().finite(),
    unit: z.string().min(1),
    label: z.string().min(1),
    kind: FactKindSchema,
    /** Optional figure grouping key — several findings' facts drawn on one axis. */
    series: z.string().min(1).optional(),
    /** The backend's own judgement that this number is worth pulling out of the sentence. */
    callout: z.boolean().optional(),
  })
  .refine((f) => (f.unit === '%' ? f.value >= 0 && f.value <= 100 : true), {
    message: 'A percentage fact must be between 0 and 100.',
  });
export type Fact = z.infer<typeof FactSchema>;

/* --------------------------------------------------------------- findings --- */

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
  facts: z.array(FactSchema).min(1).optional(),
});
export type Finding = z.infer<typeof FindingSchema>;

export const EvidenceSchema = z.array(FindingSchema);
export type Evidence = z.infer<typeof EvidenceSchema>;

/* --------------------------------------------------------------- discards --- */

export const DiscardReasonSchema = z.enum([
  'excerpt_not_found_on_page',
  'page_changed_since_index',
  'paywalled',
  'quote_paraphrased_not_verbatim',
]);
export type DiscardReason = z.infer<typeof DiscardReasonSchema>;

/**
 * An excerpt that failed verification. The trust claim, made into records.
 *
 * **There is no `text` field, and none is added.** A discarded excerpt never
 * became a finding, so there is no claim to render — inventing one is exactly
 * what "nothing is invented to fill a field" forbids. `DiscardRow` leads with
 * the struck-through excerpt.
 *
 * `attempted_query` exists because it is the only field that answers *what
 * were we even looking for*, and discard rows open the drawer, which is where
 * that reads.
 */
export const DiscardedFindingSchema = z.object({
  id: z.string().regex(/^DS_\d{2}$/, 'Discard id must look like "DS_03"'),
  excerpt: z.string().min(1),
  source_url: z.string().url(),
  source_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'source_date must be an ISO date (YYYY-MM-DD)'),
  dimension: DimensionSchema,
  attempted_query: z.string().min(1),
  discard_reason: DiscardReasonSchema,
});
export type DiscardedFinding = z.infer<typeof DiscardedFindingSchema>;

export const DiscardedSchema = z.array(DiscardedFindingSchema).length(18);
export type Discarded = z.infer<typeof DiscardedSchema>;

/* ------------------------------------------------------- vocabulary maps --- */

/**
 * The one home for every display word in the evidence vocabulary (C3).
 *
 * R14 was *three* vocabularies for the same five dimensions — `Exists`/`Demand`
 * on pills, `WHAT EXISTS`/`DEMAND SIGNALS` on rows, and raw `DEMAND_SIGNALS` in
 * the drawer. There is now one home, beside the schema, matching the
 * `ROADMAP_PHASE_LABEL` precedent in ./roadmap.ts.
 *
 * **There is no `lib/dimensions.ts`, no label map in `lib/content/app.ts`, and
 * no inline stance-word map in any component.** Uppercasing for the mono meta
 * layer is `text-transform: uppercase` in CSS and never a second string — that
 * rule is what killed the third vocabulary, and it is why there are two
 * dimension maps here rather than three.
 */

/** The long form — report headings, the drawer, the finding card. */
export const DIMENSION_LABEL: Record<Dimension, string> = {
  PROBLEM: 'The problem',
  WHAT_EXISTS: 'What exists',
  DEMAND_SIGNALS: 'Demand signals',
  MONEY: 'Money',
  PRACTICAL: 'Practical realities',
};

/** The compact form — facet pills, coverage rails, strips. */
export const DIMENSION_SHORT: Record<Dimension, string> = {
  PROBLEM: 'Problem',
  WHAT_EXISTS: 'Exists',
  DEMAND_SIGNALS: 'Demand',
  MONEY: 'Money',
  PRACTICAL: 'Practical',
};

/** The schema value is `challenges`; the word a reader sees is `Contests`. */
export const STANCE_LABEL: Record<Stance, string> = {
  supports: 'Supports',
  neutral: 'Neutral',
  challenges: 'Contests',
};

/** Always rendered through this map, never as the raw key. */
export const DISCARD_REASON_LABEL: Record<DiscardReason, string> = {
  excerpt_not_found_on_page: 'The quoted text was not on the page it came from.',
  page_changed_since_index: 'The page changed between being indexed and being read.',
  paywalled: 'The page was behind a paywall when we fetched it.',
  quote_paraphrased_not_verbatim: 'The quote was a paraphrase, not the page’s own words.',
};
