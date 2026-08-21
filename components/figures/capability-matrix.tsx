import type { MatrixModel } from '@/lib/analytics/report-figures';
import { REPORT } from '@/lib/content/app';
import { CAPABILITY_LABEL, type CapabilityLevel } from '@/lib/schemas/report';
import { FIG_H, Figure } from './figure';

/**
 * competitors × capabilities.
 *
 * **Renders a real `<table>`** — one of the two sanctioned exceptions to the
 * `role="img"` rule. Three competitors plus an idea column across five
 * capabilities compressed into one aria-label sentence is unusable, and a
 * matrix is genuinely tabular data.
 *
 * Cell marks carry no hue: `yes` is a filled square, `partial` a half-filled
 * one, `no` an empty outlined one, and `unknown` **an em-dash with no box and
 * no hatch** — *we didn't find out* is a real answer and dressing it as a mark
 * would make it look like a finding. Every cell also prints the word.
 *
 * **The fourth column is in a different register on purpose**, and that
 * register split is the only thing standing between this figure and a verdict.
 * `THIS IDEA` carries a `NOT EVIDENCE` chip, its cells read `CLAIMED` or `—`
 * with **no square mark at all**, and the line beneath says so. An idea column
 * drawn in the same marks as the competitors is a comparison chart that says
 * *we win* from a column with no evidence behind it. **Do not simplify it back
 * into a fourth row of marks.**
 *
 * Not blue.
 */
const CELL_CLASS: Record<CapabilityLevel, string> = {
  yes: 'ob-cell-yes',
  partial: 'ob-cell-partial',
  no: 'ob-cell-no',
  unknown: 'ob-cell-unknown',
};

const CELL_WORD: Record<CapabilityLevel, string> = {
  yes: 'YES',
  partial: 'PARTIAL',
  no: 'NO',
  unknown: '—',
};

export function CapabilityMatrix({
  model,
  citations,
  caption = 'WHAT EACH ONE ACTUALLY DOES',
}: {
  model: MatrixModel;
  citations: number[];
  caption?: string;
}) {
  return (
    <Figure
      caption={caption}
      height={FIG_H.matrix}
      citations={citations}
      note={REPORT.figures.capabilityNote}
    >
      <table className="ob-matrix">
        <caption className="sr-only">
          What each competing product does, by capability, with the idea&rsquo;s own claims in the
          final column. Every filled cell cites a finding; unknown cells cite nothing because
          nothing was found.
        </caption>
        <thead>
          <tr className="ob-matrix-head">
            <th scope="col">Capability</th>
            {model.competitors.map((c) => (
              <th key={c.name} scope="col">
                {c.name}
              </th>
            ))}
            <th scope="col" className="ob-matrix-idea">
              THIS IDEA
              <span className="ob-chip">NOT EVIDENCE</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {model.capabilities.map((key, rowIndex) => (
            <tr key={key}>
              <th scope="row">{CAPABILITY_LABEL[key]}</th>
              {model.competitors.map((competitor) => {
                const cell = competitor.cells[rowIndex];
                return (
                  <td key={competitor.name} className="ob-matrix-cell">
                    <span className={CELL_CLASS[cell.level]} aria-hidden="true" />
                    <span className="ob-meta">{CELL_WORD[cell.level]}</span>
                  </td>
                );
              })}
              <td className="ob-matrix-cell ob-matrix-idea">
                <span className="ob-matrix-idea-cell ob-meta">
                  {model.idea[rowIndex].claimed ? 'CLAIMED' : '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  );
}
