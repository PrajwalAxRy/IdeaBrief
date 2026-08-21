/**
 * App-page copy — every string the four run pages render.
 *
 * This is static app copy, deliberately not in `lib/fixtures/`, deliberately
 * not routed through `lib/db/queries.ts`, imported directly — the one
 * sanctioned exception to the no-direct-import rule, and the same pattern
 * `lib/content/landing.ts` already follows. That seam exists to stand in for
 * Postgres reads of a real run; page furniture will never come from there.
 *
 * Two things this file must never contain:
 *
 *   1. **A label map of any kind.** `DIMENSION_LABEL`, `DIMENSION_SHORT`,
 *      `STANCE_LABEL` and `DISCARD_REASON_LABEL` all live in
 *      `lib/schemas/evidence.ts`, beside the schema. R14 was *three*
 *      vocabularies for the same five dimensions; a fourth home in a copy file
 *      is exactly how it comes back. Do not add one here helpfully.
 *
 *   2. **A Tailwind class name.** `tailwind.config.ts`'s `content` globs cover
 *      `app/` and `components/` and deliberately not `lib/` — a class written
 *      here is never scanned and silently does nothing. If a copy entry seems
 *      to need a class, the layout decision is in the wrong file.
 *
 * Counts are derived, not typed. The roadmap's `4 BUILD STEPS · 1 TRIPWIRE`
 * comes from `planSpans`; the one commented exception is `SOURCES.lead`.
 */

/* ---------------------------------------------------------------- brand --- */

export const APP_BRAND = {
  name: 'Groundwork',
} as const;

/* --------------------------------------------------------------- shared --- */

/** The middot, not ` // `. The `//` form is Deep Canopy; every `MetaLine` in
 *  this build joins on this constant rather than a literal. */
export const META_SEPARATOR = ' · ';

/* --------------------------------------------------------------- chrome --- */

/**
 * Everything the run header, stage rail and footer say. Stage labels stay
 * title case here and are uppercased by `.ob-stage-label`'s `text-transform` —
 * copy is copy, casing is CSS.
 *
 * There is no `define` locked hint: Define is the run's origin and is never
 * locked, so a hint for it would be a string with no reachable state.
 */
export const APP_CHROME = {
  stages: [
    { key: 'define', label: 'Define' },
    { key: 'validate', label: 'Validate' },
    { key: 'roadmap', label: 'Roadmap' },
  ],
  lockedHints: {
    validate: 'Approve the brief to unlock Validate.',
    roadmap: 'Finish the research to unlock the roadmap.',
  },
  evidenceButtonSuffix: 'VERIFIED',
  explorerTitle: 'Everything we checked',
  footerAction: 'Start another idea',
  skipLabel: 'Skip to content',
  copyLinkLabel: 'Copy link',
} as const;

/* ------------------------------------------------------------- evidence --- */

/**
 * The three-layer disclosure's strings. **No `stanceWords`, no dimension map,
 * no discard-reason map** — all four live in `lib/schemas/evidence.ts` (C3),
 * beside the schema they belong to. R14 was three vocabularies for the same
 * five dimensions; a fourth home in a copy file is exactly how it comes back.
 */
export const APP_EVIDENCE = {
  hint: 'Hover any citation to see the source. Click to open the full evidence.',
  excerptCaption: 'This exact text was found on the page below.',
  fieldLabels: {
    finding: 'Finding',
    excerpt: 'Verbatim excerpt',
    source: 'Source',
    stance: 'Stance',
    attemptedQuery: 'Attempted query',
  },
  drawerTitles: {
    verified: (n: number) => `Evidence ${n}`,
    discarded: 'Discarded excerpt',
  },
  prev: '← Previous',
  next: 'Next →',
  filteredSuffix: 'FILTERED',
  notUsed: 'NOT USED IN THE REPORT',
  citedMarker: 'CITED',
  citedTitle: 'Quoted in the report',
  published: 'Published',
} as const;

