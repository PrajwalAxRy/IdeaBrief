import { CopyLinkButton } from '@/components/ui/copy-link-button';
import { MetaLine } from '@/components/ui/meta-line';
import type { StageStates } from '@/lib/run-stage';
import type { ReactNode } from 'react';
import { PageContainer } from './page-container';
import { RunFooterBar } from './run-footer-bar';
import { StageRail } from './stage-rail';
import { Wordmark } from './wordmark';

interface RunShellProps {
  slug: string;
  stageStates: StageStates;
  metaParts: string[];
  children: ReactNode;
}

/**
 * The persistent chrome on every `/r/[slug]/*` page: header bar, wordmark,
 * StageRail, MetaLine, CopyLinkButton, and the thin footer. Holds no state
 * beyond what's passed in — every run page is `<RunShell>{children}</RunShell>`.
 */
export function RunShell({ slug, stageStates, metaParts, children }: RunShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="run-shell-header">
        <PageContainer variant="app">
          <div className="flex items-center justify-between gap-8 py-4">
            <div className="flex items-center gap-8">
              <Wordmark />
              <StageRail slug={slug} stageStates={stageStates} />
            </div>
            <CopyLinkButton slug={slug} />
          </div>
          <MetaLine parts={metaParts} className="pb-3" />
        </PageContainer>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <RunFooterBar slug={slug} />
    </div>
  );
}
