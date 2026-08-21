import { type Discarded, DiscardedSchema } from '../schemas/evidence';
import { RUN_QUERIES } from './queries';

/**
 * The 18 excerpts that did not survive verification.
 *
 * These are D15's trust claim made into records: the product's headline
 * promise is that every claim is matched to text on a real page, and the only
 * way to make that promise legible is to show the ones that failed. Each row
 * keeps the excerpt as it was pulled, the page it came from, the query that
 * was being run, and the reason it was dropped — and **carries no `text`
 * field**, because a discarded excerpt never became a finding and there is no
 * claim to render. Inventing one is exactly what "nothing is invented to fill
 * a field" forbids.
 *
 * Three domains — `capterra-like.example`, `smallpracticeforum.example` and
 * `openpms.example` — appear in the kept corpus too. Those collisions are
 * deliberate: without them the explorer's domain facet reads as two disjoint
 * corpora, which is a lie about how a real run behaves. Every other domain
 * here is unique to the discards.
 */
export const discardedFixture: Discarded = [
  /* ---------------------------------------------------------- PROBLEM (5) --- */
  {
    id: 'DS_01',
    excerpt:
      'Nearly a third of appointments booked more than six weeks out are cancelled or rescheduled at least once.',
    source_url: 'https://schedulingweekly.example/long-lead-bookings',
    source_date: '2025-07-22',
    dimension: 'PROBLEM',
    attempted_query: 'dental practice no-show rate statistics',
    discard_reason: 'excerpt_not_found_on_page',
  },
  {
    id: 'DS_02',
    excerpt:
      'Our office loses about two full days of production a month to slots nobody ever fills.',
    source_url: 'https://smallpracticeforum.example/thread/lost-production',
    source_date: '2025-05-09',
    dimension: 'PROBLEM',
    attempted_query: 'dental appointment cancellation cost',
    discard_reason: 'page_changed_since_index',
  },
  {
    id: 'DS_03',
    excerpt:
      'The average practice carries a standing waitlist it almost never manages to work through.',
    source_url: 'https://practiceops.example/waitlist-management-guide',
    source_date: '2025-03-30',
    dimension: 'PROBLEM',
    attempted_query: 'front desk waitlist rebooking process',
    discard_reason: 'quote_paraphrased_not_verbatim',
  },
  {
    id: 'DS_04',
    excerpt:
      'Cancellation rates rose sharply in the last two years across every practice size we track.',
    source_url: 'https://industryquarterly.example/2025/dental-scheduling-outlook',
    source_date: '2025-10-11',
    dimension: 'PROBLEM',
    attempted_query: 'dental practice no-show rate statistics',
    discard_reason: 'paywalled',
  },
  {
    id: 'DS_05',
    excerpt: 'We keep the waitlist on a whiteboard and it is out of date by Wednesday.',
    source_url: 'https://frontofficechat.example/topic/whiteboard-waitlist',
    source_date: '2025-06-17',
    dimension: 'PROBLEM',
    attempted_query: 'waitlist dental office forum',
    discard_reason: 'excerpt_not_found_on_page',
  },

  /* ----------------------------------------------------- WHAT_EXISTS (4) --- */
  {
    id: 'DS_06',
    excerpt: 'ChairSync added automatic waitlist fill in its spring release.',
    source_url: 'https://capterra-like.example/reviews/chairsync-spring-release',
    source_date: '2025-04-24',
    dimension: 'WHAT_EXISTS',
    attempted_query: 'ChairSync reviews dental',
    discard_reason: 'page_changed_since_index',
  },
  {
    id: 'DS_07',
    excerpt: 'Every major dental communication platform now exposes a public scheduling webhook.',
    source_url: 'https://integrationsdigest.example/dental-webhook-landscape',
    source_date: '2025-08-02',
    dimension: 'WHAT_EXISTS',
    attempted_query: 'dental PMS webhook API cancellation',
    discard_reason: 'excerpt_not_found_on_page',
  },
  {
    id: 'DS_08',
    excerpt: 'FrontDeskPro bundles messaging into its base tier at no extra cost.',
    source_url: 'https://vendorcompare.example/frontdeskpro-tiers',
    source_date: '2025-02-13',
    dimension: 'WHAT_EXISTS',
    attempted_query: 'FrontDeskPro scheduling add-ons',
    discard_reason: 'quote_paraphrased_not_verbatim',
  },
  {
    id: 'DS_09',
    excerpt:
      'Roughly forty scheduling tools are listed across the three largest dental software directories.',
    source_url: 'https://softwaredirectory.example/dental/scheduling',
    source_date: '2025-09-08',
    dimension: 'WHAT_EXISTS',
    attempted_query: 'SMS reminder software dental practices',
    discard_reason: 'excerpt_not_found_on_page',
  },

  /* -------------------------------------------------- DEMAND_SIGNALS (3) --- */
  {
    id: 'DS_10',
    excerpt: 'Practices told us they would switch tools tomorrow for automatic rebooking.',
    source_url: 'https://exporoundup.example/dental-expo-floor-notes',
    source_date: '2025-11-19',
    dimension: 'DEMAND_SIGNALS',
    attempted_query: 'dental conference expo booth demand',
    discard_reason: 'page_changed_since_index',
  },
  {
    id: 'DS_11',
    excerpt:
      'Demand for scheduling automation in dental has grown faster than any adjacent vertical.',
    source_url: 'https://marketreports.example/vertical-saas-dental-2025',
    source_date: '2025-07-04',
    dimension: 'DEMAND_SIGNALS',
    attempted_query: 'dental SaaS pricing per month',
    discard_reason: 'paywalled',
  },
  {
    id: 'DS_12',
    excerpt: 'Two rebooking startups shut down in the same eighteen-month window.',
    source_url: 'https://startupobituary.example/health-scheduling-2023',
    source_date: '2025-01-27',
    dimension: 'DEMAND_SIGNALS',
    attempted_query: 'dental startup rebooking shut down',
    discard_reason: 'excerpt_not_found_on_page',
  },

  /* ------------------------------------------------------------ MONEY (4) --- */
  {
    id: 'DS_13',
    excerpt: 'Most dental practices budget under $100 a month for scheduling software.',
    source_url: 'https://budgetbenchmark.example/dental-software-spend',
    source_date: '2025-05-21',
    dimension: 'MONEY',
    attempted_query: 'small dental practice software budget approval',
    discard_reason: 'excerpt_not_found_on_page',
  },
  {
    id: 'DS_14',
    excerpt: 'Recall360 dropped its starter tier to $149 after competitive pressure.',
    source_url: 'https://pricingwatch.example/recall360-changes',
    source_date: '2025-10-02',
    dimension: 'MONEY',
    attempted_query: 'Recall360 pricing',
    discard_reason: 'page_changed_since_index',
  },
  {
    id: 'DS_15',
    excerpt: 'Per-message billing typically adds a third again to the monthly invoice.',
    source_url: 'https://smscostwatch.example/healthcare-messaging-rates',
    source_date: '2025-08-14',
    dimension: 'MONEY',
    attempted_query: 'per-message SMS pricing complaints',
    discard_reason: 'quote_paraphrased_not_verbatim',
  },
  {
    id: 'DS_16',
    excerpt:
      'Marketplace revenue shares in practice-management software range from 15% to 30% of first-year contract value.',
    source_url: 'https://channelinsights.example/pms-marketplace-economics',
    source_date: '2025-06-05',
    dimension: 'MONEY',
    attempted_query: 'dental practice management marketplace add-ons',
    discard_reason: 'paywalled',
  },

  /* -------------------------------------------------------- PRACTICAL (2) --- */
  {
    id: 'DS_17',
    excerpt: 'Partner API access is granted automatically on signup for verified developers.',
    source_url: 'https://openpms.example/developers/partner-access',
    source_date: '2025-09-30',
    dimension: 'PRACTICAL',
    attempted_query: 'webhook rate limit API partner agreement',
    discard_reason: 'page_changed_since_index',
  },
  {
    id: 'DS_18',
    excerpt: 'Rate limits are negotiable for integrations sending under a thousand events a day.',
    source_url: 'https://apiforum.example/thread/dental-webhook-limits',
    source_date: '2025-04-08',
    dimension: 'PRACTICAL',
    attempted_query: 'webhook rate limit API partner agreement',
    discard_reason: 'excerpt_not_found_on_page',
  },
];

