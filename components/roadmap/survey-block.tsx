import { ROADMAP, buildScriptText } from '@/lib/content/app';
import type { OpenQuestion } from '@/lib/schemas/roadmap';
import { ScriptBlock } from './script-block';

type Survey = NonNullable<OpenQuestion['survey']>;

/**
 * `THE SURVEY` — specified in the blueprint, cut during the first build as a
 * sanctioned scope reduction, reinstated here (D3).
 *
 * **Each question carries its answer set**, on the line beneath it: a survey
 * row without its options is not a survey, it is a question. The options are
 * data on the fixture, not a string in this file.
 *
 * The standing line beneath it is the point of the whole block — a survey run
 * before the interviews counts the wrong things.
 */
export function SurveyBlock({ survey }: { survey: Survey }) {
  return (
    <>
      <ScriptBlock
        lines={survey.questions.map((question) => (
          <span key={question.text}>
            {question.text}
            <span className="ob-script-opts">{question.options}</span>
          </span>
        ))}
        copyText={buildScriptText(survey.questions.map((question) => question.text))}
        copyLabel={ROADMAP.copySurvey}
      />
      <p className="ob-survey-note">{survey.note}</p>
      <p className="ob-survey-note ob-survey-standing">{ROADMAP.surveyStanding}</p>
    </>
  );
}