/* --------------------------------------------------------------- define --- */

export const DEFINE = {
  title: 'What are you building?',
  briefHead: 'THE BRIEF',
  roles: { assistant: 'GROUNDWORK', user: 'YOU' },
  composer: {
    placeholder: 'Type your answer…',
    hint: 'ENTER TO SEND · ⇧ENTER NEW LINE',
    hintQueued: 'QUEUED',
    send: 'Send',
    dontKnow: "I don't know",
  },
  newMessage: '↓ New message',
  closed: {
    marker: 'CONVERSATION COMPLETE',
    line: 'You can still edit any field in the brief. Approve when you’re ready.',
    reopen: 'Add something else',
  },
  /**
   * The one place this sentence is assembled. `BriefProgress` is presentational
   * and stateless; A7 changes only where the three numbers come from.
   */
  progress: (answered: number, total: number, unknown: number) =>
    unknown === 0
      ? `${answered} of ${total} answered`
      : `${answered} of ${total} answered · ${unknown} unknown → open question${
          unknown === 1 ? '' : 's'
        }`,
} as const;

/* ---------------------------------------------------------------- brief --- */

/**
 * The brief panel's own copy. **This is page copy, not one of C3's vocabulary
 * maps** — C3 governs the dimension / stance / discard vocabulary and is
 * untouched by these twelve display strings, which exist here so A11's
 * `You marked "Who decides" unknown.` line and A14's `define/loading.tsx`
 * skeleton read the same label the panel does.
 */
export const BRIEF = {
  fieldLabels: {
    one_liner: 'One-liner',
    product: 'Product',
    customer: 'Customer',
    who_decides: 'Who decides',
    problem: 'Problem',
    how_they_solve_it_today: 'How they solve it today',
    what_makes_this_different: 'What makes this different',
    first_version_scope: 'First version scope',
    how_it_makes_money: 'How it makes money',
    how_customers_find_it: 'How customers find it',
    assumptions: 'Assumptions',
    open_questions: 'Open questions',
  },
  /** The five reading groups, in panel order. */
  fieldGroups: [
    ['one_liner'],
    ['product', 'customer', 'who_decides'],
    ['problem', 'how_they_solve_it_today', 'what_makes_this_different'],
    ['first_version_scope', 'how_it_makes_money', 'how_customers_find_it'],
    ['assumptions', 'open_questions'],
  ],
  unknownWord: 'unknown',
  openQuestionTag: '→ OPEN QUESTION',
  editedTag: 'EDITED',
  editHint: 'Edit',
  approve: 'Approve and research',
  approving: 'Starting research…',
  /** Spelled out — the mono numeral layer is for data. */
  approveNote: 'Takes about five minutes.',
  approvedPrefix: 'APPROVED',
  approvedSuffix: 'LOCKED WHILE RESEARCH RUNS',
  listHint: 'One per line. ⌘/Ctrl + Enter to save.',
  dontKnowUnavailable: 'Available once the first question is asked.',
  /**
   * What approving right now costs, in words. "Unanswered" means fields marked
   * unknown **plus** fields the conversation has not yet reached — the honest
   * count, and the reason the line moves while you talk.
   */
  consequence: (n: number) =>
    n === 0
      ? 'Nothing is unanswered. The research starts from a complete brief.'
      : `Approve now and ${n} unanswered ${
          n === 1 ? 'field becomes an open question' : 'fields become open questions'
        }.`,
  handoff: {
    marker: 'RUN STARTED',
    title: 'This page is your run.',
    lead: 'Bookmark it — there’s no login to get back.',
    action: 'Watch the research →',
  },
} as const;

/* ------------------------------------------------------------- validate --- */

export const VALIDATE_CONSOLE = {
  h1: 'Reading the web about your idea.',
} as const;

