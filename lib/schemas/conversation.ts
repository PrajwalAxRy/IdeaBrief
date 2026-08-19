import { z } from 'zod';

/**
 * Not in P2's original schema list (run/brief/evidence/report/roadmap only),
 * but the seam contract requires every fixture to parse through a schema —
 * added to cover the Define conversation seam. `one_liner` is deliberately
 * excluded: it's echoed from the user's typed idea, never filled by a
 * scripted AI turn.
 */
export const ConversationTurnSchema = z.object({
  role: z.literal('assistant'),
  text: z.string().min(1),
  fills: z
    .array(
      z.enum([
        'product',
        'customer',
        'who_decides',
        'problem',
        'how_they_solve_it_today',
        'what_makes_this_different',
        'first_version_scope',
        'how_it_makes_money',
        'how_customers_find_it',
        'assumptions',
        'open_questions',
      ]),
    )
    .min(1),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;

export const ConversationSchema = z.array(ConversationTurnSchema).min(1);
export type Conversation = z.infer<typeof ConversationSchema>;
