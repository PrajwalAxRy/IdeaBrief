import { STANCE_LABEL, type Stance } from '@/lib/schemas/evidence';

/**
 * Whether a finding supports, is neutral on, or contests the idea.
 *
 * **Stance is expressed by fill treatment, never by hue.** The three fills —
 * `.ob-stance-supports` / `-neutral` / `-contests` — are A3's, defined once in
 * §4 with the one hatch geometry; this component declares none of them and no
 * second weave. §6 owns only the inline box and its row.
 *
 * **The word always accompanies the mark; the mark is never mute.**
 * `withLabel={false}` emits the word `sr-only` — it does not omit it — because
 * a bare square that means "contests" is a square that means nothing.
 *
 * **There is no red.** A contesting finding is not an error; it is the reason
 * the report is worth reading. Its word lifts to `--ob-muted` so the one
 * counter-signal on a card is never its dimmest element.
 *
 * The words come from `STANCE_LABEL` in `lib/schemas/evidence.ts` (C3) —
 * `challenges → 'Contests'`. The schema enum stays `challenges`; there is no
 * inline map here and no `stanceWords` entry in `lib/content/app.ts`.
 */
export function StanceMark({ stance, withLabel = true }: { stance: Stance; withLabel?: boolean }) {
  const fill = stance === 'challenges' ? 'contests' : stance;

  return (
    <span className="ob-stance-row" data-stance={stance}>
      <span className={`ob-stance-mark ob-stance-${fill}`} aria-hidden="true" />
      <span className={withLabel ? 'ob-stance-word' : 'sr-only'}>{STANCE_LABEL[stance]}</span>
    </span>
  );
}
