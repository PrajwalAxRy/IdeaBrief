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

export const ConversationTurnsSchema = z.array(ConversationTurnSchema).min(1);
export type ConversationTurns = z.infer<typeof ConversationTurnsSchema>;

/**
 * What the AI says once the script has run out and the user keeps typing.
 * Cycled, never the same line twice running, and they fill no fields — the
 * conversation has a real end state now rather than a question the script can
 * never answer.
 */
export const ClosingLinesSchema = z.array(z.string().min(1)).min(1);
export type ClosingLines = z.infer<typeof ClosingLinesSchema>;

export const ConversationSchema = z.object({
  turns: ConversationTurnsSchema,
  closing: ClosingLinesSchema,
  /** Played after `I don't know`, before the next scripted question. */
  dontKnowAcks: ClosingLinesSchema,
});
export type Conversation = z.infer<typeof ConversationSchema>;
