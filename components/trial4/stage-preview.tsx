import {
  type StagePreview as Preview,
  ROADMAP_AXIS,
  ROADMAP_PHASES,
  ROADMAP_WEEKS,
  VALIDATE_ROWS,
} from '@/lib/content/trial4';

type Props = {
  preview: Preview;
  /** The brief has been approved, so this stage is genuinely under way. */
  queued: boolean;
  onBack: () => void;
};

/**
 * What Validate and Roadmap will be, shown in place of the conversation while
 * the rails stay put.
 *
 * **The fragments are drawn in markup, not screenshotted** (rule 8), and the
 * prose inside them is withheld as hairline bars rather than invented. Real
 * structure with absent content reads as a preview; invented content would read
 * as a result, which is the one thing this product is not allowed to fake.
 *
 * The numbers are the fixture's real counts. The back link is a bare button —
 * the primary action on this screen belongs to the composer, and there is
 * exactly one primary per viewport.
 */
export function StagePreview({ preview, queued, onBack }: Props) {
  return (
    <div className="t4-scroll">
      <div className="t4-preview">
        <div className="ob-eyebrow">
          <span className="ob-meta">{queued ? 'Queued' : 'Preview'}</span>
        </div>

        <h1 className="ob-h2 mt-6">{preview.title}</h1>
        <p className="ob-lead mt-5 max-w-[56ch]">{preview.blurb}</p>

        <p className="ob-meta mt-4">
          {queued ? 'Research is starting — findings appear here' : preview.gate}
        </p>

        <div className="t4-stats mt-12">
          {preview.stats.map((stat) => (
            <div key={stat.label} className="t4-stat">
              <div className="t4-stat-num">{stat.value}</div>
              <div className="ob-meta mt-2.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="t4-frag mt-10">
          <div className="t4-frag-head">
            <span className="ob-meta">{preview.fragment}</span>
            <span className="ob-meta">Structure only</span>
          </div>

          <div className="t4-frag-body">
            {preview.stage === 'validate' ? <FindingsFragment /> : <PhasesFragment />}
          </div>
        </div>

        <button type="button" className="ob-btn ob-btn-bare mt-8" onClick={onBack}>
          <span className="t4-back-arrow" aria-hidden="true">
            ←
          </span>
          Back to the conversation
        </button>
      </div>
    </div>
  );
}

/** Four findings rows: a real id, a real stance, and a claim left unwritten. */
function FindingsFragment() {
  return (
    <div>
      {VALIDATE_ROWS.map((row) => (
        <div key={row.id} className="t4-fnd">
          <span className="ob-meta">{row.id}</span>

          <div className="t4-fnd-bars">
            {row.bars.map((width, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length shape, no identity
                key={index}
                className="t4-fnd-bar"
                style={{ width: `${width}%` }}
              />
            ))}
          </div>

          <span className="ob-chip">{row.stance}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Five phases positioned against the milestone axis they actually span.
 *
 * The gridlines and the labels are placed from the SAME fraction the bars are —
 * `index / (marks - 1)`, which is week 0/6/12/18 over an 18-week axis. Laying
 * the labels out with `space-between` instead is a quarter-label of drift at
 * every interior mark, and a figure whose axis does not line up with its bars
 * is worse than a figure with no axis at all.
 */
function PhasesFragment() {
  const marks = ROADMAP_AXIS.map((label, index) => ({
    label,
    percent: (index / (ROADMAP_AXIS.length - 1)) * 100,
    edge: index === 0 ? 'start' : index === ROADMAP_AXIS.length - 1 ? 'end' : undefined,
  }));

  return (
    <div className="t4-rm">
      <div className="t4-rm-rows">
        <div className="t4-rm-grid" aria-hidden="true">
          {marks.map((mark) => (
            <span
              key={mark.label}
              className="t4-rm-gridline"
              style={{ left: `${mark.percent}%` }}
            />
          ))}
        </div>

        {ROADMAP_PHASES.map((phase) => {
          const [from, to] = phase.weeks;

          return (
            <div key={phase.id} className="t4-rm-row">
              <span className="ob-sm t4-rm-name">{phase.label}</span>

              <div className="t4-rm-track">
                <span
                  className="t4-rm-bar"
                  style={{
                    left: `${(from / ROADMAP_WEEKS) * 100}%`,
                    width: `${((to - from) / ROADMAP_WEEKS) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="t4-rm-axis">
        {marks.map((mark) => (
          <span
            key={mark.label}
            className="ob-meta t4-rm-tick"
            data-edge={mark.edge}
            style={{ left: `${mark.percent}%` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  );
}
