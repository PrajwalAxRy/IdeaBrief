/**
 * Content for `/trial3` — the Audacity workspace concept.
 *
 * **Everything here is hardcoded.** There is no AI in this repo and no
 * backend: the Define "conversation" is a scripted exchange replayed
 * character-by-character, and the summary fills as those scripted turns land.
 * Nothing is generated. See CLAUDE.md §"Scope: hardcoded frontend only".
 *
 * It lives in `lib/content/` rather than `lib/fixtures/` deliberately. A
 * fixture is run data and may only be read through `lib/db/queries.ts`, which
 * parses it against a Zod schema at the seam; this is page copy for a
 * throwaway concept route, the same arrangement `/experiment` has with
 * `lib/content/roadmap-experiment.ts`. If the concept ships, its data moves
 * behind the queries seam and its recipes move out of `styles/audacity.css`.
 *
 * The idea itself is the house fixture — the SMS rebooking tool for dental
 * clinics from `lib/fixtures/conversation.ts` — so the concept can be read
 * against the shipping Define page without a second story to hold in mind.
 */

export type Stage = 'define' | 'validate' | 'roadmap';

export type ChatSession = {
  id: string;
  title: string;
  stage: Stage;
  /** Mono metadata; already formatted, because the meta layer never computes. */
  when: string;
  group: string;
};

/** The left rail. `sv_4f2a` is the one open in the workspace. */
export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'sv_4f2a',
    title: 'SMS rebooking for dental clinics',
    stage: 'define',
    when: 'NOW',
    group: 'Today',
  },
  {
    id: 'sv_39b1',
    title: 'Fleet EV charging scheduler',
    stage: 'roadmap',
    when: '2D',
    group: 'Earlier',
  },
  {
    id: 'sv_2e77',
    title: 'Sourdough starter subscription',
    stage: 'validate',
    when: '5D',
    group: 'Earlier',
  },
  {
    id: 'sv_1c04',
    title: 'Warehouse shift swap board',
    stage: 'define',
    when: '11D',
    group: 'Earlier',
  },
  {
    id: 'sv_0a91',
    title: 'Invoice chasing for freelancers',
    stage: 'roadmap',
    when: '3W',
    group: 'Earlier',
  },
];

export type SummaryField = {
  key: string;
  /** Mono label. Uppercase happens in CSS, not here. */
  label: string;
  value: string | null;
};

/**
 * The nine brief fields, in the order the scripted conversation fills them.
 * `null` is a field the conversation has not reached — never invented to fill
 * a slot, which is the product definition's oldest rule.
 */
export const SUMMARY_FIELDS: SummaryField[] = [
  {
    key: 'one_liner',
    label: 'One-liner',
    value:
      'An SMS tool that fills a dental appointment slot the moment it opens, by texting the waitlist in order.',
  },
  {
    key: 'product',
    label: 'Product',
    value:
      'Watches the practice calendar. On a cancellation it texts waitlisted patients one at a time; first reply takes the slot and the calendar updates.',
  },
  {
    key: 'customer',
    label: 'Customer',
    value: 'Front-desk staff at two-to-six chair private practices.',
  },
  { key: 'problem', label: 'Problem', value: null },
  { key: 'how_they_solve_it_today', label: 'How they solve it today', value: null },
  { key: 'first_version_scope', label: 'First-version scope', value: null },
  { key: 'who_decides', label: 'Who decides', value: null },
  { key: 'what_makes_this_different', label: 'What makes this different', value: null },
  { key: 'money', label: 'How it makes money', value: null },
];

export type Turn = {
  role: 'user' | 'assistant';
  text: string;
};

/** The turns already on screen when the page loads. */
export const OPENING_TURNS: Turn[] = [
  {
    role: 'user',
    text: 'I want to build something that fills dental appointment slots when someone cancels. Right now the front desk just phones down a list and mostly gives up.',
  },
  {
    role: 'assistant',
    text: "Got it — an SMS-based rebooking tool for dental clinics. When a slot opens up, what exactly happens in your product? Walk me through it like I've never seen a scheduling app before.",
  },
  {
    role: 'user',
    text: 'It watches the calendar. The second a slot frees up it texts the waitlist one at a time — first person to reply YES gets it, and the calendar books them in automatically.',
  },
  {
    role: 'assistant',
    text: "Who's actually using this day to day — the dentist, the front-desk person, or someone else? And what size of practice are we talking about?",
  },
  {
    role: 'user',
    text: 'The front-desk person. Small private practices, two to six chairs.',
  },
];

/**
 * The scripted exchange. Sending anything advances one step: the user's own
 * text is whatever they typed (or the seed they clicked), and the assistant's
 * reply plus the field it fills are fixed.
 *
 * `fills` names a key in `SUMMARY_FIELDS`; `value` is what lands in the right
 * rail when the reply finishes streaming. A step with `approve: true` is the
 * end of the script — the composer swaps to the approve action.
 */
