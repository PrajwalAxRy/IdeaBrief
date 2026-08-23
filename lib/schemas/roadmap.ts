import { z } from 'zod';
import { BriefFieldKeySchema } from './brief';

/**
 * The roadmap is a **journey**, not a build plan — and after A17 it is a
 * journey with exactly five steps in it.
 *
 * Two rules survive from A16 unchanged, because they are the reason the page is
 * honest rather than motivational:
 *
 * > **Estimate the clocks you don't control. Milestone the ones you do.**
 *
 * Carrier registration takes two to three weeks whether the founder is
 * brilliant or slow — that is the carrier's clock, and a number on it is
 * honest. "Build the product" is entirely theirs, unknowable, and any number
 * printed on it is a lie that turns into shame when it slips.
 *
 * > **Steps anchor to each other, never to dates.**
 *
 * `starts_when` is the content of a step, not decoration: "at roughly 80% built,
 * not after" is a real, observable trigger even though its date is unknowable,
 * and it is the only way overlap can be stated without inventing a schedule.
 *
 * **What A17 changed.** The `tracks` + `bars` pair is gone. Fourteen bars across
 * six tracks produced a chart nobody could read: two levels of hierarchy, rows
 * eighteen pixels tall, and a legend explaining two fill treatments. It is now
 * five `phases` — one row each, no nesting — plus a flat `setup` list that
 * carries no timeline at all, because a domain purchase and an insurance policy
 * never belonged on a Gantt chart. **Every week number on the page now lives in
 * `setup`**, which is also the honest place for it: the queues really are the
 * only durations anyone can know in advance.
 */

export const EffortSchema = z.enum(['hours', 'days', 'weeks']);
export type Effort = z.infer<typeof EffortSchema>;

/**
 * Compressed twice. A16 deleted `script`, `survey` and `what_you_learn`; A17
 * deleted `ask`, `find_them`, `how_many` and `effort`.
 *
 * What is left is the two things a reader needs in an *overview*: the question,
 * and what changes depending on the answer. The fieldwork detail was real and
 * useful and still cost six full-height cards on a page whose entire complaint
 * was density — this is an overview meant to make someone think, not a research
 * brief they execute from. `priority` and `brief_field` survive because they are
 * machinery rather than content: the first orders the list, the second lets a
 * field the user marked unknown in Define float its question to the top.
 */
export const OpenQuestionSchema = z.object({
  /** "Q01" */
  id: z.string().regex(/^Q\d+$/, 'Open question id must look like "Q01"'),
  number: z.number().int().positive(),
  /** A rank, not a tier — sorted on, and arithmetic is done with it. */
  priority: z.number().int().positive(),
  /** The brief field this question traces back to, or null. */
  brief_field: BriefFieldKeySchema.nullable(),
  question: z.string().min(1),
  /** One sentence on what changes depending on the answer. */
  why_it_matters: z.string().min(1),
});
export type OpenQuestion = z.infer<typeof OpenQuestionSchema>;

/* -------------------------------------------------------------------------- */
/* Cost                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Bands, not prices — and the reason is not squeamishness about numbers.
 * **Prices rot.** A fixture asserting `$0.0079/segment` is wrong within a year
 * and quietly makes every other number on the page suspect; `$` is correct
 * forever. It is also what the reader actually needs: nobody decides anything
 * differently between $18/mo and $24/mo.
 *
 * `free` is a real band, not a missing value — "your hosting genuinely costs
 * nothing at this scale" is the single most useful cost fact on the page.
 */
export const CostBandSchema = z.enum(['free', '$', '$$', '$$$']);
export type CostBand = z.infer<typeof CostBandSchema>;

/* -------------------------------------------------------------------------- */
/* Ambushes                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The five species exist to make ambushes **generative rather than vibes**.
 * "Think of ten surprising things" produces slop; five questions asked of one
 * idea produce ten specific ones. A candidate that fits none of these species
 * is almost always a platitude wearing a warning label.
 */
export const AmbushSpeciesSchema = z.enum([
  /** Takes N weeks, cannot be compressed, discovered at the worst moment. */
  'lead_time',
  /** Free or fine until a specific line, then not. */
  'threshold',
  /** What you permanently owe from the moment you have one customer. */
  'obligation',
  /** What you won't find out until much later than you'd assume. */
  'delayed_signal',
  /** The early success they will wrongly extrapolate from. */
  'false_generalisation',
]);
export type AmbushSpecies = z.infer<typeof AmbushSpeciesSchema>;

