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
  /**
   * One-click answers the AI offers alongside this turn (06 "Suggestion
   * chips") — not in P2's original schema, added in P5 since the fixture
   * needed real chip content for `suggestion-chip.tsx` to render. Optional
   * and capped at 4, matching the spec's "max 4 chips, wrap to a second row."
   */
  chips: z.array(z.string().min(1)).max(4).optional(),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;

export const ConversationSchema = z.array(ConversationTurnSchema).min(1);
export type Conversation = z.infer<typeof ConversationSchema>;
