import { BackLink } from '@/components/layout/back-link';
import { PageContainer } from '@/components/layout/page-container';
import { ProseColumn } from '@/components/layout/prose-column';
import { SegmentedControl } from '@/components/layout/segmented-control';
import { StageRail } from '@/components/layout/stage-rail';
import type { RunSegment } from '@/lib/run-stage';
import type { RunStatus } from '@/lib/schemas/run';
import { Row, Section } from '../section';

/* `StageRail` now derives its own states from status + route + local progress
   (D19), so the gallery drives it by those inputs rather than by a states
   object. Off a run route `useSelectedLayoutSegment` is irrelevant — `segment`
   is a prop, so each row is a real derivation, not a mock. */
const STAGE_VARIANTS: { label: string; status: RunStatus; segment: RunSegment }[] = [
  { label: 'On Define', status: 'define', segment: 'define' },
  { label: 'On Validate', status: 'validating', segment: 'validate' },
  { label: 'On Roadmap', status: 'complete', segment: 'roadmap' },
  { label: 'On Sources', status: 'complete', segment: 'sources' },
];

const CONTAINERS = [
  { variant: 'app', note: 'variant="app" — 1360px, content box 1280' },
  { variant: 'report', note: 'variant="report" — 1080px, content box 1000' },
  { variant: 'marketing', note: 'variant="marketing" — 1200px, content box 1120' },
] as const;

export function LayoutSection() {
  return (
    <Section
      id="layout"
      title="Layout"
      note="RunShell, RunFooterBar, and CopyLinkButton are excluded — all three render an async Server Component (CopyLinkButton reads the request's host header via next/headers), which needs the request pipeline this reference page doesn't set up. See them in the real app instead. LandingNav and FooterPanel were deleted in A2, superseded by components/landing/site-nav.tsx and site-footer.tsx — see them on `/`."
    >
      <Row title="BackLink">
        <BackLink href="#">Back to sources</BackLink>
      </Row>

      <Row title="StageRail">
        <div className="flex flex-col gap-4">
          {STAGE_VARIANTS.map((variant) => (
            <div key={variant.label} className="flex items-center gap-4">
              <code className="ob-meta w-28 shrink-0">{variant.label}</code>
              <StageRail
                slug="sms-rebooking-4f2a"
                status={variant.status}
                segment={variant.segment}
              />
            </div>
          ))}
        </div>
      </Row>

      <Row title="SegmentedControl">
        <SegmentedControl
          items={[
            { id: 'ui-atoms', label: 'UI Atoms' },
            { id: 'layout', label: 'Layout' },
            { id: 'roadmap', label: 'Roadmap' },
          ]}
        />
      </Row>

      <Row title="PageContainer — three widths">
        <div className="flex w-full flex-col gap-4">
          {CONTAINERS.map((entry) => (
            <PageContainer key={entry.variant} variant={entry.variant} className="ob-card">
              <p className="ob-meta py-2">{entry.note}</p>
            </PageContainer>
          ))}
        </div>
      </Row>

      <Row title="ProseColumn">
        <ProseColumn className="ob-card">
          <p className="py-2">
            Constrained to <code>--ob-report-prose</code> (580px) — the report&rsquo;s own measure,
            not 68ch.
          </p>
        </ProseColumn>
      </Row>
    </Section>
  );
}
