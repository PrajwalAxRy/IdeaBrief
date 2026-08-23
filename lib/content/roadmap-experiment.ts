/**
 * Copy and timings for the two candidate replacements for pillar 03's static
 * fragment. **Experiment-only** — this file exists so `/experiment` can be
 * judged and then deleted or promoted without touching shipped content.
 *
 * If a concept wins, its half of this file moves into `lib/content/landing.ts`
 * next to `FRAGMENT_ROADMAP` and the other half goes in the bin.
 *
 * Same dental-recall idea the shipping `FRAGMENT_ROADMAP` uses, deliberately:
 * the point of `/experiment` is to compare two *treatments*, so the content is
 * held constant against the thing on the live page.
 */

/* ================================================================ shared === */

export type OpenQuestion = {
  id: string;
  /**
   * The question itself. **Keep it under 48 characters.** The row is a single
   * line by construction, and the text column is ~382px at the widths in
   * `.rx-row-inner`; past 48 the ellipsis fires and the figure reads as broken.
   */
  text: string;
  /** How much the answer would move the build. Drives the sort and the bar. */
  impact: number;
  /** Mono band label. Never a sentence — it sits in the metadata layer. */
  band: string;
  /** Who you ask. */
  ask: string;
  /** What it blocks, in the build. */
  blocks: string;
};

/**
 * Deliberately supplied OUT of impact order. Concept B's whole first beat is
 * sorting them, and a list that arrives sorted has nothing to show.
 */
export const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: 'Q3',
    text: 'Can the practice software export a list?',
    impact: 0.71,
    band: 'Shapes the build',
    ask: 'Practice IT, 2 vendors',
    blocks: 'Blocks the sync',
  },
  {
    id: 'Q1',
    text: 'Do clinics already track who is overdue?',
    impact: 0.94,
    band: 'Changes the plan',
    ask: 'Office managers, 1–3 locations',
    blocks: 'Blocks build step 2',
  },
  {
    id: 'Q5',
    text: 'Will patients reply after a year of silence?',
    impact: 0.34,
    band: 'Worth knowing',
    ask: '10 patients, any clinic',
    blocks: 'Blocks nothing yet',
  },
  {
    id: 'Q2',
    text: 'Who signs off — the dentist or the manager?',
    impact: 0.78,
    band: 'Changes the sale',
    ask: 'Both, separately',
    blocks: 'Blocks pricing',
  },
  {
    id: 'Q4',
    text: 'How many recalls does a practice miss?',
    impact: 0.52,
    band: 'Sizes the problem',
    ask: 'Office managers',
    blocks: 'Blocks the pitch',
  },
];

/** The three interview lines for the question that sorts to the top. */
export const TOP_SCRIPT = [
  'Walk me through what happens when a patient misses a recall.',
  'How do you know who is overdue right now?',
  'When did you last chase one? What happened?',
] as const;

/* ============================================================== concept A === */

export type ForkStep = {
  /** Mono week range. Width of the block is derived from `weeks`. */
  span: string;
  weeks: number;
  label: string;
};

export type ForkBranch = {
  /** `YES` / `NO`. Mono, two or three characters. */
  answer: string;
  /** What the answer means, in plain sans. */
  reading: string;
  steps: ForkStep[];
  /** The consequence line under the plan. */
  verdict: string;
  /** Mono summary — the number that makes the two branches comparable. */
  cost: string;
};

export const FORK = {
  eyebrow: 'Open question 01',
  band: 'Changes the plan most',
  question: 'Do clinics already track which patients are overdue?',
  /** Sits on the spine, between the question and the split. */
  hinge: 'One answer, two products',
  branches: [
    {
      answer: 'YES',
      reading: 'The list already exists',
      steps: [
        { span: 'W1–2', weeks: 2, label: 'Read-only sync' },
        { span: 'W3', weeks: 1, label: 'Overdue queue, one-tap SMS' },
        { span: 'W4', weeks: 1, label: 'Pilot, three clinics' },
      ],
      verdict: 'An automation product. Four weeks to a pilot.',
      cost: '4 weeks',
    },
    {
      answer: 'NO',
      reading: 'You are building the list',
      steps: [
        { span: 'W1–3', weeks: 3, label: 'Build the recall ledger' },
        { span: 'W4–6', weeks: 3, label: 'Get one clinic to keep it current' },
        { span: 'W7–9', weeks: 3, label: 'Prove the data stays clean' },
        { span: 'W10–12', weeks: 3, label: 'Only now, the chasing' },
      ],
      verdict: 'A records product first. A different sale, and a harder one.',
      cost: '12 weeks',
    },
  ] satisfies ForkBranch[],
  /** The closing line. The scene ends unresolved on purpose. */
  footnote: 'Neither is drawn yet. Six conversations decide which one you build.',
  hint: 'Hover a branch',
  replayLabel: 'Replay',
} as const;

/** Longest plan in the fork, so both branches share one week scale. */
export const FORK_TOTAL_WEEKS = 12;

export const FORK_STAGE_MS = {
  /** A held frame before anything moves, so the entrance is seen as an entrance. */
  wake: 420,
  /** The question resolves in. */
  ask: 1100,
  /** The spine runs right and the two rails draw out of it. */
  split: 1250,
  /** YES lands, block by block. */
  yes: 1500,
  /** NO lands under it, block by block. */
  no: 1750,
} as const;

/* ============================================================== concept B === */

export const SORT = {
  eyebrow: 'Open questions',
  title: 'Five things the web could not settle',
  /** Mono column head over the bars. */
  axis: 'How much the answer moves the build',
  scriptLabel: 'The script',
  footnote: 'Ordered by how much the answer would change the plan.',
  replayLabel: 'Replay',
} as const;

export const SORT_STAGE_MS = {
  /** A held frame before anything moves, so the entrance is seen as an entrance. */
  wake: 420,
  /** Rows arrive in the order the run produced them. */
  land: 1400,
  /** Bars grow to their measured impact. */
  measure: 1300,
  /** The list reorders itself. */
  sort: 1150,
  /** The top question opens and shows its script. */
  open: 1600,
} as const;

/** One row's height, and the gap under it. The sort transform is built from these. */
export const SORT_ROW_H = 52;
export const SORT_ROW_GAP = 8;