/**
 * Mode A's copy, complete. **No discard-reason strings live here** — those are
 * `DISCARD_REASON_LABEL` in `lib/schemas/evidence.ts` (C3), and the console
 * renders them through it rather than through a second spelling.
 *
 * The two mono lines (`COMPLETE`, `LAST ·`) have no verb; the two sans lines
 * that do (`Still working…`, `This is taking longer than usual.`) are sans for
 * exactly that reason. Mono carries no sentences.
 */
export const APP_CONSOLE = {
  h1: 'Reading the web about your idea.',
  connecting: 'CONNECTING…',
  phases: [
    { key: 'searching', label: 'SEARCHING' },
    { key: 'fetching', label: 'FETCHING' },
    { key: 'verifying', label: 'VERIFYING' },
    { key: 'writing', label: 'WRITING' },
  ],
  complete: 'COMPLETE',
  stalled: 'Still working — some pages are slow to fetch.',
  stalledLong: 'This is taking longer than usual.',
  refresh: 'Refresh',
  queriesLabel: 'QUERIES',
  queriesExpand: (n: number) => `All ${n} queries ↓`,
  queriesCollapse: 'Collapse ↑',
  coverageLabel: 'COVERAGE',
  thinTag: 'thin',
  discardSuffix: 'excerpts discarded',
  discardParen: 'didn’t match the page',
  discardLastPrefix: 'LAST',
  discardDone: (n: number) => `All ${n} are listed in Sources.`,
  discardDoneAction: 'See them →',
  emptyStream: 'Nothing verified yet. Findings appear here as they pass the check.',
  jump: (n: number) => `↑ ${n} new`,
  earlier: (n: number) => `+${n} earlier findings`,
  foot: 'You can close this tab — the run keeps going. Come back to this link.',
  /** One write per 3s, not one per event: 84 announcements in 45 seconds is a
   *  firehose. Nothing is hidden — only un-shouted. */
  liveSummary: (searched: number, total: number, verified: number) =>
    `${searched} of ${total} queries searched. ${verified} findings verified.`,
} as const;

export const VALIDATE_REPORT = {
  h1: 'What the web already says.',
} as const;

/** Two and three are the only counts this report can produce (`surprises` is
 *  `.min(2).max(3)` and `unanswered` runs to three), so the map is closed
 *  rather than a general number-to-word table nobody maintains. */
const NUMBER_WORD: Record<number, string> = { 1: 'One', 2: 'Two', 3: 'Three' };
export function numberWord(n: number): string {
  return NUMBER_WORD[n] ?? String(n);
}

/**
 * Mode B's copy, complete. **No dimension, stance or discard vocabulary lives
 * here** — those are C3's maps in `lib/schemas/evidence.ts`.
 *
 * Every count in this block is a function of something derived. The one
 * sentence that names a number in prose (`23 of 47 findings…`) takes both
 * numbers as arguments for exactly that reason.
 */