/**
 * Where an ambush came from, and therefore whether it may cite.
 *
 * - `run` — a verified finding from the research run's `PRACTICAL` dimension.
 *   These **must** cite; the chip is the whole reason they are stronger.
 * - `idea` — implied by what the product touches (sends SMS → carrier
 *   registration). Derivable from the brief, found by no search, cites nothing.
 * - `universal` — true of any first business. **Capped at three** by the
 *   refinement below, because these are the ones that read as generic.
 */
export const AmbushSourceSchema = z.enum(['run', 'idea', 'universal']);
export type AmbushSource = z.infer<typeof AmbushSourceSchema>;

export const MAX_UNIVERSAL_AMBUSHES = 3;

export const AmbushSchema = z
  .object({
    id: z.string().regex(/^A\d{2}$/, 'Ambush id must look like "A01"'),
    species: AmbushSpeciesSchema,
    source: AmbushSourceSchema,
    text: z.string().min(1),
    citation_id: z.number().int().positive().optional(),
  })
  .refine((a) => a.source !== 'run' || a.citation_id !== undefined, {
    message: 'A run-sourced ambush must carry the citation_id of the finding it came from.',
  })
  .refine((a) => a.source === 'run' || a.citation_id === undefined, {
    message:
      'Only a run-sourced ambush may cite. An `idea` or `universal` ambush with a citation is ' +
      'claiming research it does not have.',
  });
export type Ambush = z.infer<typeof AmbushSchema>;

/* -------------------------------------------------------------------------- */
/* Phases — the five rows of the chart                                        */
/* -------------------------------------------------------------------------- */

/**
 * **A closed enum, so a fixture cannot invent a colour.** `tokens.css` is the
 * only file in the repository allowed to hold a colour value; a `tint` here is
 * a name that resolves to a token in the stylesheet, never a hex.
 *
 * Five hues for five rows, and hue here carries no semantic load whatsoever —
 * it is identity, so that a bar, its section heading and its jump link are
 * obviously the same thing. That is a deliberate departure from the system rule
 * reserving colour for meaning, taken because a five-row chart drawn in one
 * grey is exactly the chart this page just replaced.
 */
export const PhaseTintSchema = z.enum(['amber', 'sage', 'sky', 'lilac', 'clay']);
export type PhaseTint = z.infer<typeof PhaseTintSchema>;

/**
 * One row of the chart, and one section below it. There is no level beneath
 * this: a phase has no sub-steps, because sub-steps are what made the previous
 * chart unreadable.
 *
 * Positions are fractions of the whole journey, `0` to `1` — **not weeks**. The
 * axis is marked by milestones rather than dates, so the geometry expresses the
 * one thing it is actually for: *overlap*. "Get found" starting at 42% while
 * "Build the product" runs to 74% is the realisation the page exists to
 * produce, and no column-per-stage chart can state it.
 */
export const PhaseSchema = z
  .object({
    id: z.string().regex(/^P\d$/, 'Phase id must look like "P1"'),
    /** The row label, and the section heading. One name, used in both places. */
    name: z.string().min(1),
    /** One line under the name in the section — what this step is really about. */
    tagline: z.string().min(1),
    tint: PhaseTintSchema,
    start: z.number().min(0).max(1),
    /** null = open-ended: the bar dissolves rather than inventing an end. */
    end: z.number().min(0).max(1).nullable(),
    /** What it is, in two or three sentences. */
    summary: z.string().min(1),
    /** The trigger that starts it. Relative to another step, never a date. */
    starts_when: z.string().min(1),
    cost: CostBandSchema,
    /** What you deliberately do NOT do here. Only where there is a real answer. */
    not_in_it: z.array(z.string().min(1)).optional(),
    ambushes: z.array(AmbushSchema),
  })
  .refine((p) => p.end === null || p.end > p.start, {
    message: 'A phase that ends must end after it starts.',
  });
export type Phase = z.infer<typeof PhaseSchema>;

/* -------------------------------------------------------------------------- */
/* Setup — the flat list that is deliberately not on the chart                */
/* -------------------------------------------------------------------------- */

