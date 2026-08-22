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

/* --------------------------------------------------- idea session --- */

/**
 * Pillar 01's preview: Define as a **live ideating conversation**, looping on
 * its own timer. It is one continuous narrative with `CHAT_SCRIPT` above — the
 * same fitness idea, the same lapsed lifters — picked up a few turns later.
 * Any edit that changes the idea breaks the arc between section 01 and 03.
 *
 * Three things `executive_summary.md` binds this copy to, all load-bearing:
 *
 * - The options assert **trade-offs only, never facts**. "Most of your users
 *   probably use iPhones" is exactly the claim Validate exists to go and check.
 * - The one empirical question says so out loud — *"a question for the
 *   research, not a guess"*.
 * - The Investor lens is a **consequence and a choice, never a rating**. "Low
 *   scalability" would be a verdict on the idea, which the product promises
 *   never to give.
 *
 * The finish is a soft nudge, not a gate: it names what is still open and lets
 * the user go anyway.
 */

/** Per-character typing speeds, reused from `CofounderChat`'s tuned values. */
export const SESSION_TYPING_MS = { user: 24, ai: 15 } as const;

/** Rest before the first keystroke, so the card opens mid-conversation. */
export const SESSION_LEAD_IN_MS = 600;

/** Rest between the two pre-roll turns as they type — not `SESSION_LEAD_IN_MS`,
 *  which is the rest *after* pre-roll finishes and before the scripted turns begin. */
export const SESSION_PREROLL_HOLD_MS = 320;

/**
 * The closing beat: a pointer glides in and presses `Start the research`.
 *
 * **The whole gesture is a sanctioned exception to the motion binary,
 * allowlisted by name** in `styles/obsidian.css` beside `.ob-caret` — widened by
 * owner decision on 2026-08-22, when the gesture was slowed and the ripple
 * enlarged. Every duration here sits in the dead zone between structural
 * (150–320ms) and ambient (20–50s), and that is the point: none of them is a UI
 * transition. They depict a physical event, and a hand does not cross 130px in
 * 320ms any more than a ripple crosses a button face in one.
 *
 * **`press` is a window, not an animation.** It is how long `data-pressed` stays
 * on the button, and it must outlast everything that attribute triggers — the
 * longest being the second ring, which starts 180ms late and runs 620ms, so
 * 800ms of effect. Shorten it below that and the ripple is cut off mid-spread.
 */
export const SESSION_POINTER_MS = { travel: 1_150, press: 880, linger: 900 } as const;

export type SessionOption = { lead: string; rest: string };

export type SessionStep =
  | { kind: 'turn'; role: 'user' | 'ai'; text: string; holdMs: number }
  | { kind: 'bullets'; items: SessionOption[]; stepMs: number; holdMs: number }
  | { kind: 'lens'; text: string; holdMs: number }
  | {
      kind: 'finish';
      heading: string;
      body: string;
      primary: string;
      secondary: string;
      holdMs: number;
    };

export const SESSION = {
  bar: { title: 'Define', status: 'Draft' },
  /**
   * The tail of an earlier exchange, typed out once on the card's first play
   * so it opens mid-conversation rather than on an empty panel.
   *
   * **Both lines are `CHAT_SCRIPT` verbatim** — its turns 3 and 4, unedited.
   * No new copy was written for the pre-roll, and that is the point: pillar 01
   * and section 03 are one continuous narrative, the same fitness idea a few
   * turns apart, not two demos of the same product.
   *
   * Two things this length is doing, both load-bearing:
   *
   * - It **fills the card at rest**. A single short line left roughly 190px of
   *   empty transcript once typing settles, and pillar 01 read underfilled
   *   against 02's dense evidence rows.
   * - It **gives turn 1 something to answer**. `honestly not sure what to build
   *   first` is a direct reply to *what does the first version actually do for
   *   them in week one?*; without that question on screen it arrives unprompted.
   *
   * Typed once, on the first pass only — same handshake as `SESSION_LEAD_IN_MS`,
   * which does not start counting down until this finishes. A replay shows both
   * lines settled rather than retyping them, for the same reason the lead-in
   * rest is skipped on replay: a press is asking to see the *script* again, not
   * to sit through the frame around it a second time.
   */
  preroll: [
    {
      role: 'user',
      text: 'people who used to lift seriously and stopped. no idea how they’d find me',
    },
    {
      role: 'ai',
      text: 'Good — lapsed lifters is specific enough to research. How they find you goes on the open-questions list rather than getting guessed at. Last one: what does the first version actually do for them in week one?',
    },
  ] as ChatTurn[],
  lensLabel: 'Investor lens',
  replayLabel: 'Replay',
} as const;

