import { EvidenceSchema, type Finding } from '../schemas/evidence';

/**
 * One complete run's evidence for "SMS rebooking for dental clinics" — the
 * blueprint's own running example. 47 verified findings across 5 dimensions.
 *
 * Deviation from the plan's literal `[12, 9, 6, 11, 2]` (which sums to 40,
 * not 47): both numbers appear in the same source sentence in
 * `only_frontend_build_plan.md`, and "47" is also the number baked into the
 * design spec's own canonical Meta Line example
 * (`02-visual-direction.md` §2.5: "47 VERIFIED"). Treating 47 as correct and
 * the per-dimension array as the arithmetic slip, the distribution here is
 * `[14, 11, 7, 13, 2]` (sum 47) — Practical stays at 2, deliberately thin,
 * and the overall shape (Problem highest, Practical lowest) is preserved.
 * Logged in the build log; revisit if the design owner meant the opposite.
 */
export const evidenceFixture: Finding[] = [
  // ---------- PROBLEM (14) ----------
  {
    id: 'EV_01',
    dimension: 'PROBLEM',
    text: 'Front-desk staff describe rebooking a cancelled slot as a manual, memory-driven process.',
    excerpt:
      "Calling down the list one by one for a 2pm opening is 20 minutes I don't have between patients.",
    source_url: 'https://dentalfrontdesk.forum/thread/no-show-waitlist',
    source_date: '2025-11-03',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_02',
    dimension: 'PROBLEM',
    text: 'Independent survey data puts the average same-week cancellation rate at 14.2%.',
    excerpt: 'Across the 412 practices surveyed, the mean same-week cancellation rate was 14.2%.',
    source_url: 'https://practicepulse.news/dental-noshow-report-2025',
    source_date: '2025-09-18',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_03',
    dimension: 'PROBLEM',
    text: 'An empty chair-hour is estimated to cost a general practice $150-250 in lost production.',
    excerpt:
      'A single unfilled hygiene slot represents roughly $180 in lost same-day production for the average two-chair practice.',
    source_url: 'https://chairtime.io/blog/cancellation-cost',
    source_date: '2025-08-02',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_04',
    dimension: 'PROBLEM',
    text: 'Office managers say the waitlist call-down is worked from memory or a sticky note, not a system.',
    excerpt:
      "We just keep a running list of who said 'call me if anything opens up' on a legal pad by the phone.",
    source_url: 'https://dentalofficemgrs.example/group/waitlist-tools',
    source_date: '2025-07-22',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_05',
    dimension: 'PROBLEM',
    text: 'Hygienists corroborate the burden of the manual call-down process.',
    excerpt:
      "By the time front desk gets through the list, the slot's usually gone to a walk-in instead.",
    source_url: 'https://hygienetalk.example/forum/rebooking',
    source_date: '2025-06-14',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_06',
    dimension: 'PROBLEM',
    text: 'Patients already expect texting from other kinds of service providers.',
    excerpt: "Patients ask us why we don't just text like their hair stylist does.",
    source_url: 'https://smallpracticeforum.example/thread/sms-reminders',
    source_date: '2025-05-30',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_07',
    dimension: 'PROBLEM',
    text: 'No-show rates are meaningfully higher at practices without an automated reminder system.',
    excerpt:
      'No-show rates were highest in practices without an automated reminder system (16.8%) versus those with one (9.1%).',
    source_url: 'https://dentalbenchmarks.example/no-show-rates-by-region',
    source_date: '2025-04-11',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_08',
    dimension: 'PROBLEM',
    text: 'Front-desk staff spend real, measurable time on rebooking-related phone calls.',
    excerpt:
      'Front-desk staff estimated spending 45-90 minutes a day on rebooking-related phone calls.',
    source_url: 'https://dentalhrforum.example/thread/front-desk-time',
    source_date: '2025-03-27',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_09',
    dimension: 'PROBLEM',
    text: 'Not every patient prefers SMS over a phone call for scheduling.',
    excerpt:
      '18% of patients surveyed said they preferred a phone call over a text for anything scheduling-related.',
    source_url: 'https://patientexperience.example/survey-sms-optin',
    source_date: '2025-02-19',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_10',
    dimension: 'PROBLEM',
    text: 'A local news story frames cancellation waves as a real, visible cost.',
    excerpt:
      'Valley Dental says a single snow-day cancellation wave cost them nine chair-hours in one week.',
    source_url: 'https://localnews.example/valleydental-cancellation-story',
    source_date: '2025-01-08',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_11',
    dimension: 'PROBLEM',
    text: 'A second reply in the same thread confirms the waitlist is often never fully worked.',
    excerpt: 'Some days I never even get to the bottom of the list before the day is over.',
    source_url: 'https://dentalfrontdesk.forum/thread/no-show-waitlist',
    source_date: '2025-11-05',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_12',
    dimension: 'PROBLEM',
    text: "There's no step in most practice-management software that flags a freshly opened slot.",
    excerpt:
      "There's no step in most PMS software that flags 'this slot just opened, here's who to call.'",
    source_url: 'https://dentistrytoday.example/waitlist-workflow',
    source_date: '2025-10-02',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_13',
    dimension: 'PROBLEM',
    text: 'A typical practice waitlist runs 15-20 names at any given time.',
    excerpt: 'Our waitlist usually has 15-20 names on it at any given time.',
    source_url: 'https://hygienetalk.example/forum/rebooking',
    source_date: '2025-06-20',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_14',
    dimension: 'PROBLEM',
    text: 'Some busier practices say backfill from walk-ins already solves this for them.',
    excerpt:
      "Honestly at our size we backfill from walk-ins fast enough that this isn't really a problem for us.",
    source_url: 'https://redditlike.example/r/dentistry/comments/waitlist',
    source_date: '2025-12-01',
    stance: 'challenges',
    verified: true,
  },

  // ---------- WHAT_EXISTS (11) ----------
  {
    id: 'EV_15',
    dimension: 'WHAT_EXISTS',
    text: 'ChairSync sends reminder texts well but does not automate rebooking after a cancellation.',
    excerpt:
      "ChairSync sends great reminder texts but if someone cancels, you're still calling the list yourself.",
    source_url: 'https://capterra-like.example/chairsync/reviews',
    source_date: '2025-11-14',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_16',
    dimension: 'WHAT_EXISTS',
    text: "Recall360's waitlist feature exists but requires a manual trigger, not an automatic one.",
    excerpt:
      "Recall360's waitlist module exists but you have to manually open it and pick who to text — it's not automatic.",
    source_url: 'https://capterra-like.example/recall360/reviews',
    source_date: '2025-10-29',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_17',
    dimension: 'WHAT_EXISTS',
    text: 'FrontDeskPro treats scheduling and marketing/communication as separate add-ons.',
    excerpt:
      'FrontDeskPro is our main system but scheduling and marketing are totally separate add-ons.',
    source_url: 'https://capterra-like.example/frontdeskpro/reviews',
    source_date: '2025-09-05',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_18',
    dimension: 'WHAT_EXISTS',
    text: "Recall360's own marketing focuses on long-horizon recall, not same-week rebooking.",
    excerpt: 'Recall360 focuses on recall reminders 6 months out, not same-week rebooking.',
    source_url: 'https://softwarematch.example/recall360',
    source_date: '2025-08-19',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_19',
    dimension: 'WHAT_EXISTS',
    text: 'A roundup of 9 dental SMS tools found none that automatically rebook a cancelled slot end-to-end.',
    excerpt:
      'Of the 9 SMS tools we reviewed for dental, none automatically rebook a cancelled slot end-to-end.',
    source_url: 'https://dentalsoftwarecompare.example/sms-tools',
    source_date: '2025-07-08',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_20',
    dimension: 'WHAT_EXISTS',
    text: 'At least one PMS vendor fires a scheduling webhook within 30 seconds of a status change.',
    excerpt:
      'Our scheduling webhook fires within 30 seconds of any appointment status change, including cancellations.',
    source_url: 'https://pmsvendorblog.example/api-webhooks',
    source_date: '2025-06-02',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_21',
    dimension: 'WHAT_EXISTS',
    text: "An open PMS platform's cancellation event includes the freed slot and the patient record.",
    excerpt:
      'The `appointment.cancelled` event includes the freed time slot and the patient record.',
    source_url: 'https://openpms.example/docs/webhooks',
    source_date: '2025-05-11',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_22',
    dimension: 'WHAT_EXISTS',
    text: 'ChairSync is seen as powerful but heavy for a small office to onboard.',
    excerpt:
      "ChairSync is powerful but it's a 45-minute onboarding call and a contract — overkill for a 2-chair office.",
    source_url: 'https://g2reviews.example/chairsync',
    source_date: '2025-04-24',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_23',
    dimension: 'WHAT_EXISTS',
    text: 'Recall360 positions itself as an all-in-one recall, reminder, and review-request platform.',
    excerpt: 'Recall360 — the all-in-one recall, reminder, and review-request platform for dental.',
    source_url: 'https://producthunt-like.example/recall360',
    source_date: '2025-03-15',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_24',
    dimension: 'WHAT_EXISTS',
    text: 'A PMS add-on marketplace already lists 14 scheduling and communication add-ons.',
    excerpt: '14 scheduling and communication add-ons are currently listed for this PMS.',
    source_url: 'https://app-marketplace.example/pms-addons',
    source_date: '2025-02-27',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_25',
    dimension: 'WHAT_EXISTS',
    text: 'A prior rebooking-focused startup from 2022 appears to have shut down.',
    excerpt:
      'One directory-listed rebooking startup from 2022 appears to no longer have an active website.',
    source_url: 'https://dentalstartups.example/directory',
    source_date: '2025-01-30',
    stance: 'neutral',
    verified: true,
  },

  // ---------- DEMAND_SIGNALS (7) ----------
  {
    id: 'EV_26',
    dimension: 'DEMAND_SIGNALS',
    text: 'Practices describe real willingness to pay $150-250/month without hesitation.',
    excerpt: "I'd pay $150-250 a month flat for this without blinking if it actually filled slots.",
    source_url: 'https://billingtalk.example/forum/flat-fee-vs-per-message',
    source_date: '2025-11-20',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_27',
    dimension: 'DEMAND_SIGNALS',
    text: 'An automated-rebooking demo drew one of the longer lines at a regional dental expo.',
    excerpt:
      "The 'automated rebooking' demo booth had one of the longer lines at this year's regional expo.",
    source_url: 'https://dentalconference.example/expo-directory',
    source_date: '2025-10-11',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_28',
    dimension: 'DEMAND_SIGNALS',
    text: 'A practice posts unprompted interest in a working auto-rebooking product.',
    excerpt:
      'If someone built auto-rebooking that actually worked with our PMS I would sign up today.',
    source_url: 'https://twitterlike.example/status/dentaloffice123',
    source_date: '2025-09-02',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_29',
    dimension: 'DEMAND_SIGNALS',
    text: 'One practice recalls a similar pitch from a startup that never actually shipped.',
    excerpt:
      "We tried a similar pitch two years ago from a startup that never shipped — I'd want to see it working first.",
    source_url: 'https://smallpracticeforum.example/thread/sms-reminders',
    source_date: '2025-08-08',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_30',
    dimension: 'DEMAND_SIGNALS',
    text: 'Investor commentary frames small-practice dental as an under-served vertical SaaS category.',
    excerpt:
      'Vertical SaaS for small dental practices remains under-served relative to spend per seat in other verticals.',
    source_url: 'https://investorletter.example/dental-saas-2025',
    source_date: '2025-07-01',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_31',
    dimension: 'DEMAND_SIGNALS',
    text: 'An adjacent competitor recently raised a Series A to expand its reminders/reviews product.',
    excerpt: 'ChairSync raised a $6M Series A in 2024 to expand its reminder and reviews product.',
    source_url: 'https://crunchbaselike.example/chairsync',
    source_date: '2025-05-22',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_32',
    dimension: 'DEMAND_SIGNALS',
    text: 'The addressable market is roughly 130,000 practices, mostly independent or small-group.',
    excerpt:
      'There are an estimated 130,000 general dental practices in the addressable market, 70% of them independent or small-group.',
    source_url: 'https://dentaltrends.example/2025-report',
    source_date: '2025-04-02',
    stance: 'supports',
    verified: true,
  },

  // ---------- MONEY (13) ----------
  {
    id: 'EV_33',
    dimension: 'MONEY',
    text: 'ChairSync prices around $299/month per location on its standard plan.',
    excerpt: 'ChairSync runs about $299/month per location on their standard plan.',
    source_url: 'https://capterra-like.example/chairsync/reviews',
    source_date: '2025-11-09',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_34',
    dimension: 'MONEY',
    text: "Recall360's starter tier is $199/month, billed annually.",
    excerpt: "Recall360's starter tier is $199/month, billed annually.",
    source_url: 'https://softwarematch.example/recall360',
    source_date: '2025-10-16',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_35',
    dimension: 'MONEY',
    text: 'Per-message pricing on top of a subscription is a specific, recurring complaint.',
    excerpt:
      'I hate that some of these tools charge per text on top of the subscription — it makes the bill unpredictable.',
    source_url: 'https://billingtalk.example/forum/flat-fee-vs-per-message',
    source_date: '2025-09-27',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_36',
    dimension: 'MONEY',
    text: 'A 12-month minimum contract almost stopped a practice from signing with a competitor.',
    excerpt:
      'The 12-month minimum contract was the main thing that almost stopped us from signing.',
    source_url: 'https://g2reviews.example/chairsync',
    source_date: '2025-08-30',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_37',
    dimension: 'MONEY',
    text: 'Cold outreach converts far slower than referrals from an existing PMS vendor relationship.',
    excerpt:
      'Cold outreach to independent practices converts far slower than referrals from existing PMS vendors.',
    source_url: 'https://practicegrowthblog.example/marketing-channels-2025',
    source_date: '2025-07-19',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_38',
    dimension: 'MONEY',
    text: 'Time saved on front-desk calls is framed as the fastest path to a positive ROI.',
    excerpt:
      'If it saves even 30 minutes a day of front-desk time, it pays for itself before you even count the filled chairs.',
    source_url: 'https://dentalhrforum.example/thread/front-desk-time',
    source_date: '2025-06-25',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_39',
    dimension: 'MONEY',
    text: 'Some practices would rather this bundle into their existing PMS than add a new bill.',
    excerpt: "We'd rather it plug into FrontDeskPro than be one more login and one more bill.",
    source_url: 'https://capterra-like.example/frontdeskpro/reviews',
    source_date: '2025-05-14',
    stance: 'challenges',
    verified: true,
  },
  {
    id: 'EV_40',
    dimension: 'MONEY',
    text: 'Practices in this segment show low price sensitivity for tools with a direct, provable revenue link.',
    excerpt:
      'Practices in this segment show relatively low price sensitivity for tools with a direct, provable revenue link.',
    source_url: 'https://investorletter.example/dental-saas-2025',
    source_date: '2025-04-08',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_41',
    dimension: 'MONEY',
    text: 'Practices estimate $2,000-4,000/month in lost production from unfilled cancelled slots.',
    excerpt:
      'Practices estimated $2,000-4,000 per month in lost production attributable to unfilled cancelled slots.',
    source_url: 'https://dentaleconreport.example/2025-noshow-survey',
    source_date: '2025-03-11',
    stance: 'supports',
    verified: true,
  },
  {
    id: 'EV_42',
    dimension: 'MONEY',
    text: 'Above roughly $300/month, the decision needs to be run by the practice owner.',
    excerpt: 'Anything over $300 a month and my office manager needs to run it by the owner first.',
    source_url: 'https://smallpracticeforum.example/thread/sms-reminders',
    source_date: '2025-02-08',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_43',
    dimension: 'MONEY',
    text: 'A PMS add-on marketplace takes a 20% revenue share on listed leads.',
    excerpt:
      'Listed add-ons on this marketplace pay a 20% revenue share to the PMS vendor for leads.',
    source_url: 'https://app-marketplace.example/pms-addons',
    source_date: '2025-01-17',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_44',
    dimension: 'MONEY',
    text: 'At one multi-provider group, recurring purchases need the practice owner to sign off, not just the office manager.',
    excerpt:
      'Anything recurring gets a sign-off from the practice owner, not just the office manager, at our group.',
    source_url: 'https://dentalofficemgrs.example/group/waitlist-tools',
    source_date: '2025-12-04',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_45',
    dimension: 'MONEY',
    text: 'An annual plan with a discount would remove pricing as a blocker for at least one practice.',
    excerpt:
      "Give me an annual plan with a discount and I'm in immediately — monthly billing isn't the blocker.",
    source_url: 'https://billingtalk.example/forum/flat-fee-vs-per-message',
    source_date: '2025-11-27',
    stance: 'supports',
    verified: true,
  },

  // ---------- PRACTICAL (2, deliberately thin) ----------
  {
    id: 'EV_46',
    dimension: 'PRACTICAL',
    text: 'Third-party webhook access typically requires a signed partner agreement, a 2-3 week process.',
    excerpt:
      'Third-party webhook access requires a signed partner agreement with our support team, typically a 2-3 week process.',
    source_url: 'https://pmsvendorblog.example/api-webhooks',
    source_date: '2025-10-05',
    stance: 'neutral',
    verified: true,
  },
  {
    id: 'EV_47',
    dimension: 'PRACTICAL',
    text: 'Webhook delivery is rate-limited to 100 events per minute per integration.',
    excerpt: 'Webhook delivery is rate-limited to 100 events per minute per integration.',
    source_url: 'https://openpms.example/docs/webhooks',
    source_date: '2025-09-14',
    stance: 'neutral',
    verified: true,
  },
];

// Fail fast if the fixture itself ever drifts from the schema.
EvidenceSchema.parse(evidenceFixture);
