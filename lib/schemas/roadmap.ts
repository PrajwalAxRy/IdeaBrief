import { z } from 'zod';

const FindThemItemSchema = z.object({
  type: z.enum(['link', 'count', 'text']),
  label: z.string().min(1),
  url: z.string().url().optional(),
  citation_id: z.number().int().positive().optional(),
});
export type FindThemItem = z.infer<typeof FindThemItemSchema>;

export const OpenQuestionSchema = z.object({
  /** "Q01" */
  id: z.string().regex(/^Q\d+$/, 'Open question id must look like "Q01"'),
  number: z.number().int().positive(),
  question: z.string().min(1),
  why_it_matters: z.string().min(1),
  ask: z.string().min(1),
  find_them: z.array(FindThemItemSchema).min(1),
  how_many: z.string().min(1),
  script: z.object({ lines: z.array(z.string().min(1)).min(1) }),
  what_you_learn: z.string().min(1),
  survey: z
    .object({ questions: z.array(z.string().min(1)).min(1), note: z.string().min(1) })
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

export const RoadmapStepSchema = z.object({
  phase: RoadmapPhaseSchema,
  description: z.string().min(1),
  cut_list: z.array(z.string().min(1)).optional(),
  estimate: z.string().optional(),
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
