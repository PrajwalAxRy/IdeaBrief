/**
 * /trial1 — hardcoded content for the Define workspace.
 *
 * Every word and every number on the page comes from this file. Nothing here is
 * generated, fetched, or persisted: the repo is a clickable frontend prototype
 * (CLAUDE.md, "Scope"), and the conversation below is a scripted fixture the
 * thread replays, not a model talking.
 *
 * It sits in `lib/content/` rather than `lib/fixtures/` on purpose. `fixtures/`
 * is the obsidian app's data seam — everything in it is Zod-parsed through
 * `lib/db/queries.ts` and is a stand-in for a Postgres row. This is copy for one
 * experimental page, with no seam behind it and nothing to swap later.
 */

export type StageId = 'define' | 'validate' | 'roadmap';

export type Stage = {
  id: StageId;
  label: string;
  /** Short mono marker rendered inside the control. Never a sentence. */
  flag: string;
  /** False until the stage has a page behind it. Renders non-interactive. */
  available: boolean;
};

/**
 * The three stages are PEERS. No ordinals and no connectors, because the user
 * should read this as somewhere they can move in either direction — a numbered
 * 1-2-3 stepper asserts the opposite and no amount of copy talks it back.
 *
 * Validate and Roadmap are non-interactive here: this trial builds the Define
 * screen only, and a control that navigates nowhere is worse than one that is
 * honestly marked as not ready.
 */
export const STAGES: Stage[] = [
  { id: 'define', label: 'Define', flag: 'Live', available: true },
  { id: 'validate', label: 'Validate', flag: 'Soon', available: false },
  { id: 'roadmap', label: 'Roadmap', flag: 'Soon', available: false },
];

/* -------------------------------------------------------------------------- */
/* Conversation                                                               */
/* -------------------------------------------------------------------------- */

/**
 * A drawn UI fragment inside an assistant turn — rule 9: the payload is a drawn
 * fragment before it is prose. `captured` is the brief writing itself down in
 * front of you; `sources` is a set of leads the assistant has parked.
 */
export type Fragment =
  | { kind: 'captured'; title: string; rows: { label: string; value: string }[] }
  | { kind: 'sources'; title: string; rows: { domain: string; note: string }[] };

export type Turn = {
  id: string;
  role: 'user' | 'assistant';
  /** Rendered as typed <p> elements. Never markdown — CLAUDE.md forbids it. */
  paragraphs: string[];
  fragment?: Fragment;
  /** Chips under the turn body. Kept to three: past that it is a table. */
  chips?: { label: string; tone?: 'neutral' | 'caution' | 'positive' }[];
};

export type Summary = {
  /** One or two sentences. The text budget is a card's, not an essay's. */
  statement: string;
  coverage: { answered: number; total: number };
  captured: { label: string; value: string }[];
  decided: string[];
  open: { question: string; why: string }[];
};

export type Chat = {
  id: string;
  title: string;
  /** Rail grouping. Absolute, because a fixture that says "2 days ago" ages. */
  bucket: 'Today' | 'Last 7 days' | 'Earlier';
  updated: string;
  turnCount: number;
  stage: StageId;
  turns: Turn[];
  summary: Summary;
};

const INVOICING: Chat = {
  id: 'studio-invoicing',
  title: 'Invoicing for small design studios',
  bucket: 'Today',
  updated: '14:22',
  turnCount: 9,
  stage: 'define',
  turns: [
    {
      id: 't1',
      role: 'user',
      paragraphs: [
        'Something for design studios to handle invoicing. Everyone I know runs it out of a spreadsheet and it goes wrong constantly.',
      ],
    },
    {
      id: 't2',
      role: 'assistant',
      paragraphs: [
        'Goes wrong how? "Invoicing is painful" is true of every business on earth, so the useful part is the specific failure — a late payment nobody chased, a number that disagreed with the contract, a client billed twice.',
        'Pick the one you have actually watched happen.',
      ],
    },
    {
      id: 't3',
      role: 'user',
      paragraphs: [
        'Late chasing, mostly. A studio finishes a milestone, the invoice goes out, and then nobody looks at it again for six weeks because the person who sent it went back to designing.',
      ],
    },
    {
      id: 't4',
      role: 'assistant',
      paragraphs: [
        'That is a much narrower thing, and it is not really an invoicing problem — the invoice went out fine. It is a follow-up problem that only exists because the sender is a designer, not a finance team.',
        'So the product is closer to "collections for people who hate collections" than to a billing tool. Worth holding onto: it changes who you compete with.',
      ],
      fragment: {
        kind: 'captured',
        title: 'Captured into the brief',
        rows: [
          { label: 'Problem', value: 'Sent invoices go unchased for weeks' },
          { label: 'Who feels it', value: 'Studio owner, doubling as finance' },
          { label: 'Trigger', value: 'Milestone shipped, attention moves on' },
        ],
      },
    },
    {
      id: 't5',
      role: 'user',
      paragraphs: [
        'Right. And they will not switch off Xero or whatever they already use for the books.',
      ],
    },
    {
      id: 't6',
      role: 'assistant',
      paragraphs: [
        'Then it sits on top rather than replacing anything, which is a constraint worth writing down now — it decides most of the build.',
        'One thing I cannot settle from here: whether studios feel this enough to pay, or whether it is a quiet annoyance they absorb. That is a question for Validate, not for us to guess at.',
      ],
      chips: [
        { label: 'Constraint logged', tone: 'positive' },
        { label: 'Open question', tone: 'caution' },
      ],
    },
    {
      id: 't7',
      role: 'user',
      paragraphs: ['Say roughly 5 to 15 people, agency or studio, project-based work.'],
    },
    {
      id: 't8',
      role: 'assistant',
      paragraphs: [
        'Good — that is small enough to have no finance hire and big enough for an unchased invoice to hurt. I have narrowed the segment to that.',
        'Three things are still open before this brief is worth researching. The biggest is what happens today: if the answer turns out to be "the studio owner sets a calendar reminder and it mostly works", the whole idea is thinner than it looks.',
      ],
      fragment: {
        kind: 'sources',
        title: 'Parked for Validate',
        rows: [
          { domain: 'Segment size', note: '5–15 person project studios, UK + US' },
          { domain: 'Incumbents', note: 'Xero, Chaser, spreadsheet + calendar' },
          { domain: 'Willingness to pay', note: 'Unknown — needs evidence' },
        ],
      },
    },
  ],
  summary: {
    statement:
      'A follow-up layer for small design studios: it watches invoices that have already been sent and chases the ones going quiet, without replacing the books.',
    coverage: { answered: 6, total: 9 },
    captured: [
      { label: 'Problem', value: 'Sent invoices go unchased for weeks' },
      { label: 'Who', value: '5–15 person project-based studios' },
      { label: 'Trigger', value: 'Milestone ships, attention moves on' },
      { label: 'Shape', value: 'Sits on top of existing accounting' },
    ],
    decided: [
      'Not a billing tool — the invoice already went out',
      'Read-only against Xero and friends; no ledger of its own',
      'Competes with a calendar reminder, not with Xero',
    ],
    open: [
      {
        question: 'What do studios do about this today?',
        why: 'If a calendar reminder mostly works, the problem is thinner than it looks.',
      },
      {
        question: 'Does anyone pay to be chased less?',
        why: 'No evidence either way yet. Willingness to pay is unestablished.',
      },
      {
        question: 'Who owns the relationship — owner or account manager?',
        why: 'Changes who the product talks to and what tone it can take.',
      },
    ],
  },
};