DiscardedSchema.parse(discardedFixture);

/* Module-scope assertions, in the style run-events.ts already uses. These are
   invariants Zod cannot express, and they are the reason the explorer's facet
   counts can be trusted without recounting them per surface. */

const queries = new Set<string>(RUN_QUERIES);
for (const record of discardedFixture) {
  if (!queries.has(record.attempted_query)) {
    throw new Error(
      `${record.id}: attempted_query "${record.attempted_query}" is not one of the 19 run queries.`,
    );
  }
}

const REASON_DISTRIBUTION = {
  excerpt_not_found_on_page: 7,
  page_changed_since_index: 5,
  paywalled: 3,
  quote_paraphrased_not_verbatim: 3,
} as const;

for (const [reason, expected] of Object.entries(REASON_DISTRIBUTION)) {
  const actual = discardedFixture.filter((r) => r.discard_reason === reason).length;
  if (actual !== expected) {
    throw new Error(`Expected ${expected} discards with reason ${reason}, got ${actual}`);
  }
}

const DIMENSION_DISTRIBUTION = {
  PROBLEM: 5,
  WHAT_EXISTS: 4,
  DEMAND_SIGNALS: 3,
  MONEY: 4,
  PRACTICAL: 2,
} as const;

for (const [dimension, expected] of Object.entries(DIMENSION_DISTRIBUTION)) {
  const actual = discardedFixture.filter((r) => r.dimension === dimension).length;
  if (actual !== expected) {
    throw new Error(`Expected ${expected} discards in ${dimension}, got ${actual}`);
  }
}