export const REPORT = {
  h1: 'What the web already says.',
  sections: {
    evidenceState: {
      eyebrow: 'STATE OF THE EVIDENCE',
      h2: "What this evidence can and can't carry.",
    },
    summary: { eyebrow: 'WHAT WE FOUND', h2: 'The short version.' },
    dimensions: { eyebrow: 'THE FIVE DIMENSIONS', h2: 'The five things we looked for.' },
    competitors: { eyebrow: 'WHO ELSE IS DOING THIS', h2: 'Who is already in this space.' },
    surprises: {
      eyebrow: 'WHAT SURPRISED US',
      h2: (n: number) => `${numberWord(n)} things we didn’t expect.`,
    },
    unanswered: { eyebrow: "WHAT WE COULDN'T ANSWER", h2: 'What the web couldn’t tell us.' },
  },
  evidenceState: {
    keys: { strong: 'STRONG ON', thin: 'THIN ON', contested: 'ACTIVELY CONTESTED' },
    empty: 'nothing yet',
    /**
     * The whole point of D7, and the only thing standing between this band and
     * a verdict. Do not shorten it, do not move it above the three-up, and do
     * not let a later pass turn it into a tooltip.
     */
    note: 'This describes the evidence, not the idea. A thin dimension means the web was quiet, not that the answer is no.',
  },
  dimension: {
    thinTag: 'THIN',
    accordion: (n: number) => `Show all ${n} findings`,
  },
  evidenceRail: {
    head: 'NOT QUOTED ABOVE',
    more: (n: number) => `+${n} more →`,
    all: (n: number, label: string) => `All ${n} in ${label.toLowerCase()} →`,
  },
  uncited: {
    line: (uncited: number, total: number) =>
      `${uncited} of ${total} findings aren’t quoted anywhere above. All of them are in the explorer.`,
    action: 'See everything we checked →',
  },
  competitor: {
    keys: { moat: 'MOAT', take_from_them: 'TAKE FROM THEM', ignore: 'IGNORE' },
    missing: 'not established from available evidence',
  },
  unanswered: {
    lead: (n: number) => `${numberWord(n)} things no amount of reading settles.`,
    line: 'Each one has a script and a way to find the people to run it on.',
    action: 'What to do next →',
  },
  thin: {
    title: 'We found very little about this online.',
    body: 'That is not evidence against your idea — it usually means the idea is new, very local, or described in words the web doesn’t use yet. The most useful part of this run is the next section.',
    action: 'What to do next →',
    littleEvidence: 'LITTLE EVIDENCE',
  },
  /**
   * The four authored figure notes. These are the only sentences in the report
   * that are copy rather than data — everything else a figure says is derived.
   * Each one exists because the mark alone would be read wrongly without it.
   */
  figures: {
    counterSignalNote: 'The only number in this report that points the other way.',
    ladderNote:
      'Both competitors price under the line where a practice owner has to approve the spend [33][34][42].',
    practicalNote:
      'Marked thin because we found two findings here. All three of these constraints are hard numbers.',
    capabilityNote: 'The last column is your brief, not a finding. Nothing in it has been checked.',
  },
  index: [
    { index: '01', label: 'EVIDENCE', id: 'evidence-state' },
    { index: '02', label: 'SUMMARY', id: 'what-we-found' },
    { index: '03', label: 'DIMENSIONS', id: 'dimensions' },
    { index: '04', label: 'COMPETITORS', id: 'competitors' },
    { index: '05', label: 'SURPRISES', id: 'surprises' },
    { index: '06', label: 'UNANSWERED', id: 'unanswered' },
  ],
} as const;

/* -------------------------------------------------------------- roadmap --- */

