import { CitationChip } from '@/components/validate/evidence/citation-chip';
import { ROADMAP } from '@/lib/content/app';
import type { Ambush } from '@/lib/schemas/roadmap';

/**
 * One thing the reader will hit and is not expecting.
 *
 * The species tag is not decoration — it is what makes these generative rather
 * than a vibe. Asking five fixed questions of one idea (what has a lead time
 * nobody sees, what is free until a threshold, what do you permanently owe from
 * the first customer, what signal arrives later than you think, what early
 * success will you wrongly extrapolate from) produces specific ambushes; asking
 * "what would surprise them" produces a listicle.
 *
 * **The chip is the tell.** Only an ambush that came out of the research run
 * carries one, and the schema makes the other combination unrepresentable. On
 * this run exactly two do, because the `PRACTICAL` dimension came back thin —
 * that is the honest number, and a page where every ambush cited would be
 * claiming research it never did.
 */
export function AmbushLine({ ambush }: { ambush: Ambush }) {
  return (
    <li className="ob-ambush" data-source={ambush.source}>
      <p className="ob-ambush-tag ob-meta">{ROADMAP.ambushSpecies[ambush.species]}</p>
      <p className="ob-ambush-text">
        {ambush.text}
        {ambush.citation_id !== undefined && (
          <>
            {' '}
            <CitationChip n={ambush.citation_id} />
          </>
        )}
      </p>
    </li>
  );
}
