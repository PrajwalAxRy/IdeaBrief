import {
  ROADMAP_AXIS,
  ROADMAP_PHASES,
  type StagePreview as StagePreviewData,
} from '@/lib/content/trial3';

const TOTAL_WEEKS = 18;

/**
 * The locked peek at Validate or Roadmap, shown in the centre column while the
 * two rails stay put — so the stage rail reads as a view switch rather than a
 * page jump, and you never lose the conversation you were in.
 *
 * **Drawn in code, never screenshotted** — rule 8, and the one most likely to
 * be broken. Real fixture numbers where there are any; hairline bars where the
 * prose will be. That combination is what makes it read as a preview of a
 * thing that exists rather than as a page that failed to load, and it is why
 * there is no blur and no scrim over it: obscuring a mock to say "locked"
 * removes the only information the mock was carrying.
 *
 * **There is no accent anywhere in this panel until `queued` is true.**
 * Nothing here is an action, a verification, or a live state — it is a
 * description of work not yet done, and that absence is what makes the live
 * dot on Define, three inches above, mean something. Approving the brief is
 * the one thing that changes it: the run moves onto this stage, so the panel
 * earns a live dot in the same instant the stage rail's does.
 */
export function StagePreview({
  preview,
  queued = false,
  onBack,
}: {
  preview: StagePreviewData;
  queued?: boolean;
  onBack: () => void;
}) {
  return (
    <div className="au-ws-preview">
      <p className="au-eyebrow au-meta">{preview.stage} · Preview</p>

      <h2 className="au-h2 mt-5">{preview.title}</h2>
      <p className="au-body mt-3" style={{ maxWidth: 'var(--au-measure)' }}>
        {preview.blurb}
      </p>

      <section className="au-frag mt-8">
        <header className="au-frag-bar">
          <span className="au-meta au-meta-sm">
            {preview.stage === 'validate' ? 'Report · sv_4f2a' : 'Plan · sv_4f2a'}
          </span>
          {queued ? (
            <span className="au-chip au-chip-verified">
              <span className="au-dot" aria-hidden="true" />
              Queued
            </span>
          ) : (
            <span className="au-chip">Not yet run</span>
          )}
        </header>

        <div className="au-frag-body">
          <div className="flex gap-12">
            {preview.stats.map((stat) => (
              <div key={stat.label}>
                <p className="au-fig au-fig-sm">{stat.value}</p>
                <p className="au-meta au-meta-xs mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7">
            {preview.stage === 'validate' ? <FindingRows /> : <PhaseRows />}
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between gap-6">
        <p className="au-meta au-meta-sm">
          {queued ? 'Research queued · starts in a moment' : preview.gate}
        </p>
        <button type="button" className="au-btn au-btn-ghost" data-back="true" onClick={onBack}>
          <span className="au-arrow" aria-hidden="true">
            ←
          </span>
          Back to Define
        </button>
      </div>
    </div>
  );
}

/** Three findings' worth of structure: a citation slot, two lines, a source. */
function FindingRows() {
  const widths = [
    ['92%', '61%'],
    ['84%', '47%'],
    ['96%', '72%'],
  ];

  return (
    <div>
      {widths.map((lines, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative skeleton
        <div className="au-frag-row" key={index}>
          <span className="au-chip">{`[${index + 1}]`}</span>
          <div className="flex-1">
            {lines.map((width) => (
              <span
                key={width}
                className="au-bar"
                style={{ display: 'block', width, marginBottom: '9px' }}
              />
            ))}
            <span className="au-meta au-meta-xs">2 sources</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Five phases against the milestone axis the shipped roadmap uses. */
function PhaseRows() {
  return (
    <div>
      {ROADMAP_PHASES.map((phase) => {
        const [from, to] = phase.weeks;
        return (
          <div className="au-ws-phase" key={phase.id}>
            <span className="au-meta au-meta-sm">{phase.id}</span>

            <span className="relative block h-2">
              <span
                className="au-bar"
                style={{
                  position: 'absolute',
                  left: `${(from / TOTAL_WEEKS) * 100}%`,
                  width: `${((to - from) / TOTAL_WEEKS) * 100}%`,
                }}
              />
            </span>

            <span className="au-xs" style={{ color: 'var(--au-muted)' }}>
              {phase.label}
            </span>
          </div>
        );
      })}

      <div className="au-ws-axis mt-3">
        {ROADMAP_AXIS.map((mark) => (
          <span className="au-meta au-meta-xs" key={mark}>
            {mark}
          </span>
        ))}
      </div>
    </div>
  );
}
