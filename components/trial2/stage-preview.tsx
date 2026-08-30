import { PREVIEWS, ROADMAP_FRAGMENT, VALIDATE_FRAGMENT } from '@/lib/content/trial2';

/**
 * What Validate and Roadmap look like from Define: the real artifact drawn in
 * code, dimmed and inert, under the one display-scale line on the screen.
 *
 * A screenshot of the finished page would have been the wrong answer twice — it
 * ages the moment either page changes, and it cannot show a locked state. The
 * fragment is dimmed rather than scrimmed so the lock survives a screenshot.
 *
 * Server component. The shell renders one of these instead of the transcript;
 * neither ever enters the client bundle.
 */
export function StagePreview({ stage }: { stage: 'validate' | 'roadmap' }) {
  const copy = PREVIEWS[stage];

  return (
    <div className="ad-scroll">
      <div className="ad-preview ad-enter" key={stage}>
        <div className="ad-preview-head">
          <span className="ad-meta">{copy.eyebrow}</span>
          {/* The screen's one display-scale line. An app shell has no hero to
              spend it on, and a near-empty locked column is exactly where a 92px
              line reads as intent rather than as a font-size slider. */}
          <h1 className="ad-display" style={{ marginTop: 14 }}>
            {copy.title}
          </h1>
          <p className="ad-lead" style={{ marginTop: 20 }}>
            {copy.lead}
          </p>
        </div>

        <div className="ad-preview-art">
          <div className="ad-preview-art-inner" aria-hidden="true">
            {stage === 'validate' ? <ValidateFragment /> : <RoadmapFragment />}
          </div>
        </div>

        <div className="ad-lockbar">
          <p className="ad-sm" style={{ color: 'var(--ad-body)', margin: 0 }}>
            {copy.lockNote}
          </p>
          <button type="button" className="ad-btn-link">
            {copy.lockAction}
            <span className="ad-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Findings and how much text on real pages supports each one. */
function ValidateFragment() {
  return (
    <div className="ad-fragment">
      {VALIDATE_FRAGMENT.map((finding) => (
        <div key={finding.id} className="ad-frag-row">
          <span className="ad-meta-sm" style={{ color: 'var(--ad-muted)', width: 44 }}>
            {finding.id}
          </span>
          <span className="ad-frag-title" style={{ flex: 1 }}>
            {finding.title}
          </span>
          <span className="ad-frag-bar" style={{ width: 92 }}>
            <span className="ad-frag-fill" style={{ width: `${finding.support}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Five phases against a milestone axis. */
function RoadmapFragment() {
  return (
    <div className="ad-fragment">
      {ROADMAP_FRAGMENT.map((phase) => (
        <div key={phase.id} className="ad-frag-axis">
          <span className="ad-frag-title">{phase.title}</span>
          <span className="ad-frag-track">
            <span
              className="ad-frag-phase"
              style={{ left: `${phase.start}%`, width: `${phase.width}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
