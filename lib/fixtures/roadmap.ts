import { type Roadmap, RoadmapSchema } from '../schemas/roadmap';

export const roadmapFixture: Roadmap = {
  open_questions: [
    {
      id: 'Q01',
      number: 1,
      priority: 2,
      effort: 'days',
      brief_field: 'who_decides',
      question:
        'Who actually has to say yes to a $200-300/month recurring tool at a small practice — the office manager or the owner?',
      why_it_matters:
        'If the owner always has to approve it, the office manager can champion the product but not close the deal alone — the whole sales motion and pitch change.',
      ask: 'Ask the actual decision-maker directly, not just whoever answers the front desk.',
      find_them: [
        {
          type: 'text',
          label: 'Independent practice owner Facebook groups and dental office manager forums',
        },
        {
          type: 'link',
          label: 'The budget-approval thread that raised this question',
          citation_id: 44,
        },
        {
          type: 'count',
          label: "~15 warm contacts collected from this year's regional dental expo",
        },
      ],
      how_many: '8-10 conversations, across both solo-owner and multi-location group practices.',
      script: {
        lines: [
          'Walk me through the last new recurring software tool you bought for the practice.',
          'Who had to approve it before it got signed?',
          'What would make you say no even if the office manager loved it?',
          "Roughly what's the highest monthly fee you'd approve without a longer conversation?",
        ],
      },
      what_you_learn:
        'Whether the buyer is the office manager, the owner, or both — and what the real approval threshold is.',
    },
    {
      id: 'Q02',
      number: 2,
      priority: 4,
      effort: 'days',
      brief_field: 'what_makes_this_different',
      question:
        "How is this different from ChairSync and Recall360's existing reminder/recall products, in a way a skeptical office manager would immediately understand?",
      why_it_matters:
        "If the pitch sounds like 'another reminder tool,' it gets compared to incumbents on price and contract length instead of on the thing only this product does.",
      ask: 'Show, not tell — walk them through what happens in the first 5 minutes after a real cancellation today versus with this.',
      find_them: [
        { type: 'link', label: 'ChairSync and Recall360 review threads', citation_id: 15 },
        { type: 'text', label: 'A practice currently using one of these two incumbents' },
      ],
      how_many: '5-6 practices already using a competing tool.',
      script: {
        lines: [
          'When was the last time a same-week cancellation actually got refilled from your waitlist?',
          'Walk me through exactly what happened, step by step.',
          'If a text went out automatically the second that slot opened, what would need to be true for you to trust it?',
          'What would make this feel redundant with what you already pay for?',
        ],
      },
      what_you_learn:
        'The exact moment in the current workflow where automatic rebooking needs to insert itself to feel obviously different, not incremental.',
    },
    {
      id: 'Q03',
      number: 3,
      priority: 6,
      effort: 'weeks',
      brief_field: 'how_customers_find_it',
      question:
        'Which channel gets the first 10 clinics — dental conference expos, PMS marketplace listings, or cold outreach?',
      why_it_matters:
        'Each channel implies a different first hire, a different sales cycle length, and a different amount of cash needed before the first paying customer.',
      ask: 'Test the two cheapest channels in parallel before committing to a conference booth.',
      find_them: [
        { type: 'link', label: "This year's regional dental expo directory", citation_id: 27 },
        { type: 'link', label: 'The PMS add-on marketplace listing page', citation_id: 24 },
        { type: 'text', label: 'A list of 30 independent practices for cold outreach' },
      ],
      how_many: '30 cold-outreach attempts and 1 marketplace listing, run for 4 weeks in parallel.',
      script: {
        lines: [
          'How did you find the scheduling/reminder tools you use today?',
          "Do you look at your PMS's own add-on marketplace, or search independently?",
          'Would a conference demo actually get you to sign up, or just to remember the name?',
        ],
      },
      what_you_learn:
        'Which channel produces a signed customer fastest and cheapest, not just the most interest.',
    },
    {
      id: 'Q04',
      number: 4,
      priority: 3,
      effort: 'weeks',
      /* The fourth brief link, and the only one that is *reachable*: the other
         three trace to fields the fixture already ships `unknown`, which is why
         Q01-Q03 exist at all. Q04 asks whether patients with no texting history
         will opt in, and the brief's second assumption is literally "Patients
         will opt in to receiving a scheduling text from their dentist" — so
         marking `assumptions` unknown in Define is the one action that can make
         D10's promotion visible. */
      brief_field: 'assumptions',
      question:
        "Will patients who've never gotten a scheduling text from their dentist actually opt in, or does this only work at practices already texting?",
      why_it_matters:
        'If cold opt-in rates are much lower, the whole rebooking mechanism is throttled by SMS reach before it ever gets to speed.',
      ask: 'Run a real opt-in test at a practice that has never sent a scheduling text before.',
      find_them: [
        { type: 'link', label: 'The patient survey on SMS scheduling preference', citation_id: 9 },
        { type: 'text', label: 'One practice partner willing to pilot cold SMS opt-in' },
      ],
      how_many: 'One pilot practice, ~200 patients offered opt-in over 4 weeks.',
      script: {
        lines: [
          'Have you ever gotten a text from this office before today?',
          'Would you want text updates about appointment openings, yes or no?',
          'If no, what would change your mind?',
        ],
      },
      what_you_learn:
        'A real opt-in rate baseline for cold SMS, to size how much of the waitlist is actually reachable.',
      survey: {
        /* The options are data, not decoration: a survey row without its answer
           set is not a survey, it is a question. */
        questions: [
          {
            text: 'Have you received a text from this practice before today?',
            options: 'YES / NO / NOT SURE',
          },
          {
            text: 'If an earlier appointment opened up, would you want a text about it?',
            options: 'YES / NO',
          },
          { text: 'If no — what would change your mind?', options: 'FREE TEXT' },
        ],
        sample_size: '~200 patients over 4 weeks at one practice.',
        note: 'Three-question intercept, handed to patients at check-in for two weeks.',
      },
    },
    {
      id: 'Q05',
      number: 5,
      priority: 5,
      effort: 'weeks',
      brief_field: null,
      question: 'What conversion rate is realistic for a first-touch SMS rebooking offer?',
      why_it_matters:
        "The whole pitch — 'we fill your cancelled slots' — is only as strong as the real conversion rate from text to booked appointment, and existing reminder-text open rates aren't the same metric.",
      ask: 'Simulate the offer manually for two weeks before building any automation.',
      find_them: [
        {
          type: 'text',
          label: 'A pilot practice willing to manually text its own waitlist for two weeks',
        },
        {
          type: 'link',
          label: 'Existing reminder-tool review threads mentioning response behaviour',
          citation_id: 15,
        },
      ],
      how_many: '2 weeks of manually-sent texts at one practice, covering every real cancellation.',
      script: {
        lines: [
          'Every time a slot opens, text the next 3 people on the waitlist by hand.',
          'Log who replied, how fast, and whether they actually showed up.',
          'Repeat for every cancellation over two weeks.',
        ],
      },
      what_you_learn:
        'A real, first-party conversion rate from text-sent to slot-filled, specific to this offer rather than borrowed from reminder-text benchmarks.',
    },
    {
      id: 'Q06',
      number: 6,
      priority: 1,
      effort: 'hours',
      brief_field: null,
      question: 'Which PMS integration should be built first?',
      why_it_matters:
        'Same-day rebooking only works if the cancellation event reaches the product within minutes — that depends entirely on which PMS a pilot practice runs.',
      ask: "Pick the pilot practice's PMS first, then confirm its webhook actually fires fast enough before writing any code.",
      find_them: [
        { type: 'link', label: "The open PMS platform's webhook documentation", citation_id: 21 },
        { type: 'link', label: 'A vendor blog describing webhook latency', citation_id: 20 },
        {
          type: 'count',
          label: '14 scheduling/communication add-ons already listed on one marketplace',
        },
      ],
      how_many:
        'Confirm webhook behaviour with 2-3 PMS vendors before committing to the first integration.',
      script: {
        lines: [
          'Does your platform expose a cancellation event via API or webhook?',
          'How quickly does it fire after the change happens in the schedule?',
          "What's required to get partner/developer access — is it a quick signup or a sales conversation?",
        ],
      },
      what_you_learn:
        'Which PMS to build the first, real integration against — and how long that integration will realistically take to ship.',
    },
  ],
  steps: [
    {
      id: 'S01',
      phase: 'BEFORE_YOU_BUILD',
      kind: 'build',
      start_week: 1,
      duration_weeks: 2,
      description:
        "Before writing any code, settle who the buyer actually is and confirm at least one PMS's cancellation webhook is fast enough to act on same-day.",
      dependencies: ['Q01', 'Q06'],
    },
    {
      id: 'S02',
      phase: 'FIRST_THING_TO_BUILD',
      kind: 'build',
      start_week: 3,
      duration_weeks: 4,
      description:
        'A manual-trigger MVP: front desk marks a slot cancelled, the product texts the next N waitlisted patients in priority order, and the first YES reply auto-books them. No PMS integration yet — the practice enters the cancellation by hand.',
      cut_list: [
        'Automatic PMS webhook detection',
        'Multi-location support',
        'Anything beyond flat monthly pricing',
        'A native mobile app',
      ],
      dependencies: ['Q02', 'Q04', 'Q05'],
    },
    {
      id: 'S03',
      phase: 'THEN',
      kind: 'build',
      start_week: 7,
      duration_weeks: 5,
      description:
        'Once the manual-trigger version proves out a real conversion rate, add the first live PMS webhook integration so cancellations trigger the text automatically instead of requiring a front-desk click.',
      dependencies: ['Q06'],
    },
    {
      id: 'S04',
      phase: 'LATER_AND_ONLY_IF',
      kind: 'build',
      start_week: 12,
      duration_weeks: null,
      description:
        "Only build a second and third PMS integration if the first pilot practice's PMS isn't representative of where the next 10 customers actually come from.",
      cut_list: [
        'A universal PMS adapter framework',
        'Support for practice management systems with no API at all',
      ],
      dependencies: ['Q03', 'Q06'],
    },
    {
      id: 'S05',
      phase: 'WHAT_WOULD_CHANGE_THIS_PLAN',
      kind: 'tripwire',
      start_week: null,
      duration_weeks: null,
      description:
        'If cold SMS opt-in rates come back far lower than reminder-text benchmarks, or if the buyer turns out to always be the practice owner rather than the office manager, the go-to-market motion and the pricing conversation both need to be rebuilt before any more product work.',
      dependencies: ['Q01', 'Q04'],
    },
  ],
};

RoadmapSchema.parse(roadmapFixture);