export const SESSION_SCRIPT: SessionStep[] = [
  {
    kind: 'turn',
    role: 'user',
    text: 'honestly not sure what to build first. what do you think?',
    holdMs: 440,
  },
  {
    kind: 'turn',
    role: 'ai',
    text: 'Depends what you want to find out first. Three shapes, cheapest to most committing:',
    holdMs: 0,
  },
  {
    kind: 'bullets',
    /* One beat each. At the 10s floor originally asked for they arrive faster
       than they can be read, which is why the timeline runs to ~14s. */
    stepMs: 800,
    holdMs: 0,
    items: [
      {
        lead: 'One page and a signup box',
        rest: 'tells you if anyone wants it before you build a thing.',
      },
      {
        lead: 'A weekly check-in by text',
        rest: 'nothing to install, and you learn fast whether people reply.',
      },
      {
        lead: 'A full programme in an app',
        rest: 'the most convincing, and the hardest to change once it’s out.',
      },
    ],
  },
  {
    kind: 'turn',
    role: 'ai',
    text: 'Whether your people would actually open an app is a question for the research, not a guess.',
    holdMs: 0,
  },
  {
    kind: 'lens',
    text: 'This shape tends to grow on revenue rather than a raise. Worth knowing which you want — it changes what you’d need to prove first.',
    holdMs: 1_600,
  },
  {
    kind: 'turn',
    role: 'user',
    text: 'let’s try the text one. that’s enough for now',
    holdMs: 300,
  },
  {
    kind: 'finish',
    heading: 'Three things are still open.',
    body: 'That’s fine — each one becomes a question the research goes and asks.',
    primary: 'Start the research',
    secondary: 'Keep talking',
    /* Read the finish, then the pointer comes for the button. This was 3,200ms
       when the card looped and the hold was the pause before the reset; with
       replay there is no reset, so it is just the beat before the closing
       gesture. */
    holdMs: 1_200,
  },
];

/** Wall-clock cost of one step: typing or stepping, plus its trailing hold. */
export function sessionStepMs(step: SessionStep): number {
  if (step.kind === 'turn') {
    return step.text.length * SESSION_TYPING_MS[step.role] + step.holdMs;
  }
  if (step.kind === 'bullets') {
    return step.items.length * step.stepMs + step.holdMs;
  }
  return step.holdMs;
}

/** The pointer beat: travel, press, then fade out. */
export const sessionPointerTotalMs =
  SESSION_POINTER_MS.travel + SESSION_POINTER_MS.press + SESSION_POINTER_MS.linger;

/** One full pass — lead-in, script and closing pointer. Mirrors `runEventsTotalMs`,
    so the whole timeline is assertable from a node test rather than eyeballed in
    a browser. The card plays this once on scroll-in and then rests; `Replay` in
    the card bar is the only way to see it again. */
export const sessionTotalMs =
  SESSION_LEAD_IN_MS +
  SESSION_SCRIPT.reduce((total, step) => total + sessionStepMs(step), 0) +
  sessionPointerTotalMs;

/* ----------------------------------------------- validate session --- */

/**
 * Pillar 02's preview: Validate as a **market-analysis panel assembling
 * itself** — a revenue model, then the assumptions it rests on being checked
 * one by one, then the competitive field landing in front of them.
 *
 * **This block is the one deliberate exception to `executive_summary.md` in the
 * whole repository, and it is scoped to this card.** The product ships no
 * score, no verdict and no financial model, and invents nothing to fill a
 * field. Everything below — the revenue curve, the TAM/CAC/payback figures,
 * the three competitors — is invented marketing fiction, agreed with the
 * product owner for this landing surface only while the real Validate page is
 * still being built. Do not copy any of it into `lib/fixtures/`, and do not
 * take it as licence to soften the rule anywhere else.
 *
 * Two things that are *not* fiction and are load-bearing:
 *
 * - **`rows[3]` resolves open, never verified.** Four blue chips in a column
 *   would say the product manufactures certainty, which is the exact thing it
 *   exists not to do. The open row hands off to pillar 03 by name.
 * - **The narrative thread is continuous.** Same dental-practice idea, the same
 *   `$299/mo`, the same `31 pages fetched · 9 discarded` as `EVIDENCE_DEMO` and
 *   `VERIFICATION_COUNTERS` below. Competitor names are invented and belong to
 *   no real company.
 */

/** Stage durations. The card plays this once on scroll-in, then rests.
    Played in the order `wake → model → verify → field → rest`; that order lives
    in `STAGES` in the component, not in this object's key order. */
export const VALIDATE_STAGE_MS = {
  /** The lights come up on an empty volume, before anything is in it. */
  wake: 700,
  /** Line draws, cone opens, the callout and three figures count up. */
  model: 3900,
  /** Chart recedes; the assumptions land and each one resolves in turn. */
  verify: 3900,
  /** The conclusions recede; three competitors swing in on an arc, in front of
      everything, and close the scene.
      4600, not 3300: each pane carries three drill-down metrics, and at 3300 the
      last one had barely landed before the stage ended. */
  field: 4600,
} as const;

/** Inside the verify stage: the settle after the stack lands, then one row
    resolving per beat. Was `collapse` when the competitive field ran first and
    its cards folded into these rows; nothing collapses into them now. */
export const VALIDATE_VERIFY_MS = { settle: 1000, row: 640 } as const;

