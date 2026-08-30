import type { Summary } from '@/lib/content/trial1';
import { Check } from 'lucide-react';

/**
 * Everything talked about so far, as a standing document rather than a recap.
 *
 * The pane is `--rl-paper`, which is the decision the whole panel hangs off:
 * paper is the only ground that leaves `--rl-linen` a full tier below it, so
 * every panel inside can be tinted and still clear the one-step rule. Had this
 * pane been canvas, its panels would have had to be paper-on-canvas and the
 * summary would read as a stack of cards rather than as one document.
 *
 * The coverage meter is the pane's single focal point and the only accent mark
 * in it. Notice what does *not* get accent: the captured rows, the decisions,
 * the section labels. If everything in a summary is marked, nothing is.
 */
export function SummaryPanel({ summary }: { summary: Summary }) {
  const { answered, total } = summary.coverage;
  const percent = Math.round((answered / total) * 100);

  return (
    <aside className="rl-pane rl-aside" aria-label="Summary so far">
      <div className="rl-aside__head">
        <h2 className="rl-h3">Summary</h2>
        <p className="rl-xs mt-1">Rewritten as you talk. Nothing here is inferred.</p>
      </div>

      <div className="rl-aside__body">
        <section className="rl-aside__section">
          <p className="rl-sm">{summary.statement}</p>
        </section>

        {/* Coverage. A figure numeral and a bar instead of "you're most of the
            way through" — the sentence version is a guess, this is a count. */}
        <section className="rl-aside__section">
          <div className="flex items-baseline justify-between gap-3">
            <span className="rl-meta">Brief coverage</span>
            <span className="rl-fig-sm">
              {answered}
              <span className="rl-meta">/{total}</span>
            </span>
          </div>
          {/* aria-hidden, and not a `role="progressbar"`. The "6/9" numeral
              directly above it is the same value in text, so exposing the bar
              too would make a screen reader read the count twice. The bar is
              the sighted-reader shorthand for a figure that is already there. */}
          <div className="rl-meter" aria-hidden="true">
            <div className="rl-meter__fill" style={{ width: `${percent}%` }} />
          </div>
        </section>

        <section className="rl-aside__section">
          <p className="rl-meta">Captured</p>
          <div className="rl-panel p-2">
            <ul className="flex flex-col gap-1">
              {summary.captured.map((row) => (
                <li key={row.label} className="rl-row">
                  <span className="rl-meta-sm shrink-0 w-[64px]">{row.label}</span>
                  <span className="rl-xs">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rl-aside__section">
          <p className="rl-meta">Settled</p>
          <ul className="flex flex-col gap-2">
            {summary.decided.map((item) => (
              <li key={item} className="flex gap-2">
                {/* Semantic green, not the accent — "this is agreed" is a
                    status, and the accent is not a status colour. */}
                <Check
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 mt-[3px]"
                  style={{ color: 'var(--rl-positive)' }}
                />
                <span className="rl-xs">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rl-aside__section">
          <div className="flex items-center justify-between gap-3">
            <p className="rl-meta">Still open</p>
            <span className="rl-chip rl-chip--caution">{summary.open.length} open</span>
          </div>

          {/* Bottom-border rows, not cards. The accordion lesson: boxing a
              three-item list doubles the border count for nothing. */}
          <div>
            {summary.open.map((item, index) => (
              <div key={item.question} className="rl-open">
                <span className="rl-open__index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="rl-sm">
                    <span className="rl-strong">{item.question}</span>
                  </p>
                  <p className="rl-xs mt-1">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The hand-off. Validate has no page in this trial, so this states the
            condition rather than offering a control that goes nowhere. */}
        <section className="rl-aside__section">
          <div className="rl-well p-3">
            <p className="rl-xs">
              <span className="rl-strong">Validate opens</span> once the brief has nothing
              load-bearing left open. Research runs against what is settled, not against a guess.
            </p>
          </div>
        </section>
      </div>
    </aside>
  );
}