export type ScriptStep = {
  /** Used when the step is triggered by a seed chip rather than typed input. */
  seed: string;
  reply: string;
  fills: string;
  value: string;
  approve?: boolean;
};

export const SCRIPT: ScriptStep[] = [
  {
    seed: 'They lose the slot entirely — it just goes empty.',
    reply:
      "That's the number I'd want to pin down. Before this exists, how are practices handling that gap today? List everything you've seen or heard, even the hacky stuff.",
    fills: 'problem',
    value:
      'A cancelled slot inside 24 hours usually goes unfilled. Phoning down a paper waitlist takes the front desk out of action and rarely lands anyone.',
  },
  {
    seed: 'A paper waitlist, a group text, or nothing at all.',
    reply:
      "Useful — a group text is the one I'd want to look at hardest, because it's free and it half works. If you could only ship one thing first, what's the smallest version of this that's still real?",
    fills: 'how_they_solve_it_today',
    value:
      'Paper waitlist and phone calls, a manual group text, or the slot is simply written off. A few practices post to a private Facebook group.',
  },
  {
    seed: 'One-way text blast, manual confirm by the front desk.',
    reply:
      "That's a real first version — it doesn't need calendar write access, which is the part that takes months. Who has to say yes to actually paying for this every month? Is it the same person running the front desk?",
    fills: 'first_version_scope',
    value:
      'A one-way text blast to a waitlist the practice pastes in, with the front desk confirming the booking by hand. No calendar write access.',
  },
  {
    seed: 'The practice owner signs, the office manager pushes for it.',
    reply:
      "Noted — two people, one signature. There's already reminder software out there. What does this do that they don't?",
    fills: 'who_decides',
    value:
      'The practice owner signs. The office manager is the one who asks for it and runs the trial.',
  },
  {
    seed: 'Reminders stop no-shows. This fills the hole after one.',
    reply:
      "That's a clean distinction and it's the one I'd put in front of a buyer. Last one — how does this make money, and roughly what would a practice pay?",
    fills: 'what_makes_this_different',
    value:
      'Reminder tools reduce no-shows before the fact. Nothing on the market fills the slot after a cancellation has already happened.',
  },
  {
    seed: 'Flat monthly fee, somewhere near a filled slot a week.',
    reply:
      "That's the brief. Nine fields, all yours — nothing in it is mine. Approve it and I'll go looking for evidence: who else has tried this, what practices actually pay for scheduling software, and how big the cancellation gap really is.",
    fills: 'money',
    value:
      'Flat monthly subscription, priced against roughly one recovered slot a week. No per-message billing.',
    approve: true,
  },
];

/** Seed chips under the composer, one per script step. */
export const SEEDS = SCRIPT.map((step) => step.seed);

/* ---------------------------------------------------------------------------
   The two locked stages. Code-drawn previews, so this is the data behind a
   fragment rather than copy for a marketing page. Numbers are real fixture
   numbers; the prose is deliberately absent and drawn as hairline bars, which
   is what makes it read as a preview rather than as a broken screen.
   ------------------------------------------------------------------------ */

export type StagePreview = {
  stage: Stage;
  title: string;
  /** Sans, one sentence. What this stage produces. */
  blurb: string;
  /** Mono. Why it isn't available yet. */
  gate: string;
  stats: { value: string; label: string }[];
};

export const VALIDATE_PREVIEW: StagePreview = {
  stage: 'validate',
  title: 'Validate',
  blurb:
    'A research report where every claim is matched to text on a real page — no verdict, no score, and "I don\'t know" wherever the evidence runs out.',
  gate: 'Unlocks when the brief is approved',
  stats: [
    { value: '14', label: 'Findings' },
    { value: '41', label: 'Sources' },
    { value: '06', label: 'Open questions' },
  ],
};

export const ROADMAP_PREVIEW: StagePreview = {
  stage: 'roadmap',
  title: 'Roadmap',
  blurb:
    'Five phases against a milestone axis, with the setup work, the costs, and the tripwires that should make you stop.',
  gate: 'Unlocks when research completes',
  stats: [
    { value: '05', label: 'Phases' },
    { value: '11', label: 'Setup items' },
    { value: '04', label: 'Tripwires' },
  ],
};

/** Phase rows for the roadmap peek. `weeks` positions the bar on the axis. */
export const ROADMAP_PHASES = [
  { id: 'P1', label: 'Prove the gap', span: '0–2', weeks: [0, 2] },
  { id: 'P2', label: 'Hand-run the blast', span: '2–5', weeks: [2, 5] },
  { id: 'P3', label: 'Automate the send', span: '4–9', weeks: [4, 9] },
  { id: 'P4', label: 'Calendar write-back', span: '8–14', weeks: [8, 14] },
  { id: 'P5', label: 'First paid practices', span: '12–18', weeks: [12, 18] },
];

export const ROADMAP_AXIS = ['WK 0', 'WK 6', 'WK 12', 'WK 18'];

export const RUN_META = {
  id: 'SV_4F2A',
  status: 'Draft brief',
};
