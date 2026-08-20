import { ConversationSchema, type ConversationTurn } from '../schemas/conversation';

/**
 * The scripted AI turns for the Define conversation. The user's own turns
 * are never scripted — they're whatever the person types, or a synthetic
 * "I don't know" when the Don't-Know Button is used — so only the
 * `assistant` side is fixed content here.
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
    text: 'One more on the buying side — who has to say yes to actually paying for this every month? Is it the same person running the front desk?',
    fills: ['who_decides'],
  },
  {
    role: 'assistant',
    text: "There's already reminder software out there. What does this do that they don't?",
    fills: ['what_makes_this_different'],
  },
  {
    role: 'assistant',
    text: "If you could only ship one thing first, what's the smallest version of this that's still real?",
    fills: ['first_version_scope'],
  },
  {
    role: 'assistant',
    text: 'How does this make money — and roughly what would a practice pay?',
    fills: ['how_it_makes_money'],
  },
  {
    role: 'assistant',
    text: 'Last one on go-to-market — how does the first practice actually find out this exists?',
    fills: ['how_customers_find_it'],
  },
  {
    role: 'assistant',
    text: "Before we lock this in — what are you assuming has to be true for this to work, that you haven't actually verified yet?",
    fills: ['assumptions'],
  },
  {
    role: 'assistant',
    text: "Good — I've pulled together everything into a brief on the right. Take a look, and if anything's marked as an open question, that's worth confirming with a real practice before you build. Ready to start the research?",
    fills: ['open_questions'],
  },
];

ConversationSchema.parse(conversationFixture);
