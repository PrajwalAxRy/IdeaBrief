import {
  ClosingLinesSchema,
  type ConversationTurn,
  ConversationTurnsSchema,
} from '../schemas/conversation';

/**
 * The scripted AI turns for the Define conversation. The user's own turns
 * are never scripted — they're whatever the person types, or a synthetic
 * "I don't know" when the Don't-Know Button is used — so only the
 * `assistant` side is fixed content here.
 *
 * **The `first_version_scope` turn sits at index 4, not 6** (D12). The five
 * core fields — one-liner, product, customer, problem, first-version scope —
 * are everything a research run needs to generate queries, and moving this
 * turn forward is what puts Approve on screen at turn 5 rather than turn 7.
 * No turn text changed: both moved turns open with transitions that read
 * correctly in the new position.
 */
export const conversationFixture: ConversationTurn[] = [
  {
    role: 'assistant',
    text: "Got it — an SMS-based rebooking tool for dental clinics. When a slot opens up, what exactly happens in your product? Walk me through it like I've never seen a scheduling app before.",
    fills: ['product'],
  },
  {
    role: 'assistant',
    text: "Who's actually using this day to day — the dentist, the front-desk person, or someone else? And what size of practice are we talking about?",
    fills: ['customer'],
    chips: ['The front-desk person', 'The dentist', 'An office manager'],
  },
  {
    role: 'assistant',
    text: "What's actually broken today that makes this worth building? What happens right now when a patient cancels?",
    fills: ['problem'],
  },
  {
    role: 'assistant',
    text: "Before this exists, how are practices handling that gap today? List everything you've seen or heard, even the hacky stuff.",
    fills: ['how_they_solve_it_today'],
  },
  {
    role: 'assistant',
    text: "If you could only ship one thing first, what's the smallest version of this that's still real?",
    fills: ['first_version_scope'],
  },
  {
    role: 'assistant',
    text: 'One more on the buying side — who has to say yes to actually paying for this every month? Is it the same person running the front desk?',
    fills: ['who_decides'],
    chips: ['The practice owner', 'The office manager', 'Both have to agree'],
  },
  {
    role: 'assistant',
    text: "There's already reminder software out there. What does this do that they don't?",
    fills: ['what_makes_this_different'],
  },
  {
    role: 'assistant',
    text: 'How does this make money — and roughly what would a practice pay?',
    fills: ['how_it_makes_money'],
    chips: ['Flat monthly fee', 'Per booking recovered', 'Not sure yet'],
  },
  {
    role: 'assistant',
    text: 'Last one on go-to-market — how does the first practice actually find out this exists?',
    fills: ['how_customers_find_it'],
    chips: ['Cold outreach', 'Dental associations', 'The PMS marketplace'],
  },
  {
    role: 'assistant',
    text: "Before we lock this in — what are you assuming has to be true for this to work, that you haven't actually verified yet?",
    fills: ['assumptions'],
  },
  {
    role: 'assistant',
    text: "Good — everything's in the brief on the right. Anything marked as an open question is worth confirming with a real practice before you build. When you're ready, approve it and I'll start the research.",
    fills: ['open_questions'],
  },
];

/**
 * What the AI says after the script has ended and the user keeps typing.
 * Cycled, so the same line never runs twice in a row. None of these fills a
 * field or advances the script — they acknowledge and point back at the brief,
 * which is the only thing still worth editing at that point.
 */
export const closingLinesFixture: string[] = [
  'Got it. The brief on the right is what the research reads, so edit any field there directly.',
  'Noted. Nothing else is blocking — approve whenever you’re ready.',
  'Understood. If that changes a field, edit it in the brief and it’ll go into the research.',
];

/**
 * The transient acknowledgement played after `I don't know`, before the next
 * scripted question. Cycled, fills no field, and **does not advance the
 * script** — the AI never re-asks a field the user has already answered, in
 * either direction.
 */
export const dontKnowAcksFixture: string[] = [
  'That’s fine — it goes in as an open question.',
  'No problem. I’ll leave that one open.',
  'Fine — that becomes something to find out.',
];

ConversationTurnsSchema.parse(conversationFixture);
ClosingLinesSchema.parse(closingLinesFixture);
ClosingLinesSchema.parse(dontKnowAcksFixture);