/**
 * The admin. Off the chart entirely (A17), because none of it is work in any
 * sense the chart means: a domain purchase takes ten minutes and a carrier
 * registration takes three weeks of *waiting*, and putting either on a timeline
 * next to "build the product" implied they were comparable efforts.
 *
 * `wait_low`/`wait_high` are the only week numbers left anywhere on the page,
 * and that is the point. Both null means "as long as it takes you", which for
 * these items is minutes. Both set means a **queue** — somebody else's,
 * uncompressible, and running in parallel with the build if and only if it is
 * started early. That single fact is the most expensive thing a first-time
 * founder does not know.
 */
export const SetupItemSchema = z
  .object({
    id: z.string().regex(/^S\d$/, 'Setup item id must look like "S1"'),
    label: z.string().min(1),
    detail: z.string().min(1),
    /** When to start it — a trigger, never a date. */
    when: z.string().min(1),
    cost: CostBandSchema,
    /** Set as a pair, and only for a queue somebody else controls. */
    wait_low: z.number().int().positive().nullable(),
    wait_high: z.number().int().positive().nullable(),
    ambushes: z.array(AmbushSchema),
  })
  .refine(
    (s) =>
      (s.wait_low === null) === (s.wait_high === null) &&
      (s.wait_high === null || s.wait_low === null || s.wait_high >= s.wait_low),
    {
      message:
        'A wait is a pair or it is nothing, and it cannot end before it starts. Half a range is ' +
        'a number nobody can act on.',
    },
  );
export type SetupItem = z.infer<typeof SetupItemSchema>;

/* -------------------------------------------------------------------------- */
/* Milestones — which are also the chart's axis                               */
/* -------------------------------------------------------------------------- */

/**
 * A milestone is defined by an outcome that **cannot be faked** — "a clinic
 * used it twice without you in the room", not "week six". You cannot convince
 * yourself you have reached one when you haven't, which is the entire point of
 * milestoning the work whose duration you can't honestly estimate.
 *
 * **In A17 these became the chart's x-axis.** A chart with no reference at all
 * was unreadable, and a month scale would have promised dates this product
 * refuses to promise. Marking the axis with the five unfakeable proof points
 * gives the reader somewhere to stand without inventing a calendar: horizontal
 * position means *progress*, and progress is measured in things that happened.
 */
