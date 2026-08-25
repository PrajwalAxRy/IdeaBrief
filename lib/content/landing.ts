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
  tagline: 'Go from an idea to a roadmap you can Trust.',
} as const;

/* ----------------------------------------------------------------- hero --- */

export const HERO = {
  /* Split into lines by hand so the per-word mask reveal breaks where the
     design wants it to, not where the browser happens to wrap. */
  headlineLines: ['Go from an idea', 'to a roadmap', 'you can Trust.'],
  lead: 'Describe what you’re thinking about — even “something in fitness, not sure what yet.” Five minutes later: a brief, the evidence, and a plan.',
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
  lead: 'Every feature lives in one of them. Nothing else gets built.',
} as const;

export const PILLARS: Pillar[] = [
  {
    index: '01',
    kicker: 'Define',
    title: 'Say it out loud until it’s clear.',
    body: 'Talk it through with something that acts like a sharp cofounder. It pushes back when your customer is “everyone” or your first version is six months of work — and it takes “I don’t know” as a real answer, turning it into a question instead of a wall.',
    proof: 'Ends with a written brief. Edit any field, then approve it.',
    fragment: 'conversation',
  },
  {
    index: '02',
    kicker: 'Validate',
    title: 'Find out what the world already knows.',
    body: 'One run gives you a report on your idea — what’s working in the market, what the competition looks like, where yours is thin, and anything that would change whether you build it.',
    proof: 'Findings appear as they’re verified. No score, no verdict, no fake percentage.',
    fragment: 'evidence',
  },
  {
    index: '03',
    kicker: 'Roadmap',
    title: 'Leave knowing what to do on Monday.',
    body: 'Two lists. Questions the web can’t answer — each with a ready-to-use interview script and who to ask. Then a plan naming the smallest thing worth building first, and what to skip for now.',
    proof: 'Four to seven questions, ordered by how much the answer would change the plan.',
    fragment: 'roadmap',
  },
];

/* ------------------------------------------------------ verified strip --- */

/**
 * The trust mechanic, as a banded strip rather than a section.
 *
 * **This replaced a whole section, `02 The mechanic`** — a two-column headline,
 * a cycling excerpt card that drew a blue rule under a matched quote and
 * resolved verified/discarded, and a four-up counter row underneath it. The
 * argument survives; the ~900px of page it took to make it does not. What was
 * `VERIFICATION_SECTION`, `EVIDENCE_DEMO` and `VERIFICATION_COUNTERS` is now
 * this one object.
 *
 * It also **moved below the entry point**. Proof normally precedes the ask, and
 * this deliberately does not: by the time a reader reaches the composer they
 * have already watched pillar 02 verify things on screen, so the strip's job
 * here is closing reassurance, not persuasion. Owner's call.
 *
 * **The four numbers are not free to change.** `31` and `9` are the same run as
 * `VALIDATE_SESSION.footnote` (`31 pages · 9 discarded`) — one continuous
 * narrative across the page, and `validate-session.test.ts` pins that tie by
 * name. `47 − 9 = 38` also has to keep holding, or the strip states arithmetic
 * a reader can check in their head and find wrong.
 */

export type VerifiedCard = {
  value: number;
  label: string;
  claim: string;
  /** The one accent card. Blue doing job two: verification. */
  accent: boolean;
};

export const VERIFIED_STRIP = {
  label: 'Verified',
  lead: 'Every excerpt in a report is checked against the page it came from. No match, it’s discarded — quietly, never softened into something vaguer.',
  kicker:
    'Milliseconds, no model needed — and the entire difference between research and confident fiction.',
  /* Each claim sits under a hairline at ~250px, so it has two lines of 14px to
     work with. Anything past ~58 characters takes a third and the four cards
     stop bottoming out together. */
  cards: [
    {
      value: 31,
      label: 'Pages fetched',
      claim: 'Read in full — not skimmed from a search snippet.',
      accent: false,
    },
    {
      value: 47,
      label: 'Excerpts extracted',
      claim: 'Pulled as exact quotes, never paraphrased.',
      accent: false,
    },
    {
      value: 9,
      label: 'Failed the match',
      claim: 'Dropped silently. Nothing is softened to survive.',
      accent: false,
    },
    {
      value: 38,
      label: 'In your report',
      claim: 'What was still standing after the check.',
      accent: true,
    },
  ] as VerifiedCard[],
  /* The page's closing ask. It does not repeat the composer — one composer per
     page, and it is 1200px up — so this is a link back to it. `label` stays a
     verb the reader can picture doing; `note` answers the objection that a
     reader who has just been told 9 of 47 excerpts were discarded will have
     next, which is how long any of this takes. */
  cta: {
    headline: 'Point it at your idea.',
    body: 'The same check runs on whatever you type in. You’ll see what survived it, and what didn’t.',
    label: 'Try your idea',
    href: '#start',
    note: 'Takes a sentence to start',
  },
} as const;

/* ------------------------------------------------------------ cofounder --- */

export type ChatTurn = { role: 'user' | 'ai'; text: string };