const HANDOVER: Chat = {
  id: 'clinic-handover',
  title: 'Shift handover notes for clinics',
  bucket: 'Last 7 days',
  updated: 'Fri',
  turnCount: 14,
  stage: 'define',
  turns: [
    {
      id: 'h1',
      role: 'user',
      paragraphs: [
        'Nurses hand over between shifts on paper and things get dropped. I want to fix that.',
      ],
    },
    {
      id: 'h2',
      role: 'assistant',
      paragraphs: [
        'This one has a hard constraint before it has a product: anything touching a patient record is regulated, and that decides your first year more than any feature will.',
        'Before we go further — are you building for a private clinic group or for public healthcare? The two are different businesses wearing the same word.',
      ],
      chips: [{ label: 'Regulated domain', tone: 'caution' }],
    },
  ],
  summary: {
    statement:
      'A structured shift-handover record for clinics, replacing the paper sheet that currently carries it.',
    coverage: { answered: 3, total: 9 },
    captured: [
      { label: 'Problem', value: 'Handover detail lost between shifts' },
      { label: 'Who', value: 'Clinical staff — segment not yet fixed' },
    ],
    decided: ['Regulated from day one; procurement is part of the product'],
    open: [
      {
        question: 'Private group or public healthcare?',
        why: 'Different buyer, different sales cycle, different compliance floor.',
      },
      {
        question: 'What is the actual failure rate today?',
        why: 'The claim rests on it and nobody has measured it here yet.',
      },
    ],
  },
};

const WAREHOUSE: Chat = {
  id: 'warehouse-returns',
  title: 'Returns triage for small warehouses',
  bucket: 'Earlier',
  updated: '12 Aug',
  turnCount: 22,
  stage: 'define',
  turns: [
    {
      id: 'w1',
      role: 'user',
      paragraphs: ['Returns pile up in a corner and nobody knows what is resellable.'],
    },
    {
      id: 'w2',
      role: 'assistant',
      paragraphs: [
        'So the decision you are automating is "resell, refurbish, or write off", and the cost of getting it wrong is either lost stock value or a bad unit going back out.',
        'That is a real, dated, countable problem. Which end were you thinking — the grading itself, or what happens after it?',
      ],
    },
  ],
  summary: {
    statement:
      'A triage step for returned stock in small warehouses: grade each unit once, then route it to resell, refurbish, or write-off.',
    coverage: { answered: 8, total: 9 },
    captured: [
      { label: 'Problem', value: 'Returned stock ungraded and unrouted' },
      { label: 'Who', value: 'Single-site warehouses, under 20 staff' },
      { label: 'Decision', value: 'Resell / refurbish / write off' },
    ],
    decided: [
      'Grading happens at goods-in, not at the pile',
      'Photo-first — no barcode assumption',
    ],
    open: [
      {
        question: 'Is the write-off cost big enough to fund the fix?',
        why: 'Everything downstream depends on the size of the loss being real.',
      },
    ],
  },
};

export const CHATS: Chat[] = [INVOICING, HANDOVER, WAREHOUSE];

export const DEFAULT_CHAT_ID = INVOICING.id;

/** Rail groups, in render order. A bucket with no chats is not rendered. */
export const BUCKETS: Chat['bucket'][] = ['Today', 'Last 7 days', 'Earlier'];

/**
 * The scripted reply. Sending anything in the composer appends the typed text
 * and then this, after a delay — a fixture replayed on a timer, exactly like the
 * research run in the main app. Nothing is generated.
 */
export const SCRIPTED_REPLY: Turn = {
  id: 'scripted-reply',
  role: 'assistant',
  paragraphs: [
    'Noted — I have added that to the brief rather than answering it, because it is a claim about the world and I have no evidence for it yet.',
    'Two of the three open questions are still open. Close those and this brief is worth researching.',
  ],
  chips: [{ label: 'Added to brief', tone: 'positive' }],
};

export const COMPOSER_PLACEHOLDER = 'Tell me what you would change about that…';