export const ROADMAP = {
  h1: 'What to do next.',
  lead: "Six things the web can't tell you, and the plan that depends on them.",
  nav: [
    { id: 'open-questions', label: 'Open questions' },
    { id: 'build-roadmap', label: 'Build roadmap' },
  ],
  /** The seven-label spine, in fixed order. The `QUESTION` row is the trigger
   *  and renders collapsed *and* expanded, so the landmark never disappears. */
  labels: {
    question: 'QUESTION',
    why_it_matters: 'WHY IT MATTERS',
    ask: 'ASK',
    find_them: 'FIND THEM',
    how_many: 'HOW MANY',
    script: 'THE SCRIPT',
    survey: 'THE SURVEY',
    what_you_learn: 'WHAT YOU LEARN',
  },
  askPrefix: 'ASK',
  fanOut: {
    steps: (n: number) => `${n} STEP${n === 1 ? '' : 'S'}`,
    stepsWithTripwire: (n: number) => `${n} STEP${n === 1 ? '' : 'S'} + TRIPWIRE`,
  },
  promotedTag: 'FROM YOUR BRIEF',
  promotedNote: (label: string) => `You marked “${label}” unknown.`,
  alsoUnknown: {
    label: 'ALSO UNKNOWN',
    /**
     * Nothing in the run wrote a script for these, and fabricating one would
     * violate "nothing is invented to fill a field". They are worth answering
     * and the page says so without pretending to know how.
     */
    line: (countWord: string, fields: string) =>
      `${countWord} more thing${fields.includes(META_SEPARATOR) ? 's' : ''} you marked unknown — ${fields} — didn’t turn into research questions. Worth answering; there’s no script for them.`,
  },
  /* ---------------------------------------------------- A12: the build plan --- */

  /**
   * §02's own strings. **No step names live here** — they render through
   * `ROADMAP_PHASE_LABEL` in `lib/schemas/roadmap.ts`, sentence-case for the
   * headings and uppercased by CSS for the bars. One label map, no second one
   * (C3).
   */
  plan: {
    /** The subtitle under the lead step's name, and the only one there is. */
    subtitles: {
      FIRST_THING_TO_BUILD: 'the smallest version a real user could use',
    } as Partial<Record<string, string>>,
    /** Composed from `planSpans`, never typed: `12-WEEK HORIZON · 3 DEFINITE SPANS · 1 OPEN-ENDED`. */
    axisCaption: (horizon: number, definite: number, open: number) =>
      `${horizon}-WEEK HORIZON · ${definite} DEFINITE SPAN${definite === 1 ? '' : 'S'} · ${open} OPEN-ENDED`,
    /** `W1–W2 · 2 WEEKS`, `W12 · ONGOING`. Also composed from `planSpans`. */
    span: (startWeek: number, endWeek: number | null) =>
      endWeek === null
        ? `W${startWeek} · ONGOING`
        : endWeek === startWeek
          ? `W${startWeek} · 1 WEEK`
          : `W${startWeek}–W${endWeek} · ${endWeek - startWeek + 1} WEEKS`,
    notInIt: 'NOT IN IT',
  },

  tripwire: {
    label: 'NOT A STEP · A TRIPWIRE',
    note: 'Two answers could invalidate this plan before you write any of it.',
    /** Thin only. Naming a "first thing to build" the evidence can't support is
     *  the one judgement this product refuses to make. */
    thinNote:
      'The web didn’t have much on this, so the thing most likely to change the plan is what to watch — not what to build.',
  },

  exit: {
    label: 'END OF THE RUN',
    line: 'Nothing here is a verdict. The evidence is all still there.',
    sources: 'Everything we checked →',
    report: 'Back to the report →',
    restart: 'Start another idea →',
  },

  copyScript: 'Copy script',
  copySurvey: 'Copy survey',
  copyAll: 'Copy all scripts',
  copied: '✓ Copied',
  copyFailed: 'Press ⌘C',
  dependsOn: '◂ depends on',
  changes: 'Changes:',
  noCommunities:
    'We didn’t find specific communities for this — start with the general ones and ask who else to talk to.',
  surveyStanding: 'Surveys are for counting things after interviews have told you what to count.',
  /**
   * The clipboard text: **clean plain text, the numbered questions only.** No
   * markdown, no labels, no attribution footer. The numbering lives in CSS on
   * screen (`counter-increment`) and is rebuilt here for the paste — a `"1. "`
   * baked into the data is presentation leaking into the fixture.
   */
  fieldwork: {
    headline: 'None of the answers are online.',
    lead: 'Everything above is a question the web has already declined to answer. Everything below assumes you went and asked.',
    panels: [
      {
        id: 'conversation',
        caption: '01 · 8–10 CONVERSATIONS',
        brief:
          'Two people at a small table in a back office, three-quarter from behind and to one side. One is mid-sentence with a hand half-raised; the other is writing in a notebook and not looking up. A paper cup, a folder, a chair pushed out. Cramped, fluorescent-adjacent, not a meeting room. Near-monochrome, single hard key light, deep shadow. 12s, almost no camera move.',
      },
      {
        id: 'expo',
        caption: '02 · ONE REGIONAL EXPO',
        brief:
          'A trade-hall aisle photographed down its length, wide open and mostly empty. Backs of two or three figures far away. Booth frames visible only as dark geometry, no legible signage. Overhead light in hard pools with black between them — the first hour of the first day, before anyone arrives. 12s, almost no camera move.',
      },
      {
        id: 'front-desk',
        caption: '03 · ONE PILOT PRACTICE, ~200 PATIENTS',
        brief:
          'A reception counter after hours, shot low and close along the countertop. A desk phone handset, a paper appointment book left open, a pen. One screen present but angled away and completely out of focus. No people. A single hard key light from off-frame left, dying within a metre. 12s, almost no camera move.',
      },
    ],
  },
} as const;

