import { type Roadmap, RoadmapSchema } from '../schemas/roadmap';

/**
 * The journey for the SMS-rebooking run.
 *
 * Three content rules run through everything below, and all three are worth
 * stating because a future edit will otherwise quietly break them:
 *
 * 1. **Numbers only on someone else's clock — and after A17 that means only in
 *    `setup`.** Every `wait_low`/`wait_high` belongs to a carrier, a software
 *    vendor or a state filing office. No number is printed on a phase, because
 *    that number is unknowable and printing it turns a plan into a source of
 *    shame.
 *
 * 2. **Ambushes must name a proper noun or a threshold, and cost time, money
 *    or legality.** "That sounds great means nothing" and "a gmail address gets
 *    no replies" were both drafted and both cut — the first is interpretation
 *    advice the reader half-knows, the second costs only embarrassment. One of
 *    five phases carries none at all. A per-phase quota is exactly the mechanism
 *    that manufactures filler.
 *
 * 3. **Five rows, and each one is a thing a founder would say out loud.** The
 *    previous fixture had fourteen bars across six tracks. Eight of those bars
 *    were sub-steps of another bar, and the two levels of hierarchy they bought
 *    were the single biggest reason the chart could not be read.
 *
 * Only `A10` and `A11` cite, because the run's `PRACTICAL` dimension came back
 * `thin` with exactly two verified findings. That is the honest number — and
 * both of them landed on the partner agreement, which is now a setup item. The
 * boring list is where the only researched facts on this page live, which is
 * itself worth noticing.
 */