export const MilestoneSchema = z.object({
  id: z.string().regex(/^M\d{2}$/, 'Milestone id must look like "M01"'),
  /** Fraction of the journey, matching `Phase.start` / `Phase.end`. */
  at: z.number().min(0).max(1),
  label: z.string().min(1),
  /** Why it can't be faked. */
  proof: z.string().min(1),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

/* -------------------------------------------------------------------------- */
/* Money                                                                      */
/* -------------------------------------------------------------------------- */

/** The legend is the only place on the page permitted to name real money. */
export const CostLegendEntrySchema = z.object({
  band: CostBandSchema,
  meaning: z.string().min(1),
});

export const CostItemSchema = z.object({
  label: z.string().min(1),
  band: CostBandSchema,
  /** When this starts costing anything. */
  when: z.string().min(1),
});
export type CostItem = z.infer<typeof CostItemSchema>;

export const MoneySchema = z
  .object({
    legend: z.array(CostLegendEntrySchema).min(1),
    items: z.array(CostItemSchema).min(1),
    /** The one sentence that reframes the whole block. */
    headline: z.string().min(1),
    /** Free credits, and the caveat that makes them useful rather than wasted. */
    credits: z.string().min(1),
    /**
     * Arithmetic that IS the insight. Bands replaced prices everywhere, but a
     * calculation whose *number* is the point survives — "42 practices is
     * $100,000 a year" changes a pricing decision in a way no band can.
     */
    calibration: z.string().min(1),
  })
  .refine(
    (m) => {
      const defined = new Set(m.legend.map((e) => e.band));
      return m.items.every((i) => defined.has(i.band));
    },
    {
      message:
        'Every band used by a cost item must be defined in the legend. An undefined band is a ' +
        'glyph with no meaning.',
    },
  );
export type Money = z.infer<typeof MoneySchema>;

/* -------------------------------------------------------------------------- */
/* Tripwires                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Where "no verdict" lives. Never "your idea is risky" — always "if this comes
 * back false, here is the *different* plan". A tripwire names a condition and
 * the consequence for the work, and nothing else.
 *
 * `questions` is **modelled but not rendered** after A17. A tripwire genuinely
 * is the failure mode of a specific open question, the refinement below keeps
 * the reference honest, and a real backend will need the edge — but the chips
 * that used to print it were four more tokens on the densest panel of the
 * densest page, bought nothing a reader acts on, and went.
 */
export const TripwireSchema = z.object({
  id: z.string().regex(/^W\d{2}$/, 'Tripwire id must look like "W01"'),
  condition: z.string().min(1),
  consequence: z.string().min(1),
  questions: z.array(z.string().regex(/^Q\d+$/)),
});
export type Tripwire = z.infer<typeof TripwireSchema>;

/* -------------------------------------------------------------------------- */
/* The roadmap                                                                */
/* -------------------------------------------------------------------------- */

/** Five rows, and the chart is unreadable again at seven. */
export const MAX_PHASES = 6;

export const RoadmapSchema = z
  .object({
    open_questions: z.array(OpenQuestionSchema).min(1),
    phases: z.array(PhaseSchema).min(1).max(MAX_PHASES),
    setup: z.array(SetupItemSchema).min(1),
    milestones: z.array(MilestoneSchema).min(1),
    money: MoneySchema,
    tripwires: z.array(TripwireSchema).min(1),
  })
  .refine((v) => new Set(v.phases.map((p) => p.id)).size === v.phases.length, {
    message: 'Phase ids must be unique.',
  })
  .refine((v) => new Set(v.phases.map((p) => p.tint)).size === v.phases.length, {
    message:
      'Two phases sharing a tint defeats the only job the tint has — telling the reader that a ' +
      'bar and a section are the same step.',
  })
  .refine((v) => new Set(v.setup.map((s) => s.id)).size === v.setup.length, {
    message: 'Setup item ids must be unique.',
  })
  .refine((v) => new Set(v.milestones.map((m) => m.id)).size === v.milestones.length, {
    message: 'Milestone ids must be unique.',
  })
  .refine(
    (v) => {
      const starts = v.phases.map((p) => p.start);
      return starts.every((start, i) => i === 0 || start >= starts[i - 1]);
    },
    {
      message:
        'Phases must be authored in the order they start. The chart draws them top to bottom in ' +
        'array order, and a row that starts earlier than the row above it reads as a mistake.',
    },
  )
  .refine(
    (v) => {
      const ids = [...v.phases, ...v.setup].flatMap((owner) => owner.ambushes.map((a) => a.id));
      return new Set(ids).size === ids.length;
    },
    { message: 'Ambush ids must be unique across the whole roadmap.' },
  )
  .refine(
    (v) => {
      const qs = new Set(v.open_questions.map((q) => q.id));
      return v.tripwires.every((t) => t.questions.every((q) => qs.has(q)));
    },
    { message: 'Every referenced open question id must exist.' },
  )
  .refine(
    (v) => {
      const ats = v.milestones.map((m) => m.at);
      return ats.every((at, i) => i === 0 || at > ats[i - 1]);
    },
    { message: 'Milestones must be authored in ascending journey order.' },
  )
  .refine(
    (v) => {
      const universal = [...v.phases, ...v.setup]
        .flatMap((owner) => owner.ambushes)
        .filter((a) => a.source === 'universal').length;
      return universal <= MAX_UNIVERSAL_AMBUSHES;
    },
    {
      message: `At most ${MAX_UNIVERSAL_AMBUSHES} ambushes may be \`universal\`. They are the ones that read as generic, because they are — the cap is the rule that keeps this page off the listicle path.`,
    },
  )
  .refine(
    (v) => {
      /* Not every phase carries an ambush, and that is the point: a per-phase
         quota is exactly the mechanism that manufactures filler for the steps
         with no real surprises. What the schema does enforce is that the budget
         is spent somewhere. */
      const total = [...v.phases, ...v.setup].reduce((n, o) => n + o.ambushes.length, 0);
      return total > 0;
    },
    { message: 'A roadmap with no ambushes is missing the most useful thing on the page.' },
  );
export type Roadmap = z.infer<typeof RoadmapSchema>;

/* -------------------------------------------------------------------------- */
/* Derived relations                                                          */
/* -------------------------------------------------------------------------- */

/** The reverse of `Tripwire.questions`. */
export function tripwiresForQuestion(roadmap: Roadmap, questionId: string): Tripwire[] {
  return roadmap.tripwires.filter((tripwire) => tripwire.questions.includes(questionId));
}