/** The numbered questions only — the paste a person actually wants. */
export function buildScriptText(lines: readonly string[]): string {
  return lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
}

/* -------------------------------------------------------------- sources --- */

export const SOURCES = {
  h1: 'Everything we checked.',
  /* The two numerals duplicate fixture volumes on purpose. Copy is design
     here, and a sentence computed from `evidence.length` would read like a
     dashboard readout rather than a line someone wrote. This is the whole of
     the exception — no other count in this file is typed. */
  lead: "47 excerpts passed the check. 18 didn't. All of it is here.",
  /** `BackLink` supplies the arrow; the string must not carry a second one. */
  back: 'Back to the report',

  /* --------------------------------------------- A13: the Evidence Explorer --- */

  /** The two bands. The numeral is chalk, never blue; the sentence is the `<h2>`. */
  bands: {
    run: { index: '01', eyebrow: 'THE RUN', h2: 'How the evidence was gathered.' },
    all: {
      index: '02',
      eyebrow: 'EVERYTHING WE CHECKED',
      h2: 'Every record, verified and discarded.',
      sub: 'Every excerpt the run touched, verified and discarded, newest first.',
    },
  },

  run: {
    funnelCaption: 'THE RUN',
    funnelSource: 'ALL 65 RECORDS',
    funnelNote:
      'Every excerpt is kept, including the 18 that failed the check. Each carries the reason it was dropped.',
    reasonsCaption: 'WHY 18 WERE DROPPED',
    reasonsSource: 'SHOW THE 18',
    domainsCaption: 'WHERE IT CAME FROM',
    domainsSource: 'FILTER BY DOMAIN',
    /** Composed from the corpus; the numerals are never typed. */
    domainsSub: (findings: number, urls: number, domains: number, largest: number) =>
      `${findings} VERIFIED FINDINGS · ${urls} URLS · ${domains} DOMAINS · LARGEST SUPPLIES ${largest}`,
    domainsTail: (n: number) => `${n} domain${n === 1 ? '' : 's'}, one finding each`,
  },

  /** The six facet legends, in rail order. Real `<h3>`s — a filter rail is a
   *  landmark a screen-reader user navigates by (C17: `/sources` h3 ×6). */
  facets: {
    railLabel: 'Filter the evidence',
    legends: {
      dim: 'DIMENSION',
      stance: 'STANCE',
      status: 'STATUS',
      cited: 'IN THE REPORT',
      domain: 'DOMAIN',
      q: 'WHEN',
    },
    statusLabels: { verified: 'Verified', discarded: 'Discarded' },
    citedLabels: { yes: 'Cited', no: 'Not cited' },
    domainTail: 'One record only',
    /** `2025Q3` → `Q3 2025`. Presentation, not a stored string. */
    quarter: (key: string) => `${key.slice(4)} ${key.slice(0, 4)}`,
    domainNote: 'COUNTS INCLUDE DISCARDS',
    verifiedOnlyNote: 'DISCARDS EXCLUDED — A DISCARDED EXCERPT HAS NO STANCE',
    clear: 'Clear all',
    /** The fixed-height alternative to `Clear all`, so swapping one for the
     *  other shifts nothing. */
    idle: (total: number) => `NO FACETS · ${total} RECORDS`,
  },

  sort: {
    label: 'Sort',
    buttons: [
      { key: 'newest', label: 'NEWEST' },
      { key: 'oldest', label: 'OLDEST' },
      { key: 'dimension', label: 'DIMENSION' },
      { key: 'stance', label: 'STANCE' },
      { key: 'number', label: 'NUMBER' },
    ],
    /**
     * **This replaced "Every finding that passed the check, in the order it was
     * verified."** That sentence was literally true and practically a lie: the
     * array is grouped by dimension, dates zigzag backwards inside each block,
     * and a reader infers either a ranking or a chronology and gets neither.
     * This line describes exactly what is on screen and changes when the screen
     * does. `total` is always the corpus, never the current scope.
     */
    count: (n: number, total: number, sortLabel: string) =>
      `SHOWING ${n} OF ${total} · ${sortLabel}`,
    countLabels: {
      newest: 'NEWEST FIRST',
      oldest: 'OLDEST FIRST',
      dimension: 'BY DIMENSION',
      stance: 'BY STANCE',
      number: 'BY NUMBER',
    },
  },

  row: {
    cited: 'CITED',
    discarded: 'DISCARDED',
    discardPrefix: 'DISCARDED — ',
    foundBy: (query: string) => `Found by: “${query}”`,
    openVerified: (n: number) => `Open evidence for finding ${n}`,
    openDiscard: (id: string) => `Open discarded record ${id}`,
    outLabel: 'Open the source page in a new tab',
  },

  /** No illustration, no toast. The active facets are named so the reader can
   *  see which combination emptied the list. */
  empty: {
    headline: 'Nothing matches this combination.',
    clear: 'Clear all facets',
    /** The whole-run zero case, unreachable with this fixture but honest. */
    runHeadline: 'Nothing passed the check for this run.',
    runAction: 'See the roadmap',
  },

  foot: {
    label: (total: number) => `END OF THE EVIDENCE · ${total} RECORDS`,
    next: 'What to do next →',
  },
} as const;

