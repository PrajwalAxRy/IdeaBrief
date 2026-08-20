import { RunShell } from '@/components/layout/run-shell';
import { EvidenceProvider } from '@/components/validate/evidence/evidence-context';
import { getEvidence, getRun, getRunSummary } from '@/lib/db/queries';
import { formatClockTime } from '@/lib/format';
import { getStageStates } from '@/lib/run-stage';
import type { Run } from '@/lib/schemas/run';
import type { ReactNode } from 'react';

/**
 * Meta Line content is stage-appropriate: a `define`-status run hasn't run
 * any research yet, so it shows a draft marker instead of research counts.
 * The one fixture in this prototype is always `complete`, so the `define`
 * branch is implemented for fidelity but effectively unexercised — see the
 * P3 build log.
 */
async function buildMetaParts(run: Run): Promise<string[]> {
  if (run.status === 'define') {
    return [`RUN ${run.slug}`, `STARTED ${formatClockTime(run.created_at)}`, 'DRAFT'];
  }
  const summary = await getRunSummary(run.slug);
  return [
    `RUN ${run.slug}`,
    `${summary.query_count} QUERIES`,
    `${summary.pages_fetched} PAGES`,
    `${summary.verified_count} VERIFIED`,
  ];
}

export default async function RunLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const run = await getRun(slug);
  const stageStates = getStageStates(run.status);
  const metaParts = await buildMetaParts(run);
  /* Mounted here so every page under /r/[slug]/* gets CitationChip and drawer
     behaviour just by being inside it — the provider renders the one
     EvidenceDrawer instance itself. */
  const evidence = await getEvidence(slug);

  return (
    <EvidenceProvider evidence={evidence}>
      <RunShell slug={slug} stageStates={stageStates} metaParts={metaParts}>
        {children}
      </RunShell>
    </EvidenceProvider>
  );
}
