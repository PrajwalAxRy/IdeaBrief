import { type Report, ReportSchema } from '../schemas/report';
import { evidenceFixture } from './evidence';

const findingsFor = (dimension: string) =>
  evidenceFixture.filter((finding) => finding.dimension === dimension);

export const reportFixture: Report = {
  summary: {
    text:
      'Same-week cancellations and no-shows are a real, costly problem for small dental practices, ' +
      'with practices reporting a 14.2% average cancellation rate and $150-250 in lost production per ' +
      'empty chair-hour [2][3]. The current fix is almost entirely manual — a phone-based waitlist worked ' +
      'from memory or a sticky note [4][12]. Existing tools already send reminders well, but none of the ' +
      'reviewed products automatically rebook a cancelled slot end-to-end [15][19]. Demand signals are ' +
      'encouraging: practices describe a willingness to pay $150-250/month without hesitation, and a similar ' +
      'demo drew one of the longer lines at a regional dental expo [26][27]. The clearest open risk is who ' +
      'actually approves a new recurring tool at a small, owner-run practice [44].',
    citations: [2, 3, 4, 12, 15, 19, 26, 27, 44],
  },
  dimensions: {
    PROBLEM: {
      dimension: 'PROBLEM',
      meta: { count: 14, sources: 12, date_range: '2025-01 to 2025-12' },
      confidence: 'solid',
      prose: {
        text:
          'Front-desk staff consistently describe cancellation rebooking as a manual, memory-driven ' +
          'process rather than a system [1][4][12]. Independent survey data puts the average same-week ' +
          'cancellation rate at 14.2%, and practices without an automated reminder system see meaningfully ' +
          'higher no-show rates than those with one [2][7]. Not every practice agrees this is painful — ' +
          'busier practices say walk-ins backfill quickly enough [14].',
        citations: [1, 2, 4, 7, 12, 14],
      },
      findings: findingsFor('PROBLEM'),
    },
    WHAT_EXISTS: {
      dimension: 'WHAT_EXISTS',
      meta: { count: 11, sources: 11, date_range: '2025-01 to 2025-11' },
      confidence: 'solid',
      prose: {
        text:
          'Existing tools already do reminders and recall well, but none of the products reviewed ' +
          'automatically rebook a cancelled slot end-to-end [15][19]. Two competitors expose a waitlist ' +
          'feature, but both require a staff member to manually trigger it rather than acting on a live ' +
          'cancellation [15][16]. Most relevant PMS platforms already expose the cancellation event a ' +
          'rebooking product would need [20][21].',
        citations: [15, 16, 19, 20, 21],
      },
      findings: findingsFor('WHAT_EXISTS'),
    },
    DEMAND_SIGNALS: {
      dimension: 'DEMAND_SIGNALS',
      meta: { count: 7, sources: 7, date_range: '2025-04 to 2025-11' },
      confidence: 'mixed',
      prose: {
        text:
          'Practices describe real willingness to pay $150-250/month without hesitation, and a live ' +
          'rebooking demo drew one of the longer lines at a regional dental expo [26][27]. Not everyone is ' +
          'convinced without proof — one practice recalled a similar pitch from a startup that never ' +
          'shipped [29]. The broader category looks under-served relative to spend per seat in comparable ' +
          'verticals [30].',
        citations: [26, 27, 29, 30],
      },
      findings: findingsFor('DEMAND_SIGNALS'),
    },
    MONEY: {
      dimension: 'MONEY',
      meta: { count: 13, sources: 12, date_range: '2025-01 to 2025-12' },
      confidence: 'solid',
      prose: {
        text:
          'Comparable tools price between $199 and $299 per month [33][34]. The recurring complaints are ' +
          'about contract length and per-message billing, not the headline price itself [35][36]. Lost ' +
          'production from unfilled cancelled slots is estimated at $2,000-4,000 a month, which frames the ' +
          'ROI case, though budget sign-off often still needs the practice owner, not just the office ' +
          'manager [41][44].',
        citations: [33, 34, 35, 36, 41, 44],
      },
      findings: findingsFor('MONEY'),
    },
    PRACTICAL: {
      dimension: 'PRACTICAL',
      meta: { count: 2, sources: 2, date_range: '2025-09 to 2025-10' },
      confidence: 'thin',
      prose: {
        text:
          'The web has little to say here — the two things we could confirm are that webhook access ' +
          'typically requires a signed partner agreement (2-3 weeks) and that delivery is rate-limited to ' +
          '100 events per minute per integration [46][47].',
        citations: [46, 47],
      },
      findings: findingsFor('PRACTICAL'),
    },
  },
  competitors: [
    {
      name: 'ChairSync',
      geography: 'US, primarily independent practices',
      price: '$299/mo per location, 12-month minimum contract',
      difference_from_idea:
        'Reminders and reviews are its core product; rebooking a cancelled slot is still a manual, staff-driven step.',
      moat: 'Six years of PMS integrations and a large existing reminder-customer base to cross-sell into.',
      take_from_them:
        'Their onboarding call model builds trust with skeptical office managers before asking for a contract.',
      ignore: "The 12-month contract requirement — it's cited as a signup blocker, not a strength.",
      capabilities: [
        { key: 'reminders', level: 'yes', citations: [15] },
        { key: 'recall', level: 'yes', citations: [15] },
        { key: 'waitlist', level: 'no', citations: [15] },
        { key: 'auto_rebook', level: 'no', citations: [15, 19] },
        { key: 'pms_integration', level: 'unknown', citations: [] },
      ],
    },
    {
      name: 'Recall360',
      geography: 'US and Canada',
      price: '$199/mo starter tier, billed annually',
      difference_from_idea:
        'Its waitlist feature exists but requires a staff member to manually open it and choose who to text — nothing fires automatically on cancellation.',
      moat: 'Bundled recall, reminder, and review-request features reduce the number of vendor relationships a practice needs.',
      take_from_them:
        'The annual-billing discount lands well with budget-conscious owners, per pricing discussion threads.',
      ignore:
        "Marketing it as an 'all-in-one' platform, given it still can't act on a cancellation in real time.",
      capabilities: [
        { key: 'reminders', level: 'yes', citations: [16, 23] },
        { key: 'recall', level: 'yes', citations: [18, 23] },
        { key: 'waitlist', level: 'partial', citations: [16] },
        { key: 'auto_rebook', level: 'no', citations: [16, 19] },
        { key: 'pms_integration', level: 'unknown', citations: [] },
      ],
    },
    {
      name: 'FrontDeskPro',
      geography: 'US, broad general-practice PMS install base',
      price:
        'Core PMS pricing varies by seat count; scheduling add-ons priced separately per marketplace listing',
      difference_from_idea:
        "It's the underlying practice management system many target customers already run — not a rebooking competitor so much as a possible integration partner or channel.",
      take_from_them:
        'Its existing marketplace of add-ons is a plausible distribution channel worth testing before cold outreach.',
      // moat and ignore deliberately absent — exercises "not established from available evidence"
      capabilities: [
        { key: 'reminders', level: 'partial', citations: [17] },
        { key: 'recall', level: 'unknown', citations: [] },
        { key: 'waitlist', level: 'unknown', citations: [] },
        { key: 'auto_rebook', level: 'no', citations: [19] },
        { key: 'pms_integration', level: 'yes', citations: [17, 24] },
      ],
    },
  ],
  /* A list of keys with no `level`, deliberately — there is nothing to draw a
     mark from, which is what keeps the idea a fourth *column* in a different
     register rather than a fourth row of marks (C7). */
  idea_capabilities: ['waitlist', 'auto_rebook', 'pms_integration'],
  surprises: [
    {
      headline: 'The owner signs off, not the office manager.',
      detail: {
        text:
          'Several threads mention the practice owner has to approve anything recurring, even at ' +
          'solo-owner shops where an office manager runs daily operations [44]. Above roughly $300 a ' +
          'month it stops being the office manager’s decision at all [42].',
        citations: [42, 44],
      },
    },
    {
      /* [25][29], never [25][31]. EV_31 is ChairSync's *live* $6M raise, and
         ChairSync is priced two sections earlier in this same report; pairing
         it with a shutdown claim would make the fixture assert that a
         still-trading competitor has closed. `CitedTextSchema.refine()` passes
         it happily because both numbers resolve — which is exactly why the
         fixture, not the schema, is where this has to be got right. EV_29 is
         the practice that remembers a pitch that never shipped, and it is what
         the sentence actually says. */
      headline: 'Someone already tried this wedge and shut down.',
      detail: {
        text:
          'A rebooking-specific startup listed in a 2022 directory no longer has an active website ' +
          '[25], and at least one practice remembers being pitched something similar that never ' +
          'shipped [29].',
        citations: [25, 29],
      },
    },
    {
      headline: 'The objection is the contract, not the price.',
      detail: {
        text:
          'Pricing resistance was almost entirely about contract length and per-message billing rather ' +
          'than the flat monthly fee [35][36]. A 12-month minimum almost stopped one practice signing ' +
          'with a competitor [36].',
        citations: [35, 36],
      },
    },
  ],
  unanswered: [
    {
      question:
        'Which specific PMS platforms need direct integrations first, versus which practices would tolerate a manual CSV-based waitlist as a v1 workaround.',
      why_unanswered:
        'No public source lists PMS market share by practice size; every figure found was vendor-published.',
    },
    {
      question:
        "Whether patients who've never received a scheduling text from their dentist will opt in at meaningfully different rates than patients already used to reminder texts.",
      why_unanswered:
        'Every opt-in rate found was measured at practices already sending reminder texts.',
    },
    {
      question:
        'What conversion rate is realistic for a first-touch SMS rebooking offer, versus the reminder-text open rates cited in existing tool reviews.',
      why_unanswered: 'Reviews quote reminder open rates, never a rebooking-offer conversion rate.',
    },
  ],
};

ReportSchema.parse(reportFixture);