export type ValidateRow = {
  /** Evidence id, or an em-dash pair where there is nothing to cite. */
  tag: string;
  text: string;
  state: 'verified' | 'open';
  note?: string;
};

/** One drill-down line on a competitor card: a dimension and where it landed. */
export type ValidateMetric = { label: string; value: string };

export type ValidateCompetitor = {
  name: string;
  since: string;
  price: string;
  /** 0–1, drawn as a small bar. Feature coverage against the five dimensions. */
  coverage: number;
  /**
   * The card's analysis rows. **Every competitor carries the same labels in the
   * same order** — that is what makes three cards a comparison rather than
   * three unrelated profiles, and `validate-session.test.ts` asserts it.
   */
  metrics: ValidateMetric[];
  gap: string;
};

export const VALIDATE_SESSION = {
  bar: {
    title: 'Validate',
    running: 'Analysing',
    done: 'Analysis complete',
    replayLabel: 'Replay',
  },
  /** The floating caption label, one per stage. */
  stages: {
    wake: 'Market model',
    model: 'Market model',
    verify: 'Assumptions',
    field: 'Competitive field',
    /* Only ever shown if `done` is somehow false at rest; the caption swaps to
       `bar.done` there. Kept honest anyway. */
    rest: 'Competitive field',
  },
  chart: {
    label: 'Projected revenue',
    /** $k/mo, months 1–12. */
    series: [6, 8, 11, 14, 19, 25, 32, 40, 49, 60, 71, 84],
    /** Do nothing, and this is the same twelve months. Drawn dim, underneath. */
    baseline: [6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
    /** The cone past month 12, as multiples of the month-12 value. */
    cone: { high: 1.46, low: 0.58 },
    unit: '$',
    suffix: 'k',
    per: '/mo',
    caption: 'Month 12 · P50',
    ticks: ['M1', 'M4', 'M8', 'M12'],
  },
  /** Count up alongside the callout, each landing on its own beat. */
  stats: [
    { label: 'TAM', prefix: '$', value: 2.4, decimals: 1, suffix: 'B', ms: 900 },
    { label: 'CAC', prefix: '$', value: 310, decimals: 0, suffix: '', ms: 1080 },
    { label: 'Payback', prefix: '', value: 4.1, decimals: 1, suffix: ' mo', ms: 1260 },
  ],
  /** Invented. Index-aligned with `rows` — card `i` is the evidence behind
      row `i`, and lands in front of it. */
  competitors: [
    {
      name: 'Northline',
      since: '2019',
      price: '$299/mo per location',
      coverage: 0.78,
      metrics: [
        { label: 'Revenue', value: '~$18M ARR' },
        { label: 'Moat', value: 'Distribution' },
        { label: 'Switching', value: 'High' },
      ],
      gap: 'No mobile app',
    },
    {
      name: 'Fenwick Ops',
      since: '2016',
      price: '$210/mo, 5-seat min',
      coverage: 0.91,
      metrics: [
        { label: 'Revenue', value: '~$40M ARR' },
        { label: 'Moat', value: 'Integrations' },
        { label: 'Switching', value: 'Very high' },
      ],
      /* One line at 206px. `Enterprise only · 6-week onboarding` wrapped, and a
         two-line gap pushed the price out of the card. */
      gap: 'Six-week onboarding',
    },
    {
      /* One word. `Palisade Recall` plus `CLOSED 2023` does not fit a 224px
         card head on one line, and the name wrapped rather than the status. */
      name: 'Palisade',
      since: 'Closed 2023',
      price: 'Was $89/mo',
      coverage: 0.24,
      metrics: [
        { label: 'Revenue', value: '~$2M at close' },
        { label: 'Moat', value: 'None found' },
        { label: 'Switching', value: 'n/a' },
      ],
      gap: 'Ran out of runway',
    },
  ] as ValidateCompetitor[],
  rows: [
    { tag: 'EV_04', text: 'Nobody serves practices under four chairs', state: 'verified' },
    { tag: 'EV_09', text: 'Onboarding is the real switching cost', state: 'verified' },
    { tag: 'EV_11', text: 'The market has already killed one attempt', state: 'verified' },
    {
      tag: '——',
      text: 'Front desks will adopt it without training',
      state: 'open',
      note: '→ open question 02',
    },
  ] as ValidateRow[],
  /* Short enough to sit on one line in the scene's caption next to the status
     and the replay control. The long form overran and clipped `1 open`. */
  footnote: '31 pages · 9 discarded · 3 checked, 1 open',
} as const;

/** One full pass. Assertable from a node test rather than eyeballed. */
export const validateTotalMs =
  VALIDATE_STAGE_MS.wake +
  VALIDATE_STAGE_MS.model +
  VALIDATE_STAGE_MS.field +
  VALIDATE_STAGE_MS.verify;

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

/* `FRAGMENT_EVIDENCE` was here. Pillar 02 now renders `ValidateSession`, which
   supersedes the static evidence list entirely. */

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
