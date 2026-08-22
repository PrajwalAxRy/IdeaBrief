import {
  FRAGMENT_CONVERSATION,
  FRAGMENT_ROADMAP,
  type PillarFragment,
} from '@/lib/content/landing';

/**
 * Product fragments — real UI surfaces rendered in the marketing page rather
 * than screenshots of them. Each pillar shows the artefact it produces, so the
 * claim and the proof are the same object.
 *
 * These are static and presentational, so they stay server components.
 */
export function Fragment({ kind }: { kind: PillarFragment }) {
  if (kind === 'conversation') return <BriefFragment />;
  /* `'evidence'` never arrives here: `Pillars` routes pillar 02 to
     `ValidateSession`, which supersedes the static evidence list. */
  return <RoadmapFragment />;
}

function FragHead({ title, status }: { title: string; status: string }) {
  return (
    <div className="ob-frag-bar">
      <span className="ob-meta ob-meta-bright">{title}</span>
      <span className="ob-meta">{status}</span>
    </div>
  );
}

/** Pillar 01 — the approved idea brief, unknowns left visibly unknown. */
function BriefFragment() {
  return (
    <div className="ob-frag">
      <FragHead title={FRAGMENT_CONVERSATION.title} status={FRAGMENT_CONVERSATION.status} />
      <div className="ob-frag-body">
        {FRAGMENT_CONVERSATION.rows.map((row) => (
          <div className="ob-frag-row" key={row.key}>
            <span className="ob-frag-key ob-meta">{row.key}</span>
            {'unknown' in row && row.unknown ? (
              <span className="ob-chip">{row.value}</span>
            ) : (
              <span className="ob-body ob-body-bright text-[15px] leading-snug">{row.value}</span>
            )}
          </div>
        ))}
        <p className="ob-meta mt-5">{FRAGMENT_CONVERSATION.footnote}</p>
      </div>
    </div>
  );
}

/** Pillar 03 — one open question with its script written out. */
function RoadmapFragment() {
  return (
    <div className="ob-frag">
      <FragHead title={FRAGMENT_ROADMAP.title} status={FRAGMENT_ROADMAP.status} />
      <div className="ob-frag-body">
        <p className="ob-h3">{FRAGMENT_ROADMAP.question}</p>
        <p className="ob-body mt-4 text-[15px]">{FRAGMENT_ROADMAP.matters}</p>

        <p className="ob-meta mt-7">The script</p>
        <ol className="mt-3 flex flex-col gap-2">
          {FRAGMENT_ROADMAP.script.map((line, i) => (
            <li className="flex gap-3" key={line}>
              <span className="ob-meta pt-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="ob-body ob-body-bright text-[15px] leading-snug">{line}</span>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap gap-2">
          {FRAGMENT_ROADMAP.meta.map((item) => (
            <span className="ob-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
