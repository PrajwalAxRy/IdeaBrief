/**
 * Landing-page copy and demo scripts.
 *
 * This is static site content, not run data — so it deliberately does NOT sit
 * in `lib/fixtures/` and does NOT route through the `lib/db/queries.ts` seam.
 * That seam exists to stand in for Postgres reads of a real run; marketing copy
 * will never come from there. Components import this module directly.
 *
 * Product name `Groundwork` is provisional — see higgsfieldPlan.md §0.
 */

export const BRAND = {
  name: 'Groundwork',
  tagline: 'From a hunch to something you can defend.',
} as const;

/* ------------------------------------------------------------------ nav --- */

export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Verification', href: '#verification' },
  { label: 'Start', href: '#start' },
] as const;

/* ----------------------------------------------------------------- hero --- */

export const HERO = {
  badge: {
    tag: 'New',
    text: 'Every excerpt is checked against the page it came from',
  },
  /* Split into lines by hand so the per-word mask reveal breaks where the
     design wants it to, not where the browser happens to wrap. */
  headlineLines: ['From a hunch to', 'something you', 'can defend.'],
  lead: 'Describe what you’re thinking about — even if that’s “something in fitness, I don’t know what yet.” Five minutes later you have a written brief, the evidence, and a plan.',
  primary: { label: 'Start with an idea', href: '#start' },
  secondary: { label: 'See a finished run', href: '/r/demo' },
  cue: 'Scroll',
} as const;

/* Perspective collage behind the headline. Placeholder photography, hotlinked
   from Unsplash and verified reachable at build time; each slot is briefed for
   HiggsField replacement in higgsfieldPlan.md §1. Positions are percentages of
   the hero box so the composition holds at 1280 and 1440.
   `depth` drives the parallax rate — higher moves faster against the scroll. */
export type CollageCard = {
  id: string;
  src: string;
  /** Percent-of-hero geometry. */
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: number;
  depth: number;
  opacity: number;
};

export const COLLAGE: CollageCard[] = [
  {
    id: 'far-left',
    src: '/media/hero/far-left.webp',
    left: '-8%',
    top: '30%',
    width: '26%',
    height: '30%',
    rotate: -8,
    depth: 0.34,
    opacity: 0.7,
  },
  {
    id: 'left',
    src: '/media/hero/left.webp',
    left: '10%',
    top: '58%',
    width: '22%',
    height: '26%',
    rotate: 5,
    depth: 0.6,
    opacity: 0.5,
  },
  {
    id: 'centre',
    src: '/media/hero/centre.webp',
    left: '27%',
    top: '24%',
    width: '46%',
    height: '42%',
    rotate: 0,
    depth: 0.16,
    opacity: 0.62,
  },
  {
    id: 'right',
    src: '/media/hero/right.webp',
    left: '70%',
    top: '55%',
    width: '24%',
    height: '28%',
    rotate: -5,
    depth: 0.58,
    opacity: 0.5,
  },
  {
    id: 'far-right',
    src: '/media/hero/far-right.webp',
    left: '82%',
    top: '28%',
    width: '26%',
    height: '30%',
    rotate: 8,
    depth: 0.34,
    opacity: 0.7,
  },
];

/* -------------------------------------------------------------- marquee --- */

/** The five research dimensions, straight from the product definition. */
export const DIMENSIONS = [
  'The problem',
  'What already exists',
  'Demand signals',
  'Money',
  'Practical realities',
] as const;

/* ------------------------------------------------------------- pillars --- */

export type PillarFragment = 'conversation' | 'evidence' | 'roadmap';

export type Pillar = {
  index: string;
  kicker: string;
  title: string;
  body: string;
  proof: string;
  fragment: PillarFragment;
};

export const PILLARS_SECTION = {
  eyebrow: 'What you do here',
  headline: 'Three things, and nothing else.',
  lead: 'Every part of this product sits inside one of them. If a feature doesn’t, it isn’t built.',
} as const;

