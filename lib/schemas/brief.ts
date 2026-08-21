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

/** The key enum itself, exported so `OpenQuestion.brief_field` can be a real
 *  Zod-validated reference rather than a bare `string` (C6). */
export const BriefFieldKeySchema = BriefSchema.keyof();
export const BRIEF_FIELD_KEYS = BriefFieldKeySchema.options;
export type BriefFieldKey = (typeof BRIEF_FIELD_KEYS)[number];

/** The three array-valued fields. `resolveBrief` needs to know which keys take
 *  `[]` rather than `''` when a field is marked unknown. */
export const BRIEF_LIST_FIELD_KEYS = [
  'how_they_solve_it_today',
  'assumptions',
  'open_questions',
] as const satisfies readonly BriefFieldKey[];
export type BriefListFieldKey = (typeof BRIEF_LIST_FIELD_KEYS)[number];

export function isBriefListField(key: BriefFieldKey): key is BriefListFieldKey {
  return (BRIEF_LIST_FIELD_KEYS as readonly string[]).includes(key);
}

/** Panel footer: "{n} unknown -> open questions". */
export function countUnknownFields(brief: Brief): number {
  return BRIEF_FIELD_KEYS.filter((key) => brief[key].status === 'unknown').length;
}