export const CHAT_SECTION = {
  /* One line, not the hand-broken `headlineLines` a `SectionHead` takes: the
     section no longer has a head, and at `ob-h2` over a 760px composer the
     browser's own break lands where the design wants it. `eyebrow` went with
     the head — there is no `01 START HERE` overline any more. */
  headline: 'It asks what a cofounder would.',
  /* `lead`, `transcriptLabel`, `seedsLabel`, `seeds` and `replayLabel` were
     deleted here rather than left as dead fields: the transcript card, its
     header bar and the seed-chip row are all gone from the section. The seeds
     in particular are not coming back — `PREVIEW_RUNS` replaces them, and the
     reason is written up there. */
  composerPlaceholder: 'I want to do something in fitness, I don’t know what yet…',
  submitLabel: 'Start',
  submittingLabel: 'Starting',
  /* The only thing left in the composer's left slot — `composerNote` ("Not a
     demo — this box starts your run") used to hold it at rest and is deleted.
     Kept a fragment, not a sentence: the slot is uppercase mono. */
  hint: '⌘ ↵ to start',
} as const;

/* ------------------------------------------------------ finished runs --- */

export type PreviewRun = {
  /** The URL segment under `/preview`. Kebab-case, and the only id there is. */
  slug: string;
  /** The market the idea sits in — the mono label the card opens on. */
  sector: string;
  /** The idea itself, stated the way its founder would say it out loud. */
  title: string;
  /** The one thing the finished run actually settled. Never a verdict. */
  finding: string;
};

/**
 * The three finished runs offered under the composer.
 *
 * **These are deliberately specific, and that is the whole point of the row.**
 * The seed chips this replaces read `something in fitness` — a placeholder that
 * asked the reader to imagine a run rather than showing them one, and which
 * taught them that the product accepts vagueness as a finished thought. Each
 * card here names a real customer, a real trigger and a real unit of work,
 * because the row's job is to demonstrate the resolution the brief gets pushed
 * to, before the reader types a word.
 *
 * Each `finding` states **what the research settled**, never whether the idea
 * is good — `executive_summary.md` is binding here: no verdict, no score. "Two
 * of the four incumbents already ship this" is a fact a reader can act on; "a
 * crowded market" would be a judgement the product does not make.
 */
export const PREVIEW_SECTION = {
  label: 'Preview finished runs',
} as const;

export const PREVIEW_RUNS: PreviewRun[] = [
  {
    slug: 'dental-recall',
    sector: 'Local services',
    title: 'Recall texts for dental practices',
    finding: 'Two of the four incumbents already bundle recall SMS.',
  },
  {
    slug: 'freelance-invoicing',
    sector: 'Freelance tooling',
    title: 'Invoice chasing for freelance editors',
    finding: 'The blocker is the awkward follow-up email, not the tracking.',
  },
  {
    slug: 'clinic-scheduling',
    sector: 'Healthcare ops',
    title: 'Filling cancellations at physio clinics',
    finding: 'Front-desk staff already do this by hand from a paper waitlist.',
  },
  {
    slug: 'trade-quoting',
    sector: 'Field service',
    title: 'Site photos into quotes for electricians',
    finding: 'Quotes get written after hours, on a phone, from memory.',
  },
];

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
 *   `31 pages fetched · 9 discarded` as `VERIFIED_STRIP` above. (It used to say
 *   `EVIDENCE_DEMO` and `VERIFICATION_COUNTERS`; those were the deleted
 *   section's copy and the strip inherited both numbers unchanged.) Competitor
 *   names are invented and belong to no real company.
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
  /** The conclusions recede; a scan card fills 0→100%, then three competitors
      swing in on an arc, landing on top of it, and close the scene — the scan
      card stays mounted underneath rather than exiting.
      9600, not 7600: `VALIDATE_SCAN_MS` is 5000 — the bar needs to read as
      genuinely working the field, not just clearing three seconds — and the
      original 4600 for the three competitor panes (each carries three
      drill-down metrics) is preserved in full after it rather than being
      carved out of it. This pushes the whole card well past pillar 01's
      ~14s pass; that "shorter than pillar 01" rule was a pacing preference,
      not a hard limit, and loses to giving the scan real dwell time. */
  field: 9600,
} as const;

/** Inside the verify stage: the settle after the stack lands, then one row
    resolving per beat. Was `collapse` when the competitive field ran first and
    its cards folded into these rows; nothing collapses into them now. */
export const VALIDATE_VERIFY_MS = { settle: 1000, row: 640 } as const;

/** Inside the field stage, before the cards: one shared scan card fills its
    bar 0→100%, then the three competitor cards land on top of it — it stays
    mounted underneath, covered rather than replaced. Kept alongside
    `VALIDATE_VERIFY_MS` rather than as a component constant since it also has
    to be reflected in `VALIDATE_STAGE_MS.field` above — a single source of
    truth for a number that lives in two places. */
export const VALIDATE_SCAN_MS = 5000;

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
    /* Transient: shown only while the scan card's bar is filling, at the
       start of `field`, then swapped for `field` above once cards land. */
    scanning: 'Scanning competitors',
  },
  /** The scan card's own label, shown above its bar while it fills. */
  scan: { label: 'Analysing competition' },
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
  footnote: '2 unknowns → open questions. Nothing invented to fill them.',
} as const;

/* `FRAGMENT_EVIDENCE` was here. Pillar 02 now renders `ValidateSession`, which
   supersedes the static evidence list entirely. */

export const FRAGMENT_ROADMAP = {
  title: 'Open question 01',
  status: 'Changes the plan most',
  question: 'Do clinics already track which patients are overdue?',
  matters:
    'If the list exists, this is automation. If not, you’re building the list first — a different, harder product.',
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
        /* Page order — the composer now leads the body, the pillars follow. */
        { label: 'Start a run', href: '#start' },
        { label: 'How it works', href: '#how-it-works' },
        { label: 'Verification', href: '#verification' },
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
