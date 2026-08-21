import DefineLoading from '@/app/r/[slug]/define/loading';
import RoadmapLoading from '@/app/r/[slug]/roadmap/loading';
import SourcesLoading from '@/app/r/[slug]/sources/loading';
import ValidateLoading from '@/app/r/[slug]/validate/loading';
import { Row, Section } from '@/components/style-guide/section';
import { EmptyNote } from '@/components/ui/empty-note';
import { ThinEvidenceNotice } from '@/components/validate/report/thin-evidence-notice';
import { SOURCES, SUPPORTING } from '@/lib/content/app';
import Link from 'next/link';

/**
 * **The durable home for the states that are otherwise almost impossible to
 * look at.** The fixtures resolve synchronously, so all four route-level
 * Suspense fallbacks essentially never paint; measuring them means temporarily
 * throttling a `page.tsx`, which is a change you then have to remember to
 * revert. This section imports the four `loading.tsx` default exports and
 * renders them for real, so the skeletons survive the session that built them.
 *
 * The five error surfaces are reproduced rather than imported: two of them are
 * error boundaries whose props are an `Error` and a `retry` callback, and a
 * boundary rendered with a fabricated error is a specimen of the fabrication.
 * What is shown here is the panel and the standalone body — the parts that
 * carry the design — with the real copy from `SUPPORTING`.
 *
 * Every skeleton on this page is static. If anything in `#states` reports an
 * `animationName` other than `none`, a shimmer has come back.
 */
function ErrorPanel({
  copy,
}: { copy: { title: string; body: string; retry: string; back: string } }) {
  return (
    <div className="ob-error-panel">
      <p className="ob-error-title">{copy.title}</p>
      <p>{copy.body}</p>
      <div className="ob-error-actions">
        <span className="ob-btn ob-btn-primary">{copy.retry}</span>
        <span className="ob-btn-bare">{copy.back}</span>
      </div>
    </div>
  );
}

function StandaloneBody({
  eyebrow,
  headline,
  level,
  body,
  action,
}: {
  eyebrow: string;
  headline: string;
  level: 'ob-h1' | 'ob-h2';
  body: string[];
  action: string;
}) {
  return (
    <div className="w-full">
      <p className="ob-eyebrow ob-meta">
        <span>{eyebrow}</span>
      </p>
      <h3 className={`${level} ob-standalone-head-line mt-7`}>{headline}</h3>
      <div className="ob-standalone-copy mt-7">
        {body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="ob-standalone-actions">
        <span className="ob-btn ob-btn-primary">
          {action}
          <span className="ob-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </div>
  );
}

export function StatesSection({ slug }: { slug: string }) {
  return (
    <Section
      id="states"
      title="States"
      note="Loading, empty and error. No illustrated empty states, no toasts, no spinners on a route transition, and no skeleton anywhere that moves — a shimmer is neither ambient (20–50s) nor structural (150–900ms), and it claims work is happening on a block that is only waiting."
    >
      <Row title="Empty note">
        <EmptyNote
          action={
            <Link href={`/r/${slug}/sources`} className="ob-btn-bare">
              {SOURCES.empty.clear}
            </Link>
          }
        >
          {SOURCES.empty.headline}
        </EmptyNote>
      </Row>

      <Row title="Thin evidence notice">
        <ThinEvidenceNotice slug={slug} />
      </Row>

      <Row title="Error — invalid run (outside the shell, --ob-h1)">
        <StandaloneBody
          eyebrow={SUPPORTING.notFoundRun.eyebrow}
          headline={SUPPORTING.notFoundRun.headline}
          level="ob-h1"
          body={[...SUPPORTING.notFoundRun.body]}
          action={SUPPORTING.notFoundRun.action}
        />
      </Row>

      <Row title="Error — root 404 (--ob-h2)">
        <StandaloneBody
          eyebrow={SUPPORTING.notFound.eyebrow}
          headline={SUPPORTING.notFound.headline}
          level="ob-h2"
          body={[SUPPORTING.notFound.body]}
          action={SUPPORTING.notFound.action}
        />
      </Row>

      <Row title="Error — root boundary (--ob-h2)">
        <StandaloneBody
          eyebrow={SUPPORTING.error.eyebrow}
          headline={SUPPORTING.error.headline}
          level="ob-h2"
          body={[SUPPORTING.error.body, SUPPORTING.error.slugBody]}
          action={SUPPORTING.error.retry}
        />
      </Row>

      <Row title="Error — roadmap segment boundary">
        <ErrorPanel copy={SUPPORTING.roadmapError} />
      </Row>

      <Row title="Error — sources segment boundary">
        <ErrorPanel copy={SUPPORTING.sourcesError} />
      </Row>

      <Row title="Error — failed send, with the typed text preserved">
        <div className="ob-send-error w-full max-w-[560px]">
          <p>{SUPPORTING.sendFailed.line}</p>
          <span className="ob-btn-bare">{SUPPORTING.sendFailed.retry}</span>
        </div>
      </Row>

      {/* The four fallbacks, each in a bordered frame so the page's own rules
          are never mistaken for the skeleton's.

          **No `overflow-hidden` on these frames.** An `overflow` other than
          `visible` on any ancestor silently kills `position: sticky` inside it
          (pitfalls §5), and three of these skeletons carry a sticky element —
          the report's section index, the roadmap's segmented control and the
          explorer's facet rail. A gallery that quietly disables the one
          property those elements are defined by is a gallery that lies.

          Define is the exception and is height-bounded on purpose: its real
          geometry is `calc(100vh - header)` with `overflow: hidden`, so the
          frame reproduces the page rather than fighting it. */}
      <Row title="Loading — Define (12 fields, the real composer frame)">
        <div className="ob-card w-full overflow-hidden" style={{ height: 620 }}>
          <DefineLoading />
        </div>
      </Row>

      <Row title="Loading — Validate (Mode B's shape, never Mode A's)">
        <div className="ob-card w-full">
          <ValidateLoading />
        </div>
      </Row>

      <Row title="Loading — Roadmap (4 lanes, tripwire off the axis)">
        <div className="ob-card w-full">
          <RoadmapLoading />
        </div>
      </Row>

      <Row title="Loading — Sources (six real legends, rows at --ob-src-row-h)">
        <div className="ob-card w-full">
          <SourcesLoading />
        </div>
      </Row>
    </Section>
  );
}