/* --------------------------------------------- supporting surfaces (A14) --- */

/**
 * Every string on a surface that is **not** one of the four run pages: the
 * invalid-run page, the root 404, the root error boundary, and the two
 * segment-scoped error boundaries.
 *
 * **The banned register, restated here because this is where it would drift
 * back in:** no "Oops!", no bare "Something went wrong", no "Please try again
 * later", no exclamation marks, no emoji, no blame. Every string names a cause
 * or a next step. Errors are inline and adjacent — there are no modals, no top
 * banners and no toasts anywhere in this product.
 *
 * **It deliberately does not hold the sources empty-facet copy.** That is
 * `SOURCES.empty` above, imported by the one surface that renders it. Two
 * strings for one sentence is how R14 started.
 *
 * Eyebrows are authored uppercase — `.ob-eyebrow` carries no `text-transform`
 * (only `.ob-meta` and `.ob-stage-label` do).
 */
export const SUPPORTING = {
  /**
   * 09.2 — the most important surface in this phase, and **not** a 404 in the
   * generic sense. The slug is the entire access model, so a truncated link is
   * the single most likely real failure in the product; it gets `--ob-h1` and a
   * recovery path rather than an announcement.
   */
  notFoundRun: {
    eyebrow: 'RUN NOT FOUND',
    headline: 'There’s nothing at this link.',
    body: [
      'The link may be incomplete — they’re long, and chat apps sometimes cut them off. Check you copied the whole thing.',
      'Runs aren’t stored against an account, so we can’t look one up for you.',
    ],
    recoveryHead: 'RECENT RUNS',
    /** Required: it sets accurate expectations about durability in one line. */
    footnote: 'Remembered by this browser only.',
    action: 'Start a new idea',
  },

  /** No run context to reason about, so it stays plain and takes `--ob-h2`. */
  notFound: {
    eyebrow: 'NOT FOUND',
    headline: 'There’s nothing here.',
    body: 'That address doesn’t match anything in this product.',
    action: 'Start an idea',
  },

  /**
   * The root boundary. `slugBody` renders only when the pathname carries a run
   * slug — an error boundary cannot receive route params, so the slug is read
   * off `usePathname()`.
   */
  error: {
    eyebrow: 'SOMETHING BROKE',
    headline: 'This one’s on us.',
    body: 'An unexpected error stopped the page from loading.',
    slugBody: 'Your run is still there — reloading usually fixes it.',
    retry: 'Reload',
    toRun: 'Go to your run',
    /**
     * `ERROR {digest} · {YYYY-MM-DD HH:MM}` — two parts, joined by `MetaLine`
     * on `META_SEPARATOR`. **Never ` // `**: the `//` form is Deep Canopy.
     */
    digest: (digest: string, at: string) => [`ERROR ${digest}`, at],
  },

  /**
   * Segment-scoped: nested below `app/r/[slug]/layout.tsx`, so `RunShell`'s
   * chrome stays mounted and the completed work is never lost.
   */
  roadmapError: {
    title: 'We couldn’t write the roadmap for this run.',
    body: 'The research is finished and safe — you can try again.',
    retry: 'Try again',
    back: 'Back to the report',
  },

  sourcesError: {
    title: 'We couldn’t load the evidence for this run.',
    body: 'The report is finished and safe — every finding is still on it.',
    retry: 'Try again',
    back: 'Back to the report',
  },

  /**
   * `?sendfail=1` — the only surface that exercises *never lose user input*,
   * which is a standing product promise. The composer's text is preserved.
   */
  sendFailed: {
    line: 'Couldn’t send that. Your text is safe.',
    retry: 'Retry',
  },
} as const;

