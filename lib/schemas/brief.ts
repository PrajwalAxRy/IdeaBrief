import { z } from 'zod';

export const FieldStatusSchema = z.enum(['pending', 'filled', 'unknown']);
export type FieldStatus = z.infer<typeof FieldStatusSchema>;

const BriefStringFieldSchema = z.object({
  status: FieldStatusSchema,
  value: z.string(),
});
export type BriefStringField = z.infer<typeof BriefStringFieldSchema>;

const BriefListFieldSchema = z.object({
  status: FieldStatusSchema,
  value: z.array(z.string()),
});
export type BriefListField = z.infer<typeof BriefListFieldSchema>;

/**
 * The 12 fields of the Brief, per the blueprint appendix. `how_they_solve_it_today`,
 * `assumptions`, and `open_questions` are the three array-valued fields;
 * everything else is a single string.
 */
export const BriefSchema = z.object({
  one_liner: BriefStringFieldSchema,
  product: BriefStringFieldSchema,
  customer: BriefStringFieldSchema,
  who_decides: BriefStringFieldSchema,
  problem: BriefStringFieldSchema,
  how_they_solve_it_today: BriefListFieldSchema,
  what_makes_this_different: BriefStringFieldSchema,
  first_version_scope: BriefStringFieldSchema,
  how_it_makes_money: BriefStringFieldSchema,
  how_customers_find_it: BriefStringFieldSchema,
  assumptions: BriefListFieldSchema,
  open_questions: BriefListFieldSchema,
});
export type Brief = z.infer<typeof BriefSchema>;

export const BRIEF_FIELD_KEYS = BriefSchema.keyof().options;
export type BriefFieldKey = (typeof BRIEF_FIELD_KEYS)[number];

/** Panel footer: "{n} unknown -> open questions". */
export function countUnknownFields(brief: Brief): number {
  return BRIEF_FIELD_KEYS.filter((key) => brief[key].status === 'unknown').length;
}