export const PILLARS: Pillar[] = [
  {
    index: '01',
    kicker: 'Define',
    title: 'Say it out loud until it’s clear.',
    body: 'Talk to something that behaves like a thoughtful cofounder. It asks what it actually needs to ask, in whatever order makes sense. It pushes back when your customer is “everyone” and when your first version is six months of work. And it takes “I don’t know” as a real answer every single time — each one becomes a research question or an open question instead of a wall.',
    proof: 'Ends with a written brief on screen. Edit any field, then approve it.',
    fragment: 'conversation',
  },
  {
    index: '02',
    kicker: 'Validate',
    title: 'Find out what the world already knows.',
    body: 'One research run, the same for every idea — no routing, no specialisation. It writes its own search queries across five dimensions, reads around thirty pages, and reports what is actually there: who else is doing this, what they charge, where people describe this problem in their own words, and what would materially shape the build.',
    proof:
      'Findings land on screen as they are verified. No score, no verdict, no fake percentage.',
    fragment: 'evidence',
  },
  {
    index: '03',
    kicker: 'Roadmap',
    title: 'Leave knowing what to do on Monday.',
    body: 'Two lists. First, the questions the web cannot answer — each with the interview script written out word for word, who to ask, where to find them, and what a yes or a no would mean for the build. Then a plan that names the smallest thing worth making first and is blunt about what not to build yet.',
    proof: 'Four to seven questions, ordered by how much the answer would change the plan.',
    fragment: 'roadmap',
  },
];

/* -------------------------------------------------------- verification --- */

export const VERIFICATION_SECTION = {
  eyebrow: 'The mechanic',
  headline: 'The one thing a chat prompt can’t do.',
  body: 'Ask a model to research your idea and it will hand you confident, well-written, unfalsifiable prose. This does something dumber and far more useful: before an excerpt is allowed anywhere near your report, it is matched against the text of the page it was taken from. No match, it is discarded — quietly, and without being rewritten into something vaguer.',
  kicker:
    'It takes milliseconds, needs no model, and it is the entire difference between research and confident fiction.',
} as const;

export type EvidenceDemo = {
  id: string;
  dimension: string;
  domain: string;
  excerpt: string;
  outcome: 'verified' | 'discarded';
  note: string;
};

/** Cycled one at a time by the verification demo. Two pass, one fails — the
    failure is the point of the section, so it is not hidden at the end. */
export const EVIDENCE_DEMO: EvidenceDemo[] = [
  {
    id: 'EV_12',
    dimension: 'Money',
    domain: 'weave.com/pricing',
    excerpt: 'Plans start at $299 per month per location, billed annually.',
    outcome: 'verified',
    note: 'Matched in fetched page text',
  },
  {
    id: 'EV_13',
    dimension: 'The problem',
    domain: 'dentalgrowth.blog/recall-benchmarks',
    excerpt: 'Most practices lose roughly 30% of their recall patients every year.',
    outcome: 'discarded',
    note: 'Not found on page — discarded',
  },
  {
    id: 'EV_14',
    dimension: 'Demand signals',
    domain: 'reddit.com/r/Dentistry',
    excerpt:
      'we have something like 800 patients overdue and nobody at the front desk has time to call them',
    outcome: 'verified',
    note: 'Matched in fetched page text',
  },
];

export const VERIFICATION_COUNTERS = [
  { label: 'Pages fetched', value: 31, accent: false },
  { label: 'Excerpts extracted', value: 47, accent: false },
  { label: 'Failed the match', value: 9, accent: false },
  { label: 'In your report', value: 38, accent: true },
] as const;

/* ------------------------------------------------------------ cofounder --- */

export type ChatTurn = { role: 'user' | 'ai'; text: string };

export const CHAT_SECTION = {
  eyebrow: 'Start here',
  headline: 'Talk to it.',
  lead: 'What follows is the actual first screen. A sentence, a paragraph, or a direction you can’t name yet — all three are valid openings.',
  composerPlaceholder: 'I want to do something in fitness, I don’t know what yet…',
  seedsLabel: 'Try',
  seeds: ['dental recall SMS', 'a tool for freelance editors', 'something in fitness'],
  submitLabel: 'Start',
  submittingLabel: 'Starting',
  hint: '⌘ ↵ to start',
  footnote:
    'No signup. The run lives at its own URL — bookmark it, send it to someone, come back to it next week.',
  replayLabel: 'Replay',
} as const;