/* --------------------------------------------------------- numeral spine --- */

/** The `01 …` section spine each long page carries. Define and the Console
 *  have no spine and get no entry. The six report entries are the six `<h2>`s
 *  of the plan's C17 heading outline — if this list gains a seventh, A15's
 *  outline assertion is what catches it. */
export type SectionEntry = { index: string; label: string; id: string };

/**
 * A9 shortened these ids. The eyebrow text is unchanged and still lives in
 * `REPORT.sections`; what changed is the anchor, because `#what-we-found` is
 * A8's cross-fade reveal target and a six-entry index reading
 * `#the-five-dimensions` alongside it was two naming schemes in one strip.
 * `REPORT.index` is what `SectionIndex` renders; this list stays as the
 * canonical id/eyebrow pairing A15's outline diff reads.
 */
export const REPORT_SECTIONS: readonly SectionEntry[] = [
  { index: '01', label: 'STATE OF THE EVIDENCE', id: 'evidence-state' },
  { index: '02', label: 'WHAT WE FOUND', id: 'what-we-found' },
  { index: '03', label: 'THE FIVE DIMENSIONS', id: 'dimensions' },
  { index: '04', label: 'WHO ELSE IS DOING THIS', id: 'competitors' },
  { index: '05', label: 'WHAT SURPRISED US', id: 'surprises' },
  { index: '06', label: "WHAT WE COULDN'T ANSWER", id: 'unanswered' },
] as const;

export const ROADMAP_SECTIONS: readonly SectionEntry[] = [
  { index: '01', label: 'OPEN QUESTIONS', id: 'open-questions' },
  { index: '02', label: 'BUILD ROADMAP', id: 'build-roadmap' },
] as const;

export const SOURCES_SECTIONS: readonly SectionEntry[] = [
  { index: '01', label: 'THE RUN', id: 'the-run' },
  { index: '02', label: 'EVERYTHING WE CHECKED', id: 'everything-we-checked' },
] as const;
