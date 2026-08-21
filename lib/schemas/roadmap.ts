import { z } from 'zod';
import { BriefFieldKeySchema } from './brief';

/**
 * **There is no `url`.** A `link` item resolves its href from the finding its
 * `citation_id` names, so the URL and the citation can never disagree — an
 * authored URL alongside a citation is two sources for one fact. Zero `url`
 * fields exist in the fixture and none should be added.
 */
const FindThemItemSchema = z
  .object({
    type: z.enum(['link', 'count', 'text']),
    label: z.string().min(1),
    citation_id: z.number().int().positive().optional(),
  })
  .refine((item) => item.type !== 'link' || item.citation_id !== undefined, {
    message: 'A `link` find-them item must carry the citation_id it resolves its href from.',
  });
export type FindThemItem = z.infer<typeof FindThemItemSchema>;

/** One survey row: the question and the answer set it is asked with. */
const SurveyQuestionSchema = z.object({
  text: z.string().min(1),
  options: z.string().min(1),
});
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;

export const EffortSchema = z.enum(['hours', 'days', 'weeks']);
export type Effort = z.infer<typeof EffortSchema>;

export const OpenQuestionSchema = z.object({
  /** "Q01" */
  id: z.string().regex(/^Q\d+$/, 'Open question id must look like "Q01"'),
  number: z.number().int().positive(),
  /** A rank, not a tier — A11 sorts on it and does arithmetic with it. Sorting
   *  by fan-out descending with ties broken by this rank reproduces the card
   *  order, which is why `FanOutMeter` and the order agree with no second
   *  source of truth (C6). */
  priority: z.number().int().positive(),
  effort: EffortSchema,
  /** The brief field this question traces back to, or null. Three of six trace
   *  back, which is what makes D10's promotion visible without making it
   *  uniform. */
  brief_field: BriefFieldKeySchema.nullable(),
  question: z.string().min(1),
  why_it_matters: z.string().min(1),
  ask: z.string().min(1),
  find_them: z.array(FindThemItemSchema).min(1),
  how_many: z.string().min(1),
  script: z.object({ lines: z.array(z.string().min(1)).min(1) }),
  what_you_learn: z.string().min(1),
  survey: z
    .object({
      questions: z.array(SurveyQuestionSchema).min(1),
      sample_size: z.string().min(1),
      note: z.string().min(1),
    })
    .optional(),
});
export type OpenQuestion = z.infer<typeof OpenQuestionSchema>;

export const RoadmapPhaseSchema = z.enum([
  'BEFORE_YOU_BUILD',
  'FIRST_THING_TO_BUILD',
  'THEN',
  'LATER_AND_ONLY_IF',
  'WHAT_WOULD_CHANGE_THIS_PLAN',
]);
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;

/** Canonical display labels, exactly as named in the exec summary — shared by RoadmapStep's heading and DependencyChip's reverse "Changes:" link so the two can never drift apart. */
export const ROADMAP_PHASE_LABEL: Record<RoadmapPhase, string> = {
  BEFORE_YOU_BUILD: 'Before you build',
  FIRST_THING_TO_BUILD: 'First thing to build',
  THEN: 'Then',
  LATER_AND_ONLY_IF: 'Later, and only if',
  WHAT_WOULD_CHANGE_THIS_PLAN: 'What would change this plan',
};

/**
 * `build` sits on the week axis; `tripwire` does not. `isOnAxis` in
 * lib/run-plan.ts is the single place D13's "the tripwire is not a phase"
 * becomes code.
 */
export const RoadmapStepKindSchema = z.enum(['build', 'tripwire']);
export type RoadmapStepKind = z.infer<typeof RoadmapStepKindSchema>;

export const RoadmapStepSchema = z.object({
  /** "S01" — the stable key `PlanBar` and `DependencyChip` address. */
  id: z.string().regex(/^S\d{2}$/, 'Roadmap step id must look like "S01"'),
  phase: RoadmapPhaseSchema,
  kind: RoadmapStepKindSchema,
  description: z.string().min(1),
  cut_list: z.array(z.string().min(1)).optional(),
  /** `estimate` is DELETED. These two replace it — 'ongoing, demand-driven' is
   *  now `duration_weeks: null`, which is the same claim in a form a bar can
   *  draw. */
  start_week: z.number().int().positive().nullable(),
  /** null = open-ended. */
  duration_weeks: z.number().int().positive().nullable(),
  /** ["Q01", "Q03"] — every id here must exist in the roadmap's own open_questions. */
  dependencies: z.array(z.string().regex(/^Q\d+$/)),
});
export type RoadmapStep = z.infer<typeof RoadmapStepSchema>;

export const RoadmapSchema = z
  .object({
    open_questions: z.array(OpenQuestionSchema).min(1),
    steps: z.array(RoadmapStepSchema).min(1),
  })
  .refine(
    (value) => {
      const ids = new Set(value.open_questions.map((question) => question.id));
      return value.steps.every((step) => step.dependencies.every((dep) => ids.has(dep)));
    },
    { message: 'Every roadmap step dependency must reference an existing open question id.' },
  )
  .refine((value) => new Set(value.steps.map((s) => s.id)).size === value.steps.length, {
    message: 'Roadmap step ids must be unique.',
  })
  .refine(
    (value) => {
      const tripwires = value.steps.filter((s) => s.kind === 'tripwire');
      if (tripwires.length !== 1) return false;
      const [t] = tripwires;
      return t.start_week === null && t.duration_weeks === null;
    },
    {
      message:
        'Exactly one step is a tripwire, and it carries neither start_week nor duration_weeks — it is a tripwire, not a phase, and giving it a bar is the mistake D13 exists to undo.',
    },
  )
  .refine(
    (value) => {
      /* Note the asymmetry and keep it: a build step MUST have a start and MAY
         have a null duration, which is what makes S04's dissolving right edge
         legal instead of a schema violation. */
      let previous = 0;
      for (const step of value.steps) {
        if (step.kind !== 'build') continue;
        if (step.start_week === null) return false;
        if (step.start_week < previous) return false;
        previous = step.start_week;
      }
      return true;
    },
    {
      message:
        'Every build step needs a start_week, and start_week must be non-decreasing in array order.',
    },
  );
export type Roadmap = z.infer<typeof RoadmapSchema>;

/**
 * The reverse of `RoadmapStep.dependencies` — which steps a given open
 * question governs. Computed rather than stored, so the bidirectional link
 * (`DependencyChip` <-> the question card's `Changes:` link) can never drift
 * out of sync with the forward direction.
 */
export function stepsForQuestion(roadmap: Roadmap, questionId: string): RoadmapStep[] {
  return roadmap.steps.filter((step) => step.dependencies.includes(questionId));
}
