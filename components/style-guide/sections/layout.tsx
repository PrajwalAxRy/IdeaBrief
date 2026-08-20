import { BackLink } from '@/components/layout/back-link';
import { FooterPanel } from '@/components/layout/footer-panel';
import { LandingNav } from '@/components/layout/landing-nav';
import { PageContainer } from '@/components/layout/page-container';
import { ProseColumn } from '@/components/layout/prose-column';
import { SegmentedControl } from '@/components/layout/segmented-control';
import { StageRail } from '@/components/layout/stage-rail';
import type { StageStates } from '@/lib/run-stage';
import { Row, Section } from '../section';

const STAGE_VARIANTS: { label: string; stageStates: StageStates }[] = [
  { label: 'On Define', stageStates: { define: 'active', validate: 'locked', roadmap: 'locked' } },
  {
    label: 'On Validate',
    stageStates: { define: 'done', validate: 'active', roadmap: 'locked' },
  },
  { label: 'Complete', stageStates: { define: 'done', validate: 'done', roadmap: 'done' } },
];

export function LayoutSection() {
  return (
    <Section
      id="layout"
      title="Layout"
      note="RunShell, RunFooterBar, and CopyLinkButton are excluded — all three render an async Server Component (CopyLinkButton reads the request's host header via next/headers), which needs the request pipeline this reference page doesn't set up. See them in the real app instead."
    >
      <Row title="LandingNav">
        <div className="w-full border" style={{ borderColor: 'var(--border-subtle)' }}>
          <LandingNav />
        </div>
      </Row>

      <Row title="BackLink">
        <BackLink href="#">Back to sources</BackLink>
      </Row>

      <Row title="StageRail">
        <div className="flex flex-col gap-4">
          {STAGE_VARIANTS.map((variant) => (
            <div key={variant.label} className="flex items-center gap-4">
              <code className="meta-line w-28 shrink-0">{variant.label}</code>
              <StageRail slug="sms-rebooking-4f2a" stageStates={variant.stageStates} />
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

      <Row title="PageContainer (marketing 1200px vs app 1360px)">
        <div className="flex w-full flex-col gap-4">
          <PageContainer
            variant="marketing"
            className="border"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="meta-line py-2">
              variant=&quot;marketing&quot; — max-w-marketing (1200px)
            </p>
          </PageContainer>
          <PageContainer
            variant="app"
            className="border"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <p className="meta-line py-2">variant=&quot;app&quot; — max-w-app (1360px)</p>
          </PageContainer>
        </div>
      </Row>

      <Row title="ProseColumn">
        <ProseColumn className="border" style={{ borderColor: 'var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-body)' }} className="py-2">
            Constrained to the 68ch reading measure — used by the Report and the Roadmap.
          </p>
        </ProseColumn>
      </Row>

      <Row title="FooterPanel">
        <div className="w-full">
          <FooterPanel />
        </div>
      </Row>
    </Section>
  );
}