/** The scripted exchange that types itself when the section scrolls into view.
    Chosen to demonstrate the three rules the conversation lives by: push for
    specificity, never invent an answer, accept "I don't know" and move on. */
export const CHAT_SCRIPT: ChatTurn[] = [
  { role: 'user', text: 'I want to do something in fitness, I don’t know what yet' },
  {
    role: 'ai',
    text: 'That is a fine place to start. Who is the person you picture — and what are they doing today instead?',
  },
  {
    role: 'user',
    text: 'people who used to lift seriously and stopped. no idea how they’d find me',
  },
  {
    role: 'ai',
    text: 'Good — lapsed lifters is specific enough to research. How they find you goes on the open-questions list rather than getting guessed at. Last one: what does the first version actually do for them in week one?',
  },
  { role: 'user', text: 'honestly not sure' },
  {
    role: 'ai',
    text: 'Then that is the first thing we go and find out. I have enough for a brief — take a look and change anything that is wrong.',
  },
];

/* --------------------------------------------------- product fragments --- */

/** Rendered as real UI inside the pillars section — not screenshots. */
export const FRAGMENT_CONVERSATION = {
  title: 'Idea brief',
  status: 'Draft · editable',
  rows: [
    { key: 'Product', value: 'Return programme for people who used to train seriously' },
    { key: 'Customer', value: 'Lapsed lifters, 2–6 years out' },
    { key: 'Problem', value: 'Restarting alone feels humiliating, so they never restart' },
    { key: 'Makes money', value: 'unknown', unknown: true },
    { key: 'Found how', value: 'unknown', unknown: true },
  ],
  footnote: '2 unknowns → open questions. Nothing was invented to fill them.',
} as const;

export const FRAGMENT_EVIDENCE = {
  title: 'Validate',
  status: 'Live',
  rows: [
    {
      id: 'EV_04',
      domain: 'weave.com',
      text: '$299/mo per location, billed annually',
      verified: true,
    },
    {
      id: 'EV_07',
      domain: 'reddit.com',
      text: '800 patients overdue, nobody has time',
      verified: true,
    },
    {
      id: 'EV_09',
      domain: 'g2.com',
      text: 'Setup took eleven weeks and two staff',
      verified: true,
    },
    {
      id: 'EV_11',
      domain: 'blog.example',
      text: 'Industry churn is around 30% yearly',
      verified: false,
    },
  ],
  footnote: '31 pages fetched · 9 excerpts discarded before you saw them',
} as const;

export const FRAGMENT_ROADMAP = {
  title: 'Open question 01',
  status: 'Changes the plan most',
  question: 'Do clinics already track which patients are overdue?',
  matters:
    'If the list exists, this is an automation product. If it does not, you are building the list first — a different product and a much harder sell.',
  script: [
    'Walk me through what happens when a patient misses a recall.',
    'How do you know who is overdue right now?',
    'When did you last chase one? What happened?',
  ],
  meta: ['Ask: office managers, 1–3 locations', '6–8 conversations', 'Blocks build step 2'],
} as const;

/* --------------------------------------------------------------- footer --- */

export const FOOTER = {
  columns: [
    {
      heading: 'Product',
      links: [
        { label: 'How it works', href: '#how-it-works' },
        { label: 'Verification', href: '#verification' },
        { label: 'Start a run', href: '#start' },
      ],
    },
    {
      heading: 'What it is not',
      links: [
        { label: 'Not a score', href: '#verification' },
        { label: 'Not a verdict', href: '#verification' },
        { label: 'Not a gate', href: '#verification' },
      ],
    },
  ],
  note: 'A run is a URL. There are no accounts, no billing, and nothing to cancel.',
  legal: 'Prototype build — every run on this deployment is a fixture.',
} as const;