export const roadmapFixture: Roadmap = {
  /* ------------------------------------------------------------------ *
   * Open questions — the question and what turns on the answer. Nothing *
   * else (A17). `priority` orders the list; `brief_field` lets a field  *
   * the user marked unknown in Define float its question to the top.    *
   * ------------------------------------------------------------------ */
  open_questions: [
    {
      id: 'Q01',
      number: 1,
      priority: 2,
      brief_field: 'who_decides',
      question:
        'Who actually has to say yes to a $200–300/month tool — the office manager or the owner?',
      why_it_matters:
        'If the owner signs off on every recurring cost, the office manager can champion the product but never close it alone. Who you pitch, what the pricing page says, and how long a sale takes all change together.',
    },
    {
      id: 'Q02',
      number: 2,
      priority: 4,
      brief_field: 'what_makes_this_different',
      question:
        'How is this different from ChairSync and Recall360, in a way a skeptical office manager gets in one sentence?',
      why_it_matters:
        'Without that sentence you get compared to the incumbents on price and contract length instead of on the one thing only this product does — and you lose that comparison.',
    },
    {
      id: 'Q03',
      number: 3,
      priority: 6,
      brief_field: 'how_customers_find_it',
      question:
        'Which channel gets the first ten clinics — conference expos, a marketplace listing, or cold outreach?',
      why_it_matters:
        'Each one implies a different first hire, a different sales cycle, and a different amount of cash needed before anybody pays you.',
    },
    {
      id: 'Q04',
      number: 4,
      priority: 3,
      brief_field: 'assumptions',
      question:
        'Will patients who have never had a scheduling text from their dentist actually opt in?',
      why_it_matters:
        'If cold opt-in is much lower than the rates reminder tools quote, this only works at practices already texting — a smaller and different market than the pitch assumes.',
    },
    {
      id: 'Q05',
      number: 5,
      priority: 5,
      brief_field: null,
      question: 'What conversion rate is realistic for a first-touch rebooking text?',
      why_it_matters:
        'The whole pitch is "we fill your cancelled slots". It is only as strong as the real rate from text to booked appointment, and a reminder tool\'s open rate is not that number.',
    },
    {
      id: 'Q06',
      number: 6,
      priority: 1,
      brief_field: null,
      question: 'Which practice-management system should you integrate with first?',
      why_it_matters:
        'Same-day rebooking only works if a cancellation reaches the product within minutes, and that depends entirely on which system your pilot practice happens to run.',
    },
  ],

  /* ------------------------------------------------------------------ *
   * The five phases. One row each. Authored in start order, which is    *
   * also the order the chart draws them and the order the sections      *
   * appear below it.                                                    *
   * ------------------------------------------------------------------ */
  phases: [
    {
      id: 'P1',
      name: 'Talk to customers',
      tagline: 'Free, and everything else depends on it.',
      tint: 'amber',
      start: 0,
      end: 0.34,
      summary:
        'Eight conversations with the people who run a front desk, about what they actually did the last time a slot opened up — not about whether they like the idea. Then it thins out but never really stops: every practice you speak to after that is also a possible pilot, a reference, or a reason to change what you are building.',
      starts_when: 'Today. Nothing here costs money or needs code.',
      cost: 'free',
      ambushes: [],
    },
    {
      id: 'P2',
      name: 'Test it by hand',
      tagline: "Not because you can't build it — because you don't yet know what to build.",
      tint: 'sage',
      start: 0.1,
      end: 0.3,
      summary:
        'Every time a slot opens at one pilot practice, you text the next three people on the waitlist yourself and log what happens. No product involved. Two weeks is simply how long it takes real cancellations to occur — the world sets that pace, not you.',
      starts_when: 'Once you can predict what a practice will say before they say it.',
      cost: '$',
      ambushes: [
        {
          id: 'A01',
          species: 'threshold',
          source: 'idea',
          text: "The waitlist becomes patient health information the moment it leaves the practice's own software. The vendor agreement covering that usually only exists above a certain plan tier — so the cheap pilot plan is the one you are not allowed to use.",
        },
        {
          id: 'A02',
          species: 'delayed_signal',
          source: 'idea',
          text: 'Two weeks of real cancellations is six to ten texts. Enough to see whether anyone replies at all, nowhere near enough to trust the rate. Plan to keep doing it by hand while you build.',
        },
      ],
    },
    {
      id: 'P3',
      name: 'Build the product',
      tagline: 'Your clock. No estimate on this row, ever.',
      tint: 'sky',
      start: 0.22,
      end: 0.74,
      summary:
        'The front desk marks a slot cancelled; the product texts waitlisted patients in priority order and books the first yes. At first the cancellation is typed in by hand — the integration that makes it automatic comes second, and which system you build against is decided by your pilot practice, not by market-share guesses.',
      starts_when: 'Once you have a conversion rate you measured yourself.',
      cost: 'free',
      not_in_it: [
        'Automatic cancellation detection — typed in by hand until it works',
        'Support for more than one location',
        'Anything beyond a single flat monthly price',
        'A mobile app',
        'A dashboard',
        'An adapter that works with every practice-management system',
      ],
      ambushes: [
        {
          id: 'A03',
          species: 'obligation',
          source: 'universal',
          text: 'The first clinic that uses this expects you reachable during their business hours. You have taken on a support shift you did not price, and it does not end.',
        },
        {
          id: 'A04',
          species: 'false_generalisation',
          source: 'idea',
          text: "Your pilot practice's software is one data point. The first stranger who pays you will run something else, and the integration you just built does not transfer.",
        },
      ],
    },
    {
      id: 'P4',
      name: 'Get found',
      tagline: 'Starts while the product is still unfinished.',
      tint: 'lilac',
      start: 0.42,
      end: null,
      summary:
        'A page that explains the thing, a listing where practices already shop for add-ons, and showing up where office managers already talk. Later — once there is a live demo and one practice willing to be named — the regional dental expo, which is the one line in this plan that costs real money.',
      starts_when:
        'At roughly 80% built, not after. Waiting until the build is finished is how founders lose a quiet month.',
      cost: '$$$',
      ambushes: [
        {
          id: 'A13',
          species: 'false_generalisation',
          source: 'idea',
          text: 'A booth buys conversations, not customers. Practices remember the name and buy months later, if at all — budget it as spend you will never be able to trace to a signature.',
        },
      ],
    },
    {
      id: 'P5',
      name: 'Win your first customers',
      tagline: 'A beat behind marketing, not after it.',
      tint: 'clay',
      start: 0.5,
      end: null,
      summary:
        'Start with the people who told you about the problem — they are the only ones who already believe it exists, and the cheapest first customers you will ever have. The real test comes after that: a sale to someone you had never met is the only evidence that any of this repeats.',
      starts_when: 'As soon as marketing starts, using the eight conversations you already had.',
      cost: 'free',
      ambushes: [
        {
          id: 'A05',
          species: 'threshold',
          source: 'universal',
          text: 'Nobody wants to be the first customer. You will be asked who else uses this before anyone signs — which is why the pilot practice is worth more as a reference than as revenue.',
        },
        {
          id: 'A06',
          species: 'obligation',
          source: 'idea',
          text: 'Your pilot practice expects to keep using it free forever. Turning a pilot into a paying customer is a separate and awkward conversation — agree the price before the pilot starts, not after.',
        },
        {
          id: 'A07',
          species: 'delayed_signal',
          source: 'universal',
          text: 'Churn is invisible until month four. The practice that quietly stops using it will not tell you — the first sign is a renewal that does not happen.',
        },
      ],
    },
  ],

  /* ------------------------------------------------------------------ *
   * Setup. Deliberately off the chart: none of it is work, and two of   *
   * the five are queues somebody else controls. Those two carry the     *
   * only week numbers on the page.                                      *
   * ------------------------------------------------------------------ */
  setup: [
    {
      id: 'S1',
      label: 'A domain, and an email address on it',
      detail:
        'Buy it, point an inbox at it, move on. The .com is probably taken and that is fine. It is first only because everything else you send comes from it.',
      when: 'Today, in about ten minutes.',
      cost: '$',
      wait_low: null,
      wait_high: null,
      ambushes: [],
    },
    {
      id: 'S2',
      label: 'An SMS number, and carrier registration',
      detail:
        'You cannot text patients from an ordinary US number. Registering the business and the use case with the carriers is a queue you join, not a form you submit.',
      when: 'Three weeks before your first text — which means now, not at the pilot.',
      cost: '$',
      wait_low: 2,
      wait_high: 3,
      ambushes: [
        {
          id: 'A09',
          species: 'lead_time',
          source: 'idea',
          text: 'Registrations get rejected for vague use-case descriptions, and a rejection restarts the clock rather than pausing it. Write the sample message exactly as you will actually send it.',
        },
      ],
    },
    {
      id: 'S3',
      label: 'The practice-software partner agreement',
      detail:
        'Webhook access is gated behind a signed agreement with the software vendor. Applying once the code is ready puts these weeks in series after your build instead of alongside it.',
      when: 'Before the build finishes — not when the integration needs it.',
      cost: 'free',
      wait_low: 2,
      wait_high: 3,
      ambushes: [
        {
          id: 'A10',
          species: 'lead_time',
          source: 'run',
          citation_id: 46,
          text: "The two to three weeks is the vendor's queue, not your paperwork — nothing you do makes it move faster. Start it while you are still building, or it lands entirely after you finish.",
        },
        {
          id: 'A11',
          species: 'threshold',
          source: 'run',
          citation_id: 47,
          text: "The webhook cap is 100 events a minute across your whole integration, not per practice. Steady-state cancellations will never approach it; the first time you backfill a new clinic's schedule, you will hit it immediately.",
        },
      ],
    },
    {
      id: 'S4',
      label: 'Company, EIN, bank account, Stripe',
      detail:
        'A chain, not four errands: the company has to exist before the EIN, the EIN before the bank account, the bank account before Stripe will pay out.',
      when: 'The moment someone says they will pay — not the day they try to.',
      cost: '$$',
      wait_low: 2,
      wait_high: 2,
      ambushes: [
        {
          id: 'A12',
          species: 'lead_time',
          source: 'idea',
          text: 'Your first customer will send a contract and a security questionnaire before they send money. Having a one-page answer already written is the difference between closing in a week and closing in a month.',
        },
      ],
    },
    {
      id: 'S5',
      label: 'Liability insurance and vendor agreements',
      detail:
        'Errors-and-omissions cover, plus the signed agreements covering patient data with every vendor that touches it. Nobody buys this before it is requested, and that is fine.',
      when: 'When a customer asks for it — and one will.',
      cost: '$$',
      wait_low: null,
      wait_high: null,
      ambushes: [],
    },
  ],

  /* ------------------------------------------------------------------ *
   * Milestones — and, since A17, the chart's x-axis. Ascending, and     *
   * spaced so no two markers collide at 1200px.                         *
   *                                                                     *
   * **M01 sits at 0**: the axis begins at the first marker rather than  *
   * floating it a sixth of the way in, which left the opening bar with  *
   * no vertical reference beside it. The four after it were re-spread   *
   * to keep the gaps even across the width.                             *
   * ------------------------------------------------------------------ */
  milestones: [
    {
      id: 'M01',
      at: 0,
      label: '8 practices talked to',
      proof: 'You can predict what the ninth will say before they say it.',
    },
    {
      id: 'M02',
      at: 0.22,
      label: 'A real conversion rate',
      proof: 'Measured from texts you sent yourself — not borrowed from a reminder-tool benchmark.',
    },
    {
      id: 'M03',
      at: 0.48,
      label: 'Used twice without you',
      proof: 'A clinic ran it alone, twice. Not a demo you drove.',
    },
    {
      id: 'M04',
      at: 0.7,
      label: 'Money cleared',
      proof: 'In the bank. Not a signed intent, not a verbal yes.',
    },
    {
      id: 'M05',
      at: 0.92,
      label: 'A customer who found you',
      proof:
        'Someone you had never met bought it. This is the first evidence that any of it repeats.',
    },
  ],

  money: {
    legend: [
      { band: 'free', meaning: 'Genuinely nothing — not a trial that expires.' },
      {
        band: '$',
        meaning: 'Under about $25 a month, or a one-off under about $100. Do not think about it.',
      },
      { band: '$$', meaning: "A real line item. You'll notice it on a statement." },
      { band: '$$$', meaning: 'A decision to make deliberately, not a subscription to start.' },
    ],
    items: [
      { label: 'Domain', band: '$', when: 'Day one' },
      { label: 'Email on your domain', band: '$', when: 'Day one' },
      { label: 'Hosting', band: 'free', when: 'The free tier is genuinely enough here, for years' },
      { label: 'Database', band: 'free', when: 'Same' },
      { label: 'SMS number and carrier registration', band: '$', when: 'Before the pilot' },
      { label: 'Messages', band: '$', when: 'Scales with use, still trivial at this volume' },
      {
        label: 'Stripe',
        band: 'free',
        when: 'No monthly fee — it takes a cut of what you are paid',
      },
      {
        label: 'Company and registered agent',
        band: '$$',
        when: 'When someone says they will pay',
      },
      { label: 'Liability insurance', band: '$$', when: 'When a customer asks, and one will' },
      { label: 'The dental expo booth', band: '$$$', when: 'The only real decision on this list' },
    ],
    headline:
      'Everything on this list except the booth adds up to about $$ a month. Infrastructure is not your constraint — your time is.',
    credits:
      'AWS Activate, Google for Startups and Azure all give real credit to early companies. Apply when the company exists, not now: several want an incorporated entity, and the clock on the credit starts the day you accept it rather than the day you need it.',
    calibration:
      'Comparable tools charge $199-299, and practices describe paying $150-250 without hesitation. At $200 a month, 42 practices is $100,000 a year. Look at that number before you price at $49.',
  },

  tripwires: [
    {
      id: 'W01',
      condition: 'Cold opt-in comes back far below the rates reminder-text tools quote.',
      consequence:
        'The reachable slice of the waitlist is smaller than the pitch assumes, and this becomes a tool for practices that already text — a smaller and different market. Re-scope before building any integration.',
      questions: ['Q04'],
    },
    {
      id: 'W02',
      condition: 'The owner signs off on every recurring cost, not the office manager.',
      consequence:
        'The person you have been demoing to is a champion, not a buyer. Who you pitch, what the pricing page says, and how long the cycle takes all change together.',
      questions: ['Q01'],
    },
    {
      id: 'W03',
      condition: 'Practices turn out not to keep a waitlist in any usable form.',
      consequence:
        'The first thing to build is the waitlist, not the messaging. That is a bigger product with a harder sell — stop and rethink scope before writing code.',
      questions: ['Q05'],
    },
    {
      id: 'W04',
      condition:
        'The pilot conversion rate lands close to what the front desk already gets by phone.',
      consequence:
        "The product is not faster, only cheaper — and cheaper does not survive an incumbent's 12-month contract. Change what it does before changing how it is sold.",
      questions: ['Q02', 'Q05'],
    },
  ],
};

RoadmapSchema.parse(roadmapFixture);
